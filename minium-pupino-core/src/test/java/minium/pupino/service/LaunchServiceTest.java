package minium.pupino.service;

import static org.junit.Assert.assertThat;

import org.hamcrest.Matchers;
import org.junit.Test;

public class LaunchServiceTest {

    @Test
    public void testFindTestClass() {
        LaunchService service = new LaunchService(null, null, null);
        Class<?> testClass = service.getTestClass();
        assertThat(testClass, Matchers.<Class<?>>equalTo(SampleIT.class));
    }
}
