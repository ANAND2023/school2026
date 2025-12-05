import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../Heading";
import Tables from "..";
import PatientDetailCard from "../../../commonComponents/PatientDetailCard";
import { BindFrameMenuByRoleID } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";

import SlideScreen from "../../../front-office/SlideScreen";

import SeeMoreSlideScreen from "../../SeeMoreSlideScreen";
import ReportCard from "../../../commonComponents/ReportCard";
import PatientBasicDetails from "../../../../pages/ResultEntry/PatientBasicDetails";
import { PatientBillingGetPatietnBasicData } from "../../../../networkServices/BillingsApi";
import { notify } from "../../../../utils/ustil2";
import Modal from "../../../modalComponent/Modal";
import ResultEntry from "../../../../pages/ResultEntry/ResultEntry";
import { use } from "react";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import PrescriptionMultiPrint from "../../../../pages/doctor/OPD/PrescriptionMultiPrint";

const PatientRegSearchTable = (props) => {
  const isMobile = window.innerWidth <= 768;
  const { THEAD, tbody, handleSubmit, values } = props;


  const { defaultRole } = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const dispatch = useDispatch();
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const newTHead = defaultRole == 213 ? THEAD : THEAD?.filter((_, index) => index !== 2);
  // console.log(renderComponent);
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        BindFrameMenuByRoleID({
          frameName: "IPD",
        })
      );
    };
    fetchData();
  }, [dispatch]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  const getRowClass = (val) => {
    // debugger
    const patientId = typeof val?.patientID === "object" ? val?.patientID?.props?.children : val?.patientID;
    let newtbody = tbody?.find((item) => item?.patientID === patientId);
    if (newtbody?.mlc === "1") {
      return "color-indicator-23-bg";
    }
    if (newtbody?.isPatientReceived === "0") {
      return "color-indicator-2-bg";
    } else if (
      newtbody?.creditPanelLimitOver === "1" &&
      newtbody?.isCreditPanelApproval === "1"
    ) {
      return "color-indicator-7-bg";
    }
    else if (newtbody?.amtpaid === "1") {
      return "color-indicator-3-bg";
    }
    else if (newtbody?.amtpaid === "0") {
      return "color-indicator-1-bg";
    } else {
      return "color-indicator-10-bg";
    }
  };



  const getPatientBasicData = async (LedtnxNo) => {
    // debugger
    try {
      const response = await PatientBillingGetPatietnBasicData(LedtnxNo, 0)
      if (response?.success) {
        // setPatientBaiscDetails(response?.data[0])
        setModalHandlerState(
          {
            header: t("Patient Basic Details"),
            show: true,
            size: "70vw",
            component: <PatientBasicDetails
              patientBaiscDetails={response?.data[0]}
            />,
            footer: <></>,
          }
        )
      }
      else {
        notify(response?.message, "error")
      }


    } catch (error) {
      console.log(error)
    }

  }

  const handleTableDoubleClick = (ele, index) => {
    // debugger
    getPatientBasicData(tbody[index]?.transactionID)
  };


  const getRbsReport = (pid) => {
    setModalHandlerState(
      {
        header: t("Patient Tests"),
        show: true,
        size: "95vw",
        component: <ResultEntry
          // patientBaiscDetails={response?.data[0]}
          UHIDipd={pid}
        />,
        footer: <></>,
      }
    )

  }

  // };

  //  console.log(tbody,"item")
  return (
    <>

      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
      {tbody?.length > 0 && (
        <>

          <Tables
            thead={newTHead}
            tdFontWeight={"bold"}
            tbody={tbody?.map((item, index) => {
              let baseRow = {
                actions: (
                  <PatientDetailCard
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={item}
                    handleSubmit={handleSubmit}
                  />
                ),
                ReportType: (
                  <ReportCard
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={item}
                    handleSubmit={handleSubmit}
                  />
                ),
                rbs: defaultRole == 213 ? (<button className="btn btn-sm btn-primary"
                  onClick={() => {
                    getRbsReport(item?.patientID)
                  }}
                >RBS</button>) : null,
                ViewDoctorNotes: <i class="fa fa-eye"
                  onClick={() => {
                   
                    setModalHandlerState(
                      {
                        header: t("View Doctors Prescription"),
                        show: true,
                        size: "95vw",
                        component: <PrescriptionMultiPrint
                          // patientBaiscDetails={response?.data[0]}
                          UHID={item?.patientID}
                        />,
                        footer: <></>,
                      }
                    )
                  }}
                ></i>,
                billStatus: item?.billStatus,
                acknowledge: (<div className="panel-cell-small">{item?.pateintRecived}</div>),
                admitDate: item?.admitDate,
                dischargeDate: (<div className="panel-cell-small">{item?.dischargeDate}</div>),
                ipdno: item?.ipdno,
                remainingAmt: item?.remainingAmt || 0,
                isBillFinalised:
                  values?.admitDischarge?.value === "DI"
                    ? item?.billNo?.length > 0 ? (
                      <p style={{ color: "green", fontWeight: "bold", margin: "auto auto" }}>YES</p>
                    ) : (
                      <p style={{ color: "red", fontWeight: "bold", margin: "auto auto" }}>NO</p>
                    )
                    : null,
                pName: (<div className="panel-cell ">{item?.pName}</div>),
                patientID: item?.patientID,
                ageSex: (<div className="panel-cell ">{item?.ageSex}</div>),
                company_Name: (<div className="panel-cell ">{item?.company_Name}</div>),
                dName: (<div className="panel-cell ">{item?.dName}</div>),
                rName: (<div className="panel-cell ">{item?.roomName}</div>),
                mobile: (<div className="panel-cell-small ">{item?.mobile}</div>),
                relation: (<div className="panel-cell-small ">{item?.relation}</div>),
                admittedBy: (<div className="panel-cell ">{item?.admittedBy}</div>),
                billNo: (<div className="panel-cell ">{item?.billNo}</div>),
              }

              if (values?.admitDischarge?.value !== "DI") {
                delete baseRow.isBillFinalised;
              }
              if (defaultRole != 213) {
                delete baseRow.rbs;
              }
              return baseRow;
            })}
            tableHeight={"scrollView"}
            style={!isMobile ? { height: "44vh" } : {}}
            getRowClass={getRowClass}
            isSearch={true}
            handleDoubleClick={handleTableDoubleClick}
          />
        </>
      )}
      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            // minWidth="600px"
            name={t(renderComponent?.name)}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
};

export default PatientRegSearchTable;
