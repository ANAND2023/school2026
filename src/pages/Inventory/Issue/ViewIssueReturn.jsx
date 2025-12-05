


import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  IssueReturnTypeOptions,
  SearchOption,
  SearchSalesOption,
  SearchtypeOptions,
} from "../../../utils/constant";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getBindPanelList } from "../../../store/reducers/common/CommonExportFunction";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BindpharmacyUserNEW,
  BindSearchSalesItem,
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
  BindUser,
  ReportDetail,
  SearchSales,
  StoreCommonReceiptPdf,
} from "../../../networkServices/InventoryApi";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ViewIssueReturnTable from "../../../components/UI/customTable/MedicalStore/ViewIssueReturnTable";
import { RedirectURL } from "../../../networkServices/PDFURL";
import Modal from "../../../components/modalComponent/Modal";
import ViewIssueReturnModal from "../../../components/modalComponent/Utils/MedicalStore/ViewIssueReturnModal";
import { GetIPDSearchSalesAPI } from "../../../networkServices/pharmecy";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { BindGroupIndentStatusReport, BindItem, ReportSubMenu } from "../../../networkServices/BillingsApi";
import { AutoComplete } from "primereact/autocomplete";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { BindPaymentModePanelWise } from "../../../networkServices/PaymentGatewayApi";
import TimeInputPicker from "../../../components/formComponent/CustomTimePicker/TimeInputPicker";

const ViewIssueReturn = () => {
  // FIX 1: Correctly destructure 't' function from useTranslation hook using curly braces {}.
  const { t } = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [ReportVisible, setReportVisible] = useState(false);
  const initialOPDData = {
    billtype: "1",
    UHID: "",
    Name: "",
    issuetype: "2",
    panelID: "All",
    User: "All",
    SearchOption: "All",
    Item: "",
    BillNo: "",
    ReceiptNo: "",
    Mobile: "",
    fromDate: new Date(),
    toDate: new Date(),
    Searchtype: "ALL",
    ReportType: "1",
    BillingType: "1",
          fromTime :moment().startOf("day").format("hh:mm A"), // 12:00 AM
     toTime: moment().endOf("day").format("hh:mm A"),
    Doctor: "All"
  };
  const initialIPDData = {
    UHID: "",
    Name: "",
    issuetype: "",
    panelID: "All",
    User: "All",
    Item: "",
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "1",
    BillingType: "1",
    ipdNo: "",
  };
  const initialValues = {
    StoreType: "STO00001",
    categoryId: [],
    subcategoryId: [],
    itemId: [],
    paymentMode: [
    {
        "name": "Cash",
        "code": 1
    },
    {
        "name": "Cheque",
        "code": 2
    },
    {
        "name": "Card",
        "code": 3
    },
    {
        "name": "Credit",
        "code": 4
    },
    {
        "name": "Online Payment",
        "code": 6
    },
    {
        "name": "Patient-Advance",
        "code": 7
    },
    {
        "name": "UPI",
        "code": 9
    },
    {
        "name": "Adjustment",
        "code": 10
    },
    {
        "name": "NEFT/RTGS",
        "code": 11
    }
],
  }
  const [stockShow, setStockShow] = useState([]);
  const [dropDownState, setDropDownState] = useState({
    PharmacyUser: [],
    BindDoctor: [],
    bindcategory: [],
    paymentModeList: [],
  })
  const [values, setValues] = useState({ ...initialValues });
  const [newRowData, setNewRowData] = useState([]);
  const [item, setItem] = useState("");
  const [purchaseGroup, setPurchaseGroup] = useState([]);
  const [subGroup, setSubGroup] = useState([]);
  const [payload, setPayload] = useState(initialOPDData);
  const [items, setItems] = useState([]); // Added missing state declaration for 'items'
  const [totalBillAmount, setTotalBillAmount] = useState(0);

  console.log(values,"values")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
      return []; // Return empty array on error to prevent crash
    }
  };

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };

  const getBindStoreSubCategory = async () => {
    const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
    try {
      const response = await BindStoreSubCategory(CategoryID);
      setSubGroup(response?.data || []); // Add fallback to empty array
    } catch (error) {
      console.error(error);
      setSubGroup([]); // Set to empty array on error
    }
  };

  const fetchPaymentMode = async () => {
          try {
              const data = await BindPaymentModePanelWise({
                  PanelID: "1",
              });
              // const paymentModeList = data?.data?.map((item) => ({ name: item?.PaymentMode, code: item?.PaymentModeID }));
              // setPaymentMode(data?.data || []);
              const dropDownData = {
        // FIX 2: Add fallback '|| []' to prevent crash if BindGroupId is undefined
        paymentModeList: handleReactSelectDropDownOptions(
          data?.data || [],
          "PaymentMode",
          "PaymentModeID"
        ),
      };

      setDropDownState(prev => ({ ...prev, ...dropDownData }));

          } catch (error) {
              console.error("Failed to load currency detail:", error);
          }
      };

  useEffect(() => {
    if (values?.categoryId?.length > 0) {
      getBindStoreSubCategory();
    } else {
      setSubGroup([]); // Clear subgroups if no category is selected
    }
  }, [values.categoryId]);

  const FetchAllDropDown = async () => {
    try {
      const [BindGroupId] = await Promise.all([
        getBindGroup(),
      ]);

      const dropDownData = {
        // FIX 2: Add fallback '|| []' to prevent crash if BindGroupId is undefined
        bindcategory: handleReactSelectDropDownOptions(
          BindGroupId || [],
          "name",
          "categoryID"
        ),
      };

      setDropDownState(prev => ({ ...prev, ...dropDownData }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // setReportList was not defined, so this function would crash.
  // I have commented it out. If you need it, you must define 'setReportList' using useState.
  /*
  const GetReportSubMenu = async (ID, Type) => {
    try {
      const response = await ReportSubMenu(ID, Type);
      setReportList(response?.data[0]); // CRASH RISK: 'setReportList' is not defined.
    } catch (error) {
      console.error(error);
    }
  };
  */

  const GetBindPurchaseGroup = async (item) => {
    const StoreNo = item ? item : values?.StoreType;
    try {
      const response = await BindGroupIndentStatusReport(StoreNo);
      setPurchaseGroup(response?.data || []); // Add fallback
    } catch (error)      {
      console.error(error);
      setPurchaseGroup([]); // Set to empty array on error
    }
  };


  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
   setPayload((p) => ({ ...p, [name]: value }));
  };
  const handleReactSelect = (name, value) => {
    setTotalBillAmount(0);
   if (name === "reportName") {
      setValues((prevData) => ({
        ...prevData,
        [name]: value?.value || "",
      }));
      // GetReportSubMenu(value?.ID, value?.RelatedTo); // This function is not defined correctly
      GetBindPurchaseGroup(value?.ID);
    } else {
      setPayload({ ...payload, [name]: value?.value });
    }
  };
  // const handleReactSelect = (name, value) => {
  //   setTotalBillAmount(0);
  //   if (name === "billtype") {
  //     if (value?.value === "2") {
  //       setPayload({ ...payload, [name]: value?.value, BillNo: "" });
  //     } else {
  //       setPayload({ ...payload, [name]: value?.value, ReceiptNo: "" });
  //     }
  //   } else if (name === "BillingType") {
  //     if (value?.value === "1") {
  //       setPayload({ ...initialOPDData, [name]: value?.value });
  //     } else {
  //       setPayload({ ...initialIPDData, [name]: value?.value });
  //     }
  //     setTableData([]);
  //   } else if (name === "reportName") {
  //     setValues((prevData) => ({
  //       ...prevData,
  //       [name]: value?.value || "",
  //     }));
  //     // GetReportSubMenu(value?.ID, value?.RelatedTo); // This function is not defined correctly
  //     GetBindPurchaseGroup(value?.ID);
  //   } else {
  //     setPayload({ ...payload, [name]: value?.value });
  //   }
  // };

  const getUsers = async () => {
    try {
      const response = await BindpharmacyUserNEW();
      setDropDownState((val) => ({
        ...val,
        // Add fallback '|| []'
        PharmacyUser: handleReactSelectDropDownOptions(
          response?.data || [],
          "Name",
          "EmployeeID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getBindDoctor = async () => {
    try {
      const response = await GetBindDoctorDept("All");
      setDropDownState((val) => ({
        ...val,
        // Add fallback '|| []'
        BindDoctor: handleReactSelectDropDownOptions(
          response?.data || [],
          "Name",
          "DoctorID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const search = async (searchItem) => {
    const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    const ItemName = searchItem || item;
    try {
      if (ItemName?.length > 2) {
        const response = await BindStoreItems(Subcategory, ItemName);
        setStockShow(response?.data || []);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
      setStockShow([]);
    }
  };

  const deleteDocument = (doc) => {
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    setNewRowData(docDetail);
  };

  const handleSelectRow = (e) => {
    const { value } = e;
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [value];
    });
    setValues((prevPayload) => ({
      ...prevPayload,
      ItemID: Array.isArray(value?.ItemID)
        ? value.ItemID.join(", ")
        : value?.ItemID,
    }));
    setItem("");
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };

  const getBindUser = async () => {
    try {
      const response = await BindUser();
      setUsers(response?.data || []); // Add fallback
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const GetReportDetail = async () => {
    const reqBody = {
      typeId: payload?.billtype,
      regNo: payload?.UHID,
      panelID: payload?.panelID == "All" ? "" : payload?.panelID,
      pName: payload?.Name,
      searchType: payload?.Searchtype,
      mobileNo: payload?.Mobile,
      billNo: payload?.BillNo,
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      itemId: payload?.Item,
      userID: payload?.User == "All" ? "" : payload?.User,
      receiptNo: payload?.ReceiptNo,
      typeIssue: payload?.issuetype,
      ReportType: payload?.ReportType,
    };
    try {
      const response = await ReportDetail(reqBody);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBindSearchSalesItem = async () => {
    try {
      const response = await BindSearchSalesItem();
      setItems(response?.data || []); // Add fallback
    } catch (error) {
      console.error(error);
      setItems([]);
    }
  };

  const getStoreCommonReceiptPdf = async (item) => {
    const requestBody = {
      ledgerTransactionNo: String(item?.LedgerTransactionNo),
      isBill: "0",
      receiptNo: "",
      duplicate: "0",
      type: "PHY",
      supplierID: "",
      billNo: "",
      isEMGBilling: "",
      isOnlinePrint: "",
      isRefound: 0,
    };
    try {
      const response = await StoreCommonReceiptPdf(requestBody);
      RedirectURL(response?.data?.pdfUrl);
    } catch (error) {
      console.error(error);
    }
  };

  function handleDoubleClick(ele, index) {
    const newitem = tableData[index];
    getStoreCommonReceiptPdf(newitem);
  }

  const GetSearchSales = async () => {
    const bodyRequest = 
    // {
    //   typeId: payload?.billtype || "",
    //   regNo: payload?.UHID || "",
    //   panelID: payload?.panelID === "All" ? "" : payload?.panelID,
    //   pName: payload?.Name || "",
    //   searchType: payload?.Searchtype || "",
    //   mobileNo: payload?.Mobile || "",
    //   billNo: payload?.BillNo || "",
    //   fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
    //   toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
    //   itemId: newRowData[0]?.ItemID || "",
    //   userID: payload?.User === "All" ? "" : payload?.User,
    //   receiptNo: payload?.ReceiptNo || "",
    //   typeIssue: "",
    //   ReportType: "",
    //   Doctor: payload?.Doctor? payload?.Doctor:"2",
    //   // Doctor: payload?.Doctor === "All" ? "" : payload?.Doctor,
    //   User: payload?.User === "All" ? "" : payload?.User,
    //   Type: payload?.SearchOption || "",
    //   ReceiptType: Number(payload?.issuetype || "2"),
    // };
     {
    "typeId": payload?.billtype?payload?.billtype:"",
    "regNo": payload?.UHID?payload?.UHID:"",
    "IPDNo": payload?.IPD?payload?.IPD:"",
    "panelID":  payload?.panelID == "All" ? "" : payload?.panelID,
    "pName":payload?.Name?payload?.Name:"",
    "searchType":payload?.Searchtype?payload?.Searchtype:"",
    "billType":payload?.BillingType?payload?.BillingType:"",
    "mobileNo":  payload?.Mobile?payload?.Mobile:"",
    "billNo":  payload?.BillNo?payload?.BillNo:"",
    "fromDate":  moment(payload?.fromDate).format("YYYY-MM-DD"),
    "toDate":  moment(payload?.toDate).format("YYYY-MM-DD"),
    // "itemId": payload?.Item,
    "itemId": newRowData[0]?.ItemID?newRowData[0]?.ItemID:"",
    "userID":  payload?.User == "All" ? "" : payload?.User,
    "receiptNo":payload?.ReceiptNo?payload?.ReceiptNo:"",
    "typeIssue": "",
    "ReportType": "",
    "Doctor":  payload?.Doctor?payload?.Doctor:"",
    "User": payload?.User == "All" ? "" : payload?.User,
    TherapyType:payload?.SearchOption==="All"?"":payload?.SearchOption,
    ReceiptType: Number(payload?.issuetype?payload?.issuetype:"2"),
    PaymentModeID: values?.paymentMode?.map(item=>(item?.code))
}
debugger
    try {
      const response = await SearchSales(bodyRequest);
      if (response?.success) {
        setTableData(response?.data || []); // Add fallback
        let totalNetAmount = response?.data.reduce((sum, item) => sum + item.NetAmount, 0);
        let formatted = totalNetAmount.toLocaleString('en-IN');
        setTotalBillAmount(formatted)
      } else {
        setTableData([]);
        notify(response?.message, "error");
      }
    } catch (error) {
      setTableData([]);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPaymentMode();
    FetchAllDropDown();
    getBindDoctor();
    GetBindPurchaseGroup();
    getUsers();
    getBindUser();
    getBindSearchSalesItem();
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
  }, [dispatch]); // Add dispatch to dependency array

  const handleCancle = () => {
    setReportVisible(false);
  };

  const GetIPDSearchSales = async () => {
    let newPayload = {
      typeOfTnx:
        payload?.issuetype === "Pharmacy-Issue"
          ? "Sales"
          : payload?.issuetype === "Pharmacy-Return"
            ? "Patient-Return"
            : "",
      patientID: payload?.UHID,
      pName: payload?.Name,
      panelID: Number(payload?.panelID === "All" ? 0 : payload?.panelID),
      fromDate: payload?.fromDate,
      toDate: payload?.toDate,
      ipdNo: payload?.ipdNo,
      userID: payload?.User === "All" ? "" : payload?.User,
      PaymentModeID: values?.paymentMode?.map(item=>(item?.code))
    };
    try {
        let apiResp = await GetIPDSearchSalesAPI(newPayload);
        if (apiResp?.success) {
          setTableData(apiResp?.data || []); // Add fallback
          let totalNetAmount = apiResp?.data.reduce((sum, item) => sum + item.NetAmount, 0);
          let formatted = totalNetAmount.toLocaleString('en-IN');
        setTotalBillAmount(formatted)
        } else {
          setTableData([]);
          notify(apiResp?.message, "error");
        }
    } catch (error) {
        setTableData([]);
        console.error(error);
    }
  };

  
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} title={"Search Sales"} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("BillingType")}
            id="BillingType"
            name="BillingType"
            value={payload?.BillingType}
            handleChange={(name, e) => handleReactSelect(name, e)}
            removeIsClearable={true}
            dynamicOptions={[
              { label: "Cash Patient", value: "1" },
              { label: "Credit Patient", value: "2" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            value={payload?.UHID || ""}
            onChange={handleChange}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="IPD"
            name="IPD"
            value={payload?.IPD || ""}
            onChange={handleChange}
            lable={t("IPD")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          {/* {payload?.BillingType === "2" && (
            <Input
              type="text"
              className="form-control"
              id="ipdNo"
              name="ipdNo"
              value={payload?.ipdNo || ""}
              onChange={handleChange}
              lable={t("IPD No.")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
          )} */}
          <Input
            type="text"
            className="form-control"
            id="Name"
            name="Name"
            value={payload?.Name || ""}
            onChange={handleChange}
            lable={t("PatientName")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"issuetype"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"issuetype"}
            removeIsClearable={true}
            dynamicOptions={[
              { label: "All", value: "2" },
              ...(IssueReturnTypeOptions || []),
            ]}
            value={payload?.issuetype}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Panel")}
            id="panelID"
            name="panelID"
            value={payload?.panelID}
            handleChange={handleReactSelect}
            dynamicOptions={[
              { label: "All", value: "All" },
            
              ...(getBindPanelListData || []).map((item) => ({
                label: item?.Company_Name,
                value: item?.PanelID,
              })),
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"Doctor"}
            dynamicOptions={[
              { label: "All", value: "All" },
             
              ...(dropDownState?.BindDoctor || []),
            ]}
            value={payload?.Doctor}
            handleChange={handleReactSelect}
          />

          <ReactSelect
            placeholderName={t("User Name")}
            id={"User"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"User"}
            dynamicOptions={[
              { label: "All", value: "All" },
              
              ...(dropDownState?.PharmacyUser || []),
            ]}
            value={payload?.User}
            handleChange={handleReactSelect}
          />
          
         
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={payload}
            setValues={setPayload}
            max={payload?.toDate}
          />
           <TimeInputPicker
                lable={"From Time"}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="fromTime"
                // id="fromTime"
                onChange={handleDateTimeChange}
                value={payload?.fromTime}
              />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={payload}
            setValues={setPayload}
            max={new Date()}
            min={payload?.fromDate}
          />

 <TimeInputPicker
                lable={"To Time"}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="toTime"
                // id="toTime"
                onChange={handleDateTimeChange}
                value={payload?.toTime}
              />
          {
          // payload?.BillingType === "1" &&
           (
            <>
              <ReactSelect
                placeholderName={t("BillType")}
                id={"billtype"}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                name={"billtype"}
                dynamicOptions={SearchSalesOption}
                removeIsClearable={true}
                value={payload?.billtype}
                handleChange={handleReactSelect}
              />
              <ReactSelect
                placeholderName={t("Pharmacy Type")}
                id={"SearchOption"}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                name={"SearchOption"}
                dynamicOptions={SearchOption}
                removeIsClearable={true}
                value={payload?.SearchOption}
                handleChange={handleReactSelect}
              />

              <ReportsMultiSelect
                name="categoryId"
                placeholderName={t("Groups")}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                values={values}
                setValues={setValues}
                dynamicOptions={dropDownState?.bindcategory || []} // Add fallback
                labelKey="name"
                valueKey="categoryID"
              />
              <ReportsMultiSelect
                name="subcategoryId"
                placeholderName={t("Sub Groups")}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                values={values}
                setValues={setValues}
                dynamicOptions={subGroup || []} // Add fallback
                labelKey="Name"
                valueKey="SubCategoryID"
              />
              
              <>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                  <AutoComplete
                    style={{ width: "100%" }}
                    value={item}
                    suggestions={Array.isArray(stockShow) ? stockShow : []}
                    completeMethod={() => search(item)}
                    className="w-100 "
                    onSelect={(e) => handleSelectRow(e)}
                    id="searchtest"
                    onChange={(e) => {
                      const data =
                        typeof e.value === "object"
                          ? e?.value?.TypeName
                          : e.value;
                      setItem(data);
                      search(data);
                      setValues({ ...values, TypeName: data });
                    }}
                    itemTemplate={itemTemplate}
                  />
                  <label htmlFor={"searchtest"} className="lable searchtest">
                    {t(" Search Items")}
                  </label>
                </div>
                
                <div className="d-flex flex-wrap">
                {/* <div className=" col-sm-12 d-flex flex-wrap"> */}
                  {newRowData?.map((doc, key) => (
                    <div className="d-flex ml-2 mb-2" key={key}>
                      <LabeledInput
                        label={"Items"}
                        value={doc?.TypeName}
                        className={"document_label"}
                      />
                      <button
                        className="btn btn-sm btn-primary ml-2"
                        type="button"
                        onClick={() => {
                          deleteDocument(doc);
                        }}
                      >
                        <i className="fa fa-times fa-sm new_record_pluse"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
              </>
              {
              // payload?.billtype === "1" && 
              (
                <Input
                  type="text"
                  className="form-control"
                  id="BillNo"
                  name="BillNo"
                  value={payload?.BillNo || ""}
                  onChange={handleChange}
                  lable={t("Bill Number")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />
              )}
              {/* {payload?.billtype === "2" && (
                <Input
                  type="text"
                  className="form-control"
                  id="ReceiptNo"
                  name="ReceiptNo"
                  value={payload?.ReceiptNo || ""}
                  onChange={handleChange}
                  lable={t("ReceiptNo")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
              )} */}
              <Input
                type="number"
                className="form-control"
                id="Mobile"
                name="Mobile"
                value={payload?.Mobile || ""}
                onChange={handleChange}
                lable={t("Mobile Number")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />

              <ReactSelect
                placeholderName={t("Search Type")}
                id={"Searchtype"}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                name={"Searchtype"}
                dynamicOptions={SearchtypeOptions}
                value={payload?.Searchtype}
                handleChange={handleReactSelect}
              />
            </>
          )}
          <ReportsMultiSelect
            name="paymentMode"
            placeholderName={t("Payment Mode")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={dropDownState?.paymentModeList || []} 
            labelKey="PaymentMode"
            valueKey="PaymentModeID"
          />
          <div
            className={`${payload?.BillingType === "1" ? "col-12" : "col-12"}`}
            // className={`${payload?.BillingType === "1" ? "col-12" : "col-6"}`}
          >
            <div className="text-right">
              {/* {payload?.BillingType === "1" ? ( */}
                <button
                  className="btn btn-primary btn-sm px-4 ml-1"
                  onClick={GetSearchSales}
                >
                  {t("Search")}
                </button>
              {/* ) : (
                 <button
              //     className="btn btn-primary btn-sm px-4 ml-1"
              //     onClick={GetIPDSearchSales}
              //   >
              //     {t("Search")}
              //   </button>
              // )} */}
            </div>
          </div>
        </div>
      </div>
       {tableData?.length > 0 && (<>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            isBreadcrumb={false}
            title={t("BillDetails")}
            secondTitle={
              <>
              <span className="">
                {/* Total Bill Amount:{totalBillAmount} */}
                <p className="text-bold mb-0 mx-3">Total Bill Amount: {totalBillAmount}</p>
              </span>
                <span className="pointer-cursor">
                  <ColorCodingSearch
                    color={"rgb(160, 216, 160)"}
                    label={t("Pharmacy Issue")}
                  />
                </span>
                <span className="pointer-cursor">
                  <ColorCodingSearch
                    color={"rgb(196, 173, 233)"}
                    label={t("Pharmacy Return")}
                  />
                </span>
                <span className="pointer-cursor">
                  <ColorCodingSearch color={"yellow"} label={t("Settlement")} />
                </span>
              </>
            }
          />
        </div>
      </div>
     
        <div className="spatient_registration_card">
          <div
            className="patient_registration card "
            style={{ borderRadius: "5px" }}
          >
            <ViewIssueReturnTable
              tbody={tableData}
              handleDoubleClick={handleDoubleClick}
              BillingType={payload?.BillingType}
            />
          </div>
        </div>
        </>
      )}

      {ReportVisible && (
        <Modal
          modalWidth={"500px"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header="Select Report Type"
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={GetReportDetail}
              >
                {t("Print")}
              </button>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleCancle}
              >
                {t("Cancel")}
              </button>
            </>
          }
        >
          <ViewIssueReturnModal
            payload={payload}
            setPayload={setPayload}
            handleReactSelect={handleReactSelect}
          />
        </Modal>
      )}
    </>
  );
};

export default ViewIssueReturn;





// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import ReactSelect from "../../../components/formComponent/ReactSelect";
// import { useTranslation } from "react-i18next";
// import Input from "../../../components/formComponent/Input";
// import {
//   IssueReturnTypeOptions,
//   SearchOption,
//   SearchSalesOption,
//   SearchtypeOptions,
// } from "../../../utils/constant";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { getBindPanelList } from "../../../store/reducers/common/CommonExportFunction";
// import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
// import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
// import {
//   BindpharmacyUserNEW,
//   BindSearchSalesItem,
//   BindStoreGroup,
//   BindStoreItems,
//   BindStoreSubCategory,
//   BindUser,
//   ReportDetail,
//   SearchSales,
//   StoreCommonReceiptPdf,
// } from "../../../networkServices/InventoryApi";
// import moment from "moment";
// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import ViewIssueReturnTable from "../../../components/UI/customTable/MedicalStore/ViewIssueReturnTable";
// import { RedirectURL } from "../../../networkServices/PDFURL";
// import Modal from "../../../components/modalComponent/Modal";
// import ViewIssueReturnModal from "../../../components/modalComponent/Utils/MedicalStore/ViewIssueReturnModal";
// import { GetIPDSearchSalesAPI } from "../../../networkServices/pharmecy";
// import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
// import { BindGroupIndentStatusReport, BindItem, ReportSubMenu } from "../../../networkServices/BillingsApi";
// import { AutoComplete } from "primereact/autocomplete";
// import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import LabeledInput from "../../../components/formComponent/LabeledInput";
// import { BindPaymentModePanelWise } from "../../../networkServices/PaymentGatewayApi";

// const ViewIssueReturn = () => {
//   // FIX 1: Correctly destructure 't' function from useTranslation hook using curly braces {}.
//   const { t } = useTranslation();
//   const localData = useLocalStorage("userData", "get");
//   const dispatch = useDispatch();
//   const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
//   const [tableData, setTableData] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [ReportVisible, setReportVisible] = useState(false);
//   const initialOPDData = {
//     billtype: "1",
//     UHID: "",
//     Name: "",
//     issuetype: "2",
//     panelID: "All",
//     User: "All",
//     Item: "",
//     BillNo: "",
//     ReceiptNo: "",
//     Mobile: "",
//     fromDate: new Date(),
//     toDate: new Date(),
//     Searchtype: "ALL",
//     ReportType: "1",
//     BillingType: "1",
//     Doctor: "All"
//   };
//   const initialIPDData = {
//     UHID: "",
//     Name: "",
//     issuetype: "",
//     panelID: "All",
//     User: "All",
//     Item: "",
//     fromDate: new Date(),
//     toDate: new Date(),
//     ReportType: "1",
//     BillingType: "1",
//     ipdNo: "",
//   };
//   const initialValues = {
//     StoreType: "STO00001",
//     categoryId: [],
//     subcategoryId: [],
//     itemId: [],
//     paymentMode: [
//     {
//         "name": "Cash",
//         "code": 1
//     },
//     {
//         "name": "Cheque",
//         "code": 2
//     },
//     {
//         "name": "Card",
//         "code": 3
//     },
//     {
//         "name": "Credit",
//         "code": 4
//     },
//     {
//         "name": "Online Payment",
//         "code": 6
//     },
//     {
//         "name": "Patient-Advance",
//         "code": 7
//     },
//     {
//         "name": "UPI",
//         "code": 9
//     },
//     {
//         "name": "Adjustment",
//         "code": 10
//     },
//     {
//         "name": "NEFT/RTGS",
//         "code": 11
//     }
// ],
//   }
//   const [stockShow, setStockShow] = useState([]);
//   const [dropDownState, setDropDownState] = useState({
//     PharmacyUser: [],
//     BindDoctor: [],
//     bindcategory: [],
//     paymentModeList: [],
//   })
//   const [values, setValues] = useState({ ...initialValues });
//   const [newRowData, setNewRowData] = useState([]);
//   const [item, setItem] = useState("");
//   const [purchaseGroup, setPurchaseGroup] = useState([]);
//   const [subGroup, setSubGroup] = useState([]);
//   const [payload, setPayload] = useState(initialOPDData);
//   const [items, setItems] = useState([]); // Added missing state declaration for 'items'
//   const [totalBillAmount, setTotalBillAmount] = useState(0);

//   console.log(values,"values")

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayload({ ...payload, [name]: value });
//   };

//   const getBindGroup = async () => {
//     const DeptLedgerNo = localData?.deptLedgerNo;
//     try {
//       const response = await BindStoreGroup(DeptLedgerNo);
//       return response?.data;
//     } catch (error) {
//       console.error(error);
//       return []; // Return empty array on error to prevent crash
//     }
//   };

//   const handlePayloadMultiSelect = (data) => {
//     return data?.map((items, _) => String(items?.code))?.join(",");
//   };

//   const getBindStoreSubCategory = async () => {
//     const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
//     try {
//       const response = await BindStoreSubCategory(CategoryID);
//       setSubGroup(response?.data || []); // Add fallback to empty array
//     } catch (error) {
//       console.error(error);
//       setSubGroup([]); // Set to empty array on error
//     }
//   };

//   const fetchPaymentMode = async () => {
//           try {
//               const data = await BindPaymentModePanelWise({
//                   PanelID: "1",
//               });
//               // const paymentModeList = data?.data?.map((item) => ({ name: item?.PaymentMode, code: item?.PaymentModeID }));
//               // setPaymentMode(data?.data || []);
//               const dropDownData = {
//         // FIX 2: Add fallback '|| []' to prevent crash if BindGroupId is undefined
//         paymentModeList: handleReactSelectDropDownOptions(
//           data?.data || [],
//           "PaymentMode",
//           "PaymentModeID"
//         ),
//       };

//       setDropDownState(prev => ({ ...prev, ...dropDownData }));

//           } catch (error) {
//               console.error("Failed to load currency detail:", error);
//           }
//       };

//   useEffect(() => {
//     if (values?.categoryId?.length > 0) {
//       getBindStoreSubCategory();
//     } else {
//       setSubGroup([]); // Clear subgroups if no category is selected
//     }
//   }, [values.categoryId]);

//   const FetchAllDropDown = async () => {
//     try {
//       const [BindGroupId] = await Promise.all([
//         getBindGroup(),
//       ]);

//       const dropDownData = {
//         // FIX 2: Add fallback '|| []' to prevent crash if BindGroupId is undefined
//         bindcategory: handleReactSelectDropDownOptions(
//           BindGroupId || [],
//           "name",
//           "categoryID"
//         ),
//       };

//       setDropDownState(prev => ({ ...prev, ...dropDownData }));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // setReportList was not defined, so this function would crash.
//   // I have commented it out. If you need it, you must define 'setReportList' using useState.
//   /*
//   const GetReportSubMenu = async (ID, Type) => {
//     try {
//       const response = await ReportSubMenu(ID, Type);
//       setReportList(response?.data[0]); // CRASH RISK: 'setReportList' is not defined.
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   */

//   const GetBindPurchaseGroup = async (item) => {
//     const StoreNo = item ? item : values?.StoreType;
//     try {
//       const response = await BindGroupIndentStatusReport(StoreNo);
//       setPurchaseGroup(response?.data || []); // Add fallback
//     } catch (error)      {
//       console.error(error);
//       setPurchaseGroup([]); // Set to empty array on error
//     }
//   };

//   const handleReactSelect = (name, value) => {
//     setTotalBillAmount(0);
//     if (name === "billtype") {
//       if (value?.value === "2") {
//         setPayload({ ...payload, [name]: value?.value, BillNo: "" });
//       } else {
//         setPayload({ ...payload, [name]: value?.value, ReceiptNo: "" });
//       }
//     } else if (name === "BillingType") {
//       if (value?.value === "1") {
//         setPayload({ ...initialOPDData, [name]: value?.value });
//       } else {
//         setPayload({ ...initialIPDData, [name]: value?.value });
//       }
//       setTableData([]);
//     } else if (name === "reportName") {
//       setValues((prevData) => ({
//         ...prevData,
//         [name]: value?.value || "",
//       }));
//       // GetReportSubMenu(value?.ID, value?.RelatedTo); // This function is not defined correctly
//       GetBindPurchaseGroup(value?.ID);
//     } else {
//       setPayload({ ...payload, [name]: value?.value });
//     }
//   };

//   const getUsers = async () => {
//     try {
//       const response = await BindpharmacyUserNEW();
//       setDropDownState((val) => ({
//         ...val,
//         // Add fallback '|| []'
//         PharmacyUser: handleReactSelectDropDownOptions(
//           response?.data || [],
//           "ename",
//           "Dept_ID"
//         ),
//       }));
//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//     }
//   };

//   const getBindDoctor = async () => {
//     try {
//       const response = await GetBindDoctorDept("All");
//       setDropDownState((val) => ({
//         ...val,
//         // Add fallback '|| []'
//         BindDoctor: handleReactSelectDropDownOptions(
//           response?.data || [],
//           "Name",
//           "DoctorID"
//         ),
//       }));
//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//     }
//   };

//   const search = async (searchItem) => {
//     const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
//     const ItemName = searchItem || item;
//     try {
//       if (ItemName?.length > 2) {
//         const response = await BindStoreItems(Subcategory, ItemName);
//         setStockShow(response?.data || []);
//       }
//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//       setStockShow([]);
//     }
//   };

//   const deleteDocument = (doc) => {
//     const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
//     setNewRowData(docDetail);
//   };

//   const handleSelectRow = (e) => {
//     const { value } = e;
//     setNewRowData((prevData) => {
//       if (prevData.some((item) => item.ItemID === value.ItemID)) {
//         return prevData;
//       }
//       return [value];
//     });
//     setValues((prevPayload) => ({
//       ...prevPayload,
//       ItemID: Array.isArray(value?.ItemID)
//         ? value.ItemID.join(", ")
//         : value?.ItemID,
//     }));
//     setItem("");
//   };

//   const itemTemplate = (item) => {
//     return (
//       <div className="p-clearfix">
//         <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
//           {item?.TypeName}
//         </div>
//       </div>
//     );
//   };

//   const getBindUser = async () => {
//     try {
//       const response = await BindUser();
//       setUsers(response?.data || []); // Add fallback
//     } catch (error) {
//       console.error(error);
//       setUsers([]);
//     }
//   };

//   const GetReportDetail = async () => {
//     const reqBody = {
//       typeId: payload?.billtype,
//       regNo: payload?.UHID,
//       panelID: payload?.panelID == "All" ? "" : payload?.panelID,
//       pName: payload?.Name,
//       searchType: payload?.Searchtype,
//       mobileNo: payload?.Mobile,
//       billNo: payload?.BillNo,
//       fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
//       toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
//       itemId: payload?.Item,
//       userID: payload?.User == "All" ? "" : payload?.User,
//       receiptNo: payload?.ReceiptNo,
//       typeIssue: payload?.issuetype,
//       ReportType: payload?.ReportType,
//     };
//     try {
//       const response = await ReportDetail(reqBody);
//       if (response?.success) {
//         RedirectURL(response?.data?.pdfUrl);
//       } else {
//         notify(response?.message, "error");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getBindSearchSalesItem = async () => {
//     try {
//       const response = await BindSearchSalesItem();
//       setItems(response?.data || []); // Add fallback
//     } catch (error) {
//       console.error(error);
//       setItems([]);
//     }
//   };

//   const getStoreCommonReceiptPdf = async (item) => {
//     const requestBody = {
//       ledgerTransactionNo: String(item?.LedgerTransactionNo),
//       isBill: "0",
//       receiptNo: "",
//       duplicate: "0",
//       type: "PHY",
//       supplierID: "",
//       billNo: "",
//       isEMGBilling: "",
//       isOnlinePrint: "",
//       isRefound: 0,
//     };
//     try {
//       const response = await StoreCommonReceiptPdf(requestBody);
//       RedirectURL(response?.data?.pdfUrl);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   function handleDoubleClick(ele, index) {
//     const newitem = tableData[index];
//     getStoreCommonReceiptPdf(newitem);
//   }

//   const GetSearchSales = async () => {
//     const bodyRequest = 
//     // {
//     //   typeId: payload?.billtype || "",
//     //   regNo: payload?.UHID || "",
//     //   panelID: payload?.panelID === "All" ? "" : payload?.panelID,
//     //   pName: payload?.Name || "",
//     //   searchType: payload?.Searchtype || "",
//     //   mobileNo: payload?.Mobile || "",
//     //   billNo: payload?.BillNo || "",
//     //   fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
//     //   toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
//     //   itemId: newRowData[0]?.ItemID || "",
//     //   userID: payload?.User === "All" ? "" : payload?.User,
//     //   receiptNo: payload?.ReceiptNo || "",
//     //   typeIssue: "",
//     //   ReportType: "",
//     //   Doctor: payload?.Doctor? payload?.Doctor:"2",
//     //   // Doctor: payload?.Doctor === "All" ? "" : payload?.Doctor,
//     //   User: payload?.User === "All" ? "" : payload?.User,
//     //   Type: payload?.SearchOption || "",
//     //   ReceiptType: Number(payload?.issuetype || "2"),
//     // };
//      {
//     "typeId": payload?.billtype?payload?.billtype:"",
//     "regNo": payload?.UHID?payload?.UHID:"",
//     "panelID":  payload?.panelID == "All" ? "" : payload?.panelID,
//     "pName":payload?.Name?payload?.Name:"",
//     "searchType":payload?.Searchtype?payload?.Searchtype:"",
//     "mobileNo":  payload?.Mobile?payload?.Mobile:"",
//     "billNo":  payload?.BillNo?payload?.BillNo:"",
//     "fromDate":  moment(payload?.fromDate).format("YYYY-MM-DD"),
//     "toDate":  moment(payload?.toDate).format("YYYY-MM-DD"),
//     // "itemId": payload?.Item,
//     "itemId": newRowData[0]?.ItemID?newRowData[0]?.ItemID:"",
//     "userID":  payload?.User == "All" ? "" : payload?.User,
//     "receiptNo":payload?.ReceiptNo?payload?.ReceiptNo:"",
//     "typeIssue": "",
//     "ReportType": "",
//     "Doctor":  payload?.Doctor?payload?.Doctor:"",
//     "User": payload?.User?payload?.User:"",
//     Type:payload?.SearchOption?payload?.SearchOption:"",
//     ReceiptType: Number(payload?.issuetype?payload?.issuetype:"2"),
//     PaymentModeID: values?.paymentMode?.map(item=>(item?.code))
// }
// debugger
//     try {
//       const response = await SearchSales(bodyRequest);
//       if (response?.success) {
//         setTableData(response?.data || []); // Add fallback
//         let totalNetAmount = response?.data.reduce((sum, item) => sum + item.NetAmount, 0);
//         let formatted = totalNetAmount.toLocaleString('en-IN');
//         setTotalBillAmount(formatted)
//       } else {
//         setTableData([]);
//         notify(response?.message, "error");
//       }
//     } catch (error) {
//       setTableData([]);
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentMode();
//     FetchAllDropDown();
//     getBindDoctor();
//     GetBindPurchaseGroup();
//     getUsers();
//     getBindUser();
//     getBindSearchSalesItem();
//     dispatch(
//       getBindPanelList({
//         PanelGroup: "ALL",
//       })
//     );
//   }, [dispatch]); // Add dispatch to dependency array

//   const handleCancle = () => {
//     setReportVisible(false);
//   };

//   const GetIPDSearchSales = async () => {
//     let newPayload = {
//       typeOfTnx:
//         payload?.issuetype === "Pharmacy-Issue"
//           ? "Sales"
//           : payload?.issuetype === "Pharmacy-Return"
//             ? "Patient-Return"
//             : "",
//       patientID: payload?.UHID,
//       pName: payload?.Name,
//       panelID: Number(payload?.panelID === "All" ? 0 : payload?.panelID),
//       fromDate: payload?.fromDate,
//       toDate: payload?.toDate,
//       ipdNo: payload?.ipdNo,
//       userID: payload?.User === "All" ? "" : payload?.User,
//       PaymentModeID: values?.paymentMode?.map(item=>(item?.code))
//     };
//     try {
//         let apiResp = await GetIPDSearchSalesAPI(newPayload);
//         if (apiResp?.success) {
//           setTableData(apiResp?.data || []); // Add fallback
//           let totalNetAmount = apiResp?.data.reduce((sum, item) => sum + item.NetAmount, 0);
//           let formatted = totalNetAmount.toLocaleString('en-IN');
//         setTotalBillAmount(formatted)
//         } else {
//           setTableData([]);
//           notify(apiResp?.message, "error");
//         }
//     } catch (error) {
//         setTableData([]);
//         console.error(error);
//     }
//   };

  
//   return (
//     <>
//       <div className="card">
//         <Heading isBreadcrumb={true} title={"Search Sales"} />
//         <div className="row p-2">
//           <ReactSelect
//             placeholderName={t("BillingType")}
//             id="BillingType"
//             name="BillingType"
//             value={payload?.BillingType}
//             handleChange={(name, e) => handleReactSelect(name, e)}
//             removeIsClearable={true}
//             dynamicOptions={[
//               { label: "Cash Patient", value: "1" },
//               { label: "Credit Patient", value: "2" },
//             ]}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//           />

//           <Input
//             type="text"
//             className="form-control"
//             id="UHID"
//             name="UHID"
//             value={payload?.UHID || ""}
//             onChange={handleChange}
//             lable={t("UHID")}
//             placeholder=" "
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//           />
//           {payload?.BillingType === "2" && (
//             <Input
//               type="text"
//               className="form-control"
//               id="ipdNo"
//               name="ipdNo"
//               value={payload?.ipdNo || ""}
//               onChange={handleChange}
//               lable={t("IPD No.")}
//               placeholder=" "
//               respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             />
//           )}
//           <Input
//             type="text"
//             className="form-control"
//             id="Name"
//             name="Name"
//             value={payload?.Name || ""}
//             onChange={handleChange}
//             lable={t("PatientName")}
//             placeholder=" "
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//           />
//           <ReactSelect
//             placeholderName={t("Type")}
//             id={"issuetype"}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             name={"issuetype"}
//             removeIsClearable={true}
//             dynamicOptions={[
//               { label: "All", value: "2" },
//               ...(IssueReturnTypeOptions || []),
//             ]}
//             value={payload?.issuetype}
//             handleChange={handleReactSelect}
//           />
//           <ReactSelect
//             placeholderName={t("Panel")}
//             id="panelID"
//             name="panelID"
//             value={payload?.panelID}
//             handleChange={handleReactSelect}
//             dynamicOptions={[
//               { label: "All", value: "All" },
            
//               ...(getBindPanelListData || []).map((item) => ({
//                 label: item?.Company_Name,
//                 value: item?.PanelID,
//               })),
//             ]}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//           />
//           <ReactSelect
//             placeholderName={t("Doctor")}
//             id={"Doctor"}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             name={"Doctor"}
//             dynamicOptions={[
//               { label: "All", value: "All" },
             
//               ...(dropDownState?.BindDoctor || []),
//             ]}
//             value={payload?.Doctor}
//             handleChange={handleReactSelect}
//           />

//           <ReactSelect
//             placeholderName={t("User Name")}
//             id={"User"}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             name={"User"}
//             dynamicOptions={[
//               { label: "All", value: "All" },
              
//               ...(dropDownState?.PharmacyUser || []),
//             ]}
//             value={payload?.User}
//             handleChange={handleReactSelect}
//           />
          
//           <ReportDatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             id="fromDate"
//             name="fromDate"
//             lable={t("fromDate")}
//             values={payload}
//             setValues={setPayload}
//             max={payload?.toDate}
//           />
//           <ReportDatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             id="toDate"
//             name="toDate"
//             lable={t("toDate")}
//             values={payload}
//             setValues={setPayload}
//             max={new Date()}
//             min={payload?.fromDate}
//           />

//           {payload?.BillingType === "1" && (
//             <>
//               <ReactSelect
//                 placeholderName={t("BillType")}
//                 id={"billtype"}
//                 searchable={true}
//                 respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//                 name={"billtype"}
//                 dynamicOptions={SearchSalesOption}
//                 removeIsClearable={true}
//                 value={payload?.billtype}
//                 handleChange={handleReactSelect}
//               />
//               <ReactSelect
//                 placeholderName={t("SearchOption")}
//                 id={"SearchOption"}
//                 searchable={true}
//                 respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//                 name={"SearchOption"}
//                 dynamicOptions={SearchOption}
//                 removeIsClearable={true}
//                 value={payload?.SearchOption}
//                 handleChange={handleReactSelect}
//               />

//               <ReportsMultiSelect
//                 name="categoryId"
//                 placeholderName={t("Groups")}
//                 respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                 values={values}
//                 setValues={setValues}
//                 dynamicOptions={dropDownState?.bindcategory || []} // Add fallback
//                 labelKey="name"
//                 valueKey="categoryID"
//               />
//               <ReportsMultiSelect
//                 name="subcategoryId"
//                 placeholderName={t("Sub Groups")}
//                 respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                 values={values}
//                 setValues={setValues}
//                 dynamicOptions={subGroup || []} // Add fallback
//                 labelKey="Name"
//                 valueKey="SubCategoryID"
//               />
              
//               <>
//                 <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
//                   <AutoComplete
//                     style={{ width: "100%" }}
//                     value={item}
//                     suggestions={Array.isArray(stockShow) ? stockShow : []}
//                     completeMethod={() => search(item)}
//                     className="w-100 "
//                     onSelect={(e) => handleSelectRow(e)}
//                     id="searchtest"
//                     onChange={(e) => {
//                       const data =
//                         typeof e.value === "object"
//                           ? e?.value?.TypeName
//                           : e.value;
//                       setItem(data);
//                       search(data);
//                       setValues({ ...values, TypeName: data });
//                     }}
//                     itemTemplate={itemTemplate}
//                   />
//                   <label htmlFor={"searchtest"} className="lable searchtest">
//                     {t(" Search Items")}
//                   </label>
//                 </div>
                
//                 <div className="d-flex flex-wrap">
//                 {/* <div className=" col-sm-12 d-flex flex-wrap"> */}
//                   {newRowData?.map((doc, key) => (
//                     <div className="d-flex ml-2 mb-2" key={key}>
//                       <LabeledInput
//                         label={"Items"}
//                         value={doc?.TypeName}
//                         className={"document_label"}
//                       />
//                       <button
//                         className="btn btn-sm btn-primary ml-2"
//                         type="button"
//                         onClick={() => {
//                           deleteDocument(doc);
//                         }}
//                       >
//                         <i className="fa fa-times fa-sm new_record_pluse"></i>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
                
//               </>
//               {payload?.billtype === "1" && (
//                 <Input
//                   type="text"
//                   className="form-control"
//                   id="BillNo"
//                   name="BillNo"
//                   value={payload?.BillNo || ""}
//                   onChange={handleChange}
//                   lable={t("Bill Number")}
//                   placeholder=" "
//                   respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                 />
//               )}
//               {payload?.billtype === "2" && (
//                 <Input
//                   type="text"
//                   className="form-control"
//                   id="ReceiptNo"
//                   name="ReceiptNo"
//                   value={payload?.ReceiptNo || ""}
//                   onChange={handleChange}
//                   lable={t("ReceiptNo")}
//                   placeholder=" "
//                   respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//                 />
//               )}
//               <Input
//                 type="number"
//                 className="form-control"
//                 id="Mobile"
//                 name="Mobile"
//                 value={payload?.Mobile || ""}
//                 onChange={handleChange}
//                 lable={t("Mobile Number")}
//                 placeholder=" "
//                 respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//               />

//               <ReactSelect
//                 placeholderName={t("Search Type")}
//                 id={"Searchtype"}
//                 searchable={true}
//                 respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//                 name={"Searchtype"}
//                 dynamicOptions={SearchtypeOptions}
//                 value={payload?.Searchtype}
//                 handleChange={handleReactSelect}
//               />
//             </>
//           )}
//           <ReportsMultiSelect
//             name="paymentMode"
//             placeholderName={t("Payment Mode")}
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             values={values}
//             setValues={setValues}
//             dynamicOptions={dropDownState?.paymentModeList || []} 
//             labelKey="PaymentMode"
//             valueKey="PaymentModeID"
//           />
//           <div
//             className={`${payload?.BillingType === "1" ? "col-12" : "col-12"}`}
//             // className={`${payload?.BillingType === "1" ? "col-12" : "col-6"}`}
//           >
//             <div className="text-right">
//               {payload?.BillingType === "1" ? (
//                 <button
//                   className="btn btn-primary btn-sm px-4 ml-1"
//                   onClick={GetSearchSales}
//                 >
//                   {t("Search")}
//                 </button>
//               ) : (
//                 <button
//                   className="btn btn-primary btn-sm px-4 ml-1"
//                   onClick={GetIPDSearchSales}
//                 >
//                   {t("Search")}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-2 spatient_registration_card">
//         <div className="patient_registration card">
//           <Heading
//             isBreadcrumb={false}
//             title={t("BillDetails")}
//             secondTitle={
//               <>
//               <span className="">
//                 {/* Total Bill Amount:{totalBillAmount} */}
//                 <p className="text-bold mb-0 mx-3">Total Bill Amount: {totalBillAmount}</p>
//               </span>
//                 <span className="pointer-cursor">
//                   <ColorCodingSearch
//                     color={"rgb(160, 216, 160)"}
//                     label={t("Pharmacy Issue")}
//                   />
//                 </span>
//                 <span className="pointer-cursor">
//                   <ColorCodingSearch
//                     color={"rgb(196, 173, 233)"}
//                     label={t("Pharmacy Return")}
//                   />
//                 </span>
//                 <span className="pointer-cursor">
//                   <ColorCodingSearch color={"yellow"} label={t("Settlement")} />
//                 </span>
//               </>
//             }
//           />
//         </div>
//       </div>
//       {tableData?.length > 0 && (
//         <div className="spatient_registration_card">
//           <div
//             className="patient_registration card "
//             style={{ borderRadius: "5px" }}
//           >
//             <ViewIssueReturnTable
//               tbody={tableData}
//               handleDoubleClick={handleDoubleClick}
//               BillingType={payload?.BillingType}
//             />
//           </div>
//         </div>
//       )}

//       {ReportVisible && (
//         <Modal
//           modalWidth={"500px"}
//           visible={ReportVisible}
//           setVisible={setReportVisible}
//           Header="Select Report Type"
//           footer={
//             <>
//               <button
//                 className="btn btn-sm btn-success mx-2"
//                 onClick={GetReportDetail}
//               >
//                 {t("Print")}
//               </button>
//               <button
//                 className="btn btn-sm btn-success mx-2"
//                 onClick={handleCancle}
//               >
//                 {t("Cancel")}
//               </button>
//             </>
//           }
//         >
//           <ViewIssueReturnModal
//             payload={payload}
//             setPayload={setPayload}
//             handleReactSelect={handleReactSelect}
//           />
//         </Modal>
//       )}
//     </>
//   );
// };

// export default ViewIssueReturn;


