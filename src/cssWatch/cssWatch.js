import child_process from "child_process";
import debug from "debug";
import fs from "fs";
import { join } from "path";
import { removeSourceMaps } from "../utils/fileUtils.js";
import { getChangeLocationsInOriginalFile } from "../utils/sourceMapUtils.js";
import { updateOriginalFileWithChanges } from "./updateOriginalFile.js";

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
