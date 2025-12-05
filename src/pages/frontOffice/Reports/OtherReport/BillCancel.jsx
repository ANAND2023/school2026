import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingBillCancelReport, BillingCTBDetailReport, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import Input from "../../../../components/formComponent/Input";
import { exportToExcel } from "../../../../utils/exportLibrary";

const BillCancel = () => {
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

    const payload = {
      "fromdate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      "type": Number(values?.Type)
    }
    const response = await BillingBillCancelReport(payload);
    if (response.success) {
      if (values?.Type == 2) {
        exportToExcel(response?.data, "Bill Cancel Report");
      }
      else {
        RedirectURL(response?.data?.pdfUrl);
      }
    }
    else {
      notify(response.message, "error");
    }

  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Bill Cancel Report"} />
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
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

            dynamicOptions={[
              { label: "Pdf", value: "1" },
              { label: "Excel", value: "2" },

            ]}

            name="Type"
            handleChange={handleReactSelectChange}
            value={values.Type}
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Report</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillCancel;
