

import React, { act, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";

import Modal from "../modalComponent/Modal";
import { notify } from "../../utils/utils";
import { Rolescreaterole, Rolesdeleterole, Rolesgetroles } from "../../networkServices/Admin";
import { Pencil, Trash2 } from "lucide-react";

function User() {
    const [t] = useTranslation(); const initialData = {
        Name: "",
        descripiton: "Testing"
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
    const handleChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({ ...prev, [name]: value }));

    };


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {
        debugger
        const Payload = {
            "name": values?.Name,
            "description": values?.descripiton
        }

        try {
            const Response = await Rolescreaterole(Payload);
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
            const response = await Rolesgetroles();
            if (response?.success) {

            } else {
                notify(response?.message, "error");

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
                <Heading title={t("Role Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Name"
                        name="Name"
                        value={values?.Name ? values?.Name : ""}
                        // onChange={handleChange}
                        lable={t("Name")}
                        placeholder=" "
                        respclass="col-5"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="descripiton"
                        name="descripiton"
                        value={values?.descripiton ? values?.descripiton : ""}
                        // onChange={handleChange}
                        lable={t("descripiton ")}
                        placeholder=" "
                        respclass="col-5"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
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

export default User;
