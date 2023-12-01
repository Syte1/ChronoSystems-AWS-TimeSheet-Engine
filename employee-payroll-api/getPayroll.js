var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
  console.log(event)
  const uid = event.params.querystring.uid

  if (event.params.querystring.start_period && event.params.querystring.end_period) {
    const start_period_end_period = `${event.params.querystring.start_period}_${event.params.querystring.end_period}`
    getPayrollByPeriod(uid, start_period_end_period, callback)
  } else{
    getPayrollById(uid,callback)
  }

  function getPayrollByPeriod(uid, start_period_end_period, callback) {
    if (!uid || !start_period_end_period) {
      return callback(null, JSON.parse({"message": "uid and start_period_end_period are required", "statusCode": 400}))
    }

    const params = {
      TableName: "payroll",
      Key: {
        uid,
        start_period_end_period
      }
    };

    docClient.get(params, function (err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        return callback(null, JSON.parse({"message": "Unable to read item. Error JSON:", "statusCode": 500}))
      } else {
        console.log(data)
        if (!data.Item || data.Item.length === 0){
          return callback(null, JSON.parse({"message": "No record were found with the parameter provided, please try again", "statusCode": 404}))
        }
         return callback(null, JSON.parse({"message": "get payroll succeeded", "Item": data.Item, "statusCode": 200}));
      }
    });
  }

  function getPayrollById(uid, callback) {
    const params = {
      TableName: "payroll",
      KeyConditionExpression: 'uid = :uid',
      ExpressionAttributeValues: {
        ':uid': uid,
      },
      ScanIndexForward: false,
    };
    docClient.query(params, function (err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        return callback(null, JSON.parse({"message": `Unable to read item. Error JSON:${err}`, "statusCode": 500}))
      } else {
          if (!data.Items || data.Items.length === 0){
          return callback(null, JSON.parse({"message": "No record were found with the parameter provided, please try again", "statusCode": 404}))
        }
        console.log("Query succeeded:", JSON.stringify(data, null, 2));
        const items = data.Items
        if (items.length > 1) {
          items.sort((a, b) => a.end_date > b.end_date)
        }
        return callback(null, JSON.parse({"message": "get payroll succeeded", "Item": item[0], "statusCode": 200}));
      }
    });
  }
} 