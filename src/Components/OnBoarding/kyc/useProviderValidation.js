import {
  isValidBankAccountNumber,
  isValidIFSC,
  isNameValid,
  isEmailValid,
  isValidPAN,
  isPhoneNoValid,
  isValidChars,
  isValidAddress,
  isValidDescription,
  hasRepeatedChars,
  isValidGSTIN,
  isValidFSSAI,
} from "../../../utils/validations";
import { validateCaptcha } from "react-simple-captcha";

export default function useProviderValidation(formValues, setErrors, step) {
  const setFieldError = (field, message = "") =>
    setErrors((prev) => ({ ...prev, [field]: message }));

  const isEmpty = (v) => !v?.trim?.();

  // --- Field-Level Validation ---
  const fieldValidate = (field, value) => {
    if (field === "captcha") return true;
    value = value?.trim?.() ?? "";

    const rules = {
      providerStoreName: () =>
        isEmpty(value)
          ? "Provider Store Name is required"
          : !isValidChars(value) || hasRepeatedChars(value)
            ? "Please provide a valid Store Name"
            : "",

      shortDescription: () =>
        isEmpty(value)
          ? "Short Description is required"
          : !isValidDescription(value)
            ? "Please provide a clear description"
            : "",

      longDescription: () =>
        isEmpty(value)
          ? "Long Description is required"
          : !isValidDescription(value)
            ? "Please provide a clear description"
            : "",

      address: () =>
        isEmpty(value)
          ? "Registered Address is required"
          : !isValidAddress(value)
            ? "Please provide a valid Registered Address"
            : "",

      contactEmail: () =>
        isEmpty(value)
          ? "Contact Email is required"
          : !isEmailValid(value)
            ? "Please enter a valid email address"
            : "",

      contactMobile: () =>
        isEmpty(value)
          ? "Contact Mobile Number is required"
          : !isPhoneNoValid(value)
            ? "Please enter a valid mobile number"
            : "",

      PAN: () =>
        isEmpty(value)
          ? "PAN is required"
          : !isValidPAN(value)
            ? "Please enter a valid PAN number"
            : "",

      // ✅ Optional fields
      GSTN: () =>
        isEmpty(value)
          ? ""
          : !isValidGSTIN(value)
            ? "GSTIN must be 15 alphanumeric characters"
            : "",

      FSSAI: () =>
        isEmpty(value)
          ? ""
          : !isValidFSSAI(value) || value.length !== 14
            ? "FSSAI must be a 14-digit number"
            : "",

      // ✅ Document validations
      address_proof: () =>
        isEmpty(value)
          ? "Address Proof is required"
          : value.startsWith("blob:") || value.startsWith("http")
            ? ""
            : "",

      id_proof: () =>
        isEmpty(value)
          ? "ID Proof is required"
          : value.startsWith("blob:") || value.startsWith("http")
            ? ""
            : "",

      PAN_proof: () =>
        isEmpty(value)
          ? "PAN Card Image is required"
          : value.startsWith("blob:") || value.startsWith("http")
            ? ""
            : "",

      // ✅ Bank Fields (only validated if any bank field entered)
      accHolderName: () =>
        hasRepeatedChars(value) || (!isEmpty(value) && !isNameValid(value))
          ? "Please enter a valid account holder name"
          : "",

      accNumber: () =>
        !isEmpty(value) && !isValidBankAccountNumber(value)
          ? "Please enter a valid account number"
          : "",

      IFSC: () =>
        !isEmpty(value) && !isValidIFSC(value)
          ? "Please enter a valid IFSC code"
          : "",

      bankName: () => "",
      branchName: () => "",

      cancelledCheque: () =>
        !isEmpty(value) &&
          !(value.startsWith("blob:") || value.startsWith("http") || value.startsWith("assets/"))
          ? "Invalid file URL for Cancelled Cheque"
          : "",

      captcha: () =>
        isEmpty(value)
          ? "Captcha is required"
          : !validateCaptcha(value)
            ? "Captcha does not match"
            : "",
    };

    const message = rules[field]?.() || "";
    setFieldError(field, message);
    return !message;
  };

  // --- Form-Level Validation ---
  const validate = () => {
    const fieldsByStep = {
      1: [
        "providerStoreName",
        "shortDescription",
        "longDescription",
        "address",
        "contactEmail",
        "contactMobile",
        "PAN",
        "GSTN",
        "FSSAI",
      ],
      2: ["address_proof", "id_proof", "PAN_proof"],
      3: [
        "accHolderName",
        "accNumber",
        "IFSC",
        "bankName",
        "branchName",
        "cancelledCheque",
      ],
      4: ["captcha"],
    };

    const relevantFields = fieldsByStep[step] || [];
    const newErrors = {};

    // ✅ Skip validation if all bank fields are empty
    if (step === 3) {
      const hasAnyBankValue = relevantFields.some(
        (f) => !isEmpty(formValues[f])
      );
      if (!hasAnyBankValue) {
        // ✅ Clear all old bank field errors if user removed data
        relevantFields.forEach((f) => (newErrors[f] = ""));
        setErrors((prev) => ({ ...prev, ...newErrors }));
        return true;
      }
    }

    for (const field of relevantFields) {
      const val = formValues[field];
      let message = "";

      if (field === "captcha") {
        if (isEmpty(val)) message = "Captcha is required";
        else if (!validateCaptcha(val)) message = "Captcha does not match";
      } else {
        const isValid = fieldValidate(field, val);
        if (!isValid) message = `Invalid ${field}`;
      }

      newErrors[field] = message;
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    return !hasErrors;
  };

  return { validate, fieldValidate };
}
