# POST request submissions
## Request body schema
```json
{
	"submission": [
		{
			"uid": string,
			"date": "MM/DD/YYYY",
			"shift_start_time": "00:00 AM",
			"shift_end_time": "00:00 PM",
			"break_duration": int
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
			"shift_start_time": "8:00 AM",
			"shift_end_time": "11:44 PM",
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
      "shift_start_time": "8:00 AM",
      "shift_end_time": "11:44 PM",
      "break_duration": 84
    },
    {
      "uid": "1",
      "date": "11/01/2023",
      "shift_start_time": "12:22 AM",
      "shift_end_time": "2:31 PM",
      "break_duration": 1
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "shift_start_time": "1:08 AM",
      "shift_end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "shift_start_time": "8:04 AM",
      "shift_end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "shift_start_time": "7:46 AM",
      "shift_end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "shift_start_time": "3:51 AM",
      "shift_end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "shift_start_time": "5:16 AM",
      "shift_end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "shift_start_time": "6:47 AM",
      "shift_end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "shift_start_time": "4:32 AM",
      "shift_end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "shift_start_time": "6:54 AM",
      "shift_end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```
## Invalid: Duplicate date submission
```json
{
  "submission": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "shift_start_time": "8:00 AM",
      "shift_end_time": "11:44 PM",
      "break_duration": 84
    },
    {
      "uid": "1",
      "date": "11/02/2023",
      "shift_start_time": "12:22 AM",
      "shift_end_time": "2:31 PM",
      "break_duration": 1
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "shift_start_time": "1:08 AM",
      "shift_end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "shift_start_time": "8:04 AM",
      "shift_end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "shift_start_time": "7:46 AM",
      "shift_end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "shift_start_time": "3:51 AM",
      "shift_end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "shift_start_time": "5:16 AM",
      "shift_end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "shift_start_time": "6:47 AM",
      "shift_end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "shift_start_time": "4:32 AM",
      "shift_end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "shift_start_time": "6:54 AM",
      "shift_end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```

## Invalid: Type Error in submission
```json
{
  "submission": [
    {
      "uid": "1",
      "date": "11/01/2023",
      "shift_start_time": "8:00 AM",
      "shift_end_time": "11:44 PM",
      "break_duration": "84"
    },
    {
      "uid": "1",
      "date": "11/02/2023",
      "shift_start_time": "12:22 AM",
      "shift_end_time": "2:31 PM",
      "break_duration": 1
    },
    {
      "uid": "1",
      "date": "11/03/2023",
      "shift_start_time": "1:08 AM",
      "shift_end_time": "6:08 PM",
      "break_duration": 115
    },
    {
      "uid": "1",
      "date": "11/04/2023",
      "shift_start_time": "8:04 AM",
      "shift_end_time": "5:36 PM",
      "break_duration": 39
    },
    {
      "uid": "1",
      "date": "11/05/2023",
      "shift_start_time": "7:46 AM",
      "shift_end_time": "5:22 PM",
      "break_duration": 90
    },
    {
      "uid": "1",
      "date": "11/08/2023",
      "shift_start_time": "3:51 AM",
      "shift_end_time": "7:39 PM",
      "break_duration": 34
    },
    {
      "uid": "1",
      "date": "11/09/2023",
      "shift_start_time": "5:16 AM",
      "shift_end_time": "11:04 PM",
      "break_duration": 11
    },
    {
      "uid": "1",
      "date": "11/10/2023",
      "shift_start_time": "6:47 AM",
      "shift_end_time": "12:54 PM",
      "break_duration": 35
    },
    {
      "uid": "1",
      "date": "11/11/2023",
      "shift_start_time": "4:32 AM",
      "shift_end_time": "8:13 PM",
      "break_duration": 48
    },
    {
      "uid": "1",
      "date": "11/12/2023",
      "shift_start_time": "6:54 AM",
      "shift_end_time": "5:55 PM",
      "break_duration": 46
    }
  ]
}
```