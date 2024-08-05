import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import RenderInput from "../../utils/RenderInput";
import {
    isNumberOnly
} from "../../utils/validations";
import { postCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import userFields from "./seller-activation-fields";
import { AddCookie} from "../../utils/cookies";
import {
  loadCaptchaEnginge,
} from "react-simple-captcha";

const ActivateSeller = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const user = {
    email_otp: ""
  };

  const { formValues, setFormValues, errors, setErrors } = useForm({
    ...user
  });
  const [formSubmitted, setFormSubmited] = useState(false);

  const handleContinue = () => {
    setStep(step + 1);
    setFormSubmited(false);
  };

  useEffect(() => {
    if (step === 4) {
      console.log("alert");
      loadCaptchaEnginge(6);
    }
  }, [step]);

  const sendInvite = async () => {
    //setFormSubmited(true);
    try {
      const data = {
          emailOtp: formValues.email_otp
      };
      const subscriberId = localStorage.getItem("user_id");
      const url = `/api/v1/seller/subscriberId/${subscriberId}/activate`;
      const res = await postCall(url, data);
      //setFormSubmited(false);
      if(res.status && res.status !== 200){
        cogoToast.error(res.message, { hideAfter: 5 });
      }
      if(res.status && res.status === 200){
        if(res.data.status){
            AddCookie("enabled", res.data.status);
            navigate("/");
            cogoToast.success(res.data.message, { hideAfter: 5 });
        }else{
            cogoToast.error(res.data.message, { hideAfter: 15 });
        }
      }
    } catch (error) {
      console.log("error.response", error.response);
      cogoToast.error(error.response.data.error);
    }
  };

  const renderHeading = () => {
    if (step == 1) return "Seller Account Activation";
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
    let uFields = [
        ...userFields
      ];
    if (step == 1) return renderFormFields(uFields);
  };

  const validate = () => {
    const formErrors = {};
    if (step === 1) {
      formErrors.email_otp =
        formValues.email_otp === ""
          ? "Activation Number is required"
          : !isNumberOnly(formValues.email_otp)
          ? "Please enter a valid activation number"
          : "";
    }
    setErrors({
      ...formErrors,
    });
    return !Object.values(formErrors).some((val) => val !== "");
  };

  const handleSubmit = () => {
    if (validate()) {
      sendInvite();
    }
  };


  console.log("formValues====>", formValues);
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
              <div>
                {renderSteps()}
              </div>
              <div className="flex mt-6">
                <Button
                  type="button"
                  size="small"
                  disabled={formSubmitted}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  //  disabled={checkDisabled()}
                >
                  Activate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateSeller;
