/**
 * Created by toby on 25/05/15.
 */

var hourHash = {};

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
          { view: "label", template: "<div class='picoHeader'><span class='picoHeaderTitle'>nqminds &mdash; live feed diagnostics</span>"},
          {},
          {view:"label", template: "<div style='text-align: right;'>diag.user</div>" },
          {view:"icon", icon:"user"},
          {view:"icon", icon:"cog"}
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
            minWidth: 300,
            gravity:.5,
            rows: [
              {
                header: "data store",
                body: {
                  view: "list",
                  id: "dataStoreList",
                  template: "#descriptor#",
                  url: webix.proxy("meteor", ubiDatasets.find()),
                  select: true,
                  on: {
                    onAfterLoad: function() { var self = this; setTimeout(function() { self.select("PRqoi8H4SfR8ic7sB");},1000); },
                    onSelectChange: function(val) {
                      var mapped = ubiDataFeeds[val].find().fetch().map(function(i) { return { timestamp: new Date(i.msg.time*1000), counter: i.deviceData.counter, temperature: i.deviceData.temperature, photoPercent: i.deviceData.photoPercent } });
                      $$("feedTable").clearAll();
                      $$("feedTable").parse(mapped);
                      $$("feedTable").sort("#timestamp","desc","date");
                      hourHash = {};
                      var limit = mapped.length > 144 ? 144 : mapped.length;
                      mapped = mapped.slice(mapped.length - limit)
                      $$("feedChartTemp").clearAll();
                      $$("feedChartTemp").config.xAxis.title = mapped[mapped.length/2].timestamp.toDateString();
                      $$("feedChartTemp").parse(mapped);
                      $$("feedChartPhoto").clearAll();
                      $$("feedChartPhoto").config.xAxis.title = mapped[mapped.length/2].timestamp.toDateString();
                      $$("feedChartPhoto").parse(mapped);
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
            gravity: 3,
            view: "datatable",
            id: "feedTable",
            autoConfig: true
          },
          {
            gravity: 4,
            rows: [
              {
                view: "chart",
                id: "feedChartPhoto",
                type: "line",
                item: { radius: 0 },
                value: "#photoPercent#",
                xAxis: {
                  lines: false,
                  template: function(val) {
                    var hour = val.timestamp.getHours();
                    var show = !hourHash.hasOwnProperty(hour);
                    hourHash[hour] = true;
                    return show ? val.timestamp.getHours() : "";
                  }
                },
                yAxis: { title: "photo percent", start: 0, end: 100, step: 10, lines: false  }
              },
              {
                view: "chart",
                id: "feedChartTemp",
                type: "line",
                item: { radius: 0 },
                value: "#temperature#",
                xAxis: {
                  lines: false,
                  template: function(val) {
                    var hour = val.timestamp.getHours();
                    var show = !hourHash.hasOwnProperty(hour);
                    hourHash[hour] = true;
                    return show ? val.timestamp.getHours() : "";
                  }
                },
                yAxis: { title: "temperature", start: 15, end: 26, step: 1, lines: false, template: function(val) { return val; } }
              }
            ]
          }
        ]
      }
    ]
  };
  this.ui = webix.ui(ui);

  this.autorun(function() {
    var feed = Session.get("SIGFOX-GFTDesignEnviroMon01-850C"); //ubiDataFeeds["SIGFOX-GFTDesignEnviroMon-01"];
    if (feed) {
      feed = ubiDataFeeds["PRqoi8H4SfR8ic7sB"];
      feed.find().observe({
        changed: function() {
          var mapped = feed.find().fetch().map(function(i) { return { timestamp: new Date(i.msg.time*1000), counter: i.deviceData.counter, temperature: i.deviceData.temperature, photoPercent: i.deviceData.photoPercent } });
          $$("feedTable").clearAll();
          $$("feedTable").parse(mapped);
          Session.get("SIGFOX-GFTDesignEnviroMon01-850C",false);
        }
      });
    }
  });
});

Template.datasetsView.onDestroyed(function() {
  if (this.ui) {
    this.ui.destructor();
  }
});