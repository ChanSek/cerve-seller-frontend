import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

const StepperHeader = ({ steps, step }) => (
  <Box sx={{ width: "100%", mb: 4 }}>
    <Stepper activeStep={step - 1} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export default StepperHeader;
