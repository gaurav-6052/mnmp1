var Route = require('../../lib/Route');
var errors = require('../../lib/errors');
var masterDataTypeModule = require('../../modules/masterDataType');

var route = new Route('put', '/masterdatatypes/:id');


module.exports = route;

// allow only admin user
route.allowUserTypes('AdminUser');

// validate input params
route.validateInputParams({
     type: 'object',
     properties: {
          id: { type: 'string', format: 'objectId' }
     },
     required: ['id']
});

// validate input body 
route.validateInputBody({
     type: 'object',
     properties: {
          type: { type: 'string', format: 'nonEmptyOrBlank' }
     },
     required: ['type']
});


// updating master data type 
route.use(function (req, res, next) {
     masterDataTypeModule.updateMasterDataType(req.params.id, req.body)
          .then(function (doc) {
               if (doc) {
                    return res.json(doc.toJSON());
               } else {
                    throw errors.not_found().withDetails('Invalid master data type id');
               }

          })
          .catch(next);
});

