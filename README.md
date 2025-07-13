# 📦 Web Scraper & Downloader API

A Node.js API for ingesting large JSON datasets, downloading files, and scraping product data from websites using Axios and Puppeteer. Built with error handling, retry logic, and modular structure.

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/opogmith/express-mongo-webscrape-test.git

cd express-mongo-webscrape-test

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

.env.example is provided

### 4. Start the Server

use node v22
npm start

### 5. Start Postman and Import included Collection

load postman collection located in project directory "postmanCollection/MigrationDev.postman_collection.json"

---

## 🛠 Features

### 1. Fetch Large JSON & Save to MongoDB

- **Endpoint**: `POST /api/fetch-large-json`
- **Postman Request Provided**: Part 1
- **Functionality**:
  - Fetch JSON data from `https://jsonplaceholder.typicode.com/photos`
  - Save to MongoDB in batches of 10
  - Up to 10 concurrent saves
  - Retry logic (max 3 attempts per batch)
  - Returns a summary: total saved, retries, and failures

### 2. Bulk File Download (Image or PDF)

- **Endpoint**: `POST /api/download-files`
- **Postman Request Provided**: Part 2
- **Input**: JSON array of file URLs
- **Functionality**:
  - Download files to a local `/downloads` folder
  - Save metadata (filename, URL, status) to MongoDB
  - Retry logic (up to 3 tries per file)
  - Continues even if some downloads fail
  - Returns summary of successes, failures, and retries

### 3. Scrape Product Info from Books to Scrape

- **Endpoint**: `GET /api/scrape-products`
- **Postman Request Provided**: Part 3
- **Target**: `https://books.toscrape.com`
- **Functionality**:
  - Use Puppeteer to extract book title, price, availability, and image URL
  - Save results to MongoDB in batches of 10
  - Returns summary of scraping operation

### 4. Scrape and Download Book Images

- **Endpoint**: `GET /api/scrape-and-download`
- **Postman Request Provided**: Part 4
- **Target**: `https://books.toscrape.com`
- **Functionality**:
  - Scrape image URLs using Puppeteer
  - Download images to local `/images` folder
  - Save metadata (title, URL, local path) to MongoDB
  - Retry on download failure (up to 3 attempts)
  - Returns total attempted, successes, and failures

---
