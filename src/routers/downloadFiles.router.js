const router = require("express").Router();
const downloadFilesController = require("../controllers/downloadFiles.controller");

router.post("/", downloadFilesController);

module.exports = router;
