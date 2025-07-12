const ScrapedProducts = require("../models/scrapedProducts.model");

require("../middlewares/loggers.middleware");
const ScrapeProductsLogger = require("winston").loggers.get(
  "ScrapeProductsLogger"
);
const saveBatchWithRetry = require("../utils/saveBatchWithRetry.util");
const scrapeTarget = require("../utils/scrapeTarget.util");

module.exports = async (req, res) => {
  try {
    const { targetURL } = req.body;

    const allProducts = await scrapeTarget(targetURL, ScrapeProductsLogger);
    if (allProducts.length === 0) {
      return res._404("No products found to scrape.");
    }

    //* Initiate saveBatchWithRetry to save all products
    const { message, data } = await saveBatchWithRetry(
      allProducts,
      ScrapedProducts,
      ScrapeProductsLogger
    );

    res._200(
      { ...data },
      `Scraped ${allProducts.length} products from "${targetURL}" successfully.\n${message}`
    );
  } catch (error) {
    ScrapeProductsLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
