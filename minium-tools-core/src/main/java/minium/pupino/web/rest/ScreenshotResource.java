package minium.pupino.web.rest;

import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

import java.io.IOException;
import java.io.OutputStream;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/app/rest")
public class ScreenshotResource {

    @Autowired
    @Lazy
    private WebDriver wd;

	@RequestMapping(value = "/screenshot", method = RequestMethod.GET, produces = IMAGE_PNG_VALUE)
	public void screenShotExecution(OutputStream out) throws IOException {
	    if (wd instanceof TakesScreenshot) {
            byte[] screenshot = ((TakesScreenshot) wd).getScreenshotAs(OutputType.BYTES);
            out.write(screenshot);
	    }
        out.flush();
	}

}
