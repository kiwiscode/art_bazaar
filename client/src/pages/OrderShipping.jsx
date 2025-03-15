import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderNavBar from "../components/HeaderNavBar";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useContext, useEffect, useRef, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import Input from "../components/Input";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import Button from "../components/Button";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { DeliveryContext } from "../components/DeliveryContext";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function OrdersShipping() {
  const { artworkToOrder } = useParams();
  const [artworkToOrderDetail, setArtworkToOrderDetail] = useState([]);
  const { width } = useWindowDimensions();
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  // delivery context infos
  const {
    allDeliveryData,
    setAllDeliveryData,
    chosenArtworkToPurchase,
    setChosenArtworkToPurchase,
    chosenAddress,
    setChosenAddress,
    cleanAllDeliveryData,
  } = useContext(DeliveryContext);

  useEffect(() => {
    setAllDeliveryData((prevData) => ({
      ...prevData,
      shippingAddress: "",
    }));
    setChosenAddress(null);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  const sortedCountries = getCountries().sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  const selectCountryRef = useRef(null);
  const [selectCountryOnClick, setSelectCountryOnClick] = useState(false);
  const [selectMediumBorder, setSelectMediumBorder] = useState(
    "1px solid rgb(194, 194, 194)"
  );

  const navItems = [
    { label: "Shipping", path: `/orders/${artworkToOrder}/shipping` },
    { label: "Payment", path: `/orders/${artworkToOrder}/payment` },
    { label: "Review", path: `/orders/${artworkToOrder}/review` },
  ];

  const [
    save_shipping_address_for_later_useHovered,
    setSave_shipping_address_for_later_useHovered,
  ] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    country: "DE",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state_provinence_or_region: "",
    postalCode: "",
    phoneNumber: "",
    save_shipping_address_for_later_use: "",
    settedAsDefault: false,
  });

  // shipping form
  const shippingAddressBuyerNameInputRef = useRef(null);
  const shippingAddressAddressLineFirstInputRef = useRef(null);
  const shippingAddressAddressLineSecondInputRef = useRef(null);
  const shippingAddressCityInputRef = useRef(null);
  const shippingAddressState_provinence_or_regionRef = useRef(null);
  const shippingAddressPostalCodeRef = useRef(null);
  const shippingAddressPhoneNumberRef = useRef(null);
  const [focusedInput, setFocusedInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const handleFocusBuyerNameInputRef = () =>
      setFocusedInput("shippingAddressBuyerNameInputRef");
    const handleBlurBuyerNameInputRef = () => setFocusedInput("");

    const handleFocusAddressLineFirstInputRef = () =>
      setFocusedInput("shippingAddressAddressLineFirstInputRef");
    const handleBlurAddressLineFirstInputRef = () => setFocusedInput("");

    const handleFocusAddressLineSecondInputRef = () =>
      setFocusedInput("shippingAddressAddressLineSecondInputRef");
    const handleBlurAddressLineSecondInputRef = () => setFocusedInput("");

    const handleFocusAddressCityInputRef = () =>
      setFocusedInput("shippingAddressCityInputRef");
    const handleBlurAddressCityInputRef = () => setFocusedInput("");

    const handleFocusState_provinence_or_regionInputRef = () =>
      setFocusedInput("shippingAddressState_provinence_or_regionRef");
    const handleBlurState_provinence_or_regionInputRef = () =>
      setFocusedInput("");

    const handleFocusPostaCodeInputRef = () =>
      setFocusedInput("shippingAddressPostalCodeRef");
    const handleBlurPostaCodeInputRef = () => setFocusedInput("");

    const handleFocusPhoneNumberInputRef = () =>
      setFocusedInput("shippingAddressPhoneNumberRef");
    const handleBlurPhoneNumberInputRef = () => setFocusedInput("");

    const inputRefs = [
      {
        ref: shippingAddressBuyerNameInputRef,
        focus: handleFocusBuyerNameInputRef,
        blur: handleBlurBuyerNameInputRef,
      },
      {
        ref: shippingAddressAddressLineFirstInputRef,
        focus: handleFocusAddressLineFirstInputRef,
        blur: handleBlurAddressLineFirstInputRef,
      },
      {
        ref: shippingAddressAddressLineSecondInputRef,
        focus: handleFocusAddressLineSecondInputRef,
        blur: handleBlurAddressLineSecondInputRef,
      },
      {
        ref: shippingAddressCityInputRef,
        focus: handleFocusAddressCityInputRef,
        blur: handleBlurAddressCityInputRef,
      },
      {
        ref: shippingAddressState_provinence_or_regionRef,
        focus: handleFocusState_provinence_or_regionInputRef,
        blur: handleBlurState_provinence_or_regionInputRef,
      },
      {
        ref: shippingAddressPostalCodeRef,
        focus: handleFocusPostaCodeInputRef,
        blur: handleBlurPostaCodeInputRef,
      },
      {
        ref: shippingAddressPhoneNumberRef,
        focus: handleFocusPhoneNumberInputRef,
        blur: handleBlurPhoneNumberInputRef,
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

  // get artwork to order
  const getArtwork = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/artwork/all-artworks/with_id/${artworkToOrder}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setArtworkToOrderDetail(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (artworkToOrder) {
      getArtwork();
    }
  }, [artworkToOrder]);

  const formatCountry = (countryCode) => {
    return en[countryCode];
  };

  const prepareFormData = (data) => {
    "data:", data;
    return {
      ...data,
      country: formatCountry(data.country),
    };
  };

  // navigate user without saving delivery address to the database
  const changeTabToPayment = (formData) => {
    setDeliveryAddressSavingProcess(true);
    if (
      !formData.fullName ||
      !formData.country ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state_provinence_or_region ||
      !formData.postalCode ||
      !formData.phoneNumber
    ) {
      setTimeout(() => {
        setDeliveryAddressSavingProcess(false);
      }, 500);
      setTimeout(() => {
        window.alert("Please fill in the required fields.");
      }, 600);
      return;
    }
    const formattedData = prepareFormData(formData);
    setChosenAddress(formattedData);
    setChosenArtworkToPurchase(artworkToOrderDetail);
    setAllDeliveryData((prevData) => ({
      ...prevData,
      shippingAddress: formattedData,
      paymentInfo: "",
      artworkToPurchase: artworkToOrderDetail,
    }));

    navigate(`/orders/${artworkToOrder}/payment`);
  };

  useEffect(() => {
    if (collectorInfo?.deliveryAddresses) {
      const defaultAddress = collectorInfo.deliveryAddresses.find(
        (address) => address.settedAsDefault
      );

      if (defaultAddress) {
        setFormData(defaultAddress);
        setChosenAddress(defaultAddress);
        setAllDeliveryData((prevData) => ({
          ...prevData,
          shippingAddress: defaultAddress,
        }));
      }
    }
  }, [collectorInfo, setChosenAddress, setAllDeliveryData]);

  useEffect(() => {
    if (artworkToOrderDetail) {
      setChosenArtworkToPurchase(artworkToOrderDetail);
    }
  }, [artworkToOrderDetail]);

  // save delivery address to the database
  const [deliveryAddressSavingProcess, setDeliveryAddressSavingProcess] =
    useState(false);

  const saveDeliveryAddressAndContinue = async (formData) => {
    setDeliveryAddressSavingProcess(true);
    if (
      !formData.fullName ||
      !formData.country ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state_provinence_or_region ||
      !formData.postalCode ||
      !formData.phoneNumber
    ) {
      setTimeout(() => {
        setDeliveryAddressSavingProcess(false);
      }, 500);
      setTimeout(() => {
        window.alert("Please fill in the required fields.");
      }, 600);
      return;
    }
    try {
      const formattedData = prepareFormData(formData);
      setChosenAddress(formattedData);
      setChosenArtworkToPurchase(artworkToOrderDetail);
      setAllDeliveryData((prevData) => ({
        ...prevData,
        shippingAddress: formattedData,
        paymentInfo: "",
        artworkToPurchase: artworkToOrderDetail,
      }));

      const result = await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/add-delivery-address`,
        {
          formData: formattedData,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setTimeout(() => {
        navigate(`/orders/${artworkToOrder}/payment`);
      }, 500);

      setTimeout(() => {
        updateCollector({
          deliveryAddresses: result.data.deliveryAddresses,
        });
        setDeliveryAddressSavingProcess(false);
      }, 600);
    } catch (error) {
      console.error("error:", error);
    }
  };

  // edit address
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const editAddressModalRef = useRef(null);
  const [addressToEdit, setAddressToEdit] = useState([]);
  const [addressToEditData, setAddressToEditData] = useState({});

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const modalContent = editAddressModalRef.current;
      if (modalContent.scrollTop === 0) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    const modalContent = editAddressModalRef.current;
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const onCloseEditAddressModal = () => {
    setShowEditAddressModal(false);
  };
  const grabTheAddressToEdit = (addressToEdit) => {
    setShowEditAddressModal(true);
    setAddressToEdit(addressToEdit);
  };

  const countryNameToCode = {};
  for (const [code, name] of Object.entries(en)) {
    countryNameToCode[name] = code;
  }

  const getCountryCode = (countryName) => {
    return countryNameToCode[countryName] || "Unknown Code";
  };

  useEffect(() => {
    if (addressToEdit) {
      setAddressToEditData(addressToEdit);
    }
  }, [addressToEdit]);

  const [editExistShippingAddressProcess, setEditExistShippingAddressProcess] =
    useState(false);

  const editExistShippingAddress = async (formData) => {
    setEditExistShippingAddressProcess(true);

    if (
      !formData.fullName ||
      !formData.country ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state_provinence_or_region ||
      !formData.postalCode ||
      !formData.phoneNumber
    ) {
      setTimeout(() => {
        setEditExistShippingAddressProcess(false);
      }, 500);
      setTimeout(() => {
        window.alert("Please fill in the required fields.");
      }, 600);
      return;
    }

    try {
      const formattedData = prepareFormData(formData);

      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo._id}/${addressToEdit._id}/edit`,
        { formData: formattedData },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      updateCollector({
        deliveryAddresses: result.data.deliveryAddresses,
      });

      setTimeout(() => {
        setShowEditAddressModal(false);
      }, 500);

      setTimeout(() => {
        setEditExistShippingAddressProcess(false);
      }, 600);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleChangeAddressToEditData = (e) => {
    const { name, value } = e.target;

    setAddressToEditData({
      ...addressToEditData,
      [name]: value,
    });
  };
  useEffect(() => {
    if (getCountryCode(addressToEditData.country) !== "Unknown Code") {
      setAddressToEditData({
        ...addressToEditData,
        country: getCountryCode(addressToEditData.country),
      });
    }
  }, [addressToEditData]);

  // delete exist delivery address
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);

  const onCloseDeleteAddressModal = () => {
    setShowDeleteAddressModal(false);
  };

  const deleteExistDeliveryAddress = async () => {
    try {
      const result = await axios.delete(
        `${API_URL}/collectors/${collectorInfo?._id}/${addressToEdit?._id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      updateCollector({
        deliveryAddresses: result.data.collector.deliveryAddresses,
      });

      setShowDeleteAddressModal(false);
      setShowEditAddressModal(false);
    } catch (error) {
      console.error(
        "Error deleting address:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // add a new address when existing one
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const newAddressModalRef = useRef(null);
  const onCloseNewAddressModal = () => {
    setShowNewAddressModal(false);
  };

  // set as default address
  const setAsDefault = async (eachAddress) => {
    try {
      const response = await axios.patch(
        `${API_URL}/collectors/${collectorInfo?._id}/${eachAddress._id}/toggle-default-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      updateCollector({
        deliveryAddresses: response.data.collector.deliveryAddresses,
      });
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  // before reload the site or closing the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {/* show delete exist address modal */}
      <>
        {showDeleteAddressModal && (
          <Modal
            open={showDeleteAddressModal}
            onClose={onCloseEditAddressModal}
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
              className=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxHeight: "95vh",
                width: 310,
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
                overflowX: "hidden",
              }}
            >
              <div>
                <button
                  onClick={onCloseDeleteAddressModal}
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
                    padding: "20px 0px 0px 20px",
                  }}
                >
                  <div
                    className="chirp-regular-font unica-regular-font"
                    style={{
                      fontSize: "26px",
                      lineHeight: "34px",
                    }}
                  >
                    Delete address?
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "20px",
                  fontSize: "14px",
                  lineHeight: "16px",
                }}
                className="delivery-address-form-wrapper first-section-delivery-shipping unica-regular-font"
              >
                This will remove this address from your saved addressess.
              </div>
              <div
                style={{
                  padding: "0px 10px 10px 10px",
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => setShowDeleteAddressModal(false)}
                  className="hover_bg_color_effect_white_text"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgb(0,0,0)",
                    borderRadius: "9999px",
                    padding: "6px 25px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteExistDeliveryAddress}
                  className="hover_bg_color_effect_white_text"
                  style={{
                    marginRight: "8px",
                    backgroundColor: "black",
                    border: "1px solid rgb(0,0,0)",
                    borderRadius: "9999px",
                    padding: "6px 25px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
      {/* edit address modal */}
      <>
        {showEditAddressModal && (
          <Modal
            open={showEditAddressModal}
            onClose={onCloseEditAddressModal}
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
              ref={editAddressModalRef}
              className=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxHeight: "95vh",
                width: width <= 768 ? "95%" : 860,
                height: width <= 768 && "95vh",
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
                overflowX: "hidden",
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
                    ? `header_modal-shipping-address-edit scroll_active`
                    : `header_modal-shipping-address-edit`
                }
              >
                <button
                  onClick={() => {
                    setAddressToEdit([]);
                    onCloseEditAddressModal();
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
                  <div
                    className="chirp-regular-font unica-regular-font"
                    style={{
                      fontSize: "26px",
                      lineHeight: "34px",
                    }}
                  >
                    Edit address
                  </div>
                </div>
              </div>
              {/* edit address form */}
              <div
                style={{
                  marginTop: "10px",
                }}
              ></div>
              <div
                style={{
                  padding: "20px",
                }}
                className="delivery-address-form-wrapper first-section-delivery-shipping"
              >
                <div className="name-input-wrapper">
                  <Input
                    inputRef={shippingAddressBuyerNameInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressBuyerNameInputRef"
                        ? "Full name"
                        : addressToEditData?.fullName
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"fullName"}
                    value={addressToEditData?.fullName}
                    onChange={handleChangeAddressToEditData}
                    withLabel={true}
                    labelClassName={
                      addressToEditData?.fullName
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Full name"}
                    labelText={"Full name"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="countries-select-wrapper">
                  <div
                    style={{
                      maxHeight: "50px",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <label
                      className={
                        selectCountryOnClick
                          ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                          : addressToEditData.country
                          ? "selected-active-select-input styled-input-label unica-regular-font"
                          : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
                      }
                    >
                      Country
                    </label>
                    <select
                      className="pointer select-input-new-artwork-form"
                      ref={selectCountryRef}
                      name="country"
                      value={addressToEditData.country}
                      onChange={handleChangeAddressToEditData}
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
                      <option value="">{en["ZZ"]}</option>
                      {sortedCountries.map((country, index) => (
                        <option key={country._id || index} value={country}>
                          {en[country]}
                        </option>
                      ))}
                    </select>
                    {/* <div className="required-info unica-regular-font">
                    *Required
                  </div> */}
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="address-line-first-input-wrapper">
                  <Input
                    inputRef={shippingAddressAddressLineFirstInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressAddressLineFirstInputRef"
                        ? "Street Address"
                        : addressToEditData?.addressLine1
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"addressLine1"}
                    value={addressToEditData?.addressLine1}
                    onChange={handleChangeAddressToEditData}
                    withLabel={true}
                    labelClassName={
                      addressToEditData?.addressLine1
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Address Line 1"}
                    labelText={"Address Line 1"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="address-line-second-input-wrapper">
                  <Input
                    inputRef={shippingAddressAddressLineSecondInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput ===
                      "shippingAddressAddressLineSecondInputRef"
                        ? "Apt, floor, suite, etc."
                        : addressToEditData?.addressLine2
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"addressLine2"}
                    value={addressToEditData?.addressLine2}
                    onChange={handleChangeAddressToEditData}
                    withLabel={true}
                    labelClassName={
                      addressToEditData?.addressLine2
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Address Line 2 (Optional)"}
                    labelText={"Address Line 2 (Optional)"}
                  />
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="address-line-city-wrapper">
                  <Input
                    inputRef={shippingAddressCityInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressCityInputRef"
                        ? "City"
                        : addressToEditData?.city
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"city"}
                    value={addressToEditData?.city}
                    onChange={handleChangeAddressToEditData}
                    withLabel={true}
                    labelClassName={
                      addressToEditData?.city
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"City"}
                    labelText={"City"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="state_province_or_region_and_postal_code_wrapper">
                  <div className="first">
                    <div className="state_province_or_region-wrapper">
                      <Input
                        inputRef={shippingAddressState_provinence_or_regionRef}
                        className={"styled-input-with-label"}
                        placeholder={
                          focusedInput ===
                          "shippingAddressState_provinence_or_regionRef"
                            ? "State, province, or region"
                            : addressToEditData?.state_provinence_or_region
                        }
                        width={"inherit"}
                        wrapperWidth={"100%"}
                        wrapperMaxWidth={"100%"}
                        maxWidth={"100%"}
                        minWidth={"fit-content"}
                        maxHeight={"40px"}
                        wrapperHeight={"100%"}
                        wrapperMaxHeight={"50px"}
                        height={"100dvh"}
                        borderRadius={"3px"}
                        name={"state_provinence_or_region"}
                        value={addressToEditData?.state_provinence_or_region}
                        onChange={handleChangeAddressToEditData}
                        withLabel={true}
                        labelClassName={
                          addressToEditData?.state_provinence_or_region
                            ? `styled-input-label filled-input-label unica-regular-font`
                            : `styled-input-label unica-regular-font`
                        }
                        labelHtmlFor={"State, province, or region"}
                        labelText={"State, province, or region"}
                      />
                    </div>
                  </div>
                  <div className="second">
                    <div className="postal_code_wrapper">
                      <Input
                        inputRef={shippingAddressPostalCodeRef}
                        className={"styled-input-with-label"}
                        placeholder={
                          focusedInput === "shippingAddressPostalCodeRef"
                            ? "ZIP/Postal code"
                            : addressToEditData?.postalCode
                        }
                        width={"inherit"}
                        wrapperWidth={"100%"}
                        wrapperMaxWidth={"100%"}
                        maxWidth={"100%"}
                        minWidth={"fit-content"}
                        maxHeight={"40px"}
                        wrapperHeight={"100%"}
                        wrapperMaxHeight={"50px"}
                        height={"100dvh"}
                        borderRadius={"3px"}
                        name={"postalCode"}
                        value={addressToEditData?.postalCode}
                        onChange={handleChangeAddressToEditData}
                        withLabel={true}
                        labelClassName={
                          addressToEditData?.postalCode
                            ? `styled-input-label filled-input-label unica-regular-font`
                            : `styled-input-label unica-regular-font`
                        }
                        labelHtmlFor={"Postal code"}
                        labelText={"Postal code"}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-40-px-m-top"></div>
                <div
                  style={{
                    position: "relative",
                  }}
                  className="phone-number-wrapper"
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "-90%",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="tooltip-content unica-regular-font"
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                        padding: "12px 25px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "3px",
                        position: "relative",
                        bottom: "4px",
                        opacity: 0,
                        visibility: "hidden",
                        transition: "opacity 0.3s ease, visibility 0.3s ease",
                      }}
                    >
                      Required for shipping logistics
                    </div>
                    <div
                      onMouseEnter={() => {
                        document.querySelector(
                          ".tooltip-content"
                        ).style.opacity = 1;
                        document.querySelector(
                          ".tooltip-content"
                        ).style.visibility = "visible";
                      }}
                      onMouseLeave={() => {
                        document.querySelector(
                          ".tooltip-content"
                        ).style.opacity = 0;
                        document.querySelector(
                          ".tooltip-content"
                        ).style.visibility = "hidden";
                      }}
                      className="what_is_this_info unica-regular-font"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      What is this?
                    </div>
                  </div>

                  <Input
                    inputRef={shippingAddressPhoneNumberRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressPhoneNumberRef"
                        ? "Add phone number including country code"
                        : addressToEditData?.phoneNumber
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"phoneNumber"}
                    value={addressToEditData?.phoneNumber}
                    onChange={handleChangeAddressToEditData}
                    withLabel={true}
                    labelClassName={
                      addressToEditData?.phoneNumber
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Phone number"}
                    labelText={"Phone number"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-20-px-m-top"></div>
                <div
                  className="unica-regular-font"
                  style={{
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "#c82300",
                    textAlign: "center",
                  }}
                >
                  <span
                    onClick={() => setShowDeleteAddressModal(true)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Delete address
                  </span>
                </div>
                <div className="box-20-px-m-top"></div>
                <Button
                  className="hover_bg_color_effect_white_text"
                  backgroundColor="black"
                  height="100dvh"
                  maxHeight="50px"
                  width="100%"
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="999px"
                  border="none"
                  pointerEvents={
                    editExistShippingAddressProcess ? "none" : "auto"
                  }
                  cursor={
                    editExistShippingAddressProcess ? "default" : "pointer"
                  }
                  opacity={editExistShippingAddressProcess ? "0.3" : "1"}
                  loadingScenario={
                    editExistShippingAddressProcess ? true : false
                  }
                  text="Save"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="20px"
                  onClick={() => {
                    editExistShippingAddress(addressToEditData);
                  }}
                />
              </div>
            </div>
          </Modal>
        )}
      </>
      {/* new address modal */}
      <>
        {showNewAddressModal && (
          <Modal
            open={showNewAddressModal}
            onClose={onCloseNewAddressModal}
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
              ref={newAddressModalRef}
              className=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxHeight: "95vh",
                width: width <= 768 ? "95%" : 860,
                height: width <= 768 && "95vh",
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
                overflowX: "hidden",
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
                    ? `header_modal-shipping-address-edit scroll_active`
                    : `header_modal-shipping-address-edit`
                }
              >
                <button
                  onClick={() => {
                    setFormData({
                      fullName: "",
                      country: "DE",
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state_provinence_or_region: "",
                      postalCode: "",
                      phoneNumber: "",
                      save_shipping_address_for_later_use: "",
                    });
                    onCloseNewAddressModal();
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
                  <div
                    className="chirp-regular-font unica-regular-font"
                    style={{
                      fontSize: "26px",
                      lineHeight: "34px",
                    }}
                  >
                    Add address
                  </div>
                </div>
              </div>
              {/* edit address form */}
              <div
                style={{
                  marginTop: "10px",
                }}
              ></div>
              <div
                style={{
                  padding: "20px",
                }}
                className="delivery-address-form-wrapper first-section-delivery-shipping unica-regular-font"
              >
                <div className="name-input-wrapper">
                  <Input
                    inputRef={shippingAddressBuyerNameInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressBuyerNameInputRef"
                        ? "Full name"
                        : formData?.fullName
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"fullName"}
                    value={formData?.fullName}
                    onChange={handleChange}
                    withLabel={true}
                    labelClassName={
                      formData?.fullName
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Full name"}
                    labelText={"Full name"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="countries-select-wrapper">
                  <div
                    style={{
                      maxHeight: "50px",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <label
                      className={
                        selectCountryOnClick
                          ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                          : formData.country
                          ? "selected-active-select-input styled-input-label unica-regular-font"
                          : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
                      }
                    >
                      Country
                    </label>
                    <select
                      className="pointer select-input-new-artwork-form"
                      ref={selectCountryRef}
                      name="country"
                      value={formData.country}
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
                      <option value="">{en["ZZ"]}</option>
                      {sortedCountries.map((country, index) => (
                        <option key={country._id || index} value={country}>
                          {en[country]}
                        </option>
                      ))}
                    </select>
                    {/* <div className="required-info unica-regular-font">
                    *Required
                  </div> */}
                  </div>
                </div>{" "}
                <div className="box-30-px-m-top"></div>
                <div className="address-line-first-input-wrapper">
                  <Input
                    inputRef={shippingAddressAddressLineFirstInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressAddressLineFirstInputRef"
                        ? "Street Address"
                        : formData?.addressLine1
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"addressLine1"}
                    value={formData?.addressLine1}
                    onChange={handleChange}
                    withLabel={true}
                    labelClassName={
                      formData?.addressLine1
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Address Line 1"}
                    labelText={"Address Line 1"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="address-line-second-input-wrapper">
                  <Input
                    inputRef={shippingAddressAddressLineSecondInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput ===
                      "shippingAddressAddressLineSecondInputRef"
                        ? "Apt, floor, suite, etc."
                        : formData?.addressLine2
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"addressLine2"}
                    value={formData?.addressLine2}
                    onChange={handleChange}
                    withLabel={true}
                    labelClassName={
                      formData?.addressLine2
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Address Line 2 (Optional)"}
                    labelText={"Address Line 2 (Optional)"}
                  />
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="address-line-city-wrapper">
                  <Input
                    inputRef={shippingAddressCityInputRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressCityInputRef"
                        ? "City"
                        : formData?.city
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"city"}
                    value={formData?.city}
                    onChange={handleChange}
                    withLabel={true}
                    labelClassName={
                      formData?.city
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"City"}
                    labelText={"City"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-30-px-m-top"></div>
                <div className="state_province_or_region_and_postal_code_wrapper">
                  <div className="first">
                    <div className="state_province_or_region-wrapper">
                      <Input
                        inputRef={shippingAddressState_provinence_or_regionRef}
                        className={"styled-input-with-label"}
                        placeholder={
                          focusedInput ===
                          "shippingAddressState_provinence_or_regionRef"
                            ? "State, province, or region"
                            : formData?.state_provinence_or_region
                        }
                        width={"inherit"}
                        wrapperWidth={"100%"}
                        wrapperMaxWidth={"100%"}
                        maxWidth={"100%"}
                        minWidth={"fit-content"}
                        maxHeight={"40px"}
                        wrapperHeight={"100%"}
                        wrapperMaxHeight={"50px"}
                        height={"100dvh"}
                        borderRadius={"3px"}
                        name={"state_provinence_or_region"}
                        value={formData?.state_provinence_or_region}
                        onChange={handleChange}
                        withLabel={true}
                        labelClassName={
                          formData?.state_provinence_or_region
                            ? `styled-input-label filled-input-label unica-regular-font`
                            : `styled-input-label unica-regular-font`
                        }
                        labelHtmlFor={
                          width <= 480
                            ? "State, province ..."
                            : "State, province, or region"
                        }
                        labelText={
                          width <= 480
                            ? "State, province ..."
                            : "State, province, or region"
                        }
                      />
                    </div>
                  </div>
                  <div className="second">
                    <div className="postal_code_wrapper">
                      <Input
                        inputRef={shippingAddressPostalCodeRef}
                        className={"styled-input-with-label"}
                        placeholder={
                          focusedInput === "shippingAddressPostalCodeRef"
                            ? "ZIP/Postal code"
                            : formData?.postalCode
                        }
                        width={"inherit"}
                        wrapperWidth={"100%"}
                        wrapperMaxWidth={"100%"}
                        maxWidth={"100%"}
                        minWidth={"fit-content"}
                        maxHeight={"40px"}
                        wrapperHeight={"100%"}
                        wrapperMaxHeight={"50px"}
                        height={"100dvh"}
                        borderRadius={"3px"}
                        name={"postalCode"}
                        value={formData?.postalCode}
                        onChange={handleChange}
                        withLabel={true}
                        labelClassName={
                          formData?.postalCode
                            ? `styled-input-label filled-input-label unica-regular-font`
                            : `styled-input-label unica-regular-font`
                        }
                        labelHtmlFor={"Postal code"}
                        labelText={"Postal code"}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-40-px-m-top"></div>
                <div
                  style={{
                    position: "relative",
                  }}
                  className="phone-number-wrapper"
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "-90%",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="tooltip-content"
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                        padding: "12px 25px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "3px",
                        position: "relative",
                        bottom: "4px",
                        opacity: 0,
                        visibility: "hidden",
                        transition: "opacity 0.3s ease, visibility 0.3s ease",
                      }}
                    >
                      Required for shipping logistics
                    </div>
                    <div
                      onMouseEnter={() => {
                        document.querySelector(
                          ".tooltip-content"
                        ).style.opacity = 1;
                        document.querySelector(
                          ".tooltip-content"
                        ).style.visibility = "visible";
                      }}
                      onMouseLeave={() => {
                        document.querySelector(
                          ".tooltip-content"
                        ).style.opacity = 0;
                        document.querySelector(
                          ".tooltip-content"
                        ).style.visibility = "hidden";
                      }}
                      className="what_is_this_info"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      What is this?
                    </div>
                  </div>

                  <Input
                    inputRef={shippingAddressPhoneNumberRef}
                    className={"styled-input-with-label"}
                    placeholder={
                      focusedInput === "shippingAddressPhoneNumberRef"
                        ? "Add phone number including country code"
                        : formData?.phoneNumber
                    }
                    width={"inherit"}
                    wrapperWidth={"100%"}
                    wrapperMaxWidth={"100%"}
                    maxWidth={"100%"}
                    minWidth={"fit-content"}
                    maxHeight={"40px"}
                    wrapperHeight={"100%"}
                    wrapperMaxHeight={"50px"}
                    height={"100dvh"}
                    borderRadius={"3px"}
                    name={"phoneNumber"}
                    value={formData?.phoneNumber}
                    onChange={handleChange}
                    withLabel={true}
                    labelClassName={
                      formData?.phoneNumber
                        ? `styled-input-label filled-input-label unica-regular-font`
                        : `styled-input-label unica-regular-font`
                    }
                    labelHtmlFor={"Phone number"}
                    labelText={"Phone number"}
                  />
                  <div className="required-info unica-regular-font">
                    *Required
                  </div>
                </div>
                <div className="box-20-px-m-top"></div>
                <div
                  onClick={() => {
                    setFormData((prevData) => ({
                      ...prevData,
                      save_shipping_address_for_later_use:
                        !formData.save_shipping_address_for_later_use,
                    }));
                  }}
                  onMouseEnter={() =>
                    setSave_shipping_address_for_later_useHovered(true)
                  }
                  onMouseLeave={() =>
                    setSave_shipping_address_for_later_useHovered(false)
                  }
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "18px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "18px",

                        border: formData.save_shipping_address_for_later_use
                          ? "none"
                          : save_shipping_address_for_later_useHovered
                          ? "1px solid rgb(16,35,215)"
                          : "1px solid rgb(231,231,231)",
                        backgroundColor:
                          !formData.save_shipping_address_for_later_use
                            ? "transparent"
                            : formData.save_shipping_address_for_later_use &&
                              !save_shipping_address_for_later_useHovered
                            ? "black"
                            : "rgb(16,35,215)",
                        transition: "border 0.3s ease-in-out",
                      }}
                    >
                      <div>
                        {formData.save_shipping_address_for_later_use && (
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill={"white"}
                          >
                            <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        settedAsDefault: formData.settedAsDefault
                          ? false
                          : true,
                      }))
                    }
                    className="hover_color_effect hover_color_effect_t-d pointer"
                    style={{
                      color: "rgb(112,112,112)",
                      marginLeft: "12px",
                    }}
                  >
                    Set as default
                  </div>
                </div>
                {width > 768 && (
                  <>
                    <div className="box-20-px-m-top"></div>
                    <Button
                      className="hover_bg_color_effect_white_text"
                      backgroundColor="black"
                      height="100dvh"
                      maxHeight="50px"
                      width="100%"
                      maxWidth="100%"
                      padding="1px 25px"
                      borderRadius="999px"
                      border="none"
                      pointerEvents={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "none"
                          : "auto"
                      }
                      cursor={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "default"
                          : "pointer"
                      }
                      opacity={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "0.3"
                          : "1"
                      }
                      loadingScenario={
                        deliveryAddressSavingProcess ? true : false
                      }
                      text="Save and Continue"
                      textColor="white"
                      fontSize="16px"
                      lineHeight="20px"
                      onClick={() => {
                        saveDeliveryAddressAndContinue(formData);
                      }}
                    />
                  </>
                )}
                {width <= 768 && (
                  <>
                    <div className="box-20-px-m-top"></div>
                    <Button
                      className="hover_bg_color_effect_white_text"
                      backgroundColor="black"
                      height="100dvh"
                      maxHeight="50px"
                      width="100%"
                      maxWidth="100%"
                      padding="1px 25px"
                      borderRadius="999px"
                      border="none"
                      pointerEvents={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "none"
                          : "auto"
                      }
                      cursor={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "default"
                          : "pointer"
                      }
                      opacity={
                        deliveryAddressSavingProcess ||
                        !formData?.fullName ||
                        !formData.country ||
                        !formData?.addressLine1 ||
                        !formData?.city ||
                        !formData.phoneNumber ||
                        !formData.state_provinence_or_region ||
                        !formData.postalCode
                          ? "0.3"
                          : "1"
                      }
                      loadingScenario={
                        deliveryAddressSavingProcess ? true : false
                      }
                      text="Save and Continue"
                      textColor="white"
                      fontSize="16px"
                      lineHeight="20px"
                      onClick={() => {
                        saveDeliveryAddressAndContinue(formData);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </Modal>
        )}
      </>

      <div className="box-40-px-m-top"></div>
      <div className="shipping-header-wrapper unica-regular-font">
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
          <line x1="20" y1="20" x2="80" y2="80" stroke="#333" strokeWidth="3" />
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
        <div className="box-40-px-m-top"></div>
        <div className="shipping-navigation">
          <HeaderNavBar
            wrapperMargin={width <= 768 ? "0px" : "0px 0px"}
            responsivePadding={"0px 20px"}
            items={navItems}
            currentPath={location.pathname}
            width={width}
            isPurchaseRelated={true}
          />
        </div>
        <div
          className="box-40-px-m-top"
          style={{
            fontSize: "26px",
            lineHeight: "32px",
          }}
        >
          Delivery address
        </div>
        <div className="box-20-px-m-top"></div>
        <div className="delivery-address-form-wrapper">
          {collectorInfo?.deliveryAddresses.length > 0 ? (
            <div className="delivery-address-form-wrapper first-section-delivery-shipping">
              {collectorInfo?.deliveryAddresses.map(
                (eachAddress, eachAddressIndex) => {
                  return (
                    <div
                      key={eachAddressIndex}
                      style={{
                        border: "1px solid rgb(231,231,231)",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                        }}
                      >
                        <div
                          onClick={() => setAsDefault(eachAddress)}
                          style={{
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            backgroundColor: eachAddress.settedAsDefault
                              ? "black"
                              : "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: !eachAddress.settedAsDefault
                              ? "1px solid rgb(231,231,231)"
                              : "1px solid white",
                          }}
                        >
                          <div
                            style={{
                              borderRadius: "50%",
                              width: "12px",
                              height: "12px",
                              backgroundColor: "white",
                            }}
                          ></div>
                        </div>

                        <div className="hover_td_kinda_blue">
                          <div>{eachAddress?.fullName}</div>
                          <div
                            style={{
                              marginTop: "20px",
                            }}
                          ></div>
                          <div
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            {eachAddress?.addressLine1}
                          </div>
                          <div
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            {eachAddress?.addressLine2
                              ? eachAddress.addressLine2
                              : null}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: width <= 768 ? "column" : "row",
                              color: "rgb(112,112,112)",
                              gap: "5px",
                            }}
                          >
                            <div>{eachAddress?.city},</div>
                            <div>
                              {eachAddress?.state_provinence_or_region},
                            </div>
                            <div>{eachAddress?.country},</div>
                            <div>{eachAddress?.postalCode}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span
                          onClick={() => {
                            grabTheAddressToEdit(eachAddress);
                          }}
                          className="hover_td_kinda_blue"
                          style={{
                            color: "rgb(16,35,215)",
                          }}
                        >
                          Edit
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
              <div className="box-20-px-m-top"></div>
              <div>
                <span
                  onClick={() => {
                    setFormData({
                      fullName: "",
                      country: "DE",
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state_provinence_or_region: "",
                      postalCode: "",
                      phoneNumber: "",
                      save_shipping_address_for_later_use: "",
                      settedAsDefault: false,
                    });
                    setShowNewAddressModal(true);
                  }}
                  style={{
                    textDecoration: "underline",
                  }}
                  className="hover_td_kinda_blue hover_color_effect pointer"
                >
                  Add a new address
                </span>
              </div>
              <div className="box-20-px-m-top"></div>
              <Button
                className="hover_bg_color_effect_white_text"
                backgroundColor="black"
                height="100dvh"
                maxHeight="50px"
                width="100%"
                maxWidth={width <= 768 ? "100%" : "388px"}
                padding="1px 25px"
                borderRadius="999px"
                border="none"
                pointerEvents={deliveryAddressSavingProcess ? "none" : "auto"}
                cursor={deliveryAddressSavingProcess ? "default" : "pointer"}
                opacity={deliveryAddressSavingProcess ? "0.3" : "1"}
                loadingScenario={deliveryAddressSavingProcess ? true : false}
                text="Save and Continue"
                textColor="white"
                fontSize="16px"
                lineHeight="20px"
                onClick={() => {
                  if (formData?.save_shipping_address_for_later_use) {
                    saveDeliveryAddressAndContinue(formData);
                  } else {
                    changeTabToPayment(formData);
                  }
                }}
              />
            </div>
          ) : (
            <div className="delivery-address-form-wrapper first-section-delivery-shipping">
              <div className="name-input-wrapper">
                <Input
                  inputRef={shippingAddressBuyerNameInputRef}
                  className={"styled-input-with-label"}
                  placeholder={
                    focusedInput === "shippingAddressBuyerNameInputRef"
                      ? "Full name"
                      : formData?.fullName
                  }
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={"100%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"fullName"}
                  value={formData?.fullName}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={
                    formData?.fullName
                      ? `styled-input-label filled-input-label unica-regular-font`
                      : `styled-input-label unica-regular-font`
                  }
                  labelHtmlFor={"Full name"}
                  labelText={"Full name"}
                />
                <div className="required-info unica-regular-font">
                  *Required
                </div>
              </div>
              <div className="box-30-px-m-top"></div>
              <div className="countries-select-wrapper">
                <div
                  style={{
                    maxHeight: "50px",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <label
                    className={
                      selectCountryOnClick
                        ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                        : formData.country
                        ? "selected-active-select-input styled-input-label unica-regular-font"
                        : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
                    }
                  >
                    Country
                  </label>
                  <select
                    className="pointer select-input-new-artwork-form"
                    ref={selectCountryRef}
                    name="country"
                    value={formData.country}
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
                    <option value="">{en["ZZ"]}</option>
                    {sortedCountries.map((country, index) => (
                      <option key={country._id || index} value={country}>
                        {en[country]}
                      </option>
                    ))}
                  </select>
                  {/* <div className="required-info unica-regular-font">
                    *Required
                  </div> */}
                </div>
              </div>{" "}
              <div className="box-30-px-m-top"></div>
              <div className="address-line-first-input-wrapper">
                <Input
                  inputRef={shippingAddressAddressLineFirstInputRef}
                  className={"styled-input-with-label"}
                  placeholder={
                    focusedInput === "shippingAddressAddressLineFirstInputRef"
                      ? "Street Address"
                      : formData?.addressLine1
                  }
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={"100%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"addressLine1"}
                  value={formData?.addressLine1}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={
                    formData?.addressLine1
                      ? `styled-input-label filled-input-label unica-regular-font`
                      : `styled-input-label unica-regular-font`
                  }
                  labelHtmlFor={"Address Line 1"}
                  labelText={"Address Line 1"}
                />
                <div className="required-info unica-regular-font">
                  *Required
                </div>
              </div>
              <div className="box-30-px-m-top"></div>
              <div className="address-line-second-input-wrapper">
                <Input
                  inputRef={shippingAddressAddressLineSecondInputRef}
                  className={"styled-input-with-label"}
                  placeholder={
                    focusedInput === "shippingAddressAddressLineSecondInputRef"
                      ? "Apt, floor, suite, etc."
                      : formData?.addressLine2
                  }
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={"100%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"addressLine2"}
                  value={formData?.addressLine2}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={
                    formData?.addressLine2
                      ? `styled-input-label filled-input-label unica-regular-font`
                      : `styled-input-label unica-regular-font`
                  }
                  labelHtmlFor={"Address Line 2 (Optional)"}
                  labelText={"Address Line 2 (Optional)"}
                />
              </div>
              <div className="box-30-px-m-top"></div>
              <div className="address-line-city-wrapper">
                <Input
                  inputRef={shippingAddressCityInputRef}
                  className={"styled-input-with-label"}
                  placeholder={
                    focusedInput === "shippingAddressCityInputRef"
                      ? "City"
                      : formData?.city
                  }
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={"100%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"city"}
                  value={formData?.city}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={
                    formData?.city
                      ? `styled-input-label filled-input-label unica-regular-font`
                      : `styled-input-label unica-regular-font`
                  }
                  labelHtmlFor={"City"}
                  labelText={"City"}
                />
                <div className="required-info unica-regular-font">
                  *Required
                </div>
              </div>
              <div className="box-30-px-m-top"></div>
              <div className="state_province_or_region_and_postal_code_wrapper">
                <div className="first">
                  <div className="state_province_or_region-wrapper">
                    <Input
                      inputRef={shippingAddressState_provinence_or_regionRef}
                      className={"styled-input-with-label"}
                      placeholder={
                        focusedInput ===
                        "shippingAddressState_provinence_or_regionRef"
                          ? "State, province, or region"
                          : formData?.state_provinence_or_region
                      }
                      width={"inherit"}
                      wrapperWidth={"100%"}
                      wrapperMaxWidth={"100%"}
                      maxWidth={"100%"}
                      minWidth={"fit-content"}
                      maxHeight={"40px"}
                      wrapperHeight={"100%"}
                      wrapperMaxHeight={"50px"}
                      height={"100dvh"}
                      borderRadius={"3px"}
                      name={"state_provinence_or_region"}
                      value={formData?.state_provinence_or_region}
                      onChange={handleChange}
                      withLabel={true}
                      labelClassName={
                        formData?.state_provinence_or_region
                          ? `styled-input-label filled-input-label unica-regular-font`
                          : `styled-input-label unica-regular-font`
                      }
                      labelHtmlFor={"State, province, or region"}
                      labelText={"State, province, or region"}
                    />
                  </div>
                </div>
                <div className="second">
                  <div className="postal_code_wrapper">
                    <Input
                      inputRef={shippingAddressPostalCodeRef}
                      className={"styled-input-with-label"}
                      placeholder={
                        focusedInput === "shippingAddressPostalCodeRef"
                          ? "ZIP/Postal code"
                          : formData?.postalCode
                      }
                      width={"inherit"}
                      wrapperWidth={"100%"}
                      wrapperMaxWidth={"100%"}
                      maxWidth={"100%"}
                      minWidth={"fit-content"}
                      maxHeight={"40px"}
                      wrapperHeight={"100%"}
                      wrapperMaxHeight={"50px"}
                      height={"100dvh"}
                      borderRadius={"3px"}
                      name={"postalCode"}
                      value={formData?.postalCode}
                      onChange={handleChange}
                      withLabel={true}
                      labelClassName={
                        formData?.postalCode
                          ? `styled-input-label filled-input-label unica-regular-font`
                          : `styled-input-label unica-regular-font`
                      }
                      labelHtmlFor={"Postal code"}
                      labelText={"Postal code"}
                    />
                  </div>
                </div>
              </div>
              <div className="box-40-px-m-top"></div>
              <div
                style={{
                  position: "relative",
                }}
                className="phone-number-wrapper"
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "-90%",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="tooltip-content"
                    style={{
                      fontSize: "13px",
                      lineHeight: "16px",
                      padding: "12px 25px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      borderRadius: "3px",
                      position: "relative",
                      bottom: "4px",
                      opacity: 0,
                      visibility: "hidden",
                      transition: "opacity 0.3s ease, visibility 0.3s ease",
                    }}
                  >
                    Required for shipping logistics
                  </div>
                  <div
                    onMouseEnter={() => {
                      document.querySelector(
                        ".tooltip-content"
                      ).style.opacity = 1;
                      document.querySelector(
                        ".tooltip-content"
                      ).style.visibility = "visible";
                    }}
                    onMouseLeave={() => {
                      document.querySelector(
                        ".tooltip-content"
                      ).style.opacity = 0;
                      document.querySelector(
                        ".tooltip-content"
                      ).style.visibility = "hidden";
                    }}
                    className="what_is_this_info"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    What is this?
                  </div>
                </div>

                <Input
                  inputRef={shippingAddressPhoneNumberRef}
                  className={"styled-input-with-label"}
                  placeholder={
                    focusedInput === "shippingAddressPhoneNumberRef"
                      ? "Add phone number including country code"
                      : formData?.phoneNumber
                  }
                  width={"inherit"}
                  wrapperWidth={"100%"}
                  wrapperMaxWidth={"100%"}
                  maxWidth={"100%"}
                  minWidth={"fit-content"}
                  maxHeight={"40px"}
                  wrapperHeight={"100%"}
                  wrapperMaxHeight={"50px"}
                  height={"100dvh"}
                  borderRadius={"3px"}
                  name={"phoneNumber"}
                  value={formData?.phoneNumber}
                  onChange={handleChange}
                  withLabel={true}
                  labelClassName={
                    formData?.phoneNumber
                      ? `styled-input-label filled-input-label unica-regular-font`
                      : `styled-input-label unica-regular-font`
                  }
                  labelHtmlFor={"Phone number"}
                  labelText={"Phone number"}
                />
                <div className="required-info unica-regular-font">
                  *Required
                </div>
              </div>
              <div className="box-20-px-m-top"></div>
              <div
                onClick={() => {
                  setFormData((prevData) => ({
                    ...prevData,
                    save_shipping_address_for_later_use:
                      !formData.save_shipping_address_for_later_use,
                  }));
                }}
                onMouseEnter={() =>
                  setSave_shipping_address_for_later_useHovered(true)
                }
                onMouseLeave={() =>
                  setSave_shipping_address_for_later_useHovered(false)
                }
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    maxWidth: "18px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "18px",

                      border: formData.save_shipping_address_for_later_use
                        ? "none"
                        : save_shipping_address_for_later_useHovered
                        ? "1px solid rgb(16,35,215)"
                        : "1px solid rgb(231,231,231)",
                      backgroundColor:
                        !formData.save_shipping_address_for_later_use
                          ? "transparent"
                          : formData.save_shipping_address_for_later_use &&
                            !save_shipping_address_for_later_useHovered
                          ? "black"
                          : "rgb(16,35,215)",
                      transition: "border 0.3s ease-in-out",
                    }}
                  >
                    <div>
                      {formData.save_shipping_address_for_later_use && (
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill={"white"}
                        >
                          <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="hover_color_effect hover_color_effect_t-d pointer"
                  style={{
                    color: "rgb(112,112,112)",
                    marginLeft: "12px",
                  }}
                >
                  Save shipping address for later use
                </div>
              </div>
              {width > 768 && (
                <>
                  <div className="box-20-px-m-top"></div>
                  <Button
                    className="hover_bg_color_effect_white_text"
                    backgroundColor="black"
                    height="100dvh"
                    maxHeight="50px"
                    width="100%"
                    maxWidth="388px"
                    padding="1px 25px"
                    borderRadius="999px"
                    border="none"
                    pointerEvents={
                      deliveryAddressSavingProcess ||
                      !formData?.fullName ||
                      !formData.country ||
                      !formData?.addressLine1 ||
                      !formData?.city ||
                      !formData.phoneNumber ||
                      !formData.state_provinence_or_region ||
                      !formData.postalCode
                        ? "none"
                        : "auto"
                    }
                    cursor={
                      deliveryAddressSavingProcess ||
                      !formData?.fullName ||
                      !formData.country ||
                      !formData?.addressLine1 ||
                      !formData?.city ||
                      !formData.phoneNumber ||
                      !formData.state_provinence_or_region ||
                      !formData.postalCode
                        ? "default"
                        : "pointer"
                    }
                    opacity={
                      deliveryAddressSavingProcess ||
                      !formData?.fullName ||
                      !formData.country ||
                      !formData?.addressLine1 ||
                      !formData?.city ||
                      !formData.phoneNumber ||
                      !formData.state_provinence_or_region ||
                      !formData.postalCode
                        ? "0.3"
                        : "1"
                    }
                    loadingScenario={
                      deliveryAddressSavingProcess ? true : false
                    }
                    text="Save and Continue"
                    textColor="white"
                    fontSize="16px"
                    lineHeight="20px"
                    onClick={() => {
                      if (formData?.save_shipping_address_for_later_use) {
                        saveDeliveryAddressAndContinue(formData);
                      } else {
                        changeTabToPayment(formData);
                      }
                    }}
                  />
                </>
              )}
            </div>
          )}
          {width > 768 && (
            <div className="delivery-address-form-wrapper seperator-section"></div>
          )}
          {width <= 768 && <div className="box-40-px-m-top"></div>}
          <div className="delivery-address-form-wrapper second-section-delivery-shipping">
            <div className="wrapper-delivery-shipping-right-side">
              <div className="paddingle-delivery-right-side">
                {artworkToOrderDetail?.creator}
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                {artworkToOrderDetail?.title}
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                {artworkToOrderDetail?.category}
              </div>
              <div
                className="dflex"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: "rgb(112,112,112)",
                  }}
                  className="paddingle-delivery-right-side"
                >
                  {artworkToOrderDetail?.aboutTheWork?.medium}
                </div>
                <div
                  style={{
                    color: "rgb(112,112,112)",
                  }}
                  className="paddingle-delivery-right-side"
                >
                  {artworkToOrderDetail?.aboutTheWork?.size}
                </div>
              </div>
              <div className="paddingle-delivery-right-side">Price $?€?£?</div>
              <div className="paddingle-delivery-right-side">
                {artworkToOrderDetail?.aboutTheWork?.imageRights}
              </div>
              <div
                style={{
                  marginTop: "20px",
                }}
              ></div>
              <div
                style={{
                  borderBottom: "1px solid rgb(231,231,231)",
                }}
              ></div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Price</div>
                <div>$?€?£?</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Shipping</div>
                <div>Calculated in next steps</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Tax*</div>
                <div>Calculated in next steps</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Total</div>
                <div>Waiting for final costs</div>
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                *Additional duties and taxes{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  may apply at import.
                </span>
              </div>
            </div>
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f7f7f7",
                display: "flex",
                gap: "12px",
              }}
            >
              <div>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M9 1.00001C11.1217 1.00001 13.1566 1.84286 14.6569 3.34315C16.1571 4.84344 17 6.87828 17 9.00001C17 11.1217 16.1571 13.1566 14.6569 14.6569C13.1566 16.1572 11.1217 17 9 17C6.87827 17 4.84344 16.1572 3.34315 14.6569C1.84285 13.1566 1 11.1217 1 9.00001C1 6.87828 1.84285 4.84344 3.34315 3.34315C4.84344 1.84286 6.87827 1.00001 9 1.00001ZM13.32 6.79601L12.556 6.01301L7.746 10.778L5.444 8.52801L4.662 9.31101L7.747 12.378L13.32 6.79601Z"></path>
                </svg>
              </div>
              <div>
                <div>Your purchase is protected.</div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Learn more about{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Art Bazaar’s buyer protection.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="third-section"
          style={{
            width: "100%",
            marginTop: "40px",
            marginBottom: "60px",
          }}
        >
          {width <= 768 && (
            <Button
              className="hover_bg_color_effect_white_text"
              backgroundColor="black"
              height="100dvh"
              maxHeight="50px"
              width="100%"
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="999px"
              border="none"
              pointerEvents={
                deliveryAddressSavingProcess ||
                !formData?.fullName ||
                !formData.country ||
                !formData?.addressLine1 ||
                !formData?.city ||
                !formData.phoneNumber ||
                !formData.state_provinence_or_region ||
                !formData.postalCode
                  ? "none"
                  : "auto"
              }
              cursor={
                deliveryAddressSavingProcess ||
                !formData?.fullName ||
                !formData.country ||
                !formData?.addressLine1 ||
                !formData?.city ||
                !formData.phoneNumber ||
                !formData.state_provinence_or_region ||
                !formData.postalCode
                  ? "default"
                  : "pointer"
              }
              opacity={
                deliveryAddressSavingProcess ||
                !formData?.fullName ||
                !formData.country ||
                !formData?.addressLine1 ||
                !formData?.city ||
                !formData.phoneNumber ||
                !formData.state_provinence_or_region ||
                !formData.postalCode
                  ? "0.3"
                  : "1"
              }
              loadingScenario={deliveryAddressSavingProcess ? true : false}
              text="Save and Continue"
              textColor="white"
              fontSize="16px"
              lineHeight="20px"
              onClick={() => {}}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OrdersShipping;
