import os
import boto3
from uuid import uuid4

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-projects')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        name = validateString(event["name"].strip())
        entry = formatProjectEntry(name)
        addProject(entry)
        return {
            "statusCode": 200,
            "message": f"{name} created."
        }
    except KeyError as err:
        print("Err")
    except StringLengthError as err:
        print(f"Error occured in PutProject LambdaHandler: {err}")
        return {
            "statusCode": 400,
            "message": str(err),
            "error": "User error."            
        }
    except Exception as err:
        print(f"Error occured in PutProject LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
    
def validateString(input_string):
    if len(input_string) < 5:
        raise StringLengthError(input_string)
    return input_string        
    
def generateUid():
    return str(uuid4())

def formatProjectEntry(name):
    return {
        "name": name, 
        "projectId": generateUid()
    }

def addProject(project_entry):
    table.put_item(Item=project_entry)
    
class StringLengthError(Exception):
    def __init__(self, name) -> None:
        self.name = name
        self.message = f"Project name requires a minimum of 5 characters: {name}."
        super().__init__(self.message)
