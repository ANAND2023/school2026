import React, { useEffect, useState } from 'react';
import Heading from '../UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../formComponent/ReactSelect';
import Input from '../formComponent/Input';
import { handleReactSelectDropDownOptions } from '../../utils/utils';
import { BindEmployeeApproval, createPatientTransferCheckApi } from '../../networkServices/edpApi';
import { getPatientTransferChecklistApi,deletePatientTransferChecklistApi } from '../../networkServices/nursingWardAPI';
import { notify } from '../../utils/ustil2';
import Tables from '../UI/customTable';
import moment from 'moment';
import { GetAllAuthorization } from '../../networkServices/BillingsApi';

const InPatientTransferCheckListPage = ({ data }) => {
    console.log(data);
    const [authorizationList, setAuthorizationList] = useState({});
    const { transactionID, patientID, admittedBy } = data;
    const { t } = useTranslation();
    const [employee, setEmployee] = useState([]);
    const [trasferList, setTransferList] = useState([]);
    const initalvalue = {
        id: "0",
        doctorOrder: "0",
        explainToPatient: "0",
        beadBook: "0",
        informToDepartment: "0",
        reportCollectedList: [],
        dueReportList: [],
        reportCollected: "",
        dueReport: "",
        pendingConsultation: "0",
        documentationCompleted: "0",
        bedScoreSkinPill: "0",
        bedScoreSkinPillRemark: '',
        anyDrinage: "0",
        anyDrinageRemark: "",
        rylesTubePast: "0",
        rylesTubePastRemark: "",
        npo: "0",
        urinaryCatheter: "0",
        physicalHandicap: "0",
        physicalHandicapRemark: "",
        isPatientVulnerable: "0",
        staff1: "",
        staff2: "",
        staffHandingOverID: "",
        staffHandingOverName: "",
        staffTakingOverID: "",
        staffTakingOverName: ""
    }
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
            const response = await getPatientTransferChecklistApi(transactionID, patientID)
            if (response?.success) {
                setTransferList(response?.data)
                notify(response?.message, "success")
            } else {
                setTransferList([])
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

    const YESNODROPDOWN = [
        { label: "YES", value: "1" },
        { label: "NO", value: "0" },
    ];


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
        // { name: "Subject", width: "10%", textAlign: "left" },
        // { name: "Notes", width: "20%", textAlign: "left" },
        { name: "Entry By", width: "10%", textAlign: "left" },
        { name: "Entry Date", width: "10%", textAlign: "left" },
        { name: "Staff Handing Over Name", width: "10%", textAlign: "left" },
        { name: "Staff Taking Over Name", width: "10%", textAlign: "left" },
        { name: "Action", width: "10%", textAlign: "center" },
    ];

    const handleSave = async (type) => {
        try {
            if (!payload?.staff1) {
                notify("please Select Staff1", "warn")
                return;
            }
            if (!payload?.staff2) {
                notify("please Select Staff2", "warn")
                return;
            }
            if (payload?.staff1?.value === payload?.staff2?.value) {
                debugger
                notify("plese Select Diffrent Staff", "warn")
                return;
            }
            const data = {
                id: type === 'Edit' ? Number(payload?.id) : 0,
                doctorOrder: Number(payload?.doctorOrder),
                explainToPatient: Number(payload?.explainToPatient),
                beadBook: Number(payload?.beadBook),
                informToDepartment: Number(payload?.informToDepartment),
                reportCollected: (payload.reportCollectedList || []).join(', '),
                dueReport: (payload.dueReportList || []).join(', '),
                pendingConsultation: Number(payload?.pendingConsultation),
                documentationCompleted: Number(payload?.documentationCompleted),
                bedScoreSkinPill: Number(payload?.bedScoreSkinPill),
                bedScoreSkinPillRemark: payload?.bedScoreSkinPillRemark,
                anyDrinage: Number(payload?.anyDrinage),
                anyDrinageRemark: payload?.anyDrinageRemark,
                rylesTubePast: Number(payload?.rylesTubePast),
                rylesTubePastRemark: payload?.rylesTubePastRemark,
                physicalHandicap: Number(payload?.physicalHandicap),
                physicalHandicapRemark: payload?.physicalHandicapRemark,
                isPatientVulnerable: Number(payload?.isPatientVulnerable),
                staffTakingOverID: payload?.staff1.value ? payload?.staff1?.value : payload?.staff1,
                staffTakingOverName: payload?.staff1?.label ? payload?.staff1?.label : payload?.staff1,
                staffHandingOverID: payload?.staff2.value ? payload?.staff2?.value : payload?.staff2,
                staffHandingOverName: payload?.staff2?.label ? payload?.staff2?.label : payload?.staff2,
                npo: Number(payload?.npo),
                urinaryCatheter: Number(payload?.urinaryCatheter),
                transactionID: transactionID,
                patientId: patientID,
            }
            debugger
            const response = await createPatientTransferCheckApi(data)
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

    const handleDelete=async(row)=>{
        debugger
        if(authorizationList?.CanDeleteNursingData === 0 ){
            notify("Unauthorized","error")
            return false;
        }
        const payload={
            id:row?.ID
        }
        const response=await deletePatientTransferChecklistApi(payload)
        if(response?.success){
            notify(response?.message,"success")
            handleBindTransferList()
        }else{
            notify(response?.message,"error")
        }
    }

    const handleEditTable = (row) => {
        debugger
        if(authorizationList?.CanEditNursingForm === 0 ) {
            notify("Unauthorized","error")
            return false;
        }
        setPayload({
            ...payload,
            id: row?.ID,
            doctorOrder: String(row?.DoctorOrder),
            explainToPatient: String(row?.ExplainToPatient),
            beadBook: String(row?.BeadBook),
            informToDepartment: String(row?.InformToDepartment),
            reportCollectedList: typeof row?.ReportCollected ? row?.ReportCollected?.split(",") : [],
            dueReportList: typeof row?.DueReport ? row?.DueReport?.split(",") : [],
            pendingConsultation: String(row?.PendingConsultation),
            documentationCompleted: String(row?.DocumentationCompleted),
            bedScoreSkinPill: String(row?.BedScoreSkinPill),
            bedScoreSkinPillRemark: row?.BedScoreSkinPillRemark,
            anyDrinage: String(row?.AnyDrainage),
            anyDrinageRemark: row?.AnyDrinageRemark,
            rylesTubePast: String(row?.RylesTubePast),
            rylesTubePastRemark: row?.RylesTubePastRemark,
            npo: String(row?.Npo),
            urinaryCatheter: String(row?.UrinaryCatheter),
            physicalHandicap: String(row?.PhysicalHandicap),
            physicalHandicapRemark: row?.PhysicalHandicapRemark,
            isPatientVulnerable: String(row?.IsPatientVulnerable),
            // staffTakingOverID: row?.staff1?.value ? row?.staff1?.value : row?.staff1,
            // staffTakingOverName: row?.staff1?.label ? row?.staff1?.label : row?.staff1,
            // staffHandingOverName: row?.StaffHandingOverName ? row?.StaffHandingOverName : "",
            // staffHandingOverID: row?.StaffHandingOverID ? row?.StaffHandingOverID:"",
            staff1: { label: row?.StaffHandingOverName, value: row?.StaffHandingOverID },
            staff2: { label: row?.StaffTakingOverName, value: row?.StaffTakingOverID },

        })
    }

    const handleTable = (trasferList) => {
        return  trasferList.length > 0 && trasferList?.map((item, index) => {
            return {
                Sno: <div className="text-center">{index + 1}</div>,
                Entry: item?.EntryBy,
                EntryDate: moment(item?.EntryDate).format("DD-MM-YYYY hh:mm A"),
                StaffHandingOverName: item?.StaffHandingOverName,
                StaffTakingOverName: item?.StaffTakingOverName,
                Action: (
                    <div className="p-1 text-center">
                        <span className="mx-1" onClick={() => 
                            
                            handleEditTable(item)}>
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

    const getAllAuthorization = async () => {
        try {
            const response = await GetAllAuthorization();
            if (response?.success) {
                setAuthorizationList(response?.data[0]);
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    useEffect(() => {

        handleBindEmployeeApproval()
        handleBindTransferList()
        getAllAuthorization()
    }, [])
    return (
        <div className="m-2 spatient_registration_card">
            <div className="patient_registration card">
                <Heading title={t("In Patient Transfer")} isBreadcrumb={false} />

                <div className="row g-4 m-2 align-items-center">
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="doctorOrder"
                        name="doctorOrder"
                        value={payload?.doctorOrder}
                        placeholderName={t("Doctor's Order")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="explainToPatient"
                        name="explainToPatient"
                        value={payload?.explainToPatient}
                        placeholderName={t("Explained To Patient")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="beadBook"
                        name="beadBook"
                        value={payload?.beadBook}
                        placeholderName={t("Bed Booked")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="informToDepartment"
                        name="informToDepartment"
                        value={payload?.informToDepartment}
                        placeholderName={t("informed To Department")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />

                    <Input
                        type="text"
                        className="form-control"
                        id="reportCollected"
                        lable={t("Report Collected")}
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
                        lable={t("Due Report")}
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
                        id="pendingConsultation"
                        name="pendingConsultation"
                        value={payload?.pendingConsultation}
                        placeholderName={t("pending Consultation")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="documentationCompleted"
                        name="documentationCompleted"
                        value={payload?.documentationCompleted}
                        placeholderName={t("documentation Completed")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="bedScoreSkinPill"
                        name="bedScoreSkinPill"
                        value={payload?.bedScoreSkinPill}
                        placeholderName={t("bed Sore/ Skin Peel")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.bedScoreSkinPill === "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="bedScoreSkinPillRemark"
                            lable={t("bed Score Skin Pill Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="bedScoreSkinPillRemark"
                            value={payload?.bedScoreSkinPillRemark} // local input state
                            onChange={handleChange}
                        />
                    )}
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="anyDrinage"
                        name="anyDrinage"
                        value={payload?.anyDrinage}
                        placeholderName={t("any Drainage")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.anyDrinage == "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="anyDrinageRemark"
                            lable={t("any Drainage Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="anyDrinageRemark"
                            value={payload?.anyDrinageRemark}
                            onChange={handleChange}
                        />
                    )}
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="rylesTubePast"
                        name="rylesTubePast"
                        value={payload?.rylesTubePast}
                        placeholderName={t("ryles Tube Past")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload.rylesTubePast == "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="rylesTubePastRemark"
                            lable={t("ryles Tube Past Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            name="rylesTubePastRemark"
                            value={payload?.rylesTubePastRemark}
                            onChange={handleChange}
                        />
                    )}
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="npo"
                        name="npo"
                        value={payload?.npo}
                        placeholderName={t("npo")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="urinaryCatheter"
                        name="urinaryCatheter"
                        value={payload?.urinaryCatheter}
                        placeholderName={t("urinary Catheter")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="physicalHandicap"
                        name="physicalHandicap"
                        value={payload?.physicalHandicap}
                        placeholderName={t("physically Handicapped")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />
                    {payload?.physicalHandicap == "1" && (
                        <Input
                            type="text"
                            className="form-control"
                            id="physicalHandicapRemark"
                            lable={t("physically Handicapped Remark")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            name="physicalHandicapRemark"
                            value={payload?.physicalHandicapRemark}
                            onChange={handleChange}
                        />
                    )}
                    <ReactSelect
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        id="isPatientVulnerable"
                        name="isPatientVulnerable"
                        value={payload?.isPatientVulnerable}
                        placeholderName={t("is Patient Vulnerable")}
                        removeIsClearable={true}
                        dynamicOptions={YESNODROPDOWN}
                        handleChange={handleReactSelect}
                    />

                    <ReactSelect
                        placeholderName={t("handed Over by")}
                        id={"staff1"}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        name="staff1"
                        // dynamicOptions={[
                        //     ...handleReactSelectDropDownOptions(getFilteredEmployeeList(payload?.staff2), "name", "employeeID"),
                        // ]}
                        dynamicOptions={handleReactSelectDropDownOptions(
                            getFilteredEmployeeList(payload?.staff2),
                            "name",
                            "employeeID"
                        )}
                        handleChange={handleSelect}
                        value={`${payload?.staff1?.value}`}
                    />
                    <ReactSelect
                        placeholderName={t("Taken Over By")}
                        id="staff2"
                        name="staff2"
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        dynamicOptions={handleReactSelectDropDownOptions(
                            getFilteredEmployeeList(payload?.staff1),
                            "name",
                            "employeeID"
                        )}
                        handleChange={handleSelect}
                        value={payload?.staff2?.value}
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

export default InPatientTransferCheckListPage;
