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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getCall, putCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allProductFieldDetails } from "./gen-product-fields";
import cogoToast from "cogo-toast";
import { validateProductForm } from "./validateProductForm";

const EditProductDialog = ({ storeId, productId, open, onClose, refreshProducts }) => {
    const [fields, setFields] = useState(allProductFieldDetails);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
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
    useEffect(() => {
        if (open && productId) {
            fetchProductDetails();
        }
    }, [open, productId]);

    const fetchProductDetails = async () => {
        try {
            const res = await getCall(`/api/v1/seller/productId/${productId}/product`);
            setFormData({
                ...res.data?.commonDetails
            });
        } catch (error) {
            cogoToast.error("Failed to fetch product details");
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        const isValid = validateProductForm(formData, fields, setErrors);
        if (!isValid) return;

        setLoadingSubmit(true);
        try {
            const productData = { commonDetails: formData, variationOn: "None" };
            const res = await putCall(`/api/v1/seller/productId/${productId}/product`, productData);

            if (res.status === 200) {
                cogoToast.success("Product updated successfully!");
                refreshProducts?.();
                onClose();
            } else {
                cogoToast.error(res.message || "Update failed");
            }
        } catch (err) {
            cogoToast.error("Error while updating product");
            console.error(err);
        } finally {
            setLoadingSubmit(false);
        }
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { minHeight: "60vh", borderRadius: 2, p: 2 } }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Edit Product</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {fields.map((item) => (
                    <RenderInput
                        key={item.id}
                        previewOnly={item.id === "productCode"}
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
                    {loadingSubmit ? <CircularProgress size={24} /> : "Update"}
                </Button>
            </DialogActions>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                message="Product updated successfully!"
            />
        </Dialog>
    );
};

export default EditProductDialog;
