
var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var couponModule = require('../../modules/coupons');
//var authModule = require('../../modules/auth');

var route = new Route('get', '/coupons');
module.exports = route;


// public route
route.setPublic();


route.use(function (req, res, next) {
    console.log("find");
    return couponModule.getcoupon(req.body.title, req.body.couponDetail, req.body.expireDate, req.body.imgurl, req.body.externalLink,req.body.couponsLeft,req.body.businessName)
    .then(function(docs) {
                return res.json(docs);
            })
            .catch(next);
        
    
        
});
