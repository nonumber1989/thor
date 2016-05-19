'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
	title: String,
	description: String,
	//resource path
	resourcePath: String,
	entryPoints: [{
		url: String,
		method: String,
		queryParameters: [{
			key: String,
			type: String
		}],
		pathParameters: [{
			key: String,
			type: String
		}]
	}],
	resourceSpace: {
		type: Schema.Types.ObjectId,
		ref: 'ResourceSpace'
	}
});

mongoose.model('Resource', ResourceSchema);
