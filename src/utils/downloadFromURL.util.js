const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const validateURL = require("../utils/validateURL.util");

module.exports = async function downloadFromURL(
  url,
  fileName,
  downloadDir,
  logger
) {
  let downloadAttempts = 0;
  let downloadSuccess = false;

  try {
    const filePath = path.join(downloadDir, fileName);

    const isValidURL = await validateURL(url, logger);

    if (!isValidURL) {
      return null;
    }

    while (downloadAttempts < config.MAX_RETRIES && !downloadSuccess) {
      try {
        downloadAttempts++;

        const response = await axios.get(url, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on("finish", () => {
            logger.info(`File downloaded successfully: ${filePath}`);
            downloadSuccess = true;
            resolve(filePath);
          });

          writer.on("error", (error) => {
            logger.error(`Error writing file ${filePath}:`, error);
            reject(error);
          });
        });
      } catch (error) {
        if (downloadAttempts >= config.MAX_RETRIES) {
          logger.error(
            `Attempt ${downloadAttempts} failed for File: ${fileName}, Error: ${error.message}`
          );

          return null;
        } else {
          logger.error(
            `Attempt ${downloadAttempts} failed for File: ${fileName}, Error: ${error.message}`
          );

          //* Add delay before restarting
          logger.error(`Retries in ${0.5 * downloadAttempts}s . . . .`);
          await new Promise((resolve) =>
            setTimeout(resolve, 500 * downloadAttempts)
          );
        }
      }
    }
  } catch (error) {
    logger.error(`Error downloading from URL ${url}:`, error);
    throw error;
  }
};
