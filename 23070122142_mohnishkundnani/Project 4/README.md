    # DevOps Lab Project 4

This project is a Maven-based Java application built to demonstrate a Jenkins distributed pipeline setup.

## Project Purpose
The goal of this project is to show how a Jenkins controller can distribute work across dedicated agents for compilation and testing. It highlights a simple Java build workflow using Maven and JUnit 5.

## Maven Structure
The project follows the standard Maven directory layout:

- `src/main/java` for application source code
- `src/test/java` for JUnit test classes
- `pom.xml` for project configuration and dependencies
- `target/` for compiled classes and test reports

## Jenkins Controller and Agents
This lab uses a Jenkins controller and two worker nodes:

- `compile-agent` - handles compilation steps
- `test-agent` - handles test execution steps

The Jenkins controller coordinates the pipeline and assigns each stage to the correct agent.

## Compile Stage
The `Compile` stage runs on the `compile-agent` and executes:

```bat
mvn clean compile
```

This step compiles the Java source code and checks for build issues.

## Test Stage
The `Test` stage runs on the `test-agent` and executes:

```bat
mvn test
```

This step runs all JUnit tests and validates that the code behaves as expected.

## How the Pipeline Works
The Jenkins pipeline is declarative and uses `agent none` at the top level. Each stage specifies its own agent label:

- Compile runs on `compile-agent`
- Test runs on `test-agent`

The pipeline checks out source code in each stage and runs the relevant Maven command.

## Commands Used
```bat
mvn clean compile
mvn test
```

## Expected Result
When the pipeline is executed successfully, Jenkins should report:

```text
BUILD SUCCESS
```

This confirms that the Java code compiled successfully and all tests passed.
