'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
	title: String,
	description: String,
	//resource path
	resourcePath: String,
	entryPoint: [{
		url: String,
		method: String,
		queryParameters: [{
			key: String,
			value: String
		}],
		pathParameters: [{
			key: String,
			value: String
		}]
	}],
	resourceSpace: {
		type: Schema.Types.ObjectId,
		ref: 'ResourceSpace'
	}
});

mongoose.model('Resource', ResourceSchema);