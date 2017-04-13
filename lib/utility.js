var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utility = {};
var mongoose = require('mongoose');
module.exports = utility;

/**
 * Synchronously and recursively walk the given directory and load modules of given type.
 * Provided handler is called for each loaded module.
 * Note: All modules in directory should be of given type.
 * 
 * @param {String} rootPath - directory to walk.
 * @param {function} type - module class for "instance of" matching.
 * @param {function(*)} handler - module load handler.
 */
utility.walkModulesSync = function (rootPath, type, handler) {
    
    // read directory
    var files = fs.readdirSync(rootPath);

    // interate files
    for (var i = 0; i < files.length; i++) {

        var filePath = path.join(rootPath, files[i]);
        
        // stat file
        var stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // recurse into sub directory
            utility.walkModulesSync(filePath, type, handler);

        } else if (!_.startsWith(files[i], '.')) {
            // load module
            var module = require(filePath);

            if (module instanceof type) {
                // module of correct type
                handler(module);
            } else {
                // module of wrong type
                throw new Error('Invalid module type found:' + (typeof module) + '. Required: ' + (typeof type));
            }
        }
    }
};


/**
 * Numeric characters string: 0-9.
 * @type {string}
 */
utility.NUMERIC = '0123456789';


/**
 * Generate a string of given length of random numeric digits.
 * @param {Number} length - desired output length. Must be > 0;
 * @return {string} generated output string.
 */
utility.randomNumeric = function (length) {
    if (!_.isNumber(length) || length < 1) {
        throw new Error("length should be a non zero number.");
    }

    var random = [];
    for (var i = 0; i < length; i++) {
        random.push(utility.NUMERIC[_.random(0, utility.NUMERIC.length - 1)]);
    }

    return random.join("");
};

/**
 * convert array of string ids to array of object ids
 * @params {Array} - array of string ids
 * @return {Array} array of object ids
 */
utility.convertStringIdsToObjectIds = function(ids){
    return _.map(ids, function(id){
        return new mongoose.Types.ObjectId(id);
    });
};