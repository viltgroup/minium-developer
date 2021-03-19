<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

	<modelVersion>4.0.0</modelVersion>

	<parent>
		<groupId>io.vilt.minium</groupId>
		<artifactId>minium-cucumber-parent</artifactId>
		<version>${miniumVersion}</version>
		<relativePath />
	</parent>

	<groupId>${groupId}</groupId>
	<artifactId>${artifactId}</artifactId>
	<version>${version}</version>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-jar-plugin</artifactId>
				<executions>
					<execution>
						<id>default-jar</id>
						<phase>none</phase>
					</execution>
					<execution>
						<goals>
							<goal>test-jar</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-assembly-plugin</artifactId>
				<configuration>
					<archive>
						<manifest>
							<mainClass>ExecutorTest</mainClass>
						</manifest>
					</archive>
					<descriptors>
						<descriptor>src/main/assembly/assembly.xml</descriptor>
					</descriptors>
					<finalName>test-project</finalName>
					<appendAssemblyId>false</appendAssemblyId>
				</configuration>
				<executions>
					<execution>
						<phase>package</phase>
						<goals>
							<goal>single</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>

</project>