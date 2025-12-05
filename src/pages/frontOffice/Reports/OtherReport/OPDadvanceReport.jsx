import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { notify } from "../../../../utils/ustil2";
import moment from "moment";
import { BillingBillingReportsOPDAdvanceReport } from "../../../../networkServices/BillingsApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import Input from "../../../../components/formComponent/Input";

const OPDadvanceReport = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    reportType: {
      label: "Summarised",
      value: "1",
    },
    PrintType: {
      label: "EXCEL",
      value: "0",
    },
  });

  const handleReactSelectChange = (name, e) => {
    setValues((prev) => ({
      ...prev,
      [name]: e,
    }));
  };

  const handleReport = async () => {
    const payload = {
      patientId: values?.patientId ? values?.patientId : "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: Number(
        values?.reportType?.value
          ? values?.reportType?.value
          : values?.reportType
      ),
      printType: values?.PrintType?.value,
      // ? values?.PrintType?.value
      // : Number(values?.PrintType),
    };
    console.log("payload", payload);

    const response = await BillingBillingReportsOPDAdvanceReport(payload);
    debugger

    if (response?.success) {
      if (values?.PrintType?.value === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        if (values?.reportType?.value === "1") {
          exportToExcel(
            response?.data?.patientadvancesummary,
            `OPD Advance Report(Summary) : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`
          );
        }
        exportToExcel(
          response?.data?.patientadvancedetail,
          `OPD Advance Report(Detail) : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`
        );
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({
      ...val,
      [name]: value,
    }));
  };

  return (
    <div className="card">
      <Heading title={"OPD Advance Report"} />
      <div className="row p-2">
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
        <ReactSelect
          placeholderName={t("Report Type")}
          id={"reportType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={[
            { label: "Summarised", value: "1" },
            { label: "Detailed", value: "2" },
            ,
          ]}
          name="reportType"
          handleChange={handleReactSelectChange}
          value={values?.reportType?.value}
          requiredClassName="required-fields"
        />
        <ReactSelect
          placeholderName={t("Print Type")}
          id={"PrintType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={[
            { label: "PDF", value: "1" },
            { label: "EXCEL", value: "0" },
            ,
          ]}
          name="PrintType"
          handleChange={handleReactSelectChange}
          value={values?.PrintType?.value}
          requiredClassName="required-fields"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("patientId")}
          placeholder=" "
          name="patientId"
          onChange={(e) => handleInputChange(e)}
          value={values?.patientId}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-success" onClick={handleReport}>
          {t("Report")}
        </button>
      </div>
    </div>
  );
};

export default OPDadvanceReport;
