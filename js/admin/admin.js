const employeeApi = 'https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1'
const processPayrollAPI = 'https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test/payroll'

async function fetchAllEmployees(){
  try{
    const result = await fetch(`${employeeApi}/profile/all`);
    const res = await result.json();
    const {items, statusCode} = res

    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }

    return items
  } catch(err){
    console.error(err)
  }
}

function createEmployeeSelect(employee){
  const {uid, full_name} = employee
  const option = document.createElement('option');
  option.value = uid
  option.textContent = full_name
  return option;
}

//fetch all employee and put it in select with id employee_select
async function main() {
  try{
    const items = await fetchAllEmployees()
    const employeeSelect = document.getElementById('employee_select')

    const employees_with_name = items.map(employee => {
      const full_name = `${employee.name} ${employee.lname}`
      return {...employee, full_name}
    })

    employees_with_name.forEach(employee => {
      const option = createEmployeeSelect(employee);
      employeeSelect.appendChild(option);
  });
  } catch(error){
    alert('Error: ' + error.message)
    console.error(error);
  }
}

function formatDate(inputDate) {
  // Assuming inputDate is in the format YYYY-MM-DD
  const parts = inputDate.split('-');
  const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
  return formattedDate;
}



const processPayroll = async (e) => {
  e.preventDefault()
  const payrollStartDate = document.getElementById('start_date').value
  const payrollEndDate = document.getElementById('end_date').value
  const uid = document.getElementById('employee_select').value
  console.log(`payrollStartDate: ${payrollStartDate} payrollEndDate: ${payrollEndDate} uid: ${uid}` )
  //2023-11-26 payrollEndDate: 2023-12-02

  const start_date = formatDate(payrollStartDate)
  const end_date = formatDate(payrollEndDate)

  console.log(`formattedStart: ${start_date} formattedEnd: ${end_date}`)

  try {
    const res = await createPayroll({ uid, start_date, end_date })
    console.log(JSON.stringify(res));

    if (res.statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`)
    } else {
      const {body} = res
      const success_message = `Payroll created successfully for uid ${body.uid} amount is: $${body.pay}`
      
      //put the success message in the html
      const successMessage = document.getElementById('success_message')
      successMessage.textContent = success_message      
    }
  } catch (err) {
    const errorMessage = document.getElementById('error_message')
    errorMessage.textContent = err
    console.error(err)
  }
}

const createPayroll = async (params) => {
  const { uid, start_date, end_date} = params
  console.log(`fetching endpoint ${processPayrollAPI} with ${JSON.stringify(params)}`)
  try{
    //show the spinner and set main div class to opacity-50
    const spinner = document.getElementById('spinner')
    spinner.classList.remove('hidden')
    const main = document.getElementById('main')
    main.classList.add('opacity-50')
    const res = await fetch(`${processPayrollAPI}`, {
      method: 'POST',
      body: JSON.stringify({
        "params": {
          "querystring": {
            "start_date": start_date,
            "end_date": end_date,
            "uid": uid
          }
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(`res is: ${JSON.stringify(res)}`)
    const data = await res.json()
    spinner.classList.add('hidden')
    main.classList.remove('opacity-50')
    return data
    //hide the spinner and set main div class to opacity-100
    
  } catch(err){
    console.error(err)
  }
}

const processPayrollButton = document.getElementById('processPayroll')
processPayrollButton.addEventListener('click', processPayroll)



main()