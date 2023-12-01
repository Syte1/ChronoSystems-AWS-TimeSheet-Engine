
const AWS = require('aws-sdk');
const ses = new AWS.SES();
const axios = require('axios');

exports.handler = async (event) => {
  try {
    // Retrieve the new entry from the DynamoDB event
    const newEntry = event.Records[0].dynamodb.NewImage;
    // Extract the user ID and email address from the new entry
    const uid = newEntry.uid.S;
    const end_period = newEntry.end_period.S;

    // Retrieve the user's email address from endpoint
    const endpoint = `https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test/profile?uid=${uid}`;
    const response = await axios.get(endpoint);
    if (!response.data) {
      throw new Error('Error retrieving user data');
    }
    
    const emailAddress = response.data.item.email;
    const firstName = response.data.item.name || 'user';

    if (!emailAddress) {
      throw new Error('No email address found for user');
    }

    const content = `Hello ${firstName},\n\nYour payroll for ${end_period} has been processed and is ready for review.\n\nThanks,\nYour friendly timesheet app`
    const subject = `Your payroll for ${end_period} is ready for review`
    // Send a notification email using AWS SES
    const params = {
      Destination: {
        ToAddresses: [emailAddress]
      },
    
      Message: {
        Body: {
          Text: {
            Data: content
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: 'payroll@nandynano.com'
    };

    await ses.sendEmail(params).promise();

    return {
      statusCode: 200,
      body: `Notification email sent to ${firstName} successfully for period ending ${end_period}`
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error sending notification email'
    };
  }
};
