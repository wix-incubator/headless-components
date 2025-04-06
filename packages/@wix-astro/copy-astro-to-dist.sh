#!/bin/bash

SRC_DIR="src"
DIST_DIR="dist"

find "$SRC_DIR" -type f -name '*.astro' | while read -r file; do
  relative_path="${file#$SRC_DIR/}"
  dest_path="$DIST_DIR/$relative_path"
  mkdir -p "$(dirname "$dest_path")"
  cp "$file" "$dest_path"
done
