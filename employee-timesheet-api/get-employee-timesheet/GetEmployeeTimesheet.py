import os
import json
import boto3
from datetime import datetime, timedelta
from urllib.parse import unquote
from DecimalEncoder import DecimalEncoder

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-timesheet')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    start_date = unquote(event["params"]["querystring"]["start_date"])
    end_date = unquote(event["params"]["querystring"]["end_date"])
    uid = event["params"]["querystring"]["uid"]
    date_list = generateListOfDates(start_date, end_date)
    
    valid_date_list = isValidDateList(date_list)
    
    if valid_date_list:
        response = getTimesheetEntries(uid, date_list)
        return {
            'statusCode': 200,
            'entries': json.dumps(response, cls = DecimalEncoder)
        }
    else:
        return {
            'statusCode': 401,
            'message': 'Failure, invalid date range.'
        }
    
def isValidDateList(date_list: list) -> bool:
    return len(date_list) > 0
    
def generateListOfDates(start_date: str, end_date: str) -> list:
    date_list = []
    
    date_format = "%m/%d/%Y"
    start_datetime = datetime.strptime(start_date, date_format)
    end_datetime = datetime.strptime(end_date, date_format)
    
    while start_datetime <= end_datetime:
        date_list.append(start_datetime.strftime(date_format))
        start_datetime += timedelta(days=1)
    return date_list
    
def getTimesheetEntries(uid: str, date_list: list):
    batch_keys = {
        table.name : {
            'Keys' : [{
                "uid": uid,
                "date": date
            } for date in date_list]
        }
    }
    response = dynamodb.batch_get_item(RequestItems=batch_keys)
    return response['Responses'][table.name]
    