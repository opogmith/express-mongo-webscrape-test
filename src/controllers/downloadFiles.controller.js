const axios = require("axios");
const config = require("../config");
const fs = require("fs");
const path = require("path");

require("../middlewares/loggers.middleware");
const DownloadFilesLogger = require("winston").loggers.get(
  "DownloadFilesLogger"
);

const Downloads = require("../models/downloads.model");
const validateFile = require("../utils/validateFile.util");

module.exports = async (req, res) => {
  try {
    let totalRetries = 0;
    let totalSuccess = 0;
    const failedItems = [];

    const JSON_ARRAY = req.body.jsonArray || [];
    if (!Array.isArray(JSON_ARRAY) || JSON_ARRAY.length === 0) {
      return res._400("Invalid or empty JSON array provided.");
    }

    // Makes sure that the Download Logic finnishes before sending the response
    await Promise.all(
      JSON_ARRAY.map(async (item) => {
        const { url, fileName } = item;
        const filePath = `${config.DOWNLOAD_DIR}/${fileName}`;

        // Validate the file object before proceeding, short-circuit if invalid
        // If validation fails, save the item to database as failed and push to failedItems
        if (!(await validateFile({ url, fileName }))) {
          failureReason = "Invalid file format or URL";
          failedItems.push({ url, fileName, failureReason });

          await Downloads.create({
            url,
            fileName,
            status: "failed",
            failureReason,
          });

          return;
        }

        // Ensure the download directory exists
        const downloadDir = path.resolve(config.DOWNLOAD_DIR);
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }

        let attempts = 0;
        let success = false;

        // Create a new download entry in the database
        const downloadEntry = await Downloads.create({
          url,
          fileName,
          status: "pending",
        });

        while (attempts < config.MAX_RETRIES && !success) {
          try {
            // Download the file
            const response = await axios.get(url, {
              responseType: "stream",
            });

            // Save the file to the /downloads directory
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            // Wait for the file to finish writing
            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            DownloadFilesLogger.info(
              `File downloaded successfully: ${fileName}`
            );

            // Update the download entry status to completed
            totalSuccess++;
            await Downloads.updateOne(
              { _id: downloadEntry._id },
              { status: "completed", filePath }
            );

            // Exit the retry loop on success
            success = true;
          } catch (error) {
            totalRetries++;
            attempts++;

            if (attempts === config.MAX_RETRIES) {
              // If all attempts fail, log the error and add to failed URLs
              DownloadFilesLogger.error(
                `Attempt ${attempts} failed for File: ${fileName}, Error: ${error.message}`
              );
              failedItems.push(item);

              // Update the download entry status to failed
              await Downloads.updateOne(
                { _id: downloadEntry._id },
                { status: "failed", failureReason: "Max retries reached" }
              );

              return;
            } else {
              DownloadFilesLogger.error(
                `Attempt ${attempts} failed for File: ${fileName}, Error: ${error.message}`
              );

              //*Add delay before retrying
              console.log(`Retries in : ${0.5 * attempts}s . . . .`);
              await new Promise((resolve) =>
                setTimeout(resolve, 500 * attempts)
              );
            }
          }
        }
      })
    );

    res._200(
      {
        totalRetries,
        totalSuccess,
        failedItems,
      },
      "Files downloaded or processed successfully."
    );
  } catch (error) {
    DownloadFilesLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
