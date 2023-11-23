var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
const axios = require('axios')

exports.handler = async (event, context, callback) => {
    const uid = event.params.querystring.uid
    const payrollApi = `https://s2z6h094ph.execute-api.us-west-2.amazonaws.com/test?uid=${uid}`

    const {end_period} = await axios.get(payrollApi)

    const unprocessedStart = new Date(end_period)
    const unprocessedEnd = new Date()
    unprocessedStart.setDate(unprocessedStart.getDate() + 1)
    unprocessedEnd.setDate(unprocessedEnd.getDate() + 14)

    formattedStart = unprocessedStart.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    })

    formattedEnd = unprocessedEnd.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    })


    const timesheetApi = `https://oxtwzrrqrg.execute-api.us-west-2.amazonaws.com/development/getEmployeeTimesheet?uid=${uid}&start_date=${formattedStart}&end_date=${formattedEnd}`
    
    const data = await axios.get(timesheetApi)

    return callback(null, JSON.parse(JSON.stringify(data, null, 2)))


}