

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../../components/UI/Heading';
import ReportDatePicker from '../../../../components/ReportCommonComponents/ReportDatePicker';
import moment from 'moment';
import { BillingBedOccupancyReport } from '../../../../networkServices/BillingsApi';
import { RedirectURL } from '../../../../networkServices/PDFURL';
import { exportToExcel } from '../../../../utils/exportLibrary';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { notify } from '../../../../utils/ustil2';
const BedOccupancy = () => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        fileType: "1",
        billType: "0",
        categoryId: "",
        ReportType: "",
        doctor: [],
        Panel: [],
        isLogo: { value: false }

    }
    const [values, setValues] = useState({ ...initialValues });
    const handleReactSelectChange = (name, e) => {

        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };
    const handleReport = async () => {
        const payload =
        {
  "asOnDate":  moment(values?.toDate).format("YYYY-MM-DD"),
  "printType": Number(values?.fileType ?? 1),
}
        // {
        //     "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
        //     "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
        //     "printType": Number(values?.fileType ?? 1),
        // }
        try {
            const response = await BillingBedOccupancyReport(payload);
            if (response?.success) {
                if (values?.fileType == 0) {

                    exportToExcel(response?.data?.reportData,`Bed Occupancy Report ${moment(values?.toDate).format("YYYY-MM-DD")}`);
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
            <Heading isBreadcrumb={false} title={"Bed Occupancy Report"} />
            <div className="row p-2">

                {/* <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("fromDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                /> */}

                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("asOnDate")}
                    values={values}
                    setValues={setValues}
                    max={new Date()}
                    // min={values?.fromDate}
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

export default BedOccupancy;