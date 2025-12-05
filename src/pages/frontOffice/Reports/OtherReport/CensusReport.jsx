import { useTranslation } from "react-i18next";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useState } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import moment from "moment/moment";
import { BillingBillingReportsCensusReport } from "../../../../networkServices/MRDApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { notify } from "../../../../utils/ustil2";

const CensusReport = ({ eportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    PatientType: "",
    BillingType: "",
    ReportType: "",
    Type: "0",
  };

  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const handleReactSelectChange = (name, e) => {
    // debugger
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  const renameKeysInArray = (arr, keyMap) =>
    arr.map((obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [keyMap[key] || key, value])
      )
    );

  const CensusData = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: values?.ReportType === "1" ? "D" : "S",
      patientType: values?.PatientType === "1" ? "OPD" : "IPD",
      billingType:
        (values?.PatientType == 1 || values?.PatientType == 2) &&
        values?.ReportType == 2
          ? Number(values?.BillingType)
          : "",
      fileType: Number(values?.Type),
    };

    try {
      const response = await BillingBillingReportsCensusReport(payload);

      if (response?.success) {
        if (payload?.fileType === 0) {
          // const filterField = response?.data?.map((item) => {
          //   const { toDate, reportName, fromDate, logo, ...rest } = item;
          //   return rest;
          // });
          // const totalRow = {};
          // Object.keys(filterField[0]).forEach((key) => {
          //   if (typeof filterField[0][key] === "number") {
          //     totalRow[key] = filterField.reduce(
          //       (sum, row) => sum + (Number(row[key]) || 0),
          //       0
          //     );
          //   } else if (
          //     key === "company_Name" ||
          //     key === "docDepartment" ||
          //     key === "doctorName"
          //   ) {
          //     totalRow[key] = "TOTAL";
          //   } else {
          //     totalRow[key] = "";
          //   }
          // });

          // filterField.push(totalRow);

          if (values?.BillingType === "2") {
            const keyMap = {
              DoctorName: "Panel Name",
              DoctorID: "Panel Id",
            };

            const responseFiltered = renameKeysInArray(response?.data, keyMap);
            exportToExcel(responseFiltered, "Census Report");
            return;
          } else if (values?.BillingType === "3") {
            const keyMap = {
              DoctorName: "Department Name",
              DoctorID: "Department Id",
            };

            const responseFiltered = renameKeysInArray(response?.data, keyMap);
            exportToExcel(responseFiltered, "Census Report");
            return;
          }

          exportToExcel(response?.data, "Census Report");
        } else {
          RedirectURL(response?.data?.pdfUrl);
        }
      } else {
        notify(response?.message || "Error fetching report", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Census Report"} />
        <div className="row p-2">
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
          />
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"PatientType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
            // dynamicOptions={dropDownState}
            dynamicOptions={[
              { label: "OPD", value: "1" },
              { label: "IPD", value: "2" },
            ]}
            name="PatientType"
            handleChange={handleReactSelectChange}
            value={values?.PatientType}
          />
          {console.log(values)}
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
            // dynamicOptions={dropDownState}
            dynamicOptions={
              values?.PatientType === "2"
                ? [{ label: "Summary", value: "2" }]
                : [
                    { label: "Detail ", value: "1" },
                    { label: "Summary", value: "2" },
                  ]
            }
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values?.ReportType}
          />

          {(values?.PatientType == 1 || values?.PatientType == 2) &&
            values?.ReportType == 2 && (
              <ReactSelect
                placeholderName={t("Billing Type")}
                id={"BillingType"}
                searchable={true}
                respclass="col-xl-2 col-md-2 colt-sm-4 col-12"
                // dynamicOptions={dropDownState}
                dynamicOptions={[
                  { label: "Doctor Wise ", value: "1" },
                  { label: "Panel Wise", value: "2" },
                  { label: "Department Wise", value: "3" },
                ]}
                name="BillingType"
                handleChange={handleReactSelectChange}
                value={values?.BillingType}
              />
            )}

          <ReactSelect
            placeholderName={t("File Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-1 col-md-2 col-sm-3 col-12"
            dynamicOptions={[
              { label: "Pdf", value: "1" },
              { label: "Excel", value: "0" },
            ]}
            name="Type"
            handleChange={handleReactSelectChange}
            value={values?.Type}
          />

          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={CensusData}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CensusReport;
