const puppeteer = require("puppeteer");
const ScrapedProducts = require("../models/scrapedProducts.model");

require("../middlewares/loggers.middleware");
const ScrapeProductsLogger = require("winston").loggers.get(
  "ScrapeProductsLogger"
);
const saveBatchWithRetry = require("../utils/saveBatchWithRetry.util");

module.exports = async (req, res) => {
  try {
    const { url } = req.body;

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    let currentPage = url;
    let hasNext = true;
    const allProducts = [];

    while (hasNext) {
      await page.goto(currentPage, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("ol.row > li");

      const products = await page.$$eval("ol.row > li", (items) => {
        return items.map((item) => {
          const title =
            item.querySelector("h3 a")?.getAttribute("title")?.trim() || null;
          const price =
            item.querySelector(".price_color")?.innerText.trim() || null;
          const availability =
            item.querySelector(".instock.availability")?.innerText.trim() ||
            null;
          const imageRelative =
            item.querySelector(".image_container img")?.getAttribute("src") ||
            null;
          const imageURL = imageRelative
            ? new URL(
                imageRelative.replace("../", ""),
                "https://books.toscrape.com/"
              ).href
            : null;

          return { title, price, availability, imageURL };
        });
      });

      allProducts.push(...products);

      //* Check for "next" button
      const nextHref = await page
        .$eval(".pager li.next a", (a) => a.getAttribute("href"))
        .catch(() => null);

      if (nextHref) {
        currentPage = new URL(nextHref, currentPage).href;
      } else {
        hasNext = false;
      }
    }

    await browser.close();

    //* Initiate saveBatchWithRetry to save all products
    const { message, data } = await saveBatchWithRetry(
      allProducts,
      ScrapedProducts,
      ScrapeProductsLogger
    );

    res._200(
      { ...data },
      `Scraped ${allProducts.length} products from "${url}" successfully.\n${message}`
    );
  } catch (error) {
    ScrapeProductsLogger.error(error);
    res._500(error.message || "Check the logs for more details.");
  }
};
