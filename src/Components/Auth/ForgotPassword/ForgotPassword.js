import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import AuthActionCard from "../AuthActionCard/AuthActionCard";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { isEmailValid } from "../../../utils/validations";
import { postCall } from "../../../Api/axios";
import { useNavigate } from "react-router-dom";
import cogoToast from "cogo-toast";
import {
  isNumberOnly
} from "../../../utils/validations";

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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);

  const checkDisabled = () => {
    if (otpGenerated === true || email.trim() === '' || !isEmailValid(email) || error === true) return true;
    return false;
  };

  const checkEnableOtp = () => {
    return (otpGenerated === false);
  };

  const updateEmail = (email) => {
    if(email.trim() === '' || !isEmailValid(email)){
      setError(true);
      setMsg("Please enter a valid email address");
    }else{
      setError(false);
      setMsg("");
      setEmail(email);
    }
  };

  const user = {
    email: "",
    password_1: "",
    password_2: "",
    emailOtp
  };

  const forgotPassword = async () => {
    const url = `/api/v1/auth/forgotPassword`;
    try {
      const res = await postCall(url, { email });
      if (res.status && res.status === 200) {
        setOtpGenerated(res.data.status);
        if (res.data.status) {
          setError(false);
          setMsg(res.data.message)
        } else {
          setError(true);
          setMsg(res.data.message)
        }
      }
    } catch (error) {
      setError(true);
      setMsg(error.response.data.message);
    }
  };

  const updatePassword = async () => {
    try {
      const data = {
        email: email,
        password: password1,
        emailOtp: emailOtp
      };
      const url = `/api/v1/auth/resetPassword`;
      const res = await postCall(url, data);
      if (res.status && res.status !== 200) {
        setError(true);
        setMsg(res.message);
      }
      if (res.status && res.status === 200) {
        if (res.data.status) {
          navigate("/");
          cogoToast.success(res.data.message, { hideAfter: 5 });
        } else {
          setError(true);
          setMsg(res.data.message);
        }
      }
    } catch (error) {
      console.log("error.response", error.response);
      cogoToast.error(error.response.data.message);
    }
  };

  const handleSendOtp = async () => {
    if (true) {
      await forgotPassword()
    }
  };

  const handleResetPassword = () => {
    if (validate()) {
      updatePassword();
    }
  };

  const validate = () => {
    if (password1 === "") {
      setError(true);
      setMsg("Password is required");
      return false;
    }
    if (password1.length < 6) {
      setError(true);
      setMsg("Password should have minimum 6 characters");
      return false;
    }
    if (password2 === "") {
      setError(true);
      setMsg("Confirm Password is required");
      return false;
    }
    if (password1 !== password2) {
      setError(true);
      setMsg("Passwords don't match");
      return false;
    }
    if (emailOtp === "") {
      setError(true);
      setMsg("Email OTP is required");
      return false;
    }
    if (!isNumberOnly(emailOtp)) {
      setError(true);
      setMsg("Please enter a valid OTP");
      return false;
    }
    setError(false);

    setMsg("");
    return true;
  };

  const forgot_password_form = (
    <div className="m-auto w-10/12 md:w-3/4">
      <form>
        <div className="py-1">
          <label
            htmlFor="email"
            className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          >
            Email
            <span className="text-[#FF0000]"> *</span>
          </label>
          <CssTextField
            required
            size="small"
            name="email"
            type="email"
            variant="standard"
            placeholder="Enter Email"
            autoComplete="off"
            className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
            onChange={(event) => updateEmail(event.target.value)}
            disabled={!checkEnableOtp()}
          />
        </div>
        <div className="py-1">
          <label
            htmlFor="password"
            className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          >
            New Password
            <span className="text-[#FF0000]"> *</span>
          </label>
          <CssTextField
            required
            size="small"
            name="password_1"
            type="password"
            variant="standard"
            placeholder="Enter Password(mininum 6 characters)"
            autoComplete="off"
            className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
            onChange={(event) => setPassword1(event.target.value)}
            disabled={checkEnableOtp()}
          />
        </div>
        <div className="py-1">
          <label
            htmlFor="password"
            className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          >
            Confirm Password
            <span className="text-[#FF0000]"> *</span>
          </label>
          <CssTextField
            required
            size="small"
            name="password_2"
            type="password"
            variant="standard"
            placeholder="Confirm Password"
            autoComplete="off"
            className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
            onChange={(event) => setPassword2(event.target.value)}
            disabled={checkEnableOtp()}
          />
        </div>
        <div className="py-1">
          <label
            htmlFor="password"
            className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          >
            Email OTP
            <span className="text-[#FF0000]"> *</span>
          </label>
          <CssTextField
            required
            size="small"
            name="emailOtp"
            type="text"
            variant="standard"
            placeholder="Enter OTP Provided Through Email"
            autoComplete="off"
            className="w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
            onChange={(event) => setEmailOtp(event.target.value)}
            disabled={checkEnableOtp()}
          />
        </div>
        {msg && <p className={`text-xs ${error ? 'text-red-600' : 'text-green-600'} mt-2`}>{msg}</p>}
        <br />
        <Button
          variant="contained"
          style={{ marginRight: 10 }}
          primary
          onClick={handleSendOtp}
          disabled={checkDisabled()}
        >
          Get OTP
        </Button>
        <Button
          variant="contained"
          primary
          onClick={handleResetPassword}
          disabled={checkEnableOtp()}
        >
          Submit
        </Button>
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
    <AuthActionCard
      action_form={forgot_password_form}
      navigation_link={navigation_link}
    />
  );
};

export default ForgotPassword;
