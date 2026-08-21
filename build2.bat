@echo off
set JAVA_HOME=C:\jdk17\jdk-17.0.20+8
set ANDROID_HOME=C:\Users\dell\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%
cd /d C:\Users\dell\Desktop\spotify-clone\android
call gradlew.bat assembleDebug --no-daemon > C:\Users\dell\Desktop\spotify-clone\build3.log 2>&1
echo BUILD_EXIT_CODE:%ERRORLEVEL% > C:\Users\dell\Desktop\spotify-clone\build3-status.txt
