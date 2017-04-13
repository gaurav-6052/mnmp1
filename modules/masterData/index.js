var MasterDataModel = require('./models/MasterDataModel');
var express = require('express');
var app     = express();

/**
 * master data Module
 */
var masterDataModule = {};
module.exports = masterDataModule;

/**
 * Create master data with given data.
 * @param {Object} data - master data.
 * @return MasterData promise.
 */
masterDataModule.createMasterData = function (data) {
	console.log("masterDataModule");
    return new MasterDataModel(data).save();
};


/**
 * Get all master data for given id.
 * @return MasterData promise.
 */
masterDataModule.getMasterDataForId = function (id) {
    return MasterDataModel.findById(id).exec();
};


/**
 * Update master data with given data.
 * @param {Object} query - master data query.
 * @param {Object} data - new master data.
 * @return MasterData promise.
 */
masterDataModule.updateMasterData = function (query, data) {
    return MasterDataModel.findOneAndUpdate(query, data, { new: true }).exec();
};


/**
 * Get all master data for given query.
 * @return MasterData promise.
 */
masterDataModule.getMasterDataForQuery = function (query) {
	app.post('/users', function(req, res){
	
	db.users.insert(req.body, function(err, doc){
		res.json(doc);
		
	})
	return MasterDataModel.find(query).exec();

});

};

/**
 * Delete MasterData for given id.
 * @param {ObjectID} id - master data type id.
 * @return MasterData promise.
 */
masterDataModule.deleteMasterDataForId = function (id) {
    // find and delete by MasterData id
    return MasterDataModel.findOneAndRemove({ _id: id }).exec();

};