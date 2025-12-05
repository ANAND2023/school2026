import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingEnvoiceReport,
  BillingOperationReport,
  BillingReportsPharmacyDetailReport,
} from "../../../../networkServices/MRDApi";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import {
  BillingReportsPharmacyDepartment,
  EDPBindPanelsAPI,
} from "../../../../networkServices/EDP/edpApi";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import Input from "../../../../components/formComponent/Input";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import {
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
  ItemMasterBindDetail,
} from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { AutoComplete } from "primereact/autocomplete";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import {
  DOCTOR_REPORT_TYPE_FORMATE,
  REPORT_TYPES,
} from "../../../../utils/constant";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { getBindDetailUser } from "../../../../networkServices/ReportsAPI";

const PharmacyDetailsReport = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: {},
    // ctbNo: "",
    // Doctor: "0",
    Doctor: {},
    Pharmacy: { label: "All", value: "All" },
    billNo: "",
    subcategoryId: { label: "All", value: "0" },
    categoryId: {},
    ipdNo: "",
    typeoftnx: { label: "All", value: "All" },
    patientType: { label: "All", value: "All" },
    mode: {},
    uhid: "",
    ItemID: "",
    Type: { value: "0", label: "Excel" },
    user: [],
    panel: [],
    Department: [],
    isLogo: { value: false },
  };
  const [item, setItem] = useState("");
  const localData = useLocalStorage("userData", "get");
  // const [subGroup, setSubGroup] = useState([]);
  const [dropDownState, setDropDownState] = useState({
    RoomType: [],
    SubGroup: [],
    ReportOption: [],
    DoctorList: [],
    PanelList: [],
    Floor: [],
    bindcategory: [],
    getPharmacyType: [],
    getBindDetailsUSerData: [],
    DepartmentList: [],
    //  PanelList: [],
  });
  console.log("dropDownState", dropDownState);
  const [stockShow, setStockShow] = useState([]);
  const [newRowData, setNewRowData] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  useEffect(() => {
    setValues((preV) => ({
      ...preV,
      mode:
        values?.ReportType?.value === "2" || values?.ReportType?.value === "4"
          ? { label: "Cash", value: "0" }
          : { label: "Credit", value: "1" },
    }));
  }, [values?.ReportType]);
  console.log("firstvalues", values);
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e;
    // obj[name] = e?.value;
    setValues(obj);
  };

  const handlecheckboxChange = (e) => {
    const { name, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: { ...prev[name], value: checked },
    }));
  };

  console.log(values, "values");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  // const getPanelList = async () => {
  //     try {
  //         const response = await EDPBindPanelsAPI();
  //         if (response?.success) {
  //             setDropDownState((val) => ({
  //                 ...val,
  //                 PanelList: handleReactSelectDropDownOptions(
  //                     response?.data,
  //                     "Company_Name",
  //                     "PanelID"
  //                 ),
  //             }));
  //         }
  //         else {
  //             setDropDownState([])

  //         }
  //         return response;

  //     } catch (error) {
  //         console.log(error, "SomeThing Went Wrong");
  //     }
  // };
  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };
  const getBindStoreSubCategory = async (CategoryID) => {
    // const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
    try {
      const response = await BindStoreSubCategory(CategoryID);
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          SubGroup: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "SubCategoryID"
          ),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (values?.categoryId?.value) {
      setValues((preV) => ({
        ...preV,
        subcategoryId: {},
      }));
      getBindStoreSubCategory(values?.categoryId?.value);
    }
    console.log("values", values);
  }, [values.categoryId]);
  const bindDropdownData = async () => {
    const [
      DoctorData,
      BindGroupId,
      getPharmacyType,
      userData,
      panelData,
      PharmacyDepartment,
    ] = await Promise.all([
      BindDoctorDept("All"),
      getBindGroup(),
      ItemMasterBindDetail(7),
      getBindDetailUser(),
      EDPBindPanelsAPI(),
      BillingReportsPharmacyDepartment(),
    ]);

    if (DoctorData?.success) {
      setDropDownState((val) => ({
        ...val,
        DoctorList: handleReactSelectDropDownOptions(
          DoctorData?.data,
          "Name",
          "DoctorID"
        ),
        bindcategory: handleReactSelectDropDownOptions(
          BindGroupId,
          "name",
          "categoryID"
        ),
        getPharmacyType: handleReactSelectDropDownOptions(
          getPharmacyType?.data,
          "NAME",
          "NAME"
        ),
        getBindDetailsUSerData: handleReactSelectDropDownOptions(
          userData.data,
          "Name",
          "EmployeeID"
        ),
        PanelList: handleReactSelectDropDownOptions(
          panelData?.data,
          "Company_Name",
          "PanelID"
        ),
        DepartmentList: handleReactSelectDropDownOptions(
          PharmacyDepartment?.data,
          "RoleName",
          "DeptLedgerNo"
        ),
        //  getBindDetailsUSerData: userData.data,
      }));
    }
  };

  useEffect(() => {
    bindDropdownData();
  }, []);

  useEffect(() => {
    if (values?.ReportType?.value === "13") {
      setValues((preV) => ({
        ...preV,
        ...initialValues,
        ReportType: { label: "E-Invoice GST Report", value: "13" },
      }));
    }
  }, [values?.ReportType?.value === "13"]);
  // useEffect(() => {
  //     getPanelList()
  // }, [])

  console.log("values", values);
  const userLength = values?.user?.length;
  const AllUserLength = dropDownState?.getBindDetailsUSerData?.length;
  const panelLength = values?.panel?.length;
  const AllpanelLength = dropDownState?.PanelList?.length;
  const isPanel = AllpanelLength === panelLength;
  const isUser = AllUserLength === userLength;
  console.log("isPanel", isPanel);
  console.log("isUser", isUser);
  const userdetails = values?.user?.map((item) => item.code).join(",");
  const paneldetails = values?.panel?.map((item) => item.code).join(",");
  console.log("userdetails", userdetails);
  console.log("paneldetails", paneldetails);

  const EnvoiceReportApi = async () => {
    if (!values?.ReportType?.value) {
      notify("Please Select Report Type", "warn");
      return;
    }
    if (!values?.typeoftnx) {
      notify("Please Select Type of tnx", "warn");
      return;
    }
    if (!values?.Department?.length > 0) {
      notify("Please Select Department", "warn");
      return;
    }

    const userLength = values?.user?.length;
    const AllUserLength = dropDownState?.getBindDetailsUSerData?.length;
    const panelLength = values?.panel?.length;
    const AllpanelLength = dropDownState?.PanelList?.length;
    const isPanel = AllpanelLength === panelLength;
    const isUser = AllUserLength === userLength;
    console.log("isPanel", isPanel);
    console.log("isUser", isUser);
    // const userdetails = values?.user?.map(item => item.code).join(",");
    const userdetails = values?.user?.map((item) => `'${item.code}'`).join(",");
    const departmentDetails = values?.Department?.map(
      (item) => `'${item.code}'`
    ).join(",");
    // const paneldetails = values?.panel?.map(item => `'${item.code}'`).join(",");
    const paneldetails = values?.panel?.map((item) => item.code).join(",");
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values.toDate).format("YYYY-MM-DD"),
      doctorID: Number(values?.Doctor?.value ? values?.Doctor?.value : 0),
      billNo: values?.billNo ?? "",
      typeOfTnx: values?.typeoftnx?.value,
      subcategoryID: Number(values?.subcategoryId?.value ?? 0),
      itemID: Number(values?.ItemID ?? 0),
      ipdNo: values?.ipdNo,
      patientID: values?.uhid,
      reportID: values?.ReportType?.value ?? "",
      departmentLedgerNo: departmentDetails,
      isCredit: Number(values?.mode ? values?.mode?.value : 0),
      userID: isUser ? "" : userdetails,
      pharmacyType:
        values?.Pharmacy?.value === "All" ? "" : values?.Pharmacy?.value,
      patientType:
        values?.patientType?.value == "All"
          ? "'Opd','Ipd','Emg'"
          : values?.patientType?.value,
      panelId: isPanel ? "" : paneldetails,
      logo: values?.isLogo?.value === true ? 1 : 0,
      reportType: Number(values.Type?.value),
    };

    const response = await BillingEnvoiceReport(payload);
    if (response.success) {
      if ((values.Type?.value ? values.Type?.value : values.Type) == "0") {
        const reportTypeLable = REPORT_TYPES?.find(
          (item) => item?.value == values?.ReportType
        )?.label;
        exportToExcel(
          response?.data,
          `EnvoiceReport: ${moment(values?.fromDate).format("DD-MM-YYYY")}`
        );
      } else {
        RedirectURL(response?.data?.pdfUrl);
      }
    } else {
      notify(response.message, "error");
    }
  };

  const HandleAllReportApi = async () => {
    if (!values?.ReportType?.value) {
      notify("Please Select Report Type", "warn");
      return;
    }
    if (!values?.typeoftnx) {
      notify("Please Select Type of tnx", "warn");
      return;
    }
    if (!values?.Department?.length > 0) {
      notify("Please Select Department", "warn");
      return;
    }

    const userLength = values?.user?.length;
    const AllUserLength = dropDownState?.getBindDetailsUSerData?.length;
    const panelLength = values?.panel?.length;
    const AllpanelLength = dropDownState?.PanelList?.length;
    const isPanel = AllpanelLength === panelLength;
    const isUser = AllUserLength === userLength;

    // const userdetails = values?.user?.map(item => item.code).join(",");
    const userdetails = values?.user?.map((item) => `'${item.code}'`).join(",");
    const departmentDetails = values?.Department?.map(
      (item) => `'${item.code}'`
    ).join(",");
    // const paneldetails = values?.panel?.map(item => `'${item.code}'`).join(",");
    const paneldetails = values?.panel?.map((item) => item.code).join(",");
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values.toDate).format("YYYY-MM-DD"),
      doctorID: Number(values?.Doctor?.value ? values?.Doctor?.value : 0),
      billNo: values?.billNo ?? "",
      typeOfTnx: values?.typeoftnx?.value,
      subcategoryID: Number(values?.subcategoryId?.value ?? 0),
      itemID: Number(values?.ItemID ?? 0),
      ipdNo: values?.ipdNo,
      patientID: values?.uhid,
      reportID: values?.ReportType?.value ?? "",
      departmentLedgerNo: departmentDetails,
      isCredit: Number(values?.mode ? values?.mode?.value : 0),
      userID: isUser ? "" : userdetails,
      pharmacyType:
        values?.Pharmacy?.value === "All" ? "" : values?.Pharmacy?.value,
      patientType:
        values?.patientType?.value == "All"
          ? "'Opd','Ipd','Emg'"
          : `'${values?.patientType?.value}'`,
      panelId: isPanel ? "" : paneldetails,
      logo: values?.isLogo?.value === true ? 1 : 0,
      reportType: Number(values.Type?.value),
    };
    const response = await BillingReportsPharmacyDetailReport(payload);
    debugger
    if (response?.success) {
      if ((values.Type?.value ? values.Type?.value : values.Type) == "0") {
        if (values?.ReportType?.value === "1") {

          const filteredData = response?.data?.itemList.map((item) => ({
            "Ipd No": item.ipdNo,
            "Sub Category Name": item?.subCategoryName,
            "Item Name": item.itemName,
            "Per/Unit": (item?.amount / item?.quantity).toFixed(2),
            Quantity: item.quantity,
            "Purchase Rate": item?.purRate,
            Amount: item?.amount,
            "Profile/Loss": (item?.amount - item?.purRate).toFixed(2),
            // Pid: item.pid,
            // "Patient Name": item.patientName,
            // "Type Of Tnx": item.typeOfTnx,
          }));

          exportToExcel(
            response?.data?.itemList,
            `Item Wise Report:  -  ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );
          return;
        } else if (values?.ReportType?.value === "2") {
         
          exportToExcel(
            response?.data?.itemList1,
            `Receipt Wise Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        } else if (values?.ReportType?.value === "3") {
         
          exportToExcel(
            response?.data?.itemList2,
            `Detail Wise Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "5") {

          exportToExcel(
           response?.data?.itemList3,
            `Detail New Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "6") {

          exportToExcel(
           response?.data?.itemList4,
            `Total Summary Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "7") {

          exportToExcel(
           response?.data?.itemList3,
            `Detail New Report Without PKG - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "8") {

          exportToExcel(
           response?.data?.itemList3,
            `Details Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "9") {

          exportToExcel(
           response?.data?.itemList3,
            `Details New Report - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "10") {

          exportToExcel(
           response?.data?.itemList5,
            `Final Bill Summary Report  - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "11") {

          exportToExcel(
           response?.data?.itemList6,
            `Final Bill Tax Summary Report  - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );

        }else if (values?.ReportType?.value === "12") {

          exportToExcel(
           response?.data?.itemList6,
            `Tax Final Bill Summary Report  - ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );


        } else if(values?.ReportType?.value === "16"){
          debugger
          exportToExcel(
            response?.data?.itemList16,
            `HSN Wise Tax Summary Report:  -  ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );
        }else {
          exportToExcel(
            response?.data?.list,
            `Pharmacy Details Report:  -  ${moment(values?.fromDate).format("DD-MM-YYYY")}/${moment(values?.toDate).format("DD-MM-YYYY")}`
          );
        }
      } else {
        RedirectURL(response?.data?.pdfUrl);
      }
    } else {
      notify(response.message, "error");
    }
  };

  const HandleReport = () => {
    if (values?.ReportType?.value == "13") {
      EnvoiceReportApi();
    } else {
      HandleAllReportApi();
    }
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
  const handleSelectRow = (e) => {
    const { value } = e;
    console.log(value);
    // setNewRowData([value]);
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [value];
      // return [...prevData, value];
    });
    // setValues((prevPayload) => ({
    //   ...prevPayload,
    //   ItemID: value?.ItemID.join(", "),
    // }));
    setValues((prevPayload) => ({
      ...prevPayload,
      ItemID: Array.isArray(value?.ItemID)
        ? value.ItemID.join(", ")
        : value?.ItemID,
    }));
    setItem("");
  };

  const search = async (searchItem) => {
    if (!values?.categoryId) {
      notify("Please Select Category", "warn");
      return;
    }
    if (!values?.subcategoryId) {
      notify("Please Select Sub Category ", "warn");
      return;
    }

    const Subcategory = values?.subcategoryId?.value;
    // const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    const ItemName = searchItem || item;
    // const ItemName = values?.TypeName;
    try {
      if (ItemName?.length > 2) {
        const response = await BindStoreItems(Subcategory, ItemName);
        if (response?.success) {
          setStockShow(response?.data || []);
        } else {
          notify(response?.message, "warn");
        }
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Pharmacy Details Report"} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fieldss"
            id="billNo"
            name="billNo"
            lable={t("Bill No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.billNo}
            disabled={values?.ReportType?.value === "13"}
          />
          <Input
            type="text"
            className="form-control required-fieldss"
            id="uhid"
            name="uhid"
            lable={t("Patient ID.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.uhid}
            disabled={values?.ReportType?.value === "13"}
          />
          <Input
            type="text"
            className="form-control required-fieldss"
            id="ipdNo"
            name="ipdNo"
            lable={t("IPD No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.ipdNo}
            disabled={values?.ReportType?.value === "13"}
          />

          <ReactSelect
            // requiredClassName="required-fields"
            placeholderName={t("category")}
            id={"categoryId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"categoryId"}
            dynamicOptions={dropDownState?.bindcategory}
            // dynamicOptions={DropDownState?.BindCategory}
            value={values?.categoryId}
            handleChange={handleReactSelectChange}
            isDisabled={values?.ReportType?.value === "13"}
          />
          <ReactSelect
            // requiredClassName="required-fields"
            placeholderName={t("Sub Category")}
            id={"subcategoryId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"subcategoryId"}
            dynamicOptions={[
              { label: "All", value: "0" },
              ...dropDownState?.SubGroup,
            ]}
            // dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.BindSubCategory]}
            // dynamicOptions={subGroup}
            value={values?.subcategoryId?.value}
            handleChange={handleReactSelectChange}
            isDisabled={values?.ReportType?.value === "13"}
          />

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
                  typeof e.value === "object" ? e?.value?.TypeName : e.value;
                setItem(data);
                search(data);
                setValues({ ...values, TypeName: data });
              }}
              itemTemplate={itemTemplate}
              // disabled={
              //   values?.subcategoryId?.length > 0 ? false : true
              // }
              disabled={values?.ReportType?.value === "13"}
            />
            <label htmlFor={"searchtest"} className="lable searchtest">
              {t(" Search Items")}
            </label>
          </div>
          {newRowData?.length > 0 && (
            <div
              className="col-xl-2 col-md-2 colt-sm-6 col-12"
            //  className=" col-sm-12 d-flex"
            >
              {newRowData?.map((doc, key) => (
                <div
                  //  className="d-flex ml-2 mb-2"
                  key={key}
                >
                  <LabeledInput
                    label={"Items"}
                    value={doc?.TypeName}
                    className={"document_label"}
                  />
                </div>
              ))}
            </div>
          )}

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            // lable={t("fromDate")}
            lable={t(
              `${values?.ReportType?.value === "13" ? "Date" : "From Date"}`
            )}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            // lable={t(`${values?.ReportType?.value === "13"?"Date":"toDate"}`)}
            values={values}
            setValues={setValues}
            max={new Date()}
            // min={values?.fromDate}
            disable={values?.ReportType?.value === "13"}
          />
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={[
            //     { label: "Item Wise", value: "1" },
            //     { label: "Receipt Wise", value: "2" },
            //     { label: "Detail Wise", value: "3" },
            // ]}
            dynamicOptions={REPORT_TYPES}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            placeholderName={t("Type Of Tnx")}
            id={"typeoftnx"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "All" },
              { label: "Return", value: "R" },
              { label: "Issue", value: "I" },
            ]}
            name="typeoftnx"
            handleChange={handleReactSelectChange}
            value={values.typeoftnx?.value}
            requiredClassName={"required-fields"}
            isDisabled={values?.ReportType?.value === "13"}
          />
          <ReactSelect
            placeholderName={t("Mode")}
            id={"mode"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={[
            //     { label: "Cash", value: "0" },
            //     { label: "Credit", value: "1" },

            // ]}
            dynamicOptions={
              values?.ReportType?.value === "2" ||
                values?.ReportType?.value === "4"
                ? [{ label: "Cash", value: "0" }]
                : values?.ReportType?.value === "1" ||
                  values?.ReportType?.value === "3" ||
                  values?.ReportType?.value === "6"
                  ? [
                    { label: "Cash", value: "0" },
                    { label: "Credit", value: "1" },
                  ]
                  : values?.ReportType?.value === "3" ||
                    values?.ReportType?.value === "5" ||
                    values?.ReportType?.value === "7" ||
                    values?.ReportType?.value === "8" ||
                    values?.ReportType?.value === "9" ||
                    values?.ReportType?.value === "10" ||
                    values?.ReportType?.value === "7" ||
                    values?.ReportType?.value === "8" ||
                    values?.ReportType?.value === "9" ||
                    values?.ReportType?.value === "10" ||
                    values?.ReportType?.value === "7" ||
                    values?.ReportType?.value === "8" ||
                    values?.ReportType?.value === "11" ||
                    values?.ReportType?.value === "12" ||
                    values?.ReportType?.value === "13"
                    ? [{ label: "Credit", value: "1" }]
                    : []
            }
            name="mode"
            handleChange={handleReactSelectChange}
            value={values.mode?.value}
            requiredClassName={"required-fields"}
            isDisabled={values?.ReportType?.value === "13"}
          />
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"patientType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "All" },
              { label: "OPD", value: "Opd" },
              { label: "IPD", value: "Ipd" },
              { label: "EMG", value: "Emg" },
            ]}
            name="patientType"
            handleChange={handleReactSelectChange}
            value={values.patientType?.value}
            requiredClassName={"required-fields"}
            isDisabled={values?.ReportType?.value === "13"}
          />
          <ReportsMultiSelect
            name="user"
            placeholderName={t("User")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={dropDownState.getBindDetailsUSerData}
            labelKey="Name"
            valueKey="EmployeeID"
            disabled={values?.ReportType?.value === "13"}
          />
          <ReportsMultiSelect
            name="panel"
            placeholderName={t("Panel")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={dropDownState.PanelList}
            labelKey="Company_Name"
            valueKey="PanelID"
            disabled={values?.ReportType?.value === "13"}
          />
          <ReportsMultiSelect
            name="Department"
            placeholderName={t("Department")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={dropDownState.DepartmentList}
            labelKey="RoleName"
            valueKey="DeptLedgerNo"
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            placeholderName={t("Pharmacy")}
            id={"Pharmacy"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            // dynamicOptions={dropDownState?.getPharmacyType}
            dynamicOptions={[
              { label: "All", value: "All" },
              ...dropDownState?.getPharmacyType,
            ]}
            name="Pharmacy"
            handleChange={handleReactSelectChange}
            value={values?.Pharmacy?.value}
            isDisabled={values?.ReportType?.value === "13"}
          />

          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "0" },
              ...dropDownState?.DoctorList,
            ]}
            // dynamicOptions={dropDownState?.DoctorList}
            // dynamicOptions={[
            //     {label:"All",value:"0"},
            //     {label:"Admission",value:"1"},
            //     {label:"Discharged",value:"2"},
            // ]}
            name="Doctor"
            handleChange={handleReactSelectChange}
            value={values.Doctor}
            isDisabled={values?.ReportType?.value === "13"}
          // requiredClassName={"required-fields"}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={
              values?.ReportType?.value === "13"
                ? [{ value: "0", label: "Excel" }]
                : DOCTOR_REPORT_TYPE_FORMATE
            }
            name="Type"
            handleChange={handleReactSelectChange}
            value={values.Type?.value ? values.Type?.value : values.Type}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 ">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="IsLogo" className="mr-2">
                Is Logo
              </label>
              <input
                type="checkbox"
                name="isLogo"
                checked={values?.isLogo?.value || false}
                onChange={handlecheckboxChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={HandleReport}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDetailsReport;
