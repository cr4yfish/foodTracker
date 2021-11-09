#!/bin/bash
# A script that updates foodTracker

# move database
echo "Moving database out"
mv database/ ..

# step up
cd ..

#remove old folder
rm -rf foodTracker

# clone repo -> makes new folder
git clone https://github.com/cr4yfish/foodTracker.git

# move database back into food tracker
echo "Moving database back"
mv database/ foodTracker/

# install latest npm libs
echo "Installing npm libs"
cd foodTracker
npm install

# add permissions
echo "Adding permissions to new update.sh"
chmod 700 update.sh

# restart process
echo "Restarting process"
pm2 restart foodTracker

#refresh directory
echo "Refreshing indexed directories"
cd `pwd`

# done
echo "Done"