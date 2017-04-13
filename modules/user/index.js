var schedule = require('node-schedule');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var UserModel = require('./models/UserModel');
var Promise = require('bluebird');
var utility = require('../../lib/utility');


// full selection conditions for paths
var fullPopulate = [
    { path: 'interestedIn', select: '_id value' },
    { path: 'industry', select: '_id value' },
    { path: 'sizeOfCompany', select: '_id value' },
    { path: 'functionObj', select: '_id value' },
    { path: 'seniorityLevel', select: '_id value' },
    { path: 'golfCourses', select: '_id name address imageFileId city' }
];

/**
 * User module
 */
var userModule = {};
module.exports = userModule;

/**
 * User type.
 */
userModule.userType = UserModel.modelName;

/**
 * Get User for given user id.
 * @param {ObjectID} userId - user id.
 * @return User promise.
 */
userModule.getUserForId = function (userId) {
    // find by id
    return UserModel.findById(userId).exec();
};

/**
 * Get User Profile for given user id.
 * @param {ObjectID} userId - user id.
 * @return User promise.
 */
userModule.getUserProfileForId = function (userId) {
    // find by id
    return UserModel.findById(userId).populate(fullPopulate).exec();
};

/**
 * Get User for given email and password.
 * @param {String} email - user email.
 * @param {String} password - user password.
 * @return User promise.
 */
userModule.getUserForLogin = function (email, password) {
    // find one by email
    
    return UserModel.findOne({ email: email })
        .populate(fullPopulate)
        .select('+password')
        .exec()
        .then(function (doc) {
            console.log('if');
            if (doc && _.isString(doc.password)) {
                // compare password
                console.log('iffff');
               return bcrypt.compareSync(password, doc.password) ? doc : null;
            } else {
                // no such document
                return null;
            }
        });
};

/**
 * Get User for given mongoose query.
 * @param {Object} query - mongoose query.
 * @return User promise.
 */
userModule.findOneUser = function (query) {
    return UserModel.findOne(query).exec();
};

/**
 * Register User from given data.
 * @param {Object} data - user data.
 * @return User promise.
 */
userModule.registerUser = function (data) {
    console.log("hello user");
    return new UserModel(data).save();
};



/**
 * Update user for given user id with given value(only given json keys will be updated).
 * @param {ObjectID} id - user id.
 * @param {Object} value - new user value.
 * @return user promise.
 */
userModule.updateUser = function (id, value) {
    if (_.has(value, 'firstName') || _.has(value, 'lastName')) {
        return UserModel.findById(id)
            .exec()
            .then(function (doc) {
                _.assign(doc, value);
                value.fullName = _.isString(doc.lastName) ? (doc.firstName + ' ' + doc.lastName) : doc.firstName;
                return UserModel.findOneAndUpdate({ _id: id }, value, { new: true }).populate(fullPopulate).exec();
            });
    }
    else {
        return UserModel.findOneAndUpdate({ _id: id }, value, { new: true }).populate(fullPopulate).exec();
    }


};


