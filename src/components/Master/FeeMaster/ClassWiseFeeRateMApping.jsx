import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Heading from "../../UI/Heading";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";

import MultiSelectComp from "../../formComponent/MultiSelectComp";

import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
import {
    GetAllClasses,
} from "../../../networkServices/AcademicYear";

import {
    AllFeeRateSchedule,
    GetAllItemMaster,
    GetAllMonthType,
    GetClassMonthFeeDetails,
    InserUpdatetFeeRateSchedule,
    UpdateBulkItemClassMonthWise,
} from "../../../networkServices/FeeMaster";
import Tables from "../../UI/customTable";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

function ClassWiseFeeRateMApping() {
    const [t] = useTranslation();

    const initialData = {
        class_Name: { label: "", value: "" },
        Month: { label: "", value: "" },
        item: [],
    };
    const localData = useLocalStorage("userData", "get");
    const [values, setValues] = useState(initialData);
    const [classes, setClasses] = useState([]);
    const [allItem, setAllItem] = useState([]);
    const [allMonth, setAllMonth] = useState([]);
    const [tableData, setTableData] = useState([]);

    // 👇 table + rate data
    const [itemRates, setItemRates] = useState([]);

    /* ---------------- GET MASTER DATA ---------------- */

    const getClass = async () => {
        try {
            const res = await GetAllClasses();
            if (res?.success) setClasses(res?.data);
            else notify(res?.message, "error");
        } catch {
            notify("Failed to load classes", "error");
        }
    };

    const getItems = async () => {
        try {

            const res = await GetAllItemMaster(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) setAllItem(res?.data);
        } catch {
            notify("Failed to load items", "error");
        }
    };

    const getMonths = async () => {
        try {
            const res = await GetAllMonthType(localData?.OrganizationId, localData?.defaultCentre);
            if (res?.success) setAllMonth(res?.data);
        } catch {
            notify("Failed to load months", "error");
        }
    };
    const getData = async () => {

        try {
            const res = await AllFeeRateSchedule();
            if (res?.success) {
                setTableData(res?.data);
            }
            //   if (res?.success) setAllMonth(res?.data);
        } catch {
            notify("Failed to load months", "error");
        }
    };

    //   const getData = async (classId,monthTypeId) => {

    //     try {
    //       const res = await GetClassMonthFeeDetails(classId,monthTypeId);
    //       if(res?.success){
    //         setTableData(res?.data);
    //       }
    //     //   if (res?.success) setAllMonth(res?.data);
    //     } catch {
    //       notify("Failed to load months", "error");
    //     }
    //   };

    useEffect(() => {
        getClass();

        getMonths();
        getData()
    }, []);

    useEffect(() => {
        getItems();
    }, [localData?.OrganizationId, localData?.defaultCentre])

    /* ---------------- HANDLERS ---------------- */

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    // 🔥 Multi select → table bind
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });

        const mapped = selectedOptions.map((item) => ({
            itemId: item.code,
            itemName: item.name,
            rate: 0,
        }));

        setItemRates(mapped);
    };

    // 🔥 Rate change per row
    const handleRateChange = (index, value) => {
        const updated = [...itemRates];
        updated[index].rate = value;
        setItemRates(updated);
    };

    /* ---------------- SAVE ---------------- */

    const handleSave = async () => {
        // if (!values?.class_Name?.value || !values?.Month?.value) {
        //   notify("Class and Month are required", "error");
        //   return;
        // }

        if (itemRates.length === 0) {
            notify("Please select at least one item", "error");
            return;
        }

        // localData?.OrganizationId, localData?.defaultCentre

        const payload = {
            "classId": values.class_Name.value,
            "orgId": localData?.OrganizationId,
            "branchId": localData?.defaultCentre,
            "sessionId": "1",
            "feeItems": itemRates.map((item) => ({
                itemId: item.itemId,
                rate: Number(item.rate),
                "isCurrent": true
            })),


        }



        try {
            const res = await InserUpdatetFeeRateSchedule(payload);
            if (res?.success) {
                notify(res?.message, "success");
                setValues(initialData);
                setItemRates([]);
            } else {
                notify(res?.message, "error");
            }
        } catch {
            notify("Error while saving data", "error");
        }
    };

    return (
        <div className="card">
            <Heading title={t("Rate Schedule By Class")} isBreadcrumb={false} />

            <div className="row p-2">
                <ReactSelect
                    placeholderName={t("Class")}
                    searchable
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="class_Name"
                    dynamicOptions={handleReactSelectDropDownOptions(
                        classes,
                        "className",
                        "id"
                    )}
                    handleChange={handleSelect}
                    value={values?.class_Name?.value}
                />



                <MultiSelectComp
                    respclass="col-xl-4 col-md-6 col-sm-12 col-12"
                    name="item"
                    placeholderName={t("Items")}
                    dynamicOptions={allItem.map((ele) => ({
                        name: ele?.name,
                        code: ele?.id,
                    }))}
                    handleChange={handleMultiSelectChange}
                    value={values?.item}
                />

                <div className="col-xl-2 col-md-4 col-sm-6 col-12">
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
                thead={[
                    { name: "Item Name" },
                    { name: "Rate" },
                ]}
                tbody={itemRates.map((item, index) => ({
                    itemName: item.itemName,
                    rate: (
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.rate}
                            onChange={(e) =>
                                handleRateChange(index, e.target.value)
                            }
                        />
                    ),
                }))}
            />
            <Tables
                thead={[
                    { name: "Class Name" },
                    { name: "Item" },

                    { name: "Rate" },
                  
                ]}
                tbody={tableData.map((item, index) => ({
                    itemName: item.itemName,
                    unit: item.unit,
                    rate: item.rate,
                   

                }))}
            />
        </div>
    );
}

export default ClassWiseFeeRateMApping;




// import React from 'react'

// const ClassWiseFeeRateMApping = () => {
//   return (
//     <div>ClassWiseFeeRateMApping</div>
//   )
// }

// export default ClassWiseFeeRateMApping