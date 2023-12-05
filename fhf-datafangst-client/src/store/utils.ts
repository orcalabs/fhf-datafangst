import { matrixSum } from "utils";

export const computeMatrixStats = <T>(
  matrix: number[],
  widthArray: { id: T }[],
  filters: number[],
  activeFilters?: number[],
) => {
  const stats = [];
  const width = widthArray.length;
  const height = matrix.length / width;

  if (activeFilters?.length)
    for (let x = 0; x < width; x++) {
      let value = 0;
      for (let i = 0; i < activeFilters.length; i++) {
        const y = activeFilters[i];
        if (y < height) {
          value += matrixSum(matrix, width, x, y, x, y);
        }
      }
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }
  else
    for (let x = 0; x < width; x++) {
      const value = matrixSum(matrix, width, x, 0, x, height - 1);
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }

  return stats;
};
