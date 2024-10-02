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

function EditProfileDelete() {
  const scrollRef = useRef(null);
  const { collectorInfo, getToken, logout } = useContext(CollectorContext);
  const { contextHolder, showErrorMessage, showCustomMessage } =
    useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const location = useLocation();
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(null);
  const [deleteIUnderstand, setDeleteIUnderstand] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  const navItems = [
    { label: "Edit Profile", path: "/settings/edit-profile" },
    { label: "Account Settings", path: "/settings/edit-settings" },
    { label: "Order History", path: "/settings/purchases" },
  ];

  //
  const [formData, setFormData] = useState({
    permanentDeleteConfirmed: "",
    accountDeletionReason: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [textAreaOnClick, setTextAreaOnClick] = useState(false);
  const [onFocusAbout, setOnFocusAbout] = useState(null);
  const textAreaRef = useRef(null);
  const [borderTextArea, setBorderTextArea] = useState(null);
  const handleTextAreaOnClick = (event) => {
    if (textAreaRef.current && textAreaRef.current.contains(event.target)) {
      setTextAreaOnClick(true);
    } else {
      setTextAreaOnClick(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleTextAreaOnClick);
    return () => {
      document.removeEventListener("mousedown", handleTextAreaOnClick);
    };
  }, []);

  // current password side
  const [passwordError, setPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [
    valuesBeenEnteredIntoTheCurrentPasswordField,
    setValuesBeenEnteredIntoTheCurrentPasswordField,
  ] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [deleteProgressStarted, setDeleteProgressStarted] = useState(false);
  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleMouseDownCurrentPassword = (e) => {
    e.preventDefault();
  };
  const handleFocus = () => {
    ("focused ...");
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const deleteAccount = async () => {
    setDeleteProgressStarted(true);
    try {
      const result = await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/delete-account`,
        {
          formData,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      "result after delete:", result;
      if (result.status === 200) {
        setTimeout(() => {
          showCustomMessage("", 12, true);
        }, 2000);
        setTimeout(() => {
          logout();
          navigate("/");
        }, 4000);

        setTimeout(() => {
          setDeleteProgressStarted(false);
        }, 5000);
      }
    } catch (error) {
      console.error("error:", error);
      setDeleteProgressStarted(false);
      if (error.response.status === 400) {
        showErrorMessage("", 6, true);
      }
    }
  };

  useEffect(() => {
    "form data:", formData;
  }, [formData]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

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
        <div ref={scrollRef}></div>
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
            Delete My Account
          </div>
          {width <= 768 ? (
            <div className="box-30-px-m-top"></div>
          ) : (
            <div className="box-30-px-m-top"></div>
          )}
        </div>
        <div className="profile-settings-delete-profile-details">
          <div
            onClick={() => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                permanentDeleteConfirmed: true,
              }));
              setClicked(!clicked);
            }}
            onMouseEnter={() => setDeleteIUnderstand(true)}
            onMouseLeave={() => setDeleteIUnderstand(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              onMouseEnter={() => setDeleteIUnderstand(true)}
              style={{
                width: "18px",
                height: "18px",
                border: deleteIUnderstand
                  ? "1px solid rgb(16, 35, 215)"
                  : "1px solid rgb(112,112,112)",
                backgroundColor:
                  clicked && deleteIUnderstand
                    ? "rgb(16, 35, 215)"
                    : clicked
                    ? "black"
                    : "transparent",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 18 18" fill="white">
                <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
              </svg>
            </div>
            <div
              className="hover_color_effect hover_color_effect_t-d unica-regular-font"
              style={{
                fontSize: "16px",
                lineHeight: "20px",
                color: deleteIUnderstand
                  ? "rgb(16,35,215)"
                  : "rgb(112,112,112)",

                textDecoration: deleteIUnderstand ? "underline" : "",
                textDecorationColor: deleteIUnderstand
                  ? "rgb(16, 35, 215)"
                  : "",
              }}
            >
              I understand that this will permanently delete my account and
              cannot be undone.
            </div>
          </div>
          <div className="box-40-px-m-top"></div>
          {/* account deletion reason section */}
          <div
            style={{
              width: width <= 768 ? "100%" : "60%",
              maxWidth: "100%",
              borderRadius: "3px",
              position: "relative",
            }}
          >
            <label
              htmlFor="About"
              className={
                (textAreaOnClick || formData.accountDeletionReason) &&
                onFocusAbout
                  ? "text-area-label-on-focus text-area-label-style unica-regular-font"
                  : formData.accountDeletionReason && !onFocusAbout
                  ? "text-area-label-on-focus text-area-label-style unica-regular-font color-change"
                  : "text-area-label-style unica-regular-font"
              }
            >
              Please Tell Us Why
            </label>{" "}
            <textarea
              ref={textAreaRef}
              className="unica-regular-font"
              name="accountDeletionReason"
              value={formData.accountDeletionReason}
              onChange={handleChange}
              style={{
                maxWidth: "100%",
                width: "100%",
                maxHeight: "150px",
                height: "100dvh",
                border: borderTextArea,
                borderRadius: "3px",
                lineHeight: "24px",
                fontSize: "16px",
                resize: "vertical",
                outline: "none",
                transition: "border 0.25s ease",
                padding: "4px 0px 0px 8px",
                margin: "0px",
              }}
              onFocus={() => {
                setOnFocusAbout(true);
                setBorderTextArea("1px solid rgb(16, 35, 215)");
              }}
              onBlur={() => {
                setOnFocusAbout(false);
                setBorderTextArea("1px solid rgb(194, 194, 194)");
              }}
            />{" "}
            <div className="required-info unica-regular-font">*Required</div>
          </div>
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
                    transition: "color 0.25s ease 0s, transform 0.25s ease 0s",
                  },
                }}
                htmlFor="outlined-adornment-password"
              >
                Password
              </InputLabel>
              <OutlinedInput
                onFocus={handleFocus}
                onBlur={handleBlur}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      passwordError ||
                      (valuesBeenEnteredIntoTheCurrentPasswordField &&
                        formData.password?.length < 1)
                        ? "rgb(200,36,0)!important"
                        : "#C2C2C2 !important",
                    transition: "border-color 0.25s ease 0s",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border:
                      valuesBeenEnteredIntoTheCurrentPasswordField &&
                      formData.password?.length < 1
                        ? "1px solid rgb(200,36,0)!important"
                        : "1px solid #1325D4 !important",
                    transition: "border-color 0.25s ease 0s",
                  },
                }}
                name="password"
                value={formData.password}
                onChange={(e) => {
                  setValuesBeenEnteredIntoTheCurrentPasswordField(true);
                  handleChange(e);
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
                placeholder={isFocused && `Enter your password`}
                label="Password"
              />
            </FormControl>
            {!valuesBeenEnteredIntoTheCurrentPasswordField &&
              formData.password?.length < 1 && (
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
              formData.password?.length < 1 && (
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
          <div className="box-40-px-m-top"></div>
          <Button
            onClick={deleteAccount}
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
            text={"Submit"}
            border="1px solid rgb(0,0,0)"
            lineHeight="26px"
            opacity={
              deleteProgressStarted ||
              !formData.permanentDeleteConfirmed ||
              !formData?.accountDeletionReason ||
              !formData.password ||
              !clicked
                ? 0.3
                : 1
            }
            pointerEvents={
              deleteProgressStarted ||
              !formData.permanentDeleteConfirmed ||
              !formData?.accountDeletionReason ||
              !formData.password ||
              !clicked
                ? "none"
                : "auto"
            }
            loadingScenario={deleteProgressStarted}
            strokeColorLoadingSpinner={!deleteProgressStarted}
          />{" "}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditProfileDelete;
