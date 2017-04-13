var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('post', '/masterdatatypes');

module.exports = route;

// allow only admin user
route.allowUserTypes('AdminUser');

// validate input body 
route.validateInputBody({
    type: 'object',
    properties: {
        type: { type: 'string', format: 'nonEmptyOrBlank' }
    },
    required: ['type']
});

// creating master data new type
route.use(function (req, res, next) {
    return masterDataTypeModule.createMasterDataType(req.body)
        .then(function (doc) {
            return res.json(doc.toJSON());
        })
        .catch(next);
});

