import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Checkbox,
    Grid,
    Card,
    CardContent,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    Chip,
    Divider,
    Paper
} from "@mui/material";
import {
    Close as CloseIcon,
    Search as SearchIcon,
    SelectAll as SelectAllIcon,
    ClearAll as ClearAllIcon,
    ShoppingCart as CartIcon
} from "@mui/icons-material";
import { getCall, postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { generateSKU } from "../../Shared/SkuGenerator";

const GST_OPTIONS = [
    { value: 0, label: "0%" },
    { value: 5, label: "5%" },
    { value: 12, label: "12%" },
    { value: 18, label: "18%" },
    { value: 28, label: "28%" }
];

const SelectProductDialog = ({ storeId, category, open, onClose, refreshProducts }) => {
    const [masterProducts, setMasterProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [productDetails, setProductDetails] = useState({});
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [pageLimit] = useState(20);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch master products using search endpoint with pagination
    const fetchMasterProducts = useCallback(async (page = 0, keyword = "", append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        try {
            // Use the same endpoint as AddProductDialog for product search with pagination
            const url = `/api/v1/seller/product/search?category=${category}&keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${pageLimit}`;
            const result = await getCall(url);
            // Handle new SearchResult structure
            const searchResult = result.data || {};
            const products = searchResult.results || [];
            
            if (append && page > 0) {
                // Append to existing results for pagination
                setMasterProducts(prev => [...prev, ...products]);
                setFilteredProducts(prev => [...prev, ...products]);
            } else {
                // Replace results for new search
                setMasterProducts(products);
                setFilteredProducts(products);
            }
            
            // Update pagination state
            setCurrentPage(page);
            setTotalCount(searchResult.totalCount || 0);
            setHasMoreResults(searchResult.hasMoreResults || false);
        } catch (error) {
            console.error("Error fetching master products:", error);
            cogoToast.error("Failed to load product catalog");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [category, pageLimit]);

    // Initialize component when opened
    useEffect(() => {
        if (open) {
            setSelectedProducts(new Set());
            setProductDetails({});
            setSearchText("");
            setCurrentPage(0);
            fetchMasterProducts(0, "", false);
        }
    }, [open, fetchMasterProducts]);

    // Filter products based on search
    // Handle search text changes with debouncing
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            // Reset pagination and fetch new results for new search
            setCurrentPage(0);
            fetchMasterProducts(0, searchText, false);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchText, fetchMasterProducts]);

    // Infinite scroll handler
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        
        // Check if user has scrolled to the bottom (with some buffer)
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            // Load more data if available and not already loading
            if (hasMoreResults && !loading && !loadingMore) {
                fetchMasterProducts(currentPage + 1, searchText, true);
            }
        }
    }, [hasMoreResults, loading, loadingMore, currentPage, searchText, fetchMasterProducts]);

    // Attach scroll listener to the scrollable container
    useEffect(() => {
        const scrollContainer = document.getElementById('product-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll]);

    // Handle product selection
    const handleProductSelect = (productId, checked) => {
        const newSelected = new Set(selectedProducts);
        
        if (checked) {
            newSelected.add(productId);
            // Initialize default values for new selection
            setProductDetails(prev => ({
                ...prev,
                [productId]: {
                    sellingPrice: "",
                    gstPercentage: "", // No default GST - user must select
                    ...prev[productId]
                }
            }));
        } else {
            newSelected.delete(productId);
            setProductDetails(prev => {
                const { [productId]: removed, ...rest } = prev;
                return rest;
            });
        }
        
        setSelectedProducts(newSelected);
    };

    // Handle detail changes for selected products
    const handleDetailChange = (productId, field, value) => {
        setProductDetails(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value
            }
        }));
    };

    // Select all visible products
    const handleSelectAll = () => {
        const newSelected = new Set(selectedProducts);
        const newDetails = { ...productDetails };

        filteredProducts.forEach(product => {
            newSelected.add(product.pid);
            if (!newDetails[product.pid]) {
                newDetails[product.pid] = {
                    sellingPrice: "",
                    gstPercentage: ""
                };
            }
        });

        setSelectedProducts(newSelected);
        setProductDetails(newDetails);
    };

    // Clear all selections
    const handleClearAll = () => {
        setSelectedProducts(new Set());
        setProductDetails({});
    };

    // Validate and submit selected products
    const handleSubmit = async () => {
        if (selectedProducts.size === 0) {
            cogoToast.error("Please select at least one product");
            return;
        }

        // Validate that all selected products have required details
        const missingDetails = [];
        selectedProducts.forEach(productId => {
            const details = productDetails[productId];
            const product = masterProducts.find(p => p.pid === productId);
            const productName = product?.name || productId;
            
            if (!details?.sellingPrice || details.sellingPrice <= 0) {
                missingDetails.push(`${productName}: Selling Price`);
            }
            if (details?.gstPercentage === "" || details?.gstPercentage === undefined) {
                missingDetails.push(`${productName}: GST Percentage`);
            }
        });

        if (missingDetails.length > 0) {
            cogoToast.error(`Missing required details: ${missingDetails.join(", ")}`);
            return;
        }

        setSubmitting(true);
        try {
            const productsToAdd = [];

            for (const productId of selectedProducts) {
                const masterProduct = masterProducts.find(p => p.pid === productId);
                const details = productDetails[productId];

                if (!masterProduct) continue;

                // Prepare product payload based on master product data
                const productPayload = {
                    commonDetails: {
                        productName: masterProduct.name,
                        brand: masterProduct.brand || "",
                        mrp: masterProduct.mrp || 0,
                        price: parseFloat(details.sellingPrice),
                        gstPercentage: details.gstPercentage,
                        availableQty: 10, // Default quantity
                        uom: masterProduct.uom || "UNIT",
                        uomValue: masterProduct.uomValue || 1,
                        subCategory: masterProduct.subCategory || "",
                        imageUrls: masterProduct.thumbnailUrl ? [masterProduct.thumbnailUrl] : [],
                        sku: generateSKU("RET", masterProduct.subCategory || "DEFAULT", masterProduct.name),
                        fulfillmentOption: "Delivery",
                        // Additional fields that might be required
                        additiveInfo: "Refer to the product image.",
                        instructions: "Refer to the product image.",
                        nutritionalInfo: "Refer to the product image.",
                        manufacturerName: masterProduct.manufacturer || "Refer to the product image.",
                        manufacturerAddress: "Refer to the product image.",
                        ingredientsInfo: "Refer to the product image."
                    },
                    variationOn: "NONE",
                    variantSpecificDetails: undefined,
                    variationAttributes: ""
                };

                productsToAdd.push(productPayload);
            }

            // Submit products one by one (or implement batch API if available)
            let successCount = 0;
            let errorCount = 0;

            for (const product of productsToAdd) {
                try {
                    const res = await postCall(`/api/v1/seller/storeId/${storeId}/product`, product);
                    if (res.status === 200) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    errorCount++;
                    console.error("Error adding product:", error);
                }
            }

            if (successCount > 0) {
                cogoToast.success(`Successfully added ${successCount} product(s)`);
                refreshProducts?.();
            }

            if (errorCount > 0) {
                cogoToast.error(`Failed to add ${errorCount} product(s)`);
            }

            if (successCount > 0) {
                onClose();
            }

        } catch (error) {
            cogoToast.error("Failed to add products");
            console.error("Submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedCount = selectedProducts.size;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" sx={{ color: 'primary.main' }}>
                        Select Products to Add
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Search and Controls */}
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search products by name or brand"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<SelectAllIcon />}
                                    onClick={handleSelectAll}
                                    disabled={filteredProducts.length === 0}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ClearAllIcon />}
                                    onClick={handleClearAll}
                                    disabled={selectedCount === 0}
                                >
                                    Clear All
                                </Button>
                                <Chip
                                    icon={<CartIcon />}
                                    label={`${selectedCount} Selected`}
                                    color={selectedCount > 0 ? "primary" : "default"}
                                    variant={selectedCount > 0 ? "filled" : "outlined"}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {totalCount > 0 ? `${filteredProducts.length} of ${totalCount} products` : 'No products found'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box 
                        id="product-scroll-container"
                        sx={{ maxHeight: '60vh', overflowY: 'auto' }}
                    >
                        {filteredProducts.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="textSecondary">
                                    No products found
                                </Typography>
                            </Paper>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredProducts.map((product) => {
                                    const isSelected = selectedProducts.has(product.pid);
                                    const details = productDetails[product.pid] || {};

                                    return (
                                        <Grid item xs={12} key={product.pid}>
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
                                                                    onChange={(e) => handleProductSelect(product.pid, e.target.checked)}
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
                                                                        {product.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        Brand: {product.brand || "N/A"}
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
                                                                    onChange={(e) => handleDetailChange(product.pid, "sellingPrice", e.target.value)}
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
                                                                        onChange={(e) => handleDetailChange(product.pid, "gstPercentage", e.target.value)}
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
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                        
                        {/* Loading indicator for infinite scroll */}
                        {loadingMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                                <CircularProgress size={24} />
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                    Loading more products...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                        {selectedCount} product(s) selected
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Button 
                            onClick={onClose} 
                            disabled={submitting}
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit} 
                            disabled={submitting || selectedCount === 0}
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CartIcon />}
                        >
                            {submitting ? "Adding Products..." : `Add ${selectedCount} Product(s)`}
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default SelectProductDialog;