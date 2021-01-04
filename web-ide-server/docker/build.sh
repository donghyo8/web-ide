#!/bin/bash

docker build -t java-compile-run:1.0 ./java/build_run
docker build -t java-problem-run:1.0 ./java/problem

docker build -t c-compile-run:1.0 ./c/build_run
docker build -t c-problem-run:1.0 ./c/problem

docker build -t cpp-problem-run:1.0 ./cpp/problem

docker build -t cpp-lint:1.0 ./lint