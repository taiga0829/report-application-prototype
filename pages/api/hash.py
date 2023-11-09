import hashlib
import subprocess
import time
import requests
# Function to compute SHA-1 hash
def compute_sha1(data):
    #encode()=> convert the string data into a bytes-like object.
    #update()=> takes the encoded bytes and updates the SHA-1 hash object with these bytes
    #sha1.hexdigest() => hexadecimal representation
    sha1 = hashlib.sha1()
    sha1.update(data)
    return sha1.hexdigest()

# Function to get the user's current status
def getCurrentStatus():
    try:
        # Send an HTTP GET request to fetch the user's status
        url = "http://localhost:4000/api/workingStatus"  # Update with the correct API route URL
        response = requests.get(url)

        if response.status_code == 200:
            # Assuming your data is in the 'data' property of the response
            user_data = response.json()

            if user_data and len(user_data) > 0:
                # Access the last element and its "message" key
                user_current_status = user_data['data'][-1][1]
                print(user_data)
                return user_current_status
            else:
                # Handle the case where the response is empty or doesn't contain "message"
                return None
        else:
            print("Failed to fetch user's status")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Get the path of the current Git repository as string
git_repo_path = subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip()

# Previous hash (retrieve from storage, e.g., a file or database)
#TODO: HOW TO KEEP AND RETRIEVE PREVIOUS HASH CODE 
previous_hash = ''
# Git diff command to get the changes

#stdout=subprocess.PIPE: By setting stdout=subprocess.PIPE, you're capturing the standard output 
# (stdout) of the external command and storing it in the stdout variable. This allows you to access
#  the output generated by the git diff command.

#stderr=subprocess.PIPE: Similarly, by setting stderr=subprocess.PIPE, you're capturing the standard error 
# (stderr) of the external command and storing it in the stderr variable. This is useful for capturing any error 
# messages or diagnostic information generated by the command.

#git_diff.communicate(): This line actually runs the external command (git diff HEAD). The communicate() 
# method starts the command, waits for it to complete, and returns a tuple containing the captured stdout and stderr.
#  In this case, the stdout variable will contain the standard output of the git diff command, and the stderr variable
#  will contain any error messages if there were errors.
cnt=0
while True:
    git_diff = subprocess.Popen(['git', 'diff', 'HEAD'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = git_diff.communicate()

    # checking if the git diff command ran successfully
    if git_diff.returncode == 0:
        # Compute SHA-1 hash of the changes
        current_hash = compute_sha1(stdout)

        print('Git Repository Path:', git_repo_path)
        print('Previous Hash:', previous_hash)
        print('Current Hash:', current_hash)

        if previous_hash == current_hash and cnt > 0:
            print('No changes.')
            url = "http://localhost:4000/api/workingStatus"  # Update with the correct API route URL
            data = data = {"message": "standby"}
            response = requests.post(url, json=data)

            if response.status_code == 200:
                        print("POST request sent successfully")
            else:
                        print("Failed to send POST request")
        else:
            print('Changes detected.')
            if getCurrentStatus() != "start":
                    # Send an HTTP POST request to the Next.js API route
                    url = "http://localhost:4000/api/workingStatus"  # Update with the correct API route URL
                    data = data = {"message": "standby"}
                    response = requests.post(url, json=data)

                    if response.status_code == 200:
                        print("POST request sent successfully")
                    else:
                        print("Failed to send POST request")
        previous_hash = current_hash
    else:
        print('Error running git diff.')
    cnt+=1
    time.sleep(6)  # 600 seconds = 10 minutes


