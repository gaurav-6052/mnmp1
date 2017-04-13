var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = require('superagent');
/**
 * Sets up app wide, global configuration of node modules.
 * Must be executed before everything else.
 */
module.exports = function () {
    configureBluebird();
    configureMongoose();
    configureSuperAgent();
}

/**
 * Configure bluebird module.
 */
function configureBluebird() {
    // configure bluebird
    Promise.config({
        // Enables all warnings except forgotten return statements.
        warnings: false,
        longStackTraces: false,
        // Enable cancellation.
        cancellation: true
    });
}



/**
 * Configure mongoose module.
 */
function configureMongoose() {
    // set mongoose to use blue bird
    mongoose.Promise = Promise;
}



/**
 * Configure superagent module.
 */
function configureSuperAgent() {
    // add exec() method to super agent request that returns a cancellable promise
    request.Request.prototype.exec = function () {
        
        // request reference
        var req = this;
        
        // return a promise
        return new Promise(function (resolve, reject, onCancel) {
            
            // abort request on promise cancel
            onCancel(function () {
                req.abort();
            });

            // resolve/reject promise as per callback
            req.end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });

        });
    };
}