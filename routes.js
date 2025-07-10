const router = require("express").Router();

const FetchLargeJSONRoute = require("./src/routers/fetchLargeJSON.router");
const DownloadFilesRoute = require("./src/routers/downloadFiles.router");

router.use("/fetch-large-json", FetchLargeJSONRoute);
router.use("/download-files", DownloadFilesRoute);
module.exports = router;
