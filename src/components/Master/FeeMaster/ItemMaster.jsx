import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { GetAllItemMaster, GetAllSubCategory, ItemInsertItemMaster, UpdateItemMaster, } from "../../../networkServices/FeeMaster";
import ReactSelect from "../../formComponent/ReactSelect";
import { use } from "react";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ItemMaster = () => {
    const initialData = {
        id: null,
        item: "",
        displayName: "",
        subCategory: {},
        unit: "1"
    };

    const localData = useLocalStorage("userData", "get");
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [subCategory, setSubCategory] = useState([]);

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
        if (!values.displayName) {
            notify("Category Name & Display Name required", "error");
            return;
        }

        const payload =
        {
            "subCategoryId": values?.subCategory?.value,
            "name": values?.item,
            "displayName": values?.displayName,
            "unit": values?.unit,
            "BranchId": localData?.defaultCentre,
            "OrgId": localData?.OrganizationId
        }


        const update = {
            "name": values?.item,
            "displayName": values?.displayName,
            "unit": values?.unit,
            "id": values.id,
            "BranchId": localData?.defaultCentre,
            "OrgId": localData?.OrganizationId
        }

        try {
            const res = isEdit
                ? await UpdateItemMaster(update)
                : await ItemInsertItemMaster(payload);

            if (res?.success) {
                notify(res?.message, "success");
                AllItemMaster()
                setValues(initialData);
                setIsEdit(false);
            } else {
                notify(res?.message, "error");
            }
        } catch {
            notify("Something went wrong", "error");
        }
    };


    const AllSubCategory = async () => {
        try {
            const res = await GetAllSubCategory(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) {
                setSubCategory(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };
    const AllItemMaster = async () => {
        try {
            const res = await GetAllItemMaster(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) {
                setTableData(res?.data);
            }
        } catch {
            notify("Failed to load categories", "error");
        }
    };


    const handleEdit = (item) => {
        setValues({
            id: item.id,
            //   categoryName: item.id,
            displayName: item.displayName,
            item: item.name,
            subCategory: item.subCategoryId,
            unit: item.unit,
            //   remarks: item.remarks
        });
        setIsEdit(true);
    };

    useEffect(() => {

    }, []);
    useEffect(() => {
        AllItemMaster()

        AllSubCategory();

    }, [localData?.OrganizationId, localData?.defaultCentre]);

    return (
        <div className="card ">
            <Heading title="Item Master" isBreadcrumb={false} />

            {/* ================= FORM ================= */}
            <div className="row p-2">
                <ReactSelect
                    placeholderName="Sub Category"
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    name="subCategory"
                    dynamicOptions={handleReactSelectDropDownOptions(subCategory, "name", "id")}
                    handleChange={handleSelect}
                    value={values.subCategory}
                />
                <Input
                    name="item"
                    placeholder=""
                    value={values.item}
                    lable="Item Name"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    className="form-control"
                    onChange={handleChange}
                />

                <Input
                    name="displayName"
                    value={values.displayName}
                    placeholder=""
                    lable="Display Name"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    className="form-control"
                    onChange={handleChange}
                />
                <Input
                    text="number"
                    name="unit"
                    value={values.unit}
                    placeholder=""
                    lable="Unit"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    className="form-control"
                    onChange={handleChange}
                />



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

                    { name: "Sub Category Name" },

                    { name: "Item Name" },
                    { name: "Display Name" },
                    { name: "Unit" },

                    { name: "Action" }
                ]}
                tbody={tableData.map((item) => ({
                    subCategory: item.subCategoryId,
                    item: item.name,
                    displayName: item.displayName,
                    unit: item.unit,

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

export default ItemMaster;
