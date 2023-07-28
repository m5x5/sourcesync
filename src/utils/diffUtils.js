/**
 * Compute the diff between the lines of two files
 * @param {string} originalFile - The content of the original file
 * @param {string} changedFile - The content of the changed file
 * @returns {Object[]} - The diff between the files
 */
export const diffLines = (originalFile, changedFile) => {
  const originalLines = originalFile.split("\n");
  const changedLines = changedFile.split("\n");

  const diff = [];

  originalLines.forEach((originalLine, index) => {
    const changedLine = changedLines[index];
    if (originalLine !== changedLine) {
      diff.push({
        line: index,
        originalLine,
        changedLine,
      });
    }
  });

  return diff;
};
