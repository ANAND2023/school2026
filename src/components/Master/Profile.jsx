

import React, { act, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";
import Modal from "../modalComponent/Modal";
import { notify } from "../../utils/utils";
import { Rolescreaterole, Rolesdeleterole, Rolesgetroles } from "../../networkServices/Admin";
import ImageCaptureCrop from "../formComponent/ImageCaptureCrop";

function Profile() {
    const [t] = useTranslation();
     const initialData = {
        FullName: "",
        SchoolCode: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: "",
        Country: "",
        Phone: "",
        school_phone: "",
        school_alternate_phone: "",
        Email: "",  
        SchoolName:"",
        SchoolEmail:"",
    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState(
        [
            {
                Role: "Admission",
                descripiton: "Testing"
            },
            {
                Role: "Registration",
                descripiton: "Testing"
            },
            {
                Role: "Class",
                descripiton: "Testing"
            },
        ]
    );
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({ ...prev, [name]: value }));

    };


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload = {
            "name": values?.Role,
            "description": values?.descripiton
        }
        try {
            const Response = await Rolescreaterole(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
                // handleBindQuestions();
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const handleDelete = async (item) => {


        try {
            const Response = await Rolesdeleterole(item?.ID);
            if (Response?.success) {
                notify(Response?.message, "success");
                // setValues(initialData)
                // handleBindQuestions();
                getData()
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const getData = async () => {

        try {
            const response = await Rolesgetroles();
            if (response?.success) {
                // notify(Response?.message, "success");
                // setValues(initialData)
                // handleBindQuestions();
                // setTableData(response?.data)
            } else {
                notify(response?.message, "error");
                // setTableData([])    
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const handleCapitalLatter = (e) => {

        let event = { ...e }
        event.target.value = event.target.value.toUpperCase()
        handleChange(e)

    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={setIsOpen}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"button"}
                    buttons={handleModelData?.extrabutton}
                    buttonName={handleModelData?.buttonName}
                    modalData={modalData}
                    setModalData={setModalData}
                    footer={handleModelData?.footer}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}

            <div className="card p-1">
                <Heading title={t("Profile Master")} isBreadcrumb={false} />

                <div className="row p-2">
                  {/* <div className="col-2"> */}
                        {/* <div className="text-center"> */}
                            {/* <label className="form-label">Student Photo</label> */}
                            <ImageCaptureCrop
                                label="User Photo"
                                onImageCropped={(file) => handleImageProcessed(file, 'studentPhoto')}
                                initialImageUrl={typeof values.studentPhoto === 'string' ? values.studentPhoto : null}
                                aspectRatio={1}
                                previewSize={80}
                            />
                        {/* </div> */}
                    {/* </div> */}
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="FullName"
                        name="FullName"
                        value={values?.FullName ? values?.FullName : ""}
                        // onChange={handleChange}
                        lable={t("FullName")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="email"
                        className="form-control required-fields"
                        id="Email"
                        name="Email"
                        value={values?.Email ? values?.Email : ""}
                        // onChange={handleChange}
                        lable={t("Email")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Phone"
                        name="Phone"
                        value={values?.Phone ? values?.Phone : ""}
                        // onChange={handleChange}
                        lable={t("Phone")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Address"
                        name="Address"
                        value={values?.Address ? values?.Address : ""}
                        // onChange={handleChange}
                        lable={t("Address")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="City"
                        name="City"
                        value={values?.City ? values?.City : ""}
                        // onChange={handleChange}
                        lable={t("City")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="ZipCode"
                        name="ZipCode"
                        value={values?.ZipCode ? values?.ZipCode : ""}
                        // onChange={handleChange}
                        lable={t("ZipCode")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Country"
                        name="Country"
                        value={values?.Country ? values?.Country : ""}
                        // onChange={handleChange}
                        lable={t("Country")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="school_phone"
                        name="school_phone"
                        value={values?.school_phone ? values?.school_phone : ""}
                        // onChange={handleChange}
                        lable={t("School Phone")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="school_alternate_phone"
                        name="school_alternate_phone"
                        value={values?.school_alternate_phone ? values?.school_alternate_phone : ""}
                        // onChange={handleChange}
                        lable={t("School Alt Phone")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="SchoolName"
                        name="SchoolName"
                        value={values?.SchoolName ? values?.SchoolName : ""}
                        // onChange={handleChange}
                        lable={t("School Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="email"
                        className="form-control required-fields"
                        id="SchoolEmail"
                        name="SchoolEmail"
                        value={values?.SchoolEmail ? values?.SchoolEmail : ""}
                        // onChange={handleChange}
                        lable={t("School Email")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="email"
                        className="form-control required-fields"
                        id="schoolCode"
                        name="schoolCode"
                        value={values?.schoolCode ? values?.schoolCode : ""}
                        // onChange={handleChange}
                        lable={t("School Code")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="email"
                        className="form-control required-fields"
                        id="regNo"
                        name="regNo"
                        value={values?.regNo ? values?.regNo : ""}
                        // onChange={handleChange}
                        lable={t("School regNo")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                      <ImageCaptureCrop
                                label="School Logo"
                                onImageCropped={(file) => handleImageProcessed(file, 'studentPhoto')}
                                initialImageUrl={typeof values.studentPhoto === 'string' ? values.studentPhoto : null}
                                aspectRatio={1}
                                previewSize={80}
                                 respclass="col-xl-3 col-md-2 col-sm-4 col-12"
                            />
                             <ImageCaptureCrop
                                label="Principal Signature"
                                onImageCropped={(file) => handleImageProcessed(file, 'studentPhoto')}
                                initialImageUrl={typeof values.studentPhoto === 'string' ? values.studentPhoto : null}
                                aspectRatio={1}
                                previewSize={80}
                                 respclass="col-xl-3 col-md-2 col-sm-4 col-12"
                            />

                    <div className="col-12 text-right">
                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Add")}
                        </button>
                    </div>
                </div>
                {/* <Tables
                    thead={[{ name: "Roles", }, { name: "descripiton" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            Role: item.Role,
                            descripiton: item.descripiton,
                            action: <>
                                <i className="fa fa-edit mx-2" style={{ cursor: "pointer" }} title="Edit" onClick={() => setValues({ Role: item?.Role, descripiton: item?.descripiton })}></i>
                                <i className="fa fa-trash mx-2" style={{ cursor: "pointer" }} title="Delete" onClick={() => handleDelete(item)}></i>
                            </>,
                        }))}

                /> */}
            </div>
        </>
    );
}

export default Profile;
