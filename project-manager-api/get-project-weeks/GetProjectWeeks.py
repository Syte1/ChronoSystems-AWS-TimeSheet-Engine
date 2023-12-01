import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-project-weeks')
PARTITION_KEY = "projectId"
SORT_KEY = "uid"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    try:
        projectId = event["params"]["querystring"]["projectId"]
        uid = event["params"]["querystring"]["uid"]
        print(projectId)
        print(uid)
        items = getProjectWeeks(projectId, uid)
        return {
            "statusCode": 200,
            "entries": items
        }
    except KeyError as err:
        print(f"Error occured in GetProjectWeeks.py LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": f"Missing input for {str(err)}.",
            "error": "User error"
        }
    except Exception as err:
        print(f"Error occured in GetProjectWeeks.py LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def getProjectWeeks(projectId, uid):
    response = table.query(
        KeyConditionExpression=Key('uid').eq(uid),
        FilterExpression=Attr('projectId').eq(projectId)
    )
    return response["Items"]
