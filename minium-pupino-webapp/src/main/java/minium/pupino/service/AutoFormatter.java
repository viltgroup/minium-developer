package minium.pupino.service;

import minium.pupino.domain.FileContent;

public interface AutoFormatter {

    public boolean handles(FileContent fileContent);

    public void format(FileContent fileContent);
}
