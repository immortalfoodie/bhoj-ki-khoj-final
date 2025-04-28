#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    exit 1
fi

# Navigate to public directory
cd public

# Generate PNG versions in different sizes
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 android-chrome-192x192.png
convert favicon.svg -resize 512x512 android-chrome-512x512.png

# Generate ICO file (contains multiple sizes)
convert favicon-16x16.png favicon-32x32.png favicon.ico

# Generate Safari pinned tab icon (should be single color)
convert favicon.svg -resize 512x512 -background none -flatten safari-pinned-tab.svg

echo "Favicon generation complete!" 