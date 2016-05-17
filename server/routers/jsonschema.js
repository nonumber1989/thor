var express = require('express');
var router = express.Router();
var schemaUtils = require('json-schema-utils');

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

router.get('/', function(req, res, next) {
	var product = {
		"id": 1,
		"number": 1200,
		"date": "Tue Jul 22 2008 12:11:04 GMT-0700 (Pacific Daylight Time)",
		"dimensions": {
			"length": 7.0,
			"width": 12.0,
			"height": 9.5
		},
		"users": [{
			"name": "steven",
			"age": 28
		}]
	};
	var schema = schemaUtils.jsonSchema('Product', product);
	res.json(schema);
});


router.get('/mongoose', function(req, res, next) {
	var user = {
		"name": "steven",
		"email": "nonumber1989@gmail.com",
		"age": 1000,
		"male": true,
		"skills": ["java", "node"],
		"others": {
			"age": 1,
			"name": "waht",
			"istime": true
		},
		"wh": [{
			"yy": 1,
			"333": true,
			"ueueu": "333"
		}, {
			"yy": 1,
			"333": true,
			"ueueu": "333"
		}]
	};
	var title = "User";
	var filePath = "./server/models/";
	var fileName = filePath + title + ".js";
	var mongooseSchema = Promise.promisify(schemaUtils.mongooseSchema);

	var routerPath = "./server/configurations/router.js";
	var replaceTemplate = "thor.use('/theRouter', router.theRouter);"
	mongooseSchema(title, user, fileName).then(function(schema) {
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
