export const getSerializedModel = (obj: Object) => {
  return JSON.stringify(obj);
};

export const getDeserializedModel = (str: string) => {
  if (!!str && typeof str !== 'object' && str !== 'undefined') {
    return JSON.parse(str);
  }

  return str;
};
