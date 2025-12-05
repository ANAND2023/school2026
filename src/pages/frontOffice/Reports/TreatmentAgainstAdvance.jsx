import React from 'react'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Input from '../../../components/formComponent/Input'
import { t } from 'i18next'
import moment from 'moment'
import { PatientGetTreatmentAgstAdvance } from '../../../networkServices/opdserviceAPI'
import { notify } from '../../../utils/ustil2'
import { exportToExcel } from '../../../utils/exportLibrary'

const TreatmentAgainstAdvance = () => {

    const [values, setValues] = React.useState({
        fromDate: new Date(),
        toDate: new Date(),
        patientID: "",
        type: { label: "Summary", value: "0" }
    })


    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const handleReactSelect = (name, value) => {

        setValues((val) => ({ ...val, [name]: value }));
    };

    const handleSearch = async () => {

        try {

            if(values?.type?.value ==="1" && !values?.patientID) {
                notify("Patient ID is Required for Detailed Report", "error");
                return;
            }
            let payload = {
                fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                patientID: values?.patientID || "",
                type: Number(values?.type?.value)
            }
            
            const response = await PatientGetTreatmentAgstAdvance(payload);

            if (response?.success) {
                    exportToExcel(response?.data, values?.type?.value === "0" ? "Treatment Against Advance summary Report" : "Treatment Against Advance Detailed Report");
            } else {
                notify(response?.message, "error")
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="card patient_registration border">
            <Heading
                title={t("Search_Criteria")}
                isBreadcrumb={true}
            />
            <div className="row pt-2 px-2">
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    value={moment(values?.fromDate).toDate()}
                    handleChange={handleChange}
                    lable={t("From Date")}

                />

                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    value={moment(values?.toDate).toDate()}
                    handleChange={handleChange}
                    lable={t("To Date")}

                />

                <ReactSelect
                    placeholderName={"Report Type"}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                    id={"District"}
                    requiredClassName={"required-fields"}
                    searchable={true}
                    name={"type"}
                    dynamicOptions={
                        [
                            { label: "Summary", value: "0" },
                            { label: "Detailed", value: "1" },

                        ]
                    }
                    handleChange={handleReactSelect}
                    value={values?.type?.value}
                    removeIsClearable={false}
                />

                <Input
                    type="text"
                    // className={`form-control required-fields `}
                    className={`form-control ${values?.type?.value === "1" ? "required-fields" : ""}`}
                    id="patientID"
                    name="patientID"
                    lable={t("UHID")}
                    placeholder=" "
                    value={values?.patientID}
                    onChange={handleChange}
                    required={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />



                <button
                    className="btn btn-sm btn-info ml-2"
                    type="button"
                    onClick={handleSearch}
                >
                    {t("search")}
                </button>

            </div>



        </div>
    )
}

export default TreatmentAgainstAdvance