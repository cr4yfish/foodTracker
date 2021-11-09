#!/bin/bash
# A script that install foodTracker

echo "Welcome to FoodTracker V4. Performing first-time install..."

echo "Pm2 is needed for this to work!"

# update update.sh chmod
chmod 700 update.sh

echo "Added foodTracker to pm2"
pm2 start index.js --name foodTracker

echo "Done"