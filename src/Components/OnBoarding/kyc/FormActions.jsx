import React from "react";
import { Box, Button } from "@mui/material";

const FormActions = ({ step, formSubmitted, onBack, onContinue }) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}>
    <Button
      type="button"
      size="large"
      sx={{ mr: 2 }}
      variant="text"
      onClick={onBack}
      disabled={formSubmitted || step === 1}
    >
      Back
    </Button>

    <Button
      type="button"
      size="large"
      disabled={formSubmitted}
      variant="contained"
      color={step === 4 ? "success" : "primary"}  // ✅ Success color for step 4
      onClick={onContinue}
    >
      {formSubmitted
        ? "Processing..."
        : step === 4
        ? "Submit"
        : "Continue"}
    </Button>
  </Box>
);

export default FormActions;
