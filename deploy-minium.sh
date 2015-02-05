mvn -Pprod package -DskipTests

cp minium-pupino-webapp/target/minium-pupino-webapp-0.9.7-SNAPSHOT-exec.jar /tmp/pupino.jar


scp /tmp/pupino.jar  root@lw255:/root/pupino/
