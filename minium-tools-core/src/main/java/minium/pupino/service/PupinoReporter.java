package minium.pupino.service;

import gherkin.formatter.Formatter;
import gherkin.formatter.Reporter;
import gherkin.formatter.model.Background;
import gherkin.formatter.model.DataTableRow;
import gherkin.formatter.model.Examples;
import gherkin.formatter.model.Feature;
import gherkin.formatter.model.Match;
import gherkin.formatter.model.Result;
import gherkin.formatter.model.Scenario;
import gherkin.formatter.model.ScenarioOutline;
import gherkin.formatter.model.Step;

import java.util.ArrayList;
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

	private Integer exampleLine;

	private List<Result> results;
	
	private String sessionID;
	
	public PupinoReporter() {
		ServletContext servletContext = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession()
				.getServletContext();
		webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		sessionID = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession().getId();
	}

	@Override
	public void before(Match match, Result result) {
	}

	@Override
    public void result(Result result) {
		Step step = queue.poll();
		int line = step.getLine();
		
		@SuppressWarnings("unchecked")
		MessageSendingOperations<String> messagingTemplate = webApplicationContext.getBean(MessageSendingOperations.class);
		// check if step has a dataTable
		if (step.getRows() != null) {
			for (DataTableRow dt : step.getRows()) {
				stepDTO = new StepDTO(step.getName(), dt.getLine(), uri, "executing");
				messagingTemplate.convertAndSend("/cucumber/"+ sessionID, stepDTO);
			}
		}
		stepDTO = new StepDTO(step.getName(), line, uri, result.getStatus());
		LOGGER.info("Step {} ({}:{}) got result {}", step.getName(), uri, line, result.getStatus());
		messagingTemplate.convertAndSend("/cucumber/"+ sessionID, stepDTO);

		// store the results of a scenario outline
		if (exampleLine != null) {
			results.add(result);
		}
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
		// check if it is scenario outline
		// to hightLight the example line
		if (scenario.getKeyword().equals("Scenario Outline")) {
			exampleLine = scenario.getLine();
			stepDTO = new StepDTO(scenario.getName(), exampleLine, uri, "executing");
			LOGGER.info("Scenario {} ({}:{}) got result {}", scenario.getName(), uri, exampleLine, "Executing");
			@SuppressWarnings("unchecked")
			MessageSendingOperations<String> messagingTemplate = webApplicationContext.getBean(MessageSendingOperations.class);
			messagingTemplate.convertAndSend("/cucumber/"+ sessionID, stepDTO);
			results = new ArrayList<Result>();
		}
	}

	@Override
	public void step(Step step) {
		queue.add(step);
	}

	@Override
	public void endOfScenarioLifeCycle(Scenario scenario) {
		String r = "passed";
		for (Result result : results) {
			if (result.getStatus().equals("failed")) {
				r = "failed";
				break;
			}
		}
		stepDTO = new StepDTO(scenario.getDescription(), scenario.getLine(), uri, r);
		@SuppressWarnings("unchecked")
		MessageSendingOperations<String> messagingTemplate = webApplicationContext.getBean(MessageSendingOperations.class);
		messagingTemplate.convertAndSend("/cucumber/"+ sessionID, stepDTO);
		results.clear();
		// reset the example line
		exampleLine = null;
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
