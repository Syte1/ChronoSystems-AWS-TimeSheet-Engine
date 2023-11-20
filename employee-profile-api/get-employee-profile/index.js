var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
    // TODO implement
    console.log("PARAMS---:"+JSON.stringify(event.params));
    var params = {
        TableName: "TimesheetProfile",
        Key:{
            "uid": event.params.querystring.uid
        }
    };
    
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            
            if (data.hasOwnProperty('Item')){
                let returnmsg = {};
                returnmsg['item'] = data['Item'];
                returnmsg['message'] = "Successfully found item.";
                returnmsg['statusCode'] = 200;
                //console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                callback(null, JSON.parse( JSON.stringify(returnmsg, null, 2)));
            } else {
                data['statusCode'] = 404;
                data['message'] = `No data found for uid= ${event.params.querystring.uid}`
                //console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                callback(null, JSON.parse( JSON.stringify(data, null, 2)));
            }

        }
    });
};