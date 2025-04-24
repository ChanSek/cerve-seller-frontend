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
import { NavLink, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import userFields from "./provider-user-fields";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import AuthActionCard from "../Auth/AuthActionCard/AuthActionCard";
import { AddCookie, getValueFromCookie } from "../../utils/cookies";

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

export default function NewSeller() {
    const navigate = useNavigate();
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
                toast.error(res.message, { autoClose: 5000 });
            }
            if (res.status && res.status === 200 && res.data.status) {
                const { _id } = res.data.user;
                AddCookie("signed", true);
                localStorage.setItem("user_id", _id);
                navigate("/activate");
                toast.success("Seller Account Created Successfully", { autoClose: 5000 });
            }
        } catch (error) {
            console.log("error.response", error.response);
            toast.error(error.response.data.error);
        }
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
                    email: "Support Email is required",
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
            if (fieldValue.trim() === "") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    mobile: "Mobile Number is required",
                }));
                return false;
            } else if (!isPhoneNoValid(fieldValue.trim())) {
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
                placeholder: "Enter your password",
                type: "input",
                password: true,
                required: true,
            },
        ];
        return renderFormFields(uFields);
    };

    const validate = () => {
        const formErrors = {};
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

    const signUpForm = (
        <div className="m-auto w-10/12 md:w-3/4">
            <form>
                {/* <p className="text-2xl font-semibold mb-4 text-center">
                    {renderHeading()}
                </p> */}
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
                        SignUp
                    </Button>
                </div>
            </form>
        </div>
    );
    const navigation_link = (
        <div className="py-2 text-center">
          <p className="text-xs text-[#606161]">Already have an account?</p>
          <NavLink to="/login" className="">
            <p className="text-xs text-[#3d629ad2] hover:text-[#0066ffd2]">Login</p>
          </NavLink>
        </div>
      );
    return (
        <AuthActionCard action_form={signUpForm} navigation_link={navigation_link} />
    );
}
