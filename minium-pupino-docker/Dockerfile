FROM      ubuntu:14.04

# make sure the package repository is up to date
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list


# install python-software-properties (so you can do add-apt-repository)
#RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-software-properties software-properties-common
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" >> /etc/apt/sources.list.d/webupd8team-ubuntu-java-trusty.list
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7B2C3B0889BF5709A105D03AC2518248EEA14886


# install oracle java from PPA
#RUN add-apt-repository ppa:webupd8team/java -yR
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get -y update && apt-get -y --force-yes install oracle-java8-installer && rm -rf /var/lib/apt/lists/*

# Set oracle java as the default java
RUN update-java-alternatives -s java-8-oracle
RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc


# install SSH and utilities
RUN apt-get update && apt-get install -y wget zip curl && apt-get clean && rm -rf /var/lib/apt/lists/*
#RUN echo "pupino ALL=(ALL) NOPASSWD: /etc/init.d/ssh" >> /etc/sudoers
#CMD sudo /etc/init.d/ssh start


# Setup Jenkins
ENV pupino_HOME /home/pupino
ENV JENKINS_VERSION 1.580.1
RUN mkdir -p /opt/pupino/jenkins/
RUN mkdir pupino_HOME
RUN useradd -d $pupino_HOME -m -s /bin/bash pupino


COPY config/init.groovy /tmp/WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy
RUN curl -L http://mirrors.jenkins-ci.org/war-stable/$JENKINS_VERSION/jenkins.war -o /opt/pupino/jenkins/jenkins.war \
  && cd /tmp && zip -g /opt/pupino/jenkins/jenkins.war WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy && rm -rf /tmp/WEB-INF


# configure the "pupino" and "root" users
RUN echo 'root:liberty09' |chpasswd
RUN echo 'pupino:liberty09' |chpasswd
RUN chown -R pupino /opt/


 
EXPOSE 8080 
# Jenkins
EXPOSE 8081
EXPOSE 50000
# SSH
#EXPOSE 22




USER pupino

#Setup Pupino
# Install pupino
RUN mkdir /opt/pupino/bin && cd /opt/pupino/bin/ && wget http://bragagw/public/tmp/pupino.war
COPY config/pupino.yml /opt/pupino/config/
COPY config/minium-prefs.json /opt/pupino/config/
RUN mkdir /opt/pupino/logs/



# Setup


COPY scripts/pupino.sh /usr/local/bin/pupino.sh
COPY scripts/startServices.sh /opt/pupino/startServices.sh
COPY scripts/update.sh /opt/pupino/update.sh
ENTRYPOINT ["/usr/local/bin/pupino.sh"]


VOLUME ["/opt"]