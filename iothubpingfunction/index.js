var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var serverTelemetry = require("./aria-web-telemetry-2.7.0.min.js");

var connectionString = process.env.AzureIoTHubConnectionString;
//var ariaToken = process.env.AriaToken;

serverTelemetry.LogManager.initialize("b580d41bfdf1433d8e911329ad9bb72a-fb869890-603d-4b9e-91f5-606ff9dc8898-7408");
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
