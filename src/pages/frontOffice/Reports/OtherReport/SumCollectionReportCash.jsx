import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingAdmissionProcessTAT, BillingBillCancelReport, BillingCTBDetailReport, BillingDischargeProcessTAT, BillingOPDPatientTimewiseReport, BillingOPDTATReport, BillingReportsBindReportType, BindNABH, PrintNBHReport, ReportsSumCollectionReportCash } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import Input from "../../../../components/formComponent/Input";
import { exportToExcel } from "../../../../utils/exportLibrary";

const SumCollectionReportCash = () => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "",
    ctbNo: "",
    patientID: "",
    Type: "1"
  };

  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };


  const SaveData = async () => {
debugger
    const payload = {
      "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
    //   "fileType": Number(values?.Type)
    }
    const response = await ReportsSumCollectionReportCash(payload);

    if (response?.success) {
    //   if (values?.Type == 2) {
    //     exportToExcel(response?.data, "Excel");
    //   }
    //   else {
        RedirectURL(response?.data?.pdfUrl);
        //  exportToExcel(response?.data?.data, "Excel");
    //   }
    }
    else {
      notify(response.message, "error");
    }

  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Summary Collection Report Cash"} />
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

          {/* <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

            dynamicOptions={[
              { label: "Pdf", value: "1" },
              { label: "Excel", value: "0" },

            ]}

            name="Type"
            handleChange={handleReactSelectChange}
            value={values.Type}
          /> */}
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Report</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SumCollectionReportCash;
