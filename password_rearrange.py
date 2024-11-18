from valid_password import valid_password
from generate_salt import generate_salt
import sys
import json

def rearrange_pass_salt(password : str,salt: str):
    n = ord(password[0])%16
    front = salt[:n]
    back  = salt[n:]
    return f"{front}{password}{back}"

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    password = input_data['password']
    salt = input_data['salt']
    pswd_plus_salt = rearrange_pass_salt(password, salt)
    
    response = {"password_plus_salt": pswd_plus_salt}
    print(json.dumps(response))  # Output the JSON object
    sys.stdout.flush()           # Ensure output is flushed for JavaScript to capture


# password = input("Enter Password: ")

# isvalid = valid_password(password)
# salt = generate_salt()

# if isvalid :
#     pass_with_salt = rearrange_pass_salt(password,salt)
#     print(f"The password {password} with salt: {pass_with_salt} ")
# else:
#     print(f"Is Password Valid: {isvalid}")
