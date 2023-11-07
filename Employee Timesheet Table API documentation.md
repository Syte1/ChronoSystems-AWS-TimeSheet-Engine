# Table Schema
![Table Schema](https://i.imgur.com/rZffHgL.png)


# POST request submissions
## Request body schema
```json
{
	"submission": [
		{
			"uid": "string",
			"date": "MM/DD/YYYY",
			"start_time": "00:00 AM",
			"end_time": "00:00 PM",
			"break_duration": "int"
		}
	]
}
```

### Example
```json
{
	"submission": [
		{
			"uid": "1",
			"date": "11/01/2023",
			"start_time": "8:00 AM",
			"end_time": "11:44 PM",
			"break_duration": 84
		}
	]
}
```
## Valid: No error submission

```json
{
  "submission": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "start_time": "8:00 AM",
      "end_time": "11:44 PM",
      "break_duration": 84
    },
    {
      "uid": "1",
      "date": "11/02/2023",
      "start_time": "12:22 AM",
      "end_time": "2:31 PM",
      "break_duration": 1
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "start_time": "1:08 AM",
      "end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "start_time": "8:04 AM",
      "end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "start_time": "7:46 AM",
      "end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "start_time": "3:51 AM",
      "end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "start_time": "5:16 AM",
      "end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "start_time": "6:47 AM",
      "end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "start_time": "4:32 AM",
      "end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "start_time": "6:54 AM",
      "end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```
### Response to No error submission
```json
{
  "statusCode": 200,
  "message": "Success, timesheet successfully processed."
}
```

## Invalid: Duplicate date submission
```json
{
  "submission": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "start_time": "8:00 AM",
      "end_time": "11:44 PM",
      "break_duration": 84
    },
    {
      "uid": "1",
      "date": "11/01/2023",
      "start_time": "12:22 AM",
      "end_time": "2:31 PM",
      "break_duration": 1
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "start_time": "1:08 AM",
      "end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "start_time": "8:04 AM",
      "end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "start_time": "7:46 AM",
      "end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "start_time": "3:51 AM",
      "end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "start_time": "5:16 AM",
      "end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "start_time": "6:47 AM",
      "end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "start_time": "4:32 AM",
      "end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "start_time": "6:54 AM",
      "end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```

### Response to Duplicate date submission
```json
{
  "statusCode": 401,
  "message": "Failure, timesheet contains duplicate dates. Re-submit timesheet with corrections."
}
```

## Invalid: Type Error in submission
```json
{
  "submission": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "start_time": "8:00 AM",
      "end_time": "11:44 PM",
      "break_duration": "84"
    },
    {
      "uid": "1",
      "date": "11/02/2023",
      "start_time": "12:22 AM",
      "end_time": "2:31 PM",
      "break_duration": "I'm a string"
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "start_time": "1:08 AM",
      "end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "start_time": "8:04 AM",
      "end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "start_time": "7:46 AM",
      "end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "start_time": "3:51 AM",
      "end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "start_time": "5:16 AM",
      "end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "start_time": "6:47 AM",
      "end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "start_time": "4:32 AM",
      "end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "start_time": "6:54 AM",
      "end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```
### Response to Type Error in submission
```json
{
  "statusCode": 401,
  "message": "Failure, timesheet has invalid entries. Re-submit timesheet with corrections.",
  "invalid_entries": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "start_time": "8:00 AM",
      "end_time": "11:44 PM",
      "break_duration": "84",
      "error": "unsupported type for timedelta minutes component: str"
    },
    {
      "uid": "1",
      "date": "11/02/2023",
      "start_time": "12:22 AM",
      "end_time": "2:31 PM",
      "break_duration": "I'm a string",
      "error": "unsupported type for timedelta minutes component: str"
    }
  ]
}
```

# GET Request
## Query params
```
start_date=value1&end_date=value2&uid=value3
```

## Valid GET Request
EncodeURIComponent() for dates:
```
getEmployeeTimesheet?start_date=11%2F01%2F2023&end_date=11%2F15%2F2023&uid=1
```

### Response to valid GET Request
```json
{
    "statusCode": 200,
    "entries": [
        {
            "start_time": "12:22 AM",
            "break_duration": "1",
            "net_time": "14.13",
            "date": "11/02/2023",
            "end_time": "2:31 PM",
            "uid": "1"
        },
        {
            "start_time": "4:32 AM",
            "break_duration": "48",
            "net_time": "14.88",
            "date": "11/11/2023",
            "end_time": "8:13 PM",
            "uid": "1"
        },
        {
            "start_time": "1:08 AM",
            "break_duration": "115",
            "net_time": "15.08",
            "date": "11/03/2023",
            "end_time": "6:08 PM",
            "uid": "1"
        },
        {
            "start_time": "6:54 AM",
            "break_duration": "46",
            "net_time": "10.25",
            "date": "11/12/2023",
            "end_time": "5:55 PM",
            "uid": "1"
        },
        {
            "start_time": "3:51 AM",
            "break_duration": "34",
            "net_time": "15.23",
            "date": "11/08/2023",
            "end_time": "7:39 PM",
            "uid": "1"
        },
        {
            "start_time": "8:00 AM",
            "break_duration": "84",
            "net_time": "14.33",
            "date": "11/01/2023",
            "end_time": "11:44 PM",
            "uid": "1"
        },
        {
            "start_time": "8:04 AM",
            "break_duration": "39",
            "net_time": "8.88",
            "date": "11/04/2023",
            "end_time": "5:36 PM",
            "uid": "1"
        },
        {
            "start_time": "6:47 AM",
            "break_duration": "35",
            "net_time": "5.53",
            "date": "11/10/2023",
            "end_time": "12:54 PM",
            "uid": "1"
        },
        {
            "start_time": "7:46 AM",
            "break_duration": "90",
            "net_time": "8.10",
            "date": "11/05/2023",
            "end_time": "5:22 PM",
            "uid": "1"
        },
        {
            "start_time": "5:16 AM",
            "break_duration": "11",
            "net_time": "17.62",
            "date": "11/09/2023",
            "end_time": "11:04 PM",
            "uid": "1"
        }
    ]
}

```

## Invalid GET request
```
/getEmployeeTimesheet?start_date=11%2F07%2F2023&end_date=11%2F04%2F2023&uid=1
```

### Response to invalid GET request
```json
{
    "statusCode": 401,
    "message": "Failure, invalid date range."
}
```
