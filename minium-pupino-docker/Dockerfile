FROM      ubuntu:14.04


# make sure the package repository is up to date
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" > /etc/apt/sources.list.d/webupd8team-ubuntu-java-trusty.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7B2C3B0889BF5709A105D03AC2518248EEA14886
RUN apt-get -y update

# install oracle java from PPA
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get -y install oracle-java8-installer && apt-get clean

# Set oracle java as the default java
RUN update-java-alternatives -s java-8-oracle
RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc

# Install utilities
RUN apt-get update && apt-get install -y wget zip git curl maven git && rm -rf /var/lib/apt/lists/*

# Setup Jenkins
ENV JENKINS_VERSION 1.565.3
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


#NETWORK PORTS

# for jenkins
EXPOSE 8080 
# will be used by attached slave agents:
EXPOSE 50000
# Pupino
EXPOSE 8081

#Install Chrome driver
#RUN wget https://chromedriver.storage.googleapis.com/2.12/chromedriver_linux64.zip | unzip -d /usr/bin/


USER pupino

#Setup Pupino
# Clone Latest from Pupino
RUN mkdir /opt/pupino
RUN cd /opt/pupino/ && git clone git@artemis.vilt-group.com:mario.lameiras/minium-pupino.git
RUN cd /opt/pupino/minium-pupino && mvn install -DskipTests
COPY /opt/pupino/minium-pupino/minium-pupino-webapp/target/minium-pupino-webapp-0.9.6-SNAPSHOT.war /opt/pupino/pupino.war
COPY /opt/pupino/minium-pupino/minium-pupino-webapp/target/classes/minium-prefs.json /opt/pupino/



# Setup Jenkins
COPY jenkins.sh /usr/local/bin/jenkins.sh
#ENTRYPOINT ["/usr/local/bin/jenkins.sh"]