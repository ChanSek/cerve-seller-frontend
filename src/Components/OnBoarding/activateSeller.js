import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import RenderInput from "../../utils/RenderInput";
import { isNumberOnly } from "../../utils/validations";
import { postCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import userFields from "./seller-activation-fields";
import { AddCookie, deleteAllCookies } from "../../utils/cookies";
import AuthActionCard from "../Auth/AuthActionCard/AuthActionCard";

export default function ActivateSeller() {
    const navigate = useNavigate();
    const user = {
        email_otp: ""
    };

    const { formValues, setFormValues, errors, setErrors } = useForm({
        ...user
    });

    const [isRegenerateDisabled, setIsRegenerateDisabled] = useState(false);

    async function logout() {
        if (window.confirm("Are you sure you want to logout your session?")) {
            await postCall(`/api/v1/auth/logout`);
            deleteAllCookies();
            localStorage.clear();
            navigate("/");
        }
    }

    const sendInvite = async () => {
        try {
            const data = {
                emailOtp: formValues.email_otp
            };
            const subscriberId = localStorage.getItem("user_id");
            const url = `/api/v1/seller/subscriberId/${subscriberId}/activate`;
            const res = await postCall(url, data);
            if (res.status && res.status !== 200) {
                cogoToast.error(res.message, { hideAfter: 5 });
            }
            if (res.status && res.status === 200) {
                if (res.data.status) {
                    AddCookie("enabled", res.data.status);
                    navigate("/");
                    cogoToast.success(res.data.message, { hideAfter: 5 });
                } else {
                    cogoToast.error(res.data.message, { hideAfter: 15 });
                }
            }
        } catch (error) {
            console.log("error.response", error.response);
            cogoToast.error(error.response.data.error);
        }
    };

    const regenerateKey = async () => {
        try {
            const data = {
                emailOtp: formValues.email_otp
            };
            const subscriberId = localStorage.getItem("user_id");
            const url = `/api/v1/seller/subscriberId/${subscriberId}/regenerateKey`;
            const res = await postCall(url, data);
            if (res.status && res.status !== 200) {
                cogoToast.error(res.message, { hideAfter: 5 });
            }
            if (res.status && res.status === 200) {
                if (res.data.status) {
                    cogoToast.success(res.data.message, { hideAfter: 10 });
                } else {
                    cogoToast.error(res.data.message, { hideAfter: 5 });
                }
            }
        } catch (error) {
            console.log("error.response", error.response);
            cogoToast.error(error.response.data.error);
        }
    };

    const renderFormFields = (fields) => {
        return fields.map((item) => (
            <RenderInput
                key={item.id}
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
        return renderFormFields(uFields);
    };

    const validate = () => {
        const formErrors = {};
        formErrors.email_otp =
            formValues.email_otp === ""
                ? "Activation Number is required"
                : !isNumberOnly(formValues.email_otp)
                    ? "Please enter a valid activation number"
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

    const handleRegenerate = () => {
        setIsRegenerateDisabled(true);
        regenerateKey();

        // Re-enable the button after 60 seconds
        setTimeout(() => {
            setIsRegenerateDisabled(false);
        }, 60000); // 60 seconds
    };

    const signUpForm = (
        <div className="w-10/12 md:w-3/4 mx-auto">
            <div
            style={{ height: "20%" }}
            className="overflow-auto flex justify-center"
          ></div>
            <form>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button
                        type="button"
                        size="small"
                        style={{ marginRight: 10 }}
                        variant="contained"
                        color="primary"
                        onClick={logout}
                    >
                        Exit
                    </Button>
                </div>
                <div>{renderSteps()}</div>
                <div className="flex mt-6">
                    <Button
                        type="button"
                        size="small"
                        style={{ marginRight: 10 }}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Activate
                    </Button>
                    <Button
                        type="button"
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleRegenerate}
                        disabled={isRegenerateDisabled}
                    >
                        Re-Generate
                    </Button>
                </div>
            </form>
        </div>
    );
    return (
        <AuthActionCard action_form={signUpForm} />
    );
};
