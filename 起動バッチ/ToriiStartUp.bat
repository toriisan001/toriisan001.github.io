@echo off
if not "%1" == "1" (
    cd C:\workspace\toriisan001.github.io
    start /min cmd /c reload -b 1
    exit
)
