import React, { useState, useCallback, useEffect, useRef } from "react";
import { Camera as CameraIcon, SwitchCamera, Upload, XCircle } from "lucide-react";
import Cropper from "react-easy-crop";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import getCroppedImg from "./getCroppedImg";
import Modal from "../modalComponent/Modal";

// Helper to convert Base64 to File remains the same
const dataURLtoFile = (dataurl, filename) => {
    if (!dataurl || typeof dataurl !== 'string' || !dataurl.includes(',')) {
        console.error("Invalid data URL provided to dataURLtoFile:", dataurl);
        return null;
    }
    try {
        let arr = dataurl.split(','),
            mimeMatch = arr[0].match(/:(.*?);/);
        let mime = 'image/jpeg';
        if (mimeMatch && mimeMatch[1]) {
            mime = mimeMatch[1];
        } else {
            if (arr[0].includes('/png')) mime = 'image/png';
            else if (arr[0].includes('/webp')) mime = 'image/webp';
        }
        const bstr = atob(arr[arr.length - 1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    } catch (e) {
        console.error("Error converting data URL to File:", e);
        return null;
    }
};


function ImageCaptureCrop({
    onImageCropped,
    initialImageUrl = null,
    aspectRatio = 1,
    outputFilenamePrefix = "cropped_image",
    label,
    previewSize = 90,
    respclass = "",
    
}) {
    // All state and logic hooks remain the same
    const [showWebcamModal, setShowWebcamModal] = useState(false);
    const [imageForCropper, setImageForCropper] = useState(null);
    const [currentImagePreview, setCurrentImagePreview] = useState(initialImageUrl);
    const [isCropping, setIsCropping] = useState(false);
    const [isFileReading, setIsFileReading] = useState(false);
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState("user");
    const fileInputRef = useRef(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [modalData, setModalData] = useState({
        visible: false,
        component: null,
        size: null,
        Header: null,
        setVisible: false,
        prescription: null,
    });
    // All useEffect and callback hooks remain the same
    useEffect(() => {
        if (initialImageUrl !== currentImagePreview && !(currentImagePreview && currentImagePreview.startsWith('blob:'))) {
            setCurrentImagePreview(initialImageUrl);
        }
    }, [initialImageUrl, currentImagePreview]);

    useEffect(() => {
        const previewUrl = currentImagePreview;
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [currentImagePreview]);

    const openWebcam = useCallback(() => {
        setShowWebcamModal(true);
        setImageForCropper(null);
        setIsFileReading(false);
        setModalData({
            visible: true,
            Header: "Capture Photo",
            footer: null,
            size: "30vw",
            setVisible: () => {
                setModalData((val) => ({ ...val, visible: false }));
            },
        });
    }, []);
    const closeWebcamModal = useCallback(() => { setShowWebcamModal(false); }, []);

    const capturePhoto = useCallback(() => {
        if (!webcamRef.current) {
            toast.error("Webcam not ready.");
            return;
        }
        const imageSrc = webcamRef.current.getScreenshot({ type: 'image/png' });
        if (imageSrc) {
            setShowWebcamModal(false);
            setImageForCropper(imageSrc);
        } else {
            toast.error("Could not capture photo. Check camera permissions.");
            closeWebcamModal();
        }
    }, [webcamRef, closeWebcamModal]);

    const handleSwitchCamera = useCallback(() => { setFacingMode(prev => (prev === "user" ? "environment" : "user")); }, []);
    const triggerFileInput = useCallback(() => { if (fileInputRef.current) { fileInputRef.current.click(); } }, []);

    const handleFileSelect = useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error("Invalid file type. Please select an image.");
            return;
        }
        setIsFileReading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') setImageForCropper(result);
            else toast.error("Could not read the selected file.");
            setIsFileReading(false);
        };
        reader.onerror = () => { toast.error("Error reading file."); setIsFileReading(false); };
        reader.readAsDataURL(file);
        event.target.value = '';
    }, []);

    const onCropComplete = useCallback((_, croppedAreaPixelsValue) => { setCroppedAreaPixels(croppedAreaPixelsValue); }, []);

    const cancelCrop = useCallback(() => {
        setImageForCropper(null); setCroppedAreaPixels(null); setCrop({ x: 0, y: 0 });
        setZoom(1); setIsCropping(false); setIsFileReading(false);
    }, []);

    const applyCroppedImage = useCallback(async () => {
        if (!imageForCropper || !croppedAreaPixels) {
            toast.warn("Cropping data missing."); cancelCrop(); return;
        }
        setIsCropping(true);
        try {
            const croppedDataUrl = await getCroppedImg(imageForCropper, croppedAreaPixels, 0);
            if (!croppedDataUrl || typeof croppedDataUrl !== 'string' || !croppedDataUrl.startsWith('data:image/')) {
                throw new Error("Failed to get cropped image data.");
            }
            const fileExtension = croppedDataUrl.substring("data:image/".length, croppedDataUrl.indexOf(";base64"));
            const filename = `${outputFilenamePrefix}_${Date.now()}.${fileExtension || 'jpeg'}`;
            const imageFile = dataURLtoFile(croppedDataUrl, filename);
            if (!imageFile) throw new Error("Failed to process cropped image file.");

            if (currentImagePreview && currentImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(currentImagePreview);
            }
            const newPreviewUrl = URL.createObjectURL(imageFile);
            setCurrentImagePreview(newPreviewUrl);
            onImageCropped(imageFile);
            cancelCrop();
        } catch (error) {
            console.error("Error during image cropping/processing:", error);
            toast.error(`Failed to apply crop: ${error.message || 'Please try again.'}`);
            cancelCrop();
        } finally {
            setIsCropping(false);
        }
    }, [imageForCropper, croppedAreaPixels, cancelCrop, getCroppedImg, onImageCropped, outputFilenamePrefix, currentImagePreview]);

    const handleRemoveImage = () => {
        if (currentImagePreview && currentImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(currentImagePreview);
        }
        setCurrentImagePreview(null);
        onImageCropped(null);
    };

    const isProcessing = isCropping || isFileReading;

    // NOTE: For the dashed border, you would need custom CSS like:
    // .border-dashed { border-style: dashed !important; }
    const borderClass = currentImagePreview ? 'border-secondary' : 'border-secondary border-dashed';

    return (
        <>
<div
  className={`mb-3 ${label ? "gap-1" : ""} ${respclass}`}
  style={{
    width: "100px",
    height: "150px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  }}
>
  {label && (
    <p className="small text-muted mb-1 fw-semibold text-center">
      {label}
    </p>
  )}

  <div
    className="position-relative"
    style={{ width: "82px", height: "95px" }}
  >
    {/* Image / Placeholder */}
    <div
      className={`w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden`}
      style={{
        borderRadius: "10px",
        border: `2px dashed ${currentImagePreview ? "#10b981" : "#d1d5db"}`,
        background: "#f9fafb",
      }}
    >
      {currentImagePreview ? (
        <img
          src={currentImagePreview}
          alt={label || "Preview"}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <CameraIcon size={28} className="text-secondary" />
      )}
    </div>

    {/* Action Buttons */}
    <div
      className="position-absolute d-flex"
      style={{
        bottom: -22,
        left: "50%",
        transform: "translateX(-50%)",
        gap: "0.5rem",
      }}
    >
      <button
        type="button"
        onClick={openWebcam}
        disabled={isProcessing}
        className="btn rounded-circle shadow"
        style={{
          width: 34,
          height: 34,
          background: "linear-gradient(135deg,#ff6f61,#ff9472)",
          color: "#fff",
          padding: 0,
        }}
        aria-label="Take Photo"
      >
        <CameraIcon size={16} />
      </button>

      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isProcessing}
        className="btn rounded-circle shadow"
        style={{
          width: 34,
          height: 34,
          background: "linear-gradient(135deg,#3b82f6,#2563eb)",
          color: "#fff",
          padding: 0,
        }}
        aria-label="Upload File"
      >
        <Upload size={16} />
      </button>
    </div>

    {/* Remove Button */}
    {currentImagePreview && (
      <button
        type="button"
        onClick={handleRemoveImage}
        disabled={isProcessing}
        className="position-absolute d-flex align-items-center justify-content-center rounded-circle shadow-sm"
        style={{
          top: -8,
          right: -8,
          width: 22,
          height: 22,
          background: "#fff",
          border: "1px solid #e5e7eb",
          color: "#ef4444",
          padding: 0,
        }}
        aria-label="Remove image"
      >
        <XCircle size={14} />
      </button>
    )}
  </div>
</div>


            {/* <div 
            className={` mb-3 ${label ? 'gap-1' : ''} respclass=${respclass}`}
            // className={`d-flex flex-column align-items-center w-auto mx-auto mb-3 ${label ? 'gap-1' : ''}`}
            >
                {label && (
                    <p
                     className="small text-muted mb-1 "
                     >
                        {label}
                    </p>
                )}
                <div
                    className="position-relative mb-1"
                    style={{ width: "80px", height: "90px" }}
                >
                    <div
                        className={`w-100 h-100 bg-light d-flex align-items-center justify-content-center border border-2 ${borderClass} overflow-hidden`}
                    >
                        {currentImagePreview ? (
                            <img src={currentImagePreview} alt={label || "Preview"} className="w-100 h-100 object-fit-cover" />
                        ) : (
                            <CameraIcon size={previewSize * 0.33} className="text-muted" />
                        )}
                    </div>

                    <div
                        className="position-absolute d-flex"
                        style={{ bottom: -25, right: 1, gap: '0.4rem' }}
                    > <button
                            type="button" onClick={openWebcam} disabled={isProcessing}
                            className="btn rounded-circle d-flex align-items-center justify-content-center shadow"
                            style={{ backgroundColor: '#FF6F61', color: 'white', width: 32, height: 32, padding: 0, marginBottom: 13, marginRight: 8 }}
                            aria-label="Take Photo"
                        >
                            <CameraIcon size={16} />
                        </button>
                        <button
                            type="button" onClick={triggerFileInput} disabled={isProcessing}
                            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow"
                            style={{ width: 32, height: 32, padding: 0 }}
                            aria-label="Upload File"
                        >
                            <Upload size={16} />
                        </button>
                    </div>

                    {currentImagePreview && (
                        <button
                            type="button" onClick={handleRemoveImage} disabled={isProcessing}
                            className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm text-secondary"
                            style={{ top: -8, right: -8, width: 24, height: 24, border: '1px solid #dee2e6', padding: 0 }}
                            aria-label="Remove image"
                        >
                            <XCircle size={16} />
                        </button>
                    )}
                </div>
            </div> */}

            <input
                type="file" ref={fileInputRef} onChange={handleFileSelect}
                accept="image/*" className="d-none" disabled={isProcessing}
            />

            {showWebcamModal && (
                <Modal
                    visible={showWebcamModal}
                    Header={modalData.Header}
                    modalWidth={modalData?.size}
                    onHide={modalData?.setVisible}
                    setVisible={() => {
                        setModalData((val) => ({ ...val, visible: false }));
                    }}
                  footer={<></>}
                >
                    {showWebcamModal && (
                        <div
                            //  className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-4"
                            style={{ zIndex: 9999999999999 }}>
                            <div 
                            // className="bg-white p-4 p-sm-5 rounded shadow-lg w-100 d-flex flex-column align-items-center"
                            //  style={{ maxWidth: '500px' }}
                             >
                                {/* <h5 className="mb-3 text-dark">Capture Photo</h5> */}
                                <div className="w-100 position-relative mb-4 border rounded overflow-hidden">
                                    <Webcam
                                        audio={false} ref={webcamRef} screenshotFormat="image/png"
                                        className="w-100 h-auto d-block rounded"
                                        videoConstraints={{ facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }}
                                        mirrored={facingMode === 'user'}
                                        onUserMediaError={(err) => { console.error("Webcam Error:", err); toast.error(`Camera Error: ${err.name}`); closeWebcamModal(); }}
                                    />
                                    <button
                                        type="button" onClick={handleSwitchCamera}
                                        className="btn btn-sm btn-dark position-absolute bottom-0 end-0 m-2 rounded-circle"
                                        aria-label="Switch camera"
                                    >
                                        <SwitchCamera size={20} />
                                    </button>
                                </div>
                                <div className="d-flex justify-content-around w-100 gap-3 mt-1">
                                    <button type="button" className="btn btn-secondary" onClick={closeWebcamModal} disabled={isProcessing}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={capturePhoto} disabled={!showWebcamModal || isProcessing}>Capture</button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

   {imageForCropper && (
                <Modal
                    visible={imageForCropper}
                    Header={modalData.Header}
                    modalWidth={modalData?.size}
                    onHide={modalData?.setVisible}
                    setVisible={() => {
                        setModalData((val) => ({ ...val, visible: false }));
                    }}
                  footer={<></>}
                >
 {imageForCropper && (
                <div 
                // className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3 p-sm-4"
                    // style={{ zIndex: 999999999 }}
                    >
                    <div
                    //  className="bg-white p-3 p-sm-4 rounded shadow-lg w-100 position-relative"
                    //   style={{ maxWidth: '400px' }}
                      >
                        {isProcessing && (
                            <div
                            //  className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex flex-column align-items-center justify-content-center rounded"
                              style={{ zIndex: 2 }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 mb-0 fw-medium text-secondary">
                                    {isCropping ? "Processing..." : "Loading image..."}
                                </p>
                            </div>
                        )}
                        {/* <h5 className="text-center fw-semibold mb-3 text-dark">Crop Your Photo</h5> */}
                        <div
                         className="position-relative mb-3 bg-light rounded border overflow-hidden"
                        //   style={{ height: '300px' }}
                          style={{ height: '300px' }}

                          >
                            <Cropper
                                image={imageForCropper}
                                 crop={crop} zoom={zoom} aspect={aspectRatio}
                                onCropChange={setCrop} onZoomChange={setZoom}
                                onCropComplete={onCropComplete} 
                                showGrid={true}
                                
                            />
                        </div>
                        <div className="d-flex align-items-center mb-4 px-0 px-sm-2">
                            <span className="me-2 small text-muted">Zoom:</span>
                            <input
                                type="range" min="1" max="3" step="0.05" value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="form-range w-100"
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2 gap-sm-3 mt-1">
                            <button type="button" className="btn btn-link text-secondary" onClick={cancelCrop} disabled={isProcessing}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={applyCroppedImage} disabled={isProcessing}>
                                {isCropping ? "Applying..." : "Crop & Use"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


                </Modal>

        )}


            {/* // {imageForCropper && (
            //     <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3 p-sm-4"
            //         style={{ zIndex: 999999999 }}>
            //         <div className="bg-white p-3 p-sm-4 rounded shadow-lg w-100 position-relative" style={{ maxWidth: '400px' }}>
            //             {isProcessing && (
            //                 <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex flex-column align-items-center justify-content-center rounded" style={{ zIndex: 2 }}>
            //                     <div className="spinner-border text-primary" role="status">
            //                         <span className="visually-hidden">Loading...</span>
            //                     </div>
            //                     <p className="mt-2 mb-0 fw-medium text-secondary">
            //                         {isCropping ? "Processing..." : "Loading image..."}
            //                     </p>
            //                 </div>
            //             )}
            //             <h5 className="text-center fw-semibold mb-3 text-dark">Crop Your Photo</h5>
            //             <div className="position-relative mb-3 bg-light rounded border overflow-hidden" style={{ height: '300px' }}>
            //                 <Cropper
            //                     image={imageForCropper} crop={crop} zoom={zoom} aspect={aspectRatio}
            //                     onCropChange={setCrop} onZoomChange={setZoom}
            //                     onCropComplete={onCropComplete} showGrid={true}
            //                 />
            //             </div>
            //             <div className="d-flex align-items-center mb-4 px-0 px-sm-2">
            //                 <span className="me-2 small text-muted">Zoom:</span>
            //                 <input
            //                     type="range" min="1" max="3" step="0.05" value={zoom}
            //                     onChange={(e) => setZoom(Number(e.target.value))}
            //                     className="form-range w-100"
            //                     disabled={isProcessing}
            //                 />
            //             </div>
            //             <div className="d-flex justify-content-end gap-2 gap-sm-3 mt-1">
            //                 <button type="button" className="btn btn-link text-secondary" onClick={cancelCrop} disabled={isProcessing}>Cancel</button>
            //                 <button type="button" className="btn btn-primary" onClick={applyCroppedImage} disabled={isProcessing}>
            //                     {isCropping ? "Applying..." : "Crop & Use"}
            //                 </button>
            //             </div>
            //         </div>
            //     </div>
            // )} */}
        </>
    );
}

export default ImageCaptureCrop;