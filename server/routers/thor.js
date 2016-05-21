var express = require('express');
var router = express.Router();
var schemaUtils = require('json-schema-utils');
var requestUtils = require('../services/requestUtils');
var resourceService = require('../services/resourceService');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var ResourceSpace = mongoose.model("ResourceSpace");
var Resource = mongoose.model("Resource");
//for thor resource space
router.get('/resourceSpaces', function(req, res, next) {
	var pagenation = requestUtils.getPagenation(req);
	var queryPromise = ResourceSpace.find({}, {}, pagenation).exec();
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

router.post('/resourceSpaces', function(req, res, next) {
	var resourceSpace = new ResourceSpace(req.body);
	resourceSpace.save().then(function(resourceSpace) {
		res.json(resourceSpace);
	}).catch(function(err) {
		res.status(500);
		res.json({
			status: 500,
			errorMessage: err.message
		});
	});
});

router.post('/:spaceId/resources', function(req, res, next) {
	var resourceSpace = req.params.spaceId;
	var resource = new Resource(req.body);
	var entryPoints = resourceService.basicEntryPoints("/users");
	// resource.entryPoints = entryPoints;
	// resource.resourcePath ="ooo";
	resource.resourceSpace = resourceSpace;
	resource.save().then(function(resource) {
		res.json(resource);
	}).catch(function(err) {
		res.status(500);
		res.json({
			status: 500,
			errorMessage: err.message
		});
	});
});

router.get('/:spaceId/resources', function(req, res, next) {
	var resourceSpace = req.params.spaceId;
	var queryPromise = Resource.find({
		resourceSpace: resourceSpace
	}).exec();
	queryPromise.then(function(resources) {
		if (resources.length) {
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
	})
});


router.post('/json', function(req, res, next) {
	var query = requestUtils.getQuery(req);
	var title = query.title;
	var thorObject = req.body;
	var schema = schemaUtils.jsonSchema(title, thorObject);
	res.json(schema);
});


router.post('/mongoose', function(req, res, next) {
	var query = requestUtils.getQuery(req);
	var title = query.title;
	var thorObject = req.body;
	var filePath = "./server/models/";
	var fileName = filePath + title + ".js";
	var mongooseSchema = Promise.promisify(schemaUtils.mongooseSchema);

	var routerPath = "./server/configurations/router.js";
	var replaceTemplate = "thor.use('/theRouter', router.theRouter);"
	mongooseSchema(title, thorObject, fileName).then(function(schema) {
		//modify the routers configuration
		fs.readFileAsync(routerPath, "utf8").then(function(content) {
			var replace = replaceTemplate.replace(/theRouter/g, title.toLowerCase() + 's') + " \n" + "	console.log('thor router');";
			var targetContent = content.replace(/console.log\(\'thor router\'\);/g, replace);
			return targetContent;
		}).then(function(value) {
			fs.writeFileAsync(routerPath, value, 'utf8').then(function(result) {
				// res.json(value);
			}).catch(function(error) {
				throw error;
			});
		}).catch(function(e) {
			console.error(e.stack);
		});
		//read router template and generate new router file
		var routerTemplatePath = "./server/services/routerTemplate.js";
		var routerName = "./server/routers/" + title.toLowerCase() + "s.js";
		fs.readFileAsync(routerTemplatePath, "utf8").then(function(content) {
			var replaceContent = content.replace(/MongooseSchema/g, title);
			return replaceContent;
		}).then(function(value) {
			fs.writeFileAsync(routerName, value, 'utf8').then(function(result) {
				// res.json(value);
			}).catch(function(error) {
				throw error;
			});
		}).catch(function(e) {
			console.error(e.stack);
		});

	}).then(function(result) {
		res.json({
			"mame": "222222"
		});
	}).catch(function(error) {
		console.log(error);
	});
});

module.exports = router;
