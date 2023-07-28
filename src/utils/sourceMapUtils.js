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
  const rawSourceMap = await fs.promises.readFile(
    join(process.cwd(), "./dist/assets/output.css.map"),
    "utf8"
  );

  // Create a SourceMapConsumer
  const consumer = await new SourceMapConsumer(rawSourceMap);

  const allChanges = [];

  changes.forEach((change) => {
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

    const linesAfterLastMappingBeforeChange =
      change.line - lastMappingBeforeChange.generatedLine;
    const lineChanged =
      lastMappingBeforeChange.originalLine + linesAfterLastMappingBeforeChange;

    allChanges.push({
      changeStartLine: lineChanged,
      changeEndLine: nextMappingAfterChange.originalLine,
      lineBeforeChange: change.originalLine,
      lineAfterChange: change.changedLine,
    });
  });

  return allChanges;
}
