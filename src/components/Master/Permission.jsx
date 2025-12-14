

import React, { act, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";

import Modal from "../modalComponent/Modal";
import { notify } from "../../utils/utils";
import { Permissionscreatepermission, Permissionsdelete, Permissionsgetallpermissions } from "../../networkServices/Admin";

function Permission() {
    const [t] = useTranslation(); const initialData = {
        Role: "",
        descripiton: "Testing"
    }
    const [isEdit, setIsEdit] = useState(false);
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
            const Response = await Permissionscreatepermission(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
               
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const handleDelete = async (item) => {


        try {
            const Response = await Permissionsdelete(item?.ID);
            if (Response?.success) {
                notify(Response?.message, "success");
                
                getData()
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const handleUpdate = async (item) => {
        setIsEdit(true);
setValues({ Role: item?.Role, descripiton: item?.descripiton })

        // try {
        //     const Response = await Permissionsdelete(item?.ID);
        //     if (Response?.success) {
        //         notify(Response?.message, "success");
                
        //         getData()
        //     } else {
        //         notify(Response?.message, "error");
        //     }
        // } catch (error) {
        //     notify("Error saving reason", "error");
        // }
    };
    const getData = async () => {

        try {
            const response = await Permissionsgetallpermissions();
            if (response?.success) {
            //    setTableData(response?.data)
            } else {
                notify(response?.message, "error");
                    //  setTableData([])
            }
        } catch (error) {
            notify("Error saving reason", "error");
            // setTableData([])
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
                <Heading title={t("Permission Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Role"
                        name="Role"
                        value={values?.Role ? values?.Role : ""}
                        // onChange={handleChange}
                        lable={t("Role ")}
                        placeholder=" "
                        respclass="col-5"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                    />

                   
                    {
                        isEdit ?<div className="col-12 text-right mt-2">
                             <button
                            // onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Update")}
                        </button>
                        <button
                            onClick={() => { setIsEdit(false); setValues(initialData); }}
                            className="btn btn-sm btn-secondary"
                            type="button"
                        >
                            {t("Cancel Edit")}
                        </button>
                    </div>: <div className="col-12 text-right">
                        <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Save")}
                        </button>
                    </div>
                    }
                </div>
                <Tables
                    thead={[{ name: "Roles", }, { name: "descripiton" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            Role: item.Role,
                            descripiton: item.descripiton,
                            action: <>
                                <i className="fa fa-edit mx-2" style={{ cursor: "pointer" }} title="Edit" onClick={() => handleUpdate()}></i>
                                <i className="fa fa-trash mx-2" style={{ cursor: "pointer" }} title="Delete" onClick={() => handleDelete(item)}></i>
                            </>,
                        }))}

                />
            </div>
        </>
    );
}

export default Permission;
