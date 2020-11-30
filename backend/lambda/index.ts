const appsync = require('aws-appsync');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');
const moment = require("moment-timezone");
const SSM = require('aws-sdk/clients/ssm');

const ssm = new SSM({ region: "eu-west-1" });

const getSsmParam = async name => {
  const ssmParams = {
    Name: name
  };
  const response = await ssm.getParameter(ssmParams).promise();
  return response.Parameter.Value
}

exports.handler = async (event) => {
  // event: { state: { movement: 0, timestamp: 1587915298699 }
  const accessKeyId = await getSsmParam('IOT_ACCESS_KEY_ID')
  const secretAccessKey = await getSsmParam('IOT_SECRET_ACCESS_KEY')

  console.log(accessKeyId, secretAccessKey)

  const graphqlClient = new appsync.AWSAppSyncClient({
    url: process.env.APPSYNC_ENDPOINT_URL,
    region: 'eu-west-1',
    auth: {
      type: 'AWS_IAM',
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    },
    disableOffline: true
  });

  const mutation = gql`mutation createIoTModelType($timestamp: AWSTimestamp, $date: String) {
    createIoTModelType(timestamp: $timestamp, date: $date)
  }`;
  const AWSTimestamp = Math.floor(event.state.timestamp / 1000)
  const date = moment(event.state.timestamp).tz("Europe/Helsinki").format("YYYY-MM-DD")
  console.log(date)

  // const response = await ssm.getParameter(ssmParams).promise();
  const isIgnored = await getSsmParam('IOT_IGNORE_EVENTS')
  console.log(isIgnored)

  if (isIgnored === 'false') {
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
