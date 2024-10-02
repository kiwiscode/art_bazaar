import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function ResetPassword() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { showCustomMessage, showErrorMessage, contextHolder } =
    useAntdMessageHandler();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [
    valuesBeenEnteredIntoThePasswordField,
    setValuesBeenEnteredIntoThePasswordField,
  ] = useState(false);
  const [
    valuesBeenEnteredIntoTheConfirmNewPasswordField,
    setValuesBeenEnteredIntoTheConfirmNewPasswordField,
  ] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    NewPassword: "",
    ConfirmNewPassword: "",
  });
  const [isValidToken, setIsValidToken] = useState(true);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    setEmail(email);
    setResetToken(token);
    "email:", email;
    "token:", token;
    if (!token) {
      navigate("/");
    }
  }, [location.search]);

  const changePassword = async () => {
    try {
      const result = await axios.post(`${API_URL}/auth/change_password`, {
        email,
        password: changePasswordFormData.NewPassword,
        token: resetToken,
      });
      "result:", result;
      const { status } = result;
      if (status === 200) {
        showCustomMessage("Password successfully reset. Redirecting...", 100);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      const { status } = error.response;
      console.error("error:", status);
      if (status === 404) {
        setIsValidToken(false);
        showErrorMessage("Reset password token is invalid", 6);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (e) => {
    e.preventDefault();
  };

  const handleFocus = () => {
    ("focused ...");
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangePasswordData = (e) => {
    const { name, value } = e.target;
    "name:", name;
    "value:", value;
    if (name === "NewPassword") {
      setValuesBeenEnteredIntoThePasswordField(true);
    }

    if (name === "ConfirmNewPassword") {
      setValuesBeenEnteredIntoTheConfirmNewPasswordField(true);
    }

    setChangePasswordFormData({
      ...changePasswordFormData,
      [name]: value,
    });
  };

  const passwordMustMatch = () => {
    setPasswordMatchError(true);
  };

  useEffect(() => {
    "new password:", changePasswordFormData?.NewPassword;
    "confirm new password:", changePasswordFormData?.ConfirmNewPassword;
    if (
      changePasswordFormData?.NewPassword?.length &&
      changePasswordFormData?.ConfirmNewPassword?.length &&
      changePasswordFormData?.NewPassword !==
        changePasswordFormData?.ConfirmNewPassword
    ) {
      passwordMustMatch();
    } else {
      setPasswordMatchError(false);
    }
  }, [
    changePasswordFormData.NewPassword,
    changePasswordFormData.ConfirmNewPassword,
  ]);

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  useEffect(() => {
    if (
      (!regex.test(changePasswordFormData.NewPassword) ||
        changePasswordFormData.NewPassword.length < 8) &&
      changePasswordFormData?.NewPassword.length > 0
    ) {
      setPasswordError("Your password must be at least 8 characters.");
    } else {
      setPasswordError(null);
    }
  }, [changePasswordFormData.NewPassword]);

  return (
    <>
      {contextHolder}
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            maxWidth: "440px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="unica-regular-font"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Arka Plan  */}
            <rect width="100" height="100" fill="#f5f5f5" />
            {/* Sanat Figürü */}
            <circle cx="50" cy="50" r="30" fill="#FF6347" />
            {/* Çizgi  */}
            <line
              x1="20"
              y1="20"
              x2="80"
              y2="80"
              stroke="#333"
              strokeWidth="3"
            />
            {/* Yazı  */}
            <text
              x="50"
              y="95"
              fontSize="16"
              textAnchor="middle"
              fill="#333"
              className="unica-regular-font"
            >
              Art Bazaar
            </text>{" "}
          </svg>
          <div
            style={{
              fontSize: "26px",
              lineHeight: "32px",
              marginTop: "24px",
            }}
          >
            Change Your Password
          </div>
          <FormControl
            sx={{ marginTop: "24px", width: width <= 480 ? "95%" : "100%" }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                "&.MuiInputLabel-shrink": {
                  color: passwordError
                    ? "rgb(200,36,0)!important"
                    : "rgb(16, 35, 215) !important",
                  transition: "color 0.25s ease 0s, transform 0.25s ease 0s",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              New Password{" "}
            </InputLabel>
            <OutlinedInput
              autoFocus
              onFocus={handleFocus}
              onBlur={handleBlur}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    passwordError ||
                    (valuesBeenEnteredIntoThePasswordField &&
                      changePasswordFormData?.NewPassword.length < 1)
                      ? "rgb(200,36,0)!important"
                      : "#C2C2C2 !important",
                  transition: "border-color 0.25s ease 0s",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: passwordError
                    ? "1px solid rgb(200,36,0)!important"
                    : "1px solid #1325D4 !important",
                  transition: "border-color 0.25s ease 0s",
                },
              }}
              name="NewPassword"
              value={changePasswordFormData.NewPassword}
              onChange={handleChangePasswordData}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  {showPassword ? (
                    <svg
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      style={{
                        cursor: "pointer",
                      }}
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M16.7 10c.4-.5.4-1.2.1-1.8-2-3.3-4.6-4.9-7.8-4.9-1.5 0-2.8.4-4 1L3.6 2.9l-.7.7 1.3 1.3c-1.1.8-2.1 1.9-3 3.3-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7c1.4 0 2.7-.4 3.9-1.1l1.5 1.5.7-.7-1.3-1.3c1.1-.8 2-1.8 2.9-3.1zM9 13.6c-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C3 7.4 4 6.4 5 5.7l1.7 1.7c-.4.4-.6 1-.6 1.6 0 1.6 1.3 2.9 2.9 2.9.6 0 1.2-.2 1.6-.5l1.5 1.5c-1 .4-2 .7-3.1.7zm1.5-3.8L8.2 7.5c.2-.1.5-.2.8-.2.9 0 1.7.8 1.7 1.7 0 .3-.1.6-.2.8zm-.7.7c-.2.1-.5.2-.8.2-.9 0-1.7-.8-1.7-1.7 0-.3.1-.6.2-.8l2.3 2.3zm3.2 1.8-1.6-1.6c.3-.5.5-1 .5-1.6 0-1.6-1.3-2.9-2.9-2.9-.6 0-1.2.2-1.6.5L5.9 5.2c1-.5 2-.7 3.1-.7 2.8 0 5 1.4 6.8 4.3.1.2.1.4 0 .6-.9 1.2-1.8 2.2-2.8 2.9z"></path>
                    </svg>
                  ) : (
                    <svg
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      style={{
                        cursor: "pointer",
                      }}
                      viewBox="0 0 18 18"
                      width={18}
                      height={18}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.8 8.2c-2-3.3-4.6-4.9-7.8-4.9S3.2 5 1.2 8.2c-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7s5.6-1.6 7.7-4.7c.4-.6.4-1.3.1-1.8zm-1 .5c.1.2.1.4 0 .6-1.9 2.8-4.1 4.2-6.7 4.2-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C4 5.8 6.2 4.4 9 4.4s5 1.4 6.8 4.3zM9 11.9c1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9zm0-1.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7z"
                      ></path>
                    </svg>
                  )}
                </InputAdornment>
              }
              placeholder={isFocused && `New Password`}
              label="New Password"
            />
          </FormControl>
          {!passwordError &&
            !valuesBeenEnteredIntoThePasswordField &&
            changePasswordFormData?.NewPassword.length < 1 && (
              <div
                style={{
                  width: width <= 480 ? "95%" : "100%",
                }}
              >
                <span
                  className="unica-regular-font"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112, 112, 112)",
                    paddingLeft: "12px",
                  }}
                >
                  *Required
                </span>
              </div>
            )}
          {passwordError && (
            <div
              style={{
                width: width <= 480 ? "95%" : "100%",
              }}
            >
              <span
                className="unica-regular-font"
                style={{
                  fontSize: "13px",
                  lineHeight: "20px",
                  color: "rgb(200,36,0)",
                  paddingLeft: "12px",
                }}
              >
                {passwordError}
              </span>
            </div>
          )}
          {valuesBeenEnteredIntoThePasswordField &&
            changePasswordFormData?.NewPassword.length < 1 && (
              <div
                style={{
                  width: width <= 480 ? "95%" : "100%",
                }}
              >
                <span
                  className="unica-regular-font"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(200,36,0)",
                    paddingLeft: "12px",
                  }}
                >
                  Password required
                </span>
              </div>
            )}
          <FormControl
            sx={{ marginTop: "24px", width: width <= 480 ? "95%" : "100%" }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                "&.MuiInputLabel-shrink": {
                  color: passwordMatchError
                    ? "rgb(200,36,0)!important"
                    : "rgb(16, 35, 215) !important",
                  transition: "color 0.25s ease 0s, transform 0.25s ease 0s",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              Confirm New Password{" "}
            </InputLabel>
            <OutlinedInput
              onFocus={handleFocus}
              onBlur={handleBlur}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: passwordMatchError
                    ? "rgb(200,36,0)!important"
                    : "#C2C2C2 !important",
                  transition: "border-color 0.25s ease 0s",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: passwordMatchError
                    ? "1px solid rgb(200,36,0)!important"
                    : "1px solid #1325D4 !important",
                  transition: "border-color 0.25s ease 0s",
                },
              }}
              name="ConfirmNewPassword"
              value={changePasswordFormData.ConfirmNewPassword}
              onChange={handleChangePasswordData}
              id="outlined-adornment-password"
              type={showConfirmPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  {showConfirmPassword ? (
                    <svg
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      style={{
                        cursor: "pointer",
                      }}
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M16.7 10c.4-.5.4-1.2.1-1.8-2-3.3-4.6-4.9-7.8-4.9-1.5 0-2.8.4-4 1L3.6 2.9l-.7.7 1.3 1.3c-1.1.8-2.1 1.9-3 3.3-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7c1.4 0 2.7-.4 3.9-1.1l1.5 1.5.7-.7-1.3-1.3c1.1-.8 2-1.8 2.9-3.1zM9 13.6c-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C3 7.4 4 6.4 5 5.7l1.7 1.7c-.4.4-.6 1-.6 1.6 0 1.6 1.3 2.9 2.9 2.9.6 0 1.2-.2 1.6-.5l1.5 1.5c-1 .4-2 .7-3.1.7zm1.5-3.8L8.2 7.5c.2-.1.5-.2.8-.2.9 0 1.7.8 1.7 1.7 0 .3-.1.6-.2.8zm-.7.7c-.2.1-.5.2-.8.2-.9 0-1.7-.8-1.7-1.7 0-.3.1-.6.2-.8l2.3 2.3zm3.2 1.8-1.6-1.6c.3-.5.5-1 .5-1.6 0-1.6-1.3-2.9-2.9-2.9-.6 0-1.2.2-1.6.5L5.9 5.2c1-.5 2-.7 3.1-.7 2.8 0 5 1.4 6.8 4.3.1.2.1.4 0 .6-.9 1.2-1.8 2.2-2.8 2.9z"></path>
                    </svg>
                  ) : (
                    <svg
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      style={{
                        cursor: "pointer",
                      }}
                      viewBox="0 0 18 18"
                      width={18}
                      height={18}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.8 8.2c-2-3.3-4.6-4.9-7.8-4.9S3.2 5 1.2 8.2c-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7s5.6-1.6 7.7-4.7c.4-.6.4-1.3.1-1.8zm-1 .5c.1.2.1.4 0 .6-1.9 2.8-4.1 4.2-6.7 4.2-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C4 5.8 6.2 4.4 9 4.4s5 1.4 6.8 4.3zM9 11.9c1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9zm0-1.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7z"
                      ></path>
                    </svg>
                  )}
                </InputAdornment>
              }
              placeholder={isFocused && `Confirm New Password`}
              label="Confirm New Password"
            />
          </FormControl>
          {!passwordMatchError &&
            !valuesBeenEnteredIntoTheConfirmNewPasswordField &&
            changePasswordFormData?.ConfirmNewPassword.length < 1 && (
              <div
                style={{
                  width: width <= 480 ? "95%" : "100%",
                }}
              >
                <span
                  className="unica-regular-font"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112, 112, 112)",
                    paddingLeft: "12px",
                  }}
                >
                  *Required
                </span>
              </div>
            )}
          {passwordMatchError && (
            <div
              style={{
                width: width <= 480 ? "95%" : "100%",
              }}
            >
              <span
                className="unica-regular-font"
                style={{
                  fontSize: "13px",
                  lineHeight: "20px",
                  color: "rgb(200,36,0)",
                  paddingLeft: "12px",
                }}
              >
                Passwords must match
              </span>
            </div>
          )}
          {valuesBeenEnteredIntoTheConfirmNewPasswordField &&
            changePasswordFormData?.ConfirmNewPassword.length < 1 && (
              <div
                style={{
                  width: width <= 480 ? "95%" : "100%",
                }}
              >
                <span
                  className="unica-regular-font"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(200,36,0)",
                    paddingLeft: "12px",
                  }}
                >
                  Password confirmation required
                </span>
              </div>
            )}
          <button
            onClick={() => {
              if (
                changePasswordFormData?.NewPassword?.length &&
                changePasswordFormData?.ConfirmNewPassword?.length &&
                changePasswordFormData?.NewPassword ===
                  changePasswordFormData?.ConfirmNewPassword &&
                !passwordError &&
                !passwordMatchError
              ) {
                changePassword();
              }
            }}
            className={
              !changePasswordFormData?.NewPassword?.length ||
              !changePasswordFormData?.ConfirmNewPassword?.length ||
              !changePasswordFormData?.NewPassword ===
                changePasswordFormData?.ConfirmNewPassword ||
              passwordError
                ? "none unica-regular-font"
                : "pointer hover_bg_color_effect_white_text unica-regular-font"
            }
            style={{
              height: "50px",
              border: "none",
              backgroundColor: "black",
              color: "white",
              borderRadius: "9999px",
              width: width <= 480 ? "95%" : "100%",
              marginTop: "24px",
              fontSize: "16px",
              marginTop: "20px",
              pointerEvents:
                !changePasswordFormData?.NewPassword?.length ||
                !changePasswordFormData?.ConfirmNewPassword?.length ||
                changePasswordFormData?.NewPassword !==
                  changePasswordFormData?.ConfirmNewPassword ||
                passwordError
                  ? "none"
                  : "",
              opacity:
                changePasswordFormData?.NewPassword?.length &&
                changePasswordFormData?.ConfirmNewPassword?.length &&
                changePasswordFormData?.NewPassword ===
                  changePasswordFormData?.ConfirmNewPassword &&
                !passwordError &&
                !passwordMatchError
                  ? "1"
                  : "0.3",
            }}
          >
            Change My Password
          </button>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
