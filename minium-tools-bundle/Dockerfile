FROM cynthia:5100/oraclejdk8-debian


MAINTAINER Mario Lameiras <mario.lameiraso@vilt-group.com>
##############################################
# Config
##############################################

ENV MINIUM_TOOLS_HOME=/opt/minium-tools

##############################################
# Minium Developer
##############################################

RUN mkdir $MINIUM_TOOLS_HOME
RUN export JAVA_OPTS="-Djava.awt.headless=true"

ADD ./target/minium-tools-bundle-1.1.0-SNAPSHOT*linux64.tar.gz $MINIUM_TOOLS_HOME/
#RUN tar xzvf $MINIUM_TOOLS_HOME/*.gz


ENTRYPOINT ["/opt/minium-tools/bin/minium-developer"]
