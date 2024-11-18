const { spawn } = require('child_process');

// Spawn the Python process to run generate_salt.py
const pythonProcess = spawn('python', ['./transfer_salt.py']);

// Capture the data from the Python script's standard output
pythonProcess.stdout.on('data', (data) => {
    const response = JSON.parse(data.toString());  // Parse the JSON data
    console.log('Salt received from Python:', response.salt);  // Log the salt
});

// Handle any errors from the Python process
pythonProcess.stderr.on('data', (data) => {
    console.error('Error from Python:', data.toString());
});

// Handle process exit
pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
});
