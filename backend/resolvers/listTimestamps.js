const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event)
    const { days } = event


    const getDay = async day => {
        const params = {
            TableName: process.env.TABLE_NAME,
            ExpressionAttributeNames: {
                "#d": "date"
            },
            ExpressionAttributeValues: {
                ":date": day
            },
            KeyConditionExpression: '#d = :date'
        }
        const response = await dynamoDb.query(params).promise()
        const timestamps = response.Items.map(item => item.timestamp)
        return timestamps
    }

    const queryPromises = days.map(day => getDay(day))
    const responses = await Promise.all(queryPromises)

    console.log(JSON.stringify(responses))
    return responses
};
