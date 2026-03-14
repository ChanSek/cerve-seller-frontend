import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {highlightText} from "../../../../utils/textHighlight";
import {GST_OPTIONS} from "../../../../utils/constants";

const SingleProductCard = ({ 
    product, 
    searchText, 
    isSelected, 
    details, 
    onProductSelect, 
    onDetailChange 
}) => (
    <Card 
        variant="outlined" 
        sx={{ 
            border: isSelected ? 2 : 1,
            borderColor: isSelected ? 'primary.main' : 'divider',
            backgroundColor: isSelected ? 'action.selected' : 'background.paper'
        }}
    >
        <CardContent>
            <Grid container spacing={2} alignItems="center">
                {/* Left Section - Product Info */}
                <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Checkbox
                            checked={isSelected}
                            onChange={(e) => onProductSelect(product.pid, e.target.checked)}
                            color="primary"
                        />
                        <Avatar
                            src={product.thumbnailUrl}
                            alt={product.name}
                            sx={{ width: 56, height: 56 }}
                            variant="rounded"
                        />
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {highlightText(product.name, searchText)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Brand: {highlightText(product.brand || "N/A", searchText)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                UOM: {product.uomValue || 1} {product.uom || "UNIT"}
                            </Typography>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                                MRP: ₹{product.mrp || 0}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Section - Input Fields */}
                <Grid item xs={12} md={6}>
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            label="Selling Price"
                            type="number"
                            size="small"
                            value={details.sellingPrice || ""}
                            onChange={(e) => onDetailChange(product.pid, "sellingPrice", e.target.value)}
                            disabled={!isSelected}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                            sx={{ minWidth: 120 }}
                            error={isSelected && (!details.sellingPrice || details.sellingPrice <= 0)}
                            helperText={isSelected && (!details.sellingPrice || details.sellingPrice <= 0) ? "Required" : ""}
                        />
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>GST %</InputLabel>
                            <Select
                                value={details.gstPercentage || ""}
                                label="GST %"
                                onChange={(e) => onDetailChange(product.pid, "gstPercentage", e.target.value)}
                                disabled={!isSelected}
                            >
                                {GST_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default SingleProductCard;