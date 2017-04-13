
var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var catModule = require('../../modules/category');
//var authModule = require('../../modules/auth');

var route = new Route('get', '/category');
module.exports = route;


// public route
route.setPublic();


// login user

route.use(function (req, res, next) {
    console.log("find");
    return catModule.getcat(req.body.categoryId, req.body.categoryName)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});
route.use(function (req, res, next) {
    console.log("byid");
    return catModule.getcatById(req.body.categoryId)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});

