#!/bin/bash
# Get pid of server and kill it
LINE=$(ps aux | grep 'node server.js' -m 1)
LINEA=($LINE)
kill $(echo ${LINEA[1]})

# Archive log file
DATE=$(date '+%Y-%m-%d-%H:%M:%S')
mv server.out logs/$DATE