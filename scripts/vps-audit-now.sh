#!/usr/bin/env bash
set -e
cd /opt/portfolio
git log -1 --oneline
docker compose -f compose.prod.yaml ps
docker image inspect portfolio-adrian:1.0 --format 'IMAGE={{.Id}}'
