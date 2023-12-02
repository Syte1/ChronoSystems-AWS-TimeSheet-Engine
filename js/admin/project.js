const projectsApi = 'https://9zsjgjfqlh.execute-api.us-west-2.amazonaws.com/development'
const employeeApi = 'https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1'

async function fetchAllProjects(){
  try{
    const result = await fetch(`${projectsApi}/getAllProjects`);
    const res = await result.json();
    const {entries, statusCode} = res

    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }
    return entries
  } catch(err){
    console.error(err)
  }

}

async function fetchProjectMembers(projectId){
  try{
    const result = await fetch(`${projectsApi}/getProjectMembers?projectId=${projectId}`);
    const res = await result.json();
    const {entries, statusCode} = res

    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }
    return entries

  } catch(err){
    console.error(err)
  }
}

async function createProject(name){
  try{
    result = await fetch(`${projectsApi}/putProject`, {
      method: 'PUT',
      body: JSON.stringify({name})
    })
    const res = await result.json();
    const {statusCode, message, entry} = res
    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }
    return res
  } catch(err){
    console.error(err)
  }
}

async function addProjectMember(projectId, uid){
  try{
    result = await fetch(`${projectsApi}/putJoinProject`, {
      method: 'PUT',
      body: JSON.stringify({projectId, uid})
    })
    const res = await result.json();
    const {statusCode, message} = res
    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }
    return res
  } catch(err){
    console.error(err)
  }
}

async function removeProjectMember(projectId, uid){
  try{
    result = await fetch(`${projectsApi}/deleteJoinProject`, {
      method: 'DELETE',
      body: JSON.stringify({projectId, uid})
    })
    const res = await result.json();
    const {statusCode, message} = res
    if (statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`);
    }
    return res
  } catch(err){
    console.error(err)
  }
}

function createProjectSelect(project){
  const {projectId, name} = project
  const option = document.createElement('option');
  option.value = projectId
  option.textContent = name
  
  return option;
}

function displayProjectOptions(projects){
  const select = document.getElementById('project-select')
  projects.forEach(project => {
    const option = createProjectSelect(project)
    select.appendChild(option)
  })
}


//when user select a project in the select, fetch all the members and display them in the employee select

function displayMembers(members){

  const select = document.getElementById('employees-select')
  const unassignButton = document.getElementById('unassignEmployees')

  select.innerHTML = ''
  if (members.length === 0){
    select.innerHTML = `<option> No members are associated with this project <option>`
    //disable the button
    unassignButton.disabled = true
    unassignButton.classList.add('bg-gray-300')
    return
  }
  unassignButton.classList.add('bg-indigo-600')
  unassignButton.classList.add('hover:bg-indigo-500')
  unassignButton.classList.remove('bg-gray-300')
  unassignButton.disabled = false


  const memberOptions = members.map(member => {
    const option = createEmployeeSelect(member)
    return option
  })
  memberOptions.forEach(option => {
    select.appendChild(option)
  })
}

function createEmployeeSelect(member){
  console.log(`creating member select for: ${JSON.stringify(member)}`)
  const {uid, full_name} = member
  console.log(full_name)
  const option = document.createElement('option');
  option.value = uid
  option.textContent = full_name
  return option;
}

async function fetchEmployeeName(uid){
  try{
    const result = await fetch(`${employeeApi}/profile?uid=${uid}`);
    const res = await result.json();
    const {item, statusCode, message} = res
    if (statusCode !== 200) {
      throw new Error(`Error: ${statusCode} ${message}`);
    }
    const full_name = `${item.name} ${item.lname}`
    return full_name
  } catch(err){
    console.error(err)
    return err
  }

}


const projectSelect = document.getElementById('project-select')
projectSelect.addEventListener('change', async (e) => {
  const projectId = e.target.value
  

  const members = await fetchProjectMembers(projectId)

  const members_with_name = await Promise.all(members.map(async member => {
    const {uid} = member
    const full_name = await fetchEmployeeName(uid)
    return {...member, full_name}
  }))
  displayMembers(members_with_name)
})

//add onclick event to the unassign button
const unassignButton = document.getElementById('unassignEmployees')
unassignButton.addEventListener('click', async (e) => {
  const projectId = document.getElementById('project-select').value
  const employeesSelect = document.getElementById('employees-select')
  const uids = Array.from(employeesSelect.selectedOptions).map(option => option.value)
  console.log(`unassigning ${uids} from ${projectId}`)
  unassignEmployees(projectId, uids)
})

function unassignEmployees(projectId, uids){
  uids.forEach(async uid => {
    console.log(`removing ${uid} from ${projectId}`)
    const res = await removeProjectMember(projectId, uid)
    //display success message
    const feedback = document.getElementById('unassignMessage')
    feedback.textContent += res.message
  })
}


async function main(){
  try{
    const projects = await fetchAllProjects()
    displayProjectOptions(projects)

    


  } catch(err){
    console.error(err)
  }
}

main()