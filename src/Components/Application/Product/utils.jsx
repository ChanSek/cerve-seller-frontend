import { isAmountValid } from "../../../utils/validations";
import { MAX_STRING_LENGTH_50 } from "../../../utils/constants";

export const getFormErrors = (fields, formValues) => {
  if (formValues) {
    let form_errors = {};
    let error = "";
    fields.forEach((field) => {
      let id = field.id;
      let field_value = formValues[id];
      if (!field.required) {
        error = "";
      } else if (field.type === "number") {
        error = (field_value === null || field_value === undefined)
          ? "Please enter a valid number"
          : !isAmountValid(field_value)
          ? "Please enter only digit"
          : "";

          if (id === "purchasePrice" && formValues["price"]) {
            if (parseFloat(field_value) > parseFloat(formValues["price"])) {
              error = "Purchase price cannot be greater than the actual price";
            }
          }
      } else if (field.type === "upload") {
        error = field_value.length < 3 ? "Minimum 3 images are required" : "";
      } else {
        error =
          field_value === ""
            ? id + " is required"
            : field_value?.length > MAX_STRING_LENGTH_50
            ? `Cannot be more than ${MAX_STRING_LENGTH_50} characters`
            : "";
      }
      form_errors[id] = error;
    });
    return form_errors;
  } else {
    return {};
  }
};
