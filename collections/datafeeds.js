/**
 * Created by toby on 25/05/15.
 */

ubiDataFeeds = {};

Meteor.methods({
  dataFeed: function(descriptor, data) {
    var datasetDoc = addDataset(descriptor);
    var feed = ubiDataFeeds[descriptor];
    var split = data.data.split('\n');
    split.forEach(function(i) {
      if (i.length > 0) {
        try {
          var obj = JSON.parse(i);
          obj.insertedAt = Date.now();
          feed.insert(obj);
        } catch (e) {
          // REVIEW - propagate error?
          console.log("failed to add data feed: " + e.message);
        }

      }
    });

    return { ok: true };
  }
});
