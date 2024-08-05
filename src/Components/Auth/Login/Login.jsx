import React, { useEffect, useState } from "react";
import Button from "../../Shared/Button";
import AuthActionCard from "../AuthActionCard/AuthActionCard";
import { NavLink, useNavigate } from "react-router-dom";
import ErrorMessage from "../../Shared/ErrorMessage";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { AddCookie, getValueFromCookie } from "../../../utils/cookies";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { isObjEmpty } from "../../../utils/validations";

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

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signInUsingEmailAndPasswordloading] = useState(false);
  const [inlineError, setInlineError] = useState({
    username_error: "",
    password_error: "",
    captcha_error: "",
  });
  const [captchaVal, setCaptchaVal] = useState('');
  const [enableCaptcha, setEnableCaptcha] = useState(false);

  // use this function to check the email
  function checkEmail() {
    if (!login.username) {
      setInlineError((inlineError) => ({
        ...inlineError,
        username_error: "Email cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkPassword() {
    if (!login.password) {
      setInlineError((inlineError) => ({
        ...inlineError,
        password_error: "Password cannot be empty",
      }));
      return false;
    }

    return true;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (enableCaptcha && !validateCaptcha(captchaVal)) {
      setInlineError((inlineError) => ({
        ...inlineError,
        captcha_error: "Captcha does not match",
      }));
      return
    }
    const url = "/api/v1/auth/login";
    try {
      const res = await postCall(url, login);
      handleRedirect(res.data.access_token, res.data.user);
    } catch (error) {
      cogoToast.error("Authentication failed!");
      //setEnableCaptcha(true)
      //loadCaptchaEnginge(6)
    }
  };

  function handleRedirect(token, user) {
    const { _id } = user;
    AddCookie("token", token);
    AddCookie("organization", user.organization);
    AddCookie("enabled", user.enabled);
    localStorage.setItem("user_id", _id);
    if (!user.enabled) {
      navigate("/activate");
    } else if (!isObjEmpty(user.organization)) { 
      navigate("/application/inventory") 
    } else { 
      navigate("/add-provider-info") 
    };
  }

  useEffect(() => {
    if (getValueFromCookie("token")) {
      const enabled = getValueFromCookie("enabled");
      if (enabled == "true") {
        const cookieValue = getValueFromCookie("organization");
        if (cookieValue !== null && cookieValue !== "null" && !isObjEmpty(cookieValue)) {
          navigate("/application/inventory")
        } else {
          navigate("/add-provider-info")
        }
      }else{
        navigate("/activate");
      }
    }
  }, []);

  useEffect(() => {
    if (enableCaptcha) loadCaptchaEnginge(6)
  }, [enableCaptcha])

  const loginForm = (
    <div className="m-auto w-10/12 md:w-3/4">
      <div className="py-1">
        <label
          htmlFor="username"
          className="text-sm py-2 ml-1 font-medium text-left text-[#606161] inline-block"
        >
          Email
          <span className="text-[#FF0000]"> *</span>
        </label>
        <CssTextField
          id={
            inlineError.username_error
              ? "outlined-error"
              : "demo-helper-text-aligned"
          }
          name="username"
          type="email"
          placeholder="Enter Email"
          autoComplete="off"
          className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
          onChange={(event) => {
            setLogin({ ...login, username: event.target.value });
            setInlineError((inlineError) => ({
              ...inlineError,
              username_error: "",
            }));
          }}
          size="small"
          onBlur={checkEmail}
          error={inlineError.username_error ? true : false}
          // helperText={inlineError.email_error && inlineError.email_error}
          required
        />
      </div>
      {inlineError.username_error && (
        <ErrorMessage>{inlineError.username_error}</ErrorMessage>
      )}
      <div className="py-1">
        <label
          htmlFor="password"
          className="text-sm py-2 ml-1 font-medium text-left text-[#606161] inline-block"
        >
          Password
          <span className="text-[#FF0000]"> *</span>
        </label>
        <CssTextField
          id={
            inlineError.password_error
              ? "outlined-error"
              : "demo-helper-text-aligned"
          }
          name="password"
          type="password"
          placeholder="Enter Password"
          autoComplete="off"
          className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent"
          onChange={(event) => {
            setLogin({ ...login, password: event.target.value });
            setInlineError((inlineError) => ({
              ...inlineError,
              password_error: "",
            }));
          }}
          size="small"
          onBlur={checkPassword}
          error={inlineError.password_error ? true : false}
          style={{ borderRadius: "10px" }}
          required
        />
      </div>
      {inlineError.password_error && (
        <ErrorMessage>{inlineError.password_error}</ErrorMessage>
      )}
      {enableCaptcha && (
        <>
          <div className="py-1"><LoadCanvasTemplate /></div>
          <div className="py-1">
            <CssTextField
              required
              size="small"
              name="captchaVal"
              type="text"
              placeholder="Enter Captcha Value"
              autoComplete="off"
              className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
              onChange={(event) => {
                setCaptchaVal(event.target.value);
                setInlineError((inlineError) => ({
                  ...inlineError,
                  captcha_error: "",
                }));
              }}
            />
          </div>
          {inlineError.captcha_error && (
            <ErrorMessage>{inlineError.captcha_error}</ErrorMessage>
          )}
        </>
      )}
      <div className="py-3 pt-6  text-center flex flex-row justify-center">
        <Button
          isloading={signInUsingEmailAndPasswordloading ? 1 : 0}
          disabled={
            signInUsingEmailAndPasswordloading ||
            login.username == "" ||
            login.password == ""
          }
          variant="contained"
          title="Login"
          className="!w-40 !capitalize !py-2"
          onClick={(e) => handleLogin(e)}
        />
      </div>
    </div>
  );
  const navigation_link = (
    <div className="py-2 text-center">
      <NavLink to="/forgot-password" className="">
        <p className="text-xs text-[#3d629ad2] hover:text-[#0066ffd2]">
          Forgot password
        </p>
      </NavLink>
      <br />
      <NavLink to="/sign-up" className="">
        <p className="text-xs text-[#3d629ad2] hover:text-[#0066ffd2]">
          Create New Account
        </p>
      </NavLink>
    </div>
  );
  return (
    <AuthActionCard action_form={loginForm} navigation_link={navigation_link} />
  );
}
