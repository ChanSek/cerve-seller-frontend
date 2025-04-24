import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import RenderInput from "../../utils/RenderInput";
import {
  isNameValid,
  isEmailValid,
  isPhoneNoValid,
} from "../../utils/validations";
import { postCall } from "../../Api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import userFields from "./provider-user-fields";
import { AddCookie, getValueFromCookie } from "../../utils/cookies";

const AddSeller = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const user = {
    email: "",
    mobile: "",
    name: "",
    password: "",
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
    }
  }, [step]);

  const sendInvite = async () => {
    setFormSubmited(true);
    try {
      const data = {
        name: formValues.name,
        email: formValues.email,
        mobile: formValues.mobile,
        password: formValues.password,
      };
      const url = `/api/v1/auth/signup`;
      const res = await postCall(url, data);
      setFormSubmited(false);
      if (res.status && res.status !== 200) {
        toast.error(res.message, { hideAfter: 5 });
      }
      if (res.status && res.status === 200 && res.data.status) {
        const { _id } = res.data.user;
        AddCookie("token", res.data.access_token);
        localStorage.setItem("user_id", _id);
        navigate("/activate");
        toast.success("Seller Account Created Successfully", { hideAfter: 5 });
      }
    } catch (error) {
      console.log("error.response", error.response);
      toast.error(error.response.data.error);
    }
  };

  const renderHeading = () => {
    if (step == 1) return "Create New Seller Account";
  };

  const handleChange = (e, item, args) => {
    var value = item.isUperCase ? e.target.value.toUpperCase() : e.target.value;
    setFormValues({
      ...formValues,
      [item.id]: value,
    });
    fieldValidate(item.id, value);
  }

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
      />
    ));
  };

  const fieldValidate = (fieldName, fieldValue) => {
    if (fieldName === "email") {
      if (fieldValue.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Seller Email is required",
        }));
        return false;
      } else if (!isEmailValid(fieldValue.trim())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address",
        }));
        return false;
      } else if (fieldValue.trim().length > 64) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email address max 64 characters long",
        }));
        return false;
      }
    }
    if (fieldName === "mobile") {
      if (fieldValue === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Mobile Number is required",
        }));
        return false;
      } else if (!isPhoneNoValid(fieldValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Please enter a valid mobile number",
        }));
        return false;
      }
    }
    setErrors({});
    return true;
  }

  const renderSteps = () => {
    let uFields = [
      ...userFields,
      {
        id: "password",
        title: "Password",
        placeholder: "Enter Password(mininum 6 characters)",
        type: "input",
        password: true,
        required: true,
      },
    ];
    if (step == 1) return renderFormFields(uFields);
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
      formErrors.email =
        formValues.email.trim() === ""
          ? "Email is required"
          : !isEmailValid(formValues.email)
            ? "Please enter a valid email address"
            : "";
      formErrors.mobile =
        formValues.mobile.trim() === ""
          ? "Mobile Number is required"
          : !isPhoneNoValid(formValues.mobile)
            ? "Please enter a valid mobile number"
            : "";
      formErrors.name =
        formValues.name.trim() === ""
          ? "Name is required"
          : !isNameValid(formValues.name)
            ? "Please enter a valid name"
            : "";
      formErrors.password =
        formValues.password.trim() === ""
          ? "Password is required"
          : formValues.password.length < 6
            ? "Password should have minimum 6 characters"
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
                  style={{ marginRight: 10 }}
                  variant="text"
                  onClick={handleBack}
                  disabled={formSubmitted}
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
                  SignUp
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSeller;
