require("dotenv").config();

const config = {
  PORT: process.env.PORT || 3000,
  DB_USER: process.env.DB_USER || "defaultUser",
  DB_PASS: process.env.DB_PASS || "defaultPass",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "testDB",
  BATCH_SIZE: process.env.BATCH_SIZE || 10,
  MAX_RETRIES: process.env.MAX_RETRIES || 3,
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || "downloads",
};

module.exports = config;
