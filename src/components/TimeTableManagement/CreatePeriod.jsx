import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import TimeInputPicker from "../formComponent/CustomTimePicker/TimeInputPicker";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { notify } from "../../utils/utils";
import { CreatePeriods, GetPeriods } from "../../networkServices/School/Attendance";
import moment from "moment";
import Tables from "../UI/customTable";
// import { createPeriod } from "../../networkServices/Academic/PeriodApi";

function CreatePeriod() {
    const [t] = useTranslation();
    const localData = useLocalStorage("userData", "get");

    const initialState = {
        periodNo: "",
        startTime: "",
        endTime: "",
        durationMinutes: "",
        isBreak: false,
        orgId: localData?.OrganizationId || "",
        branchId: localData?.defaultCentre || "",
    };

    const [values, setValues] = useState(initialState);
    const [periods, setPeriods] = useState([]);

    /* =========================
       Handle Change
    ========================= */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* =========================
       Auto Calculate Duration
    ========================= */
    const calculateDuration = (start, end) => {
        if (!start || !end) return "";

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        let startMin = sh * 60 + sm;
        let endMin = eh * 60 + em;

        if (endMin < startMin) endMin += 24 * 60; // night shift case

        return endMin - startMin;
    };

    /* =========================
       Submit Handler
    ========================= */
    const handleSubmit = async () => {
        if (!values.periodNo || !values.startTime || !values.endTime) {
            notify("Please fill required fields", "error");
            return;
        }

        const payload = {
            periodNo: Number(values.periodNo),
            //   startTime: values.startTime,
            //   endTime: values.endTime,
            startTime: moment(values.startTime, "HH:mm:ss").format("HH:mm:ss"),
            endTime: moment(values.endTime, "HH:mm:ss").format("HH:mm:ss"),
            durationMinutes:
                values.durationMinutes ||
                calculateDuration(values.startTime, values.endTime),
            isBreak: values.isBreak,
            orgId: values.orgId,
            branchId: values.branchId,
        };


        try {
            const response = await CreatePeriods(payload)
            if (response.success) {
                notify(response.message, "success");
                GetPeriodsList()
            }
            else {
                notify(response.message, "error");
            }
        } catch (error) {

        }

        notify("Period Payload Logged in Console", "success");
    };


    const GetPeriodsList = async () => {
        const payload = {
            OrgId: values.orgId,
            BranchId: values.branchId,
            IsActive: 1
        };
        try {
            const response = await GetPeriods(payload);
            if (response.success) {
                setPeriods(response.data);
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(() => {
        GetPeriodsList()
    }, [])
    return (
        <div className="card p-2">
            <Heading title={t("Create Period")} isBreadcrumb={false} />

            <div className="row g-3 mt-1 p-2">

                {/* Period No */}
                <Input
                    className="form-control"
                    lable="Period No"
                    name="periodNo"
                    type="number"
                    value={values.periodNo}
                    onChange={handleChange}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />

                {/* Start Time */}
                <TimeInputPicker
                    lable="Start Time"
                    name="startTime"
                    value={values.startTime}
                    onChange={handleChange}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />

                {/* End Time */}
                <TimeInputPicker
                    lable="End Time"
                    name="endTime"
                    value={values.endTime}
                    onChange={handleChange}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />

                {/* Duration */}
                <Input
                    className="form-control"
                    lable="Duration (Minutes)"
                    name="durationMinutes"
                    type="number"
                    value={
                        values.durationMinutes ||
                        calculateDuration(values.startTime, values.endTime)
                    }
                    onChange={handleChange}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />

                {/* Is Break */}
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center ">
                    <input
                        type="checkbox"
                        name="isBreak"
                        checked={values.isBreak}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="mb-0 fw-bold">Is Break</label>
                </div>

                {/* Save Button */}
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-end">
                    <button
                        className="btn btn-sm btn-success w-100"
                        onClick={handleSubmit}
                    >
                        Save Period
                    </button>
                </div>

            </div>
            <Tables
                thead={[
                    { name: "Period No." },
                    { name: "Start Time" },
                    { name: "End Time" },
                    { name: "durationMinutes" },
                    { name: "isBreak" },
                    // { name: "Icone" },
                    { name: "Action" }
                ]}
                tbody={periods.map((item, index) => ({
                    periodNo: item.periodNo,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    durationMinutes: item.durationMinutes,
                    isBreak: item.isBreak===true?"Yes":"No",
                    // icon: <i class={item.icon}></i>,
                    action: (
                        <div
                            className="d-flex align-items-center justify-content-center gap-2"
                        // className="row gap-2 text-center"
                        >

                            <button
                                id="editBtn"
                                onclick="handleEdit(item.id)"
                                title="Edit"
                                className="d-flex align-items-center justify-content-center"
                            >
                                <i class=" bi-pencil-square"></i>
                            </button>

                            <button
                                id="deleteBtn"
                                onClick={() => handleDelete(item)}
                                title="Delete"
                            >
                                <i class="bi-trash3"></i>
                            </button>
                        </div>
                    )
                }))}
            />
        </div>
    );
}

export default CreatePeriod;

