const express = require('express');
const app = express();
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const path = require('path');
const con = require('./database');
const hashClient = require('./public/hashClient')

// Serve login page file
const home = fs.readFileSync('login.html');

const port = 8000 || process.env.port;

// HTTP request options
const options = {
    hostname: 'localhost',
    port: port,
    path: '/',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const request = http.request(options);

// API endpoints

// Root route for login page
app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "login.html"));
});

// Home page route
app.get("/home", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "home.html"));
});

// Pay page route
app.get("/pay", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "pay.html"));
});

// Sign-up page route
app.get("/signUp", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "signUp.html"));
});

// Forgot Password page route
app.get("/forgotPassword", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "forgotPassword.html"));
});

// User details page route
app.get("/user_details", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "user_details.html"));
});

app.get("/success", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, "success.html"));
});

app.get("/otp", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, "otp.html"));
});

// Login endpoint

app.post("/login", async (req, res) => {
    const { fluxID, password } = req.body;
    const sql = `SELECT gateway_id, password_hash, salt FROM user_credentials WHERE gateway_id = ?`;

    con.query(sql, [fluxID], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "User Not Found!" });
        }

        const { gateway_id, password_hash, salt } = results[0];
        
        try {
            const isValid = await hashClient.verifyPassword(gateway_id, password, password_hash, salt);
            if (isValid) {
                return res.status(200).json({ message: "Login Successful" });
            } else {
                return res.status(400).json({ message: "Invalid Credentials!" });
            }
        } catch (error) {
            console.error("Error verifying password:", error);
            return res.status(500).json({ message: "Error verifying credentials" });
        }
    });
});

// app.post("/send_otp", (req, res)=>{
//     const otp_valid = hashClient.verify_otp();
//     if(otp_valid){
//         return res.status(200).json({ message: "OTP verified successfully"});
//     }
//     else{
//         return res.status(400).send({ message: "Incorrect OTP entered"});
//     }
// });

app.post("/send_otp", async (req, res) => {
    try {
        const otp_valid = await hashClient.verify_otp();  // Ensure the promise resolves
        if (otp_valid) {
            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            return res.status(400).send({ message: "Incorrect OTP entered" });
        }
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).send({ message: "Internal server error during OTP verification" });
    }
});




// Endpoint to authenticate user
// app.get("/authenticate", (req, res) => {
//     let user_id = request.body.user;
//     let sql = `SELECT password_hash, salt from user_details where gateway_id = ?`;
// });

app.post("/sendMoney", (req, res)=>{
    const {sender_id, recipient_id, bank_account, amount, pin, date} = req.body;

    let sql = `UPDATE user_credentials SET balance = balance + ? WHERE gateway_id = ?`;

    con.query(sql, [amount, recipient_id], (err, result)=>{
        if(err){
            console.error("Error in payment: ", err);
            return;
        }
        console.log("Money Received");
    });

    sql = `UPDATE user_credentials SET balance = balance - ? WHERE gateway_id = ?`;

    con.query(sql, [amount, sender_id], (err, result)=>{
        if(err){
            console.error("Error in payment: ", err);
            return;
        }
        console.log("Money sent");
    });

    //Generate a transaction id using python

    sql = `INSERT INTO transactions(sender_id, receiver_id, amount, transaction_date) VALUES(?,?,?,?)`;
    
    //Find how to get sender ip and receiver ip
    let sender_ip = "192.222.168.191"
    let receiver_ip = "168.161.222.190"
    
    con.query(sql, [sender_id, recipient_id, amount, date], (err, result)=>{
        if(err){
            console.error("Transaction Failed!", err);
            return;
        }
        console.log("Transaction Successful");
    });

});


// app.post("/sendMoney", (req, res) => {
//     const amount = parseFloat(req.body.amount);
//     const sender_id = parseInt(req.body.sender_id, 10);
//     const recipient_id = parseInt(req.body.recipient_id, 10);
//     const date = req.body.date;

//     if (isNaN(amount) || isNaN(sender_id) || isNaN(recipient_id)) {
//         return res.status(400).json({ message: "Invalid amount or ID format" });
//     }

//     con.beginTransaction((err) => {
//         if (err) throw err;
    
//         // Deduct money from sender
//         con.query(`UPDATE user_credentials SET balance = balance - ? WHERE gateway_id = ?`, [amount, sender_id], (err) => {
//             if (err) return con.rollback(() => res.status(500).json({ message: "Error deducting amount" }));
    
//             // Add money to recipient
//             con.query(`UPDATE user_credentials SET balance = balance + ? WHERE gateway_id = ?`, [amount, recipient_id], (err) => {
//                 if (err) return con.rollback(() => res.status(500).json({ message: "Error adding amount" }));
    
//                 // Log transaction
//                 con.query(`INSERT INTO transactions (sender_id, receiver_id, amount, transaction_date) VALUES (?, ?, ?, ?)`, [sender_id, recipient_id, amount, date], (err) => {
//                     if (err) return con.rollback(() => res.status(500).json({ message: "Error logging transaction" }));
    
//                     con.commit((err) => {
//                         if (err) return con.rollback(() => res.status(500).json({ message: "Transaction commit failed" }));
//                         res.status(200).json({ message: "Transaction successful" });
//                     });
//                 });
//             });
//         });
//     });
    
// });



// Endpoint to sign up new users
app.post("/signUpDetails", (req, res) => {
    const { firstName, lastName, pin, email, bank_acc, phoneNumber, dob, gender, password, last_login, balance } = req.body;

    // Validate password
    let valid = hashClient.validate_password(password);
    if (valid === false) {
        console.log("Password must be at least 8 characters long containing uppercase characters, lowercase characters, special symbols, and numbers!");
        return res.status(400).json({ message: "Password does not meet the criteria." });
    } else {
        console.log("Password is valid");

        // Generate salt and hash
        hashClient.generate_salt_n_hash(password)
            .then(({ password_hash, salt }) => {
                console.log("Salt and hash received in app.js:", salt, password_hash);

                // Proceed with inserting the user into the database
                let sql = `INSERT INTO user_credentials (bank_acc_no, firstName, lastName, PIN, email, password_hash, phone_no, dob, gender, last_login, balance, salt) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [bank_acc, firstName, lastName, pin, email, password_hash, phoneNumber, dob, gender, last_login, balance, salt];

                con.query(sql, values, (err) => {
                    if (err) {
                        console.error("Couldn't enter data into the database!", err);
                        return res.status(500).json({ message: "Error creating user account." });
                    }
                    console.log("User added successfully!");

                    // Fetch the generated gateway_id
                    sql = `SELECT gateway_id FROM user_credentials WHERE bank_acc_no = ?`;
                    con.query(sql, [bank_acc], (err, results) => {
                        if (err || results.length === 0) {
                            console.error("Error retrieving user_id");
                            return res.status(500).json({ message: "Unable to fetch user id" });
                        }
                        let user_id = results[0].gateway_id;
                        console.log("User ID for new user: ", user_id);
                        return res.status(200).json({ user_id: user_id });
                    });
                });
            })
            .catch(error => {
                console.error("Error generating salt and hash:", error);
                return res.status(500).json({ message: "Error generating credentials" });
            });
    }
});

// Show user details endpoint
app.post("/showUserDetails", (req, res) => {
    const user_id = req.body.gateway_id;
    const sql = `SELECT * FROM user_credentials WHERE gateway_id = ?`;

    con.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Error retrieving user details:", err);
            return res.status(500).json({ error: "Server error" });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]); 
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});

// Endpoint to retrieve balance
app.get("/getBalance", async (req, res) => {
    const user_id = req.body;
    const sql = `SELECT balance FROM user_credentials WHERE gateway_id = ?`;
    let results = [];

    try {
        results = await con.query(sql, [user_id]);
        console.log(results[0]);
    } catch (err) {
        return console.log(err);
    }
    query_results = results[0];
});

// Start the server
app.listen(port, () => {
    console.log(`The application successfully started on port ${port}`);
});

module.exports = app;
