package minium.pupino.config;

import java.util.LinkedHashMap;
import java.util.Map;

public class ConfigProperties extends LinkedHashMap<String, Object> {

    private static final long serialVersionUID = -1491942616465352922L;

    public ConfigProperties() {
    }

    public ConfigProperties(Map<String, Object> props) {
        super(props);
    }
}
