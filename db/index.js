require("dotenv").config();
const DB_URI = process.env.DB_URI;
const { Pool } = require("pg");
const client = new Pool({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { query: (text, params) => client.query(text, params) };
