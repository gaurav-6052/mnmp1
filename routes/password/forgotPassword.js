var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var adminUserModule = require('../../modules/adminUser');
var managerUserModule = require('../../modules/ManagerUser');
var userModule = require('../../modules/user');
var verificationModule = require('../../modules/verification');
var uuid = require('uuid');
var sendgrid = require('../../modules/sendgrid');
var config = require('config');

var route = new Route('post', '/forgotpassword');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        userType: { type: 'string', enum: [userModule.userType, adminUserModule.userType, managerUserModule.userType] },
        email: { type: 'string', format: 'email' }
    },
    required: ['userType', 'email']
});


// middleware for finding user (i.e one of user,admin,manager) document by email
route.use(function (req, res, next) {

    switch (req.body.userType) {
        case adminUserModule.userType:
            //get admin user
            return adminUserModule.findOneAdmin({ email: req.body.email.toLowerCase() })
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                }).catch(next);
        case userModule.userType:
            // get user
            return userModule.findOneUser({ email: req.body.email.toLowerCase() })
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                }).catch(next);
        case managerUserModule.userType:
            // get manager user
            return managerUserModule.findOneManager({ email: req.body.email.toLowerCase() })
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                }).catch(next);
        default:
            // no such user model exists.
            throw new Error('Invalid user_type sent in request:' + req.body.userType);

    };
});

// middleware for check user is available for request email and email is verified
route.use(function (req, res, next) {

    if (!res.locals.user) {
        //invalid email address
        return next(errors.invalid_input().withDetails("Invalid email address or user_type"));
    }
    else {
        // email correct and verified
        return next();
    }

});

// check verification otp is already exist or not
route.use(function (req, res, next) {
    return verificationModule.checkOtpExist(verificationModule.types[0], req.body.email, verificationModule.purposes[1], req.body.userType)
        .then(function (doc) {
            res.locals.verification = doc;
            return next();
        })
        .catch(next);
});

// update verification code if already exist
route.use(function (req, res, next) {

    var verification = res.locals.verification;
    if (verification) {
        verification.code = uuid.v4();
        verification.createdAt = Date.now();
        verification.verified = false;
        verification.save()
            .then(function (doc) {
                res.locals.verification = doc;
                return next();
            })
            .catch(next);

    }
    else {
        return next();
    }
});

// create verification code if does't exist
route.use(function (req, res, next) {

    var verification = res.locals.verification;
    if (verification) {
        // already verification available go to sending email.
        res.json(verification.toJSON());
        return next();
    }
    else {
        var verObj = {
            type: verificationModule.types[0],
            value: req.body.email,
            purpose: verificationModule.purposes[1],
            code: uuid.v4(),
            userType: req.body.userType,
            verified: false
        };
        return verificationModule.createVerification(verObj)
            .then(function (doc) {
                res.locals.verification = doc;
                res.json(doc.toJSON());
                return next();
            })
            .catch(next);
    }
});

// send verification email
route.use(function (req, res, next) {
    var substitution = {
        first_name: res.locals.user.firstName,
        last_name: res.locals.user.lastName
       // URL: config.get('bbWebsite') + 'reset-password?key=' + res.locals.verification.code
    }
    return sendgrid.sendEmail(config.get('sendgrid.templateId.forgotPassword'), req.body.email, "Reset your Birdie Boggey Account", substitution)
        .then(function (sendgridRes) {
            console.log(sendgridRes);
            return sendgridRes;
        })
        .catch(function (err) {
            console.log(err);
        });
});