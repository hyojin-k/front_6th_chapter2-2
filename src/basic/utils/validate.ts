export const validateForm = (value: string) => {
  if (value === '' || /^\d+$/.test(value)) {
    return value === '' ? 0 : parseInt(value);
  }
  return 0;
};
