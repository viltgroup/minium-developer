package minium.cucumber.report.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;

public class Example {
	@JsonView(Views.Public.class)
    private Integer line;
	
	@JsonView(Views.Public.class)
    private String name;
	
	@JsonView(Views.Public.class)
    private String description;
	
	@JsonView(Views.Public.class)
    private String id;
	
	@JsonView(Views.Public.class)
    private List<Row> rows = Lists.newArrayList();
	
	public List<Row> getRows() {
		return rows;
	}

	public void setRows(List<Row> rows) {
		this.rows = rows;
	}

	@JsonView(Views.Public.class)
    private String keyword;
}