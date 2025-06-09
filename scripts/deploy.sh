#!/bin/bash
echo "Deploying Phasemap..."
docker-compose down
docker-compose build
docker-compose up -d
echo "Deployment complete."
