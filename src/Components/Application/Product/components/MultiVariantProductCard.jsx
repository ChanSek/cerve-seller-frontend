import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {highlightText} from "../../../../utils/textHighlight";
import {GST_OPTIONS} from "../../../../utils/constants";

const MultiVariantProductCard = ({ 
    group, 
    searchText, 
    selectedProducts, 
    productDetails, 
    onProductSelect, 
    onDetailChange 
}) => {
    const selectedVariantsInGroup = group.variants.filter(variant => selectedProducts.has(variant.pid));
    const hasSelection = selectedVariantsInGroup.length > 0;
    const commonGST = hasSelection ? productDetails[selectedVariantsInGroup[0].pid]?.gstPercentage : "";
    
    // Debug logging
    console.log('MultiVariantProductCard:', {
        productName: group.productName,
        variantCount: group.variants.length,
        selectedCount: selectedVariantsInGroup.length,
        hasSelection,
        commonGST,
        selectedProducts: Array.from(selectedProducts)
    });

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                border: hasSelection ? 2 : 1,
                borderColor: hasSelection ? 'primary.main' : 'divider',
                backgroundColor: hasSelection ? 'action.selected' : 'background.paper'
            }}
        >
            <CardContent>
                {/* Product Header */}
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                    src={group.thumbnailUrl}
                                    alt={group.productName}
                                    sx={{ width: 56, height: 56 }}
                                    variant="rounded"
                                />
                                <Box flex={1}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {highlightText(group.productName, searchText)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Brand: {highlightText(group.brand || "N/A", searchText)}
                                    </Typography>
                                    <Chip 
                                        label={`${group.variants.length} variants`} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Common GST for all variants:
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>GST %</InputLabel>
                                    <Select
                                        value={commonGST || ""}
                                        label="GST %"
                                        disabled={!hasSelection}
                                        onChange={(e) => {
                                            // Apply GST to first selected variant (will cascade to others)
                                            if (selectedVariantsInGroup.length > 0) {
                                                onDetailChange(selectedVariantsInGroup[0].pid, "gstPercentage", e.target.value);
                                            }
                                        }}
                                    >
                                        {GST_OPTIONS.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {!hasSelection && (
                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                                        Select variants to set GST
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Variants List */}
                <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Variants:
                    </Typography>
                    <Grid container spacing={1}>
                        {group.variants.map((variant, index) => {
                            const isSelected = selectedProducts.has(variant.pid);
                            const details = productDetails[variant.pid] || {};

                            return (
                                <Grid item xs={12} key={variant.pid}>
                                    <Paper 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 2,
                                            backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                                            border: isSelected ? '1px solid' : '1px solid',
                                            borderColor: isSelected ? 'primary.main' : 'divider'
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} md={6}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={(e) => onProductSelect(variant.pid, e.target.checked)}
                                                        color="primary"
                                                    />
                                                    <Avatar
                                                        src={variant.thumbnailUrl}
                                                        alt={variant.name}
                                                        sx={{ width: 40, height: 40 }}
                                                        variant="rounded"
                                                    />
                                                    <Box flex={1}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {variant.name !== group.productName ? variant.name : `Variant ${index + 1}`}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            UOM: {variant.uomValue || 1} {variant.uom || "UNIT"}
                                                        </Typography>
                                                        <Typography variant="body2" color="primary" fontWeight="bold">
                                                            MRP: ₹{variant.mrp || 0}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box display="flex" gap={2} alignItems="center">
                                                    <TextField
                                                        label="Selling Price"
                                                        type="number"
                                                        size="small"
                                                        value={details.sellingPrice || ""}
                                                        onChange={(e) => onDetailChange(variant.pid, "sellingPrice", e.target.value)}
                                                        disabled={!isSelected}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                        }}
                                                        sx={{ flex: 1 }}
                                                        error={isSelected && (!details.sellingPrice || details.sellingPrice <= 0)}
                                                        helperText={isSelected && (!details.sellingPrice || details.sellingPrice <= 0) ? "Required" : ""}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MultiVariantProductCard;