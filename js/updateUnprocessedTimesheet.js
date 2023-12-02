// ENDPOINTS
const ENDPOINT_CENTRALAPI_URL = "https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test/employeetimesheet";
const ENDPOINT_CENTRALAPI_POSTWEEKS = "/employeetimesheet"
function ENDPOINT_CENTRALAPI_GETUNPROCESSEDTIMESHEET(uid) { return `/getunprocessedentries?uid=${uid}` };

const HTTPMETHOD_GET = "GET";
const HTTPMETHOD_POST = "POST";
const HTTPSMETHOD_PUT = "PUT";

const REGEX_VALIDATE_TIME = '^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$';

const ID_TIMESHEET_BUTTON = "button_timesheetSubmission";

const CLASS_DATAROW = "div_dataRow";
const CLASS_DATE = "input_date";
const CLASS_STARTTIME = "input_startTime";
const CLASS_ENDTIME = "input_endTime";
const CLASS_BREAKTIME = "input_breakTime";

// HTML ELEMENTS
const DIV_RESULT = document.getElementById("div_result");
const FORM_UPDATETIMESHEET = document.getElementById("form_updateTimesheet");

// TAILWIND CSS
const TAILWIND_BUTTON = ["bg-blue-600", "hover:bg-blue-700", "px-5", "py-3", "text-white", "rounded-lg"];
const TAILWIND_DATAROW_DIV = ["grid", "grid-cols-9", "content-evenly"];
const TAILWIND_TEXT_INPUT = ["w-32", "h-8", "p-2", "border", "rounded-sm"];

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
        console.error('API Request Error: ', error.message);
        throw error;
    }
}

async function getUnprocessedEntries(uid) {
    try {
        const unprocessedEntries = await apiRequest(
            ENDPOINT_CENTRALAPI_URL + ENDPOINT_CENTRALAPI_GETUNPROCESSEDTIMESHEET(uid),
            HTTPMETHOD_GET
        );
        return unprocessedEntries["entries"];
    } catch (error) {
        console.error('Error fetching unprocessed entries: ', error.message);
        throw error;
    }
}

function generateUpdateTimesheetForm(entries) {
    for (const entry of entries) {
        const row = document.createElement("div");
        row.classList = CLASS_DATAROW;
        row.classList.add(...TAILWIND_DATAROW_DIV);

        const date = entry["date"];
        const start_time = entry["start_time"];
        const end_time = entry["end_time"];
        const break_duration = entry["break_duration"];

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
        startTimeInput.value = start_time;
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
        endTimeInput.value = end_time;
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
        breakDurationInput.value = break_duration;
        row.appendChild(breakDurationLabel);
        row.appendChild(breakDurationInput);

        FORM_UPDATETIMESHEET.appendChild(row);
    }
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
    const prettyJson = document.createElement("pre");
    DIV_RESULT.appendChild(prettyJson);
    prettyJson.textContent = JSON.stringify(requestBody, undefined, 2);

    return await apiRequest(ENDPOINT_CENTRALAPI_URL + ENDPOINT_CENTRALAPI_POSTWEEKS, HTTPMETHOD_POST, requestBody);
}

function createButtonTimesheetForm() {
    const timesheetButton = document.createElement("button");
    timesheetButton.classList.add(...TAILWIND_BUTTON);
    timesheetButton.textContent = "Submit";
    timesheetButton.id = ID_TIMESHEET_BUTTON;
    FORM_UPDATETIMESHEET.appendChild(timesheetButton);
    return timesheetButton;
}

document.addEventListener("DOMContentLoaded", async() => {
    try {
        // const auth = cognito authentication manager;
        // const uid = auth.uid; // call 
        const uid = "1";

        const [unprocessedEntries, unprocessedEntriesError] = await handleErrors(getUnprocessedEntries(uid));
        generateUpdateTimesheetForm(unprocessedEntries);

        submitTimeSheetButton = createButtonTimesheetForm();

        submitTimeSheetButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const [timesheetReponse, errorTimesheet] = await handleErrors(handleTimesheetSubmission(uid));
            if (errorTimesheet) {
                clearResultDiv();
                DIV_RESULT.textContent = "Error submitting timesheet.";
            } else {
                DIV_RESULT.innerHTML = timesheetReponse + DIV_RESULT.innerHTML;
            }
        });
    } catch (error) {
        clearResultDiv();
        console.error("Error: ", error.message);
        DIV_RESULT.textContent = "Error: unauthorized or failed to submit data.";
    }
})