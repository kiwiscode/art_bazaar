export const extractIds = (array, idField) => {
  return array?.map((item) => item[idField]?.toString());
};
