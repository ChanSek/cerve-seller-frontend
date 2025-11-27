import React from "react";
import { Box, Grid } from "@mui/material";
import { LoadCanvasTemplate } from "react-simple-captcha";
import RenderInput from "../../../utils/RenderInput";
import bankDetailFields from "../provider-bank-details-fields";
import { isValidIFSC } from "../../../utils/validations"; // ✅ make sure this is imported
import { getCall } from "../../../Api/axios";

const StepBankDetails = ({
  formValues,
  setFormValues,
  errors,
  setErrors,
  fieldValidate,
  step, // ✅ pass current step for IFSC logic (optional)
}) => {
  const getIFSCDetails = async (ifsc_code) => {
    const url = `/api/v1/seller/reference/${ifsc_code}/ifsc`;
    const res = await getCall(url);
    return res;
  };
  const handleChange = async (e, item) => {
    let value = item.isUperCase ? e.target.value.toUpperCase() : e.target.value;

    // --- Update field in state immediately
    setFormValues((prev) => ({ ...prev, [item.id]: value }));

    // --- Real-time validation while typing
    fieldValidate(item.id, value);

    // --- Auto-fetch Bank Name & Branch from IFSC (only on step 3)
    if (item.id === "IFSC") {
      // reset bank & branch if IFSC changes
      setFormValues((prev) => ({
        ...prev,
        IFSC: value,
        bankName: "",
        branchName: "",
      }));

      // when IFSC is valid format, fetch bank details
      if (isValidIFSC(value)) {
        try {
          const ifscDetails = await getIFSCDetails(value);
          const { BANK, BRANCH } = ifscDetails.data || {};

          if (BANK || BRANCH) {
            setFormValues((prev) => ({
              ...prev,
              IFSC: value,
              bankName: BANK || "",
              branchName: BRANCH || "",
            }));
          }
        } catch (err) {
          console.warn("Failed to fetch IFSC details:", err);
        }
      }
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {bankDetailFields.map((item) => (
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

      
    </>
  );
};

export default StepBankDetails;
