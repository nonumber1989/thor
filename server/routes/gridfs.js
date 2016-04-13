var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');
var express = require('express');
var router = express.Router();
// create or use an existing mongodb-native db instance
var db = new mongo.Db('thor', new mongo.Server("127.0.0.1", 27017));

router.get('/', function(req, res, next) {
	// make sure the db instance is open before passing into `Grid`
db.open(function (err) {
  if (err) return handleError(err);
  var gfs = Grid(db, mongo);
	// streaming to gridfs
	var writestream = gfs.createWriteStream({
		filename: './server/TLS/ryans-cert.pem'
	});
	fs.createReadStream('./server/TLS/ryans-cert.pem').pipe(writestream);

	// streaming from gridfs
	var readstream = gfs.createReadStream({
		filename: 'TLS/ryans-cert.pem'
	});

	//error handling, e.g. file does not exist
	readstream.on('error', function(err) {
		console.log('An error occurred!', err);
		throw err;
	});

	readstream.pipe(res);
})


});
module.exports = router;