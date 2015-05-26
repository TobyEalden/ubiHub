/**
 * Created by toby on 24/05/15.
 */

Meteor.subscribe(ubiDatasetsName, function() {
  ubiDatasets.find().forEach(function(doc) {
    console.log("adding feed: " + doc.descriptor);
    if (!ubiDataFeeds.hasOwnProperty(doc._id)) {
      ubiDataFeeds[doc._id] = new Meteor.Collection(doc.descriptor);
      Meteor.subscribe(doc.descriptor);
    }
  });
});
