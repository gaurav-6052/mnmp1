var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var verificationModule = require('../../modules/verification');
var userModule = require('../../modules/user');
var managerUserModule = require('../../modules/ManagerUser');

var route = new Route('put', '/verifications/email');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        key: { type: 'string', format: 'nonEmptyOrBlank' },
        userType: { type: 'string', enum: ['User', 'ManagerUser'] }
    },
    required: ['key', 'userType']
});

// check verification otp is already exist or not
route.use(function (req, res, next) {
    var verObj = {
        type: verificationModule.types[0],
        purpose: verificationModule.purposes[0],
        userType: req.body.userType,
        code: req.body.key,
        verified: false
    };
    return verificationModule.verifyOtp(verObj)
        .then(function (ver) {
            if (ver) {
                res.locals.verification = ver;
                return next();
            }
            else {
                // Invalid otp
                throw errors.invalid_verification_code();
            }
        })
        .catch(next);
});

// get user for verification email
route.use(function (req, res, next) {
    var ver = res.locals.verification;
    switch (ver.userType) {
        case userModule.userType:
            return userModule.findOneUser({ email: ver.value.toLowerCase() })
                .then(function (user) {
                    res.locals.user = user;
                    return next();
                })
                .catch(next);
        case managerUserModule.userType:
            return managerUserModule.findOneManager({ email: ver.value.toLowerCase() })
                .then(function (user) {
                    res.locals.user = user;
                    return next();
                })
                .catch(next);
        default:
            // no such user model exists, check above mapping is correct or if wrong model name saved as user type in verification schema.
            throw new Error('Invalid user_type set in verification:' + ver.userType);
    }
});

// mark user's email verified true
route.use(function (req, res, next) {
    var user = res.locals.user;

    if (user) {
        user.emailVerified = true;
        return user.save()
            .then(function (updatedUser) {
                return res.json({ message: "Email successfully verified" });
            })
            .catch(next);
    }
    else {
        // Invalid otp
        return next(errors.invalid_verification_code());
    }

});