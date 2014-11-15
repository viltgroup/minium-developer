package minium.pupino.service;

import gherkin.formatter.Formatter;
import gherkin.formatter.Reporter;
import gherkin.formatter.model.Background;
import gherkin.formatter.model.Examples;
import gherkin.formatter.model.Feature;
import gherkin.formatter.model.Match;
import gherkin.formatter.model.Result;
import gherkin.formatter.model.Scenario;
import gherkin.formatter.model.ScenarioOutline;
import gherkin.formatter.model.Step;

import java.util.List;
import java.util.Queue;

import javax.servlet.ServletContext;

import minium.pupino.web.rest.dto.StepDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.common.collect.Queues;

public class PupinoReporter implements Formatter, Reporter {

	private static final Logger LOGGER = LoggerFactory.getLogger(PupinoReporter.class);
	
	private Queue<Step> queue = Queues.newArrayDeque();

	private String uri;
	
	private StepDTO stepDTO;

	private WebApplicationContext webApplicationContext;
	
	public PupinoReporter() {
		ServletContext servletContext = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession().getServletContext();
		webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	}
	
	@Override
	public void before(Match match, Result result) {
	}

	@Override
	public void result(Result result) {
		Step step = queue.poll();
		stepDTO = new StepDTO(step.getName(), step.getLine(), uri, result.getStatus());
		LOGGER.info("Step {} ({}:{}) got result {}", step.getName(), uri, step.getLine(), result.getStatus());
		@SuppressWarnings("unchecked")
		MessageSendingOperations<String> messagingTemplate = webApplicationContext.getBean(MessageSendingOperations.class);
		messagingTemplate.convertAndSend("/cucumber", stepDTO );
	}
	
	@Override
	public void after(Match match, Result result) {
	}

	@Override
	public void match(Match match) {
	}

	@Override
	public void embedding(String mimeType, byte[] data) {
	}

	@Override
	public void write(String text) {
		
	}

	@Override
	public void syntaxError(String state, String event, List<String> legalEvents, String uri, Integer line) {
	}

	@Override
	public void uri(String uri) {
		this.uri = uri;
	}

	@Override
	public void feature(Feature feature) {
	}

	@Override
	public void scenarioOutline(ScenarioOutline scenarioOutline) {
	}

	@Override
	public void examples(Examples examples) {
	}

	@Override
	public void startOfScenarioLifeCycle(Scenario scenario) {
	}

	@Override
	public void background(Background background) {
	}

	@Override
	public void scenario(Scenario scenario) {
	}

	@Override
	public void step(Step step) {
		queue.add(step);
	}

	@Override
	public void endOfScenarioLifeCycle(Scenario scenario) {
	}

	@Override
	public void done() {
	}

	@Override
	public void close() {
	}

	@Override
	public void eof() {
	}

}
