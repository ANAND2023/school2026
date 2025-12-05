import React,{useState} from "react";
import Heading from "../../../Heading";
import Tables from "../..";
import { useTranslation } from "react-i18next";
import { maxLengthChecker } from "../../../../../utils/utils";
import { Tooltip } from "primereact/tooltip";
import ViewLabReport from "../../../../FrameMenu/ViewLabReport";
import Modal from "../../../../modalComponent/Modal";
import SlideScreen from "../../../../front-office/SlideScreen";

const PendingAppointmentPatientList = ({
  thead,
  tbody,
  handleCallButtonClick,
  handlePatientSelect,
  start,
}) => {
  const [t] = useTranslation();
  const [modalHandlerState, setModalHandlerState] = useState({
      header: null,
      show: false,
      size: null,
      component: null,
      footer: null,
    });
  const getRowClass = (val, index) => {
    let data = tbody?.[index];
    // console.log("sss-----", data);
    if (data?.TemperatureRoom === 1) {
      return "color-indicator-3-bg";
    } 
    else if (data?.IsView === 1) {
      return "color-indicator-16-bg";
    } 
    else if(data?.Hold ===1){
      return "color-indicator-5-bg";
    }
    
  };

  const handleOpenModel=(item)=>{
     setModalHandlerState({
      show: true,
      header: t("View Lab Report"),
      size: "90%",
      component: <ViewLabReport data={item} />,
      footer:(
        <></>
      )
    });
  }
  return (
    <>
      <Tables
        getRowClass={getRowClass}
        thead={thead}
        tbody={tbody?.map((item, index) => ({
         AppointmentNo: <strong>{item?.AppNo}</strong>,
          IsCall: (
            <button
              className="btn btn-sm text-white w-100"
              onClick={() => handleCallButtonClick(item)}
              style={{
                backgroundColor: item?.IsCall === 1 ? "gray" : "",
                borderColor: "#f8f988",
              }}
            >
              {item?.IsCall === 1 ? "UnCall" : "Call"}
            </button>
          ),
          P_In: (
            <button
              className="btn btn-sm text-white w-100"
              onClick={() => {handlePatientSelect(item, index, "Pending")
                console.log("itemitemitemitemitemitemitemitemitemitemitemitemitem", item)
              }}
              disabled={item?.IsCall === 1 ? false : true}
            >
              In
            </button>
          ),
          Button:(
            <div className="text-center">

          <i className="fa fa-eye" onClick={(e)=>handleOpenModel(item)}>
          </i>
            </div>
         ), 
          MRNo: <strong>{item?.MRNo}</strong>,
          Pname: <strong>{item?.Pname}</strong>,
          Age: (
            <strong>
              {item?.Age}/{item?.Sex}
            </strong>
          ),
            AppointmentDate: <strong>{item?.AppointmentDateTime}</strong>,
          // AppointmentDate: item?.AppointmentDate,
          //,
          SubName: <strong>{item?.SubName}</strong>,
          Doctor: (
            <>
              <>
                <strong id={`doctor-tooltip-${index}`}>
                  {maxLengthChecker(item?.DName, 10)}
                </strong>
                {item?.DName?.length > 10 && (
                  <Tooltip
                    target={`#doctor-tooltip-${index}`}
                    content={item?.DName}
                  />
                )}
              </>
            </>
          ),
        
          PanelName: <strong>{item?.PanelName}</strong>,
          
        }))}
        tableHeight={"tableHeight scrollView"}
        style={{ height: "auto" }}
      />
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
            style={{ maxHeight: "99% !important", backgroundColor: "red" }}
          >
            {modalHandlerState?.component}
          </Modal>
          
        )}
    </>
  );
};

export default PendingAppointmentPatientList;
