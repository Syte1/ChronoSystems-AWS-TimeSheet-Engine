const divName = document.getElementById('user-name');
const testUid = "2";

function initialLoad(){
    checkSessionStorage();
    sessionStorage.setItem("uid", "2"); // Ideally, we'd have a cookie that stores the priviledge of user somewhere
    const currentUser = sessionStorage.getItem("uid");
    if (currentUser == "2"){
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

//populate name 
async function checkSessionStorage() {
    const name = sessionStorage.getItem("user-name");
    if (name == undefined || name == ""){
        await fetchUsername();
    } else {
        divName.innerText = name;
    }
}


async function fetchUsername(){
    fetch(`https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile?uid=${testUid}`)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("user-name", data.item.name);
            divName.innerText = data.item.name;
            console.log(`role: ${data.item.role}`)
        })
        .catch(error => {console.error('Error:', error);
        window.location.replace("../index.html");});
}
