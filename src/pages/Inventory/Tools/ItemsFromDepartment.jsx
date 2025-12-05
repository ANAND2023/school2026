
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
    GetCategoryByStoreType,
    GetStore,
    GetSubCategoryByCategory,
    PrintIndent,
} from "../../../networkServices/BillingsApi";
import {
    handleReactSelectDropDownOptions,
    notify,
    SaveCreateRequisitionPayload,
} from "../../../utils/utils";
import { DDlRequisitionType } from "../../../utils/constant";
import { BindStoreGroup, BindStoreItems, BindStoreSubCategory, PHARMACYAssetReturnStoreIndentSaveReturnIndent, PHARMACYAssetReturnStoreIndentSearchReturnIndent, PHARMACYAssetReturnStoreIndentSearchReturnIndentDetails, PHARMACYStoreCreateReturnDeptIndentBindItemsOPD, } from "../../../networkServices/InventoryApi";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import moment from "moment/moment";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import Modal from "../../../components/modalComponent/Modal";

const ItemsFromDepartment = () => {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const localData = useLocalStorage("userData", "get");
    const dispatch = useDispatch();
    const [t] = useTranslation();
    let { deptLedgerNo } = useLocalStorage("userData", "get");
    const [tableData, setTableData] = useState([]);
    const [detailTableData, setDetailTableData] = useState([]);

    const [isSearched, setIsSearched] = useState(false);
    const [showSalesNoModal, setSalesNoModal] = useState(false);
    const [salesNo, setSalesNo] = useState(null);

    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        StoreType: "STO00001",
        center: "1",
        Department: "LSHHI17",
        itemId: "",
        centreID: "",
        storetype: "",
        RequisitionType: "1",
        indentNo: "",
        status: "1",
    };
    const [DropDownState, setDropDownState] = useState({
        bindStore: [],
        category: [],
        bindcategory: [],
        bindgroup: [],
        subcategory: [],
        departments: [],
        binditem: [],
    });
    const { GetEmployeeWiseCenter } = useSelector((state) => state?.CommonSlice);
    const [values, setValues] = useState({ ...initialValues });
    // console.log("  values?.StoreType",  values?.StoreType)

    // console.log(values?.Department);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSelect = async (name, value) => {
        console.log("Selected:", name, value);

        let updatedPayload = { ...values, [name]: value?.value };

        setValues(updatedPayload);
    };

    console.log("SetValue's value", values);

    const GetBindStoreID = async () => {
        try {
            const response = await GetStore();
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindStoreRequisitionDepartment = async (val) => {
        try {
            const response = await BindStoreRequisitionDepartment(val?.storetype);
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindCategory = async (val) => {
        try {
            const response = await GetCategoryByStoreType(val?.storeID);
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindSubcategory = async (val) => {
        try {
            const response = await GetSubCategoryByCategory(val?.categoryID);
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const FetchAllDropDown = async () => {
        try {
            const [BindGetStore, BindCategory, BindSubCategory, BindDepartment] =
                await Promise.all([
                    GetBindStoreID(),
                    getBindCategory({
                        storeID: values?.StoreType,
                    }),
                    getBindSubcategory({
                        categoryID: values?.Category,
                    }),
                    getBindStoreRequisitionDepartment({
                        storetype: values?.StoreType,
                    }),
                ]);

            const dropDownData = {
                bindStore: handleReactSelectDropDownOptions(
                    BindGetStore,
                    "LedgerName",
                    "LedgerNumber"
                ),

                departments: handleReactSelectDropDownOptions(
                    BindDepartment,
                    "LedgerName",
                    "LedgerNumber"
                ),
            };

            setDropDownState(dropDownData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (localData?.employeeID) {
            dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
        }
    }, [dispatch]);


    useEffect(() => {
        dispatch(GetBindDepartment());
        FetchAllDropDown();
    }, []);

    const getBindGroup = async () => {
        try {
            const response = await BindStoreGroup(values?.Department);
            setDropDownState((prevState) => ({
                ...prevState,
                bindcategory: response.data,
            }));
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (values?.Department) {
            getBindGroup();
        }
    }, [values?.Department]);


    const searchReturnItemIndent = async () => {

        setIsSearched(true); //////////////////////////////////////sd////////
        console.log("deptttttttttttttttttttttkkk", localData)
        console.log("dlegernoooooooooooooooooooooo", deptLedgerNo)
        const payload =
        {

            fromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
            todate: moment(values?.toDate).format("YYYY-MM-DD"),
            fromdeptledgerno: values?.Department || "",
            requesttype: "Normal",
            indentno: values?.indentNo || "",
            status: values?.status,
            fromcentreid: String(values.center) || "",
            storeledgerNo: values?.StoreType || ""
        }
        //         {
        //     fromdate: "2025-06-10",
        //     todate: "2025-08-16",
        //     fromdeptledgerno: "LSHHI57",
        //     requesttype: "Normal",
        //     indentno: "MIRN/25-26/000017",
        //     status: "1",    
        //     fromcentreid: "1",
        //     storeledgerNo: "STO00001"
        // }
        try {
            const response = await PHARMACYAssetReturnStoreIndentSearchReturnIndent(payload);
            if (response?.data && response.data.length > 0) {
                setTableData(response.data);
            } else {
                notify(response?.message,"warn")
                setTableData([]);
            }
        } catch (error) {
            console.error("Error fetching bindItemDetils:", error);
            setTableData([]);
        }
    }

    const saveReturnIndentDetails = async (indentno) => {
        console.log("indentttttttt", indentNo)

        const payload = {
            IndentNo: indentno,

        };

        try {
            const response = await PHARMACYAssetReturnStoreIndentSearchReturnIndentDetails(payload);
            console.log("Save success", response);

            if (response?.success && response?.data) {
                setDetailTableData(response.data);
            } else {
                setDetailTableData([]);
            }
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    const saveReturnIndent = async (ele) => {
debugger
        const payload = {
            ipAddress: "",
            returnIndentItems: [
                {
                    quantity: ele?.PendingQty || "1",
                    stockID: ele?.StockID || "",
                    itemID: ele?.ItemID || "",
                    itemName: ele?.ItemName || "",
                    fromDepartment: values?.Department || "LSHH",
                    indentNo: ele?.IndentNo || "",
                    storeLedgerNo: ele?.StoreId || "STO00001",
                    narration: ele?.Narration || ""
                }
            ]
        };

        try {
            const response = await PHARMACYAssetReturnStoreIndentSaveReturnIndent(payload);
            console.log("Save success", response);
            if (response?.success) {
                searchReturnItemIndent()
                setDetailTableData([])
                 notify(`${response?.message}-Sale No. ${response?.data?.salesNo}`,"success");
                setSalesNo(data?.salesNo);

                setSalesNoModal(true);

                // notify("Item saved successfully!", "success");
                 setTableData([])
                setIsSearched([]);
               
                setValues({
                    indentNo:"",
                    fromDate: new Date(),
                    toDate:new Date()
                })
               
            }

            else{
                  notify(response?.message,"error");
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
                    dynamicOptions={DropDownState?.bindStore}
                    value={values?.StoreType}
                    handleChange={handleSelect}
                />
                <ReactSelect
                    placeholderName={t("From Center")}
                    id={"center"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                        return { label: ele.CentreName, value: ele.CentreID };
                    })}
                    name="center"
                    handleChange={handleSelect}
                    value={values?.center}
                />
                <ReactSelect
                    placeholderName={t("From Department")}
                    id={"Department"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={DropDownState?.departments}
                    name="Department"
                    handleChange={handleSelect}
                    value={values?.Department}
                />

                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("From Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.fromDate}
                />
                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("To Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                />
                <Input
                    type="text"
                    className="form-control"
                    lable={t("Indent No.")}
                    placeholder=" "
                    id="indentNo"
                    name="indentNo"
                    onChange={handleChange}
                    value={values?.indentNo}
                    required={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />
                <ReactSelect
                    placeholderName={t("Request Type")}
                    id={"RequisitionType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={DDlRequisitionType}
                    name="RequisitionType"
                    handleChange={handleSelect}
                    value={values?.RequisitionType}
                />
                <ReactSelect
                    placeholderName={t("Status")}
                    id={"categoryId"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="status"
                    dynamicOptions={[
                        { label: "All", value: "1" },
                        { label: "Pending", value: "2" },
                        { label: "Issued", value: "3" },
                        { label: "Reject", value: "4" },
                        { label: "Partial", value: "5" },
                    ]}
                    value={values?.status}
                    handleChange={handleSelect}
                    removeIsClearable={true}
                />
                <div className="col-sm-1">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={searchReturnItemIndent}
                    >
                        {t("Search")}
                    </button>
                </div>

            </div>
            {tableData && tableData.length > 0
                             && (
                <div className="p-2">
                    <Heading
                        isBreadcrumb={false}
                        title={t()}
                        secondTitle={
                            <>
                                <span className="pointer-cursor">
                                    <ColorCodingSearch
                                        color={"rgba(150, 161, 212, 1)"}
                                        label={t("Pending")}
                                    />
                                </span>
                                <span className="pointer-cursor">
                                    <ColorCodingSearch
                                        color={"rgb(160, 216, 160)"}
                                        label={t("Returned")}
                                    />
                                </span>
                                <span className="pointer-cursor">
                                    <ColorCodingSearch
                                        color={"rgb(196, 173, 233)"}
                                        label={t("Rejected")}
                                    />
                                </span>
                                <span className="pointer-cursor">
                                    <ColorCodingSearch color={"yellow"} label={t("Partial")} />
                                </span>
                            </>
                        }
                    />
                    <Tables
                        thead={[
                            "S.No",
                            "Date Time",
                            "Indent No",
                            "From Center",
                            "From Department",
                            "Type",
                            "Return",
                            "Details",
                            "Print",
                        ]}
                        tbody={
                             tableData.map((ele, index) => ({
                                    Sno: index + 1,
                                    DateTime: ele?.dtEntry ?? "N/A",
                                    IndentNo: ele?.indentno ?? "N/A",
                                    FromCenter: ele?.CentreFrom ?? "N/A",
                                    FromDepartment: ele?.DeptFrom ?? values?.DeptFrom ?? "N/A",
                                    Type: ele?.Type ?? "N/A",
                                    Return: ele?.Return ?? "N/A",
                                    Details: (
                                        <i
                                            className="fa fa-check"
                                            onClick={() => saveReturnIndentDetails(ele?.indentno )}
                                        ></i>
                                    ),
                                    Print: ele?.Print ?? "N/A",

                                }))
                                // : [
                                //     {
                                //         Sno: "-",
                                //         DateTime: "",
                                //         IndentNo: "",
                                //         FromCenter: "",
                                //         FromDepartment: "",
                                //         Type: "",
                                //         Return: "-",
                                //         Details: "No records found",
                                //         Print: "",
                                //     },
                                // ]
                        }

                    />
                </div>
            )}
            {detailTableData.length > 0 && (
                <div className="p-2 mt-3">
                    <Heading isBreadcrumb={false} title={t("Indent Details")} />
                    <Tables
                        thead={[
                            "ItemName",
                            "Narration",
                            "IndentNo",
                            "ReceiveQty",
                            "RejectQty",
                            "Quantity",
                            "PendingQty",
                            "BatchNumber",
                            "MedExpiryDate",
                            "Action",
                        ]}
                        tbody={detailTableData.map((ele, index) => ({
                            ItemName: ele?.ItemName ?? "N/A",
                            Narration: ele?.Narration ?? "N/A",
                            IndentNo: ele?.IndentNo ?? "N/A",
                            ReceiveQty: ele?.ReceiveQty ?? 0,
                            RejectQty: ele?.RejectQty ?? 0,
                            Quantity: ele?.Quantity ?? 0,
                            PendingQty: ele?.PendingQty ?? 0,
                            BatchNumber: ele?.BatchNumber ?? "N/A",
                            MedExpiryDate: ele?.MedExpiryDate ?? "N/A",
                            Action: (
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => saveReturnIndent(ele)}
                                >
                                    {t("Save")}
                                </button>
                            ),
                        }))}
                    />
                </div>
            )} <Modal
                visible={showSalesNoModal}
                setVisible={setSalesNoModal}
                Header="Sales No"
                modalWidth="30vw"
                buttonName="OK"
                handleAPI={() => setSalesNoModal(false)}
            >
                <div style={{ textAlign: "center" }}>
                    <h3>Record Save successfully!</h3>
                    <p>Sales No: <strong>{salesNo}</strong></p>
                </div>
            </Modal>


        </div>
    )
}
export default ItemsFromDepartment




// "@app/pages/Billing/Requisition/ViewUserRequisition.jsx"   "@app/pages/pharmacy/Return/OpdReturn"