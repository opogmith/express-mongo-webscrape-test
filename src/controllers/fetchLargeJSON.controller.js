const axios = require("axios");
const Photo = require("../models/photos.model");

require("../middlewares/loggers.middleware");
const FetchLargeJSONLogger = require("winston").loggers.get(
  "FetchLargeJSONLogger"
);

const validateURL = require("../utils/validateURL.util");
const saveBatchWithRetry = require("../utils/saveBatchWithRetry.util");

module.exports = async (req, res) => {
  try {
    const photosURL = req.body.photosURL;

    if (!photosURL) {
      FetchLargeJSONLogger.error(`No photosURL provided.`);
      return res._400("No photosURL provided.");
    }

    // Validate the URL
    if (!(await validateURL(photosURL, FetchLargeJSONLogger))) {
      return res._400("Invalid URL provided.");
    }

    // Fetch the JSON data from the provided URL
    FetchLargeJSONLogger.info(`Fetching JSON data from: ${photosURL}`);
    const photosJSONData = (await axios.get(photosURL)).data;

    //* Initiate saveBatchWithRetry to save all photos
    const { message, data } = await saveBatchWithRetry(
      photosJSONData,
      Photo,
      FetchLargeJSONLogger
    );

    res._200({ ...data }, `Photos JSON fetched and ${message}`);
  } catch (error) {
    FetchLargeJSONLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
