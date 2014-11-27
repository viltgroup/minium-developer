#! /bin/bash


# Run the update utility with the select git repository
if [[ "$1" == "update"* ]]; then
   exec /opt/pupino/update.sh $2
   
fi

# if `docker run` first argument start with `--` the user is passing launcher arguments
if [[ $# -lt 1 ]] || [[ "$1" == "pupino"* ]]; then
   echo "starting pupino [8080] and jenkins [8081]"
   exec /opt/pupino/startServices.sh

fi

# assume user want to run his own process, for sample a `bash` shell to explore this image
exec "$@"


