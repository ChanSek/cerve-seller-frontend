import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import SingleProductCard from "./SingleProductCard";
import MultiVariantProductCard from "./MultiVariantProductCard";

const ProductList = ({
    loading,
    filteredProducts,
    groupedProducts,
    selectedProducts,
    productDetails,
    selectedSubCategories,
    selectedBrands,
    selectedCountries,
    searchText,
    loadingMore,
    onProductSelect,
    onDetailChange,
    onClearFilters
}) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4} sx={{ flex: 1 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            id="product-scroll-container"
            sx={{ 
                flex: 1,
                overflowY: 'auto',
                mb: 2
            }}
        >
            {filteredProducts.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {(selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0) ? 'No products match your filters' : 'No products found'}
                    </Typography>
                    {(selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0) && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onClearFilters}
                            sx={{ mt: 2 }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {groupedProducts.map((group) => (
                        <Grid item xs={12} key={group.parentId}>
                            {group.isSingleVariant ? (
                                <SingleProductCard 
                                    product={group.variants[0]}
                                    searchText={searchText}
                                    isSelected={selectedProducts.has(group.variants[0].pid)}
                                    details={productDetails[group.variants[0].pid] || {}}
                                    onProductSelect={onProductSelect}
                                    onDetailChange={onDetailChange}
                                />
                            ) : (
                                <MultiVariantProductCard 
                                    group={group}
                                    searchText={searchText}
                                    selectedProducts={selectedProducts}
                                    productDetails={productDetails}
                                    onProductSelect={onProductSelect}
                                    onDetailChange={onDetailChange}
                                />
                            )}
                        </Grid>
                    ))}
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
    );
};

export default ProductList;