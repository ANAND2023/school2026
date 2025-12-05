import React, { useEffect, useState } from 'react'
import Heading from '../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../../components/formComponent/Input';
import ReactSelect from '../../components/formComponent/ReactSelect';
import DatePicker from '../../components/formComponent/DatePicker';
import ColorCodingSearch from '../../components/commonComponents/ColorCodingSearch';
import Modal from '../../components/modalComponent/Modal';
import { useDispatch } from 'react-redux';
import { GetBindAllDoctorConfirmation, GetBindDepartment, getBindPanelList } from '../../store/reducers/common/CommonExportFunction';
import { handleReactSelectDropDownOptions, notify } from '../../utils/utils';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ModSearchSampleCollection, SampleCollectionType } from '../../networkServices/SampleCollectionAPI';
import Tables from '../../components/UI/customTable';
import SlideScreen from '../../components/front-office/SlideScreen';
import SampleCollectionTable from "../../components/UI/customTable/SampleCollection/SampleCollectionTable"
import { GetBarcodeInfo, SaveSamplecollectionAPI, SearchInvestigation } from '../../networkServices/nursingWardAPI';
import { GoStopwatch } from "react-icons/go";
import { date } from 'yup';
export default function SampleCollection({UHIDipd,pDate , renderSlideScreenInPlace = false }) {

  let [t] = useTranslation()
  const { VITE_DATE_FORMAT } = import.meta.env;
  const isMobile = window.innerWidth <= 800;
  const type = [
    { value: "0", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "Emergency" },
  ]
  const SampleCollected = [
    { value: "N", label: "Sample Not Colleted" },
    { value: "S", label: "Collected" },
    { value: "Y", label: "Received" },
    { value: "R", label: "Rejected" },
  ]
  const PatientTypeTest = [
    { value: "All", label: "ALL" },
    { value: "1", label: "Urgent" },
    { value: "0", label: "Normal" },
  ]

  const [values, setValues] = useState({
    BarcodeNo: "", PatientName: "", UHID: "",
    type: { value: "0", label: "ALL" },
    SampleCollected: { value: "N", label: "Sample Not Colleted" },
    Department: { value: "0", label: "ALL" },
    Doctor: { value: "0", label: "ALL" },
    Panel: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    PatientTypeTest: { value: "All", label: "ALL" },
  });
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([])
  const [PatientDetailList, setPatientDetailList] = useState([])
  const [tbodySampleDetail, setBodySampleDetail] = useState([])
  const [visible, setVisible] = useState(false);
  const [collectPayload, setCollectPayload] = useState({})
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [investigationDetail, setInvestigationDetail] = useState({ isCollect: false });
  const [searchFilter, setSearchFilter] = useState("");
  const [bckupTbodyPatientDetail, setBckupTbodyPatientDetail] = useState([]);

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleChangeCheckboxHeader = (e) => {
    let data = tbodySampleDetail?.map((val) => {
      val.isChecked = e?.target?.checked
      return val
    })
    setBodySampleDetail(data)
  }

  const theadPatientDetail = [
    { width: "1%", name: t("SNo") },
    // { width: "1%", name: t(".") },
    t("PatientName"),
    t("BarcodeNo"),
    t("CTBNo/FRTNo"),
    t("Type"),
    t("UHID"),
    t("IPDNo"),
    t("Doctor"),
    t("Item Name"),
    t("BedNo"),
    t("AgeGender"),
    t("BillDate"),

  ]
  const theadSampleDetail = [
    { width: "1%", name: t("SNO") },
    { width: "25%", name: t("SampleType") },
    { width: "25%", name: t("AnatomicTypes") },
    t("Bed"),
    t("UHID"),
    t("PName"),
    t("Investigation"),
    t("BarcodeNo"),
    t("SCWithdrawReqDate"),
    t("SCActualWithdrawDate"),
    t("DevationTime"),
    { width: "2%", name: t("NoOfPrint") },
    { width: "1%", name: !isMobile ? <input type="checkbox" style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> : t("NursingWard.NurseAssignment.check") },

    { width: "3%", name: t("VialColor") },
    { width: "3%", name: "#" },
    { width: "1%", name: t("RePrint") },
    { width: "1%", name: t("Reject") },
    { width: "2%", name: t("Diagnosis") }

  ]

  const dispatch = useDispatch()





  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }))
  }
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
  }


  const { GetDepartmentList, GetBindAllDoctorConfirmationData, getBindPanelListData } = useSelector(
    (state) => state.CommonSlice
  );

  // console.log("getBindPanelListData",getBindPanelListData)

  useEffect(() => {
    dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
    dispatch(GetBindDepartment());
    dispatch(getBindPanelList());
  }, [dispatch]);
//add useEffect
  const handleSearchSampleCollection = async (isNotify=true , pid="",pdate="") => {
    let payload = {
      "sampleCollectedStatus": values?.SampleCollected?.value,
      "type": values?.type?.value,
      "isUrgent": values.PatientTypeTest.value,
      "barcodeNo": pid ? pid :values?.BarcodeNo,
      "patientName": values?.PatientName,
      "patientID": values?.UHID,
      "doctorID": values?.Doctor?.value,
      "departmentID": values?.Department?.value,
      "panelID": values?.Panel?.value,
      "startDate": pdate ?  moment(values?.pdate).format("DD-MMM-YYYY") : moment(values?.fromDate).format("DD-MMM-YYYY"),
      "endDate": moment(values?.toDate).format("DD-MMM-YYYY")
    }


    // [values?.SampleCollected?.value, values?.type?.value,"1", values?.BarcodeNo, values?.PatientName, values?.UHID,values?.Doctor?.value, values?.PatientTypeTest?.value!=="ALL"?values?.PatientTypeTest?.value:"", values?.Department?.value, values?.Panel?.value, moment(values?.fromDate).format("DD-MMM-YYYY"), moment(values?.toDate).format("DD-MMM-YYYY")]
    let apiResp = await ModSearchSampleCollection(payload)
    setPatientDetailList(apiResp?.data)
    if (apiResp?.success) {
      let data = []
      apiResp?.data?.map((val, index) => {
        let obj = {}


        obj.sno = index + 1

        obj.PName = val?.PName
        obj.PatientID = val?.PatientID
        obj.IPDNo = val?.IPDNo
        obj.bed = val?.bed
        obj.Age = val?.Age
        obj.BillDate = val?.BillDate


        // "sampleCollectedStatus": "",
        // "type": "",
        // "isUrgent": "1",
        // "barcodeNo": "",
        // "patientName": "",
        // "patientID": "",
        // "doctorID": "",
        // "departmentID": "",
        // "panelID": "",
        // "startDate": "2024-01-01",
        // "endDate": "2025-01-31"

        data.push(obj)
      })


      setTbodyPatientDetail(apiResp?.data)
      setBckupTbodyPatientDetail(apiResp?.data)

    } else {
     isNotify && notify(apiResp?.message, "error");
      setTbodyPatientDetail([])
      setPatientDetailList([])
      setBckupTbodyPatientDetail([])
    }
  }




  useEffect(() => {
    handleSearchSampleCollection(false);
  }, [values.type, values.SampleCollected, values.PatientTypeTest, values.Department, values.Doctor, values.Panel]);




  const handleChangeCheckbox = (e, ele) => {
    let data = tbodySampleDetail.map((val) => {
      if (val?.TestID === ele?.TestID) {
        val.isChecked = e?.target?.checked
      }
      return val
    })
    setBodySampleDetail(data)
  }
  const handleCustomSelect = async (index, name, value) => {
    const data = [...tbodySampleDetail];
    data[index][name] = value;
    if (name === "SampleTypesSelect") {
      const res = await SampleCollectionType(value?.label)
      if (res?.data) {
        data[index]["colorcode"] = res.data[0].color;
      }
    }

    // data[index][name] = value;
    setBodySampleDetail(data);
  };
  console.log(tbodySampleDetail);

  const BindSampleDetail = async (value, index = value?.sno - 1) => {
    setVisible(true)
    let TID = value?.LedgerTransactionNo ? value?.LedgerTransactionNo : PatientDetailList[index]?.LedgerTransactionNo
    let apiResp = await SearchInvestigation(TID)
    if (apiResp?.success) {
      let collected = false
      let respData = apiResp?.data?.map((val) => {
        if (val?.IsSampleCollected === "N") {
          collected = true
        }
        val.isChecked = false
        val.SampleTypesSelect = { label: val?.SampleID?.split("^")[1], value: val?.SampleID?.split("^")[0] }
        val.AnatomicTypesSelect = { label: "", value: val?.AnatomicId ? val?.AnatomicId : "0" }
        val.doctorlistSelect = { label: "", value: "0" }
        return val
      })
      setInvestigationDetail((val) => ({ ...val, isCollect: collected, detail: value }))
      setBodySampleDetail(respData)
    } else {
      setBodySampleDetail([])
      setVisible(false)
      !visible && notify(apiResp?.message, "error")
    }

  }
  console.log(tbodySampleDetail, "tbodySampleDetail");
  const checkedItems = tbodySampleDetail?.filter(
    (val, i) => val?.isChecked === true && parseInt(val?.[`NoOfPrint${i}`]) > 0
  );

  console.log(checkedItems, "checkedItems");
  const handleClickRePrint = async () => {
    debugger
    // const printCount = parseInt(tbodyPatientDetail[`NoOfPrint${index}`] || 1);
    // const testIdsToSend = [];

    // for (let i = 0; i < printCount; i++) {
    //   const item = tbody[index + i];
    //   if (item) {
    //     testIdsToSend.push(item.Test_ID);
    //   }
    // } 

    // checkedItems?.forEach((item) => {
    //   const payload = {
    //   barcodeNo: data.BarcodeNo,
    //   nofprint: checkedItems?.toString(),
    //   testID: testIdsToSend?.toString(),
    // };
    // try {
    //   const resp = await GetBarcodeInfo(payload);

    //   if (resp?.success === true) {
    //     const urls = Array?.isArray(resp?.data) ? resp?.data : [resp?.data];

    //     urls.forEach((url) => {
    //       if (typeof url === "string" && url?.trim()) {
    //         window.open(url, "_blank");
    //       }
    //     });
    //   } else {
    //     notify(resp?.message || "Failed to print", "warn");
    //   }
    // } catch (err) {
    //   console.error("Error while printing:", err);
    //   notify(err?.message, "error");
    // }

    // })
    try {
      for (const item of checkedItems) {
        // find the patient detail by index or ID
        const detail = tbodySampleDetail.find(d => d?.Test_ID === item?.Test_ID);

        if (!detail) continue; // skip if not found

        const payload = {
          barcodeNo: detail?.BarcodeNo,
          nofprint: detail?.NoOfPrint || 1,
          testID: detail?.Test_ID,
        };

        const resp = await GetBarcodeInfo(payload);

        if (resp?.success === true) {
          const urls = Array.isArray(resp?.data) ? resp?.data : [resp?.data];

          urls.forEach((url) => {
            if (typeof url === "string" && url.trim()) {
              window.open(url, "_blank");
            }
          });
        } else {
          notify(resp?.message || "Failed to print", "warn");
        }
      }
    } catch (err) {
      console.error("Error while printing:", err);
      notify(err?.message, "error");
    }

  };
  const saveSampleCollection = async () => {

    let payloadOBJList = []
    let payload = []
    tbodySampleDetail?.map((val) => {
      if (val?.isChecked) {
        let obj = {
          TestID: val?.TestID,
          sampleTypeID: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[0] : val?.SampleTypesSelect?.value,
          sampleType: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[1] : val?.SampleTypesSelect?.label,
          HistoDoctorId: (val?.reporttype === "7") ? val?.doctorlistSelect?.value : "",
          // barcodeNuber:(val?.PrePrintedBarcode === 1)?sinNumberRequiredFileld:BarcodeNo
          BarcodeNo: (val?.PrePrintedBarcode === 1) ? val?.sinNumber : val?.BarcodeNo,
          PerformingTestCentre: val?.PerformingTestCentre,
          hinstoCYTOsampleDetail: (val?.reporttype === "7") ? `${val?.Numberofcontainer?.value ^ val?.NumberofSlides?.value ^ val?.NumberofBlock?.value}` : "",
          histoCatoStatus: (val?.reporttype === "7") ? "Assigned" : "",
          sampleCollectionDate: (val?.PrePrintedBarcode === 1 && val?.BarcodeNo !== "") ? val?.Acutalwithdrawdate : "",
          AnatomicID: val?.AnatomicTypesSelect?.value ? "0" : "",
          AnatomicType: val?.AnatomicTypesSelect?.label ? val?.AnatomicTypesSelect?.label : "",
          textDiagonostic: "",
          // Diagnosis: ""
          colorcode: val.colorcode
        }
        payloadOBJList.push(obj);
        payload.push(Object.values(obj).join("#"))
      }
    })
    if (payload?.length > 0) {


      let apiResp = await SaveSamplecollectionAPI(payload)
      if (apiResp?.success) {
        if (investigationDetail?.detail) {
          await BindSampleDetail(investigationDetail?.detail)
        }
        handleClickRePrint()
        notify(apiResp?.message, "success");

      } else {
        // notify(apiResp?.message, "error");
      }
    } else {
      notify("Please Select Test", "error")
    }
  }



  const getRowClass = (val, index) => {

    let status = tbodyPatientDetail[index]

    // if (status?.rowcolour === "#CC99FF") {
    //   return "OPDROWCOLOR";
    // }
    // if (status?.rowcolour === "bisque") {
    //   return "IPDROWCOLOR";
    // }
    // if (status?.rowcolour === "#FF0000") {
    //   return "EMERGENCYROWCOLOR";
    // }



  }

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
      <div className=" spatient_registration_card card">
        {/* <form className="card patient_registration"> */}
        <Heading
          title={t("heading")}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

          <ReactSelect
            placeholderName={t("type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={type}
            handleChange={handleSelect}
            value={`${values?.type?.value}`}
            name={"type"}
          />

          <Input
            type="text"
            className="form-control"
            id="PatientName"
            name="PatientName"
            value={values?.PatientName ? values?.PatientName : ""}
            onChange={handleChange}
            lable={t("PatientName")}
            placeholder=" "

            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
          onKeyDown={handleKeyDown}
          />
          <Input
            type="text"
            className="form-control"
            id="BarcodeNo"
            name="BarcodeNo"
            lable={t("BarcodeNo")}
            placeholder=" "
            value={values?.BarcodeNo ? values?.BarcodeNo : ""}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
          onKeyDown={handleKeyDown}
          />
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            lable={t("UHID")}
            placeholder=" "
            value={values?.UHID ? values?.UHID : ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
          />
          <ReactSelect
            placeholderName={t("SampleCollected")}
            id={"SampleCollected"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={SampleCollected}
            handleChange={handleSelect}
            value={`${values?.SampleCollected?.value}`}
            name={"SampleCollected"}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"Department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(GetDepartmentList, "Name", "ID")]}
            handleChange={handleSelect}
            value={`${values?.Department?.value}`}
            name={"Department"}
          />
          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(GetBindAllDoctorConfirmationData, "Name", "DoctorID")]}
            name={"Doctor"}
            handleChange={handleSelect}
            value={`${values?.Doctor?.value}`}
          />

          <ReactSelect
            placeholderName={t("Panel")}
            id={"Panel"}
            removeIsClearable={true}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(getBindPanelListData, "Company_Name", "PanelID")]}
            name={"Panel"}
            handleChange={handleSelect}
            value={`${values?.Panel?.value}`}
          />
          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            lable={t("FromDate")}
            value={values?.fromDate ? values?.fromDate : new Date()}
            handleChange={handleChange}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            value={values?.toDate ? values?.toDate : new Date()}
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
          />
          <ReactSelect
            placeholderName={t("PatientTypeTest")}
            id={"PatientTypeTest"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={PatientTypeTest}
            removeIsClearable={true}
            handleChange={handleSelect}
            value={`${values?.PatientTypeTest?.value}`}
            name={"PatientTypeTest"}
          />
          <div className=" col-sm-2 col-xl-2">
            <button className="btn btn-sm btn-success" type="button" onClick={handleSearchSampleCollection}>
              {t("Search")}
            </button>
          </div>
        </div>






        
          <div className='card'>
           
            <Heading
              // title={t("NursingWard.MedicationAdministrationRecord.HeadingName")}
              title={t("PatientDetail")}
              isBreadcrumb={false}
              secondTitle={<>
                <Input
                  type="text"
                  className="table-input my-1"
                  respclass={"width-250 px-1"}
                  removeFormGroupClass={true}
                  placeholder={t("Search")}
                  onChange={handleItemSearch}
                // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
                />
                <p className="text-bold mb-0 px-1">
                  {/* {tbodyPatientDetail?.length ? tbodyPatientDetail?.length : 0} */}
                  {t("TotalPatient") + `: ${tbodyPatientDetail?.length}`}
                </p>
                <ColorCodingSearch label={t("Red Blink Is MLC")}
                  color="#af0c14ff"
                />
                {/* <ColorCodingSearch label={t("OPD")} color="#CC99FF" /> */}
                {/* <ColorCodingSearch label={t("IPD")} color="bisque" /> */}
                {/* <ColorCodingSearch label={t("Emergency")} color="#FF0000" /> */}
                {/* <ColorCodingSearch label={t("SampleRequestedTime")} color="#a2b4da" />
            <ColorCodingSearch label={t("Sample Request Expired")} color="#daa2da" />
            <ColorCodingSearch label={t("Upcoming Requests Next15mins")} color="#d38d8d" />   */}
              </>}
            />
             {tbodyPatientDetail?.length > 0 ?<>
            {console.log(tbodyPatientDetail, "the tbodydetails")}
            <Tables
              // scrollView="scrollView"
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno:
                  <div>
                    {index + 1}
                    {val?.IsUrgent == "1" ? (
                      <span style={{ color: "red", marginLeft: "5px" }}>
                        <GoStopwatch />
                      </span>
                    ) : (
                      ""
                    )}
                  </div>,
                PName: (
                  <div className={val?.MLC === 1 ? "blink-red" : ""}>
                    {val?.PName}
                  </div>
                ),
                BarcodeNo: val?.BarcodeNo,
                CTBNo: val?.CTBNo,
                Type: val?.Type,
                PatientID: val?.PatientID,
                IPDNo: val?.IPDNo,
                Doctor: val?.DoctorName,
                ItemName: <p style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word"
                }}>{val?.ItemName}</p>,
                bed: val?.bed,
                Age: val?.Age,
                BillDate: val?.BillDate,
              }))}
              style={{ height: "55vh", padding: '2px' }}
              tableHeight={"scrollView"}
              getRowClick={BindSampleDetail}
              getRowClass={getRowClass}
            /> </> : ""}
          </div> 
      </div>

      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
        }}
        Header={
    <div className='d-flex justify-content-between align-items-center w-100'>
    <h1>{t("SampleDetail")}</h1>
    <strong className='px-2'>{t("TotalTest") + `: ${tbodySampleDetail?.length}`}</strong>
  </div>
  }

        usePortal={!renderSlideScreenInPlace}
      >
        <div className='card'>
          {tbodySampleDetail?.length > 0 ? <>

            <SampleCollectionTable
              thead={theadSampleDetail}
              tbody={tbodySampleDetail}
              setTbody={setBodySampleDetail}
              // tableHeight={"nurse-assignment-table-height"}
              handleCustomSelect={handleCustomSelect}
              handleChangeCheckbox={handleChangeCheckbox}
              setCollectPayload={setCollectPayload}
              collectPayload={collectPayload}
              setHandleModelData={setHandleModelData}
              setModalData={setModalData}
              BindSampleDetail={BindSampleDetail}

            />

            {investigationDetail?.isCollect ?
              <div className='mx-2 my-2 d-flex justify-content-end'>
                <button className="btn btn-sm btn-success ml-2" type="button" onClick={saveSampleCollection}>
                  {t("Collect")}
                </button>
              </div>
              : ""}
          </>
            : ""}
        </div>
      </SlideScreen>


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


      {/* {openPageModal.isShow && (
        <Modal
          visible={openPageModal.isShow}
          Header={openPageModal.Header}
          modalWidth={openPageModal.size}
          modalData={openPageModal.modalData}
          handleAPI={openPageModal.handleAPI}
          buttonName={openPageModal.buttonName}
          setVisible={() => setOpenPageModal(false)}
        >
          {openPageModal.component}
        </Modal>
      )} */}

    </>
  )
}
