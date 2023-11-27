var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
  console.log(event)
  //get uid from api gateway path parameter
  const uid = event.uid
  return getPayrollById(uid,callback)

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
      return callback(null, {"message": `Unable to read items. Error JSON:${err}`, "statusCode": 500})
    } else {
        if (!data.Items || data.Items.length === 0){
        return callback(null, {"message": `No record were found with the uid ${uid} provided, please try again`, "statusCode": 404})
      }
      console.log("Query succeeded:", JSON.stringify(data, null, 2));
      const items = data.Items
      if (items.length > 1) {
        items.sort((a, b) => a.end_date < b.end_date)
      }
      return callback(null, {"message": `get all payrolls of user ${uid} succeeded`, "Items": items, "statusCode": 200});
    }
  });
}