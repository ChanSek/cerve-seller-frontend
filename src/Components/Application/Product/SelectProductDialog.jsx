import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import {
    Close as CloseIcon,
    ShoppingCart as CartIcon
} from "@mui/icons-material";
import {postCall} from "../../../Api/axios";
import cogoToast from "cogo-toast";
import {generateSKU} from "../../Shared/SkuGenerator";
import FilterPanel from "./components/FilterPanel";
import SearchControls from "./components/SearchControls";
import ProductList from "./components/ProductList";
import {useProductData} from "./hooks/useProductData";
import {useProductFilters} from "./hooks/useProductFilters";
import {useProductSelection} from "./hooks/useProductSelection";

const SelectProductDialog = ({ storeId, category, open, onClose, refreshProducts }) => {
    const [submitting, setSubmitting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const scrollTimeoutRef = useRef(null);
    const initialLoadRef = useRef(true);

    // Custom hooks for data management
    const {
        masterProducts,
        filteredProducts,
        groupedProducts,
        loading,
        loadingMore,
        currentPage,
        hasMoreResults,
        isInitialized,
        setIsInitialized,
        setCurrentPage,
        fetchAllMasterProducts,
        fetchSearchProducts,
        updateFilteredProducts
    } = useProductData(category);

    const {
        selectedSubCategories,
        selectedBrands,
        selectedCountries,
        brands,
        countries,
        loadingBrands,
        loadingCountries,
        fetchBrands,
        fetchCountries,
        handleSubCategoryChange,
        handleBrandChange,
        handleCountryChange,
        handleClearFilters,
        resetFilters
    } = useProductFilters();

    const {
        selectedProducts,
        productDetails,
        handleProductSelect,
        handleDetailChange,
        resetSelection
    } = useProductSelection(masterProducts);

    // Initialize component when opened
    useEffect(() => {
        if (open) {
            resetSelection();
            resetFilters();
            setCurrentPage(0);
            setSearchText("");
            initialLoadRef.current = true;
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
            }

            fetchBrands();
            fetchCountries();

            fetchAllMasterProducts(0, false, selectedSubCategories, selectedBrands, selectedCountries).then(() => {
                console.log('✅ fetchAllMasterProducts completed, setting initialized = true');
                setIsInitialized(true);
            }).catch((error) => {
                console.error('❌ fetchAllMasterProducts promise rejected:', error);
                setIsInitialized(true);
            });
        } else {
            setIsInitialized(false);
        }
    }, [open]);

    // Update filtered products when filters change
    useEffect(() => {
        updateFilteredProducts(selectedSubCategories, selectedBrands, selectedCountries, searchText);
    }, [updateFilteredProducts, selectedSubCategories, selectedBrands, selectedCountries, searchText]);

    // Handle search text changes with debouncing and filter changes
    const handleFiltersChange = useCallback((skipInitialCheck = false) => {
        if (!open || !isInitialized) return;

        // Skip if this is the initial load (no search text and no filters selected)
        // But allow if skipInitialCheck is true (for clearing filters)
        const hasFilters = selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0;
        const hasSearchText = searchText.trim().length > 0;
        
        if (!skipInitialCheck && !hasFilters && !hasSearchText) {
            return; // Skip during initial load when no filters or search text
        }

        
        // Clear any pending scroll timeout to prevent multiple API calls
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }
        
        // Reset scroll position to top
        const scrollContainer = document.getElementById('product-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
        
        setCurrentPage(0);
        if (searchText.trim() && searchText.length >= 3) {
            fetchSearchProducts(0, searchText, false, selectedSubCategories, selectedBrands, selectedCountries);
        } else {
            fetchAllMasterProducts(0, false, selectedSubCategories, selectedBrands, selectedCountries);
        }
    }, [open, isInitialized, selectedSubCategories, selectedBrands, selectedCountries, searchText, fetchSearchProducts, fetchAllMasterProducts, setCurrentPage]);

    useEffect(() => {
        if (!open || !isInitialized) return;

        const hasFilters = selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0;
        const hasSearchText = searchText.trim().length > 0;
        
        // Skip if this is the very first load after dialog opens (initial API call already made)
        if (initialLoadRef.current && !hasFilters && !hasSearchText) {
            initialLoadRef.current = false;
            return;
        }
        
        initialLoadRef.current = false;

        // Only use debounce for searchText changes, not filter changes
        const isSearchTextChange = searchText !== "";
        const delay = isSearchTextChange ? 500 : 0;

        const delayDebounce = setTimeout(() => {
            handleFiltersChange(true); // skipInitialCheck = true
        }, delay);

        return () => clearTimeout(delayDebounce);
    }, [searchText, selectedSubCategories, selectedBrands, selectedCountries, open, isInitialized, handleFiltersChange]);

    // Attach scroll listener to the scrollable container
    useEffect(() => {
        const scrollContainer = document.getElementById('product-scroll-container');
        if (!scrollContainer) return;
        
        const scrollHandler = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;

            if (scrollHeight - scrollTop <= clientHeight + 100) {
                if (hasMoreResults && !loading && !loadingMore) {
                    // Clear any existing timeout
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                    
                    // Debounce the API call
                    scrollTimeoutRef.current = setTimeout(() => {
                        if (searchText.trim() && searchText.length >= 3) {
                            fetchSearchProducts(currentPage + 1, searchText, true, selectedSubCategories, selectedBrands, selectedCountries);
                        } else {
                            fetchAllMasterProducts(currentPage + 1, true, selectedSubCategories, selectedBrands, selectedCountries);
                        }
                        scrollTimeoutRef.current = null;
                    }, 300);
                }
            }
        };
        
        scrollContainer.addEventListener('scroll', scrollHandler, { passive: true });
        return () => {
            scrollContainer.removeEventListener('scroll', scrollHandler);
            // Clear timeout when effect cleans up
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
            }
        };
    }, [hasMoreResults, loading, currentPage, searchText, selectedSubCategories, selectedBrands, selectedCountries]); // eslint-disable-line react-hooks/exhaustive-deps

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

            <DialogContent sx={{ pb: 0, height: '70vh', overflow: 'hidden' }}>
                <Grid container spacing={3} sx={{ height: '100%' }}>
                    {/* Left Filter Section */}
                    <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                        <FilterPanel
                            selectedSubCategories={selectedSubCategories}
                            selectedBrands={selectedBrands}
                            selectedCountries={selectedCountries}
                            brands={brands}
                            countries={countries}
                            loadingBrands={loadingBrands}
                            loadingCountries={loadingCountries}
                            onSubCategoryChange={handleSubCategoryChange}
                            onBrandChange={handleBrandChange}
                            onCountryChange={handleCountryChange}
                            onClearFilters={handleClearFilters}
                        />
                    </Grid>
                    
                    {/* Right Content Section */}
                    <Grid item xs={12} md={9} sx={{ pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <SearchControls
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filteredProducts={filteredProducts}
                            selectedSubCategories={selectedSubCategories}
                            selectedBrands={selectedBrands}
                            selectedCountries={selectedCountries}
                            onSubCategoryChange={handleSubCategoryChange}
                            onBrandChange={handleBrandChange}
                            onCountryChange={handleCountryChange}
                            onClearFilters={handleClearFilters}
                        />

                        <ProductList
                            loading={loading}
                            filteredProducts={filteredProducts}
                            groupedProducts={groupedProducts}
                            selectedProducts={selectedProducts}
                            productDetails={productDetails}
                            selectedSubCategories={selectedSubCategories}
                            selectedBrands={selectedBrands}
                            selectedCountries={selectedCountries}
                            searchText={searchText}
                            loadingMore={loadingMore}
                            onProductSelect={handleProductSelect}
                            onDetailChange={handleDetailChange}
                            onClearFilters={handleClearFilters}
                        />
                    </Grid>
                </Grid>
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