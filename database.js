const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Replace with the correct password
    database: ""
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the application with an error code
    }
    console.log("Connected to MySQL!");
});

// Uncomment the test query if needed
// con.query('SELECT * FROM user_credentials', (err, results) => {
//     if (err) {
//         return console.log('Error executing test query:', err);
//     }
//     console.log('User Credentials:', results);
// });

module.exports = con;
