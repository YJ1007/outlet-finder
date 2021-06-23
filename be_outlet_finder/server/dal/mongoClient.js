"use strict";
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var { logger } = require("../utils");

function IsObject(obj) {
  var rc = true;

  if (obj instanceof Array) rc = false;
  else if (Object.keys(obj) <= 0) rc = false;

  return rc;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class MongoClient {
  Connect(connObj, onSuccess, onFailure) {
    var self = this;
    try {
      mongoClient.connect(connObj.url, { poolSize: 1, useNewUrlParser: true, useUnifiedTopology: true }, function(err, database) {
        if (err) {
          self.db = null;
          logger.error("MongoClient.Connect: Connection failed.", err);
          onFailure(err);
          return;
        } else {
          self.db = database.db(connObj.dbName);
          logger.debug("MongoClient.Connect: Connection successfull.");
          onSuccess();
          return;
        }
      });
    } catch (ex) {
      logger.error("Error caught,", ex);
      onFailure(ex);
    }
  }

  FindDocFieldsByFilter(coll, query, projection, lmt, cb) {
    if (!query) {
      throw Error("MongoClient.FindDocFieldsByFilter: query is not an object");
    }
    try {
      this.db.collection(coll).find(query, projection, {
        limit: lmt || 0
      }).toArray(function(err, item) {
        if (err) logger.error("MongoClient.FindDocFieldsByFilter: error in checking document existence", err);
        cb(err, item);
      });
    } catch (e) {
      logger.error("MongoClient.FindDocFieldsByFilter: Error caught,", e);
      cb(e, null);
    }
  }
}

module.exports = {
  MongoClient,
  ObjectId
};
