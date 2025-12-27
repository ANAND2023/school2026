

import React, { act, useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";

import {

    bloodBankSaveData,

} from "../../networkServices/blooadbankApi";
import Modal from "../../components/modalComponent/Modal";
import { notify } from "../../utils/utils";
import { CreateClass, CreateSubject, GetAllClasses, GetAllSubjects } from "../../networkServices/AcademicYear";
import ReactSelect from "../formComponent/ReactSelect";

function Subject() {
    const [t] = useTranslation(); const initialData = {
        subjectCode: "",
        subjectName: "",
        isPractical:{ label: "Yes", value: "true" },

    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState(
        [
            {
                class_name: "First Class",
                Order: 1

            },
            {
                class_name: "2",
                Order: 2

            },
            {
                class_name: "3",
                Order: 3

            },
        ]
    );
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e, type, limit = 9999999999999) => {
        const { name, value } = e.target
        if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

        } else {
            setValues((prev) => ({ ...prev, [name]: value }));
        }
    };
    const getData = async () => {

        try {
            const response = await GetAllSubjects();
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
        // getData()
    }, [])

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload =
        {
  "subjectName": "string",
  "subjectCode": "string",
  "isPractical": true
}

        
        // {
        //     "className": values?.class_name ?? "",
        //     "classOrder": Number(values?.Order ?? 0)
        // }

        try {
            const Response = await CreateSubject(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
                handleBindQuestions();
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
                <Heading title={t("Subject Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="subjectName"
                        name="subjectName"
                        value={values?.subjectName ? values?.subjectName : ""}
                        // onChange={handleChange}
                        lable={t("Subject Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                    <Input
                        type="number"
                        className="form-control required-fields"
                        id="subjectCode"
                        name="subjectCode"
                        value={values?.subjectCode ? values?.subjectCode : ""}
                        // onChange={handleChange}
                        lable={t("Subject Code")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                     <ReactSelect
                                            placeholderName={t("Is Practical")}
                                            searchable={true}
                                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                            id="isPractical"
                                            name="isPractical"
                                            removeIsClearable={true}
                                            dynamicOptions={[
                                                { label: "Yes", value: "true" },
                                                { label: "No", value: "false" },
                                            ]}
                                            handleChange={handleSelect}
                                            value={values?.isPractical?.value}
                                            requiredClassName="required-fields"
                                        />

                    <div className="col-12 text-right">
                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Class Add")}
                        </button>
                    </div>
                </div>



                <Tables
                    thead={[{ name: "Roles", }, { name: "Order" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            class_name: item.class_name,
                            Order: item.Order,
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

export default Subject;
