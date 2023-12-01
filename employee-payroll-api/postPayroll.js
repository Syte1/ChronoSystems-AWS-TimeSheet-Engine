var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    console.log(event)
    const uid = event['body-json'].uid;
    const start_period = event['body-json'].start_period;
    const end_period = event['body-json'].end_period;
    const pay = event['body-json'].pay;
    const start_period_end_period = `${start_period}_${end_period}`;
    
    if (!uid || typeof uid !== 'string' || !start_period || !end_period || !pay) {
    const message = "Invalid input data. Please provide valid data.";
    console.error(message);
    callback(null, {message, "statusCode": 404});
    return;
}
    const params = {
        TableName: "payroll",
        Item: {
            "uid": uid,
            "start_period_end_period": start_period_end_period,
            "pay": pay,
            "start_period": start_period,
            "end_period": end_period
        }
    };
    
    
    try{
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to put item. Error JSON:", JSON.stringify(err, null, 2));
                callback(err, {"statusCode": 500, "message": `"Unable to put item. Error JSON:${err}`});
            } else {
                console.log("PutItem succeeded");
                callback(null, {"message": "putItem succeeded", "statusCode": 200, "Item": params.Item});
            }
        });
    } catch(error){
        console.error("An error occurred while interacting with DynamoDB:", error);
        callback("DynamoDB operation failed", null);
        
    }

};