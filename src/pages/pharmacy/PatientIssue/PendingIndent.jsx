import React, { useEffect, useState } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import { PHARMACY_ITEMINDENT_STATUS, PHARMACY_ITEMINDENT_TYPE } from '../../../utils/constant'
import Input from '../../../components/formComponent/Input'
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp'
import DatePicker from '../../../components/formComponent/DatePicker'
import Tables from '../../../components/UI/customTable'
import { SelectIconSVG } from '../../../components/SvgIcons'
import Heading from '../../../components/UI/Heading'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import { PostIncludeBillApi } from '../../../networkServices/BillingsApi'
import { Checkbox } from 'primereact/checkbox'
import { CurrentStockPrintIndent } from '../../../networkServices/pharmecy'
import { notify } from '../../../utils/ustil2'
import { RedirectURL } from '../../../networkServices/PDFURL'

export default function PendingIndent({ values, handleReactSelect, handleChange, department, getIndentItem, handleMultiSelectChange, bodyData, SelectPendingIndent, SelectCancelIndent, setAcknowledgmentIndent, selectedPatient, setSelectedIPDPkg, selectedIPDPkg ,advanceData}) {
    const [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [filterData, setFilterData] = useState([])
    const [ipdPackageData, setIpdPackageData] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(null);

    console.log("filterData", filterData)
    const handleCallViewMedReq = (item) => {
        debugger
        const filter_data = bodyData?.filter((val) => val?.Acknowledgment === item)
        setFilterData(filter_data)
        // handleSearchViewReqDetails(item);
    };
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: (<i className="fa fa-plus text-primary text-center" aria-hidden="true"></i>), width: "0.5%" },
        { name: t("print"), width: "1%" },
        { name: t("Indent No"), width: "1%" },
        { name: t("Date"), width: "1%" },
        { name: t("IPD No."), width: "1%" },

        { name: t("Patient Name"), width: "1%" },
        { name: t("Panel"), width: "1%" },
        { name: t("FUM"), width: "1%" },
        { name: t("Bed No."), width: "1%" },
        { name: t("Indent From."), width: "1%" },
        { name: t("Indent By"), width: "1%" },
        { name: t("Status"), width: "1%" },
        { name: t("Acknowledged By"), width: "1%" },
        { name: t("EMG No."), width: "1%" },
        
        { name: t("Req"), width: "1%" },
        { name: t("Rej"), width: "1%" },
        { name: t("Indent Type"), width: "1%" },
        // { name: t("Reject"), width: "1%" },

    ]
    const pkgThead = [
        { name: t("Select"), width: "1%" },
        t("Date"),
        t("BillNo"),
        t("ReceiptNo"),
        t("Type"),
        t("Ipd No"),
        t("PName"),
        t("PackageName"),
        t("Paid Amount"),
        t("Package Amount"),
        t("Pharmacy Amt"),
        t("UtilizePharmacy Amt"),
    ];

    const handlePrint = async (val) => {
        debugger
        console.log("firstval", val)
        const payload = {
            "indentNo": val?.indentno,
            "transactionID": Number(val?.TransactionID),
            "type": "MI"
        }
        try {
            const response = await CurrentStockPrintIndent(payload)
            if (response?.success) {
                RedirectURL(response?.data?.pdfUrl);
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }

    }

    const getIPDPackage = async () => {
        debugger
        try {
            const payload = {
                uhid: selectedPatient?.IPDNo ? "" : selectedPatient?.PatientID,
                pName: "",
                billNo: "",
                fromDate: "",
                toDate: "",
                recieptNo: "",
                ipdNo: selectedPatient?.IPDNo,
            };
            const apiResp = await PostIncludeBillApi(payload);
            if (apiResp?.success) {
                setIpdPackageData(apiResp?.data)
            }else{
                setIpdPackageData([])
            }

        } catch (error) {

        }
    }


    const handleRowClick = (pdata, index, data) => {
        debugger
        SelectPendingIndent(data, index, selectedIPDPkg)
        setSelectedIndex(index)
    };

    useEffect(() => {
        if (selectedPatient?.PatientID) {
            getIPDPackage()
        }
    }, [selectedPatient?.PatientID])

    useEffect(() => {
        if (values?.deptLedgerNo) {
            getIndentItem(false)
        }
    }, [values?.deptLedgerNo,values?.panelType])
    useEffect(() => {
        // if()
        //   const filter_data=bodyData?.filter((val)=>val?.Acknowledgment===item)
        setFilterData(bodyData)
    }, [getIndentItem])

 

    return (
        <>

            <div className="row pt-2 px-2">

                <ReactSelect placeholderName={t("Type")}
                    id="type"
                    inputId="type"
                    name="type"
                    value={values?.type?.value}
                    isDisabled={values?.isDisabled}
                    dynamicOptions={PHARMACY_ITEMINDENT_TYPE}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { handleReactSelect(name, e) }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />

                <Input
                    type="text"
                    className="form-control"
                    disabled={values?.isDisabled}
                    removeFormGroupClass={true}
                    // placeholder={`Please Enter ${values?.type?.label ? values?.type?.label : ""}`}
                    name="Name"
                    lable={t(`Please Enter ${values?.type?.label ? values?.type?.label : ""}`)}

                    value={values?.Name ? values?.Name : ""}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"
                    onChange={handleChange}
                />

                <ReactSelect placeholderName={t("Status")}
                    id="Status"
                    inputId="Status"
                    name="Status"
                    value={values?.Status?.value}
                    dynamicOptions={PHARMACY_ITEMINDENT_STATUS}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { handleReactSelect(name, e) }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />
                <ReactSelect placeholderName={t("Paymentmode Type")}
                    id="panelType"
                    inputId="panelType"
                    name="panelType"
                    value={values?.panelType?.value ? values?.panelType?.value : values?.panelType}
                    dynamicOptions={[
                        { value: "0", label: "Credit" },
                        { value: "1", label: "Cash" }
                    ]}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { 
                        
                        handleReactSelect(name, e)

                     }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />
                <MultiSelectComp
                    respclass="col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"
                    name="department"
                    id="department"
                    placeholderName="Department"
                    dynamicOptions={
                        department?.map((item) => ({
                            name: item.ledgerName,
                            code: item.ledgerNumber,
                        }))}
                    // dynamicOptions={[{ value: "0", label: "ALL" }, 
                    //         ...handleReactSelectDropDownOptions(department ? department : "", "ledgerName", "ledgerNumber")]}
                    handleChange={handleMultiSelectChange}
                    value={values?.department}

                />
                <DatePicker
                    className="custom-calendar"
                    id="date"
                    name="FromDate"
                    placeholder={VITE_DATE_FORMAT}
                    value={values?.FromDate ? values?.FromDate : ""}
                    lable={t("From Date")}
                    respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                    handleChange={handleChange}
                />
            </div>
            <div className="row pt-2 px-2">

                <DatePicker
                    className="custom-calendar"
                    id="date"
                    name="ToDate"
                    placeholder={VITE_DATE_FORMAT}
                    value={values?.ToDate ? values?.ToDate : ""}
                    lable={t("To Date")}
                    respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                    handleChange={handleChange}
                />
                <div className="col-xl-1 col-md-2 col-sm-4  col-6">
                    <button className="btn  btn-success px-3" type='button' onClick={getIndentItem}>{t("Search")}</button>
                </div>

            </div>

            {selectedPatient?.PatientID && <>

                <Heading
                    title={t("Patient Details")}
                    isBreadcrumb={false}
                />
                <div className="row p-2">
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Patient Name")}
                                value={selectedPatient?.PName}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("UHID")}
                                value={selectedPatient?.PatientID}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("IPD No.")}
                                value={selectedPatient?.IPDNo}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Age / Gender")}
                                value={`${selectedPatient?.Age}/${selectedPatient?.Gender}`}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Panel Name")}
                                value={selectedPatient?.PanelName}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Ward Name/Bed No.")}
                                value={selectedPatient?.BedDetail}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Indent No.")}
                                value={selectedPatient?.indentno}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Indent Date")}
                                value={selectedPatient?.dtEntry}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Prepared By")}
                                value={selectedPatient?.UserName}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Advance Amount")}
                                value={advanceData?.AdvanceAmount}
                            />
                        </div>
                    </div>
                </div>
            </>}

            {selectedPatient?.PatientID && ipdPackageData?.length > 0 && (
                <div className="card mt-2">
                    <Heading title={t("Package Details")} />
                    <Tables
                        thead={pkgThead}
                        tbody={ipdPackageData?.map((item, index) => ({
                            select: (
                                <Checkbox
                                    className="mt-2"

                                    checked={selectedIPDPkg?.[0]?.LedgerTnxId === item?.LedgerTnxId}
                                    // checked={packageData?.find((item)=> item?.BillNo === selectedPackage?.[0]?.BillNo) ? true : false}
                                    onChange={(e) => {
                                        debugger
                                        const isChecked = e.target.checked;

                                        if (isChecked) {
                                            debugger
                                            const pkg = [{ ...item }]
                                            setSelectedIPDPkg(pkg);
                                            SelectPendingIndent(filterData[selectedIndex], selectedIndex, pkg)

                                        } else {
                                            SelectPendingIndent(filterData[selectedIndex], selectedIndex, [])

                                            setSelectedIPDPkg([]);

                                        }
                                    }}
                                />
                            ),
                            Date: item?.BillDATE,
                            BillNo: item?.BillNo,
                            ReceiptNo: item?.ReceiptNo,
                            pType: item?.TYPE,
                            ipd: item?.IpdNo ? item?.IpdNo : "-",
                            PName: item?.PName,
                            PackageName: item?.PackageName,
                            AmountPaid: item?.AmountPaid,
                            NetAmount: item?.NetAmount,
                            PharmacyAmt: item?.PharmacyAmt ? item?.PharmacyAmt : "0",
                            UtilizePharmacyAmt: item?.UtilizePharmacyAmt
                                ? item?.UtilizePharmacyAmt
                                : "0",
                        }))}
                    />


                </div>
            )}




            {!selectedPatient?.PatientID && filterData?.length > 0 &&
                <>
                    <Heading
                        title={t("Search Item")}
                        secondTitle={
                            <>
                                <span className="pointer-cursor">
                                    {" "}
                                    <ColorCodingSearch
                                        color={"#2ecc71"}
                                        label={t("Acknowledge")}
                                        onClick={() => {
                                            handleCallViewMedReq(1);
                                        }}
                                    />
                                </span>
                                <span className="pointer-cursor">
                                    {" "}
                                    <ColorCodingSearch
                                        color={"#f7dc6f"}
                                        label={t("No Acknowledge")}
                                        onClick={() => {
                                            handleCallViewMedReq(0);
                                        }}
                                    />
                                </span>
                                {/* <span className="pointer-cursor">
                                            {" "}
                                            <ColorCodingSearch
                                                color={"#ffb6c1"}
                                                label={t("Reject")}
                                                // onClick={() => {
                                                //     handleCallViewMedReq("Reject");
                                                // }}
                                            />
                                        </span>
                                        <span className="pointer-cursor">
                                            {" "}
                                            <ColorCodingSearch
                                                color={"#ffff00"}
                                                label={t("Pending")}
                                                // onClick={() => {
                                                //     handleCallViewMedReq("Pending");
                                                // }}
                                            />
                                        </span> */}

                            </>
                        }
                    />
                    <Tables
                        thead={thead}
                        tbody={filterData?.map((val, index) => ({
                            // tbody={bodyData?.map((val, index) => ({
                            sno: index + 1,
                            isAcknowled: val?.Acknowledgment !== 1 ? (<i className="fa fa-plus text-primary text-center" onClick={() => { setAcknowledgmentIndent(val) }} aria-hidden="true"></i>) : "",

                            print: <i className="fa fa-print text-primary text-center py-2" onClick={() => { handlePrint(val) }} aria-hidden="true"></i>,

                            IndentNo:(<strong className='fs-4' >{val?.indentno}</strong>) ,
                            Date: (<strong>{val?.dtEntry}</strong>),

                            IPDNo: (<strong>{val?.IPDNo}</strong>) ,

                            PName: (<strong>{ val?.PName}</strong>),
                            Panel: (<strong>{ val?.PanelName}</strong>) ,
                            IsDischargeMedicine: (
                                <span className="fw-bolder" style={{ color: "#16074dff", fontWeight:"bolder" }}>
                                    {val?.IsDischargeMedicine===1 ? "Yes" : "No" || "-"}
                                </span>
                            ),
                            BillNo: (<strong>{ val?.BedDetail}</strong>) ,
                            
                            DeptFrom: (<strong>{val?.DeptFrom}</strong>) ,
                            UserName: (<strong>{val?.UserName}</strong>) ,
                            StatusNew: (<strong>{val?.StatusNew}</strong>) ,
                            AcknowledgmentBy: (<strong>{val?.AcknowledgmentBy}</strong>) ,
                            EMGNo: (<strong>{ val?.EMGNo}</strong>),
                            
                            ReqQty: val?.ReqQty ?  (<strong>{val?.ReqQty}</strong>) : "0",
                            RejectQty: val?.RejectQty ? (<strong>{val?.RejectQty}</strong>)  : "0",
                            IndentType:  (<strong>{val?.IndentType}</strong>) ,
                            // Select: <span onClick={() => { SelectPendingIndent(val) }}><SelectIconSVG /></span>,

                            // Delete: <i className="fa fa-trash text-danger text-center" onClick={() => { SelectCancelIndent(val) }} aria-hidden="true"></i>,
                            colorcode: val?.Acknowledgment === 1 ? "#2ecc71" : "#f7dc6f",
                        }))}
                        style={{ height: "60vh" }}
                        handleDoubleClick={(e, ind, data) => {
                            debugger
                            handleRowClick(e, ind, data[ind])
                        }}
                        tableHeight={"scrollView"}
                        getWholeArray={filterData}
                    />
                </>

            }



        </>
    )
}
