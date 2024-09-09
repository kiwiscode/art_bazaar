import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Divider,
} from "@mui/material";
import useWindowDimensions from "../../utils/useWindowDimensions";
import LoadingSpinner from "./LoadingSpinner";
import ProfileImage from "./ProfileImage";
import useOutsideClick from "../../utils/useOutsideClick";
import { CollectorContext } from "./CollectorContext";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Input from "./Input";
import SearchArtistInput from "./SearchArtistInput";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function Navbar({ showAuthModal, setShowAuthModal }) {
  const navigate = useNavigate();
  const { collectorInfo, logout, googleLogout, getToken, updateCollector } =
    useContext(CollectorContext);
  useEffect(() => {
    if (!collectorInfo) {
      JSON.parse(localStorage.getItem("collectorInfo"));
    }
  }, [collectorInfo]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [artists, setArtists] = useState([]);
  const handleArtistsUpdate = (newArtists) => {
    console.log("new artists:", newArtists);
    setArtists(newArtists);
  };
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [signUpOn, setSignUpOn] = useState(false);
  const [loginOn, setLoginOn] = useState(false);
  const [forgotPasswordOn, setForgotPasswordOn] = useState(false);
  const { width } = useWindowDimensions();
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [forgotPasswordFormData, setForgotPasswordFormData] = useState({
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupDisclaimerHovered, setSignupDisclaimerHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [invalidEmailError, setInvalidEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [existEmailError, setExistEmailError] = useState(null);
  const [invalidLoginDataError, setInvalidLoginDataError] = useState(false);

  const [
    valuesBeenEnteredIntoTheNameField,
    setValuesBeenEnteredIntoTheNameField,
  ] = useState("");
  const [
    valuesBeenEnteredIntoTheEmailField,
    setValuesBeenEnteredIntoTheEmailField,
  ] = useState("");
  const [
    valuesBeenEnteredIntoThePasswordField,
    setValuesBeenEnteredIntoThePasswordField,
  ] = useState("");
  const [
    valuesBeenEnteredIntoTheForgotPassEmailField,
    setValuesBeenEnteredIntoTheForgotPassEmailField,
  ] = useState("");
  const [hoveredArtists, setHoveredArtists] = useState(false);
  const [hoveredArtworks, setHoveredArtworks] = useState(false);
  const letters = [];
  for (let i = 65; i <= 90; i++) {
    letters.push(String.fromCharCode(i));
  }
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleChangeSignupFormData = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setValuesBeenEnteredIntoTheNameField(true);
    }

    setSignUpFormData({
      ...signUpFormData,
      [name]: value,
    });
  };
  const handleChangeLoginFormData = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setValuesBeenEnteredIntoTheEmailField(true);
    }
    if (name === "password") {
      setValuesBeenEnteredIntoThePasswordField(true);
    }
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };
  const handleChangeForgotPasswordFormData = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setValuesBeenEnteredIntoTheForgotPassEmailField(true);
    }

    setForgotPasswordFormData({
      ...forgotPasswordFormData,
      [name]: value,
    });
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setSignUpOn(false);
    setLoginOn(false);
    setForgotPasswordOn(false);
    setSignUpFormData({
      name: "",
      email: "",
      password: "",
    });
    setLoginFormData({
      email: "",
      password: "",
    });
    setForgotPasswordFormData({
      email: "",
    });
    setInvalidEmailError(null);
    setPasswordError(null);
    setIsFocused(false);
    setExistEmailError(null);
    setInvalidLoginDataError(false);
    setValuesBeenEnteredIntoTheNameField("");
    setValuesBeenEnteredIntoTheEmailField("");
    setValuesBeenEnteredIntoThePasswordField("");
    setValuesBeenEnteredIntoTheForgotPassEmailField("");
  };

  const openForgotPasswordModal = () => {
    setSignUpOn(false);
    setLoginOn(false);
    setForgotPasswordOn(true);
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    setCartItems(storedCartItems);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setShowScrollToTop(window.scrollY > 275);
  };

  const handleLogout = async () => {
    setPopupVisible(false);
    try {
      const result = await axios.post(
        `${API_URL}/auth/logout`,
        { collectorId: collectorInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (result.status === 200) {
        localStorage.removeItem("collectorInfo");
        localStorage.removeItem("token");

        logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSignUpOn(false);
      setLoginOn(true);
    }, 400);
    axios
      .post(`${API_URL}/auth/signup`, {
        signUpFormData,
      })
      .then(() => {
        setInvalidLoginDataError(false);
      })
      .catch((error) => {
        const { status } = error.response;

        if (status === 501) {
          setExistEmailError("Email need to be unique. Provide a valid email.");
        }
      });
  };

  const emailCheck = async () => {
    try {
      const result = await axios.post(`${API_URL}/auth/check-email`, {
        email: signUpFormData.email,
      });

      if (result.status === 200) {
        setExistEmailError(false);
      } else {
        console.error("Error during email check. Status:", result.status);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status === 409) {
        setExistEmailError(true);
      }
    }
  };

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|co\.uk|ukmail\.com|hotmail\.tr|icloud\.com|yahoo\.com)$/;

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (
      (!validateEmail(signUpFormData?.email) && signUpFormData?.email.length) ||
      (!validateEmail(loginFormData?.email) && loginFormData?.email.length) ||
      (!validateEmail(forgotPasswordFormData?.email) &&
        forgotPasswordFormData?.email.length)
    ) {
      setInvalidEmailError(true);
    } else {
      setInvalidEmailError(false);
    }
    if (signUpFormData?.email) {
      validateEmail(signUpFormData?.email);
      emailCheck();
    }
  }, [
    signUpFormData?.email,
    loginFormData?.email,
    forgotPasswordFormData?.email,
  ]);

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  useEffect(() => {
    if (
      (!regex.test(signUpFormData.password) ||
        signUpFormData.password.length < 8) &&
      signUpFormData?.password.length > 0
    ) {
      setPasswordError("Your password must be at least 8 characters.");
    } else {
      setPasswordError(null);
    }
  }, [signUpFormData.password]);

  // google auth
  const googleAuth = () => {
    window.open(
      `${import.meta.env.VITE_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const modalContent = modalContentRef.current;
      if (modalContent.scrollTop === 0) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    const modalContent = modalContentRef.current;
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${API_URL}/auth/login`,
        {
          loginFormData,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const { collector, token } = result.data;

      setTimeout(() => {
        setLoading(false);
        closeAuthModal();
        localStorage.setItem("collectorInfo", JSON.stringify(collector));
        localStorage.setItem("token", token);
        updateCollector(collector);
      }, 1000);
    } catch (error) {
      if (error.response.status === 401) {
        setInvalidLoginDataError(true);
        setLoading(false);
      }
      console.error("error:", error);
    }
  };

  // send password reset link
  const [resetLinkInfoPopup, setResetLinkInfoPopup] = useState(null);
  const handlePasswordResetLinkToEmail = async () => {
    setResetLinkInfoPopup(false);
    setLoading(true);
    try {
      const result = await axios.post(
        `${API_URL}/auth/reset_password`,
        { forgotPasswordFormData },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (result.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setResetLinkInfoPopup(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false);
          setResetLinkInfoPopup(true);
        }, 1000);
        console.error(
          "Error during sending email process. Status:",
          result.status
        );
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setResetLinkInfoPopup(true);
      }, 1000);
      console.error("error:", error);
    }
  };
  useEffect(() => {
    setResetLinkInfoPopup(false);
  }, [forgotPasswordOn]);
  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };

  // get all artists
  const [artistsOnHoverModal, setArtistsOnHoverModal] = useState([]);
  const getArtists = async () => {
    try {
      const result = await axios.get(`${API_URL}/artist/all-artists`);
      if (result.status === 200) {
        setArtistsOnHoverModal(result.data);
      } else {
        console.error("Error during get all artists. Status:", result.status);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    getArtists();
  }, []);

  // profile menu
  const [isPopupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const { isOutsideClicked: isOutsideClickedPopupRef } =
    useOutsideClick(popupRef);

  console.log("is outside click:", isOutsideClickedPopupRef);

  useEffect(() => {
    if (isOutsideClickedPopupRef) {
      setPopupVisible(false);
    }
  }, [isOutsideClickedPopupRef]);

  const toggleProfilePopup = () => {
    setPopupVisible((prevState) => !prevState);
  };

  useEffect(() => {
    document.body.style.overflow = isPopupVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupVisible]);

  const [artistLoading, setArtistLoading] = useState(false);
  const [closeSearchedResults, setCloseSearchedResults] = useState(false);

  const getQueryFromInput = (data) => {
    console.log("data query:", data);
    if (data.length) {
      setCloseSearchedResults(false);
    }
  };

  return (
    <>
      {/* sign up modal  */}
      <>
        <>
          <Modal
            open={signUpOn || loginOn || forgotPasswordOn || showAuthModal}
            onClose={closeAuthModal}
            sx={{
              "& > .MuiBackdrop-root": {
                opacity: "0.5 !important",
                backgroundColor: "rgb(202, 205, 236)",
                filter: "brightness(2.5)",
                margin: 0,
                padding: 0,
              },
            }}
          >
            <div
              ref={modalContentRef}
              className=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: width <= 768 ? "98%" : 410,
                maxHeight: "95vh",
                height: loginOn && width <= 768 && "95vh",
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
              }}
            >
              {(signUpOn || showAuthModal) && !loginOn && !forgotPasswordOn ? (
                <div>
                  <div
                    style={{
                      position: "sticky",
                      top: "0",
                      overflow: "hidden",
                      zIndex: 2,
                    }}
                    className={
                      isScrolling
                        ? `header_modal scroll_active`
                        : `header_modal`
                    }
                  >
                    <button
                      onClick={() => {
                        closeAuthModal();
                        setSignUpFormData({
                          name: "",
                          email: "",
                          password: "",
                        });
                        setSignUpOn(false);
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        width: "58px",
                        height: "58px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <svg width={18} height={18} viewBox="0 0 18 18">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                        ></path>
                      </svg>
                    </button>

                    <div
                      style={{
                        margin: "20px",
                        maxWidth: "312px",
                      }}
                    >
                      <div>
                        {" "}
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
                            y="90"
                            fontSize="12"
                            textAnchor="middle"
                            fill="#333"
                          >
                            Art Bazaar
                          </text>{" "}
                        </svg>
                      </div>
                      <div
                        className="chirp-regular-font unica-regular-font"
                        style={{
                          fontSize: "26px",
                          lineHeight: "34px",
                        }}
                      >
                        Sign up to discover, buy, and sell fine art
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0px 20px 20px",
                    }}
                    className="body_modal"
                  >
                    <TextField
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: "1px solid rgb(16, 35, 215) !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isFocused
                            ? "#C2C2C2 !important"
                            : valuesBeenEnteredIntoTheNameField &&
                              signUpFormData?.name.length < 1
                            ? "rgb(200,36,0) !important"
                            : "#C2C2C2 !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: isFocused && "rgb(16, 35, 215) !important",
                          transition:
                            "color 0.25s ease 0s, transform 0.25s ease 0s",
                        },
                      }}
                      type="text"
                      name="name"
                      id="outlined-basic"
                      variant={"outlined"}
                      placeholder={isFocused && `Enter your full name`}
                      label={`Name`}
                      style={{
                        width: "100%",
                        marginTop: "12px",
                      }}
                      value={signUpFormData.name}
                      onChange={handleChangeSignupFormData}
                    />{" "}
                    {valuesBeenEnteredIntoTheNameField &&
                      signUpFormData?.name.length < 1 && (
                        <div>
                          <span
                            className="unica-regular-font"
                            style={{
                              fontSize: "13px",
                              lineHeight: "20px",
                              color: "rgb(200,36,0)",
                              paddingLeft: "12px",
                            }}
                          >
                            Name is required.
                          </span>
                        </div>
                      )}
                    <TextField
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: invalidEmailError
                            ? "1px solid rgb(200,36,0) !important"
                            : "1px solid rgb(16, 35, 215) !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: invalidEmailError
                            ? "rgb(200,36,0)"
                            : "#C2C2C2 !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: invalidEmailError
                            ? "rgb(200,36,0)"
                            : "rgb(16, 35, 215) !important",
                          transition:
                            "color 0.25s ease 0s, transform 0.25s ease 0s",
                        },
                      }}
                      type="text"
                      name="email"
                      id="outlined-basic"
                      variant={"outlined"}
                      placeholder={isFocused && `Enter your email address`}
                      label={`Email`}
                      style={{
                        width: "100%",
                        marginTop: "12px",
                      }}
                      value={signUpFormData.email}
                      onChange={handleChangeSignupFormData}
                    />{" "}
                    {invalidEmailError && (
                      <div>
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "13px",
                            lineHeight: "20px",
                            color: "rgb(200,36,0)",
                            paddingLeft: "12px",
                          }}
                        >
                          Please enter a valid email.
                        </span>
                      </div>
                    )}
                    {existEmailError && (
                      <div>
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "13px",
                            lineHeight: "20px",
                            color: "rgb(200,36,0)",
                            paddingLeft: "12px",
                          }}
                        >
                          Email already exists. Please use a different email.{" "}
                        </span>
                      </div>
                    )}
                    <FormControl
                      sx={{ marginTop: "12px", width: "100%" }}
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
                        Password{" "}
                      </InputLabel>
                      <OutlinedInput
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: passwordError
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
                        name="password"
                        value={signUpFormData.password}
                        onChange={handleChangeSignupFormData}
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
                        placeholder={isFocused && `Enter your password`}
                        label="Password"
                      />
                    </FormControl>
                    {passwordError && (
                      <div>
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
                    <div
                      className="unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      Password must be at least 8 characters and include a
                      lowercase letter, uppercase letter, and digit.
                    </div>
                    <div
                      onClick={() => setClicked(!clicked)}
                      onMouseEnter={() => setSignupDisclaimerHovered(true)}
                      onMouseLeave={() => setSignupDisclaimerHovered(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        onMouseEnter={() => setSignupDisclaimerHovered(true)}
                        style={{
                          width: "18px",
                          height: "18px",
                          border: signupDisclaimerHovered
                            ? "1px solid rgb(16, 35, 215)"
                            : "1px solid rgb(112,112,112)",
                          backgroundColor:
                            clicked && signupDisclaimerHovered
                              ? "rgb(16, 35, 215)"
                              : clicked
                              ? "black"
                              : "transparent",
                        }}
                      >
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="white"
                        >
                          <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                        </svg>
                      </div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d unica-regular-font"
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                          color: signupDisclaimerHovered
                            ? "rgb(16,35,215)"
                            : "rgb(112,112,112)",

                          marginTop: "12px",
                          textDecoration: signupDisclaimerHovered
                            ? "underline"
                            : "",
                          textDecorationColor: signupDisclaimerHovered
                            ? "rgb(16, 35, 215)"
                            : "",
                        }}
                      >
                        Dive deeper into the art market with Art Bazaar emails.
                        Subscribe to hear about our products, services,
                        editorials, and other promotional content. Unsubscribe
                        at any time.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          signUpFormData.name &&
                          signUpFormData.email &&
                          signUpFormData.password &&
                          !invalidEmailError &&
                          !passwordError &&
                          !existEmailError
                        ) {
                          handleSignUp();
                        }
                      }}
                      className={
                        !signUpFormData.name ||
                        !signUpFormData.email ||
                        !signUpFormData.password ||
                        invalidEmailError ||
                        passwordError ||
                        existEmailError
                          ? "none unica-regular-font"
                          : "pointer hover_bg_color_effect_white_text unica-regular-font"
                      }
                      style={{
                        height: "50px",
                        border: "none",
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "12px",
                        fontSize: "16px",
                        pointerEvents:
                          !signUpFormData.name ||
                          !signUpFormData.email ||
                          !signUpFormData.password ||
                          invalidEmailError ||
                          passwordError ||
                          existEmailError
                            ? "none"
                            : "",
                        opacity:
                          signUpFormData.name &&
                          signUpFormData.email &&
                          signUpFormData.password &&
                          !invalidEmailError &&
                          !passwordError &&
                          !existEmailError
                            ? "1"
                            : "0.3",
                      }}
                    >
                      {loading ? (
                        <LoadingSpinner></LoadingSpinner>
                      ) : (
                        <span>Sign up</span>
                      )}
                    </button>
                    <Divider
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      <span
                        className="unica-regular-font"
                        style={{
                          color: "rgb(112,112,112)",
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        or
                      </span>
                    </Divider>
                    <button
                      onClick={googleAuth}
                      className={"hover_bg_color_effect_white_text pointer"}
                      style={{
                        height: "50px",
                        border: "1px solid rgb(0,0,0)",
                        backgroundColor: "transparent",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "12px",
                        fontSize: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                        }}
                      >
                        <svg
                          width={18}
                          height={18}
                          x="0px"
                          y="0px"
                          viewBox="0 0 18 18"
                          xmlSpace="preserve"
                          fill="currentColor"
                        >
                          <g transform="translate(1184.583 765.171)">
                            <path
                              d="M-1175.4-757.8v3.5h4.8c-0.2,1.1-0.9,2.1-1.8,2.7l2.9,2.3c1.7-1.6,2.7-3.9,2.7-6.6c0-0.6-0.1-1.3-0.2-1.8 L-1175.4-757.8z"
                              fill=" rgb(66, 133, 244)"
                            ></path>
                            <path
                              d="M-1180.4-754.5l-0.7,0.5l-2.3,1.8l0,0c1.5,2.9,4.5,5,8,5c2.4,0,4.5-0.8,6-2.2l-2.9-2.3c-0.8,0.5-1.8,0.9-3,0.9 C-1177.7-750.7-1179.7-752.3-1180.4-754.5L-1180.4-754.5z"
                              fill=" rgb(52, 168, 83)"
                            ></path>
                            <path
                              d="M-1183.4-760.2c-0.6,1.2-1,2.6-1,4c0,1.5,0.4,2.8,1,4c0,0,3-2.3,3-2.3c-0.2-0.5-0.3-1.1-0.3-1.7 s0.1-1.2,0.3-1.7L-1183.4-760.2z"
                              fill=" rgb(251, 188, 5)"
                            ></path>
                            <path
                              d="M-1175.4-761.6c1.3,0,2.5,0.5,3.4,1.3l2.6-2.6c-1.6-1.5-3.6-2.3-6-2.3c-3.5,0-6.6,2-8,5l3,2.3 C-1179.7-760-1177.7-761.6-1175.4-761.6L-1175.4-761.6z"
                              fill=" rgb(234, 67, 53)"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span className="unica-regular-font">
                        Continue with Google
                      </span>
                    </button>
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                        textAlign: "center",
                        marginTop: "12px",
                      }}
                    >
                      <span className="unica-regular-font">
                        Already have an account?
                      </span>
                      <span
                        onClick={() => {
                          setSignUpOn(false);
                          setLoginOn(true);
                        }}
                        className="pointer unica-regular-font"
                        style={{
                          textDecoration: "underline",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        Log in.
                      </span>
                    </div>
                    <div
                      className="unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        textAlign: "center",
                        marginTop: "12px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      <span>
                        {
                          "By clicking Sign Up or Continue with Email, Apple,Google, or Facebook, you agree to Art Bazaar's"
                        }
                      </span>{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Terms and Conditions
                      </span>{" "}
                      <span>and</span>{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Privacy Policy
                      </span>
                      .
                    </div>
                    <div
                      className="unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        textAlign: "center",
                        marginTop: "12px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      <span>This site is protected by reCAPTCHA and the</span>{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Google Privacy Policy
                      </span>{" "}
                      <span>and</span>{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Terms of Service
                      </span>{" "}
                      apply.
                    </div>
                  </div>
                </div>
              ) : (loginOn || showAuthModal) &&
                !signUpOn &&
                !forgotPasswordOn ? (
                <div
                  style={{
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: "0",
                      overflow: "hidden",
                      zIndex: 2,
                    }}
                    className={
                      isScrolling
                        ? `header_modal scroll_active`
                        : `header_modal`
                    }
                  >
                    <button
                      onClick={() => {
                        setLoginFormData({
                          email: "",
                          password: "",
                        });
                        setSignUpFormData({
                          name: "",
                          email: "",
                          password: "",
                        });
                        closeAuthModal();
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        width: "58px",
                        height: "58px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <svg width={18} height={18} viewBox="0 0 18 18">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                        ></path>
                      </svg>
                    </button>

                    <div
                      style={{
                        margin: "20px",
                        maxWidth: "312px",
                      }}
                    >
                      <div>
                        {" "}
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
                            y="90"
                            fontSize="12"
                            textAnchor="middle"
                            fill="#333"
                          >
                            Art Bazaar
                          </text>{" "}
                        </svg>
                      </div>
                      <div
                        className="unica-regular-font"
                        style={{
                          fontSize: "26px",
                          lineHeight: "34px",
                        }}
                      >
                        Log in to discover, buy, and sell fine art
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0px 20px 20px",
                    }}
                    className="body_modal"
                  >
                    <TextField
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: "1px solid rgb(16, 35, 215) !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isFocused
                            ? "#C2C2C2 !important"
                            : valuesBeenEnteredIntoTheEmailField &&
                              loginFormData?.email.length < 1
                            ? "rgb(200,36,0) !important"
                            : "#C2C2C2 !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: isFocused && "rgb(16, 35, 215) !important",
                          transition:
                            "color 0.25s ease 0s, transform 0.25s ease 0s",
                        },
                      }}
                      type="text"
                      name="email"
                      id="outlined-basic"
                      variant={"outlined"}
                      placeholder={isFocused && `Enter your email address`}
                      label={`Email`}
                      style={{
                        width: "100%",
                        marginTop: "12px",
                      }}
                      value={loginFormData.email}
                      onChange={handleChangeLoginFormData}
                    />{" "}
                    {valuesBeenEnteredIntoTheEmailField &&
                      loginFormData?.email.length < 1 && (
                        <div>
                          <span
                            className="unica-regular-font"
                            style={{
                              fontSize: "13px",
                              lineHeight: "20px",
                              color: "rgb(200,36,0)",
                              paddingLeft: "12px",
                            }}
                          >
                            Email is required.
                          </span>
                        </div>
                      )}
                    {invalidEmailError && (
                      <div>
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "13px",
                            lineHeight: "20px",
                            color: "rgb(200,36,0)",
                            paddingLeft: "12px",
                          }}
                        >
                          Please enter a valid email.
                        </span>
                      </div>
                    )}
                    <FormControl
                      sx={{ marginTop: "12px", width: "100%" }}
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
                        Password{" "}
                      </InputLabel>
                      <OutlinedInput
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              passwordError ||
                              (valuesBeenEnteredIntoThePasswordField &&
                                loginFormData?.password.length < 1)
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
                        name="password"
                        value={loginFormData.password}
                        onChange={handleChangeLoginFormData}
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
                        placeholder={isFocused && `Enter your password`}
                        label="Password"
                      />
                    </FormControl>
                    {passwordError && (
                      <div>
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
                      loginFormData?.password.length < 1 && (
                        <div>
                          <span
                            className="unica-regular-font"
                            style={{
                              fontSize: "13px",
                              lineHeight: "20px",
                              color: "rgb(200,36,0)",
                              paddingLeft: "12px",
                            }}
                          >
                            Password required.
                          </span>
                        </div>
                      )}
                    <div
                      style={{
                        textAlign: "right",
                        textDecoration: "underline",
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      <span
                        className="unica-regular-font"
                        onClick={openForgotPasswordModal}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Forgot Password?
                      </span>
                    </div>
                    {invalidLoginDataError && (
                      <div
                        style={{
                          backgroundColor: "rgb(244,228,227)",
                          display: "flex",
                          marginTop: "12px",
                          padding: "20px",
                        }}
                      >
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "16px",
                            lineHeight: "20px",
                            fontWeight: "400",
                          }}
                        >
                          The email or password you entered is invalid. Please
                          try again.
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (loginFormData.email && loginFormData.password) {
                          handleLogin();
                        }
                      }}
                      className={
                        !loginFormData.email || !loginFormData.password
                          ? "none unica-regular-font"
                          : "pointer hover_bg_color_effect_white_text unica-regular-font"
                      }
                      style={{
                        height: "50px",
                        border: "none",
                        backgroundColor: loading ? "rgb(16, 35, 215)" : "black",
                        color: "white",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "24px",
                        fontSize: "16px",
                        pointerEvents:
                          !loginFormData.email ||
                          !loginFormData.password ||
                          loading
                            ? "none"
                            : "",
                        opacity:
                          loginFormData.email && loginFormData.password
                            ? "1"
                            : "0.3",
                      }}
                    >
                      {loading ? (
                        <LoadingSpinner></LoadingSpinner>
                      ) : (
                        <span>Log in</span>
                      )}
                    </button>
                    <Divider
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      <span
                        className="unica-regular-font"
                        style={{
                          color: "rgb(112,112,112)",
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        or
                      </span>
                    </Divider>
                    <button
                      onClick={googleAuth}
                      className={"hover_bg_color_effect_white_text pointer"}
                      style={{
                        height: "50px",
                        border: "1px solid rgb(0,0,0)",
                        backgroundColor: "transparent",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "12px",
                        fontSize: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                        }}
                      >
                        <svg
                          width={18}
                          height={18}
                          x="0px"
                          y="0px"
                          viewBox="0 0 18 18"
                          xmlSpace="preserve"
                          fill="currentColor"
                        >
                          <g transform="translate(1184.583 765.171)">
                            <path
                              d="M-1175.4-757.8v3.5h4.8c-0.2,1.1-0.9,2.1-1.8,2.7l2.9,2.3c1.7-1.6,2.7-3.9,2.7-6.6c0-0.6-0.1-1.3-0.2-1.8 L-1175.4-757.8z"
                              fill=" rgb(66, 133, 244)"
                            ></path>
                            <path
                              d="M-1180.4-754.5l-0.7,0.5l-2.3,1.8l0,0c1.5,2.9,4.5,5,8,5c2.4,0,4.5-0.8,6-2.2l-2.9-2.3c-0.8,0.5-1.8,0.9-3,0.9 C-1177.7-750.7-1179.7-752.3-1180.4-754.5L-1180.4-754.5z"
                              fill=" rgb(52, 168, 83)"
                            ></path>
                            <path
                              d="M-1183.4-760.2c-0.6,1.2-1,2.6-1,4c0,1.5,0.4,2.8,1,4c0,0,3-2.3,3-2.3c-0.2-0.5-0.3-1.1-0.3-1.7 s0.1-1.2,0.3-1.7L-1183.4-760.2z"
                              fill=" rgb(251, 188, 5)"
                            ></path>
                            <path
                              d="M-1175.4-761.6c1.3,0,2.5,0.5,3.4,1.3l2.6-2.6c-1.6-1.5-3.6-2.3-6-2.3c-3.5,0-6.6,2-8,5l3,2.3 C-1179.7-760-1177.7-761.6-1175.4-761.6L-1175.4-761.6z"
                              fill=" rgb(234, 67, 53)"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span className="unica-regular-font">
                        Continue with Google
                      </span>
                    </button>
                    <div
                      className="unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                        textAlign: "center",
                        marginTop: "12px",
                      }}
                    >
                      <span>{"Don't have an account?"}</span>
                      <span
                        onClick={() => {
                          setSignUpOn(true);
                          setLoginOn(false);
                        }}
                        className="pointer"
                        style={{
                          textDecoration: "underline",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        Sign up.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (forgotPasswordOn || showAuthModal) &&
                !signUpOn &&
                !loginOn ? (
                <div
                  style={{
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: "0",
                      overflow: "hidden",
                      zIndex: 2,
                    }}
                    className={
                      isScrolling
                        ? `header_modal_pass_reset_modal scroll_active`
                        : `header_modal_pass_reset_modal`
                    }
                  >
                    <button
                      onClick={() => {
                        setForgotPasswordFormData({
                          email: "",
                        });
                        setForgotPasswordOn(false);
                        closeAuthModal();
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        width: "58px",
                        height: "58px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <svg width={18} height={18} viewBox="0 0 18 18">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                        ></path>
                      </svg>
                    </button>

                    <div
                      style={{
                        margin: "20px",
                        maxWidth: "312px",
                      }}
                    >
                      <div>
                        {" "}
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
                            y="90"
                            fontSize="12"
                            textAnchor="middle"
                            fill="#333"
                          >
                            Art Bazaar
                          </text>{" "}
                        </svg>
                      </div>
                      <div
                        className="unica-regular-font"
                        style={{
                          fontSize: "26px",
                          lineHeight: "34px",
                        }}
                      >
                        Reset your password{" "}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0px 20px 20px",
                    }}
                    className="body_modal"
                  >
                    <TextField
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: "1px solid rgb(16, 35, 215) !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isFocused
                            ? "#C2C2C2 !important"
                            : valuesBeenEnteredIntoTheForgotPassEmailField &&
                              forgotPasswordFormData?.email.length < 1
                            ? "rgb(200,36,0) !important"
                            : "#C2C2C2 !important",
                          transition: "border-color 0.25s ease 0s",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: isFocused && "rgb(16, 35, 215) !important",
                          transition:
                            "color 0.25s ease 0s, transform 0.25s ease 0s",
                        },
                      }}
                      type="text"
                      name="email"
                      id="outlined-basic"
                      variant={"outlined"}
                      placeholder={isFocused && `Enter your email address`}
                      label={`Email`}
                      style={{
                        width: "100%",
                        marginTop: "12px",
                      }}
                      value={forgotPasswordFormData.email}
                      onChange={handleChangeForgotPasswordFormData}
                    />{" "}
                    {valuesBeenEnteredIntoTheForgotPassEmailField &&
                      forgotPasswordFormData?.email.length < 1 && (
                        <div>
                          <span
                            className="unica-regular-font"
                            style={{
                              fontSize: "13px",
                              lineHeight: "20px",
                              color: "rgb(200,36,0)",
                              paddingLeft: "12px",
                            }}
                          >
                            Email is required.
                          </span>
                        </div>
                      )}
                    {invalidEmailError && (
                      <div>
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "13px",
                            lineHeight: "20px",
                            color: "rgb(200,36,0)",
                            paddingLeft: "12px",
                          }}
                        >
                          Please enter a valid email.
                        </span>
                      </div>
                    )}
                    {resetLinkInfoPopup && (
                      <div
                        style={{
                          backgroundColor: "rgb(231,239,226)",
                          display: "flex",
                          marginTop: "12px",
                          padding: "20px",
                        }}
                      >
                        <span
                          className="unica-regular-font"
                          style={{
                            fontSize: "16px",
                            lineHeight: "20px",
                            fontWeight: "400",
                          }}
                        >
                          {
                            "We've sent a link to reset your password if an account is associated with this email."
                          }
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (
                          !invalidEmailError &&
                          forgotPasswordFormData?.email.length
                        ) {
                          handlePasswordResetLinkToEmail();
                        }
                      }}
                      className={
                        invalidEmailError ||
                        (valuesBeenEnteredIntoTheForgotPassEmailField &&
                          forgotPasswordFormData?.email.length < 1)
                          ? "none unica-regular-font "
                          : "pointer hover_bg_color_effect_white_text unica-regular-font "
                      }
                      style={{
                        height: "50px",
                        border: "none",
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "12px",
                        fontSize: "16px",
                        pointerEvents:
                          invalidEmailError ||
                          loading ||
                          !forgotPasswordFormData.email.length
                            ? "none"
                            : "",
                        opacity:
                          invalidEmailError ||
                          loading ||
                          !forgotPasswordFormData.email.length
                            ? "0.3"
                            : "1",
                      }}
                    >
                      {loading ? (
                        <LoadingSpinner></LoadingSpinner>
                      ) : (
                        <span>Send me reset instructions</span>
                      )}
                    </button>
                    <div
                      className="unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                        fontFamily:
                          "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif",
                        marginTop: "12px",
                        textAlign: "center",
                      }}
                    >
                      <span>Don’t need to reset?</span>{" "}
                      <span
                        className="pointer"
                        onClick={() => {
                          setLoginOn(true);
                          setForgotPasswordOn(false);
                          setSignUpOn(false);
                        }}
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Log in
                      </span>{" "}
                      <span>or</span>{" "}
                      <span
                        className="pointer"
                        onClick={() => {
                          setLoginOn(false);
                          setForgotPasswordOn(false);
                          setSignUpOn(true);
                        }}
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        sign up
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>
        </>
      </>
      <div
        style={{
          paddingLeft: width <= 768 ? "0px" : "40px",
          paddingRight: width <= 768 ? "0px" : "40px",
          zIndex: 99999,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            padding: "0px 0px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "6px 0px",
              gap: "10px",
            }}
          >
            <svg
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
              width="70"
              height="70"
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
              <text x="50" y="90" fontSize="12" textAnchor="middle" fill="#333">
                Art Bazaar
              </text>{" "}
            </svg>

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <SearchArtistInput
                sendQueryToParent={getQueryFromInput}
                closeSearchedResults={closeSearchedResults}
                onArtistsUpdate={handleArtistsUpdate}
                searchArtistInputPlaceHolder={"Search by artist, etc."}
              />

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  maxHeight: "308px",
                  overflowY: "auto",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                  zIndex: 1,
                  marginTop: "10px",
                  display: closeSearchedResults && "none",
                }}
              >
                {artistLoading ? (
                  <div
                    style={{
                      minHeight: "150px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LoadingSpinner colorCustom={"black"} />
                  </div>
                ) : (
                  <div>
                    {artists?.length > 0 && (
                      <>
                        {artists.map((eachArtist, index) => {
                          return (
                            <>
                              <div
                                className="unica-regular-font"
                                onClick={() => {
                                  setArtistLoading(true);
                                  setTimeout(() => {
                                    setArtistLoading(false);
                                    setCloseSearchedResults(true);
                                  }, 900);
                                  setTimeout(() => {
                                    handleArtistClick(eachArtist.name);
                                  }, 1000);
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                key={eachArtist._id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "10px",
                                  cursor: "pointer",
                                  backgroundColor:
                                    hoveredIndex === index && "#f7f7f7",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  <div>
                                    <img
                                      style={{
                                        objectFit: "cover",
                                      }}
                                      width={50}
                                      height={50}
                                      src={eachArtist?.profilePic}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <div>{eachArtist?.name}</div>
                                    <div
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      {eachArtist?.nationality},{" "}
                                      {eachArtist?.born}-{eachArtist?.died}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 18 18"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.94006 15.94L5.06006 15.06L11.1201 8.99999L5.06006 2.93999L5.94006 2.05999L12.8801 8.99999L5.94006 15.94Z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className="dflex jfycenter algncenter"
              style={{
                gap: "10px",
              }}
            >
              <div
                onClick={() => {
                  navigate("/");
                }}
                className="hover_color_effect pointer unica-regular-font display-none-bp-768px"
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                Buy
              </div>
              <div
                onClick={() => {
                  navigate("/sell");
                }}
                className="hover_color_effect pointer unica-regular-font display-none-bp-768px"
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                {" "}
                Sell
              </div>
              {/* <div
                className="hover_color_effect pointer unica-regular-font display-none-bp-768px"
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                Editorial
              </div> */}

              {!collectorInfo?.active ? (
                <>
                  <button
                    onClick={() => {
                      setLoginOn(true);
                      setSignUpOn(false);
                    }}
                    className="hover_bg_color_effect_white_text pointer unica-regular-font"
                    style={{
                      height: "30px",
                      borderRadius: "15px",
                      padding: "1px 25px",
                      border: "1px solid rgb(0,0,0)",
                      backgroundColor: "transparent",
                      fontSize: "13px",
                      lineHeight: "13px",
                      marginRight: width <= 768 ? "4px" : "12px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setLoginOn(false);
                      setSignUpOn(true);
                    }}
                    className="hover_bg_color_effect_black_text pointer unica-regular-font"
                    style={{
                      height: "30px",
                      borderRadius: "15px",
                      border: "1px solid rgb(0,0,0)",
                      backgroundColor: "black",
                      color: "white",
                      padding: "1px 25px",
                      fontSize: "13px",
                      lineHeight: "13px",
                      whiteSpace: "nowrap",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                    }}
                    className="hover_color_effect pointer dflex jfycenter algncenter"
                  >
                    <svg
                      width={width <= 768 ? 22 : 18}
                      height={width <= 768 ? 22 : 18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M14.5909 12.229C13.5477 10.7754 12.9712 9.03892 12.9379 7.25001V5.93801C12.9379 4.89359 12.523 3.89194 11.7845 3.15342C11.046 2.4149 10.0444 2.00001 8.99993 2.00001C7.95551 2.00001 6.95387 2.4149 6.21535 3.15342C5.47683 3.89194 5.06193 4.89359 5.06193 5.93801V7.25001C5.02871 9.03892 4.4522 10.7754 3.40893 12.229C3.35808 12.2939 3.3262 12.3716 3.31685 12.4535C3.30749 12.5354 3.32102 12.6183 3.35593 12.693C3.42993 12.843 3.58293 12.938 3.74993 12.938H6.69893C6.63286 13.1506 6.5975 13.3715 6.59393 13.594C6.59393 14.2321 6.84742 14.8441 7.29863 15.2953C7.74985 15.7465 8.36182 16 8.99993 16C9.63804 16 10.25 15.7465 10.7012 15.2953C11.1524 14.8441 11.4059 14.2321 11.4059 13.594C11.4024 13.3715 11.367 13.1506 11.3009 12.938H14.2499C14.4169 12.938 14.5699 12.843 14.6439 12.693C14.6788 12.6183 14.6924 12.5354 14.683 12.4535C14.6737 12.3716 14.6418 12.2939 14.5909 12.229ZM10.5309 13.594C10.5309 14.0001 10.3696 14.3895 10.0825 14.6766C9.7954 14.9637 9.40598 15.125 8.99993 15.125C8.59389 15.125 8.20447 14.9637 7.91735 14.6766C7.63023 14.3895 7.46893 14.0001 7.46893 13.594C7.47093 13.366 7.52493 13.142 7.62593 12.938H10.3739C10.4749 13.142 10.5289 13.366 10.5309 13.594ZM4.57193 12.063C5.44321 10.607 5.91412 8.94661 5.93693 7.25001V5.93801C5.93693 5.12565 6.25964 4.34656 6.83407 3.77214C7.40849 3.19772 8.18758 2.87501 8.99993 2.87501C9.81229 2.87501 10.5914 3.19772 11.1658 3.77214C11.7402 4.34656 12.0629 5.12565 12.0629 5.93801V7.25001C12.0854 8.94652 12.556 10.6069 13.4269 12.063H4.57193Z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={() => {
                      navigate(`/user/conversations`);
                    }}
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                    }}
                    className="hover_color_effect pointer dflex jfycenter algncenter display-none-bp-768px"
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M2.875 5.39202V13.625H15.125V5.54502L9.002 11L2.875 5.39202ZM14.58 4.87502H3.588L9.011 9.83802L14.581 4.87502H14.58ZM2.014 4.60502L2 4.59202L2.021 4.57202C2.0557 4.4306 2.13082 4.30235 2.23719 4.20291C2.34356 4.10346 2.47657 4.03714 2.62 4.01202L2.632 4.00002L2.641 4.00802C2.67709 4.00272 2.71352 4.00005 2.75 4.00002H15.25C15.4489 4.00002 15.6397 4.07903 15.7803 4.21969C15.921 4.36034 16 4.5511 16 4.75002V13.75C16 13.9489 15.921 14.1397 15.7803 14.2803C15.6397 14.421 15.4489 14.5 15.25 14.5H2.75C2.55109 14.5 2.36032 14.421 2.21967 14.2803C2.07902 14.1397 2 13.9489 2 13.75V4.75002C2 4.70002 2.005 4.65202 2.014 4.60502Z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={toggleProfilePopup}
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="dflex jfycenter algncenter display-none-bp-768px"
                  >
                    <svg
                      className="hover_color_effect pointer"
                      width={width <= 768 ? 22 : 18}
                      height={width <= 768 ? 22 : 18}
                      viewBox="0 0 18 18"
                      fill={
                        isPopupVisible ? "rgb(16, 35, 215)" : "currentColor"
                      }
                    >
                      <path d="M9 3.00002C9.66569 3.00002 10.3041 3.26446 10.7748 3.73518C11.2456 4.20589 11.51 4.84432 11.51 5.51002C11.51 6.17571 11.2456 6.81414 10.7748 7.28485C10.3041 7.75557 9.66569 8.02002 9 8.02002C8.33431 8.02002 7.69588 7.75557 7.22516 7.28485C6.75445 6.81414 6.49 6.17571 6.49 5.51002C6.49 4.84432 6.75445 4.20589 7.22516 3.73518C7.69588 3.26446 8.33431 3.00002 9 3.00002ZM9 2.00002C8.06909 2.00002 7.17631 2.36982 6.51806 3.02807C5.8598 3.68632 5.49 4.57911 5.49 5.51002C5.49 6.44093 5.8598 7.33371 6.51806 7.99196C7.17631 8.65021 8.06909 9.02002 9 9.02002C9.93091 9.02002 10.8237 8.65021 11.4819 7.99196C12.1402 7.33371 12.51 6.44093 12.51 5.51002C12.51 4.57911 12.1402 3.68632 11.4819 3.02807C10.8237 2.36982 9.93091 2.00002 9 2.00002ZM15 13V16H14V13C14 12.6022 13.842 12.2207 13.5607 11.9394C13.2794 11.6581 12.8978 11.5 12.5 11.5H5.5C5.10218 11.5 4.72064 11.6581 4.43934 11.9394C4.15804 12.2207 4 12.6022 4 13V16H3V13C3 12.337 3.26339 11.7011 3.73223 11.2323C4.20107 10.7634 4.83696 10.5 5.5 10.5H12.5C13.163 10.5 13.7989 10.7634 14.2678 11.2323C14.7366 11.7011 15 12.337 15 13Z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={toggleProfilePopup}
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                      position: "relative",
                      display: width > 768 ? "none" : "flex",
                      flexDirection: "column",
                    }}
                    className="dflex jfycenter algncenter"
                  >
                    <svg
                      className="hover_color_effect pointer"
                      width={27}
                      height={27}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 2.99998H15.026V3.99998H3V2.99998ZM3 8.51199H15.026V9.49999H3V8.51199ZM3 13.996H15.026V15H3V13.996Z"
                      ></path>
                    </svg>
                  </div>
                </>
              )}
              <div
                style={{
                  display: isPopupVisible ? "" : width <= 768 ? "none" : "",
                  opacity: isPopupVisible ? "1" : "0",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
                  transform: isPopupVisible
                    ? "translate(0px)"
                    : "translate(0px, -60px)",
                  transition:
                    "opacity 250ms ease-out 0s, transform 250ms ease-out 0s",
                  backgroundColor: "white",
                  overflowY: "auto",
                  position: width <= 768 ? "fixed" : "absolute",
                  right: width <= 768 ? "0px" : "40px",
                  top: width <= 768 ? "0px" : "60px",
                  width: width <= 768 ? "100%" : "230px",
                  height: width <= 768 ? "100%" : "auto",
                  border: width <= 768 ? "" : "1px solid rgb(231, 231, 231)",
                  maxHeight: width <= 768 ? "100dvh" : "80dvh",
                }}
              >
                {isPopupVisible && (
                  <div
                    ref={popupRef}
                    // Opsiyonel styling for popup modal
                    // style={
                    //   {
                    // position: "fixed",
                    // top: 0,
                    // left: 0,
                    // right: 0,
                    // bottom: 0,
                    // width: "100%",
                    // height: "100dvh",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                    // zIndex: 1000,
                    // overflow: "hidden",
                    // backgroundColor: "rgba(0, 0, 0, 0.5)",
                    //   }
                    // }
                  >
                    <div>
                      <div
                        className="unica-regular-font"
                        style={{ padding: "10px 0px" }}
                      >
                        <div
                          onClick={() => {
                            setPopupVisible(false);
                            navigate("/collector-profile/my-collection");
                          }}
                          className="visible-popup-item"
                        >
                          <div
                            className="dflex algncenter"
                            style={{
                              gap: "12px",
                              width: width <= 768 && "100%",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "45px",
                                maxHeight: "45px",
                                height: "100%",
                                height: "100%",
                              }}
                            >
                              <ProfileImage
                                collectorInfo={collectorInfo}
                                width={"45px"}
                                height={"45px"}
                              />
                            </div>
                            <div>
                              <div>{collectorInfo.name}</div>
                              <div
                                className="pointer"
                                style={{
                                  fontSize: "11px",
                                  lineHeight: "14px",
                                  color: "rgb(112, 112, 112)",
                                  textDecoration: "underline",
                                }}
                              >
                                View Profile
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        {width <= 768 && (
                          <div
                            style={{
                              textAlign: "right",
                              position: "absolute",
                              right: "0px",
                              top: "0px",
                            }}
                          >
                            <button
                              onClick={() => {
                                setPopupVisible(false);
                              }}
                              style={{
                                width: "58px",
                                height: "58px",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <svg
                                width={27}
                                height={27}
                                viewBox="0 0 18 18"
                                fill="rgb(112, 112, 112)"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        )}
                        <div>
                          <div
                            className="pointer-default"
                            style={{
                              padding: "10px 20px",
                              fontSize: "11px",
                              lineHeight: "14px",
                              color: "rgb(112, 112, 112)",
                            }}
                          >
                            My Collection
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/collector-profile/my-collection");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path d="M5.688 6.00002L9.047 2.24402L12.314 6.00002H15V15H3V6.00002H5.688ZM7.03 6.00002H10.988L9.036 3.75602L7.03 6.00002ZM4 7.00002V14H14V7.00002H4ZM6 9.00002V12H12V9.00002H6ZM5 8.00002H13V13H5V8.00002Z"></path>
                            </svg>
                            <span>Artworks</span>
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/collector-profile/artists");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path d="M11.654 10.226V13.44H10.779V10.226C10.779 9.501 10.191 8.914 9.46598 8.914H8.54198C7.81698 8.914 7.22898 9.501 7.22898 10.226V13.44H6.35398V10.226C6.35398 9.501 5.76698 8.914 5.04198 8.914H4.18898C3.46398 8.914 2.87598 9.501 2.87598 10.226V13.44H2.00098V10.226C2.00098 9.018 2.98098 8.039 4.18898 8.039H5.04198C5.75698 8.039 6.39198 8.382 6.79198 8.913C6.99565 8.6413 7.25987 8.42084 7.56366 8.26912C7.86744 8.11741 8.20241 8.03861 8.54198 8.039H9.46598C10.182 8.039 10.817 8.382 11.216 8.913C11.4197 8.6413 11.6839 8.42084 11.9877 8.26912C12.2914 8.11741 12.6264 8.03861 12.966 8.039H13.846C15.053 8.039 16.033 9.019 16.033 10.226V13.44H15.158V10.226C15.158 9.501 14.57 8.914 13.845 8.914H12.966C12.241 8.914 11.654 9.501 11.654 10.226ZM4.40998 7.01C3.91508 7.01 3.44046 6.8134 3.09052 6.46346C2.74057 6.11352 2.54398 5.63889 2.54398 5.144C2.54398 4.64911 2.74057 4.17448 3.09052 3.82454C3.44046 3.4746 3.91508 3.278 4.40998 3.278C4.90487 3.278 5.3795 3.4746 5.72944 3.82454C6.07938 4.17448 6.27598 4.64911 6.27598 5.144C6.27598 5.63889 6.07938 6.11352 5.72944 6.46346C5.3795 6.8134 4.90487 7.01 4.40998 7.01ZM4.40998 6.135C4.67281 6.135 4.92487 6.03059 5.11072 5.84474C5.29657 5.65889 5.40098 5.40683 5.40098 5.144C5.40098 4.88117 5.29657 4.62911 5.11072 4.44326C4.92487 4.25741 4.67281 4.153 4.40998 4.153C4.14715 4.153 3.89508 4.25741 3.70923 4.44326C3.52339 4.62911 3.41898 4.88117 3.41898 5.144C3.41898 5.40683 3.52339 5.65889 3.70923 5.84474C3.89508 6.03059 4.14715 6.135 4.40998 6.135ZM8.90998 7.01C8.41508 7.01 7.94046 6.8134 7.59052 6.46346C7.24057 6.11352 7.04398 5.63889 7.04398 5.144C7.04398 4.64911 7.24057 4.17448 7.59052 3.82454C7.94046 3.4746 8.41508 3.278 8.90998 3.278C9.40487 3.278 9.8795 3.4746 10.2294 3.82454C10.5794 4.17448 10.776 4.64911 10.776 5.144C10.776 5.63889 10.5794 6.11352 10.2294 6.46346C9.8795 6.8134 9.40487 7.01 8.90998 7.01ZM8.90998 6.135C9.17281 6.135 9.42487 6.03059 9.61072 5.84474C9.79657 5.65889 9.90098 5.40683 9.90098 5.144C9.90098 4.88117 9.79657 4.62911 9.61072 4.44326C9.42487 4.25741 9.17281 4.153 8.90998 4.153C8.64715 4.153 8.39508 4.25741 8.20923 4.44326C8.02339 4.62911 7.91898 4.88117 7.91898 5.144C7.91898 5.40683 8.02339 5.65889 8.20923 5.84474C8.39508 6.03059 8.64715 6.135 8.90998 6.135ZM13.41 7.01C12.9151 7.01 12.4405 6.8134 12.0905 6.46346C11.7406 6.11352 11.544 5.63889 11.544 5.144C11.544 4.64911 11.7406 4.17448 12.0905 3.82454C12.4405 3.4746 12.9151 3.278 13.41 3.278C13.9049 3.278 14.3795 3.4746 14.7294 3.82454C15.0794 4.17448 15.276 4.64911 15.276 5.144C15.276 5.63889 15.0794 6.11352 14.7294 6.46346C14.3795 6.8134 13.9049 7.01 13.41 7.01ZM13.41 6.135C13.6728 6.135 13.9249 6.03059 14.1107 5.84474C14.2966 5.65889 14.401 5.40683 14.401 5.144C14.401 4.88117 14.2966 4.62911 14.1107 4.44326C13.9249 4.25741 13.6728 4.153 13.41 4.153C13.1471 4.153 12.8951 4.25741 12.7092 4.44326C12.5234 4.62911 12.419 4.88117 12.419 5.144C12.419 5.40683 12.5234 5.65889 12.7092 5.84474C12.8951 6.03059 13.1471 6.135 13.41 6.135Z"></path>
                            </svg>
                            <span>Artists</span>
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/collector-profile/insights");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 10H5V15H4V10ZM7 8.00002H8V15H7V8.00002ZM10 5.00002H11V15H10V5.00002ZM13 3.00002H14V15H13V3.00002Z"
                              ></path>
                            </svg>
                            <span>Insights</span>
                          </div>
                        </div>
                        <div className="visible-popup-seperator"></div>
                        <div>
                          <div
                            className="pointer-default"
                            style={{
                              padding: "10px 20px",
                              fontSize: "11px",
                              lineHeight: "14px",
                              color: "rgb(112, 112, 112)",
                            }}
                          >
                            Favorites
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/favorites/saves");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path d="M11.9998 3.00002C11.4743 2.9996 10.954 3.10272 10.4684 3.30347C9.9828 3.50422 9.54153 3.79868 9.16978 4.17002L8.99978 4.34002L8.82978 4.17002C8.07922 3.41945 7.06124 2.99779 5.99978 2.99779C4.93833 2.99779 3.92035 3.41945 3.16978 4.17002C2.41922 4.92058 1.99756 5.93856 1.99756 7.00002C1.99756 8.06147 2.41922 9.07945 3.16978 9.83002L8.64978 15.3C8.69467 15.3478 8.74889 15.386 8.80909 15.412C8.86929 15.4381 8.93419 15.4515 8.99978 15.4515C9.06538 15.4515 9.13028 15.4381 9.19048 15.412C9.25068 15.386 9.30489 15.3478 9.34978 15.3L14.8298 9.83002C15.3898 9.27059 15.7713 8.55758 15.9259 7.78124C16.0805 7.0049 16.0013 6.20015 15.6983 5.46886C15.3953 4.73756 14.8821 4.11262 14.2237 3.67313C13.5653 3.23365 12.7914 2.99939 11.9998 3.00002ZM14.1198 9.12002L8.99978 14.24L3.87978 9.12002C3.58504 8.84537 3.34863 8.51417 3.18466 8.14617C3.02069 7.77817 2.93252 7.38092 2.92542 6.97811C2.91831 6.57529 2.99241 6.17518 3.14329 5.80163C3.29418 5.42807 3.51875 5.08874 3.80363 4.80386C4.0885 4.51899 4.42784 4.29441 4.80139 4.14353C5.17495 3.99264 5.57506 3.91854 5.97787 3.92565C6.38068 3.93276 6.77794 4.02092 7.14594 4.18489C7.51393 4.34886 7.84513 4.58527 8.11978 4.88002L8.64978 5.40002L8.99978 5.76002L9.34978 5.40002L9.87978 4.88002C10.4485 4.3501 11.2007 4.0616 11.9779 4.07532C12.7551 4.08903 13.4966 4.40388 14.0463 4.95353C14.5959 5.50318 14.9108 6.24472 14.9245 7.02193C14.9382 7.79913 14.6497 8.55132 14.1198 9.12002Z"></path>
                            </svg>
                            <span>Saves</span>
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/favorites/follows");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM9 1.88889C12.9274 1.88889 16.1111 5.07264 16.1111 9C16.1111 12.9274 12.9274 16.1111 9 16.1111C5.07264 16.1111 1.88889 12.9274 1.88889 9C1.88889 5.07264 5.07264 1.88889 9 1.88889ZM12.5556 6.01333L13.32 6.79556L7.74667 12.3778L4.66222 9.31111L5.44444 8.52889L7.74667 10.7778L12.5556 6.01333Z"
                              ></path>
                            </svg>
                            <span>Follows</span>
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/favorites/alerts");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18" fill="currentColor">
                              <path d="M14.5909 12.229C13.5477 10.7754 12.9712 9.03892 12.9379 7.25001V5.93801C12.9379 4.89359 12.523 3.89194 11.7845 3.15342C11.046 2.4149 10.0444 2.00001 8.99993 2.00001C7.95551 2.00001 6.95387 2.4149 6.21535 3.15342C5.47683 3.89194 5.06193 4.89359 5.06193 5.93801V7.25001C5.02871 9.03892 4.4522 10.7754 3.40893 12.229C3.35808 12.2939 3.3262 12.3716 3.31685 12.4535C3.30749 12.5354 3.32102 12.6183 3.35593 12.693C3.42993 12.843 3.58293 12.938 3.74993 12.938H6.69893C6.63286 13.1506 6.5975 13.3715 6.59393 13.594C6.59393 14.2321 6.84742 14.8441 7.29863 15.2953C7.74985 15.7465 8.36182 16 8.99993 16C9.63804 16 10.25 15.7465 10.7012 15.2953C11.1524 14.8441 11.4059 14.2321 11.4059 13.594C11.4024 13.3715 11.367 13.1506 11.3009 12.938H14.2499C14.4169 12.938 14.5699 12.843 14.6439 12.693C14.6788 12.6183 14.6924 12.5354 14.683 12.4535C14.6737 12.3716 14.6418 12.2939 14.5909 12.229ZM10.5309 13.594C10.5309 14.0001 10.3696 14.3895 10.0825 14.6766C9.7954 14.9637 9.40598 15.125 8.99993 15.125C8.59389 15.125 8.20447 14.9637 7.91735 14.6766C7.63023 14.3895 7.46893 14.0001 7.46893 13.594C7.47093 13.366 7.52493 13.142 7.62593 12.938H10.3739C10.4749 13.142 10.5289 13.366 10.5309 13.594ZM4.57193 12.063C5.44321 10.607 5.91412 8.94661 5.93693 7.25001V5.93801C5.93693 5.12565 6.25964 4.34656 6.83407 3.77214C7.40849 3.19772 8.18758 2.87501 8.99993 2.87501C9.81229 2.87501 10.5914 3.19772 11.1658 3.77214C11.7402 4.34656 12.0629 5.12565 12.0629 5.93801V7.25001C12.0854 8.94652 12.556 10.6069 13.4269 12.063H4.57193Z"></path>
                            </svg>
                            <span>Alerts</span>
                          </div>
                        </div>
                        {width <= 768 && (
                          <>
                            <div className="visible-popup-seperator"></div>
                            <div>
                              <div
                                className="pointer-default"
                                style={{
                                  padding: "10px 20px",
                                  fontSize: "11px",
                                  lineHeight: "14px",
                                  color: "rgb(112, 112, 112)",
                                }}
                              >
                                Marketplace
                              </div>
                              <div
                                onClick={() => {
                                  setPopupVisible(false);
                                  navigate("/");
                                }}
                                className="visible-popup-item"
                              >
                                <AddShoppingCartOutlinedIcon />
                                <span>Buy</span>
                              </div>
                              <div
                                onClick={() => {
                                  setPopupVisible(false);
                                  navigate("/sell");
                                }}
                                className="visible-popup-item"
                              >
                                <MonetizationOnOutlinedIcon />
                                <span>Sell</span>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="visible-popup-seperator"></div>
                        <div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/settings/edit-profile");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.24279 1.50002C7.88639 1.50002 7.57156 1.7322 7.46626 2.07268L7.10067 3.2548C6.81754 3.34835 6.5437 3.46223 6.28088 3.59468L5.18613 3.01712C4.87091 2.85081 4.48411 2.90926 4.2321 3.16127L3.4093 3.98412L3.16127 4.23215C2.90925 4.48416 2.85081 4.87095 3.01711 5.18617L3.59466 6.28085C3.46219 6.54368 3.34831 6.81754 3.25475 7.10069L2.07267 7.46625C1.73218 7.57155 1.5 7.88637 1.5 8.24277L1.50003 9.40642V9.75725C1.50003 10.1136 1.73221 10.4284 2.0727 10.5337L3.25474 10.8993C3.3483 11.1825 3.46219 11.4563 3.59466 11.7192L3.0171 12.8139C2.8508 13.1291 2.90924 13.5159 3.16126 13.7679L3.41058 14.0173L4.23212 14.8388C4.48414 15.0908 4.87093 15.1492 5.18615 14.9829L6.28093 14.4054C6.54374 14.5378 6.81758 14.6517 7.10069 14.7452L7.46627 15.9273C7.57157 16.2678 7.8864 16.5 8.24281 16.5H9.75727C10.1137 16.5 10.4285 16.2678 10.5338 15.9273L10.8994 14.7452C11.1826 14.6517 11.4564 14.5378 11.7193 14.4053L12.814 14.9829C13.1292 15.1492 13.516 15.0907 13.7681 14.8387L14.5909 14.0159L14.8389 13.7678C15.0909 13.5158 15.1494 13.129 14.9831 12.8138L14.4055 11.7191C14.538 11.4563 14.6518 11.1824 14.7454 10.8993L15.9273 10.5337C16.2678 10.4284 16.5 10.1136 16.5 9.75724V9.40642V8.24277C16.5 7.88638 16.2678 7.57155 15.9273 7.46625L14.7454 7.10073C14.6518 6.81762 14.538 6.5438 14.4055 6.281L14.9831 5.18625C15.1494 4.87103 15.091 4.48424 14.839 4.23223L14.5936 3.98683L13.7681 3.16134C13.5161 2.90933 13.1293 2.85089 12.8141 3.01719L11.7194 3.59474C11.4565 3.46225 11.1826 3.34835 10.8994 3.25477L10.5338 2.07268C10.4285 1.7322 10.1137 1.50002 9.75726 1.50002H8.24279ZM3.73602 4.80689L4.5588 3.98412L4.80685 3.73601L6.28493 4.51581L6.47686 4.41005C6.81044 4.22626 7.16611 4.07784 7.53884 3.96977L7.74922 3.90878L8.24279 2.31283H9.75726L10.2508 3.90876L10.4612 3.96975C10.834 4.07784 11.1897 4.22629 11.5234 4.41012L11.7153 4.51588L13.1934 3.73608L13.4388 3.98153L14.2642 4.80697L13.4844 6.28504L13.5901 6.47697C13.7739 6.81053 13.9223 7.16618 14.0304 7.53889L14.0914 7.74927L15.6872 8.24277V8.59361V9.75724L14.0914 10.2507L14.0304 10.4611C13.9223 10.8338 13.7739 11.1895 13.5901 11.5231L13.4844 11.715L14.2642 13.1931L13.4414 14.0159L13.1933 14.264L11.7152 13.4842L11.5233 13.5899C11.1897 13.7737 10.834 13.9222 10.4612 14.0303L10.2508 14.0913L9.75727 15.6872H8.24281L7.74924 14.0912L7.53886 14.0302C7.16614 13.9222 6.81049 13.7738 6.47692 13.59L6.28498 13.4842L4.80687 14.2641L4.55752 14.0147L3.73601 13.1932L4.5158 11.7151L4.41005 11.5232C4.22624 11.1896 4.0778 10.8339 3.96973 10.4611L3.90873 10.2508L2.31285 9.75725L2.31282 8.59361V8.24277L3.90874 7.74923L3.96973 7.53885C4.07781 7.1661 4.22624 6.81042 4.41004 6.47684L4.5158 6.2849L3.73602 4.80689ZM11.3629 9.00002C11.3629 10.305 10.305 11.3629 9 11.3629C7.69501 11.3629 6.6371 10.305 6.6371 9.00002C6.6371 7.69503 7.69501 6.63712 9 6.63712C10.305 6.63712 11.3629 7.69503 11.3629 9.00002ZM12.2143 9.00002C12.2143 10.7752 10.7752 12.2143 9 12.2143C7.2248 12.2143 5.78571 10.7752 5.78571 9.00002C5.78571 7.22482 7.2248 5.78573 9 5.78573C10.7752 5.78573 12.2143 7.22482 12.2143 9.00002Z"
                              ></path>
                            </svg>
                            <span>Settings</span>
                          </div>
                          <div
                            onClick={() => {
                              setPopupVisible(false);
                              navigate("/settings/purchases");
                            }}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.0001 5V6C11.0001 6.27614 11.2239 6.5 11.5001 6.5C11.7762 6.5 12.0001 6.27614 12.0001 6V5H14.9479L15.9002 15L2.09976 15L3.05214 5H6.00006V6C6.00006 6.27614 6.22392 6.5 6.50006 6.5C6.7762 6.5 7.00006 6.27614 7.00006 6V5H11.0001ZM12.0001 4H15.8571L16.8957 14.9052C16.9516 15.4923 16.49 16 15.9002 16H2.09976C1.51002 16 1.04835 15.4923 1.10426 14.9052L2.14285 4L6.00006 4C6.00006 2.34315 7.34321 1 9.00006 1C10.6569 1 12.0001 2.34315 12.0001 4ZM7.00006 4C7.00006 2.89543 7.89549 2 9.00006 2C10.1046 2 11.0001 2.89543 11.0001 4L7.00006 4Z"
                              ></path>
                            </svg>
                            <span>Order History</span>
                          </div>
                          <div
                            onClick={handleLogout}
                            className="visible-popup-item"
                          >
                            <svg viewBox="0 0 18 18">
                              <path d="M7.00001 2.81297V3.87497C5.8068 4.34236 4.81415 5.21159 4.19337 6.33268C3.57259 7.45378 3.36261 8.7564 3.59967 10.0158C3.83673 11.2751 4.50595 12.4123 5.49186 13.2309C6.47777 14.0496 7.71853 14.4984 9.00001 14.5C10.2829 14.5009 11.5257 14.0533 12.5134 13.2348C13.5012 12.4162 14.1717 11.2781 14.409 10.0174C14.6463 8.75669 14.4355 7.45269 13.8129 6.33101C13.1904 5.20933 12.1954 4.34055 11 3.87497V2.81297C12.4733 3.28942 13.7282 4.27618 14.5386 5.5956C15.3491 6.91503 15.6619 8.48043 15.4207 10.01C15.1795 11.5395 14.4002 12.9328 13.2231 13.9388C12.046 14.9448 10.5485 15.4976 9.00001 15.4976C7.45157 15.4976 5.95398 14.9448 4.77688 13.9388C3.59978 12.9328 2.8205 11.5395 2.57933 10.01C2.33817 8.48043 2.65096 6.91503 3.4614 5.5956C4.27184 4.27618 5.52669 3.28942 7.00001 2.81297ZM8.50001 0.999969H9.50001V9.19997H8.50001V0.999969Z"></path>
                            </svg>
                            <span>Log out</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="display-none-bp-768px"
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                paddingLeft: "60px",
              }}
            >
              <div
                onMouseEnter={() => setHoveredArtists(true)}
                onMouseLeave={() => setHoveredArtists(false)}
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Artists
              </div>
              {/* <div
                onMouseEnter={() => setHoveredArtworks(true)}
                onMouseLeave={() => setHoveredArtworks(false)}
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Artworks
              </div> */}
              {/* <div
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Auctions
              </div> */}
              {/* <div
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Museums
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
        }}
      >
        <div
          onMouseEnter={() => {
            if (hoveredArtists) {
              setHoveredArtists(true);
            } else if (hoveredArtworks) {
              setHoveredArtworks(true);
            }
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "white",
            width: "100%",
            borderTop:
              hoveredArtists || hoveredArtworks
                ? "1px solid rgb(194, 194, 194)"
                : "none",
            boxShadow:
              hoveredArtists || hoveredArtworks
                ? "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)"
                : "",
          }}
        >
          {hoveredArtists ? (
            <div
              onMouseEnter={() => setHoveredArtists(true)}
              onMouseLeave={() => setHoveredArtists(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "60px 0px",
                }}
              >
                {artistsOnHoverModal?.slice(0, 20).map((eachArtist, index) => (
                  <div
                    onClick={() => {
                      setHoveredArtists(false);
                      handleArtistClick(eachArtist.name);
                    }}
                    className="unica-regular-font each-artist"
                    key={eachArtist.id}
                    style={{
                      flex: "0 0 calc(20% - 10px)",
                      margin: "0 5px 10px 0",
                      minWidth: "150px",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: "26px",
                    }}
                  >
                    {eachArtist.name}
                  </div>
                ))}
              </div>
              <div
                className="unica-regular-font"
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0 5px 10px 0",
                  padding: "10px",
                  justifyContent: "center",
                  gap: "32px",
                }}
              >
                <div
                  className="each-artist"
                  style={{
                    fontSize: "16px",
                    lineHeight: "26px",
                    cursor: "pointer",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  View All Artists
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Browse by name
                  </div>
                  <div>
                    {letters.map((letter, index) => (
                      <span
                        style={{
                          margin: "0px 12px 0px 0px",
                          fontSize: "16px",
                          lineHeight: "26px",
                          cursor: "pointer",
                        }}
                        key={index}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : hoveredArtworks ? (
            <div
              onMouseEnter={() => setHoveredArtworks(true)}
              onMouseLeave={() => setHoveredArtworks(false)}
            >
              artworks
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Navbar;
