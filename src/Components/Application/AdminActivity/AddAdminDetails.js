// src/components/AdminDetails/AddAdminDetails.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Modal, Box } from "@mui/material";
import RenderInput from "../../../utils/RenderInput"; // Assuming RenderInput correctly handles value access

const AddAdminDetails = ({ isOpen, onClose, onSave, selectedSection, initialData }) => {
    const [errors, setErrors] = useState({});
    // Initialize with empty strings or default structure, not "123"
    // The initialData will then properly fill these
    const [formData, setFormData] = useState({});

    useEffect(() => {
        console.log("initialData "+initialData);
        if (initialData) {
            setFormData((prev) => {
                const newFormData = { ...prev };
console.log("initialData "+initialData);
                // Handle basicDetail: Prefer initialData, or default to prev
                if (initialData.basicDetail) {
                    newFormData.basicDetail = { ...prev.basicDetail, ...initialData.basicDetail };
                } else {
                    newFormData.basicDetail = { gstin: "" }; // Reset if no initial data
                }

                // Handle basicDetail: Prefer initialData, or default to prev
                if (initialData.contactDetail) {
                    newFormData.contactDetail = { ...prev.contactDetail, ...initialData.contactDetail };
                } else {
                    newFormData.contactDetail = { email: "", phone: "" }; // Reset if no initial data
                }


                // Handle bppDescriptor: Prefer initialData, or default to prev
                if (initialData.bppDescriptor) {
                    newFormData.bppDescriptor = { ...prev.bppDescriptor, ...initialData.bppDescriptor };
                } else {
                    newFormData.bppDescriptor = { name: "", short_desc: "", long_desc: "", images: "" }; // Reset if no initial data
                }

                // Handle bankDetails: Map and merge, or reset array
                if (initialData.bankDetails && Array.isArray(initialData.bankDetails)) {
                    newFormData.bankDetails = initialData.bankDetails.map((bank, index) => {
                        return {
                            ...prev.bankDetails[index], // Keep previous values not in initialData
                            ...bank // Overwrite with initialData values
                        };
                    });
                    // Ensure the array always has 2 bank detail objects
                    while (newFormData.bankDetails.length < 2) {
                        newFormData.bankDetails.push({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "",branch_name:"" });
                    }
                } else {
                    newFormData.bankDetails = [
                        { accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "",branch_name:"" },
                        { accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "",branch_name:"" },
                    ]; // Reset if no initial data
                }
                return newFormData;
            });
        }
    }, [initialData]);


    const basicFields = [
        { id: "gstin", title: "GSTIN", placeholder: "GSTIN", type: "input", required: true },
    ];

    const contactFields = [
        { id: "email", title: "Email", placeholder: "Email", type: "input", required: true },
        { id: "phone", title: "Phone", placeholder: "Phone", type: "number", required: true },
    ];

    const bppFields = [
        { id: "name", title: "SNP Name", type: "input", required: true },
        { id: "short_desc", title: "Short Description", type: "input", required: true },
        { id: "long_desc", title: "Long Description", type: "input", required: true },
        { id: "buyer_fee_tax", title: "Tax on Buyer Fee", type: "number", required: true },
        { id: "images", title: "Images", type: "upload", required: true, file_type: "product_image" },
    ];

    const bankFields = [
        { id: "bank_name", title: "Bank Name", type: "input", required: true },
        { id: "ifsc_code", title: "IFSC Code", type: "input", required: true },
        { id: "account_holder_name", title: "Account Holder Name", type: "input", required: true },
        { id: "account_number", title: "Account Number", type: "input", required: true },
        { id: "branch_name", title: "Branch Name", type: "input", required: true },
    ];

    const validate = () => {
        const formErrors = {};
        // console.log("formData for validation ", formData);
        if (selectedSection === "basic") {
            basicFields.forEach(({ id, required }) => {
                if (required && (!formData.basicDetail || !formData.basicDetail[id]?.trim())) {
                    formErrors[id] = "This field is required";
                }
            });
        } else if (selectedSection === "bppDescriptor") {
            bppFields.forEach(({ id, required }) => {
                if (required && (!formData.bppDescriptor || !formData.bppDescriptor[id]?.toString().trim())) {
                    formErrors[id] = "This field is required";
                }
            });
        } else if (selectedSection === "operativeBank" || selectedSection === "nonOperativeBank") {
            const index = selectedSection === "operativeBank" ? 0 : 1;
            bankFields.forEach(({ id, required }) => {
                if (required && (!formData.bankDetails?.[index] || !formData.bankDetails[index][id]?.trim())) {
                    formErrors[id] = "This field is required";
                }
            });
        } else if (selectedSection === "contact") {
            contactFields.forEach(({ id, required }) => {
                if (required && (!formData.contactDetail || !formData.contactDetail[id]?.trim())) {
                    formErrors[id] = "This field is required";
                }
            });
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onChange = useCallback((selected, updatedData) => {
        // console.log("onChange updatedData ", updatedData, " for selected:", selected);
        setFormData((prev) => {
            const updatedForm = { ...prev };
            console.log("updatedData ", updatedData);
            if (selected === "basicFields") { // This 'selected' string needs to match what you pass from RenderInput
                updatedForm.basicDetail = {
                    ...prev.basicDetail,
                    ...updatedData // updatedData should be like { fieldId: newValue }
                };
            } else if (selected === "bppDescriptor") {
                updatedForm.bppDescriptor = {
                    ...prev.bppDescriptor,
                    ...updatedData
                };
            } else if (selected === "operativeBank" || selected === "nonOperativeBank") {
                const index = selected === "operativeBank" ? 0 : 1;
                const updatedBankDetails = [...prev.bankDetails];
                updatedBankDetails[index] = {
                    ...updatedBankDetails[index],
                    ...updatedData
                };
                updatedForm.bankDetails = updatedBankDetails;
            } else if (selected === "contactFields") { // This 'selected' string needs to match what you pass from RenderInput
                updatedForm.contactDetail = {
                    ...prev.contactDetail,
                    ...updatedData // updatedData should be like { fieldId: newValue }
                };
            }
            return updatedForm;
        });
    }, []);


    const handleSave = () => {
        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    const renderSection = () => {
        switch (selectedSection) {
            case "basic":
                return (
                    <>
                        <h3 className="font-semibold mb-2">Basic Details</h3>
                        {basicFields.map((item) => (
                            <RenderInput
                                key={item.id}
                                item={{
                                    ...item,
                                    error: Boolean(errors[item.id]),
                                    helperText: errors[item.id],
                                    fullWidth: true,
                                }}
                                // Pass the specific sub-object to state
                                state={formData.basicDetail}
                                stateHandler={(updated) =>
                                    onChange("basicFields", { [item.id]: updated[item.id] })
                                }
                                path={[item.id]} // Path within the basicDetail object
                            />
                        ))}
                    </>
                );

            case "bppDescriptor":
                return (
                    <>
                        <h3 className="font-semibold mb-2">BPP Descriptor</h3>
                        {bppFields.map((item) => (
                            <RenderInput
                                key={item.id}
                                item={{
                                    ...item,
                                    error: Boolean(errors[item.id]),
                                    helperText: errors[item.id],
                                    fullWidth: true,
                                }}
                                // Pass the specific sub-object to state
                                state={formData.bppDescriptor}
                                stateHandler={(updated) =>
                                    onChange("bppDescriptor", { [item.id]: updated[item.id] })
                                }
                                path={[item.id]} // Path within the bppDescriptor object
                            />
                        ))}
                    </>
                );

            case "operativeBank":
            case "nonOperativeBank":
                const index = selectedSection === "operativeBank" ? 0 : 1;
                return (
                    <>
                        <h3 className="font-semibold mb-2">
                            {selectedSection === "operativeBank"
                                ? "Operative Bank"
                                : "Non-Operative Bank"}{" "}
                            Details
                        </h3>
                        {bankFields.map((item) => (
                            <RenderInput
                                key={item.id}
                                item={{
                                    ...item,
                                    error: Boolean(errors[item.id]),
                                    helperText: errors[item.id],
                                    fullWidth: true,
                                }}
                                // Pass the specific bank object from the array to state
                                state={formData.bankDetails[index]}
                                stateHandler={(updated) =>
                                    onChange(selectedSection, { [item.id]: updated[item.id] })
                                }
                                path={[item.id]} // Path within the specific bank object
                            />
                        ))}
                    </>
                );
            case "contact":
                return (
                    <>
                        <h3 className="font-semibold mb-2">contact Details</h3>
                        {contactFields.map((item) => (
                            <RenderInput
                                key={item.id}
                                item={{
                                    ...item,
                                    error: Boolean(errors[item.id]),
                                    helperText: errors[item.id],
                                    fullWidth: true,
                                }}
                                // Pass the specific sub-object to state
                                state={formData.contactDetail}
                                stateHandler={(updated) =>
                                    onChange("contactFields", { [item.id]: updated[item.id] })
                                }
                                path={[item.id]} // Path within the basicDetail object
                            />
                        ))}
                    </>
                );
            default:
                return <p>Select a section to add details.</p>;
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50vw",
                    height: "auto",
                    maxHeight: "85vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflowY: "auto",
                }}
            >
                {/* <h2 className="text-xl font-bold mb-4">Add Admin Detail</h2> */}
                <div className="mb-4">{renderSection()}</div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default AddAdminDetails;