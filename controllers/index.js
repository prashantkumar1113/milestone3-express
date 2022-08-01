const fs = require("fs"),
  path = require("path"),
  baseFileName = path.basename(__filename),
  controllers = {};

// Read files in dir
fs.readdirSync(__dirname)
  .filter((file) => {
    /**
     * Filter found files, we need to make sure our controller files
     * have the following constraints:
     * - are .js files
     * - aren't test js files
     * - AND, aren't this index file
     */
    return (
      file.endsWith(".js") &&
      !file.match(/^.*\.test\.js$/i) &&
      file !== baseFileName
    );
  })
  .forEach((controllerFile) => {
    // Get file path, read exports
    const filePath = path.join(__dirname, controllerFile);
    const router = require(filePath);

    /**
     * Using this index file, we can create any controllers in this directory
     * and import them like so, IE for ./controllers/exampleController.js:
     * const { exampleController as ExampleController, ... } = require('./controllers/');
     */
    controllers[controllerFile.slice(0, controllerFile.length - 3)] = router;
  });

module.exports = controllers;
