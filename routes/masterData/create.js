var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataModule = require('../../modules/masterData');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('post', '/masterdata/:type');

module.exports = route;

// allow only admin user
route.allowUserTypes('AdminUser');

// validate input body 
route.validateInputBody({
    type: 'object',
    properties: {
        value: { type: 'string', format: 'nonEmptyOrBlank' }
    },
    required: ['value']
});

// assert master data type name
route.use(function (req, res, next) {
    return masterDataTypeModule.getMasterDataTypeForQuery({ type: { $regex: new RegExp('^' + req.params.type + '$', "i") } })
        .then(function (doc) {
            if (doc && doc.length > 0) {
                return next();
            }
            else {
                throw errors.invalid_masterdata_type();
            }
        })
        .catch(next);
});

// adding master data
route.use(function (req, res, next) {
    //adding master data type to body object
    req.body.type = req.params.type;

    return masterDataModule.createMasterData(req.body)
        .then(function (doc) {
            return res.json(doc.toJSON());
        })
        .catch(next);
});

