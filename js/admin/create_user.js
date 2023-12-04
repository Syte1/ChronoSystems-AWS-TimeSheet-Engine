const createForm = document.getElementById('createNewUser')
const signUpAPI = 'https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test'
const profileAPI = 'https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1';
const feedback = document.getElementById('successMessage')
const spinner = document.getElementById('spinner')

createForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const given_name = document.getElementById('givenName').value
  const family_name = document.getElementById('familyName').value
  const address = document.getElementById('address').value
  const birthdate = document.getElementById('birthdate').value
  const preferred_username = document.getElementById('preferredUsername').value
  const phone_number = '+1' + document.getElementById('phoneNumber').value
  const email = document.getElementById('email').value
  const wage = document.getElementById('wage').value
  const role = document.getElementById('role').value
  const password = 'TempPass123!'

  const postData = {
    family_name,
    given_name,
    address,
    birthdate,
    preferred_username,
    phone_number,
    email,
    wage,
    role,
    password
  }
  
  // formatting for profileAPI
  const name = given_name;
  const uid = preferred_username;
  const lname = family_name;
  const permAddress = address;
  const contact = phone_number;
  const birthday = birthdate;

  const profileData = {
    uid,
    name,
    wage,
    role,
    lname,
    address,
    permAddress,
    contact,
    birthday,
    email
  }

  try {
    await addToProfileTable(profileData);
  } catch (_) {
    //do nothing
  }

  try {
    const res = await createUser({ body: postData })
    if (res.statusCode !== 200) {
      throw new Error(`Error: ${res.statusCode} ${res.message}`)
    } else{
      feedback.textContent = `User ${preferred_username} has been created`
    }
  } catch (err) {
    feedback.textContent = err.message
    feedback.classList.remove('text-green-600')
    feedback.classList.add('text-red-500')
  }
})

async function createUser(body) {
  spinner.classList.remove('hidden')
  console.log(`Body is ${JSON.stringify(body)}`)
  try {
    console.log(`fetching with route: ${signUpAPI}/signup`)
    const res = await fetch(`${signUpAPI}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log(`res: ${JSON.stringify(res)}`)
    //add spinner while waiting for response
    


    const data = await res.json()
    console.log(`data: ${JSON.stringify(data)}`)
    spinner.classList.add('hidden')
    return data
  } catch (err) {
    spinner.classList.add('hidden')
    throw new Error(`Error fetching...${err.message}`)
  }
}

async function addToProfileTable(body)  {
  try {
    console.log(`fetching with route: ${profileAPI}/profile`)
    const res = await fetch(`${profileAPI}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (err) {
    console.log("err");
    throw new Error(`Error fetching...${err.message}`)
  }
}
//attach reset form to button
const resetButton = document.getElementById('resetForm')

resetButton.addEventListener('click', (e) => {
  e.preventDefault()
  createForm.reset()
  feedback.classList.remove('text-red-500')
  feedback.classList.add('text-green-600')
  feedback.textContent = 'Form has been reset'
})