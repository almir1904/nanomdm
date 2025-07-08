#!/bin/sh
set -e
if [ ! -f depot/index.txt ]; then
  scepserver init
fi
exec "$@"
