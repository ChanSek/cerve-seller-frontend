import {useCallback, useState} from "react";
import {getCall} from "../../../../Api/axios";
import cogoToast from "cogo-toast";

export const useProductFilters = () => {
    const [selectedSubCategories, setSelectedSubCategories] = useState(new Set());
    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [selectedCountries, setSelectedCountries] = useState(new Set());
    const [brands, setBrands] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingCountries, setLoadingCountries] = useState(false);

    // Fetch brands from API
    const fetchBrands = useCallback(async () => {
        console.log('🚀 Starting fetchBrands API call...');
        setLoadingBrands(true);
        try {
            console.log('📡 Calling /api/v1/seller/product/master/brands');
            const result = await getCall('/api/v1/seller/product/master/brands');
            console.log('✅ fetchBrands response:', result);
            
            let brandList = [];
            if (result && Array.isArray(result)) {
                brandList = result;
            } else if (result && result.data && Array.isArray(result.data)) {
                brandList = result.data;
            } else if (result && typeof result === 'object') {
                brandList = result.brands || [];
            }
            
            const validBrands = brandList
                .filter(brand => brand && brand.trim() !== '')
                .sort((a, b) => a.localeCompare(b));
            
            console.log('📊 Processed brands:', validBrands.length, 'brands found');
            setBrands(validBrands);
        } catch (error) {
            console.error("❌ Error fetching brands:", error);
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
            
            let countryList = [];
            if (result && Array.isArray(result)) {
                countryList = result;
            } else if (result && result.data && Array.isArray(result.data)) {
                countryList = result.data;
            } else if (result && typeof result === 'object') {
                countryList = result.countries || [];
            }
            
            const validCountries = countryList
                .filter(country => country && country.trim() !== '')
                .sort((a, b) => a.localeCompare(b));
            
            console.log('📊 Processed countries:', validCountries.length, 'countries found');
            setCountries(validCountries);
        } catch (error) {
            console.error("❌ Error fetching countries:", error);
            cogoToast.error("Failed to load countries");
            setCountries([]);
        } finally {
            setLoadingCountries(false);
            console.log('🏁 fetchCountries completed');
        }
    }, []);

    // Handle subcategory filter changes
    const handleSubCategoryChange = useCallback((subCategory, checked) => {
        const newSelected = new Set(selectedSubCategories);
        if (checked) {
            newSelected.add(subCategory);
        } else {
            newSelected.delete(subCategory);
        }
        setSelectedSubCategories(newSelected);
    }, [selectedSubCategories]);

    // Handle brand filter changes
    const handleBrandChange = useCallback((brand, checked) => {
        const newSelected = new Set(selectedBrands);
        if (checked) {
            newSelected.add(brand);
        } else {
            newSelected.delete(brand);
        }
        setSelectedBrands(newSelected);
    }, [selectedBrands]);

    // Handle country filter changes
    const handleCountryChange = useCallback((country, checked) => {
        const newSelected = new Set(selectedCountries);
        if (checked) {
            newSelected.add(country);
        } else {
            newSelected.delete(country);
        }
        setSelectedCountries(newSelected);
    }, [selectedCountries]);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        setSelectedSubCategories(new Set());
        setSelectedBrands(new Set());
        setSelectedCountries(new Set());
    }, []);

    // Reset filters
    const resetFilters = useCallback(() => {
        setSelectedSubCategories(new Set());
        setSelectedBrands(new Set());
        setSelectedCountries(new Set());
    }, []);

    return {
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
    };
};