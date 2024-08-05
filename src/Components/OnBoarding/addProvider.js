import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import RenderInput from "../../utils/RenderInput";
import { deleteAllCookies } from "../../utils/cookies";
import {
  isValidBankAccountNumber,
  isValidIFSC,
  isNameValid,
  isEmailValid,
  isValidPAN,
  isPhoneNoValid,
  isValidFSSAI,
  isValidGSTIN,
} from "../../utils/validations";
import { postCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import { containsOnlyNumbers } from "../../utils/formatting/string";
import useForm from "../../hooks/useForm";
import userFields from "./provider-user-fields";
import kycDetailFields from "./provider-kyc-fields";
import kycDocumentFields from "./provider-kyc-doc-fields";
import bankDetailFields from "./provider-bank-details-fields";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";


const InviteProvider = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  async function logout() {
    if (window.confirm("Are you sure you want to logout your session?")) {
      await postCall(`/api/v1/auth/logout`);
      deleteAllCookies();
      localStorage.clear();
      navigate("/");
    }
  }

  const kycDetails = {
    providerStoreName: "",
    shortDescription: "",
    longDescription: "",
    address: "",
    contactEmail: "",
    contactMobile: "",
    PAN: "",
    GSTN: "",
    FSSAI: "",
  };

  const kycMedia = {
    address_proof: "",
    id_proof: "",
    PAN_proof: "",
    GST_proof: "",
  };

  const bankDetails = {
    accHolderName: "",
    accNumber: "",
    bankName: "",
    branchName: "",
    IFSC: "",
    cancelledCheque: "",
    captcha: "",
  };

  const { formValues, setFormValues, errors, setErrors } = useForm({
    ...kycDetails,
    ...kycMedia,
    ...bankDetails,
  });
  const [formSubmitted, setFormSubmited] = useState(false);

  const handleContinue = () => {
    setStep(step + 1);
    setFormSubmited(false);
  };

  useEffect(() => {
    if (step === 3) {
      console.log("alert");
      loadCaptchaEnginge(6);
    }
  }, [step]);

  const sendInvite = async () => {
    setFormSubmited(true);
    try {
      const data = {
        storeName: formValues.providerStoreName.trim(),
        shortDescription: formValues.shortDescription,
        longDescription: formValues.longDescription,
        address: formValues.address,
        contactEmail: formValues.contactEmail.trim(),
        contactMobile: formValues.contactMobile,
        addressProofUrl: formValues.address_proof,
        idProofUrl: formValues.id_proof,
        pan: formValues.PAN,
        gstin: formValues.GSTN,
        fssaiNo: formValues.FSSAI,
        panProofUrl: formValues.PAN_proof,
        gstinProofUrl: formValues.GST_proof,
        account: {
          accountHolderName: formValues.accHolderName,
          accountNumber: formValues.accNumber,
          ifscCode: formValues.IFSC,
          cancelledChequeUrl: formValues.cancelledCheque,
          bankName: formValues.bankName,
          branchName: formValues.branchName,
        },
      };
      const subscriberId = localStorage.getItem("user_id");
      const url = `/api/v1/seller/subscriberId/${subscriberId}/merchant`;
      const res = await postCall(url, data);
      setFormSubmited(false);
      if (res.status && res.status !== 200) {
        cogoToast.error(res.message, { hideAfter: 5 });
      }
      if (res.status && res.status === 200) {
        navigate("/application/inventory");
        cogoToast.success("Provider onboarded successfully", { hideAfter: 5 });
      }
    } catch (error) {
      console.log("error.response", error.response);
      cogoToast.error(error.response.data.error);
    }
  };

  // const checkDisabled = () => {
  //   if (user.email == "" || !isEmailValid(user.email)) return true;
  //   if (user.password == "" || !isPhoneNoValid(user.mobile_number)) return true;
  //   if (user.provider_admin_name.trim() == "") return true;
  //   return false;
  // };

  const renderHeading = () => {
    if (step == 1) return "KYC Details";
    if (step == 2) return "KYC Documents";
    if (step == 3) return "Bank Details";
  };

  const renderFormFields = (fields) => {
    return fields.map((item) => (
      <RenderInput
        item={{
          ...item,
          error: !!errors?.[item.id],
          helperText: errors?.[item.id] || "",
        }}
        state={formValues}
        stateHandler={setFormValues}
      />
    ));
  };

  const renderSteps = () => {
    if (step == 1) return renderFormFields(kycDetailFields);
    if (step == 2) return renderFormFields(kycDocumentFields);
    if (step == 3) return renderFormFields(bankDetailFields);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(step - 1);
    }
  };

  const validate = () => {
    const formErrors = {};
    if (step === 1) {
      formErrors.providerStoreName =
        formValues.providerStoreName.trim() === ""
          ? "Provider Store Name is required"
          : "";
      formErrors.shortDescription =
        formValues.shortDescription.trim() === ""
          ? "Short Description is required"
          : "";
      formErrors.longDescription =
        formValues.longDescription.trim() === ""
          ? "Long Description is required"
          : "";
      formErrors.address =
        formValues.address.trim() === ""
          ? "Registered Address is required"
          : "";
      formErrors.contactEmail =
        formValues.contactEmail.trim() === ""
          ? "Support Email is required"
          : !isEmailValid(formValues.contactEmail.trim())
            ? "Please enter a valid email address"
            : "";
      formErrors.contactMobile =
        formValues.contactMobile.trim() === ""
          ? "Support Mobile Number is required"
          : !isPhoneNoValid(formValues.contactMobile.trim())
            ? "Please enter a valid mobile number"
            : "";
      formErrors.PAN =
        formValues.PAN.trim() === ""
          ? "PAN is required"
          : !isValidPAN(formValues.PAN)
            ? "Please enter a valid PAN number"
            : "";
      formErrors.GSTN =
        formValues.GSTN.trim() === ""
          ? "GSTIN Certificate is required"
          : !isValidGSTIN(formValues.GSTN)
            ? "GSTIN Certificate should be alphanumeric and 15 characters long"
            : "";
      formErrors.FSSAI =
        formValues.FSSAI.trim() === ""
          ? "FSSAI Number is required"
          : !isValidFSSAI(formValues.FSSAI) || formValues.FSSAI.length !== 14
            ? "FSSAI should be 14 digit number"
            : "";
    } else if (step === 2) {
      formErrors.address_proof =
        formValues.address_proof.trim() === ""
          ? "Address Proof is required"
          : "";
      formErrors.id_proof =
        formValues.id_proof.trim() === "" ? "ID Proof is required" : "";
      formErrors.PAN_proof =
        formValues.PAN_proof.trim() === "" ? "PAN Card Image is required" : "";
      formErrors.GST_proof =
        formValues.GST_proof.trim() === ""
          ? "GSTIN Certificate is required"
          : "";
    } else if (step === 3) {
      formErrors.accHolderName =
        formValues.accHolderName.trim() === ""
          ? "Account Holder Name is required"
          : !isNameValid(formValues.accHolderName)
            ? "Please enter a valid account holder name"
            : "";
      formErrors.accNumber =
        formValues.accNumber.trim() === ""
          ? "Account Number is required"
          : !isValidBankAccountNumber(formValues.accNumber)
            ? "Please enter a valid number"
            : "";
      formErrors.bankName =
        formValues.bankName.trim() === "" ? "Bank Name is required" : "";
      formErrors.branchName =
        formValues.branchName.trim() === "" ? "Branch Name is required" : "";
      formErrors.IFSC =
        formValues.IFSC.trim() === ""
          ? "IFSC Code is required"
          : !isValidIFSC(formValues.IFSC)
            ? "Please enter a valid IFSC Code"
            : "";
      formErrors.cancelledCheque =
        formValues.cancelledCheque === ""
          ? "Cancelled Cheque is required"
          : "";
      formErrors.captcha =
        formValues.captcha.trim() === ""
          ? "Captcha is required"
          : !validateCaptcha(formValues.captcha)
            ? "Captcha does not match"
            : "";
    }
    setErrors({
      ...formErrors,
    });
    return !Object.values(formErrors).some((val) => val !== "");
  };

  const handleSubmit = () => {
    if (validate()) {
      step === 3 ? sendInvite() : handleContinue();
    }
  };

  return (
    <div
      className="mx-auto !p-5 h-screen min-vh-100 overflow-auto bg-[#f0f0f0]"
      style={{ height: "100%", marginTop: "10px" }}
    >
      <div className="h-full flex fex-row items-center justify-center">
        <div
          className="flex w-full md:w-2/4 bg-white px-4 py-4 rounded-md shadow-xl h-max"
        // style={{ minHeight: "75%" }}
        >
          <div className="m-auto w-10/12 md:w-3/4 h-max">
            <form>
              <p className="text-2xl font-semibold mb-4 text-center">
                {renderHeading()}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="button"
              size="small"
              style={{ marginRight: 10 }}
              variant="contained"
              color="primary"
              onClick={() => logout()}
            //  disabled={checkDisabled()}
            >
              Exit
            </Button>
          </div>
              <div>
                {renderSteps()}
                {step === 3 ? (
                  <>
                    <div className="py-1">
                      <LoadCanvasTemplate />
                    </div>
                    <div className="py-1">
                      <RenderInput
                        item={{
                          id: "captcha",
                          // title: "Serviceable Radius/Circle (in Kilometer)",
                          placeholder: "Enter Captcha Value",
                          type: "input",
                          error: errors?.["captcha"] ? true : false,
                          helperText: errors?.["captcha"] || "",
                        }}
                        state={formValues}
                        stateHandler={setFormValues}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex mt-6">
                <Button
                  type="button"
                  size="small"
                  style={{ marginRight: 10 }}
                  variant="text"
                  onClick={handleBack}
                  disabled={formSubmitted || step === 1}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="small"
                  disabled={formSubmitted}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                //  disabled={checkDisabled()}
                >
                  {step == 3 ? "Submit" : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteProvider;
