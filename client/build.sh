#!/bin/bash

# Ensure we're in the right directory
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

echo "Checking if public directory exists:"
if [ -d "public" ]; then
    echo "Public directory exists"
    echo "Files in public directory:"
    ls -la public/
else
    echo "Public directory does not exist!"
    exit 1
fi

echo "Checking if index.html exists in public:"
if [ -f "public/index.html" ]; then
    echo "index.html exists in public directory"
    cat public/index.html
else
    echo "index.html does not exist in public directory!"
    exit 1
fi

# Run the build
echo "Running npm run build..."
npm run build 