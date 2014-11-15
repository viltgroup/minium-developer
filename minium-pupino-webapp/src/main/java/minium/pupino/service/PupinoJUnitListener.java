package minium.pupino.service;

import minium.pupino.web.rest.dto.TestExecutionDTO;

import org.junit.runner.Description;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;

public class PupinoJUnitListener extends RunListener {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PupinoJUnitListener.class);
	
	private final MessageSendingOperations<String> messagingTemplate;
	private TestExecutionDTO testExecution;
	private int passed;
    
	@Autowired
	public PupinoJUnitListener(final MessageSendingOperations<String> messagingTemplate){
		this.messagingTemplate = messagingTemplate;
		passed = 0;
	}
	
	/**
	 * Called before any tests have been run.
	 * */
	public void testRunStarted(Description description) throws java.lang.Exception {
		testExecution = new TestExecutionDTO(Integer.toString(description.testCount()), "total", description.getMethodName());
		messagingTemplate.convertAndSend("/tests", testExecution);
		LOGGER.info("Number of testcases to execute : " + description.testCount());
	}

	/**
	 * Called when all tests have finished
	 * */
	public void testRunFinished(Result result) throws java.lang.Exception {
		LOGGER.info("Number of testcases executed : " + result.getRunCount());
	}

	/**
	 * Called when an atomic test is about to be started.
	 * */
	public void testStarted(Description description) throws java.lang.Exception {
		LOGGER.info("Starting execution of test case : " + description.getMethodName());
	}

	/**
	 * Called when an atomic test has finished, whether the test succeeds or
	 * fails.
	 * */
	public void testFinished(Description description) throws java.lang.Exception {
		passed++;
		testExecution = new TestExecutionDTO(Integer.toString(passed), "passed", description.getMethodName());
		messagingTemplate.convertAndSend("/tests", testExecution);
		LOGGER.info("Finished execution of test case : " + description.getMethodName());
	}
	
	
	/**
	 * Called when an atomic test fails.
	 * */
	public void testFailure(Failure failure) throws java.lang.Exception {
		testExecution = new TestExecutionDTO(failure.getMessage(), "failing", failure.getDescription().getMethodName());
		messagingTemplate.convertAndSend("/tests", testExecution);
		LOGGER.info("Execution of test case failed : " + failure.getMessage());
	}

	/**
	 * Called when a test will not be run, generally because a test method is
	 * annotated with Ignore.
	 * */
	public void testIgnored(Description description) throws java.lang.Exception {
		LOGGER.info("Execution of test case ignored : " + description.getMethodName());
	}
}
