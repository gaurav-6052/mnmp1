var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var verificationModule = require('../../modules/verification');
var utility = require('../../lib/utility');
//var twilio = require('../../modules/twilio');
var config = require('config');

var route = new Route('post', '/verifications/phone');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        phone: { type: 'string', format: 'mobileNumber' },
        userType: { type: 'string', enum: ['User', 'ManagerUser'] }
    },
    required: ['phone', 'userType']
});

// check verification otp is already exist or not
route.use(function (req, res, next) {
    return verificationModule.checkOtpExist(verificationModule.types[1], req.body.phone, verificationModule.purposes[2], req.body.userType)
        .then(function (doc) {
            res.locals.verification = doc;
            return next();
        })
        .catch(next);
});

// update verification code if already exist and not verified
route.use(function (req, res, next) {

    var verification = res.locals.verification;
    if (!verification) {
        // no verification go to create
        return next();
    }

    else {
        verification.code = utility.randomNumeric(6);
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
        // already verification available go to sending message.
        res.json({ message: 'OTP on phone successfully sent' });
        return next();
    }
    else {
        var verObj = {
            type: verificationModule.types[1],
            value: req.body.phone,
            purpose: verificationModule.purposes[2],
            code: utility.randomNumeric(6),
            userType: req.body.userType,
            verified: false
        };
        return verificationModule.createVerification(verObj)
            .then(function (doc) {
                res.locals.verification = doc;
                res.json({ message: 'OTP on phone successfully sent' });
                return next();
            })
            .catch(next);
    }
});
/*
// send verification message
route.use(function (req, res, next) {

    var message = res.locals.verification.code + " is your verification code to verify your mobile.";
    return twilio.sendMessage('+91' + res.locals.verification.value, message)
        .then(function (twilioRes) {
            console.log(twilioRes);
            return twilioRes;
        })
        .catch(function (err) {
            console.log(err);
        });
}); */