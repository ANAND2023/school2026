

import React, {  useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import { notify } from "../../utils/utils";
import { CreateClass, GetAllClasses } from "../../networkServices/AcademicYear";

function ClassMaster() {
    const [t] = useTranslation(); const initialData = {
        class_name: "",
        Order: "",
    }
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target
   
        setValues((prev) => ({ ...prev, [name]: value }));

    };
    const getData = async () => {

        try {
            const response = await GetAllClasses();
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

    const handleSave = async () => {

        const Payload = {
            "className": values?.class_name ?? "",
            "classOrder": Number(values?.Order ?? 0)
        }

        try {
            const Response = await CreateClass(Payload);
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
            
            <div className="card p-1">
                <Heading title={t("Class Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="class_name"
                        name="class_name"
                        value={values?.class_name ? values?.class_name : ""}
                        // onChange={handleChange}
                        lable={t("Class Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                    <Input
                        type="number"
                        className="form-control required-fields"
                        id="Order"
                        name="Order"
                        value={values?.Order ? values?.Order : ""}
                        // onChange={handleChange}
                        lable={t("Class Order")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleChange(e)}
                    />
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">
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
                            className: item.className,
                            classOrder: item.classOrder,
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

export default ClassMaster;
