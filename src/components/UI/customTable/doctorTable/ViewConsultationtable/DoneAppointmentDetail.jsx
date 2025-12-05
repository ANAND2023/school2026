import React,{useState} from "react";
import Heading from "../../../Heading";
import Tables from "../..";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";
import Modal from "../../../../modalComponent/Modal";
import ViewLabReport from "../../../../FrameMenu/ViewLabReport";
const DoneAppointmentDetail = ({
  thead,
  tbody,
  handleCallButtonClick,
  handlePatientSelect,
  start
}) => {
  // console.log(tbody);
  
  const [t] = useTranslation();
  const [modalHandlerState, setModalHandlerState] = useState({
      header: null,
      show: false,
      size: null,
      component: null,
      footer: null,
    });
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
          {/* {tbody.map((item, index) => (
        <Tooltip
          key={index}
          target={`#Doctor-${index}}`}
          position="top"
        //   content={item.Dname}
        />
      ))} */}
      {/* <Heading title={t("Item Details")} /> */}
      <Tables
        thead={thead}
        tbody={tbody?.map((item, index) => ({
          AppointmentNo: <strong>{item?.AppNo}</strong>,
           IsCall: (
            <>
            {/* <i className="pi pi-check" onClick={() => handlePatientSelect(item,index)}
              disabled={item?.IsCall === 1 ? false : true}></i> */}
              <button
              className="btn btn-sm text-white w-100"
              onClick={() => handlePatientSelect(item,index, "done")}
              disabled={item?.IsCall === 1 ? false : true}
            >
              In
            </button>
            </>
          ),
          Button:(
            <div className="text-center">

          <i className="fa fa-eye" onClick={(e)=>handleOpenModel(item)}>
          </i>
            </div>
         ),
          MRNo: <strong>{item?.MRNo}</strong> ,
          Pname: <strong> {item?.Pname}</strong> ,
          Age: (
            <strong>
              {" "}
              {item?.Age}/{item?.Sex}
            </strong>
          ),
          SubName: <strong>{item?.SubName}</strong>,
          Doctor: <>
           <strong
                id={`Doctor-${index}`}
                data-pr-tooltip={item?.DName}
                style={{ fontSize: "11px" }}
              >
                {`${item?.DName}...`}
                {/* {`${item?.DoctorName?.substring(0, 8)}...`} */}
              </strong>
          </>,
          AppointmentDate: <strong>{item?.AppointmentDateTime}</strong> , 
          PanelName: <strong>{item?.PanelName}</strong> ,
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
          >
            {modalHandlerState?.component}
          </Modal>
        )}
    </>
  );
};

export default DoneAppointmentDetail;
