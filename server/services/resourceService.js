'use strict';

var url = require('url');


var resourceMethod = {
  get: "get",
  post: "post",
  update: "put",
  delete: "delete"
};

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

  var getEntryPoint = {
    url: resourceUrl.pathname,
    method: resourceMethod.get,
    queryParameters: [{
      key: "offset",
      type: "Number"
    }, {
      key: "limit",
      type: "Number"
    }],
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
    url: resourceUrl.pathname,
    method: resourceMethod.update,
    queryParameters: [],
    pathParameters: [{
      key: "id",
      type: "String"
    }]
  };

  var deleteEntryPoint = {
    url: resourceUrl.pathname,
    method: resourceMethod.delete,
    queryParameters: [],
    pathParameters: [{
      key: "id",
      type: "String"
    }]
  };

  entryPoints.push(getEntryPoint);
  entryPoints.push(postEntryPoint);
  entryPoints.push(updateEntryPoint);
  entryPoints.push(deleteEntryPoint);

  return entryPoints;
};

module.exports.basicResource = basicResource
module.exports.basicEntryPoints = basicEntryPoints