package minium.developer.service;

import gherkin.formatter.model.Result;
import gherkin.formatter.model.Step;
import minium.cucumber.StepListener;
import minium.developer.web.rest.dto.StepDTO;

import org.springframework.messaging.core.MessageSendingOperations;


public class DeveloperStepListener implements StepListener {

    private final MessageSendingOperations<String> messagingTemplate;
    private final String sessionId;
    private final String uri;

    public DeveloperStepListener(MessageSendingOperations<String> messagingTemplate, String sessionId, String uri) {
        this.messagingTemplate = messagingTemplate;
        this.sessionId = sessionId;
        this.uri = uri;
    }

    @Override
    public void beforeStep(Step step) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "executing");
        messagingTemplate.convertAndSend("/cucumber/" + sessionId, stepDTO);
    }

    @Override
    public void afterStep(Step step, Result result) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "passed");
        messagingTemplate.convertAndSend("/cucumber/" + sessionId, stepDTO);
    }

    @Override
    public void ignoredStep(Step step) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "ignored");
        messagingTemplate.convertAndSend("/cucumber/" + sessionId, stepDTO);
    }

    @Override
    public void failedStep(Step step, Throwable error) {
        StepDTO stepDTO = new StepDTO(step.getName(), step.getLine(), uri, "failed");
        messagingTemplate.convertAndSend("/cucumber/" + sessionId, stepDTO);
    }

}
