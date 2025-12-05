import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import { BillingBillingReportsCMSUtilizationDetailReport } from "../../../../networkServices/MRDApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { notify } from "../../../../utils/ustil2";
import moment from "moment";

const CmsUtilisationReport = () => {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    patientId: "",
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReport = async () => {
    const payload = {
      patientID: values?.patientId,
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: 0,
    };

    const response =
      await BillingBillingReportsCMSUtilizationDetailReport(payload);
    if (response?.success) {
      exportToExcel(
        response?.data,
        `CMS Utilization Detail Report : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`
      );
    } else {
      notify(response?.message, "error");
    }
  };

  return (
    <div className="card">
      <Heading title={"CMS Utilisation Report"} isBreadcrumb={true} />
      <div className="row p-2">
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
        <Input
          type="number"
          className={"form-control "}
          lable={t("UHID")}
          placeholder=" "
          name="patientId"
          onChange={handleInputChange}
          value={values?.patientId}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <button className="btn btn-success" onClick={handleReport}>
          {t("Report")}
        </button>
      </div>
    </div>
  );
};

export default CmsUtilisationReport;
