import { diffLines as diff } from "diff";

export const computeLineDifferences = (originalContent, updatedContent) => {
  let diffResult = diff(originalContent, updatedContent);
  // if removed and then added mark as updated and ignore the removed
  diffResult = diffResult
    .map((part, i) => {
      if (part.removed && diffResult[i + 1]?.added) {
        return {
          ...part,
          newValue: diffResult[i + 1].value,
          added: false,
          removed: false,
          replaced: true,
        };
      }
      if (part.added && diffResult[i - 1]?.removed) {
        return null;
      }
      return part;
    })
    .filter(Boolean);

  const changes = diffResult
    .map((part, i) => {
      if (!part.added && !part.removed && !part.replaced) return;
      const lineIndex = diffResult.reduce((acc, curr, index) => {
        if (index <= i) {
          return acc + curr.count;
        }
        return acc;
      }, 0);
      let change;
      if (part.removed) {
        change = {
          lineIndex,
          originalLine: part.value,
          updatedLine: "",
          removed: true,
        };
      } else if (part.added) {
        change = {
          lineIndex,
          originalLine: "",
          updatedLine: part.value,
          added: true,
        };
      } else {
        change = {
          lineIndex,
          originalLine: part.value,
          updatedLine: part.newValue,
          replaced: true,
        };
      }
      return change;
    })
    .filter(Boolean);

  return changes;
};
