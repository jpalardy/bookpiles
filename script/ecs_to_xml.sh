#!/bin/bash

PROGRAM_NAME=$(basename $0)
BASE=$(dirname $0)

if [ $# -eq 0 ]; then
  echo >&2 "Usage: $PROGRAM_NAME query"
  exit 1
fi

rails runner $BASE/ecs_to_xml.rb "$@" | xmllint --format -

