const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);
    const { timestamp, day } = event;


    const params = {
        TableName: 'MotionTable',
        Key: {
            "date": day,
            "timestamp": timestamp
        },
        // ConditionExpression:"#t = :val",
        // ExpressionAttributeValues: {
        //   ":val": unix
        // },
        // ExpressionAttributeNames:{
        //   "#t": "timestamp"
        // },
    };

    console.log("Attempting a conditional delete...");
    const response = await dynamoDb.delete(params).promise();
    return timestamp;
};
