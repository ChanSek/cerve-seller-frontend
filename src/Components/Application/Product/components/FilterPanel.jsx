import React from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormGroup,
    Paper,
    Typography
} from "@mui/material";
import {FilterList as FilterListIcon} from "@mui/icons-material";
import {GROCERY_SUB_CATEGORIES} from "../../../../utils/constants";

const FilterPanel = ({
    selectedSubCategories,
    selectedBrands,
    selectedCountries,
    brands,
    countries,
    loadingBrands,
    loadingCountries,
    onSubCategoryChange,
    onBrandChange,
    onCountryChange,
    onClearFilters
}) => {
    return (
        <Paper sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FilterListIcon color="primary" />
                    Filters
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onClearFilters}
                    disabled={selectedSubCategories.size === 0 && selectedBrands.size === 0 && selectedCountries.size === 0}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Clear Filters
                </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Category ({selectedSubCategories.size} selected)
                </Typography>
                <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <FormGroup>
                        {GROCERY_SUB_CATEGORIES.map((subCategory) => (
                            <FormControlLabel
                                key={subCategory}
                                control={
                                    <Checkbox
                                        checked={selectedSubCategories.has(subCategory)}
                                        onChange={(e) => onSubCategoryChange(subCategory, e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        {subCategory}
                                    </Typography>
                                }
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Brand Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Brand ({selectedBrands.size} selected)
                </Typography>
                <Box sx={{ minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}>
                    {loadingBrands ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '120px' }}>
                            <CircularProgress size={20} />
                        </Box>
                    ) : brands.length === 0 ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '120px' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                                No brands available
                            </Typography>
                        </Box>
                    ) : (
                        <FormGroup>
                            {brands.map((brand) => (
                                <FormControlLabel
                                    key={brand}
                                    control={
                                        <Checkbox
                                            checked={selectedBrands.has(brand)}
                                            onChange={(e) => onBrandChange(brand, e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {brand}
                                        </Typography>
                                    }
                                    sx={{ mb: 0.5 }}
                                />
                            ))}
                        </FormGroup>
                    )}
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Country Of Origin Filter */}
            <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Country of Origin ({selectedCountries.size} selected)
                </Typography>
                <Box sx={{ minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}>
                    {loadingCountries ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '120px' }}>
                            <CircularProgress size={20} />
                        </Box>
                    ) : countries.length === 0 ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '120px' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                                No countries available
                            </Typography>
                        </Box>
                    ) : (
                        <FormGroup>
                            {countries.map((country) => (
                                <FormControlLabel
                                    key={country}
                                    control={
                                        <Checkbox
                                            checked={selectedCountries.has(country)}
                                            onChange={(e) => onCountryChange(country, e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {country}
                                        </Typography>
                                    }
                                    sx={{ mb: 0.5 }}
                                />
                            ))}
                        </FormGroup>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default FilterPanel;