

import React, { act, useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";

import {

    bloodBankSaveData,

} from "../../networkServices/blooadbankApi";
import Modal from "../../components/modalComponent/Modal";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import { CreateClass, CreateSubject, CreateSubjectClassMapping, GetAllClasses, GetAllSubjectClassMappings, GetAllSubjects } from "../../networkServices/AcademicYear";
import ReactSelect from "../formComponent/ReactSelect";

function SubjectClassMapping() {
    const [t] = useTranslation(); const initialData = {
        subject: {},
        class_Name: {},
        isMandatory: { label: "No", value: "false" },

    }
    const [classes, setClasses] = useState([]);
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [subject, setSubject] = useState([]);
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target
        // if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

        // } else {
        setValues((prev) => ({ ...prev, [name]: value }));
        // }
    };
    const getSubject = async () => {

        try {
            const response = await GetAllSubjects();
            if (response?.success) {
                setSubject(response?.data)
            } else {
                notify(response?.message, "error");
                setSubject([])
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const getClass = async () => {

        try {
            const response = await GetAllClasses();
            if (response?.success) {
                setClasses(response?.data)
            } else {
                notify(response?.message, "error");
                setTableData([])
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const getData = async () => {

        try {
            const response = await GetAllSubjectClassMappings();
            if (response?.success) {
                setTableData(response?.data)
            } else {
                notify(response?.message, "error");
                setTableData([])
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };

    useEffect(() => {
        getData()
        getSubject()
        getClass()
    }, [])

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload =

        {
            "classId": values?.class_Name?.value,
            "subjectId": values?.subject?.value,
            "isMandatory": values?.isMandatory?.value === "false" ? false : true
        }


        try {
            const Response = await CreateSubjectClassMapping(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
                getData()
            } else {
                notify(Response?.message, "error");
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
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };
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
                <Heading title={t("Subject Class Mapping")} isBreadcrumb={false} />

                <div className="row p-2">

                    <ReactSelect
                        placeholderName={t("Class")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="class_Name"
                        name="class_Name"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
                        handleChange={handleSelect}
                        value={values?.class_Name?.value}
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Subject")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="subject"
                        name="subject"
                        removeIsClearable={true}
                        // dynamicOptions={}
                        dynamicOptions={handleReactSelectDropDownOptions(subject, "subjectName", "id")}
                        handleChange={handleSelect}
                        value={values?.subject?.value}
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Is Mandatory")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="isMandatory"
                        name="isMandatory"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                        ]}
                        handleChange={handleSelect}
                        value={values?.isMandatory?.value}
                        requiredClassName="required-fields"
                    />
                    <button
                        onClick={handleSave}
                        className="btn btn-sm btn-primary"
                        type="button"
                    >
                        {t("Save")}
                    </button>
                    {/* <div className="col-12 text-right">
                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Class Add")}
                        </button>
                    </div> */}
                </div>



                <Tables
                    thead={[{ name: "Subject Name", }, { name: "Class Name" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            subjectName: item.subjectName,
                            className: item.className,

                            action: <>

                                <div
                                    // className="d-flex align-items-center justify-content-center gap-2"
                                    className="row gap-2"
                                >
                                    <button
                                        id="editBtn"
                                        onclick="handleEdit(item.id)"
                                        title="Edit"
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <i class=" bi-pencil-square"></i>
                                    </button>

                                    <button
                                        id="deleteBtn"
                                        onclick="handleDelete(item.id)"
                                        title="Delete"
                                    >
                                        <i class="bi-trash3"></i>
                                    </button>
                                </div>

                            </>,
                        }))}

                />
            </div>
        </>
    );
}

export default SubjectClassMapping;
