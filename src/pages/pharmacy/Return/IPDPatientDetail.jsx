import React, { useEffect, useState } from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import IndentModal from './IndentModal'
import { PharmacyGetIndentCount, PharmacyReturnIndentRequest } from '../../../networkServices/pharmecy'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'

export default function IPDPatientDetail({ patientDetail, values, handleReactSelectItem, handleGetItem, setHandleModelData, handleModelData, modalData, setModalData, setBodyData, setIsOpen,handleCalculation 
    ,setSelectedIndents
}) {
    const patientData = patientDetail[0]
    const [t] = useTranslation()
    const [newBodyData, setNewBodyData] = useState([])
    const [indentNo, setIndentNo] = useState(0)
    // const [selectedIndents, setSelectedIndents] = useState([])
    const userData = useLocalStorage("userData", "get")


    const getIndentCount = async () => {
        try {
            const res = await PharmacyGetIndentCount(patientData?.TransactionID)
            if (res?.success) {
                setIndentNo(res?.data)
            }
            else {
                setIndentNo(0)
            }

        } catch (error) {
            console.log(error)
        }
    }
    console.log("modalDatamodalData", modalData)

    const handlePharmacyReturnIndentRequest = async (data) => {
        debugger
    //     const result = data.flatMap(item =>
    //     item.StockList
    //       .filter(stock => Number(stock.retQty) > 0)
    //   );
        try {
            let payload = {
                "transactionID": patientData?.TransactionID,
                "itemDetails": data?.map(item => {
                    debugger
                    return {
                        id: item?.ID,
                        itemID: item?.itemID,
                        stockID: item?.stockID,
                        billNo: item?.billNo,
                        returnQuantity: item?.retQty,
                        rejectQuantity: 0
                    }
                }),
                // "itemDetails": [
                //     {
                //         "id": 33,
                //         "returnQuantity": 1,
                //         "rejectQuantity": 0
                //     }
                // ],
                "deptLedgerNo": userData?.deptLedgerNo
            }
            const res = await PharmacyReturnIndentRequest(payload)
            if (res?.success) {

                const Indents = data?.map(item => item?.IndentNo)
                setSelectedIndents(Indents)
                setBodyData((prev) => {
                    const resData = [...res?.data]
                    handleCalculation(resData)
                    return resData
                })
                setIsOpen()
                
            }


        } catch (error) {

        }
    }



    useEffect(() => {
        getIndentCount()
    }, [patientData?.TransactionID])
    console.log(newBodyData, "newBodyDatanewBodyData")

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Patient Detail"} />
                    <div className="row p-2">
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("IPD No.")}
                                value={patientData?.IPNo}
                            />
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2">
                            <LabeledInput
                                label={t("UHID")}
                                value={patientData?.PatientID}
                            />
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2">
                            <LabeledInput
                                label={t("Pannel Name")}
                                value={patientData?.PanelName}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Patient Name")}
                                value={patientData?.PName}
                            />
                        </div>


                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Room No.")}
                                value={patientData?.RoomNo}
                            />
                        </div>


                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Doctor Name")}
                                value={patientData?.DoctorName}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Admission Date")}
                                value={patientData?.AdmissionDate}
                            />
                        </div>
                        {/* <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Bill No")}
                                value={patientData?.BillNo}
                            />
                        </div> */}
                        {/* <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Reciept No")}
                                value={patientData?.RecieptNo}
                            />
                        </div> */}
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Payment Mode")}
                                value={patientData?.IsPaymentModeCash ===1 ? "Cash" : "Credit"}
                            />
                        </div>
                        {/* <ReactSelect
                            placeholderName={t("item")}
                            id={"item"}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.item}
                            name={"item"}
                            dynamicOptions={handleReactSelectDropDownOptions(patientDetail, "ItemName", "ItemID")}
                            handleChange={handleReactSelectItem}
                            removeIsClearable={true}

                        />

                        <div className="col-xl-1 col-md-1 col-sm-1 col-1">
                            <button className="btn btn-sm btn-success" type='button'
                                onClick={handleGetItem}
                            >{t("Get Item")}</button>
                        </div> */}
                        <div className="col-xl-1 col-md-1 col-sm-1 col-1">
                            <button className={`btn btn-sm btn-success ${values?.type?.value !== "2"? "disable-reject" : ""}`} type='button'
                                onClick={() => {

                                    if( values?.type?.value !== "2"){
                                        return;
                                    }

                                    setHandleModelData({
                                        label: t("Medicine Prescribed"),
                                        buttonName: t("Add Items"),
                                        width: "80vw",
                                        isOpen: true,
                                        modalData: newBodyData,
                                        Component: (<IndentModal
                                            patientData={patientData}
                                            setModalData={setModalData}
                                            modalData={modalData}
                                            setNewBodyData={setNewBodyData}
                                            setHandleModelData={setHandleModelData}
                                        />),
                                        handleInsertAPI: handlePharmacyReturnIndentRequest,
                                    });
                                }}
                            >
                                <span className=' mr-1 bg-red px-2 rounded-circle'>{indentNo} </span>
                                {t(`Indents`)}</button>
                        </div>


                    </div>
                </div>
            </div >
        </>
    )
}
