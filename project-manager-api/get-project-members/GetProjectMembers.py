import os
import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-project-members')
PARTITION_KEY = "projectId"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    try:
        projectId = event["params"]["querystring"]["projectId"]
        items = getProjectMembers(projectId)
        return {
            "statusCode": 200,
            "members": items
        }
    except KeyError as err:
        print(f"Error occured in GetProjectMembers.py LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": f"Missing input for {str(err)}.",
            "error": "User error"
        }
    except Exception as err:
        print(f"Error occured in GetProjectMembers.py LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def getProjectMembers(projectId):
    response = table.query(
        KeyConditionExpression=Key(PARTITION_KEY).eq(projectId)
    )
    return response["Items"]
