const { Pool } = require("pg");
const { loadEnvFile } = require("node:process");
loadEnvFile();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
});
