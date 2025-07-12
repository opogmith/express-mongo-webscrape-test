const config = require("../config");
const DownloadedScrapedProduct = require("../models/downloadedScrapedProducts.model");

require("../middlewares/loggers.middleware");
const ScrapeProductsLogger = require("winston").loggers.get(
  "ScrapeProductsLogger"
);
const DownloadFilesLogger = require("winston").loggers.get(
  "DownloadFilesLogger"
);

const downloadDir = `${config.DOWNLOAD_DIR}/images/`;

const saveBatchWithRetry = require("../utils/saveBatchWithRetry.util");
const scrapeTarget = require("../utils/scrapeTarget.util");
const downloadFromURL = require("../utils/downloadFromURL.util");

module.exports = async (req, res) => {
  try {
    const { targetURL } = req.body;
    let totalSuccessulDownload = 0;
    let totalFailedDownload = 0;

    const scrapedProducts = await scrapeTarget(targetURL, ScrapeProductsLogger);
    if (scrapedProducts.length === 0) {
      return res._404("No products found to scrape.");
    }

    const cleanedProducts = await Promise.all(
      scrapedProducts.map(async (product) => {
        const { title, imageURL } = product;

        const image = await downloadFromURL(
          imageURL,
          imageURL.split("/").pop(),
          downloadDir,
          DownloadFilesLogger
        );

        if (image) {
          totalSuccessulDownload++;
        } else {
          totalFailedDownload++;
        }

        return {
          title,
          localPath: image,
          imageURL,
        };
      })
    );

    const { message } = await saveBatchWithRetry(
      cleanedProducts,
      DownloadedScrapedProduct,
      ScrapeProductsLogger
    );

    res._200(
      {
        totalAttempted: cleanedProducts.length,
        success: totalSuccessulDownload,
        failed: totalFailedDownload,
      },
      `Target "${targetURL}" scraped and ${message}`
    );
  } catch (error) {
    ScrapeProductsLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
