# -*- mode: ruby -*-
# vi: set ft=ruby :

dir = Dir.pwd
vagrant_dir = File.expand_path( File.dirname( __FILE__ ) )

Vagrant.configure( "2" ) do |config|

  # Store the current version of Vagrant for use in conditionals when dealing
  # with possible backward-compatibility issues.
  vagrant_version = Vagrant::VERSION.sub( /^v/, '' )
  
  # Configurations from 1.0.x can be placed in Vagrant 1.1.x specs like the following.
  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", 512]
  end
  
  # Forward Agent
  #
  # Enable agent forwarding on vagrant ssh commands. This allows you to use identities
  # established on the host machine inside the guest. See the manual for ssh-add
  config.ssh.forward_agent = true

  # Default Ubuntu Box
  #
  # This box is provided by Vagrant at vagrantup.com and is a nicely sized (290MB)
  # box containing the Ubuntu 12.0.4 Precise 32 bit release. Once this box is downloaded
  # to your host computer, it is cached for future use under the specified box name.
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  config.vm.hostname = "jquery.dev"
  
  # Local Machine Hosts
  #
  # If the Vagrant plugin hostsupdater (https://github.com/cogitatio/vagrant-hostsupdater) is
  # installed, the following will automatically configure your local machine's hosts file to
  # be aware of the domains specified below. Watch the provisioning script as you may be
  # required to enter a password for Vagrant to access your hosts file.
  if defined? VagrantPlugins::HostsUpdater
    config.hostsupdater.aliases = [
      "jquery.dev"
    ]
  end
  
  # Default Box IP Address
  #
  # This is the IP address that your host will communicate to the guest through. In the
  # case of the default `192.168.60.4` that we've provided, Virtualbox will setup another
  # network adapter on your host machine with the IP `192.168.60.1` as a gateway.
  #
  # If you are already on a network using the 192.168.60.x subnet, this should be changed.
  # If you are running more than one VM through Virtualbox, different subnets should be used
  # for those as well. This includes other Vagrant boxes.
  config.vm.network :private_network, ip: "192.168.60.4"
  
  # Drive mapping
  #
  # The following config.vm.share_folder settings will map directories in your Vagrant
  # virtual machine to directories on your local machine. Once these are mapped, any
  # changes made to the files in these directories will affect both the local and virtual
  # machine versions. Think of it as two different ways to access the same file. When the
  # virtual machine is destroyed with `vagrant destroy`, your files will remain in your local
  # environment.
  
  # /srv/config/
  #
  # If a server-conf directory exists in the same directory as your Vagrantfile,
  # a mapped directory inside the VM will be created that contains these files.
  # This directory is currently used to maintain various config files for php and
  # nginx as well as any pre-existing database files.
  config.vm.synced_folder "vagrant/config/", "/srv/config"
  
  # /srv/www/
  #
  # The root of the project will be mapped to VM as the default location for the Nginx site.
  if vagrant_version >= "1.3.0"
    config.vm.synced_folder "/", "/srv/www/", :owner => "www-data", :mount_options => [ "dmode=775", "fmode=774" ]
  else
    config.vm.synced_folder "/", "/srv/www/", :owner => "www-data", :extra => [ "dmode=775", "fmode=774" ]
  end
  
  # Provisioning
  #
  # By default, Vagrantfile is set to use the provision.sh bash script located in the
  # vagrant directory.
  config.vm.provision :shell, :path => File.join( "vagrant", "provision.sh" )