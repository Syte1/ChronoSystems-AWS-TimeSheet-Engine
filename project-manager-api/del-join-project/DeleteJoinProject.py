import os
import boto3

TABLE_NAME = os.environ.get("TABLE_NAME", "comp4968-project-members")
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        uid = event["uid"].strip()
        projectId = event["projectId"].strip()
        entry = formatMemberEntry(projectId, uid)
        leaveProject(entry)
        return {
            "statusCode": 200,
            "message": f"Employee: {uid} successfully remove from {projectId}."
        }
    except KeyError as err:
        print(f"Error occured in DeleteJoinProject LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": f"Missing input for {str(err)}.",
            "error": "User error"
        }
    except ConditionCheckFailedException as err:
        return {
            "statusCode": 400,
            "message": f"Employee: {uid} is not a part of projectId: {projectId}.",
            "error": "User error."
        }
    except Exception as err:
        print(f"Error occured in DeleteJoinProject LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def formatMemberEntry(projectId, uid):
    return {
        "projectId": projectId,
        "uid": uid
    }
    
def leaveProject(entry):
    table.delete_item(
        Key=entry, 
        Expected = {
            'Exists': True
            })
