// Redirect to payment page and save user ID to localStorage
function transferMoney() {
    let userID = localStorage.getItem("userID");
    if (!userID) {
        console.error("User ID not found in localStorage");
        alert("User is not logged in. Redirecting to login page.");
        window.location.href = "/login";
        return;
    }
    console.log("User ID: ", userID);
    window.location.href = "/pay";
}

// Format a JavaScript Date object to MySQL DATETIME format
function formatDateToMySQL(date) {
    return date.getFullYear() + '-' +
           ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
           ('0' + date.getDate()).slice(-2) + ' ' +
           ('0' + date.getHours()).slice(-2) + ':' +
           ('0' + date.getMinutes()).slice(-2) + ':' +
           ('0' + date.getSeconds()).slice(-2);
}

// Fetch and display user details by sending a POST request to the server
function showUserDetails() {
    let userID = localStorage.getItem("userID");
    if (!userID) {
        console.error("User ID not found in localStorage");
        alert("User is not logged in. Redirecting to login page.");
        window.location.href = "/login";
        return;
    }
    console.log("User ID in User Details page:", userID);

    fetch("/showUserDetails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gateway_id: userID }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }
        return response.json();
    })
    .then((data) => {
        if (data) {
            console.log("User data received:", data);
            localStorage.setItem("userDetails", JSON.stringify(data));
            window.location.href = "/user_details";
        } else {
            throw new Error("User data not found");
        }
    })
    .catch((error) => {
        console.error("Error retrieving user details:", error);
        alert("Couldn't retrieve user data. Please try again.");
    });
}

// Validate the amount input, ensuring it is greater than 0
// function validateAmount() {
//     const amountInput = document.getElementById("amount");
//     const amountError = document.getElementById("amountError");

//     if (amountInput.value <= 0) {
//         amountError.style.display = "block";
//         amountError.textContent = "Amount must be greater than 0";
//         return false;
//     } else {
//         amountError.style.display = "none";
//         return true;
//     }
// }

// Check user balance and make a payment if the form is valid
function checkBalanceAndPay() {
    let date = formatDateToMySQL(new Date());

    let sender_id = localStorage.getItem("userID");
    if (!sender_id) {
        console.error("Sender ID is missing");
        alert("User is not logged in. Please log in again.");
        window.location.href = "/login";
        return;
    }

    let recipient_id = document.getElementById("rcp_id")?.value;
    let bank_account = document.getElementById("bank_acc_no")?.value;
    let amount = document.getElementById("amount")?.value;
    let pin = document.getElementById("PIN")?.value;

    if (!recipient_id || !bank_account || !amount || !pin) {
        console.error("One or more required fields are missing.");
        alert("Please fill in all required fields.");
        return;
    }

    // const recipient_details = { sender_id, recipient_id, bank_account, amount, pin, date };
    const recipient_details = {
        sender_id: parseInt(sender_id, 10),
        recipient_id: parseInt(recipient_id, 10),
        bank_account: bank_account,
        amount: parseFloat(amount),
        pin: pin,
        date: date
    };
    

    fetch("/sendMoney", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipient_details),
    })
    .then((response) => {
        if (response.ok) {
            console.log("Payment successful!");
            window.location.href = "/success";
            // return response.json().then(() => {
            //     window.location.href = "/success";
            // });
        } else {
            throw new Error("Payment failed");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Payment failed! Please try again.");
    });
}

// // Validate the amount and initiate payment if validation passes
// function validateAndPay() {
//     if (validateAmount()) {
//         checkBalanceAndPay();
//     }
// }
