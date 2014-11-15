package minium.pupino.web.rest;

import static com.vilt.minium.Minium.$;
import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

import java.io.OutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vilt.minium.DefaultWebElementsDriver;
import com.vilt.minium.actions.DebugInteractions;

@Controller
@RequestMapping("/app/rest")
public class ScreenshotResource {

    @Autowired
    private DefaultWebElementsDriver wd;

	@RequestMapping(value = "/screenshot", method = RequestMethod.GET, produces = IMAGE_PNG_VALUE)
	public void screenShotExecution(OutputStream out) {
        DebugInteractions.takeWindowScreenshot($(wd), out);
	}

}
