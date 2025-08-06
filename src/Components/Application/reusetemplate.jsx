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
import { useLocation, useNavigate } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allIssueFieldDetails } from "./issue-fields";

const AdminTemplateDialog = ({open, onClose}) => {
    const [fields, setFields] = useState(allIssueFieldDetails);
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
    const getAdminComplaints = async () => {
        // try {
        //     const url = `/api/v1/seller/reference/category`;
        //     const result = await getCall(url);
        //     return result.data;
        // } catch (error) {
        //     console.log(error);
        // }
    }
    useEffect(() => {
        if (open) {
            setFormData(initialValues);
            getAdminComplaints();
            setProductOptions([]);
            setShowAllFields(false);
            setIsProductSelected(false);
            setErrors({});
        }
    }, [open]);

    const handleSubmit = () => {
        // const isValid = true;//validateProductForm(formData, fields, setErrors);
        // if (!isValid) return;
        // setLoadingSubmit(true);
        // try {
        //     addProduct();
        // } catch (err) {
        //     console.error("Submission error", err);
        // } finally {
        //     setLoadingSubmit(false);
        // }
    };

    const addProduct = async () => {
        // let product_data = Object.assign({}, formData);
        // let data = { commonDetails: product_data, variationOn: "None" };
        // let api_url = `/api/v1/seller/storeId/${storeId}/product`;
        // const res = await postCall(api_url, data)
        // if (res.status && res.status !== 200) {
        //     cogoToast.error(res.message, { hideAfter: 5 });
        // }
        // if (res.status && res.status === 200) {
        //     cogoToast.success("Product added successfully!", { hideAfter: 5 });
        //     refreshProducts?.();
        //     onClose();
        // }
        //setSnackOpen(true);
    }

    getAdminComplaints().then((categoryList) => {
       
        // setFields(updatedFields); // Set fields only after setting category options
        // setFormData((prev) => ({
        //     ...prev,
        //     fulfillmentOption: formData.fulfillmentOption || "Delivery" || "",
        //     minAllowedQty: formData.minAllowedQty || 1,
        // }));
    });

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
                    {fields.map((item) => (
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

export default AdminTemplateDialog;
