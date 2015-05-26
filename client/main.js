/**
 * Created by toby on 24/05/15.
 */

Session.set("SIGFOX-GFTDesignEnviroMon01-850C",false);

Meteor.subscribe(ubiDatasetsName, function() {
  ubiDatasets.find().forEach(function(doc) {
    console.log("adding feed: " + doc.descriptor);
    var lookup = doc._id._str ? doc._id._str : doc._id;
    if (!ubiDataFeeds.hasOwnProperty(lookup)) {
      ubiDataFeeds[lookup] = new Meteor.Collection(doc.descriptor);
      Meteor.subscribe(doc.descriptor, function() {
        Session.set(doc.descriptor,true);
      });
    }
  });
});
