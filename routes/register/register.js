var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var userModule = require('../../modules/user');
var verificationModule = require('../../modules/verification');
var sendgrid = require('../../modules/sendgrid');
var masterDataModule = require('../../modules/masterData');
var config = require('config');
var uuid = require('uuid');

var _ = require('lodash');

var route = new Route('post', '/user/register');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        functionId: { type: 'string', format: 'objectId' },
        firstName: { type: 'string', format: 'nonEmptyOrBlank' },
        lastName: { type: 'string', format: 'nonEmptyOrBlank' },
        //profileImageFileId: { type: 'string', format: 'objectId' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'nonEmptyOrBlank', minLength: 6, maxLength: 16 },
        phone: { type: 'string', format: 'mobileNumber' }
    },
    required: ['firstName', 'email', 'password']

});

//middleware for checking valid user profile image-id
route.use(function (req, res, next) {

    if (!_.has(req.body, 'profileImageFileId')) {
        // no image is provided for profile.go to next
        return next();
    }

    return filesModule.getFileForId(req.body.profileImageFileId)
        .then(function (doc) {
            if (doc) {
                return next();
            }
            else {
                // invalid image id
                throw errors.invalid_input().withDetails('Invalid profile image file id');
            }
        })
        .catch(next);

});

// check email is exist or not
route.use(function (req, res, next) {
    return userModule.findOneUser({ email: req.body.email.toLowerCase() })
        .then(function (user) {
            if (user) {
                // user already exist for same email address.
                throw errors.email_already_registered();
            }
            else {
                // email not exist go next.
                return next();
            }
        })
        .catch(next);
});

// check phone is exist in user schema
route.use(function (req, res, next) {
    if (!_.has(req.body, 'phone')) {
        // don't need to check phone. next register
        res.mnmp.users.phoneVerRqrd = false;
        return next();
    }
    return userModule.findOneUser({ phone: req.body.phone })
        .then(function (user) {
            if (user) {
                // user already exist for same phone number.
                throw errors.phone_already_registered();
            }
            else {
                // phone not exist do next step.
                return next();
            }
        })
        .catch(next);
});

// register user
route.use(function (req, res, next) {
    console.log("resesterd user");

    return userModule.registerUser(req.body)
        .then(function (createduser) {
            res.mnmp.users = createduser;
            return next();
        })
        .catch(next);
});

// create verification code.
route.use(function (req, res, next) {

    var user = res.mnmp.users;

    var verObj = {
        type: verificationModule.types[0],
        value: user.email,
        purpose: verificationModule.purposes[0],
        code: uuid.v4(),
        userType: user.constructor.modelName,
        verified: false
    };

    return verificationModule.createVerification(verObj)
        .then(function (doc) {
            res.mnmp.users.verification = doc;
            res.json(user.toJSON());
            return next();
        })
        .catch(next);
});
