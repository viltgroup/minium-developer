package minium.developer.project;

public class Evaluation {

    private String filePath;
    private String expression;
    private int lineNumber;

    public Evaluation() {
    }

    public Evaluation(String expression, String fileName, int lineNumber) {
        this.filePath = fileName;
        this.expression = expression;
        this.lineNumber = lineNumber;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }
}
