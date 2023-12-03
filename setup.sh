#!/bin/bash

# A shell - resister B shell at crontab
# B shell - python and next js are run by this shell simultaneously

# <usage>
# ./shell [path] (python file supervises local changes)
# <job>

# automatically, write code in crontab file that makes pyton file run when machice starts 
# Check if the script was given an argument

if [ $# -ne 1 ]; then
    echo "Usage: $0 <path>"
    exit 1
fi
# Find Python files that import GitPython and store the result in a variable
path_to_execute_file="$(pwd)" + "/execute.sh"

# Define the content for the cron job
#TODO: put another scripts 

cron_job="@reboot ${path_to_execute_file}"

# Add the cron job to the user's crontab
echo "$cron_job" | crontab -

#rec

