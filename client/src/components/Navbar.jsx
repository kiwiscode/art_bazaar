import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
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
import data from "../data/data.json";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function Navbar({ showAuthModal, setShowAuthModal }) {
  const navigate = useNavigate();
  const { userInfo, logout, googleLogout, getToken, updateUser } =
    useContext(UserContext);
  useEffect(() => {
    if (!userInfo) {
      JSON.parse(localStorage.getItem("userInfo"));
    }
  }, [userInfo]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
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

  const handleLogout = () => {
    axios
      .post(
        `${API_URL}/auth/logout`,
        { userId: userInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");

        logout();
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
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
        } else {
          setUniqueEmailError(null);
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
    try {
      setLoading(true);
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

      const { user, token } = result.data;

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);
      updateUser(user);
      setLoading(false);
      navigate("/");
      closeAuthModal();
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
        setLoading(false);
        setResetLinkInfoPopup(true);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };

  return (
    <>
      {/* sign up modal  */}
      <>
        <>
          <Modal
            className="z-9999 p-0 m-0"
            open={signUpOn || loginOn || forgotPasswordOn || showAuthModal}
            onClose={closeAuthModal}
            sx={{
              "& > .MuiBackdrop-root": {
                opacity: "0.5 !important",
                backgroundColor: "rgb(202, 205, 236)",
                filter: "brightness(2.5)",
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
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
                      <div>Logo</div>
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
                                  fill-rule="evenodd"
                                  d="M16.8 8.2c-2-3.3-4.6-4.9-7.8-4.9S3.2 5 1.2 8.2c-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7s5.6-1.6 7.7-4.7c.4-.6.4-1.3.1-1.8zm-1 .5c.1.2.1.4 0 .6-1.9 2.8-4.1 4.2-6.7 4.2-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C4 5.8 6.2 4.4 9 4.4s5 1.4 6.8 4.3zM9 11.9c1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9zm0-1.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7z"
                                  clip-rule="evenodd"
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
                    <div>continue with apple</div>
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
                          xml:space="preserve"
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
                    <div>continue with facebook</div>
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
                        By clicking Sign Up or Continue with Email, Apple,
                        Google, or Facebook, you agree to Art Bazaar's
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
                        setLoginOn(false);
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
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
                      <div>Logo</div>
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
                                  fill-rule="evenodd"
                                  d="M16.8 8.2c-2-3.3-4.6-4.9-7.8-4.9S3.2 5 1.2 8.2c-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7s5.6-1.6 7.7-4.7c.4-.6.4-1.3.1-1.8zm-1 .5c.1.2.1.4 0 .6-1.9 2.8-4.1 4.2-6.7 4.2-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C4 5.8 6.2 4.4 9 4.4s5 1.4 6.8 4.3zM9 11.9c1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9zm0-1.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7z"
                                  clip-rule="evenodd"
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
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "9999px",
                        width: "100%",
                        marginTop: "24px",
                        fontSize: "16px",
                        pointerEvents:
                          !loginFormData.email || !loginFormData.password
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
                    <div>continue with apple</div>
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
                          xml:space="preserve"
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
                    <div>continue with facebook</div>
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
                      <span>Don't have an account?</span>
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
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
                      <div>Logo</div>
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
                          We've sent a link to reset your password if an account
                          is associated with this email.
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
                          !forgotPasswordFormData.email.length
                            ? "none"
                            : "",
                        opacity:
                          !invalidEmailError &&
                          forgotPasswordFormData.email.length
                            ? "1"
                            : "0.3",
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
            }}
          >
            <div>
              <div>Art</div>
              <div>Bazaar</div>
            </div>
            <input
              style={{
                width: "700px",
                height: "40px",
                border: "1px solid rgb(194, 194, 194)",
              }}
              placeholder="Search by artist,style."
              type="text"
            />
            <div className="dflex jfycenter algncenter">
              <div
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                Buy
              </div>
              <div
                className="hover_color_effect pointer unica-regular-font "
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                {" "}
                Sell
              </div>
              <div
                className="hover_color_effect pointer unica-regular-font"
                style={{
                  fontSize: "16px",
                  lineHeight: "16px",
                  marginRight: width <= 768 ? "4px" : "12px",
                }}
              >
                Editorial
              </div>

              {!userInfo?.active ? (
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
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M14.5909 12.229C13.5477 10.7754 12.9712 9.03892 12.9379 7.25001V5.93801C12.9379 4.89359 12.523 3.89194 11.7845 3.15342C11.046 2.4149 10.0444 2.00001 8.99993 2.00001C7.95551 2.00001 6.95387 2.4149 6.21535 3.15342C5.47683 3.89194 5.06193 4.89359 5.06193 5.93801V7.25001C5.02871 9.03892 4.4522 10.7754 3.40893 12.229C3.35808 12.2939 3.3262 12.3716 3.31685 12.4535C3.30749 12.5354 3.32102 12.6183 3.35593 12.693C3.42993 12.843 3.58293 12.938 3.74993 12.938H6.69893C6.63286 13.1506 6.5975 13.3715 6.59393 13.594C6.59393 14.2321 6.84742 14.8441 7.29863 15.2953C7.74985 15.7465 8.36182 16 8.99993 16C9.63804 16 10.25 15.7465 10.7012 15.2953C11.1524 14.8441 11.4059 14.2321 11.4059 13.594C11.4024 13.3715 11.367 13.1506 11.3009 12.938H14.2499C14.4169 12.938 14.5699 12.843 14.6439 12.693C14.6788 12.6183 14.6924 12.5354 14.683 12.4535C14.6737 12.3716 14.6418 12.2939 14.5909 12.229ZM10.5309 13.594C10.5309 14.0001 10.3696 14.3895 10.0825 14.6766C9.7954 14.9637 9.40598 15.125 8.99993 15.125C8.59389 15.125 8.20447 14.9637 7.91735 14.6766C7.63023 14.3895 7.46893 14.0001 7.46893 13.594C7.47093 13.366 7.52493 13.142 7.62593 12.938H10.3739C10.4749 13.142 10.5289 13.366 10.5309 13.594ZM4.57193 12.063C5.44321 10.607 5.91412 8.94661 5.93693 7.25001V5.93801C5.93693 5.12565 6.25964 4.34656 6.83407 3.77214C7.40849 3.19772 8.18758 2.87501 8.99993 2.87501C9.81229 2.87501 10.5914 3.19772 11.1658 3.77214C11.7402 4.34656 12.0629 5.12565 12.0629 5.93801V7.25001C12.0854 8.94652 12.556 10.6069 13.4269 12.063H4.57193Z"></path>
                    </svg>
                  </div>
                  <div
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                    }}
                    className="hover_color_effect pointer dflex jfycenter algncenter"
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
                    onClick={handleLogout}
                    style={{
                      height: "30px",
                      marginRight: width <= 768 ? "4px" : "12px",
                    }}
                    className="hover_color_effect pointer dflex jfycenter algncenter"
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M9 3.00002C9.66569 3.00002 10.3041 3.26446 10.7748 3.73518C11.2456 4.20589 11.51 4.84432 11.51 5.51002C11.51 6.17571 11.2456 6.81414 10.7748 7.28485C10.3041 7.75557 9.66569 8.02002 9 8.02002C8.33431 8.02002 7.69588 7.75557 7.22516 7.28485C6.75445 6.81414 6.49 6.17571 6.49 5.51002C6.49 4.84432 6.75445 4.20589 7.22516 3.73518C7.69588 3.26446 8.33431 3.00002 9 3.00002ZM9 2.00002C8.06909 2.00002 7.17631 2.36982 6.51806 3.02807C5.8598 3.68632 5.49 4.57911 5.49 5.51002C5.49 6.44093 5.8598 7.33371 6.51806 7.99196C7.17631 8.65021 8.06909 9.02002 9 9.02002C9.93091 9.02002 10.8237 8.65021 11.4819 7.99196C12.1402 7.33371 12.51 6.44093 12.51 5.51002C12.51 4.57911 12.1402 3.68632 11.4819 3.02807C10.8237 2.36982 9.93091 2.00002 9 2.00002ZM15 13V16H14V13C14 12.6022 13.842 12.2207 13.5607 11.9394C13.2794 11.6581 12.8978 11.5 12.5 11.5H5.5C5.10218 11.5 4.72064 11.6581 4.43934 11.9394C4.15804 12.2207 4 12.6022 4 13V16H3V13C3 12.337 3.26339 11.7011 3.73223 11.2323C4.20107 10.7634 4.83696 10.5 5.5 10.5H12.5C13.163 10.5 13.7989 10.7634 14.2678 11.2323C14.7366 11.7011 15 12.337 15 13Z"></path>
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
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
              <div
                onMouseEnter={() => setHoveredArtworks(true)}
                onMouseLeave={() => setHoveredArtworks(false)}
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Artworks
              </div>
              <div
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Auctions
              </div>
              <div
                className="hover_color_effect pointer unica-regular-font  "
                style={{
                  padding: "12px 12px",
                }}
              >
                Museums
              </div>
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
                {data?.slice(0, 20).map((eachArtist, index) => (
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
