// AddProductDialog.jsx
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
    Snackbar,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
    Grid,
    InputAdornment,
    Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getCall, postCall, putCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allProductFieldDetails, variantProductFieldDetails } from "./gen-product-fields";
// import { manualProductFieldDetails } from "./manual-product-fields";
import { validateProductForm } from "./validateProductForm";
import cogoToast from "cogo-toast";
import './AddProductDialog.css';
import { validateVariantForm } from "./ValidateVariants";
import { generateSKU } from "../../Shared/SkuGenerator";
import { v4 as uuidv4 } from 'uuid';
import VariantSection from "./ProductVariantSection";
import { allProperties } from "./categoryProperties";
import VitalInfoSection from "./ProductVitalInfoSection";
import { getSizeOptions } from "./categoryProperties";
import { categorySpecificFields } from "./gen-product-fields";

//const variationFields = ["price", "purchasePrice", "availableQty", "uomValue", "sku", "imageUrls", "backImage"];
const variationFields = ["price", "purchasePrice", "availableQty", "uomValue", "sku", "imageUrls", "backImage"];
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const convertAttributesToJson = (attributes) => {
    if (!Array.isArray(attributes)) return {};

    return attributes.reduce((acc, attr) => {
        if (attr.code && attr.value !== undefined) {
            acc[attr.code] = attr.value;
        }
        return acc;
    }, {});
};

// Add currentProductId prop
const AddProductDialog = ({ storeId, category, open, onClose, refreshProducts, currentProductId }) => {
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [vitalFormData, setVitalFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [searchText, setSearchText] = useState("");
    const [productOptions, setProductOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    // Pagination state for autocomplete (same as SelectProductDialog)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [pageLimit] = useState(20);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState([]);
    const [variantAttributes, setVariantAttributes] = useState([]);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [showAllFields, setShowAllFields] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [variantDetails, setVariantDetails] = useState([]);
    const [enableVitalInfo, setEnableVitalInfo] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [filteredAttributes, setFilteredAttributes] = useState([]);
    const [variantsCheckboxState, setVariantsCheckboxState] = useState({});
    const [subCategory, setSubCategory] = useState([]);
    const [variantErrors, setVariantErrors] = useState([]);
    const [vitalErrors, setVitalErrors] = useState([]);
    const [finalVariantFields, setFinalVariantFields] = useState([variantProductFieldDetails]);
    const [selectedIds, setSelectedIds] = useState("");
    const [vitalFormObj, setVitalFormObj] = useState("");
    const [allErrorMessages, setAllErrorMessages] = useState([]);

    // Determine if it's an edit operation based on currentProductId prop
    const isEditMode = !!currentProductId;


    const initialValues = React.useMemo(() => fields.reduce((acc, field) => {
        acc[field.id] = field.type === "number" ? null : field.type === "upload" ? (field.multiple ? [] : "") : "";
        return acc;
    }, {}), []);

    const initializeVariantData = useCallback(() => {
        return {
            ...finalVariantFields.reduce((acc, field) => {
                acc[field.id] = field.type === "number" ? null : field.type === "upload" ? (field.multiple ? [] : "") : "";
                return acc;
            }, {}),
            isNew: true // Mark as new by default
        };
    }, [finalVariantFields]);

    const formatAttributesToFieldsDataFormat = (vitalInfoFields, required = false) => {
        return vitalInfoFields.map((vitalInfo) => {
            const id = vitalInfo.name.replace(/ /g, "_").toLowerCase();
            const type = vitalInfo.type || "input";
            const example = vitalInfo.example;

            const defaultPlaceholders = {
                input: `Enter ${vitalInfo.name}`,
                number: `Enter ${vitalInfo.name}`,
                date: `Select ${vitalInfo.name}`,
                select: `Select ${vitalInfo.name}`,
                upload: `Upload ${vitalInfo.name}`,
                textarea: `Enter ${vitalInfo.name}`,
                email: `Enter ${vitalInfo.name}`,
                phone: `Enter ${vitalInfo.name}`,
            };

            return {
                id,
                title: vitalInfo.name,
                placeholder: example || defaultPlaceholders[type] || `Enter ${vitalInfo.name}`,
                type,
                required: required || vitalInfo.required,
                options: type === "select" ? vitalInfo.options : null,
                file_type: type === "upload" ? "product_image" : null,
            };
        });
    };
    useEffect(() => {
        if (category === 'RET12' && formData.subCategory) {
            setVitalFormData(vitalFormObj);
            const sub_category = formData.subCategory;
            let category_data = allProperties[category];
            let properties = category_data?.[sub_category] || category_data["default"] || [];

            if (properties.length > 0) {
                setEnableVitalInfo(true);
                properties = formatAttributesToFieldsDataFormat(properties);
                let variants = properties?.filter((property) => property.required);

                let variants_checkbox_map = variants.reduce((acc, variant) => {
                    acc[variant.id] = false;
                    return acc;
                }, {});

                // ✅ Apply size options if 'size' field is present
                const sizeOptions = getSizeOptions(sub_category);
                properties = properties.map((field) =>
                    field.id === "size"
                        ? { ...field, options: sizeOptions }
                        : field
                );
                setAttributes(properties); // All attributes
                setVariantAttributes(variants); // Only required = candidate variant axes
                setVariantsCheckboxState(variants_checkbox_map); // For UI checkbox state
                setSubCategory(sub_category);
            }
        }
    }, [formData.subCategory]);

    useEffect(() => {
        const mergedErrors = [];

        // Main form errors → Tab: Product Details
        if (errors && typeof errors === "object") {
            Object.values(errors)
                .filter(Boolean)
                .forEach(msg => mergedErrors.push({ tab: "Product Details", message: msg }));
        }

        // Vital info errors → Tab: Vital Info
        if (vitalErrors && typeof vitalErrors === "object") {
            Object.values(vitalErrors)
                .filter(Boolean)
                .forEach(msg => mergedErrors.push({ tab: "Vital Info", message: msg }));
        }

        // Variant errors → Tab: Variants
        if (Array.isArray(variantErrors)) {
            variantErrors.forEach(variantErrObj => {
                if (variantErrObj && typeof variantErrObj === "object") {
                    Object.values(variantErrObj)
                        .filter(Boolean)
                        .forEach(msg => mergedErrors.push({ tab: "Variants", message: msg }));
                }
            });
        }

        setAllErrorMessages(mergedErrors);
    }, [errors, vitalErrors, variantErrors]);



    useEffect(() => {
        let selectedVariantIds = [];
        if (isEditMode) {
            selectedVariantIds = selectedIds.split(',').map(attr => attr.trim());
        } else {
            selectedVariantIds = Object.entries(variantsCheckboxState)
                .filter(([_, isChecked]) => isChecked)
                .map(([id]) => id);
        }
        const selectedVariantAttributes = attributes.filter(attr => selectedVariantIds.includes(attr.id));
        const filtered = attributes.filter(attr =>
            !selectedVariantAttributes.find(v => v.id === attr.id) || variationFields.includes(attr.id)
        );
        let merged = variantProductFieldDetails;
        if (selectedVariantAttributes.length > 0) {
            merged = [
                ...selectedVariantAttributes,
                ...variantProductFieldDetails
            ];
        }
        setFilteredAttributes(filtered);
        setFinalVariantFields(merged);
        setSelectedIds(selectedVariantIds.join(","));
    }, [variantsCheckboxState, attributes, variantAttributes]);


    useEffect(() => {
        if (open) {
            setFormData({ ...initialValues });
            setVitalFormData({ ...initialValues });
            setVariants([{ id: Date.now(), data: initializeVariantData() }]);
            setErrors({});
            setVariantErrors([]);
            setVitalErrors([]);
            setSearchText("");
            setProductOptions([]);
            setIsProductSelected(false);
            setShowAllFields(false);
            setHasVariants(false);
            setActiveTab(0);
            setEnableVitalInfo(false);
            setVariantsCheckboxState({});
            if (isEditMode && currentProductId) {
                fetchProductDetailsForEdit(currentProductId);
            }
        }
    }, [open, isEditMode, currentProductId]);

    const fetchProductDetailsForEdit = useCallback(async (productId) => {
        setLoadingOptions(true);
        try {
            const res = await getCall(`/api/v1/seller/productId/${category}/${productId}/product`);
            const { commonDetails, variantSpecificDetails, variationOn, variationAttributes } = res.data;

            // Populate common details, but we will GENERATE SKU on submission
            setFormData(commonDetails);
            if (category === "RET12") {
                var vitalFormObj = convertAttributesToJson(commonDetails.attributes);
                setVitalFormObj(vitalFormObj);
                setSelectedIds(variationAttributes);
            }
            // Populate variant details
            if (variationOn !== "NONE" && variantSpecificDetails && variantSpecificDetails.length > 0) {
                const initializedVariants = variantSpecificDetails.map(v => {
                    // Flatten attributes into an object: { colour: "Red", size: "M", ... }
                    const flattenedAttributes = (v.attributes || []).reduce((acc, attr) => {
                        acc[attr.code] = attr.value;
                        return acc;
                    }, {});

                    return {
                        id: Date.now() + Math.random(), // unique ID
                        data: {
                            ...initializeVariantData(), // default fields
                            ...v, // main variant fields (like name, price, etc.)
                            ...flattenedAttributes, // now colour, size, etc. become top-level keys
                            isNew: false
                        }
                    };
                });
                setVariants(initializedVariants);
                setHasVariants(true);
            } else {
                setVariants([{ id: Date.now(), data: initializeVariantData() }]);
                setHasVariants(false);
            }
            setIsProductSelected(true);
        } catch (error) {
            cogoToast.error("Failed to load product for editing.");
            console.error("Error fetching product details for edit:", error);
            onClose();
        } finally {
            setLoadingOptions(false);
        }
    }, [initializeVariantData, onClose]);


    const getProductCategory = useCallback(async () => {
        try {
            const res = await getCall(`/api/v1/seller/reference/category/${category}`);
            return res.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    }, [category]);

    const setMasterProduct = useCallback(async (product) => {
        try {
            const res = await getCall(`/api/v1/seller/product/master/${product.id}`);
            let details = res.data.commonDetails || {};
            let variantDetails = res.data.variantSpecificDetails || [];
            ["additiveInfo", "instructions", "nutritionalInfo", "manufacturerName", "manufacturerAddress", "ingredientsInfo"]
                .forEach(field => {
                    if (!details[field]) details[field] = "Refer to the product image.";
                });
            // SKU will be generated on final submission, not when selecting master product
            // Removed: details.sku=generateSKU("RET", details["subCategory"], details["productName"]);
            setFormData(details);
            setVariantDetails(variantDetails); // Store original variant details for toggle
            const initializedVariants = variantDetails.map(v => ({
                id: Date.now() + Math.random(), // unique ID
                data: {
                    ...initializeVariantData(),
                    ...v, // populate values from API
                    isNew: false,
                }
            }));
            setVariants(initializedVariants);
            setHasVariants(initializedVariants.length > 0);

        } catch (error) {
            cogoToast.error("Failed to load product.");
        }
    }, [initializeVariantData]);

    const handleProductSelect = useCallback(async (_, selectedProduct) => {
        setErrors({});
        setFormData({ ...initialValues });

        if (!selectedProduct) {
            setIsProductSelected(false);
            setFields([...allProductFieldDetails]); // Reset all fields
            return;
        }

        const isNewProduct = selectedProduct.pid === -999;
        let filteredFields = allProductFieldDetails.filter(field => field.id !== "sku");

        if (isNewProduct) {
            const fieldsForCategory = categorySpecificFields[category];
            filteredFields = filteredFields.filter(field => fieldsForCategory.includes(field.id));
            const subCategoryIndex = filteredFields.findIndex(item => item.id === "subCategory");
            if (subCategoryIndex !== -1) {
                const categoryList = await getProductCategory();
                filteredFields[subCategoryIndex] = {
                    ...filteredFields[subCategoryIndex],
                    type: 'select',
                    options: categoryList,
                    isDisabled: false
                };
            }
            const uomIndex = filteredFields.findIndex(item => item.id === "uom");
            if (uomIndex !== -1) {
                filteredFields[uomIndex] = {
                    ...filteredFields[uomIndex],
                    isDisabled: true
                };
            }
            if (category === "RET12") {
                const uomIndex = filteredFields.findIndex(item => item.id === "uom");
                if (uomIndex !== -1) {
                    filteredFields[uomIndex] = {
                        ...filteredFields[uomIndex],
                        isDisabled: true
                    };
                }

                setFormData(prev => ({
                    ...prev,
                    fulfillmentOption: "Delivery",
                    uom: "UNIT"
                }));
            }
        } else {
            // Convert ProductResult to expected format for setMasterProduct
            const productForMaster = {
                id: selectedProduct.pid,
                name: selectedProduct.name,
                brand: selectedProduct.brand,
                thumbnailUrl: selectedProduct.thumbnailUrl,
                mrp: selectedProduct.mrp
            };
            await setMasterProduct(productForMaster);
        }

        setFields(filteredFields);
        setIsProductSelected(true);
    }, [initialValues, category]);

    useEffect(() => {
        if (isEditMode) {
            const fieldsForCategory = categorySpecificFields[category] || [];
            const updatedFields = allProductFieldDetails
                .filter(field => fieldsForCategory.includes(field.id))
            if (category === "RET12") {
                const uomIndex = updatedFields.findIndex(item => item.id === "uom");
                if (uomIndex !== -1) {
                    updatedFields[uomIndex] = {
                        ...updatedFields[uomIndex],
                        isDisabled: true
                    };
                }
            }
            setFields(updatedFields);
        }
    }, [isEditMode]);
    
    // Fetch products using search endpoint with pagination (same as SelectProductDialog)
    const fetchSearchProducts = useCallback(async (page = 0, keyword = "", append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoadingOptions(true);
        }
        try {
            const url = `/api/v1/seller/product/search?category=${category}&keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${pageLimit}`;
            const result = await getCall(url);
            // Handle new SearchResult structure
            const searchResult = result.data || {};
            const products = searchResult.results || [];
            
            if (append && page > 0) {
                // Append to existing results for pagination
                setProductOptions(prev => {
                    // Remove the "Add New Product" option if it exists
                    const filteredPrev = prev.filter(opt => opt.pid !== -999);
                    const newOptions = [...filteredPrev, ...products];
                    // Always add "Add New Product" option at the end
                    newOptions.push({ pid: -999, name: "➕ Add New Product" });
                    return newOptions;
                });
            } else {
                // Replace results for new search
                // Sort results by score in descending order (highest score first)
                const sortedProducts = products.length ? 
                    products.sort((a, b) => (b.score || 0) - (a.score || 0)) : 
                    [];
                const newOptions = [...sortedProducts];
                // Always add "Add New Product" option at the end
                newOptions.push({ pid: -999, name: "➕ Add New Product" });
                setProductOptions(newOptions);
            }
            
            // Update pagination state
            setCurrentPage(page);
            setTotalCount(searchResult.totalCount || 0);
            setHasMoreResults(searchResult.hasMoreResults || false);
        } catch (error) {
            console.error("Error fetching search products:", error);
            if (!append) {
                setProductOptions([{ pid: -999, name: "➕ Add New Product" }]);
            }
        } finally {
            setLoadingOptions(false);
            setLoadingMore(false);
        }
    }, [category, pageLimit]);
    
    useEffect(() => {
        if (!searchText || searchText.length < 3) {
            setProductOptions([{ pid: -999, name: "➕ Add New Product" }]);
            setCurrentPage(0);
            setHasMoreResults(false);
            return;
        }
        const delayDebounce = setTimeout(() => {
            // Reset pagination and fetch new results for new search
            setCurrentPage(0);
            fetchSearchProducts(0, searchText, false);
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchText, fetchSearchProducts]);

    // Handle infinite scroll for autocomplete
    const handleAutocompleteScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        
        // Check if user has scrolled to the bottom (with some buffer)
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            // Load more data if available and not already loading
            if (hasMoreResults && !loadingOptions && !loadingMore && searchText && searchText.length >= 3) {
                fetchSearchProducts(currentPage + 1, searchText, true);
            }
        }
    }, [hasMoreResults, loadingOptions, loadingMore, currentPage, searchText, fetchSearchProducts]);

    const handleVariantChange = useCallback((index, updatedData) => {
        setVariants(prev => {
            const updatedVariants = [...prev];
            updatedVariants[index] = { ...updatedVariants[index], data: updatedData };
            return updatedVariants;
        });
    }, []);

    const handleVariantRemove = useCallback((indexToRemove) => {
        setVariants(prev => {
            if (prev.length <= 1) return prev;
            return prev.filter((_, index) => index !== indexToRemove);
        });
    }, []);

    const handleSubmit = async () => {
        let isVariantsValid = true;
        if (hasVariants) {
            isVariantsValid = validateVariantForm(variants, finalVariantFields, setVariantErrors);
        }

        const visibleFieldsMainTab = fields.filter(f =>
            !hasVariants || !finalVariantFields.find(vf => vf.id === f.id)
        );

        const isMainFormValid = validateProductForm(formData, visibleFieldsMainTab, setErrors);
        const isVitalFormValid = validateProductForm(vitalFormData, filteredAttributes, setVitalErrors);

        if (!isMainFormValid || !isVitalFormValid || !isVariantsValid) {
            console.log("Validation Failed:");
            console.log("isMainFormValid:", isMainFormValid);
            console.log("isVitalFormValid:", isVitalFormValid);
            console.log("isVariantsValid:", isVariantsValid);
            return;
        }

        setLoadingSubmit(true);
        try {
            // --- Prepare Common Details ---
            const { tempURL, ...commonDetailsToSend } = formData;
            // Generate SKU for the common product
            if (!isEditMode) {
                if (commonDetailsToSend.subCategory && commonDetailsToSend.productName) {
                    commonDetailsToSend.sku = generateSKU("RET", commonDetailsToSend.subCategory);
                } else {
                    cogoToast.error("Cannot generate SKU: Missing sub-category or product name.");
                    setLoadingSubmit(false);
                    return;
                }
            }
            const vitalDynamicAttributes = Object.keys(vitalFormData || {})
                .filter(
                    key =>
                        key !== "tempURL" &&
                        key !== "uploaded_urls" &&
                        vitalFormData[key] !== undefined &&
                        vitalFormData[key] !== "" &&
                        vitalFormData[key] !== null &&
                        (!Array.isArray(vitalFormData[key]) || vitalFormData[key].length > 0)
                )
                .map(key => ({
                    code: key,
                    value: vitalFormData[key]
                }));
            commonDetailsToSend.attributes = vitalDynamicAttributes;

            let variantSpecificDetailsToSend = undefined;

            if (hasVariants) {
                let staticFieldIds = variantProductFieldDetails.map(f => f.id);
                if (isEditMode) {
                    staticFieldIds.push("_id", "productId", "productVariantId", "attributes");
                }
                variantSpecificDetailsToSend = variants.map(v => {
                    const { isNew, ...variantData } = v.data; // Remove internal flag
                    // Generate SKU for each variant
                    if (!isEditMode) {
                        if (commonDetailsToSend.subCategory && commonDetailsToSend.productName) {
                            variantData.sku = generateSKU("RET", commonDetailsToSend.subCategory, commonDetailsToSend.productName);
                        } else {
                            throw new Error("Cannot generate variant SKU: Missing common product details (subCategory or productName).");
                        }
                    }

                    if (isEditMode) {
                        if (!variantData.productId) {
                            variantData.productId = commonDetailsToSend.productId;
                        }
                        if (!variantData.productVariantId) {
                            variantData.productVariantId = uuidv4();
                        }
                    }
                    // Extract dynamic fields in required format
                    const attributes = Object.keys(variantData)
                        .filter(key =>
                            !staticFieldIds.includes(key) &&
                            key !== "tempURL" &&
                            key !== "uploaded_urls" &&
                            variantData[key] !== undefined &&
                            variantData[key] !== "" &&
                            variantData[key] !== null &&
                            (!Array.isArray(variantData[key]) || variantData[key].length > 0)
                        )
                        .map(key => ({
                            code: key,
                            value: variantData[key]
                        }));


                    return {
                        ...Object.fromEntries(
                            Object.entries(variantData).filter(([key]) => staticFieldIds.includes(key))
                        ),
                        attributes
                    };
                });
            }
            // --- Prepare Final Payload ---
            const payload = {
                commonDetails: commonDetailsToSend,
                variationOn: hasVariants ? (selectedIds ? "ATTRIBUTES" : "UOM") : "NONE",
                variantSpecificDetails: variantSpecificDetailsToSend,
                variationAttributes: selectedIds
            };

            let res;
            if (isEditMode) {
                const apiUrl = `/api/v1/seller/productId/${category}/${currentProductId}/product`;
                res = await putCall(apiUrl, payload);
            } else {
                const apiUrl = `/api/v1/seller/storeId/${storeId}/product`;
                res = await postCall(apiUrl, payload);
            }

            if (res.status === 200) {
                cogoToast.success(`Product ${isEditMode ? "updated" : "added"} successfully!`);
                refreshProducts?.();
                onClose();
            } else {
                cogoToast.error(res.message || `Failed to ${isEditMode ? "update" : "add"} product`);
            }
        } catch (error) {
            cogoToast.error(`An error occurred while ${isEditMode ? "updating" : "adding"} the product: ${error.message}`);
            console.error("Submission error:", error);
        } finally {
            setLoadingSubmit(false);
        }
    };


    const handleVariantToggle = () => {
        setHasVariants(prev => {
            const newValue = !prev;
            if (newValue) {
                if (variants.length === 0 && variantDetails.length > 0) {
                    const loadedVariants = variantDetails.map(v => ({
                        id: Date.now() + Math.random(),
                        data: {
                            ...initializeVariantData(),
                            ...v,
                            isNew: false,
                        }
                    }));
                    setVariants(loadedVariants);
                } else if (variants.length === 0) {
                    setVariants([{ id: Date.now(), data: initializeVariantData() }]);
                }
            } else if (!newValue) {
                setVariants([]);
            }
            return newValue;
        });
    };
    const getPlaceholder = (category) => {
        return category === "RET12" ? "e.g., Garments, Top" : "e.g., Atta, Ashirvad";
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="dialog-title">
                <Typography variant="h6" component="div" sx={{ color: 'primary.main' }}>
                    {isEditMode ? "Edit Product" : "Add New Product"}
                </Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <div>
                    {!isEditMode && (
                        <Autocomplete
                            freeSolo
                            options={productOptions}
                            loading={loadingOptions}
                            ListboxProps={{
                                onScroll: handleAutocompleteScroll,
                                style: { maxHeight: 400, overflow: 'auto' }
                            }}
                            getOptionLabel={(opt) => {
                                if (typeof opt === 'string') return opt;
                                // Handle ProductResult format
                                if (opt.pid) {
                                    return opt.name || '';
                                }
                                // Handle legacy format for backward compatibility
                                return opt?.name?.split('#!#')[0] || '';
                            }}
                            filterOptions={(x) => x}
                            onInputChange={(_, val, reason) => reason === 'input' && setSearchText(val)}
                            onChange={handleProductSelect}
                            renderOption={(props, option, { index }) => {
                                // Check if this is the last item and we're loading more
                                const isLastItem = index === productOptions.length - 1;
                                const shouldShowLoader = isLastItem && loadingMore && hasMoreResults;
                                
                                // Handle ProductResult format
                                if (option.pid) {
                                    return (
                                        <React.Fragment key={option.pid}>
                                            <li {...props}>
                                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0' }}>
                                                    {option.thumbnailUrl && (
                                                        <img
                                                            src={option.thumbnailUrl}
                                                            alt={option.name}
                                                            width={40}
                                                            height={40}
                                                            style={{ objectFit: 'cover', borderRadius: 4 }}
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>{option.name}</div>
                                                        <div style={{ fontSize: 12, color: '#555' }}>
                                                            {option.brand} {option.mrp && `| ₹${option.mrp}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {shouldShowLoader && (
                                                <li style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                                        <CircularProgress size={16} />
                                                        <span style={{ fontSize: 12, color: '#666' }}>Loading more products...</span>
                                                    </div>
                                                </li>
                                            )}
                                        </React.Fragment>
                                    );
                                }

                                // Handle legacy format and special options
                                const name = typeof option === 'string' ? option : option?.name || '';

                                if (!name.includes('#!#')) {
                                    return (
                                        <React.Fragment key={`${name}-${index}`}>
                                            <li {...props}>
                                                <div style={{ padding: '5px 0', fontWeight: 500 }}>{name}</div>
                                            </li>
                                            {shouldShowLoader && (
                                                <li style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                                        <CircularProgress size={16} />
                                                        <span style={{ fontSize: 12, color: '#666' }}>Loading more products...</span>
                                                    </div>
                                                </li>
                                            )}
                                        </React.Fragment>
                                    );
                                }

                                const [productName, imageUrl, brand, manufacturer, uom, uomValue] = name.split('#!#');

                                return (
                                    <React.Fragment key={`${productName}-${index}`}>
                                        <li {...props}>
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0' }}>
                                                <img
                                                    src={imageUrl}
                                                    alt={productName}
                                                    width={40}
                                                    height={40}
                                                    style={{ objectFit: 'cover', borderRadius: 4 }}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{productName}</div>
                                                    <div style={{ fontSize: 12, color: '#555' }}>
                                                        {brand} | {uomValue} {uom}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {shouldShowLoader && (
                                            <li style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                                    <CircularProgress size={16} />
                                                    <span style={{ fontSize: 12, color: '#666' }}>Loading more products...</span>
                                                </div>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Existing Product"
                                    placeholder={getPlaceholder(category)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <>
                                                {loadingOptions && <CircularProgress color="inherit" size={20} />}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />


                    )}

                    {isProductSelected && !isEditMode && (
                        <FormControlLabel
                            control={<Checkbox checked={hasVariants} onChange={handleVariantToggle} />}
                            label="Enable Product Variations"
                        />
                    )}
                </div>

                {isProductSelected && (
                    <>
                        {hasVariants && category === "RET12" && !isEditMode && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Select attributes for variant:
                                </Typography>
                                <Grid container spacing={1}>
                                    {Object.entries(variantsCheckboxState).map(([key, value]) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={value}
                                                        onChange={() =>
                                                            setVariantsCheckboxState(prev => ({
                                                                ...prev,
                                                                [key]: !prev[key],
                                                            }))
                                                        }
                                                    />
                                                }
                                                label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                        {allErrorMessages.length > 0 && (
                            <Box sx={{ mb: 2, p: 2, border: "1px solid #f44336", borderRadius: 1, backgroundColor: "#fdecea" }}>
                                <Typography variant="subtitle1" sx={{ color: "#d32f2f", fontWeight: 600 }}>
                                    Please fix the following errors:
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#d32f2f" }}>
                                    {allErrorMessages.map((err, i) => (
                                        <li key={i}>
                                            <strong>{err.tab}:</strong> {err.message}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                        >
                            <Tab label="Product Details" {...a11yProps(0)} />

                            {category === "RET12" && (
                                <Tab
                                    label="Vital Info"
                                    {...a11yProps(category === "RET12" ? 1 : null)}
                                    disabled={!enableVitalInfo}
                                />
                            )}

                            <Tab
                                label="Variants"
                                {...a11yProps(category === "RET12" ? 2 : 1)}
                                disabled={!hasVariants}
                            />
                        </Tabs>

                        <TabPanel value={activeTab} index={0}>
                            <Box className="details-section">
                                <Grid container spacing={2}>
                                    {(showAllFields
                                        ? fields.filter(f => !hasVariants || !variationFields.includes(f.id))
                                        : fields.filter(f => ["subCategory", "productName", "price", "gstPercentage", "purchasePrice"].includes(f.id) && (!hasVariants || !["price", "purchasePrice"].includes(f.id))))
                                        .map((item) => (
                                            <Grid item xs={12} sm={6} key={item.id}>
                                                <RenderInput
                                                    item={{ ...item, error: errors[item.id], helperText: errors[item.id], fullWidth: true }}
                                                    previewOnly={isEditMode && item.id === "productCode"}
                                                    state={formData}
                                                    stateHandler={setFormData}
                                                />
                                            </Grid>
                                        ))}
                                </Grid>
                                <Box textAlign="center">
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowAllFields(prev => !prev)}
                                        startIcon={showAllFields ? <CloseIcon /> : <AddCircleOutlineIcon />}
                                    >
                                        {showAllFields ? "Hide Additional Product Fields" : "Show All Product Fields"}
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        {category === "RET12" && <TabPanel value={activeTab} index={1}>
                            {filteredAttributes.length === 0 && enableVitalInfo ? (
                                <Box className="variant-empty">
                                    <Typography variant="h6">No attributes found</Typography>
                                </Box>
                            ) : (
                                <VitalInfoSection
                                    fields={filteredAttributes}
                                    formData={vitalFormData} // ✅ pass data, not setter
                                    onFormDataChange={setVitalFormData} // ✅ pass setter here
                                    category={category}
                                    subCategory={subCategory}
                                    showRemoveButton={variants.length > 1 && !isEditMode}
                                    vitalErrors={vitalErrors}
                                    isEditMode={isEditMode}
                                />
                            )}
                        </TabPanel>}
                        <TabPanel value={activeTab} index={category === "RET12" ? 2 : 1}>
                            {variants.length === 0 && hasVariants ? (
                                <Box className="variant-empty">
                                    <Typography variant="h6">No variants found. Add a new variant.</Typography>
                                </Box>
                            ) : !hasVariants ? (
                                <Box className="variant-empty">
                                    <Typography variant="h6">Please enable product variations to add variants.</Typography>
                                </Box>
                            ) : (
                                variants.map((variant, idx) => (
                                    <VariantSection
                                        key={variant.id}
                                        index={idx}
                                        variant={variant}
                                        fields={[...finalVariantFields]}
                                        onChange={(i, d) => handleVariantChange(i, d)}
                                        onRemove={handleVariantRemove}
                                        showRemoveButton={variants.length > 1 && !isEditMode}
                                        variantErrors={variantErrors[idx] || {}}
                                        isEditMode={isEditMode}
                                        category={category}
                                        subCategory={subCategory}
                                    />
                                ))
                            )}
                            {hasVariants && (
                                <Button
                                    onClick={() =>
                                        setVariants(prev => [
                                            ...prev,
                                            {
                                                id: Date.now(),
                                                data: {
                                                    ...initializeVariantData(),
                                                    sku: generateSKU("RET", formData?.subCategory),  // or any default SKU format
                                                    availableQty: 99               // default quantity
                                                }
                                            }
                                        ])
                                    }
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    fullWidth
                                    sx={{ mt: 3 }}
                                >
                                    Add Another Variant
                                </Button>
                            )}

                        </TabPanel>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} disabled={loadingSubmit} variant="outlined" color="secondary" sx={{ minWidth: 100 }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loadingSubmit || !isProductSelected} sx={{ minWidth: 100 }}>
                    {loadingSubmit ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Save Changes" : "Save Product")}
                </Button>
            </DialogActions>
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                message={`Product ${isEditMode ? "updated" : "added"} successfully!`}
            />
        </Dialog>
    );
};

export default AddProductDialog;