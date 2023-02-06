// Shorten a string to less than maxLen characters without truncating words.
const shorten = (str: string, maxLen: number, separator = ' ') => {
  if (str.length <= maxLen) return str;
  return `${str.substring(0, str.lastIndexOf(separator, maxLen))}...`;
};

export { shorten };
