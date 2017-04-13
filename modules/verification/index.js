var VerificationModel = require('./models/VerificationModel');

/**
 * Verification module
 */
var verificationModule = {};
module.exports = verificationModule;

/**
 * Verification pusposes.
 */
verificationModule.purposes = ["Email Verify", "Forgot Password", "Phone verify"];

/**
 * Verification types.
 */
verificationModule.types = ["Email", "Phone"];

/**
 * Create Verification document for verify action.
 * @param {Object} verObj - Verification object Ex: {type:"Email",value:"abc@abc.com",purpose:"Email Verify",code:"123",userType:"User"}.
 * @return Verification promise.
 */
verificationModule.createVerification = function (verObj) {
    var model = new VerificationModel(verObj);

    return model.save();
};

/**
 * Get and remove Verification document for verify action.
 * @param {Object} doc - Verification document Ex: {type:"Email",value:"abc@abc.com",purpose:"Email Verify",code:"123",userType:"User"}.
 * @return Verification promise.
 */
verificationModule.verifyOtp = function (doc) {

    return VerificationModel.findOneAndUpdate(doc, { verified: true }).exec();
};

/**
 * Check verification otp is exist or not for same kind of purpose for same user.
 * @param {String} type - Type of communication Ex:Email, Phone.
 * @param {String} value - value of email or phone.
 * @param {String} purpose - purpose of verification
 * @return Verification promise.
 */
verificationModule.checkOtpExist = function (type, value, purpose, userType) {
    var query = {
        type: type,
        value: value,
        purpose: purpose,
        userType: userType
    };

    return VerificationModel.findOne(query).exec();
};
