import React, { useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import RoomShift from "./RoomShift";
import DoctorShift from "./DoctorShift";
import NursingInitialAssessmentPage from "./NursingInitialAssessmentPage";
import InitialStatementVital from "./InitialStatementVital";
import InPatientTransferCheckListPage from "./InPatientTransferCheckListPage";
import NursesDischargeNote from "./NursesDischargeNote";
import DischargePatientCheckList from "./DischargePatientCheckList";

const InPatientTransferCheckList = ({ data }) => {
  const [t] = useTranslation();
  const [activeClass, setActiveClass] = useState("IPTCL");
  const handleClickShiftChange = (classes) => {
    setActiveClass(classes);
    if (classes === "NDN") {
      //   bindPanelApprovalDetails()
    }
  };
  
  const HandleShiftPage = () => {
    return (
      <>
        <span
          className={`pointer-cursor ${activeClass === "IPTCL" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("IPTCL");
          }}
        >
          {" "}
          {t("In patient Transfer")}{" "}
          {/* {t("Doctor-Shift")}{" "} */}
        </span>
        <span
          className={`pointer-cursor ml-2 ${activeClass === "NDN" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("NDN");
          }}
        >
          {" "}
          {t("Nursing Discharge Note")}{" "}
        </span>
        <span
          className={`pointer-cursor ml-2 ${activeClass === "DPCL" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("DPCL");
          }}
        >
          {" "}
          {t("Discharge Patient CheckList")}{" "}
        </span>
      </>
    );
  };
  return (
    <>
      <div className="card">
        <Heading title={<HandleShiftPage />}> </Heading>
        {activeClass === "IPTCL" && (
          <InPatientTransferCheckListPage activeClass={activeClass} data={data} />
        ) }
        
       { activeClass === "NDN" &&  (
          <NursesDischargeNote data={data} activeClass={activeClass} />
        )}
       { activeClass === "DPCL" &&  (
          <DischargePatientCheckList data={data} activeClass={activeClass} />
        )}
        {/* {activeClass === "DS" ? (
          <DoctorShift activeClass={activeClass} data={data} />
        ) : (
          <RoomShift data={data} activeClass={activeClass} />
        )} */}
      </div>
    </>
  );
};

export default InPatientTransferCheckList;
