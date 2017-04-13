
var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var detailsModule = require('../../modules/Details');
//var authModule = require('../../modules/auth');

var route = new Route('get', '/details');
module.exports = route;


// public route
route.setPublic();


// login user

route.use(function (req, res, next) {
    console.log("find");
    return detailsModule.gedetails()
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});


