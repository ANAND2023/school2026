import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingBindReportOption, BillingCTBDetailReport, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import Input from "../../../../components/formComponent/Input";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import { exportToExcel } from "../../../../utils/exportLibrary";

const CTBDetail = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "",
    ctbNo: "",
    patientID: "",
    Transition: "1",
    Type: "1"
  };
  // const [dropDownState, setDropDownState] = useState([]);
  // useEffect(() => {
  //  BindNABHList();
  //  }, []);
  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const [dropDownState, setDropDownState] = useState({
    ReportOption: [],
    PanelList: [],
  });



  const BindReportOption = async () => {

    try {
      const response = await BillingBindReportOption(reportTypeID);
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          ReportOption: handleReactSelectDropDownOptions(
            response?.data,
            "TypeName",
            "TypeID"
          ),
        }));

      }
      else {
        setDropDownState([])

      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getPanelList = async () => {
    try {
      const response = await EDPBindPanelsAPI();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          PanelList: handleReactSelectDropDownOptions(
            response?.data,
            "Company_Name",
            "PanelID"
          ),
        }));
      }
      else {
        setDropDownState([])

      }
      return response;

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  useEffect(() => {
    BindReportOption()
    getPanelList()
  }, [])


  const SaveData = async () => {

    const payload = {
      "fromdate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      "patientID": "",
      "ipdNo": values?.patientID??"",
      "ctbNo": values?.ctbNo??"",
      "panelID": values?.Panel??"",
      "type": Number(values?.Type)??"",
      "transType": Number(values?.Transition)??""
    }


    
    const response = await BillingCTBDetailReport(payload);
    if (response.success) {
      if (values?.Type == 2) {
        exportToExcel(response?.data, "Excel");
      }
      else {
        RedirectURL(response?.data?.pdfUrl);
        // RedirectURL(response?.data);  

      }

    }
    else {
      notify(response.message, "error");
    }

  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"CTB Details Report"} />
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
          <Input
            type="text"
            className="form-control required-fieldss"
            id="ctbNo"
            name="ctbNo"
            lable={t("CTB No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.ctbNo}
          />
          <Input
            type="text"
            className="form-control required-fieldss"
            id="patientID"
            name="patientID"
            lable={t("IPD No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.patientID}
          />
          <ReactSelect
            placeholderName={t("Transition Type")}
            id={"Transition"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={dropDownState}
            dynamicOptions={[
              { label: "All", value: "1" },
              { label: "Refund", value: "0" },
              { label: "Non Refund", value: "2" },

            ]}
            name="Transition"
            handleChange={handleReactSelectChange}
            value={values.Transition}
          />
          <ReactSelect
            placeholderName={t("Panel")}
            id={"Panel"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={dropDownState?.PanelList}
            // dynamicOptions={[
            //     {label:"All",value:"1"},
            //     {label:"Refund",value:"0"},
            //     {label:"Non Refund",value:"2"},

            // ]}
            name="Panel"
            handleChange={handleReactSelectChange}
            value={values.Panel}
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
          {/* <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={dropDownState}
            dynamicOptions={[
                {label:"Admission",value:"1"},
                {label:"Discharged",value:"2"},
            ]}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
          /> */}
          {/* <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
           
             dynamicOptions={dropDownState?.ReportOption}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
          /> */}
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTBDetail;
