'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSpace = mongoose.model("ResourceSpace");
var Resource = mongoose.model("Resource");

var requestUtils = require('../services/requestUtils');
var resourceService = require('../services/resourceService');

//resource
router.get('/bootstrap/:spaceId', function(req, res, next) {
	var resourceSpace = req.params.spaceId;
	var queryPromise = Resource.find({
		resourceSpace: resourceSpace
	}).exec();
	queryPromise.then(function(resources) {
		if (resources.length) {
			//register  routers
			registerRouter(resources, router);
			res.json(resources);
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

/**
 * [registerRouter register router based on resources maintained bu user]
 * @param  {[type]} resources， router        [description]
 * @return {[type]}            [description]
 */
function registerRouter(resources, router) {
	resources.forEach(function(resource) {
		registerModel(resource.title, resource.modelSchema);
		resourceService.routersFromEntryPoints(resource.title, resource.entryPoints, router);
	});
}

/**
 * [registerModel  register the mongoose model based on the mongoose model schema defination]
 * @param  {[type]} modelTitle   [description]
 * @param  {[type]} schemaObject [description]
 * @return {[type]}              [description]
 */
function registerModel(modelTitle, schemaObject) {
	var schema = new Schema(schemaObject);
	//if the mongoose model already registered
	if (mongoose.models[modelTitle]) {
		delete mongoose.models[modelTitle];
	}
	mongoose.model(modelTitle, schema);
}

module.exports = router;
