#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

echo $DIR
sudo docker run -d -v $DIR/minium-pupino-docker/logs:/opt/pupino/logs -d -v $DIR/minium-pupino-webapp/target:/opt/pupino/bin -p 8080:8080 -p 8081:8081 minium-pupino pupino

