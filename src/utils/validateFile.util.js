const DownloadFilesLogger = require("winston").loggers.get(
  "DownloadFilesLogger"
);

const validateURL = require("../utils/validateURL.util");

module.exports = async function validateFile(file) {
  const validFileFormats = ["pdf", "jpeg", "jpg", "png", "gif"];

  // Check if the file object is valid
  if (!file || !file.url || !file.fileName) {
    DownloadFilesLogger.error(
      `Invalid file in JSON array: ${JSON.stringify(file)}`
    );
    return false;
  }

  // Check if the file object has the required properties
  if (
    !(await validateURL(file.url, DownloadFilesLogger)) ||
    typeof file.fileName !== "string"
  ) {
    DownloadFilesLogger.error(
      `Invalid types in JSON array: ${JSON.stringify(file)}`
    );
    return false;
  }

  // Check if the file extension is valid
  const fileExtension = file.fileName.split(".").pop().toLowerCase();
  if (!validFileFormats.includes(fileExtension)) {
    DownloadFilesLogger.error(
      `Invalid file format in JSON array: ${JSON.stringify(file)}`
    );
    return false;
  }

  return true;
};
