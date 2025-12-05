import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../..";
import { notify } from "../../../../../utils/utils";
import { BindLabReport } from "../../../../../networkServices/resultEntry";
import { RedirectURL } from "../../../../../networkServices/PDFURL";

const ViewLabReportTable = ({ tbody }) => {
  // console.log(props);

  // const {tbody} = props;
  // console.log(tbody);

  const [t] = useTranslation();

  const THEAD = [
    // t("Delta Check"),
    t("Date"),
    t("BarcodeNo"),
    t("Department"),
    t("Investigations"),
    t("Status"),
    t("View Report"),
  ];

  const handleViewReport = () => {
    console.log("View Report Clicked");
    try {
    } catch (error) {
      console.log(error);
    }
  };

 const getRowClass = (val) => {
    // debugger
   // const patientId = typeof val?.patientID === "object" ? val?.patientID?.props?.children : val?.patientID;
   // let newtbody = tbody?.find((item) => item?.patientID === patientId);
     console.log(val,"val");
    if (val?.Status === "SN") {
        return "statusAppointment";
    } 
   if (val?.Status === "SC") {
      return "statusRescheduled";
    } 
    if (val?.Status === "RN") {
          return "";
    } 
      if (val?.Status === "NA") {
      return "statusCanceled";
    } 
    if (val?.Status === "A") {
      return "statusConfirmed";
    } 
  };

  const handleBindLabReport = async (Test_ID) => {
    const payload = {
      testID: Test_ID,
      isOnlinePrint: "1",
      isConversion: "",
      isNabl: "0",
      orderBy: "",
      labType: "1",
      ipAddress: "",
      isPrev: true,
    };

    try {
      const apiResp = await BindLabReport(payload);

      if (!apiResp?.success || !apiResp?.data) {
        notify("No records found", "error");
        return;
      } else if (apiResp?.success) {
        RedirectURL(apiResp?.data);
        return;
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      notify("An error occurred while fetching data", "error");
    }
  };
  console.log(tbody, "tbody");

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={(Array.isArray(tbody) ? tbody : []).map((item, index) => ({
          // "Delta Check": (
          //   <>
          //     <i className="pi pi-search" style={{ padding: "5px" }}></i>
          //   </>
          // ),
          Date: item?.DATE,
          BarcodeNo: item?.BarcodeNo,
          Department: item?.Department,
          Investigations: item?.Name,
           Status: item?.Status,
          "Pacs Images":
            item?.canViewReport === 1 ? (
              <div
                className="d-flex justify-content-center align-items-center hover_effect"
                onClick={() => handleBindLabReport(item.Test_ID)}
              >
                <i
                  className="fa fa-eye"
                  style={{ padding: "5px", textAlign: "center" }}
                ></i>
              </div>
            ) : (
              <></>
            ),
        }))}
        tableHeight={"tableHeight"}
        getRowClass={getRowClass}
      />

    </>
  );
};

export default ViewLabReportTable;
