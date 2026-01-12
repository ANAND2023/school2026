

import React, { act, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../UI/Heading";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import Modal from "../../modalComponent/Modal";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { CreateSection, GetAllClasses, GetAllSections } from "../../../networkServices/AcademicYear";
import { AllFeeRateSchedule, FeeRateSchedules, GetAllItemMaster } from "../../../networkServices/FeeMaster";
import { number } from "yup";

function FeeRateSchedule() {
    const [t] = useTranslation(); const initialData = {
        Section: {},
        class_Name: {},
        item: {},
        isCurrent: { label: "Yes", value: "true" },
        rate: "",
    }
    const [values, setValues] = useState(initialData);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [items, setItems] = useState([]);

    const [tableData, setTableData] = useState(
        []
    );
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e) => {
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

            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };


    const getAllSection = async () => {

        try {
            const response = await GetAllSections();
            if (response?.success) {
                setSections(response?.data)
            } else {
                notify(response?.message, "error");
                setSections([])
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };

    const AllItemMaster = async () => {
        try {
            const res = await GetAllItemMaster();
            if (res?.success) {
                setItems(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };
    const FeeRateSchedule = async () => {
        try {
            const res = await AllFeeRateSchedule();
            debugger
            if (res?.success) {
                setTableData(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };
    useEffect(() => {
        getAllSection()
        AllItemMaster()
        getClass()
        FeeRateSchedule()
    }, [])


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload =
        {
            "classId": values?.class_Name?.value,
            "sectionId": values?.Section?.value,
            "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "itemId": values?.item?.value,
            "rate": Number(values?.rate),
            "isCurrent": values?.isCurrent?.value === "true" ? true : false
        }
        try {
            const Response = await FeeRateSchedules(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                // setValues(initialData)
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
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Section")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Section"
                        name="Section"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={[...handleReactSelectDropDownOptions(sections, "sectionName", "id")]}
                        handleChange={handleSelect}
                        value={values?.Section?.value}
                    // requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("item")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="item"
                        name="item"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={[...handleReactSelectDropDownOptions(items, "name", "id")]}
                        handleChange={handleSelect}
                        value={values?.item?.value}
                    // requiredClassName="required-fields"
                    />
                    <Input
                        type="number"
                        className="form-control required-fields"
                        id="rate"
                        name="rate"
                        value={values?.rate ? values?.rate : ""}
                        // onChange={handleChange}
                        lable={("Rate")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <ReactSelect
                        placeholderName={("isCurrent")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="isCurrent"
                        name="isCurrent"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" }
                        ]}
                        // dynamicOptions={[...handleReactSelectDropDownOptions(isCurrents, "name", "id")]}
                        handleChange={handleSelect}
                        value={values?.isCurrent?.value}
                    // requiredClassName="required-fields"
                    />
                    <button
                        onClick={handleSave}
                        className="btn btn-sm btn-primary"
                        type="button"
                    >
                        {t("Save")}
                    </button>
                </div>

                <Tables
                    thead={[{ name: "Section", }, { name: "Class", }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            sectionName: item.sectionName,
                            classId: item.classId,

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

export default FeeRateSchedule;
