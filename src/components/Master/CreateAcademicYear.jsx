

import React, { act, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";

import Modal from "../modalComponent/Modal";
import { notify } from "../../utils/utils";
import { Rolescreaterole, Rolesdeleterole, Rolesgetroles } from "../../networkServices/Admin";
import { Pencil, Trash2 } from "lucide-react";
import { CreateAcademicYearApi, GetAllAcademicYears } from "../../networkServices/AcademicYear";
import DatePicker from "../formComponent/DatePicker";
import ReactSelect from "../formComponent/ReactSelect";
import moment from "moment";

function CreateAcademicYear() {
    const [t] = useTranslation(); const initialData = {
        yearName: "",
        startDate: new Date(),
        endDate: new Date(),
        isCurrent: { label: "Yes", value: "true" },
    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState(
        [
            {
                Name: "Admission",
                descripiton: "Testing"
            },
            {
                Name: "Registration",
                descripiton: "Testing"
            },
            {
                Name: "Class",
                descripiton: "Testing"
            },
        ]
    );
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({ ...prev, [name]: value }));

    };


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {
        debugger
        const Payload =
        {
            "yearName": values?.yearName,
            "startDate": moment(values?.startDate).format("YYYY-MM-DD"),
            "endDate": moment(values?.endDate).format("YYYY-MM-DD"),
            "isCurrent": values?.isCurrent?.value === "true" ? true : false
        }

        try {
            const Response = await CreateAcademicYearApi(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
                // handleBindQuestions();
                getData()
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
            const response = await GetAllAcademicYears();
            if (response?.success) {

            } else {
                notify(response?.message, "error");

            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };

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
                <Heading title={t("Role Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="yearName"
                        name="yearName"
                        value={values?.yearName ? values?.yearName : ""}
                        // onChange={handleChange}
                        lable={t("Year Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                    <DatePicker
                        id="startDate"
                        width
                        name="startDate"
                        lable={t("Start Date")}
                        value={values?.startDate || new Date()}
                        handleChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        className="custom-calendar"
                        maxDate={values?.startDate}
                    />
                    <DatePicker
                        id="endDate"
                        width
                        name="endDate"
                        lable={t("End Date")}
                        value={values?.endDate || new Date()}
                        handleChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        className="custom-calendar"
                        maxDate={values?.endDate}
                    />

                    <ReactSelect
                        placeholderName={t("Is Current")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="isCurrent"
                        name="isCurrent"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                        ]}
                        handleChange={handleSelect}
                        value={values?.isCurrent?.value}
                        requiredClassName="required-fields"
                    />
                    {/* <div className="col-12 text-right"> */}
                    <button
                        onClick={handleSave}
                        // className="btn btn-sm btn-primary"
                        className="btn btn-outline-success"
                        type="button"
                    >
                        {t("Save")}
                    </button>
                    {/* </div> */}
                </div>
                <Tables
                    thead={[{ name: "Roles", }, { name: "descripiton" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            Name: item.Name,
                            descripiton: item.descripiton,
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

export default CreateAcademicYear;
