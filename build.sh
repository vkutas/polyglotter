#!/bin/bash
set -ex

file_posfix=""
if [ -n "$1" ]; then
    file_posfix="-${1}"
fi

# zip -r -FS ../polyglotter.zip * --exclude '*.git*' '*.sh' 
# mv ../polyglotter.zip "../polyglotter${file_posfix}.xpi"


zip -r -FS ../polyglotter${file_posfix}.xpi * --exclude '*.git*' '*.sh'
# mv ../polyglotter.zip ../polyglotter.xpi