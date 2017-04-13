var uuid = require('uuid');
var crypto = require('crypto');
var AuthModel = require('./models/authModel');

// user modules
var adminUserModule = require('../adminUser');
var userModule = require('../user');
var managerUserModule = require('../ManagerUser');

/**
 * Auth module
 */
var authModule = {};
module.exports = authModule;

/**
 * Get auth for given auth token. Also updated the auth timestamp, which delays its expiry.
 * @param {String} token - auth token.
 * @return auth document promise.
 */
authModule.getAndUpdateForToken = function (token) {
    return AuthModel.findOneAndUpdate({ token: token }, { createdAt: Date.now() }).exec();
};

// valid user types: model names of different user types in app
var validUserTypes = [userModule.userType, managerUserModule.userType, adminUserModule.userType];

/**
 * Ensure given type is one of valid user types.
 * Throws error is any other type is provided.
 */
function ensureValidUserType(type) {
    if (validUserTypes.indexOf(type) < 0) {
        throw new Error('Invalid user model. Should be one of: ' + validUserTypes.join(','));
    }
}

/**
 * Get user document for user type and id denoted by given auth document.
 * @param {Document} auth - auth document.
 * @returns user document promise.
 */
authModule.getUserForAuth = function (auth) {
    // validate type
    ensureValidUserType(auth.userType);
    
    // get user document according to user model
    switch (auth.userType) {
        case adminUserModule.userType:
            // admin user
            return adminUserModule.getUserForId(auth.userId);
        case userModule.userType:
            // user
            return userModule.getUserForId(auth.userId);
        case managerUserModule.userType:
            // manager user
            return managerUserModule.getUserForId(auth.userId);
        default:
            // no such user model exists, check above mapping is correct or if wrong model name saved as user type in auth.
            throw new Error('Invalid user_type set in auth:' + auth.userType);
    };
};

/**
 * Generates a new auth for given user document.
 * @param {Document} user - user document.
 * @return auth document promise.
 */
authModule.createForUser = function (user) {
    // user type
    var userType = user.constructor.modelName;
    
    // validate type
    ensureValidUserType(userType);
    
    // universally unique token
    var tokenId = uuid.v4();
    
    // auth document
    var auth = new AuthModel({
        userId: user._id,
        userType: userType,
        token: crypto.createHmac('sha1', user._id.toString()).update(tokenId).digest('hex')
    });

    // save auth
    return auth.save();
}