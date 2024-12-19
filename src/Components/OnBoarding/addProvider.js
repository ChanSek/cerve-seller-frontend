import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import RenderInput from "../../utils/RenderInput";
import { deleteAllCookies } from "../../utils/cookies";
import Cookies from "js-cookie";
import {
  isValidBankAccountNumber,
  isValidIFSC,
  isNameValid,
  isEmailValid,
  isValidPAN,
  isPhoneNoValid,
  isValidFSSAI,
  isValidGSTIN,
  isValidChars,
  isValidDescription,
  hasRepeatedChars,
} from "../../utils/validations";
import { getCall, postCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
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
  const [subscriberId, setSubscriberId] = useState(localStorage.getItem("user_id"));

  async function logout() {
    if (window.confirm("Are you sure want to logout your session?")) {
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
    IFSC: "",
    bankName: "",
    branchName: "",
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

  const getProviderDetails = async () => {
    const url = `/api/v1/seller/subscriberId/${subscriberId}/merchant`;
    try {
      const result = await getCall(url);
      const { providerDetail = {} } = result.data;

      // Set form values
      setFormValues((prevValues) => ({
        ...prevValues,
        providerStoreName: providerDetail?.storeName,
        shortDescription: providerDetail?.shortDescription,
        longDescription: providerDetail?.longDescription,
        address: providerDetail?.address,
        contactEmail: providerDetail?.contactEmail,
        contactMobile: providerDetail?.contactMobile,
        PAN: providerDetail?.pan,
        GSTN: providerDetail?.gstin,
        FSSAI: providerDetail?.fssaiNo,
        address_proof: providerDetail?.addressProofUrl,
        id_proof: providerDetail?.idProofUrl,
        PAN_proof: providerDetail?.panProofUrl,
        GST_proof: providerDetail?.gstinProofUrl,
      }));
      return true;
    } catch (error) {
      console.error("Error fetching provider details:", error);
      return false;
    }
  };


  useEffect(() => {
    const status = Cookies.get("isSuperAdmin");
    if (status === "true") {
      navigate("/application/user-listings?view=provider");
    }
  }, []);

  useEffect(() => {
    if (step === 1 || step === 2) {
      getProviderDetails();
    } else if (step === 3) {
      loadCaptchaEnginge(6);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const sendInvite = async (persistence) => {
    if (persistence) {
      setFormSubmited(true);
    }
    try {
      const data = {
        storeName: formValues.providerStoreName.trim(),
        shortDescription: formValues.shortDescription.trim(),
        longDescription: formValues.longDescription.trim(),
        address: formValues.address.trim(),
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
        persistence: persistence
      };
      const url = `/api/v1/seller/subscriberId/${subscriberId}/merchant`;
      const res = await postCall(url, data);
      if (persistence) {
        setFormSubmited(false);
        if (res.status && res.status !== 200) {
          cogoToast.error(res.message, { hideAfter: 5 });
        }
        if (res.status && res.status === 200) {
          navigate("/application/inventory");
          cogoToast.success("Seller onboarded successfully", { hideAfter: 5 });
        }
      }
    } catch (error) {
      console.log("error", error);
      console.log("error.response", error.response);
      cogoToast.error(error.response.data.error);
    }
  };

  const renderHeading = () => {
    if (step === 1) return "KYC Details";
    if (step === 2) return "KYC Documents";
    if (step === 3) return "Bank Details";
  };


  const handleChange = (e, item, args) => {
    var value = item.isUperCase ? e.target.value.toUpperCase() : e.target.value;
    setFormValues({
      ...formValues,
      [item.id]: value,
    });
    fieldValidate(item.id, value);
    if (step === 3) {
      if (item.id === "IFSC") {
        setFormValues({
          ...formValues,
          IFSC: value,
          bankName: "",
          branchName: "",
        });
        if (isValidIFSC(value)) {
          getIFSCDetails(value).then((ifscDetails) => {
            setFormValues({
              ...formValues,
              IFSC: value,
              bankName: ifscDetails.data.BANK,
              branchName: ifscDetails.data.BRANCH,
            });
          });
        }
      }
    }
  }

  const getIFSCDetails = async (ifsc_code) => {
    const url = `/api/v1/seller/reference/${ifsc_code}/ifsc`;
    const res = await getCall(url);
    return res;
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
        handleChange={handleChange}
        stateHandler={setFormValues}
        Key={item?.id}
      />
    ));
  };

  const renderSteps = () => {
    if (step === 1) return renderFormFields(kycDetailFields);
    if (step === 2) return renderFormFields(kycDocumentFields);
    if (step === 3) return renderFormFields(bankDetailFields);
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
        !formValues.providerStoreName || formValues.providerStoreName.trim() === ""
          ? "Provider Store Name is required"
          : hasRepeatedChars(formValues.providerStoreName.trim())
            ? "Please Provide a valid Store Name"
            : !isValidChars(formValues.providerStoreName.trim())
              ? "Please Provide a valid Store Name"
              : "";
      formErrors.shortDescription =
        !formValues.shortDescription || formValues.shortDescription.trim() === ""
          ? "Short Description is required"
          : !isValidDescription(formValues.shortDescription.trim())
            ? "Please Provide a Clear Description"
            : "";
      formErrors.longDescription =
        !formValues.longDescription || formValues.longDescription.trim() === ""
          ? "Long Description is required"
          : !isValidDescription(formValues.longDescription.trim())
            ? "Please Provide a Clear Description"
            : "";
      formErrors.address =
        !formValues.address || formValues.address.trim() === ""
          ? "Registered Address is required"
          : !isValidChars(formValues.address.trim())
            ? "Please Provide a valid Registered Address"
            : ""
      formErrors.contactEmail =
        !formValues.contactEmail || formValues.contactEmail.trim() === ""
          ? "Contact Email is required"
          : !isEmailValid(formValues.contactEmail.trim())
            ? "Please enter a valid email address"
            : "";
      formErrors.contactMobile =
        !formValues.contactMobile || formValues.contactMobile.trim() === ""
          ? "Contact Mobile Number is required"
          : !isPhoneNoValid(formValues.contactMobile.trim())
            ? "Please enter a valid mobile number"
            : "";
      formErrors.PAN =
        !formValues.PAN || formValues.PAN.trim() === ""
          ? "PAN is required"
          : !isValidPAN(formValues.PAN)
            ? "Please enter a valid PAN number"
            : "";
      formErrors.GSTN =
        !formValues.GSTN || formValues.GSTN.trim() === ""
          ? "GSTIN Certificate is required"
          : !isValidGSTIN(formValues.GSTN)
            ? "GSTIN Certificate should be alphanumeric and 15 characters long"
            : "";
      formErrors.FSSAI =
        formValues.FSSAI === ""
          ? "FSSAI Number is required"
          : !isValidFSSAI(formValues.FSSAI) || String(formValues.FSSAI).length !== 14
            ? "FSSAI should be 14 digit number"
            : "";
    } else if (step === 2) {
      formErrors.address_proof =
        !formValues.address_proof || formValues.address_proof.trim() === ""
          ? "Address Proof is required"
          : "";
      formErrors.id_proof =
        !formValues.id_proof || formValues.id_proof.trim() === ""
          ? "ID Proof is required"
          : "";
      formErrors.PAN_proof =
        !formValues.PAN_proof || formValues.PAN_proof.trim() === ""
          ? "PAN Card Image is required"
          : "";
      formErrors.GST_proof =
        !formValues.GST_proof || formValues.GST_proof.trim() === ""
          ? "GSTIN Certificate is required"
          : "";
    } else if (step === 3) {
      formErrors.accHolderName = formValues.accHolderName === undefined || formValues.accHolderName === ""
        ? "Account Holder Name is required"
        : hasRepeatedChars(formValues.accHolderName.trim())
          ? "Please enter a valid account holder name"
          : !isNameValid(formValues.accHolderName)
            ? "Please enter a valid account holder name"
            : "";
      formErrors.accNumber =
        formValues.accNumber === undefined || formValues.accNumber === ""
          ? "Account Number is required"
          : !isValidBankAccountNumber(formValues.accNumber)
            ? "Please enter a valid number"
            : "";
      formErrors.bankName =
        formValues.bankName === undefined || formValues.bankName.trim() === ""
          ? "Bank Name is required"
          : hasRepeatedChars(formValues.bankName.trim())
            ? "Repititive characters not allowed"
            : ""
      formErrors.branchName =
        formValues.branchName === undefined || formValues.branchName.trim() === "" ? "Branch Name is required" : "";
      formErrors.IFSC =
        formValues.IFSC === undefined || formValues.IFSC.trim() === ""
          ? "IFSC Code is required"
          : !isValidIFSC(formValues.IFSC)
            ? "Please enter a valid IFSC Code"
            : "";
      formErrors.cancelledCheque =
        formValues.cancelledCheque === undefined || formValues.cancelledCheque === ""
          ? "Cancelled Cheque is required"
          : "";
      formErrors.captcha =
        formValues.captcha === ""
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

  const fieldValidate = (fieldName, fieldValue) => {
    if (step === 1) {
      if (fieldName === "providerStoreName") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            providerStoreName: "Provider Store Name is required",
          }));
          return false;
        } else if (!isValidChars(fieldValue) || hasRepeatedChars(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            providerStoreName: "Please Provide a valid Store Name",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            providerStoreName: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "shortDescription") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            shortDescription: "Short Description is required",
          }));
          return false;
        } else if (!isValidDescription(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            shortDescription: "Please Provide a Clear Description",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            shortDescription: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "longDescription") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            longDescription: "Long Description is required",
          }));
          return false;
        } else if (!isValidDescription(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            longDescription: "Please Provide a Clear Description",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            longDescription: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "address") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            address: "Registered Address is required",
          }));
          return false;
        } else if (!isValidChars(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            address: "Please Provide a valid Registered Address",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            address: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "contactEmail") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactEmail: "Contact Email is required",
          }));
          return false;
        } else if (!isEmailValid(fieldValue.trim())) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactEmail: "Please enter a valid email address",
          }));
          return false;
        } else if (fieldValue.trim().length > 64) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactEmail: "Email address max 64 characters long",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactEmail: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "contactMobile") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactMobile: "Contact Mobile Number is required",
          }));
          return false;
        } else if (!isPhoneNoValid(fieldValue.trim())) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactMobile: "Please enter a valid mobile number",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactMobile: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "PAN") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            PAN: "PAN is required",
          }));
          return false;
        } else if (!isValidPAN(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            PAN: "Please enter a valid PAN number",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            PAN: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "GSTN") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            GSTN: "GSTIN Certificate is required",
          }));
          return false;
        } else if (!isValidGSTIN(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            GSTN: "GSTIN Certificate should be alphanumeric and 15 characters long",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            GSTN: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "FSSAI") {
        if (fieldValue === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            FSSAI: "FSSAI Number is required",
          }));
          return false;
        } else if (!isValidFSSAI(fieldValue) || String(fieldValue).length !== 14) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            FSSAI: "FSSAI should be 14 digit number",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            FSSAI: "", // Clear the error message
          }));
        }
      }

    } else if (step === 2) {
      if (fieldName === "address_proof" && fieldValue.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          address_proof: "Address Proof is required",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          address_proof: "", // Clear the error message
        }));
      }

      if (fieldName === "id_proof" && fieldValue.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          id_proof: "ID Proof is required",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          id_proof: "", // Clear the error message
        }));
      }

      if (fieldName === "PAN_proof" && fieldValue.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          PAN_proof: "PAN Card Image is required",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          PAN_proof: "", // Clear the error message
        }));
      }

      if (fieldName === "GST_proof" && fieldValue.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          GST_proof: "GSTIN Certificate is required",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          GST_proof: "", // Clear the error message
        }));
      }
    } else if (step === 3) {
      if (fieldName === "accHolderName") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accHolderName: "Account Holder Name is required",
          }));
          return false;
        } else if (hasRepeatedChars(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accHolderName: "Please enter a valid account holder name",
          }));
          return false;
        } else if (!isNameValid(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accHolderName: "Please enter a valid account holder name",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accHolderName: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "accNumber") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accNumber: "Account Number is required",
          }));
          return false;
        } else if (!isValidBankAccountNumber(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accNumber: "Please enter a valid number",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            accNumber: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "bankName") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            bankName: "Bank Name is required",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            bankName: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "branchName") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            branchName: "Branch Name is required",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            branchName: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "IFSC") {
        if (fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            IFSC: "IFSC Code is required",
          }));
          return false;
        } else if (!isValidIFSC(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            IFSC: "Please enter a valid IFSC Code",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            IFSC: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "cancelledCheque") {
        if (fieldValue === undefined || fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            cancelledCheque: "Cancelled Cheque is required",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            cancelledCheque: "", // Clear the error message
          }));
        }
      }

      if (fieldName === "captcha") {
        if (fieldValue === undefined || fieldValue.trim() === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            captcha: "Captcha is required",
          }));
          return false;
        } else if (!validateCaptcha(fieldValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            captcha: "Captcha does not match",
          }));
          return false;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            captcha: "", // Clear the error message
          }));
        }
      }
    }

    // setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      handleContinue();
      try {
        if (step === 1 || step === 2) {
          await sendInvite(false);
          await getProviderDetails();
        }
        else if (step === 3) {
          await sendInvite(true);
        }
      } catch (error) {
        console.error("Error fetching provider details or sending invite:", error);
      }
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
                  {step === 3 ? "Submit" : "Continue"}
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
