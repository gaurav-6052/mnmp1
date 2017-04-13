var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var verificationModule = require('../../modules/verification');

var route = new Route('put', '/verifications/phone');
module.exports = route;

// allow authenticated users
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        phoneVerifyCode: { type: 'string', format: 'nonEmptyOrBlank' },
        phone: { type: 'string', format: 'mobileNumber' },
        userType: { type: 'string', enum: ['User', 'ManagerUser'] }
    },
    required: ['phoneVerifyCode', 'phone', 'userType']
});

// check verification otp is already exist or not
route.use(function (req, res, next) {
    var verObj = {
        type: verificationModule.types[1],
        purpose: verificationModule.purposes[2],
        code: req.body.phoneVerifyCode,
        userType: req.body.userType,
        value: req.body.phone,
        verified: false
    };
    return verificationModule.verifyOtp(verObj)
        .then(function (ver) {
            if (ver) {
                return res.json({ message: "Phone successfully verified" });
            }
            else {
                // Invalid otp
                throw errors.invalid_verification_code();
            }
        })
        .catch(next);
});