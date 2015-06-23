package minium.developer.service;

import gherkin.formatter.model.Result;
import gherkin.formatter.model.Step;
import minium.cucumber.StepListener;
import minium.developer.web.rest.dto.StepDTO;

import org.springframework.messaging.core.MessageSendingOperations;


public class DeveloperStepListener implements StepListener {

    private final MessageSendingOperations<String> messagingTemplate;
    private final String uri;
    private final String socketPath;

    public DeveloperStepListener(MessageSendingOperations<String> messagingTemplate, String sessionId, String uri) {
        this.messagingTemplate = messagingTemplate;
        this.uri = uri;
        this.socketPath = "/cucumber/" + sessionId;
    }

    @Override
    public void beforeStep(Step step) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "executing");
        messagingTemplate.convertAndSend(socketPath, stepDTO);
    }

    @Override
    public void afterStep(Step step, Result result) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, result.getStatus());
        messagingTemplate.convertAndSend(socketPath, stepDTO);
    }

    @Override
    public void ignoredStep(Step step) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "ignored");
        messagingTemplate.convertAndSend(socketPath, stepDTO);
    }

    @Override
    public void failedStep(Step step, Throwable error) {
//        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "failed");
//        messagingTemplate.convertAndSend(socketPath, stepDTO);
    }

	@Override
	public void exampleStep(int line) {
		StepDTO stepDTO = new StepDTO("", line , uri, "executing");
        messagingTemplate.convertAndSend(socketPath, stepDTO);
	}

	@Override
	public void failedExampleStep(int line) {
		StepDTO stepDTO = new StepDTO("", line , uri, "failed_example");
        messagingTemplate.convertAndSend(socketPath, stepDTO);

	}

}
