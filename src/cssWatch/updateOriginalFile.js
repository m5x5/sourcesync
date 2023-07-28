import fs from "fs";
import { join } from "path";

/**
 * Update the original file with the changes
 * @param {Object[]} changes - The changes to apply to the original file
 * @returns {Promise<void>}
 */
export const updateOriginalFileWithChanges = async (changes) => {
  const originalFilePath = join(process.cwd(), "./src/style.css");
  const originalFile = (
    await fs.promises.readFile(originalFilePath, "utf8")
  ).split("\n");

  changes.forEach((change) => {
    if (change.ruleAdded) {
      const previousLine = previousLineNr(originalFile, change);

      originalFile.splice(previousLine, 0, change.lineAfterChange);
    } else {
      const originalLineNr = findOriginalLineNr(originalFile, change);

      originalFile[originalLineNr - 1] = change.lineAfterChange;
    }
  });

  // Save a copy of the edited file
  return fs.promises.writeFile(originalFilePath, originalFile.join("\n"));
};

/**
 * Find the original line number for a change
 * @param {string[]} originalFile - The lines of the original file
 * @param {Object} change - The change to find the line number for
 * @returns {number} - The original line number for the change
 */
export const findOriginalLineNr = (originalFile, change) => {
  const lineNr = originalFile.findIndex((line, index) => {
    if (change.changeStartLine - 1 > index) return false;
    if (change.changeEndLine < index) return false;

    const changedAttribute = change.lineAfterChange.split(":")[0].trim();
    const currentAttribute = line.split(":")[0].trim();

    return changedAttribute === currentAttribute;
  });

  return lineNr + 1;
};

export function previousLineNr(originalFile, change) {
  // Find the '}' and insert the new rule before that
  const lineNr = originalFile.findIndex((line, index) => {
    if (change.changeStartLine - 1 > index) return false;
    if (change.changeEndLine < index) return false;

    return line.trim() === "}";
  });

  return lineNr;
}
