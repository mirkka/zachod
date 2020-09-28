const awsIot = require('aws-iot-device-sdk');
const debounce = require('lodash/debounce');


// PIR sensor connected to pin 7
// You can use any gpio pin
// install npm button library first
const Gpio = require('onoff').Gpio,
button = new Gpio(7, 'in', 'both');

const debounceTime = 1000 * 60;

const myThingName = 'sdk-nodejs-e2f7328d-663e-42d9-bf84-a567b35d3841';

mythingstate = {
  "state": {
    "movement": 0,
    "timestamp": 0
  }
}

var device = awsIot.device({
  keyPath: './pir_2.private.key',
  certPath: './pir_2.cert.pem',
  caPath: './AmazonRootCA1.pem',
  clientId: myThingName,
  host: 'aa7yld3wmn8b5-ats.iot.eu-west-1.amazonaws.com',
  region: 'eu-west-1',
  debug: true
});

const callback = debounce((err, value) => {
  console.log("Movement detected ")
  delete mythingstate['version']; //Cleanup to post to AWS
  mythingstate["state"]["movement"] = value
  mythingstate["state"]["timestamp"] = Date.now()
  device.publish('topic_2', JSON.stringify(mythingstate));
  console.log("Update:" + mythingstate.state.movement);
}, debounceTime);

device
 .on('connect', function() {
  console.log('connect');
  button.watch(callback);
 });

