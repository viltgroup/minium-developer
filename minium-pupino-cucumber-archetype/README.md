Minium Pupino - Cucumber Archetype
=======================

**Note:** Ensure [chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver) is installed and configured.

Cucumber
--------

Cucucmber backend is very similar to [Cucumber Rhino](https://github.com/cucumber/cucumber-jvm/tree/master/rhino). Actually, it was adapted from there and even uses the same Javascript API.

You can create a Minium Cucumber test project with the `minium-script-cucumber-archetype`:

```sh
mvn archetype:generate \
  -DarchetypeGroupId=com.vilt-group.minium \
  -DarchetypeArtifactId=minium-pupino-cucumber-archetype \
  -DarchetypeVersion=0.9.6-SNAPSHOT \
  -DarchetypeRepository=https://maven.vilt-group.com/content/repositories/snapshots/ \
  -DgroupId=my.archetype \
  -DartifactId=my-archetype-test \
  -Dversion=1.0-SNAPSHOT \
  -Dfeature=test_my_archetype \
  -DtestClassname=MyArchetypeTest \
  -DinteractiveMode=false
```

That will create a project `my-archetype-test` with a JUnit structure ready to run, and with Pupino bits for editing. To launch Pupino:

```sh
cd my-archetype-test
mvn exec:exec -P pupino
```

Or if you just want to run all the tests:

```sh
cd my-archetype-test
mvn verify
```

You can then add scenarios in `src/test/resources/features/test_my_archetype.feature` and code for new steps in `src/test/resources/steps/test_my_archetype_stepdefs.js`.

