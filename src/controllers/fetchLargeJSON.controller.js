const axios = require("axios");
const Photo = require("../models/photos.model");
const config = require("../config");

module.exports = async (req, res) => {
  try {
    const photosJSON = await axios.get(
      "https://jsonplaceholder.typicode.com/photos?_limit=20"
    );

    const batches = [];

    // Group photos data into batches
    for (let i = 0; i < photosJSON.data.length; i += config.BATCH_SIZE) {
      const batch = photosJSON.data.slice(i, i + config.BATCH_SIZE);
      batches.push(batch);
    }

    const successfulBatches = [];
    const failedBatches = [];

    for (const [index, batch] of batches.entries()) {
      let attempts = 0;
      let success = false;

      // Retry logic for each batch
      while (attempts < config.MAX_RETRIES && !success) {
        try {
          // Insert batch into the database
          await Photo.insertMany(batch);

          successfulBatches.push({
            batch: index + 1, // Store the batch number
            data: batch,
          });

          console.log(`Batch ${index + 1} inserted successfully.`);

          success = true;
        } catch (error) {
          attempts++;

          console.error(
            `Attempt ${attempts} failed for batch: ${index + 1}, Error:`,
            error.message
          );

          if (attempts === config.MAX_RETRIES) {
            failedBatches.push({
              batch: index + 1, // Store the batch number
              data: batch,
              error: error.message,
            });
          }
        }
      }
    }

    res._200(
      { successfulBatches, failedBatches },
      "Photos JSON fetched and processed successfully."
    );
  } catch (error) {
    console.error("Error fetching photos JSON:", error);
    res._500(error.message || "Failed to fetch photos JSON");
  }
};
