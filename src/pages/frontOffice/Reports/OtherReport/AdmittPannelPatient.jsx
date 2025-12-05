import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingAdmittedPanelPatient, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";

const AdmittPannelPatient = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "1",
    fromMonth: "7",
    toMonth: "7",
    Type: "1"
  };
  const [dropDownState, setDropDownState] = useState([]);
  useEffect(() => {
    BindNABHList();
  }, []);
  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  const BindNABHList = async () => {
    try {
      const response = await BillingReportsBindReportType();
      if (response?.success) {
        setDropDownState(handleReactSelectDropDownOptions(response?.data, "ReportName", "ReportID"))
      }
      else {
        setDropDownState([])

      }
      return response;

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const SaveData = async () => {

    const payload =
    // Billing/BillingReports/AdmittedPanelPatient

    {
      "fromdate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      "reportType": values?.ReportType,
      "fromMonth": values?.fromMonth,
      "toMonth": values?.toMonth,
      "type": 1
      // "type": Number(values?.Type)
    }


    // {
    //   rbtActiveVal: values.ReportType,
    //   fromDate:  moment(values?.fromDate).format("DD-MMM-YYYY"),
    //   toDate: moment(values.toDate).format("DD-MMM-YYYY")
    // }
    const response = await BillingAdmittedPanelPatient(payload);
    if (response.success) {
      RedirectURL(response?.data?.pdfUrl);
    }
    else {
      notify(response.message, "error");
    }

  };
  const SaveDataMonth = async () => {

    const payload =
    // Billing/BillingReports/AdmittedPanelPatient

    {
      "fromdate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      "reportType": values?.ReportType,
      "fromMonth": values?.fromMonth,
      "toMonth": values?.toMonth,
      "type":2
      // "type": Number(values?.Type)
    }


    // {
    //   rbtActiveVal: values.ReportType,
    //   fromDate:  moment(values?.fromDate).format("DD-MMM-YYYY"),
    //   toDate: moment(values.toDate).format("DD-MMM-YYYY")
    // }
    const response = await BillingAdmittedPanelPatient(payload);
    if (response.success) {
      RedirectURL(response?.data?.pdfUrl);
    }
    else {
      notify(response.message, "error");
    }

  };
  console.log("values", values)
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Admitted Panel Patient"} />
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
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Detail Report", value: "1" },
              { label: "Panel Wise Summary", value: "2" },
              { label: "Department Wise Summary", value: "3" },
            ]}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
          />
 {/* <ReactSelect
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
          /> */}
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Weekly Report</button>
          </div>
        </div>
        <div className="row p-2">


          <ReactSelect
            placeholderName={t("From Month")}
            id={"fromMonth"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Jan", value: "1" },
              { label: "Feb", value: "2" },
              { label: "Mar", value: "3" },
              { label: "Apr", value: "4" },
              { label: "May", value: "5" },
              { label: "Jun", value: "6" },
              { label: "Jul", value: "7" },
              { label: "Aug", value: "8" },
              { label: "Sep", value: "9" },
              { label: "Oct", value: "10" },
              { label: "Nov", value: "11" },
              { label: "Dec", value: "12" }
            ]}
            name="fromMonth"
            handleChange={handleReactSelectChange}
            value={values.fromMonth}
          />
          <ReactSelect
            placeholderName={t("To Month")}
            id={"toMonth"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Jan", value: "1" },
              { label: "Feb", value: "2" },
              { label: "Mar", value: "3" },
              { label: "Apr", value: "4" },
              { label: "May", value: "5" },
              { label: "Jun", value: "6" },
              { label: "Jul", value: "7" },
              { label: "Aug", value: "8" },
              { label: "Sep", value: "9" },
              { label: "Oct", value: "10" },
              { label: "Nov", value: "11" },
              { label: "Dec", value: "12" }
            ]}
            name="toMonth"
            handleChange={handleReactSelectChange}
            value={values.toMonth}
          />
          {/* <ReactSelect
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
          /> */}

          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveDataMonth}>Monthly Report</button>
          </div>
        </div>
      </div>

    </>
  );
};

export default AdmittPannelPatient;
