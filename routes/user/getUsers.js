var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var userModule = require('../../modules/user');
var _ = require('lodash');

var route = new Route('get', '/users');

module.exports = route;

// allow authenticated users
route.allowUserTypes('AdminUser', 'User', 'ManagerUser');
/*
// validate input 
route.validateInputQuery({
    type: 'object',
    properties: {
        keyword: { type: 'string', format: 'nonEmptyOrBlank' },
        type: { type: 'string', enum: ['connected', 'connectsent', 'connectreceived', 'connectsuggested', 'notconnected'] },
        sort: { type: 'string', format: 'nonEmptyOrBlank' },
        sortOrder: { type: 'string', enum: ['-1', '1'] },
        skip: { type: 'string', format: 'numberString' },
        limit: { type: 'string', format: 'numberString' }
    }
});

// check the user account status
route.use(function (req, res, next) {

    if (req.user.constructor.modelName == "AdminUser") {
        // admin.
        return next();
    }

    // user email verified check
    if (req.user.emailVerified === false) {
        // user's email is not verified.
        return next(errors.email_verification_required());
    }

    return next();
});
// middleware to define query options from request
route.use(function (req, res, next) {

    if (!req.query.type) {
        req.query.type = 'connectsuggested';
    }
    var options = { sort: {} };

    if (_.has(req.query, 'sort')) {
        // sort on basis of user request
        options.sort[req.query.sort] = _.has(req.query, 'sortOrder') ? req.query.sortOrder * 1 : 1;
    }
    else {
        // by default sorted by user firstName
        options.sort['firstName'] = 1;
    }

    if (_.has(req.query, 'skip')) {
        options['skip'] = req.query.skip * 1;
    }

    if (_.has(req.query, 'limit')) {
        options['limit'] = req.query.limit * 1;
    }

    res.locals.options = options;

    return next();

});

// conclude user list with connect and user.
route.use(function (req, res, next) {

    if (res.locals.isConditionsComplete) {
        // conditions defined go to next for list.
        return next();
    }
    else {
        var ids = res.locals.connectDocs.map(function (connect) {
            if (connect.from.toString() == req.user._id.toString()) {
                return connect.to;
            }
            else {
                return connect.from;
            }
        });
        var conditions = {};
        conditions.emailVerified = true;
        conditions.accountEnabled = true;
        if (req.query.type == 'connectsuggested' || req.query.type == 'notconnected') {
            conditions._id = { $nin: _.concat(ids, req.user.accConns, req.user._id) }
        }
        else {
            conditions._id = { $in: ids }

        }
        res.locals.conditions = conditions;
        return next();
    }

});

// get suggested user list
route.use(function (req, res, next) {

    if (req.query.type == 'connectsuggested' && req.user.constructor.modelName !== "AdminUser") {
        // query is connect suggested.
        return userModule.getSuggestedUserList(req.user, res.locals.conditions, res.locals.options, req.query.keyword)
            .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
    }
    else {
        // not query for suggested get other list
        return next();
    }
});
*/
// get users list.
route.use(function(req, res, next) {

    return userModule.getUserList(res.locals.conditions, res.locals.options, req.query.keyword)
        .then(function(docs) {
            return res.json(docs);
        })
        .catch(next);
});
