/**
 * Created by toby on 25/05/15.
 */

Router.route("/feed/:feedId", function() {
  this.wait(Meteor.subscribe(this.params.feedId));
  if (this.ready()) {
    this.render("datafeedView", { data: function() { return { feed: ubiDataFeeds[this.params.feedId].find() }}});
  } else {
    this.render("loading");
  }
},{ name: "datafeedView" });

Meteor.startup(function() {
});

