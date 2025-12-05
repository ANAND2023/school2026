import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import moment from "moment";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { notify } from "../../../../utils/ustil2";
import { IPDbillDataReportConstant } from "../../../../utils/constant";
import { BillingBillingReportsIPDBillingReport } from "../../../../networkServices/MRDApi";

const IPDbillDataReport = () => {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
  };
  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelect = (name, value) => {
    setValues((val) => ({
      ...val,
      [name]: value,
    }));
  };

  const handleExcelReport = async () => {
    if (!values?.reportType?.value) {
      notify("Please Select Report Type", "error");
      return;
    }
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: 0,
      reportID: values?.reportType?.value,
    };
    const response = await BillingBillingReportsIPDBillingReport(payload);
    if (response?.success) {
      exportToExcel(response?.data, `IPD BILL DATA REPORT (${values?.reportType?.label}) ${ moment(values?.fromDate).format("YYYY-MM-DD")} To ${moment(values?.toDate).format("YYYY-MM-DD")}`);
    } else {
        debugger
      notify(response?.message, "errror");
    }
  };

  return (
    <div className="card">
      <Heading title={"IPD Bill Data Report"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id="fromDate"
          name="fromDate"
          lable={t("From Date")}
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
          values={values}
          setValues={setValues}
          max={new Date()}
          // min={values?.fromDate}
        />
        <ReactSelect
          placeholderName={t("Report Type")}
          id={"reportType"}
          searchable={true}
          name={"reportType"}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          style={{ width: "100px" }}
          dynamicOptions={IPDbillDataReportConstant}
          handleChange={handleReactSelect}
          value={values?.reportType}
          removeIsClearable={false}
        />
        <button className="btn btn-success" onClick={handleExcelReport}>
          Excel Report
        </button>
      </div>
    </div>
  );
};

export default IPDbillDataReport;
