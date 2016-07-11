var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var serverTelemetry = require("./aria-web-telemetry-nodejs-0.1.min.js");

var connectionString = process.env.AzureIoTHubConnectionString;
var logger = new serverTelemetry.Logger();
 
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
