var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var adminModule = require('../../modules/adminUser');
var authModule = require('../../modules/auth');

var route = new Route('post', '/login/admin');
module.exports = route;

// public route
route.setPublic();

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'nonEmptyOrBlank' }
    },
    required: ['email', 'password']
});

// create default admin account if no admin account is exist in system
route.use(function (req, res, next) {
    return adminModule.createOrGetDefault()
        .then(function () {
            return next();
        })
        .catch(next);
});

// login for admin
route.use(function (req, res, next) {
    return adminModule.getUserForLogin(req.body.email.toLowerCase(), req.body.password)
        .then(function (doc) {
            if (doc) {
                // login
                res.locals.admin = doc;
                return next();
            } else {
                // can't login
                throw errors.invalid_login();
            }
        })
        .catch(next);
});

// create auth for admin user
route.use(function (req, res, next) {
    var admin = res.locals.admin;
    return authModule.createForUser(admin)
        .then(function (auth) {
            var response = {
                auth: auth.toJSON(),
                admin: admin.toJSON()
            };
            // reply with auth and admin user
            return res.json(response);
        })
        .catch(next);
});