package minium.developer.cucumber.reports;

import static org.junit.Assert.assertThat;

import java.io.IOException;
import java.util.List;

import minium.cucumber.report.domain.Feature;

import org.apache.commons.io.IOUtils;
import org.hamcrest.Matchers;
import org.junit.Test;

public class ReporterParserTest {

//    @Test
//    public void testDeserialization() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertThat(features, Matchers.hasSize(1));
//    }
//
//    @Test
//    public void testFeatureName() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertEquals(features.get(0).getName(), "Search results in Google");
//    }
//
//    @Test
//    public void testTotalScenarios() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        Feature feature = features.get(0);
//        // assertions
//        assertEquals(feature.getNumberOfScenarios(), 3);
//    }
//
//    @Test
//    public void testMimeType() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        Embedding embedding = features.get(0).getElements().get(2).getSteps().get(2).getEmbeddings().get(0);
//
//        // assertions
//        assertEquals(embedding.getMimeType(), "image/png");
//    }
//
//
//    @Test
//    public void testStepName() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        Step step = features.get(0).getElements().get(2).getSteps().get(2);
//
//        // assertions
//        assertEquals(step.getName(), "links corresponding to Selenium 1 are displayed");
//    }
//
//    @Test
//    public void testStepResult() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        Step step = features.get(0).getElements().get(2).getSteps().get(2);
//
//        // assertions
//        assertEquals(step.getResult().getStatus(), Status.FAILED);
//    }
//
//
//    @Test
//    public void testDeserializationOtherFile() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results2.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertThat(features, Matchers.hasSize(1));
//    }
//
//    @Test
//    public void testDeserializationStrangeFile() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results3.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertThat(features, Matchers.hasSize(4));
//    }
//
//    @Test
//    public void testDeserializationBiggerFile() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results4.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertThat(features, Matchers.hasSize(3));
//    }
//
    @Test
    public void testDeserializationBiggerFile2() throws IOException {
        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("results5.json"));
        ReporterParser reporterParser = new ReporterParser();
        List<Feature> features = reporterParser.parseJsonResult(content);
        // assertions
        assertThat(features, Matchers.hasSize(3));
    }

//    @Test
//    public void testDeserializationWithTags() throws IOException {
//        String content = IOUtils.toString(ReporterParserTest.class.getClassLoader().getResourceAsStream("resultsWithTags.json"));
//        ReporterParser reporterParser = new ReporterParser();
//        List<Feature> features = reporterParser.parseJsonResult(content);
//        // assertions
//        assertThat(features, Matchers.hasSize(4));
//    }


}
