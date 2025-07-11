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
const ViewProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCall(`/api/v1/seller/itemId/${productId}/product`);
            console.log("Product details response: ", response);
            if (response?.status === 200 && response?.data?.commonDetails) {
                setProduct(response.data.commonDetails);
                // Prioritize imageUrls for gallery, then backImage if no imageUrls
                if (response.data.commonDetails.imageUrls && response.data.commonDetails.imageUrls.length > 0) {
                    setSelectedImage(response.data.commonDetails.imageUrls[0]);
                } else if (response.data.commonDetails.backImage) {
                    setSelectedImage(response.data.commonDetails.backImage);
                } else {
                    setSelectedImage('');
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
            setProduct(null);
            setSelectedImage('');
            setError(null); // Clear error when no product is selected
            return;
        }
        fetchProductDetails();
    }, [productId]);

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

    if (!product) {
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
                        {(product.imageUrls && product.imageUrls.length > 0) || product.backImage ? (
                            <ThumbnailContainer>
                                {/* Display imageUrls first */}
                                {product.imageUrls && product.imageUrls.map((url, index) => (
                                    <ThumbnailImage
                                        key={`img-${index}`}
                                        src={url}
                                        alt={`Product Image ${index + 1}`}
                                        isSelected={url === selectedImage}
                                        onClick={() => setSelectedImage(url)}
                                    />
                                ))}
                                {/* Display backImage */}
                                {product.backImage && !product.imageUrls?.includes(product.backImage) && (
                                    <ThumbnailImage
                                        key="back-img"
                                        src={product.backImage}
                                        alt="Back View"
                                        isSelected={product.backImage === selectedImage}
                                        onClick={() => setSelectedImage(product.backImage)}
                                    />
                                )}
                            </ThumbnailContainer>
                        ) : null}

                        {/* Additional Info Section
                        <Box sx={{ mt: 3, width: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Additional Info
                            </Typography>
                            <List dense>
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Manufacturer:</strong> {product.manufacturerName || 'N/A'}
                                        </Typography>
                                    } />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>FSSAI License:</strong> {formatFSSAINo(product.importerFssaiLicenseNo) || 'N/A'}
                                        </Typography>
                                    } />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Returnable:</strong> {product.returnable ? 'Yes' : 'No'}
                                        </Typography>
                                    } />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Cancellable:</strong> {product.cancellable ? 'Yes' : 'No'}
                                        </Typography>
                                    } />
                                </ListItem>
                            </List>
                        </Box> */}

                        {/* Policies & Availability */}
                        <Box sx={{ my: 2, width: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Policies & Availability</Typography>
                            <List dense>
                                {renderBooleanInfo("Returnable", product.returnable)}
                                {product.returnable && product.returnWindow && (
                                    <ListItem disableGutters sx={{ pl: 4 }}> {/* Indent return window if returnable */}
                                        <ListItemText primary={
                                            <Typography variant="body2" color="text.secondary">
                                                Return Window: {product.returnWindow}
                                            </Typography>
                                        } />
                                    </ListItem>
                                )}
                                {renderBooleanInfo("Cancellable", product.cancellable)}
                                {renderBooleanInfo("Available on COD", product.availableOnCod)}
                                {/* Displayed only if relevant, likely internal */}
                                {product.published !== undefined && (
                                    renderBooleanInfo("Published", product.published)
                                )}
                                {product.sellerPickupReturn !== undefined && (
                                    renderBooleanInfo("Seller Pickup Return", product.sellerPickupReturn)
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
                            {product.productName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                                label={product.vegNonVeg === "VEG" ? "Veg" : "Non-Veg"}
                                color={product.vegNonVeg === "VEG" ? "success" : "error"}
                                size="small"
                            />
                            {product.fulfillmentOption && (
                                <Chip
                                    label={`Fulfillment: ${product.fulfillmentOption}`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>SKU:</strong> {product.sku || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Product Code:</strong> {product.productCode || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Category:</strong> {product.category || 'N/A'} - {product.subCategory || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                            <strong>Unit:</strong> {product.uomValue || 'N/A'} {product.uom || 'Unit'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Price and Availability */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                            ₹{parseFloat(product.price).toFixed(2) || 'N/A'}
                            {product.purchasePrice && parseFloat(product.purchasePrice) > parseFloat(product.price) && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>
                                    ₹{parseFloat(product.purchasePrice).toFixed(2)}
                                </Typography>
                            )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inclusive of GST ({product.gstPercentage || 0}%)
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Available Quantity: {product.availableQty || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Min Qty: {product.minAllowedQty || 0}, Max Qty: {product.maxAllowedQty || 0}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Product Description */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Product Description</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {product.longDescription || product.description || 'No description available.'}
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
                                        <strong>Manufacturer:</strong> {product.manufacturerName || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufacturer Address:</strong> {product.manufacturerAddress || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufactured Date:</strong> {product.manufacturedDate || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Packer Name:</strong> {product.packerName || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Manufacturing/Packing/Import Date:</strong> {product.manufacturePackingImport || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Generic Name of Commodity:</strong> {product.genericNameOfCommodity || 'N/A'}
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
                                        <strong>Instructions:</strong> {product.instructions || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Nutritional Info:</strong> {product.nutritionalInfo || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={
                                    <Typography variant="body2">
                                        <strong>Additives:</strong> {product.additiveInfo || 'N/A'}
                                    </Typography>
                                } />
                            </ListItem>
                            {product.importerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Importer FSSAI License No:</strong> {formatFSSAINo(product.importerFssaiLicenseNo)}
                                        </Typography>
                                    } />
                                </ListItem>
                            )}
                            {product.brandOwnerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Brand Owner FSSAI License No:</strong> {formatFSSAINo(product.brandOwnerFssaiLicenseNo)}
                                        </Typography>
                                    } />
                                </ListItem>
                            )}
                            {product.otherOwnerFssaiLicenseNo && (
                                <ListItem disableGutters>
                                    <ListItemText primary={
                                        <Typography variant="body2">
                                            <strong>Other Owner FSSAI License No:</strong> {formatFSSAINo(product.otherOwnerFssaiLicenseNo)}
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