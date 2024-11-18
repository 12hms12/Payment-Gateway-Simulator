let countdown = 60;
let countdownInterval;


// Function to handle OTP login
function login() {

    fetch("/send_otp", {
        method: "POST", // Set method to POST
        headers: {
            "Content-Type": "application/json", // Ensure the data is sent in JSON format
        },
        body: JSON.stringify({}), // Convert form data to JSON
    })
    .then((response) => {
        if (response.ok) {
            // If the response is successful, redirect to the home.html page
            window.location.href = "/home"; //Redirects to the 'home.html'
            console.log("OTP Verified! Login successful!");
            return response.json(); // Parse the response JSON if needed
        } else {
            throw new Error("OTP not verified!");
        }
    })
    
    .catch((error) => {
        console.error("Error:", error);
        // alert("Login failed. Please try again.");
    });

}

// Function to start the OTP resend countdown
function startCountdown() {
    const countdownElement = document.getElementById("countdown");
    const resendButton = document.getElementById("resend-btn");
    countdown = 60;

    resendButton.disabled = true;
    countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            resendButton.textContent = "Resend OTP";
            resendButton.disabled = false;
        } else {
            resendButton.textContent = `Resend OTP (${countdown}s)`;
        }
    }, 1000);
}

// Function to resend OTP
function resendOTP() {
    alert("OTP has been resent to your email.");
    startCountdown();
}

// Start the countdown on page load
window.onload = startCountdown;
