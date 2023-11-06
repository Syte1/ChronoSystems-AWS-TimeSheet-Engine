document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  for (let i = 1; i <= 31; i++) {
    let option = new Option(i, i, i === day);
    document.getElementById("dateDay").appendChild(option);
  }

  for (let i = 0; i < 12; i++) {
    let option = new Option(
      now.toLocaleString("default", { month: "long" }),
      i,
      i === month
    );
    document.getElementById("dateMonth").appendChild(option);
  }

  for (let i = year - 5; i <= year + 5; i++) {
    let option = new Option(i, i, i === year);
    document.getElementById("dateYear").appendChild(option);
  }

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
