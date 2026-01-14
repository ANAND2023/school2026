

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
import { CreateSection, GetAllClasses, GetAllSections } from "../../networkServices/AcademicYear";
import ReactSelect from "../formComponent/ReactSelect";

function SectionMaster() {
    const [t] = useTranslation(); const initialData = {
        section_name: "",
        class_Name: { label: "1", value: "true" },
    }
    const [values, setValues] = useState(initialData);
    const [classes, setClasses] = useState([]);

    const [tableData, setTableData] = useState(
        []
    );
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e, type, limit = 9999999999999) => {
        const { name, value } = e.target

        setValues((prev) => ({ ...prev, [name]: value }));

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
            const response = await GetAllSections();
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
        getClass()
    }, [])


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload = {
            "sectionName": values?.section_name,
            "classId": values?.class_Name?.value
        }

        try {
            const Response = await CreateSection(Payload);
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
                <Heading title={t("Section Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control"
                        // className="form-control required-fields"
                        id="section_name"
                        name="section_name"
                        value={values?.section_name ? values?.section_name : ""}
                        // onChange={handleChange}
                        lable={t("Section Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <ReactSelect
                        placeholderName={t("Class")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="class_Name"
                        name="class_Name"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={[...handleReactSelectDropDownOptions(classes, "className", "id")]}
                        handleChange={handleSelect}
                        value={values?.class_Name?.value}
                        // requiredClassName="required-fields"
                    />
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">

                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Add Section")}
                        </button>
                    </div>
                </div>

                <Tables
                    thead={[{ name: "Section", }, { name: "Class", }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            sectionName: item.sectionName,
                            classId: item.classId,

                            action: <>
                                <div
                                    className="d-flex align-items-center justify-content-center gap-2"
                                // className="row gap-2"
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

export default SectionMaster;
