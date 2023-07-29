#!/usr/bin/env node

import path from "path";
import { SourceSync } from "../src/index.js";

// Get command line arguments
const [, , sourcePath, outputPath] = process.argv;

if (!sourcePath || !outputPath) {
  console.error("Usage: sourcesync <sourcePath> <outputPath>");
  process.exit(1);
}

// Create a new SourceSync instance
const sync = new SourceSync(
  path.join(process.cwd(), sourcePath),
  path.join(process.cwd(), outputPath)
);

// Start the synchronization
sync.startSync();
