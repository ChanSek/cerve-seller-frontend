import React, { useState } from "react";
import CrossIcon from "../../Shared/svg/cross-icon";
import Button from "../../Shared/Button";
import { postCall } from "../../../Api/axios";
import CustomRadioButton from "./CustomRadioButton";
import cogoToast from "cogo-toast";
import ErrorMessage from "../../Shared/ErrorMessage";
import { ONDC_COLORS } from "../../Shared/Colors";
import { TextField, Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { actionCardStyles } from "../../../Styles/actionCardStyles";

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#e0e0e0",
    "& fieldset": {
      borderColor: "#8888aa",
    },
    "&:hover fieldset": {
      borderColor: "#6c5ce7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6c5ce7",
    },
  },
  "& .MuiInput-root": {
    color: "#e0e0e0",
    "&:before": {
      borderBottomColor: "#8888aa",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#6c5ce7",
    },
    "&:after": {
      borderBottomColor: "#6c5ce7",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#8888aa",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: "#8888aa",
  },
});

export default function CustomerActionCard({
  supportActionDetails,
  onClose,
  onSuccess,
  user
}) {

  // CONSTANTS
  const ACTION_TYPES = {
    replaceIssue: "REPLACE_ISSUE",
    refundIssue: "REFUND_ISSUE",
    cascadeIssue: "CASCADE_ISSUE",
    noAction: "NO_ACTION",
    cancelIssue: "CANCEL_ISSUE",
  };

  // STATES
  const [inlineError, setInlineError] = useState({
    remarks_error: "",
    refund_amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const [selectedCancelType, setSelectedCancelType] = useState(ACTION_TYPES.noAction);

  // use this function to check the user entered remarks
  function checkRemarks() {
    if (shortDescription === "") {
      setInlineError((error) => ({
        ...error,
        remarks_error: "Please enter short description",
      }));
      return false;
    }
    return true;
  }

  // use this function to check the refund amount
  function checkRefund() {
    if (refundAmount === "") {
      setInlineError((error) => ({
        ...error,
        refund_amount: "Please enter refund amount",
      }));
      return false;
    }
    return true;
  }

  async function onSubmit() {
    if (selectedCancelType === ACTION_TYPES.refundIssue && !checkRefund() && !checkRemarks()) {
      return;
    }
    if (!checkRemarks()) {
      return;
    }
    setLoading(true);
    const { context } = supportActionDetails;

    function getAction() {
      switch (selectedCancelType) {
        case ACTION_TYPES.replaceIssue: return "REPLACEMENT"
        case ACTION_TYPES.refundIssue: return "REFUND"
        case ACTION_TYPES.noAction: return "NO-ACTION"
        case ACTION_TYPES.cascadeIssue: return "CASCADED"
        case ACTION_TYPES.cancelIssue: return "CANCEL"
        default:
          break;
      }
    }

    const body = {
      "respondent_action": selectedCancelType === ACTION_TYPES.cascadeIssue ? "CASCADED" : "RESOLVED",
      "action_triggered" : getAction(),
      "short_desc": shortDescription,
      "long_desc": longDescription,
      "updated_by": {
        "org": {
          "name": supportActionDetails.bppDomain
        },
        "contact": {
          "phone": user?.mobile,
          "email": user?.email
        },
        "person": {
          "name": user?.name
        }
      }
    }
    if(selectedCancelType === ACTION_TYPES.refundIssue){
      body.refund_amount = refundAmount
    }
    postCall(`/api/v1/seller/${supportActionDetails._id}/issue_response`, body)
      .then((resp) => {
        setLoading(false)
        if (resp?.status === 200) {
          onSuccess(supportActionDetails.transactionId)
        } else {
          cogoToast.error(resp.message);
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
        cogoToast.error(error.response.data.message);
      });
  }

  return (
    <Box sx={actionCardStyles.overlay}>
      <Box sx={actionCardStyles.popupCard}>
        <Box sx={{ ...actionCardStyles.cardHeader, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={actionCardStyles.cardHeaderTitle}>Take Action</Typography>
          <div className="ms-auto">
            <CrossIcon
              width="20"
              height="20"
              color={ONDC_COLORS.SECONDARYCOLOR}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </Box>

        <Box sx={actionCardStyles.cardHeader}>
          <Box sx={{ display: "flex" }}>
            <CustomRadioButton
              disabled={loading}
              checked={selectedCancelType === ACTION_TYPES.noAction}
              onClick={() => {
                setSelectedCancelType(ACTION_TYPES.noAction);
                setInlineError((inlineError) => ({
                  ...inlineError,
                  remarks_error: "",
                  refund_amount: ""
                }));
              }}
            >
              <div className="px-3">
                <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "left", color: "#e0e0e0", margin: 0 }}>
                  No Action
                </p>
              </div>
            </CustomRadioButton>

            <CustomRadioButton
              disabled={loading}
              checked={selectedCancelType === ACTION_TYPES.cancelIssue}
              onClick={() => {
                setSelectedCancelType(ACTION_TYPES.cancelIssue);
                setInlineError((inlineError) => ({
                  ...inlineError,
                  remarks_error: "",
                  refund_amount: ""
                }));
              }}
            >
              <div className="px-3">
                <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "left", color: "#e0e0e0", margin: 0 }}>
                  Cancel
                </p>
              </div>
            </CustomRadioButton>

            <CustomRadioButton
              disabled={loading}
              checked={selectedCancelType === ACTION_TYPES.replaceIssue}
              onClick={() => {
                setSelectedCancelType(ACTION_TYPES.replaceIssue);
                setInlineError((inlineError) => ({
                  ...inlineError,
                  remarks_error: "",
                  refund_amount: ""
                }));
              }}
            >
              <div className="px-3">
                <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "left", color: "#e0e0e0", margin: 0 }}>Replace</p>
              </div>
            </CustomRadioButton>
            <CustomRadioButton
              disabled={loading}
              checked={selectedCancelType === ACTION_TYPES.refundIssue}
              onClick={() => {
                setSelectedCancelType(ACTION_TYPES.refundIssue);
                setInlineError((inlineError) => ({
                  ...inlineError,
                  remarks_error: "",
                  refund_amount: ""
                }));
              }}
            >
              <div className="px-3">
                <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "left", color: "#e0e0e0", margin: 0 }}>
                  Refund
                </p>
              </div>
            </CustomRadioButton>

          </Box>
          <CustomRadioButton
            disabled={loading}
            checked={selectedCancelType === ACTION_TYPES.cascadeIssue}
            onClick={() => {
              setSelectedCancelType(ACTION_TYPES.cascadeIssue);
              setInlineError((inlineError) => ({
                ...inlineError,
                remarks_error: "",
                refund_amount: ""
              }));
            }}
          >
            <div className="px-3">
              <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "left", color: "#e0e0e0", margin: 0 }}>
                Cascade
              </p>
            </div>
          </CustomRadioButton>

        </Box>



        <Box sx={actionCardStyles.cardBody}>

          <div className="py-1 flex flex-col">
            <label className="text-sm py-2 ml-1 font-medium text-left text-seller-text inline-block">
              Short Description
              <span className="text-seller-error"> *</span>
            </label>
            <CssTextField
              type={"input"}
              className="w-full h-full px-2.5 py-3.5 text-seller-text bg-transparent !border-seller-muted"
              required={true}
              size="small"
              autoComplete="off"
              placeholder={"Short description"}
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(e.target.value)
              }
              inputProps={{
                maxLength: 50
              }}
            />
            {inlineError.remarks_error && (
              <ErrorMessage>{inlineError.remarks_error}</ErrorMessage>
            )}
            <label className="text-sm py-2 ml-1 font-medium text-left text-seller-text inline-block">
              Long Description
            </label>
            <CssTextField
              type={"input"}
              className="w-full h-full px-2.5 py-3.5 text-seller-text bg-transparent !border-seller-muted"
              size="small"
              autoComplete="off"
              placeholder={"Long description"}
              value={longDescription}
              onChange={(e) =>
                setLongDescription(e.target.value)
              }
            />
          </div>

          {selectedCancelType === ACTION_TYPES.refundIssue &&
            <div>
              <label className="text-sm py-2 ml-1 font-medium text-left text-seller-text inline-block">
                Refund Amount
                <span className="text-seller-error"> *</span>
              </label>
              <CssTextField
                type={"number"}
                className="w-full h-full px-2.5 py-3.5 text-seller-text bg-transparent !border-seller-muted"
                required={true}
                size="small"
                autoComplete="off"
                placeholder={"Refund Amount"}
                value={refundAmount}
                onChange={(e) =>
                  setRefundAmount(e.target.value)
                }
                inputProps={{
                  maxLength: 6
                }}
              />
              {inlineError.refund_amount && (
                <ErrorMessage>{inlineError.refund_amount}</ErrorMessage>
              )}
            </div>
          }

        </Box>

        <Box sx={actionCardStyles.cardFooter}>
          <Button
            type="button"
            disabled={loading}
            title="Cancel"
            className="text-seller-text"
            onClick={() => onClose()}
          />
          <Button
            disabled={loading}
            type="button"
            title="Submit"
            variant="contained"
            className="!ml-5"
            onClick={() =>  onSubmit()}
          />
        </Box>
      </Box>
    </Box>
  );
}
