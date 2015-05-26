
ubiDatasets = new Meteor.Collection(ubiDatasetsName);

addDataset = function(descriptor, name) {
  var doc = ubiDatasets.findOne({ descriptor: descriptor });
  if (!doc) {
    doc = ubiDatasets.insert({ descriptor: descriptor, name: name, created: Date.now() });
  } else {
    console.log("dataset " + descriptor + " already exists");
  }

  addDataFeed(descriptor);

  return doc;
};

Meteor.methods({
  addDataset: function(ds) {
    ubiDatasets.insert(ds);
    return { ok: true };
  }
});

