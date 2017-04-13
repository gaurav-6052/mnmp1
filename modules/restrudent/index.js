var restrudentModel = require('./model/restudentmodel');
var fullPopulate = [
 { path: 'restrudentId', select: '_id value' },
 { path: 'restrudentName', select: '_id value' }
    
];







/**
 * City module
 */
var restrudentModule = {};
module.exports = restrudentModule;



restrudentModule.getrestrudentlist = function () {
    // find one by 
    console.log("getcat");
     return restrudentModel.findOne().populate(fullPopulate).exec();
    
};
restrudentModule.getrestrudentById = function (restrudentId) {
    // find by id
    console.log("index");
    return restrudentModel.findById(categoryId).populate(fullPopulate).exec();
};