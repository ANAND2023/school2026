import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";

import moment from "moment";

import ReactSelect from "../../../components/formComponent/ReactSelect";
import { FeedBackSummaryComparisonReportApi } from "../../../networkServices/edpApi";
import { notify } from "../../../utils/ustil2";
import { exportToExcel } from "../../../utils/exportLibrary";

export default function PatientFeedbackSummeryReport() {
    const [t] = useTranslation();
    const [inputs, setInputs] = useState({
        fromMonth: "",
        toMonth: "",
        fromYear: "",
        toYear: "",
        type: "",
        isPdf: "0",
    });

    const TYPE = [
        { value: "1", label: "UHID" },
        { value: "2", label: "IPDNo" },
    ];

    const handleChange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
    };


    const handleGetReport = async () => {
        if (!inputs?.type?.value) {
            notify("Please Select Type", "warn")
            return
        }
        if(!inputs?.fromMonth?.value){
            notify("Please Select From Month", "warn")
            return
        }
        if(!inputs?.toMonth?.value){
            notify("Please Select To Month", "warn")
            return
        }
        if(!inputs?.fromYear?.value){
            notify("Please Select From Year", "warn")
            return
        }
        if(!inputs?.toYear?.value){
            notify("Please Select To Year", "warn")
            return
        }
    

        const payload = {
            "fromMonth": String(inputs?.fromMonth?.value),
            "toMonth": String(inputs?.toMonth?.value),
            "fromYear": String(inputs?.fromYear?.value),
            "toYear": String(inputs?.toYear?.value),
            "PatientType": String(inputs?.type?.value),
            // "isPdf": inputs?.isPdf?.value,

        }
        try {
            const response = await FeedBackSummaryComparisonReportApi(payload)
            if (response?.success) {
                if (response?.data?.pdfUrl) {
                    RedirectURL(response?.data?.pdfUrl)
                } else {
                    exportToExcel(response?.data, "Exel");
                }
            }
            else {
                notify(response?.message, "warn")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleSelect = (name, value) => {
        setInputs((val) => ({ ...val, [name]: value }));

    };

    return (
        <>
            <div className="card patient_registration border">
                <Heading
                    title={t("Feedback Summery Comparison Report")}
                    isBreadcrumb={true}

                />
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Type")}
                        id={"type"}
                        searchable={true}
                        removeIsClearable={false}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={TYPE}
                        handleChange={handleSelect}
                        value={`${inputs?.type?.value}`}
                        name={"type"}
                    />

                    {/* From Month */}
                    <ReactSelect
                        placeholderName={t("From Month")}
                        id={"fromMonth"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={moment.months().map((m, i) => ({
                            label: m,           
                            value: (i + 1).toString(),
                        }))}
                        handleChange={handleSelect}
                        value={inputs?.fromMonth}
                        name={"fromMonth"}
                    />

                    {/* From Year */}
                    <ReactSelect
                        placeholderName={t("From Year")}
                        id={"fromYear"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={Array.from({ length: 10 }, (_, i) => {
                            const year = moment().year() + i;
                            return { label: year.toString(), value: year.toString() };
                        })}
                        handleChange={handleSelect}
                        value={inputs?.fromYear}
                        name={"fromYear"}
                    />

                    {/* To Month */}
                    <ReactSelect
                        placeholderName={t("To Month")}
                        id={"toMonth"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={moment.months().map((m, i) => ({
                            label: m,
                            value: (i + 1).toString(),
                        }))}
                        handleChange={handleSelect}
                        value={inputs?.toMonth}
                        name={"toMonth"}
                    />

                    {/* To Year */}
                    <ReactSelect
                        placeholderName={t("To Year")}
                        id={"toYear"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={Array.from({ length: 10 }, (_, i) => {
                            const year = moment().year() + i;
                            return { label: year.toString(), value: year.toString() };
                        })}
                        handleChange={handleSelect}
                        value={inputs?.toYear}
                        name={"toYear"}
                    />

                    {/* <ReactSelect
                        placeholderName={t("ReportType")}
                        dynamicOptions={[
                            { label: "PDF", value: "1" },
                            { label: "Excel", value: "0" }
                        ]}
                        name="isPdf"
                        value={inputs?.isPdf?.value}
                        respclass="col-xl-1 col-md-4 col-sm-4 col-12"
                        handleChange={handleSelect}
                        requiredClassName="required-fields"
                    /> */}
                    <button
                        className="btn btn-sm btn-info ml-2"
                        type="button"
                        onClick={handleGetReport}
                    >
                        {t("search")}
                    </button>
                </div>
            </div>

            {/* {bodyData?.length > 0 ? (
        <div>
          <Heading
            title={t("Patient Feed Back Reports ")}
            isBreadcrumb={false}
  
          />
          <PatientFeedbackTable setBodyData={setBodyData} bodyData={bodyData} refreshData={searchApiCall}/>
        </div>
      ) : null} */}
        </>
    );
}
