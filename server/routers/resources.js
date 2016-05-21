'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var requestUtils = require('../services/requestUtils');
var resourceService = require('../services/resourceService');

router.post('/register', function(req, res, next) {
	var queryObject = requestUtils.getQuery(req);
	var schemaObject = req.body;
	var modelTitle = queryObject.title;
	var schema = new Schema(schemaObject);
	delete mongoose.models[modelTitle];
	mongoose.model(modelTitle, schema);
	res.status(200);
	res.json(schema);
});

 
router.get('/test', function(req, res, next) {
	var pagenation = requestUtils.getPagenation(req);
	var Test = mongoose.model("Test");
	var queryPromise = Test.find({}, {}, pagenation).exec();
	queryPromise.then(function(spaces) {
		if (spaces.length) {
			res.json(spaces);
		} else {
			res.status(404)
			res.json({
				status: 404,
				errorMessage: "no record found"
			});
		}

	}).catch(function(err) {
		res.status(500);
		res.json({
			status: 500,
			errorMessage: err.message
		});
	});
});
module.exports = router;