
const employeesApi = 'https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile/all';
const paystubsApi = 'https://s2z6h094ph.execute-api.us-west-2.amazonaws.com/test';

async function fetchEmployeeData() {
  const response = await fetch(`${employeesApi}`);
  const employees = await response.json();
  return employees;
}

function createEmployeeRow(employee) {
  const row = document.createElement('tr');
  const { name, lname, email, role, wage, uid } = employee;
  const full_name = `${name} ${lname}`;
  row.innerHTML = `
    <td class="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
      ${full_name}</td>
    <td class="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
      ${email}</td>
    <td class="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
      ${role}</td>
    <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">${wage}
    </td>
    <td class="relative whitespace-nowrap border-b border-gray-200 py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8">
      <a href="#" class="text-indigo-600 hover:text-indigo-900">View Paystub<span
          class="sr-only">, ${full_name}</span></a>
    </td> 
    `
  const editButton = row.querySelector('a')
  editButton.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
      await displayuserPaystub(uid, full_name);
      // Code here will execute after displayuserPaystub has completed
    } catch (error) {
      // Handle any errors that occurred during the displayuserPaystub function
      console.error(error);
    }
  }
  )
  return row;
}

async function displayuserPaystub(uid, full_name) {
  try{
      //show table
      const paystubTable = document.getElementById('employeepaystub')
      paystubTable.classList.remove('hidden')

      console.log(`fetching paystubs with route: ${paystubsApi}/${uid}`)
      const response = await fetch(`${paystubsApi}/${uid}`);
      const data = await response.json();
      console.log(`data is: ${JSON.stringify(data)}`)

      const { Items, statusCode, message } = data;
      if (statusCode !== 200) {
        throw new Error(`Error: ${statusCode} ${message}`);
      }
      const tableBody = document.getElementById('paystub-table-body')
      Items.forEach(paystub => {
        const row = createPaystubRow(paystub, full_name);
        tableBody.appendChild(row); 
    });

  } catch(error){
    alert('Error: ' + error.message)
    console.error(error);
  }
  
}

function createPaystubRow(paystub, full_name) {
  const { start_period, end_period, pay } = paystub
  const row = document.createElement('tr');
  row.innerHTML = `
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    ${full_name}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    ${start_period}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    ${end_period}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    ${pay}
  </td>
  `
  return row;
}


async function main() {
  try{
    const {items} = await fetchEmployeeData();
    const tableBody = document.getElementById('employee-table-body')
    items.forEach(employee => {
      const row = createEmployeeRow(employee);
      tableBody.appendChild(row);
  });
  }
  catch(error){
    alert('Error: ' + error.message)
    console.error(error);
  }
}

main()
