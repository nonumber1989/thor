'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var resourceService = require('./resourceService');

var entryPoints = resourceService.basicEntryPoints("/users");

var theSchema = new Schema({
	name: String,
	phone: String,
	email: String,
	company: String,
	position: String,
	comment: String
});

mongoose.model('Account', theSchema);

console.log(JSON.stringify(entryPoints));