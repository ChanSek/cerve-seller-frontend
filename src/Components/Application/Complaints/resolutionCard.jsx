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

// ----------------------
// Styled MUI TextField
// ----------------------
const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "#1c75bc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1c75bc",
    },
  },
});

// ----------------------
// Action Types (single selection now)
// ----------------------
const ACTION_TYPES = {
  replaceIssue: "REPLACE_ISSUE",
  refundIssue: "REFUND_ISSUE",
  cascadeIssue: "CASCADE_ISSUE",
  noAction: "NO_ACTION",
  cancelIssue: "CANCEL_ISSUE",
};

// ----------------------
// Initial Resolution Entry Object
// ----------------------
const initialResolution = {
  id: Date.now(), // Unique ID (will be updated for each new entry)
  selectedAction: "", // Single action selection (instead of an array)
  globalShortDescription: "",
  refundShortDescription: "",
  replacementShortDescription: "",
  refundAmount: "",
  longDescription: "",
  errors: {} // For field-specific validation errors
};

// ------------------------------------------------------------
// ResolutionEntry Component (child component for one entry)
// ------------------------------------------------------------
function ResolutionEntry({ index, resolution, onChange, onRemove, disabled }) {
  // Change the selected action (only one allowed)
  const handleActionChange = (actionType) => {
    onChange({ ...resolution, selectedAction: actionType });
  };

  // Handle field changes
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

      {/* --- Action Selection (single selection) --- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <CustomRadioButton
          disabled={disabled}
          checked={resolution.selectedAction === ACTION_TYPES.noAction}
          onClick={() => handleActionChange(ACTION_TYPES.noAction)}
        >
          <div style={{ padding: "0 1rem" }}>
            <p>No Action</p>
          </div>
        </CustomRadioButton>
        {/* <CustomRadioButton
          disabled={disabled}
          checked={resolution.selectedAction === ACTION_TYPES.cancelIssue}
          onClick={() => handleActionChange(ACTION_TYPES.cancelIssue)}
        >
          <div style={{ padding: "0 1rem" }}>
            <p>Cancel</p>
          </div>
        </CustomRadioButton> */}
        <CustomRadioButton
          disabled={disabled}
          checked={resolution.selectedAction === ACTION_TYPES.replaceIssue}
          onClick={() => handleActionChange(ACTION_TYPES.replaceIssue)}
        >
          <div style={{ padding: "0 1rem" }}>
            <p>Replace</p>
          </div>
        </CustomRadioButton>
        <CustomRadioButton
          disabled={disabled}
          checked={resolution.selectedAction === ACTION_TYPES.refundIssue}
          onClick={() => handleActionChange(ACTION_TYPES.refundIssue)}
        >
          <div style={{ padding: "0 1rem" }}>
            <p>Refund</p>
          </div>
        </CustomRadioButton>
        {/* <CustomRadioButton
          disabled={disabled}
          checked={resolution.selectedAction === ACTION_TYPES.cascadeIssue}
          onClick={() => handleActionChange(ACTION_TYPES.cascadeIssue)}
        >
          <div style={{ padding: "0 1rem" }}>
            <p>Cascade</p>
          </div>
        </CustomRadioButton> */}
      </div>

      {/* --- Conditional Fields Based on the Selected Action --- */}
      {/* For actions other than Refund or Replace, show Global Short Description */}
      {resolution.selectedAction &&
        resolution.selectedAction !== ACTION_TYPES.refundIssue &&
        resolution.selectedAction !== ACTION_TYPES.replaceIssue && (
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Description <span style={{ color: "red" }}>*</span>
            </label>
            <CssTextField
              type="input"
              fullWidth
              size="small"
              placeholder="Short description"
              value={resolution.globalShortDescription}
              onChange={(e) =>
                handleFieldChange("globalShortDescription", e.target.value)
              }
              inputProps={{ maxLength: 50 }}
            />
            {resolution.errors?.globalShortDescription && (
              <ErrorMessage>{resolution.errors.globalShortDescription}</ErrorMessage>
            )}
          </div>
        )}

      {/* Refund-specific fields */}
      {resolution.selectedAction === ACTION_TYPES.refundIssue && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Description{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <CssTextField
              type="input"
              fullWidth
              size="small"
              placeholder="Description"
              value={resolution.refundShortDescription}
              onChange={(e) =>
                handleFieldChange("refundShortDescription", e.target.value)
              }
              inputProps={{ maxLength: 50 }}
            />
            {resolution.errors?.refundShortDescription && (
              <ErrorMessage>{resolution.errors.refundShortDescription}</ErrorMessage>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Refund Amount <span style={{ color: "red" }}>*</span>
            </label>
            <CssTextField
              type="number"
              fullWidth
              size="small"
              placeholder="Refund Amount"
              value={resolution.refundAmount}
              onChange={(e) =>
                handleFieldChange("refundAmount", e.target.value)
              }
              inputProps={{ maxLength: 6 }}
            />
            {resolution.errors?.refundAmount && (
              <ErrorMessage>{resolution.errors.refundAmount}</ErrorMessage>
            )}
          </div>
        </>
      )}

      {/* Replacement-specific field */}
      {resolution.selectedAction === ACTION_TYPES.replaceIssue && (
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Replacement Short Description{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <CssTextField
            type="input"
            fullWidth
            size="small"
            placeholder="Replacement short description"
            value={resolution.replacementShortDescription}
            onChange={(e) =>
              handleFieldChange("replacementShortDescription", e.target.value)
            }
            inputProps={{ maxLength: 50 }}
          />
          {resolution.errors?.replacementShortDescription && (
            <ErrorMessage>{resolution.errors.replacementShortDescription}</ErrorMessage>
          )}
        </div>
      )}

      {/* Long Description (optional) */}
      {/* <div style={{ marginBottom: "1rem" }}>
        <label>Long Description</label>
        <CssTextField
          type="input"
          fullWidth
          size="small"
          placeholder="Long description"
          value={resolution.longDescription}
          onChange={(e) =>
            handleFieldChange("longDescription", e.target.value)
          }
        />
      </div> */}
    </div>
  );
}

// ------------------------------------------------------------
// MultiResolutionModal Component (Modal with Single Selection)
// ------------------------------------------------------------
function MultiResolutionModal({ supportActionDetails, user, onSuccess, onClose }) {
  const [resolutions, setResolutions] = useState([{ ...initialResolution }]);
  const [loading, setLoading] = useState(false);

  // Update one resolution entry by index
  const handleResolutionChange = (index, updatedResolution) => {
    setResolutions((prev) => {
      const newResolutions = [...prev];
      newResolutions[index] = updatedResolution;
      return newResolutions;
    });
  };

  // Add a new resolution entry
  const handleAddResolution = () => {
    const newResolution = { ...initialResolution, id: Date.now() };
    setResolutions((prev) => [...prev, newResolution]);
  };

  // Remove a resolution entry by index
  const handleRemoveResolution = (index) => {
    setResolutions((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate one resolution entry and return an errors object (if any)
  const validateResolution = (resolution) => {
    const errors = {};

    if (!resolution.selectedAction) {
      errors.selectedAction = "Please select an action.";
    } else if (
      resolution.selectedAction !== ACTION_TYPES.refundIssue &&
      resolution.selectedAction !== ACTION_TYPES.replaceIssue
    ) {
      // For actions other than Refund or Replace, global short description is required.
      if (!resolution.globalShortDescription.trim()) {
        errors.globalShortDescription = "Please enter description";
      }
    }

    if (resolution.selectedAction === ACTION_TYPES.refundIssue) {
      if (!resolution.refundShortDescription.trim()) {
        errors.refundShortDescription = "Please enter description";
      }
      if (!resolution.refundAmount.trim()) {
        errors.refundAmount = "Please enter refund amount";
      }
    }

    if (resolution.selectedAction === ACTION_TYPES.replaceIssue) {
      if (!resolution.replacementShortDescription.trim()) {
        errors.replacementShortDescription = "Please enter description";
      }
    }

    return errors;
  };

  // Final submit: validate each entry and send the payload to the backend
  const handleFinalSubmit = async () => {
    let isValid = true;
    const updatedResolutions = resolutions.map((res) => {
      const errors = validateResolution(res);
      if (Object.keys(errors).length > 0) {
        isValid = false;
      }
      return { ...res, errors };
    });
    setResolutions(updatedResolutions);

    if (!isValid) {
      cogoToast.error("Please fix validation errors in one or more resolution entries.");
      return;
    }

    // Map the single selected action to the API payload format.
    const mapAction = (action) => {
      switch (action) {
        case ACTION_TYPES.replaceIssue:
          return "REPLACEMENT";
        case ACTION_TYPES.refundIssue:
          return "REFUND";
        case ACTION_TYPES.noAction:
          return "NO-ACTION";
        case ACTION_TYPES.cascadeIssue:
          return "CASCADED";
        case ACTION_TYPES.cancelIssue:
          return "CANCEL";
        default:
          return "";
      }
    };

    const payloadResolutions = updatedResolutions.map((res) => {

      let short_desc = "";
      if (res.selectedAction === ACTION_TYPES.refundIssue) {
        short_desc = res.refundShortDescription;
      } else if (res.selectedAction === ACTION_TYPES.replaceIssue) {
        short_desc = res.replacementShortDescription;
      } else {
        short_desc = res.globalShortDescription;
      }

      const actionObj = { action_triggered: mapAction(res.selectedAction), short_desc };
      if (res.selectedAction === ACTION_TYPES.refundIssue) {
        actionObj.refund_amount = res.refundAmount;
      }

      return {
        actions: [actionObj],
      };
    });
    
    // Build the full payload (adjust API path and structure as needed)
    const body = {
      resolutions: payloadResolutions,
      updated_by: user?.name
    //   updated_by: {
    //     org: {
    //       name: supportActionDetails.bppDomain,
    //     },
    //     contact: {
    //       phone: user?.mobile,
    //       email: user?.email,
    //     },
    //     person: {
    //       name: user?.name,
    //     },
    //   },
    };
    const actions = body.resolutions.flatMap(resolution => resolution.actions);
    body.resolutions = actions;   
    setLoading(true);
    try {
      const resp = await postCall(
        `/api/v1/seller/${supportActionDetails._id}/resolution`,
        body
      );
      setLoading(false);
      if (resp?.status === 200) {
        onSuccess(supportActionDetails.transactionId);
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
        <div className={styles.card_footer}>
          <Button type="button" title="Cancel" onClick={onClose} disabled={loading} />
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
}

export default MultiResolutionModal;
