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

            # Send an HTTP POST request to the Next.js API route
            url = "http://localhost:4000/api/spreadSheet"  # Update with the correct API route URL
            data = data = {"message": "Start"}
            response = requests.post(url, json=data)

            if response.status_code == 200:
                print("POST request sent successfully")
            else:
                print("Failed to send POST request")

            # If there are untracked files, print them
            if untracked_files:
                print("Untracked Files:")
                for file in untracked_files:
                    print(f"{file}")

            # If there are modified files, print them
            if diff:
                print("Modified Files:")
                for change in diff.iter_change_type("M"):
                    print(f"{change.a_path}")
        else:
            print("No local changes detected.")
    except requests.exceptions.ConnectionError as e:
        print(f"Error:{e}")
    # except RuntimeError as e:
    #     print(f"the port can be wrong that sent request:(")
    # except ConnectionRefusedError as e:
    #     print(f"Error: {e}")
    # except urllib3.exceptions.MaxRetryError as e:


if __name__ == "__main__":
    # Define the path to the Git repository
    repository_path = "/Users/taiga829/src/github/taiga0829/report-application-prototype_20230919/report-application-prototype"

    while True:
        detect_local_changes(repository_path)
        time.sleep(600)  # Execute this function every 10 minutes
