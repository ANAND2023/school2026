import React, { useEffect, useState } from 'react'

import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Heading from '../UI/Heading';
import DatePicker from '../formComponent/DatePicker';
import TimePicker from '../formComponent/TimePicker';
import { notify } from '../../utils/ustil2';
import { plannedDischargeEntryApi, savePlannedDischargeEntryApi } from '../../networkServices/nursingWardAPI';

function PlannedDischargeEntry({ data }) {
    const [values, setValues] = useState({
        date: "",
        time: "",
    })
    const [isDisabled, setIsDisabled] = useState(false);

    const { VITE_DATE_FORMAT } = import.meta.env;
    // const [data, setData] = useState([]);
    const [t] = useTranslation();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleGetDischargeData = async () => {
        const payload = { transactionID: data?.transactionID };
        try {
            const response = await plannedDischargeEntryApi(payload);
            if (response?.success) {
                const dateTime = response?.data;

const [date, time] = dateTime.split(" "); // ["2025-09-15", "14:35:00"]

setValues({
  date: date,              // "2025-09-15"
  time: time.slice(0, 5),  // "14:35"
})
                setIsDisabled(true)
                // setValues({ date: "", time: "" })
                // console.log("response dsnjd",response)
            } else {
                // notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }

    }
    console.log(values, "values")

    const handleSave = async () => {
        const date = moment(values.date); // base date
        const time = moment(values.time); // base time

        const dateTime = date
            .set("hour", time.hour())
            .set("minute", time.minute())
            .set("second", time.second());

        const formatted = dateTime.format("YYYY-MM-DD HH:mm:ss");
        const payload = {
            transactionID: data?.transactionID,
            planDate: formatted,
        }
        try {
            const response = await savePlannedDischargeEntryApi(payload);
            if (response?.success) {

                notify(response?.message, "success");

            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }

    useEffect(() => {
        handleGetDischargeData();
    }, [])

    return (
        <>
            <div className="mt-2 card">
                <Heading isBreadcrumb={true} />
                <div className="row p-2">
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="date"
                        name="date"
                        value={
                            values.date
                                ? moment(values?.date, "YYYY-MM-DD").toDate()
                                : null
                        }
                        minDate={new Date()}
                        handleChange={handleChange}
                        lable={t("Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    {/* <TimePicker
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="time"
                        name="time"
                        value={
                            values.time
                                ? moment(values?.time, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("Time")}
                        placeholder={VITE_DATE_FORMAT}
                    /> */}
                    <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                        {/* <button className="btn btn-sm btn-primary me-2" onClick={handleSave} disabled={isDisabled}>
                            {t("Save")}
                        </button> */}
                        <button
                          disabled={data?.status==="OUT"?true:false}
                        className="btn btn-sm btn-primary me-2" onClick={handleSave}>
                            {t("Save")}
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default PlannedDischargeEntry