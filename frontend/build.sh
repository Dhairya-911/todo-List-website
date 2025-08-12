#!/bin/bash
set -e

echo "Setting permissions for node_modules binaries..."
chmod +x node_modules/.bin/* || true

echo "Running React build..."
npm run build:production
