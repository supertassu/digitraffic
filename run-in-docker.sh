#!/bin/bash
docker run --rm --name=digitraffic-pages -p 3000:3000 -p 3001:3001 -v ${PWD}:/app digitraffic-pages:latest
