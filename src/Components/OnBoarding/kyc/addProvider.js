import React, { useState, useEffect } from "react";
import { Box, Container, Paper } from "@mui/material";
import StepperHeader from "./StepperHeader";
import FormActions from "./FormActions";
import StepKycDetails from "./StepKycDetails";
import StepKycDocuments from "./StepKycDocuments";
import StepBankDetails from "./StepBankDetails";
import StepPreview from "./StepPreview";
import { useNavigate } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import useForm from "../../../hooks/useForm";
import Cookies from "js-cookie";
import { deleteAllCookies } from "../../../utils/cookies";
import useProviderValidation from "./useProviderValidation";
import { loadCaptchaEnginge } from "react-simple-captcha";

const steps = [
  "KYC Details",
  "KYC Documents",
  "Bank Details (Optional)",
  "Preview & Confirm",
];

const AddProvider = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [subscriberId] = useState(localStorage.getItem("user_id"));
  const [formSubmitted, setFormSubmitted] = useState(false);

  // --- Initialize Form ---
  const { formValues, setFormValues, errors, setErrors } = useForm({
    providerStoreName: "",
    shortDescription: "",
    longDescription: "",
    address: "",
    contactEmail: "",
    contactMobile: "",
    PAN: "",
    GSTN: "",
    FSSAI: "",
    address_proof: "",
    id_proof: "",
    PAN_proof: "",
    GST_proof: "",
    accHolderName: "",
    accNumber: "",
    IFSC: "",
    bankName: "",
    branchName: "",
    beneficiaryName: "",
    cancelledCheque: "",
    captcha: "",
  });

  const { validate, fieldValidate } = useProviderValidation(
    formValues,
    setErrors,
    step
  );

  // --- Fetch Provider Details ---
  const getProviderDetails = async () => {
  const url = `/api/v1/seller/subscriberId/${subscriberId}/merchant`;
  try {
    const result = await getCall(url);
    const { providerDetail = {} } = result.data || {};

    const account = providerDetail?.account || {};

    const clean = (value) =>
      value && typeof value === "string" ? value.trim() : value || "";

    setFormValues((prevValues) => ({
      ...prevValues,
      providerStoreName: clean(providerDetail?.storeName),
      shortDescription: clean(providerDetail?.shortDescription),
      longDescription: clean(providerDetail?.longDescription),
      address: clean(providerDetail?.address),
      contactEmail: clean(providerDetail?.contactEmail),
      contactMobile: clean(providerDetail?.contactMobile),
      PAN: clean(providerDetail?.pan),
      GSTN: clean(providerDetail?.gstin),
      FSSAI: providerDetail?.fssaiNo || "",
      address_proof: clean(providerDetail?.addressProofUrl),
      id_proof: clean(providerDetail?.idProofUrl),
      PAN_proof: clean(providerDetail?.panProofUrl),
      GST_proof: clean(providerDetail?.gstinProofUrl),

      // --- Bank / Account Details ---
      accHolderName: clean(account?.accountHolderName),
      accNumber: clean(account?.accountNumber),
      IFSC: clean(account?.ifscCode),
      bankName: clean(account?.bankName),
      branchName: clean(account?.branchName),
      cancelledCheque: clean(account?.cancelledChequeUrl),
      beneficiaryName: clean(account?.beneficiaryName),
      upiAddress: clean(account?.upiAddress),
    }));
  } catch (error) {
    console.error("Error fetching provider details:", error);
    cogoToast.warn("Unable to load existing provider details");
  }
};


  // --- Logout ---
  const logout = async () => {
    if (window.confirm("Logout your session?")) {
      try {
        await postCall(`/api/v1/auth/logout`);
      } catch (err) {
        console.warn("Logout failed silently:", err);
      }
      deleteAllCookies();
      localStorage.clear();
      navigate("/");
    }
  };

  // --- Step Navigation ---
  const handleContinue = () => setStep((prev) => prev + 1);
  const handleBack = () => (step === 1 ? navigate(-1) : setStep((prev) => prev - 1));

  // --- Submit/Invite Handler ---
  const sendInvite = async (persist) => {
    const optional = (val) => {
      if (val === undefined || val === null) return null;
      const trimmed = typeof val === "string" ? val.trim() : val;
      return trimmed === "" ? null : trimmed;
    };

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
      gstin: optional(formValues.GSTN),
      fssaiNo: optional(formValues.FSSAI),
      panProofUrl: formValues.PAN_proof,
      gstinProofUrl: optional(formValues.GST_proof),
      account: {
        accountHolderName: formValues.accHolderName,
        accountNumber: formValues.accNumber,
        ifscCode: formValues.IFSC,
        cancelledChequeUrl: formValues.cancelledCheque,
        bankName: formValues.bankName,
        branchName: formValues.branchName,
      },
      persistence: persist,
    };

    const res = await postCall(
      `/api/v1/seller/subscriberId/${subscriberId}/merchant`,
      data
    );

    if (persist && res.status === 200) {
      cogoToast.success("Seller onboarded successfully");
      navigate("/application/inventory");
    }
  };

  // --- Handle Submit ---
  const handleSubmit = async () => {
    try {
      const isValid = validate();
      console.log("error ", errors);
      if (!isValid) return;

      // Step 1–3 → move to next step (no final submit)
      if (step < 4) {
        await sendInvite(false);
        setStep((prev) => prev + 1);
        return;
      }

      // Step 4 → final submit
      if (step === 4) {
        await sendInvite(true);
      }
    } catch (err) {
      cogoToast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  // --- Lifecycle ---
  useEffect(() => {
    if (step === 4) loadCaptchaEnginge(6);
    const isSuper = Cookies.get("isSuperAdmin");
    if (isSuper === "true") {
      navigate("/application/user-listings?view=provider");
      return;
    }
    getProviderDetails();
  }, [navigate, step]);

  // --- Step Renderer ---
  const renderStep = () => {
    const sharedProps = {
      formValues,
      setFormValues,
      errors,
      setErrors,
      fieldValidate,
    };

    switch (step) {
      case 1:
        return <StepKycDetails {...sharedProps} />;
      case 2:
        return <StepKycDocuments {...sharedProps} />;
      case 3:
        return <StepBankDetails {...sharedProps} />;
      case 4:
        return (
          <StepPreview
            formValues={formValues}
            setFormValues={setFormValues}        // ✅ needed for handleChange
            errors={errors}                      // ✅ required for error messages
            fieldValidate={fieldValidate}        // ✅ used inside handleChange
            onEdit={() => setStep(1)}
            onSubmit={() => sendInvite(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f0f0", pt: 4, pb: 8 }}>
      <Container maxWidth="md">
        <StepperHeader steps={steps} step={step} />
        <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <p className="text-3xl font-bold">
              {steps[step - 1].split("(")[0].trim()}
            </p>
            <button onClick={logout} className="px-3 py-1 border text-red-600">
              Exit
            </button>
          </Box>

          <form>
            <Box sx={{ my: 3 }}>{renderStep()}</Box>

            {step < 5 && (
              <FormActions
                step={step}
                formSubmitted={formSubmitted}
                onBack={handleBack}
                onContinue={handleSubmit}
              />
            )}
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProvider;
