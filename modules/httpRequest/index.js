var request = require('superagent');
var config = require('config');
var crypto = require('crypto');
/**
 * HttpRequest module
 */
var HttpRequestModule = {};
module.exports = HttpRequestModule;

var fbUrl = 'https://graph.facebook.com/v2.5/me';
var linkedInUrl = 'https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name)';
// var payUUrl = 'https://test.payumoney.com/payment/payment/chkMerchantTxnStatus?';
// var payUUrl = 'https://test.payu.in/merchant/postservice.php?form=2';

/**
 * Validate facebook user with facebook accessToken
 * @param {String} accessToken - facebook user access token.
 * @return Facebook User Promise
 */
HttpRequestModule.getFacebookUser = function (accessToken) {

    return request.get(fbUrl)
        .set('Accept', 'application/json')
        .query({ access_token: accessToken, fields: 'first_name,last_name,email' })
        .exec()
        .then(function (res) {
            return res.body;
        });

};

/**
 * get linkedIn user with linkedIn accessToken
 * @param {String} accessToken - linkedIn user access token.
 * @return LinkedIn User Promise
 */
HttpRequestModule.getLinkedInUser = function (accessToken) {
    return request.get(linkedInUrl)
        .set('Accept', 'application/json')
        .query({ format: 'json', oauth2_access_token: accessToken })
        .exec()
        .then(function (res) {
            return res.body;
        });
};

// /**
//  * verify transaction with payu
//  * @param {String} transactionId - transaction id of payment.
//  * @return PayU response
//  */
// HttpRequestModule.verifyPaymentTransaction = function (txnId) {
//     var merchantKey = config.get('payUMerchantKey');

//     return request.post(payUUrl)
//         .set('Accept', 'application/json')
//         .query({ merchantKey: merchantKey, merchantTransactionIds: txnId })
//         .exec()
//         .then(function (res) {
//             return res.body;
//         });
// };


/**
 * verify transaction with payu
 * @param {String} transactionId - transaction id of payment.
 * @return PayU response
 */
HttpRequestModule.verifyPaymentTransaction = function (txnId) {

    var merchantKey = config.get('payUMerchantKey');
    var payUSalt = config.get('payUSalt');
    var url = config.get('payUUrl');
    var cmd = 'verify_payment';

    var hash = generateHash(merchantKey, cmd, txnId, payUSalt);
    
    var payload = {
        key: merchantKey,
        command: cmd,
        var1: txnId,
        hash: hash
    };
    return request.post(url)
        .type('form-data')
        .send(payload)
        .exec()
        .then(function (res) {
            return JSON.parse(res.text);
        });
};

function generateHash(key, command, txnId, salt) {
    
    var s = crypto.createHash('sha512');
    s.update([key, command, txnId, salt].join('|'));
    return s.digest('hex');
}