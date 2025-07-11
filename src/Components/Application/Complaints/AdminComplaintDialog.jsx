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
import { useLocation, useNavigate } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import RenderInput from "../../../utils/RenderInput";
import { allIssueFieldDetails } from "./issue-fields";
import cogoToast from "cogo-toast";



const AdminComplaintDialog = ({open, onClose}) => {
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

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const { state } = useLocation();
    const getMerchantList = async () => {
        try {
            const url = `/api/v1/seller/merchantName/all`;
            const result = await getCall(url);
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (open) {
            setFormData(initialValues);
            getMerchantList();
            // setProductOptions([]);
            // setShowAllFields(false);
            // setIsProductSelected(false);
            // setErrors({});
        }
    }, [open]);

    const handleSubmit = () => {
        const isValid = true;//validateProductForm(formData, fields, setErrors);
        if (!isValid) return;
        setLoadingSubmit(true);
        try {
            createComplaint();
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const createComplaint = async () => {
        let issue_data = Object.assign({}, formData);
        let api_url = `/api/v1/seller/complaint/create`;
        const res = await postCall(api_url, issue_data);
        console.log("res ",res);
        if (res.status && res.status !== 200) {
            cogoToast.error(res.message, { hideAfter: 5 });
        }
        if (res.status && res.status === 200) {
            cogoToast.success("Issue created and posted to buyer successfully!", { hideAfter: 5 });
            //refreshProducts?.();
            onClose();
        }
        //setSnackOpen(true);
    }

    getMerchantList().then((merchantList) => {
        const merchantIndex = fields.findIndex(
            (item) => item.id === "merchantId"
        );
        if (merchantIndex !== -1) {
            fields[merchantIndex].options = merchantList;
        }
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
                    <Typography variant="h6">Create Complaint</Typography>
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

export default AdminComplaintDialog;
