import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../formComponent/ReactSelect'
import Tables from '../UI/customTable'
import { BindSampleType, SampleCollUploadDocument, SaveSamplecollectionAPI, SearchInvestigation, SearchInvestigationWard, SearchSampleCollection } from '../../networkServices/nursingWardAPI'
import { notify, removeBase64Data } from '../../utils/utils'
import Modal from '../modalComponent/Modal'
import SampleCollectionUploadDocModel from '../modalComponent/Utils/SampleCollectionUploadDocModel'
import CustomSelect from '../formComponent/CustomSelect'
import Input from '../formComponent/Input'
import SampleCollectionTable from "../UI/customTable/NursingWard/SampleCollectionTable"

export default function SampleCollection({ data }) {
    let [t] = useTranslation()
    const [tbodyPatientDetail, setTbodyPatientDetail] = useState([])
    const [tbodySampleDetail, setBodySampleDetail] = useState([])
    const [bckTbodyPatientDetail, setBckTbodyPatientDetail] = useState([])
    const [values, setValues] = useState({
        SampleStatus: { "label": "Sample Not collected", "value": "N" }
    });
    const [collectPayload, setCollectPayload] = useState({})
    const sampleStatus = [
        { label: "Sample Not collected", value: "N" },
        { label: "Collected", value: "S" },
        { label: "Received", value: "Y" },
        { label: "Rejected", value: "R" }
    ]

    const handleChangeCheckbox = (e, ele) => {
        let data = tbodySampleDetail.map((val) => {
            if (val?.TestID === ele?.TestID) {
                val.isChecked = e?.target?.checked
            }
            return val
        })
        setBodySampleDetail(data)
    }
    const handleChangeCheckboxHeader = (e) => {
        let data = tbodySampleDetail?.map((val) => {
            val.isChecked = e?.target?.checked
            return val
        })
        setBodySampleDetail(data)
    }
    const isMobile = window.innerWidth <= 800;
    const theadPatientDetail = [
        { width: "1%", name: t("SNO") },
        t("DOC"),
        t("PatientName")
    ]
    const theadSampleDetail = [
        { width: "1%", name: t("SNO") },
        { width: "1%", name: !isMobile ? <input type="checkbox" style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> : t("NursingWard.NurseAssignment.check") },
        { width: "10%", name: t("SampleType") },
        { width: "20%", name: t("AnatomicTypes") },
        // t("PatientName"),
        t("Investigation"),
        t("BarcodeNo"),
        t("SCWithdrawReqDate"),
        t("SCActualWithdrawDate"),
        t("DevationTime"),
        t("VialColor"),
        "#",
        // t("RePrint"),
        // t("Reject"),
    ]
    
    const [sampleCollectionData, setSampleCollectionData] = useState({ search: [] });
    const [modalData, setModalData] = useState({});
    const [investigationDetail, setInvestigationDetail] = useState({ isCollect: false });
    const [handleModelData, setHandleModelData] = useState({});
    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const BindSampleDetail = async (value) => {
        debugger
        let apiResp = await SearchInvestigationWard(value?.LedgerTransactionNo)
        if (apiResp?.success) {
            let collected = false
            // let respData = apiResp?.data?.map((val) => {
            //     if (val?.IsSampleCollected === "N") {
            //         collected = true
            //     }
            //     val.isChecked = false
            //     val.SampleTypesSelect = { label: val?.SampleID?.split("^")[1], value: val?.SampleID?.split("^")[0] }
            //     val.doctorlistSelect = { label: "", value: "" }
            //     return val
            // })
            // setInvestigationDetail((val) => ({ ...val, isCollect: collected, detail: value }))
            // // setIsCollect(collected)
            // setBodySampleDetail(respData)


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
            notify(apiResp?.message, "error")
        }

    }

    

    const searchSampleCollection = async (data) => {
        let apiResp = await SearchSampleCollection(data)
        if (apiResp?.success) {
            setSampleCollectionData((val) => ({ ...val, search: apiResp?.data }))
            let tbodyData = []
            apiResp?.data?.map((val, i) => {
                let obj = {}
                obj.index = i + 1
                obj.doc = <i className="fa fa-file" onClick={(e) => {
                    e.stopPropagation();
                     handleOpenDocument(val, i)
                     }}></i>
                obj.pname = <span 
                //  onClick={() => { BindSampleDetail(val) }}
                 >{val?.PName}</span>

                tbodyData.push(obj);
            })
            setTbodyPatientDetail(tbodyData)
            setBckTbodyPatientDetail(apiResp?.data)
        } else {
            setSampleCollectionData((val) => ({ ...val, search: [] }))
            setTbodyPatientDetail([])
            notify(apiResp?.message, "error")
        }
    }
    console.log(tbodyPatientDetail,"tbodyPatientDetail")
    const handleRowClick = (val,ind,i)=> {
       debugger
       console.log(bckTbodyPatientDetail)
        BindSampleDetail(bckTbodyPatientDetail[ind])
        
    }

    useEffect(() => {
        searchSampleCollection([data?.transactionID, "N"])
    }, [])

    const handleReactSelect = (label, value) => {
        setValues((val) => ({ ...val, [label]: value }))
        if (label === "SampleStatus") {
            setBodySampleDetail([])
            searchSampleCollection([data?.transactionID, value?.value])
        }
    }



    const handleCustomSelect = (index, name, value) => {
        const data = [...tbodySampleDetail];
        data[index][name] = value;
        setBodySampleDetail(data);
    };




    const handleChangeModel = (inputData) => {
        setModalData(inputData)
    }

    const saveDocument = async (data) => {
        let payload = {
            "ledgerTransactionNo": String(data?.transactionID),
            "documentName": String(data?.DocumentType ? data?.DocumentType : ""),
            "patientID": String(data?.patientID),
            "file": removeBase64Data(data?.document)
        }
        let apiResp = await SampleCollUploadDocument(payload)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            setIsOpen()
        } else {
            notify(apiResp?.message, "error")
        }
    }

    const handleOpenDocument = (value, index) => {
        setHandleModelData({
            label: t("AddFile"),
            buttonName: t("upload"),
            width: "40vw",
            isOpen: true,
            Component: <SampleCollectionUploadDocModel inputData={data} handleChangeModel={handleChangeModel} />,
            handleInsertAPI: saveDocument,
            extrabutton: <></>,
        })

    }

//     const saveSampleCollection = async () => {
// debugger
//         // let payloadOBJList = []
//         // let payload = []
//         // tbodySampleDetail?.map((val) => {
//         //     if (val?.isChecked) {
//         //         let obj = {
//         //             TestID: val?.TestID,
//         //             sampleTypeID: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[0] : val?.SampleTypesSelect?.value,
//         //             sampleType: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[1] : val?.SampleTypesSelect?.label,
//         //             HistoDoctorId: (val?.reporttype === "7") ? val?.doctorlistSelect?.value : "",
//         //             // barcodeNuber:(val?.PrePrintedBarcode === 1)?sinNumberRequiredFileld:BarcodeNo
//         //             BarcodeNo: (val?.PrePrintedBarcode === 1) ? val?.sinNumber : val?.BarcodeNo,
//         //             PerformingTestCentre: val?.PerformingTestCentre,
//         //             hinstoCYTOsampleDetail: (val?.reporttype === "7") ? `${val?.Numberofcontainer?.value ^ val?.NumberofSlides?.value ^ val?.NumberofBlock?.value}` : "",
//         //             histoCatoStatus: (val?.reporttype === "7") ? "Assigned" : "",
//         //             sampleCollectionDate: (val?.PrePrintedBarcode === 1 && val?.BarcodeNo !== "") ? val?.Acutalwithdrawdate : "",
//         //             AnatomicID: "0",
//         //             AnatomicType: "",
//         //             textDiagonostic: ""
//         //         }
//         //         payloadOBJList.push(obj);
//         //         payload.push(Object.values(obj).join("#"))
//         //     }
//         // })
//         // const testing=tbodySampleDetail?.some((val)=>val?.SampleTypesSelect?.value)
//         // if(tbodySampleDetail)
// let payloadOBJList = []
//     let payload = []
//     tbodySampleDetail?.map((val) => {
//       if (val?.isChecked) {
//         let obj = {
//           TestID: val?.TestID,
//           sampleTypeID: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[0] : val?.SampleTypesSelect?.value,
//           sampleType: (val?.reporttype === "7") ? val?.SampleID?.split("|")[0]?.split("^")[1] : val?.SampleTypesSelect?.label,
//           HistoDoctorId: (val?.reporttype === "7") ? val?.doctorlistSelect?.value : "",
//           // barcodeNuber:(val?.PrePrintedBarcode === 1)?sinNumberRequiredFileld:BarcodeNo
//           BarcodeNo: (val?.PrePrintedBarcode === 1) ? val?.sinNumber : val?.BarcodeNo,
//           PerformingTestCentre: val?.PerformingTestCentre,
//           hinstoCYTOsampleDetail: (val?.reporttype === "7") ? `${val?.Numberofcontainer?.value ^ val?.NumberofSlides?.value ^ val?.NumberofBlock?.value}` : "",
//           histoCatoStatus: (val?.reporttype === "7") ? "Assigned" : "",
//           sampleCollectionDate: (val?.PrePrintedBarcode === 1 && val?.BarcodeNo !== "") ? val?.Acutalwithdrawdate : "",
//           AnatomicID: val?.AnatomicTypesSelect?.value ? "0" : "",
//           AnatomicType: val?.AnatomicTypesSelect?.label ? val?.AnatomicTypesSelect?.label : "",
//           textDiagonostic: "",
//           // Diagnosis: ""
//           colorcode: val.colorcode
//         }
//         payloadOBJList.push(obj);
//         payload.push(Object.values(obj).join("#"))
//       }
//     })
//      if (payload?.length > 0) {
//         let apiResp = await SaveSamplecollectionAPI(payload)
//         if (apiResp?.success) {
//             console.log("investigationDetail?.detail")
//             if (investigationDetail?.detail) {
//                 await BindSampleDetail(investigationDetail?.detail)
//             }
//             notify(apiResp?.message, "success");
//         } else {
//             notify(apiResp?.message, "error");
//         }
//          } else {
//               notify("Please Select Test", "error")
//             }
//     }

const saveSampleCollection = async () => {
    debugger
  let payloadOBJList = []
  let payload = []

  tbodySampleDetail?.map((val) => {
    if (val?.isChecked) {
      // derive sampleTypeID and sampleType
      let sampleTypeID = (val?.reporttype === "7") 
        ? val?.SampleID?.split("|")[0]?.split("^")[0] 
        : val?.SampleTypesSelect?.value

      let sampleType = (val?.reporttype === "7") 
        ? val?.SampleID?.split("|")[0]?.split("^")[1] 
        : val?.SampleTypesSelect?.label
let anatomicType = val?.AnatomicTypesSelect?.value;
      // ✅ validation for required fields
      console.log("sampleType",sampleType)
      console.log("sampleTypeID",sampleTypeID)
      if (!sampleTypeID  || !sampleType) {
        notify("Sample Type and Sample Type ID are required", "warn")
        return // skip this record
      }

      if (!anatomicType) {
  notify("Anatomic Type is required", "warn");
  return; // skip this record
}
      let obj = {
        TestID: val?.TestID,
        sampleTypeID,
        sampleType,
        HistoDoctorId: (val?.reporttype === "7") ? val?.doctorlistSelect?.value : "",
        BarcodeNo: (val?.PrePrintedBarcode === 1) ? val?.sinNumber : val?.BarcodeNo,
        PerformingTestCentre: val?.PerformingTestCentre,
        hinstoCYTOsampleDetail: (val?.reporttype === "7") 
          ? `${val?.Numberofcontainer?.value ^ val?.NumberofSlides?.value ^ val?.NumberofBlock?.value}` 
          : "",
        histoCatoStatus: (val?.reporttype === "7") ? "Assigned" : "",
        sampleCollectionDate: (val?.PrePrintedBarcode === 1 && val?.BarcodeNo !== "") 
          ? val?.Acutalwithdrawdate 
          : "",
        AnatomicID: val?.AnatomicTypesSelect?.value ? "0" : "",
        AnatomicType: val?.AnatomicTypesSelect?.label ? val?.AnatomicTypesSelect?.label : "",
        textDiagonostic: "",
        colorcode: val.colorcode
      }

      payloadOBJList.push(obj)
      payload.push(Object.values(obj).join("#"))
    }
  })

  if (payload?.length > 0) {
    let apiResp = await SaveSamplecollectionAPI(payload)
    if (apiResp?.success) {
      if (investigationDetail?.detail) {
        await BindSampleDetail(investigationDetail?.detail)
      }
      notify(apiResp?.message, "success")
    } else {
      notify(apiResp?.message, "error")
    }
  } else {
    // notify("Please Select Test", "error")
  }
}

    return (
        <>

            <div className="mt-2 spatient_registration_card">
                <Heading
                    title={t("Sample Collection")}
                    isBreadcrumb={false}
                    secondTitle={<>
                        <div className="d-flex">
                            <div className="SampleRequestedTime"></div>
                            <label className="text-dark ml-2">{t("SampleRequestedTime")}</label>
                        </div>
                        <div className="d-flex ml-1">
                            <div className="SampleRequestExpired"></div>
                            <label className="text-dark ml-2">{t("SampleRequestExpired")}</label>
                        </div>
                        <div className="d-flex ml-1">
                            <div className="UpcomingRequests"></div>
                            <label className="text-dark ml-2">{t("UpcomingRequests")}</label>
                        </div>
                    </>}
                />
                <div className='card'>
                    <Heading title={t("SearchOption")} />
                    <div className="d-flex justify-content-between">

                    <ReactSelect
                        placeholderName={t("SampleStatus")}
                        id={"SampleStatus"}
                        value={values?.SampleStatus?.value}
                        handleChange={handleReactSelect}
                        searchable={true}
                        name={"SampleStatus"}
                        dynamicOptions={sampleStatus}
                        removeIsClearable={true}
                        respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12 mt-2 "
                    />
                    {investigationDetail?.isCollect ?
                                    <div className='mx-2  my-2 mb-1 d-flex justify-content-end'>
                                        <button className="btn btn-sm btn-success ml-2" type="button" onClick={saveSampleCollection}>
                                            {t("Collect")}
                                        </button>

                                    </div>
                                    : ""}

                                    </div>

                    <div className='d-flex'>
                        {tbodyPatientDetail?.length > 0 ?
                            <div className='w-100 w-md-25'>
                                <Heading title={t("PatientDetail")} secondTitle={t("TotalPatient") + `: ${sampleCollectionData?.search?.length}`} />

                                <Tables
                                    thead={theadPatientDetail}
                                    tbody={tbodyPatientDetail}
                                    tableHeight={"nurse-assignment-table-height"}
                                    getRowClick={handleRowClick}
                                />
                            </div> : ""}

                        <div className='w-100 w-md-75 ml-2'>
                            {tbodySampleDetail?.length > 0 ? <>
                                <Heading title={t("SampleDetail")} secondTitle={t("TotalTest") + `: ${tbodySampleDetail?.length}`} />

                                {tbodySampleDetail?.length > 0 &&
                                    <SampleCollectionTable
                                        thead={theadSampleDetail}
                                        tbody={tbodySampleDetail}
                                        tableHeight={"nurse-assignment-table-height"}
                                        handleCustomSelect={handleCustomSelect}
                                        handleChangeCheckbox={handleChangeCheckbox}
                                        setCollectPayload={setCollectPayload}
                                        collectPayload={collectPayload}
                                        setHandleModelData={setHandleModelData}
                                        setModalData={setModalData}

                                    />
                                }

                                
                            </>
                                : ""}
                        </div>
                    </div>


                </div>

            </div>
            {/* {modelData?.isOpen && (
                <Modal
                    visible={modelData?.isOpen}
                    setVisible={(val) => ({ ...val, isOpen: false })}
                    modalWidth={"40vw"}
                    buttonName={t("upload")}
                    Header={t("AddFile")}
                    buttonType={"submit"}
                    modalData={modelData?.modalData}
                    handleAPI={saveDocument}
                >
                    <SampleCollectionUploadDocModel inputData={data} handleChangeModel={handleChangeModel} />
                </Modal>
            )} */}
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
        </>
    )
}
