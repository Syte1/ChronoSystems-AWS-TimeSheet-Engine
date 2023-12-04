
// Hard-coded user ID for now
import { verifyToken } from "./auth.js";
let userId;


try {
    const auth = await verifyToken();
    userId = auth.userId;
} catch (error) {
    console.error("Error:", error.message);
}

// Function to handle editing fields
function editField(field) {
    // Get the current value
    const currentValue = document.getElementById(`current-${field}`).innerText;
    const name = document.getElementById('current-name').innerText;
    const role = document.getElementById('current-role').innerText;
    const wage = document.getElementById('current-wage').innerText;
    const phoneNumber = document.getElementById('current-contact').innerText;
    const currentAddress = document.getElementById('current-address').innerText;
    const permAddress = document.getElementById('current-permAddress').innerText;
    const birthday = document.getElementById('current-birthday').innerText;
    const email = document.getElementById('current-email').innerText;
    const lastName = document.getElementById('current-lname').innerText;

    // Prompt the user for the new value
    const newValue = prompt(`Enter new ${field}:`, currentValue);
    console.log(newValue)
    // Check if the user provided a new value
    if (newValue !== null) {

        // Update the UI with the new value
        document.getElementById(`current-${field}`).innerText = newValue;

        // Make the PUT request to update the user profile
        const requestBody = {
            uid: userId,
            name: name,
            wage: field === 'wage' ? parseFloat(newValue) : wage,
            role: field === 'role' ? newValue : role,
            contact: field === 'contact' ? newValue : phoneNumber,
            address: field === 'address' ? newValue : currentAddress,
            permAddress: field === 'permAddress' ? newValue : permAddress,
            birthday: field === 'birthday' ? newValue : birthday,
            email: field === 'email' ? newValue : email,
            lname: field === 'lname' ? newValue : lastName
        };

        fetch('https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response if needed
                console.log('Profile updated:', data);
            })
            .catch(error => console.error('Error updating profile:', error));
    }
    else {
        console.log(newValue)
    }
}

// Fetch user profile data
fetch(`https://fqov6b86hi.execute-api.us-east-2.amazonaws.com/v1/profile?uid=${userId}`)
    .then(response => response.json())
    .then(data => {
        // Assuming data.item is the structure of your response
        let userName2 = document.getElementById('user-name2');
        let userName = document.getElementById('user-name');
        let userFirstName = document.getElementById('current-name');
        let userLastName = document.getElementById('current-lname');
        let userRole = document.getElementById('current-role');
        let userWage = document.getElementById('current-wage');
        let phoneNumber = document.getElementById('current-contact');
        let currentAddress = document.getElementById('current-address');
        let permAddress = document.getElementById('current-permAddress');
        let birthday = document.getElementById('current-birthday');
        let email = document.getElementById('current-email');

        // Splitting the full name into first and last names
        let fullName = data.item.name.split(' ');
        let firstName = fullName[0];
        let lastName = fullName.slice(1).join(' ');

        // Update UI with the received user profile data
        userName2.innerText = data.item.name;
        userName.innerText = data.item.name;
        userFirstName.innerText = firstName;
        userLastName.innerText = data.item.lname;
        userRole.innerText = data.item.role;
        userWage.innerText = data.item.wage;
        phoneNumber.innerText = data.item.contact;
        currentAddress.innerText = data.item.address;
        permAddress.innerText = data.item.permAddress;
        birthday.innerText = data.item.birthday;
        email.innerText = data.item.email;

        // Add more elements as needed
    })
    .catch(error => console.error('Error:', error));

