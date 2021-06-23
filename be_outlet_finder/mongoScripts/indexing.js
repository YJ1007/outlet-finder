var database = "outletDb"
db = db.getSiblingDB(database);

print("Using database: " + database);

var indexesArr = [
  {
    collection: "outletAreas",
    indexes: [
      { field: "idx", "value": 1, options: { unique : true, name: "idx_1" } },
      { field: "loc", "value": "2dsphere", options: { unique : true, name: "location_2dsphere" } },
    ]
  }
];

var success = 0, failed = 0, total = 0;
indexesArr.forEach(function(element) {
  print("Indexing " + element.collection);
  element.indexes.forEach(function(index) {
    total++;
    var indexObj = {};

    if(index.cfield){
      indexObj = index.cfield;
    }else{
      indexObj[index.field] = index.value;
    }

    if(!index.options) index.options = {};
    index.options.background = true;

    var ret = db[element.collection].createIndex(indexObj, index.options);
    if(ret.ok == 0){
      failed++;
      print(JSON.stringify(ret));
      print("  Error: Could not create index for index name" + index.options.name);
    }
    else{
      success++;
      print("  Created index of collection field: " + (index.cfield ? JSON.stringify(index.cfield) : index.field));
    }
  });
});
print("---------------------------------------------------------------");
if(!failed) print("Successfull: Created all the indexes.");
else print("Error: Could not create some indexes.");
print("Total indexes       : " + total);
print("Indexes successfull : " + success);
print("Indexes failed      : " + failed);
