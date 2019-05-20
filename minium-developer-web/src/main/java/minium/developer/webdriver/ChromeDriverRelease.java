package minium.developer.webdriver;

public class ChromeDriverRelease extends WebDriverRelease {

    public ChromeDriverRelease(String input) {
        super(input);
		setVersion(input);
        setName("chromedriver");
		setRelativePath("index.html?path=" + input + "/");
    }
}