/**
 * Created by toby on 25/05/15.
 */

Meteor.publish(ubiDatasetsName, function() {
  return ubiDatasets.find();
});

function publishDataFeed(descriptor) {
  if (!ubiDataFeeds.hasOwnProperty(descriptor)) {
    ubiDataFeeds[descriptor] = new Meteor.Collection(descriptor);
    console.log("publishing feed: " + descriptor);
    Meteor.publish(descriptor, function() {
      return ubiDataFeeds[descriptor].find();
    });
  }
};

ubiDatasets.find().forEach(function(doc) {
  publishDataFeed(doc.descriptor);
});
