const express = require("express");
const app = express();
global.CONFIG = require("./config");
const { ConnectDatabases } = require("./dal");
const { logger } = require("./utils");
const { middleware, outletRouter } = require("./httpl");

ConnectDatabases(onSuccess, onFailure);

function onSuccess(/*arg*/) {
  logger.info("Database connection established.");

  app.use(middleware.inputBodyBuffer);

  if (CONFIG.USE_CORS) {
    app.use(function(req, res, next) {
      if (req.headers.origin) res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, appcookie");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
      next();
    });
  }

  app.use("/outlets", outletRouter);
  app.use("/isreachable", function (req, res) {
    res.sendStatus(204);
  });

  app.get("*", middleware.resourceNotFound);
  app.post("*", middleware.resourceNotFound);

  app.listen(CONFIG.SERVER_PORT, function(err) {
    if (err) {
      logger.error(err);
      process.exit();
    } else {
      logger.info("express listening on port " + CONFIG.SERVER_PORT);
    }
  });
}

function onFailure(err) {
  logger.error("DB connection failed ", err);
  process.exit();
}
