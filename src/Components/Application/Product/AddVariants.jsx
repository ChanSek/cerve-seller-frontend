import { useEffect } from "react";
import MyButton from "../../Shared/Button";
import VarinatForm from "./VariantForm";
import { v4 as uuidv4 } from "uuid";

const AddVariants = ({
  variantFields,
  variantInitialValues,
  variantUpdatedValues,
  variantForms,
  setVariantForms,
  shouldValidate,
  variantFormsErrors,
}) => {

  useEffect(() => {
    if (variantForms.length == 1 && variantUpdatedValues != null && variantUpdatedValues.length > 0) {
      handleRemoveForm(0);
      // Create a new array that includes all current forms plus the new ones
      const updatedForms = [
        ...variantForms,
        ...variantUpdatedValues.map(value => ({
          ...value,
          formKey: uuidv4()
        }))
      ];
      setVariantForms(updatedForms);
    }
  }, [variantUpdatedValues]);

  const addNewVariationForm = () => {
    setVariantForms([...variantForms, { ...variantInitialValues, formKey: uuidv4() }]);
  };

  const handleOnVariantFormUpdate = (index, formValues) => {
    variantForms[index] = formValues;
    setVariantForms([...variantForms]);
  };

  const handleRemoveForm = (i) => {
    variantForms.splice(i, 1);
    setVariantForms([...variantForms]);
    variantFormsErrors.splice(i, 1);
  };

  const renderForms = () => {
    return variantForms.map((form, i) => {
      return (
        <VarinatForm
          key={form.formKey}
          index={i}
          formData={form}
          fields={variantFields}
          onFormUpdate={handleOnVariantFormUpdate}
          shouldValidate={shouldValidate}
          formsErrors={variantFormsErrors}
          removeForm={handleRemoveForm}
        />
      );
    });
  };

  return (
    <>
      {renderForms()}
      <MyButton type="button" title="Add Variation" className="text-black" onClick={() => addNewVariationForm()} />
    </>
  );
};

export default AddVariants;
