import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../../components/UI/Heading';
import ReportDatePicker from '../../../../components/ReportCommonComponents/ReportDatePicker';
import moment from 'moment';
import { addmissionReportApi } from '../../../../networkServices/BillingsApi';
import { RedirectURL } from '../../../../networkServices/PDFURL';
import { exportToExcel } from '../../../../utils/exportLibrary';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { notify } from '../../../../utils/ustil2';

const DischargeTypeWiseReport = () => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        fileType: "1",
        dischargeType:""
    }
    const [values, setValues] = useState({ ...initialValues });
    const handleReactSelectChange = (name, e) => {
        // debugger
        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };
    const handleReport = async () => {
        debugger
        const payload = {
            fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
            toDate: moment(values?.toDate).format("YYYY-MM-DD"),
            rType: "1",
            dateType: "2",
            dischargeType: values?.dischargeType,
            fileType: Number(values?.fileType)
        }
        try {
            const response = await addmissionReportApi(payload);
            if (response?.success) {
                if (payload?.fileType == "0") {
                    const filterField = response?.data?.map(item => {
                        const { toDate, reportName, fromDate, logo, ...rest } = item;
                        return rest;
                    });
                   
                    exportToExcel(filterField, "Dispatch Type Wise Report");
                } else {
                    RedirectURL(response?.data?.pdfUrl);
                }
            } else {
                notify(response?.message || "Error fetching report", "error");
            }
        } catch (error) {
            console.error("Census report fetch failed", error);
            notify("Something went wrong", "error");
        }
    }
    return (
        <div className="card">
            <Heading isBreadcrumb={false} title={"Patient Addmission Report"} />
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
                    placeholderName={t("dischargeType")}
                    id={"dischargeType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                    dynamicOptions={[
                        { label: "Normal", value: "Normal" },
                        { label: "LAMA", value: "LAMA" },
                        { label: "Absconding", value: "Absconding" },
                        { label: "Discharge On Request", value: "Discharge On Request" },
                        { label: "Death", value: "Death" },
                        { label: "Patient On Leave", value: "Patient On Leave" },
                        { label: "Referred", value: "Referred" },
                    ]}
                    name="dischargeType"
                    handleChange={handleReactSelectChange}
                    value={values.dischargeType}
                />
                <ReactSelect
                    placeholderName={t("fileType")}
                    id={"fileType"}
                    searchable={true}
                    respclass="col-xl-1 col-md-2 col-sm-3 col-12"
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

export default DischargeTypeWiseReport;