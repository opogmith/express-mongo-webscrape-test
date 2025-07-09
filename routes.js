const router = require("express").Router();

const FetchLargeJSONRoute = require("./src/routers/fetchLargeJSON.router");

router.use("/fetch-large-json", FetchLargeJSONRoute);

module.exports = router;
