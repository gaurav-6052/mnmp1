var _ = require('lodash');
var util = require('util');
var errStackParser = require('error-stack-parser');

var errors = {};
module.exports = errors;

/**
 * Adds useful methods to errors. Use this to create new type of errors.
 * @param {Number} httpCode - HTTP response code.
 * @param {Number} errorCode - error code.
 * @param {String} description - error description.
 * @param {*} stackFrames - error stack frames.
 */
function ApiError(httpCode, errorCode, description, stackFrames) {
    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.description = description;
    this.details = null;
    this.stackFrames = stackFrames;
}
util.inherits(ApiError, Error);

// expose constructor
errors.ApiError = ApiError;

/**
 * sets arbitrary details object to error.
 * @param {Object} detail - detail object.
 * @return error.
 */
ApiError.prototype.withDetails = function (details) {
    this.details = details;
    return this;
};


/**
 * sends error as JSON via express response. Sets appropriate HTTP status as well.
 * @param {Object} response - express response.
 */
ApiError.prototype.sendTo = function (response) {
    response.status(this.httpCode);
    response.json({ errorCode: this.errorCode, description: this.description, details: this.details });
};

/**
 * Genreates a function to create ApiError when called.
 * @param {Number} httpCode - HTTP response code.
 * @param {Number} errorCode - error code.
 * @param {String} description - error description.
 */
function create(httpCode, errorCode, description) {
    return function () {
        // create error stack frames (drop the first one for this function call)
        var stackFrames = _.drop(errStackParser.parse(new Error(errorCode)), 1);

        // filter out node's internal and node_module file links
        stackFrames = stackFrames.filter(function (sf) {
            return _.startsWith(sf.fileName, '/') && sf.fileName.indexOf('node_modules') < 0;
        });

        // return a new error instance, with error stack trace
        return new ApiError(httpCode, errorCode, description, stackFrames);
    };
}

//--------------------- GENERIC ERRORS -------------------------/

errors.internal_error = create(500, 'INTERNAL_ERROR',
    'Something went wrong on server. Please contact server admin.');

errors.invalid_key = create(401, 'INVALID_KEY',
    'Valid api key is required. Please provide a valid api key along with request.');

errors.invalid_auth = create(401, 'INVALID_AUTH',
    'Valid auth token is required. Please provide a valid auth token along with request.');

errors.invalid_permission = create(401, 'INVALID_PERMISSION',
    'Permission denied. Current user does not has required permissions for this resource.');

errors.invalid_access = create(401, 'INVALID_ACCESS',
    'Access denied. Current user does not has access for this resource.');

errors.invalid_input = create(400, 'INVALID_INPUT',
    'The request input is not as expected by API. Please provide valid input.');

errors.input_too_large = create(400, 'INPUT_TOO_LARGE',
    'The request input size is larger than allowed.');

errors.invalid_input_format = create(400, 'INVALID_INPUT_FORMAT',
    'The request input format is not allowed.');

errors.invalid_operation = create(403, 'INVALID_OPERATION',
    'Requested operation is not allowed due to applied rules. Please refer to error details.');

errors.not_found = create(404, 'NOT_FOUND',
    'The resource referenced by request does not exists.');

//--------------------- BUSINESS LOGIC ERRORS ---------------------------/

errors.invalid_login = create(400, 'INVALID_LOGIN',
    'Login credentials do not match any registered user.');

errors.account_disabled = create(403, 'ACCOUNT_DISABLED',
    'User account has been disabled.');

errors.already_registered = create(400, 'ALREADY_REGISTERED',
    'A user with simillar idenitifiers is already registered.');

errors.email_already_registered = create(400, 'EMAIL_ALREADY_REGISTERED',
    'A user with simillar email is already registered.');

errors.phone_already_registered = create(400, 'PHONE_ALREADY_REGISTERED',
    'A user with simillar phone is already registered.');

errors.email_verification_required = create(403, 'EMAIL_VERIFICATION_REQUIRED',
    'To proceed with the request, email verification is required first.');

errors.phone_verification_required = create(403, 'PHONE_VERIFICATION_REQUIRED',
    'To proceed with the request, phone verification is required first.');

errors.invalid_verification_code = create(403, 'INVALID_VERIFICATION_CODE',
    'Valid verification code is required.');

errors.invalid_social_data = create(400, 'INVALID_SOCIAL_DATA',
    'Could not retrieve social data from social network.');

errors.no_slot_vacant = create(403, 'NO_SLOT_VACANT',
    'All slots of ball request are already fulled.');

errors.ballrequest_already_started = create(403, 'BALLREQUEST_ALREADY_STARTED',
    'Ball Request is already started.');

errors.invalid_ballrequest_state = create(403, 'INVALID_BALLREQUEST_STATE',
    'Current ball request state is not valid for this operation.');

errors.invalid_player_state = create(403, 'INVALID_PLAYER_STATE',
    'Current player state is not valid for this operation.');

errors.already_playing_other_game = create(403, 'ALREADY_PLAYING_OTHER_GAME',
    'You are already participated in other ball request. First you need to leave that ball request.');

errors.ballrequest_cancelled = create(403, 'BALLREQUEST_CANCELLED',
    'Ball Request is cancelled.You can\'t do any further operation');

errors.ballrequest_ended = create(403, 'BALLREQUEST_ENDED',
    'Ball Request is ended.You can\'t modify or update it');

errors.ballrequest_not_ended = create(403, 'BALLREQUEST_NOT_ENDED',
    'Ball Request is not ended yet.After game ended you can perform this task.');

errors.ballrequest_score_completed = create(403, 'BALLREQUEST_SCORE_COMPLETED',
    'Score of ball request is completed. You can\'t update or add score on same ball request.');

errors.ballrequest_score_incomplete = create(403, 'BALLREQUEST_SCORE_INCOMPLETE',
    'To proceed with the request, score of ball request required complete. First complete the score.');

errors.hole_score_completed = create(403, 'HOLE_SCORE_COMPLETED',
    'Score of current hole is already completed. You can\'t update or add score on same hole.');

errors.hole_score_incomplete = create(403, 'HOLE_SCORE_INCOMPLETE',
    'To proceed with the request, score of last hole required complete. First complete the score of incomplete hole.');

errors.ballrequest_private = create(403, 'BALLREQUEST_PRIVATE',
    'Ball request is private.It is not visible for every one');

errors.join_request_already_sent = create(403, 'JOIN_REQUEST_ALREADY_SENT',
    'You already sent join request for same ball request.');

errors.ballrequest_not_suggested = create(403, 'BALLREQUEST_NOT_SUGGESTED',
    'Ball request is not in your suggestion list.');

errors.ballrequest_proposed_time_past = create(403, 'BALLREQUEST_PROPOSED_TIME_PAST',
    'Ball request proposed time for play can\'t be a past time.');

errors.not_invited_for_ballrequest = create(403, 'NOT_INVITED_FOR_BALLREQUEST',
    'You do not have invite request for the same ball request.');

errors.not_have_joinrequest = create(403, 'NOT_HAVE_JOINREQUEST',
    'You do\'t have join request from same user on this ball request.');

errors.recp_email_verification_required = create(403, 'RECP_EMAIL_VERIFICATION_REQUIRED',
    'To proceed with the request, email verification of receipient is required first.');

errors.recp_account_disabled = create(403, 'RECP_ACCOUNT_DISABLED',
    'Receipient user account has been disabled.');

errors.invalid_masterdata_type = create(403, 'INVALID_MASTERDATA_TYPE',
    'Master data type are not exist. First create master data type');

errors.invalid_old_password = create(403, 'INVALID_OLD_PASSWORD',
    'Invalid old password');

errors.not_have_connect_request = create(403, 'NOT_HAVE_CONNECT_REQUEST',
    'You do not have connect request from same user.');

errors.already_connected = create(403, 'ALREADY_CONNECTED',
    'Request user is already in your connections list.');


errors.connect_request_already_received = create(403, 'CONNECT_REQUEST_ALREADY_RECEIVED',
    'You already have connect request from same user.');

errors.golf_course_unpublished = create(403, 'GOLF_COURSE_UNPUBLISHED',
    'Golf course is not published.');

errors.can_not_start_before_allowed_time = create(403, 'CAN_NOT_START_BEFORE_ALLOWED_TIME',
    'Requested operation is not allowed due to applied rules.You can\'t start Ball request before time');

errors.invalid_tournament_state = create(403, 'INVALID_TOURNAMENT_STATE',
    'Current tournament state is not valid for this operation.');

errors.reward_already_consumed = create(403, 'REWARD_ALREADY_CONSUMED',
    'This reward id has already been consumed by another tournament\'s player.');

errors.tournament_date_past = create(403, 'TOURNAMENT_DATE_PAST',
    'Tournament date to start play can\'t be a past date.');

errors.player_already_joined_tournament = create(403, 'PLAYER_ALREADY_JOINED_TOURNAMENT',
    'Same player already joined a game of same tournament');

errors.not_invited_for_tournament = create(403, 'NOT_INVITED_FOR_TOURNAMENT',
    'You do not have invite request for the same tournament.');

errors.invalid_order_status = create(403, 'INVALID_ORDER_STATUS',
    'Order status is not valid.');

errors.invalid_transaction_status = create(403, 'INVALID_TRANSACTION_STATUS',
    'Transaction status is not valid.');           