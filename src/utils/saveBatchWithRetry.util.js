const config = require("../config");

module.exports = async function saveBatchWithRetry(Items, Model, Logger) {
  const batches = [];
  let totalFailed = 0;
  let totalSaved = 0;
  let totalRetries = 0;

  try {
    for (let i = 0; i < Items.length; i += config.BATCH_SIZE) {
      const batch = Items.slice(i, i + config.BATCH_SIZE);
      batches.push(batch);
    }

    for (const [index, batch] of batches.entries()) {
      let attempts = 0;
      let success = false;

      // Retry logic for each batch
      while (attempts < config.MAX_RETRIES && !success) {
        try {
          // Insert batch into the database
          await Model.insertMany(batch);

          //Create a Log Transport
          Logger.info(
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

          if (attempts === config.MAX_RETRIES) {
            //Create a Log Transport
            Logger.error(
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

    return {
      message: "All batches processed successfully.",
      data: { totalSaved, totalFailed, totalRetries },
    };
  } catch (error) {
    throw new Error(
      `Error processing batches for ${Model.modelName}: ${error.message}`
    );
  }
};
