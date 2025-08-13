import React, { useEffect, useState, useMemo, useRef } from "react";
import { Box, Grid, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RenderInput from "../../../utils/RenderInput";

const VitalInfoSection = ({
  fields,
  isEditMode,
  formData: parentFormData,
  onFormDataChange,
  vitalErrors = {}
}) => {
  // Generate initial values based on field definitions
  const initialValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.id] =
        field.type === "number"
          ? null
          : field.type === "upload"
          ? field.multiple
            ? []
            : ""
          : "";
      return acc;
    }, {});
  }, [fields]);

  // Local state initialized with merged defaults + parent values
  const [localFormData, setLocalFormData] = useState({
    ...initialValues,
    ...parentFormData
  });

  const [showAllFields, setShowAllFields] = useState(false);
  const [updatedFields] = useState(fields);

  // Keep track of last parentFormData to avoid redundant updates
  const lastParentFormDataRef = useRef(parentFormData);

  // Sync from parent → local only when values differ
  useEffect(() => {
    if (JSON.stringify(lastParentFormDataRef.current) !== JSON.stringify(parentFormData)) {
      setLocalFormData(prev => ({
        ...prev,
        ...parentFormData
      }));
      lastParentFormDataRef.current = parentFormData;
    }
  }, [parentFormData]);

  // Call parent only when local changes differ from parent's last known values
  useEffect(() => {
    if (JSON.stringify(localFormData) !== JSON.stringify(lastParentFormDataRef.current)) {
      onFormDataChange?.(localFormData);
    }
  }, [localFormData, onFormDataChange]);

  // Required fields are always visible
  const requiredFieldIds = new Set(
    updatedFields.filter(field => field.required).map(field => field.id)
  );

  const visibleFields = showAllFields
    ? updatedFields
    : updatedFields.filter(f => requiredFieldIds.has(f.id));

  return (
    <Box className="details-section">
      <Grid container spacing={2}>
        {visibleFields.map(item => (
          <Grid item xs={12} sm={6} key={item.id}>
            <RenderInput
              item={{
                ...item,
                error: Boolean(vitalErrors[item.id]),
                helperText: vitalErrors[item.id] || "",
                fullWidth: true
              }}
              previewOnly={isEditMode && item.id === "productCode"}
              state={localFormData}
              stateHandler={setLocalFormData}
            />
          </Grid>
        ))}
      </Grid>

      <Box mt={2} textAlign="center">
        <Button
          size="small"
          variant="text"
          startIcon={showAllFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowAllFields(prev => !prev)}
        >
          {showAllFields
            ? "Hide Additional Vital Fields"
            : "Show All Vital Fields"}
        </Button>
      </Box>
    </Box>
  );
};

export default VitalInfoSection;
