import os
import boto3

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-project-members')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        projectId = event["projectId"]
        uid = event["uid"]
        entry = formatEntry(projectId, uid)
        addMember(entry)
        return {
            "statusCode": 200,
            "message": f"Employee {uid} successfully joined projectId: {projectId}"
        }
    except KeyError as err:
        print(f"Error occured in PutJoinProject.py LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": f"Missing input for {str(err)}.",
            "error": "User error"
        }
    except Exception as err:
        print(f"Error occured in PutJoinProject LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }

def formatEntry(projectId, uid):
    return {
        "projectId": projectId,
        "uid": uid
    }

def addMember(entry):
    table.put_item(Item=entry)
