import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { createcategory, GetAllCategory, GetAllMonthType, GetAllSubCategory, InsertMonthTypes, InsertSubCategory, updatecategory, UpdateSubCategory } from "../../../networkServices/FeeMaster";
import ReactSelect from "../../formComponent/ReactSelect";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const InsertMonthType = () => {
    const initialData = {

        Month: "",
        Type: {
            value: "",
            label: "",
        },
    };

    const localData = useLocalStorage("userData", "get");
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleSelect = (name, option) => {
        setValues((prev) => ({ ...prev, [name]: option }));
    };

    /* ================= CREATE / UPDATE ================= */
    const handleSave = async () => {

        const payload =
        {
            "name": values?.Month,
            "schoolTypeId": values?.Type?.value,
            "OrgId": localData?.OrganizationId,
            "branchId": localData?.defaultCentre
        }


        const update = {
            "id": values.id,
            "name": values?.subCategoryName,
            "displayName": values.displayName,
            "OrgId": localData?.OrganizationId,
            "branchId": localData?.defaultCentre
        }

        try {
            const res = isEdit
                ? await UpdateSubCategory(update)
                : await InsertMonthTypes(payload);

            if (res?.success) {
                notify(res?.message, "success");
                AllMonthType()

                setValues((preV) => ({
                    ...preV,
                    Month: "",

                }));
                setIsEdit(false);
            } else {
                notify(res?.message || res?.data?.message, "error");
            }
        } catch {
            notify("Something went wrong", "error");
        }
    };

    const getAllCategory = async () => {
        try {
            const res = await GetAllCategory(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) {
                setAllCategory(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };
    const AllMonthType = async () => {
        try {
            const res = await GetAllMonthType(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) {
                setTableData(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };

    /* ================= EDIT ================= */
    const handleEdit = (item) => {
        setValues({
            id: item.id,
            //   categoryName: item.id,
            displayName: item.displayName,
            subCategoryName: item.name,
            //   remarks: item.remarks
        });
        setIsEdit(true);
    };

    useEffect(() => {
        getAllCategory();
        AllMonthType();
    }, [localData?.OrganizationId, localData?.defaultCentre]);

    return (
        <div className="card p-2">
            <Heading title="Month/Semester Master" isBreadcrumb={false} />

            {/* ================= FORM ================= */}
            <div className="row p-2">
                <ReactSelect
                    placeholderName="Type"
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    name="Type"
                    dynamicOptions={[
                        { label: "School", value: "2" }, { label: "College", value: "1" },
                    ]}
                    handleChange={handleSelect}
                    value={values.Type}
                />
                <Input
                    name="Month"
                    placeholder=""
                    value={values.Month}
                    lable="Month"
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    className="form-control"
                    onChange={handleChange}
                />

                {/* <Input
                    name="displayName"
                    value={values.displayName}
                    placeholder=""
                    lable="Display Name"
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    className="form-control"
                    onChange={handleChange}
                />
 */}


                <div
                    className="col-xl-1 col-md-4 col-sm-6 col-12 text-end">
                    <button className="btn btn-sm btn-primary" onClick={handleSave}>
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <Tables
                thead={[
                    { name: "Month Name" },


                    { name: "Action" }
                ]}
                tbody={tableData.map((item) => ({

                    name: item.name,


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
    );
};

export default InsertMonthType;
