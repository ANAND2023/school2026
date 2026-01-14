

import React, { act, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Heading from "../../UI/Heading";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import Modal from "../../modalComponent/Modal";
import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
import { GetAllClasses, CreateSection, GetAllSections } from "../../../networkServices/AcademicYear";
import Tables from "../../UI/customTable";
import { AllFeeRateSchedule, GetAllItemMaster, InsertFeeRateSchedule } from "../../../networkServices/FeeMaster";

function RateScheduleByCalss() {
    const [t] = useTranslation(); const initialData = {
        rate: 0,
        class_Name: { label: "", value: "" },
        item_Name: { label: "Yes", value: "true" },
        isCurrent: { label: "Yes", value: "true" },
    }
    const [values, setValues] = useState(initialData);
    const [classes, setClasses] = useState([]);
    const [allItem, setAllItem] = useState([]);

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
              
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };


    const getData = async () => {

        try {
            const response = await AllFeeRateSchedule();
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

        const Payload =
        {
            "classId": values?.class_Name?.value,
            "sectionId": "cb0115fb-6dfa-4590-8c77-bffcd28e153f",
            "sessionId": "cb0115fb-6dfa-4590-8c77-bffcd28e153f",
            "itemId": values?.item_Name?.value,
            "rate": values?.rate,
            "isCurrent": values?.isCurrent?.value
        }

        try {
            const Response = await InsertFeeRateSchedule(Payload);
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
    const AllItemMaster = async () => {
        try {
            const res = await GetAllItemMaster();
            if (res?.success) {
                setAllItem(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
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
    useEffect(() => {
        AllItemMaster();
    }, []);
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
                <Heading title={t("Rate Schedule By Class")} isBreadcrumb={false} />

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
                    // requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("item")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="item_Name"
                        name="item_Name"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={[...handleReactSelectDropDownOptions(allItem, "name", "id")]}
                        handleChange={handleSelect}
                        value={values?.item_Name?.value}
                    // requiredClassName="required-fields"
                    />
                    <Input
                        type="number"
                        className="form-control"
                        // className="form-control required-fields"
                        id="rate"
                        name="rate"
                        value={values?.rate ? values?.rate : ""}
                        // onChange={handleChange}
                        lable={("Rate")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <ReactSelect
                        placeholderName={t("isCurrent")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="isCurrent"
                        name="isCurrent"
                        removeIsClearable={true}
                        // dynamicOptions={classes}
                        dynamicOptions={[
                            {
                                label: "Yes", value: "true"
                            },
                            {
                                label: "No", value: "false"
                            },
                        ]}
                        handleChange={handleSelect}
                        value={values?.isCurrent?.value}
                    // requiredClassName="required-fields"
                    />
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">

                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Save")}
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

export default RateScheduleByCalss;
