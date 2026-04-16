#!/bin/bash

# GitHub Release Script for v2.0.0
# This script creates a GitHub release with bilingual notes

set -e

VERSION="v2.0.0"
TAG="v2.0.0-docs"

echo "Creating GitHub Release: $VERSION"
echo "========================================"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

# Create release with bilingual notes
echo "Creating release with bilingual notes..."

gh release create "$TAG" \
    --title "WebGPU Particle Fluid Simulation $VERSION" \
    --notes-file RELEASE_NOTES.md \
    --latest

echo ""
echo "✅ Release created successfully!"
echo ""
echo "Release URL: https://github.com/LessUp/particle-fluid-sim/releases/tag/$TAG"
