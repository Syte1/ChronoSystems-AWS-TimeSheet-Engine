# ChronoSystems-AWS-TimeSheet-Engine
## Database ERD diagram
![Database ERD](/github-readme-assets/serverless_project.drawio.png)

# EmployeeTimesheet API

## GET
Dates in MM/DD/YYYY format
```
/getEmployeeTimesheet?start_date=<value1>&end_date=<value2>&uid=<value3>
```

## POST
```
/postEmployeeTimesheet
```

```json
{
	"submission": [
		{
			"uid": "string",
			"date": "MM/DD/YYYY",
			"start_time": "00:00 AM",
			"end_time": "00:00 PM",
			"break_duration": "int"
		},
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

