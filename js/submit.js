document.addEventListener("DOMContentLoaded", function () {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const selectMonth = document.getElementById("dateMonth");
    const selectDay = document.getElementById("dateDay");
    const selectYear = document.getElementById("dateYear");

    function getDaysInMonth(month, year) {
        switch (month) {
            case 0: // January
            case 2: // March
            case 4: // May
            case 6: // July
            case 7: // August
            case 9: // October
            case 11: // December
                return 31;
            case 3: // April
            case 5: // June
            case 8: // September
            case 10: // November
                return 30;
            case 1: // February
                if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                    return 29; // Leap year
                } else {
                    return 28; // Common year
                }
            default:
                throw new Error("Invalid month"); // In case month is out of range [0-11]
        }
    }

    function updateDaysDropdown(month, year) {
        const numDays = getDaysInMonth(month, year);
        selectDay.innerHTML = ""; // Clear the current options
        for (let i = 1; i <= numDays; i++) {
            selectDay.append(
                new Option(i, i, i === currentDay, i === currentDay)
            );
        }
    }

    function createYearDropdown() {
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            let option = new Option(i, i, i === currentYear, i === currentYear);
            document.getElementById("dateYear").appendChild(option);
        }
    }
    async function buildMonthDropdown() {
        try {
            const response = await fetch("json/months.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const months = await response.json();

            const selectElement = document.getElementById("dateMonth");
            const current_month =
                parseInt(
                    now.toLocaleString("default", {
                        month: "2-digit",
                    })
                ) - 1;
            for (const key in months) {
                if (months.hasOwnProperty(key)) {
                    selectElement.append(
                        new Option(
                            months[key],
                            key,
                            key == current_month,
                            key == current_month
                        )
                    );
                }
            }
        } catch (error) {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        }
    }

    buildMonthDropdown();

    updateDaysDropdown(currentMonth, currentYear);

    createYearDropdown();

    // Event listener for when the month or year changes
    selectMonth.addEventListener("change", function () {
        updateDaysDropdown(parseInt(this.value), parseInt(selectYear.value));
    });

    selectYear.addEventListener("change", function () {
        updateDaysDropdown(parseInt(selectMonth.value), parseInt(this.value));
    });

    document
        .getElementById("timesheetForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            const postData = {
                "submission": [
                    {
                        uid : "0b6d5c32-6644-4629-a478-e82b52749cbc",
                        date: {
                            day: document.getElementById("dateDay").value,
                            month: document.getElementById("dateMonth").value,
                            year: document.getElementById("dateYear").value,
                        },
                        date: `${document.getElementById("dateMonth").value}/${document.getElementById("dateDay").value}/${document.getElementById("dateYear").value}`,
                        start_time: document.getElementById("startTime").value + " AM",
                        end_time: document.getElementById("endTime").value + " PM", 
                        break_duration: parseInt(document.getElementById("breakTime").value),
                    }
                ]
            };

            console.log("Data ready to be sent to API:", postData);

            const url = `https://oxtwzrrqrg.execute-api.us-west-2.amazonaws.com/development/postEmployeeTimesheet`;

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                })
                .then((data) => {
                    console.log("Success:", data);
                    document.getElementById("timesheetForm").reset();
                    document.getElementById("successMessage").style.display =
                        "block";
                })
                .catch((error) => {
                    console.error("Error:", error);
                    document.getElementById("errorMessage").style.display =
                        "block";
                });
        });
});
