#!/usr/bin/env bash

set -euo pipefail

if (( $(echo "$BASH_VERSION" | cut -f1 -d.) < 5 )); then
	echo "Bash 5 or newer required. If you're on macOS, the built-in Bash is too old; install a newer one from Homebrew."
	exit 1
fi

# Install dependencies
npm ci

# Clean all release and build artifacts
npm run build:clean
npm run release:clean

# Check authors
npm run authors:check

# Run browserless tests
npm run build:all
npm run lint
npm run test:browserless

# Clone dist and cdn repos to the tmp/release directory
mkdir -p tmp/release
git clone https://github.com/jquery/jquery-dist tmp/release/dist
git clone https://github.com/jquery/codeorigin.jquery.com tmp/release/cdn
