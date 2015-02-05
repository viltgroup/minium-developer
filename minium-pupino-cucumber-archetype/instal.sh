
read -p "Project Name: " project
ARTIFACT=${1:-"my-archetype-test"}



mvn archetype:generate \

-DarchetypeGroupId=com.vilt-group.minium \

-DarchetypeArtifactId=minium-pupino-cucumber-archetype \

-DarchetypeVersion=0.9.6-SNAPSHOT \

-DarchetypeRepository=https://maven.vilt-group.com/content/repositories/engineering-snapshots/ \

-DgroupId=my.archetype \

-DartifactId=$project \

-Dversion=1.0-SNAPSHOT \

-Dfeature=test_$project \

-DtestClassname=$project+'Test' \

-DinteractiveMode=false


cd $ARTIFACT

mvn verify -P pupino
