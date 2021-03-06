var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var serverTelemetry = require("./aria-web-telemetry-nodejs-0.1.min.js");

var connectionString = process.env.AzureIoTHubConnectionString;
//var ariaToken = process.env.AriaToken;

// var configuration = new microsoft.applications.telemetry.LogConfiguration();
// var logConfigurationOverrides = new microsoft.applications.telemetry.LogConfigurationBrowserOverrides();
// logConfigurationOverrides.onSaveData = (key, value) => { /* ideally store this data so that it can persist on the device */};
// logConfigurationOverrides.onGetData = (key) => { return ""; };
// configuration.browserOverrides = logConfigurationOverrides;
// microsoft.applications.telemetry.LogManager.initialize("your tenant token", configuration);

//serverTelemetry.LogManager.__setCollectorUrlToInt();
serverTelemetry.LogManager.initialize("b580d41bfdf1433d8e911329ad9bb72a-fb869890-603d-4b9e-91f5-606ff9dc8898-7408");
//serverTelemetry.LogManager.initialize("1c03120594b244b182ad5741609b0723-70676000-a26e-4b4a-b3e9-f8f3ca7e4b49-7242");
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
    context.log("Hello there");
    context.log(myEventHubTrigger.toString());

    
        // Create a message and send it to the IoT Hub every second
      // var data = JSON.stringify(myEventHubTrigger.message);
      // var message = new Message(data);
      // context.log('Sending message: ' + message.getData() + ' to: ' + myEventHubTrigger.deviceId);
      // client.send(myEventHubTrigger.deviceId, message, printResultFor('send'));

     var eventProperties = new serverTelemetry.EventProperties();
    //     logger.logEvent({
    //     name: eventName.Value,
    //     properties: [{ key: key1.Value, value: value1.Value },
    //                 { key: key2.Value, value: value2.Value },
    //                 { key: key3.Value, value: value3.Value },
    //                 { key: key4.Value, value: value4.Value }]
    // });
      context.log('Name: ' + myEventHubTrigger.name);
      eventProperties.name = myEventHubTrigger.name;
      context.log("Properties...");
      for (var property in myEventHubTrigger.message) {
        if (myEventHubTrigger.message.hasOwnProperty(property)) {
          context.log('Property: ' + property + ' value: ' + myEventHubTrigger.message[property]);
          eventProperties.setProperty(property, myEventHubTrigger.message[property]);
        }
      }
      // eventProperties.setProperty("ClientId", myEventHubTrigger.clientId);
      // eventProperties.setProperty("SessionId", myEventHubTrigger.sessionId);
      // eventProperties.setProperty("Message",message.getData());
       logger.logEvent(eventProperties);

   //   }
 //     context.done();
 //   });
    
    context.log("Done!");
    context.done();
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
