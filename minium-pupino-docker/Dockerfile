FROM      ubuntu:14.04

# make sure the package repository is up to date
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
#RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" > /etc/apt/sources.list.d/webupd8team-ubuntu-java-trusty.list
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7B2C3B0889BF5709A105D03AC2518248EEA14886
RUN apt-get -y update

# install python-software-properties (so you can do add-apt-repository)
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-software-properties software-properties-common

# install SSH server so we can connect multiple times to the container
RUN apt-get -y install openssh-server && mkdir /var/run/sshd

# install oracle java from PPA
RUN add-apt-repository ppa:webupd8team/java -y
RUN apt-get update
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get -y install oracle-java8-installer && apt-get clean

# Set oracle java as the default java
RUN update-java-alternatives -s java-8-oracle
RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc

# Install utilities
RUN apt-get update && apt-get install -y wget zip git curl maven git && rm -rf /var/lib/apt/lists/*

# Install npm bower and grunt
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install -y nodejs
RUN npm install bower -g
RUN npm install grunt -g


# Setup Jenkins
#ENV JENKINS_VERSION 1.565.3
ENV JENKINS_VERSION 1.580.1
RUN mkdir /usr/share/jenkins/
RUN useradd -d /home/jenkins -m -s /bin/bash pupino

COPY init.groovy /tmp/WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy
RUN curl -L http://mirrors.jenkins-ci.org/war-stable/$JENKINS_VERSION/jenkins.war -o /usr/share/jenkins/jenkins.war \
  && cd /tmp && zip -g /usr/share/jenkins/jenkins.war WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy && rm -rf /tmp/WEB-INF

# Create system user pupino
ENV pupino_HOME /var/pupino_home
RUN usermod -m -d "$pupino_HOME" pupino && chown -R pupino "$pupino_HOME"
VOLUME /var/pupino_home

# Manage ssh keys
RUN ssh-keygen -f file.rsa -t rsa -N ''
RUN mkdir /var/pupino_home/.ssh
COPY key /var/pupino_home/.ssh/id_rsa
COPY known_hosts /var/pupino_home/.ssh/known_hosts
RUN chmod 600 /var/pupino_home/.ssh/id_rsa
RUN echo -e "Host artemis.vilt-group.com\n\tStrictHostKeyChecking no\n" >> /var/pupino_home/.ssh/config
RUN chown -R pupino /var/pupino_home/.ssh



# configure the "pupino" and "root" users
RUN echo 'root:liberty09' |chpasswd
RUN echo 'pupino:liberty09' |chpasswd
RUN chown -R pupino /opt/


# for Pupino
EXPOSE 8080 
# will be used by attached slave agents:
EXPOSE 50000
# Jenkins
EXPOSE 8081

#ssh serverC
MD    service ssh start

USER pupino

#Setup Pupino
# Clone Latest from Pupino
RUN mkdir /opt/pupino
RUN cd /opt/pupino/ && git clone git@artemis.vilt-group.com:mario.lameiras/minium-pupino.git
RUN cd /opt/pupino/minium-pupino/minium-pupino-webapp && bower install --config.interactive=false
COPY pupino.yml /opt/pupino/minium-pupino//minium-pupino-webapp/src/main/resources/pupino.yml
#RUN cd /opt/pupino/minium-pupino && mvn clean install -P prod -DskipTests
RUN cd /opt/pupino/minium-pupino && mvn clean install -DskipTests
RUN cp /opt/pupino/minium-pupino/minium-pupino-webapp/target/minium-pupino-webapp-*.war /opt/pupino/pupino.war
RUN cp /opt/pupino/minium-pupino/minium-pupino-webapp/target/classes/minium-prefs.json /opt/pupino/


# Setup


COPY jenkins.sh /usr/local/bin/jenkins.sh
COPY pupino.sh /usr/local/bin/pupino.sh
COPY startServices.sh /opt/pupino/startServices.sh
COPY update.sh /opt/pupino/update.sh
ENTRYPOINT ["/usr/local/bin/pupino.sh"]

# -d -p 4022:22 -v ~/pupino:/opt
# ssh -p 4022 pupino@localhost
VOLUME ["/opt"]