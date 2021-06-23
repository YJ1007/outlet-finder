var database = "outletDb"
db = db.getSiblingDB(database);

print("Using database: " + database);
load('outlet_data.js');
//can be generated using random strings.
var collectionArr = [
  {
    name: "outletAreas",
    dataArr: areaData,
  },
];

var collection_count = 0, update_count = 0, added_count = 0, update_err = 0;
collectionArr.forEach(function(collection){
  print("Adding data to collection: " + collection.name);
  collection_count++;
  collection.dataArr.forEach(function(data){
    var ret = db[collection.name].updateOne({ idx: data.idx }, { $set: data }, { upsert: true });
    if(!ret.acknowledged){
      print("  Error: Failed adding document with idx: " + data.idx);
      update_err++;
    }
    else if(ret.modifiedCount == 0 && ret.matchedCount == 0){
      print("  Added document with idx: " + data.idx);
      added_count++;
    }
    else if(ret.modifiedCount > 0 && ret.matchedCount > 0){
      print("  Updated document with idx: " + data.idx);
      update_count++;
    }
  });
});

print("---------------------------------------------------------------");
if(update_err)
  print("Error: Could not Add/Update some documents collections.");

print("total collections : " + collectionArr.length);
print("collections read  : " + collection_count);
print("fields added      : " + added_count);
print("fields updated    : " + update_count);
print("add/update errors : " + update_err);
