const AWS = require('aws-sdk');
const SSM = require('aws-sdk/clients/ssm');
const ssm = new SSM({ region: "eu-west-1" });

exports.handler = async () => {
    const ssmParams = {
        Name: 'IOT_IGNORE_EVENTS'
    };
    const response = await ssm.getParameter(ssmParams).promise();
    console.log(JSON.stringify(response));
    return response.Parameter.Value;
};
