@echo off
set JAVA_HOME=C:\jdk17\jdk-17.0.20+8
set ANDROID_HOME=C:\Users\dell\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%
cd /d C:\Users\dell\Desktop\spotify-clone\android
call gradlew.bat assembleDebug > C:\Users\dell\Desktop\spotify-clone\build4.log 2>&1
echo BUILD_DONE > C:\Users\dell\Desktop\spotify-clone\build4-status.txt
