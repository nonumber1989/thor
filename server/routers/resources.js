'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var requestUtils = require('../services/requestUtils');
var resourceService = require('../services/resourceService');

//mongoose model register
router.post('/register', function(req, res, next) {
	var queryObject = requestUtils.getQuery(req);
	var schemaObject = req.body;
	var modelTitle = queryObject.title;
	var schema = new Schema(schemaObject);
	//if the mongoose model already registered
	if (mongoose.models[modelTitle]) {
		delete mongoose.models[modelTitle];
	}
	mongoose.model(modelTitle, schema);
	res.status(200);
	res.json({
		message: "you have register the model"
	});
});

//resource 
router.get('/generate', function(req, res, next) {
	var entryPoints = resourceService.basicEntryPoints("/users");
	resourceService.routersFromEntryPoints(entryPoints,router);
	res.json(entryPoints);
});
module.exports = router;