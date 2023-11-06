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
                date: {
                    day: document.getElementById("dateDay").value,
                    month: document.getElementById("dateMonth").value,
                    year: document.getElementById("dateYear").value,
                },
                startTime: document.getElementById("startTime").value,
                endTime: document.getElementById("endTime").value,
                breakTime: document.getElementById("breakTime").value,
            };

            console.log("Data ready to be sent to API:", postData);
        });
});
