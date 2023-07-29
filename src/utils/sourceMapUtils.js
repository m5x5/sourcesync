import fs from "fs";
import { SourceMapConsumer } from "source-map";
import { computeLineDifferences } from "../diff/cssDiff.js";

/**
 * Get the locations of changes in the original file from a source map
 * @param {string} originalGeneratedFile - The content of the original generated file
 * @param {string} changedFile - The content of the changed file
 * @returns {Promise<Object[]>} - The changes in the original file
 */
export async function getChangeLocationsInOriginalFile(
  originalGeneratedFile,
  changedFile,
  cssOutputPath
) {
  const changes = computeLineDifferences(originalGeneratedFile, changedFile);

  // Read the source map
  const rawSourceMap = await getSourceMap(cssOutputPath);

  // Create a SourceMapConsumer
  const consumer = await new SourceMapConsumer(rawSourceMap);

  return getChangesFromConsumer(consumer, changes);
}

/**
 * Get the source map from the output file
 * @returns {Promise<string>} - The raw source map
 */
async function getSourceMap(cssOutputFile) {
  return fs.promises.readFile(cssOutputFile + ".map", "utf8");
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

    allChanges.push({
      changeStartLine: lastMappingBeforeChange?.originalLine ?? 0,
      changeEndLine: nextMappingAfterChange?.originalLine ?? Infinity,
      originalFile: lastMappingBeforeChange?.source,
      lineBeforeChange: change.originalLine,
      lineAfterChange: change.updatedLine,
      removed: change.removed,
      added: change.added,
      replaced: change.replaced,
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
    const isMappingAfterChange = m.generatedLine > change.lineIndex;
    if (m.generatedLine <= change.lineIndex) {
      lastMappingBeforeChange = m;
    } else if (isMappingAfterChange && !nextMappingAfterChange) {
      nextMappingAfterChange = m;
    }
  });

  return { lastMappingBeforeChange, nextMappingAfterChange };
}
