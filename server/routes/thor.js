var express = require('express');
var router = express.Router();
var jsonSchema = require('json-schema-utils');

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
    var schema = jsonSchema.jsonSchema('Product',product);
    res.json(schema);
});

module.exports = router;
