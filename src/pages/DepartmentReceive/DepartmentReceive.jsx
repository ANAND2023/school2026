import React, { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import Tables from "../../components/UI/customTable";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import {
  RejectDepartmentDataLab,
  SaveSampleRecive,
  SaveTransferDataLab,
  SearchListLab,
} from "../../networkServices/departmentreceive";
import { CancelSVG } from "../../components/SvgIcons";
import SampleCollectionRejectModel from "../../components/modalComponent/Utils/SampleCollectionRejectModel";
import Modal from "../../components/modalComponent/Modal";
import { BindDepartmentCountDetail } from "../../networkServices/approvedunapprovedLog";
import { SaveSampleRejectReasonApi } from "../../networkServices/SampleCollectionAPI";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const { VITE_DATE_FORMAT } = import.meta.env;

function DepartmentReceive({UHIDipd,pDate}) {
  const [t] = useTranslation();

  const statusType = [
    { value: "A", label: "All" },
    { value: "N", label: "Not Collected" },
    { value: "s", label: "Pending" },
    { value: "Y", label: "Received" },
    { value: "R", label: "Reject" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    UHID: "",
    status: { value: "s", label: "Pending" },
    department: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
  });


  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [bckupTbodyPatientDetail, setBckupTbodyPatientDetail] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const ip = localStorage.getItem("ip");
  const userData = useLocalStorage("userData", "get");

  const isMobile = window.innerWidth <= 800;

  console.log(handleModelData);

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);
    const updatedData = tbodyPatientDetail.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setTbodyPatientDetail(updatedData);
  };

  const findCurrentDepartment = () => {
    console.log(departmentData, userData, "daaaaa")
    const data = departmentData?.find(
      (item) => item?.Name?.toUpperCase() === userData?.roleName?.toUpperCase()
    );
    return data
  };

  const handleChangeCheckbox = (val, index) => {
    const updatedData = [...tbodyPatientDetail];
    updatedData[index].isChecked = !updatedData[index].isChecked;
    setTbodyPatientDetail(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };

  console.log("the values is", values);

  const handleSearchSampleCollection = async (isTost = true , pid = "", pdate ="") => {

    const payload = {
      observationTypeID: values?.department?.value?.toString() ?? "0",
      barcodeNo: pid ? pid :values?.BarcodeNo,
      patientID: values?.UHID,
      startDate: pdate ?  moment(pdate).format("DD-MMM-YYYY") : moment(values?.fromDate).format("DD-MMM-YYYY"),
      endDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      sampleCollectedStatus: values?.status?.value?.toString() ?? "0",
    };

    try {
      const apiResp = await SearchListLab(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          `121`
          val.isChecked = false;
          return val;
        });
        setTbodyPatientDetail(data);
        setBckupTbodyPatientDetail(data);
      } else {
        isTost && notify("No records found", "error");
        setTbodyPatientDetail([]);
        setBckupTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };



  const CheckDepartment = async () => {
    try {
      const response = await BindDepartmentCountDetail();
      if (response.success) {
        console.log("the department data is", response);
        setDepartmentData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  const handleRecieve = async () => {
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    if (!anyChecked) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received",
        "error"
      );
      return;
    }

    // Proceed if a checkbox is selected
    let RecPayload = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.isChecked) {
        let data = {
          testID: String(val?.Test_ID ? val?.Test_ID : ""),
          reportType: String(val?.Reporttype ? val?.Reporttype : ""),
        };
        RecPayload.push(data);
      }
    });

    try {
      const ReciveResp = await SaveSampleRecive(RecPayload);
      if (ReciveResp.success) {
        handleSearchSampleCollection(false);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received"
      );
    }
  };

  const handleTransfer = async () => {
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample", "error");
      return;
    }
    let TransferPayload = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.isChecked) {
        let testID = String(val?.Test_ID ? val?.Test_ID : "");
        TransferPayload.push(testID);
      }
    });

    try {
      const TransferResp = await SaveTransferDataLab(TransferPayload);
      if (TransferResp.success) {
        notify(`${TransferResp?.message}`, "success");
        handleSearchSampleCollection();
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };
  const getRowClass = (val, index) => {
    let status = tbodyPatientDetail[index]
    console.log("sdasd", status)

    if (status?.IsSampleCollected === "N") {
      return "NotCollected";
    }
    if (status?.rowcolor === "lightyellow") {
      return "IPDROWCOLOR";
    }
    if (status?.rowcolor === "red") {
      return "EMERGENCYROWCOLOR";
    }

  }

  useEffect(() => {
    CheckDepartment();
  }, []);
  useEffect(() => {
    const currentDepartment = findCurrentDepartment();
    if (currentDepartment) {
      setValues((prev) => ({
        ...prev,
        department: {
          value: currentDepartment?.ObservationType_ID || "",
          label: currentDepartment?.Name || ""
        }
      }));
    }
  }, [departmentData]);

  const theadPatientDetail = [
    {
      width: "5%",
      name: isMobile ? (
        t("NursingWard.NurseAssignment.check")
      ) : (
        <input
        type="checkbox"
        checked={isHeaderChecked}
        disabled={values?.status?.value === "N" ? true : false}
        onChange={handleChangeCheckboxHeader}
        />
      ),
    },
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("TestID") },
    { width: "5%", name: t("CTBNo") },
    { width: "15%", name: t("Patient Name") },
    // { width: "15%", name: t("Booking Center") },
    { width: "10%", name: t("Type") },
    { width: "15%", name: t("Barcode No") },
    { width: "10%", name: t("UHID") },
    { width: "10%", name: t("Age/Gender") },
    { width: "10%", name: t("Req Date/Withdraw Date/Devation") },
    { width: "10%", name: t("Test Name") },
    { width: "10%", name: t("Reject") },

  ];
  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const RejectSampleCollection = async (data) => {
    const reasonPayload = {
      reasion: data?.newReason || data?.rejectreason,
    };
    try {
      const reasonResponse = await SaveSampleRejectReasonApi(reasonPayload);
      if (reasonResponse?.success) {
        notify("Reason saved successfully", "success");

      } else {
        notify("Error saving reason", "error");
        return;
      }
    } catch (error) {
      notify("Error saving reason", "error");
      return;
    }

    let payload = {
      rejectReason: data?.rejectreason || data?.newReason,
      testID: String(data?.Test_ID),
      ipAddress: ip,
      currentPageName: "",
    };
    let apiResp = await RejectDepartmentDataLab(payload);
    if (apiResp?.success) {
      //   BindSampleDetail(data);
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      handleSearchSampleCollection();
      notify(apiResp?.message, "success");
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };

  const handleClickReject = (item) => {
    setHandleModelData({
      label: t("Reject Sample"),
      buttonName: t("Reject"),
      width: "30vw",
      isOpen: true,
      Component: (
        <SampleCollectionRejectModel
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: RejectSampleCollection,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleItemSearch = (e) => {
    setSearchFilter(e?.target?.value);
    if (e?.target?.value === "") {
      setTbodyPatientDetail(bckupTbodyPatientDetail);
      return;
    }
    const results = bckupTbodyPatientDetail?.filter((obj) =>
      Object.values(obj)?.some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(e?.target?.value.toLowerCase())
      )
    );
    setTbodyPatientDetail(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSampleCollection();
    }
  };


  useEffect(() => {
    if (UHIDipd && pDate) {
      handleSearchSampleCollection(true, UHIDipd,pDate)
      setValues((val) => ({ ...val, BarcodeNo: UHIDipd , fromDate:  new Date(pDate) }))
    }
  }, [UHIDipd ,pDate])

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      <div className=" spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="BarcodeNo"
            placeholder=" "
            name="BarcodeNo"
            value={values?.BarcodeNo || ""}
            onChange={handleChange}
            lable={t("Barcode No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={handleKeyDown}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="UHID"
            name="UHID"
            value={values?.UHID || ""}
            onChange={handleChange}
            lable={t("UHID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={handleKeyDown}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                departmentData,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />



          {/* <ReactSelect
            placeholderName={t("Status")}
            id="status"
            searchable={true}
            respclass="col-xl-1 col-md-4 col-sm-4 col-12"
            dynamicOptions={statusType}
            handleChange={(selected) => handleSelect("status", selected)}
            value={values?.status}
            name="status"
          /> */}
          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            lable={t("fromDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
            maxDate={new Date()}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
            maxDate={new Date()}
          />

          <ReactSelect
            placeholderName={t("status")}
            id={"status"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-1 col-md-4 col-sm-4 col-12"
            dynamicOptions={statusType}
            handleChange={handleSelect}
            value={`${values?.status?.value}`}
            name={"status"}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        <Heading
          title=""
          isBreadcrumb={false}
          secondTitle={
            <>
              <Input
                type="text"
                className="table-input my-1"
                respclass={"width-250 px-1"}
                removeFormGroupClass={true}
                placeholder={t("Search")}
                onChange={handleItemSearch}
              // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
              />
              {/* <ColorCodingSearch label={t("Pending")} color="#CC99FF" /> */}
              {/* <ColorCodingSearch label={t("Not Collected")} color="#44A3AA" /> */}
              <ColorCodingSearch label={t("Not Collected")} color="#CC99FF" />
              <ColorCodingSearch label={t("Received")} color="bisque" />
              <ColorCodingSearch label={t("Reject")} color="#FF0000" />
            </>
          }
        />

        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                isChecked: (
                  <input
                  type="checkbox"
                  checked={val.isChecked}
                  onChange={(e) => handleChangeCheckbox(val, index)}
                  disabled={val?.IsSampleCollected === "Y"}
                  // disabled={values?.status?.value === "Y" || values?.status?.value === "R" || 
                  //   val?.IsSampleCollected === "N"}
                  />
                ),
                sno: index + 1,
                Test_ID: val.Test_ID,
                CTBNo: val.CTBNo,
                PatientName: (
                  <div className={val?.MLC === 1 ? "blink-red" : ""}>
                    {val?.PatientName}
                  </div>
                ),
                // BookingCenter: val.BookingCenter || "",
                Type: val.PatientType || "",
                BarCodeNo: val.BarcodeNo || "",
                UHID: val.PatientID || "",
                AgeGender: val.Age || "",
                ReqDateWithdrawDateDeviation: `${val.Samplerequestdate || ""} ${val.Acutalwithdrawdate || ""} ${val.DevationTime || ""}`,
                TestName: val.TestName || "",
                Reject: (
                  <span
                    className={val?.IsSampleCollected === "N" ? "disable-reject" : ""}
                    onClick={() => {
                      if (val?.IsSampleCollected === "N") return
                      handleClickReject(val);
                    }}
                  >
                    <CancelSVG />
                  </span>
                ),

                
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
              getRowClass={getRowClass}
            />
            <div className="col-sm-12 d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleRecieve}
              >
                {t("Receive")}
              </button>
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleTransfer}
              >
                {t("Transfer Sample")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DepartmentReceive;