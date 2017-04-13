var CatModel = require('./models/catModel');
var fullPopulate = [
 { path: 'categoryId', select: '_id value' },
 { path: 'categoryName', select: '_id value' }
    
];







/**
 * City module
 */
var catModule = {};
module.exports = catModule;



catModule.getcat = function () {
    // find one by 
    console.log("getcat");
     return CatModel.find().populate(fullPopulate).exec();
    
};
catModule.getcatById = function (categoryId) {
    // find by id
    console.log("index");
    return CatModel.findById(categoryId).populate(fullPopulate).exec();
};