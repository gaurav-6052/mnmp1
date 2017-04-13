var specialModel = require('./model/specialmodel');
var fullPopulate = [
 { path: 'categoryId', select: '_id value' },
 { path: 'categoryName', select: '_id value' }
    
];

/**
 * City module
 */
var specialsModule = {};
module.exports = specialsModule;



specialsModule.gedetails = function () {
    // find one by 
    console.log("getspecial");
     return specialModel.find().exec();
    
};