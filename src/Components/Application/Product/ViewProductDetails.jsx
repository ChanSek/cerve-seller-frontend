import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Stack,
    Chip,
    Box,
    CircularProgress,
    Divider,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    FormControl, // Added for select
    InputLabel, // Added for select
    Select, // Added for select
    MenuItem, // Added for select
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { getCall } from "../../../Api/axios";

// Styled components for better structure and theming integration
const ProductImageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: theme.spacing(2),
        alignSelf: 'flex-start', // Ensures sticky behavior starts at the top of its flex container
    },
}));

const MainProductImage = styled('img')({
    width: '100%',
    maxWidth: 500,
    height: 'auto',
    maxHeight: 400,
    objectFit: 'contain',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
});

const ThumbnailContainer = styled(Box)({
    display: 'flex',
    overflowX: 'auto',
    gap: '8px',
    paddingBottom: '8px',
    justifyContent: 'center',
    width: '100%', // Ensure container takes full width for centering
    minHeight: '70px', // Give it a slight min-height to prevent collapse
    alignItems: 'center', // Vertically align thumbnails
});

const ThumbnailImage = styled('img')(({ theme, isSelected }) => ({
    width: 60,
    height: 60,
    minWidth: 60, // Ensure it doesn't shrink below 60px
    minHeight: 60, // Ensure it doesn't shrink below 60px
    objectFit: 'contain',
    border: `2px solid ${isSelected ? theme.palette.primary.main : '#e0e0e0'}`,
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'border-color 0.2s ease-in-out, transform 0.1s ease-in-out',
    backgroundColor: '#f0f0f0', // Light grey background for placeholders
    '&:hover': {
        borderColor: theme.palette.primary.light,
        transform: 'scale(1.05)',
    },
}));

// Function to format FSSAI license numbers
const formatFSSAINo = (number) => {
    if (!number) return 'N/A';
    // Convert to string to handle potential large numbers as strings or numbers
    const str = String(number);
    // Basic formatting for readability, e.g., insert spaces
    // This is a simple example; actual FSSAI formatting might be more complex
    return str.replace(/(\d{5})(?=\d)/g, '$1 ');
};

// Main Product Details Component
const ViewProductDetails = ({ productId, prodType, category }) => {
    const [productData, setProductData] = useState(null); // Holds the entire data object from API
    const [commonDetails, setCommonDetails] = useState(null);
    const [variantSpecificDetails, setVariantSpecificDetails] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null); // Currently selected variant
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            let response = {};
            if (prodType === "Item") {
                response = await getCall(`/api/v1/seller/itemId/${category}/${productId}/product`);
            } else if (prodType === "Product") {
                response = await getCall(`/api/v1/seller/productId/${category}/${productId}/product`);
            }
            if (response?.status === 200 && response?.data) {
                setProductData(response.data); // Store the entire data object
                setCommonDetails(response.data.commonDetails);
                setVariantSpecificDetails(response.data.variantSpecificDetails || []);

                // Set initial selected variant if available, otherwise use commonDetails if no variants
                if (response.data.variantSpecificDetails && response.data.variantSpecificDetails.length > 0) {
                    setSelectedVariant(response.data.variantSpecificDetails[0]);
                    // Set initial image from the first variant
                    const firstVariantImages = response.data.variantSpecificDetails[0].imageUrls;
                    const firstVariantBackImage = response.data.variantSpecificDetails[0].backImage;
                    if (firstVariantImages && firstVariantImages.length > 0) {
                        setSelectedImage(firstVariantImages[0]);
                    } else if (firstVariantBackImage) {
                        setSelectedImage(firstVariantBackImage);
                    } else {
                        setSelectedImage('');
                    }
                } else if (response.data.commonDetails) {
                    // No variants, use commonDetails for display
                    setSelectedVariant(null); // Explicitly null for non-variant products
                    if (response.data.commonDetails.imageUrls && response.data.commonDetails.imageUrls.length > 0) {
                        setSelectedImage(response.data.commonDetails.imageUrls[0]);
                    } else if (response.data.commonDetails.backImage) {
                        setSelectedImage(response.data.commonDetails.backImage);
                    } else {
                        setSelectedImage('');
                    }
                } else {
                    setError("Failed to fetch product details: No common details found.");
                }
            } else {
                setError("Failed to fetch product details or data is malformed.");
            }
        } catch (err) {
            console.error("Error fetching product details:", err);
            setError("An error occurred while fetching product details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!productId) {
            setProductData(null);
            setCommonDetails(null);
            setVariantSpecificDetails([]);
            setSelectedVariant(null);
            setSelectedImage('');
            setError(null); // Clear error when no product is selected
            return;
        }
        fetchProductDetails();
    }, [productId]);

    // Determine the product details to display based on selectedVariant or commonDetails
    const product = selectedVariant || commonDetails;

    // Determine images to display
    let imagesToDisplay = [];
    if (selectedVariant) {
        imagesToDisplay = selectedVariant.imageUrls || [];
        if (selectedVariant.backImage && !imagesToDisplay.includes(selectedVariant.backImage)) {
            imagesToDisplay.push(selectedVariant.backImage);
        }
    } else if (commonDetails) {
        imagesToDisplay = commonDetails.imageUrls || [];
        if (commonDetails.backImage && !imagesToDisplay.includes(commonDetails.backImage)) {
            imagesToDisplay.push(commonDetails.backImage);
        }
    }


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 3, textAlign: "center", color: "error.main" }}>
                <Typography variant="h6">{error}</Typography>
                <Button variant="outlined" color="primary" onClick={fetchProductDetails} sx={{ mt: 2 }}>
                    Try Again
                </Button>
            </Box>
        );
    }

    if (!product) { // If neither commonDetails nor selectedVariant is available
        return (
            <Box sx={{ padding: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="h6">Please select an item to view its detailed information.</Typography>
            </Box>
        );
    }

    // Helper for rendering boolean values with icons
    const renderBooleanInfo = (label, value) => (
        <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 35 }}>
                {value ? <CheckCircleOutlineIcon color="success" /> : <CancelOutlinedIcon color="error" />}
            </ListItemIcon>
            <ListItemText primary={
                <Typography variant="body2">
                    <strong>{label}:</strong> {value ? 'Yes' : 'No'}
                </Typography>
            } />
        </ListItem>
    );

    const handleVariantChange = (event) => {
        const selectedVariantId = event.target.value;
        const variant = variantSpecificDetails.find(v => v.productVariantId === selectedVariantId);
        if (variant) {
            setSelectedVariant(variant);
            // Update selected image to the first image of the newly selected variant
            if (variant.imageUrls && variant.imageUrls.length > 0) {
                setSelectedImage(variant.imageUrls[0]);
            } else if (variant.backImage) {
                setSelectedImage(variant.backImage);
            } else {
                setSelectedImage('');
            }
        }
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
                {/* Left Column: Product Images and Additional Info */}
                <Grid item xs={12} md={5}>
                    <ProductImageContainer>
                        {selectedImage ? (
                            <MainProductImage src={selectedImage} alt={product.productName} />
                        ) : (
                            <Box sx={{
                                width: '100%',
                                maxWidth: 500,
                                height: 400,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'grey.200',
                                borderRadius: 8
                            }}>
                                <Typography variant="body2" color="textSecondary">No Image Available</Typography>
                            </Box>
                        )}

                        {/* Thumbnails */}
                        {imagesToDisplay.length > 0 ? (
                            <ThumbnailContainer>
                                {imagesToDisplay.map((url, index) => (
                                    <ThumbnailImage
                                        key={`img-${index}`}
                                        src={url}
                                        alt={`Product Image ${index + 1}`}
                                        isSelected={url === selectedImage}
                                        onClick={() => setSelectedImage(url)}
                                    />
                                ))}
                            </ThumbnailContainer>
                        ) : null}

                        {/* Policies & Availability */}
                        <Box sx={{ my: 2, width: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Policies & Availability</Typography>
                            <List dense>
                                {renderBooleanInfo("Returnable", commonDetails.returnable)}
                                {commonDetails.returnable && commonDetails.returnWindow && (
                                    <ListItem disableGutters sx={{ pl: 4 }}> {/* Indent return window if returnable */}
                                        <ListItemText primary={
                                            <Typography variant="body2" color="text.secondary">
                                                Return Window: {commonDetails.returnWindow}
                                            </Typography>
                                        } />
                                    </ListItem>
                                )}
                                {renderBooleanInfo("Cancellable", commonDetails.cancellable)}
                                {renderBooleanInfo("Available on COD", commonDetails.availableOnCod)}
                                {/* Displayed only if relevant, likely internal */}
                                {commonDetails.published !== undefined && (
                                    renderBooleanInfo("Published", commonDetails.published)
                                )}
                                {commonDetails.sellerPickupReturn !== undefined && (
                                    renderBooleanInfo("Seller Pickup Return", commonDetails.sellerPickupReturn)
                                )}
                            </List>
                        </Box>
                    </ProductImageContainer>
                </Grid>

                {/* Right Column: Product Details */}
                <Grid item xs={12} md={7}>
                    {/* Basic Info & Header */}
                    <Box sx={{ pb: 2 }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                            {commonDetails.productName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            {commonDetails.vegNonVeg && <Chip
                                label={commonDetails.vegNonVeg === "VEG" ? "Veg" : "Non-Veg"}
                                color={commonDetails.vegNonVeg === "VEG" ? "success" : "error"}
                                size="small"
                            />}
                            {commonDetails.fulfillmentOption && (
                                <Chip
                                    label={`Fulfillment: ${commonDetails.fulfillmentOption}`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Product Code:</strong> {commonDetails.productCode || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Category:</strong> {commonDetails.category || 'N/A'} - {commonDetails.subCategory || 'N/A'}
                        </Typography>

                        {variantSpecificDetails.length > 1 && (
                            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                <InputLabel id="variant-select-label">Select {productData?.variationOn || 'Variant'}</InputLabel>
                                <Select
                                    labelId="variant-select-label"
                                    value={selectedVariant?.productVariantId || ''}
                                    label={`Select ${productData?.variationOn || 'Variant'}`}
                                    onChange={handleVariantChange}
                                >
                                    {variantSpecificDetails.map((variant) => (
                                        <MenuItem key={variant.productVariantId} value={variant.productVariantId}>
                                            {variant.uomValue} {commonDetails.uom}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {/* Display variant-specific SKU or common SKU if no variants selected */}
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>SKU:</strong> {product.sku || 'N/A'}
                        </Typography>
                        {/* Display variant-specific UOM value, but common UOM unit */}
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Unit:</strong> {product.uomValue || 'N/A'} {commonDetails.uom || 'Unit'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Price and Availability (now reflecting selectedVariant) */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                            ₹{parseFloat(product.price).toFixed(2) || 'N/A'}
                            {product.sellingPrice && parseFloat(product.sellingPrice) > parseFloat(product.price) && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>
                                    ₹{parseFloat(product.sellingPrice).toFixed(2)}
                                </Typography>
                            )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inclusive of GST ({commonDetails.gstPercentage || 0}%)
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Available Quantity: {product.availableQty || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Min Qty: {commonDetails.minAllowedQty || 0}, Max Qty: {commonDetails.maxAllowedQty || 0}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Product Description */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Product Description</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {commonDetails.longDescription || commonDetails.description || 'No description available.'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Manufacturer & Packer Details */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Manufacturer & Packer Details</Typography>
                        <List dense>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufacturer:</strong> {commonDetails.manufacturerName || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufacturer Address:</strong> {commonDetails.manufacturerAddress || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufactured Date:</strong> {commonDetails.manufacturedDate || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Packer Name:</strong> {commonDetails.packerName || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufacturing/Packing/Import Date:</strong> {commonDetails.manufacturePackingImport || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Generic Name of Commodity:</strong> {commonDetails.genericNameOfCommodity || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                        </List>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Health & Regulatory Information */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Health & Regulatory Information</Typography>
                        <List dense>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Instructions:</strong> {commonDetails.instructions || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Nutritional Info:</strong> {commonDetails.nutritionalInfo || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Additives:</strong> {commonDetails.additiveInfo || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            {commonDetails.importerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Importer FSSAI License No:</strong> {formatFSSAINo(commonDetails.importerFssaiLicenseNo)}
                                        </Typography>
                                    } />
                                </ListItem>
                            )}
                            {commonDetails.brandOwnerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Brand Owner FSSAI License No:</strong> {formatFSSAINo(commonDetails.brandOwnerFssaiLicenseNo)}
                                        </Typography>
                                    } />
                                </ListItem>
                            )}
                            {commonDetails.otherOwnerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Other Owner FSSAI License No:</strong> {formatFSSAINo(commonDetails.otherOwnerFssaiLicenseNo)}
                                        </Typography>
                                    } />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewProductDetails;