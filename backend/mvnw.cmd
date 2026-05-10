@REM Maven Wrapper startup batch script
@REM
@REM Required ENV vars: JAVA_HOME
@REM Optional ENV vars: MAVEN_OPTS

@echo off
set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

if exist %WRAPPER_JAR% (
    java %MAVEN_OPTS% -jar %WRAPPER_JAR% %*
) else (
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile %WRAPPER_JAR%"
    java %MAVEN_OPTS% -jar %WRAPPER_JAR% %*
)
