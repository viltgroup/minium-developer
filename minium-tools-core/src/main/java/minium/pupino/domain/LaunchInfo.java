package minium.pupino.domain;

import java.util.List;

public class LaunchInfo {

	private FileProps fileProps;

	/**
	 * 0-based number of line
	 */
	private List<Integer> line;



	public LaunchInfo() {
	}

	public FileProps getFileProps() {
		return fileProps;
	}

	public void setFileProps(FileProps fileProps) {
		this.fileProps = fileProps;
	}

	public List<Integer> getLine() {
		return line;
	}

	public void setLine(List<Integer> line) {
		this.line = line;
	}

}
