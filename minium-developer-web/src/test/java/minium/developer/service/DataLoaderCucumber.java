package minium.developer.service;

import java.net.URI;
import java.util.List;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;

import com.google.common.collect.Lists;
import com.google.common.io.Resources;

import minium.developer.Application;
import minium.developer.fs.domain.FileProps;
import minium.developer.project.CucumberProjectContext;
import minium.developer.web.rest.LaunchInfo;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = { Application.class, CucumberProjectContext.class })
@WebAppConfiguration
@ActiveProfiles("test")
@TestExecutionListeners(listeners = { DependencyInjectionTestExecutionListener.class })
public class DataLoaderCucumber {

    @Inject
    private CucumberProjectContext workspace;

    @Test
    public void testRun() throws Exception{
        LaunchInfo launchInfo = new LaunchInfo();
        FileProps fileProps = new FileProps();
        fileProps.setUri(Resources.getResource("feature.feature").toURI());
        fileProps.setRelativeUri(new URI("feature.feature"));
        launchInfo.setFileProps(fileProps);
        List<Integer> lines = Lists.newArrayList();
        lines.add(8);
        launchInfo.setLine(lines);
        workspace.launchCucumber(launchInfo, "key");

    }
}
