import debug from "debug";
import fs from "fs";
import { bundle } from "lightningcss";
import path from "path";
import { updateOriginalFileWithChanges } from "./sync/cssSync.js";
import { removeSourceMaps } from "./utils/fileUtils.js";
import { getChangeLocationsInOriginalFile } from "./utils/sourceMapUtils.js";

const log = debug("sourcesync");

class SourceSync {
  constructor(sourcePath, outputPath) {
    this.config = {
      cssOutputFile: outputPath,
      sourceFile: sourcePath,
    };

    this.internalUpdate = false;
  }

  async buildCss() {
    const filename = this.config.sourceFile.split(path.sep).pop();

    if (!filename) {
      throw new Error("Could not get filename from sourcePath");
    }

    const buffer = await fs.promises.readFile(this.config.cssOutputFile);

    const { code, map: mapBuffer } = bundle({
      filename: this.config.sourceFile,
      code: buffer.toString(),
      sourceMap: true,
    });

    this.internalUpdate = true;

    await fs.promises.writeFile(this.config.cssOutputFile, code);
    await fs.promises.writeFile(
      `${this.config.cssOutputFile}.map`,
      mapBuffer.toString()
    );
  }

  async removeCssSourceMaps() {
    let fileContent = await fs.promises.readFile(
      this.config.cssOutputFile,
      "utf8"
    );
    let linesWithoutSourceMaps = removeSourceMaps(fileContent);

    const newFileContent = linesWithoutSourceMaps.join("\n");

    await fs.promises.writeFile(this.config.cssOutputFile, newFileContent);
  }

  async startSync() {
    await this.buildCss();
    await this.removeCssSourceMaps();
    let unchangedFileContent = await fs.promises.readFile(
      this.config.cssOutputFile,
      "utf8"
    );

    fs.watchFile(this.config.cssOutputFile, async () => {
      if (this.internalUpdate) {
        this.internalUpdate = false;
        return;
      }

      const changedFileContent = await fs.promises.readFile(
        this.config.cssOutputFile,
        "utf8"
      );
      log("output.css changed");
      const changes = await getChangeLocationsInOriginalFile(
        unchangedFileContent,
        changedFileContent,
        this.config.cssOutputFile
      );
      const changedFiles = Array.from(
        new Set(changes.map((change) => change.originalFile))
      );

      for (let changedFile of changedFiles) {
        log(`Updating ${changedFile}`);
        const fileSpecificChanges = changes.filter(
          (change) => change.originalFile === changedFile
        );
        await updateOriginalFileWithChanges(
          fileSpecificChanges,
          "/" + changedFile
        );
      }
      unchangedFileContent = changedFileContent;

      this.buildCss();
    });
  }
}

export { SourceSync };
