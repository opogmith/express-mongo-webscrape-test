const router = require("express").Router();
const ScrapeProducts = require("../controllers/scrapeProducts.controller.js");

router.get("/scrape-products", ScrapeProducts);

module.exports = router;
