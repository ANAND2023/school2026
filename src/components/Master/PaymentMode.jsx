

import React, { act, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";

import Modal from "../modalComponent/Modal";
import { notify } from "../../utils/utils";
import { MasterCreatePaymentMode, MasterGetAllPaymentModes, Rolescreaterole, Rolesdeleterole, Rolesgetroles } from "../../networkServices/Admin";
import { Pencil, Trash2 } from "lucide-react";
import { CreateAcademicYearApi, GetAllAcademicYears, GetAllBranches } from "../../networkServices/AcademicYear";
import DatePicker from "../formComponent/DatePicker";
import ReactSelect from "../formComponent/ReactSelect";
import moment from "moment";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

function PaymentMode() {
    const localData = useLocalStorage("userData", "get");
    const [t] = useTranslation(); const initialData = {
        modeName: "",
        branchId: {},
        isOnline: { label: "Yes", value: "true" },
        requiresReferenceNo: { label: "Yes", value: "true" },
    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [branch, setBranch] = useState([]);
    const [handleModelData, setHandleModelData] = useState({});

    const [modalData, setModalData] = useState({});
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (name == "branchId") {
            getData(value?.value);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({ ...prev, [name]: value }));

    };
    const getAllBranch = async () => {
        const payload = {
            employeeId: "",
            organisationID: localData?.OrganizationId,
            isAll: 1
        };

        try {
            const res = await GetAllBranches(payload);
            if (res?.success) setBranch(res.data);
            else notify(res?.message, "error");
        } catch {
            notify("Error fetching branches", "error");
        }
    };

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSave = async () => {

        const Payload =

        {
            "context": {
                "orgId": localData?.OrganizationId,
                "branchId": values.branchId?.value ?? "",
            },
            "modeName":values?.modeName??"",
            "requiresReferenceNo": values?.requiresReferenceNo?.value== "true"?true:false,
            "isOnline": values?.isOnline?.value== "true"?true:false
        }

        try {
            const Response = await MasterCreatePaymentMode(Payload);
            if (Response?.success) {
                notify(Response?.message, "success");
                // setValues(initialData)
                // handleBindQuestions();
                getData(values.branchId?.value)
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
                // getData()
            } else {
                notify(Response?.message, "error");
            }
        } catch (error) {
            notify("Error saving reason", "error");
        }
    };
    const getData = async (ID) => {
const payload = {
  "orgId": localData?.OrganizationId,
  "branchId": ID ?? "",
  "isAll": 0
}
        try {
            const response = await MasterGetAllPaymentModes(payload);
            if (response?.success) {
                setTableData(response?.data)
            } else {
                notify(response?.message, "error");
                setTableData([])
            }
        } catch (error) {
            setTableData([])
            notify("Error saving reason", "error");
        }
    };

    useEffect(() => {
        // getData()
        getAllBranch()
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
                <Heading title={t("Payment Mode")} isBreadcrumb={false} />
                <div className="row p-2">
                    <ReactSelect
                        id="branchId"
                        name="branchId"
                        placeholderName="Select Branch"
                        dynamicOptions={branch?.map((ele) => ({
                            label: ele?.name,
                            value: ele?.id
                        }))}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        handleChange={handleSelect}
                        value={values.branchId}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="modeName"
                        name="modeName"
                        value={values?.modeName ? values?.modeName : ""}
                        // onChange={handleChange}
                        lable={t("Mode Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />


                    <ReactSelect
                        placeholderName={t("Is Online")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="isOnline"
                        name="isOnline"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                        ]}
                        handleChange={handleSelect}
                        value={values?.isOnline?.value}
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Requires Reference No")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="requiresReferenceNo"
                        name="requiresReferenceNo"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                        ]}
                        handleChange={handleSelect}
                        value={values?.requiresReferenceNo?.value}
                        requiredClassName="required-fields"
                    />
              
                    <button
                        onClick={handleSave}
                        className="btn btn-sm btn-primary"
                        // className="btn btn-outline-success"
                        type="button"
                    >
                        {t("Save")}
                    </button>
                   
                </div>
                <Tables
                    thead={[{ name: "Mode Name", }, { name: "isOnline" }, { name: "Requires Reference No" }, { name: "Action" }]}
                    tbody={tableData?.map((item, index) => (
                        {
                            modeName: item.modeName,
                            isOnline: item.isOnline===true?"Yes":"No",
                            requiresReferenceNo: item.requiresReferenceNo===true?"Yes":"No",

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

export default PaymentMode;
