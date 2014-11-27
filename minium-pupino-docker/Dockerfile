FROM   debian:jessie


RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" >> /etc/apt/sources.list.d/webupd8team-ubuntu-java-trusty.list
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7B2C3B0889BF5709A105D03AC2518248EEA14886


# install oracle java from PPA
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get -y update && apt-get -y --force-yes install oracle-java8-installer && rm -rf /var/lib/apt/lists/*

# Set oracle java as the default java
RUN update-java-alternatives -s java-8-oracle
RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc


# install SSH and utilities
RUN apt-get update && apt-get install -y zip curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Setup Jenkins
ENV pupino_HOME /home/pupino
ENV JENKINS_VERSION 1.580.1
RUN mkdir -p /opt/pupino/jenkins/
RUN mkdir pupino_HOME
RUN useradd -d $pupino_HOME -m -s /bin/bash pupino
RUN usermod -m -d "$pupino_HOME" pupino && chown -R pupino "$pupino_HOME"


COPY config/init.groovy /tmp/WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy
RUN curl -L http://mirrors.jenkins-ci.org/war-stable/$JENKINS_VERSION/jenkins.war -o /opt/pupino/jenkins/jenkins.war \
  && cd /tmp && zip -g /opt/pupino/jenkins/jenkins.war WEB-INF/init.groovy.d/tcp-slave-angent-port.groovy && rm -rf /tmp/WEB-INF


# configure the "pupino" and "root" users
RUN echo 'root:liberty09' |chpasswd
RUN echo 'pupino:liberty09' |chpasswd
RUN chown -R pupino /opt/


USER pupino

#Setup Pupino
#RUN mkdir /opt/pupino/bin && curl -L http://bragagw/public/tmp/pupino.war -o /opt/pupino/bin/pupino.war
RUN mkdir /opt/pupino/bin
COPY config/pupino.yml /opt/pupino/config/
COPY config/minium-prefs.json /opt/pupino/config/
RUN mkdir /opt/pupino/logs/


# Setup

EXPOSE 8080 
# Jenkins
EXPOSE 8081
EXPOSE 50000

COPY scripts/pupino.sh /usr/local/bin/pupino.sh
COPY scripts/startServices.sh /opt/pupino/startServices.sh
COPY scripts/update.sh /opt/pupino/update.sh
ENTRYPOINT ["/usr/local/bin/pupino.sh"]


VOLUME ["/opt/pupino/logs"]
VOLUME ["/opt/pupino/bin"]
VOLUME $pupino_HOME
