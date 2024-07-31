import { useContext, useEffect, useRef, useState } from "react";
import useWindowDimensions from "../../utils/useWindowDimensions";
import axios from "axios";
import { CollectorContext } from "../components/CollectorContext";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import NewArtworkForm from "../components/NewArtworkForm";
import ArtistProfileImage from "../components/ArtistProfileImage";
import Modal from "@mui/material/Modal";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function EditArtwork() {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { collectedArtworkId } = useParams();
  const [collection, setCollection] = useState([]);
  const [collectedArtwork, setCollectedArtwork] = useState(null);
  const [collectedArtist, setCollectedArtist] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // upload artwork
  const [formData, setFormData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(null);

  const handleFormData = (formData) => {
    setFormData(formData);
  };
  const handleUploadImages = (uploadedImages) => {
    setUploadedImages(uploadedImages);
  };

  console.log("collected artwork:", collectedArtwork);
  console.log("upload images:", uploadedImages);
  console.log("form data:", formData);

  // upload artwork
  const [saveOn, setSaveOn] = useState(false);
  const saveChanges = async () => {
    setSaveOn(true);
    try {
      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo?._id}/collections/${collection?._id}/${collectedArtworkId}/edit`,
        {
          formData,
          uploadedImages: uploadedImages ? uploadedImages : null,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("result after edit:", result);
      if (result.status === 200) {
        navigate(
          `/collector-profile/my-collection/artwork/${collectedArtworkId}`
        );
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  const deleteCollectedArtwork = async () => {
    setDeleting(true);
    try {
      const result = await axios.delete(
        `${API_URL}/collectors/${collectorInfo?._id}/collections/${collection?._id}/${collectedArtworkId}/delete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (result.status === 200) {
        setTimeout(() => {
          navigate("/collector-profile/my-collection");
        }, 500);
        setTimeout(() => {
          setDeleting(false);
        }, 1000);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const getCollectedArtwork = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/my-collection/artwork/${collectedArtworkId}`
      );

      if (result.status === 200) {
        setCollection(result.data.collection);
        setCollectedArtwork(result.data.artwork);
        setCollectedArtist(result.data.collection.artist);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectedArtworkId) {
      getCollectedArtwork();
    }
  }, [collectedArtworkId]);

  const closeDeleteModal = () => {
    if (!deleting && !saveOn) {
      setDeleteModal(false);
    }
  };

  return (
    <>
      {/* delete modal start to check*/}
      <>
        <>
          {/* leave modal */}
          <Modal
            open={deleteModal}
            onClose={closeDeleteModal}
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
              className="unica-regular-font"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: width <= 768 ? "85%" : 560,
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
                padding: width <= 768 && "0px 20px",
              }}
            >
              <div className="box-10-px-m-top"></div>
              {/* header */}
              <div
                className="unica-regular-font"
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  height: "58px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    lineHeight: "32px",
                    letterSpacing: "-0.01em",
                    padding: width > 768 && "0px 20px",
                  }}
                >
                  Delete this artwork?
                </div>
                <button
                  onClick={closeDeleteModal}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "58px",
                    height: "58px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: deleting ? "default" : "pointer",
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
              </div>
              <div
                style={{
                  padding: width > 768 && "0px 20px",
                }}
              >
                This artwork will be removed from My Collection.
              </div>
              <div
                style={{
                  padding: width > 768 && "0px 20px",
                }}
              >
                <div className="box-40-px-m-top"></div>
                <Button
                  onClick={() => {
                    deleteCollectedArtwork();
                  }}
                  className="unica-regular-font hover_bg_color_effect_white_text"
                  backgroundColor="rgb(0,0,0)"
                  height="100dvh"
                  width="100vw"
                  maxHeight="50px"
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text="Delete Artwork"
                  border="none"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="26px"
                  loadingScenario={deleting}
                  strokeColorLoadingSpinner={!deleting}
                  opacity={deleting ? "0.3" : "1"}
                  pointerEvents={deleting ? "none" : "auto"}
                />
                <div className="box-10-px-m-top"></div>
                <Button
                  onClick={closeDeleteModal}
                  className="unica-regular-font hover_bg_color_effect_white_text"
                  backgroundColor="white"
                  height="100dvh"
                  width="100vw"
                  maxHeight="50px"
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text="Keep Artwork"
                  border="1px solid rgb(0,0,0)"
                  textColor="black"
                  fontSize="16px"
                  lineHeight="26px"
                  pointerEvents={deleting ? "none" : "auto"}
                />
                <div className="box-20-px-m-top"></div>
              </div>
            </div>
          </Modal>
        </>
      </>
      {/* delete modal finish to check */}

      {/* absolute position save changes btn */}
      <>
        {width <= 768 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              zIndex: 2,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
              padding: "10px 0px",
            }}
          >
            <Button
              className={
                "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
              }
              backgroundColor={"black"}
              height="100dvh"
              width={"95%"}
              textColor={"white"}
              fontSize={width <= 768 ? "15px" : "16px"}
              maxHeight={"50px"}
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="25px"
              cursor="pointer"
              text={"Save Changes"}
              border="1px solid rgb(0,0,0)"
              lineHeight="26px"
              opacity={saveOn ? "0.3" : "1"}
              pointerEvents={saveOn ? "none" : "auto"}
              loadingScenario={saveOn}
              strokeColorLoadingSpinner={!saveOn}
              onClick={saveChanges}
            />
          </div>
        )}
      </>
      {/* <div className="box-40-px-m-top"></div> */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <div
          className="unica-regular-font"
          style={{
            padding: width <= 768 ? "10px 20px" : "10px 40px",
          }}
        >
          {width > 768 && <div>Logo</div>}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
            className=""
          >
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="hover_color_effect_t-d hover_color_effect pointer"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "20px 0px",
                }}
              >
                <svg
                  width={18}
                  height={14}
                  viewBox="0 0 18 18"
                  color="rgb(0,0,0)"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
                  ></path>
                </svg>
              </div>
              <div
                className=""
                style={{
                  textDecoration: "underline",
                  fontSize: "16px",
                  lineHeight: "26px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Back
              </div>
            </div>
            {width > 768 && (
              <div
                style={{
                  maxWidth: "300px",
                  maxHeight: "50px",
                  width: width > 768 && "100%",
                  marginRight: "20px",
                }}
              >
                <Button
                  className={
                    "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                  }
                  backgroundColor={"black"}
                  height="100dvh"
                  width={width <= 768 ? "100px" : "100vw"}
                  textColor={"white"}
                  fontSize={width <= 768 ? "13px" : "16px"}
                  maxHeight={width <= 768 ? "30px" : "50px"}
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text={"Save Changes"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  opacity={saveOn ? "0.3" : "1"}
                  pointerEvents={saveOn ? "none" : "auto"}
                  loadingScenario={saveOn}
                  strokeColorLoadingSpinner={!saveOn}
                  onClick={saveChanges}
                />
              </div>
            )}
          </div>
        </div>
        <div className="box-20-px-m-top"></div>
        <div
          style={{
            borderBottom: "1px solid rgb(231,231,231)",
          }}
        ></div>
      </div>

      <>
        {" "}
        <div
          className="unica-regular-font"
          style={{
            padding: width <= 768 ? "0px 20px" : "0px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div className="box-40-px-m-top"></div>
          <div
            style={{
              fontSize: width <= 768 ? "20px" : "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
            }}
          >
            Edit Artwork Details
          </div>
          <div className="box-10-px-m-top"></div>

          <>
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      maxWidth: "45px",
                      maxHeight: "45px",
                      borderRadius: "50%",
                    }}
                  >
                    <ArtistProfileImage
                      borderRadius={"50%"}
                      artistInfo={collectedArtist ? collectedArtist : ""}
                      width={"45px"}
                      height={"45px"}
                    />
                  </div>
                </div>
                <div>
                  <div>{collectedArtist?.name}</div>
                  <div
                    style={{
                      color: "rgb(112,112,112)",
                      fontSize: "13px",
                      lineHeight: "20px",
                    }}
                  >
                    {collectedArtist?.nationality}, {collectedArtist?.born}-
                    {collectedArtist?.died}
                  </div>
                </div>
              </div>
            </div>
          </>

          <div className="box-20-px-m-top"></div>
        </div>
        {/* artwork form */}
        <div>
          <NewArtworkForm
            handleFormData={handleFormData}
            handleUploadImages={handleUploadImages}
            padding={width <= 768 ? "0px 20px" : "0px 40px"}
            uploadPhotoSection={true}
            isEditModeOnForm={true}
            collectionToEdit={collectedArtwork}
          />
        </div>
        <div
          onClick={() => setDeleteModal(true)}
          className="unica-regular-font pointer"
          style={{
            padding: width > 768 && "0px 40px",
            textAlign: width <= 768 && "center",
            textDecoration: "underline",
            paddingBottom: "60px",
            color: "rgb(200, 36, 0)",
            pointerEvents: saveOn || deleting ? "none" : "auto",
            marginBottom: width <= 768 ? "100px" : "60px",
          }}
        >
          Delete Artwork
        </div>
      </>
    </>
  );
}

export default EditArtwork;
