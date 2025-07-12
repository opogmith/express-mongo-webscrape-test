const router = require("express").Router();

const FetchLargeJSONRoute = require("./src/routers/fetchLargeJSON.router");
const DownloadFilesRoute = require("./src/routers/downloadFiles.router");
const ScrapeRoute = require("./src/routers/scrape.router");

router.use("/", ScrapeRoute);
router.use("/fetch-large-json", FetchLargeJSONRoute);
router.use("/download-files", DownloadFilesRoute);

module.exports = router;
