#!/bin/bash
set -ex
zip -r -FS ../polyglotter.xpi * --exclude '*.git*' '*.sh' '.gitignore'