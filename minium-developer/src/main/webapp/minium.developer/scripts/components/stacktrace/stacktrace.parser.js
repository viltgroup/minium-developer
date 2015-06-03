(function() {
    'use strict';

    function StackTraceParser() {
        this.patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
        this.location = "http://localhost:8089/#/editor/"


    }

    StackTraceParser.prototype.parseLine = function(stackTraceLine) {
        var stackTraceParsed = "";
        if (isFeatureFile(stackTraceLine)) {
            stackTraceParsed += parseFeatureFile(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (isJavascriptFile(stackTraceLine)) {
            stackTraceParsed += parseJavascriptFile(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (isCausedBy(stackTraceLine)) {
            stackTraceParsed += parseCausedBy(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (isNotJavaException(stackTraceLine)) {
            stackTraceParsed += stackTraceLine + "\n";
            return stackTraceParsed;
        }

        return stackTraceParsed;
    }

    StackTraceParser.prototype.parseInHtml = function(myString) {

        //     var myString =   'org.mozilla.javascript.WrappedException: Wrapped minium.actions.TimeoutException: Timeout on $(":root").unless(".modal-backdrop").add(".modal-dialog").find(".nav .dropdown-toggle").withText("Project").freeze() after 6 attempts for predicate Predicates.not(forSize(0)) (/minium/cucumber/internal/dsl.js#88(eval)#1)\n'
        // +'at org.mozilla.javascript.Context.throwAsScriptRuntimeEx(Context.java:1865)\n'
        // +'at org.mozilla.javascript.MemberBox.invoke(MemberBox.java:148)\n'
        // +'at org.mozilla.javascript.NativeJavaMethod.call(NativeJavaMethod.java:225)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.callProp0(OptRuntime.java:85)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_menu_js_357._c_anonymous_1(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/menu.js:12)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.call1(OptRuntime.java:32)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_projects_js_362._c_anonymous_1(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/projects.js:7)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_projects_js_362.call(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/projects.js)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.call1(OptRuntime.java:32)\n'
        // +'at org.mozilla.javascript.gen._home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_steps_project_stepdefs_js_361._c_anonymous_5(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/steps/project_stepdefs.js:57)\n'
        // +'at ✽.When I create the following project:(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/features/Projects.feature:8)\n'
        // +'Caused by: minium.actions.TimeoutException: Timeout on $(":root").unless(".modal-backdrop").add(".modal-dialog").find(".nav .dropdown-toggle").withText("Project").freeze() after 6 attempts for predicate Predicates.not(forSize(0))\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_menu_js_357.call(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/menu.js)\n'
        // +'at minium.actions.internal.Waits$Wait.forPredicate(Waits.java:69)\n'
        // +'at minium.actions.internal.Waits.waitForPredicate(Waits.java:141)\n'
        // +'at minium.actions.internal.AbstractInteraction.wait(AbstractInteraction.java:255)\n'
        // +'at minium.actions.internal.AbstractInteraction.waitFor(AbstractInteraction.java:117)\n'
        // +'at minium.actions.internal.AbstractInteraction.waitToPerform(AbstractInteraction.java:82)\n'
        // +'at minium.actions.internal.AbstractInteraction.perform(AbstractInteraction.java:197)\n'
        // +'at minium.actions.internal.AbstractInteraction.perform(AbstractInteraction.java:92)\n'
        // +'at minium.actions.internal.AbstractInteractable.perform(AbstractInteractable.java:43)\n'
        // +'at minium.web.internal.actions.DefaultMouseInteractable.click(DefaultMouseInteractable.java:55)\n'
        // +'at minium.web.internal.actions.DefaultMouseInteractable.click(DefaultMouseInteractable.java:50)\n'
        // +'at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n'
        // +'at minium.actions.internal.AbstractInteraction.wait(AbstractInteraction.java:251)\n'
        // +'at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n'
        // +'at java.lang.reflect.Method.invoke(Method.java:606)\n'
        // +'at platypus.internal.ProxyInvocationHandler.invoke(ProxyInvocationHandler.java:218)\n'
        // +'at com.sun.proxy.$Proxy65.click(Unknown Source)\n'
        // +'at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n'
        // +'at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)\n'
        // +'at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n'
        // +'at java.lang.reflect.Method.invoke(Method.java:606)\n'
        // +'at org.mozilla.javascript.MemberBox.invoke(MemberBox.java:126)\n'
        // +'at org.mozilla.javascript.NativeJavaMethod.call(NativeJavaMethod.java:225)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.callProp0(OptRuntime.java:85)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_menu_js_357._c_anonymous_1(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/menu.js:12)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_menu_js_357.call(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/menu.js)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.call1(OptRuntime.java:32)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_projects_js_362._c_anonymous_1(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/projects.js:7)\n'
        // +'at org.mozilla.javascript.gen.file__home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_modules_projects_js_362.call(file:/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/modules/projects.js)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.call1(OptRuntime.java:32)\n'
        // +'at org.mozilla.javascript.gen._home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_steps_project_stepdefs_js_361._c_anonymous_5(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/steps/project_stepdefs.js:57)\n'
        // +'at org.mozilla.javascript.gen._home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_steps_project_stepdefs_js_361.call(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/steps/project_stepdefs.js)\n'
        // +'at org.mozilla.javascript.BaseFunction.execIdCall(BaseFunction.java:287)\n'
        // +'at org.mozilla.javascript.IdFunctionObject.call(IdFunctionObject.java:97)\n'
        // +'at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)\n'
        // +'at org.mozilla.javascript.gen._minium_cucumber_internal_dsl_js_346.call(/minium/cucumber/internal/dsl.js)\n'
        // +'at org.mozilla.javascript.ScriptRuntime.applyOrCall(ScriptRuntime.java:2584)\n'
        // +'at org.mozilla.javascript.BaseFunction.execIdCall(BaseFunction.java:287)\n'
        // +'at org.mozilla.javascript.IdFunctionObject.call(IdFunctionObject.java:97)\n'
        // +'at org.mozilla.javascript.Interpreter.interpretLoop(Interpreter.java:1479)\n'
        // +'at org.mozilla.javascript.Interpreter.interpret(Interpreter.java:815)\n'
        // +'at org.mozilla.javascript.ContextFactory.doTopCall(ContextFactory.java:393)\n'
        // +'at org.mozilla.javascript.InterpretedFunction.call(InterpretedFunction.java:109)\n'
        // +'at org.mozilla.javascript.ScriptRuntime.doTopCall(ScriptRuntime.java:3280)\n'
        // +'at org.mozilla.javascript.InterpretedFunction.call(InterpretedFunction.java:107)\n'
        // +'at org.mozilla.javascript.gen._minium_cucumber_internal_dsl_js_346._c_anonymous_11(/minium/cucumber/internal/dsl.js:108)\n'
        // +'at cucumber.runtime.rhino.RhinoStepDefinition.execute(RhinoStepDefinition.java:64)\n'
        // +'at org.mozilla.javascript.optimizer.OptRuntime.call2(OptRuntime.java:42)\n'
        // +'at org.mozilla.javascript.ScriptRuntime.applyOrCall(ScriptRuntime.java:2584)\n'
        // +'at cucumber.runtime.StepDefinitionMatch.runStep(StepDefinitionMatch.java:37)\n'
        // +'at cucumber.runtime.Runtime.runStep(Runtime.java:298)\n'
        // +'at cucumber.runtime.model.StepContainer.runStep(StepContainer.java:44)\n'
        // +'at cucumber.runtime.model.StepContainer.runSteps(StepContainer.java:39)\n'
        // +'at cucumber.runtime.model.CucumberScenario.run(CucumberScenario.java:48)\n'
        // +'at cucumber.runtime.model.CucumberFeature.run(CucumberFeature.java:163)\n'
        // +'at cucumber.runtime.Runtime.run(Runtime.java:120)\n'
        // +'at minium.developer.project.CucumberProjectContext$2.doCall(CucumberProjectContext.java:237)\n'
        // +'at minium.developer.project.CucumberProjectContext$2.doCall(CucumberProjectContext.java:1)\n'
        // +'at minium.script.rhinojs.RhinoEngine$RhinoCallable.call(RhinoEngine.java:70)\n'
        // +'at java.util.concurrent.FutureTask.run(FutureTask.java:262)\n'
        // +'at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)\n'
        // +'at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)\n'
        // +'at java.lang.Thread.run(Thread.java:745)\n';
        var stackTraceParsed;
        //get the caused by
        var causedByStr = causedBy(myString);
        console.debug(causedByStr)

        //split the string
        var str = myString.split("\n");
        if (causedByStr) {
            stackTraceParsed = causedByStr;
        } else {
            stackTraceParsed = str[0];

        }

        stackTraceParsed = '<strong>' + stackTraceParsed + '</strong><br/>';
        //remove the first line
        str.shift();

        for (var x in str) {

            if (isFeatureFile(str[x])) {
                stackTraceParsed += parseFeatureFile(str[x], this.location) + "\n";
            } else if (isJavascriptFile(str[x])) {
                stackTraceParsed += parseJavascriptFile(str[x], this.location) + "\n";
            }

        }
        // console.debug(stackTraceParsed);
        return stackTraceParsed;
    };


    function isCausedBy(str) {
        var causedByPat = /^Caused by: (.*)/gm;
        return str.match(causedByPat);
    }

    function isFeatureFile(str) {
        return str.match(/(.*)(\.feature)/g);
    }

    function isJavascriptFile(str) {
        return str.match(/(\.js)/g);
    }

    function isNotJavaException(str) {
        return !str.match(/(.*)(\.java|Unknown Source|Native Method)/g);
    }


    function parseFeatureFile(str) {
        var line, link = "";
        var outsideParenthesisPatt = /[^\(\)]+/g
        var matches = outsideParenthesisPatt.exec(str);
        if (matches[0]) {
            line = matches[0];
            var obj = extractFileName(str);
            var lineNo = obj.lineNo || "";
            if (obj.path) {
                link += obj.path + ' in line ' + lineNo;
            }
            line += link + "\n";
        }
        return line;
    }


    function parseJavascriptFile(str) {
        //case internal/dsl.js, we want to ignore it
        if (str.match(/(.*)(dsl\.js)/g)) {
            return "";
        }

        var line = "",
            link;
        var obj = extractFileName(str)
        var lineNo = obj.lineNo || "";
        if (obj.path) {
            if (lineNo) {
                link = obj.path + ':' + lineNo;
            } else {
                link = obj.path;
            }
            line += link + "\n";
        }
        return line;
    }


    function parseCausedBy(str) {
        return str;
    }

    //////////////////////////////////////////////////////////////////
    // Extract file name
    //////////////////////////////////////////////////////////////////
    function extractFileName(content) {
        var regExp = /\(([^)]+)\)/g;
        var matches = regExp.exec(content);

        //check if the path has /resources/
        // console.log(matches[1])
        if (matches[1].indexOf("/resources/") != -1) {
            var relativePath = matches[1].split("/resources/")[1];
        } else {
            var relativePath = matches[1];
        }


        //matches[1] contains the value between the parentheses
        // console.log(matches[1]);
        var obj = extractLine(relativePath)
        var path = obj.path;
        var lineNo = obj.lineNo;

        return {
            path: path,
            lineNo: lineNo
        }
    }

    function extractLine(str) {
        var lineNo;
        var path;
        try {
            var obj = str.split(':');
            path = obj[0];
            lineNo = parseInt(obj[obj.length - 1]);
        } catch (e) {
            console.debug(str);
        }

        return {
            path: path,
            lineNo: lineNo
        };

    };



    angular.module('minium.stacktrace.parser')
        .service('stackTraceParser', StackTraceParser);
})();
