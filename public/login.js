function togglePassword(){
    var pswd_field = document.getElementById("pswd");
    var toggle_button = document.querySelector(".toggle_btn");

    if(pswd_field.type==="password"){
        pswd_field.type = "text";
        toggle_button.textContent = "Hide";
    }
    else{
        pswd_field.type = "password";
        toggle_button.textContent = "Show";
    }
}

function login(){
    // console.log("Login Successful");
    
    //Get form data
    const fluxID = document.getElementById("f_id").value;
    const password = document.getElementById("pswd").value;

    //Code to verify user id and password using python
    //Hash this password and compare the hash with that stored in the database
    //If credentials are not valid, display a message "sign in failed"

    localStorage.setItem("userID", JSON.stringify(fluxID));  
    localStorage.setItem("pswd", JSON.stringify(password));  
    let ui = localStorage.getItem("userID", JSON.stringify(fluxID));

    console.log("User id stored in login.js: ", ui);

    // Send data to the API using fetch
    fetch("/login", {
        method: "POST", // Set method to POST
        headers: {
            "Content-Type": "application/json", // Ensure the data is sent in JSON format
        },
        body: JSON.stringify({ fluxID, password }), // Convert form data to JSON
    })
    .then((response) => {
        if (response.ok) {
            // If the response is successful, redirect to the home.html page
            window.location.href = "/home"; //Redirects to the 'home.html'
            console.log("Login successful!");
            return response.json(); // Parse the response JSON if needed
        } else {
            throw new Error("User Not Found!");
        }
    })
    
    .catch((error) => {
        console.error("Error:", error);
        alert("Login failed. Please try again.");
    });
}

function openSignUp(){
    // Directly navigate to the sign-up page
    window.location.href = "/signUp"; // This will call the /signUp route in app.js
}

function formatDateToMySQL(date) {
    return date.getFullYear() + '-' + 
           ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
           ('0' + date.getDate()).slice(-2) + ' ' +
           ('0' + date.getHours()).slice(-2) + ':' +
           ('0' + date.getMinutes()).slice(-2) + ':' +
           ('0' + date.getSeconds()).slice(-2);
}

// const formattedDate = formatDateToMySQL(currentDateTime);

function signUp(){
    //Get user data from sign up page
    let password = document.getElementById("pswd").value;
    const currentDateTime = new Date()

    //Generate a gateway_id/user_id for new user using python

    // let hash = uwery483479; //Get from python
    // let generated_salt = 0; //Get from python

    const userData = {
        firstName: document.getElementById("f_name").value,
        lastName: document.getElementById("l_name").value,
        pin: document.getElementById("pin").value,
        email: document.getElementById("email").value,
        bank_acc: document.getElementById("bank_acc").value,
        phoneNumber: document.getElementById("phn_no").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        password: password, 
        last_login: formatDateToMySQL(currentDateTime),
        balance: 1000,
        // salt: generated_salt//Get salt from python
    }

    let user_id = "";

    fetch("/signUpDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.user_id) {
            localStorage.setItem("userID", data.user_id);
            localStorage.setItem("email", email);
            console.log("User ID received by login.js: ", data.user_id);
            console.log("Email ID: ", email);
            // window.location.href = "/home";
            window.location.href = "/otp";
            console.log("Account created successfully");
        } else {
            throw new Error("Account creation failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Sign up failed! Please try again.");
    });
}    

function openForgotPassword() {
    window.location.href = "/forgotPassword"; // Update this URL as needed
}