import React from "react";
import { Grid } from "@mui/material";
import RenderInput from "../../../utils/RenderInput";
import kycDetailFields from "../provider-kyc-fields";

const StepKycDetails = ({ formValues, setFormValues, errors, setErrors, fieldValidate }) => {
    const handleChange = (e, item) => {
        const value = e.target.value;

        // Update state first
        setFormValues((prev) => ({ ...prev, [item.id]: value }));

        // ✅ Real-time validation while typing
        fieldValidate(item.id, value);
    };

    return (
        <Grid container spacing={3}>
            {kycDetailFields.map((item) => (
                <Grid item xs={12} sm={item.fullWidth ? 12 : 6} key={item.id}>
                    <RenderInput
                        item={{ ...item, error: !!errors[item.id], helperText: errors[item.id] }}
                        state={formValues}
                        handleChange={handleChange}
                        stateHandler={setFormValues}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default StepKycDetails;
