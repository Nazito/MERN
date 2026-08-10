export const requiredField = (value) => {
  if (value) {
    return undefined;
  }
  return "error message";
};

export const maxLengthCreatore = (maxLength) => (value) => {
  if (value.length > maxLength) {
    return `max length is ${maxLength} simbols`;
  }
  return undefined;
};
