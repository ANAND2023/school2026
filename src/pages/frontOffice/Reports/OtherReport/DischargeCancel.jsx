import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingCTBDetailReport, BillingDischargeCancelReport, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import Input from "../../../../components/formComponent/Input";

const DischargeCancel = ({reportTypeID}) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType:"",
    ctbNo:"",
    patientID:""
  };
    // const [dropDownState, setDropDownState] = useState([]);
  // useEffect(() => {
  //  BindNABHList();
  //  }, []);
  const [values, setValues] = useState({ ...initialValues });
  // const handleReactSelectChange = (name, e) => {
  //   const obj = { ...values };
  //   obj[name] = e?.value;
  //   setValues(obj);
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues({ ...values, [name]: value });
  // };
  // const BindNABHList = async () => {
  //   try {
  //     const response = await BillingReportsBindReportType();
  //     if(response?.success){
  //     setDropDownState(handleReactSelectDropDownOptions(response?.data,"ReportName","ReportID"))
  //     }
  //     else{
  //       setDropDownState([])

  //     }
  //     return response;

  //   } catch (error) {
  //     console.log(error, "SomeThing Went Wrong");
  //   }
  // };
  const SaveData = async () => {
  
    const payload ={
      "fromdate":moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
    }

     const response =  await BillingDischargeCancelReport(payload);
     if (response.success){
     RedirectURL(response?.data?.pdfUrl);
     }
     else{
      notify(response.message,"error");
     }

  };
    return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Discharge Cancel Report"} />
        <div className="row p-2">
        {/* <ReportsMultiSelect
            name="panel"
            placeholderName="Panel"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          /> */}
        
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
          
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Report</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DischargeCancel;
