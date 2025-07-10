const { URL } = require("url");
const dns = require("dns").promises;

module.exports = async function validateURL(url, logger) {
  if (typeof url !== "string") {
    logger.error(`URL must be a string. Received type: ${typeof url}`);
    return false;
  }

  const trimmedURL = url.trim();

  if (trimmedURL === "") {
    logger.error("URL is an empty string after trimming.");
    return false;
  }

  let parsed;
  try {
    parsed = new URL(trimmedURL);
  } catch (error) {
    logger.error(`Invalid URL format: ${error.message}`);
    return false;
  }

  // DNS check: ensure hostname exists
  try {
    await dns.lookup(parsed.hostname);
  } catch (dnsError) {
    logger.error(
      `DNS lookup failed for host '${parsed.hostname}': ${dnsError.code}`
    );
    return false;
  }

  return true;
};
