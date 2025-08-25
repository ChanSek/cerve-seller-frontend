import {useCallback, useEffect, useState} from "react";
import {getCall} from "../../../../Api/axios";
import cogoToast from "cogo-toast";

export const useProductData = () => {
    const [masterProducts, setMasterProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [pageLimit] = useState(20);
    const [isInitialized, setIsInitialized] = useState(false);

    // Group products by parent_id
    const groupProductsByParentId = useCallback((products) => {
        const grouped = {};
        
        products.forEach(product => {
            const parentId = product.parent_id || product.pid;
            if (!grouped[parentId]) {
                grouped[parentId] = [];
            }
            grouped[parentId].push(product);
        });

        return Object.entries(grouped).map(([parentId, variants]) => ({
            parentId,
            variants,
            isSingleVariant: variants.length === 1,
            productName: variants[0].name,
            brand: variants[0].brand,
            thumbnailUrl: variants[0].thumbnailUrl,
            subCategory: variants[0].subCategory
        }));
    }, []);

    // Apply filters to master products
    const applyFilters = useCallback((products, selectedSubCategories, selectedBrands, selectedCountries, searchText) => {
        let filtered = [...products];
        
        if ((selectedSubCategories.size > 0 || selectedBrands.size > 0 || selectedCountries.size > 0) && !searchText.trim()) {
            return filtered;
        }
        
        if (selectedSubCategories.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedSubCategories.has(product.subCategory)
            );
        }
        
        if (selectedBrands.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedBrands.has(product.brand)
            );
        }
        
        if (selectedCountries.size > 0 && searchText.trim()) {
            filtered = filtered.filter(product => 
                selectedCountries.has(product.countryOfOrigin)
            );
        }
        
        return filtered;
    }, []);

    // Fetch all master products
    const fetchAllMasterProducts = useCallback(async (page = 0, append = false, selectedSubCategories, selectedBrands, selectedCountries) => {
        console.log('🚀 Starting fetchAllMasterProducts API call...', { page, append });
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        let url = `/api/v1/seller/product/master/list?page=${page}&limit=${pageLimit}`;
        
        if (selectedSubCategories.size > 0) {
            const categoriesParam = Array.from(selectedSubCategories).join('|');
            url += `&categories=${encodeURIComponent(categoriesParam)}`;
        }
        
        if (selectedBrands.size > 0) {
            const brandsParam = Array.from(selectedBrands).join('|');
            url += `&brands=${encodeURIComponent(brandsParam)}`;
        }
        
        if (selectedCountries.size > 0) {
            const countriesParam = Array.from(selectedCountries).join('|');
            url += `&countries=${encodeURIComponent(countriesParam)}`;
        }
        
        try {
            console.log('📡 Calling fetchAllMasterProducts URL:', url);
            const result = await getCall(url);
            console.log('✅ fetchAllMasterProducts response:', result);
            
            let products = [];
            let hasMoreResults = false;
            
            if (result && typeof result === 'object') {
                if (result.data) {
                    const variantResult = result.data;
                    products = variantResult.results || variantResult || [];
                    hasMoreResults = variantResult.hasMoreResults || false;
                } 
                else if (Array.isArray(result)) {
                    products = result;
                    hasMoreResults = result.length === pageLimit;
                }
                else if (result.results) {
                    products = result.results;
                    hasMoreResults = result.hasMoreResults || false;
                }
                else {
                    products = [result];
                    hasMoreResults = false;
                }
            }

            if (!Array.isArray(products)) {
                products = [];
            }

            const mappedProducts = products.map(product => {
                const mapped = {
                    pid: product.pid || product.id,
                    name: product.productName || product.name,
                    brand: product.brand || "",
                    thumbnailUrl: product.thumbnailUrl || product.imageUrl,
                    mrp: product.mrp || 0,
                    uom: product.uom || "UNIT",
                    uomValue: product.uomValue || 1,
                    parent_id: product.parent_id || product.parentId,
                    subCategory: product.subCategory || ""
                };
                console.log('Product data:', mapped.name, '→ parent_id:', mapped.parent_id, '→ pid:', mapped.pid);
                return mapped;
            });

            if (append && page > 0) {
                setMasterProducts(prev => [...prev, ...mappedProducts]);
            } else {
                setMasterProducts(mappedProducts);
            }

            setCurrentPage(page);
            setHasMoreResults(hasMoreResults);
        } catch (error) {
            console.error("❌ Error fetching all master products:", error);
            cogoToast.error(`Failed to load product catalog: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            console.log('🏁 fetchAllMasterProducts completed');
        }
    }, [pageLimit]);

    // Fetch search products
    const fetchSearchProducts = useCallback(async (page = 0, keyword = "", append = false, selectedSubCategories, selectedBrands, selectedCountries) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        let url = `/api/v1/seller/product/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${pageLimit}`;
        
        if (selectedSubCategories.size > 0) {
            const categoriesParam = Array.from(selectedSubCategories).join('|');
            url += `&categories=${encodeURIComponent(categoriesParam)}`;
        }
        
        if (selectedBrands.size > 0) {
            const brandsParam = Array.from(selectedBrands).join('|');
            url += `&brands=${encodeURIComponent(brandsParam)}`;
        }
        
        if (selectedCountries.size > 0) {
            const countriesParam = Array.from(selectedCountries).join('|');
            url += `&countries=${encodeURIComponent(countriesParam)}`;
        }
        
        try {
            const result = await getCall(url);
            const searchResult = result.data || {};
            const rawProducts = searchResult.results || [];
            
            const mappedProducts = rawProducts.map(product => ({
                pid: product.pid || product.id,
                name: product.productName || product.name,
                brand: product.brand || "",
                thumbnailUrl: product.thumbnailUrl || product.imageUrl,
                mrp: product.mrp || 0,
                uom: product.uom || "UNIT",
                uomValue: product.uomValue || 1,
                parent_id: product.parent_id || product.parentId,
                subCategory: product.subCategory || ""
            }));
            
            if (append && page > 0) {
                setMasterProducts(prev => [...prev, ...mappedProducts]);
            } else {
                setMasterProducts(mappedProducts);
            }
            
            setCurrentPage(page);
            setHasMoreResults(searchResult.hasMoreResults || false);
        } catch (error) {
            console.error("Error fetching search products:", error);
            cogoToast.error("Failed to search products");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [pageLimit]);

    // Update filtered products whenever master products or filters change
    const updateFilteredProducts = useCallback((selectedSubCategories, selectedBrands, selectedCountries, searchText) => {
        const filtered = applyFilters(masterProducts, selectedSubCategories, selectedBrands, selectedCountries, searchText);
        setFilteredProducts(filtered);
    }, [masterProducts, applyFilters]);

    // Update grouped products whenever filtered products change
    useEffect(() => {
        console.log('Filtering products for grouping:', filteredProducts.length, 'products');
        const grouped = groupProductsByParentId(filteredProducts);
        console.log('Grouped products:', grouped.length, 'groups');
        setGroupedProducts(grouped);
    }, [filteredProducts, groupProductsByParentId]);

    return {
        masterProducts,
        filteredProducts,
        groupedProducts,
        loading,
        loadingMore,
        currentPage,
        hasMoreResults,
        pageLimit,
        isInitialized,
        setIsInitialized,
        setCurrentPage,
        fetchAllMasterProducts,
        fetchSearchProducts,
        updateFilteredProducts
    };
};