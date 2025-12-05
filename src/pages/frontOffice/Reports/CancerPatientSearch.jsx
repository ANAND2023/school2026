import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import moment from 'moment'
import { t } from 'i18next'
import Input from '../../../components/formComponent/Input'
import { centreWiseCacheDisplayApi } from '../../../networkServices/registrationApi'
import { notify } from '../../../utils/ustil2'
import { exportToExcel } from '../../../utils/exportLibrary'
import { PatientCancerPatientSearch } from '../../../networkServices/opdserviceAPI'

const CancerPatientSearch = () => {
    const dependencyMap = {
        // Country: ["State", "District", "City"],
        State: ["District", "City"],
        District: ["City"],
    };
    const [dropdown, setDropDown] = useState({
        state: [],
        district: [],
        city: [],
    })

    const [values, setValues] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        state: "",
        district: "",
        patientID: "",
    });

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const fetchState = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                setDropDown((prev) => ({
                    ...prev,
                    state: res.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchDistrict = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                setDropDown((prev) => ({
                    ...prev,
                    district: res.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }

    const handleReactSelectoptionDep = (name, selectedOption) => {
        setValues((prev) => {
            let updated = { ...prev, [name]: selectedOption };

            if (dependencyMap[name]) {
                dependencyMap[name].forEach((field) => {
                    updated[field] = null;
                });
            }

            return updated;
        });
    };


    const handleSearch = async()=>{
        try {

            
            if(!values?.state){
                notify("Please Select State", "error")
                return;
            }
            if(!values?.district){
                notify("Please Select district", "error")
                return;
            }
            let payload = {
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        state: Number(values?.state?.value),
        district: Number(values?.district?.value),
        patientID: values?.patientID || "",
    }
            const res = await PatientCancerPatientSearch(payload)

            if(res?.success){
                exportToExcel(res?.data, "Cancer Patient Report")
            }
            else{
                notify(res?.message, "error")
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchState("State");
        fetchDistrict("District");
    }, [])

    console.log(values, "values")
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
                    placeholderName={t("Select State")}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                    requiredClassName={"required-fields"}
                    id={"State"}
                    searchable={true}
                    name={"state"}
                    dynamicOptions={
                        dropdown?.state?.filter((item) => item.CountryID == 14)
                            .map((item) => ({
                                label: item.TextField,
                                value: item.ValueField,
                                ...item
                            }))
                    }
                    handleChange={handleReactSelectoptionDep}
                    value={values?.state}
                    removeIsClearable={false}
                />
                <ReactSelect
                    placeholderName={"Select District"}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                    id={"District"}
                    requiredClassName={"required-fields"}
                    searchable={true}
                    name={"district"}
                    dynamicOptions={
                        dropdown?.district
                            ?.filter(
                                (item) =>
                                    item.StateID ===
                                    (values?.state?.value
                                        ? parseInt(values?.state?.value)
                                        : values?.state)
                            )
                            .map((item) => ({
                                label: item.TextField,
                                value: item.ValueField,
                                ...item
                            }))
                        || []
                    }
                    handleChange={handleReactSelectoptionDep}
                    value={values?.district}
                    removeIsClearable={false}
                />

                <Input
                    type="text"
                    className="form-control"
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

export default CancerPatientSearch