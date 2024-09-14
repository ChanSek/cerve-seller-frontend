import moment from "moment";

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
  return /^\d{1,10}(\.\d{1,2})?$/.test(value);
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

export const isDateValid = (value) => {
  // Use regex to ensure the input follows the DD/MM/YYYY format
  const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!datePattern.test(value)) {
    return false; // Return false if the format doesn't match
  }

  // Use moment to check if the value is a valid date in DD/MM/YYYY format
  const isValidDate = moment(value, 'DD/MM/YYYY', true).isValid();

  // Optionally check if the year is within a valid range (e.g., 1900-2100)
  const [day, month, year] = value.split('/');
  const yearInt = parseInt(year, 10);

  if (!isValidDate || yearInt < 1900 || yearInt > 2100) {
    return false; // Return false if the date is invalid or the year is out of range
  }

  return true;
};

export const isMonthYearValid = (value) => {
  // First, check if the input matches the MM/YYYY format using a regex
  const monthYearPattern = /^(0[1-9]|1[0-2])\/\d{4}$/;

  if (!monthYearPattern.test(value)) {
    return false; // If the format is incorrect, return false
  }

  // Extract month and year from the value
  const [month, year] = value.split('/');

  // Validate the date using Moment.js
  const isValidDate = moment(`${year}-${month}`, 'YYYY-MM', true).isValid();

  // Check if the year is within a reasonable range (e.g., between 1900 and 2100)
  const yearInt = parseInt(year, 10);
  if (!isValidDate || yearInt < 1900 || yearInt > 2100) {
    return false; // Return false if the date is invalid or the year is out of range
  }

  return true;
};

export const areObjectsEqual = (firstObj, secondObj) => JSON.stringify(firstObj) === JSON.stringify(secondObj);
