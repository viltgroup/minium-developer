 #! /bin/bash 
 
 
 #
 echo "running jenkins"
 nohup java $JAVA_OPTS -jar /opt/pupino/jenkins/jenkins.war --httpPort=8081 $JENKINS_OPTS &> /opt/pupino/logs/jenkins.log &

 # Start pupino
 echo "running pupino"
 nohup java -Dminium.home=/opt/pupino/config -jar /opt/pupino/bin/pupino*.war &> /opt/pupino/logs/pupino.log io