export const checkEmpty = (obj) => {
  let ans = false;
  for (var key in obj) {
    if (obj[key].trim() == "") {
      ans = true;
      break;
    }
  }
  return ans;
};

export const isNumberOnly = (value) => {
  return /^[0-9]*$/.test(value)
};

export const isAmountValid = (value) => {
  return /^\d{0,8}(\.\d{1,4})?$/.test(value)
};

export const isNameValid = (value) => {
  return /^[a-zA-Z]+[a-zA-Z '.-]*$/.test(value)
};

export const isPhoneNoValid = (value) => {
  return /^(?:\+91\s?)?0?[6-9][0-9]{9}$/.test(value);
};

export const isEmailValid = (value) => {
  return /^[a-zA-Z0-9._-]+(\+[a-zA-Z0-9._-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com|net|org|edu|in|co\.in)$/.test(value);
};

export const isValidPAN = (value) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
};

export const isValidGSTIN = (value) => {
  // GSTIN should be alphanumeric and 15 characters long
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9][Z][A-Z0-9]$/.test(value);
}

export const isValidFSSAI = (value) => {
  // FSSAI should be 14 digit number
  return /^[0-9]{14}$/.test(value)
}

export const isValidIFSC = (value) => {
  return /^[A-Z]{4}0[0-9]{6}$/.test(value);
}

export const isAlphaNumericOnly = (value) => {
  return /^[A-Za-z0-9]+$/i.test(value)
}

export function isObjEmpty(obj) {
  return obj == null || obj == "null" || Object.keys(obj).length === 0;
}

export const isValidBankAccountNumber = (str) => {
  return /^\d{9,18}$/.test(str) && !/(.)\1{3,}/.test(str);
}

export const isValidChars = (value) => {
  return /^[a-zA-Z][\w\s\W]*$/.test(value);
};

export const hasRepeatedChars = (value) => {
  return /(.)\1{3,}/.test(value);
};

export const isValidDescription = (value) => {
  // Check if the description is at least 10 characters long and contains spaces or punctuation
  const isNotSingleWord = value.length >= 10 && /\s|[,.!?;:'"-]|[\r\n]/.test(value);
  // Check for repeated sequences of characters
  const hasNoLongRepeats = !/(.)\1{4,}/.test(value) && !/(\b\w+\b).*\1{2,}/.test(value);
  // Return true if both conditions are met
  return isNotSingleWord && hasNoLongRepeats;
};

export const areObjectsEqual = (firstObj, secondObj) => JSON.stringify(firstObj) === JSON.stringify(secondObj);
