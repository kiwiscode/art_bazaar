import { useEffect, useRef, useState } from "react";
import SearchArtistInput from "./SearchArtistInput";
import Input from "./Input";
import useWindowDimensions from "../../utils/useWindowDimensions";
import FileInput from "./FileInput";
import ArtistProfileImage from "./ArtistProfileImage";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function NewArtworkForm({
  padding,
  handleArtistSelect,
  handleFormData,
  handleUploadImages,
  artistSelected,
  artworkSelected,
  uploadPhotoSection,
  sendArtistQueryToParent,
  isEditModeOnForm,
  collectionToEdit,
}) {
  const [artists, setArtists] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [queryUpdate, setQueryUpdate] = useState(null);
  const { width } = useWindowDimensions();
  const [searchArtistQuery, setSearchArtistQuery] = useState("");
  const [onFocusNotes, setOnFocusNotes] = useState(null);
  useEffect(() => {
    if (searchArtistQuery) {
      sendArtistQueryToParent(searchArtistQuery);
    }
  }, [searchArtistQuery]);

  const handleArtistsUpdate = (newArtists) => {
    setArtists(newArtists);
  };

  const handleOnQueryUpdate = (queryStatus) => {
    setQueryUpdate(queryStatus);
  };

  const handleReceiveQuerySearchArtistInput = (query) => {
    setSearchArtistQuery(query);
  };

  // default value changes for artwork title,year,materials
  const [selectMediumBorder, setSelectMediumBorder] = useState(
    "1px solid rgb(194, 194, 194)"
  );
  const [selectRarityBorder, setSelectRarityBorder] = useState(
    "1px solid rgb(194, 194, 194)"
  );
  const [borderTextArea, setBorderTextArea] = useState(null);
  const [formData, setFormData] = useState({
    artistId: "",
    artistName: "",
    title: "",
    medium: "",
    year: "",
    materials: "",
    rarity: "",
    dimensions: {
      height: null,
      width: null,
      depth: null,
      in: "",
      cm: "",
    },
    pricePaid: {
      amount: null,
      currency: "USD",
    },
    provenance: "",
    city: "",
    notes: "",
    shareWithGalleries: false,
    uploadedPhotos: [],
  });

  const clearFormData = () => {
    setFormData({
      artistId: "",
      artistName: "",
      title: "",
      medium: "",
      year: "",
      materials: "",
      rarity: "",
      dimensions: {
        height: null,
        width: null,
        depth: null,
        in: "",
        cm: "",
      },
      pricePaid: {
        amount: null,
        currency: "USD",
      },
      provenance: "",
      city: "",
      notes: "",
      shareWithGalleries: false,
      uploadedPhotos: [],
    });
  };

  useEffect(() => {
    clearFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Object.keys(formData.dimensions).includes(name)) {
      setFormData({
        ...formData,
        dimensions: { ...formData.dimensions, [name]: value },
      });
    } else if (Object.keys(formData.pricePaid).includes(name)) {
      setFormData({
        ...formData,
        pricePaid: { ...formData.pricePaid, [name]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // select label and text area style
  const selectRef = useRef(null);
  const rarityRef = useRef(null);
  const textAreaRef = useRef(null);

  const [selectOnClick, setSelectOnClick] = useState(false);
  const [rarityOnClick, setRarityOnClick] = useState(false);
  const [textAreaOnClick, setTextAreaOnClick] = useState(false);
  const handleSelectOnClick = (event) => {
    if (selectRef.current && selectRef.current.contains(event.target)) {
      setSelectOnClick(true);
    } else {
      setSelectOnClick(false);
    }
  };
  const handleRarityOnClick = (event) => {
    if (rarityRef.current && rarityRef.current.contains(event.target)) {
      setRarityOnClick(true);
    } else {
      setRarityOnClick(false);
    }
  };
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
  useEffect(() => {
    document.addEventListener("mousedown", handleRarityOnClick);
    return () => {
      document.removeEventListener("mousedown", handleRarityOnClick);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleSelectOnClick);
    return () => {
      document.removeEventListener("mousedown", handleSelectOnClick);
    };
  }, []);

  // input ref for onfocus listening
  const artistInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const materialsInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const widthInputRef = useRef(null);
  const depthInputRef = useRef(null);
  const pricePaidInputRef = useRef(null);
  const provenanceInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const notesRef = useRef(null);

  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    const handleFocusArtistInputRef = () => setFocusedInput("artistInputRef");
    const handleBlurArtistInputRef = () => setFocusedInput("");

    const handleFocusTitleInputRef = () => setFocusedInput("titleInputRef");
    const handleBlurTitleInputRef = () => setFocusedInput("");

    const handleFocusYearInputRef = () => setFocusedInput("yearInputRef");
    const handleBlurYearInputRef = () => setFocusedInput("");

    const handleFocusMaterialsInputRef = () =>
      setFocusedInput("materialsInputRef");
    const handleBlurMaterialsInputRef = () => setFocusedInput("");

    const handleFocusHeightInputRef = () => setFocusedInput("heightInputRef");
    const handleBlurHeightInputRef = () => setFocusedInput("");

    const handleFocusWidthInputRef = () => setFocusedInput("widthInputRef");
    const handleBlurWidthInputRef = () => setFocusedInput("");

    const handleFocusDepthInputRef = () => setFocusedInput("depthInputRef");
    const handleBlurDepthInputRef = () => setFocusedInput("");

    const handleFocusPricePaidInputRef = () =>
      setFocusedInput("pricePaidInputRef");
    const handleBlurPricePaidInputRef = () => setFocusedInput("");

    const handleFocusProvenanceInputRef = () =>
      setFocusedInput("provenanceInputRef");
    const handleBlurProvenanceInputRef = () => setFocusedInput("");

    const handleFocusCityInputRef = () => setFocusedInput("cityInputRef");
    const handleBlurCityInputRef = () => setFocusedInput("");

    const handleFocusNotesRef = () => setFocusedInput("notesRef");
    const handleBlurNotesRef = () => setFocusedInput("");

    const inputRefs = [
      {
        ref: titleInputRef,
        focus: handleFocusTitleInputRef,
        blur: handleBlurTitleInputRef,
      },
      {
        ref: artistInputRef,
        focus: handleFocusArtistInputRef,
        blur: handleBlurArtistInputRef,
      },
      {
        ref: yearInputRef,
        focus: handleFocusYearInputRef,
        blur: handleBlurYearInputRef,
      },
      {
        ref: materialsInputRef,
        focus: handleFocusMaterialsInputRef,
        blur: handleBlurMaterialsInputRef,
      },

      {
        ref: heightInputRef,
        focus: handleFocusHeightInputRef,
        blur: handleBlurHeightInputRef,
      },
      {
        ref: widthInputRef,
        focus: handleFocusWidthInputRef,
        blur: handleBlurWidthInputRef,
      },
      {
        ref: depthInputRef,
        focus: handleFocusDepthInputRef,
        blur: handleBlurDepthInputRef,
      },
      {
        ref: pricePaidInputRef,
        focus: handleFocusPricePaidInputRef,
        blur: handleBlurPricePaidInputRef,
      },
      {
        ref: provenanceInputRef,
        focus: handleFocusProvenanceInputRef,
        blur: handleBlurProvenanceInputRef,
      },
      {
        ref: cityInputRef,
        focus: handleFocusCityInputRef,
        blur: handleBlurCityInputRef,
      },
      {
        ref: notesRef,
        focus: handleFocusNotesRef,
        blur: handleBlurNotesRef,
      },
    ];

    inputRefs.forEach(({ ref, focus, blur }) => {
      // skip adding event listeners if ref is artistInputRef and artistSelected is true
      if (ref === artistInputRef && artistSelected) return;

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
  }, [artistSelected]);

  // dimension settings
  const [dimensionIn, setDimensionIn] = useState(true);
  const [dimensionCm, setDimensionCm] = useState(false);
  const [activeDimension, setActiveDimension] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(null);

  // uploaded photos from file input
  const [uploadedPhotosBase64Version, setUploadedPhotosBase64Version] =
    useState(null);

  function handleDataFromFileInputUploadedPhotosBase64Version(data) {
    setUploadedPhotosBase64Version(data);
  }

  useEffect(() => {
    handleFormData(formData);
  }, [formData]);
  useEffect(() => {
    handleUploadImages(uploadedPhotosBase64Version);
  }, [uploadedPhotosBase64Version]);

  useEffect(() => {
    if (artworkSelected || artistSelected || searchArtistQuery) {
      setFormData({
        ...formData,
        materials: artworkSelected?.aboutTheWork?.materials
          ? artworkSelected.aboutTheWork?.materials
          : "",
        title: artworkSelected?.title ? artworkSelected.title : "",
        year: artworkSelected?.year ? artworkSelected.year : "",
        medium: artworkSelected?.aboutTheWork?.medium
          ? artworkSelected.aboutTheWork.medium
          : "",
        artistId: artistSelected?._id,
        artistName: artistSelected?.name,
      });
    }
  }, [artworkSelected, artistSelected, searchArtistQuery]);

  useEffect(() => {
    if (collectionToEdit) {
      setActiveCurrency(collectionToEdit.pricePaid.currency);
      setActiveDimension(
        collectionToEdit.dimensions.in
          ? "in"
          : collectionToEdit.dimensions.cm
          ? "cm"
          : ""
      );
      setFormData({
        ...formData,
        artistId: collectionToEdit.artist,
        artistName: collectionToEdit.artistName,
        city: collectionToEdit.city,
        materials: collectionToEdit.materials,
        medium: collectionToEdit.medium,
        notes: collectionToEdit.notes,
        provenance: collectionToEdit.provenance,
        rarity: collectionToEdit.rarity,
        shareWithGalleries: collectionToEdit.shareWithGalleries,
        title: collectionToEdit.title,
        year: collectionToEdit.year,
        dimensions: collectionToEdit.dimensions,
        pricePaid: collectionToEdit.pricePaid,
        uploadedPhotos: collectionToEdit.uploadedPhotos,
      });
    }
  }, [collectionToEdit]);

  // image to delete
  const [uploadedPhotosToEdit, setUploadedPhotosToEdit] = useState(null);
  useEffect(() => {
    if (collectionToEdit?.uploadedPhotos?.length) {
      setUploadedPhotosToEdit(collectionToEdit?.uploadedPhotos);
    }
  }, [collectionToEdit?.uploadedPhotos]);

  const updatedArtworkOnEditImages = (index) => {
    const shallowCopy = [...uploadedPhotosToEdit];
    shallowCopy.splice(index, 1);
    setUploadedPhotosToEdit(shallowCopy);
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedPhotos: shallowCopy,
    }));
  };

  "form data:", formData;

  return (
    <div
      style={{
        padding,
      }}
      className="new-artwork-form-wrapper"
    >
      <div className="new-artwork-form first-section">
        {!artistSelected && !isEditModeOnForm && (
          <div
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            <SearchArtistInput
              setQueryToParent={handleReceiveQuerySearchArtistInput}
              withLabel={true}
              searchInputWithLabelClassName={
                formData.artist || formData.artistName
                  ? `styled-input-label filled-input-label unica-regular-font`
                  : `styled-input-label unica-regular-font`
              }
              searchArtistInputPlaceHolder={
                focusedInput === "artistInputRef"
                  ? "Enter full name"
                  : artistSelected?.name
              }
              searchInputRef={artistInputRef}
              searchInputWithLabelHtmlFor={"Artist"}
              searchInputWithLabelText={"Artist"}
              onQueryUpdate={handleOnQueryUpdate}
              onArtistsUpdate={handleArtistsUpdate}
            />
            <div
              className="unica-regular-font"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                backgroundColor: "white",
                maxHeight: "308px",
                overflowY: "auto",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                zIndex: 2,
                marginTop: "8px",
              }}
            >
              {artists?.length > 0 && (
                <>
                  {artists.map((eachArtist, index) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            handleArtistSelect(eachArtist);
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
                              <div
                                style={{
                                  maxWidth: "50px",
                                  maxHeight: "50px",
                                }}
                              >
                                <ArtistProfileImage
                                  artistInfo={eachArtist}
                                  width={"50px"}
                                  height={"50px"}
                                />
                              </div>
                            </div>
                            <div>
                              <div>{eachArtist?.name}</div>
                              <div
                                style={{
                                  color: "rgb(112,112,112)",
                                }}
                              >
                                {/* test start to check */}
                                {eachArtist?.nationality &&
                                eachArtist?.born &&
                                eachArtist?.died ? (
                                  <div className="artist-info">
                                    <span>{eachArtist?.nationality}, </span>
                                    <span>{eachArtist?.born}-</span>
                                    <span>{eachArtist?.died}</span>
                                  </div>
                                ) : eachArtist?.nationality &&
                                  eachArtist?.born &&
                                  !eachArtist?.died ? (
                                  <div className="artist-info">
                                    <span>{eachArtist?.nationality}, </span>
                                    <span>b. {eachArtist?.born}</span>
                                  </div>
                                ) : null}
                                {/* test finish to check */}
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
            <div className="required-info unica-regular-font">*Required</div>
            <div className="box-30-px-m-top"></div>
          </div>
        )}
        <div
          style={{
            position: "relative",
          }}
        >
          <Input
            inputRef={titleInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "titleInputRef" ? "Title" : formData?.title
            }
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"100%"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"title"}
            value={formData.title}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.title
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Title"}
            labelText={"Title"}
          />

          <div className="required-info unica-regular-font">*Required</div>
        </div>
        {width <= 768 && <div className="box-30-px-m-top"></div>}
        <div
          style={{
            maxHeight: "50px",
            height: "100%",
            position: "relative",
            marginTop:
              !artistSelected && !isEditModeOnForm && width > 768
                ? "20px"
                : "0px",
          }}
        >
          <label
            htmlFor="Medium"
            className={
              selectOnClick
                ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                : formData.medium
                ? "selected-active-select-input styled-input-label unica-regular-font"
                : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
            }
          >
            Medium
          </label>
          <select
            className="pointer select-input-new-artwork-form"
            ref={selectRef}
            name="medium"
            value={formData.medium}
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
            onFocus={() => setSelectMediumBorder("1px solid rgb(16, 35, 215)")}
            onBlur={() => setSelectMediumBorder("1px solid rgb(194, 194, 194)")}
          >
            <>
              <option value="" diabled selected hidden></option>
              {/* <option value="Select">Select</option> */}
              <option value="Painting">Painting</option>
              <option value="Sculpture">Sculpture</option>
              <option value="Photography">Photography</option>
              <option value="Print">Print</option>
              <option value="Drawing, Collage or other Work on Paper">
                Drawing, Collage or other Work on Paper
              </option>
              <option value="Mixed Media">Mixed Media</option>
              <option value="Performance Art">Performance Art</option>
              <option value="Installation">Installation</option>
              <option value="Video/Film/Animation">Video/Film/Animation</option>
              <option value="Architecture">Architecture</option>
              <option value="Fashion Design and Wearable Art">
                Fashion Design and Wearable Art
              </option>
              <option value="Jewelry">Jewelry</option>
              <option value="Design/Decorative Art">
                Design/Decorative Art
              </option>
              <option value="Textile Arts">Textile Arts</option>
              <option value="Posters">Posters</option>
              <option value="Books and Portfolios">Books and Portfolios</option>
              <option value="Ephemera or Merchandise">
                Ephemera or Merchandise
              </option>
              <option value="Reproduction">Reproduction</option>
              <option value="NFT">NFT</option>
              <option value="Other">Other</option>
            </>
          </select>
          <div className="required-info unica-regular-font">*Required</div>
        </div>
        <div
          style={{
            marginTop:
              artistSelected || width <= 768
                ? "50px"
                : isEditModeOnForm
                ? "50px"
                : "20px",
          }}
        >
          <Input
            inputRef={yearInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "yearInputRef" ? "YYYY" : formData?.year
            }
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"100%"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"year"}
            value={formData.year}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.year
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Year"}
            labelText={"Year"}
          />{" "}
        </div>
        <div
          style={{
            marginTop: "50px",
          }}
        >
          <Input
            inputRef={materialsInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "materialsInputRef"
                ? "Oil on Canvas, Mixed Media, Lithograph..."
                : formData?.materials
            }
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"100%"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"materials"}
            value={formData.materials}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.materials
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Materials"}
            labelText={"Materials"}
          />{" "}
        </div>
      </div>
      <div className="box-40-px-m-top"></div>
      <div className="new-artwork-form second-section">
        <div>
          <div className="unica-regular-font what-is-this ">
            {" "}
            <span>What is this?</span>
          </div>
          <div
            style={{
              position: "relative",
              maxHeight: "50px",
              height: "100dvh",
            }}
          >
            <label
              htmlFor="Rarity"
              className={
                rarityOnClick
                  ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                  : formData.rarity
                  ? "selected-active-select-input styled-input-label unica-regular-font"
                  : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
              }
            >
              Rarity
            </label>
            <select
              className="pointer select-input-new-artwork-form"
              ref={rarityRef}
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              style={{
                width: "100%",
                maxWidth: "100%",
                border: selectRarityBorder,
                transition: "border 0.25s ease",
                height: "100%",
                maxHeight: "inherit",
                fontSize: "16px",
                lineHeight: "26px",
                borderRadius: "3px",
                outline: "none",
                padding: "0px 5px",
              }}
              onFocus={() =>
                setSelectRarityBorder("1px solid rgb(16, 35, 215)")
              }
              onBlur={() =>
                setSelectRarityBorder("1px solid rgb(194, 194, 194)")
              }
            >
              <>
                {" "}
                <option value="" diabled selected hidden></option>
                {/* <option value="Painting">Select a Classification</option> */}
                <option value="Unique">Unique</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="Open Edition">Open Edition</option>
                <option value="Unknown Edition">Unknown Edition</option>
              </>
            </select>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "40px",
        }}
        className="new-artwork-form third-section"
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              flexBasis: "50%",
            }}
          >
            <Input
              inputRef={heightInputRef}
              className={"styled-input-with-label"}
              placeholder={
                focusedInput === "heightInputRef"
                  ? "Height"
                  : formData?.dimensions.height
              }
              inputType={"number"}
              width={"inherit"}
              wrapperWidth={"100%"}
              maxWidth={"100%"}
              minWidth={"fit-content"}
              maxHeight={"40px"}
              wrapperHeight={"100%"}
              wrapperMaxHeight={"50px"}
              height={"100dvh"}
              borderRadius={"3px"}
              name={"height"}
              value={formData.dimensions.height}
              onChange={handleChange}
              withLabel={true}
              labelClassName={
                formData?.dimensions?.height
                  ? `styled-input-label filled-input-label unica-regular-font`
                  : `styled-input-label unica-regular-font`
              }
              labelHtmlFor={"Height"}
              labelText={"Height"}
              icon={dimensionIn ? "in" : dimensionCm ? "cm" : null}
              iconAsText={true}
              iconPositionRight={true}
            />{" "}
          </div>
          <div
            style={{
              flexBasis: "50%",
            }}
          >
            <Input
              inputRef={widthInputRef}
              className={"styled-input-with-label"}
              placeholder={
                focusedInput === "widthInputRef"
                  ? "Width"
                  : formData?.dimensions.width
              }
              inputType={"number"}
              width={"inherit"}
              wrapperWidth={"100%"}
              maxWidth={"100%"}
              minWidth={"fit-content"}
              maxHeight={"40px"}
              wrapperHeight={"100%"}
              wrapperMaxHeight={"50px"}
              height={"100dvh"}
              borderRadius={"3px"}
              name={"width"}
              value={formData.dimensions.width}
              onChange={handleChange}
              withLabel={true}
              labelClassName={
                formData?.dimensions?.width
                  ? `styled-input-label filled-input-label unica-regular-font`
                  : `styled-input-label unica-regular-font`
              }
              labelHtmlFor={"Width"}
              labelText={"Width"}
              icon={dimensionIn ? "in" : dimensionCm ? "cm" : null}
              iconAsText={true}
              iconPositionRight={true}
            />{" "}
          </div>
        </div>
        {width <= 768 && <div className="box-30-px-m-top"></div>}
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              flexBasis: "50%",
            }}
          >
            <Input
              inputRef={depthInputRef}
              className={"styled-input-with-label"}
              placeholder={
                focusedInput === "depthInputRef"
                  ? "Depth"
                  : formData?.dimensions.depth
              }
              inputType={"number"}
              width={"inherit"}
              wrapperWidth={"100%"}
              maxWidth={"100%"}
              minWidth={"fit-content"}
              maxHeight={"40px"}
              wrapperHeight={"100%"}
              wrapperMaxHeight={"50px"}
              height={"100dvh"}
              borderRadius={"3px"}
              name={"depth"}
              value={formData.dimensions.depth}
              onChange={handleChange}
              withLabel={true}
              labelClassName={
                formData?.dimensions?.depth
                  ? `styled-input-label filled-input-label unica-regular-font`
                  : `styled-input-label unica-regular-font`
              }
              labelHtmlFor={"Depth"}
              labelText={"Depth"}
              icon={dimensionIn ? "in" : dimensionCm ? "cm" : null}
              iconAsText={true}
              iconPositionRight={true}
            />{" "}
          </div>
          <div
            className="dflex unica-regular-font"
            style={{
              flexBasis: "50%",
              gap: "20px",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              className={activeDimension === "in" && "active-dimension-in"}
              onClick={() => {
                setDimensionIn(true);
                setDimensionCm(false);
                setActiveDimension("in");
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  dimensions: {
                    ...prevFormData.dimensions,
                    in: true,
                    cm: false,
                  },
                }));
              }}
            >
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  alignSelf: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition:
                      "background-color 0.25s ease 0s, border-color 0.25s ease 0s, color 0.25s ease 0s;",
                    border:
                      activeDimension === "in"
                        ? "1px solid rgb(0,0,0)"
                        : "1px solid rgb(194, 194, 194)",
                    backgroundColor: activeDimension === "in" && "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeDimension === "in" && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
              <div
                className="hover_color_effect hover_color_effect_t-d"
                style={{
                  alignSelf: "center",
                  color: activeDimension !== "in" && "rgb(112, 112, 112)",
                }}
              >
                in
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              className={activeDimension === "cm" && "active-dimension-cm"}
              onClick={() => {
                setDimensionIn(false);
                setDimensionCm(true);
                setActiveDimension("cm");
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  dimensions: {
                    ...prevFormData.dimensions,
                    in: false,
                    cm: true,
                  },
                }));
              }}
            >
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  alignSelf: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition:
                      "background-color 0.25s ease 0s, border-color 0.25s ease 0s, color 0.25s ease 0s;",
                    border:
                      activeDimension === "cm"
                        ? "1px solid rgb(0,0,0)"
                        : "1px solid rgb(194, 194, 194)",
                    backgroundColor: activeDimension === "cm" && "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeDimension === "cm" && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
              <div
                className="hover_color_effect hover_color_effect_t-d"
                style={{
                  alignSelf: "center",
                  color: activeDimension !== "cm" && "rgb(112,112,112)",
                }}
              >
                cm
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: width <= 768 ? "30px" : "20px",
        }}
        className="new-artwork-form fourth-section"
      >
        <div>
          <Input
            inputRef={pricePaidInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "pricePaidInputRef"
                ? "Price Paid"
                : formData?.pricePaid.amount
            }
            inputType={"number"}
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"100%"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"amount"}
            value={formData.pricePaid.amount}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.pricePaid.amount
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Price Paid"}
            labelText={"Price Paid"}
            icon={activeCurrency}
            iconAsText={true}
            iconPositionRight={true}
          />{" "}
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: width <= 768 && "30px",
          }}
        >
          <div
            className="dflex unica-regular-font"
            style={{
              gap: "50px",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              className={activeCurrency === "USD" && "active-currency-USD"}
              onClick={() => {
                setActiveCurrency("USD");
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  pricePaid: {
                    ...prevFormData.pricePaid,
                    currency: "USD",
                  },
                }));
              }}
            >
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  alignSelf: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition:
                      "background-color 0.25s ease 0s, border-color 0.25s ease 0s, color 0.25s ease 0s;",
                    border:
                      activeCurrency === "USD"
                        ? "1px solid rgb(0,0,0)"
                        : "1px solid rgb(194, 194, 194)",
                    backgroundColor: activeCurrency === "USD" && "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeCurrency === "USD" && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
              <div
                className="hover_color_effect hover_color_effect_t-d"
                style={{
                  alignSelf: "center",
                  color: activeCurrency !== "USD" && "rgb(112,112,112)",
                }}
              >
                $ USD
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              className={activeCurrency === "EUR" && "active-currency-EUR"}
              onClick={() => {
                setActiveCurrency("EUR");
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  pricePaid: {
                    ...prevFormData.pricePaid,
                    currency: "EUR",
                  },
                }));
              }}
            >
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  alignSelf: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition:
                      "background-color 0.25s ease 0s, border-color 0.25s ease 0s, color 0.25s ease 0s;",
                    border:
                      activeCurrency === "EUR"
                        ? "1px solid rgb(0,0,0)"
                        : "1px solid rgb(194, 194, 194)",
                    backgroundColor: activeCurrency === "EUR" && "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeCurrency === "EUR" && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
              <div
                className="hover_color_effect hover_color_effect_t-d"
                style={{
                  alignSelf: "center",
                  color: activeCurrency !== "EUR" && "rgb(112,112,112)",
                }}
              >
                € EUR
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              className={activeCurrency === "GBP" && "active-currency-GBP"}
              onClick={() => {
                setActiveCurrency("GBP");
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  pricePaid: {
                    ...prevFormData.pricePaid,
                    currency: "GBP",
                  },
                }));
              }}
            >
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  alignSelf: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition:
                      "background-color 0.25s ease 0s, border-color 0.25s ease 0s, color 0.25s ease 0s;",
                    border:
                      activeCurrency === "GBP"
                        ? "1px solid rgb(0,0,0)"
                        : "1px solid rgb(194, 194, 194)",
                    backgroundColor: activeCurrency === "GBP" && "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeCurrency === "GBP" && (
                    <div className="radio-dot"></div>
                  )}
                </div>
              </div>
              <div
                className="hover_color_effect hover_color_effect_t-d"
                style={{
                  alignSelf: "center",
                  color: activeCurrency !== "GBP" && "rgb(112,112,112)",
                }}
              >
                £ GBP
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: width <= 768 ? "50px" : "30px",
        }}
        className="new-artwork-form fifth-section"
      >
        <div>
          <div className="unica-regular-font what-is-this ">
            <span>What is this?</span>
          </div>
          <Input
            inputRef={provenanceInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "provenanceInputRef"
                ? "Describe how you acquired the work"
                : formData?.provenance
            }
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"100%"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"provenance"}
            value={formData.provenance}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.provenance
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"Provenance"}
            labelText={"Provenance"}
          />
        </div>
        <div
          style={{
            maxWidth: "213.5px",
            marginTop: width <= 768 && "30px",
          }}
        >
          <div
            style={{
              visibility: "hidden",
            }}
            className="unica-regular-font what-is-this"
          >
            a
          </div>
          <Input
            inputRef={cityInputRef}
            className={"styled-input-with-label"}
            placeholder={
              focusedInput === "cityInputRef"
                ? "Enter city where artwork is located"
                : formData?.city
            }
            width={"inherit"}
            wrapperWidth={"100%"}
            maxWidth={"213.5px"}
            minWidth={"fit-content"}
            maxHeight={"40px"}
            wrapperHeight={"100%"}
            wrapperMaxHeight={"50px"}
            height={"100dvh"}
            borderRadius={"3px"}
            name={"city"}
            value={formData.city}
            onChange={handleChange}
            withLabel={true}
            labelClassName={
              formData?.city
                ? `styled-input-label filled-input-label unica-regular-font`
                : `styled-input-label unica-regular-font`
            }
            labelHtmlFor={"City"}
            labelText={"City"}
            icon={
              <svg
                className="dflex"
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="rgb(112, 112, 112)"
              >
                <path d="M11.5001 3.00003C11.9597 3.00003 12.4148 3.09056 12.8395 3.26645C13.2641 3.44234 13.6499 3.70015 13.9749 4.02515C14.2999 4.35016 14.5577 4.736 14.7336 5.16063C14.9095 5.58527 15.0001 6.0404 15.0001 6.50003C15.0001 6.95965 14.9095 7.41478 14.7336 7.83942C14.5577 8.26406 14.2999 8.6499 13.9749 8.9749C13.6499 9.29991 13.2641 9.55771 12.8395 9.73361C12.4148 9.9095 11.9597 10 11.5001 10C10.5718 10 9.68156 9.63128 9.02519 8.9749C8.36881 8.31852 8.00006 7.42828 8.00006 6.50003C8.00006 5.57177 8.36881 4.68153 9.02519 4.02515C9.68156 3.36878 10.5718 3.00003 11.5001 3.00003ZM11.5001 2.00003C10.61 2.00003 9.74002 2.26395 8.99999 2.75841C8.25997 3.25288 7.6832 3.95568 7.3426 4.77795C7.00201 5.60022 6.91289 6.50502 7.08653 7.37793C7.26016 8.25085 7.68874 9.05267 8.31808 9.68201C8.94742 10.3113 9.74924 10.7399 10.6222 10.9136C11.4951 11.0872 12.3999 10.9981 13.2221 10.6575C14.0444 10.3169 14.7472 9.74011 15.2417 9.00009C15.7361 8.26007 16.0001 7.39004 16.0001 6.50003C16.0014 5.90871 15.8859 5.32295 15.6602 4.77639C15.4345 4.22983 15.1031 3.73323 14.685 3.31511C14.2669 2.89698 13.7703 2.56556 13.2237 2.33988C12.6771 2.1142 12.0914 1.99871 11.5001 2.00003ZM9.44206 9.52503L8.56206 8.64503L2.06006 15.06L2.94006 15.94L9.44206 9.52503Z"></path>
              </svg>
            }
            iconPositionRight={true}
          />
        </div>
      </div>
      <div className="box-40-px-m-top"></div>
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "fit-content",
          borderRadius: "3px",
          position: "relative",
        }}
      >
        <label
          htmlFor="Notes"
          className={
            (textAreaOnClick || formData.notes) && onFocusNotes
              ? "text-area-label-on-focus text-area-label-style unica-regular-font"
              : formData.notes && !onFocusNotes
              ? "text-area-label-on-focus text-area-label-style unica-regular-font color-change"
              : "text-area-label-style unica-regular-font"
          }
        >
          Notes
        </label>{" "}
        <textarea
          ref={textAreaRef}
          className="unica-regular-font"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          style={{
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
            setOnFocusNotes(true);
            setBorderTextArea("1px solid rgb(16, 35, 215)");
          }}
          onBlur={() => {
            setOnFocusNotes(false);
            setBorderTextArea("1px solid rgb(194, 194, 194)");
          }}
        />
      </div>
      {/* upload photo section */}

      <div className="box-30-px-m-top"></div>
      {uploadPhotoSection && (
        <FileInput
          doNotShowOnSmallScreens={width <= 768 ? true : false}
          sendUploadedPhotosBase64Version={
            handleDataFromFileInputUploadedPhotosBase64Version
          }
          preRenderImage={true}
          renderPreImage={artworkSelected}
          isEditArtworkPage={isEditModeOnForm}
          isEditArtworkHasImages={
            collectionToEdit?.uploadedPhotos.length && isEditModeOnForm
              ? true
              : false
          }
          artworkOnEditImages={
            collectionToEdit?.uploadedPhotos.length && isEditModeOnForm
              ? uploadedPhotosToEdit
              : false
          }
          updatedArtworkOnEditImages={updatedArtworkOnEditImages}
        />
      )}
    </div>
  );
}

export default NewArtworkForm;
