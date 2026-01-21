import React, { useEffect, useRef, useState, useCallback } from "react";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import { documentsupload, Imagesupload } from "../../../networkServices/School/fileUpload";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../formComponent/ReactSelect";
import { GetAllClasses } from "../../../networkServices/AcademicYear";
import { useTranslation } from "react-i18next";
import Modal from "../../modalComponent/Modal";
import Enquiry from "../../EnquiryMaster/Enquiry";
import moment from "moment";
import { Dialog } from 'primereact/dialog';
import Cropper from 'react-easy-crop';
import { StudentRegister } from "../../../networkServices/School/RegistrationApi";

// =======================
// HELPER: IMAGE CROP UTILS
// =======================
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg');
  });
};

// =======================
// COMPONENT: PHOTO UPLOADER
// =======================
const PhotoUploader = ({ label, onUploadSuccess, currentPhotoId }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setModalMode('crop');
      setIsModalOpen(true);
      // Reset input so same file can be selected again if needed
      e.target.value = null; 
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const openCamera = async () => {
    setModalMode('camera');
    setIsModalOpen(true);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        notify("Camera access denied", "error");
        setIsModalOpen(false);
      }
    }, 300);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      
      setImageSrc(dataUrl);
      setModalMode('crop');
    }
  };

  const closeDialog = () => {
    if (videoRef.current && videoRef.current.srcObject) {
       const tracks = videoRef.current.srcObject.getTracks();
       tracks.forEach(track => track.stop());
    }
    setIsModalOpen(false);
    setImageSrc(null);
    setZoom(1);
  };

  // --- NEW: Clear Photo Function ---
  const handleClearPhoto = () => {
      setImagePreview(null);
      if (onUploadSuccess) {
          onUploadSuccess(""); // Send empty string to clear ID in parent state
      }
      notify("Photo removed", "info");
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileToUpload = new File([croppedBlob], "profile_photo.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(croppedBlob);
      setImagePreview(previewUrl);
      closeDialog();
      await uploadToApi(fileToUpload);
    } catch (e) {
      console.error(e);
      notify("Error cropping image", "error");
    }
  };

  const uploadToApi = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await Imagesupload(formData); 
      if (response?.success) {
        notify("Photo updated successfully", "success");
        if (onUploadSuccess) {
          onUploadSuccess(response.data.imageId);
        }
      } else {
        notify("Upload failed", "error");
      }
    } catch (error) {
      notify("Error uploading image", "error");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Photo Preview Box */}
      <div 
        className="shadow-sm bg-white position-relative"
        style={{ 
          width: "130px", height: "150px", border: "1px solid #dee2e6",
          borderRadius: "4px", display: "flex", alignItems: "center",
          justifyContent: "center", overflow: "hidden", marginBottom: "8px",
          backgroundColor: "#f8f9fa"
        }}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="text-center text-muted">
            <i className="bi bi-person-circle" style={{fontSize: "2rem"}}></i>
            <div style={{fontSize: "10px", marginTop: "5px"}}>{label}</div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button 
            type="button" 
            className="btn btn-primary btn-sm rounded-circle shadow-sm d-flex justify-content-center align-items-center" 
            style={{ width: '35px', height: '35px' }} 
            onClick={openCamera} 
            title="Take Photo"
        >
          <i className="bi bi-camera"></i>
        </button>
        
        <button 
            type="button" 
            className="btn btn-secondary btn-sm rounded-circle shadow-sm d-flex justify-content-center align-items-center" 
            style={{ width: '35px', height: '35px' }} 
            onClick={() => fileInputRef.current.click()} 
            title="Upload File"
        >
          <i className="bi bi-folder2-open"></i>
        </button>

        {/* Clear Button - Only visible if image exists */}
        {imagePreview && (
            <button 
                type="button" 
                className="btn btn-danger btn-sm rounded-circle shadow-sm d-flex justify-content-center align-items-center" 
                style={{ width: '35px', height: '35px' }} 
                onClick={handleClearPhoto} 
                title="Remove Photo"
            >
                <i className="bi bi-trash"></i>
            </button>
        )}
      </div>
      
      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />

      {/* Modal */}
      <Dialog 
        header={modalMode === 'camera' ? "Take Photo" : "Adjust Photo"} 
        visible={isModalOpen} 
        style={{ width: '500px', maxWidth: '90vw' }} 
        onHide={closeDialog} 
        draggable={false}
      >
        <div style={{ height: '400px', position: 'relative', backgroundColor: '#333' }}>
          {modalMode === 'camera' ? (
             <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
             <button className="btn btn-secondary" onClick={closeDialog}>
                Cancel
            </button>

            {modalMode === 'crop' && (
                <div className="d-flex align-items-center gap-2 w-50 mx-2">
                    <small>Zoom</small>
                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="form-range" />
                </div>
            )}
            
            <div className="ms-auto">
                {modalMode === 'camera' ? (
                     <button className="btn btn-primary" onClick={capturePhoto}>
                        <i className="bi bi-camera-fill me-2"></i> Capture
                     </button>
                ) : (
                     <button className="btn btn-success" onClick={saveCroppedImage}>
                        <i className="bi bi-check-lg me-2"></i> Save Photo
                     </button>
                )}
            </div>
        </div>
      </Dialog>
    </div>
  );
};

// =======================
// COMPONENT: DOCUMENT UPLOADER
// =======================
const DocumentUploader = ({ documentType, onUploadSuccess, currentDocId, className }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    if (!documentType) {
      notify("Please select a Document Type first", "warning");
      e.target.value = null; 
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      await uploadDocument(file);
    }
  };

  const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("DocumentType", parseInt(documentType));

      const response = await documentsupload(formData);
      
      if (response?.success) {
        notify("Document uploaded successfully", "success");
        if (onUploadSuccess) {
          onUploadSuccess(response.data.documentId);
        }
      } else {
        notify(response?.message || "Document upload failed", "error");
        setFileName(""); 
      }
    } catch (error) {
      console.error(error);
      notify("Error uploading document", "error");
      setFileName("");
    }
  };

  return (
    <div className={className}>
      <label className="form-label" style={{visibility: 'hidden'}}>Upload</label>
      <div className="input-group">
        <button 
          className={`btn ${currentDocId ? 'btn-success' : 'btn-outline-primary'} w-100`} 
          type="button" 
          onClick={() => fileInputRef.current.click()}
        >
          {currentDocId ? <><i className="bi bi-check-circle-fill me-2"></i>Uploaded</> : <><i className="bi bi-cloud-upload me-2"></i>Upload File</>}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
      {fileName && <small className="text-muted d-block text-truncate mt-1">{fileName}</small>}
    </div>
  );
};

// =======================
// MAIN COMPONENT
// =======================

const initialData = {
  title: { label: "Mr", value: "MR" },
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: { label: "Male", value: "Male" },
  phone: "",
  altPhone: "",
  email: "",
  class_Name: { label: "", value: "" },
  address: {
    village: "", taluk: "", town: "", city: "",
    tehsil: "", district: "", state: "", country: "", pincode: "",
  },
  otherInfo: {
    identificationMark: "", bloodGroup: "", religion: "",
    category: "", motherTongue: "", nationality: "",
  },
  aadhaar: "",
  studentPhotoId: "",
  isSibling: null,
  siblingId: "",
  previousAcademics: [
    {
      rollNo: "", class_Name: "", percentage: 0, yearOfPassing: 0,
      board: "", medium: "", school: "", schoolAddress: "", tcNo: "", description: "",
    },
  ],
  parents: [
    {
      name: "", parentType: 1, mobile: "", altMobile: "", email: "", occupation: "",
      photoId: "",
      documents: [{ documentNumber: "", documentType: null, documentID: "" }],
    },
  ],
  studentDocuments: [
    { documentNumber: "", documentType: null, documentID: "", sessionId: 0, yearId: 0 },
  ],
  otherDetail: { transportRequired: true, route: "", busNo: "" },
};

const StudentRegistration = () => {
  const [values, setValues] = useState(initialData);
  const [classes, setClasses] = useState([]);
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  const handleChangeModel = (data) => {
    setModalData(data);
    setValues((pre) => ({
      ...pre,
      firstName: data.studentName,
      phone: data.mobileNumber,
      altPhone: data.alternateMobileNumber,
      school: data.previousSchoolName,
    }));
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };

  const handleNestedChange = (section, field, value) => {
    setValues((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const getClass = async () => {
    try {
      const response = await GetAllClasses();
      if (response?.success) {
        setClasses(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Error fetching classes", "error");
    }
  };

  const handleArrayChange = (section, index, field, value) => {
    const data = [...values[section]];
    data[index][field] = value;
    setValues((prev) => ({ ...prev, [section]: data }));
  };

  const handleFieldChange = (section, index = null, field, valueOrOption) => {
    const value = valueOrOption?.value ?? valueOrOption;
    if (index !== null) {
      const data = [...values[section]];
      data[index][field] = value;
      setValues((prev) => ({ ...prev, [section]: data }));
    } else {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  // --- Handlers for Photo & Docs ---
  const handleStudentPhotoUpload = (id) => {
    setValues(prev => ({ ...prev, studentPhotoId: id }));
  };

  const handleParentPhotoUpload = (index, id) => {
    const updatedParents = [...values.parents];
    updatedParents[index].photoId = id;
    setValues(prev => ({ ...prev, parents: updatedParents }));
  };

  const handleParentDocIdChange = (parentIndex, docIndex, id) => {
    const updatedParents = [...values.parents];
    updatedParents[parentIndex].documents[docIndex].documentID = id;
    setValues(prev => ({ ...prev, parents: updatedParents }));
  };

  const handleStudentDocIdChange = (index, id) => {
    const updatedDocs = [...values.studentDocuments];
    updatedDocs[index].documentID = id;
    setValues(prev => ({ ...prev, studentDocuments: updatedDocs }));
  };
  // -----------------------------

  const addParent = () => {
    setValues((prev) => ({
      ...prev,
      parents: [
        ...prev.parents,
        {
          name: "", parentType: 1, mobile: "", altMobile: "", email: "", occupation: "",
          photoId: "", 
          documents: [],
        },
      ],
    }));
  };

  const removeParent = (index) => {
    setValues((prev) => ({
      ...prev,
      parents: prev.parents.filter((_, i) => i !== index),
    }));
  };

  const addParentDocument = (parentIndex) => {
    const updatedParents = [...values.parents];
    updatedParents[parentIndex].documents.push({
      documentNumber: "", documentType: null, documentID: "",
    });
    setValues((prev) => ({ ...prev, parents: updatedParents }));
  };

  const removeParentDocument = (parentIndex, docIndex) => {
    const updatedParents = [...values.parents];
    updatedParents[parentIndex].documents = updatedParents[parentIndex].documents.filter((_, i) => i !== docIndex);
    setValues((prev) => ({ ...prev, parents: updatedParents }));
  };

  const handleParentDocChange = (parentIndex, docIndex, field, value) => {
    const updatedParents = [...values.parents];
    updatedParents[parentIndex].documents[docIndex][field] = value;
    setValues((prev) => ({ ...prev, parents: updatedParents }));
  };

  const addStudentDocument = () => {
    setValues((prev) => ({
      ...prev,
      studentDocuments: [
        ...prev.studentDocuments,
        { documentNumber: "", documentType: null, documentID: "", sessionId: 0, yearId: 0 },
      ],
    }));
  };

  const removeStudentDocument = (index) => {
    setValues((prev) => ({
      ...prev,
      studentDocuments: prev.studentDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!values?.firstName) return notify("Please enter student name", "error");
    
    try {
      const payload = {
        title: values?.title?.value,
        firstName: values?.firstName,
        lastName: values?.lastName,
        dateOfBirth: values?.dateOfBirth ? moment(values?.dateOfBirth).format("YYYY-MM-DD") : "",
        gender: values?.gender?.value === "Male" ? 1 : values?.gender?.value === "Female" ? 2 : 3,
        phone: values?.phone,
        altPhone: values?.altPhone,
        email: values?.email,
        address: { ...values.address },
        otherInfo: { ...values.otherInfo },
        aadhaar: values?.aadhaar,
        studentPhotoId: values?.studentPhotoId, 
        isSibling: false,
        siblingId: values?.siblingId,
        previousAcademics: [
          {
            rollNo: values?.previousAcademics[0]?.rollNo,
            class: values?.class_Name?.value,
            percentage: values?.previousAcademics[0]?.percentage,
            yearOfPassing: values?.previousAcademics[0]?.yearOfPassing,
            board: values?.previousAcademics[0]?.board,
            medium: values?.medium?.value,
            school: values?.previousAcademics[0]?.school,
            schoolAddress: values?.previousAcademics[0]?.schoolAddress,
            tcNo: values?.previousAcademics[0]?.tcNo,
            description: values?.previousAcademics[0]?.description,
          },
        ],
        parents: values?.parents?.map((parent) => ({
          name: parent.name,
          parentType: Number(parent.parentType),
          mobile: parent.mobile,
          altMobile: parent.altMobile,
          email: parent.email,
          occupation: parent.occupation,
          photoId: parent.photoId,
          documents: parent.documents.map((doc) => ({
            documentNumber: doc.documentNumber,
            documentType: Number(doc.documentType),
            documentID: doc.documentID, // Using dynamic ID from state
          })),
        })),
        studentDocuments: values?.studentDocuments?.map((doc) => ({
          documentNumber: doc.documentNumber,
          documentType: Number(doc.documentType),
          documentID: doc.documentID, // Using dynamic ID from state
          sessionId: 2026,
          yearId: 2026,
        })),
        otherDetail: {
          transportRequired: false,
          route: values?.otherDetail?.route,
          busNo: values?.otherDetail?.busNo,
        },
      };

      const response = await StudentRegister(payload);

      if (response?.success) {
        setValues(initialData);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getClass();
  }, []);

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleEnq = async () => {
    setModalData("data");
    setHandleModelData({
      isOpen: true, width: "70vw", label: t("Registration To Admission"),
      Component: <Enquiry handleChangeModel={handleChangeModel} />,
      extrabutton: <></>, footer: <></>,
    });
  };

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen} setVisible={setIsOpen} modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)} buttonType={"button"} buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName} modalData={modalData} setModalData={setModalData}
          footer={handleModelData?.footer} handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="container-fluid">
        {/* STUDENT REGISTRATION CARD */}
        <div className="card shadow-sm mb-4">
          <Heading
            title={t("Student Registration")}
            isBreadcrumb={false}
            secondTitle={
              <div className="col-12 text-right">
                <button onClick={handleEnq} className="btn btn-sm btn-primary" type="button">
                  {t("Enquiry List")}
                </button>
                <button onClick={handleEnq} className="btn btn-sm btn-primary mx-2" type="button">
                  {t("IS SIBLING")}
                </button>
              </div>
            }
          />
          <div className="card-body">
            <div className="row align-items-start">
              <div className="col-lg-10 col-md-9">
                <div className="row g-3">
                  <ReactSelect placeholderName="title"  respclass="col-xl-3 col-md-4 col-sm-4 col-12" name="title" dynamicOptions={[{ label: "Miss", value: "MISS" }, { label: "Mr", value: "MR" }, { label: "Ms", value: "MS" }]} handleChange={handleSelect} value={values.title?.value} />
                  <Input className="form-control required-fields" name="firstName" lable="First Name" value={values.firstName} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <Input className="form-control required-fields" name="lastName" lable="Last Name" value={values.lastName} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <DatePicker name="dateOfBirth" lable="Date of Birth" value={values.dateOfBirth} handleChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" className="required-fields" />
                  <ReactSelect placeholderName="Gender" respclass="col-xl-3 col-md-4 col-sm-4 col-12" name="gender" dynamicOptions={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }]} handleChange={handleSelect} value={values.gender?.value} requiredClassName="required-fields" />
                  <Input className="form-control" name="phone" lable="Mobile Number" value={values.phone} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <Input className="form-control" name="altPhone" lable="Alternate Mobile" value={values.altPhone} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <Input className="form-control" name="email" lable="Email Address" value={values.email} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <Input className="form-control" name="aadhaar" lable="Aadhaar Number" value={values.aadhaar} onChange={handleChange} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  {/* <Input className="form-control" name="siblingId" lable="Sibling ID (if applicable)" value={values.siblingId} onChange={handleChange} respclass="col-md-3" /> */}
                 <ReactSelect placeholderName={t("Class")} searchable={true} respclass="col-xl-3 col-md-4 col-sm-4 col-12" id="class_Name" name="class_Name" removeIsClearable={true} dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")} handleChange={handleSelect} value={values?.class_Name?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="rollNo" name="rollNo" value={values?.rollNo || ""} lable={"Roll No."} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="percentage" name="percentage" value={values?.percentage || ""} lable={"Percentage"} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="yearOfPassing" name="yearOfPassing" value={values?.yearOfPassing || ""} lable={"Year Of Passing"} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="board" name="board" value={values?.board || ""} lable={"Board"} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <ReactSelect placeholderName={t("Medium")} searchable={true} respclass="col-xl-3 col-md-4 col-sm-4 col-12" id="medium" name="medium" removeIsClearable={true} dynamicOptions={[{ label: "HINDI", value: "HINDI" }, { label: "ENGLISH", value: "ENGLISH" }]} handleChange={handleSelect} value={values?.medium?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="school" name="school" value={values?.school || ""} lable={"School Name"} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="schoolAddress" name="schoolAddress" value={values?.schoolAddress || ""} lable={"Address"} placeholder=" " respclass="col-xl-6 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="tcNo" name="tcNo" value={values?.tcNo || ""} lable={"TC No."} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="description" name="description" value={values?.description || ""} lable={"Description"} placeholder=" " respclass="col-xl-3 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
           
                </div>
                {/* <div className="row g-3">
              <ReactSelect placeholderName={t("Class")} searchable={true} respclass="col-xl-2 col-md-4 col-sm-4 col-12" id="class_Name" name="class_Name" removeIsClearable={true} dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")} handleChange={handleSelect} value={values?.class_Name?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="rollNo" name="rollNo" value={values?.rollNo || ""} lable={"Roll No."} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="percentage" name="percentage" value={values?.percentage || ""} lable={"Percentage"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="yearOfPassing" name="yearOfPassing" value={values?.yearOfPassing || ""} lable={"Year Of Passing"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="board" name="board" value={values?.board || ""} lable={"Board"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <ReactSelect placeholderName={t("Medium")} searchable={true} respclass="col-xl-2 col-md-4 col-sm-4 col-12" id="medium" name="medium" removeIsClearable={true} dynamicOptions={[{ label: "HINDI", value: "HINDI" }, { label: "ENGLISH", value: "ENGLISH" }]} handleChange={handleSelect} value={values?.medium?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="school" name="school" value={values?.school || ""} lable={"School Name"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="schoolAddress" name="schoolAddress" value={values?.schoolAddress || ""} lable={"Address"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="tcNo" name="tcNo" value={values?.tcNo || ""} lable={"TC No."} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="description" name="description" value={values?.description || ""} lable={"Description"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
            </div> */}
              </div>
              <div className="col-lg-2 col-md-3 d-flex justify-content-center pt-1">
                 <PhotoUploader label="Student Photo" onUploadSuccess={handleStudentPhotoUpload} currentPhotoId={values.studentPhotoId} />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="card shadow-sm mb-4">
          <Heading title={t("Address Details")} isBreadcrumb={false} />
          <div className="card-body">
            <div className="row g-3">
              {Object.keys(values.address).map((key) => (
                <Input key={key} className="form-control" lable={key.charAt(0).toUpperCase() + key.slice(1)} value={values.address[key]} onChange={(e) => handleNestedChange("address", key, e.target.value)} respclass="col-xl-2 col-md-4 col-sm-4 col-12" />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card shadow-sm mb-4">
          <Heading title={t("Additional Information")} isBreadcrumb={false} />
          <div className="card-body">
            <div className="row g-3">
              {Object.keys(values.otherInfo).map((key) => (
                <Input key={key} className="form-control" lable={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} value={values.otherInfo[key]} onChange={(e) => handleNestedChange("otherInfo", key, e.target.value)} respclass="col-xl-2 col-md-4 col-sm-4 col-12" />
              ))}
            </div>
          </div>
        </div>

        {/* Previous Academics */}
        {/* <div className="card shadow-sm mb-4">
          <Heading title={t("Previous Academic Details")} isBreadcrumb={false} />
          <div className="card-body">
            <div className="row g-3">
              <ReactSelect placeholderName={t("Class")} searchable={true} respclass="col-xl-2 col-md-4 col-sm-4 col-12" id="class_Name" name="class_Name" removeIsClearable={true} dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")} handleChange={handleSelect} value={values?.class_Name?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="rollNo" name="rollNo" value={values?.rollNo || ""} lable={"Roll No."} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="percentage" name="percentage" value={values?.percentage || ""} lable={"Percentage"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="yearOfPassing" name="yearOfPassing" value={values?.yearOfPassing || ""} lable={"Year Of Passing"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="board" name="board" value={values?.board || ""} lable={"Board"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <ReactSelect placeholderName={t("Medium")} searchable={true} respclass="col-xl-2 col-md-4 col-sm-4 col-12" id="medium" name="medium" removeIsClearable={true} dynamicOptions={[{ label: "HINDI", value: "HINDI" }, { label: "ENGLISH", value: "ENGLISH" }]} handleChange={handleSelect} value={values?.medium?.value} requiredClassName="required-fields" />
              <Input type="text" className="form-control" id="school" name="school" value={values?.school || ""} lable={"School Name"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="schoolAddress" name="schoolAddress" value={values?.schoolAddress || ""} lable={"Address"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="tcNo" name="tcNo" value={values?.tcNo || ""} lable={"TC No."} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
              <Input type="text" className="form-control" id="description" name="description" value={values?.description || ""} lable={"Description"} placeholder=" " respclass="col-xl-2 col-md-4 col-sm-4 col-12" isUpperCase={true} onChange={handleChange} />
            </div>
          </div>
        </div> */}

        {/* Parent Details */}
        <div className="card shadow-sm mb-4">
          <div className="card-header ">
            <Heading title={t("Parent/Guardian Details")} isBreadcrumb={false} secondTitle={<button className="btn btn-light btn-sm" onClick={addParent}>Add Parent</button>} />
          </div>
          <div className="card-body">
            {values.parents.map((parent, parentIndex) => (
              <div key={parentIndex} className="border rounded p-3 mb-3 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* <h6 className="text-secondary mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Parent {parentIndex + 1}
                    {parent.parentType === 1 ? " (Father)" : parent.parentType === 2 ? " (Mother)" : " (Guardian)"}
                  </h6> */}
                  {values.parents.length > 1 && (<i className="bi bi-trash me-1 text-danger" onClick={() => removeParent(parentIndex)} style={{ cursor: "pointer" }}></i>)}
                </div>

                <div className="row align-items-start">
                  <div className="col-lg-10 col-md-9">
                    <div className="row g-3">
                        <Input className="form-control required-fields" lable="Name" value={parent.name} onChange={(e) => handleArrayChange("parents", parentIndex, "name", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                        <ReactSelect respclass="col-xl-3 col-md-4 col-sm-4 col-12" name="parentType" handleChange={(name, option) => handleFieldChange("parents", parentIndex, "parentType", option)} value={values.parents[parentIndex].parentType} dynamicOptions={[{ label: "Father", value: "1" }, { label: "Mother", value: "2" }, { label: "Guardian", value: "3" }]} requiredClassName=" required-fields" />
                        <Input className="form-control required-fields" lable="Mobile" value={parent.mobile} onChange={(e) => handleArrayChange("parents", parentIndex, "mobile", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                        <Input className="form-control" lable="Alt Mobile" value={parent.altMobile} onChange={(e) => handleArrayChange("parents", parentIndex, "altMobile", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                        <Input className="form-control" lable="Email" value={parent.email} onChange={(e) => handleArrayChange("parents", parentIndex, "email", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                        <Input className="form-control" lable="Occupation" value={parent.occupation} onChange={(e) => handleArrayChange("parents", parentIndex, "occupation", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                    </div>

                    <div className="mt-3">
                        {/* <div className="d-flex justify-content-between align-items-center mb-2"> */}
                            {/* <strong className="text-muted"><i className="bi bi-file-earmark-text me-2"></i>Documents</strong> */}
                            <button className="btn btn-primary btn-sm" onClick={() => addParentDocument(parentIndex)}>Add Document</button>
                        {/* </div> */}
                        {parent.documents.map((doc, docIndex) => (
                            <div key={docIndex} className="border-start border-3 border-primary ps-3 mb-2">
                            <div className="row g-2 mt-2">
                                <Input className="form-control required-fields" lable="Document Number" value={doc.documentNumber} onChange={(e) => handleParentDocChange(parentIndex, docIndex, "documentNumber", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                                <ReactSelect respclass="col-xl-3 col-md-4 col-sm-4 col-12" name="documentType" handleChange={(name, option) => handleParentDocChange(parentIndex, docIndex, "documentType", option.value)} value={values.parents[parentIndex].documents[docIndex].documentType ? { label: values.parents[parentIndex].documents[docIndex].documentType === "1" ? "PAN" : "Aadhaar", value: values.parents[parentIndex].documents[docIndex].documentType } : null} dynamicOptions={[{ label: "PAN", value: "1" }, { label: "Aadhaar", value: "2" }]} />
                                
                                {/* REPLACED TEXT INPUT WITH UPLOADER */}
                                <DocumentUploader
                                //   className="col-xl-2 col-md-4 col-sm-4 col-12"
                                  documentType={values.parents[parentIndex].documents[docIndex].documentType}
                                  onUploadSuccess={(id) => handleParentDocIdChange(parentIndex, docIndex, id)}
                                  currentDocId={values.parents[parentIndex].documents[docIndex].documentID}
                                />
                                
                                <div className="col-md-1">
                                <i className="bi bi-trash me-1 text-danger pointer" onClick={() => removeParentDocument(parentIndex, docIndex)} style={{ cursor: "pointer" }}></i>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-3 d-flex justify-content-center pt-1">
                    <PhotoUploader label="Parent Photo" onUploadSuccess={(id) => handleParentPhotoUpload(parentIndex, id)} currentPhotoId={parent.photoId} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Documents */}
        <div className="card shadow-sm mb-4">
          <div className="card-header ">
            <Heading title={t("Student Documents")} isBreadcrumb={false} secondTitle={<button className="btn btn-sm" onClick={addStudentDocument}>Add Document</button>} />
          </div>
          <div className="card-body">
            {values.studentDocuments.map((doc, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-secondary mb-0"><i className="bi bi-file-text me-2"></i>Document {index + 1}</h6>
                  {values.studentDocuments.length > 1 && (<i className="bi bi-trash me-1 text-danger" onClick={() => removeStudentDocument(index)} style={{ cursor: "pointer" }}></i>)}
                </div>
                <div className="row g-3">
                  <Input className="form-control required-fields" lable="Document No." value={doc.documentNumber} onChange={(e) => handleArrayChange("studentDocuments", index, "documentNumber", e.target.value)} respclass="col-xl-3 col-md-4 col-sm-4 col-12" />
                  <ReactSelect placeholderName={"Document Type"} respclass="col-xl-3 col-md-4 col-sm-4 col-12" name="documentType" handleChange={(name, option) => handleArrayChange("studentDocuments", index, "documentType", option.value)} value={values.studentDocuments[index].documentType ? { label: values.studentDocuments[index].documentType === "1" ? "TC" : "Birth Cert", value: values.studentDocuments[index].documentType } : null} dynamicOptions={[{ label: "TC", value: "1" }, { label: "Birth Cert", value: "2" }]} />
                  <Input className="form-control" lable="Session ID" value={doc.sessionId} onChange={(e) => handleArrayChange("studentDocuments", index, "sessionId", e.target.value)} respclass="col-md-2" />
                  <Input className="form-control" lable="Year ID" value={doc.yearId} onChange={(e) => handleArrayChange("studentDocuments", index, "yearId", e.target.value)} respclass="col-md-2" />
                  
                  {/* REPLACED TEXT INPUT WITH UPLOADER */}
                  <DocumentUploader
                    className="col-xl-2 col-md-4 col-sm-4 col-12"
                    documentType={values.studentDocuments[index].documentType}
                    onUploadSuccess={(id) => handleStudentDocIdChange(index, id)}
                    currentDocId={values.studentDocuments[index].documentID}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Details */}
        <div className="card shadow-sm mb-4">
          <Heading title={t("Transport Details")} isBreadcrumb={false} />
          <div className="card-body">
            <div className="row g-3">
              <Input className="form-control" lable="Route" value={values.otherDetail.route} onChange={(e) => handleNestedChange("otherDetail", "route", e.target.value)} respclass="col-md-6" />
              <Input className="form-control" lable="Bus Number" value={values.otherDetail.busNo} onChange={(e) => handleNestedChange("otherDetail", "busNo", e.target.value)} respclass="col-md-6" />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mb-4">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Registration</button>
        </div>
      </div>
    </>
  );
};

export default StudentRegistration;