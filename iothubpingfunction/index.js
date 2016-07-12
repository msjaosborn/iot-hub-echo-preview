var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var serverTelemetry = require("./aria-web-telemetry-2.7.0.min.js");

var connectionString = process.env.AzureIoTHubConnectionString;
//var ariaToken = process.env.AriaToken;

var configuration = new microsoft.applications.telemetry.LogConfiguration();
var logConfigurationOverrides = new microsoft.applications.telemetry.LogConfigurationBrowserOverrides();
logConfigurationOverrides.onSaveData = (key, value) => { /* ideally store this data so that it can persist on the device */};
logConfigurationOverrides.onGetData = (key) => { return ""; };
configuration.browserOverrides = logConfigurationOverrides;
microsoft.applications.telemetry.LogManager.initialize("your tenant token", configuration);

serverTelemetry.LogManager.__setCollectorUrlToInt();
serverTelemetry.LogManager.initialize("d2b1b412df134fb5ab4938c22d65b3a2-b0b018ab-f7d2-48df-91e5-2e73ab2d96eb-7708");
serverTelemetry.LogManager.addCallbackListener(checkStatusCallback);
var logger = new serverTelemetry.Logger();

function checkStatusCallback(callbackType, responseCode, tenantToken, events) {
    if (responseCode != 200 /* SEND_FAILED */) {
        // Process error
        console.log('failure: ' + responseCode);
    } else {
        // Event sent
        console.log('success: ' + responseCode);
    }
}
 
module.exports = function (context, myEventHubTrigger) {

    var client = Client.fromConnectionString(connectionString);
    
    client.open(function (err) {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected');
    
        // Create a message and send it to the IoT Hub every second
      var data = JSON.stringify(myEventHubTrigger.message);
      var message = new Message(data);
      console.log('Sending message: ' + message.getData() + 'to: ' + myEventHubTrigger.deviceId);
      client.send(myEventHubTrigger.deviceId, message, printResultFor('send'));

     var eventProperties = new serverTelemetry.EventProperties();
      eventProperties.name = "Device Message";
      eventProperties.setProperty("DeviceId", myEventHubTrigger.deviceId);
      eventProperties.setProperty("Message",message.getData());
      logger.logEvent(eventProperties);

      }
      context.done();
    });
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    } else {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}
