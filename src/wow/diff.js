export const diffLines = (originalFile, changedFile) => {
  const originalLines = originalFile.split("\n");
  const changedLines = changedFile.split("\n");

  const diff = [];

  originalLines.forEach((originalLine, index) => {
    const changedLine = changedLines[index];
    if (originalLine !== changedLine) {
      diff.push({
        line: index + 1,
        originalLine,
        changedLine,
      });
    }
  });

  return diff;
};

export const diffChars = (originalLine, changedLine) => {
  const originalChars = originalLine.split("");
  const changedChars = changedLine.split("");

  const diff = [];

  originalChars.forEach((originalChar, index) => {
    const changedChar = changedChars[index];
    if (originalChar !== changedChar) {
      diff.push({
        char: index,
        originalChar,
        changedChar,
      });
    }
  });

  return diff;
};
