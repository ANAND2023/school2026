import React, { useEffect, useState } from 'react';
import Heading from '../UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../formComponent/ReactSelect';
import Input from '../formComponent/Input';
import { handleReactSelectDropDownOptions } from '../../utils/utils';
import { BindEmployeeApproval } from '../../networkServices/edpApi';
import { getPatientDischargeChecklistApi, deletePatientDischargeChecklistApi, createPatientDischargeCheckApi } from '../../networkServices/nursingWardAPI';
import { notify } from '../../utils/ustil2';
import Tables from '../UI/customTable';
import moment from 'moment';
import { ClockSVG } from '../SvgIcons';

const PatientNewDischargeCheckList = ({ data }) => {
     const YESNODROPDOWN = [
        { label: "YES", value: "1" },
        { label: "NO", value: "0" },
    ];
    console.log(data);

    const { transactionID, patientID, admittedBy } = data;
    const { t } = useTranslation();
    const [employee, setEmployee] = useState([]);
    const [trasferList, setTransferList] = useState([]);

    const initalvalue = {
        id: "0",
        explainToPatient: "0",
        dischargeSummaryHandedOver: "0",
        mdeicationsExplained: "0",
        followUpExplained: "0",
        ivcannulaRemoved: "0",
        ivcannulaRemovedRemark: "",
        catheterRemoved: "0",
        catheterRemovedRemark: "",
        reportCollectedList: [],
        reportCollected: "",
        dueReportList: [],
        dueReport: "",
        WheelchairstretcherOnRequest: "0",
        WheelchairstretcherOnRequestRemark: "",
        nameOfRelative: "",
        staff1: "",
        staffHandingOverID: "",
        staffHandingOverName: "",
    };



    const [payload, setPayload] = useState(initalvalue);

    const handleBindEmployeeApproval = async () => {
        try {
            const response = await BindEmployeeApproval();
            if (response.success) {
                setEmployee(response?.data);
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    };
    const handleBindTransferList = async () => {
        try {
            const response = await getPatientDischargeChecklistApi(transactionID, patientID)
            if (response?.success) {
                setTransferList(response?.data)
                notify(response?.message, "success")
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const handleReactSelect = (name, e) => {
        setPayload({
            ...payload,
            [name]: e.value,
        });
    };
    const handleSelect = (name, e) => {
        setPayload({
            ...payload,
            [name]: e,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload({
            ...payload,
            [name]: value,
        });
    };

   


    const getFilteredEmployeeList = (excludeID) =>
        employee?.filter(emp =>
            emp?.employeeID &&
            emp?.name &&
            emp?.employeeID !== excludeID?.value
        ) || [];
    const handleListKeyDown = (field, listField) => (e) => {
        if (e.key === "Enter") {
            const newItem = payload?.[field]?.trim();
            if (!newItem) return;
            const existing = payload?.[listField] || [];
            if (existing.includes(newItem)) return;

            const updatedList = [...existing, newItem];
            setPayload((prev) => ({
                ...prev,
                [field]: "",
                [listField]: updatedList,
            }));
        }
    };

    const removeTag = (field, listField, index = null) => {
        const updatedInputs = { ...payload };
        if (index !== null && Array.isArray(payload?.[listField])) {
            const updatedList = payload?.[listField].filter((_, i) => i !== index);
            setPayload((prev) => ({
                ...prev,
                [field]: '',
                [listField]: updatedList,
            }));
        } else {
            delete updatedInputs[field];
            updatedInputs[field] = '';
            setPayload(updatedInputs);
        }
    };

    const THEAD = [
        { name: "S.No", width: "10%", textAlign: "center" },
        { name: "Entry By", width: "10%", textAlign: "left" },
        { name: "Entry Date", width: "10%", textAlign: "left" },
        { name: "Discharge By", width: "10%", textAlign: "left" },
        { name: "Action", width: "10%", textAlign: "center" },
    ];

    const handleSave = async (type) => {
        try {
            if (!payload?.staff1) {
                notify("please Select Staff1", "warn")
                return;
            }
            const data = {
                id: type === 'Edit' ? Number(payload?.id) : 0,
                explainToPatient: Number(payload?.explainToPatient),
                dischargeSummaryHandedOver: Number(payload?.dischargeSummaryHandedOver),
                mdeicationsExplained: Number(payload?.mdeicationsExplained),
                followUpExplained: Number(payload?.followUpExplained),
                ivcannulaRemoved: Number(payload?.ivcannulaRemoved),
                ivcannulaRemovedRemark: payload?.ivcannulaRemovedRemark,
                catheterRemoved: Number(payload?.catheterRemoved),
                catheterRemovedRemark: payload?.catheterRemovedRemark,
                reportCollected: (payload.reportCollectedList || []).join(', '),
                dueReport: (payload.dueReportList || []).join(', '),
                WheelchairstretcherOnRequest: Number(payload?.WheelchairstretcherOnRequest),
                WheelchairstretcherOnRequestRemark: payload?.WheelchairstretcherOnRequestRemark,
                nameOfRelative: payload?.nameOfRelative,
                staff1: payload?.staff1.value ? payload?.staff1?.value : payload?.staff1,
                staffHandingOverID: payload?.staff1.value ? payload?.staff1?.value : payload?.staff1,
                staffHandingOverName: payload?.staff1?.label ? payload?.staff1?.label : payload?.staff1,
                transactionID: transactionID,
                patientId: patientID,
                EntryByName: "",
                EntryBy: "",
            }

            const response = await createPatientDischargeCheckApi(data)
            if (response?.success) {
                notify(response?.message, "success")
                handleBindTransferList()
                setPayload(initalvalue)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
        console.log(data);

    }

    const handleDelete = async (row) => {
        const payload = {
            id: row?.id
        }
        const response = await deletePatientDischargeChecklistApi(payload)
        if (response?.success) {
            notify(response?.message, "success")
            handleBindTransferList()
        } else {
            notify(response?.message, "error")
        }
    }
    console.log(payload, "payload");
    const handleEditTable = (row) => {

        setPayload({
            ...payload,
            id: row?.id,
            explainToPatient: String(row?.explainToPatient),
            dischargeSummaryHandedOver: String(row?.dischargeSummaryHandedOver),
            mdeicationsExplained: String(row?.mdeicationsExplained),
            followUpExplained: String(row?.followUpExplained),
            ivcannulaRemoved: String(row?.ivcannulaRemoved),
            ivcannulaRemovedRemark: row?.ivcannulaRemovedRemark,
            catheterRemoved: String(row?.catheterRemoved),
            catheterRemovedRemark: row?.catheterRemovedRemark,
            reportCollectedList: typeof row?.reportCollected ? row?.reportCollected?.split(",") : [],
            dueReportList: typeof row?.dueReport ? row?.dueReport?.split(",") : [],
            WheelchairstretcherOnRequest: String(row?.WheelchairstretcherOnRequest),
            WheelchairstretcherOnRequestRemark: row?.WheelchairstretcherOnRequestRemark,
            nameOfRelative: row?.nameOfRelative,
            staff1: { label: row?.staffHandingOverID, value: row?.staffHandingOverName },

        })
    }

    const handleTable = (trasferList) => {
        return trasferList.length > 0 && trasferList?.map((item, index) => {
            return {
                Sno: <div className="text-center">{index + 1}</div>,
                Entry: item?.EntryByName ? item?.EntryByName : "",
                EntryDate: moment(item?.EntryDate).format("DD-MM-YYYY hh:mm A"),
                DischargeBy: item?.staffHandingOverName ? item?.staffHandingOverName : "",
                Action: (
                    <div className="p-1 text-center">
                        <span className="mx-1" onClick={() => handleEditTable(item)}>
                            <i className="fa fa-edit" aria-hidden="true"></i>
                        </span>
                        <span
                            className="mx-1"
                            onClick={() =>
                                handleDelete(item)
                            }
                        >
                            <i className="fa fa-trash text-danger"></i>
                        </span>
                    </div>
                ),
            };
        });

    }
    useEffect(() => {
        handleBindEmployeeApproval()
        handleBindTransferList()
    }, [])
    return (
        <div className="m-2 spatient_registration_card">
            <div className="patient_registration card">
                <Heading title={t("In Patient Discharge Checklist ")} isBreadcrumb={false} />

                <div className="row g-4 m-2 align-items-center">
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="explainToPatient"
                        name="explainToPatient"
                        value={payload?.explainToPatient}
                        placeholderName={t("Discharge Summary explained")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="dischargeSummaryHandedOver"
                        name="dischargeSummaryHandedOver"
                        value={payload?.dischargeSummaryHandedOver}
                        placeholderName={t("Discharge summary handed over")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="mdeicationsExplained"
                        name="mdeicationsExplained"
                        value={payload?.mdeicationsExplained}
                        placeholderName={t("Medications explained")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="followUpExplained"
                        name="followUpExplained"
                        value={payload?.followUpExplained}
                        placeholderName={t("Follow up explained")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="ivcannulaRemoved"
                        name="ivcannulaRemoved"
                        value={payload?.ivcannulaRemoved}
                        placeholderName={t("IV cannula removed (if any)")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.ivcannulaRemoved === "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="ivcannulaRemovedRemark"
                            lable={t("IV cannula removed (if any) Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="ivcannulaRemovedRemark"
                            value={payload?.ivcannulaRemovedRemark} // local input state
                            onChange={handleChange}
                        />
                    )}

                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="catheterRemoved"
                        name="catheterRemoved"
                        value={payload?.catheterRemoved}
                        placeholderName={t("Catheter removed (if any)")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.catheterRemoved === "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="catheterRemovedRemark"
                            lable={t("Catheter removed Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="catheterRemovedRemark"
                            value={payload?.catheterRemovedRemark} // local input state
                            onChange={handleChange}
                        />
                    )}

                    <Input
                        type="text"
                        className="form-control"
                        id="reportCollected"
                        lable={t("All investigation reports handed over")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        name="reportCollected"
                        value={payload?.reportCollected}
                        onChange={handleChange}
                        onKeyDown={handleListKeyDown("reportCollected", "reportCollectedList")}
                    />

                    <Input
                        type="text"
                        className="form-control"
                        id="dueReport"
                        lable={t("Any reports pending")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        name="dueReport"
                        value={payload?.dueReport}
                        onChange={handleChange}
                        onKeyDown={handleListKeyDown("dueReport", "dueReportList")}
                    />

                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="WheelchairstretcherOnRequest"
                        name="WheelchairstretcherOnRequest"
                        value={payload?.WheelchairstretcherOnRequest}
                        placeholderName={t("Wheelchair/stretcher on request")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.WheelchairstretcherOnRequest == "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="WheelchairstretcherOnRequestRemark"
                            lable={t("Wheelchair/stretcher on request Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="WheelchairstretcherOnRequestRemark"
                            value={payload?.WheelchairstretcherOnRequestRemark}
                            onChange={handleChange}
                        />
                    )}

                    <Input
                        type="text"
                        className="form-control"
                        id="nameOfRelative"
                        lable={t("Name of the relative who received")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="nameOfRelative"
                        value={payload?.nameOfRelative}
                        onChange={handleChange}
                    />



                    <ReactSelect
                        placeholderName={t("Name of the staff who discharged")}
                        id={"staff1"}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        name="staff1"
                        dynamicOptions={handleReactSelectDropDownOptions(getFilteredEmployeeList(payload?.staff1),
                            "name",
                            "employeeID"
                        )}
                        handleChange={handleSelect}
                        value={`${payload?.staff1?.value}`}
                    />

                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={() => handleSave(payload?.id !== "0" ? "Edit" : "new")}>
                            {payload?.id == "0" ? t("Save") : t("Update")}
                        </button>
                    </div>
                </div>

                <div className='row g-4 m-2 align-items-center'>

                    {[{ label: "Report Collected", field: "reportCollected", list: "reportCollectedList" },
                    { label: "Due Report", field: "dueReport", list: "dueReportList" }]
                        .map(({ label, field, list }) =>
                            payload?.[list]?.filter((x) => x?.trim?.() !== "").length > 0 && (
                                <div key={field} className="d-flex align-items-center flex-wrap gap-2 mt-2">
                                    <strong className="hover_effect">{t(label)} :</strong>
                                    {payload?.[list]?.map((item, index) => (
                                        <span
                                            key={`${field}-${index}`}
                                            className="tag hover_effect"
                                            style={{
                                                backgroundColor: '#F5EDED',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                marginRight: '6px',
                                            }}
                                        >
                                            <span className="pl-1">{item}</span>
                                            <span
                                                className="tag-close-icon"
                                                onClick={() => removeTag(field, list, index)}
                                                style={{ marginLeft: '6px', cursor: 'pointer' }}
                                            >
                                                <i className="fa fa-times-circle" aria-hidden="true"></i>
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            )
                        )}
                </div>
                <Tables thead={THEAD} tbody={handleTable(trasferList)} />
            </div>
        </div>
    );
};

export default PatientNewDischargeCheckList;
