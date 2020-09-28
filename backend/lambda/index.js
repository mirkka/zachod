const appsync = require('aws-appsync');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');
const AWS = require('aws-sdk');
const SSM = require('aws-sdk/clients/ssm');
const ssm = new SSM({ region: "eu-west-1" });
const moment = require("moment-timezone");

exports.handler = async (event) => {
  // event: { state: { movement: 0, timestamp: 1587915298699 }
  const graphqlClient = new appsync.AWSAppSyncClient({
    url: process.env.APPSYNC_ENDPOINT_URL,
    region: 'eu-west-1',
    auth: {
      type: 'AWS_IAM',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
      }
    },
    disableOffline: true
  });

  const ssmParams = {
      Name: 'IOT_IGNORE_EVENTS'
  };

  const mutation = gql`mutation createIoTModelType($timestamp: AWSTimestamp, $date: String) {
    createIoTModelType(timestamp: $timestamp, date: $date)
  }`;
  const AWSTimestamp = Math.floor(event.state.timestamp / 1000)
  const date = moment(event.state.timestamp).tz("Europe/Helsinki").format("YYYY-MM-DD")
  console.log(date)

  const response = await ssm.getParameter(ssmParams).promise();
  console.log(response.Parameter.Value)

  if(response.Parameter.Value === 'false') {
    const response = await graphqlClient.mutate({
      mutation,
      variables: {
        timestamp: AWSTimestamp,
        date
      }
    });
    console.log(JSON.stringify(response))
  }


  return AWSTimestamp

};
