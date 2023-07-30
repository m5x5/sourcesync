import path from "path";
import { SourceSync } from "sourcesyncjs";

const sourcePath = path.join(process.cwd(), "./public/styles/global.css");
const outputPath = path.join(process.cwd(), "./public/styles/output.css");

// Initialize SourceSync with the path to your source and output files
const sync = new SourceSync(sourcePath, outputPath);

// Start the synchronization process
sync.startSync();
