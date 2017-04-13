var MasterDataTypeModel = require('./models/MasterDataTypeModel');

/**
 * master data type Module
 */
var masterDataTypeModule = {};
module.exports = masterDataTypeModule;

/**
 * Create master data type with given data.
 * @param {Object} data - master data type.
 * @return MasterDataType promise.
 */
masterDataTypeModule.createMasterDataType = function (data) {
    return new MasterDataTypeModel(data).save();
};


/**
 * Get all master data types.
 * @return MasterDataType promise.
 */
masterDataTypeModule.getAllMasterDataTypes = function () {
    return MasterDataTypeModel.find({}).sort({ type: -1 }).exec();
};


/**
 * Update master data type with given data.
 * @param {ObjectID} id - MasterDataType id.
 * @param {Object} data - new master data type.
 * @return MasterDataType promise.
 */
masterDataTypeModule.updateMasterDataType = function (id, data) {
    return MasterDataTypeModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec();
};


/**
 * Get master data types for given query.
 * @return MasterData promise.
 */
masterDataTypeModule.getMasterDataTypeForQuery = function (query) {
    return MasterDataTypeModel.find(query).exec();
};


/**
 * Delete MasterDataType for given id.
 * @param {ObjectID} id - master data type id.
 * @return MasterDataType promise.
 */
masterDataTypeModule.deleteMasterDataTypeForId = function (id) {
    // find and delete by MasterDataType id
    return MasterDataTypeModel.findOneAndRemove({ _id: id }).exec();

};
