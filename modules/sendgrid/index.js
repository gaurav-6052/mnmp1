var config = require('config');
var sendgrid = require('sendgrid')(config.get('sendgrid.apiKey'));
var Promise = require('bluebird');

var _ = require('lodash');

/**
 * send grid module
 */
var sendgridModule = {};
module.exports = sendgridModule;

sendgridModule.fromEmail = "birdiebogey@daffodilsw.com";
sendgridModule.fromName = "Birdie Bogey";

/**
 * Send email with template created on sendgrid
 * @param {String} templateId - id of sendgrid template.
 * @param {String} toEmail - email address of receiver.
 * @param {String} subject - subject of email.
 * @param {Object} substitutions - substitutions object to be substitute in template Ex:{first_name:"name",last_name:"name"}.
 * @return sendgrid promise.
 */
sendgridModule.sendEmail = function (templateId, toEmail, subject, substitutions) {

    if (!_.isPlainObject(substitutions)) {
        throw new Error('substitution should be object');
    };

    var email = new sendgrid.Email({
        to: toEmail,
        from: sendgridModule.fromEmail,
        subject: subject,
        html: '<span></span>',
        fromname: sendgridModule.fromName
    });
    
    // add filter settings one at a time
    email.addFilter('templates', 'enable', 1);
    email.addFilter('templates', 'template_id', templateId);

    // add substitution variable
    _.forOwn(substitutions, function (value, key) {
        email.addSubstitution('-' + _.toString(key) + '-', value);
    });

    return new Promise(function (resolve, reject) {
        // promisified sendgrid send
        var sendAsync = Promise.promisify(sendgrid.send, { context: sendgrid });

        var sendPromise = sendAsync(email)
            .then(function (json) {
                return json;
            });
            
        // resolve with send email promise
        return resolve(sendPromise);
    });
};

