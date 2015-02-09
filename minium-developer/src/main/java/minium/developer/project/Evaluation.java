package minium.developer.project;

public class Evaluation {

    private String fileName;
    private String expression;
    private int lineNumber;

    public Evaluation() {
    }

    public Evaluation(String expression, String fileName, int lineNumber) {
        this.fileName = fileName;
        this.expression = expression;
        this.lineNumber = lineNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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
