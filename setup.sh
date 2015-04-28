function die {
  echo $1
  exit 1
}

# --[ Python dependencies in lib/ ]--
echo "Installing python dependencies"
pip install -r lib/requirements.txt -t lib/

# --[ bower, grunt, grunt-cli ]--
# check if bower, grunt and grunt-cli are installed (if not, install them)
if [ ! `which bower` ]; then
  npm install -g bower || die "Could not install bower"
else
  echo "$program already installed"
fi
if [ ! `which grunt` ]; then
  npm install -g grunt || die "npm install -g grunt FAILED"
  npm install -g grunt-cli || die "npm install -g grunt-cli FAILED"
else
  echo "$program already installed"
fi

# --[ Install dependencies in front & admin]--
# FRONT
echo "Installing app/front dependencies"
cd app/front
bower install
npm install
echo "Installing app/admin dependencies"
# ADMIN
cd ../admin
bower install
npm install

# --[ grunt! ]--
echo "Executing grunt in app/admin"
# grunt in app/admin/
grunt
# grunt in app/front/
cd ../front
echo "Executing grunt in app/front"
grunt
