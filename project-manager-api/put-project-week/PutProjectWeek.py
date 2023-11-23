import os
import boto3

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-project-weeks')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        projectId = event["projectId"]
        uid = event["uid"]
        start_week_date = event["start_week_date"]
        end_week_date = event["end_week_date"]
        entry = formatEntry(projectId, uid, start_week_date, end_week_date)
        addProjectWeeks(entry)
        return {
            "statusCode": 200,
            "message": f"Project days successfully logged."
        }
    except KeyError as err:
        print(f"Error occured in PutProjectWeek.py LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": f"Missing input for {str(err)}.",
            "error": "User error"
        }
    except Exception as err:
        print(f"Error occured in PutProjectWeek.py LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }

def formatEntry(projectId, uid, start_week_date, end_week_date):
    return {
        "projectId": projectId,
        "uid": uid,
        "start_week_date": start_week_date,
        "end_week_date": end_week_date
    }

def addProjectWeeks(entry):
    table.put_item(Item=entry)
