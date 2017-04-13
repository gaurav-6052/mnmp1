var CityModel = require('./models/cityModel');

var fullPopulate = [
 { path: 'c_name', select: '_id value' },
 { path: 'lat', select: '_id value' },
 { path: 'lng', select: '_id value' },
 { path: 'imgurl', select: '_id value' }
    
];

/**
 * City module
 */
var cityModule = {};
module.exports = cityModule;



cityModule.getcity = function (c_name,lat, lng) {
    // find one by 
    console.log("getcity");
     return CityModel.find(c_name,lat,lng).populate(fullPopulate).exec();
    
};