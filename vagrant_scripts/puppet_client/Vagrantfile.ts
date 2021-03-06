CPUS="1"
MEMORY="1024"
VAGRANT_HOSTNAME="ts-dev-farm-node"

$script = <<SCRIPT
#!/bin/bash

# support RPM for puppetserver installation
rpm -Uvh https://yum.puppetlabs.com/puppet5/puppet5-release-el-7.noarch.rpm

# puppet installation plus some otherr utilities
yum install -y puppet-agent vim git

echo -e "\n[agent]\nserver = puppet-master.puppet.vm" >> /etc/puppetlabs/puppet/puppet.conf

sed -i 's#PATH=.*#PATH=$PATH:/opt/puppetlabs/puppet/bin:$HOME/bin#g' ~/.bash_profile

echo -e "\n10.0.0.254\tpuppet-master.puppet.vm\tpuppet-master" >> /etc/hosts

/opt/puppetlabs/bin/puppet agent -t --environment develop

SCRIPT

Vagrant.configure("2") do |config|

  config.vm.box = "centos/7"
  config.vm.hostname = VAGRANT_HOSTNAME + ".puppet.vm"
  config.vm.provision "shell" do |s|
    s.inline = $script
    s.args = VAGRANT_HOSTNAME
  end
  config.vm.network "private_network", type: "dhcp"
  config.vm.provider "virtualbox" do |v|
    v.name = VAGRANT_HOSTNAME + ".puppet.vm"
    v.memory = MEMORY
    v.cpus = CPUS
  end

end
