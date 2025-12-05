import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import { PharmacyBindIndentDetails, PharmacyIPDReturnItemAPI, PharmacyOPDReturnSearch, PharmacySearchIPDReturn, SaveIPDReurnAPI, SaveReurnAPI } from '../../../networkServices/pharmecy'
import { calculateBillAmount, handleCalculatePatientReturn, notify } from '../../../utils/utils'
import PatientDetail from './PatientDetail'
import PatientReturnTable from './PatientReturnTable'
import { useLocation } from 'react-router-dom'
import { PAYMENT_OBJECT } from '../../../utils/constant'
import { BindDisApprovalList, bindHashCode, GetDiscReasonList, GetEligiableDiscountPercent } from '../../../networkServices/opdserviceAPI'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import PaymentGateway from '../../../components/front-office/PaymentGateway'
import { useSelector } from 'react-redux'
import { ReturnIPDPayload, ReturnPayload } from '../../../utils/ustil2'
import PatientListTable from './PatientListTable'
import IPDPatientDetail from './IPDPatientDetail'
import { CommonReceiptPdf } from '../../../networkServices/BillingsApi'
import { RedirectURL } from '../../../networkServices/PDFURL'
import Modal from '../../../components/modalComponent/Modal'

export default function OpdReturn() {
    const intialValue = {
        SearchType: { label: "OPD/EMG Billing", value: "1" },
        type: { label: "", value: "2" },
        mode: { label: "Credit", value: "0" },
        item: "",
        SearchBy: "",
    }
    const [values, setValues] = useState(intialValue)
    const [bodyData, setBodyData] = useState([])
    console.log("bodyDatabodyData", bodyData)
    const [patientDetail, setPatientDetail] = useState({})
    const [patientList, setPatientList] = useState([])
    const [handleModelData, setHandleModelData] = useState({});
    const [modalData, setModalData] = useState([]);
    const [isDisable, setIsDisable] = useState(false) // [isable]
    const [selectedIndents, setSelectedIndents] = useState([])
    const userData = useLocalStorage("userData", "get")
    const [t] = useTranslation()
    const { BindResource } = useSelector((state) => state.CommonSlice);
    const handleChange = (e) => {

        // if(e?.target?.name==="SearchBy"){

        // }
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };
    const handleReactSelect = async (name, value) => {

        if (name == "type") {
            setValues((preV) => ({ ...preV, SearchBy: "" }))
        }
        setValues((val) => ({ ...val, [name]: value }))
        setBodyData([])
        setPatientDetail({})
        setPatientList([])
        setPaymentControlModeState(PAYMENT_OBJECT);
        setPaymentMethod([]);
    }
    const handleReactSelectItem = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    console.log(patientDetail, "patientDetail")

    const handleGetItem = () => {
        const newBodyData = patientDetail?.filter((val) => {
            debugger
            return val?.ItemID === (values?.item?.value ? values?.item?.value : values?.item)
        })
        setBodyData(newBodyData)
    }
    console.log(bodyData, "bodyDatabodyData")
    const handleSearch = async () => {
        if (values?.SearchType?.value === "1") {
            if (!values?.ReceiptNo && !values?.BillNo && !values?.EmergencyNo && !values?.IPDNo) {
                notify(t("Please Enter At least One Field Value"), "error")
                return 0
            }
            debugger
            let paylaod =
            {
                "emergencyNo": String(values?.EmergencyNo ? values?.EmergencyNo : ""),
                "receiptNo": String(values?.ReceiptNo ? values?.ReceiptNo : ""),
                "billNo": String(values?.BillNo ? values?.BillNo : ""),
                "ipdNo": String(values?.IPDNo ? values?.IPDNo : ""),
                "isCash": Number(values?.mode?.value ? values?.mode?.value : "")
            }

            //             {
            //   "emergencyNo": "string",
            //   "receiptNo": "string",
            //   "billNo": "string",
            //   "ipdNo": "string",
            //  "isCash": Number(values?.mode?.value?values?.mode?.value:"")
            // }
            const apiResp = await PharmacyOPDReturnSearch(paylaod)
            if (apiResp?.success) {
                let data = apiResp?.data?.map((val) => {
                    val.returnQty = 0
                    return val
                })
                setBodyData(data)
                setPatientDetail(data[0])
                // setPatientDetail([])
                // setBodyData([])
                setPaymentControlModeState(PAYMENT_OBJECT);
                setPaymentMethod([]);

            } else {
                notify(apiResp?.message, "error")
            }
        } else if (values?.SearchType?.value === "2") {

            // if (!values?.SearchBy) {
            //     notify(t("Please Enter At least One Field Value"), "error")
            //     return 0
            // }
            let paylaod =


            {
                "crNo": values?.type?.value == "2" ? values?.SearchBy : "",
                "pName": values?.PatientName ? values?.PatientName : "",
                "billno": String(values?.type?.value == "1" ? values?.SearchBy : ""),
                "isCash": Number(values?.mode?.value ? values?.mode?.value : "")
            }
            const apiResp = await PharmacySearchIPDReturn(paylaod)
            if (apiResp?.success) {
                setPatientList(apiResp?.data)
                setIsDisable(true)
                setPatientDetail([])
                setBodyData([])
                setPaymentControlModeState(PAYMENT_OBJECT);
                setPaymentMethod([]);
            } else {
                notify(apiResp?.message, "error")
            }
        }
    }



    const handleCustomInput = (index, name, value, type, max) => {
        debugger
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = [...bodyData];
                data[index][name] = value;
                data[index]["panelID"] = data[index]["PanelID"];
                let calculatedAmount = handleCalculatePatientReturn(data[index])
                data[index] = calculatedAmount
                handleCalculateBillAmount(data?.filter((val) => val?.returnQty))

                setBodyData(data);
            } else {
                notify("Please Enter Valid Quantity", "error")
                return false
            }
        }

    };

    const SaveOPDReurn = async () => {
        debugger
        const hashcode = await bindHashCode();
        let payload = ReturnPayload(bodyData, paymentMethod, paymentControlModeState, values, hashcode?.data)
        let apiResp = await SaveReurnAPI(payload)
        if (apiResp?.success) {
            const reportResp = await CommonReceiptPdf({
                ledgerTransactionNo: apiResp?.data?.responseURL?.ledTnxNo,
                isBill: String(apiResp?.data?.responseURL?.isBill),
                receiptNo: "",
                duplicate: "0",
                type: "PHY",
                supplierID: "",
                billNo: apiResp?.data?.isEMGBilling === 1 ? String(apiResp?.data?.emgBillNO) : "",
                isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
                isOnlinePrint: "",
                isRefound: 0,
            });
            if (reportResp?.success) {
                RedirectURL(reportResp?.data?.pdfUrl);
            } else {
                // notify(reportResp?.data?.message, "error");
            }

            notify(apiResp?.message, "success")
            setBodyData([])
            setValues(intialValue)
            setPaymentControlModeState(PAYMENT_OBJECT);
            setPatientDetail({})
            setPaymentMethod([]);
        } else {
            notify(apiResp?.message, "error")
        }
    }

    // const SaveIPDReurn = async () => {
    //     debugger
    //     if (paymentMethod?.length <= 0) {
    //         notify("Please Select Payment Method", "warn")
    //         return
    //     }
    //     const hashcode = await bindHashCode();
    //     let payload = ReturnIPDPayload(bodyData, paymentMethod, paymentControlModeState, values, hashcode?.data)
    //     console.log("payload11", payload)
    //     let apiResp = await SaveIPDReurnAPI(payload)
    //     if (apiResp?.success) {
    //         const reportResp = await CommonReceiptPdf({
    //             ledgerTransactionNo: apiResp?.data?.ledTxnID,
    //             isBill: "0",
    //             receiptNo: "",
    //             duplicate: "0",
    //             type: "PHY",
    //             supplierID: "",
    //             billNo: apiResp?.data?.isEMGBilling === 1 ? String(apiResp?.data?.emgBillNO) : "",
    //             isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
    //             isOnlinePrint: "",
    //             isRefound: 0,
    //         });
    //         if (reportResp?.success) {
    //             RedirectURL(reportResp?.data?.pdfUrl);
    //         } else {
    //             // notify(reportResp?.data?.message, "error");
    //         }

    //         notify(apiResp?.message, "success")
    //         setBodyData([])
    //         setValues(intialValue)
    //         setPaymentControlModeState(PAYMENT_OBJECT);
    //         setPatientDetail({})
    //         setPaymentMethod([]);
    //     } else {
    //         notify(apiResp?.message, "error")
    //     }
    // }




    const SaveIPDReurn = async () => {
        debugger
        if (paymentMethod?.length <= 0) {
            notify("Please Select Payment Method", "warn")
            return
        }
        const hashcode = await bindHashCode();
        let payload = ReturnIPDPayload(bodyData, paymentMethod, paymentControlModeState, values, hashcode?.data)
        console.log("payload11", payload)
        let apiResp = await SaveIPDReurnAPI(payload)

        if (apiResp?.success) {
            for (const val of apiResp?.data || []) {
                const reportResp = await CommonReceiptPdf({
                    ledgerTransactionNo: val?.ledTxnID,
                    isBill: "0",
                    receiptNo: "",
                    duplicate: "0",
                    type: "PHY",
                    supplierID: "",
                    billNo: apiResp?.data?.isEMGBilling === 1 ? String(apiResp?.data?.emgBillNO) : "",
                    isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
                    isOnlinePrint: "",
                    isRefound: 0,
                });

                if (reportResp?.success) {
                    RedirectURL(reportResp?.data?.pdfUrl);
                } else {
                    notify(reportResp?.data?.message, "error");
                }
            }

            notify(apiResp?.message, "success");
            setBodyData([]);
            setValues(intialValue);
            setPaymentControlModeState(PAYMENT_OBJECT);
            setPatientDetail({});
            setPaymentMethod([]);
        } else {
            notify(apiResp?.message, "error");
        }
    }


        // Handle Payment start
        const location = useLocation();
        const [paymentControlModeState, setPaymentControlModeState] = useState(PAYMENT_OBJECT);
        const [paymentMethod, setPaymentMethod] = useState([]);
        const [discounts, setDiscounts] = useState({
            discountApprovalList: [],
            discountReasonList: [],
        });
        const [testAddingTableState, setTestAddingTable] = useState([]);

        const GetDiscListAPI = async () => {
            try {
                const [
                    discountReasonListRes,
                    discountApprovalListRes,
                    eligibleDiscountPercentRes,
                ] = await Promise.all([
                    GetDiscReasonList("OPD"),
                    BindDisApprovalList("HOSPITAL", "1"),
                    GetEligiableDiscountPercent(userData?.employeeID),
                ]);
                const discountReasonList = discountReasonListRes?.data;
                const discountApprovalList = discountApprovalListRes?.data;
                const eligibleDiscountPercent =
                    eligibleDiscountPercentRes?.data?.Eligible_DiscountPercent;

                if (discountReasonList)
                    setDiscounts((val) => ({ ...val, discountReasonList }));
                if (discountApprovalList)
                    setDiscounts((val) => ({ ...val, discountApprovalList }));
                if (eligibleDiscountPercent)
                    setDiscounts((val) => ({
                        ...val,
                        Eligible_DiscountPercent: eligibleDiscountPercent,
                    }));
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error as needed
            }
        };
        useEffect(() => {
            GetDiscListAPI();
        }, []);

        const handlePaymentGateWay = (details) => {
            debugger
            const {
                panelID,
                billAmount,
                discountAmount,
                isReceipt,
                patientAdvanceAmount,
                autoPaymentMode,
                minimumPayableAmount,
                panelAdvanceAmount,
                disableDiscount,
                refund,
                constantMinimumPayableAmount,
                discountIsDefault,
                coPayIsDefault,
            } = details;

            const setData = {
                panelID,
                billAmount,
                discountAmount,
                isReceipt,
                patientAdvanceAmount,
                autoPaymentMode,
                minimumPayableAmount,
                panelAdvanceAmount,
                disableDiscount: true,
                refund,
                constantMinimumPayableAmount,
                discountIsDefault,
                coPayIsDefault: 1,
            };
            setPaymentMethod([]);
            setPaymentControlModeState(setData);
        };

        const handleCalculateBillAmount = (tableList) => {
            debugger
            const data = calculateBillAmount(
                tableList,
                1,
                // values?.SearchType?.value === "1" ? Number(BindResource?.IsReceipt) : 0,
                0,
                1,
                // values?.SearchType?.value === "1" ? 0 : 4,
                // patientDetail?.ReceiptNo?.length > 0 ? 1 : 4,
                tableList[0]?.IsPaymentModeCash === 0 || (tableList[0]?.IsPackage === 1) ? "4" : "1",
                0.0,
                1,
                1
            );
            handlePaymentGateWay(data);
        }
        // Handle Payment End


        //   IPD Return 
        const handleSearchIPDPatient = async (data, index) => {
            debugger
            let val = { ...patientList[index] }
            let apiResp = await PharmacyIPDReturnItemAPI(val?.TransactionID, String(values?.type?.value == "1" ? values?.SearchBy : "")
            )
            if (apiResp?.success && apiResp?.data?.length > 0) {
                let data = apiResp?.data?.map((val) => {
                    val.returnQty = 0
                    return val
                })
                if (values?.type?.value !== "2") {
                    setBodyData(apiResp?.data)
                }
                setPatientDetail(apiResp?.data)
                setValues((val) => ({ ...val, item: data[0]?.ItemID }))
                setPatientList([])
                // setBodyData(data)
            } else {
                notify(apiResp?.message, "error")
                setPatientDetail({})
                setBodyData([])
            }

        }



        // useEffect(() => {
        //     debugger
        //     if (bodyData?.length > 0) {
        //         const data = [...bodyData];
        //         const calcData = data?.map((val) => {
        //             debugger
        //             let calculatedAmount = handleCalculatePatientReturn(val)
        //             val = calculatedAmount
        //         })
        //         handleCalculateBillAmount(calcData?.filter((val) => val?.returnQty))
        //     }
        // }, [])

        // const handleCalculation = (list)=>{
        //     debugger
        //     if (list?.length > 0) {
        //         const data = [...list];
        //         const calcData = data?.map((val) => {
        //             debugger
        //             let calculatedAmount = handleCalculatePatientReturn(val)
        //             val = calculatedAmount
        //         })
        //         handleCalculateBillAmount(calcData?.filter((val) => val?.returnQty))
        //     }
        // }
        const handleCalculation = (list) => {
            debugger
            if (list?.length > 0) {
                const data = [...list];
                const calcData = data.map((val) => {
                    debugger
                    let calculatedAmount = handleCalculatePatientReturn(val);
                    return calculatedAmount;
                });
                handleCalculateBillAmount(calcData.filter((val) => val?.returnQty));
            }
        }


        // {console.log("modalData",modalData)}
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
                        modalData={handleModelData?.modalData}
                        // setModalData={setModalData}
                        footer={handleModelData?.footer}
                        handleAPI={handleModelData?.handleInsertAPI}
                    >
                        {/* //uguiguiguiguig */}
                        {handleModelData?.Component}
                    </Modal>
                )}
                <div className=" spatient_registration_card">
                    <div className="patient_registration card">
                        <Heading isBreadcrumb={true} title={"Patient Return"} />
                        <div className="row p-2">
                            {/* <div className=""
                      
                        // onClick={handlePatientSearchPage}
                      >
                        <i
                          className="fa fa-search "
                          aria-hidden="true"
                          style={{
                            border: "1px solid #447dd5",
                            padding: "5px 3px",
                            borderRadius: "3px",
                            backgroundColor: "#447dd5",
                            color: "white",
                          }}
                        ></i>
                      </div> */}
                            <ReactSelect
                                placeholderName={t("searchType")}
                                id="SearchType"
                                name="SearchType"
                                value={values?.SearchType?.value}
                                handleChange={(name, e) => handleReactSelect(name, e)}
                                removeIsClearable={true}
                                dynamicOptions={[{ label: "OPD/EMG Billing", value: "1" }, { label: "IPD Billing", value: "2" }]}
                                searchable={true}
                                respclass="col-xl-2 col-md-2 col-sm-2 col-2"
                            />
                            <ReactSelect
                                placeholderName={t("Mode")}
                                id="mode"
                                name="mode"
                                value={values?.mode?.value}
                                handleChange={(name, e) => handleReactSelect(name, e)}
                                removeIsClearable={true}
                                dynamicOptions={[{ label: "Credit", value: "0" }, { label: "Cash", value: "1" }]}
                                searchable={true}
                                respclass="col-xl-1 col-md-1 col-sm-2 col-1"
                            />
                            {values?.SearchType?.value === "2" &&
                                <ReactSelect
                                    placeholderName={t("Type")}
                                    id="type"
                                    name="type"
                                    value={values?.type?.value}
                                    handleChange={(name, e) => handleReactSelect(name, e)}
                                    removeIsClearable={true}
                                    dynamicOptions={[{ label: "Bill No.", value: "1" }, { label: "IPD No.", value: "2" }]}
                                    searchable={true}
                                    respclass="col-xl-1 col-md-1 col-sm-2 col-1"
                                />
                            }

                            {values?.SearchType?.value === "1" && <> <Input
                                type="text"
                                className="form-control "
                                id="ReceiptNo"
                                name="ReceiptNo"
                                value={values?.ReceiptNo ? values?.ReceiptNo : ""}
                                onChange={handleChange}
                                lable={t("ReceiptNo")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            />

                                <Input
                                    type="text"
                                    className="form-control "
                                    id="EmergencyNo"
                                    name="EmergencyNo"
                                    value={values?.EmergencyNo ? values?.EmergencyNo : ""}
                                    onChange={handleChange}
                                    lable={t("EmergencyNo")}
                                    placeholder=" "
                                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                />
                            </>}

                            {
                                console.log("values?.type?.value", values)
                            }
                            {values?.SearchType?.value === "2" && <Input
                                type="text"
                                className="form-control "
                                id="SearchBy"
                                name="SearchBy"
                                value={values?.SearchBy ? values?.SearchBy : ""}
                                onChange={handleChange}
                                lable={t(`SearchBy ${values?.type?.label}`)}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // disabled={true}
                            // disabled={isDisable}
                            />
                            }

                            {/* { values?.type?.value !== "2" && <Input
                            type="text"
                            className="form-control "
                            id="BillNo"
                            name="BillNo"
                            value={values?.BillNo ? values?.BillNo : ""}
                            onChange={handleChange}
                            lable={t("Bill Number")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // disabled={true}
                            // disabled={isDisable}
                        />} */}
                            {values?.SearchType?.value === "1" && <Input
                                type="text"
                                className="form-control "
                                id="BillNo"
                                name="BillNo"
                                value={values?.BillNo ? values?.BillNo : ""}
                                onChange={handleChange}
                                lable={t("Bill Number")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // disabled={true}
                            // disabled={isDisable}
                            />}

                            {/* {values?.SearchType?.value === "2" &&  values?.type?.value === "2" &&<Input
                            type="text"
                            className="form-control "
                            id="IPDNo"
                            name="IPDNo"
                            value={values?.IPDNo ? values?.IPDNo : ""}
                            onChange={handleChange}
                            lable={t("IPD No")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // disabled={isDisable}
                        />} */}
                            {values?.SearchType?.value === "2" && <Input
                                type="text"
                                className="form-control "
                                id="PatientName"
                                name="PatientName"
                                value={values?.PatientName ? values?.PatientName : ""}
                                onChange={handleChange}
                                lable={t("PatientName")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // disabled={isDisable}
                            />
                            }

                            <div className="col-sm-1">
                                <button className="btn btn-sm btn-success" type='button' onClick={handleSearch}>{t("Search")}</button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* IPD */}
                {patientList?.length > 0 && <PatientListTable tbody={patientList} handleSearchIPDPatient={handleSearchIPDPatient} />}
                {Object?.keys(patientDetail)?.length > 0 && values?.SearchType?.value === "1" && <PatientDetail patientDetail={patientDetail} />}

                {Object?.keys(patientDetail)?.length > 0 && values?.SearchType?.value === "2" && <IPDPatientDetail patientDetail={patientDetail} handleReactSelectItem={handleReactSelectItem} values={values} handleGetItem={handleGetItem} setHandleModelData={setHandleModelData} handleModelData={handleModelData} modalData={modalData} setModalData={setModalData}
                    setBodyData={setBodyData}
                    setIsOpen={setIsOpen}
                    handleCalculation={handleCalculation}
                    setSelectedIndents={setSelectedIndents}

                />}
                {console.log(bodyData, "bodyData")}
                {
                    // values?.type?.value == "1" && 
                    <PatientReturnTable handleCustomInput={handleCustomInput} tbody={bodyData} SearchType={values?.SearchType?.value}
                        selectedIndents={selectedIndents}
                    />
                    // values?.type?.value !== "2" &&  <PatientReturnTable handleCustomInput={handleCustomInput} tbody={bodyData} SearchType={values?.SearchType?.value} />

                }
                {/* <PatientReturnTable handleCustomInput={handleCustomInput} tbody={bodyData} SearchType={values?.SearchType?.value} /> */}


                <PaymentGateway
                    removeCredit={bodyData[0]?.IsPaymentModeCash === 1 && (bodyData[0]?.IsPackage === 0) ? true : false}
                    screenType={paymentControlModeState}
                    setScreenType={setPaymentControlModeState}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    discounts={discounts}
                    testAddingTableState={testAddingTableState}
                    pkgDisable={true}
                    button={
                        values?.SearchType?.value === "1" ? <button className="button" onClick={SaveOPDReurn}>
                            {t("Refund")}
                        </button> : <button className="button" onClick={SaveIPDReurn}>
                            {t("Refund")}
                        </button>


                    }
                />

            </>
        )
    }
