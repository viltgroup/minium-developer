package minium.developer.web.rest.dto;

import java.util.Map;

public class FileWithOffsetsDTO {
    private String fileContent;
    private Map<Integer, Integer> offset;

    public FileWithOffsetsDTO(String fileContent, Map<Integer, Integer> offset) {
        super();
        this.fileContent = fileContent;
        this.offset = offset;
    }

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public Map<Integer, Integer> getOffset() {
        return offset;
    }

    public void setOffset(Map<Integer, Integer> offset) {
        this.offset = offset;
    }

}
