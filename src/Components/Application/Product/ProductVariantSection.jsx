import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Tooltip
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import RenderInput from "../../../utils/RenderInput";
import './AddProductDialog.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const hideVariantFields = ["availableQty", "uom", "sku", "imageUrls", "backImage"];

const VariantSection = ({
    variant,
    index,
    fields,
    onChange,
    onRemove,
    showRemoveButton,
    variantErrors,
    isEditMode,
}) => {
    const [showAllVariantFields, setShowAllVariantFields] = useState(false);
    const [variantData, setVariantData] = useState(variant.data); // ✅ local state

    const shouldShowDeleteButton =
        showRemoveButton || (isEditMode && variant.data.isNew);

    // ✅ Keep local state in sync with parent prop
    useEffect(() => {
        setVariantData(variant.data);
    }, [variant.data]);

    // ✅ Whenever local state changes, notify parent
    useEffect(() => {
        onChange(index, variantData);
    }, [variantData, index, onChange]);

    const filteredFields = fields.filter((field) => {
        if (!showAllVariantFields && hideVariantFields.includes(field.id))
            return false;
        if (variant.data.isNew && field.id === 'sku') return false;
        return true;
    });

    return (
        <Box className="details-section">
            <Typography
                variant="h6"
                sx={{
                    color: 'primary.dark',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                Variant {index + 1}
                {shouldShowDeleteButton && (
                    <Tooltip title={`Remove Variant ${index + 1}`} arrow>
                        <IconButton
                            onClick={() => onRemove(index)}
                            size="small"
                            color="error"
                            sx={{ p: 0.5 }}
                        >
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Typography>

            <Grid container spacing={3}>
                {filteredFields.map((field) => {
                    const fieldError = variantErrors?.[field.id];
                    return (
                        <Grid item xs={12} sm={4} key={field.id}>
                            <RenderInput
                            key={field.id}
                                item={{ ...field, fullWidth: true, error: !!fieldError, helperText: fieldError || "" }}
                                state={variantData}
                                stateHandler={(updater) => {
                                    setVariantData((prev) => {
                                        const newState = typeof updater === "function" ? updater(prev) : updater;
                                        onChange(index, newState); // ✅ only when user changes input
                                        return newState;
                                    });
                                }}
                            />
                        </Grid>
                    );
                })}
            </Grid>

            <Box mt={2} textAlign="center">
                <Button
                    size="small"
                    variant="text"
                    startIcon={
                        showAllVariantFields ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    onClick={() => setShowAllVariantFields((prev) => !prev)}
                >
                    {showAllVariantFields
                        ? "Show Less Variant Fields"
                        : "Show More Variant Fields"}
                </Button>
            </Box>
        </Box>
    );
};

export default VariantSection;
