export const isValidString = (str) => {
  if (!str || typeof str !== "string" || str.trim().length === 0) {
    return false;
  }
  return true;
};

export const isValidInteger = (num) => {
  return typeof num === "number" && Number.isInteger(num) && num >= 0;
};

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[a-zA-Z\d]{8,16}$/;
export const isValidPassword = (str) => {
  if (!isValidString(str)) return false;
  return PASSWORD_REGEX.test(str);
};

export const isValidURL = (str) => {
  if (!isValidString(str)) return false;

  return str.startsWith("https://");
};
