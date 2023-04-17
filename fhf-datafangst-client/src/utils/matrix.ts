// A O(1) time function to compute sum
// of submatrix between (x1, y1) and
// (x2, y2) using aux[][] which is
// built by the preprocess function
export function matrixSum(
  matrix: number[],
  width: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  // result is now sum of elements
  // between (0, 0) and (x2, y2)
  let result = matrix[x2 + y2 * width];

  // Remove elements between (0, 0)
  // and (x1-1, y2)
  if (y1 > 0) {
    result = result - matrix[x2 + (y1 - 1) * width];
  }

  // Remove elements between (0, 0)
  // and (x2, y1-1)
  if (x1 > 0) {
    result = result - matrix[x1 - 1 + y2 * width];
  }

  // Add aux[x1-1][y1-1] since elements
  // between (0, 0) and (x1-1, y1-1)
  // are subtracted twice
  if (y1 > 0 && x1 > 0) {
    result = result + matrix[x1 - 1 + (y1 - 1) * width];
  }

  return result;
}
