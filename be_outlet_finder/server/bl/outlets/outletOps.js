const { retCode, logger } = require("../../utils");
const { dbCollections, outletDb } = require("../../dal");

const outletDbCollections = dbCollections.collections.outletDb;
const LAT_INDEX = 1;
const LNG_INDEX = 0;

const findOutletByCoord = (args, cb) => {
  var data = args.body;
  if(!data || !data.coords || !data.coords.length || data.coords.length < 2) {
    console.log("bad request")
    return cb(retCode.badRequest, "missing fields");
  }

  var query = {
    loc: { 
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [ data.coords[LAT_INDEX], data.coords[LNG_INDEX] ]
        }
      }
    }
  }

  outletDb.FindDocFieldsByFilter(outletDbCollections.outletAreas, query, { _id: 0 }, 0, (err, outletData) => {
    if(err){
      logger.error(err);
      return cb(retCode.processingError, "Error finding outlets. Please try later");
    }

    cb(retCode.ok, outletData);
  });
}

module.exports = {
  findOutletByCoord,
};
