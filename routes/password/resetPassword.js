var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var adminUserModule = require('../../modules/adminUser');
var managerUserModule = require('../../modules/ManagerUser');
var userModule = require('../../modules/user');
var verificationModule = require('../../modules/verification');

var route = new Route('put', '/resetpassword');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        key: { type: 'string', format: 'nonEmptyOrBlank' },
        newPassword: { type: 'string', format: 'nonEmptyOrBlank', minLength: 6, maxLength: 16 }
    },
    required: ['key', 'newPassword']
});

// check link is valid or not
route.use(function (req, res, next) {
    var verObj = {
        type: verificationModule.types[0],
        purpose: verificationModule.purposes[1],
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

// middleware for getting user for verification key
route.use(function (req, res, next) {
    var ver = res.locals.verification;

    switch (ver.userType) {
        case adminUserModule.userType:
            //get admin user
            return adminUserModule.findOneAdmin({ email: ver.value })
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                });
        case userModule.userType:
            return userModule.findOneUser({ email: ver.value })
                .then(function (user) {
                    res.locals.user = user;
                    return next();
                })
                .catch(next);
        case managerUserModule.userType:
            return managerUserModule.findOneManager({ email: ver.value })
                .then(function (user) {
                    res.locals.user = user;
                    return next();
                })
                .catch(next);
        default:
            // no such user model exists, check above mapping is correct or if wrong model name saved as user type in verification schema.
            throw new Error('Invalid user_type set in verification:' + ver.userType);

    };
});

//middleware for changing the password of the user
route.use(function (req, res, next) {
    var user = res.locals.user;
    if (user) {
        //update new password                  
        user.password = req.body.newPassword;
        //save new updated doc to db
        user.save()
            .then(function (doc) {
                return res.json({ "message": "password successfully updated" });
            })
            .catch(next);
    }
    else {
        return next(errors.internal_error());
    }

});
