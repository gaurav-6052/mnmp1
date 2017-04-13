var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataModule = require('../../modules/masterData');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('put', '/masterdata/:type/:id');


module.exports = route;

// allow only admin user
route.allowUserTypes('AdminUser');

// validate input params
route.validateInputParams({
    type: 'object',
    properties: {
        type: { type: 'string', format: 'nonEmptyOrBlank' },
        id: { type: 'string', format: 'objectId' }
    },
    required: ['type', 'id']
});

// validate input body 
route.validateInputBody({
    type: 'object',
    properties: {
        value: { type: 'string', format: 'nonEmptyOrBlank' }
    },
    required: ['value']
});

// updating master data
route.use(function (req, res, next) {
    var query = {};
    query.type = req.params.type.toLowerCase();
    query._id = req.params.id;
    return masterDataModule.updateMasterData(query, req.body)
        .then(function (doc) {
            if (doc) {
                return res.json(doc.toJSON());
            } else {
                throw errors.invalid_input().withDetails('Invalid master data id');
            }
        })
        .catch(next);
});

