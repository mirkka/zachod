const SSM = require('aws-sdk/clients/ssm');
const ssm = new SSM({ region: "eu-west-1" });

exports.handler = async (event) => {
    const { state } = event;
    console.log(event);
    const newParameter = {
        Name: 'IOT_IGNORE_EVENTS',
        Value: `${state}`,
        Type: "String",
        Overwrite: true
    };
    const response = await ssm.putParameter(newParameter).promise();
    console.log(JSON.stringify(response));
    return state;
};