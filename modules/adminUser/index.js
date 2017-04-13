var _ = require('lodash');
var bcrypt = require('bcryptjs');
var AdminUserModel = require('./models/adminUserModel');

/**
 * Admin module
 */
var adminModule = {};
module.exports = adminModule;

/**
 * Admin user type.
 */
adminModule.userType = AdminUserModel.modelName;

/**
 * Gets or creates (if not exists) a default admin user.
 * @return Admin User promise.
 */
adminModule.createOrGetDefault = function () {
    // find one admin user
    return AdminUserModel.findOne({})
        .exec()
        .then(function (admin) {
            if (admin) {
                // user exists
                return admin;
            } else {
                // user not exists, create one
                return new AdminUserModel({ name: 'admin', email: 'admin@admin.com', password: 'bbadmin' }).save();
            }
        });

};


/**
 * Get Admin for given mongoose query.
 * @param {Object} query - mongoose query.
 * @return User promise.
 */
adminModule.findOneAdmin = function (query) {
    return AdminUserModel.findOne(query).exec();
};

/**
 * Get Admin User for given user id.
 * @param {ObjectID} userId - admin user id.
 * @return Admin User promise.
 */
adminModule.getUserForId = function (userId) {
    // find by user id
    return AdminUserModel.findById(userId).exec()
}

/**
 * Get Admin user for given email and password.
 * @param {String} email - admin email.
 * @param {String} password - admin password.
 * @return Admin User promise.
 */
adminModule.getUserForLogin = function (email, password) {
    // find one by email
    return AdminUserModel.findOne({ email: email })
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