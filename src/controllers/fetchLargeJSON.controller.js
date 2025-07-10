const axios = require("axios");
const Photo = require("../models/photos.model");
const config = require("../config");

require("../middlewares/loggers.middleware");
const FetchLargeJSONLogger = require("winston").loggers.get(
  "FetchLargeJSONLogger"
);

module.exports = async (req, res) => {
  try {
    const photosJSON = await axios.get(
      "https://jsonplaceholder.typicode.com/photos?_limit=20"
    );

    const batches = [];
    let totalRetries = 0;
    let totalSaved = 0;
    let totalFailed = 0;

    // Group photos data into batches
    for (let i = 0; i < photosJSON.data.length; i += config.BATCH_SIZE) {
      const batch = photosJSON.data.slice(i, i + config.BATCH_SIZE);
      batches.push(batch);
    }

    for (const [index, batch] of batches.entries()) {
      let attempts = 0;
      let success = false;

      // Retry logic for each batch
      while (attempts < config.MAX_RETRIES && !success) {
        try {
          // Insert batch into the database
          await Photo.insertMany(batch);

          //Create a Log Transport
          FetchLargeJSONLogger.info(
            `Batch ${index + 1} inserted successfully with Batch Size of ${
              batch.length
            }.`
          );

          // Record the successful batch
          totalSaved += batch.length;
          success = true;
        } catch (error) {
          totalRetries++;
          attempts++;

          if (attempts == config.MAX_RETRIES) {
            //Create a Log Transport
            FetchLargeJSONLogger.error(
              `Attempt ${attempts} failed for batch: ${index + 1}, Error: ${
                error.message
              }`
            );

            // Record the failed batch
            totalFailed += batch.length;
          } else {
            //* Add delay before retry
            console.log(`Retries in : ${0.5 * attempts}s . . . .`);
            await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
          }
        }
      }
    }

    res._200(
      { totalSaved, totalFailed, totalRetries },
      "Photos JSON fetched and processed successfully."
    );
  } catch (error) {
    FetchLargeJSONLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
