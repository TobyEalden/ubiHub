"use strict";

this.ubiDatasets = new Meteor.Collection(ubiDatasetsName);

var addDataFeed = function(descriptor) {
  if (!ubiDataFeeds.hasOwnProperty(descriptor)) {
    ubiDataFeeds[descriptor] = new Meteor.Collection(descriptor);
  }
};

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

