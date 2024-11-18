import random
import string
import json
import sys

def generate_salt() -> str:
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(16))

if __name__ == "__main__":
    # Generate the salt
    salt = generate_salt()
    
    # Print the salt in JSON format
    response = {"salt": salt}
    print(json.dumps(response))  # Output the JSON object
    sys.stdout.flush()           # Ensure output is flushed for JavaScript to capture
