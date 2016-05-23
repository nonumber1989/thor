'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var url = require('url');
var schemaUtils = require('json-schema-utils');

var requestUtils = require('./requestUtils');

var resourceMethod = {
  query: "query",
  get: "get",
  post: "post",
  update: "put",
  delete: "delete"
};
var ThorResourceRoot = "";

var basicResource = function(title, resourcePath) {
  var resource = {
    title: title,
    resourcePath: resourcePath
  };
  resource.entryPoints = basicEntryPoints(resourcePath);
  return resource;
};


var basicEntryPoints = function(resourcePath) {
  var entryPoints = [];
  var resourceUrl = url.parse(resourcePath, true);

  var queryEntryPoint = {
    url: resourceUrl.pathname,
    method: resourceMethod.query,
    queryParameters: [{
      key: "offset",
      type: "Number"
    }, {
      key: "limit",
      type: "Number"
    }],
    pathParameters: []
  };

  var getEntryPoint = {
    url: resourceUrl.pathname + "/:id",
    method: resourceMethod.get,
    queryParameters: [],
    pathParameters: []
  };
  var postEntryPoint = {
    url: resourceUrl.pathname,
    method: resourceMethod.post,
    queryParameters: [],
    pathParameters: [{
      key: "id",
      type: "String"
    }]
  };

  var updateEntryPoint = {
    url: resourceUrl.pathname + "/:id",
    method: resourceMethod.update,
    queryParameters: [],
    pathParameters: [{
      key: "id",
      type: "String"
    }]
  };

  var deleteEntryPoint = {
    url: resourceUrl.pathname + "/:id",
    method: resourceMethod.delete,
    queryParameters: [],
    pathParameters: [{
      key: "id",
      type: "String"
    }]
  };

  entryPoints.push(queryEntryPoint);
  entryPoints.push(getEntryPoint);
  entryPoints.push(postEntryPoint);
  entryPoints.push(updateEntryPoint);
  entryPoints.push(deleteEntryPoint);

  return entryPoints;
};

var routersFromEntryPoints = function(title, entryPoints, router) {
  var MongooseModel = mongoose.model(title);
  entryPoints.forEach(function(entryPoint) {
    var routerPath = ThorResourceRoot + entryPoint.url;
    if (entryPoint.method === "get") {
      router.get(routerPath, function(req, res, next) {
        var queryPromise = MongooseModel.findById(new ObjectId(req.params.id)).exec();
        queryPromise.then(function(record) {
          if (record) {
            res.json(record);
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
    } else if (entryPoint.method === "query") {
      router.get(routerPath, function(req, res, next) {
        var pagenation = requestUtils.getPagenation(req);
        var queryPromise = MongooseModel.find({}, {}, pagenation).exec();
        queryPromise.then(function(records) {
          if (records.length) {
            res.json(records);
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
    } else if (entryPoint.method === "post") {
      router.post(routerPath, function(req, res, next) {
        var theModel = new MongooseModel(req.body);
        theModel.save().then(function(result) {
          res.json(result);
        }).catch(function(err) {
          res.status(500);
          res.json({
            status: 500,
            errorMessage: err.message
          });
        });

      });

    } else if (entryPoint.method === "put") {
      router.put(routerPath, function(req, res, next) {
        var theModel = new MongooseModel(req.body);
        MongooseModel.findByIdAndUpdate(new ObjectId(req.params.id), theModel, function(err, speaker) {
          if (err) {
            res.status(500);
            res.json({
              type: false,
              data: "Error occured: " + err
            });
          } else {
            if (speaker) {
              res.json({
                type: true,
                data: speaker
              });
            } else {
              res.json({
                type: false,
                data: "speaker: " + req.params.id + " not found"
              })
            }
          }
        });
      });
    } else if (entryPoint.method === "delete") {
      router.delete(routerPath, function(req, res, next) {
        MongooseModel.findByIdAndRemove(new Object(req.params.id)).then(function() {
          res.json({
            type: true,
            data: "record: " + req.params.id + " deleted successfully"
          })
        }).catch(function(err) {
          res.status(500);
          res.json({
            type: false,
            data: "Error occured: " + err
          })
        });
      });
    } else {
      console.log(entryPoint.method + "not support yet, so sorry ! ")
    }

  });
};
module.exports.basicResource = basicResource
module.exports.basicEntryPoints = basicEntryPoints
module.exports.routersFromEntryPoints = routersFromEntryPoints
