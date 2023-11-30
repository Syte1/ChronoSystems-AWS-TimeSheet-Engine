import os
import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME_PROJECTMEMBERS = os.environ.get('TABLE_NAME', 'comp4968-project-members')
TABLE_NAME_PROJECTS = os.environ.get('TABLE_NAME', 'comp4968-projects')
SORT_KEY = "uid"
INDEX_NAME = "uid-index"
dynamodb = boto3.resource('dynamodb')
table_project_members = dynamodb.Table(TABLE_NAME_PROJECTMEMBERS)
table_projects = dynamodb.Table(TABLE_NAME_PROJECTS)

def lambda_handler(event, context):
    try:
        uid = event["params"]["querystring"]["uid"]
        projectIds = getAssignedProjects(uid)
        items = getProjectNames(projectIds)
        return {
            "statusCode": 200,
            "entries": items
        }
    except Exception as err:
        print(f"Error occured in GetAssignedProjects LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def getAssignedProjects(uid):
    response = table_project_members.query(
        IndexName=INDEX_NAME,
        KeyConditionExpression=Key(SORT_KEY).eq(uid)
    )
    return [item["projectId"] for item in response["Items"]]

def getProjectNames(projectIds):
    batch_keys = {
        table_projects.name : {
            'Keys' : [{
                "projectId": projectId,
            } for projectId in projectIds]
        }
    }
    response = dynamodb.batch_get_item(
        RequestItems=batch_keys
    )
    return response['Responses'][table_projects.name]
