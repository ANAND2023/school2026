import React, { useState } from "react";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import { StudentRegister } from "../../../networkServices/School/RegistrationApi";
import { notify } from "../../../utils/utils";
import ReactSelect from "../../formComponent/ReactSelect";

/* ================= INITIAL STATE ================= */
const initialData = {
    title: { label: "Mr", value: "MR" },
    firstName: "Rahul",
    lastName: "Kumar",
    dateOfBirth: "2010-05-15",
    gender: { label: "Male", value: "Male" },
    phone: "9876543210",
    altPhone: "9123456789",
    email: "rahul.kumar@gmail.com",
    address: {
        village: "Rampur",
        taluk: "Sadar",
        town: "Rampur Town",
        city: "Patna",
        tehsil: "Patna Sadar",
        district: "Patna",
        state: "Bihar",
        country: "India",
        pincode: "800001"
    },
    otherInfo: {
        identificationMark: "Mole on left cheek",
        bloodGroup: "O+",
        religion: "Hindu",
        category: "OBC",
        motherTongue: "Hindi",
        nationality: "Indian"
    },
    aadhaar: "123456789012",
    photo: "base64_student_photo_string",
    isSibling: true,
    siblingId: "STU20230045",
    previousAcademics: [
        {
            rollNo: "1025",
            class: "5",
            percentage: 78.5,
            yearOfPassing: 2023,
            board: "CBSE",
            medium: "English",
            school: "ABC Public School",
            schoolAddress: "Kankarbagh, Patna",
            tcNo: "TC2023/458",
            description: "Good academic performance"
        }
    ],
    parents: [
        {
            name: "Ramesh Kumar",
            parentType: 1,
            mobile: "9876501234",
            altMobile: "9123409876",
            email: "ramesh.kumar@gmail.com",
            occupation: "Private Job",
            photo: "base64_father_photo",
            documents: [
                {
                    documentNumber: "ABCDE1234F",
                    documentType: 1,
                    documentUpload: "base64_pan_card"
                }
            ]
        }
    ],
    studentDocuments: [
        {
            documentNumber: "TC2023/458",
            documentType: 1,
            documentUpload: "base64_tc",
            sessionId: 0,
            yearId: 0
        }
    ],
    otherDetail: {
        transportRequired: true,
        route: "Route No 3",
        busNo: "BUS-12"
    }
};

const StudentRegistration = () => {
    const [values, setValues] = useState(initialData);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, option) => {
        setValues((prev) => ({ ...prev, [name]: option }));
    };
    const handleNestedChange = (section, field, value) => {
        setValues(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const data = [...values[section]];
        data[index][field] = value;
        setValues(prev => ({ ...prev, [section]: data }));
    };

    // Add new parent
    const addParent = () => {
        setValues(prev => ({
            ...prev,
            parents: [
                ...prev.parents,
                {
                    name: "",
                    parentType: 1,
                    mobile: "",
                    altMobile: "",
                    email: "",
                    occupation: "",
                    photo: "",
                    documents: []
                }
            ]
        }));
    };

    // Remove parent
    const removeParent = (index) => {
        setValues(prev => ({
            ...prev,
            parents: prev.parents.filter((_, i) => i !== index)
        }));
    };

    // Add document to parent
    const addParentDocument = (parentIndex) => {
        const updatedParents = [...values.parents];
        updatedParents[parentIndex].documents.push({
            documentNumber: "",
            documentType: 1,
            documentUpload: ""
        });
        setValues(prev => ({ ...prev, parents: updatedParents }));
    };

    // Remove document from parent
    const removeParentDocument = (parentIndex, docIndex) => {
        const updatedParents = [...values.parents];
        updatedParents[parentIndex].documents = updatedParents[parentIndex].documents.filter((_, i) => i !== docIndex);
        setValues(prev => ({ ...prev, parents: updatedParents }));
    };

    // Handle parent document change
    const handleParentDocChange = (parentIndex, docIndex, field, value) => {
        const updatedParents = [...values.parents];
        updatedParents[parentIndex].documents[docIndex][field] = value;
        setValues(prev => ({ ...prev, parents: updatedParents }));
    };

    // Add student document
    const addStudentDocument = () => {
        setValues(prev => ({
            ...prev,
            studentDocuments: [
                ...prev.studentDocuments,
                {
                    documentNumber: "",
                    documentType: 1,
                    documentUpload: "",
                    sessionId: 0,
                    yearId: 0
                }
            ]
        }));
    };

    // Remove student document
    const removeStudentDocument = (index) => {
        setValues(prev => ({
            ...prev,
            studentDocuments: prev.studentDocuments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {

            const payload = {
                title: values?.title?.value,
                firstName: values?.firstName,
                lastName: values?.lastName,
                dateOfBirth: values?.dateOfBirth,
                gender: values?.gender?.value==="Male"?1:values?.gender?.value==="Female"?2:3,
                phone: values?.phone,
                altPhone: values?.altPhone,
                email: values?.email,
                address: {
                    village: values?.address?.village,
                    taluk: values?.address?.taluk,
                    town: values?.address?.town,
                    city: values?.address?.city,
                    tehsil: values?.address?.tehsil,
                    district: values?.address?.district,
                    state: values?.address?.state,
                    country: values?.address?.country,
                    pincode: values?.address?.pincode,
                },
                otherInfo: {
                    identificationMark: values?.otherInfo?.identificationMark,
                    bloodGroup: values?.otherInfo?.bloodGroup,
                    religion: values?.otherInfo?.religion,
                    category: values?.otherInfo?.category,
                    motherTongue: values?.otherInfo?.motherTongue,
                    nationality: values?.otherInfo?.nationality
                },
                aadhaar: values?.aadhaar,
                photo: values?.photo,
                isSibling: values?.isSibling,
                siblingId: values?.siblingId,
                previousAcademics: [
                    {
                        rollNo: values?.previousAcademics[0]?.rollNo,
                        class: values?.previousAcademics[0]?.class,
                        percentage: values?.previousAcademics[0]?.percentage,
                        yearOfPassing: values?.previousAcademics[0]?.yearOfPassing,
                        board: values?.previousAcademics[0]?.board,
                        medium: values?.previousAcademics[0]?.medium,
                        school: values?.previousAcademics[0]?.school,
                        schoolAddress: values?.previousAcademics[0]?.schoolAddress,
                        tcNo: values?.previousAcademics[0]?.tcNo,
                        description: values?.previousAcademics[0]?.description
                    }
                ],
                parents: values?.parents?.map(parent => ({
                    name: parent.name,
                    parentType: parent.parentType,
                    mobile: parent.mobile,
                    altMobile: parent.altMobile,
                    email: parent.email,
                    occupation: parent.occupation,
                    photo: parent.photo,
                    documents: parent.documents.map(doc => ({
                        documentNumber: doc.documentNumber,
                        documentType: doc.documentType,
                        documentUpload: doc.documentUpload
                    }))
                })),

                // [
                //     {
                //         name: "Ramesh Kumar",
                //         parentType: 1,
                //         mobile: "9876501234",
                //         altMobile: "9123409876",
                //         email: "ramesh.kumar@gmail.com",
                //         occupation: "Private Job",
                //         photo: "base64_father_photo",
                //         documents: [
                //             {
                //                 documentNumber: "ABCDE1234F",
                //                 documentType: 1,
                //                 documentUpload: "base64_pan_card"
                //             }
                //         ]
                //     }
                // ],
                studentDocuments: values?.studentDocuments?.map(doc => ({
                    documentNumber: doc.documentNumber,
                    documentType: doc.documentType,
                    documentUpload: doc.documentUpload,
                     sessionId: 2026,
                        yearId: 2026
                })),

                // [
                //     {
                //         documentNumber: "TC2023/458",
                //         documentType: 1,
                //         documentUpload: "base64_tc",
                //         sessionId: 2024,
                //         yearId: 2024
                //     }
                // ],
                otherDetail: {
                    transportRequired: true,
                    route: values?.otherDetail?.route,
                    busNo: values?.otherDetail?.busNo
                }
            }

            const response = await StudentRegister(payload);
            if (response?.success) {
                notify(response?.message, "success");
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="container-fluid">
            <Heading title="Student Registration" isBreadcrumb={false} />

            {/* ================= BASIC DETAILS CARD ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0  text-lg py-1 ml-2">
                        {/* <i className="fa fa-person-fill"></i> */}
                        Basic Information
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <ReactSelect
                            placeholderName="title"
                            respclass="col-md-2"
                            name="title"
                            dynamicOptions={[
                                { label: "Miss", value: "MISS" },
                                { label: "Mr", value: "MR" },
                                { label: "Ms", value: "MS" }
                            ]}
                            handleChange={handleSelect}
                            value={values.title?.value}
                        />
                        {/* <Input
                            className="form-control"
                            name="title"
                            lable="Title"
                            value={values.title}
                            onChange={handleChange}
                            respclass="col-md-2"
                        /> */}
                        <Input
                            className="form-control"
                            name="firstName"
                            lable="First Name"
                            value={values.firstName}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            className="form-control"
                            name="lastName"
                            lable="Last Name"
                            value={values.lastName}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"

                        />
                        <DatePicker
                            name="dateOfBirth"
                            lable="Date of Birth"
                            value={values.dateOfBirth}
                            handleChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        {/* <Input
                            className="form-control"
                            name="gender"
                            lable="Gender (1=Male, 2=Female)"
                            value={values.gender}
                            onChange={handleChange}
                            respclass="col-md-3"
                        /> */}
                        <ReactSelect
                            placeholderName="Gender"
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="gender"
                            dynamicOptions={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                                { label: "Other", value: "Other" }
                            ]}
                            handleChange={handleSelect}
                            value={values.gender?.value}
                        />
                        <Input
                            className="form-control"
                            name="phone"
                            lable="Mobile Number"
                            value={values.phone}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            className="form-control"
                            name="altPhone"
                            lable="Alternate Mobile"
                            value={values.altPhone}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            className="form-control"
                            name="email"
                            lable="Email Address"
                            value={values.email}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            className="form-control"
                            name="aadhaar"
                            lable="Aadhaar Number"
                            value={values.aadhaar}
                            onChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            className="form-control"
                            name="siblingId"
                            lable="Sibling ID (if applicable)"
                            value={values.siblingId}
                            onChange={handleChange}
                            respclass="col-md-4"
                        />
                    </div>
                </div>
            </div>

            {/* ================= ADDRESS CARD ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0  text-lg py-1 ml-2">
                        {/* <i className="bi bi-geo-alt-fill me-2"></i> */}
                        Address Details
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {Object.keys(values.address).map((key) => (
                            <Input
                                key={key}
                                className="form-control"
                                lable={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={values.address[key]}
                                onChange={(e) => handleNestedChange("address", key, e.target.value)}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= OTHER INFO CARD ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0  text-lg py-1 ml-2">
                        {/* <i className="bi bi-info-circle-fill me-2"></i> */}
                        Additional Information
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {Object.keys(values.otherInfo).map((key) => (
                            <Input
                                key={key}
                                className="form-control"
                                lable={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                value={values.otherInfo[key]}
                                onChange={(e) => handleNestedChange("otherInfo", key, e.target.value)}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= PREVIOUS ACADEMICS CARD ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0  text-lg py-1 ml-2">
                        {/* <i className="bi bi-book-fill me-2"></i> */}
                        Previous Academic Details
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {Object.keys(values.previousAcademics[0]).map((key) => (
                            <Input
                                key={key}
                                className="form-control"
                                lable={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                value={values.previousAcademics[0][key]}
                                onChange={(e) =>
                                    handleArrayChange("previousAcademics", 0, key, e.target.value)
                                }
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= PARENT DETAILS CARD (DYNAMIC) ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-secondary">
                    <div className="  text-white d-flex justify-content-between align-items-center w-100">
                        <h5 className="mb-0">
                            Parent/Guardian Details
                        </h5>

                        <button className="btn btn-light btn-sm" onClick={addParent}>
                            Add Parent
                        </button>
                    </div>
                </div>


                {/* <div className="w-100 col-12 card-header bg-secondary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
           
            Parent/Guardian Details
          </h5>
          <button className="btn btn-light btn-sm" onClick={addParent}>
       
            Add Parent
          </button>
        </div> */}
                <div className="card-body">
                    {values.parents.map((parent, parentIndex) => (
                        <div key={parentIndex} className="border rounded p-3 mb-3 position-relative">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-secondary mb-0">
                                    <i className="bi bi-person-badge me-2"></i>
                                    Parent {parentIndex + 1}
                                    {parent.parentType === 1 ? " (Father)" : parent.parentType === 2 ? " (Mother)" : " (Guardian)"}
                                </h6>
                                {values.parents.length > 1 && (

                                    <i className="bi bi-trash me-1 text-danger" onClick={() => removeParent(parentIndex)}

                                        style={{ cursor: "pointer" }}
                                    ></i>

                                    //   <button 
                                    //     className="btn btn-danger btn-sm" 
                                    //     onClick={() => removeParent(parentIndex)}
                                    //   >
                                    //     <i className="bi bi-trash me-1"   onClick={() => removeParent(parentIndex)}></i>
                                    //   </button>
                                )}
                            </div>

                            <div className="row g-3">
                                <Input
                                    className="form-control"
                                    lable="Name"
                                    value={parent.name}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "name", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Parent Type (1=Father, 2=Mother, 3=Guardian)"
                                    value={parent.parentType}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "parentType", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Mobile"
                                    value={parent.mobile}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "mobile", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Alt Mobile"
                                    value={parent.altMobile}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "altMobile", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Email"
                                    value={parent.email}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "email", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Occupation"
                                    value={parent.occupation}
                                    onChange={(e) => handleArrayChange("parents", parentIndex, "occupation", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                            </div>

                            {/* Parent Documents Section */}
                            <div className="mt-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong className="text-muted">
                                        <i className="bi bi-file-earmark-text me-2"></i>Documents
                                    </strong>
                                    <button
                                        // className="btn btn-outline-primary btn-sm" 
                                        className="btn btn-primary btn-lg"
                                        onClick={() => addParentDocument(parentIndex)}
                                    >
                                        {/* <i className="bi bi-plus me-1"></i> */}
                                        Add Document
                                    </button>
                                </div>

                                {parent.documents.map((doc, docIndex) => (
                                    <div key={docIndex} className="border-start border-3 border-primary ps-3 mb-2">
                                        <div className="row g-2 align-items-end">
                                            <Input
                                                className="form-control form-control-sm"
                                                lable="Document Number"
                                                value={doc.documentNumber}
                                                onChange={(e) => handleParentDocChange(parentIndex, docIndex, "documentNumber", e.target.value)}
                                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                            />
                                            <Input
                                                className="form-control form-control-sm"
                                                lable="Document Type (1=PAN, 2=Aadhaar)"
                                                value={doc.documentType}
                                                onChange={(e) => handleParentDocChange(parentIndex, docIndex, "documentType", e.target.value)}
                                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                            />
                                            <Input
                                                className="form-control form-control-sm"
                                                lable="Document Upload (Base64)"
                                                value={doc.documentUpload}
                                                onChange={(e) => handleParentDocChange(parentIndex, docIndex, "documentUpload", e.target.value)}
                                                respclass="col-md-4"
                                            />
                                            <div className="col-md-1">

                                                <i className="bi bi-trash me-1 text-danger pointer" onClick={() => removeParentDocument(parentIndex, docIndex)}
                                                    style={{ cursor: "pointer" }}
                                                ></i>

                                                {/* <button 
                          className="btn btn-danger btn-sm w-100" 
                          onClick={() => removeParentDocument(parentIndex, docIndex)}
                        >
                          <i className="bi bi-trash me-1 text-danger" onClick={() => removeParentDocument(parentIndex, docIndex)}></i>
                        </button> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {parent.documents.length === 0 && (
                                    <p className="text-muted small mb-0">No documents added yet</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= STUDENT DOCUMENTS CARD (DYNAMIC) ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark">
                    <div className="text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0  text-lg py-1 ml-2">
                            {/* <i className="bi bi-file-earmark-text-fill me-2">

            </i> */}
                            Student Documents
                        </h5>
                        <button className="btn btn-light btn-sm" onClick={addStudentDocument}>
                            {/* <i className="bi bi-plus-circle me-1"></i> */}
                            Add Document
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {values.studentDocuments.map((doc, index) => (
                        <div key={index} className="border rounded p-3 mb-3 bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-secondary mb-0">

                                    <i className="bi bi-file-text me-2"></i>Document {index + 1}
                                </h6>
                                {values.studentDocuments.length > 1 && (

                                    <i className="bi bi-trash me-1 text-danger"
                                        onClick={() => removeStudentDocument(index)}
                                        style={{ cursor: "pointer" }}
                                    ></i>


                                    //   <button 
                                    //     className="btn btn-danger btn-sm" 
                                    //     onClick={() => removeStudentDocument(index)}
                                    //   >
                                    //     <i className="bi bi-trash me-1"
                                    //      style={{ cursor: "pointer" }}
                                    //     ></i>

                                    //     Remove
                                    //   </button>
                                )}
                            </div>
                            <div className="row g-3">
                                <Input
                                    className="form-control"
                                    lable="Document Number"
                                    value={doc.documentNumber}
                                    onChange={(e) => handleArrayChange("studentDocuments", index, "documentNumber", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Document Type (1=TC, 2=Birth Cert)"
                                    value={doc.documentType}
                                    onChange={(e) => handleArrayChange("studentDocuments", index, "documentType", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                                <Input
                                    className="form-control"
                                    lable="Session ID"
                                    value={doc.sessionId}
                                    onChange={(e) => handleArrayChange("studentDocuments", index, "sessionId", e.target.value)}
                                    respclass="col-md-2"
                                />
                                <Input
                                    className="form-control"
                                    lable="Year ID"
                                    value={doc.yearId}
                                    onChange={(e) => handleArrayChange("studentDocuments", index, "yearId", e.target.value)}
                                    respclass="col-md-2"
                                />
                                <Input
                                    className="form-control"
                                    lable="Document Upload (Base64)"
                                    value={doc.documentUpload}
                                    onChange={(e) => handleArrayChange("studentDocuments", index, "documentUpload", e.target.value)}
                                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= TRANSPORT CARD ================= */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white">
                    <h5 className="mb-0  text-lg py-1 ml-2">
                        {/* <i className="bi bi-bus-front-fill me-2"></i> */}
                        Transport Details
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <Input
                            className="form-control"
                            lable="Route"
                            value={values.otherDetail.route}
                            onChange={(e) => handleNestedChange("otherDetail", "route", e.target.value)}
                            respclass="col-md-6"
                        />
                        <Input
                            className="form-control"
                            lable="Bus Number"
                            value={values.otherDetail.busNo}
                            onChange={(e) => handleNestedChange("otherDetail", "busNo", e.target.value)}
                            respclass="col-md-6"
                        />
                    </div>
                </div>
            </div>

            {/* ================= SUBMIT BUTTON ================= */}
            <div className="d-flex justify-content-end gap-2 mb-4">
                {/* <button className="btn btn-secondary btn-lg">
          <i className="bi bi-x-circle me-2"></i>Cancel
        </button> */}
                <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                    {/* <i className="bi bi-check-circle me-2"></i> */}
                    Registration
                </button>
            </div>
        </div>
    );
};

export default StudentRegistration;

