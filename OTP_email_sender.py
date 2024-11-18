from email.message import EmailMessage
import ssl
import smtplib
import random
import sys
import json

def generate_random_4_digit() -> str:
    return f"{random.randint(0, 10000):04d}"


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])

    # This will generate a new OTP
    otp = generate_random_4_digit()

    # Email configuration
    email_sender = "email@gmail.com"
    password = "app password"  
    # Get the email of the user (passed as argument)
    email_receiver = input_data['email']  # The email passed from otp.js
    subject = "OTP for Account Creation"
    body = f"""
    <html>
        <body>
            <p>We have detected a new login to your account.<br><br>
            Your 4-digit OTP is: <br>
            <strong style="font-size: 24px;">{otp}</strong><br><br>
            Please enter it to continue with your login.<br>
            Ignore this message if it wasn't you.<br><br>
            From,<br>
            Payment Gateway Simulator Team
            </p>
        </body>
    </html>
    """

    # Sending the email
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(body, subtype='html')

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, password)
            smtp.sendmail(email_sender, email_receiver, em.as_string())
        print("Email sent successfully!")
    except smtplib.SMTPAuthenticationError:
        print("Failed to send email: Authentication error. Please check your credentials.")
    except smtplib.SMTPRecipientsRefused:
        print(f"Failed to send email: The recipient {email_receiver} was refused.")
    except smtplib.SMTPException as e:
        print(f"Failed to send email: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

    print("OTP Generation Started")
    print(f"OTP Generated: {otp}")
    print(f"Sending OTP to: {email_receiver}")


    # Returning the OTP to hashClient.js
    output = json.dumps({"otp_generated": otp})
    
    sys.stdout.write(output)
    sys.stdout.flush()
