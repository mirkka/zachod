const awsIot = require('aws-iot-device-sdk');
const debounce = require('lodash/debounce');


// PIR sensor connected to pin 7
// You can use any gpio pin
// install npm button library first
const Gpio = require('onoff').Gpio,
button = new Gpio(21, 'in', 'both');

const debounceTime = 1000 * 60;

const myThingName = 'sdk-nodejs-e2f7328d-663e-42d9-bf84-a567b35d3841';

var device = awsIot.device({
  keyPath: './pir_2.private.key',
  certPath: './pir_2.cert.pem',
  caPath: './AmazonRootCA1.pem',
  clientId: myThingName,
  host: 'aa7yld3wmn8b5-ats.iot.eu-west-1.amazonaws.com',
  region: 'eu-west-1',
  debug: true
});

const handleEvent = debounce(()=> {
  const state = {
    "state": {
      "movement": 1,
      "timestamp": Date.now()
    }
  }
  device.publish('topic_2', JSON.stringify(state));
  console.log(`${new Date().toISOString()} Publishing event`)
}, debounceTime);

const callback = (err, value) => {
  console.log(`${new Date().toISOString()} Movement detected: ${value}`)
  if(value === 1) handleEvent()
};

device
 .on('connect', function() {
  console.log(`${new Date().toISOString()} Connect`);
  button.watch(callback);
 });