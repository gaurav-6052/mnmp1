var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var verificationModule = require('../../modules/verification');
var uuid = require('uuid');
var sendgrid = require('../../modules/sendgrid');
var config = require('config');

var route = new Route('post', '/verifications/email');
module.exports = route;

// allow authenticated user
route.allowUserTypes('User', 'ManagerUser');

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        userType: { type: 'string', enum: ['User', 'ManagerUser'] }
    },
    required: ['email', 'userType']
});


// check verification otp is already exist or not
route.use(function (req, res, next) {
    return verificationModule.checkOtpExist(verificationModule.types[0], req.body.email.toLowerCase(), verificationModule.purposes[0], req.user.constructor.modelName)
        .then(function (doc) {
            res.locals.verification = doc;
            return next();
        })
        .catch(next);
});

// update verification code if already exist
route.use(function (req, res, next) {

    var verification = res.locals.verification;
    if (!verification) {
        // no verification go to create verification
        return next();
    }

    else {
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

});

// create verification code if does't exist
route.use(function (req, res, next) {

    var verification = res.locals.verification;
    if (verification) {
        // already verification available go to sending email.
        res.json({ message: 'Email successfully sent' });
        return next();
    }
    else {
        var verObj = {
            type: verificationModule.types[0],
            value: req.body.email.toLowerCase(),
            purpose: verificationModule.purposes[0],
            code: uuid.v4(),
            userType: req.user.constructor.modelName,
            verified: false
        };
        return verificationModule.createVerification(verObj)
            .then(function (doc) {
                res.locals.verification = doc;
                res.json({ message: 'Email successfully sent' });
                return next();
            })
            .catch(next);
    }
});

// send verification email
route.use(function (req, res, next) {
    var substitution = {
        first_name: req.user.firstName,
        last_name: req.user.lastName,
        URL: config.get('bbWebsite') + 'verifyaccount?key=' + res.locals.verification.code
    }
    return sendgrid.sendEmail(config.get('sendgrid.templateId.emailVerify'), res.locals.verification.value, "Verify your Birdie Boggey Account", substitution)
        .then(function (sendgridRes) {
            console.log(sendgridRes);
            return sendgridRes;
        })
        .catch(function (err) {
            console.log(err);
        });
});