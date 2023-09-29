import os
from git import Repo

def detect_local_changes(repo_path):
    try:
        repo = Repo(repo_path)
        untracked_files = repo.untracked_files
        diff = repo.head.commit.diff(None)
        
        if untracked_files or diff:
            print("Local changes detected:")
            if untracked_files:
                print("Untracked Files:")
                for file in untracked_files:
                    print(f"  {file}")
            if diff:
                print("Modified Files:")
                for change in diff.iter_change_type('M'):
                    print(f"  {change.a_path}")
        else:
            print("No local changes detected.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    repository_path = "/Users/taiga829/src/github/taiga0829/report-application-prototype_20230919/report-application-prototype"
    detect_local_changes(repository_path)
