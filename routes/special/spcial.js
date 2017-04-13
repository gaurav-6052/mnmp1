var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var specialsModule = require('../../modules/special');
//var authModule = require('../../modules/auth');

var route = new Route('get', '/specials');
module.exports = route;


// public route
route.setPublic();


// login user

route.use(function (req, res, next) {
    console.log("find");
    return specialsModule.gedetails()
    .then(function(docs) {

    	var item = { 
    	     	code : 200, 
    	        messege : "success", 
    	        data : docs 
    	     }; 
                return res.json(item) ;
                
            })
            .catch(next);
        
    
        
});


