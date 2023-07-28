/**
 * Remove source map lines from the file content
 * @param {string} fileContent - The content of the file
 * @returns {string[]} - The lines of the file without source map lines
 */
export const removeSourceMaps = (fileContent) => {
  let lines = fileContent.split("\n");
  lines = lines.filter((line) => !line.startsWith("/*# sourceMappingURL="));
  lines.pop();

  return lines;
};
