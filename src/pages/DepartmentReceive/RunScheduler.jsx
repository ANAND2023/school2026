import React, { useState } from 'react'
import Heading from '../../components/UI/Heading'
import ReactSelect from '../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import DatePicker from '../../components/formComponent/DatePicker'
import moment from 'moment'
import { notify } from '../../utils/ustil2'
import { runManualSchedularApi } from '../../networkServices/edpApi'

const RunScheduler = () => {
    const [t] = useTranslation()
    const [values, setValues] = useState({
        room: "",
        date: new Date(),
        item: ""
    })
    const roomtype = [
        { label: "Room Charges", value: "0" },
        { label: "Other", value: "1" }
    ]
    const itemData = [
        { label: "All", value: "2713,867,2723,23621" },
        { label: "nursing charges", value: "2713" },
        { label: "RMO CHARGES", value: "867" },
        { label: "BIO HAZARD CHARGES", value: "2723" },
        { label: "DAILY DOCTORS VISIT", value: "23621" },

    ]
    const { VITE_DATE_FORMAT } = import.meta.env;

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };
    console.log(values);

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    };
    const handleRunScheduler = async () => {
        if (!values?.room.value) {
            return notify("Please Select Room Type", "warn")
        }
        if (values?.room?.value == "1" && !values?.item?.value) {
            return notify("Plese Select Item Type", "warn")
        }
        const payload = {
            type: values?.room?.value,
            date: values?.date ? moment(values?.date).format("DD-MM-YYYY") : "",
            item: values?.item?.value ?? ""
        }
        try {
            const resp = await runManualSchedularApi(payload)
            if(resp?.success){
                notify(resp?.message,"success")
            }else{
                notify(resp?.message,"error")
            }
        } catch (error) {
            notify(error?.message,"error")
        }
    }
    return (
        <div className=" spatient_registration_card card">
            <Heading
                title={t("/Room Scheduler")}
                isSlideScreen={true}
                isBreadcrumb={true}
            />
            <div className='row p-2'>
                <ReactSelect
                    placeholderName={t("Room Type")}
                    id={"room"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={roomtype}
                    handleChange={handleSelect}
                    value={`${values?.room?.value}`}
                    name={"room"}
                />

                <DatePicker
                    className="custom-calendar"
                    id="Date"
                    name="date"
                    value={values?.date || new Date()}
                    handleChange={handleChange}
                    lable={t("Date")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}

                />
                {values?.room?.value !== "0" &&
                    <ReactSelect
                        placeholderName={t("Item")}
                        id={"item"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={itemData}
                        handleChange={handleSelect}
                        value={`${values?.item?.value}`}
                        name={"item"}
                    />
                }

                <button className='btn btn-primary' onClick={handleRunScheduler}>
                    Run
                </button>

            </div>
        </div>
    )
}

export default RunScheduler;