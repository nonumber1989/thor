'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSpaceSchema = new Schema({
	title: String,
	description: String,
	resources: [{
		type: Schema.Types.ObjectId,
		ref: 'Resource'
	}]

});

mongoose.model('ResourceSpace', ResourceSpaceSchema);