var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var userModule = require('../../modules/user');
var authModule = require('../../modules/auth');

var route = new Route('post', '/login/user/email');
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

// login user
route.use(function (req, res, next) {
    console.log("find");
    return userModule.getUserForLogin(req.body.email.toLowerCase(), req.body.password)
        .then(function (doc) {
            if (doc) {
                // login
              /*  if (!doc.accountEnabled) {
                    throw errors.account_disabled();
                }  */
                res.users = doc;
                return next();
            } else {
                console.log('else');
                // can't login
                throw errors.invalid_login();
            }
        })
        .catch(next);
});

// create auth for user
route.use(function (req, res, next) {
    var user = res.users;
    return authModule.createForUser(user)
        .then(function (auth) {
            var response = {
                auth: auth.toJSON(),
                user: user.toJSON()
            };
            // reply with auth and admin user
            return res.json(response);
        })
        .catch(next);
});