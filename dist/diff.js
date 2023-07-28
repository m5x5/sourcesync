/**
 * Compare original file with changed file line by line
 * @param {string} originalFile - The original file content
 * @param {string} changedFile - The changed file content
 * @returns {Object[]} - The differences between original and changed file
 */
export const diffLines = (originalFile, changedFile) => {
  const originalLines = originalFile.split("\n");
  const changedLines = changedFile.split("\n");

  return originalLines.flatMap((originalLine, index) => {
    const changedLine = changedLines[index];
    if (originalLine !== changedLine) {
      return {
        line: index,
        originalLine,
        changedLine,
      };
    } else {
      return [];
    }
  });
};

/**
 * Compare original line with changed line character by character
 * @param {string} originalLine - The original line content
 * @param {string} changedLine - The changed line content
 * @returns {Object[]} - The differences between original and changed line
 */
export const diffChars = (originalLine, changedLine) => {
  const originalChars = originalLine.split("");
  const changedChars = changedLine.split("");

  return originalChars.flatMap((originalChar, index) => {
    const changedChar = changedChars[index];
    if (originalChar !== changedChar) {
      return {
        char: index,
        originalChar,
        changedChar,
      };
    } else {
      return [];
    }
  });
};
