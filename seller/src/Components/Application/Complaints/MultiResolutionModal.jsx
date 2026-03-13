import React, { useState } from "react";
import Button from "../../Shared/Button";
import CustomRadioButton from "./CustomRadioButton";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { TextField } from "@mui/material";
import styled from "@emotion/styled";
import ErrorMessage from "../../Shared/ErrorMessage";
import CrossIcon from "../../Shared/svg/cross-icon";
import styles from "../../../Styles/actionCard.module.scss";

const initialResolution = {
    id: Date.now(),
    selectedAction: "",
    refundAmount: "",
    errors: {},
};


const actions = [
    {
        key: "noAction",
        label: "No Action",
        description: "No action will be taken for this issue."
    },
    {
        key: "replaceIssue",
        label: "Replace",
        description: "The item will be replaced with a new one."
    },
    {
        key: "refundIssue",
        label: "Refund",
        description: "The customer will be refunded for the item."
    },
    {
        key: "cancel",
        label: "Cancel Order",
        description: "The entire order will be canceled."
    },
];

const MultiResolutionModal = ({ complaintId, open, onClose,refreshComplaints }) => {
    const [resolutions, setResolutions] = useState([{ ...initialResolution }]);
    const [loading, setLoading] = useState(false);

    const handleResolutionChange = (index, updatedResolution) => {
        setResolutions((prev) => {
            const newResolutions = [...prev];
            newResolutions[index] = updatedResolution;
            return newResolutions;
        });
    };

    const handleAddResolution = () => {
        const newResolution = { ...initialResolution, id: Date.now() };
        setResolutions((prev) => [...prev, newResolution]);
    };

    const handleRemoveResolution = (index) => {
        setResolutions((prev) => prev.filter((_, i) => i !== index));
    };

    const getAvailableActions = (index) => {
        const usedActions = resolutions.map((res) => res.selectedAction).filter(Boolean);
        return actions.filter((action) => !usedActions.includes(action.key) || resolutions[index]?.selectedAction === action.key);
    };

    const validateResolution = (resolution) => {
        const errors = {};

        if (!resolution.selectedAction) {
            errors.selectedAction = "Please select an action.";
        } else {
            if (resolution.selectedAction === "refundIssue") {
                if (!resolution.refundAmount.trim()) {
                    errors.refundAmount = "Please enter refund amount";
                }
            }
        }

        return errors;
    };
    const mapAction = (action) => {
        switch (action) {
            case "replaceIssue":
                return "REPLACEMENT";
            case "refundIssue":
                return "REFUND";
            case "noAction":
                return "NO-ACTION";
            case "cancel":
                return "CANCEL";
            default:
                return ""; // Return an empty string only if action is truly invalid
        }
    };

    const handleFinalSubmit = async () => {
        let isValid = true;
        const errorMessages = [];
        if(!resolutions || resolutions.length == 0){
            cogoToast.error("Please add atleast one resolution");
            return;
        }
        // Validate resolutions and update errors
        const updatedResolutions = resolutions.map((res, index) => {
            const errors = validateResolution(res);
            if (Object.keys(errors).length > 0) {
                isValid = false;
                // Collect error messages for this resolution
                Object.entries(errors).forEach(([field, message]) => {
                    errorMessages.push(`Resolution #${index + 1}: ${field} - ${message}`);
                });
            }
            return { ...res, errors };
        });

        // Update state with errors
        setResolutions(updatedResolutions);

        if (!isValid) {
            errorMessages.forEach((msg) => cogoToast.error(msg));
            return;
        }

        // Prepare payload with non-empty `action_triggered`
        const payloadResolutions = updatedResolutions.map((res) => {
            const actionTriggered = mapAction(res.selectedAction);
            if (!actionTriggered) {
                cogoToast.error("One or more actions are invalid.");
                isValid = false;
            }

            const actionDetails = actions.find((action) => action.key === res.selectedAction);
            const short_desc = actionDetails?.description || "";

            const actionObj = { action_triggered: actionTriggered, short_desc };
            if (res.selectedAction === "refundIssue") {
                actionObj.refund_amount = res.refundAmount;
            }

            return { actions: [actionObj] };
        });

        if (!isValid) {
            return;
        }

        const body = {
            resolutions: payloadResolutions.flatMap((res) => res.actions), // Flatten resolutions
        };

        setLoading(true);

        try {
            const resp = await postCall(
                `/api/v1/seller/${complaintId}/resolution`,
                body
            );
            setLoading(false);

            if (resp?.status === 200) {
                cogoToast.info(resp.message);
                refreshComplaints();
                onClose();
            } else {
                cogoToast.error(resp.message);
            }
        } catch (error) {
            setLoading(false);
            cogoToast.error(error.response?.data?.error || "An error occurred");
        }
    };


    return (
        <div className={styles.overlay}>
            <div className={styles.popup_card}>
                {/* Modal Header */}
                <div
                    className={styles.card_header}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2>Proposed Resolutions</h2>
                    <CrossIcon
                        width="20"
                        height="20"
                        style={{ cursor: "pointer" }}
                        onClick={onClose}
                    />
                </div>

                {/* Modal Body */}
                <div className={styles.card_body}>
                    {resolutions.map((res, index) => (
                        <ResolutionEntry
                            key={res.id}
                            index={index}
                            resolution={res}
                            onChange={(updatedRes) => handleResolutionChange(index, updatedRes)}
                            onRemove={() => handleRemoveResolution(index)}
                            disabled={loading}
                            availableActions={getAvailableActions(index)}
                        />
                    ))}
                    <Button
                        type="button"
                        title="Add More Resolution"
                        onClick={handleAddResolution}
                        disabled={loading}
                    />
                </div>

                {/* Modal Footer */}
                <div className={styles.card_footer} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="button"
                        title="Cancel"
                        onClick={onClose}
                        disabled={loading}
                        style={{ marginRight: "1rem" }}
                    />
                    <Button
                        type="button"
                        title="Submit"
                        variant="contained"
                        onClick={handleFinalSubmit}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

function ResolutionEntry({ index, resolution, onChange, onRemove, disabled, availableActions }) {
    const handleActionChange = (actionType) => {
        onChange({ ...resolution, selectedAction: actionType, refundAmount: "" });
    };

    const handleFieldChange = (field, value) => {
        onChange({ ...resolution, [field]: value });
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h3>Resolution #{index + 1}</h3>
                {onRemove && (
                    <button
                        onClick={onRemove}
                        disabled={disabled}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "red",
                        }}
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Action Selection */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                }}
            >
                {availableActions.map((action) => (
                    <CustomRadioButton
                        key={action.key}
                        disabled={disabled}
                        checked={resolution.selectedAction === action.key}
                        onClick={() => handleActionChange(action.key)}
                    >
                        <div style={{ padding: "0 1rem" }}>
                            <p>{action.label}</p>
                        </div>
                    </CustomRadioButton>
                ))}
            </div>

            {/* Conditional Fields */}
            {resolution.selectedAction === "refundIssue" && (
                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Refund Amount <span style={{ color: "red" }}>*</span>
                    </label>
                    <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        placeholder="Refund Amount"
                        value={resolution.refundAmount}
                        onChange={(e) => {
                            // Validate input for up to 2 decimal places
                            const value = e.target.value;
                            const regex = /^\d{0,10}(\.\d{0,2})?$/; // Match numbers with up to 2 decimals
                            if (regex.test(value)) {
                                handleFieldChange("refundAmount", value);
                            }
                        }}
                        inputProps={{
                            inputMode: "decimal", // Mobile-friendly numeric input
                            pattern: "[0-9]*\\.?[0-9]{0,2}", // Optional HTML validation pattern
                        }}
                    />
                </div>
            )}

        </div>
    );
}

export default MultiResolutionModal;
