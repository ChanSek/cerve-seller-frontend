import React from "react";
import {
    Box,
    Chip,
    Grid,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";

const SearchControls = ({
    searchText,
    setSearchText,
    filteredProducts,
    selectedSubCategories,
    selectedBrands,
    selectedCountries,
    onSubCategoryChange,
    onBrandChange,
    onCountryChange,
    onClearFilters
}) => {
    return (
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
                </Grid>
            </Grid>
            
            {/* Filter Summary */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                    {filteredProducts.length} products found
                    {selectedSubCategories.size > 0 && (
                        <span> • {selectedSubCategories.size} category filter(s) active</span>
                    )}
                    {selectedBrands.size > 0 && (
                        <span> • {selectedBrands.size} brand filter(s) active</span>
                    )}
                    {selectedCountries.size > 0 && (
                        <span> • {selectedCountries.size} country filter(s) active</span>
                    )}
                </Typography>
                {(selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0) && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Array.from(selectedSubCategories).map((category) => (
                            <Chip
                                key={`category-${category}`}
                                label={category}
                                size="small"
                                variant="outlined"
                                color="primary"
                                onDelete={() => onSubCategoryChange(category, false)}
                            />
                        ))}
                        {Array.from(selectedBrands).map((brand) => (
                            <Chip
                                key={`brand-${brand}`}
                                label={brand}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onDelete={() => onBrandChange(brand, false)}
                            />
                        ))}
                        {Array.from(selectedCountries).map((country) => (
                            <Chip
                                key={`country-${country}`}
                                label={country}
                                size="small"
                                variant="outlined"
                                color="success"
                                onDelete={() => onCountryChange(country, false)}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default SearchControls;