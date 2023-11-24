# ChronoSystems-AWS-TimeSheet-Engine
## Database ERD diagram
![Database ERD](/github-readme-assets/serverless_project.drawio.png)

- [ChronoSystems-AWS-TimeSheet-Engine](#chronosystems-aws-timesheet-engine)
	- [Database ERD diagram](#database-erd-diagram)
- [EmployeeTimesheet API](#employeetimesheet-api)
	- [GET](#get)
	- [POST](#post)
- [ProjectManager API](#projectmanager-api)
	- [GET](#get-1)
		- [Get all projects](#get-all-projects)
		- [Get a name of a specific project](#get-a-name-of-a-specific-project)
		- [Get all project members](#get-all-project-members)
		- [Get all working projects of a user](#get-all-working-projects-of-a-user)
		- [Get all weeks a member worked on a specific project](#get-all-weeks-a-member-worked-on-a-specific-project)
	- [PUT](#put)
		- [Create a project](#create-a-project)
			- [Request body for create a project](#request-body-for-create-a-project)
		- [Join a project](#join-a-project)
			- [Request body for join a project](#request-body-for-join-a-project)
		- [Create an entry for ProjectWeeks (Specifies which project was worked on for the week)](#create-an-entry-for-projectweeks-specifies-which-project-was-worked-on-for-the-week)
			- [Request body for creating a project week entry](#request-body-for-creating-a-project-week-entry)
	- [DELETE](#delete)
		- [Leave a project](#leave-a-project)
			- [Request body for leaving a project](#request-body-for-leaving-a-project)

# EmployeeTimesheet API
```URL
https://oxtwzrrqrg.execute-api.us-west-2.amazonaws.com/development
```
## GET
Dates in MM/DD/YYYY format. Remember to URIEncode.
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
		},
	]
}
```
# ProjectManager API
```URL
https://9zsjgjfqlh.execute-api.us-west-2.amazonaws.com/development
```
## GET
### Get all projects
```
/getAllProjects
```
Retrieves all projects. This can be used to create a table of all existing projects.
### Get a name of a specific project
```
/getProject?projectId=<id of project>
```
This route is used to retrieve the name of a specific project. This route can be called after retrieving from the ProjectWeeks table if the name of the projectId was not stored anywhere.
### Get all project members
```
/getProjectMembers?projectId=<id of project>
```
This route is used to retrieve all members of a specific projects to be displayed to admin, or have a page for all users to see who's is assigned to what project.
### Get all working projects of a user
```
/getAssignedProjects?uid=<uid of user>
```
This route is used to retrieve all projects a user is assigned to. This can be used on the timesheet submission page to associate the worked weeks to a specfically assigned project.
### Get all weeks a member worked on a specific project
```
/getProjectWeeks?projectId=<id of project>&uid=<uid of user>
```
This route is used to retrieve all weeks a user worked on a specific project. Can be used to get date ranges and these ranges can be passed to EmployeeTimeSheet API to retrieve total hours worked on a project.
## PUT
### Create a project
```
/putProject
```
This route is used to create a project. The projectId is autogenerated based on time and hashed. The project name can also be updated given the projectId.
#### Request body for create a project
```json
{
    "name": "Name of project"
}
```
### Join a project
```
/putJoinProject
```
This route is used for a user/employee to join a project.
#### Request body for join a project
```json
{
    "projectId": "Id of project",
    "uid": "UID of user"
}
```
### Create an entry for ProjectWeeks (Specifies which project was worked on for the week)
```
/putProjectWeek
```
This route is used in the timesheet submission page where users are able to select which project they worked on for the week.
#### Request body for creating a project week entry
```json
{
    "projectId": "Id of project",
    "uid": "UID of user",
    "start_week_date": "mm/dd/yyyy",
    "end_week_date": "mm/dd/yyyy"
}
```
## DELETE
### Leave a project
```
/deleteJoinProject
```
This route is used to remove a user/employee from a project. This does **not** do a cascading delete operation.
#### Request body for leaving a project
```json
{
    "projectId": "Id of project",
    "uid": "UID of user"
}
```