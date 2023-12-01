const divName = document.getElementById('user-name');
const testUid = "2";

//populate name 
async function checkSessionStorage() {
    const name = sessionStorage.getItem("user-name");
    if (name == undefined || name == ""){
        await fetchUsername();
    } else {
        divName.innerText = name;
    }
}
checkSessionStorage();

async function fetchUsername(){
    fetch(`https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile?uid=${testId}`)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("user-name", data.item.name);
            divName.innerText = data.item.name;
        })
        .catch(error => console.error('Error:', error));
}
