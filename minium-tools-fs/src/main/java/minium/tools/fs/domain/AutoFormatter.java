package minium.tools.fs.domain;


public interface AutoFormatter {

    public boolean handles(FileContent fileContent);

    public void format(FileContent fileContent);
}
