package minium.pupino.domain;

public class LaunchInfo {

	private FileProps fileProps;

	/**
	 * 0-based number of line
	 */
	private Integer line;

	public LaunchInfo() {
	}

	public FileProps getFileProps() {
		return fileProps;
	}

	public void setFileProps(FileProps fileProps) {
		this.fileProps = fileProps;
	}

	public Integer getLine() {
		return line;
	}

	public void setLine(Integer line) {
		this.line = line;
	}

}
