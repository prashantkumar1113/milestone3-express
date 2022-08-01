require("dotenv").config();
const DB_URI = process.env.DB_URI;
const { Pool } = require("pg");
const client = new Pool({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});


const
  fs = require('fs'),
  path = require('path'),
  baseFileName = path.basename(__filename),
  queries = {};

// Read files in dir
fs
  .readdirSync(__dirname)
  .filter( file => {
    /**
     * Filter found files, we need to make sure our db files
     * have the following constraints:
     * - are .js files
     * - aren't test js files
     * - AND, aren't this index file
     */
    return (file.endsWith('.js')) &&
      (!file.match(/^.*\.test\.js$/i)) &&
      (file !== baseFileName)
  })
  .forEach( queryFile => {
    // Get file path, read exports
    const filePath = path.join(__dirname, queryFile);
    const query = require(filePath);
    Object.assign(queries, query);
  });

// Export basic query and all loaded queries
module.exports = {
  query: (text, params) => client.query(text, params),
  ...queries
}