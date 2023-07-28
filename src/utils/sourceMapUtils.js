import fs from "fs";
import { join } from "path";
import { SourceMapConsumer } from "source-map";
import { diffLines } from "./diffUtils.js";

/**
 * Get the locations of changes in the original file from a source map
 * @param {string} originalGeneratedFile - The content of the original generated file
 * @param {string} changedFile - The content of the changed file
 * @returns {Promise<Object[]>} - The changes in the original file
 */
export async function getChangeLocationsInOriginalFile(
  originalGeneratedFile,
  changedFile
) {
  const changes = diffLines(originalGeneratedFile, changedFile);

  // Read the source map
  const rawSourceMap = await getSourceMap();

  // Create a SourceMapConsumer
  const consumer = await new SourceMapConsumer(rawSourceMap);

  return getChangesFromConsumer(consumer, changes);
}

/**
 * Get the source map from the output file
 * @returns {Promise<string>} - The raw source map
 */
async function getSourceMap() {
  return fs.promises.readFile(
    join(process.cwd(), "./dist/assets/output.css.map"),
    "utf8"
  );
}

/**
 * Get the changes from the consumer
 * @param {SourceMapConsumer} consumer - The SourceMapConsumer instance
 * @param {Object[]} changes - The changes from diffLines
 * @returns {Object[]} - The changes in the original file
 */
function getChangesFromConsumer(consumer, changes) {
  const allChanges = [];

  changes.forEach((change) => {
    const { lastMappingBeforeChange, nextMappingAfterChange } =
      getMappingsForChange(consumer, change);
    const lineChanged = getLineChanged(lastMappingBeforeChange, change);

    allChanges.push({
      changeStartLine: lineChanged,
      changeEndLine: nextMappingAfterChange.originalLine,
      lineBeforeChange: change.originalLine,
      lineAfterChange: change.changedLine,
    });
  });

  return allChanges;
}

/**
 * Get the last mapping before the change and the next mapping after the change
 * @param {SourceMapConsumer} consumer - The SourceMapConsumer instance
 * @param {Object} change - The change from diffLines
 * @returns {Object} - The last mapping before the change and the next mapping after the change
 */
function getMappingsForChange(consumer, change) {
  let lastMappingBeforeChange;
  let nextMappingAfterChange;

  consumer.eachMapping((m) => {
    const isMappingAfterChange = m.generatedLine > change.line;
    if (m.generatedLine <= change.line) {
      lastMappingBeforeChange = m;
    } else if (isMappingAfterChange && !nextMappingAfterChange) {
      nextMappingAfterChange = m;
    }
  });

  return { lastMappingBeforeChange, nextMappingAfterChange };
}

/**
 * Get the line that changed in the original file
 * @param {Object} lastMappingBeforeChange - The last mapping before the change
 * @param {Object} change - The change from diffLines
 * @returns {number} - The line that changed in the original file
 */
function getLineChanged(lastMappingBeforeChange, change) {
  const linesAfterLastMappingBeforeChange =
    change.line - lastMappingBeforeChange.generatedLine;
  return (
    lastMappingBeforeChange.originalLine + linesAfterLastMappingBeforeChange
  );
}
