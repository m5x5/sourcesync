---
layout: ../../layouts/Article.astro
title: SourceSync Documentation
---

# Getting Started 🚀

Welcome to SourceSync! In this guide, we'll walk you through the process of setting up SourceSync and using it to sync your browser DevTools changes with your source files.

## Installation

To get started, you'll first need to install SourceSync:

```bash
npm install sourcesync
```

## Initialization

Next, import SourceSync in your project and create a new instance:

```js
import { SourceSync } from "sourcesync";

const sync = new SourceSync("/path/to/source/file", "/path/to/output/file");
```

## Start Synchronization

Finally, start the synchronization process:

```js
sync.startSync();
```
