package minium.developer.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest/recorder")
public class RecorderResource {

    String script;

    @RequestMapping(value = "/script", method = RequestMethod.POST)
    @ResponseBody
    public void setScript(@RequestBody String script) {
        this.script = script;
    }

    @RequestMapping(value = "/script", method = RequestMethod.GET, produces = "text/plain;charset=UTF-8")
    @ResponseBody
    public String getScript() {
        return script;
    }
}
