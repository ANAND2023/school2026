import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import Input from '../../../components/formComponent/Input'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import { BillingIPDAcknowledgmentIndent, BindItemDetailsAPI, GetAllPendingIndentsPharmecy, getPatientIndentAPI, PendingDraftListAPI, PharmacyGetSubtituteItemsStockDetails, PharmacymodifySubtituteIndentItem, PharmacyRejectIndentItem } from '../../../networkServices/pharmecy'
import moment from 'moment'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import { notify } from '../../../utils/utils'
import PendingIndent from './PendingIndent'
import PendingDraft from './PendingDraft'
import Heading from '../../../components/UI/Heading'
import PrescriptionList from './PrescriptionList'
import Modal from '../../../components/modalComponent/Modal'
import NestedRowTable from '../../../components/UI/customTable/NestedRowTable'
import SearchByMedicineItemName from '../../../components/commonComponents/SearchByMedicineItemName'
import { OPDAdvancegetPatientAdvanceRoleWise } from '../../../networkServices/opdserviceAPI'



export default function IndentReqModal({ department, type, setParentValues, setSearchPatient, setModalData, SearchPatient}) {

    const [t] = useTranslation()
    const [bodyData, setBodyData] = useState([])
    console.log("bodyData", bodyData)
    const [totalItemCost, setTotalItemCost] = useState(0)
    // const [nestedBodyData, setNestedBodyData] = useState([])
    const [selectedPatient, setSelectedPatient] = useState({})
    const [selectedIPDPkg, setSelectedIPDPkg] = useState([])
    const [onDoubleCLickData, setOnDoubleCLickData] = useState({})
    const [advanceData, setAdvanceData] = useState({});
    let userData = useLocalStorage("userData", "get")
    let initialValue = {
        ToDate: new Date(),
        FromDate: new Date(),
        panelType: "0",
        type: { value: SearchPatient?.PatientType === "EMG" ? "emg.EmergencyNo" : "id.TransactionID" },
        Status: { value: "OPEN" },
        deptLedgerNo: userData?.deptLedgerNo,
        Name: SearchPatient?.TransNo,
        isDisabled: SearchPatient?.TransNo ? true : false
    }
    const [values, setValues] = useState(initialValue)

    const handleReactSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues((val) => ({ ...val, [name]: selectedOptions }));
    };

    const castDepPayload = () => {
        // let data = 
        // values?.department?.map((val, index) => {
        //     data += `${"'" + val?.code + "'"}${values?.department?.length - 1 !== index ? "," : ""}`
        // })
        let data = values?.department?.map((val, index) => val?.code)

        return data
    }
    console.log("values", values)
    const getIndentItem = async (isShowTost = true) => {

        // let payload = {
        //     "deptLedgerNo": values?.deptLedgerNo,
        //     "searchby": values?.type?.value,
        //     "searchtype": values?.SearchTypeNumber ? values?.SearchTypeNumber : "",
        //     "status": values?.Status?.value ? values?.Status?.value : "",
        //     "department": castDepPayload(),
        //     "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
        //     "toDate": moment(values?.ToDate).format("DD-MMM-YYYY")
        // }
        let payload = {
            "deptLedgerNo": castDepPayload() || [],
            "searchby": values?.type?.value,
            "searchtype": values?.Name ? values?.Name : "",
            // "searchtype": values?.SearchTypeNumber ? values?.SearchTypeNumber : "",
            "status": values?.Status?.value ? values?.Status?.value : "",
            "department": "",
            "isPaymentModeCash": values?.panelType?.value ? values?.panelType?.value : values?.panelType,
            "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.ToDate).format("DD-MMM-YYYY")
        }

        const apiResp = await GetAllPendingIndentsPharmecy(payload)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
            setSelectedPatient({})
            setItemDetailList([])
        } else {
            setItemDetailList([])
            setSelectedPatient({})
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }
    }
    const getPendingDraftList = async (isShowTost = true) => {
        let apiResp = await PendingDraftListAPI()
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }
    }

    // handle Bind Item Deatils
    const thead = [
        { name: t("Reject"), width: "0.5%" },
        
        
        { name: t("S.No."), width: "0.5%" },
        { name: t("Item Name"), width: "1%" },
        { name: t("Generic Name"), width: "1%" },
        { name: t("substitute"), width: "1%" },
        // { name: t("Indent No"), width: "1%" },
        // { name: t("Requested Qty"), width: "1%" },
        { name: (<>Requested <br/> Qty</>), width: "1%" },
        { name: (<>Pending  <br/> Qty</>), width: "1%" },
        { name: (<>Dept<br/> Avl Qty</>), width: "1%" },
        { name: (<>Hosp<br/> Avl Qty</>), width: "1%" },
        { name: (<>Today <br/>Issue Qty</>), width: "1%" },
        { name: (<>All <br/>Issue Qty</>), width: "1%" },
        { name: t("Remarks"), width: "1%" },
        { name: t("Add substitute"), width: "1%" },
        { name: t("Action"), width: "0.5%" },
        // { name: t("BatchNumber"), width: "1%" },
        // { name: t("Expire Date"), width: "1%" },
        // { name: t("MRP"), width: "1%" },
        // { name: t("Issue"), width: "1%" },
        // { name: t("Reject"), width: "1%" },
    ]
    const pthead = [
        // { name: t("Action"), width: "0.5%" },
        // { name: t("substitute"), width: "1%" },
        { name: t("S.No."), width: "0.5%" },
        { name: t("Item Name"), width: "1%" },
        { name: t("Indent No"), width: "1%" },
        { name: t("Requested Qty"), width: "1%" },
        { name: t("Receive Qty"), width: "1%" },
        { name: t("Reject Qty"), width: "1%" },
        { name: t("Avl Qty"), width: "1%" },
        { name: t("Batch No"), width: "1%" },
        { name: t("Med Expiry Date"), width: "1%" },
        { name: t("MRP"), width: "1%" },
        // { name: t("Pending Qty"), width: "1%" },
        // { name: t("Dept Avl Qty"), width: "1%" },
        // { name: t("Hosp Avl Qty"), width: "1%" },
        // { name: t("Today Issue Qty"), width: "1%" },
        { name: t("All Issue Qty"), width: "1%" },
        { name: t("Reject"), width: "0.5%" },
        // { name: t("BatchNumber"), width: "1%" },
        // { name: t("Expire Date"), width: "1%" },
        // { name: t("MRP"), width: "1%" },
        // { name: t("Issue"), width: "1%" },
        // { name: t("Reject"), width: "1%" },
    ]

    const seondThead = [

        { name: t("Substitute Med"), key: "med", width: "1%" },
        { name: t("Requested"), width: "1%" },
        { name: t("Issued"), width: "1%" },
        { name: t("Rejected"), width: "1%" },
        { name: t("Available"), width: "1%" },
        { name: t("BatchNumber"), width: "1%" },
        { name: t("Expire Date"), width: "1%" },
        { name: t("MRP"), width: "1%" },
        { name: t("Issue"), width: "1%" },
        // { name: t("Reject"), width: "1%" },
    ]

    const thirdThead = [
        { name: t("Batch"), width: "0.1%" },
        { name: t("Expiry"), width: "0.5%" },
        { name: t("MRP"), width: "0.5%" },
        { name: t("Unit Price"), width: "0.1%" },
        { name: t("Cash Rate"), width: "1%" },
        { name: t("Bill Rate"), width: "1%" },
        { name: t("Available Qty"), width: "0.2%" },

        { name: t("Issue Qty"), width: "0.2%" },
    ]
    const [itemDetailList, setItemDetailList] = useState([]);

    // const handleClickEdit = (val, index, isopen) => {

    //     if (val?.AvlQty) {
    //         return;
    //     }
    //     else {
    //         // let tbody = [...itemDetailList]
    //         let tbody = JSON.parse(JSON.stringify(itemDetailList))
    //         tbody[index]["isopen"] = !isopen
    //         setItemDetailList(tbody)

    //     }
    // }


    // update substitute
    console.log(selectedPatient, "selectedPatientselectedPatient")

    
    const handleClickEdit = (val, index, isopen) => {
        if (val?.AvlQty) {
            return;
        } else {
            let tbody = JSON.parse(JSON.stringify(itemDetailList));


            tbody[index]["isopen"] = !isopen;


            let remainingQty = Number(val?.pendingQty) || 0;

            if (tbody[index].stockList?.length > 0 && remainingQty > 0) {
                tbody[index].stockList.forEach((stock) => {
                    if (remainingQty <= 0) {
                        stock.issueQuantity = 0;
                        return;
                    }

                    const maxAvailable = Number(stock?.avlQty) || 0;
                    const fillQty = Math.min(maxAvailable, remainingQty);

                    stock.issueQuantity = fillQty;
                    stock.totalRate = fillQty * (Number(stock.unitPrice) || 0);

                    remainingQty -= fillQty;
                });


                const totalIssued = tbody[index].stockList.reduce(
                    (sum, stock) => sum + Number(stock.issueQuantity || 0),
                    0
                );
                tbody[index].leftQty = (Number(val?.pendingQty) || 0) - totalIssued;
            }

            setItemDetailList(tbody);


            const totalSum = tbody
                .flatMap(item => item.stockList.filter(stock => Number(stock.issueQuantity) > 0))
                .reduce((sum, stock) => sum + Number(stock.totalRate || 0), 0);

            setModalData((val) => ({ ...val, modalData: { ...val.modalData, data: tbody, pkg: selectedIPDPkg } }))
            setTotalItemCost(totalSum);
        }
    };

    const BindItemDetails = async (URL, payload, isShowTost = true) => {
        let apiResp = await BindItemDetailsAPI(URL, payload)
        if (apiResp?.success) {
            debugger
            let pendingQty = 0
            let data = apiResp?.data?.map((val, index) => {
                let needToIssuQty = val?.ReqQty - val?.RejectQty
                if (val?.ItemID === apiResp?.data[index - 1]?.ItemID) {
                    val.IssueQuantity = 0
                    if (pendingQty > 0) {
                        if (pendingQty > val?.AvlQty) {
                            val.IssueQuantity = val?.AvlQty
                            pendingQty = pendingQty - val?.AvlQty
                        } else {
                            val.IssueQuantity = pendingQty
                            pendingQty = 0
                        }
                    }
                } else {
                    if (needToIssuQty > val?.AvlQty) {
                        val.IssueQuantity = val?.AvlQty
                        pendingQty = needToIssuQty - val?.AvlQty
                    } else {
                        val.IssueQuantity = needToIssuQty
                        pendingQty = 0
                    }
                }
                return val
            }).map(val => {
                return {
                    ...val,
                    isopen: false,
                    stockList: val?.stockList?.map((val2) => {
                        return {
                            ...val2,
                            issueQuantity: "",
                        }
                    })

                }
            })

            // setItemDetailList(data?.filter((val) => val?.IssueQuantity !== 0 && val?.AvlQty !== 0))
            setItemDetailList(data)
            setModalData((val) => ({ ...val, modalData: { ...val.modalData, data: data?.filter((val) => val?.IssueQuantity !== 0 && val?.AvlQty !== 0) } }))
        } else {
            setItemDetailList([])
            setModalData((val) => ({ ...val, modalData: [] }))
            isShowTost && notify(apiResp?.message, "error")
        }
    }
    console.log(onDoubleCLickData,"sssssssss")

    const getAdvanceAmount = async (uhid) => {
    try {
      const response = await OPDAdvancegetPatientAdvanceRoleWise(uhid);
      if (response?.success) {
        setAdvanceData(response?.data[0]);
      }
      else {
        setAdvanceData({});
      }

    } catch (error) {
	console.log(error)
    }
  }
  

    const SelectPendingIndent = (data, index, selectedIPDPkg = []) => {
        debugger
        setOnDoubleCLickData({data,index,selectedIPDPkg})
        getAdvanceAmount(data?.PatientID)
        if (data?.StatusNew === "CLOSE") {
            return
        }
        let item = { ...bodyData[index] }
        setTotalItemCost(0)
        setParentValues((val) => ({ ...val, type: { value: 1 } }))
        setModalData((val) => ({ ...val, modalData: { pType: data?.IsPaymentModeCash,ipdNo: item?.IPDNo,uhid:data?.PatientID } }))
        if (item?.IPDNo) {
            setSelectedPatient(item)
            // isCallhandleChange key is use for autometic search when slect patient from pending indent and call onchnage on seachitemEassyUI compnent 
            // setSearchPatient((val) => ({ ...val, value: item?.IPDNo, isCallhandleChange: true, name: "" }))
        } else if (item?.EMGNo) {
            setSearchPatient((val) => ({ ...val, value: item?.EMGNo, isCallhandleChange: true, name: "" }))
        }
        BindItemDetails("BindIndentDetailsURL", `indentNo=${item?.indentno}&deptLedgerNo=${userData?.deptLedgerNo}&IsCashPanel=${item?.IsCash}&IsPackage=${selectedIPDPkg?.length > 0 ? 1 : 0}`)
    }

    const saveSubstitute = async () => {
        debugger
        try {
            let substitutePayload = {
                "transactionId": selectedPatient?.TransactionID,
                "indentNo": selectedPatient?.indentno,
                "itemList": itemDetailList?.filter(item => item?.isSubtitute === 1)?.map((val) => ({
                    "newItemID": val?.subtituteItemID,
                    "newItemName": val?.subtituteItemName,
                    "oldItemName": val?.itemName,
                    "oldItemId": val?.itemID
                }))
            }
            const response = await  PharmacymodifySubtituteIndentItem(substitutePayload)
            if (response?.success) {

                 SelectPendingIndent(onDoubleCLickData?.data, onDoubleCLickData?.index, onDoubleCLickData?.selectedIPDPkg)
                notify(response?.message, "success")
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log(error)
        }

    }


    const [cancelModalData, setCancelModalData] = useState({ visible: false })
    const [rejectReason, setRejectReason] = useState("")

    const handleDeleteIndent = async (Data) => {
        let payload = {
            "indentID": String(Data?.indentno ? Data?.indentno : Data?.IndentNo ? Data?.IndentNo : ""),
            "itemID": String(Data?.ItemID ? Data?.ItemID : ""),
            "rejectReason": rejectReason ? rejectReason : ""
        }

        const apiResp = await PharmacyRejectIndentItem(payload)
        if (apiResp?.success) {
            notify(apiResp?.message)
            if (Data?.IndentNo) {
                BindItemDetails("BindIndentDetailsURL", `indentNo=${Data?.IndentNo}&deptLedgerNo=${userData?.deptLedgerNo}`, true)
            } else {
                await getIndentItem(false)
            }
            setCancelModalData({ visible: false })
        } else {
            notify(apiResp?.message, "error")
        }

    }
    const SelectCancelIndent = (item) => {
        setCancelModalData({
            visible: true,
            width: "25vw",
            label: <span>{t("Reject")}</span>,
            buttonName: "Reject",
            Component: <TextAreaInput
                lable={"Reject Reason"}
                className="w-100 required-fields"
                id="RejectReason"
                rows={3}
                respclass="w-100"
                name="RejectReason"
                // value={rejectReason?rejectReason:""}
                onChange={(e) => { setRejectReason(e?.target?.value) }}
            />,
            modalData: item,
            CallAPI: handleDeleteIndent

        })


    }

    const setAcknowledgmentIndent = async (val) => {
        console.log("first val", val);
        const payload = {
            "indentNo": val?.indentno
        }
        try {
            const response = await BillingIPDAcknowledgmentIndent(payload)
            if (response?.success) {
                notify(response?.message, "success")
                getIndentItem(false)
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {

        }
    }

    const handleCustomInput = (index, name, value, type, max, isSubMed) => {

        if (!isNaN(value) && Number(value) <= max && isSubMed) {
            const data = [...itemDetailList];
            data[index].ItemObj[name] = value;
            setItemDetailList(data);
            setModalData((val) => ({ ...val, modalData: data }))

        } else if (!isNaN(value) && Number(value) <= max) {
            const data = [...itemDetailList];
            data[index][name] = value;
            setItemDetailList(data);
            setModalData((val) => ({ ...val, modalData: data }))
        }

        else {
            return false
        }


    };
    console.log(itemDetailList, "itemDetailListitemDetailList")

    // const handleCustomInputQty = (index, cIndex, name, value, type, max, isSubMed) => {
    //     
    //     const data = JSON.parse(JSON.stringify(itemDetailList));
    //     if (!isNaN(value) && name === "issueQuantity" && ((data[index].leftQty === 0 || data[index].leftQty) ? data[index].leftQty : data[index].pendingQty) >= Number(value)) {
    //         data[index].stockList[cIndex][name] = value;

    //         // Calculate LEFT quantity for that item
    //         const totalIssued = data[index].stockList.reduce(
    //             (sum, stock) => sum + Number(stock.issueQuantity || 0),
    //             0
    //         );
    //         const leftQty = Number(data[index].pendingQty) - totalIssued;


    //         data[index].leftQty = leftQty;

    //         data[index].stockList[cIndex]["totalRate"] = data[index].stockList[cIndex]["issueQuantity"] *
    //             data[index].stockList[cIndex]["unitPrice"]
    //         setItemDetailList(data);
    //         setModalData((val) => ({ ...val, modalData: data }))

    //         const totalSum = data
    //             .flatMap(item => item.stockList.filter(stock => Number(stock.issueQuantity) > 0))
    //             .reduce((sum, stock) => sum + Number(stock.totalRate || 0), 0);
    //             setTotalItemCost(totalSum)

    //     }
    //     else if (!isNaN(value) && Number(value) <= max && isSubMed) {
    //         const data = JSON.parse(JSON.stringify(itemDetailList));
    //         data[index].ItemObj[name] = value;
    //         setItemDetailList(data);
    //         setModalData((val) => ({ ...val, modalData: data }))

    //     }
    //     else if (!isNaN(value) && Number(value) <= max) {
    //         const data = [...itemDetailList];
    //         data[index][name] = value;
    //         setItemDetailList(data);
    //         setModalData((val) => ({ ...val, modalData: data }))
    //     }

    //     else {
    //         return false
    //     }


    // };

    const handleCustomInputQty = (index, cIndex, name, value, type, max, isSubMed) => {
        debugger
        const data = JSON.parse(JSON.stringify(itemDetailList));
        if (!isNaN(value) && name === "issueQuantity") {
            data[index].stockList[cIndex][name] = value;

            // Calculate LEFT quantity for that item
            const totalIssued = data[index].stockList.reduce(
                (sum, stock) => sum + Number(stock.issueQuantity || 0),
                0
            );
            const leftQty = Number(data[index].pendingQty) - totalIssued;
            data[index].leftQty = leftQty;

            data[index].stockList[cIndex]["totalRate"] = data[index].stockList[cIndex]["issueQuantity"] *
                data[index].stockList[cIndex]["unitPrice"]
            setItemDetailList(data);
            setModalData((val) => ({ ...val, modalData: { ...val.modalData, data: data, pkg: selectedIPDPkg } }))

            const totalSum = data
                .flatMap(item => item.stockList.filter(stock => Number(stock.issueQuantity) > 0))
                .reduce((sum, stock) => sum + Number(stock.totalRate || 0), 0);
            setTotalItemCost(totalSum)
        }
        // else if (!isNaN(value) && Number(value) <= max && isSubMed) {
        //     const data = JSON.parse(JSON.stringify(itemDetailList));
        //     data[index].ItemObj[name] = value;
        //     setItemDetailList(data);
        //     setModalData((val) => ({ ...val, modalData: data }))

        // }
        // else if (!isNaN(value) && Number(value) <= max) {
        //     const data = [...itemDetailList];
        //     data[index][name] = value;
        //     setItemDetailList(data);
        //     setModalData((val) => ({ ...val, modalData: data }))
        // }

        else {
            return false
        }


    };


    // Select Draft 

    // const handleCustomInputQty = (index, cIndex, name, value, type, max, isSubMed) => {
    //     
    //     const data = JSON.parse(JSON.stringify(itemDetailList));
    //     if (!isNaN(value) && name === "issueQuantity" && data[index].leftQty >= value) {

    //         // // Update issueQuantity
    //         // if(value > data[index].leftQty){
    //         //     return false
    //         // }

    //         data[index].stockList[cIndex][name] = value;

    //         data[index].stockList[cIndex]["totalRate"] =
    //             Number(data[index].stockList[cIndex]["issueQuantity"]) *
    //             Number(data[index].stockList[cIndex]["unitPrice"]);

    //         // Calculate LEFT quantity for that item
    //         const totalIssued = data[index].stockList.reduce(
    //             (sum, stock) => sum + Number(stock.issueQuantity || 0),
    //             0
    //         );
    //         const leftQty = Number(data[index].pendingQty) - totalIssued;


    //         data[index].leftQty = leftQty;



    //         // Update state
    //         setItemDetailList(data);
    //       setModalData((val) => ({ ...val, modalData: data }))

    //         // Calculate total item cost
    //         const totalSum = data
    //             .flatMap(item => item.stockList.filter(stock => Number(stock.issueQuantity) > 0))
    //             .reduce((sum, stock) => sum + Number(stock.totalRate || 0), 0);

    //         setTotalItemCost(totalSum);
    //     }

    //     else {
    //         return false;
    //     }
    // };

    const SelectDroftItem = (data, index) => {
        let item = { ...bodyData[index] }

        setParentValues((val) => ({ ...val, type: { value: 1 } }))
        BindItemDetails("BindDraftDetailsURL", `demandDraftID=${item?.ID}&deptLedgerNo=${userData?.deptLedgerNo}`)
    }

    // prescription 

    const getPatientIndentList = async (isShowTost = true) => {
        let payload = {
            "deptLedgerNo": userData?.deptLedgerNo,
            "IPDNO": "",
            "MRNO": SearchPatient?.PatientID,
            "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.ToDate).format("DD-MMM-YYYY"),
            "indentID": "",
            "searchType": "",
            "demandDraftID": 0
        }
        let apiResp = await getPatientIndentAPI(payload)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }

    }

    const SelectPatientIndent = (val) => {
        BindItemDetails("BindPrescribeDetailsURL", `date=${val?.Date}&patientID=${SearchPatient?.PatientID}&doctorID=${val?.DoctorID}&deptLedgerNo=${userData?.deptLedgerNo}`)
    }

    // const handleItemSelect = (label, value, val, type, e) => {
    // console.log(val);
    // setItemIndexValue(val);
    // setPayload({
    //   ...payload,
    //   itemName: {
    //     label: label,
    //     value: value,
    //   },
    // });

    const getSubstituteItem = async (ItemId, IsCashPanel, IsPackage, TransactionId) => {
        debugger

        try {
            const response = await PharmacyGetSubtituteItemsStockDetails(ItemId, IsCashPanel, IsPackage, TransactionId)

            if (response?.success) {
                return response?.data
            }
            else {
                return [];
            }


        } catch (error) {

        }

    }
    console.log(itemDetailList,"itemDetailListitemDetailList")

    const handleItemSelect = async (label, value, val, type, e, index) => {
        debugger

        // console.log(val);
        const itemID = value.split("#")[0];
        const isMatch = itemDetailList?.find((item) => item?.itemID === itemID || item?.subtituteItemID === itemID);
        if (isMatch) {
            notify("Duplicate Item", "warn")
            return
        }

        // setItemIndexValue(val);
        // console.log(itemDetailList, "itemDetailList")
        const substituteItem = await getSubstituteItem(itemID, itemDetailList[index]?.isCash, selectedIPDPkg?.length > 0 ? 1 : 0, bodyData[0]?.TransactionID)
        // console.log(substituteItem, "substituteItem")
        // setPayload({
        //     ...payload,
        //     itemName: {
        //         label: label,
        //         value: value,
        //     },
        // });

        // setItemDetailList((prev) => {
        //     const updatedList = [...prev]
        //     updatedList[index].ItemObj = {
        //         ...val,
        //         label: label,
        //     };
        //     updatedList[index].NewItemName = label;
        //     updatedList[index].NewItemID = value;
        //     updatedList[index].isSubtitute = 1;
        //     return updatedList;
        // })

        setItemDetailList((prev) => {
            const updatedList = [...prev]
            updatedList[index].stockList = [
                ...substituteItem
            ];
            // updatedList[index].subtituteItemName = updatedList[index].itemName;
            // updatedList[index].subtituteItemID = updatedList[index].itemID
            // updatedList[index].substituteItem = updatedList[index].itemName
            // updatedList[index].substituteitemID = updatedList[index].itemID
            // updatedList[index].itemName = label;
            // updatedList[index].itemID = itemID;
            updatedList[index].subtituteItemName = label;
            updatedList[index].subtituteItemID = itemID;
            updatedList[index].isSubtitute = 1;
            updatedList[index].deptAvlQty = substituteItem[0]?.deptAvlQty;
            updatedList[index].hospAvlQty = substituteItem[0]?.hospAvlQty;
            updatedList[index].generic = substituteItem[0]?.generic;
            return updatedList;
        })

        setModalData((val) => ({ ...val, modalData: { ...val.modalData, data: itemDetailList } }))

        // if (type === "keydown") {
        // AddRowData({ ...payload, itemName: { label: label, value: value, } })
        // }
    };
    console.log(itemDetailList, "itemDetailList")

    const getRowClass = (val) => {

        let data = itemDetailList?.find(
            (item) => Number(item?.deptAvlQty) === Number(val?.deptAvlQty)
        );

        if (Number(data?.deptAvlQty) === 0) {
            return "color-indicator-20-bg";
        }
    };

    return (
        <>
            <div style={{ minHeight: "80vh", fontSize: "16px !important" }}>
                <div className="mt-2 spatient_registration_card " >
                    <div className="patient_registration card">
                        {type === "indent" && <PendingIndent
                            handleChange={handleChange} handleReactSelect={handleReactSelect} values={values} department={department} handleMultiSelectChange={handleMultiSelectChange} getIndentItem={getIndentItem} bodyData={bodyData} SelectPendingIndent={SelectPendingIndent} SearchPatient={SearchPatient} SelectCancelIndent={SelectCancelIndent} setAcknowledgmentIndent={setAcknowledgmentIndent}
                            selectedPatient={selectedPatient}
                            setSelectedIPDPkg={setSelectedIPDPkg}
                            selectedIPDPkg={selectedIPDPkg}
                            advanceData={advanceData}
                        />
                        }
                        {type === "draft" && <PendingDraft bodyData={bodyData} getPendingDraftList={getPendingDraftList} SelectDroftItem={SelectDroftItem} />}

                        {type === "prescription" && <PrescriptionList bodyData={bodyData} getPatientIndentList={getPatientIndentList} SelectPatientIndent={SelectPatientIndent} values={values} handleChange={handleChange} PatientID={SearchPatient?.PatientID} />}

                    </div>
                </div>
                {itemDetailList?.length > 0 && <div className='mt-2 spatient_registration_card'>
                    <div className="patient_registration card">
                        <Heading
                            isBreadcrumb={false}
                            title={t("Item Details")}
                            secondTitle={
                                <>
                                    <button className='btn btn-sm btn-primary mx-2'
                                        onClick={saveSubstitute}
                                        disabled={!itemDetailList?.some(item => item.isSubtitute === 1)}
                                    >Save All Substitutes</button>
                                    <p className="text-bold mb-0">Total Cost: {Number(totalItemCost).toFixed(2)}</p>
                                </>
                            }
                        />
                        {console.log(SearchPatient, "SearchPatientSearchPatient")}

                        {console.log(itemDetailList, "itemDetailListitemDetailList")}
                        {type === "indent" ?
                            <NestedRowTable
                                thead={thead}
                                seondThead={thirdThead}
                                tbody={itemDetailList?.map((val, index) => ({
                                    

                                        Reject: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { SelectCancelIndent(val, "ItemDetails") }}></i>,

                                    
                                    sno: <strong>{index + 1}</strong>,
                                    ItemName: <p style={{fontWeight: "bold"}}>{val?.itemName} <br/> ({ val?.subcategoryName})</p>,
                                    generic: (
                                        <span title={val?.generic}
                                        style={{fontWeight: "bold"}}
                                        >
                                            {val?.generic && val?.generic.length > 30
                                                ? val?.generic.substring(0, 25) + "..."
                                                : val?.generic}
                                        </span>
                                    ),
                                    subtituteItemName: <strong>{val?.subtituteItemName} </strong>,
                                    // indentNo: val?.indentNo,
                                    ReqQty: <strong>{val?.reqQty ? val?.reqQty : "0"}</strong>,
                                    pendingQty: <strong>{val?.pendingQty ? val?.pendingQty : "0"}</strong>,
                                    deptAvlQty:  val?.deptAvlQty ? val?.deptAvlQty : "0", 
                                    hospAvlQty: <strong>{val?.hospAvlQty ? val?.hospAvlQty : "0" }</strong> ,
                                    todayIssueQty: <strong> {val?.todayIssueQty ? val?.todayIssueQty : "0"}</strong> ,
                                    allIssueQty: <strong>{val?.allIssueQty ? val?.allIssueQty : "0"}</strong> ,
                                    remarks: <strong>{val?.remarks ? val?.remarks : ""}</strong> ,
                                    substitute:
                                        <SearchByMedicineItemName
                                            // onClick={handleSinglePatientData}
                                            // data={data}
                                            handleItemSelect={handleItemSelect}
                                            itemName={val?.ItemObj}
                                            pateintDetails={SearchPatient}
                                            index={index}
                                            isMedSearch={true}
                                            showAvailableStock={true}
                                            hideTitle={true}
                                        // payload={payload}
                                        // AddRowData={AddRowData}
                                        />,
                                   index:
                                        <span onClick={() => { handleClickEdit(val, index, val?.isopen) }}>
                                            {val?.isopen > 0 ? <i className="fa fa-minus" aria-hidden="true"></i> : <span className='d-flex  align-items-center'>
                                                <i className="fa fa-plus" aria-hidden="true"></i>
                                                {/* {val?.stockList?.length > 0 ? `` : <p className='ml-4 mb-0 text-danger font-weight-bold blink-text'>OUT OF STOCK</p>} */}
                                            </span>
                                            }
                                        </span>,

                                    
                                    subRow: {
                                        secondThead: val?.stockList?.length > 0 ? thirdThead : seondThead,
                                        subRowList:
                                            val?.stockList?.length > 0 ?
                                                val?.stockList?.map((item, cIndex) => ({
                                                    batch: item?.batchNumber,
                                                    medExpiryDate: item?.medExpiryDate,
                                                    mrp: item?.mrp,
                                                    unitPrice: item?.newUnitPrice,
                                                    cashRate: item?.cashRate,
                                                    billRate: item?.unitPrice,
                                                    availQty: item?.avlQty,
                                                    issueQty: (
                                                        <Input
                                                            type="text"
                                                            className="table-input"
                                                            removeFormGroupClass={true}
                                                            display={"right"}
                                                            name={"issueQuantity"}
                                                            value={item?.issueQuantity ?? ""}

                                                            // onChange={(e) => {
                                                            //     debugger
                                                            //     let newValue = e.target.value;
                                                            //     const maxQty = val?.leftQty ?? val?.pendingQty;
                                                            //     const maxAvailable = item?.avlQty ?? 0;

                                                            //     console.log(item?.avlQty, "item.avlQty");


                                                            //     if (Number(newValue) > maxQty || Number(newValue) > maxAvailable) {
                                                            //         return;
                                                            //     }

                                                            //     handleCustomInputQty(index, cIndex, "issueQuantity", newValue, "number");
                                                            // }}

                                                            onChange={(e) => {
                                                                const newValue = Number(e.target.value) || 0;

                                                                const otherIssued = val.stockList.reduce((sum, s, idx) => {
                                                                    if (idx !== cIndex) {
                                                                        sum += Number(s.issueQuantity || 0);
                                                                    }
                                                                    return sum;
                                                                }, 0);

                                                                const pending = Number(val?.pendingQty) || 0;
                                                                const maxAvailable = Number(item?.avlQty) || 0;


                                                                const maxQty = pending - otherIssued;

                                                                if (newValue > maxQty || newValue > maxAvailable) {
                                                                    return;
                                                                }

                                                                handleCustomInputQty(index, cIndex, "issueQuantity", newValue, "number");
                                                            }}

                                                        />
                                                    )
                                                }))
                                                : [],
                                        isopen: val?.isopen
                                    }
                                }))}
                                getRowClass={getRowClass}
                                tableHeight={"scrollView"}

                            />

                            :
                            <Tables
                                thead={pthead}
                                tbody={itemDetailList?.map((val, index) => ({
                                    sno: index + 1,
                                    ItemName: val?.ItemName,
                                    IndentNo: val?.IndentNo,
                                    ReqQty: val?.TotalReqQty ? val?.TotalReqQty : "0",
                                    IssueQty: val?.ReceiveQty ? val?.ReceiveQty : "0",
                                    RejectQty: val?.RejectQty ? val?.RejectQty : "0",
                                    AvlQty: val?.AvlQty ? val?.AvlQty : "0",
                                    BatchNumber: val?.BatchNumber,
                                    MedExpiryDate: val?.MedExpiryDate,
                                    MRP: val?.MRP ? val?.MRP.toFixed(4) : "0",
                                    IssueQuantity: <Input
                                        type="text"
                                        className="table-input"
                                        removeFormGroupClass={true}
                                        display={"right"}
                                        name={"IssueQuantity"}
                                        value={val?.IssueQuantity}
                                    // onChange={(e) => { handleCustomInput(index, "IssueQuantity", e.target.value, "number", Number(val?.AvlQty)) }}
                                    />,

                                    Reject: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { SelectCancelIndent(val, "ItemDetails") }}></i>,
                                }))}
                                style={{ height: "20vh" }}
                            />}
                    </div>
                </div>}
            </div>

            {cancelModalData?.visible && (
                <Modal
                    visible={cancelModalData?.visible}
                    setVisible={() => { setCancelModalData({ visible: false }) }}
                    modalData={cancelModalData?.modalData}
                    modalWidth={cancelModalData?.width}
                    Header={cancelModalData?.label}
                    buttonType="button"
                    buttonName={cancelModalData?.buttonName}
                    footer={cancelModalData?.footer}
                    handleAPI={cancelModalData?.CallAPI}
                >
                    {cancelModalData?.Component}
                </Modal>
            )}

        </>
    )
}
