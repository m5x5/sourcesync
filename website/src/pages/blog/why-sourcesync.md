---
layout: ../../layouts/Article.astro
title: Why SourceSync? 🤷🏼‍♂️
---

# Why SourceSync? 🤷🏼‍♂️

In the modern web development workflow, we frequently use tools like compilers, bundlers, or transpilers to transform our source code into production-ready, optimized code. This process often results in the generation of "output" files, which are typically minified and obfuscated versions of our original source code. While these tools significantly enhance performance and maintainability, they create a disconnect between the code we write and the code that runs in the browser.

Enter SourceSync - a tool designed to bridge this gap and revolutionize your development workflow.

## The Problem

When debugging in a browser's developer tools, we usually interact with these generated files, not the original source code. Therefore, any changes made in the browser aren't reflected in the source files. This can be a hurdle to rapid testing and iteration of your code directly from the browser.

## The Solution: SourceSync

SourceSync addresses this problem head-on. It is a tool that synchronizes changes made to your generated files in the browser's developer tools back to your original source files.

With SourceSync, you can:

- Edit CSS rules in the DevTools, and have those changes automatically synced back to your original PostCSS or LightningCSS files.
- Make changes to your compiled JavaScript code in the browser, and SourceSync will map those changes back to your original source files, whether they are written in TypeScript, modern JavaScript, or even older ES5 code.

## How Does It Work?

SourceSync utilizes Source Maps, a powerful tool that browsers use to map the generated code back to the original source code. By leveraging this, SourceSync can track changes made in the browser and accurately reflect those changes back in your original files.

## Why Should You Use SourceSync?

If you're a developer who likes to test and iterate quickly by making changes directly in the browser, SourceSync can significantly speed up your workflow. No longer will you need to remember and manually replicate changes made in the browser into your source files - SourceSync takes care of it for you.

Furthermore, SourceSync provides a more intuitive and straightforward development experience, especially when working with transpiled languages or preprocessed stylesheets. With SourceSync, you can focus on what truly matters: building great web experiences.

In conclusion, SourceSync is not just a tool; it's a step towards a more efficient and seamless web development process. Give SourceSync a try and experience the difference firsthand.
