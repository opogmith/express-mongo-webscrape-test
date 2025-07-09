const router = require("express").Router();
const fetchLargeJSONController = require("../controllers/fetchLargeJSON.controller");

router.get("/", fetchLargeJSONController);

module.exports = router;
