const tj = require('@mapbox/togeojson'),
    fs = require('fs'),
    DOMParser = require('xmldom').DOMParser;

const targetFile = __dirname + "/../mongoScripts/outlet_data.js";

const kml = new DOMParser().parseFromString(fs.readFileSync('delivery-areas.kml', 'utf8'));
const converted = tj.kml(kml);

var dataArray = [];

converted.features.forEach((el, index) => {
  var obj = { idx: index, name: el.properties.name, loc: el.geometry };
  if(el.properties.description)
    obj.desc = el.properties.description;
  dataArray.push(obj);
});

console.log("writing data to file " + targetFile);
fs.writeFileSync(targetFile, 'const areaData = ' + JSON.stringify(dataArray, null, 2) + ';\n');
