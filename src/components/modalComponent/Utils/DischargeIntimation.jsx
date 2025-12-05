import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TimePicker from "../../formComponent/TimePicker";
import DatePicker from "../../formComponent/DatePicker";
import moment from "moment";

const DischargeIntimation = ({ Step, getPayloadData, secModalData, data }) => {
  const [t] = useTranslation();

  const { VITE_DATE_FORMAT } = import.meta.env;
  const initialValues = {
    date: new Date(),
    startTime: new Date(),
  };
  const admitDateObj = data?.admitDate
    ? moment(data.admitDate, "DD-MMM-YYYY hh:mm A").toDate()
    : null;
  const [payload, setPayload] = useState({ ...initialValues });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  console.log("secModalData", secModalData);
  useEffect(() => {
    getPayloadData(payload);
  }, [payload]);
  console.log(payload?.date)
  console.log(payload?.startTime)
  return (
    <>
      <div className="row">
        <DatePicker
          className={`custom-calendar `}
          respclass={"col-xl-6 col-md-6 col-sm-6 col-12"}
          id="date"
          name="date"
          value={payload?.date ? payload?.date : new Date()}
          handleChange={handleChange}
          lable={t("Date")}
          minDate={admitDateObj}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <TimePicker
          placeholderName={t("Time")}
          lable={t("Time")}
          respclass={"col-xl-6 col-md-6 col-sm-6 col-12"}
          id="startTime"
          name="startTime"
          value={payload?.startTime}
          handleChange={handleChange}
          className="required-fields"
        />
      </div>
    </>
  );
};

export default DischargeIntimation;
