const router = require("express").Router();
const ScrapeProducts = require("../controllers/scrapeProducts.controller.js");
const ScrapeAndDownloadProducts = require("../controllers/scrapeAndDownloadProducts.controller");

router.get("/scrape-products", ScrapeProducts);
router.get("/scrape-and-download", ScrapeAndDownloadProducts);

module.exports = router;
