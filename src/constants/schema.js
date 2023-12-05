const SESSION_SECRET = process.env.SESSION_SECRET;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const CORS_URLS = process.env.CORS_URLS;

module.exports = {
  SESSION_SECRET,
  CORS_URLS,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
};
