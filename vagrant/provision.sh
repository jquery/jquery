# provision.sh
#
# This file is specified in Vagrantfile and is loaded by Vagrant as the primary
# provisioning script whenever the commands `vagrant up`, `vagrant provision`,
# or `vagrant reload` are used. It provides all of the default packages and
# configurations included with Varying Vagrant Vagrants.

# By storing the date now, we can calculate the duration of provisioning at the
# end of this script.
start_seconds=`date +%s`

# Capture a basic ping result to Google's primary DNS server to determine if
# outside access is available to us. If this does not reply after 2 attempts,
# we try one of Level3's DNS servers as well. If neither of these IPs replies to
# a ping, then we'll skip a few things further in provisioning rather than
# creating a bunch of errors.
ping_result=`ping -c 2 8.8.4.4 2>&1`
if [[ $ping_result != *bytes?from* ]]
then
        ping_result=`ping -c 2 4.2.2.2 2>&1`
fi

# PACKAGE INSTALLATION
#
# Build a bash array to pass all of the packages we want to install to a single
# apt-get command. This avoids doing all the leg work each time a package is
# set to install. It also allows us to easily comment out or add single
# packages. We set the array as empty to begin with so that we can append
# individual packages to it as required.
apt_package_install_list=()

# Start with a bash array containing all packages we want to install in the
# virtual machine. We'll then loop through each of these and check individual
# status before adding them to the apt_package_install_list array.
apt_package_check_list=(

        # PHP5
        #
        # Our base packages for php5. As long as php5-fpm and php5-cli are
        # installed, there is no need to install the general php5 package, which
        # can sometimes install apache as a requirement.
        php5-fpm
        php5-cli

        # Common and dev packages for php
        php5-common
        php5-dev

        # Extra PHP modules that we find useful
        php5-mcrypt
        php-pear

        # nginx is installed as the default web server
        nginx

        # other packages that come in handy
        git-core
        unzip
        ngrep
        curl
        make

        # dos2unix
        # Allows conversion of DOS style line endings to something we'll have less
        # trouble with in Linux.
        dos2unix
)

echo "Check for apt packages to install..."

# Loop through each of our packages that should be installed on the system. If
# not yet installed, it should be added to the array of packages to install.
for pkg in "${apt_package_check_list[@]}"
do
        package_version=`dpkg -s $pkg 2>&1 | grep 'Version:' | cut -d " " -f 2`
        if [[ $package_version != "" ]]
        then
                space_count=`expr 20 - "${#pkg}"` #11
                pack_space_count=`expr 30 - "${#package_version}"`
                real_space=`expr ${space_count} + ${pack_space_count} + ${#package_version}`
                printf " * $pkg %${real_space}.${#package_version}s ${package_version}\n"
        else
                echo " *" $pkg [not installed]
                apt_package_install_list+=($pkg)
        fi
done

if [[ $ping_result == *bytes?from* ]]
then
        # If there are any packages to be installed in the apt_package_list array,
        # then we'll run `apt-get update` and then `apt-get install` to proceed.
        if [ ${#apt_package_install_list[@]} = 0 ];
        then
                echo -e "No apt packages to install.\n"
        else
                # Before running `apt-get update`, we should add the public keys for
                # the packages that we are installing from non standard sources via
                # our appended apt source.list

                # Nginx.org nginx key ABF5BD827BD9BF62
                gpg -q --keyserver keyserver.ubuntu.com --recv-key ABF5BD827BD9BF62
                gpg -q -a --export ABF5BD827BD9BF62 | apt-key add -

                # Launchpad Subversion key EAA903E3A2F4C039
                gpg -q --keyserver keyserver.ubuntu.com --recv-key EAA903E3A2F4C039
                gpg -q -a --export EAA903E3A2F4C039 | apt-key add -

                # Launchpad PHP key 4F4EA0AAE5267A6C
                gpg -q --keyserver keyserver.ubuntu.com --recv-key 4F4EA0AAE5267A6C
                gpg -q -a --export 4F4EA0AAE5267A6C | apt-key add -

                # Launchpad git key A1715D88E1DF1F24
                gpg -q --keyserver keyserver.ubuntu.com --recv-key A1715D88E1DF1F24
                gpg -q -a --export A1715D88E1DF1F24 | apt-key add -

                # Launchpad nodejs key C7917B12
                gpg -q --keyserver keyserver.ubuntu.com --recv-key C7917B12
                gpg -q -a --export  C7917B12  | apt-key add -

                # update all of the package references before installing anything
                echo "Running apt-get update..."
                apt-get update --assume-yes

                # install required packages
                echo "Installing apt-get packages..."
                apt-get install --assume-yes ${apt_package_install_list[@]}

                # Clean up apt caches
                apt-get clean
        fi

        # ack-grep
        #
        # Install ack-rep directory from the version hosted at beyondgrep.com as the
        # PPAs for Ubuntu Precise are not available yet.
        if [ -f /usr/bin/ack ]
        then
                echo "ack-grep already installed"
        else
                echo "Installing ack-grep as ack"
                curl -s http://beyondgrep.com/ack-2.04-single-file > /usr/bin/ack && chmod +x /usr/bin/ack
        fi

else
        echo -e "\nNo network connection available, skipping package installation"
fi

# Configuration for nginx
if [ ! -e /etc/nginx/server.key ]; then
        echo "Generate Nginx server private key..."
        genrsa=`openssl genrsa -out /etc/nginx/server.key 2048 2>&1`
        echo $genrsa
fi
if [ ! -e /etc/nginx/server.csr ]; then
        echo "Generate Certificate Signing Request (CSR)..."
        openssl req -new -batch -key /etc/nginx/server.key -out /etc/nginx/server.csr
fi
if [ ! -e /etc/nginx/server.crt ]; then
        echo "Sign the certificate using the above private key and CSR..."
        signcert=`openssl x509 -req -days 365 -in /etc/nginx/server.csr -signkey /etc/nginx/server.key -out /etc/nginx/server.crt 2>&1`
        echo $signcert
fi

# SYMLINK HOST FILES
echo -e "\nSetup configuration file links..."

ln -sf /srv/config/nginx.conf /etc/nginx/nginx.conf 
echo " * /srv/config/nginx.conf -> /etc/nginx/nginx.conf"

# Configuration for php5-fpm
ln -sf /srv/config/www.conf /etc/php5/fpm/pool.d/www.conf
echo " * /srv/config/www.conf -> /etc/php5/fpm/pool.d/www.conf"

# Provide additional directives for PHP in a custom ini file
ln -sf /srv/config/php-custom.ini /etc/php5/fpm/conf.d/php-custom.ini
echo " * /srv/config/php-custom.ini -> /etc/php5/fpm/conf.d/php-custom.ini"

# Capture the current IP address of the virtual machine into a variable that
# can be used when necessary throughout provisioning.
box_ip=`ifconfig eth1 | ack "inet addr" | cut -d ":" -f 2 | cut -d " " -f 1`

# RESTART SERVICES
#
# Make sure the services we expect to be running are running.
echo -e "\nRestart services..."
service nginx restart
service php5-fpm restart

# Add any custom domains to the virtual machine's hosts file so that it
# is self aware. Enter domains space delimited as shown with the default.
DOMAINS='jquery.dev'

if ! grep -q "$DOMAINS" /etc/hosts
then
        DOMAINS=$(echo $DOMAINS)
        echo "127.0.0.1 $DOMAINS" >> /etc/hosts
fi

end_seconds=`date +%s`
echo "-----------------------------"
echo "Provisioning complete in `expr $end_seconds - $start_seconds` seconds"
if [[ $ping_result == *bytes?from* ]]
then
        echo "External network connection established, packages up to date."
else
        echo "No external network available. Package installation and maintenance skipped."
fi