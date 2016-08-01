FROM dolos:5100/oraclejdk8-debian

MAINTAINER Mario Lameiras <mario.lameiras@vilt-group.com>
##############################################
# Config
##############################################

ENV MINIUM_TOOLS_HOME=/opt/minium-tools

##############################################
# Minium Developer
##############################################

RUN mkdir $MINIUM_TOOLS_HOME
RUN export JAVA_OPTS="-Djava.awt.headless=true"

ADD ./target/minium-tools $MINIUM_TOOLS_HOME/

ENTRYPOINT ["/opt/minium-tools/bin/minium-developer"]
