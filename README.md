# SourceSync

SourceSync is a Node.js utility tool designed to enable seamless bidirectional synchronization between original CSS source files and the output CSS files generated in the browser's dev tools. By leveraging CSS source maps and a novel line diffing algorithm, SourceSync empowers front-end developers to modify CSS in their browser's dev tools and have those changes reflected back in their original CSS source files.

## Table of Contents

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

![demo](https://github.com/m5x5/sourcesync/assets/30301026/0cc461cd-250c-4902-84ed-2f35830f4fc5)

## Installation

```bash
npm install sourcesync
```

## Usage

### As a Library

Import and use SourceSync in your Node.js application:

```javascript
import { SourceSync } from 'sourcesync';

// Initialize SourceSync with the path to your source and output files
const sync = new SourceSync('path/to/source', 'path/to/output');

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
