import sys
import json
from sha256 import sha256  # Import the sha256 function from sha256.py
from password_rearrange import rearrange_pass_salt  # Import rearrange_pass_salt from password_rearrange.py

if __name__ == "__main__":
    # Parse JSON input from JavaScript
    # print("Python function starting...")
    input_data = json.loads(sys.argv[1])
    salt = input_data['salt']
    password = input_data['password']
    
    try:
        # Combine password and salt using rearrange_pass_salt function
        mixed = rearrange_pass_salt(password, salt)
        
        # Calculate hash using sha256 function
        hash_value = sha256(mixed)
        
        # Prepare the output in JSON format and print to send back to JavaScript
        response = {"hash": hash_value}
    except Exception as e:
        response = {"error": str(e)}

    # Send the JSON response to stdout
    print(json.dumps(response))
    sys.stdout.flush()
