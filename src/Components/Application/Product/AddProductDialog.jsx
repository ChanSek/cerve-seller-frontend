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
import { DeleteOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getCall, postCall, putCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allProductFieldDetails, variantProductFieldDetails } from "./gen-product-fields";
import { manualProductFieldDetails } from "./manual-product-fields";
import { validateProductForm } from "./validateProductForm";
import cogoToast from "cogo-toast";
import './AddProductDialog.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { validateVariantForm } from "./ValidateVariants";
import { generateSKU } from "../../Shared/SkuGenerator";
import { v4 as uuidv4 } from 'uuid';

const variationFields = ["price", "purchasePrice", "availableQty", "uomValue", "sku", "imageUrls", "backImage"];
const hideVariantFields = ["availableQty", "uomValue", "sku", "imageUrls", "backImage"];

const VariantSection = ({ variant, index, fields, onChange, onRemove, showRemoveButton, variantErrors, isEditMode }) => {
    const [showAllVariantFields, setShowAllVariantFields] = useState(false);
    const visibleFields = variationFields.filter(fieldId =>
        showAllVariantFields || !hideVariantFields.includes(fieldId)
    );
    const shouldShowDeleteButton = showRemoveButton || (isEditMode && variant.data.isNew);

    return (
        <Box className="details-section">
            <Typography
                variant="h6"
                sx={{ color: 'primary.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
            >
                Variant {index + 1}
                {shouldShowDeleteButton && (
                    <Tooltip title={`Remove Variant ${index + 1}`} arrow>
                        <IconButton
                            onClick={() => onRemove(index)}
                            size="small"
                            color="error"
                            sx={{ p: 0.5 }}
                        >
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Typography>


            <Grid container>
                {visibleFields.map((fieldId) => {
                    if ((!isEditMode) && fieldId === 'sku') return null;
                    const fieldConfig = fields.find(f => f.id === fieldId);
                    if (!fieldConfig) return null;

                    const fieldError = variantErrors?.[fieldId];

                    return (
                        <Grid item xs={12} key={fieldId}>
                            <RenderInput
                                item={{
                                    ...fieldConfig,
                                    fullWidth: true,
                                    error: !!fieldError,       // red border
                                    helperText: fieldError || "",    // error message
                                }}
                                state={variant.data}
                                stateHandler={(updated) =>
                                    onChange(index, { ...variant.data, ...updated })
                                }
                            />
                        </Grid>
                    );
                })}
            </Grid>

            <Box mt={2} textAlign="center">
                <Button
                    size="small"
                    variant="text"
                    startIcon={showAllVariantFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setShowAllVariantFields(prev => !prev)}
                >
                    {showAllVariantFields ? "Show Less Variant Fields" : "Show More Variant Fields"}
                </Button>
            </Box>
        </Box>
    );
};


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

// Add currentProductId prop
const AddProductDialog = ({ storeId, category, open, onClose, refreshProducts, currentProductId }) => {
    const [fields, setFields] = useState(allProductFieldDetails);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [searchText, setSearchText] = useState("");
    const [productOptions, setProductOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState([]);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [showAllFields, setShowAllFields] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [variantDetails, setVariantDetails] = useState([]);

    const [variantErrors, setVariantErrors] = useState([]);

    // Determine if it's an edit operation based on currentProductId prop
    const isEditMode = !!currentProductId;


    const initialValues = React.useMemo(() => allProductFieldDetails.reduce((acc, field) => {
        acc[field.id] = field.type === "number" ? null : field.type === "upload" ? (field.multiple ? [] : "") : "";
        return acc;
    }, {}), []);

    const initializeVariantData = useCallback(() => {
        return {
            ...variantProductFieldDetails.reduce((acc, field) => {
                acc[field.id] = field.type === "number" ? null : field.type === "upload" ? (field.multiple ? [] : "") : "";
                return acc;
            }, {}),
            isNew: true // Mark as new by default
        };
    }, []);

    useEffect(() => {
        if (open) {
            setFormData({ ...initialValues });
            setVariants([{ id: Date.now(), data: initializeVariantData() }]);
            setErrors({});
            setVariantErrors([]);
            setSearchText("");
            setProductOptions([]);
            setIsProductSelected(false);
            setShowAllFields(false);
            setHasVariants(false);
            setActiveTab(0);

            if (isEditMode && currentProductId) {
                fetchProductDetailsForEdit(currentProductId);
            }
        }
    }, [open, initialValues, initializeVariantData, isEditMode, currentProductId]);

    const fetchProductDetailsForEdit = useCallback(async (productId) => {
        setLoadingOptions(true);
        try {
            const res = await getCall(`/api/v1/seller/productId/${productId}/product`);
            const { commonDetails, variantSpecificDetails, variationOn } = res.data;

            // Populate common details, but we will GENERATE SKU on submission
            setFormData(commonDetails);

            // Populate variant details
            if (variationOn !== "None" && variantSpecificDetails && variantSpecificDetails.length > 0) {
                const initializedVariants = variantSpecificDetails.map(v => ({
                    id: Date.now() + Math.random(), // unique ID
                    data: {
                        ...initializeVariantData(),
                        ...v, // populate values from API
                        isNew: false,
                    }
                }));
                setVariants(initializedVariants);
                setHasVariants(true);
            } else {
                setVariants([{ id: Date.now(), data: initializeVariantData() }]);
                setHasVariants(false);
            }
            setIsProductSelected(true);
            setFields([...allProductFieldDetails]);
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
        if (!selectedProduct) {
            setIsProductSelected(false);
            setFormData({ ...initialValues });
            setFields([...allProductFieldDetails]); // Reset fields when no product is selected
            setErrors({});
            return;
        }

        setFormData({ ...initialValues });
        setErrors({});

        if (selectedProduct.id === -999) { // "Add New Product" selected
            const updatedFields = manualProductFieldDetails.filter(item => item.id !== "sku");
            const subCategoryIndex = updatedFields.findIndex((item) => item.id === "subCategory");
            const categoryList = await getProductCategory();
            if (subCategoryIndex !== -1) {
                updatedFields[subCategoryIndex].options = categoryList;
            }
            setFields(updatedFields);
        } else { // Existing product selected
            const filteredFields = allProductFieldDetails.filter(item => item.id !== "sku");
            setFields(filteredFields);
            await setMasterProduct(selectedProduct);
        }
        setIsProductSelected(true);
    }, [initialValues, getProductCategory, setMasterProduct]);

    useEffect(() => {
        if (!searchText || searchText.length < 3) return;
        const delayDebounce = setTimeout(async () => {
            setLoadingOptions(true);
            try {
                const url = `/api/v1/seller/product/search?keyword=${encodeURIComponent(searchText)}`;
                const result = await getCall(url);
                setProductOptions(result.data.length ? result.data : [{ id: -999, name: "\u2795 Add New Product" }]);
            } catch (e) {
                console.error(e);
                setProductOptions([]);
            } finally {
                setLoadingOptions(false);
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchText]);

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
        const variationFilterFields = fields.filter(f =>
            ["price", "purchasePrice", "availableQty", "uomValue", "sku", "imageUrls", "backImage"].includes(f.id)
        );

        let isVariantsValid = true;
        if (hasVariants) {
            isVariantsValid = validateVariantForm(variants, variationFilterFields, setVariantErrors);
        }
        const visibleFieldsMainTab = fields.filter(f =>
            !hasVariants || !variationFilterFields.find(vf => vf.id === f.id)
        );

        const isMainFormValid = validateProductForm(formData, visibleFieldsMainTab, setErrors);

        if (!isMainFormValid || !isVariantsValid) return;

        setLoadingSubmit(true);
        try {
            // *** SKU Generation Logic - IMPORTANT ***
            const commonDetailsToSend = { ...formData }; // Create a mutable copy

            // Generate SKU for the common product (if not using variants or as a base)
            // Ensure subCategory and productName are available for SKU generation
            if (!isEditMode) {
                if (commonDetailsToSend.subCategory && commonDetailsToSend.productName) {
                    commonDetailsToSend.sku = generateSKU("RET", commonDetailsToSend.subCategory);
                } else {
                    // Fallback or error if essential SKU components are missing
                    cogoToast.error("Cannot generate SKU: Missing sub-category or product name.");
                    setLoadingSubmit(false);
                    return;
                }
            }

            let variantSpecificDetailsToSend = undefined;
            if (hasVariants) {
                variantSpecificDetailsToSend = variants.map(v => {
                    const variantData = { ...v.data }; // Create a mutable copy

                    // Generate SKU for each variant
                    if (!isEditMode) {
                        if (commonDetailsToSend.subCategory && commonDetailsToSend.productName) {
                            var newSKU = generateSKU("RET", commonDetailsToSend.subCategory, commonDetailsToSend.productName);
                            variantData.sku = generateSKU("RET", commonDetailsToSend.subCategory, commonDetailsToSend.productName);
                        } else {
                            throw new Error("Cannot generate variant SKU: Missing common product details (subCategory or productName).");
                        }
                    }
                    if(isEditMode){
                        if(!variantData.productId){
                            variantData.productId = commonDetailsToSend.productId;
                        }
                        if(!variantData.productVariantId){
                            variantData.productVariantId = uuidv4();
                        }
                    }
                    return variantData;
                });
            }

            const payload = {
                commonDetails: commonDetailsToSend, // Use the updated commonDetails with SKU
                variationOn: hasVariants ? "UOM" : "None",
                variantSpecificDetails: variantSpecificDetailsToSend // Use the updated variant details with SKUs
            };

            let res;
            if (isEditMode) {
                const apiUrl = `/api/v1/seller/productId/${currentProductId}/product`;
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
        // if (newValue && isEditMode) {
        //         console.log("1 variants",variants);
        //         if (variants.length === 0 && variantDetails.length > 0) {
        //             console.log("2");
        //             const loadedVariants = variantDetails.map(v => ({
        //                 id: Date.now() + Math.random(),
        //                 data: {
        //                     ...initializeVariantData(),
        //                     ...v,
        //                     isNew: false,
        //                 }
        //             }));
        //             setVariants(loadedVariants);
        //         } else {
        //             console.log("3 formData",formData);
        //             setVariants([{
        //             id: Date.now(),
        //             data: {
        //                 ...initializeVariantData(), // Start with default variant data
        //                 // Extract relevant fields from formData to populate the first variant
        //                 price: formData.price,
        //                 purchasePrice:formData.purchasePrice,
        //                 availableQty: formData.availableQty,
        //                 sku:formData.sku,
        //                 uomValue:formData.uomValue,
        //                 backImage:formData.backImage,
        //                 imageUrls:formData.imageUrls
        //             }
        //         }]);
        //         }
        //     }else 
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
                            getOptionLabel={(opt) => typeof opt === 'string' ? opt : (opt?.name?.split("#!#")[0] || "")}
                            filterOptions={(x) => x}
                            onInputChange={(_, val, reason) => reason === "input" && setSearchText(val)}
                            onChange={handleProductSelect}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Existing Product"
                                    placeholder="e.g., Atta, Ashirvad"
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
                                                {loadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
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
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                            <Tab label="Product Details" {...a11yProps(0)} />
                            <Tab label="Variants" {...a11yProps(1)} disabled={!hasVariants} />
                        </Tabs>

                        <TabPanel value={activeTab} index={0}>
                            <Box className="details-section">
                                {(showAllFields
                                    ? fields.filter(f => !hasVariants || !variationFields.includes(f.id))
                                    : fields.filter(f => ["subCategory", "productName", "price", "gstPercentage", "purchasePrice"].includes(f.id) && (!hasVariants || !["price", "purchasePrice"].includes(f.id))))
                                    .map((item) => (
                                        <Grid item xs={12} key={item.id}>
                                            <RenderInput
                                                item={{ ...item, error: errors[item.id], helperText: errors[item.id], fullWidth: true }}
                                                previewOnly={isEditMode && item.id === "productCode"}
                                                state={formData}
                                                stateHandler={setFormData}
                                            />
                                        </Grid>
                                    ))}
                            </Box>
                            <Box textAlign="center">
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowAllFields(prev => !prev)}
                                    startIcon={showAllFields ? <CloseIcon /> : <AddCircleOutlineIcon />}
                                >
                                    {showAllFields ? "Hide Additional Product Fields" : "Show All Product Fields"}
                                </Button>
                            </Box>
                        </TabPanel>

                        <TabPanel value={activeTab} index={1}>
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
                                        fields={variantProductFieldDetails}
                                        onChange={(i, d) => handleVariantChange(i, d)}
                                        onRemove={handleVariantRemove}
                                        showRemoveButton={variants.length > 1 && !isEditMode}
                                        variantErrors={variantErrors[idx] || {}}
                                        isEditMode={isEditMode}
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