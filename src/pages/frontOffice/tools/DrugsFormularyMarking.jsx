import React, { useEffect, useState } from 'react'
import { GetCategoryByStoreType, GetSubCategoryByCategory, IPDBillingStatusLoadItems } from '../../../networkServices/BillingsApi';
import { AutoComplete } from 'primereact/autocomplete';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { BillingToolModifyPrPoFlag } from '../../../networkServices/Tools';
import { notify } from '../../../utils/ustil2';
import { BindStoreItems } from '../../../networkServices/InventoryApi';

const DrugsFormularyMarking = () => {
    const initialValues = {
        Category: {},
        SubCategory: {},
        item: [],
        Status: { label: "Yes", value: "1" }
    }
    const [values, setValues] = useState({ ...initialValues });
    console.log("values", values)
    const [item, setItem] = useState("");
    const [newRowData, setNewRowData] = useState([]);
    console.log("newRowData", newRowData)
    const [stockShow, setStockShow] = useState([]);
    const [DropDownState, setDropDownState] = useState({

        BindStore: [],
        BindCategory: [],
        DepartmentList: [],
        BindSubCategory: [],
        ItemList: [],

    });
    const [t] = useTranslation();
    const itemTemplate = (item) => {
        //
        return (
            <div className="p-clearfix">
                <div style={{ float: "left", fontSize: "12px", width: "20%" }}>
                    {item?.TypeName}
                </div>
            </div>
        );
    };
    const handleSelect = async (name, value) => {
    
        if (name === "StoreType") {
            getBindCategory(value?.value)
            GetDepartmentList(value?.value)
        }
        if (name === "Category") {
            getBindSubCategoryList(value?.value)

        }
        setValues((preV) => (
            {
                ...preV,
                [name]: value
            }
        ))
    }
    const handleSelectRow = (e) => {
        const { value } = e;
        setNewRowData((prevData) => {
            if (prevData.some((item) => item.ItemID === value.ItemID)) {
                return prevData;
            }
            return [value];
            //   return [...prevData, value];
        });
        // setItem("");
    };
    const search = async (event) => {
if(!values?.SubCategory?.value){
    notify("Please Select SubCategory","warn")
    return
}
        const ItemName = event?.query;
        const payload = {
            CategoryID: "",
            // CategoryID: values?.Category?.value??"0",
            SubCategoryID:
                values?.SubCategory?.value ?? "",
            // ? String(values?.subCategory?.map((val) => `${val?.code}`).join(","))
            // : "",
            searchType: event?.query,
        };



        try {
            if (ItemName?.length > 2) {
                  const filteredData = await BindStoreItems(values?.SubCategory?.value, event?.query);
                
                // const filteredData = await IPDBillingStatusLoadItems(payload);
                console.log(
                    "data",
                    filteredData?.data?.map((ele) => ({
                        TypeName: ele.TypeName,
                        ItemID: ele.ItemID,
                    }))
                    // filteredData?.data?.map((ele) => ({
                    //     TypeName: ele.typeName,
                    //     ItemID: ele.item_ID,
                    // }))
                );
                setStockShow(
                    filteredData?.data?.map((ele) => ({
                        TypeName: ele.TypeName,
                        ItemID: ele.ItemID,
                        // TypeName: ele.typeName,
                        // ItemID: ele.item_ID,
                    }))
                );
            } else {
                setStockShow([]);
            }
        } catch (error) {
            setStockShow([]);
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getBindCategory = async (storeID) => {
        try {
            const response = await GetCategoryByStoreType(storeID);
            setDropDownState((val) => ({
                ...val,
                BindCategory: handleReactSelectDropDownOptions(
                    response?.data,
                    "name",
                    "categoryID",
                ),
            }));
        } catch (error) {
            console.error(error, "SomeThing Went Wrong");
        }
    };
    const getBindSubCategoryList = async (categoryID) => {
        try {
            const response = await GetSubCategoryByCategory(categoryID);
            setDropDownState((val) => ({
                ...val,
                BindSubCategory: handleReactSelectDropDownOptions(
                    response?.data,
                    "name",
                    "subCategoryID",
                ),
            }));
        } catch (error) {
            console.error(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        getBindCategory("STO00001")
        //  getBindCategory()
    }, [])
    const HandleSave=async()=>{
        if(newRowData?.length<1){
            notify("Please Select Item","warn")
            return
        }
        if(!values?.Status?.value){
            notify("Please Select Status","warn")
            return
        }
        const payload={
             "itemId": Number(newRowData[0]?.ItemID),
             "isPrPo": Number(values?.Status?.value)

        }
try {
    const response=await BillingToolModifyPrPoFlag(payload)
    if(response?.success){
        notify(response?.message,"success")
        setNewRowData([])
        setItem("")
    }
    else{
              notify(response?.message,"error")
    }
} catch (error) {
    console.log("error",error)
}
    }
    return (
        <div className="card patient_registration">
            <Heading
                title={t("card patient_registration border")}
                isBreadcrumb={true}
            />
            <div className="row  p-2">

                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Category")}
                    id={"Category"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"Category"}
                    dynamicOptions={DropDownState?.BindCategory}
                    value={values?.Category}
                    handleChange={handleSelect}

                />
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Sub Category")}
                    id={"SubCategory"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"SubCategory"}
                    dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.BindSubCategory]}

                    value={values?.SubCategory?.value}
                    handleChange={handleSelect}

                />
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                    <AutoComplete
                        style={{ width: "100%" }}
                        value={item}
                        suggestions={Array.isArray(stockShow) ? stockShow : []}
                        completeMethod={search}
                        className="w-100 "
                        onSelect={(e) => handleSelectRow(e)}
                        id="searchtest"
                        onChange={(e) => {
                            const data =
                                typeof e.value === "object" ? e?.value?.TypeName : e.value;
                            setItem(data);
                            // search(data);
                            setValues({ ...values, TypeName: data });
                        }}
                        itemTemplate={itemTemplate}
                    />
                    <label htmlFor={"searchtest"} className="lable searchtest">
                        {t(" Search Items")}
                    </label>
                </div>
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Status")}
                    id={"Status"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"Status"}
                    dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" },]}

                    value={values?.Status?.value}
                    handleChange={handleSelect}

                />
                <div className=" d-flex justify-content-end">
                    <button className="btn btn-sm btn-primary d-flex justify-items-end" onClick={HandleSave}>
                        {t("Save")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DrugsFormularyMarking