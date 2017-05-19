package minium.developer.fs.service;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import minium.developer.fs.config.FileSystemConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = FileSystemServiceTest.TestConfig.class)
public class FileSystemServiceTest {

	@Configuration
	@Import(FileSystemConfiguration.class)
	public static class TestConfig {

		@Bean
		@Autowired
		public FileSystemService fileSystemService() {
			return new FileSystemService();
		}
	}

	@Test
	public void testInTempFolder() {
		assertTrue(true);
	}

}
