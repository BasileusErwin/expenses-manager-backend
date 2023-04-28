function buildHeader<T extends object>(header?: T) {
  return { ...header, 'Content-Type': 'application/json' };
}

export const genericFactory = {
  buildHeader,
};
