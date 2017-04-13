var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataModule = require('../../modules/masterData');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('get', '/masterdata/:type');

module.exports = route;

// public route
route.setPublic();

// middleware for getting master data associated with given master data type name
route.use(function (req, res, next) {
    return masterDataModule.getMasterDataForQuery({ type: req.params.type.toLowerCase() })
        .then(function (docs) {
            return res.json(docs);
        })
        .catch(next);
});
