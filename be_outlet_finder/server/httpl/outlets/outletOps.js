const router = require("express").Router();
const middleware = require("../middleware");
const { outletOps } = require("../../bl/outlets");

const handlers = [
  [ "/findoutletbycoord",  "post",    0, outletOps.findOutletByCoord ],
];

middleware.requestHandler(router, handlers);

module.exports = router;
