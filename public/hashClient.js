const hashClient = {};
const { spawn } = require('child_process');

hashClient.validate_password = (password) => {
    return new Promise((resolve, reject) => {
        const dataToSend = JSON.stringify({ 'password': password });
        const pythonProcess = spawn('python', ['./valid_password.py', dataToSend]);

        pythonProcess.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                const valid = response["is_valid"];
                console.log("Password validity checked");
                resolve(valid); // Resolve the promise with the result
            } catch (error) {
                reject("Error parsing response from Python script.");
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python:', data.toString());
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    });
};

hashClient.verifyPassword = (user_id, password, password_hash, salt) => {
    return new Promise((resolve, reject) => {
        const dataToSend = JSON.stringify({ 'salt': salt, 'password': password });
        const pythonProcess = spawn('python', ['./compute_hash.py', dataToSend]);

        pythonProcess.stdout.on('data', (data) => {
            const response = JSON.parse(data.toString());
            resolve(response.hash === password_hash);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python:', data.toString());
            reject(false);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    });
};


hashClient.generate_salt_n_hash = (password) => {
    return new Promise((resolve, reject) => {
        const dataToSend = JSON.stringify({ 'password': password });
        const pythonProcess = spawn('python', ['./transfer_salt.py', dataToSend]);

        let salt = "";
        let password_hash = "";

        pythonProcess.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                salt = response["salt"];
                if (!salt) {
                    reject("Couldn't generate salt for new password");
                }
            } catch (error) {
                reject("Error parsing salt from Python script.");
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python:', data.toString());
            reject(data.toString());
        });

        // On close of the first process, spawn the second process only if the salt is valid
        pythonProcess.on('close', (code) => {
            console.log(`Python process for salt exited with code ${code}`);
            if (salt) {
                // Create the data including the salt for the second Python process
                const data2 = JSON.stringify({ 'password': password, 'salt': salt });
                const pythonProcess2 = spawn('python', ['./compute_hash.py', data2]);

                pythonProcess2.stdout.on('data', (data) => {
                    try {
                        const response = JSON.parse(data.toString());
                        if (response.hash) {
                            password_hash = response.hash;
                            resolve({ password_hash, salt });
                        } else {
                            reject("Couldn't generate hash");
                        }
                    } catch (error) {
                        reject("Error parsing hash from Python script.");
                    }
                });

                pythonProcess2.stderr.on('data', (data) => {
                    console.error('Error from Python (hash):', data.toString());
                    reject(data.toString());
                });

                pythonProcess2.on('close', () => {
                    console.log("Python process for hash exited");
                });
            } else {
                reject("Salt not generated, cannot proceed to hash generation.");
            }
        });
    });
};

// hashClient.generate_salt_n_hash = (password) => {
//     return new Promise((resolve, reject) => {
//         const dataToSend = JSON.stringify({ 'password': password });
//         const pythonProcess = spawn('python', ['./transfer_salt.py', dataToSend]);

//         pythonProcess.stdout.on('data', (data) => {
//             const response = JSON.parse(data.toString());
//             if (!response.salt) {
//                 return reject("Couldn't generate salt");
//             }

//             // Use the salt to generate the hash
//             const data2 = JSON.stringify({ 'password': password, 'salt': response.salt });
//             const pythonProcess2 = spawn('python', ['./compute_hash.py', data2]);

//             pythonProcess2.stdout.on('data', (data) => {
//                 const hashResponse = JSON.parse(data.toString());
//                 if (hashResponse.hash) {
//                     resolve({ password_hash: hashResponse.hash, salt: response.salt });
//                 } else {
//                     reject("Failed to generate hash.");
//                 }
//             });
//         });

//         pythonProcess.stderr.on('data', (data) => reject(data.toString()));
//         pythonProcess2.stderr.on('data', (data) => reject(data.toString()));
//     });
// };


// hashClient.verify_otp = ()=>{
//     let otp_generated = "";
//     const otpValue = document.getElementById("otp").value;
//     const email = localStorage.getItem("email");
//     let valid = false;

//     return new Promise((resolve, reject) => {
//         const dataToSend = JSON.stringify({ 'email': email });
//         const pythonProcess = spawn('python', ['./OTP_email_sender.py', dataToSend]);

//         pythonProcess.stdout.on('data', (data) => {
//             try {
//                 const response = JSON.parse(data.toString());
//                 otp_generated = response["otp_generated"];

//                 if (otpValue === otp_generated) {
//                     valid = true;
//                     // Redirect to home.html after successful OTP verification
//                     window.location.href = '/home';
//                 } else {
//                     alert("Invalid OTP! Please try again.");
//                 }

//                 resolve(valid); // Resolve the promise with the result
//             } catch (error) {
//                 reject("Error parsing response from Python script.");
//             }
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             console.error('Error from Python:', data.toString());
//             reject(data.toString());
//         });

//         pythonProcess.on('close', (code) => {
//             console.log(`Python process exited with code ${code}`);
//         });
//     });
// }

hashClient.verify_otp = () => {
    let otp_generated = "";
    const otpValue = document.getElementById("otp").value;
    const email = localStorage.getItem("email");
    let valid = false;

    return new Promise((resolve, reject) => {
        const dataToSend = JSON.stringify({ 'email': email });
        const pythonProcess = spawn('python', ['./OTP_email_sender.py', dataToSend]);

        pythonProcess.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                otp_generated = response["otp_generated"];

                if (!otp_generated) {
                    reject("OTP generation failed");
                    return;
                }

                console.log(`Generated OTP: ${otp_generated}`);  // Log the OTP value

                if (otpValue === otp_generated) {
                    valid = true;
                    window.location.href = '/home';
                } else {
                    alert("Invalid OTP! Please try again.");
                }

                resolve(valid);
            } catch (error) {
                reject("Error parsing response from Python script.");
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python:', data.toString());
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    });
};


module.exports = hashClient;


