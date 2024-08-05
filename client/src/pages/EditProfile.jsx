import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { useContext, useEffect, useRef, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import Button from "../components/Button";
import axios from "axios";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function EditProfile() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);

  const { contextHolder, showCustomMessageDarkBg, showCustomMessage } =
    useAntdMessageHandler();
  const location = useLocation();
  const navItems = [
    { label: "Edit Profile", path: "/settings/edit-profile" },
    { label: "Account Settings", path: "/settings/edit-settings" },
    { label: "Order History", path: "/settings/purchases" },
  ];
  const [borderTextArea, setBorderTextArea] = useState(null);
  const [onFocusAbout, setOnFocusAbout] = useState(null);
  const [textAreaOnClick, setTextAreaOnClick] = useState(false);
  const textAreaRef = useRef(null);
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
  // input ref for onfocus listening
  const collectorNameInputRef = useRef(null);
  const primaryLocationInputRef = useRef(null);
  const professionInputRef = useRef(null);
  const otherRelevantPositionsInputRef = useRef(null);
  const [focusedInput, setFocusedInput] = useState("");
  useEffect(() => {
    const handleFocusCollectorInputRef = () =>
      setFocusedInput("collectorNameInputRef");
    const handleBlurCollectorInputRef = () => setFocusedInput("");

    const handleFocusPrimaryLocationInputRef = () =>
      setFocusedInput("primaryLocationInputRef");
    const handleBlurPrimaryLocationInputRef = () => setFocusedInput("");

    const handleFocusProfessionInputRef = () =>
      setFocusedInput("professionInputRef");
    const handleBlurProfessionInputRef = () => setFocusedInput("");

    const handleFocusOtherRelevantPositionsInputRef = () =>
      setFocusedInput("otherRelevantPositionsInputRef");
    const handleBlurOtherRelevantPositionsInputRef = () => setFocusedInput("");

    const inputRefs = [
      {
        ref: collectorNameInputRef,
        focus: handleFocusCollectorInputRef,
        blur: handleBlurCollectorInputRef,
      },
      {
        ref: primaryLocationInputRef,
        focus: handleFocusPrimaryLocationInputRef,
        blur: handleBlurPrimaryLocationInputRef,
      },
      {
        ref: professionInputRef,
        focus: handleFocusProfessionInputRef,
        blur: handleBlurProfessionInputRef,
      },
      {
        ref: otherRelevantPositionsInputRef,
        focus: handleFocusOtherRelevantPositionsInputRef,
        blur: handleBlurOtherRelevantPositionsInputRef,
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

  const [formData, setFormData] = useState({
    profileImage: "",
    collectorName: "",
    primaryLocation: "",
    profession: "",
    otherRelevantPosition: "",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log("form data for edit collector:", formData);

  // save changes
  const [changesOn, setChangesOn] = useState(false);

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

  useEffect(() => {
    if (collectorInfo?.active) {
      refreshCollector();
    }
  }, []);

  useEffect(() => {
    if (collectorInfo?.active) {
      setFormData({
        ...formData,
        collectorName: collectorInfo.name,
        primaryLocation: collectorInfo.location,
        profession: collectorInfo.profession,
        otherRelevantPosition: collectorInfo.otherRelevantPosition,
        about: collectorInfo.about,
      });
    }
  }, [collectorInfo]);

  console.log("form data for edit:", formData);

  // change profile image
  const [changeProfileImageProcess, setChangeProfileImageProcess] =
    useState(false);
  const [profileImage, setprofileImage] = useState("");

  const handleChangeProfileImageSetFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setprofileImage(reader.result);
    };
    console.log("reader result:", reader.result);
  };

  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    console.log("target value for file :", e.target.files[0]);
    handleChangeProfileImageSetFileToBase(file);
  };

  const changeProfileImage = async () => {
    setChangeProfileImageProcess(true);

    try {
      const result = await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/change_profile_image`,
        {
          image: profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (result.data.imageInfo.url) {
        setFormData({
          ...formData,
          profileImage: result.data.imageInfo.url,
        });
        setChangeProfileImageProcess(false);
        updateCollector({ profileImage: result.data.imageInfo.url });
        showCustomMessageDarkBg("Profile image uploaded successfully", 6);
        setTimeout(() => {
          setprofileImage("");
        }, 250);
      }
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (profileImage) {
      changeProfileImage();
    }
  }, [profileImage]);

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

      <div className="profile-settings-wrapper unica-regular-font">
        <div
          style={{
            padding: width <= 768 ? "20px" : "20px 0px",
            backgroundColor: "rgb(247,247,247)",
            maxWidth: width <= 768 ? "100%" : "60%",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            borderRadius: "3px",
          }}
        >
          <svg
            style={{
              position: "relative",
              left: width <= 768 ? "" : "24px",
              flexShrink: 0,
            }}
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM8.99978 1.88892C12.9271 1.88892 16.1109 5.07267 16.1109 9.00003C16.1109 12.9274 12.9271 16.1111 8.99978 16.1111C5.07242 16.1111 1.88867 12.9274 1.88867 9.00003C1.88867 5.07267 5.07242 1.88892 8.99978 1.88892ZM8.51123 5.1333H9.48901V6.19997H8.51123V5.1333ZM9.48901 7.37329V12.8666H8.51123V7.37329H9.48901Z"
            ></path>
          </svg>
          <span
            style={{ position: "relative", left: width <= 768 ? "" : "24px" }}
          >
            The information you provide here will be shared when you contact a
            gallery or make an offer.
          </span>
        </div>
        <div className="box-20-px-m-top"></div>
        <div
          onClick={() => {
            if (!changeProfileImageProcess) {
              document.getElementById("formuploadModal-profile-image").click();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            pointerEvents: changeProfileImageProcess ? "default" : "auto",
            cursor: changeProfileImageProcess ? "default" : "pointer",
            maxWidth: "60%",
          }}
        >
          <ProfileImage
            isLoading={changeProfileImageProcess}
            fontSize={"26px"}
            collectorInfo={collectorInfo}
            width={width <= 768 ? "70px" : "100px"}
            height={width <= 768 ? "70px" : "100px"}
          />
          <input
            onChange={handleChangeProfileImage}
            type="file"
            id="formuploadModal-profile-image"
            name="profileImage"
            className="form-control"
            style={{ display: "none" }}
          />
          <div
            style={{
              textDecoration: !changeProfileImageProcess && "underline",
              color: "rgb(112,112,112)",
            }}
          >
            {changeProfileImageProcess ? "Uploading..." : "Choose an Image"}
          </div>
        </div>{" "}
        <div className="box-40-px-m-top"></div>
        <div className="name-input-wrapper">
          <Input
            inputRef={collectorNameInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "collectorNameInputRef"
                ? "Name"
                : formData?.collectorName
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
            name={"collectorName"}
            value={formData?.collectorName}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.collectorName
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Name"}
            labelText={"Name"}
          />
          <div className="required-info unica-regular-font">*Required</div>
        </div>
        <div className="box-40-px-m-top"></div>
        <div className="primary-location-input-wrapper">
          <Input
            inputRef={primaryLocationInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "primaryLocationInputRef"
                ? "City Name"
                : formData?.primaryLocation
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
            name={"primaryLocation"}
            value={formData?.primaryLocation}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.primaryLocation
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Primary Location"}
            labelText={"Primary Location"}
          />
        </div>
        <div className="box-40-px-m-top"></div>
        <div className="profession-input-wrapper">
          <Input
            inputRef={professionInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "professionInputRef"
                ? "Profession or job title"
                : formData?.profession
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
            name={"profession"}
            value={formData?.profession}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.profession
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Profession"}
            labelText={"Profession"}
          />
        </div>
        <div className="box-40-px-m-top"></div>
        <div className="profession-input-wrapper">
          <Input
            inputRef={otherRelevantPositionsInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "otherRelevantPositionsInputRef"
                ? "Other relevant positions"
                : formData?.otherRelevantPosition
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
            name={"otherRelevantPosition"}
            value={formData?.otherRelevantPosition}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.otherRelevantPosition
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Other relevant positions"}
            labelText={"Other relevant positions"}
          />
        </div>
        <div className="box-40-px-m-top"></div>
        {/* about section */}
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
              (textAreaOnClick || formData.about) && onFocusAbout
                ? "text-area-label-on-focus text-area-label-style unica-regular-font"
                : formData.about && !onFocusAbout
                ? "text-area-label-on-focus text-area-label-style unica-regular-font color-change"
                : "text-area-label-style unica-regular-font"
            }
          >
            About
          </label>{" "}
          <textarea
            ref={textAreaRef}
            className="unica-regular-font"
            name="about"
            value={formData.about}
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
          />
        </div>
        <div className="box-40-px-m-top"></div>
        <div
          style={{
            maxWidth: width <= 768 ? "100%" : "60%",
            color: "rgb(112,112,112)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 18 18" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM9 1.88889C12.9274 1.88889 16.1111 5.07264 16.1111 9C16.1111 12.9274 12.9274 16.1111 9 16.1111C5.07264 16.1111 1.88889 12.9274 1.88889 9C1.88889 5.07264 5.07264 1.88889 9 1.88889ZM12.5556 6.01333L13.32 6.79556L7.74667 12.3778L4.66222 9.31111L5.44444 8.52889L7.74667 10.7778L12.5556 6.01333Z"
              ></path>
            </svg>
            <span>Verify Your Email</span>
          </div>
          <div className="box-20-px-m-top"></div>
          <div>
            Secure your account and receive updates about your transactions on
            Art Bazaar.
          </div>
          <div className="box-40-px-m-top"></div>
          <Button
            onClick={saveChanges}
            className={
              "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
            }
            backgroundColor={"black"}
            height="100dvh"
            width={"100%"}
            textColor={"white"}
            fontSize={"15px"}
            maxHeight={"50px"}
            maxWidth={width <= 768 ? "100%" : "150px"}
            padding="1px 25px"
            borderRadius="25px"
            cursor="pointer"
            text={"Save"}
            border="1px solid rgb(0,0,0)"
            lineHeight="26px"
            opacity={changesOn || !formData.collectorName ? 0.3 : 1}
            pointerEvents={
              changesOn || !formData.collectorName ? "none" : "auto"
            }
            loadingScenario={changesOn}
            strokeColorLoadingSpinner={!changesOn}
          />{" "}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EditProfile;
