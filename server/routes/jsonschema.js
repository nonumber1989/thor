var express = require('express');
var router = express.Router();
var schemaUtils = require('json-schema-utils');

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
		"skills": ["java", "node"]
	};
	var title = "User";
	var fileName = title + ".js";
	schemaUtils.mongooseSchema(title, user, "./" + fileName);
	
});


module.exports = router;