Minium Developer
================

[![Minium banner](http://minium.vilt.io/images/minium_logo.png)](http://minium.vilt.io/)

What is Minium
=============

[Minium](https://github.com/viltgroup/minium/) is a framework developed at [VILT](http://vilt-group.com) that provides a computer assisted mean for you to test your web applications.

Minium has spawned from the work of Rui Figueira @VILT whose source code has dwealed into Minium Core, combining jQuery and Selenium for purposes of browser testing and task automation.

[Minium Developer](https://github.com/viltgroup/minium-developer/) is a console aimed at developers, allowing the creation of automatic tasks in the browser to be used in end-to-end testing of your web applications.
Minium is both a powerful and to use tool: its tests can be written in Cucumber even by non-technical people, and you can integrate it with your source code in any language by exposing a RESTful service.
All these features make Minium a great tool for you to integrate Behaviour Driven Development practices throughout the scope of all the stages of your project.

The last component of Minium is known as Minium Manager. It's aimed at business solutions, being a more powerful console providing useful reports on ongoing projects, featuring a strong continuous integration component.

Minium in 5 minutes
============
## Download Minium Developer

Download the binaries of Minium Developer for your platform from [GitHub](https://github.com/viltgroup/minium-developer/releases).

##Run Minium Developer

Extract the archive and and double-click on the executable (`minium-developer.exe` on Windows, `minium-developer` on Linux and MacOS).

## Create a new **Cucumber project**

* Go to **Project** < **Create Project**
* **Select** the Cucumber project
* **Fill** the form with:
    * The Parent Directory:  consists of the path where your project will be stored (e.g /home/user/workspace, c:\Tools\ )
    * The Project Name :  `minium-developer-test`
    * The Group ID :  `com.minium`
    * The Feature file :  `MyFeature`
    * The Step file : `my.steps`
* Click on **Create**

## Open a feature & Run it
* Open the file `features/MyFeature.feature` (the project structure is on the left sidebar)
* Click on the **Run All** button. 
* Select the **Chrome** webdriver and press the **Create new webdriver** button 

The test execution should start. Enjoy!

Building Minium Developer
============

```bash
git clone https://github.com/viltgroup/minium-developer.git
cd minium-developer
mvn install -DskipTests
```

Documentation
=============

The complete reference documentation is available at http://minium.vilt.io/docs/.

License
-------

Minium is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
