import debug from "debug";
import fs from "fs";
import { join } from "path";
const log = debug("css-watch:file");

/**
 * Update original file with given changes
 * @param {Object[]} changes - The changes to be applied to the original file
 * @returns {Promise<void>} - A promise that resolves when the file has been written
 */
export const updateOriginalFileWithChanges = async (changes) => {
  const originalFilePath = join(process.cwd(), "./src/style.css");

  const fileContent = await fs.promises.readFile(originalFilePath, "utf8");
  let originalFileLines = fileContent.split("\n");

  let updatedFileLines = originalFileLines.map((line, index) => {
    let change = changes.find(
      (c) => findOriginalLineNr(originalFileLines, c) === index + 1
    );
    return change ? change.lineAfterChange : line;
  });

  try {
    await fs.promises.writeFile(originalFilePath, updatedFileLines.join("\n"));
  } catch (error) {
    console.error(`Failed to write to the file: ${error}`);
  }
};

/**
 * Find line number of the original line to be changed
 * @param {string[]} originalFileLines - The lines in the original file
 * @param {Object} change - The change to be applied
 * @returns {number} - The line number of the change in the original file (1-indexed)
 */
export const findOriginalLineNr = (originalFileLines, change) => {
  const lineIndex = originalFileLines.findIndex((line, index) => {
    if (change.changeStartLine - 1 > index || change.changeEndLine < index)
      return false;

    const changedAttribute = getAttributeFromCSSLine(change.lineAfterChange);
    const currentAttribute = getAttributeFromCSSLine(line);

    return changedAttribute === currentAttribute;
  });

  log("changed line " + lineIndex + 1);
  // We return lineIndex + 1 because arrays are 0-indexed and lines are 1-indexed
  return lineIndex + 1;
};

/**
 * Extract the attribute from a CSS line
 * @param {string} line - The CSS line
 * @returns {string} - The attribute in the CSS line
 */
const getAttributeFromCSSLine = (line) => {
  return line.split(":")[0].trim();
};
