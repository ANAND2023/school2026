import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import TimePicker from '../../../components/formComponent/TimePicker';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import { filterByType } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import { CentreWiseCacheByCenterID } from '../../../store/reducers/common/CommonExportFunction';
import { notify } from '../../../utils/ustil2';
import {
    getConditionOfPatientDropdownApi, createMedicolegalReportApi, getMedicolegalReportApi,
    deleteMedicolegalReportApi, medicoLegalReportApi
} from '../../../networkServices/nursingWardAPI';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import moment from 'moment';
import Tables from '../../../components/UI/customTable';
import { exportToExcel } from '../../../utils/exportLibrary';
import { RedirectURL } from '../../../networkServices/PDFURL';
import { MRDPatientInfoApi } from '../../../networkServices/MRDApi';

const MlcLabReport = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const type = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" }
    ]
    const [patientRaw, setPatientRaw] = useState(null);

    const [values, setValues] = useState({
        id: "",
        Id: "",
        TimeOfArrival: "",
        other: "",
        SampleCollected: "0",
        DetailOfSample: "",
        ConditionOfPatient: "",
        ConditionOfPatientId: "",
        RelationId: 0,
        Relation: "",
        ExaminingDoctorId: "",
        ExaminingDoctor: "",
        ReportSentToPolice: "",
        DateHourOfArrival: "",
        DateHourOther: "",
        DateOfAdmission: "",
        DateOfArrival: "",
        DateOfDischarge: "",
        fromDate: new Date(),
        toDate: new Date(),
    })
    const [datalist, setDataList] = useState([])
    const [patientDropdown, setPatientDropdown] = useState([]);


    const Thead = [
        { name: t("S.No."), width: "3%" },
        { name: t("Reg No"), width: "10%" },
        { name: t("PatientName"), width: "10%" },
        { name: t("EntryBy"), width: "10%" },
        { name: t("Entry Date"), width: "10%" },
        { name: t("Entry Time"), width: "10%" },
        { name: t("Accompancy By"), width: "10%" },
        { name: t("Relation"), width: "10%" },
        { name: t("ID"), width: "10%" },
        { name: t("Action"), width: "10%" },
    ]


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleChangeDate = (e) => {
        const { name, value } = e.target;

        let input = value

        const dateRegex =
            /^(\d{1,2})([\/-])(\d{1,2})\2(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;

        if (dateRegex.test(input)) {
            let [, dd, , mm, yyyy, hh, min, ampm] = input.match(dateRegex);

            dd = dd.padStart(2, "0");
            mm = mm.padStart(2, "0");
            hh = hh.padStart(2, "0");
            min = min.padStart(2, "0");
            ampm = ampm ? ampm.toUpperCase() : "";

            // Convert to normalized format
            input = `${dd}-${mm}-${yyyy} ${hh}:${min} ${ampm}`;
        }

        setValues({
            ...values,
            [name]: input,
        });

    }
    const handleReactSelect = (name, e) => {
        debugger
        setValues({
            ...values,
            [name]: e.value,
        });
    };

    const CentreWiseCacheByCenterIDAPI = async () => {
        await dispatch(CentreWiseCacheByCenterID({}));
    }
    const fetchdata = async () => {
        try {

            const response = await getConditionOfPatientDropdownApi()
            if (response?.success) {
                setPatientDropdown(response?.data)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")

        }
    }

    const fetchList = async () => {
        try {

            const resp = await getMedicolegalReportApi("", moment(values?.fromDate).format("YYYY-MM-DD"), moment(values?.toDate).format("YYYY-MM-DD"));
            if (resp?.success) {
                setDataList(resp?.data);
            } else {
                setDataList([])
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    useEffect(() => {
        CentreWiseCacheByCenterIDAPI()
        fetchdata()
        fetchList()
    }, [])

    const { CentreWiseCache, GetBindAllDoctorConfirmationData } = useSelector(
        (state) => state.CommonSlice
    );
    console.log(GetBindAllDoctorConfirmationData);

    const handleChangOption = (name, selectedOption) => {
        if (selectedOption) {
            setValues({ ...values, [name]: selectedOption });
        } else {
            setValues({ ...values, [name]: "" });
        }
    };

    const handleSubmit = async () => {
        const data = {
            Id: values?.Id ? Number(values?.Id) : 0,
            RegNo: patientRaw?.PatientID ?? "",
            PatientId: patientRaw?.PatientID ?? "",
            // TransactionId: transactionID ?? "",
            DateOfArrival: values.DateOfArrival ?? "",
            TimeOfArrival: values.TimeOfArrival ?? "",
            AccompaniedBy: values.AccompaniedBy ?? "",
            Relation: values.Relation?.label ? values.Relation?.label : values.Relation ?? "",
            // RelationId: values.Relation?.value ? values.Relation?.value : values.RelationId ?? 0,
            RelationId: 0,
            Others: values.Others ?? "",
            AllegedPlaceOfIncident: values.AllegedPlaceOfIncident ?? "",
            PoliceStation: values.PoliceStation ?? "",
            ConditionOfPatient: values.ConditionOfPatient?.label ? values.ConditionOfPatient?.label : values.ConditionOfPatient ?? "",
            ConditionOfPatientId: values.ConditionOfPatient?.value ? values.ConditionOfPatient?.value : values.ConditionOfPatientId ?? "",
            PresentComplaintHistory: values.PresentComplaintHistory ?? "",
            ExaminingDoctor: values.ExaminingDoctor?.label ? values.ExaminingDoctor?.label : values.ExaminingDoctor ?? "",
            ExaminingDoctorId: values.ExaminingDoctor?.value ? values.ExaminingDoctor?.value : values.ExaminingDoctorId ?? "",
            Temp: values.Temp ?? "",
            Resp: values.Resp ?? "",
            BP: values.BP ?? "",
            Pulse: values.Pulse ?? "",
            SpO2: values.SpO2 ?? "",
            RBS: values.RBS ?? "",
            PainScore: values.PainScore ?? "",
            ExaminationSystemic: values.ExaminationSystemic ?? "",
            SampleCollected: values.SampleCollected ?? "",
            DetailOfSample: values.DetailOfSample ?? "",
            Diagnosis: values.Diagnosis ?? "",
            NatureOfInjuries: values.NatureOfInjuries ?? "",
            ProbableDurationOfInjuries: values.ProbableDurationOfInjuries ?? "",
            KindOfWeaponUsed: values.KindOfWeaponUsed ?? "",
            HospitalReferenceNumber: values.HospitalReferenceNumber ?? "",
            IdentificationMark1: values.IdentificationMark1 ?? "",
            IdentificationMark2: values.IdentificationMark2 ?? "",
            DateHourOfArrival: values.DateHourOfArrival ?? "",
            ConstableNameNumber: values.ConstableNameNumber ?? "",
            PoliceDocketNoDate: values.PoliceDocketNoDate ?? "",
            DateOfAdmission: values.DateOfAdmission ?? "",
            DateHourOther: values.DateHourOther ?? "",
            ReportSentToPolice: values.ReportSentToPolice ?? "",
            DateOfDischarge: values.DateOfDischarge ?? "",
        }
        try {
            const response = await createMedicolegalReportApi(data);
            if (response?.success) {
                notify(response?.message, "success")
                setValues(() => ({
                    regNo: "",
                    fromDate: new Date(),
                    toDate: new Date()
                }))
                // setValues({})
                fetchList()
                setPatientRaw(null);
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleEditRequest = (item) => {
        debugger
        //         setPatientRaw((preV)=>({
        // ...preV,
        // ...item,
        // PatientID:item?.RegNo ?? "",


        //         }))
        handleSearchByRegNo(item?.RegNo)
        setValues({
            ...values,
            Id: item?.Id ? item?.Id : "",
            RegNo: item?.RegNo ?? "",
            DateOfArrival: item?.DateOfArrival ?? "",
            TimeOfArrival: item?.TimeOfArrival ?? "",
            AccompaniedBy: item?.AccompaniedBy ?? "",
            Relation: item?.Relation ? { label: item.Relation, value: item.RelationId } : "",
            other: item?.Others ? "1" : "0",
            Others: item?.Others ?? "",
            AllegedPlaceOfIncident: item?.AllegedPlaceOfIncident ?? "",
            PoliceStation: item?.PoliceStation ?? "",
            ConditionOfPatient: item?.ConditionOfPatient ? { label: item.ConditionOfPatient, value: item.ConditionOfPatientId } : "",
            PresentComplaintHistory: item?.PresentComplaintHistory ?? "",
            ExaminingDoctor: item?.ExaminingDoctor ? { label: item.ExaminingDoctor, value: item.ExaminingDoctorId } : "",
            Temp: item?.Temp ?? "",
            Resp: item?.Resp ?? "",
            BP: item?.BP ?? "",
            Pulse: item?.Pulse ?? "",
            SpO2: item?.SpO2 ?? "",
            RBS: item?.RBS ?? "",
            PainScore: item?.PainScore ?? "",
            ExaminationSystemic: item?.ExaminationSystemic ?? "",
            SampleCollected: item?.SampleCollected ?? "",
            DetailOfSample: item?.DetailOfSample ?? "",
            Diagnosis: item?.Diagnosis ?? "",
            NatureOfInjuries: item?.NatureOfInjuries ?? "",
            ProbableDurationOfInjuries: item?.ProbableDurationOfInjuries ?? "",
            KindOfWeaponUsed: item?.KindOfWeaponUsed ?? "",
            HospitalReferenceNumber: item?.HospitalReferenceNumber ?? "",
            IdentificationMark1: item?.IdentificationMark1 ?? "",
            IdentificationMark2: item?.IdentificationMark2 ?? "",
            DateHourOfArrival: item?.DateHourOfArrival ? item.DateHourOfArrival : "",
            ConstableNameNumber: item?.ConstableNameNumber ?? "",
            PoliceDocketNoDate: item?.PoliceDocketNoDate ?? "",
            DateOfAdmission: item?.DateOfAdmission ? item.DateOfAdmission : "",
            DateHourOther: item?.DateHourOther ? item.DateHourOther : "",
            ReportSentToPolice: item?.ReportSentToPolice ? item.ReportSentToPolice : "",
            DateOfDischarge: item?.DateOfDischarge ? item.DateOfDischarge : "",
        });
    }
    const handleDeleteRequest = async (item) => {
        const data = {
            ID: item?.Id,
        }
        try {
            const resp = await deleteMedicolegalReportApi(data);
            if (resp?.success) {
                notify(resp?.message, "success")
                fetchList()
                setValues({})
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handlePrintRequest = async (item) => {
        try {
            const data = {
                Id: item?.Id,
                // patientId: patientID,
                tid: ""
            }
            const res = await medicoLegalReportApi(data)
            if (res) {
                RedirectURL(res?.data?.pdfUrl);
            } else {
                notify(res?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }

    }


    const ExceldataFormatter = (tableData) => {
        const HardCopy = JSON.parse(JSON.stringify(tableData));
        const modifiedResponseData = HardCopy?.map((ele, index) => {
            delete ele?.UpdatedBy;
            delete ele?.UpdatedDateTime;
            // delete ele?.DetailID;
            // delete ele?.ColorCode;

            return { ...ele };
        });

        return modifiedResponseData;
    };

    const handleSearchByRegNo = async (regNo) => {
        // setPatientRaw(null);
        debugger
        if (!regNo) {
            notify("Please enter Registration No.", "warn");
            return;
        }
        // if (!values.regNo?.trim()) {
        //     notify("Please enter Registration No.", "warn");
        //     return;
        // }

        try {
            const res = await MRDPatientInfoApi(regNo);
            if (res?.success) {
                setPatientRaw(res?.data);
                // setValues({
                //     ...values,
                //     regNo: ""
                // })
            } else {
                notify(res?.message, "error");
            }

        } catch (err) {
            notify(err?.message, "error");

        }
    };
    return (
        <div className=" card">
            <Heading isBreadcrumb={true} />
            <div className="row p-2">
                <Input
                    type="text"
                    className="form-control"
                    id="regNo"
                    lable={"Reg. No"}
                    placeholder=" "
                    value={values.regNo}
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    name="regNo"
                    onChange={handleChange}
                />
                <div className="col-xl-2 col-md-4 col-sm-6 col-12">

                    <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleSearchByRegNo(values.regNo)}
                        disabled={!!values?.Id}
                    >
                        {t("Search")}
                    </button>
                </div>
            </div>


            {patientRaw && <> <Heading isBreadcrumb={false} title={"Issue Details"} />
                <div className="row p-2">
                    <Input
                        className={"form-control"}
                        readOnly={true}
                        lable={"CR No"}
                        value={patientRaw?.PatientID}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="crNo"
                    />

                    <Input
                        type="text"
                        id="dobOrAge"
                        className={"form-control"}
                        readOnly={true}

                        lable={"Date Of Birth / Age"}
                        value={patientRaw?.age}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="dobOrAge"
                        onChange={handleChange}
                    />

                    <Input
                        type="text"
                        id="patientName"
                        lable={"Patient Name"}
                        className={"form-control"}
                        readOnly={true}
                        value={patientRaw?.PName}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="patientName"
                        onChange={handleChange}
                    />

                    <Input
                        type="text"
                        id="doctorName"
                        className={"form-control"}
                        readOnly={true}
                        lable={"Doctor Name"}
                        value={patientRaw?.DoctorName}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="doctorName"
                        onChange={handleChange}
                    />


                    <div>
                        <Heading title={t("Blood Transfution")} />
                        <div className="row m-2">

                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="DateOfArrival"
                                    name="DateOfArrival"
                                    value={
                                        values.DateOfArrival
                                            ? moment(values?.DateOfArrival, "YYYY-MM-DD").toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Date Of Arrival")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}

                            {/* <TimePicker
                                    placeholderName={t("Time Of Arrival")}
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="TimeOfArrival"
                                    name="TimeOfArrival"
                                    value={values?.TimeOfArrival}
                                    handleChange={handleChange}
                                // className="required-fields"
                                /> */}
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Date Of Arrival")}
                                placeholder=" "
                                id="DateOfArrival"
                                name="DateOfArrival"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.DateOfArrival || ""}
                                required={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Time Of Arrival")}
                                placeholder=" "
                                id="TimeOfArrival"
                                name="TimeOfArrival"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.TimeOfArrival || ""}
                                required={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Accompained By")}
                                placeholder=" "
                                id="AccompaniedBy"
                                name="AccompaniedBy"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.AccompaniedBy || ""}
                                required={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />


                            <ReactSelect
                                placeholderName={t("Relation")}
                                id="Relation"
                                searchable={true}
                                name="Relation"
                                value={values?.Relation?.label}
                                handleChange={handleChangOption}
                                // placeholder=" "
                                removeIsClearable={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                dynamicOptions={filterByType(
                                    CentreWiseCache,
                                    6,
                                    "TypeID",
                                    "TextField",
                                    "ValueField"
                                )}
                            // isDisabled={isDisableInputs}
                            />

                            <ReactSelect
                                placeholderName={t("Other")}
                                id={"other"}
                                searchable={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                name="other"
                                removeIsClearable={true}
                                dynamicOptions={type}
                                value={values?.other}
                                handleChange={handleReactSelect}
                            />
                            {values.other === "1" && (
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="Others"
                                    lable={t("Other Remark")}
                                    placeholder=" "
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    name="Others"
                                    value={values?.Others}
                                    onChange={handleChange}
                                />
                            )}

                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Alleged Place Of Incident")}
                                placeholder=" "
                                id="AllegedPlaceOfIncident"
                                name="AllegedPlaceOfIncident"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.AllegedPlaceOfIncident || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("police Station")}
                                placeholder=" "
                                id="PoliceStation"
                                name="PoliceStation"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.PoliceStation || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />

                            <ReactSelect
                                placeholderName={t("Condition Of Patient")}
                                id="ConditionOfPatient"
                                searchable={true}
                                name="ConditionOfPatient"
                                value={values?.ConditionOfPatient?.value}
                                handleChange={handleChangOption}
                                // placeholder=" "
                                removeIsClearable={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                dynamicOptions={
                                    patientDropdown?.map((item) => ({
                                        label: item?.ConditionOfPatient,
                                        value: item?.Id,
                                    }))}
                            // isDisabled={isDisableInputs}
                            />
                            <TextAreaInput
                                type="text"
                                className="form-control"
                                lable={t("Present Complaint History")}
                                placeholder=" "
                                id="PresentComplaintHistory"
                                name="PresentComplaintHistory"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.PresentComplaintHistory || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            {console.log(values)
                            }
                            <ReactSelect
                                placeholderName={t("Select Examining Doctor")}
                                searchable={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                id={"ExaminingDoctor"}
                                name={"ExaminingDoctor"}
                                value={values?.ExaminingDoctor?.value}
                                removeIsClearable={true}
                                handleChange={handleChangOption}
                                dynamicOptions={GetBindAllDoctorConfirmationData?.map((item) => ({
                                    label: item?.Name,
                                    value: item?.DoctorID,
                                }))}
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Temp")}
                                placeholder=" "
                                id="Temp"
                                name="Temp"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.Temp || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Resp")}
                                placeholder=" "
                                id="Resp"
                                name="Resp"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.Resp || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("BP")}
                                placeholder=" "
                                id="BP"
                                name="BP"
                                onChange={handleChange}
                                maxLength={10}
                                value={values?.BP || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Pulse")}
                                placeholder=" "
                                id="Pulse"
                                name="Pulse"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.Pulse || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("SpO2")}
                                placeholder=" "
                                id="SpO2"
                                name="SpO2"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.SpO2 || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("RBS")}
                                placeholder=" "
                                id="RBS"
                                name="RBS"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.RBS || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("PainScore")}
                                placeholder=" "
                                id="PainScore"
                                name="PainScore"
                                onChange={handleChange}
                                maxLength={5}
                                value={values?.PainScore || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />

                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Examination Systemic")}
                                placeholder=" "
                                id="ExaminationSystemic"
                                name="ExaminationSystemic"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.ExaminationSystemic || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <ReactSelect
                                placeholderName={t("Sample Collected")}
                                id={"SampleCollected"}
                                searchable={true}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                name="SampleCollected"
                                removeIsClearable={true}
                                dynamicOptions={type}
                                value={values?.SampleCollected}
                                handleChange={handleReactSelect}
                            />
                            {values.SampleCollected == 1 && (
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="DetailOfSample"
                                    lable={t("Detail Of Sample")}
                                    placeholder=" "
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    name="DetailOfSample"
                                    value={values?.DetailOfSample}
                                    onChange={handleChange}
                                />
                            )}

                            <TextAreaInput
                                type="text"
                                className="form-control"
                                lable={t("Diagnosis")}
                                placeholder=" "
                                id="Diagnosis"
                                name="Diagnosis"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.Diagnosis || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Nature Of Injuries")}
                                placeholder=" "
                                id="NatureOfInjuries"
                                name="NatureOfInjuries"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.NatureOfInjuries || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Probable Duration Of Injuries")}
                                placeholder=" "
                                id="ProbableDurationOfInjuries"
                                name="ProbableDurationOfInjuries"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.ProbableDurationOfInjuries || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Kind Of Weapon Used")}
                                placeholder=" "
                                id="KindOfWeaponUsed"
                                name="KindOfWeaponUsed"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.KindOfWeaponUsed || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Hospital Reference Number")}
                                placeholder=" "
                                id="HospitalReferenceNumber"
                                name="HospitalReferenceNumber"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.HospitalReferenceNumber || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Identification Mark1")}
                                placeholder=" "
                                id="IdentificationMark1"
                                name="IdentificationMark1"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.IdentificationMark1 || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Identification Mark2")}
                                placeholder=" "
                                id="IdentificationMark2"
                                name="IdentificationMark2"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.IdentificationMark2 || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Date Hour Of Arrival")}
                                placeholder=" "
                                id="DateHourOfArrival"
                                name="DateHourOfArrival"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.DateHourOfArrival || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="DateHourOfArrival"
                                    name="DateHourOfArrival"
                                    value={
                                        values.DateHourOfArrival
                                            ? moment(values?.DateHourOfArrival).toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Date Hour Of Arrival")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Constable Name Number")}
                                placeholder=" "
                                id="ConstableNameNumber"
                                name="ConstableNameNumber"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.ConstableNameNumber || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Police Docket No Date")}
                                placeholder=" "
                                id="PoliceDocketNoDate"
                                name="PoliceDocketNoDate"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.PoliceDocketNoDate || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Date Of Admission")}
                                placeholder=" "
                                id="DateOfAdmission"
                                name="DateOfAdmission"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.DateOfAdmission || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Date Hour Other")}
                                placeholder=" "
                                id="DateHourOther"
                                name="DateHourOther"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.DateHourOther || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Report Sent To Police")}
                                placeholder=" "
                                id="ReportSentToPolice"
                                name="ReportSentToPolice"
                                onChange={handleChange}
                                maxLength={5000}
                                value={values?.ReportSentToPolice || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("Date Of Discharge")}
                                placeholder=" "
                                id="DateOfDischarge"
                                name="DateOfDischarge"
                                onChange={handleChangeDate}
                                maxLength={5000}
                                value={values?.DateOfDischarge || ""}
                                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            />

                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="DateOfAdmission"
                                    name="DateOfAdmission"
                                    value={
                                        values.DateOfAdmission
                                            ? moment(values?.DateOfAdmission, "DD-MM-YYYY").toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Date Of Admission")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}

                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="DateHourOther"
                                    name="DateHourOther"
                                    value={
                                        values.DateHourOther
                                            ? moment(values?.DateHourOther).toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Date Hour Other")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}

                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="ReportSentToPolice"
                                    name="ReportSentToPolice"
                                    value={
                                        values.ReportSentToPolice
                                            ? moment(values?.ReportSentToPolice).toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Report Sent To Police")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}
                            {/* <DatePicker
                                    className="custom-calendar"
                                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    id="DateOfDischarge"
                                    name="DateOfDischarge"
                                    value={
                                        values.DateOfDischarge
                                            ? moment(values?.DateOfDischarge, "YYYY-MM-DD").toDate()
                                            : null
                                    }
                                    handleChange={handleChange}
                                    lable={t("Date Of Discharge")}
                                    placeholder={VITE_DATE_FORMAT}
                                /> */}
                            <div className='col-xl-2 col-md-3 col-sm-4 col-12'>

                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={handleSubmit}
                                >
                                    {values?.Id ? t("Update") : t("Save")}
                                </button>
                                {
                                    !!values?.Id && <button
                                        className="btn btn-sm btn-success ml-2"
                                        onClick={() => {
                                            setValues(() => ({
                                                regNo: "",
                                                fromDate: new Date(),
                                                toDate: new Date()
                                            })),
                                                setPatientRaw(null);
                                        }}

                                    >
                                        Cancel
                                    </button>
                                }

                            </div>
                        </div>

                    </div>
                </div> </>}


            <Heading title={t("Search & Excel Criteria")} />
            <div className='row m-2 '>
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="fromDate"
                    name="fromDate"
                    value={
                        values.fromDate

                    }
                    handleChange={handleChange}
                    lable={t("From Date")}
                // placeholder={VITE_DATE_FORMAT}
                />
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    value={
                        values.toDate

                    }
                    handleChange={handleChange}
                    lable={t("To Date")}
                // placeholder={VITE_DATE_FORMAT}
                />

                <button
                    className="btn btn-sm btn-success"
                    onClick={fetchList}
                >
                    {t("Search")}
                </button>
                <button
                    className="btn btn-sm btn-success ml-2"
                    type="button"
                    onClick={() => exportToExcel(ExceldataFormatter(datalist), `MLC Report`,)}
                >
                    {t("Excel")}
                </button>
            </div>
            <>
                {datalist?.length > 0 && (
                    <div>
                        <Heading title={"Medico Legal Report List"} isBreadcrumb={false} />
                        <Tables thead={Thead} tbody={datalist?.map((item, index) => ({
                            "S.No": index + 1,
                            "Reg No": item?.PatientId,
                            "PatientName": item?.PatientName,
                            "Name": item?.EntryBy,
                            "EntryDate": moment(item?.EntryDateTime).format("DD-MM-YYYY"),
                            "EntryTime": moment(item?.EntryDateTime).format("hh-mm A"),
                            "AccompaniedBy": item?.AccompaniedBy,
                            "Relation": item?.Relation,
                            "ID": item?.Id,
                            "Action": (
                                <>
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => {
                                            handleEditRequest(item);
                                        }}
                                    >
                                        <i className='fas fa-edit'></i>
                                    </button>
                                    {/* <button
                                        className="btn btn-secondary ml-2"
                                        type="button"
                                        onClick={() => {
                                            handleDeleteRequest(item);
                                        }}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </button> */}
                                    <button
                                        className="btn btn-secondary ml-2"
                                        type="button"
                                        onClick={() => {
                                            handlePrintRequest(item);
                                        }}
                                    >
                                        <i className='fas fa-print'></i>
                                    </button>
                                </>
                            )
                        }))} />
                    </div>
                )}
            </>


        </div>
    )
}

export default MlcLabReport