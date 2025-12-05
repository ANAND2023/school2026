import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import {
  BillingBillingReportsGetIPDPrescribedMedicine,
  BillingBillingReportsIPDPatientDetailsReport,
  BillingBillingReportsOPDPatientDetailsReport,
  getBindStateList,
} from "../../../../networkServices/ReportsAPI";
import { notify } from "../../../../utils/ustil2";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import {
  BillingBillingReportsOPDAdmissionConvertedReport,
  BillingBillingReportsOPDAdmissionDoneReport,
  BillingBillingReportsOPDDoctorFeedingReport,
  BillingBillingReportsStatewisePatients,
} from "../../../../networkServices/MRDApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import moment from "moment";

const reportOptions = [
  { label: "Medicine Indent Prescription Report", value: "1" },
  { label: "Patient OPD/IPD Detail", value: "2" },
  // { label: "OPD Appointment Date", value: "3" },
  { label: "OPD Doctor Feed Report", value: "4" },
  { label: "OPD Adm. Prescribe/Done", value: "5" },
  { label: "State Wise Patient Details", value: "6" },
  { label: "OPD Adm. Converted Report", value: "7" },
  // { label: "Refer Doctor List OPD New File", value: "7" },
];

const typeOptions = [
  { label: "Pdf", value: "1" },
  { label: "Excel", value: "0" },
];

const BillingReport = () => {
  const [t] = useTranslation();
  const initialValues = {
    ReportType: "1",
    referBy: "0",
    fromDate: new Date(),
    toDate: new Date(),
    type: "1",
    Date: new Date(),
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelectChange = (name, e) => {
    if (name === "ReportType") {
      setValues(initialValues);
      setValues((prev) => ({
        ...prev,
        [name]: e?.value,
      }));
    }
    if (name === "State") {
      setValues((prev) => ({
        ...prev,
        [name]: e,
      }));
    }
    setValues((prev) => ({
      ...prev,
      [name]: e?.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [apiData, setApiData] = useState({
    getState: [],
  });

  const handleSubmit = async () => {
    const payload = {
      ipdNo: values?.ipdNo ? String(values?.ipdNo) : "",
      billNo: values?.billNo ? String(values?.billNo) : "",
      fileType: values.type ? Number(values?.type) : 1,
    };

    const response =
      await BillingBillingReportsGetIPDPrescribedMedicine(payload);
    if (response?.success) {
      if (values?.type === "0") {
        exportToExcel(response?.data, "Medicine Indent Prescription Report");
      } else if (values?.type === "1") {
        RedirectURL(response?.data?.pdfUrl);
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const handleIPDpatient = async (rType) => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      billNo: values?.billNo ? values?.billNo : "",
      doctorID: "",
      patientID: values?.registrationNo ? values?.registrationNo : "",
      panelID: "",
      ipdNo: values?.ipdNo ? values?.ipdNo : "",
      subCategoryID: "",
      itemID: "",
      ipdCaseTypeID: "",
      userID: "",
      patientType: "",
      reportID: "10",
      fileType: Number(values?.type),
    };

    const response =
      await BillingBillingReportsIPDPatientDetailsReport(payload);
    if (response?.success) {
      if (values?.type === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else if (values?.type === "0") {
        exportToExcel(
          response?.data,
          "Billing Reports IPD Patient Details Report"
        );
      }
    } else {
      notify(response?.message, "error");
    }
  };
  const handleOPDpatient = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      billNo: values?.billNo ? values?.billNo : "",
      doctorID: "",
      patientID: values?.registrationNo ? values?.registrationNo : "",
      panelID: "",
      ipdNo: values?.ipdNo ? values?.ipdNo : "",
      subCategoryID: "",
      itemID: "",
      ipdCaseTypeID: "",
      userID: "",
      patientType: "",
      reportID: "9",
      fileType: Number(values?.type),
    };

    const response =
      await BillingBillingReportsOPDPatientDetailsReport(payload);
    if (response?.success) {
      if (values?.type === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else if (values?.type === "0") {
        exportToExcel(response?.data, "Reports OPD Patient Details Report");
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const handleDoctorFeedExcelReport = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      billNo: "",
      doctorID: "",
      patientID: "",
      panelID: "",
      ipdNo: "",
      subCategoryID: "",
      itemID: "",
      ipdCaseTypeID: "",
      userID: "",
      patientType: "",
      reportID: String(6),
      fileType: 1,
    };

    const response = await BillingBillingReportsOPDDoctorFeedingReport(payload);
    if (response?.success) {
      notify(response?.message, "success");
      exportToExcel(
        response?.data,
        "Billing Reports OPD Doctor Feeding Report"
      );
    } else {
      notify(response?.message, "error");
    }
  };
  const handleOPDadmissionExcelReport = async () => {
    const payload = {
      fromDate: moment(values?.Date).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      billNo: "",
      doctorID: "",
      patientID: "",
      panelID: "",
      ipdNo: "",
      subCategoryID: "",
      itemID: "",
      ipdCaseTypeID: "",
      userID: "",
      patientType: "",
      reportID: String(7),
      fileType: 1,
    };

    const response = await BillingBillingReportsOPDAdmissionDoneReport(payload);
    if (response?.success) {
      notify(response?.message, "success");
      exportToExcel(response?.data, "OPD Admission Done Report");
    } else {
      notify(response?.message, "error");
    }
  };
  const handleStateWiseExcelReport = async () => {
    const selectedState = apiData?.getState?.find(
      (state) => state.StateID === values?.State
    );

    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      billNo: "",
      doctorID: "",
      patientID: values?.patientRegNo,
      panelID: "",
      ipdNo: "",
      subCategoryID: "",
      itemID: "",
      District: values?.district ? values?.district : "",
      State: selectedState?.StateName ? selectedState?.StateName : "",
      patientType: "",
      reportID: String(8),
      fileType: Number(values.type),
    };

    const response = await BillingBillingReportsStatewisePatients(payload);
    if (response?.success) {
      if (values?.type === "1") {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "success");
        exportToExcel(response?.data, "State Wise Patient Report");
      }
    } else {
      notify(response?.message, "error");
    }
  };

  const convertedReport = async () => {
    const payload = {
      fromDate: moment(values?.Date).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      billNo: "",
      doctorID: "",
      patientID: "",
      panelID: "",
      ipdNo: "",
      subCategoryID: "",
      itemID: "",
      ipdCaseTypeID: "",
      userID: "",
      patientType: "",
      reportID: String(11),
      fileType: 1,
    };

    const response =
      await BillingBillingReportsOPDAdmissionConvertedReport(payload);
    if (response?.success) {
      notify(response?.message, "success");
      exportToExcel(response?.data, "OPD Admission Converted Report");
    } else {
      notify(response?.message, "error");
    }
  };

  const renderDateRange = (fromName = "fromDate", toName = "toDate") => (
    <>
      <ReportDatePicker
        className="custom-calendar"
        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        id={fromName}
        name={fromName}
        lable={t("From Date")}
        values={values}
        setValues={setValues}
        max={values?.[toName]}
      />
      <ReportDatePicker
        className="custom-calendar"
        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        id={toName}
        name={toName}
        lable={t("To Date")}
        values={values}
        setValues={setValues}
        max={new Date()}
        min={values?.[fromName]}
      />
    </>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataState = await getBindStateList(14);
        if (!dataState?.success) {
          return;
        }

        setApiData((prev) => ({
          ...prev,
          getState: handleReactSelectDropDownOptions(
            dataState?.data,
            "StateName",
            "StateID"
          ),
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="card">
      <Heading title={"Billing Reports"} isBreadcrumb={false} />

      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Report Type")}
          id="ReportType"
          searchable
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          dynamicOptions={reportOptions}
          name="ReportType"
          handleChange={handleReactSelectChange}
          value={values.ReportType}
        />
        {values?.ReportType === "1" && (
          <>
            <Input
              id="ipdNo"
              type="text"
              placeholder=""
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              className="form-control"
              lable={t("IPD No.")}
              value={values?.ipdNo}
              name="ipdNo"
              onChange={handleInputChange}
            />
            <Input
              id="billNo"
              type="text"
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              className="form-control"
              lable={t("Bill No.(Pharmacy)")}
              value={values?.billNo}
              name="billNo"
              placeholder=""
              onChange={handleInputChange}
            />
            <ReactSelect
              placeholderName={t("Type")}
              id="type"
              searchable
              respclass="col-xl-1 col-md-2 col-sm-3 col-12"
              dynamicOptions={typeOptions}
              name="type"
              handleChange={handleReactSelectChange}
              value={values.type}
            />
            <button onClick={handleSubmit} className="btn btn-success ml-2">
              {t("Submit")}
            </button>
          </>
        )}

        {values?.ReportType === "2" && (
          <>
            <Input
              id="registrationNo"
              type="text"
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              placeholder=""
              className="form-control"
              lable={t("Registration No.")}
              value={values?.registrationNo}
              name="registrationNo"
              onChange={handleInputChange}
            />
            <Input
              id="ipdNo"
              type="text"
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              placeholder=""
              className="form-control"
              lable={t("IPD No.")}
              value={values?.ipdNo}
              name="ipdNo"
              onChange={handleInputChange}
            />
            <Input
              id="Bill No"
              type="text"
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              placeholder=""
              className="form-control"
              lable={t("Bill No.")}
              value={values?.billNo}
              name="billNo"
              onChange={handleInputChange}
            />
            <ReactSelect
              placeholderName={t("Type")}
              id="type"
              searchable
              respclass="col-xl-2 col-md-2 col-sm-3 col-12"
              dynamicOptions={typeOptions}
              name="type"
              handleChange={handleReactSelectChange}
              value={values?.type}
            />
            {renderDateRange()}
            <button
              className="btn btn-success ml-2"
              onClick={() => {
                handleIPDpatient();
              }}
            >
              {t("IPD Patient")}
            </button>
            <button
              className="btn btn-success ml-2"
              onClick={() => {
                handleOPDpatient();
              }}
            >
              {t("OPD Patient")}
            </button>
          </>
        )}

        {values?.ReportType === "4" && (
          <>
            {renderDateRange()}
            <button
              className="btn btn-success ml-3"
              onClick={handleDoctorFeedExcelReport}
            >
              {t("Excel Report")}
            </button>
          </>
        )}

        {values?.ReportType === "5" && (
          <>
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="Date"
              name="Date"
              lable={t("Date")}
              values={values}
              setValues={setValues}
              max={new Date()}
            />
            <button
              className="btn btn-success ml-3"
              onClick={handleOPDadmissionExcelReport}
            >
              {t("Excel Report")}
            </button>
          </>
        )}

        {values?.ReportType === "6" && (
          <>
            {renderDateRange()}
            <ReactSelect
              placeholderName={t("State")}
              id="State"
              searchable
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              dynamicOptions={apiData?.getState}
              name="State"
              handleChange={handleReactSelectChange}
              value={values.State}
            />
            <Input
              type="text"
              id="patientRegNo"
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
              className="form-control"
              lable={t("Patient Registration No.")}
              value={values?.patientRegNo}
              name="patientRegNo"
              placeholder=""
              onChange={handleInputChange}
            />
            <Input
              type="text"
              className="form-control"
              id="district"
              name="district"
              lable={t("District")}
              placeholder=" "
              onChange={handleInputChange}
              value={values?.district}
              respclass="col-xl-2 col-md-3 col-sm-4 col-4"
            />
            <ReactSelect
              placeholderName={t("Type")}
              id="type"
              searchable
              respclass="col-xl-2 col-md-2 col-sm-3 col-12"
              dynamicOptions={typeOptions}
              name="type"
              handleChange={handleReactSelectChange}
              value={values.type}
            />
            <button
              className="btn btn-success ml-2"
              onClick={handleStateWiseExcelReport}
            >
              {t("Report")}
            </button>
          </>
        )}

        {values?.ReportType === "7" && (
          <>
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="Date"
              name="Date"
              lable={t("Date")}
              values={values}
              setValues={setValues}
              max={new Date()}
            />
            <button className="btn btn-success ml-2" onClick={convertedReport}>
              {"Excel Report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingReport;
