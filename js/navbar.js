const divName = document.getElementById('user-name');
const baseUrl = 'https://y7aq7em2t6.execute-api.us-west-2.amazonaws.com/test';
let testUid = "2";

async function initialLoad(){
    //sessionStorage.setItem("uid", "2"); // Ideally, we'd have a cookie that stores the priviledge of user somewhere
    //const currentUser = sessionStorage.getItem("uid");
    const currentUser = await checkSessionStorage();
    console.log("res",currentUser);
    if (currentUser == "shuang" || currentUser == "shuangchun" || currentUser == "Andy" || currentUser == "Andy1"){
        document.getElementById("navAdmin").hidden = false;

        // This one is for main landing page, didn't feel like making another js file for this
        try{
            document.getElementById("mainAdmin").hidden = false;
        } catch(_){
            // do nothing
        }
    }
}
initialLoad();

// Function to call the API endpoint for token verification
async function verifyToken() {
  let token = getSecureCookie();
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

//populate name 
async function checkSessionStorage() {
    const name = sessionStorage.getItem("user-id");
    if (name == undefined || name == ""){
        const response = await verifyToken();
        testUid = response.userId;
        sessionStorage.setItem("user-id", testUid);
        await fetchUsername();
        return response.userId;
    } else {
        divName.innerText = sessionStorage.getItem("username");
        return name;
    }
}


async function fetchUsername(){
    fetch(`https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile?uid=${testUid}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (testUid == "shuangchun"){
            divName.innerText = "shaung"
            sessionStorage.setItem("user-name", "shaung");
          } else {
            divName.innerText = data.item.name;
            sessionStorage.setItem("username", data.item.name);
          }

        })
        .catch(error => {console.error('Error:', error);
        //window.location.replace("../index.html");
    });
}
