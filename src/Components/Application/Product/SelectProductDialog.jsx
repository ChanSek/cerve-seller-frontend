import React, {useCallback, useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {
    Close as CloseIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon,
    ShoppingCart as CartIcon
} from "@mui/icons-material";
import {getCall, postCall} from "../../../Api/axios";
import cogoToast from "cogo-toast";
import {generateSKU} from "../../Shared/SkuGenerator";
import {highlightText} from "../../../utils/textHighlight";
import {GST_OPTIONS, GROCERY_SUB_CATEGORIES} from "../../../utils/constants";


// Component for single variant products
const SingleProductCard = ({ product, searchText, isSelected, details, onProductSelect, onDetailChange }) => (
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

// Component for multi-variant products
const MultiVariantProductCard = ({ group, searchText, selectedProducts, productDetails, onProductSelect, onDetailChange }) => {
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

const SelectProductDialog = ({ storeId, category, open, onClose, refreshProducts }) => {
    const [masterProducts, setMasterProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [productDetails, setProductDetails] = useState({});
    // Filter state
    const [selectedSubCategories, setSelectedSubCategories] = useState(new Set());
    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [selectedCountries, setSelectedCountries] = useState(new Set());
    const [brands, setBrands] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingCountries, setLoadingCountries] = useState(false);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [pageLimit] = useState(20);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Group products by parent_id
    const groupProductsByParentId = useCallback((products) => {
        const grouped = {};
        
        products.forEach(product => {
            const parentId = product.parent_id || product.pid; // fallback to pid if parent_id doesn't exist
            if (!grouped[parentId]) {
                grouped[parentId] = [];
            }
            grouped[parentId].push(product);
        });

        // Convert to array format for easier rendering
        return Object.entries(grouped).map(([parentId, variants]) => ({
            parentId,
            variants,
            isSingleVariant: variants.length === 1,
            // Use first variant for common product info
            productName: variants[0].name,
            brand: variants[0].brand,
            thumbnailUrl: variants[0].thumbnailUrl,
            subCategory: variants[0].subCategory
        }));
    }, []);

    // Apply filters to master products (only for search results, not for API-filtered results)
    const applyFilters = useCallback((products) => {
        let filtered = [...products];
        
        // Skip filtering if we're using backend filtering (when any filters are selected and not searching)
        // The backend already filters by categories, brands, and countries when we call /api/v1/seller/product/master/list
        if ((selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0) && !searchText.trim()) {
            // Backend already filtered, no need to filter again
            return filtered;
        }
        
        // Apply subcategory filter only for search results or when no backend filtering
        if (selectedSubCategories.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedSubCategories.has(product.subCategory)
            );
        }
        
        // Apply brand filter only for search results or when no backend filtering
        if (selectedBrands.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedBrands.has(product.brand)
            );
        }
        
        // Apply country filter only for search results or when no backend filtering
        if (selectedCountries.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedCountries.has(product.countryOfOrigin)
            );
        }
        
        return filtered;
    }, [selectedSubCategories, selectedBrands, selectedCountries, searchText]);

    // Fetch brands from API
    const fetchBrands = useCallback(async () => {
        console.log('🚀 Starting fetchBrands API call...');
        setLoadingBrands(true);
        try {
            console.log('📡 Calling /api/v1/seller/product/master/brands');
            const result = await getCall('/api/v1/seller/product/master/brands');
            console.log('✅ fetchBrands response:', result);
            
            // Handle different possible response structures
            let brandList = [];
            if (result && Array.isArray(result)) {
                brandList = result;
            } else if (result && result.data && Array.isArray(result.data)) {
                brandList = result.data;
            } else if (result && typeof result === 'object') {
                // If result has brands property
                brandList = result.brands || [];
            }
            
            // Filter out empty/null brands and sort alphabetically
            const validBrands = brandList
                .filter(brand => brand && brand.trim() !== '')
                .sort((a, b) => a.localeCompare(b));
            
            console.log('📊 Processed brands:', validBrands.length, 'brands found');
            setBrands(validBrands);
        } catch (error) {
            console.error("❌ Error fetching brands:", error);
            console.error("❌ Error response:", error.response);
            console.error("❌ Error status:", error.response?.status);
            cogoToast.error("Failed to load brands");
            setBrands([]);
        } finally {
            setLoadingBrands(false);
            console.log('🏁 fetchBrands completed');
        }
    }, []);

    // Fetch countries from API
    const fetchCountries = useCallback(async () => {
        console.log('🚀 Starting fetchCountries API call...');
        setLoadingCountries(true);
        try {
            console.log('📡 Calling /api/v1/seller/product/master/countries');
            const result = await getCall('/api/v1/seller/product/master/countries');
            console.log('✅ fetchCountries response:', result);
            console.log('🔍 Response type:', typeof result);
            console.log('🔍 Response keys:', result ? Object.keys(result) : 'null/undefined');
            console.log('🔍 Is array?', Array.isArray(result));
            
            // Handle different possible response structures
            let countryList = [];
            if (result && Array.isArray(result)) {
                countryList = result;
            } else if (result && result.data && Array.isArray(result.data)) {
                countryList = result.data;
            } else if (result && typeof result === 'object') {
                // If result has countries property
                countryList = result.countries || [];
            }
            
            // Filter out empty/null countries and sort alphabetically
            const validCountries = countryList
                .filter(country => country && country.trim() !== '')
                .sort((a, b) => a.localeCompare(b));
            
            console.log('📊 Processed countries:', validCountries.length, 'countries found');
            console.log('📊 Sample countries:', validCountries.slice(0, 10));
            setCountries(validCountries);
        } catch (error) {
            console.error("❌ Error fetching countries:", error);
            console.error("❌ Error response object:", error.response);
            console.error("❌ Error status:", error.response?.status);
            console.error("❌ Error status text:", error.response?.statusText);
            console.error("❌ Error data:", error.response?.data);
            console.error("❌ Error headers:", error.response?.headers);
            console.error("❌ Error config:", error.config);
            console.error("❌ Error message:", error.message);
            console.error("❌ Error code:", error.code);
            
            // Detailed analysis of what the server actually returned
            if (error.response) {
                console.error("🔍 SERVER RESPONSE DETAILS:");
                console.error("🔍 Status Code:", error.response.status);
                console.error("🔍 Status Text:", error.response.statusText);
                console.error("🔍 Response Headers:", error.response.headers);
                console.error("🔍 Response Data:", error.response.data);
                console.error("🔍 Response Data Type:", typeof error.response.data);
                
                if (error.response.status === 401) {
                    console.error("🔍 This is a 401 Unauthorized - the endpoint requires authentication or user doesn't have access");
                } else if (error.response.status === 404) {
                    console.error("🔍 This is a 404 Not Found - the endpoint doesn't exist");
                } else if (error.response.status === 403) {
                    console.error("🔍 This is a 403 Forbidden - user doesn't have permission to access this endpoint");
                } else {
                    console.error(`🔍 Server responded with status ${error.response.status} - check what this means for the API`); 
                }
            } else {
                console.error("🔍 NO RESPONSE FROM SERVER - this might be a network issue or CORS problem");
                console.error("🔍 Network Error?", error.code === 'ERR_NETWORK');
                console.error("🔍 Timeout?", error.code === 'ECONNABORTED');
            }
            
            cogoToast.error("Failed to load countries");
            setCountries([]);
        } finally {
            setLoadingCountries(false);
            console.log('🏁 fetchCountries completed');
        }
    }, []);

    // Update filtered products whenever master products or filters change
    useEffect(() => {
        const filtered = applyFilters(masterProducts);
        setFilteredProducts(filtered);
    }, [masterProducts, applyFilters]);

    // Update grouped products whenever filtered products change
    useEffect(() => {
        console.log('Filtering products for grouping:', filteredProducts.length, 'products');
        console.log('Sample products:', filteredProducts.slice(0, 3));
        const grouped = groupProductsByParentId(filteredProducts);
        console.log('Grouped products:', grouped.length, 'groups');
        console.log('Sample groups:', grouped.slice(0, 2));
        setGroupedProducts(grouped);
    }, [filteredProducts, groupProductsByParentId]);

    // Fetch all master products for initial load (when dialog opens)
    const fetchAllMasterProducts = useCallback(async (page = 0, append = false) => {
        console.log('🚀 Starting fetchAllMasterProducts API call...', { page, append });
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        // Build URL with categories, brands, and countries arrays
        let url = `/api/v1/seller/product/master/list?page=${page}&limit=${pageLimit}`;
        
        // Add categories if any are selected, otherwise include all categories
        if (selectedSubCategories.size > 0) {
            const categoriesParam = Array.from(selectedSubCategories).join('|');
            url += `&categories=${encodeURIComponent(categoriesParam)}`;
        }
        
        // Add brands if any are selected
        if (selectedBrands.size > 0) {
            const brandsParam = Array.from(selectedBrands).join('|');
            url += `&brands=${encodeURIComponent(brandsParam)}`;
        }
        
        // Add countries if any are selected
        if (selectedCountries.size > 0) {
            const countriesParam = Array.from(selectedCountries).join('|');
            url += `&countries=${encodeURIComponent(countriesParam)}`;
        }
        
        try {
            console.log('📡 Calling fetchAllMasterProducts URL:', url);
            const result = await getCall(url);
            console.log('✅ fetchAllMasterProducts response:', result);
            
            // Handle different possible response structures
            let products = [];
            let hasMoreResults = false;
            
            if (result && typeof result === 'object') {
                // Check if result has data property (nested structure)
                if (result.data) {
                    const variantResult = result.data;
                    products = variantResult.results || variantResult || [];
                    hasMoreResults = variantResult.hasMoreResults || false;
                } 
                // Check if result is direct array
                else if (Array.isArray(result)) {
                    products = result;
                    hasMoreResults = result.length === pageLimit; // Assume more if we got full page
                }
                // Check if result has results directly
                else if (result.results) {
                    products = result.results;
                    hasMoreResults = result.hasMoreResults || false;
                }
                // If result is the products array directly
                else {
                    products = [result]; // Single product case
                    hasMoreResults = false;
                }
            }

            // Ensure products is an array
            if (!Array.isArray(products)) {
                products = [];
            }

            // Map products to expected format
            const mappedProducts = products.map(product => {
                const mapped = {
                    pid: product.pid || product.id,
                    name: product.productName || product.name,
                    brand: product.brand || "",
                    thumbnailUrl: product.thumbnailUrl || product.imageUrl,
                    mrp: product.mrp || 0,
                    uom: product.uom || "UNIT",
                    uomValue: product.uomValue || 1,
                    parent_id: product.parent_id || product.parentId, // Support both snake_case and camelCase
                    subCategory: product.subCategory || ""
                };
                console.log('Product data:', mapped.name, '→ parent_id:', mapped.parent_id, '→ pid:', mapped.pid);
                return mapped;
            });

            // Batch state updates to prevent flickering
            if (append && page > 0) {
                // Append to existing results for pagination
                setMasterProducts(prev => [...prev, ...mappedProducts]);
            } else {
                // Replace results for initial load
                setMasterProducts(mappedProducts);
            }

            // Update pagination state in single batch
            setCurrentPage(page);
            setHasMoreResults(hasMoreResults);
        } catch (error) {
            console.error("❌ Error fetching all master products:", error);
            console.error("❌ API URL was:", url);
            console.error("❌ Error response:", error.response);
            console.error("❌ Error status:", error.response?.status);
            console.error("❌ Error message:", error.message);
            console.error("❌ Full error object:", error);
            cogoToast.error(`Failed to load product catalog: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            console.log('🏁 fetchAllMasterProducts completed');
        }
    }, [selectedSubCategories, selectedBrands, selectedCountries, pageLimit]);

    // Fetch products using search endpoint (when user searches)
    const fetchSearchProducts = useCallback(async (page = 0, keyword = "", append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        // Build URL with search parameters
        let url = `/api/v1/seller/product/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${pageLimit}`;
        
        // Add categories if any are selected
        if (selectedSubCategories.size > 0) {
            const categoriesParam = Array.from(selectedSubCategories).join('|');
            url += `&categories=${encodeURIComponent(categoriesParam)}`;
        }
        
        // Add brands if any are selected
        if (selectedBrands.size > 0) {
            const brandsParam = Array.from(selectedBrands).join('|');
            url += `&brands=${encodeURIComponent(brandsParam)}`;
        }
        
        // Add countries if any are selected
        if (selectedCountries.size > 0) {
            const countriesParam = Array.from(selectedCountries).join('|');
            url += `&countries=${encodeURIComponent(countriesParam)}`;
        }
        
        try {
            const result = await getCall(url);
            // Handle SearchResult structure
            const searchResult = result.data || {};
            const rawProducts = searchResult.results || [];
            
            // Map search products to the same format as master products
            const mappedProducts = rawProducts.map(product => ({
                pid: product.pid || product.id,
                name: product.productName || product.name,
                brand: product.brand || "",
                thumbnailUrl: product.thumbnailUrl || product.imageUrl,
                mrp: product.mrp || 0,
                uom: product.uom || "UNIT",
                uomValue: product.uomValue || 1,
                parent_id: product.parent_id || product.parentId, // Support both snake_case and camelCase
                subCategory: product.subCategory || ""
            }));
            
            // Batch state updates to prevent flickering
            if (append && page > 0) {
                // Append to existing results for pagination
                setMasterProducts(prev => [...prev, ...mappedProducts]);
            } else {
                // Replace results for new search
                setMasterProducts(mappedProducts);
            }
            
            // Update pagination state in single batch
            setCurrentPage(page);
            setHasMoreResults(searchResult.hasMoreResults || false);
        } catch (error) {
            console.error("Error fetching search products:", error);
            cogoToast.error("Failed to search products");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedSubCategories, selectedBrands, selectedCountries, pageLimit]);

    // Handle subcategory filter changes
    const handleSubCategoryChange = (subCategory, checked) => {
        const newSelected = new Set(selectedSubCategories);
        if (checked) {
            newSelected.add(subCategory);
        } else {
            newSelected.delete(subCategory);
        }
        setSelectedSubCategories(newSelected);
    };

    // Handle brand filter changes
    const handleBrandChange = (brand, checked) => {
        const newSelected = new Set(selectedBrands);
        if (checked) {
            newSelected.add(brand);
        } else {
            newSelected.delete(brand);
        }
        setSelectedBrands(newSelected);
    };

    // Handle country filter changes
    const handleCountryChange = (country, checked) => {
        const newSelected = new Set(selectedCountries);
        if (checked) {
            newSelected.add(country);
        } else {
            newSelected.delete(country);
        }
        setSelectedCountries(newSelected);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSelectedSubCategories(new Set());
        setSelectedBrands(new Set());
        setSelectedCountries(new Set());
    };

    // Initialize component when opened
    useEffect(() => {
        console.log('🔄 Dialog initialization useEffect triggered, open =', open);
        if (open) {
            console.log('📋 Initializing dialog state...');
            setSelectedProducts(new Set());
            setProductDetails({});
            setSelectedSubCategories(new Set());
            setSelectedBrands(new Set());
            setSelectedCountries(new Set());
            setCurrentPage(0);
            setSearchText(""); // Reset search text
            
            console.log('🔄 Starting parallel API calls...');
            // Load brands and countries on dialog open
            fetchBrands();
            fetchCountries();
            
            // Load initial products and then mark as initialized
            fetchAllMasterProducts(0, false).then(() => {
                console.log('✅ fetchAllMasterProducts completed, setting initialized = true');
                setIsInitialized(true);
            }).catch((error) => {
                console.error('❌ fetchAllMasterProducts promise rejected:', error);
                setIsInitialized(true); // Set as initialized even if there's an error to allow filter changes
            });
        } else {
            console.log('📋 Dialog closed, resetting initialized state');
            setIsInitialized(false);
        }
    }, [open, fetchBrands, fetchCountries]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle search text changes with debouncing - but skip initial empty search
    useEffect(() => {
        if (!open || !isInitialized) return;
        
        // Skip the effect if this is the initial empty search text set during initialization
        if (searchText === "") return;
        
        const delayDebounce = setTimeout(() => {
            setCurrentPage(0);
            if (searchText.trim()) {
                // Use search endpoint when user types something
                fetchSearchProducts(0, searchText, false);
            } else {
                // Use master products endpoint when search is cleared
                fetchAllMasterProducts(0, false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchText, open, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle category and brand filter changes - trigger API call immediately
    useEffect(() => {
        if (!open || !isInitialized) return;
        
        // Reset to first page and fetch with new filters
        setCurrentPage(0);
        
        if (searchText.trim()) {
            // If user is currently searching, use search endpoint
            fetchSearchProducts(0, searchText, false);
        } else {
            // Use master products endpoint with filters (including when all filters are cleared)
            fetchAllMasterProducts(0, false);
        }
    }, [selectedSubCategories, selectedBrands, selectedCountries, open, isInitialized, searchText]); // eslint-disable-line react-hooks/exhaustive-deps

    // Infinite scroll handler with stable reference
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        
        // Check if user has scrolled to the bottom (with some buffer)
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            // Load more data if available and not already loading
            if (hasMoreResults && !loading && !loadingMore) {
                if (searchText.trim()) {
                    // Use search endpoint for pagination when searching
                    fetchSearchProducts(currentPage + 1, searchText, true);
                } else {
                    // Use master products endpoint for pagination when not searching
                    fetchAllMasterProducts(currentPage + 1, true);
                }
            }
        }
    }, [hasMoreResults, loading, loadingMore, currentPage, searchText]); // eslint-disable-line react-hooks/exhaustive-deps

    // Attach scroll listener to the scrollable container
    useEffect(() => {
        const scrollContainer = document.getElementById('product-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
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
            
            // Find the product and its parent
            const product = masterProducts.find(p => p.pid === productId);
            const parentId = product?.parent_id || productId;
            
            // Check if any sibling variants are already selected to inherit GST
            const siblingVariants = masterProducts.filter(p => (p.parent_id || p.pid) === parentId);
            const selectedSibling = siblingVariants.find(variant => 
                variant.pid !== productId && selectedProducts.has(variant.pid)
            );
            
            const inheritedGST = selectedSibling ? productDetails[selectedSibling.pid]?.gstPercentage || "" : "";
            
            // Initialize default values for new selection
            setProductDetails(prev => ({
                ...prev,
                [productId]: {
                    sellingPrice: "",
                    gstPercentage: inheritedGST, // Inherit GST from siblings or empty
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
        setProductDetails(prev => {
            const updated = { ...prev };
            
            // If changing GST, apply to all variants of the same parent
            if (field === 'gstPercentage') {
                const product = masterProducts.find(p => p.pid === productId);
                if (product) {
                    const parentId = product.parent_id || product.pid;
                    
                    // Find all variants of the same parent and update their GST
                    masterProducts.forEach(p => {
                        const pParentId = p.parent_id || p.pid;
                        if (pParentId === parentId && selectedProducts.has(p.pid)) {
                            updated[p.pid] = {
                                ...updated[p.pid],
                                [field]: value
                            };
                        }
                    });
                }
            } else {
                // For other fields, update only the specific product
                updated[productId] = {
                    ...updated[productId],
                    [field]: value
                };
            }
            
            return updated;
        });
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

            <DialogContent sx={{ pb: 0, height: '70vh', overflow: 'hidden' }}>
                <Grid container spacing={3} sx={{ height: '100%' }}>
                    {/* Left Filter Section */}
                    <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                        <Paper sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <FilterListIcon color="primary" />
                                    Filters
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleClearFilters}
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
                                                        onChange={(e) => handleSubCategoryChange(subCategory, e.target.checked)}
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
                                                            onChange={(e) => handleBrandChange(brand, e.target.checked)}
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
                                                            onChange={(e) => handleCountryChange(country, e.target.checked)}
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
                    </Grid>
                    
                    {/* Right Content Section */}
                    <Grid item xs={12} md={9} sx={{ pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                                onDelete={() => handleSubCategoryChange(category, false)}
                                            />
                                        ))}
                                        {Array.from(selectedBrands).map((brand) => (
                                            <Chip
                                                key={`brand-${brand}`}
                                                label={brand}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onDelete={() => handleBrandChange(brand, false)}
                                            />
                                        ))}
                                        {Array.from(selectedCountries).map((country) => (
                                            <Chip
                                                key={`country-${country}`}
                                                label={country}
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                onDelete={() => handleCountryChange(country, false)}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4} sx={{ flex: 1 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
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
                                                onClick={handleClearFilters}
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
                                                        onProductSelect={handleProductSelect}
                                                        onDetailChange={handleDetailChange}
                                                    />
                                                ) : (
                                                    <MultiVariantProductCard 
                                                        group={group}
                                                        searchText={searchText}
                                                        selectedProducts={selectedProducts}
                                                        productDetails={productDetails}
                                                        onProductSelect={handleProductSelect}
                                                        onDetailChange={handleDetailChange}
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
                        )}
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