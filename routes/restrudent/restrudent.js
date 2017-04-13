var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var restrudentModule = require('../../modules/restrudent');


var route = new Route('get', '/restrudent');
module.exports = route;


// public route
route.setPublic();



route.use(function (req, res, next) {
    console.log("find");
    return restrudentModule.getrestrudentlist(req.body.restrudentId)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});
route.use(function (req, res, next) {
    console.log("byid");
    return catModule.getrestrudentById(req.body.categoryId)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});


