import React from "react";
import { Box } from "@mui/material";
import { radioButtonStyles } from "../../../Styles/actionCardStyles";

export default function CustomRadioButton(props) {
  const { checked, oneditaddress, iseditable = false } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", ...radioButtonStyles.parentRadio }}>
      <Box
        component="button"
        sx={{ ...radioButtonStyles.wrapper, p: 1, my: 0.5 }}
        {...props}
      >
        <Box sx={radioButtonStyles.boxBasis}>
          <Box sx={radioButtonStyles.background}>
            <Box sx={checked ? radioButtonStyles.active : radioButtonStyles.nonActive} />
          </Box>
        </Box>
        <Box sx={radioButtonStyles.nameBasis}>{props.children}</Box>
      </Box>
      {iseditable && (
        <Box sx={{ p: 1, my: 0.5, ...radioButtonStyles.parentEditButton }}>
          <Box
            component="button"
            sx={radioButtonStyles.editButton}
            onClick={() => oneditaddress()}
          >
            edit
          </Box>
        </Box>
      )}
    </Box>
  );
}
