import { diffLines as diff } from "diff";

export const computeLineDifferences = (originalContent, updatedContent) => {
  const diffResult = diff(originalContent, updatedContent);

  const changes = diffResult
    .map((part, i) => {
      console.log(part);
      if (part.added || part.removed) {
        const lineIndex = diffResult.reduce((acc, curr, index) => {
          if (index <= i) {
            return acc + curr.count;
          }
          return acc;
        }, 0);
        return {
          lineIndex: lineIndex,
          originalLine: part.removed ? part.value : "",
          updatedLine: part.added ? part.value : "",
        };
      }
    })
    .filter(Boolean);

  return changes;
};
