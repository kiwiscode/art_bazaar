import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import { useContext, useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import axios from "axios";
import { CollectorContext } from "../components/CollectorContext";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import Button from "../components/Button";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function EditProfileSettings() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { updateCollector, collectorInfo, getToken } =
    useContext(CollectorContext);
  const {
    contextHolder,
    showErrorMessage,
    showCustomMessageDarkBg,
    showCustomMessage,
  } = useAntdMessageHandler();
  const location = useLocation();
  const navItems = [
    { label: "Edit Profile", path: "/settings/edit-profile" },
    { label: "Account Settings", path: "/settings/edit-settings" },
    { label: "Order History", path: "/settings/purchases" },
  ];

  const [currentPassword, setCurrentPassword] = useState("");

  // const [isCorrectCurrentPassword, setIsCorrectCurrentPassword] =
  //   useState(false);

  // const checkPassword = async () => {
  //   try {
  //     const result = await axios.post(
  //       `${API_URL}/collectors/${collectorInfo?._id}/password-check`,
  //       { currentPassword },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //       }
  //     );

  //     if (result.status === 200) {
  //       setIsCorrectCurrentPassword(true);
  //     }
  //   } catch (error) {
  //     console.error("error:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (checkPassword) {
  //     checkPassword();
  //   }
  // }, [currentPassword]);

  const [changePasswordFormData, setChangePasswordFormData] = useState({
    NewPassword: "",
    ConfirmNewPassword: "",
  });

  const [formData, setFormData] = useState({
    collectorEmail: "",
    collectorMobile: "",
    priceRange: "",
  });

  const collectorEmailInputRef = useRef(null);
  const collectorCurrentPasswordRef = useRef(null);
  const selectRef = useRef(null);
  const [focusedInput, setFocusedInput] = useState("");
  const [selectOnClick, setSelectOnClick] = useState(false);
  const [selectMediumBorder, setSelectMediumBorder] = useState(
    "1px solid rgb(194, 194, 194)"
  );
  const [changePasswordSection, setChangePasswordSection] = useState(false);

  const handleSelectOnClick = (event) => {
    if (selectRef.current && selectRef.current.contains(event.target)) {
      setSelectOnClick(true);
    } else {
      setSelectOnClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleSelectOnClick);
    return () => {
      document.removeEventListener("mousedown", handleSelectOnClick);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const handleFocusCollectorEmailInputRef = () =>
      setFocusedInput("collectorEmailInputRef");
    const handleBlurCollectorEmailInputRef = () => setFocusedInput("");

    const inputRefs = [
      {
        ref: collectorEmailInputRef,
        focus: handleFocusCollectorEmailInputRef,
        blur: handleBlurCollectorEmailInputRef,
      },
    ];

    inputRefs.forEach(({ ref, focus, blur }) => {
      const inputElement = ref.current;
      if (inputElement) {
        inputElement.addEventListener("focus", focus);
        inputElement.addEventListener("blur", blur);
      }
    });
    return () => {
      inputRefs.forEach(({ ref, focus, blur }) => {
        const inputElement = ref.current;
        if (inputElement) {
          inputElement.removeEventListener("focus", focus);
          inputElement.removeEventListener("blur", blur);
        }
      });
    };
  }, []);

  const refreshCollector = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      updateCollector(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectorInfo?.active) {
      refreshCollector();
    }
  }, []);

  useEffect(() => {
    if (collectorInfo?.active) {
      setFormData({
        ...formData,
        collectorEmail: collectorInfo.email,
      });
    }
  }, [collectorInfo]);

  console.log("form data:", formData);

  // save changes
  const [changesOn, setChangesOn] = useState(false);
  const [changesOnPasswordChange, setChangesOnPasswordChange] = useState(false);

  const saveChanges = async () => {
    setChangesOn(true);
    try {
      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo._id}/edit-profile`,
        {
          formData,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("result:", result);

      if (result.status === 200) {
        setTimeout(() => {
          setChangesOn(false);
          refreshCollector();
          showCustomMessage("Information updated successfully", 6);
        }, 750);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const [
    valuesBeenEnteredIntoTheCurrentPasswordField,
    setValuesBeenEnteredIntoTheCurrentPasswordField,
  ] = useState(false);
  const [
    valuesBeenEnteredIntoThePasswordField,
    setValuesBeenEnteredIntoThePasswordField,
  ] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [
    valuesBeenEnteredIntoTheConfirmNewPasswordField,
    setValuesBeenEnteredIntoTheConfirmNewPasswordField,
  ] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleMouseDownCurrentPassword = (e) => {
    e.preventDefault();
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

  const handleChangePasswordData = (e) => {
    const { name, value } = e.target;
    console.log("name:", name);
    console.log("value:", value);

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

  const handleFocus = () => {
    console.log("focused ...");
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const passwordMustMatch = () => {
    setPasswordMatchError(true);
  };

  useEffect(() => {
    console.log("new password:", changePasswordFormData?.NewPassword);
    console.log(
      "confirm new password:",
      changePasswordFormData?.ConfirmNewPassword
    );
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

  const changePassword = async () => {
    if (
      changePasswordFormData.NewPassword ===
        changePasswordFormData.ConfirmNewPassword &&
      changePasswordFormData.NewPassword === currentPassword
    ) {
      showErrorMessage("", 6, true, true);
    } else {
      setChangesOnPasswordChange(true);
      try {
        const result = await axios.patch(
          `${API_URL}/collectors/${collectorInfo?._id}/change-password`,
          {
            changePasswordFormData,
            currentPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (result.status === 200) {
          setTimeout(() => {
            setChangesOnPasswordChange(false);
            refreshCollector();
            showCustomMessage("Information updated successfully", 6);
          }, 2000);
        }
      } catch (error) {
        console.error("error:", error);
        setChangesOnPasswordChange(false);
        if (error.response.status === 400) {
          showErrorMessage("", 6, true);
        }
      }
    }
  };

  return (
    <>
      {contextHolder}
      {/* custom saves page header */}
      <div className="saves-header-wrapper unica-regular-font">
        {/* profile back banner */}
        <div className="profile-back-banner">
          <div className="box-20-px-m-top"></div>
          <div
            onClick={() => navigate("/collector-profile/my-collection")}
            style={{
              gap: "10px",
              fontSize: "13px",
              lineHeight: "1px",
              display: "inline-flex",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <svg width={18} height={14} viewBox="0 0 18 18" fill="currentColor">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
              ></path>
            </svg>
            <span>Profile</span>
          </div>
          <div className="box-20-px-m-top"></div>
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-40-px-m-top"></div>
        )}
        <div
          className="favorite-text-header"
          style={{
            letterSpacing: "-0.01em",
            fontSize: width <= 768 ? "26px" : "60px",
            lineHeight: width <= 768 ? "32px" : "70px",
          }}
        >
          Settings
        </div>

        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-60-px-m-top"></div>
        )}
      </div>
      <HeaderNavBar
        wrapperMargin={width <= 768 ? "0px" : "0px 40px"}
        responsivePadding={"0px 20px"}
        items={navItems}
        currentPath={location.pathname}
        width={width}
      />
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-40-px-m-top"></div>
      )}

      {/* edit profile settings wrapper */}
      <div className="profile-settings-wrapper unica-regular-font">
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-40-px-m-top"></div>
        )}
        <div className="profile-settings-wrapper-container">
          <div
            style={{
              fontSize: width <= 768 ? "20px" : "26px",
              lineHeight: width <= 768 ? "32px" : "40px",
              letterSpacing: "-0.01em",
            }}
          >
            Information
          </div>
          {width <= 768 ? (
            <div className="box-30-px-m-top"></div>
          ) : (
            <div className="box-30-px-m-top"></div>
          )}
          <div className="email-input-wrapper">
            <Input
              inputRef={collectorEmailInputRef}
              className={"styled-input-with-label"}
              placeholder={
                focusedInput === "collectorEmailInputRef"
                  ? "Enter your email address"
                  : formData?.collectorEmail
              }
              width={"inherit"}
              wrapperWidth={"100%"}
              wrapperMaxWidth={width <= 768 ? "100%" : "60%"}
              maxWidth={"100%"}
              minWidth={"fit-content"}
              maxHeight={"40px"}
              wrapperHeight={"100%"}
              wrapperMaxHeight={"50px"}
              height={"100dvh"}
              borderRadius={"3px"}
              name={"collectorEmail"}
              value={formData?.collectorEmail}
              onChange={handleChange}
              withLabel={true}
              labelClassName={
                formData?.collectorEmail
                  ? `styled-input-label filled-input-label unica-regular-font`
                  : `styled-input-label unica-regular-font`
              }
              labelHtmlFor={"Email"}
              labelText={"Email"}
            />
            <div className="required-info unica-regular-font">*Required</div>
          </div>
          {width <= 768 ? (
            <div className="box-30-px-m-top"></div>
          ) : (
            <div className="box-30-px-m-top"></div>
          )}
          <div
            style={{
              maxHeight: "50px",
              height: "100%",
              position: "relative",
              maxWidth: width <= 768 ? "100%" : "60%",
            }}
          >
            <label
              htmlFor="Price Range"
              className={
                selectOnClick
                  ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                  : formData.priceRange
                  ? "selected-active-select-input styled-input-label unica-regular-font"
                  : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
              }
            >
              Price Range
            </label>
            <select
              className="pointer select-input-edit-profile"
              ref={selectRef}
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              style={{
                width: "100%",
                maxWidth: "100%",
                border: selectMediumBorder,
                transition: "border 0.25s ease",
                height: "100dvh",
                maxHeight: "50px",
                fontSize: "16px",
                lineHeight: "26px",
                borderRadius: "3px",
                outline: "none",
                padding: "0px 5px",
              }}
              onFocus={() =>
                setSelectMediumBorder("1px solid rgb(16, 35, 215)")
              }
              onBlur={() =>
                setSelectMediumBorder("1px solid rgb(194, 194, 194)")
              }
            >
              <>
                <option value="" diabled selected hidden></option>
                <option value="Under $500">Under $500</option>
                <option value="Under $2,500">Under $2,500</option>
                <option value="Under $5,000">Under $5,000</option>
                <option value="Under $10,000">Under $10,000</option>
                <option value="Under $25,000">Under $25,000</option>
                <option value="Under $50,000">Under $50,000</option>
                <option value="Under $100,000">Under $100,000</option>
                <option value="No budget in mind">No budget in mind</option>
              </>
            </select>
          </div>
          <div className="box-40-px-m-top"></div>
          <Button
            onClick={saveChanges}
            className={
              "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
            }
            backgroundColor={"black"}
            height="100dvh"
            textColor={"white"}
            fontSize={"15px"}
            maxHeight={"50px"}
            width={"100%"}
            maxWidth={width <= 768 ? "100%" : "150px"}
            padding="1px 25px"
            borderRadius="25px"
            cursor="pointer"
            text={"Save Changes"}
            border="1px solid rgb(0,0,0)"
            lineHeight="26px"
            opacity={changesOn || !formData.collectorEmail ? 0.3 : 1}
            pointerEvents={
              changesOn || !formData.collectorEmail ? "none" : "auto"
            }
            loadingScenario={changesOn}
            strokeColorLoadingSpinner={!changesOn}
          />{" "}
          {width <= 768 ? (
            <div
              className="box-40-px-m-top"
              style={{
                borderBottom: "1px solid rgb(231, 231, 231)",
                maxWidth: width <= 768 ? "100%" : "60%",
              }}
            ></div>
          ) : (
            <div
              className="box-40-px-m-top"
              style={{
                borderBottom: "1px solid rgb(231, 231, 231)",
                maxWidth: width <= 768 ? "100%" : "60%",
              }}
            ></div>
          )}
          <div
            style={{
              fontSize: width <= 768 ? "20px" : "26px",
              lineHeight: width <= 768 ? "32px" : "40px",
              letterSpacing: "-0.01em",
              marginTop: "40px",
              marginBottom: "40px",
            }}
          >
            Password
          </div>
          {/* current password input wrapper */}
          {!changePasswordSection ? (
            <>
              <div className="currentPassword-input-wrapper">
                <Input
                  inputRef={collectorEmailInputRef}
                  className={"styled-input-with-label"}
                  inputType={"password"}
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={width <= 768 ? "100%" : "60%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"collectorEmail"}
                  value={formData?.collectorEmail}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={`styled-input-label filled-input-label unica-regular-font`}
                  labelHtmlFor={"Password"}
                  labelText={"Password"}
                  disabledInput={true}
                />
                <div
                  className="required-info unica-regular-font"
                  style={{
                    opacity: "0.3",
                  }}
                >
                  *Required
                </div>
              </div>
              <div className="box-40-px-m-top"></div>
              <Button
                onClick={() => {
                  setChangePasswordSection(true);
                }}
                className={
                  "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                }
                backgroundColor={"black"}
                height="100dvh"
                width={"100%"}
                textColor={"white"}
                fontSize={"15px"}
                maxHeight={"50px"}
                maxWidth={width <= 768 ? "100%" : "220px"}
                padding="1px 25px"
                borderRadius="25px"
                cursor="pointer"
                text={"Create New Password"}
                border="1px solid rgb(0,0,0)"
                lineHeight="26px"
              />{" "}
            </>
          ) : (
            <>
              <div className="currentPassword-input-wrapper">
                <FormControl
                  sx={{
                    marginTop: "24px",
                    width: width <= 768 ? "100%" : "60%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    sx={{
                      "&.MuiInputLabel-shrink": {
                        color: passwordError
                          ? "rgb(200,36,0)!important"
                          : "rgb(16, 35, 215) !important",
                        transition:
                          "color 0.25s ease 0s, transform 0.25s ease 0s",
                      },
                    }}
                    htmlFor="outlined-adornment-password"
                  >
                    Current Password
                  </InputLabel>
                  <OutlinedInput
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          passwordError ||
                          (valuesBeenEnteredIntoTheCurrentPasswordField &&
                            currentPassword?.length < 1)
                            ? "rgb(200,36,0)!important"
                            : "#C2C2C2 !important",
                        transition: "border-color 0.25s ease 0s",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border:
                          valuesBeenEnteredIntoTheCurrentPasswordField &&
                          currentPassword?.length < 1
                            ? "1px solid rgb(200,36,0)!important"
                            : "1px solid #1325D4 !important",
                        transition: "border-color 0.25s ease 0s",
                      },
                    }}
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => {
                      setValuesBeenEnteredIntoTheCurrentPasswordField(true);
                      setCurrentPassword(e.target.value);
                    }}
                    id="outlined-adornment-password"
                    type={showCurrentPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        {showCurrentPassword ? (
                          <svg
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
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
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
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
                    placeholder={isFocused && `Enter your current password`}
                    label="Current Password"
                  />
                </FormControl>
                {!valuesBeenEnteredIntoTheCurrentPasswordField &&
                  currentPassword?.length < 1 && (
                    <div
                      style={{
                        width: "100%",
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
                {valuesBeenEnteredIntoTheCurrentPasswordField &&
                  currentPassword?.length < 1 && (
                    <div
                      style={{
                        width: "100%",
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
                        Current password required
                      </span>
                    </div>
                  )}
              </div>
              <div className="newPassword-input-wrapper">
                <FormControl
                  sx={{
                    marginTop: "24px",
                    width: width <= 768 ? "100%" : "60%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    sx={{
                      "&.MuiInputLabel-shrink": {
                        color: passwordError
                          ? "rgb(200,36,0)!important"
                          : "rgb(16, 35, 215) !important",
                        transition:
                          "color 0.25s ease 0s, transform 0.25s ease 0s",
                      },
                    }}
                    htmlFor="outlined-adornment-password"
                  >
                    New Password
                  </InputLabel>
                  <OutlinedInput
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
                    placeholder={isFocused && `Enter your new password`}
                    label="New Password"
                  />
                </FormControl>
                {!passwordError &&
                  !valuesBeenEnteredIntoThePasswordField &&
                  changePasswordFormData?.NewPassword.length < 1 && (
                    <div
                      style={{
                        width: "100%",
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
                      width: "100%",
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
                        width: "100%",
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
              </div>
              <div className="confirmPassword-input-wrapper">
                <FormControl
                  sx={{
                    marginTop: "24px",
                    width: width <= 768 ? "100%" : "60%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    sx={{
                      "&.MuiInputLabel-shrink": {
                        color: passwordMatchError
                          ? "rgb(200,36,0)!important"
                          : "rgb(16, 35, 215) !important",
                        transition:
                          "color 0.25s ease 0s, transform 0.25s ease 0s",
                      },
                    }}
                    htmlFor="outlined-adornment-password"
                  >
                    Repeat New Password{" "}
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
                    placeholder={isFocused && `Confirm your new password`}
                    label="Repeat New Password"
                  />
                </FormControl>
                {!passwordMatchError &&
                  !valuesBeenEnteredIntoTheConfirmNewPasswordField &&
                  changePasswordFormData?.ConfirmNewPassword.length < 1 && (
                    <div
                      style={{
                        width: "100%",
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
                      width: "100%",
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
                        width: "100%",
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
              </div>
              <div className="box-40-px-m-top"></div>
              <div
                style={{
                  maxWidth: width <= 768 ? "100%" : "60%",
                  display: width <= 768 ? "" : "flex",
                }}
              >
                <Button
                  onClick={changePassword}
                  className={
                    "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                  }
                  backgroundColor={"black"}
                  height="100dvh"
                  textColor={"white"}
                  fontSize={"15px"}
                  maxHeight={"50px"}
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  width={"100%"}
                  maxWidth={width <= 768 ? "100%" : "150px"}
                  text={"Save Changes"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  opacity={
                    changesOnPasswordChange ||
                    passwordMatchError ||
                    !changePasswordFormData.NewPassword ||
                    !changePasswordFormData.ConfirmNewPassword
                      ? 0.3
                      : 1
                  }
                  pointerEvents={
                    changesOnPasswordChange ||
                    passwordMatchError ||
                    !changePasswordFormData.NewPassword ||
                    !changePasswordFormData.ConfirmNewPassword
                      ? "none"
                      : "auto"
                  }
                  loadingScenario={changesOnPasswordChange}
                  strokeColorLoadingSpinner={!changesOnPasswordChange}
                />
                {width <= 768 && <div className="box-10-px-m-top"></div>}
                <Button
                  onClick={() => setChangePasswordSection(false)}
                  className={
                    "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                  }
                  backgroundColor={"white"}
                  height="100dvh"
                  textColor={"black"}
                  fontSize={"15px"}
                  maxHeight={"50px"}
                  padding="1px 25px"
                  margin={width > 768 && "0px 10px"}
                  borderRadius="25px"
                  cursor="pointer"
                  text={"Cancel"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  width={width <= 768 && "100%"}
                />
              </div>
            </>
          )}
          {width <= 768 ? (
            <div
              className="box-40-px-m-top"
              style={{
                borderBottom: "1px solid rgb(231, 231, 231)",
                maxWidth: width <= 768 ? "100%" : "60%",
              }}
            ></div>
          ) : (
            <div
              className="box-40-px-m-top"
              style={{
                borderBottom: "1px solid rgb(231, 231, 231)",
                maxWidth: width <= 768 ? "100%" : "60%",
              }}
            ></div>
          )}
          <div className="box-40-px-m-top"></div>
          <div
            onClick={() => {
              navigate("/settings/delete");
            }}
            style={{
              color: "rgb(200, 36, 0)",
              cursor: "pointer",
            }}
          >
            Delete Account
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditProfileSettings;
