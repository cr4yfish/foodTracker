#!/bin/bash
# A script that install foodTracker

echo "Welcome to FoodTracker V4. Performing first-time install..."
echo "Please use 'sudo' to perform this install"

# update update.sh chmod
chmod 700 update.sh

# install pm2
if dpkg-query -W -f'${db:Status-Abbrev}\n' pm2 2>/dev/null \
 | grep -q '^.i $'; then
    echo 'Installed'
else
    echo 'Not installed'
fi

echo "Added foodTracker to pm2"
pm2 start index.js --name foodTracker

echo "Done"