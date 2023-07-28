import child_process from "child_process";
import debug from "debug";
import fs from "fs";
import { join } from "path";
import { SourceMapConsumer } from "source-map";
import { diffLines } from "./diff.js";
import { updateOriginalFileWithChanges } from "./file.js";

const log = debug("css-watch");

const config = {
  cssOutputFile: join(process.cwd(), "./dist/assets/output.css"),
};

(async () => {
  child_process.execSync("npm run build:css");

  // Remove source maps
  let fileContent = await fs.promises.readFile(config.cssOutputFile, "utf8");
  let linesWithoutSourceMaps = removeSourceMaps(fileContent);

  const newFileContent = linesWithoutSourceMaps.join("\n");

  await fs.promises.writeFile(config.cssOutputFile, newFileContent);
  const unchangedFileContent = await fs.promises.readFile(
    config.cssOutputFile,
    "utf8"
  );

  // Watch for changes in the output file
  fs.watchFile(config.cssOutputFile, async () => {
    const changedFileContent = await fs.promises.readFile(
      config.cssOutputFile,
      "utf8"
    );
    log("output.css changed");
    // Update original file
    const changes = await getChangeLocationsInOriginalFile(
      unchangedFileContent,
      changedFileContent
    );
    await updateOriginalFileWithChanges(changes);
  });
})();

/**
 * Remove source map lines from file content
 * @param {string} fileContent - The file content
 * @returns {string[]} - The lines in the file without the source maps
 */
function removeSourceMaps(fileContent) {
  const lines = fileContent.split("\n");
  return lines
    .filter((line) => !line.startsWith("/*# sourceMappingURL="))
    .slice(0, -1);
}

/**
 * Get the changes in the original file
 * @param {string} originalGeneratedFile - The original generated file content
 * @param {string} changedFile - The changed file content
 * @returns {Promise<Object[]>} - The changes in the original file
 */
async function getChangeLocationsInOriginalFile(
  originalGeneratedFile,
  changedFile
) {
  const lineDiffs = diffLines(originalGeneratedFile, changedFile);

  // Read the source map
  const rawSourceMap = await fs.promises.readFile(
    join(process.cwd(), "./dist/assets/output.css.map"),
    "utf8"
  );

  // Create a SourceMapConsumer
  const consumer = await new SourceMapConsumer(rawSourceMap);

  const allChanges = lineDiffs.map((diff) => getChangeForDiff(diff, consumer));

  return allChanges;
}

/**
 * Get the change for a given diff
 * @param {Object} diff - The diff
 * @param {SourceMapConsumer} consumer - The SourceMapConsumer
 * @returns {Object} - The change for the diff
 */
function getChangeForDiff(diff, consumer) {
  let lastMappingBeforeChange;
  let nextMappingAfterChange;

  consumer.eachMapping((mapping) => {
    if (mapping.generatedLine <= diff.line) {
      lastMappingBeforeChange = mapping;
    } else if (!nextMappingAfterChange) {
      nextMappingAfterChange = mapping;
    }
  });

  const linesAfterLastMappingBeforeChange =
    diff.line - lastMappingBeforeChange.generatedLine;
  const lineChanged =
    lastMappingBeforeChange.originalLine + linesAfterLastMappingBeforeChange;

  return {
    changeStartLine: lineChanged,
    changeEndLine: nextMappingAfterChange.originalLine,
    lineBeforeChange: diff.originalLine,
    lineAfterChange: diff.changedLine,
  };
}
