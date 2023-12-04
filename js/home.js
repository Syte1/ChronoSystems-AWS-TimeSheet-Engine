const baseUrl = 'https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test';

// Function to call the API endpoint for token verification
async function verifyToken() {
  let token = getSecureCookie();
  console.log(token);
  try {
    const response = await fetch(`${baseUrl}/validate-jwt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "id": token }),
    });

    if (response.ok) {
      const data = await response.json();
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

function test(){
  const res = verifyToken();
  console.log(res);
}
test();