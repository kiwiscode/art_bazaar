import useWindowDimensions from "../../utils/useWindowDimensions";
import Button from "./Button";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function FileInput({
  preRenderImage,
  renderPreImage,
  sendUploadedPhotosBase64Version,
  isEditArtworkPage,
  isEditArtworkHasImages,
  artworkOnEditImages,
  updatedArtworkOnEditImages,
  doNotShowOnSmallScreens,
}) {
  const { width } = useWindowDimensions();
  const [files, setFiles] = useState([]);
  const [uploadedPhotosBase64Version, setUploadedPhotosBase64Version] =
    useState([
      {
        base64: "",
        imageId: "",
      },
    ]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState({});
  const [loaded, setLoaded] = useState([]);

  const deleteUploadedPhoto = (index) => {
    updatedArtworkOnEditImages(index);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError("");
    const validExtensions = ["image/jpeg", "image/png", "image/heic"];

    acceptedFiles.forEach((file) => {
      if (!validExtensions.includes(file.type)) {
        setError(
          "File format not supported. Please upload files with supported formats."
        );
      } else {
        const mappedFile = Object.assign(file, {
          _id: uuidv4(), // unique id for remove helper
          preview: URL.createObjectURL(file),
        });

        setFiles((prevFiles) => [...prevFiles, mappedFile]);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".png", ".heic"],
    },
    onDrop,
    maxSize: 30000000,
    noClick: true,
    noKeyboard: true,
  });

  const uploadFile = (file) => {
    const totalSize = file.size;
    const loadSpeed = totalSize / 30;
    let loadedSize = 0;

    const interval = setInterval(() => {
      loadedSize += loadSpeed;
      const progress = Math.min((loadedSize / totalSize) * 100, 100);

      setLoading((prevLoading) => ({
        ...prevLoading,
        [file._id]: progress,
      }));

      if (progress === 100) {
        clearInterval(interval);
        setLoaded((prevLoaded) => [...prevLoaded, file._id]);
      }
    }, 100);
  };

  useEffect(() => {
    files.forEach((file) => {
      if (!loaded.includes(file._id) && !loading[file._id]) {
        uploadFile(file, file._id);
      }
    });
  }, [files, loaded, loading]);

  const setFilesToBase64 = (files) => {
    files.forEach((eachFile) => {
      const reader = new FileReader();
      reader.readAsDataURL(eachFile);
      reader.onloadend = () => {
        setUploadedPhotosBase64Version((prevBase64versions) => {
          const alreadyExists = prevBase64versions.some(
            (file) => file.imageId === eachFile._id
          );
          if (!alreadyExists) {
            return [
              ...prevBase64versions,
              {
                base64: reader.result,
                imageId: eachFile._id,
              },
            ];
          }
          return prevBase64versions;
        });
      };
    });
  };

  useEffect(() => {
    if (files?.length > 0) {
      setFilesToBase64(files);
    }
  }, [files]);

  const formatImageSize = (size) => {
    // bayt cinsinden boyutu MB'ye
    const sizeInMB = size / 1_000_000;

    const sizeRounded = sizeInMB.toFixed(2);

    return `${sizeRounded} MB`;
  };

  // send data to parent
  useEffect(() => {
    sendUploadedPhotosBase64Version(uploadedPhotosBase64Version);
  }, [uploadedPhotosBase64Version]);

  return (
    <div>
      {" "}
      <div
        className="unica-regular-font"
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          marginBottom: "5px",
        }}
      >
        Upload Photos
      </div>
      <div
        {...(doNotShowOnSmallScreens ? {} : getRootProps())}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <div
          style={{
            padding: width > 768 && "40px 20px",
            marginBottom: "40px",
            border: width <= 768 ? "none" : "1px solid rgb(231,231,231)",
            boxSizing: "border-box",
          }}
          className="upload-photo-section-wrapper unica-regular-font"
        >
          <div
            style={{
              fontSize: "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
              display: width <= 768 && "none",
            }}
          >
            Drag and drop photos here
          </div>
          {width > 768 && (
            <div
              style={{
                margin: "10px 0px 0px 0px",
                color: "rgb(112,112,112)",
                fontSize: width <= 768 && "13px",
              }}
            >
              <div>Files Supported: JPG, PNG, HEIC</div>
              <div>Total maximum size: 30 MB</div>
            </div>
          )}
          <input {...getInputProps()} ref={inputRef} />
          <Button
            onClick={() => inputRef.current.click()}
            className={"unica-regular-font hover_bg_color_effect_white_text"}
            backgroundColor={"transparent"}
            margin="20px 0px 0px 0px"
            height="100dvh"
            maxHeight={"50px"}
            width={width <= 768 && "100vw"}
            maxWidth="100%"
            padding="1px 25px"
            borderRadius="25px"
            cursor="pointer"
            text={width <= 768 ? "Add Photos" : "Or Add Photos"}
            border="1px solid rgb(0,0,0)"
            textColor={"black"}
            fontSize={"16px"}
            lineHeight="26px"
          />
          {width <= 768 && (
            <div
              style={{
                margin: "10px 0px 0px 0px",
                color: "rgb(112,112,112)",
                fontSize: width <= 768 && "13px",
              }}
            >
              <div>Files Supported: JPG, PNG, HEIC</div>
              <div>Total maximum size: 30 MB</div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div
          className="unica-regular-font"
          style={{
            marginBottom: "20px",
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgb(200,36,0)",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          marginBottom: "40px",
        }}
        className="preview"
      >
        {preRenderImage && renderPreImage && (
          <div
            style={{
              padding: width <= 768 && "15px",
            }}
            className="preview-wrapper unica-regular-font"
          >
            {" "}
            <div className="preview-wrapper-grid-container">
              <div className="preview-wrapper-grid-container first-grid-flex">
                <div
                  style={{
                    height: width <= 768 ? "48px" : "120px",
                    width: width <= 768 ? "48px" : "120px",
                    minWidth: width <= 768 ? "48px" : "120px",
                    backgroundColor: "rgb(231, 231, 231)",
                  }}
                >
                  <img
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100dvh",
                      maxHeight: width <= 768 ? "48px" : "120px",
                      maxWidth: width <= 768 ? "48px" : "120px",
                    }}
                    src={renderPreImage.imageUrl}
                  />
                </div>
                <div
                  style={{ fontSize: "13px" }}
                  className="text-ellipsis-nowrap-hiddenoverflow"
                >
                  Automatically added
                </div>
              </div>
              <div
                className="preview-wrapper-grid-container second-grid-flex-auto-pic"
                style={{
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.alert("delete automatically added pic!");
                  }}
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        )}
        {files.map((file, index) => (
          <div
            style={{
              padding: width <= 768 && "15px",
            }}
            className="preview-wrapper unica-regular-font"
            key={index}
          >
            <div className="preview-wrapper-grid-container">
              <div className="preview-wrapper-grid-container first-grid-flex">
                <div
                  style={{
                    height: width <= 768 ? "48px" : "120px",
                    width: width <= 768 ? "48px" : "120px",
                    minWidth: width <= 768 ? "48px" : "120px",
                    backgroundColor: "rgb(231, 231, 231)",
                  }}
                >
                  <img
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100dvh",
                      maxHeight: width <= 768 ? "48px" : "120px",
                      maxWidth: width <= 768 ? "48px" : "120px",
                    }}
                    src={file.preview}
                    alt={`Preview image: ${file._id}`}
                  />
                </div>
                {!loaded.includes(file._id) ? (
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${loading[file._id] || 0}%` }}
                    ></div>
                  </div>
                ) : (
                  <div
                    style={{ fontSize: "13px" }}
                    className="text-ellipsis-nowrap-hiddenoverflow"
                  >
                    {file.path}
                  </div>
                )}
              </div>
              <div
                className="preview-wrapper-grid-container second-grid-flex"
                style={{
                  fontSize: "13px",
                }}
              >
                <div>{formatImageSize(file.size)}</div>
                <div
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFiles((prevFiles) =>
                      prevFiles.filter((element) => element._id !== file._id)
                    );
                    setLoaded((prevLoaded) =>
                      prevLoaded.filter((element) => element !== file._id)
                    );
                    setUploadedPhotosBase64Version((prevBase64versions) =>
                      prevBase64versions.filter(
                        (element) => element.imageId !== file._id
                      )
                    );
                    //
                  }}
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* on edit page uploaded photos */}
        {isEditArtworkHasImages &&
        isEditArtworkPage &&
        artworkOnEditImages?.length ? (
          <>
            {artworkOnEditImages.map((imageUrl, index) => (
              <div
                style={{
                  padding: width <= 768 && "15px",
                }}
                className="preview-wrapper unica-regular-font"
                key={index}
              >
                <div className="preview-wrapper-grid-container">
                  <div className="preview-wrapper-grid-container first-grid-flex">
                    <div
                      style={{
                        height: width <= 768 ? "48px" : "120px",
                        width: width <= 768 ? "48px" : "120px",
                        minWidth: width <= 768 ? "48px" : "120px",
                        backgroundColor: "rgb(231, 231, 231)",
                      }}
                    >
                      <img
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100dvh",
                          maxHeight: width <= 768 ? "48px" : "120px",
                          maxWidth: width <= 768 ? "48px" : "120px",
                        }}
                        src={imageUrl}
                        alt={`Preview image: ${index}`}
                      />
                    </div>
                  </div>
                  <div
                    className="preview-wrapper-grid-container second-grid-flex-on-edit-page"
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    <div
                      onClick={() => deleteUploadedPhoto(index)}
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default FileInput;
