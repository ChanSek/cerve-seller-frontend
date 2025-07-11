import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
    CircularProgress,
    Snackbar,
    Autocomplete,
    TextField,
    Box,
    Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allProductFieldDetails } from "./gen-product-fields";
import { manualProductFieldDetails } from "./manual-product-fields";
import { validateProductForm } from "./validateProductForm";
import cogoToast from "cogo-toast";



const AddProductDialog = ({ storeId, category, open, onClose, onSubmit, refreshProducts }) => {
    const [fields, setFields] = useState(allProductFieldDetails);
    const initialValues = fields.reduce((acc, field) => {
        // Set default value based on field type or requirements
        if (field.type === "number") {
            acc[field.id] = null;
        } else if (field.type === "select") {
            acc[field.id] = "";
        } else if (field.type === "upload") {
            acc[field.id] = field.multiple ? [] : "";
        } else {
            acc[field.id] = "";
        }
        return acc;
    }, {});
    const [formData, setFormData] = useState({ ...initialValues });
    const [errors, setErrors] = useState({});

    const [searchText, setSearchText] = useState("");
    const [productOptions, setProductOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [showAllFields, setShowAllFields] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const { state } = useLocation();
    useEffect(() => {
        if (open) {
            setFormData(initialValues); // reset when dialog opens
            setProductOptions([]);
            setShowAllFields(false);
            setIsProductSelected(false);
            setErrors({});
        }
    }, [open]);
    const ADD_NEW_PRODUCT_OPTION = {
        id: -999,
        name: "➕ No Product Matched! Please Improve the Searched Text or Click to add New Product."
    };

    const handleProductSelect = (event, selectedProduct) => {
        if (!selectedProduct) return;
        setFormData(initialValues);
        setErrors({});
        if (selectedProduct.id != -999) {
            const updatedFields = [...allProductFieldDetails];
            setFields(updatedFields);
            setMasterProduct(selectedProduct);
        } else {
            const updatedFields = [...manualProductFieldDetails]; // Use manualProductFieldDetails directly
            const subCategoryIndex = updatedFields.findIndex(
                (item) => item.id === "subCategory"
            );
            getProductCategory().then((categoryList) => {
                if (subCategoryIndex !== -1) {
                    updatedFields[subCategoryIndex].options = categoryList;
                }
                setFields(updatedFields); // Set fields only after setting category options
                setFormData((prev) => ({
                    ...prev,
                    fulfillmentOption: formData.fulfillmentOption || "Delivery" || "",
                    minAllowedQty: formData.minAllowedQty || 1,
                }));
            });
        }
        setIsProductSelected(true);
        setShowAllFields(false); // Reset to collapsed state
    };

    const getProductCategory = async () => {
        try {
            const url = `/api/v1/seller/reference/category/${category}`;
            const result = await getCall(url);
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }

    const setMasterProduct = async (selectedProduct) => {
        getCall(
            `/api/v1/seller/product/master/${selectedProduct.id}`
        )
            .then(async (resp) => {
                if (resp.data.commonDetails) {
                    // Refer to the product image.
                    var commonDetails = resp.data.commonDetails;
                    if (!commonDetails.additiveInfo) {
                        commonDetails.additiveInfo = "Refer to the product image.";
                    }
                    if (!commonDetails.instructions) {
                        commonDetails.instructions = "Refer to the product image.";
                    }
                    if (!commonDetails.nutritionalInfo) {
                        commonDetails.nutritionalInfo = "Refer to the product image.";
                    }
                    if (!commonDetails.manufacturerName) {
                        commonDetails.manufacturerName = "Refer to the product image.";
                    }
                    if (!commonDetails.manufacturerAddress) {
                        commonDetails.manufacturerAddress = "Refer to the product image.";
                    }
                    if (!commonDetails.ingredientsInfo) {
                        commonDetails.ingredientsInfo = "Refer to the product image.";
                    }
                    setFormData({ ...commonDetails });
                }
            })
            .catch((error) => {
                cogoToast.error("Something went wrong!");
                console.log(error);
            });
    };
    useEffect(() => {
        const fetchSuggestions = async () => {
            setProductOptions([]);
            if (!searchText.trim() || searchText.trim().length < 3) return;
            setLoadingOptions(true);
            try {
                const url = `/api/v1/seller/product/search?keyword=${encodeURIComponent(searchText)}`;
                const result = await getCall(url);
                setProductOptions(result.data.length > 0 ? result.data : [ADD_NEW_PRODUCT_OPTION] || []);
            } catch (err) {
                console.error("Product fetch error", err);
            } finally {
                setLoadingOptions(false);
            }
        };
        const debounce = setTimeout(fetchSuggestions, 400);
        return () => clearTimeout(debounce);
    }, [searchText]);

    const handleSubmit = () => {
        const isValid = validateProductForm(formData, fields, setErrors);
        if (!isValid) return;
        setLoadingSubmit(true);
        try {
            addProduct();
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const addProduct = async () => {
        let product_data = Object.assign({}, formData);
        let data = { commonDetails: product_data, variationOn: "None" };
        let api_url = `/api/v1/seller/storeId/${storeId}/product`;
        const res = await postCall(api_url, data)
        if (res.status && res.status !== 200) {
            cogoToast.error(res.message, { hideAfter: 5 });
        }
        if (res.status && res.status === 200) {
            cogoToast.success("Product added successfully!", { hideAfter: 5 });
            refreshProducts?.();
            onClose();
        }
        //setSnackOpen(true);
    }

    const initiallyVisibleFieldIds = ["subCategory", "productName", "price", "gstPercentage", "purchasePrice"];

    const visibleFields = showAllFields
        ? fields
        : fields.filter((field) => initiallyVisibleFieldIds.includes(field.id));

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { minHeight: "60vh", borderRadius: 2, p: 2 } }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Add Product</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Autocomplete
                        freeSolo
                        options={productOptions}
                        loading={loadingOptions}
                        getOptionLabel={(option) => {
                            if (typeof option === "string") return option;
                            const [title] = option.name?.split("#!#") || [];
                            console.log("" + `${title?.trim()}-${option.id}`);
                            return `${title?.trim()}`;  // <-- ensures uniqueness
                        }
                        }
                        filterOptions={(x) => x}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") {
                                setSearchText(value); // only set and trigger search when typing
                            }
                        }}
                        onChange={handleProductSelect}
                        noOptionsText={
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="primary">
                                    ➕ Add New Product
                                </Typography>
                            </Box>
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant={params.variant || "standard"}
                                label="Search Product"
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <SearchIcon sx={{ mr: 1, color: "gray" }} />
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => {
                            const [productName, imageUrl, brand, manufacturer, uom, uomValue] =
                                option.name?.split("#!#") || [];
                            console.log("option.name " + JSON.stringify(option));
                            return (
                                <Box
                                    component="li"
                                    {...props}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        paddingY: 1,
                                    }}
                                >
                                    {brand && <Avatar
                                        variant="rounded"
                                        src={imageUrl?.trim()}
                                        alt={productName}
                                        sx={{ width: 56, height: 56 }}
                                    />}
                                    {brand && <Box>
                                        <Typography fontWeight="bold">{productName?.trim()}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {brand?.trim()} | {uomValue?.trim()} {uom?.trim()}
                                        </Typography>
                                    </Box>}
                                    {!brand && <Box>
                                        <Typography fontWeight="bold">{productName?.trim()}</Typography>
                                    </Box>}
                                </Box>
                            );
                        }}
                    />
                    {isProductSelected && visibleFields.map((item) => (
                        <RenderInput
                            key={item.id}
                            previewOnly={state?.productId && item?.id === "productCode" ? true : false}
                            item={{
                                ...item,
                                error: errors?.[item.id] ? true : false,
                                helperText: errors?.[item.id] || "",
                            }}
                            state={formData}
                            stateHandler={setFormData}
                        />
                    ))}

                    {isProductSelected && (
                        <Button
                            variant="text"
                            onClick={() => setShowAllFields((prev) => !prev)}
                            sx={{ mt: 2 }}
                        >
                            {showAllFields ? "Show Less" : "Show More"}
                        </Button>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loadingSubmit}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={loadingSubmit}>
                        {loadingSubmit ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                message="Product added successfully!"
            />
        </>
    );
};

export default AddProductDialog;
