var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('get', '/masterdatatypes');

module.exports = route;

// allow only admin user
route.allowUserTypes('AdminUser');

// middleware for getting master data types
route.use(function (req, res, next) {
    return masterDataTypeModule.getAllMasterDataTypes()
        .then(function (docs) {
            return res.json(docs);
        })
        .catch(next);
});
