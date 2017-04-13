var DetailModel = require('./model/detailsmodel');
var fullPopulate = [
 { path: 'categoryId', select: '_id value' },
 { path: 'categoryName', select: '_id value' }
    
];

/**
 * City module
 */
var detailsModule = {};
module.exports = detailsModule;



detailsModule.gedetails = function () {
    // find one by 
    console.log("getcat");
     return DetailModel.find().populate(fullPopulate).exec();
    
};