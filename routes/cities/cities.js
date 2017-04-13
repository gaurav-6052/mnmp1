
var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var cityModule = require('../../modules/cities');
//var authModule = require('../../modules/auth');

var route = new Route('get', '/city');
module.exports = route;


// public route
route.setPublic();

// validate input 
/*
route.validateInputBody({
    type: 'object',
    properties: {
        c_name: { type: 'string', format: 'email' },
        lat: { type: 'string', format: 'nonEmptyOrBlank' },
        lng: { type: 'string', format: 'nonEmptyOrBlank' },
        imgurl: { type: 'string', format: 'nonEmptyOrBlank' },
    },
    //required: ['c_name', 'lat' , 'lng']
});
*/
// login user
route.use(function (req, res, next) {
    console.log("find");
    return cityModule.getcity(req.body.c_name, req.body.lat, req.body.lng)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});
/*
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
});*/