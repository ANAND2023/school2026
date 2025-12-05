import { useTranslation } from "react-i18next";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useState } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import moment from "moment/moment";
import { BillingCMSUtilizationReport } from "../../../../networkServices/MRDApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { notify } from "../../../../utils/ustil2";
import Input from "../../../../components/formComponent/Input";


const CMSUtilizationReport = ({ eportTypeID }) => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        PatientType: "0",
        BillingType: "",
        ReportType: "",
        Type: "0",
        UHID: ""
    }

    const [values, setValues] = useState({ ...initialValues });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleReactSelectChange = (name, e) => {
        // debugger
        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };


    const HandleReport = async () => {
        const payload =

        {
            "periodFrom": moment(values?.fromDate).format("YYYY-MM-DD"),
            "periodTo": moment(values?.toDate).format("YYYY-MM-DD"),
            "patientID": String(values?.UHID),
            "isActive": Number(values?.PatientType),
            "fileType": Number(values?.Type)
        }
      

        try {
            const response = await BillingCMSUtilizationReport(payload);

            if (response?.success) {
               if(values?.Type==="0"){
                    exportToExcel(response?.data, "CMSUtilizationReport");
                } else {
                    RedirectURL(response?.data?.pdfUrl);
                }
            } else {
                notify(response?.message || "Error fetching report", "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };

    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={false} title={"CMS Utilization Report"} />
                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fieldss"
                        id="UHID"
                        name="UHID"
                        lable={t("UHID")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        onChange={handleChange}
                        value={values.UHID}
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
                    <ReactSelect
                        placeholderName={t("Patient Type")}
                        id={"PatientType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        // dynamicOptions={dropDownState}
                        dynamicOptions={[
                            { label: "All", value: "0" },
                            { label: "Active", value: "1" },
                            { label: "DeActive", value: "2" },
                        ]}
                        name="PatientType"
                        handleChange={handleReactSelectChange}
                        value={values?.PatientType}
                    />
                    {console.log(values)}
                    {/* <ReactSelect
                        placeholderName={t("Report Type")}
                        id={"ReportType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        // dynamicOptions={dropDownState}
                        dynamicOptions={values?.PatientType === "2" ?
                            [
                                { label: "Detail ", value: "1" },

                            ]
                            : [
                                { label: "Detail ", value: "1" },
                                { label: "Summary", value: "2" },
                            ]
                        }
                        name="ReportType"
                        handleChange={handleReactSelectChange}
                        value={values?.ReportType

                        }
                    /> */}


                    {/* {(values?.PatientType == 1 || values?.PatientType == 2) && values?.ReportType == 2
                        &&
                        <ReactSelect
                            placeholderName={t("Billing Type")}
                            id={"BillingType"}
                            searchable={true}
                            respclass="col-xl-2 col-md-2 colt-sm-4 col-12"
                            // dynamicOptions={dropDownState}
                            dynamicOptions={[
                                { label: "Doctor Wise ", value: "1" },
                                { label: "Panel Wise", value: "2" },
                                { label: "Department Wise", value: "3" },
                            ]}
                            name="BillingType"
                            handleChange={handleReactSelectChange}
                            value={values?.BillingType}
                        />

                    } */}

                    <ReactSelect
                        placeholderName={t("File Type")}
                        id={"Type"}
                        searchable={true}
                        respclass="col-xl-1 col-md-2 col-sm-3 col-12"

                        dynamicOptions={[
                            { label: "Pdf", value: "1" },
                            { label: "Excel", value: "0" },

                        ]}

                        name="Type"
                        handleChange={handleReactSelectChange}
                        value={values?.Type}
                    />

                    <div className="col-sm-1">
                        <button className="btn btn-sm btn-success mx-1" onClick={HandleReport} >Report</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CMSUtilizationReport