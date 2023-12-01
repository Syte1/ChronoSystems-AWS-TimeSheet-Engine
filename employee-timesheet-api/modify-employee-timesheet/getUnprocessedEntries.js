const axios = require('axios')

exports.handler = async (event, context, callback) => {
    const uid = event.params.querystring.uid
    const payrollApi = `https://s2z6h094ph.execute-api.us-west-2.amazonaws.com/test?uid=${uid}`
    const timesheetApi = 'https://oxtwzrrqrg.execute-api.us-west-2.amazonaws.com/development/getEmployeeTimesheet'

    const end_period = await axios.get(payrollApi)
    console.log(end_period.data);
    if (end_period.data == "No record were found with the parameter provided, please try again") {
        console.log("inside if");
        const data = await axios.get(`${timesheetApi}?uid=${uid}`)
        return callback(null, JSON.parse(JSON.stringify(data.data, null, 2)))
       
    }

    let unprocessedStart = new Date(end_period.data.end_period)
    let unprocessedEnd = new Date()
    unprocessedStart.setDate(unprocessedStart.getDate() + 1)
    unprocessedEnd.setDate(unprocessedEnd.getDate() + 14)

    let formattedStart = unprocessedStart.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    })

    let formattedEnd = unprocessedEnd.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    })
    
    const data = await axios.get(`${timesheetApi}?uid=${uid}&start_date=${formattedStart}&end_date=${formattedEnd}`)

    return callback(null, JSON.parse(JSON.stringify(data.data, null, 2)))


}