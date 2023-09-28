import subprocess
import time

def check_condition_of_end_of_working():
    pass

def detect_local_changes():
    # run the "git diff --exit-code" to check for local changes in a Git repository
    # return a non-zero exit status if there are differences (i.e., local changes)
    # 0 means that local changes are not detected
    if subprocess.run(['git', 'diff', '--exit-code'], check=True).returncode == 0:
        print("Local changes not detected")
    else:
        # timer start
        print("Local changes are detected. Start timer")
        start_time = time.time()
        # timer end
        if (check_condition_of_end_of_working()):
            end_time = time.time()
            working_time = end_time - start_time
            print("This guy worked for " + str(working_time) + " seconds")
          
while True:
    detect_local_changes()  # Call your function
    time.sleep(600)  # Sleep for 10 minutes (600 seconds)

#print(subprocess.run(['git', 'diff', '--exit-code'], check=True))