import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import TimeInputPicker from "../formComponent/CustomTimePicker/TimeInputPicker";
import Tables from "../UI/customTable";

import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { notify } from "../../utils/utils";
import { CreateBellSchedule, GetBellSchedules } from "../../networkServices/School/Attendance";
import ReactSelect from "../formComponent/ReactSelect";


function BellSchedule() {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");

  /* ===================== STATE ===================== */

  const initialState = {
    dayOfWeek: { lable: "Monday", value: "1" },
    ringTime: "",
    bellType: "",
    orgId: localData?.OrganizationId || "",
    branchId: localData?.defaultCentre || "",
  };

  const [values, setValues] = useState(initialState);
  const [bells, setBells] = useState([]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
   const handleSelect = (name, option) => {
    setValues((prev) => ({
      ...prev,
      [name]: option,

    }));
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async () => {
    if (!values.dayOfWeek || !values.ringTime || !values.bellType) {
      notify("Please fill all required fields", "error");
      return;
    }

    const payload = {
      dayOfWeek: Number(values.dayOfWeek?.value),
      ringDateTime: moment(values.ringTime, "HH:mm").toISOString(),
      bellType: values.bellType,
      orgId: values.orgId,
      branchId: values.branchId,
    };

    console.log("Bell Schedule Payload =>", payload);

    try {
      const res = await CreateBellSchedule(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialState);
        // getBellList();
      } else {
        notify(res.message, "error");
      }
    } catch (err) {
      notify("Something went wrong", "error");
    }
  };

  /* ===================== GET LIST ===================== */

  const getBellList = async () => {
    const payload = {
      orgId: values.orgId,
      branchId: values.branchId,
       "dayOfWeek": 2,
  "isActive": 0

//       {
//   "orgId": "string",
//   "branchId": "string",
//   "dayOfWeek": 0,
//   "isActive": 0
// }
    };

    try {
      const res = await GetBellSchedules(payload);
      if (res?.success) setBells(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBellList();
  }, []);

  /* ===================== UI ===================== */

  return (
    <div className="card p-2">
      <Heading title={t("Bell Schedule")} isBreadcrumb={false} />

      <div className="row g-3 mt-1">

        {/* Day of Week */}
        {/* <Input
          lable="Day Of Week (0-Sun, 6-Sat)"
          name="dayOfWeek"
          type="number"
          min="0"
          max="6"
          value={values.dayOfWeek}
          onChange={handleChange}
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
             className="form-control"
        /> */}
        <ReactSelect
                    name="dayOfWeek"
                    placeholderName="dayOfWeek"
                    // dynamicOptions={allUser}
                    dynamicOptions={[
                      { value: "0", label: "Sunday" },
                      { value: "1", label: "Monday" },
                      { value: "2", label: "Tuesday" },
                      { value: "3", label: "Wednesday" },
                      { value: "4", label: "Thursday" },
                      { value: "5", label: "Friday" },
                      { value: "6", label: "Saturday" },
                    ]}
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    handleChange={handleSelect}
                    value={values.dayOfWeek}
                  />

        {/* Ring Time */}
        <TimeInputPicker
          lable="Bell Time"
          name="ringTime"
          value={values.ringTime}
          onChange={handleChange}
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
        />

        {/* Bell Type */}
        <Input
          lable="Bell Type"
          name="bellType"
          placeholder="START / BREAK / END"
          value={values.bellType}
          onChange={handleChange}
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
             className="form-control"
        />

        {/* Save */}
        <div className="col-xl-3 col-md-4 col-sm-6 col-12 d-flex align-items-end">
          <button
            className="btn btn-success w-100"
            onClick={handleSubmit}
          >
            Save Bell
          </button>
        </div>
      </div>

      {/* ===================== TABLE ===================== */}

      <Tables
        thead={[
          { name: "Day" },
          { name: "Time" },
          { name: "Bell Type" }
        ]}
        tbody={bells.map((item) => ({
          Day: item.dayOfWeek,
          Time: moment(item.ringDateTime).format("HH:mm"),
          "Bell Type": item.bellType,
        }))}
      />
    </div>
  );
}

export default BellSchedule;
