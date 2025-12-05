import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  consumeType_Option,
  DayOptions,
  Expiry_Status,
  GRN_purChase_option,
  IssueTypeOptions,
  itemType_option,
  PatientTypeOption,
  ReferenceNo_option,
  Report_Formate_BasicAvg,
  Report_Formate_Pharmacy,
  Report_Type_BasicAvg,
  ReportsTypeOptions,
  ReportTypeOptions,
  RequisitionStatusOption,
  requisitionTypeOption,
  Stock_TypeOption,
  StoreLedgerNumber,
  Transaction_option,
  TransactionTypeOptions,
  type_ReportOption,
} from "../../../utils/constant";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import Input from "../../../components/formComponent/Input";
import {
  handleMultiSelectOptions,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import {
  BindGeneric,
  BindManufacturer,
  BindMedicineStoreDepartment,
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
  BindSubGroup,
  BindVendor,
  IssueDetail,
} from "../../../networkServices/InventoryApi";
import {
  ABCAnalysis,
  AdjustmentDetailReport,
  BindGroupIndentStatusReport,
  BindSupplier,
  ConsumptionReport,
  CurrentStockReport,
  GetStore,
  GRNDetailReport,
  IndentStatusReport,
  IssueDetailReport,
  ItemBindIndentStatusReport,
  ItemExpiryReport,
  ItemMovementReport,
  LowStockDetail,
  PurchaseSummaryReport,
  ReportMenu,
  ReportSubMenu,
  StockBinCardReport,
  StockLedgerReport,
  StockStatusReport,
  SupplierReturnReport,
} from "../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import TimePicker from "../../../components/formComponent/TimePicker";
import { RedirectURL } from "../../../networkServices/PDFURL";
import moment from "moment";
import IconsColor from "../../../utils/IconsColor";
import { exportToExcel } from "../../../utils/exportLibrary";
import { AutoComplete } from "primereact/autocomplete";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import {
  BillingBillingReportsOPDPatientDetailsReport,
  BillingBillingReportsStoreAvgConsumption,
} from "../../../networkServices/ReportsAPI";
import { BillingReportsPharmacyDepartment } from "../../../networkServices/EDP/edpApi";
import {
  BillingBillingReportsDrugFormularyCount,
  BillingBillingReportsDrugFormularyReport,
  BillingBillingReportsItemWisePurchase,
  BillingBillingReportsManufactureReport,
  BillingBillingReportsVendorWisePurchase,
  MedicalStoreReportHSNwisePurchaseSummaryReport,
  MedicalStoreReportStockSaltWiseReport,
  PharmacyPharmacyReportReOrderLevelReport,
} from "../../../networkServices/MRDApi";
import ItemWisePurchaseGST from "../../frontOffice/Reports/OtherReport/ItemWisePurchaseGST";
import Modal from "../../../components/modalComponent/Modal";

const StoreReports = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
  const { GetEmployeeWiseCenter, GetRoleList } = useSelector(
    (state) => state.CommonSlice
  );
  const [reportList, setReportList] = useState({});
  console.log("reportList", reportList);
  const [issueDept, setIssueDept] = useState([]);
  const [purchaseGroup, setPurchaseGroup] = useState([]);
  const [stockShow, setStockShow] = useState([]);
  const [genericSalt, setGenericSalt] = useState([]);
  const [newRowData, setNewRowData] = useState([]);
  const [genericData, setGenericData] = useState([]);
  console.log("genericData ", genericData);
  const [item, setItem] = useState("");
  const [genericListInputValue, setGenericListInputValue] = useState("");
  console.log("genericListInputValue", genericListInputValue);
  const [genericListSuggestions, setGenericListSuggestions] = useState([]);
  const [modalData, setModalData] = useState({});

  const [DropDownState, setDropDownState] = useState({
    bindreportlist: [],
    bindStore: [],
    binddepartment: [],
    bindcategory: [],
    issuedetail: [],
    bindsupply: [],
    PurchaseDepartment: [],
    bindMfg: [],
    VendorList: [],
    DepartmentList: [],
  });

  console.log(DropDownState, "dropDown");
  const initialValues = {
    departmentName: [],
    department: [
      {
        name: "GURJOT GENERAL PHARMACY",
        code: "LSHHI57",
      },
    ],
    reportFormatHSN: "1",
    reportName: "",
    centre: [],
    StoreType: "",
    department: [],
    categoryId: [],
    subcategoryId: [],
    itemId: [],
    fromDate: new Date(),
    toDate: new Date(),
    issuedTo: [],
    reportType: "D",
    issueType: "B",
    transactionType: "B",
    patientType: "0",
    reportFormat: "2",
    UHID: "",
    includeZeroStock: "",
    number: "1",
    day: "D",
    exstatus: "P",
    fromtime: new Date(),
    Totime: new Date(),
    stocktype: "P",
    typeReport: "N",
    consumeType: "0",
    ACategory: "",
    BCategory: "",
    CCategory: "",
    Supplier: "",
    purCategory: "ALL",
    purItem: "ALL",
    PendingPOQty: 0,
    dateType: "G",
    ReferenceNoType: "G",
    ReferenceNo: "",
    itemType: "P",
    TransType: "P",
    docNo: "",
    entryNo: "",
    requisitionType: "",
    indentDepartment: "",
    requisitionStatus: "",
    requisitionNo: "",
    GroupHead: 0,
    itemcheck: 0,
    TypeName: "",
    Logo: false,
    reportFormat: "2",
    reportFormatBasicAvg: "0",
    AvgReportType: "1",
    date: new Date(),
    typeReport: "1",
    reportFormatDetail: "S",
    reportFormatItemWise: "1",
    ReportType: "S",
    mfg: [],
    Department: [],
  };
  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const [subGroup, setSubGroup] = useState([]);
  const [storeItems, setStoreItems] = useState([]);

  const handleReactSelect = (name, value) => {
    if (name === "reportName") {
      setValues(initialValues);
      setNewRowData([]);
      setValues((prevData) => ({
        ...prevData,
        [name]: value?.value || "",
      }));
      GetReportSubMenu(value?.ID, value?.RelatedTo);
      GetBindPurchaseGroup(value?.ID);
    } else {
      setValues((prevData) => ({
        ...prevData,
        [name]: value?.value || "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };

  const GetReportMenu = async () => {
    try {
      const response = await ReportMenu();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetReportSubMenu = async (ID, Type) => {
    try {
      const response = await ReportSubMenu(ID, Type);
      setReportList(response?.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetBindDepartment = async () => {
    const DeptID = localData?.deptLedgerNo;
    try {
      const response = await BindMedicineStoreDepartment(DeptID);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSupplier = async () => {
    try {
      const response = await BindSupplier();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getIssueDetail = async () => {
    try {
      const response = await IssueDetail();
      setIssueDept(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBindStoreSubCategory = async () => {
    const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
    try {
      // ;
      const response = await BindStoreSubCategory(CategoryID);
      setSubGroup(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBindStoreItems = async () => {
    const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    try {
      const response = await BindStoreItems(Subcategory);
      if (response?.success) {
        setStoreItems(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetBindPurchaseGroup = async (item) => {
    const StoreNo = item ? item : values?.StoreType;
    try {
      const response = await BindGroupIndentStatusReport(StoreNo);
      if (response?.success) {
        setPurchaseGroup(response?.data);
      } else {
        console?.log("error", response?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [purchaseItems, setPurchaseItems] = useState([]);
  const GetItemBindIndentStatusReport = async (item) => {
    const SubCategoryID = values?.purCategory;
    const StoreNo = values?.StoreType;
    try {
      const response = await ItemBindIndentStatusReport(SubCategoryID, StoreNo);
      if (response?.success) {
        setPurchaseItems(response?.data);
      } else {
        console.log("error", response?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const bindPurchaseDepartment = async () => {
    const response = await BillingReportsPharmacyDepartment();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        PurchaseDepartment: response?.data,
      }));
    }
  };

  const BindVendorData = async () => {
    const response = await BindVendor(values?.StoreType);
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        VendorList: response?.data,
      }));
    }
  };

  useEffect(() => {
    if (values?.purCategory) {
      GetItemBindIndentStatusReport();
    }
  }, [values?.purCategory]);
  useEffect(() => {
    if (values?.StoreType) {
      GetBindPurchaseGroup();
      GetItemBindIndentStatusReport();
    }
  }, [values?.StoreType]);

  const fetchManufacturer = async () => {
    const payLoadList = {};
    try {
      const response = await BindManufacturer(payLoadList);
      if (response?.success) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [
        BindReportMenu,
        BindGetStore,
        BindStoreDept,
        BindGroupId,
        BindSupply,
        MfgReponse,
        PharmacyDepartment,
      ] = await Promise.all([
        GetReportMenu(),
        GetBindStoreID(),
        GetBindDepartment(),
        getBindGroup(),
        getBindSupplier(),
        fetchManufacturer(),
        BillingReportsPharmacyDepartment(),
      ]);

      const dropDownData = {
        bindreportlist: handleReactSelectDropDownOptions(
          BindReportMenu,
          "ReportName",
          "ID"
        ),
        bindStore: handleReactSelectDropDownOptions(
          BindGetStore,
          "LedgerName",
          "LedgerNumber"
        ),
        binddepartment: handleReactSelectDropDownOptions(
          BindStoreDept,
          "ledgerName",
          "ledgerNumber"
        ),
        bindcategory: handleReactSelectDropDownOptions(
          BindGroupId,
          "name",
          "categoryID"
        ),
        bindsupply: handleReactSelectDropDownOptions(
          BindSupply,
          "LedgerName",
          "LedgerNumber"
        ),
        bindMfg: handleReactSelectDropDownOptions(
          MfgReponse,
          "NAME",
          "ManufactureID"
        ),
        DepartmentList: handleReactSelectDropDownOptions(
          PharmacyDepartment?.data,
          "RoleName",
          "DeptLedgerNo"
        ),
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchManufacturer();
    //  fetchVendor()
  }, []);

  useEffect(() => {
    BindVendorData();
  }, [values?.StoreType]);

  useEffect(() => {
    if (values?.categoryId?.length > 0) {
      getBindStoreSubCategory();
    }
  }, [values.categoryId]);

  useEffect(() => {}, [item]);

  useEffect(() => {
    // GetReportMenu();
    FetchAllDropDown();
    getIssueDetail();
    // GetBindPurchaseGroup();
  }, []);

  useEffect(() => {
    bindPurchaseDepartment();
  }, [values?.reportName]);

  const getStockStatusReport = async () => {
    debugger;
    if (values?.centre?.length === 0) {
      notify("Please Select Centre", "error");
      return;
    }
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      // itemID: handlePayloadMultiSelect(values?.itemId) || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      date: moment(values?.fromDate).format("YYYY-MM-DD"),
      storeType: String(values?.StoreType) || "",
      reportType: Number(values?.reportFormat),
    };

    try {
      const response = await StockStatusReport(requestbody);

if (response?.success) {
if (values?.reportFormat === "2") {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
}else { 
  exportToExcel(response?.data, "Stock Status Report");
}     
} else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getStockLedgerReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      // storeType: String(values?.StoreType) || "",
      reportType: 1,
    };

    try {
      const response = await StockLedgerReport(requestbody);

      if (response?.success) {
        exportToExcel(response?.data, "Exel");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getCurrentStockReport = async () => {
    debugger;
    if (values?.centre?.length === 0) {
      notify("Please select the Centre", "error");
      return;
    }
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      ledgerNo: handlePayloadMultiSelect(values?.department) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subCategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      storeLedgerNo: String(values?.StoreType) || "",
      zeroStock: values?.includeZeroStock === true ? 1 : 0 || 0,
      reportType: Number(values?.reportFormat) || 2,
      type: String(values?.reportType) || "",
    };

    try {
      const response = await CurrentStockReport(requestbody);

      if (response?.success) {
        debugger;
        if (values?.reportFormat === "1") {
          exportToExcel(response?.data, "Current Stock Status Report");
          notify(response?.message, "success");
        } else {
          RedirectURL(response?.data?.pdfUrl);
          notify(response?.message, "success");
        }
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getIssueDetailReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      storeLedgerNo: String(values?.StoreType) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      deptFromLedgerNo: handlePayloadMultiSelect(values?.department) || "",
      deptToLedgerNo: handlePayloadMultiSelect(values?.issuedTo) || "",
      patientID: String(values?.UHID) || "",
      filterType: String(values?.transactionType) || "",
      reportType: String(values?.reportType) || "",
      issueType: String(values?.issueType) || "",
      patientType: String(values?.patientType) || "",
      // type: Number(values?.reportFormat) || 1,
      type: 1,
    };

    try {
      const response = await IssueDetailReport(requestbody);

      if (response?.success) {
        exportToExcel(response?.data, "Exel");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getStockBinCardReport = async () => {
    if (newRowData?.length === 0) {
      notify("Please Select atleast one Item", "error");
      return;
    }
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo:
        values?.department?.map((item) => `'${item?.code}'`).join(", ") || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      fileType: Number(values?.reportFormat) || 2,
      rType: values?.reportFormatDetail,
    };

    try {
      const response = await StockBinCardReport(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getABCAnalysis = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      storeType: String(values?.StoreType) || "",
      reportType: Number(values?.reportFormat) || 2,
      aCategory: Number(values?.ACategory) || 0,
      bCategory: Number(values?.BCategory) || 0,
      cCategory: Number(values?.CCategory) || 0,
    };

    try {
      const response = await ABCAnalysis(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getLowStockDetail = async () => {
    const payload = {
      StoreLedgerNo: String(values?.StoreType) || "",
      reportType: values?.reportFormatBasicAvg,
    };

    try {
      const response = await LowStockDetail(payload);

      if (response?.success) {
        // RedirectURL(response?.data?.pdfUrl);
        exportToExcel(response?.data, "Low Stock Report");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getItemExpiryReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      reportType: Number(values?.reportFormat) || 2,
      value: Number(values?.number) || 1,
      valueType: String(values?.day) || "",
      searchType: String(values?.exstatus) || "",
      vendor: String(values?.Supplier) || "",
    };

    try {
      const response = await ItemExpiryReport(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getItemMovementReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      reportType: Number(values?.reportFormat) || 2,
      searchType: String(values?.typeReport) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
    };

    try {
      const response = await ItemMovementReport(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAdjustmentDetailReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      reportType: Number(values?.reportFormat) || 2,
      searchType: String(values?.stocktype) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      itemType: String(values?.StoreType) || "",
    };

    try {
      const response = await AdjustmentDetailReport(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getConsumptionReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: Number(values?.reportFormat) || 2,
      storeLedgerNo: String(values?.StoreType) || "",
      transType: String(values?.consumeType) || "",
    };

    try {
      const response = await ConsumptionReport(requestbody);

      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPurchaseSummaryReport = async () => {
    const requestbody = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      group: String(values?.purCategory) || "",
      item: String(values?.purItem) || "",
      type: "",
      pendingPOQty: values?.PendingPOQty === true ? 1 : 0,
      billied: "All",
      storeType: String(values?.StoreType) || "",
      reportType: 1,
    };

    try {
      const response = await PurchaseSummaryReport(requestbody);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getIndentStatusReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      dept: String(values?.indentDepartment) || "",
      indentNo: String(values?.requisitionNo) || "",
      storeNo: String(values?.StoreType) || "",
      groupHead: values?.GroupHead === true ? 1 : 0,
      subCategory: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemcheck: values?.itemcheck === true ? 1 : 0,
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      status: String(values?.requisitionStatus) || "",
      type: String(values?.requisitionType) || "",
      reportType: 1,
    };

    try {
      const response = await IndentStatusReport(requestbody);

      exportToExcel(response?.data, "Exel");
      if (response?.success) {
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getGRNDetailReport = async () => {
    const requestbody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      categoryID: handlePayloadMultiSelect(values?.categoryId) || "",
      subcategoryID: handlePayloadMultiSelect(values?.subcategoryId) || "",
      itemID: newRowData?.map((item) => item?.ItemID).join(", ") || "",
      deptledgerNo: handlePayloadMultiSelect(values?.department) || "",
      // date: "",
      storeLedgerNo: String(values?.StoreType) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      dateType: String(values?.dateType) || "",
      venderLedgerNo: String(values?.Supplier) || "",
      refType: String(values?.ReferenceNoType) || "",
      refNumber: String(values?.ReferenceNo) || "",
      itemType: String(values?.itemType) || "",
      tranType: String(values?.TransType) || "",
      reportType: String(values?.reportType) || "",
      Type: 1,
    };

    try {
      const response = await GRNDetailReport(requestbody);

      if (response?.success) {
        exportToExcel(response?.data, "Exel");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAverageConsumptionReport = async () => {
    const payload = {
      subcategoryID:
        values?.subcategoryId?.length > 0
          ? values?.subcategoryId?.map((id) => id?.code).join(",")
          : "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      // fileType: 0,
      reportType: values?.AvgReportType,
      fileType: values?.reportFormatBasicAvg,
    };

    const response = await BillingBillingReportsStoreAvgConsumption(payload);
    if (response?.success) {
      if (values?.reportFormatBasicAvg === "0") {
        exportToExcel(response?.data, "Basic Store Consumption");
      } else if (values?.reportFormat === "2") {
        RedirectURL(response?.data?.pdfUrl);
      }
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleItemWisePurchaseGST = async () => {
    debugger;
    if (!values?.StoreType) {
      notify("Please select a Store Type", "error");
      return;
    } else if (values?.departmentName.length === 0) {
      notify("Please Select Department", "error");
      return;
    }
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD") || new Date(),
      toDate: moment(values?.toDate).format("YYYY-MM-DD") || new Date(),
      itemID: newRowData?.map((item) => `'${item?.ItemID}'`).join(","),
      deptLedgerNo: values?.departmentName
        ?.map((item) => `'${item?.code}'`)
        .join(","),
      storeType: values?.StoreType,
      printType: Number(values?.reportFormatItemWise),
      subcategoryID:values?.subcategoryId?.map((item) => `'${item?.code}'`).join(","),
    };

    const response = await BillingBillingReportsItemWisePurchase(payload);
    if (response?.success) {
      if (values?.reportFormatItemWise === "0") {
        exportToExcel(response?.data, "Item Wise Purchase GST");
      } else {
        RedirectURL(response?.data?.pdfUrl);
      }
    } else {
      notify(response?.message, "error");
    }
  };


  const handleDrugFormularyCount = async () => {
    

    const response = await BillingBillingReportsDrugFormularyCount();
    if (response?.success) {
      setModalData({
        label: "Count Data",
        width: "20vw",
        isOpen: true,
        Component: (
          <>
            <span style={{display:"flex" , alignItems:"center" , justifyContent:"center" , fontWeight:"900"}} className="custom-font-size">{response?.data}</span>
          </>
        ),
        handleStateInsertAPI: "",
        extrabutton:"",
      });
    }
  };

  const handleDrugFormularyExcel = async () => {
    const response = await BillingBillingReportsDrugFormularyReport();
    if (response?.success) {
    debugger
      exportToExcel(response?.data, "Drug Formulary Report");
    } else {
      notify(response?.message, "error");
    }
  };

  const hsnWisePurchaseSummaryReport = async () => {
    debugger;
    if (!values?.StoreType) {
      notify("Please select a Store Type", "error");
      return;
    } else if (!values?.departmentName?.length) {
      notify("Please Select Department", "error");
      return;
    } else if (!values?.reportFormatHSN) {
      notify("Please Select Report Format", "error");
      return;
    }
    const payload = {
      periodFrom: moment(values?.fromDate).format("YYYY-MM-DD") || new Date(),
      periodTo: moment(values?.toDate).format("YYYY-MM-DD") || new Date(),
      itemID: newRowData?.map((item) => `'${item?.ItemID}'`).join(","),
      deptLedgerNo: values?.departmentName
        ?.map((item) => `'${item?.code}'`)
        .join(","),
      storeType: values?.StoreType,
      reportType: Number(values?.reportFormatHSN),
    };

    const response =
      await MedicalStoreReportHSNwisePurchaseSummaryReport(payload);
    if (response?.success) {
      if (values?.reportFormatHSN === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        exportToExcel(response?.data, "HSN Wise Purchase Summary Report");
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const vendorWisePurchaseReport = async () => {
    if (!values?.StoreType) {
      notify("Please Select Store Type", "error");
      return;
    } else if (!values?.departmentName.length) {
      notify("Please Select Department", "error");
      return;
    }
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD") || new Date(),
      toDate: moment(values?.toDate).format("YYYY-MM-DD") || new Date(),
      reportType: String(values?.ReportType) || "",
      vendorID:
        values?.vendorName?.map((val) => `'${val?.code}'`).join(",") || "",
      storeType: values?.StoreType || "STO00001",
      deptLedgerNo:
        values?.departmentName?.map((val) => `'${val?.code}'`).join(",") || "",
      printType: 1,
    };
    const response = await BillingBillingReportsVendorWisePurchase(payload);

    if (response?.success) {
      RedirectURL(response?.data?.pdfUrl);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (values?.centre == "") {
      //   notify("Centre is Required", "error");
      // } else {
      if (values?.reportName === 1) {
        getStockStatusReport();
      } else if (values?.reportName === 3) {
        getCurrentStockReport();
      } else if (values?.reportName === 5) {
        getStockBinCardReport();
      } else if (values?.reportName === 6) {
        getABCAnalysis();
      } else if (values?.reportName === 7) {
        getLowStockDetail();
      } else if (values?.reportName === 8) {
        getItemExpiryReport();
      } else if (values?.reportName === 9) {
        getItemMovementReport();
      } else if (values?.reportName === 10) {
        getAdjustmentDetailReport();
      } else if (values?.reportName === 11) {
        getConsumptionReport();
      } else if (values?.reportName === 15) {
        getSupplierReturnReport();
      } else if (values?.reportName === 16) {
        getAverageConsumptionReport();
      } else if (values?.reportName === 18) {
        ReorderLevelReport();
      } else if (values?.reportName === 17) {
        pharmacyStockStatusReport();
      } else if (values?.reportName === 19) {
        manufactureReport();
      } else if (values?.reportName === 20) {
        hsnWisePurchaseSummaryReport();
      } else if (values?.reportName === 21) {
        vendorWisePurchaseReport();
      } else if (values?.reportName === 22) {
        handleItemWisePurchaseGST();
      } else if (values?.reportName === 23) {
        handleDrugFormularyExcel();
      }
      // }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  useEffect(() => {
    if (GetEmployeeWiseCenter.length > 0) fetchData();
  }, [GetEmployeeWiseCenter?.length]);

  useEffect(() => {
    if (DropDownState?.binddepartment.length > 0) fetchData();
  }, [DropDownState?.binddepartment?.length]);

  const fetchData = async () => {
    try {
      setValues({
        ...values,
        ["centre"]: handleMultiSelectOptions(
          GetEmployeeWiseCenter,
          "CentreName",
          "CentreID"
        ),

        ["department"]: handleMultiSelectOptions(
          DropDownState?.binddepartment,
          "ledgerName",
          "ledgerNumber"
        ),
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleSubmitExcel = async (e) => {
    e.preventDefault();
    try {
      if (values?.reportName === 15) {
        getSupplierReturnReport();
      } else if (values?.reportName === 14) {
        getGRNDetailReport();
      } else if (values?.reportName === 4) {
        getIssueDetailReport();
      } else if (values?.reportName === 2) {
        getStockLedgerReport();
      } else if (values?.reportName === 12) {
        getPurchaseSummaryReport();
      } else if (values?.reportName === 13) {
        getIndentStatusReport();
      }else if (values?.reportName === 1) {
        getStockStatusReport();
      } 
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };
  const getSupplierReturnReport = async () => {
    const requestbody = {
      ledgerNumber: String(values?.Supplier) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      indentNo: String(values?.docNo) || "",
      salesno: String(values?.entryNo) || "",
      reportType: Number(values?.reportFormat),
      Logo: values?.Logo === true ? 1 : 0,
    };

    try {
      const response = await SupplierReturnReport(requestbody);

      if (response?.success) {
        if (requestbody?.reportType == 2) {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          // exportToExcel(response?.data, "Vendor Return Report");
          exportToExcel(
            ExceldataFormatter(response?.data),
            "Vendor Return Report"
          );
        }
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ExceldataFormatter = (venderTable) => {
    const HardCopy = JSON.parse(JSON.stringify(venderTable));
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      delete ele?.store;
      delete ele?.gstAmt;
      delete ele?.qunatity;
      delete ele?.requisitionNo;
      delete ele?.medExpiryDate;
      delete ele?.perUnitBuyPrice;
      delete ele?.discPer;
      delete ele?.taxableAmt;
      return { ...ele };
    });

    return modifiedResponseData;
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    console.log(selectedOptions);
    setValues({ ...values, [name]: selectedOptions });
  };
  // const handleMultiSelectChange = (name, selectedOptions) => {
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: selectedOptions?.map((option) => option?.code),
  //   }));
  // };

  const handleSelectRow = (e) => {
    const { value } = e;
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [...prevData, value];
    });
    setItem("");
  };

  const searchData = async (searchItem) => {
    const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    const ItemName = searchItem?.query;

    // const ItemName = values?.TypeName;
    try {
      if (ItemName?.length > 2) {
        const response = await BindStoreItems(Subcategory, ItemName);
        setStockShow(response?.data);
      } else {
        setStockShow([]);
      }
    } catch (error) {
      setStockShow([]);
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const search = async (searchItem) => {
    const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    const ItemName = searchItem || item;

    // const ItemName = values?.TypeName;
    try {
      if (ItemName?.length > 2) {
        const response = await BindStoreItems(Subcategory, ItemName);
        setStockShow(response?.data);
      } else {
        setStockShow([]);
      }
    } catch (error) {
      setStockShow([]);
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const searchSalt = async (e) => {
    const response = await api(e.query);
    try {
      if (response?.success) {
        setGenericSalt(response?.data || []);
      }
    } catch (error) {
      console.log("error Occurred", error);
    }
  };

  const itemTemplate = (item) => {
    //
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };
  const handleReport = async () => {};

  const deleteDocument = (doc) => {
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    // setValues((val) => ({ ...val, documentIds: docDetail }));
    setNewRowData(docDetail);
  };

  const ReorderLevelReport = async () => {
    debugger;
    if (!values?.pharmacy) {
      notify("Please Select Pharmacy", "error");
      return;
    }
    const payload = {
      periodDate: moment(values?.date).format("YYYY-MM-DD"),
      deptLedgerNo: values?.pharmacy.map((item) => `'${item?.code}'`).join(","),
      printType: Number(values?.typeReport),
    };

    const response = await PharmacyPharmacyReportReOrderLevelReport(payload);
    if (response?.success) {
      if (values?.typeReport === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        const filteredData = response?.data?.map((item, index) => ({
          itemName: item.itemName,
          balance: item.balance,
          reorderLevel: item.reorderLevel,
          maxLevel: item.maxLevel,
          qtyToBeOrdered: item?.qtyToBeOrdered,
        }));
        exportToExcel(filteredData, "Reorder Level Report");
      }
    } else {
      notify;
    }
  };
  const pharmacyStockStatusReport = async () => {
    debugger;
    if (!genericData) {
      notify("Please Select Item", "error");
      return;
    }
    const payload = {
      deptledgerNo: "'All'",
      period: moment(values?.date).format("YYYY-MM-DD"),
      saltID: String(genericData?.ItemID),
      ReportType: Number(values?.typeReport),
    };

    const response = await MedicalStoreReportStockSaltWiseReport(payload);
    if (response?.success) {
      if (values?.typeReport === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        exportToExcel(response?.data);
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const manufactureReport = async () => {
    debugger;
    if (values?.Department?.length === 0) {
      notify("Please Select Department", "error");
      return;
    } else if (!values?.StoreType) {
      notify("Please Select Store", "error");
      return;
    } else if (!values?.mfg) {
      notify("Please Select atleast a Manufacture", "error");
      return;
    }
    console.log("values", values);

    const payload = {
      storeType: String(values?.StoreType),
      deptLedgerNo: values?.Department?.map((val) => `'${val?.code}'`).join(
        ","
      ),
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      manufactureID: values?.mfg?.map((val) => `'${val?.code}'`).join(","),
      printType: 1,
    };

    const response = await BillingBillingReportsManufactureReport(payload);
    if (response?.success) {
      RedirectURL(response?.data?.pdfUrl);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleGenericListSearch = async (event) => {
    const query = { event };
    const filtered = await BindGeneric(query);
    setGenericListSuggestions(
      filtered?.data?.map((ele) => ({ TypeName: ele.NAME, ItemID: ele.VALUE }))
    );
  };

  const handleGenericListChange = (e) => {
    if (e.value) {
      setGenericListInputValue(e.value);
    }
  };

  const handleGenericListSelect = (e) => {
    const { value } = e;
    // setValues((prev) => ({
    //   ...prev,
    //   GenericList: e.value.VALUE,
    // }));
    // if (genericData?.length >= 1) {
    //   setGenericListInputValue("");
    //   notify("Only One Item can be selected", "error");
    //   return;
    // }
    // setGenericListInputValue(value)
    setGenericListInputValue(value?.TypeName);
    setGenericData(value);
    // setValues((prevPayload) => ({
    //   ...prevPayload,
    //   ItemID: value?.ItemID.join(", "),
    // }));
    // setGenericListInputValue("");
  };

  const deleteGenericDocument = (doc) => {
    const genericDataFilter = genericData?.filter(
      (val) => val?.ItemID !== doc?.ItemID
    );
    setGenericData(genericDataFilter);
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Report Name")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"reportName"}
            searchable={true}
            name={"reportName"}
            dynamicOptions={DropDownState?.bindreportlist}
            value={values?.reportName}
            handleChange={handleReactSelect}
          />
        </div>
        {values?.reportName === 91 && (
          <div className="card">
            <Heading title={t("Reorder Level Report")} isBreadcrumb={false} />
          </div>
        )}
        {values?.reportName === 92 && <></>}
        {/* {values?.reportName === 90 && (
          <div className="card">
            <Heading title={t("Required Fields")} isBreadcrumb={false} />
            <div className="row p-2">
              
            </div>
          </div>
        )} */}
      </div>
      {!reportList?.ID ? (
        ""
      ) : (
        <div className="card">
          <Heading title={t("Required Fields")} />

          <form className="patient_registration position-relative">
            <div className="row p-2">
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 13 ||
                reportList?.ID === 14) && (
                <ReportsMultiSelect
                  name="centre"
                  placeholderName="Centre"
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  values={values}
                  setValues={setValues}
                  dynamicOptions={GetEmployeeWiseCenter}
                  labelKey="CentreName"
                  valueKey="CentreID"
                  requiredClassName={true}
                />
              )}
              {reportList?.ID === 7 && (
                <ReactSelect
                  placeholderName={t("Report Format")}
                  id={"reportFormatBasicAvg"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={Report_Formate_BasicAvg}
                  name="reportFormatBasicAvg"
                  handleChange={handleReactSelect}
                  value={values?.reportFormatBasicAvg}
                />
              )}
              {reportList?.ID === 19 && (
                <>
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("From Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.fromDate}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("To Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  <ReportsMultiSelect
                    name="Department"
                    placeholderName={t("Department")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.DepartmentList}
                    labelKey="RoleName"
                    valueKey="DeptLedgerNo"
                    requiredClassName={"required-fields"}
                  />
                  <ReactSelect
                    placeholderName={t("Store Type")}
                    id={"StoreType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"StoreType"}
                    dynamicOptions={DropDownState?.bindStore}
                    value={values?.StoreType}
                    handleChange={handleReactSelect}
                  />
                  <ReportsMultiSelect
                    name="mfg"
                    placeholderName={t("Manufacturer")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.bindMfg}
                    labelKey="NAME"
                    valueKey="ManufactureID"
                  />
                </>
              )}
              {reportList?.ID === 16 && (
                <>
                  <ReportsMultiSelect
                    name="categoryId"
                    placeholderName={t("Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.bindcategory}
                    labelKey="name"
                    valueKey="categoryID"
                  />
                  <ReportsMultiSelect
                    name="subcategoryId"
                    placeholderName={t("Sub Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={subGroup}
                    labelKey="Name"
                    valueKey="SubCategoryID"
                  />
                  <ReactSelect
                    placeholderName={t("Report Format")}
                    id={"reportFormatBasicAvg"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Formate_BasicAvg}
                    name="reportFormatBasicAvg"
                    handleChange={handleReactSelect}
                    value={values?.reportFormatBasicAvg}
                  />
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"AvgReportType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Type_BasicAvg}
                    name="AvgReportType"
                    handleChange={handleReactSelect}
                    value={values?.AvgReportType}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("From Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.fromDate}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("To Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  {/* <button
                    className="btn btn-success ml-2"
                    onClick={getAverageConsumptionReport}
                  >
                    {t("Report")}
                  </button> */}
                </>
              )}
              {reportList?.ID === 18 && (
                <>
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="date"
                    name="date"
                    lable={t("Date")}
                    values={values}
                    setValues={setValues}
                    max={new Date()}
                    // max={values?.date}
                  />
                  <ReportsMultiSelect
                    name="pharmacy"
                    placeholderName={t("Pharmacy")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    requiredClassName={"required-fields"}
                    dynamicOptions={DropDownState?.PurchaseDepartment}
                    labelKey="RoleName"
                    valueKey="DeptLedgerNo"
                  />
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"typeReport"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Formate_BasicAvg}
                    name="typeReport"
                    handleChange={handleReactSelect}
                    value={values?.typeReport}
                  />
                </>
              )}
              {reportList?.ID === 17 && (
                <>
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="date"
                    name="date"
                    lable={t("Date")}
                    values={values}
                    setValues={setValues}
                    max={new Date()}
                  />
                  <div className="col-xl-4 col-md-4 col-sm-4 col-12 pb-2">
                    <AutoComplete
                      style={{ width: "100%" }}
                      placeholder={t("Salt")}
                      value={genericListInputValue}
                      suggestions={genericListSuggestions}
                      completeMethod={handleGenericListSearch}
                      className={`required-fields`}
                      onSelect={handleGenericListSelect}
                      id="GenericList"
                      inputId="GenericList"
                      onChange={(e) => handleGenericListChange(e)}
                      itemTemplate={itemTemplate}
                      dropdownStyle={{ width: "100%" }}
                      panelClassName="autocomplete-panel"
                      respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                      forceSelection
                      field="NAME"
                    />
                    <label htmlFor={"genericList"} className="lable searchtest">
                      {t("Salt")}
                    </label>
                  </div>
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"typeReport"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Formate_BasicAvg}
                    name="typeReport"
                    handleChange={handleReactSelect}
                    value={values?.typeReport}
                  />
                </>
              )}
              {reportList?.ID === 23 && (
                <>
                  <button
                    className="btn btn-success ml-2"
                    type="button"
                    onClick={() => handleDrugFormularyCount()}
                  >
                    Count
                  </button>
                  {/* <button
                    className="btn btn-success"
                    onClick={handleDrugFormularyExcel}
                  >
                    Excel
                  </button> */}
                </>
              )}
              {reportList?.ID === 20 && (
                <>
                  <ReactSelect
                    placeholderName={t("Store Type")}
                    id={"StoreType"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { label: " Medical Store", value: "STO00001" },
                      { label: "General Store", value: "STO00002" },
                    ]}
                    name="StoreType"
                    handleChange={handleReactSelect}
                    value={values?.StoreType}
                    requiredClassName="required-fields"
                  />
                  <ReportsMultiSelect
                    name="departmentName"
                    placeholderName={t("Department Name")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    requiredClassName={"required-fields"}
                    dynamicOptions={DropDownState?.PurchaseDepartment}
                    labelKey="RoleName"
                    valueKey="DeptLedgerNo"
                  />
                  {console.log("first", DropDownState?.PurchaseDepartment)}
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("fromDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("toDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  <ReportsMultiSelect
                    name="categoryId"
                    placeholderName={t("Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.bindcategory}
                    labelKey="name"
                    valueKey="categoryID"
                  />
                  <ReportsMultiSelect
                    name="subcategoryId"
                    placeholderName={t("Sub Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={subGroup}
                    labelKey="Name"
                    valueKey="SubCategoryID"
                  />
                  <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                    <AutoComplete
                      style={{ width: "100%" }}
                      value={item}
                      suggestions={Array.isArray(stockShow) ? stockShow : []}
                      completeMethod={(e) => searchData(e)}
                      className="w-100 "
                      onSelect={(e) => handleSelectRow(e)}
                      id="searchtest"
                      onChange={(e) => {
                        const data =
                          typeof e.value === "object"
                            ? e?.value?.TypeName
                            : e.value;
                        setItem(data);
                        // search(data);
                        // setValues({ ...values, TypeName: data });
                      }}
                      itemTemplate={itemTemplate}
                    />
                    <label htmlFor={"searchtest"} className="lable searchtest">
                      {t(" Search Items")}
                    </label>
                  </div>
                  <ReactSelect
                    placeholderName={t("Report Format")}
                    id={"reportFormatHSN"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Formate_BasicAvg}
                    name="reportFormatHSN"
                    handleChange={handleReactSelect}
                    value={values?.reportFormatHSN}
                  />
                  <div className=" col-sm-12 d-flex">
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
              )}
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 6 ||
                reportList?.ID === 7 ||
                reportList?.ID === 8 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 12 ||
                reportList?.ID === 13 ||
                reportList?.ID === 14) && (
                <ReactSelect
                  placeholderName={t("Store Type")}
                  id={"StoreType"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name={"StoreType"}
                  dynamicOptions={DropDownState?.bindStore}
                  value={values?.StoreType}
                  handleChange={handleReactSelect}
                />
              )}
              {/* {values?.reportName === 90 && (
                <>
                  <ReactSelect
                    placeholderName={t("Groups")}
                    id={"purCategory"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"purCategory"}
                    dynamicOptions={[
                      { label: "ALL", value: "ALL" },
                      ...purchaseGroup?.map((ele) => ({
                        label: ele?.GroupHead,
                        value: ele?.SubCategoryID,
                      })),
                    ]}
                    value={values?.purCategory}
                    handleChange={handleReactSelect}
                  />
                  <ReportsMultiSelect
                    name="subcategoryId"
                    placeholderName={t("Sub Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={subGroup}
                    labelKey="Name"
                    valueKey="SubCategoryID"
                  />
                  <ReactSelect
                    placeholderName={t("Report Format")}
                    id={"reportFormat"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={Report_Formate_Pharmacy}
                    name="reportFormat"
                    handleChange={handleReactSelect}
                    value={values?.reportFormat}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("From Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.fromDate}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("To Date")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                </>
              )} */}

              {reportList?.ID === 12 && (
                <>
                  <ReactSelect
                    placeholderName={t("Groups")}
                    id={"purCategory"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"purCategory"}
                    dynamicOptions={[
                      { label: "ALL", value: "ALL" },
                      ...purchaseGroup?.map((ele) => ({
                        label: ele?.GroupHead,
                        value: ele?.SubCategoryID,
                      })),
                    ]}
                    value={values?.purCategory}
                    handleChange={handleReactSelect}
                  />
                  <ReactSelect
                    placeholderName={t("Items")}
                    id={"purItem"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"purItem"}
                    dynamicOptions={[
                      { label: "ALL", value: "ALL" },
                      ...purchaseItems?.map((ele) => ({
                        label: ele?.TypeName,
                        value: ele?.ItemID,
                      })),
                    ]}
                    value={values?.purItem}
                    handleChange={handleReactSelect}
                  />
                </>
              )}
              {reportList?.ID === 13 && (
                <>
                  <ReactSelect
                    placeholderName={t("Requisition Type")}
                    id={"requisitionType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"requisitionType"}
                    dynamicOptions={requisitionTypeOption}
                    value={values?.requisitionType}
                    handleChange={handleReactSelect}
                  />
                  <ReactSelect
                    placeholderName={t("Department")}
                    id={"indentDepartment"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"indentDepartment"}
                    dynamicOptions={GetRoleList?.map((ele) => {
                      return {
                        label: ele?.roleName,
                        value: ele?.roleID,
                      };
                    })}
                    value={values?.indentDepartment}
                    handleChange={handleReactSelect}
                  />
                </>
              )}
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 14) && (
                <ReportsMultiSelect
                  name="department"
                  placeholderName={t("Department")}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  values={values}
                  setValues={setValues}
                  dynamicOptions={DropDownState?.binddepartment}
                  labelKey="ledgerName"
                  valueKey="ledgerNumber"
                />
              )}
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 14) && (
                <ReportsMultiSelect
                  name="categoryId"
                  placeholderName={t("Groups")}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  values={values}
                  setValues={setValues}
                  dynamicOptions={DropDownState?.bindcategory}
                  labelKey="name"
                  valueKey="categoryID"
                />
                // <MultiSelectComp
                //   respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                //   name="categoryId"
                //   id="categoryId"
                //   placeholderName="Groups"
                //   handleChange={handleMultiSelectChange}
                //   value={values?.categoryId}
                //   dynamicOptions={DropDownState?.bindcategory.map((item) => ({
                //     name: item.name,
                //     code: item.categoryID,
                //   }))}
                // />
              )}
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 14) && (
                <ReportsMultiSelect
                  name="subcategoryId"
                  placeholderName={t("Sub Groups")}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  values={values}
                  setValues={setValues}
                  dynamicOptions={subGroup}
                  labelKey="Name"
                  valueKey="SubCategoryID"
                  // disabled={values?.categoryId?.length > 0 ? false : true}
                />
                // <MultiSelectComp
                //   respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                //   name="subcategoryId"
                //   id="subcategoryId"
                //   placeholderName="Sub Groups"
                //   handleChange={handleMultiSelectChange}
                //   value={values?.subcategoryId}
                //   // dynamicOptions={subGroup.map((item) => ({
                //   //   name: item.Name,
                //   //   code: item.SubCategoryID,
                //   // }))}
                //   dynamicOptions={uniqueSubGroups.map((item) => ({
                //     name: item.Name || "Unnamed Group",
                //     code: item.SubCategoryID,
                //   }))}
                // />
              )}
              {reportList?.ID === 5 && (
                <ReactSelect
                  placeholderName={t("Report Format")}
                  id={"reportFormatDetail"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={ReportsTypeOptions}
                  name="reportFormatDetail"
                  handleChange={handleReactSelect}
                  value={values?.reportFormatDetail}
                />
              )}
              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 14) && (
                // <MultiSelectComp
                //   respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                //   name="itemId"
                //   id="itemId"
                //   placeholderName="Item"
                //   handleChange={handleMultiSelectChange}
                //   value={values?.itemId}
                //   dynamicOptions={storeItems.map((item) => ({
                //     name: item.TypeName,
                //     code: item.ItemID,
                //   }))}
                // />

                // <ReportsMultiSelect
                //   name="itemId"
                //   placeholderName="Items"
                //   respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                //   values={values}
                //   setValues={setValues}
                //   dynamicOptions={storeItems?.slice(0, 2000)}
                //   labelKey="TypeName"
                //   valueKey="ItemID"
                // />
                <>
                  <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                    <AutoComplete
                      style={{ width: "100%" }}
                      value={item}
                      // suggestions={stockShow}
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
                      // disabled={
                      //   values?.subcategoryId?.length > 0 ? false : true
                      // }
                    />
                    <label htmlFor={"searchtest"} className="lable searchtest">
                      {t(" Search Items")}
                    </label>
                  </div>
                  {/* <div className="col-sm-12 pb-1">
                    {newRowData?.map((row) => row?.TypeName).join(", ")}
                  </div> */}
                  <div className=" col-sm-12 d-flex">
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
              )}
              {reportList?.ID === 15 && (
                <>
                  <Input
                    type="text"
                    className="form-control"
                    id="docNo"
                    name="docNo"
                    value={values?.docNo}
                    onChange={handleChange}
                    lable={t("Document No.")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  />

                  <Input
                    type="text"
                    className="form-control"
                    id="entryNo"
                    name="entryNo"
                    value={values?.entryNo}
                    onChange={handleChange}
                    lable={t("Entry No.")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  />
                </>
              )}

              {(reportList?.ID === 1 ||
                reportList?.ID === 2 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 12 ||
                reportList?.ID === 13 ||
                reportList?.ID === 14 ||
                reportList?.ID === 15) && (
                <ReportDatePicker
                  className="custom-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  id="fromDate"
                  name="fromDate"
                  lable={t("fromDate")}
                  values={values}
                  setValues={setValues}
                  max={values?.toDate}
                />
              )}
              {(reportList?.ID === 2 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 12 ||
                reportList?.ID === 13 ||
                reportList?.ID === 14 ||
                reportList?.ID === 15) && (
                <ReportDatePicker
                  className="custom-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  id="toDate"
                  name="toDate"
                  lable={t("To Date")}
                  values={values}
                  setValues={setValues}
                  max={new Date()}
                  min={values?.fromDate}
                />
              )}
              {reportList?.ID === 22 && (
                <>
                  <ReactSelect
                    placeholderName={t("Store Type")}
                    id={"StoreType"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { label: " Medical Store", value: "STO00001" },
                      { label: "General Store", value: "STO00002" },
                    ]}
                    name="StoreType"
                    handleChange={handleReactSelect}
                    value={values?.StoreType}
                    requiredClassName="required-fields"
                  />
                  {console.log("first", DropDownState)}
                  <ReportsMultiSelect
                    name="departmentName"
                    placeholderName={t("Department Name")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    requiredClassName={"required-fields"}
                    dynamicOptions={DropDownState?.PurchaseDepartment}
                    labelKey="RoleName"
                    valueKey="DeptLedgerNo"
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("fromDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("toDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                  />
                  <ReportsMultiSelect
                    name="categoryId"
                    placeholderName={t("Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.bindcategory}
                    labelKey="name"
                    valueKey="categoryID"
                  />
                  <ReportsMultiSelect
                    name="subcategoryId"
                    placeholderName={t("Sub Groups")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={subGroup}
                    labelKey="Name"
                    valueKey="SubCategoryID"
                  />
                  {console.log("stockShow", stockShow)}
                  <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                    <AutoComplete
                      style={{ width: "100%" }}
                      value={item}
                      suggestions={stockShow}
                      completeMethod={(e) => searchData(e)}
                      className="w-100 "
                      onSelect={(e) => handleSelectRow(e)}
                      id="searchtest"
                      onChange={(e) => {
                        const data =
                          typeof e.value === "object"
                            ? e?.value?.TypeName
                            : e.value;
                        setItem(data);
                        // searchData(data);
                        // setValues({ ...values, TypeName: data });
                      }}
                      itemTemplate={itemTemplate}
                    />
                    {/* <AutoComplete
                                value={item}
                                suggestions={stockShow}
                                completeMethod={(e) => {
                                  search(e, "AccountName");
                                }}
                                onChange={(e) => setValues({ ...values, AccountName: e.value })}
                                className="w-100"
                                onSelect={(e) => validateInvestigation(e, "AccountName")}
                                id="AccountName"
                                itemTemplate={itemTemplate}
                                onBlur={() => {
                                  setValues((prev) => ({
                                    ...prev,
                                    AccountType: "",
                                    AccountName: "",
                                  }));
                                }}
                              /> */}
                    <label htmlFor={"searchtest"} className="lable searchtest">
                      {t(" Search Items")}
                    </label>
                  </div>
                  <ReactSelect
                    placeholderName={t("Report Format")}
                    id={"reportFormatItemWise"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={[
                      {
                        label: "PDF",
                        value: "1",
                      },
                      {
                        label: "Excel",
                        value: "0",
                      },
                    ]}
                    name="reportFormatItemWise"
                    handleChange={handleReactSelect}
                    value={values?.reportFormatItemWise}
                  />
                  <div className=" col-sm-12 d-flex">
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
              )}
              {reportList?.ID === 21 && (
                <>
                  <ReactSelect
                    placeholderName={t("Store Type")}
                    id={"StoreType"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { label: " Medical Store", value: "STO00001" },
                      { label: "General Store", value: "STO00002" },
                    ]}
                    name="StoreType"
                    handleChange={handleReactSelect}
                    value={values?.StoreType}
                    requiredClassName="required-fields"
                  />
                  <ReportsMultiSelect
                    name="vendorName"
                    placeholderName={t("Vendor Name")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.VendorList}
                    labelKey="LedgerName"
                    valueKey="VendorID"
                  />
                  <ReportsMultiSelect
                    name="departmentName"
                    placeholderName={t("Department Name")}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    setValues={setValues}
                    dynamicOptions={DropDownState?.PurchaseDepartment}
                    labelKey="RoleName"
                    valueKey="DeptLedgerNo"
                    requiredClassName={"required-fields"}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id={"fromDate"}
                    name={"fromDate"}
                    lable={t("From Date")}
                    values={values}
                    setValues={setValues}
                  />
                  <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id={"toDate"}
                    name={"toDate"}
                    lable={t("To Date")}
                    values={values}
                    setValues={setValues}
                  />
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"ReportType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                    // dynamicOptions={dropDownState}
                    dynamicOptions={[
                      { label: "Detail ", value: "D" },
                      { label: "Summary", value: "S" },
                    ]}
                    name="ReportType"
                    handleChange={handleReactSelect}
                    value={values?.ReportType}
                  />
                </>
              )}
              {reportList?.ID === 13 && (
                <>
                  <ReactSelect
                    placeholderName={t("Requisition Status")}
                    id={"requisitionStatus"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"requisitionStatus"}
                    dynamicOptions={RequisitionStatusOption}
                    value={values?.requisitionStatus}
                    handleChange={handleReactSelect}
                  />
                  <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                    <div className="d-flex">
                      <div className="box-inner">
                        <Input
                          type="checkbox"
                          placeholder=" "
                          className="mt-2"
                          name="GroupHead"
                          onChange={handleChange}
                          checked={values?.GroupHead === true ? "1" : "0"}
                        />
                      </div>
                      <ReactSelect
                        placeholderName={t("Groups")}
                        id={"purCategory"}
                        searchable={true}
                        respclass="w-100 pl-2"
                        name={"purCategory"}
                        dynamicOptions={[
                          { label: "ALL", value: "ALL" },
                          ...purchaseGroup?.map((ele) => ({
                            label: ele?.GroupHead,
                            value: ele?.SubCategoryID,
                          })),
                        ]}
                        value={values?.purCategory}
                        handleChange={handleReactSelect}
                        isDisabled={values?.GroupHead === true ? false : true}
                      />
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                    <div className="d-flex">
                      <div className="box-inner">
                        <Input
                          type="checkbox"
                          placeholder=" "
                          className="mt-2"
                          name="itemcheck"
                          onChange={handleChange}
                          checked={values?.itemcheck === true ? "1" : "0"}
                        />
                      </div>
                      <ReactSelect
                        placeholderName={t("Items")}
                        id={"purItem"}
                        searchable={true}
                        respclass="w-100 pl-2"
                        name={"purItem"}
                        dynamicOptions={[
                          { label: "ALL", value: "ALL" },
                          ...purchaseItems?.map((ele) => ({
                            label: ele?.TypeName,
                            value: ele?.ItemID,
                          })),
                        ]}
                        value={values?.purItem}
                        handleChange={handleReactSelect}
                        isDisabled={values?.itemcheck === true ? false : true}
                      />
                    </div>
                  </div>
                  <Input
                    type="number"
                    className="form-control"
                    id="requisitionNo"
                    name="requisitionNo"
                    value={values?.requisitionNo}
                    onChange={handleChange}
                    lable={t("Requisition No.")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  />
                </>
              )}
              {reportList?.ID === 4 && (
                <ReportsMultiSelect
                  name="issuedTo"
                  placeholderName="Issued To"
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  values={values}
                  setValues={setValues}
                  dynamicOptions={issueDept}
                  labelKey="ledgerName"
                  valueKey="ledgerNumber"
                />
              )}
              {(reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 14) && (
                <ReactSelect
                  placeholderName={t("Report Type")}
                  id="reportType"
                  searchable
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={ReportsTypeOptions}
                  value={values?.reportType}
                  name="reportType"
                  removeIsClearable={true}
                  handleChange={handleReactSelect}
                />
              )}
              {reportList?.ID === 4 && (
                <ReactSelect
                  placeholderName={t("Issue Type")}
                  id="issueType"
                  searchable
                  respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  dynamicOptions={IssueTypeOptions}
                  name="issueType"
                  value={values?.issueType}
                  removeIsClearable={true}
                  handleChange={handleReactSelect}
                />
              )}
              {reportList?.ID === 4 && (
                <ReactSelect
                  placeholderName={t("Transaction Type")}
                  id="transactionType"
                  searchable
                  respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  dynamicOptions={TransactionTypeOptions}
                  value={values?.transactionType}
                  name="transactionType"
                  removeIsClearable={true}
                  handleChange={handleReactSelect}
                />
              )}
              {reportList?.ID === 4 && (
                <ReactSelect
                  placeholderName={t("Patient Type")}
                  id={"patientType"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={PatientTypeOption}
                  name="patientType"
                  handleChange={handleReactSelect}
                  value={values?.patientType}
                />
              )}
              {reportList?.ID === 8 ||
                reportList?.ID === 14 ||
                (reportList?.ID === 15 && (
                  <ReactSelect
                    placeholderName={t("Supplier")}
                    id={"Supplier"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"Supplier"}
                    dynamicOptions={DropDownState?.bindsupply}
                    value={values?.Supplier}
                    handleChange={handleReactSelect}
                  />
                ))}
              {(reportList?.ID === 1 ||
                reportList?.ID === 3 ||
                reportList?.ID === 4 ||
                reportList?.ID === 5 ||
                reportList?.ID === 6 ||
                reportList?.ID === 8 ||
                reportList?.ID === 9 ||
                reportList?.ID === 10 ||
                reportList?.ID === 11 ||
                reportList?.ID === 15) && (
                <ReactSelect
                  placeholderName={t("Report Format")}
                  id={"reportFormat"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={Report_Formate_Pharmacy}
                  name="reportFormat"
                  handleChange={handleReactSelect}
                  value={values?.reportFormat}
                />
              )}
              {reportList?.ID === 4 && (
                <Input
                  type="text"
                  className="form-control"
                  id="UHID"
                  name="UHID"
                  value={values?.UHID}
                  onChange={handleChange}
                  lable={t("UHID")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />
              )}

              {reportList?.ID === 14 && (
                <>
                  <ReactSelect
                    placeholderName={t("Date Type")}
                    id={"dateType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"dateType"}
                    dynamicOptions={GRN_purChase_option}
                    value={values?.dateType}
                    handleChange={handleReactSelect}
                  />
                  <ReactSelect
                    placeholderName={t("Reference No. Type")}
                    id={"ReferenceNoType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"ReferenceNoType"}
                    dynamicOptions={ReferenceNo_option}
                    value={values?.ReferenceNoType}
                    handleChange={handleReactSelect}
                  />
                  <Input
                    type="number"
                    className="form-control"
                    id="ReferenceNo"
                    name="ReferenceNo"
                    value={values?.ReferenceNo}
                    onChange={handleChange}
                    lable={t("Reference No.")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  />
                  <ReactSelect
                    placeholderName={t("Item Type")}
                    id={"itemType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"itemType"}
                    dynamicOptions={itemType_option}
                    value={values?.itemType}
                    handleChange={handleReactSelect}
                  />
                  <ReactSelect
                    placeholderName={t("Transaction Type")}
                    id={"TransType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name={"TransType"}
                    dynamicOptions={Transaction_option}
                    value={values?.TransType}
                    handleChange={handleReactSelect}
                  />
                </>
              )}
              {reportList?.ID === 3 && (
                <div className="col-sm-2 d-flex justify-content-between">
                  <div className="d-flex">
                    <Input
                      type="checkbox"
                      placeholder=" "
                      className="mt-2"
                      name="includeZeroStock"
                      onChange={handleChange}
                      checked={values?.includeZeroStock === true ? "1" : "0"}
                      respclass="col-md-1 col-1"
                    />
                    <label className="mt-2 ml-3">
                      {t("Include Zero Stock")}
                    </label>
                  </div>
                </div>
              )}

              {reportList?.ID === 8 && (
                <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                  <div className="row">
                    <Input
                      type="number"
                      className="form-control"
                      id="number"
                      name="number"
                      value={values?.number}
                      onChange={handleChange}
                      lable={t("number")}
                      placeholder=" "
                      respclass="col-md-6 col-7"
                    />
                    <ReactSelect
                      placeholderName={t("Days")}
                      id={"day"}
                      searchable={true}
                      respclass="col-md-6 col-5"
                      dynamicOptions={DayOptions}
                      name="day"
                      handleChange={handleReactSelect}
                      value={values?.day}
                    />
                  </div>
                </div>
              )}
              {reportList?.ID === 8 && (
                <ReactSelect
                  placeholderName={t("Expiry Status")}
                  id={"exstatus"}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={Expiry_Status}
                  name="exstatus"
                  handleChange={handleReactSelect}
                  value={values?.exstatus}
                />
              )}
              {reportList?.ID === 9 && (
                <>
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"typeReport"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={type_ReportOption}
                    name="typeReport"
                    handleChange={handleReactSelect}
                    value={values?.typeReport}
                  />
                  <TimePicker
                    placeholderName="Time"
                    lable={t("From Time")}
                    id="fromtime"
                    name="fromtime"
                    value={values?.fromtime}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    handleChange={handleChange}
                  />
                  <TimePicker
                    placeholderName="Time"
                    lable={t("To Time")}
                    id="Totime"
                    name="Totime"
                    value={values?.Totime}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    handleChange={handleChange}
                  />
                </>
              )}
              {reportList?.ID === 6 && (
                <>
                  <Input
                    type="number"
                    className="form-control"
                    id="ACategory"
                    name="ACategory"
                    value={values?.ACategory}
                    onChange={handleChange}
                    lable={t("A Category(%)")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  />
                  <Input
                    type="number"
                    className="form-control"
                    id="BCategory"
                    name="BCategory"
                    value={values?.BCategory}
                    onChange={handleChange}
                    lable={t("B Category(%)")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  />
                  <Input
                    type="number"
                    className="form-control"
                    id="CCategory"
                    name="CCategory"
                    value={values?.CCategory}
                    onChange={handleChange}
                    lable={t("C Category(%)")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  />
                </>
              )}
              {reportList?.ID === 10 && (
                <>
                  <ReactSelect
                    placeholderName={t("Stock Type")}
                    id={"stocktype"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    dynamicOptions={Stock_TypeOption}
                    name="stocktype"
                    handleChange={handleReactSelect}
                    value={values?.stocktype}
                  />
                </>
              )}
              {reportList?.ID === 11 && (
                <>
                  <ReactSelect
                    placeholderName={t("Consume Type")}
                    id={"consumeType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    dynamicOptions={consumeType_Option}
                    name="consumeType"
                    handleChange={handleReactSelect}
                    value={values?.consumeType}
                  />
                </>
              )}
              <div className="col-sm-2 d-flex justify-content-between">
                {reportList?.ID === 12 && (
                  <div className="d-flex">
                    <Input
                      type="checkbox"
                      placeholder=" "
                      className="mt-2"
                      name="PendingPOQty"
                      onChange={handleChange}
                      checked={values?.PendingPOQty === true ? "1" : "0"}
                      respclass="col-md-1 col-1"
                    />
                    <label className="mt-2 ml-3"> {t("Pending PO Qty")}</label>
                  </div>
                )}
                {reportList?.ID === 15 && (
                  <div className="d-flex">
                    <Input
                      type="checkbox"
                      placeholder=" "
                      className="mt-2"
                      name="Logo"
                      onChange={handleChange}
                      checked={values?.Logo === true ? "1" : "0"}
                      respclass="col-md-1 col-1"
                    />
                    <label className="mt-2 ml-3"> {t("Is Logo")}</label>
                  </div>
                )}
                {reportList?.ID === 2 ||
                reportList?.ID === 4 ||
                reportList?.ID === 12 ||
                reportList?.ID === 13 ||
                reportList?.ID === 14 ||
                Number(values?.reportFormat)===1                
                ? (
                  ""
                ) : (
                  <button
                    className="btn btn-sm btn-primary ml-2"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {t("Report")}
                  </button>
                )}

                {((reportList?.ID === 1 ||
                  reportList?.ID === 2 ||
                  reportList?.ID === 4 ||
                  reportList?.ID === 12 ||
                  reportList?.ID === 13 ||
                  reportList?.ID === 14)&& Number(values?.reportFormat)===1) && (
                  <>
                    <span
                      className={`pointer-cursor`}
                      onClick={handleSubmitExcel}
                    >
                      <IconsColor ColorCode={"Excel"} />
                    </span>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
      {modalData?.isOpen && (
        <Modal
          visible={modalData?.isOpen}
          setVisible={(val) =>
            setModalData((prev) => ({ ...prev, isOpen: val }))
          }
          modalWidth={modalData?.width}
          Header={t(modalData?.label)}
          buttonType=""
          buttonName=""
          buttons={<></>}
          footer={<></>}
          modalData={modalData}
          setModalData={setModalData}
          handleAPI={modalData?.handleStateInsertAPI}
        >
          {modalData?.Component}
        </Modal>
      )}
    </>
  );
};

export default StoreReports;
