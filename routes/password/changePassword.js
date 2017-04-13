var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var adminUserModule = require('../../modules/adminUser');
var managerUserModule = require('../../modules/ManagerUser');
var userModule = require('../../modules/user');

var route = new Route('put', '/changepassword');
module.exports = route;

// allow authenticated users
route.allowUserTypes(userModule.userType, adminUserModule.userType, managerUserModule.userType);

// validate input 
route.validateInputBody({
    type: 'object',
    properties: {
        oldPassword: { type: 'string', format: 'nonEmptyOrBlank', minLength: 6, maxLength: 16 },
        newPassword: { type: 'string', format: 'nonEmptyOrBlank', minLength: 6, maxLength: 16 }
    },
    required: ['oldPassword', 'newPassword']
});

// both password must not be equal
route.use(function (req, res, next) {
    if (req.body.oldPassword === req.body.newPassword) {
        // both paswords are same
        return next(errors.invalid_input().withDetails("The new password must not be same as old one"));
    } else {
        return next();
    }
});

// middleware for oldPassword varification in db
route.use(function (req, res, next) {            
    // change password according to user's model name
    switch (req.user.constructor.modelName) {
        case adminUserModule.userType:
            //get admin user
            return adminUserModule.getUserForLogin(req.user.email, req.body.oldPassword)
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                });
            break;
        case userModule.userType:
            //get user
            return userModule.getUserForLogin(req.user.email, req.body.oldPassword)
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();

                });
            break;
        case managerUserModule.userType:
            //get manager user
            return managerUserModule.getUserForLogin(req.user.email, req.body.oldPassword)
                .then(function (doc) {
                    res.locals.user = doc;
                    return next();
                });
            break;
        default:
            // no such user model exists.
            throw new Error('Invalid user_type sent in request:' + req.body.userType);
            break;

    };
});

//middleware for changing the password of the user
route.use(function (req, res, next) {
    var user = res.locals.user;
    if (user) {
        //update new password                  
        user.password = req.body.newPassword;
        //save new updated doc to db
        user.save()
            .then(function (doc) {
                return res.json({ "message": "password changed successfully" });
            })
            .catch(next);
    }
    else {
        // Invalid old password can't get user. 
        throw errors.invalid_old_password();
    }

});
