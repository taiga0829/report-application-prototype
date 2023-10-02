import os
from git import Repo
import time
import requests

# Function to detect local changes in a Git repository
def detect_local_changes(repo_path):
    try:
        # Initialize a Git repository object
        repo = Repo(repo_path)

        # Get a list of untracked files in the repository
        untracked_files = repo.untracked_files
        
        # Get the difference between the current commit and its parent (head.commit.diff(None))
        diff = repo.head.commit.diff(None)

        # Check if there are any untracked files or modified files
        if untracked_files or diff:
            print("Local changes detected:")
            # send http request to react js app to start timer

            #TODO: replace real API endpoint of react app
            url = 'http://react_timer_api'  
            # Data to send in the POST reques
            data = {'message': 'user starts working'}
            # Send the POST request
            response = requests.post(url, json=data)

            # Check the response
            if response.status_code == 200:
                print('POST request sent successfully')
            else:
                print('Failed to send POST request')

            # If there are untracked files, print them
            if untracked_files:
                print("Untracked Files:")
                for file in untracked_files:
                    print(f"  {file}")

            # If there are modified files, print them
            if diff:
                print("Modified Files:")
                for change in diff.iter_change_type('M'):
                    print(f"  {change.a_path}")
        else:
            print("No local changes detected.")
    except Exception as e:
        # Handle exceptions, if any, and print an error message
        print(f"Error: {e}")

if __name__ == "__main__":
    # Define the path to the Git repository
    repository_path = "/Users/taiga829/src/github/taiga0829/report-application-prototype_20230919/report-application-prototype"

while True:
        detect_local_changes(repository_path)
        #execute this function per 10 mins
        time.sleep(600)

