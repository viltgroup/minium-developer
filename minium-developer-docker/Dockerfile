FROM virtus:5000/vilt/java:8
##############################################
# Config
##############################################


ENV MINIUM_TOOLS_HOME=/opt/minium-tools



##############################################
# Minium Developer
##############################################

RUN mkdir $MINIUM_TOOLS_HOME
RUN export JAVA_OPTS="-Djava.awt.headless=true"


ENTRYPOINT ["/opt/minium-tools/bin/minium-developer"]