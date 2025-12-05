import React, { useEffect } from 'react'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next'
import { PharmacyBindIndentDetails } from '../../../networkServices/pharmecy'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import Tables from '../../../components/UI/customTable'
import { notify } from '../../../utils/ustil2'
import NestedRowTable from '../../../components/UI/customTable/NestedRowTable'
import ReportDatePicker from '../../../components/ReportCommonComponents/ReportDatePicker'
import moment from 'moment'


const IndentModal = ({ patientData, setModalData, modalData, setNewBodyData, setHandleModelData }) => {
    const [t] = useTranslation()
    const [tableData, setTableData] = React.useState([])



    const thead = [
        { name: t("Action"), width: "5%" },
        { name: t("Index"), width: "5%" },
        { name: t("Indent No."), width: "5%" },
        { name: t("Item Name"), width: "5%" },
        { name: t("Requested Qty"), width: "5%" },
        { name: t("Return Qty"), width: "5%" },
        { name: t("Rejected Qty"), width: "5%" },
        { name: t("Store Available Qty"), width: "5%" },
        { name: t("Pending Qty"), width: "5%" },
        { name: t("Narration"), width: "5%" },
        // { name: t("Return Qty"), width: "5%" },
        // { name: t("Reject Qty"), width: "5%" },
    ]

    const thead2 = [
        { name: t("Invoice No"), width: "5%" },
        { name: t("Invoice Date"), width: "5%" },
        { name: t("Batch"), width: "5%" },
        { name: t("Expiry"), width: "5%" },
        { name: t("Rate"), width: "5%" },
        { name: t("Avail Qty"), width: "5%" },
        { name: t("Returned Qty"), width: "5%" },
        // { name: t("Reject Qty"), width: "5%" },
    ]

    const userData = useLocalStorage("userData", "get")

    const [values, setValues] = React.useState({
        indent: "",
        fromDate: new Date(),
        toDate: new Date(),
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    console.log(modalData, "modalDatamodalData")

    // const handleCustomInput = (index, name, value, type, max) => {

    //     if (type === "number") {
    //         if (!isNaN(value) && Number(value) <= max) {
    //             const data = [...tableData];
    //             data[index][name] = value;

    //             setTableData(data);
    //             const filteredData = data?.filter((item) => (item?.returnQty > 0))
    //             setNewBodyData(filteredData)
    //             setHandleModelData((val) => ({ ...val, modalData: filteredData }))
    //             // setModalData(filteredData)
    //         } else {
    //             notify("Please Enter Valid Quantity", "error")
    //             return false
    //         }
    //     }

    // };

    const handleCustomInputQty = (index, cIndex, name, value, type, max, isSubMed) => {

        const data = JSON.parse(JSON.stringify(tableData));
        if (!isNaN(value) && name === "retQty") {
            data[index].StockList[cIndex][name] = value;

            // Calculate LEFT quantity for that item
            const totalIssued = data[index].StockList.reduce(
                (sum, stock) => sum + Number(stock.retQty || 0),
                0
            );
            const leftQty = Number(data[index].PendingQty) - totalIssued;
            data[index].leftQty = leftQty;
            setTableData(data);
            const filteredData = data.flatMap(item =>
                item.StockList.filter(stock => Number(stock.retQty) > 0).map(stock => {

                    return {
                        ...stock,
                        ID: item.id
                    }
                }
                )
            )

            setNewBodyData(filteredData)
            setHandleModelData((val) => ({ ...val, modalData: filteredData }))
            // setModalData(filteredData)
        } else {
            notify("Please Enter Valid Quantity", "error")
            return false
        }


    };

    const handleClickEdit = (val, index, isopen) => {

        if (val?.AvlQty) {
            return;
        }
        else {
            // let tbody = [...itemDetailList]
            let tbody = JSON.parse(JSON.stringify(tableData))
            tbody[index]["isopen"] = !isopen
            setTableData(tbody)

        }
    }


    const handleIndentSearch = async () => {

        let payload = {
            "dept": String(userData?.deptLedgerNo),
            "indentNo": String(values?.indent),
            // "transactionID": "1074",
            "transactionID": String(patientData?.TransactionID),
            "status": "1",
            //             "fromDate": "string",
            //   "toDate": "string",


            "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(values.toDate).format("YYYY-MM-DD"),
            "itemId": "",
        }


        //         {
        //   "dept": "string",
        //   "indentNo": "string",
        //   "transactionID": "string",
        //   "itemId": "string",
        //   "status": "string",
        //   "fromDate": "string",
        //   "toDate": "string"
        // }
        const apiResp = await PharmacyBindIndentDetails(payload)
        if (apiResp?.success) {
            let data = apiResp?.data?.map((val) => {
                val.returnQty = 0
                val.rejectQty = 0
                return val
            })
            setTableData(data)
        }
        else {
            setTableData([])
            notify(apiResp?.message, "warn")
        }
    }

    useEffect(() => {
        handleIndentSearch()
    }, [])
    console.log(modalData, "modalDatamodalData")
    console.log(tableData, "tableDatatableData")
    return (
        <div
            className='row'
        >
            <div className="d-flex col-xl-12 col-md-12 col-sm-12 col-12">
                <Input
                    type="text"
                    className="form-control"

                    removeFormGroupClass={false}
                    name="indent"
                    lable={t("Indent No")}
                    required={true}
                    onChange={handleInputChange}
                    //   onKeyDown={handleKeyDown} // Add keydown event handler
                    //   inputRef={inputRef}
                    value={values?.indent}
                    respclass="col-xl-3 col-md-3 col-sm-6 col-6"
                />
                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("fromDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                />

                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("toDate")}
                    values={values}
                    setValues={setValues}
                    max={new Date()}
                    min={values?.fromDate}
                />
                <button className="btn btn-sm btn-success" type='button'
                    onClick={handleIndentSearch}
                >{t("Search")}</button>
            </div>
            <div className="col-xl-12 col-md-12 col-sm-12 col-12">

                <NestedRowTable
                    thead={thead}
                    seondThead={thead2}
                    tbody={
                        tableData?.map((item, index) => ({
                            Action:
                                <span onClick={() => { handleClickEdit(item, index, item?.isopen) }}>
                                    {item?.isopen > 0 ? <i className="fa fa-minus" aria-hidden="true"></i> : <span className='d-flex  align-items-center'>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                        {/* {val?.stockList?.length > 0 ? `` : <p className='ml-4 mb-0 text-danger font-weight-bold blink-text'>OUT OF STOCK</p>} */}
                                    </span>
                                    }
                                </span>,
                            index: index + 1,
                            indent: item?.IndentNo,
                            itemName: item?.ItemName,
                            ReqQty: item?.ReqQty ? item?.ReqQty : "0",
                            returnQTY: item?.ReceiveQty ? item?.ReceiveQty : "0",
                            RejectQty: item?.RejectQty ? item?.RejectQty : "0",
                            AvailQty: item?.AvailQty ? item?.AvailQty : "0",
                            PendingQty: item?.PendingQty ? item?.PendingQty : "0",
                            Narration: item?.Narration ? item?.Narration : "",
                            // rtnqty: (<Input
                            //     type="text"
                            //     className="table-input"
                            //     removeFormGroupClass={true}
                            //     display={"right"}
                            //     name={"returnQty"}
                            //     value={item?.returnQty}
                            //     onChange={(e) => { handleCustomInput(index, "returnQty", e.target.value, "number", Number(item?.PendingQty)) }}
                            // />),
                            // rejectQTY: (<Input
                            //     type="text"
                            //     className="table-input"
                            //     removeFormGroupClass={true}
                            //     display={"right"}
                            //     name={"rejectQty"}
                            //     value={item?.rejectQty}
                            //     onChange={(e) => { handleCustomInput(index, "rejectQty", e.target.value, "number", Number(item?.PendingQty)) }}
                            // />),
                            subRow: {
                                subRowList:
                                    item?.StockList?.length > 0 ?
                                        item?.StockList?.map((val, cIndex) => ({
                                            billNo: val?.billNo,
                                            date: val?.date,
                                            batchNumber: val?.batchNumber,
                                            medExpiryDate: val?.medExpiryDate,
                                            mrp: val?.mrp,
                                            avlQty: val?.avlQty,
                                            // rtnqty: (<Input
                                            //     type="text"
                                            //     className="table-input"
                                            //     removeFormGroupClass={true}
                                            //     display={"right"}
                                            //     name={"retQty"}
                                            //     value={val?.retQty}
                                            //     // onChange={(e) => { handleCustomInput(index, "returnQty", e.target.value, "number", Number(item?.PendingQty)) }}
                                            //     onChange={(e) => {
                                            //         debugger
                                            //         let isPaymentModeMisMatch ;
                                            //         if (isPaymentModeMisMatch) {
                                            //             notify("Payment Mode MisMatch", "error")
                                            //             return;
                                            //         }

                                            //         let newValue = e.target.value;
                                            //         const maxQty = item?.leftQty ?? item?.PendingQty;
                                            //         const maxAvailable = val?.avlQty;

                                            //         console.log(val?.avlQty, "val.avlQty");
                                            //         if (Number(newValue) > maxQty || Number(newValue) > maxAvailable) {
                                            //             // alert("mdvjnf")
                                            //             return;
                                            //         }
                                            //         handleCustomInputQty(index, cIndex, "retQty", newValue, "number");
                                            //     }}
                                            // />)

                                            rtnqty: (<Input
                                                type="text"
                                                className="table-input"
                                                removeFormGroupClass={true}
                                                display={"right"}
                                                name={"retQty"}
                                                value={val?.retQty}
                                                onChange={(e) => {
                                                    debugger
                                                    let isPaymentModeMisMatch = false;
                                                    const newValue = e.target.value;

                                                    // Only perform the check if the user is entering a quantity to return.
                                                    if (newValue && Number(newValue) > 0) {

                                                        // 1. Create a flat list of ALL stock items being returned from the ENTIRE tableData.
                                                        const allItemsBeingReturned = [];

                                                        tableData.forEach((parentItem, pIndex) => {
                                                            if (parentItem.StockList && parentItem.StockList.length > 0) {
                                                                parentItem.StockList.forEach((stockItem, sIndex) => {

                                                                    // Check if this is the specific item the user is currently editing.
                                                                    if (pIndex === index && sIndex === cIndex) {
                                                                        // If it is, use the new value to check.
                                                                        if (Number(newValue) > 0) {
                                                                            allItemsBeingReturned.push(stockItem);
                                                                        }
                                                                    } else {
                                                                        // For all other items, check their existing return quantity.
                                                                        if (stockItem.retQty && Number(stockItem.retQty) > 0) {
                                                                            allItemsBeingReturned.push(stockItem);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });

                                                        // 2. If we now have more than one item being returned globally, check for a mismatch.
                                                        if (allItemsBeingReturned.length > 1) {
                                                            const firstPaymentMode = allItemsBeingReturned[0].isPaymentModeCash;
                                                            isPaymentModeMisMatch = allItemsBeingReturned.some(
                                                                (item) => item.isPaymentModeCash !== firstPaymentMode
                                                            );
                                                        }
                                                    }

                                                    // 3. Notify the user or proceed with the update.
                                                    if (isPaymentModeMisMatch) {
                                                        notify("Payment Mode MisMatch", "error");
                                                        return;
                                                    }

                                                    const maxQty = item?.leftQty ?? item?.PendingQty;
                                                    const maxAvailable = val?.avlQty;

                                                    if (Number(newValue) > maxQty || Number(newValue) > maxAvailable) {
                                                        return;
                                                    }
                                                    handleCustomInputQty(index, cIndex, "retQty", newValue, "number");
                                                }}
                                            />)

                                        }))
                                        : [],
                                isopen: item?.isopen
                            }

                        }))
                    }
                // style={{ maxHeight: "auto" }}
                // tableHeight={"scrollView"}
                />
            </div>

        </div>
    )
}

export default IndentModal