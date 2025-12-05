import React, { useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import RoomShift from "./RoomShift";
import DoctorShift from "./DoctorShift";
import NursingInitialAssessmentPage from "./NursingInitialAssessmentPage";
import InitialStatementVital from "./InitialStatementVital";

const NursingInitialAssessment = ({ data }) => {
  const [t] = useTranslation();
  const [activeClass, setActiveClass] = useState("NAP");
  const handleClickShiftChange = (classes) => {
    setActiveClass(classes);
    if (classes === "ISV") {
      //   bindPanelApprovalDetails()
    }
  };
  
  const HandleShiftPage = () => {
    return (
      <>
        <span
          className={`pointer-cursor ${activeClass === "NAP" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("NAP");
          }}
        >
          {" "}
          {t("Nursing Initial Assement")}{" "}
          {/* {t("Doctor-Shift")}{" "} */}
        </span>
        <span
          className={`pointer-cursor ml-2 ${activeClass === "ISV" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("ISV");
          }}
        >
          {" "}
          {t("Initial Vital")}{" "}
        </span>
      </>
    );
  };
  return (
    <>
      <div className="card">
        <Heading title={<HandleShiftPage />}> </Heading>
        {activeClass === "NAP" ? (
          <NursingInitialAssessmentPage activeClass={activeClass} data={data} />
        ) : (
          <InitialStatementVital data={data} activeClass={activeClass} />
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

export default NursingInitialAssessment;
