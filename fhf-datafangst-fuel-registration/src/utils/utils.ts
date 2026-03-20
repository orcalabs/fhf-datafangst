// Prevents all input from keys not related to input of a natural number
export const numberInputLimiter = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (
    !(e.key >= "0" && e.key <= "9") &&
    e.key !== "Delete" &&
    e.key !== "Backspace" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Home" &&
    e.key !== "End" &&
    e.key !== "Shift"
  ) {
    e.preventDefault();
    return;
  }
};
