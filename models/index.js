const
    fs = require('fs'),
    path = require('path'),
    baseFileName = path.basename(__filename),
    models = {};

// Read files in dir
fs
    .readdirSync(__dirname)
    .filter( file => {
        /**
         * Filter found files, we need to make sure our model files
         * have the following constraints:
         * - are .js files
         * - aren't test js files
         * - AND, aren't this index file
         */
        return (file.endsWith('.js')) &&
            (!file.match(/^.*\.test\.js$/i)) &&
            (file !== baseFileName)
    })
    .forEach( modelFile => {
        // Get file path, read exports
        const filePath = path.join(__dirname, modelFile);
        const model = require(filePath);
        
        /**
         * Using this index file, we can create any models in this directory
         * and import them like so, IE for ./models/exampleModel.js:
         * const { exampleModel as ExampleModel, ... } = require('./models/');
         */
        models[ modelFile.slice(0, modelFile.length - 3) ] = model;
    });

module.exports = models;