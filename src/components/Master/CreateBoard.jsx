

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
import { CreateBoards, CreateClass, GetAllBoards, GetAllClasses } from "../../networkServices/AcademicYear";

function CreateBoard() {
    const [t] = useTranslation(); const initialData = {
        boardName: "",
        description: "",

    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target
        // if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

        // } else {
            setValues((prev) => ({ ...prev, [name]: value }));
        // }
    };
    const getData = async () => {

        try {
            const response = await GetAllBoards();
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
    }, [])

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload = 
        // {
        //     "className": values?.class_name ?? "",
        //     "classOrder": Number(values?.Order ?? 0)
        // }
        {
  "boardName": values?.boardName,
  "description":values?.description
}

        try {
            const Response = await CreateBoards(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                setValues(initialData)
                 getData()
                // handleBindQuestions();
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
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
                <Heading title={t("Board")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="boardName"
                        name="boardName"
                        value={values?.boardName ? values?.boardName : ""}
                        // onChange={handleChange}
                        lable={t("Board Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="description"
                        name="description"
                        value={values?.description ? values?.description : ""}
                        // onChange={handleChange}
                        lable={t("description")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // isUpperCase={true}
                        onChange={(e) => handleChange(e)}
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
                    thead={[{ name: "Name", }, { name: "Description" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            boardName: item.boardName,
                            description: item.description,
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

export default CreateBoard;
