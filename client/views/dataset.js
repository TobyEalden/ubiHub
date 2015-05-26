/**
 * Created by toby on 25/05/15.
 */

Meteor.startup(function() {
  Router.route("/", {
    data: { dataset: ubiDatasets.find() },
    template: "datasetsView"
  });
});

Template.datasetsView.onCreated(function() {
  this.feeds = new ReactiveVar(ubiDataFeeds);
});

Template.datasetsView.onRendered(function() {
  var ui = {
    view: "layout",
    container: "body",
    type: "line",
    rows: [
      {
        view: "toolbar",
        elements: [
          {},
          {
            view: "button",
            label: "feed",
            on: { onItemClick: function() { Router.go("datafeedView",{ feedId: "feed-test-001"}); }}
          }
        ]
      },
      {
        view: "layout",
        type: "clean",
        cols: [
          {
            view: "accordion",
            type: "line",
            multi: false,
            minWidth: 200,
            gravity: 1,
            rows: [
              {
                header: "data store",
                body: {
                  view: "list",
                  template: "#descriptor#",
                  url: webix.proxy("meteor", ubiDatasets.find()),
                  select: true,
                  on: {
                    onItemClick: function(val) {
                      $$("feedTable").clearAll();
                      $$("feedTable").parse(ubiDataFeeds[val].find().fetch().map(function(i) { return i.deviceData }));
                    }
                  }
                }
              },
              {
                header: "devices",
                collapsed: true,
                body: {

                }
              }
            ]
          },
          {
            gravity: 4,
            view: "datatable",
            id: "feedTable",
            autoConfig: true
          }
        ]
      }
    ]
  };
  this.ui = webix.ui(ui);

  //this.autorun(function() {
  //  var feeds = Template.instance().feeds.get();
  //  if (feeds && feeds.hasOwnProperty("feed-test-001")) {
  //    $$("feedTable").clearAll();
  //    $$("feedTable").parse(feeds["feed-test-001"].find().fetch());
  //  }
  //});
});

Template.datasetsView.onDestroyed(function() {
  if (this.ui) {
    this.ui.destructor();
  }
});