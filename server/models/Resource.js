'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ParameterSchema = new Schema({
	key: String,
	type: String
});

var ResourceSchema = new Schema({
	title: String,
	description: String,
	//resource path
	resourcePath: String,
	json: Schema.Types.Mixed,
	jsonSchema: Schema.Types.Mixed,
	modelSchema: Schema.Types.Mixed,
	entryPoints: [{
		url: String,
		method: String,
		queryParameters: [ParameterSchema],
		pathParameters: [ParameterSchema]
	}],
	resourceSpace: {
		type: Schema.Types.ObjectId,
		ref: 'ResourceSpace'
	}
});

mongoose.model('Resource', ResourceSchema);
