const puppeteer = require("puppeteer");

module.exports = async function scrapeTarget(targetURL, Logger) {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      // defaultViewport: null,
    });
    const page = await browser.newPage();

    let currentPage = targetURL;
    let hasNext = true;
    const scrapedProducts = [];

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

      scrapedProducts.push(...products);

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

    return scrapedProducts;
  } catch (error) {
    Logger.error("Error scraping target:", error);
    throw error;
  }
};
