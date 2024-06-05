const MAX_VALUE = 2147483647;

export const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const compareKeys = (
  digitList1: number[],
  digitList2: number[]
): number => {
  const len = Math.min(digitList1.length, digitList2.length);
  for (let i = 0; i < len; i++) {
    if (digitList1[i] !== digitList2[i]) {
      return digitList1[i] - digitList2[i];
    }
  }
  return digitList1.length - digitList2.length;
};

export const generateKey = (
  leftDigitList: number[],
  rightDigitList: number[],
  siteId: number
): number[] => {
  const newKey: number[] = [];
  let i: number = 0;
  while (true) {
    const leftDigit: number = leftDigitList[i] ?? 0;
    const rightDigit: number = rightDigitList[i] ?? MAX_VALUE;
    if (rightDigit - leftDigit > 1) {
      newKey.push(generateRandomValue(leftDigit + 1, rightDigit - 1));
      break;
    } else {
      newKey.push(leftDigit);
      i++;
    }
  }
  newKey.push(siteId);
  return newKey;
};
