package minium.developer;

import static org.junit.Assert.assertEquals;
import minium.project.generator.utils.Utils;

import org.junit.Test;

public class GenaratedClassNameTest {

	private static final String PROJECT_NAME = "test------+++ººººº~~~,,-.-.'''????=)(/&%$#****class.***name";
	private static final String CLASS_NAME = "CamelCaseAs";
	@Test
	public void testSpecialCharRemoved() {

		String result = Utils.replaceSpecialCharsWithSpaces(PROJECT_NAME);

		result = Utils.replaceSpacesWithLowerHyphen(result);

		String expectedName = "test-class-name";
		assertEquals(expectedName, result);
	}

	@Test
	public void testToCamelCase() {
		String name = "input-in-snake-case";
		String result = Utils.toCamelCase(name);

		String expectedName = "InputInSnakeCase";
		assertEquals(expectedName, result);
	}


	@Test
	public void testCamelCaseName() {
		String className = "CamelCaseAs";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testCamelCasewithUnderScoreName() {
		String className = "camel_caseAs";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testLowerHyphenName() {
		String className = "camel-case-as";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testLowerHyphenAndUpperCaseName() {
		String className = "camel-case-As";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testLowerHyphenAndUnderscoreAndUpperCaseName2() {
		String className = "camel-case_-As";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testLowerHyphenAndUnderscoreName() {
		String className = "Camel-Case-As";
		String result = Utils.toClassName(className);
		assertEquals(CLASS_NAME, result);
	}

	@Test
	public void testLowerHyphenAndUnderscoreName2() {
		String className = "Camel____-Case____ASDDD-As";
		String result = Utils.toClassName(className);
		assertEquals("CamelCaseASDDDAs", result);
	}

	@Test
	public void testWithDots() {
		String className = "project.name.test";
		String result = Utils.toClassName(className);
		assertEquals("ProjectNameTest", result);
	}

	@Test
	public void testWithDotsAndOtherChars() {
		String className = "project.name.testNew.Things_return-new";
		String result = Utils.toClassName(className);
		assertEquals("ProjectNameTestNewThingsReturnNew", result);
	}


	@Test
	public void testMultipleDots() {
		String className = "project.....name.....testNew.....Things_....return-....new";
		String result = Utils.toClassName(className);
		assertEquals("ProjectNameTestNewThingsReturnNew", result);
	}
}
