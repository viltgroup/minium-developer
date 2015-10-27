package minium.developer.service;

import java.util.List;

import minium.developer.Application;
import minium.developer.project.CucumberProjectContext;
import minium.developer.web.rest.LaunchInfo;
import minium.tools.fs.domain.FileProps;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.google.common.collect.Lists;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
@ActiveProfiles("test")
public class DataLoaderCucumber {

    private CucumberProjectContext workspace;

    @Test
    public void testRun() throws Exception{
        LaunchInfo launchInfo = new LaunchInfo();
        FileProps fileProps = new FileProps();
        fileProps.setAbsoluteUri("/home/raphael/workspace/minium/minium-developer/src/test/resources/feature.feature");
        launchInfo.setFileProps(fileProps);
        List<Integer> lines = Lists.newArrayList();
        lines.add(8);
        launchInfo.setLine(lines);
        workspace.launchCucumber(launchInfo, "key");

    }
}
