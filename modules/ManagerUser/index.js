var bcrypt = require('bcryptjs');
var ManagerUserModel = require('./models/ManagerUserModel');

/**
 * Manager module
 */
var managerModule = {};
module.exports = managerModule;

/**
 * Manager User type.
 */
managerModule.userType = ManagerUserModel.modelName;

/**
 * Get Manager User for given user id.
 * @param {ObjectID} userId - manager user id.
 * @return Manager User promise.
 */
managerModule.getUserForId = function (userId) {
    // find by id
    return ManagerUserModel.findById(userId).exec()
}

/**
 * Get Manager User for given email and password.
 * @param {String} email - manager email.
 * @param {String} password - manager password.
 * @return Manager User promise.
 */
managerModule.getUserForLogin = function (email, password) {
    // find one by email
    return ManagerUserModel.findOne({ email: email })
        .select('+password')
        .exec()
        .then(function (doc) {
            if (doc) {
                // compare password
                return bcrypt.compareSync(password, doc.password) ? doc : null;
            } else {
                // no such document
                return null;
            }
        });
}

/**
 * Get Manager for given mongoose query.
 * @param {Object} query - mongoose query.
 * @return User promise.
 */
managerModule.findOneManager = function (query) {
    return managerModule.findOne(query).exec();
};