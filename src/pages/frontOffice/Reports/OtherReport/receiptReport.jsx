import React, { useEffect, useState } from 'react'

import ReportDatePicker from '../../../../components/ReportCommonComponents/ReportDatePicker';
import { useTranslation } from 'react-i18next';
import Heading from '../../../../components/UI/Heading';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { BindPaymentModePanelWise } from '../../../../networkServices/PaymentGatewayApi';
import { recieptWiseCollectionReportApi } from '../../../../networkServices/BillingsApi';
import moment from 'moment';
import { notify } from '../../../../utils/ustil2';
import { exportToExcel } from '../../../../utils/exportLibrary';
import { RedirectURL } from '../../../../networkServices/PDFURL';
const ReceiptReport = () => {
    const { t } = useTranslation();

    const [values, setValues] = useState({
        groupType: "All",
        fromDate: new Date(),
        toDate: new Date(),
        fromTime: new Date(),
        endTime: new Date(),
        printType: "0",
        PaymentMode: "All",
        fileType: "1",
    })
    const [paymentMode, setPaymentMode] = useState([]);
    const handleReactSelectChange = (name, e) => {
        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };

    const handleReport = async () => {
        const payload = {
            fromDate: moment(values?.fromDate).format("DD-MM-YYYY"),
            toDate: moment(values?.toDate).format("DD-MM-YYYY"),
            rtype: "1",
            paymentMode: values?.PaymentMode == "All" ? "" : values?.PaymentMode,
            rDept: values?.groupType == "All" ? "" : values?.groupType,
            fileType: Number(values?.fileType)
        }
        try {
            const resp = await recieptWiseCollectionReportApi(payload)
            if (resp?.success) {
                if (payload?.fileType === 0) {
                    const filterField = resp?.data?.map(item => {
                        const { toDate, fromDate, logo, ...rest } = item;
                        return rest;
                    });

                    exportToExcel(filterField, "Receipt Report");
                } else {
                    RedirectURL(resp?.data?.pdfUrl);
                }
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }

    }


    const fetchPaymentMode = async () => {
        try {
            const data = await BindPaymentModePanelWise({
                PanelID: "1",
            });
            setPaymentMode(data?.data);
        } catch (error) {
            console.error("Failed to load currency detail:", error);
        }
    };
    useEffect(() => {
        fetchPaymentMode()
    }, [])
    return (
        <div className="card">
            <Heading isBreadcrumb={false} title={"Receipt Report"} />
            <div className="row p-2">


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

                <ReactSelect
                    placeholderName={t("Group Type")}
                    id={"groupType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    // dynamicOptions={dropDownState}
                    dynamicOptions={[
                        { label: "All", value: "All" },
                        { label: "LAB", value: "LAB" },
                        { label: "OPD", value: "OPD" },
                    ]}
                    name="groupType"
                    handleChange={handleReactSelectChange}
                    value={values?.groupType}
                />
                <ReactSelect
                    placeholderName={t("PaymentMode")}
                    searchable="true"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    name="PaymentMode"
                    id={"defaultPaymentMode"}
                    dynamicOptions={
                        [
                            { label: "All", value: "All" },
                            ...paymentMode.map(pm => (
                                {

                                    value: pm.PaymentMode,
                                    label: pm.PaymentMode
                                }))]}
                    value={values?.PaymentMode}
                    removeIsClearable={true}
                    handleChange={handleReactSelectChange}
                />
                {/* <ReportTimePicker
                    id="fromTime"
                    name="fromTime"
                    lable={t("From Time")}
                    values={values}
                    setValues={setValues}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
                <ReportTimePicker
                    id="endTime"
                    name="endTime"
                    lable={t("end Time")}
                    values={values}
                    setValues={setValues}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                /> */}
                {/* <ReportPrintType
                    placeholderName={t("Print Type")}
                    id="printType"
                    searchable
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    values={values}
                    name={"printType"}
                    setValues={setValues}
                /> */}
                <ReactSelect
                    placeholderName={t("fileType")}
                    id={"fileType"}
                    searchable={true}
                    respclass="col-xl-1 col-md-1 col-sm-3 col-12"
                    dynamicOptions={[
                        { label: "Pdf", value: "1" },
                        { label: "Excel", value: "0" },
                    ]}
                    name="fileType"
                    handleChange={handleReactSelectChange}
                    value={values.fileType}
                />
                <div className="col-sm-1">
                    <button className="btn btn-sm btn-success mx-1" onClick={handleReport} >Report</button>
                </div>
            </div>
        </div>
    )
}

export default ReceiptReport