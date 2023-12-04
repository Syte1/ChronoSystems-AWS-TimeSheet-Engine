const baseUrl = 'https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test';

// Function to call the API endpoint for token verification
async function verifyToken() {
  let token = getSecureCookie();
  try {
    const response = await fetch(`${baseUrl}/validate-jwt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: token }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log(response);
      console.log(data);
      const userId = data.body.username;

      return {valid: true, userId: userId, data: data.valid};
    } else {
      throw new Error('Token verification failed');
    }
  } catch (error) {
    console.error(error);
    return {valid: false, userId: null, data: null};
  }
}

// Helper function to retrieve the secure cookie value
function getSecureCookie(cookieName = 'token') {
  // const cookieName = 'token';
  let cookies = document.cookie.split(';');
  let cookie = cookies.find(cookie => cookie.startsWith(cookieName));
  if (cookie) {
    return cookie.split('=')[1];
  } else {
    return null;
  }
}

// async function onLoginClick(){
//   try {
//     const user = document.getElementById("username").value;
//     const pw = document.getElementById("password").value;
//     const response = await signIn(user, pw);
//     console.log(`good: ${user}, ${pw}, ${response}`);
//   } catch (e){
//     console.log(e)
//   }
// }

export async function signIn(username, password) {
  const url = `${baseUrl}/signin`;
  const data = {body: {username: username, password: password}};

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.ok) {
        const res = await response.json();
        console.log(res.body);
        return res;
      } else {
        throw new Error('Login failed');
      }
    })
    .then((data) => {
      setSecureCookie('token', data.body.AuthenticationResult.AccessToken, data.body.AuthenticationResult.ExpiresIn);
      window.location.href = "./html/home.html";
    })
    .catch((error) => {
      console.error(error);
    });

}
/* Sample userDetails object
{
  "given_name": "John",
  "family_name": "Doe",
  "address": "123 Main St",
  "birthdate": "1990-01-01",
  "preferred_username": "johndoe",
  "phone_number": "+1234567890",
  "email": "johndoe@example.com",
  "wage": "50000",
  "role": "Manager",
  "password": "TempPass123!"
}
*/
export async function signUp(userDetails) {
  const url = `${baseUrl}/signup`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDetails),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Signup failed');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function setSecureCookie(name, value, expires = 3600) {
  document.cookie = `${name}=${value}; ${expires} ;Secure`;
}

/*
// Function to retrieve the currently signed-in user's ID
function getCurrentUserId() {
  const token = getSecureCookie('token');
  // Assuming you have a function to retrieve the secure cookie value
  // Replace `getSecureCookie` with the actual implementation

  if (token) {
    // Call the API endpoint for token verification
    return verifyToken(token)
      .then((valid) => {
        if (valid) {
          // Retrieve the user ID from the token or API response
          return getUserIdFromToken(token);
        } else {
          throw new Error('Token verification failed');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  } else {
    return null;
  }
}

// Helper function to retrieve the user ID from the token or API response
function getUserIdFromToken(token) {
  // Implement your logic to extract the user ID from the token or API response here
  // Return the user ID
}
*/