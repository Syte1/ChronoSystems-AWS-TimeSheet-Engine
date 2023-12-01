import os
import json
import boto3
from datetime import datetime, timedelta
from NegativeNumberError import NegativeNumberError

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-timesheet')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):    
    try:
        submissions = event["submission"]
        valid_submission = validateTimesheet(submissions)
        invalid_entries = calculateNetHours(submissions)
        
        if valid_submission and not invalid_entries:
            addSubmissionsToDynamoDb(submissions)
            return {
                'statusCode': 200,
                'message': 'Success, timesheet successfully processed.'
            }
        elif not valid_submission:
            return {
                'statusCode': 400,
                'message': 'Failure, timesheet contains duplicate dates. Re-submit timesheet with corrections.'
            }
        elif invalid_entries:
            return {
                'statusCode': 400,
                'message' : 'Failure, timesheet has invalid entries. Re-submit timesheet with corrections.',
                'invalid_entries': invalid_entries
            }
    except Exception as err:
        print(f"Error occured in PostEmployeeSheet LambdaHandler: {err}")
        return {
            'statusCode': 500,
            'message': "Failure, The server has encountered a situation it does not know how to handle.",
            'error': "Internal error."
        }
    
    
def validateTimesheet(submissions: list) -> bool:
    return len({submission["date"] for submission in submissions}) == len(submissions)
    
def calculateNetHours(submissions: list) -> list:
    date_format = "%I:%M %p"
    invalid_entries = []

    for submission in submissions:
        try:
            start_time = datetime.strptime(submission["start_time"], date_format)
            end_time = datetime.strptime(submission["end_time"], date_format)
            break_time = timedelta(minutes=int(submission["break_duration"]))
            net_shift_time = checkPositiveNetTime((end_time - start_time - break_time).total_seconds() / 3600)
            submission["net_time"] = "{0:.2f}".format(net_shift_time)
        except ValueError as err:
            submission["error"] = str(err)
            invalid_entries.append(submission)
            continue
        except TypeError as err:
            submission["error"] = str(err)
            invalid_entries.append(submission)
            continue
        except NegativeNumberError as err:
            submission["error"] = str(err)
            invalid_entries.append(submission)
    return invalid_entries
    
def addSubmissionsToDynamoDb(submissions: list):
    for submission in submissions:
        table.put_item(Item=submission)
        
def checkPositiveNetTime(net_time):
    if net_time < 0:
        raise NegativeNumberError(net_time)
    return net_time
