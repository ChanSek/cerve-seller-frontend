import React from "react";
import { Grid } from "@mui/material";
import RenderInput from "../../../utils/RenderInput";
import kycDocumentFields from "../provider-kyc-doc-fields";

const StepKycDocuments = ({
  formValues,
  setFormValues,
  errors,
  setErrors,
  fieldValidate,
}) => {
  const handleChange = (e, item) => {
    console.log("test............");
    console.log("e............",e);
    console.log("item............",item);
    if (item.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setFormValues((prev) => ({ ...prev, [item.id]: fileUrl }));
        // ✅ Revalidate this field immediately
        fieldValidate(item.id, fileUrl);
      }
      return;
    }

    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, [item.id]: value }));
    fieldValidate(item.id, value);
    console.log("fieldValidate ", fieldValidate);
  };

  return (
    <Grid container spacing={3}>
      {kycDocumentFields.map((item) => (
        <Grid item xs={12} sm={item.fullWidth ? 12 : 6} key={item.id}>
          <RenderInput
            item={{
              ...item,
              error: !!errors[item.id],
              helperText: errors[item.id],
            }}
            state={formValues}
            handleChange={handleChange}
            stateHandler={setFormValues}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StepKycDocuments;
