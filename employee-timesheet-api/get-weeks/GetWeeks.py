from datetime import datetime, timedelta

def lambda_handler(event, context):
    try:
        today = datetime.now()
        return {
            'statusCode': 200,
            'prevWeek': get_prev_week(today),
            'thisWeek': get_this_week(today)
        }
    except Exception as err:
        print(f"GetWeeks.py: {err}")
        return {
            'statusCode': 500,
            'error': 'Internal server error.'
        }

def get_day_of_week(date):
    day_of_week = date.weekday()

    if day_of_week == 0:
        return "Monday"
    elif day_of_week == 1:
        return "Tuesday"
    elif day_of_week == 2:
        return "Wednesday"
    elif day_of_week == 3:
        return "Thursday"
    elif day_of_week == 4:
        return "Friday"
    elif day_of_week == 5:
        return "Saturday"
    elif day_of_week == 6:
        return "Sunday"

def get_prev_week(today: datetime):
    start_of_week = today - timedelta(days=today.weekday() + 8)
    dates_prev_week = {
        get_day_of_week((start_of_week + timedelta(days=x))): (start_of_week + timedelta(days=x)).strftime("%m/%d/%Y")
        for x in range(7)}
    return dates_prev_week

def get_this_week(today: datetime):
    start_of_week = today - timedelta(days=today.weekday() + 1)
    dates_this_week = {
        get_day_of_week((start_of_week + timedelta(days=x))): (start_of_week + timedelta(days=x)).strftime("%m/%d/%Y")
        for x in range(7)}
    return dates_this_week
    