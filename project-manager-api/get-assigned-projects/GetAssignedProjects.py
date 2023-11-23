import os
import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-project-members')
SORT_KEY = "uid"
INDEX_NAME = "uid-index"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        uid = event["params"]["querystring"]["uid"]
        items = getAssignedProjects(uid)
        return {
            "statusCode": 200,
            "projects": items
        }
    except Exception as err:
        print(f"Error occured in GetAssignedProjects LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def getAssignedProjects(uid):
    response = table.query(
        IndexName=INDEX_NAME,
        KeyConditionExpression=Key(SORT_KEY).eq(uid)
    )
    return response["Items"]
