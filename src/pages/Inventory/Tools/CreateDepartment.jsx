
import ReactSelect from "../../../components/formComponent/ReactSelect"
import Heading from "../../../components/UI/Heading"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
    GetBindDepartment,
    getEmployeeWise,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import {
    BindStoreRequisitionDepartment,
    GetAutoPurchaseRequestItemsApi,
    GetCategoryByStoreType,
    getCreateRequisition,
    GetStore,
    GetSubCategoryByCategory,
    PrintIndent,
} from "../../../networkServices/BillingsApi";
import {
    handleReactSelectDropDownOptions,
    notify,
    SaveCreateRequisitionPayload,
} from "../../../utils/utils";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { DDlRequisitionType } from "../../../utils/constant";
import { BindDepartmentReturnItems, BindStoreGroup, BindStoreItems, BindStoreSubCategory, PHARMACYStoreCreateReturnDeptIndentbindItemDetails, PHARMACYStoreCreateReturnDeptIndentBindItemsOPD, PHARMACYStoreCreateReturnDeptIndentSaveReturnRequest } from "../../../networkServices/InventoryApi";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";

const CreateDepartment = () => {

    const localData = useLocalStorage("userData", "get");
    const dispatch = useDispatch();
    const [t] = useTranslation();

    const [tableData, setTableData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [indentNumber, setIndentNumber] = useState("");
    const [showIndentModal, setShowIndentModal] = useState(false);


    const initialValues = {
        SubCategory: {},
        StoreType: { label: "Medical Store", value: "STO00001" },
        Department: {},
        Category: {},
        RequisitionOn: new Date(),
        RequisitionType: "1",
        Narration: "",
        itemId: {},
        centre: { label: 'MOHANDAI OSWAL HOSPITAL', value: "1" }

    };
    const [DropDownState, setDropDownState] = useState({

        BindStore: [],
        BindCategory: [],
        DepartmentList: [],
        BindSubCategory: [],
        ItemList: [],

    });
    const { GetEmployeeWiseCenter } = useSelector((state) => state?.CommonSlice);
    const [values, setValues] = useState({ ...initialValues });
    console.log("values", values)


    const handleSelect = async (name, value) => {
        debugger
        //         setValues((preV)=>({
        // ...preV,
        // Category:
        //         }))
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

    const handleReactSelect = (name, value) => {
        console.log("name", name, "value", value);
        console.log(value);
        setValues((val) => ({ ...val, [name]: value?.value || "" }));
        if (name === "StoreType") {
            // getBindCategory({ storeID: value?.value });
            getBindStoreRequisitionDepartment({ storetype: value?.value });
        }
        // if (name === "Category") {
        //     getBindSubcategory({ categoryID: value?.value });
        // }
    };


    const getBindStoreRequisitionDepartment = async (val) => {
        try {
            const response = await BindStoreRequisitionDepartment(val?.storetype);
            return response?.data;
        } catch (error) {
            console.error(error);
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

    const GetStoreList = async () => {

        try {
            const response = await GetStore();
            setDropDownState((val) => ({
                ...val,
                BindStore: handleReactSelectDropDownOptions(
                    response?.data,
                    "LedgerName",
                    "LedgerNumber",
                ),
            }));
        } catch (error) {
            console.error(error, "SomeThing Went Wrong");
        }
    };
    const BindItems = async () => {
        if(!values?.Department?.value){
            notify("Please Select Department","warn")
            return
        }
        const payload = {
            FromDept: values?.Department?.value,
            Subcategory: values?.SubCategory?.value,
            StoreType: values?.StoreType?.value,
            categoryId: values?.Category?.value,
            // Return/BindItems?FromDept=LSHHI17&Subcategory=0&StoreType=STO00001&categoryId=5
        }
        try {
            const response = await BindDepartmentReturnItems(payload);
            // const response = await BindStoreItems(payload);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    ItemList: handleReactSelectDropDownOptions(
                        response?.data,
                        "ItemName",
                        "ItemID",
                    ),
                }));
            }
            else {
                setDropDownState((val) => ({
                    ...val,
                    ItemList: []
                }));
                notify(response?.message, "warn")
            }

        } catch (error) {
            console.error(error, "SomeThing Went Wrong");
        }
    };
    const GetDepartmentList = async (storetype) => {

        try {
            const response = await BindStoreRequisitionDepartment(storetype);
            setDropDownState((val) => ({
                ...val,
                DepartmentList: handleReactSelectDropDownOptions(
                    response?.data,
                    "LedgerName",
                    "LedgerNumber",
                ),
            }));
        } catch (error) {
            console.error(error, "SomeThing Went Wrong");
        }
    };

    useEffect(() => {
        if (values?.SubCategory?.value) {
            BindItems()
        }

    }, [values?.SubCategory?.value])

    useEffect(() => {
        if (localData?.employeeID) {
            dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
        }
    }, [dispatch]);
    useEffect(() => {
        getBindCategory("STO00001")
        GetStoreList();
        GetDepartmentList();
        dispatch(GetBindDepartment());
        // FetchAllDropDown();

    }, []);

    const bindItemDetils = async () => {


        const payload = {
            DeptLedgerNo: values?.Department?.value,
            CentreID: Number(values?.centre?.value) || "",
            storetype: values?.StoreType?.value || "",
            itemID: Number(values?.itemId?.value),
            categoryID: Number(values?.Category?.value) || "0",
            subcategoryID: Number(values?.SubCategory?.value) || "0",

        }
        // const payload = {
        //     DeptLedgerNo: deptLedgerNo,
        //     CentreID: Number(values?.center) || "",
        //     deptLedgerNo: selectedDept?.value,
        //     storetype: values?.StoreType || "",
        //     itemID: Number(values?.itemId),
        //     categoryID: Number(values?.categoryID) || "0",
        //     subcategoryID: Number(values?.SubCategory) || "0",

        // }
        try {
            const response = await PHARMACYStoreCreateReturnDeptIndentbindItemDetails(payload)

            if (response?.success) {
                setTableData(response.data);
            } else {
                setTableData([]);
                notify(response?.message, "warn")
            }

        } catch (error) {
            console.error("Error fetching bindItemDetils:", error);
            setTableData([]);
        }
    }

    const saveItem = async () => {

        const payload = selectedItems?.map((ele) => ({
            stockID: ele?.StockID || "",
            itemID: values?.itemId?.value || "",
            subcategoryID: String(ele?.SubCategoryID) || "",
            itemName: ele?.ItemName || "",
            requestType: "Normal",
            narration: ele?.narration || "",
            centreID: values?.centre?.value || "1",
            qty: ele?.manualQty || "1",
            deptTo: values?.Department?.value || "LSHH",
            storeID: values?.StoreType?.value
        }))
        try {
            const response = await PHARMACYStoreCreateReturnDeptIndentSaveReturnRequest(payload);

            if (response?.success) {
                setIndentNumber(response?.data)
                setShowIndentModal(true);
                notify("Item saved successfully!", "success");
                setSelectedItems([]);
                setTableData([]);


                // setValues({
                //     itemId: "",
                //     center: "1",
                //     StoreType: "STO00001",
                //     Department: "LSHHI17",
                //     SubCategory: "",
                //     categoryID: "",
                //     RequisitionType: "1"
                // });
            }
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    return (

        <div className="card">
            <Heading isBreadcrumb={true} />
            <div className="row p-2">
                <ReactSelect
                    placeholderName={t("StoreType")}
                    id={"StoreType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name={"StoreType"}
                    dynamicOptions={DropDownState?.BindStore}
                    value={values?.StoreType?.value}
                    handleChange={handleSelect}
                />
                <ReactSelect
                requiredClassName="required-fields"
                    placeholderName={t("Center")}
                    id={"center"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                        return { label: ele.CentreName, value: ele.CentreID };
                    })}
                    name="center"
                    handleChange={handleSelect}
                    value={values?.centre?.value}
                />
                <ReactSelect
                requiredClassName="required-fields"
                    placeholderName={t("From Department")}
                    id={"Department"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={DropDownState?.DepartmentList}

                    name="Department"
                    handleChange={handleSelect}
                    value={values?.Department?.value}
                />
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
                <ReactSelect
                    placeholderName={t("Item")}
                    id={"itemId"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"itemId"}
                    dynamicOptions={DropDownState?.ItemList}

                    value={values?.itemId}
                    handleChange={handleSelect}
                    removeIsClearable={true}
                />
                {/* <ReactSelect
                    placeholderName={t("RequisitionType")}
                    id={"RequisitionType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={DDlRequisitionType}
                    name="RequisitionType"
                    handleChange={handleReactSelect}
                    value={values?.RequisitionType}
                /> */}
                

            </div>
          <div className="d-flex justify-content-end p-1">
                    <button
                        className="btn btn-sm btn-success "
                        onClick={bindItemDetils}
                    >
                        {t("Search")}
                    </button>
                </div>
            {tableData.length > 0 && (
                <div className="card">
                    <Heading isBreadcrumb={false} title={"Item Details"} />
                    {/* First Table - Search Results */}
                    <Tables
                        thead={[
                            "S.No",
                            "Item Name",
                            "Sub Category",
                            "Batch No",
                            "Expire Date",
                            "Current Stock",
                            "Indented Quantity",
                            "Indent No",
                            "Quantity",
                            "Action"
                        ]}
                        tbody={tableData?.map((ele, index) => ({
                            Sno: index + 1,
                            ItemName: ele?.ItemName ?? "N/A",
                            SubCategory: ele?.SubcategoryName ?? "N/A",
                            BatchNo: ele?.BatchNumber ?? "0",
                            ExpDate: ele?.MedExpiryDate ?? "N/A",
                            CurrentStock: ele?.AvailQty ?? 0,
                            IndentedQty: ele?.IndentedQty ?? 0,
                            IndentNo: ele?.IndentNo ?? "N/A",

                            Quantity: (
                                <input
                                    type="number"
                                    min="1"
                                    value={ele?.manualQty || ""}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        const updated = [...tableData];

                                        // max allowed = AvailQty - IndentedQty
                                        const maxQty = Math.max(0, (ele?.AvailQty ?? 0) - (ele?.IndentedQty ?? 0));

                                        if (value <= maxQty) {
                                            updated[index].manualQty = value;
                                        } else {
                                            updated[index].manualQty = maxQty; // clamp to max allowed
                                        }

                                        setTableData(updated);
                                    }}
                                    className="border border-gray-300 rounded px-2 py-1 w-20"
                                />
                            ),

                            Action: (
                                <button
                                    className="btn btn-success ml-2"
                                    disabled={!ele?.manualQty || ele?.manualQty <= 0} // disable if no qty
                                    onClick={() => {
                                        setSelectedItems((prev) => {
                                            // check itemID already exists
                                            const exists = prev.some((item) => item.StockID === ele.StockID);

                                            if (exists) {
                                                notify("This item is already added!", "warn");
                                                return prev; // return old state, no duplicate
                                            }

                                            return [...prev, { ...ele, manualQty: ele.manualQty || 0 }];
                                        });
                                    }}
                                >
                                    {t("Add Item")}
                                </button>
                            ),
                        }))}
                        style={{ maxHeight: "65vh" }}
                    />
                </div>
            )}


            {selectedItems.length > 0 && (
                <>
                    <div className="card">
                        <Heading isBreadcrumb={false} title={"Added Item List Details"} />
                        <Tables
                            thead={[
                                "S.No",
                                "Sub Category",
                                "Item Name",
                                "Batch No",
                                "Expiry Date",
                                "Quantity",
                                "Narration",
                                "Action"
                            ]}
                            tbody={selectedItems?.map((ele, index) => ({
                                Sno: index + 1,
                                SubCategory: ele?.SubcategoryName ?? "N/A",
                                ItemName: ele?.ItemName ?? "N/A",
                                BatchNo: ele?.BatchNumber ?? "0",
                                ExpDate: ele?.MedExpiryDate ?? "N/A",
                                Quantity: ele?.manualQty ?? "",
                                Narration: (
                                    <input
                                        type="text"
                                        value={ele?.narration || ""}
                                        onChange={(e) => {
                                            const updated = [...selectedItems];
                                            updated[index].narration = e.target.value;
                                            setSelectedItems(updated);
                                        }}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                ),

                                Action: (
                                    <i
                                        className="fa fa-trash ml-2 text-danger"
                                        onClick={() => {
                                            setSelectedItems((prev) =>
                                                prev.filter((item) => item.StockID !== ele.StockID) // remove by itemID
                                            );
                                        }}
                                    >

                                    </i>
                                )

                            }))}
                            style={{ maxHeight: "65vh" }}
                        />

                    </div>
                    <div className="d-flex justify-content-end">

                        <button
                            className="btn btn-success ml-2"
                            onClick={() => saveItem()}
                        >
                            {t("Save")}
                        </button>
                    </div>
                </>
            )}
            <Modal
                visible={showIndentModal}
                setVisible={setShowIndentModal}
                Header="Indent Created"
                modalWidth="30vw"
                buttonName="OK"
                handleAPI={() => setShowIndentModal(false)}
            >
                <div style={{ textAlign: "center" }}>
                    <h3>Record added successfully!</h3>
                    <p>Indent No.: <strong>{indentNumber}</strong></p>
                </div>
            </Modal>
        </div>
    )
}
export default CreateDepartment