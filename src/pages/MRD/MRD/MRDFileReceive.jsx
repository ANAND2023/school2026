import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { MRDCreateIssueFileApi, MRDIssueFileStatusApi, MRDIssueFilleSearchApi, MRDPatientInfoApi, MRDPatientIssuedListApi } from "../../../networkServices/MRDApi";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import NewRemarks from "./NewRemarks";

const MRDFileReceive = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const THEAD = [
    t("Sr.No"),
    t("Patient ID"),
    t("Patient Name"),
    t("Doctor Name"),
    t("Issue Date"),
    t("Issue Time"),
    t("Issue To"),
    t("Remarks"),
    t("Receive"),
  ];
  const [payload, setPayload] = useState({
    patientId: "",
    // fromDate: new Date(),
    // toDate: new Date(),

  });
  const [tableData, setTableData] = useState([]);
  const [modalConfig, setModalConfig] = useState({ visible: false });
  const [formValues, setFormValues] = useState({});

  /** ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((p) => ({ ...p, [name]: value }));
  };

  const handleSearchByRegNo = async () => {
    
    const payload2 = {
      PatientID: payload?.patientId || "",
      // fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      // toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
    }
    try {
      const res = await MRDIssueFilleSearchApi(payload2);
      if (res?.success) {
        const newData = res?.data?.map((item, index) => {
          return {
            ...item,
            newRemarks: "",
            receiveDate: "",
            receiveTime: new Date(),
          }
        })

        setTableData(newData);
      } else {
        notify(res?.message, "error");

      }

    } catch (err) {
      notify(err?.message, "error");

    }
  };

  const combineDateTime = (receiveDate, receiveTime) => {
    const datePart = moment(receiveDate).format("YYYY-MM-DD");

    const timePart = moment(receiveTime).format("HH:mm:ss");
    const combined = moment(`${datePart} ${timePart}`, "YYYY-MM-DD HH:mm:ss");
    return combined.format("DD-MMM-YYYY hh:mma");
  };
  const handleIssue = async (data) => {
    debugger
    const combinedDateTime = moment(new Date()).format("DD-MMM-YYYY hh:mma");
    // const combinedDateTime = combineDateTime(data?.receiveDate?data?.receiveDate:new Date(), data?.receiveTime);

    const submitBody = {
      PatientID: data?.PatientId || 0,
      Remarks:  "",
      // Remarks: data?.newRemarks || "",
      fileIssueId: data?.FileIssueId || 0,
      returnDate: combinedDateTime,
    };

    try {
      const response = await MRDIssueFileStatusApi(submitBody);
      if (response?.success){
        notify(response?.message, "success");
        setModalConfig({ visible: false })
        handleSearchByRegNo();
        setTableData([])
      } 
      else notify(response?.message, "error");
    } catch (error) {
      notify(error?.message || "Error issuing file", "error");
    }
  };
  const handleRemarksModal = (rowData) => {
    setFormValues(rowData);
    setModalConfig({
      visible: true,
      width: "30vw",
      label: "Remarks",
      buttonName: "Receive",
      // CallAPI: () => handleIssue(formValues),
    });
  };

  console.log(formValues, "modalData");
  /** ---------- JSX ---------- */
  return (
    <div className="w-100">
      {modalConfig?.visible && (
        <Modal
          visible={modalConfig.visible}
          setVisible={() => setModalConfig({ visible: false })}
          modalWidth={modalConfig.width}
          Header={modalConfig.label}
          buttonType="button"
          buttonName={modalConfig.buttonName}
          handleAPI={() => handleIssue(formValues)}   
        >
          <NewRemarks formValues={formValues} setFormValues={setFormValues} />
        </Modal>

      )}
      <div className="mt-2 card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="patientId"
            lable={"Patient ID"}
            placeholder=" "
            value={payload?.patientId}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="patientId"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchByRegNo();
              }
            }}
            onChange={handleChange}
          />
          {/* <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={"From Date"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="fromDate"
            id="fromDate"
            value={payload.fromDate}
            handleChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={"To Date"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="toDate"
            id="toDate"
            value={payload.toDate}
            handleChange={handleChange}
          /> */}
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <button className="btn btn-sm btn-primary me-2" onClick={handleSearchByRegNo}>
              {t("Search")}
            </button>

          </div>
        </div>
      </div>
        
      {tableData?.length > 0 && (

        <div className="card">
          <Heading title={"Issued Files"} isBreadcrumb={false} />
          <div>
            <Tables
              thead={THEAD}
              tbody={tableData?.map((item, index) => [
                index + 1,
                item?.PatientId,
                item?.NAME,
                item?.ChangesDoctorName,
                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("DD-MM-YYYY"),
                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("hh:mm A"),
                item?.DepartmentName,
                item?.Remarks,
                item?.IsReturn === 0 ? (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      handleRemarksModal(item);
                      // handleIssue(item);
                      
                    }}
                  >
                    <i className='fas fa-check'></i>
                  </button>
                ) : "-",

              ])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MRDFileReceive;
