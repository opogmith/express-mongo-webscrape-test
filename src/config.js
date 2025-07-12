require("dotenv").config();

const config = {
  PORT: Number(process.env.PORT) || 3000,
  DB_USER: process.env.DB_USER || "defaultUser",
  DB_PASS: process.env.DB_PASS || "defaultPass",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "testDB",
  BATCH_SIZE: Number(process.env.BATCH_SIZE) || 10,
  MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || "downloads",
  IMAGES_DIR: process.env.IMAGES_DIR || "images",
};

module.exports = config;
