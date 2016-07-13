//var serverTelemetry = require("./aria-web-telemetry-2.7.0.min.js");
var serverTelemetry = require("./aria-web-telemetry-nodejs-0.1.min.js");

// var configuration = new serverTelemetry.LogConfiguration();
//  var logConfigurationOverrides = new serverTelemetry.LogConfigurationBrowserOverrides();
//  logConfigurationOverrides.onSaveData = (key, value) => { /* ideally store this data so that it can persist on the device */};
//  logConfigurationOverrides.onGetData = (key) => { return ""; };
//  configuration.browserOverrides = logConfigurationOverrides;
//microsoft.applications.telemetry.LogManager.initialize("your tenant token", configuration);

//serverTelemetry.LogManager.__setCollectorUrlToInt();
serverTelemetry.LogManager.initialize("d2b1b412df134fb5ab4938c22d65b3a2-b0b018ab-f7d2-48df-91e5-2e73ab2d96eb-7708");//, configuration);
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
 

var eventProperties = new serverTelemetry.EventProperties();
eventProperties.name = "DeviceMessage";
eventProperties.setProperty("DeviceId", "1");
eventProperties.setProperty("Message","foo");
logger.logEvent(eventProperties);


