<div align="center">
  <a href="https://sourcesync.vercel.app" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://sourcesync.vercel.app/logo.svg" alt="SourceSync Logo">
  </a>

[![Version](https://img.shields.io/badge/Version-0.0.2-blue.svg?style=flat-square)](https://github.com/m5x5?tab=packages&repo_name=sourcesync)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/m5x5/sourcesync/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

<br/>

# SourceSync 🚀

SourceSync keeps your CSS source files in sync with your browser's dev tools. It works with PostCSS, LightningCSS, SASS or plain CSS. Enjoy the convenience of real-time browser-to-source CSS editing.

## Table of Contents

- [SourceSync 🚀](#sourcesync-)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [As a Library](#as-a-library)
    - [Command Line Interface (CLI)](#command-line-interface-cli)
  - [Contribute](#contribute)
  - [License](#license)

## Features

- Bidirectional sync: Edit your CSS in the browser's dev tools, and see those changes in your original source files.
- Utilizes CSS source maps: SourceSync intelligently parses the source maps to locate the correct lines in the source file.
- Fast: Implements an efficient line diffing algorithm to locate changes quickly.

![demo](https://github.com/m5x5/sourcesync/assets/30301026/34b80c7a-bc18-4c4c-b0fd-ee12de72d5cb)

## Important Tasks
- [ ] PostCSS and SASS support still needs to be added.
- [ ] SourceSync needs to work with minified CSS files.
- [ ] SourceSync needs to have a Vite integration and or watch the original files for changed and transpile them.

## Installation

```bash
npm install sourcesyncjs
```

## Usage

### As a Library

Import and use SourceSync in your Node.js application:

```javascript
import { SourceSync } from "sourcesyncjs";

// Initialize SourceSync with the path to your source and output files
const sync = new SourceSync("path/to/source", "path/to/output");

// Start the synchronization process
sync.startSync();
```

### Command Line Interface (CLI)

You can also use SourceSync from the command line:

```bash
npx sourcesync path/to/source path/to/output
```

Or, if you have it installed globally:

```bash
sourcesync path/to/source path/to/output
```

## Contribute

SourceSync is an open source project, and contributions are welcome! Whether you're fixing bugs, improving the documentation, or proposing new features, we would love to have your help.

If you're new to the project and want to help, a great first step would be looking at our open issues with the "good first issue" label. These issues are especially suited for new contributors.

If you want to contribute, please:

1. Fork the repository and create your branch from `main`.
2. Make your changes and validate them.
3. Issue that pull request!

For more details, please check the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

SourceSync is [MIT licensed](LICENSE).
