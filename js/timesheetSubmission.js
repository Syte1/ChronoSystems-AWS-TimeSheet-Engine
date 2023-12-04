import { verifyToken } from "./auth.js";

const ENDPOINT_EMPLOYEETIMESHEET_URL = "https://oxtwzrrqrg.execute-api.us-west-2.amazonaws.com/development";
const ENDPOINT_PROJECTMANAGER_URL = "https://9zsjgjfqlh.execute-api.us-west-2.amazonaws.com/development";
const ENDPOINT_EMPLOYEETIMESHEET_GETWEEKS = "/getWeeks";
const ENDPOINT_EMPLOYEETIMESHEET_POSTWEEKS = "/postEmployeeTimesheet";
const ENDPOINT_PROJECTMANAGER_PUTPROJECTWEEK = "/putProjectWeek";
function ENDPOINT_PROJECTMANAGER_GETASSIGNEDPROJECTS(uid) { return `/getAssignedProjects?uid=${uid}` };

const HTTPMETHOD_GET = "GET";
const HTTPMETHOD_POST = "POST";
const HTTPSMETHOD_PUT = "PUT";

const REGEX_VALIDATE_TIME = '^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$';

const ID_WEEKCHOICE_CONTAINER = "div_weekChoiceContainer";
const ID_WEEKCHOICE_BUTTON = "button_weekChoice";
const ID_TIMESHEET_BUTTON = "button_timesheetSubmission";
const ID_PROJECTID_SELECT = "select_projectId"

const CLASS_DATAROW = "div_dataRow";
const CLASS_DATE = "input_date";
const CLASS_STARTTIME = "input_startTime";
const CLASS_ENDTIME = "input_endTime";
const CLASS_BREAKTIME = "input_breakTime";

// Tailwind css
const TAILWIND_BUTTON = ["bg-blue-600", "hover:bg-blue-700", "px-5", "py-3", "text-white", "rounded-lg"];
// const TAILWIND_DATAROW_DIV = ["flex", "content-evenly", "gap-2"];
const TAILWIND_DATAROW_DIV = ["grid", "grid-cols-9", "content-evenly"];
const TAILWIND_TEXT_INPUT = ["w-32", "h-8", "p-2", "border", "rounded-sm"];

// HTML ELEMENTS
const FORM_TIMESHEET = document.getElementById("form_timesheet");
const DIV_RESULT = document.getElementById("div_result");
const DIV_CONTAINER = document.getElementById("container");

function clearResultDiv() {
    while (DIV_RESULT.firstChild) {
        DIV_RESULT.removeChild(DIV_RESULT.firstChild);
    }
}

async function handleErrors(promise) {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        console.error('Error:', error.message);
        return [null, error];
    }
}

async function apiRequest(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Request Error:', error.message);
        throw error;
    }
}

async function getAssignedProjects(uid) {
    try {
        const assignedProjects = await apiRequest(
            ENDPOINT_PROJECTMANAGER_URL + ENDPOINT_PROJECTMANAGER_GETASSIGNEDPROJECTS(uid),
            HTTPMETHOD_GET
        );
        return assignedProjects["entries"];
    } catch (error) {
        console.error('Error fetching assigned projects:', error.message);
        throw error;
    }
}

async function getWeeks() {
    try {
        const weeks = await apiRequest(
            ENDPOINT_EMPLOYEETIMESHEET_URL + ENDPOINT_EMPLOYEETIMESHEET_GETWEEKS,
            HTTPMETHOD_GET
        );
        return weeks["entries"];
    } catch (error) {
        console.error('Error fetching working weeks:', error.message);
        throw error;
    }
}

function generateProjectOption(projects) {
    const row = document.createElement("div");
    const projectLabel = document.createElement("label");
    projectLabel.textContent = "Project: ";
    const projectSelect = document.createElement("select");
    projectSelect.id = ID_PROJECTID_SELECT;

    for (const project of projects) {
        const name = project["name"];
        const id = project["projectId"];

        const projectOption = document.createElement("option");
        projectOption.value = id;
        projectOption.text = name;

        projectSelect.appendChild(projectOption);
    }
    row.appendChild(projectLabel);
    row.appendChild(projectSelect);
    FORM_TIMESHEET.insertBefore(row, FORM_TIMESHEET.firstChild);
}

function generateTimesheetForm(daysAndDates) {
    for (const day in daysAndDates) {
        const date = daysAndDates[day];

        const row = document.createElement("div");

        row.classList = CLASS_DATAROW;
        row.classList.add(...TAILWIND_DATAROW_DIV);

        // Weekday field
        // const weekdayLabel = document.createElement("label");
        // weekdayLabel.textContent = "day:";
        const weekdaySpan = document.createElement("span");
        weekdaySpan.textContent = day;
        // row.appendChild(weekdayLabel);
        row.appendChild(weekdaySpan);

        // Date field
        const dateLabel = document.createElement("label");
        dateLabel.textContent = "Date:";
        dateLabel.for = "date";
        const dateInput = document.createElement("span");
        dateInput.textContent = date;
        dateInput.classList = CLASS_DATE;
        row.appendChild(dateLabel);
        row.appendChild(dateInput);

        // Start time field
        const startTimeLabel = document.createElement("label");
        startTimeLabel.textContent = "Start Time:";
        const startTimeInput = document.createElement("input");
        startTimeInput.type = "text";
        startTimeInput.classList = CLASS_STARTTIME;
        startTimeInput.classList.add(...TAILWIND_TEXT_INPUT);
        startTimeInput.placeholder = "12:00 AM/PM";
        startTimeInput.pattern = REGEX_VALIDATE_TIME;
        startTimeInput.oninput = "this.reportValidity()";
        startTimeInput.title = "Please enter a valid time in HH:MM AM/PM format";
        startTimeInput.maxLength = 8;
        row.appendChild(startTimeLabel);
        row.appendChild(startTimeInput);

        // End time field
        const endTimeLabel = document.createElement("label");
        endTimeLabel.textContent = "End Time:";
        const endTimeInput = document.createElement("input");
        endTimeInput.type = "text";
        endTimeInput.classList = CLASS_ENDTIME;
        endTimeInput.classList.add(...TAILWIND_TEXT_INPUT);
        endTimeInput.placeholder = "12:00 AM/PM";
        endTimeInput.pattern = REGEX_VALIDATE_TIME;
        endTimeInput.oninput = "this.reportValidity()";
        endTimeInput.title = "Please enter a valid time in HH:MM AM/PM format";
        endTimeInput.maxLength = 8;
        row.appendChild(endTimeLabel);
        row.appendChild(endTimeInput);

        // Break duration field
        const breakDurationLabel = document.createElement("label");
        breakDurationLabel.textContent = "Break (minutes):";
        const breakDurationInput = document.createElement("input");

        breakDurationInput.type = "number";
        breakDurationInput.classList = CLASS_BREAKTIME;
        breakDurationInput.classList.add(...TAILWIND_TEXT_INPUT);
        breakDurationInput.min = "0";
        row.appendChild(breakDurationLabel);
        row.appendChild(breakDurationInput);

        FORM_TIMESHEET.appendChild(row);
    }
}

function createButtonTimesheetForm() {
    const timesheetButton = document.createElement("button");
    timesheetButton.classList.add(...TAILWIND_BUTTON);
    timesheetButton.textContent = "Submit";
    timesheetButton.id = ID_TIMESHEET_BUTTON;
    FORM_TIMESHEET.appendChild(timesheetButton);
    return timesheetButton;
}

function generateWeekChoices() {
    const container = document.createElement("div");
    container.id = ID_WEEKCHOICE_CONTAINER;

    const title = document.createElement("h4");
    title.textContent = "Select week for submission: ";

    const currWeekLabel = document.createElement("label");
    currWeekLabel.textContent = "Current Week";

    const prevWeekLabel = document.createElement("label");
    prevWeekLabel.textContent = "Previous Week";

    const weekChoiceButton = document.createElement("button");
    weekChoiceButton.classList.add(...TAILWIND_BUTTON);
    weekChoiceButton.id = ID_WEEKCHOICE_BUTTON;
    weekChoiceButton.textContent = "Submit";

    const currWeekInput = document.createElement("input");
    currWeekInput.value = "current";
    currWeekInput.name = "week";
    currWeekInput.type = "radio";
    currWeekInput.checked = true;

    const prevWeekInput = document.createElement("input");
    prevWeekInput.value = "previous";
    prevWeekInput.name = "week";
    prevWeekInput.type = "radio";

    container.appendChild(title);
    container.appendChild(currWeekInput);
    container.appendChild(currWeekLabel);
    container.appendChild(document.createElement("br"));
    container.appendChild(prevWeekInput);
    container.appendChild(prevWeekLabel);
    container.appendChild(document.createElement("br"));
    container.appendChild(weekChoiceButton);
    DIV_CONTAINER.appendChild(container);
}

function handleWeekChoice(workingWeeks, assignedProjects) {
    const currWeekInput = document.querySelector('input[name="week"][value="current"]');
    const prevWeekInput = document.querySelector('input[name="week"][value="previous"]');

    if (currWeekInput.checked) {
        generateTimesheetForm(workingWeeks[1]);
        clearResultDiv();
        DIV_RESULT.textContent = "Current week selected.";

    } else if (prevWeekInput.checked) {
        generateTimesheetForm(workingWeeks[0]);
        clearResultDiv();
        DIV_RESULT.textContent = "Previous week selected.";
    } else {
        clearResultDiv();
        DIV_RESULT.textContent = "Invalid input: select current or previous week."
    }
    generateProjectOption(assignedProjects);
    document.getElementById(ID_WEEKCHOICE_CONTAINER).remove();
}

function formatTime(timeString) {
    const formattedTimeString = timeString.replace(/(\d{1,2}:\d{2})([APM]{2})/i, '$1 $2');
    return formattedTimeString;
}

function isValidTime(timeString) {
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i;
    return timeRegex.test(timeString);
}

function isValidBreakTime(breakTime) {
    const breakTimeInt = parseInt(breakTime, 10);

    // Check if the input is a positive integer
    return !isNaN(breakTimeInt) && breakTimeInt >= 0;
}

function isValidDate(date) {
    const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
    return dateRegex.test(date);
}

async function handleTimesheetSubmission(uid) {
    const requestBody = {
        "submission": [],
        "skipped_submission": []
    };

    const rows = document.querySelectorAll('.' + CLASS_DATAROW);
    rows.forEach((row) => {
        const date = row.querySelector('.' + CLASS_DATE).textContent.trim();
        const start_time = formatTime(row.querySelector('.' + CLASS_STARTTIME).value.trim().toUpperCase());
        const end_time = formatTime(row.querySelector('.' + CLASS_ENDTIME).value.trim().toUpperCase());
        const break_time = row.querySelector('.' + CLASS_BREAKTIME).value;

        if (isValidDate(date) && isValidTime(start_time) && isValidTime(end_time) && isValidBreakTime(break_time)) {
            requestBody["submission"].push({
                "uid": uid,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "break_duration": break_time
            });
        } else {
            requestBody["skipped_submission"].push({
                "uid": uid,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "break_duration": break_time
            });
        }
    });
    clearResultDiv();
    // const prettyJson = document.createElement("pre");
    // DIV_RESULT.appendChild(prettyJson);
    // prettyJson.textContent = JSON.stringify(requestBody, undefined, 2);
    displaySubmissionInfo(requestBody);
    return await apiRequest(ENDPOINT_EMPLOYEETIMESHEET_URL + ENDPOINT_EMPLOYEETIMESHEET_POSTWEEKS, HTTPMETHOD_POST, requestBody);
}

async function handleProjectWeeksSubmission(uid) {
    const projectId = document.querySelector("#" + ID_PROJECTID_SELECT).value;
    const rows = document.querySelectorAll('.' + CLASS_DATAROW);

    let start_week_date, end_week_date;
    let isValidRowEncountered = false;

    rows.forEach((row) => {
        const date = row.querySelector('.' + CLASS_DATE).textContent.trim();
        const start_time = formatTime(row.querySelector('.' + CLASS_STARTTIME).value.trim().toUpperCase());
        const end_time = formatTime(row.querySelector('.' + CLASS_ENDTIME).value.trim().toUpperCase());
        const break_time = row.querySelector('.' + CLASS_BREAKTIME).value;

        if (isValidDate(date) && isValidTime(start_time) && isValidTime(end_time) && isValidBreakTime(break_time)) {
            if (!isValidRowEncountered) {
                start_week_date = date;
                isValidRowEncountered = true;
            }

            end_week_date = date;
        }
    });

    if (isValidRowEncountered) {
        const requestBody = {
            "projectId": projectId,
            "uid": uid,
            "start_week_date": start_week_date,
            "end_week_date": end_week_date
        }
        console.log(requestBody);
        return await apiRequest(ENDPOINT_PROJECTMANAGER_URL + ENDPOINT_PROJECTMANAGER_PUTPROJECTWEEK, HTTPSMETHOD_PUT, requestBody);
    }
}

function displaySubmissionInfo(data) {
    const submissions = data.submission;
    const skippedSubmissions = data.skipped_submission;

    let submissionHTML = "<h4 class='text-lg font-bold mb-4'>Submission Information:</h4>";
    submissionHTML += "<ul>";
    submissions.forEach(submission => {
        submissionHTML += `
        <li>
          <strong>Date:</strong> ${submission.date}<br>
          <strong>Start Time:</strong> ${submission.start_time}<br>
          <strong>End Time:</strong> ${submission.end_time}<br>
          <strong>Break Duration:</strong> ${submission.break_duration} minutes
        </li>
      `;
    });
    submissionHTML += "</ul>";

    let skippedSubmissionHTML = "<h4 class='text-lg font-bold mb-4'>Skipped Submission Information: </h4>";
    skippedSubmissionHTML += "<ul>";
    skippedSubmissions.forEach(skippedSubmission => {
        skippedSubmissionHTML += `
        <li>
          <strong>Date:</strong> ${skippedSubmission.date}<br>
          <strong>Start Time:</strong> ${skippedSubmission.start_time}<br>
          <strong>End Time:</strong> ${skippedSubmission.end_time}<br>
          <strong>Break Duration:</strong> ${skippedSubmission.break_duration} minutes
        </li>
      `;
    });
    skippedSubmissionHTML += "</ul>";

    DIV_RESULT.innerHTML = submissionHTML + skippedSubmissionHTML;
}

function displayStatus(jsonObject, container, title) {
    let propertiesHTML = `<h4 class='text-lg font-bold mb-4'>${title}</h4><ul>`;

    for (const property in jsonObject) {
        if (jsonObject.hasOwnProperty(property)) {
            propertiesHTML += `<li><strong>${property}:</strong> ${jsonObject[property]}</li>`;
        }
    }

    propertiesHTML += "</ul>";

    container.innerHTML = propertiesHTML + DIV_RESULT.innerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const auth = await verifyToken();

        if (auth.valid) {
            const uid = auth.userId;
            // const uid = "1";
            generateWeekChoices();
            const [assignedProjects, errorAssignedProjects] = await handleErrors(getAssignedProjects(uid));
            const [workingWeeks, errorWorkingWeeks] = await handleErrors(getWeeks());
            console.log(assignedProjects);
            console.log(workingWeeks);

            if (assignedProjects == undefined || errorAssignedProjects) {
                clearResultDiv();
                DIV_RESULT.textContent = "No projects assigned, speak to a manager.";
            } else if (errorWorkingWeeks) {
                clearResultDiv();
                DIV_RESULT.textContent = "Error retrieving working weeks.";
            } else {
                document.getElementById(ID_WEEKCHOICE_BUTTON).addEventListener("click", (event) => {
                    event.preventDefault()
                    handleWeekChoice(workingWeeks, assignedProjects);
                    const submitTimeSheetButton = createButtonTimesheetForm();

                    submitTimeSheetButton.addEventListener("click", async (event) => {
                        event.preventDefault();
                        const [timesheetReponse, errorTimesheet] = await handleErrors(handleTimesheetSubmission(uid));
                        const [projectWeeksResponse, errorProjectWeeksResponse] = await handleErrors(handleProjectWeeksSubmission(uid));
                        if (errorTimesheet) {
                            clearResultDiv();
                            DIV_RESULT.textContent = "Error submitting timesheet.";
                        } else if (errorProjectWeeksResponse) {
                            clearResultDiv();
                            DIV_RESULT.textContent = "Error submitting projectweeks.";
                        } else {
                            displayStatus(timesheetReponse, DIV_RESULT, "Response:");
                        }
                    });
                });
            }
        } else {
            alert("Not authorised.");
            // window.location.href = "../index.html";
        }
    } catch (error) {
        clearResultDiv();
        DIV_RESULT.textContent = "Error: unauthorized or failed to submit data.";
    }
});
