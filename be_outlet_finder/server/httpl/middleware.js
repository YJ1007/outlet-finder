const { logger, retCode, CONSTANTS, getResStatus } = require("../utils");
const API_INDEX = 0;
const METHOD_INDEX = 1;
const ACESS_INDEX = 2;
const CB_INDEX = 3;
let reqcntr = 0;

function resourceNotFound(req, res) {
  responseHandler(req, res, retCode.notFound, "No endpoint to receive data");
}

function inputBodyBuffer(req, res, next) {
  if (req.method === "GET") {
    next();
    return;
  }
  if (req.headers["content-type"] && req.headers["content-type"].indexOf("multipart/form-data") >= 0) {
    next();
    return;
  }

  var data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    req.rawBody = data;
    next();
    return;
  });
}

function responseHandler(request, response, respObj, resData, code) {
  const resp = {
    "responseResult" : respObj.message,
    "responseData" : (resData ? resData : respObj.message),
    "code" : code
  };
  const respStr = JSON.stringify(resp);
  logger.info(
    "==> resid ", request.id,
    " url ", request.originalUrl,
    " reqBody ", (request.rawBody ? request.rawBody.substring(0, 1024) : ""),
    " resBody ", respStr.substring(0, 256)
  );
  response.status(respObj.code).send(respStr);
}


function requestHandler(router, arr) {
  arr.forEach((el) => {
    if (router[el[METHOD_INDEX]]) {
      router[el[METHOD_INDEX]](el[API_INDEX], (req, res) => _functionMapHandler(req, res, el));
    }
  });
}

function _functionMapHandler(req, res, obj) {
  if (obj[ACESS_INDEX] != 0) {
    // check for access index in router handler files
    responseHandler(req, res, retCode.unauthorized, null);
    return;
  } else {
    const args = {
      params : req.params,
      qs : req.query,
    };
    try {
      req.args = args;
      req.id = reqcntr++;
      logger.info("==> reqid :", req.id);
      if (req.rawBody) {
        try {
          args.body = JSON.parse(req.rawBody);
        } catch (ex) {
          args.body = {};
        }
      }

      obj[CB_INDEX](args, function(rc, data, code) {
        const status = getResStatus(rc.code);
        if (typeof data == "string") {
          data = { msg: data };
        }
        responseHandler(req, res, status, data, code);
      });
    } catch (ex) {
      responseHandler(req, res, retCode.serverError, "Sorry there is some issue on server, please try again later");
      logger.error("Exception caught", JSON.stringify(ex, Object.getOwnPropertyNames(ex)));
    }
  }
}

module.exports = {
  resourceNotFound,
  responseHandler,
  requestHandler,
  inputBodyBuffer,
};
