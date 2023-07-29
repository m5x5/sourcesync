import { SourceSync } from "sourcesync";

// Initialize SourceSync with the path to your source and output files
const sync = new SourceSync("path/to/source", "path/to/output");

// Start the synchronization process
sync.startSync();
