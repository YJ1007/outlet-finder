const { MongoClient, ObjectId } = require("./mongoClient");
const { db } = require("./dbCollections");
const { logger } = require("../utils");
const outletDb = new MongoClient();

function __getConnectionObj(dbName) {
  let connectionObj = {};
  let url = "";
  const mongoconfigObj = CONFIG.MONGO[dbName];

  if (mongoconfigObj.PROTO) url += mongoconfigObj.PROTO + "://";
  if (mongoconfigObj.USER) url += mongoconfigObj.USER;
  if (mongoconfigObj.PASS) url += ":" + mongoconfigObj.PASS;
  if (mongoconfigObj.HOST) url += "@" + mongoconfigObj.HOST;
  if (mongoconfigObj.PORT) url += ":" + mongoconfigObj.PORT;
  if (mongoconfigObj.authStr) url += mongoconfigObj.authStr;
  connectionObj.url = url;
  connectionObj.dbName = dbName;
  return connectionObj;
}

function ConnectDatabases(onSuccess, onFailure) {
  logger.debug("Connecting to databases");
  try {
    var connectionMong = { [db.outletDb]: outletDb };
    const mongoobjs = Object.keys(connectionMong);
    var cntr = mongoobjs.length;

    mongoobjs.forEach((nm) => {
      connectionMong[nm].Connect(__getConnectionObj(nm),() => {
        cntr --;
        if (cntr == 0) {
          onSuccess();
        }
      }, (e) => {
        logger.error("Could not connect to " + nm + " database.");
        onFailure();
        process.exit();
      });
    });
  } catch (ex) {
    logger.error("Error caught,", ex);
    onFailure(ex);
  }
}

module.exports = {
  ConnectDatabases,
  outletDb,
  ObjectId,
};
