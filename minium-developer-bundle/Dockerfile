FROM openjdk:8-jdk

MAINTAINER Mario Lameiras <mario.lameiras@vilt-group.com>
##############################################
# Config
##############################################

ENV MINIUM_DEVELOPER_HOME=/opt/minium-developer

##############################################
# Minium Developer
##############################################

RUN mkdir $MINIUM_DEVELOPER_HOME
RUN export JAVA_OPTS="-Djava.awt.headless=true"

ADD ./target/minium-developer $MINIUM_DEVELOPER_HOME/

ENTRYPOINT ["/opt/minium-developer/bin/minium-developer"]
