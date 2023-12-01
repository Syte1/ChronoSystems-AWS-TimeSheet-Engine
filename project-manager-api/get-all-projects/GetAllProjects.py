import os
import boto3

TABLE_NAME = os.environ.get('TABLE_NAME', 'comp4968-projects')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        items = table.scan()["Items"]
        return {
            "statusCode": 200,
            "entries": items
        }
    except Exception as err:
        print(f"Error occured in PutProject LambdaHandler: {err}")
        return {
            "statusCode": 500,
            "message": "Failure, the server has encountered a situation it does not know how to handle.",
            "error": "Internal error."
        }
