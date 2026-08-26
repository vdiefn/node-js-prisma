export const isValidString = (str) => {
  if (!str || str.trim().length === 0) {
    return false;
  }
  return true;
};

export const isValidInteger = (num) => {
  return typeof num === "number" && Number.isInteger(num) && num > 0;
};
