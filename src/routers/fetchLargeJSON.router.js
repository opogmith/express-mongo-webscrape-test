const router = require("express").Router();
const fetchLargeJSONController = require("../controllers/fetchLargeJSON.controller");

router.post("/", fetchLargeJSONController);

module.exports = router;
