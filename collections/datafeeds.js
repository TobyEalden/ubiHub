/**
 * Created by toby on 25/05/15.
 */

ubiDataFeeds = {};

Meteor.methods({
  dataFeed: function(descriptor, data) {
    var datasetDoc = addDataset(descriptor);
    var feed = ubiDataFeeds[descriptor];
    data.insertedAt = Date.now();
    feed.insert(data);

    return { ok: true };
  }
});
