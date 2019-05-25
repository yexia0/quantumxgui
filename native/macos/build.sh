#!/bin/bash

cd "$(dirname "$0")"

clang -framework CoreServices -framework IOKit -I"$JAVA_HOME/include" -I"$JAVA_HOME/include/darwin" -dynamiclib -o ../libconnection.dylib ../quantumx_HidConnection.c hid_MACOSX.c