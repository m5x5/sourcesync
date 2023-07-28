import child_process from "child_process";
import fs from "fs";
import { join } from "path";
import { SourceMapConsumer } from "source-map";
import { diffLines } from "./diff.js";
import { updateOriginalFileWithChanges } from "./file.js";

(async () => {
  child_process.execSync("npm run build:css");
  let file = await fs.promises.readFile(
    join(process.cwd(), "./dist/assets/output.css"),
    "utf8"
  );
  // remove source maps
  let lines = file.split("\n");
  lines = lines.filter((line) => !line.startsWith("/*# sourceMappingURL="));
  lines.pop();

  const newFile = lines.join("\n");

  await fs.promises.writeFile(
    join(process.cwd(), "./dist/assets/output.css"),
    newFile
  );

  file = await fs.promises.readFile(
    join(process.cwd(), "./dist/assets/output.css"),
    "utf8"
  );

  const unchangedFile = file;

  fs.watchFile(join(process.cwd(), "./dist/assets/output.css"), async () => {
    file = await fs.promises.readFile(
      join(process.cwd(), "./dist/assets/output.css"),
      "utf8"
    );
    console.log("output.css changed");
    // Update original file
    const changes = await getChangeLocationsInOriginalFile(unchangedFile, file);
    await updateOriginalFileWithChanges(changes);
  });
})();

async function getChangeLocationsInOriginalFile(
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
        // console.log("mapping after:", m);
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
  // Map changes back to the original source
  let originalChanges = changes.map((change) => {
    if (change.added || change.removed) {
      const { line } = change;
      const originalPosition = consumer.originalPositionFor({
        line: line + 1,
        column: 0,
      });
      return { ...change, originalPosition };
    }
    return change;
  });

  return allChanges;

  // Now you can use `originalChanges` to update your original source file
  // This will depend on how your original source file is structured and how you want to apply the changes
}
