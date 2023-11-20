var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
    // TODO implement
    console.log("PARAMS---:"+JSON.stringify(event));
    var params = {
        TableName: "TimesheetProfile",
          Item: {
        "uid": event["body-json"].uid,
        "name": event["body-json"].name ?? "",
        "wage":event["body-json"].wage ?? 0,
        "role": event["body-json"].role ?? ""
  }, 
    };
    
    docClient.put(params, function(err, data) {
        if (err) {
            console.log(JSON.stringify(params));
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            let returnmsg = {message: "Success", statusCode: 200,           
            item: {
        "uid": event["body-json"].uid,
        "name": event["body-json"].name ?? "",
        "wage":event["body-json"].wage ?? 0,
        "role": event["body-json"].role ?? ""
  }, };
            console.log("PutItem succeeded:", JSON.stringify(returnmsg, null, 2));
            callback(null, JSON.parse( JSON.stringify(returnmsg, null, 2)));
        }
    });
};