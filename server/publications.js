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

function stringToHexArray(str) {
  var arr = [];

  for (var i = 0, len = str.length; i < len; i+=2) {
    var next = str.substr(i,2);
    arr.push(parseInt(next,16));
  }

  return arr;
}

var fixup = function(msgIn) {
  var tempCalibration = -50.0;
  var refVoltage = 1.237;

  var msgData = stringToHexArray(msgIn.data);

  var msg = {};
  if (msgData.length === 12) {
    msg.counter = msgData[0];
    msg.analogueTemperature = msgData[6]*256 + msgData[7];
    msg.referenceReading = msgData[8]*256 + msgData[9];
    msg.photoValue = msgData[10]*256 + msgData[11];

    msg.temperature = (((refVoltage * 100 * msg.analogueTemperature) / msg.referenceReading) + tempCalibration).toFixed(2);
    msg.photoPercent = ((msg.photoValue * 100) / 1023).toFixed(2);
  } else {
    msg.error = "invalid message, length is " + msgData.length;
  }

  return msg;
};

Meteor.startup(function() {

  var coll = ubiDataFeeds["SIGFOX-GFTDesignEnviroMon01-850C"];
  var store = JSON.parse(Assets.getText("store.json"));
  store.forEach(function(i) {
    if (i.devType === "GFTDesignEnviroMon01") {
      var obj = {
        msg: i
      };
      obj.deviceData = fixup(i);
      obj.insertedAt = Date.now();
      coll.insert(obj);
    }
  });
});