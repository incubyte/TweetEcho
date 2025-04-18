const holdMyMemory = new Map<string, string>();

export const saveInMemory = (key: string, value: string) => {
  holdMyMemory.set(key, value);
};

export const getFromMemory = (key: string) => {
  return holdMyMemory.get(key);
};
