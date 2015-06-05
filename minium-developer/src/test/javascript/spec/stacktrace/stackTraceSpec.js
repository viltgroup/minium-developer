'use strict';

/**
 * Test Module Stack Trace
 * to execute it 'grunt test'
 */
describe('Stacktarce Module ', function() {

    beforeEach(function() {
        //Ensure angular modules available
        module('minium.stacktrace.parser');
    });

    var stacktraceParser;

    beforeEach(inject(function(_stackTraceParser_) {
        stacktraceParser = _stackTraceParser_;
    }));

    it('should have StacktraceParser service be defined', function() {
        expect(stacktraceParser).toBeDefined();
    });

    it('should return a parsed cause By Line', function() {
        var line = 'Caused by: minium.actions.TimeoutException: Timeout on $(":root").unless(".modal-backdrop").add(".modal-dialog").find(".nav .dropdown-toggle").withText("Project").freeze() after 6 attempts for predicate Predicates.not(forSize(0))';

        var output = stacktraceParser.parseLine(line);

        expect(output).toEqual(line);
    });

    it('should remove the absolute path', function() {
        var line = 'at ✽.And the following project is active:(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/features/Run.feature:6)';

        var expectedOutput = 'at ✽.And the following project is active:features/Run.feature:6\n';
        var output = stacktraceParser.parseLine(line);

        expect(output).toEqual(expectedOutput);
    });

    it('should have only the relative path', function() {
        var line = 'at org.mozilla.javascript.gen._home_raphael_workspace_minium_minium_developer_e2e_tests_src_test_resources_steps_project_stepdefs_js_2035.call(/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/steps/project_stepdefs.js:49)'
        var expectedOutput = 'steps/project_stepdefs.js:49\n';
        var output = stacktraceParser.parseLine(line);

        expect(output).toEqual(expectedOutput);
    });

});
