import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import {
  BillingBillingReportsItemWisePurchase,
  BillingBillingReportsVendorWisePurchase,
} from "../../../../networkServices/MRDApi";
import moment from "moment";
import {
  BindGRNItems,
  BindVendor,
} from "../../../../networkServices/InventoryApi";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import { BillingReportsPharmacyDepartment } from "../../../../networkServices/EDP/edpApi";
import { notify } from "../../../../utils/ustil2";
import { RedirectURL } from "../../../../networkServices/PDFURL";

const VendorWisePurchase = () => {
  const [t] = useTranslation();
  const initialState = {
    toDate: new Date(),
    fromDate: new Date(),
    // ReportType: {
    //   label: "Summary",
    //   value: "S",
    // },
    ReportType: "S",
  };
  const [values, setValues] = useState({ ...initialState });
  console.log("values", values);
  const [dropDownState, setDropDownState] = useState({
    VendorList: [],
    PurchaseDepartment: [],
  });

  const bindPurchaseDepartment = async () => {
    const response = await BillingReportsPharmacyDepartment();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        PurchaseDepartment: response?.data,
      }));
    }
  };

  const bindDropdownData = async () => {
    const response = await BindVendor(values?.StoreType?.value);

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        VendorList: response?.data,
      }));
    }
  };

  const handleReactSelectChange = (name, e) => {
    if (name === "ReportType") {
      debugger;
      setValues((prev) => ({
        ...prev,
        [name]: e?.value,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: e,
      }));
    }
  };

  const handleReport = async () => {
    debugger;
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
      storeType: values?.StoreType?.value || "S",
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

  useEffect(() => {
    bindDropdownData();
  }, [values?.StoreType]);

  useEffect(() => {
    bindPurchaseDepartment();
  }, []);

  return (
    <div className="card">
      <Heading title={"Vendor Wise Purcahse"} isBreadcrumb={false} />

      <div className="row p-2">
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
          handleChange={handleReactSelectChange}
          value={values?.StoreType}
          requiredClassName="required-fields"
        />
        {/* <ReactSelect
          placeholderName={t("Vendor Name")}
          id={"vendorName"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-12"
          // dynamicOptions={dropDownState}
          dynamicOptions={dropDownState?.VendorList}
          name="vendorName"
          handleChange={handleReactSelectChange}
          value={values?.vendorName}
        /> */}
        <ReportsMultiSelect
          name="vendorName"
          placeholderName={t("Vendor Name")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={dropDownState?.VendorList}
          labelKey="LedgerName"
          valueKey="VendorID"
        />
        <ReportsMultiSelect
          name="departmentName"
          placeholderName={t("Department Name")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={dropDownState?.PurchaseDepartment}
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
          handleChange={handleReactSelectChange}
          value={values?.ReportType}
        />
        <button className="btn btn-success ml-2" onClick={handleReport}>
          {t("Report")}
        </button>
      </div>
    </div>
  );
};

export default VendorWisePurchase;
