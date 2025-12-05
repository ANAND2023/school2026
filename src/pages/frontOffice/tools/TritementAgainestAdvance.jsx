import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../components/UI/Heading';
import SearchComponentByUHIDMobileName from '../../../components/commonComponents/SearchComponentByUHIDMobileName';
import { bindPanelByPatientID, getPatientAdvanceAgainstTreatmentApi, opdgetPatientAdvanceCms, patientAdvanceAgainstTreatmentApi, SaveOrUpdatePatientAdvanceAgainstTreatment } from '../../../networkServices/opdserviceAPI';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import Input from '../../../components/formComponent/Input';
import { Tabfunctionality } from '../../../utils/helpers';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';

const TritementAgainestAdvance = () => {
    const { t } = useTranslation();
    const [singlePatientData, setSinglePatientData] = useState({})
    const [bodyData, setBodyData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [values, setValues] = React.useState({
        "PatientId": "",
        // "patientName": "",
        "sancationNo": "",
        "sancationdate": new Date(),
        "validDate": new Date(),
        "name": "",
        "refNo": "",
        "amount": "",
        "remarks": "",

    });

    const [DropDownState, setDropDownState] = useState({
        getBindPanelByPatientID: [],

    });


    const getPatientAdvanceCms = async (data) => {

        try {
            debugger
            let payload = {
                "type": 0,
                "patientID": data?.MRNo
            }
            const response = await opdgetPatientAdvanceCms(payload);
            if (response?.success) {
                setBodyData(response?.data || []);
            }

        } catch (error) {
            console.error("Error in getPatientAdvanceCms:", error);

        }
    }
    const handleSinglePatientData = (data) => {
        debugger
        getPatientAdvanceTritement(data);
        setSinglePatientData(data);
        getPatientAdvanceCms(data);
        // handlebindPanelByPatientID(data);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }
    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    // const handlePanelReactSelectChange = (name, e) => {
    //     if (name === "panelID") {
    //         OPDServiceBookinglist(e?.PanelID);
    //     }
    //     const data = DropDownState?.getBindPanelByPatientID.find(
    //         (ele) => Number(ele?.value) === Number(e?.value)
    //     );
    //     setPayloadData({
    //         ...payloadData,
    //         [name]: data,
    //     });
    // };

    const sendReset = () => {
        setSinglePatientData({});
        setValues(
            {
                "panelID": "",
                "PatientId": "",
                "patientName": "",
                "sancationNo": "",
                "sancationdate": new Date(),
                "validDate": new Date(),
                "refNo": "",
                "amount": "",
                "name": "",
                "cash": "",
                "remarks": "",
            }
        )

    }

    const FetchAllDropDown = async () => {
        try {

            const response = await Promise.all([
                handleBindPanelByPatientID(),

            ]);
            const responseDropdown = {
                getBindPanelByPatientID: handleReactSelectDropDownOptions(
                    response[0],
                    "PanelName",
                    "PanelID"
                ),

            };
            setDropDownState(responseDropdown);
            setValues({
                ...values,
                panelID:
                    responseDropdown?.getBindPanelByPatientID?.find((ele) => ele["PanelID"] == '205'),

            });

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleBindPanelByPatientID = async () => {
        try {
            const data = await bindPanelByPatientID(singlePatientData?.PatientID);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        FetchAllDropDown()
        getPatientAdvanceTritement(singlePatientData)
    }, [])
    const getPatientAdvanceTritement = async (data) => {
        try {
            let payload = {
                "type": 0,
                "patientID": data?.MRNo
            }
            const response = await getPatientAdvanceAgainstTreatmentApi(payload);
            if (response?.success) {
                setBodyData(response?.data || []);
            } else {
                setBodyData([])
            }

        } catch (error) {
            console.error("Error in getPatientAdvanceCms:", error);

        }

    }
    const handleEdit = (val) => {
        setIsEdit(true)
        console.log("firstval", val)
        setValues((preV) => ({
            ...preV,


            "PatientId": val?.PatientId,
            "patientName": val?.Name,
            "sancationNo": val?.SancationNo,
            "sancationdate": val?.SancationDate,
            "validDate": new Date(),
            "refNo": val?.RefNo,
            "amount": val?.Amount,
            "name": val?.Name,
            "cash": "",
            "remarks": val?.Remarks,

        }))




    }
    const handleSave = async () => {
        if (!values?.amount) {
            notify("Please Fill Amount", "warn")
            return
        }
        try {
            let payload = {
                "patientId": Number(singlePatientData?.MRNo),
                "sancationNo": values?.sancationNo || "",
                "sancationDate": moment(values?.sancationdate).format("YYYY-MM-DD"),
                "validDate": moment(values?.validDate).format("YYYY-MM-DD"),
                "refNo": values?.refNo || "",
                "name": singlePatientData?.PName || "",
                "amount": Number(values?.amount) || 0,
                "remarks": values?.remarks || "",
            }


            const response = await SaveOrUpdatePatientAdvanceAgainstTreatment(payload)
            if (response?.success) {
                setIsEdit(false)
                getPatientAdvanceTritement(singlePatientData);
                notify(response?.success, "success")
                setValues({
                    "sancationNo": "",
                    "sancationdate": new Date(),
                    "validDate": new Date(),
                    "refNo": "",
                    "name": "",
                    "amount": "",
                    "remarks": "",
                })
                notify(response?.message, "success");
            } else {
                notify(response?.message, "error");
            }

        } catch (error) {
            notify(error?.message, "error");
        }
    }
    return (
        <div className="card patient_registration border">
            <Heading
                title={t("Search Patient")}
                isBreadcrumb={true}
            />
            {Object.keys(singlePatientData)?.length === 0 ? (
                <SearchComponentByUHIDMobileName onClick={handleSinglePatientData} />
            ) : (
                <>
                    <div className="patient_registration card">
                        <Heading
                            title={t("Patient Details")}
                            isBreadcrumb={false}
                        />
                        <div className="row p-2">
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <div className="d-flex align-items-center">
                                    <div
                                        style={{
                                            border: "1px solid #447dd5",
                                            padding: "2px 5px",
                                            borderRadius: "3px",
                                            backgroundColor: "#447dd5",
                                            color: "white",
                                            marginRight: "3px",
                                        }}
                                        onClick={sendReset}
                                    >
                                        <i className="fa fa-search " aria-hidden="true"></i>
                                    </div>
                                    <LabeledInput
                                        label={t("UHID")}
                                        value={singlePatientData?.MRNo}
                                        className={" w-100"}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={t("Patient Name")}
                                    value={singlePatientData?.PatientName}
                                    className={"mb-2"}
                                />
                            </div>
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={t("Age/Gender")}
                                    value={singlePatientData?.AgeGender}
                                    className={"mb-2"}
                                />
                            </div>

                            <ReactSelect
                                placeholderName={t("InSurancePanel")}
                                id={"InSurancePanel"}
                                searchable={true}
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                value={values?.panelID?.value}
                                name={"panelID"}
                                isDisabled={true}
                                dynamicOptions={DropDownState?.getBindPanelByPatientID}
                            // handleChange={handlePanelReactSelectChange}

                            />

                        </div>

                    </div>
                    <div className="patient_registration card mt-2">
                        <Heading
                            title={t("Patient Tritement Againest Advance Details")}
                            isBreadcrumb={false}
                        />
                        <div className="row p-2">
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("Sancation No")}
                                placeholder=" "
                                id="sancationNo"
                                name="sancationNo"
                                onChange={handleChange}
                                value={values?.sancationNo}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <DatePicker
                                className="custom-calendar"
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                id="sancationdate"
                                name="sancationdate"
                                value={
                                    values.sancationdate
                                        ? moment(values?.sancationdate, "YYYY-MM-DD").toDate()
                                        : null
                                }
                                handleChange={handleChange}
                                lable={t("Sancation Date")}
                            // placeholder={VITE_DATE_FORMAT}
                            />
                            <DatePicker
                                className="custom-calendar"
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                id="validDate"
                                name="validDate"
                                value={
                                    values.validDate
                                        ? moment(values?.validDate, "YYYY-MM-DD").toDate()
                                        : null
                                }
                                handleChange={handleChange}
                                lable={t("valid Date")}
                            // placeholder={VITE_DATE_FORMAT}
                            />
                            <Input
                                type="number"
                                className="form-control required-fields"
                                lable={t("Amount")}
                                placeholder=" "
                                id="amount"
                                name="amount"
                                onChange={handleChange}
                                value={values?.amount}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />

                            <Input
                                type="number"
                                className="form-control"
                                lable={t("ref No")}
                                placeholder=" "
                                id="refNo"
                                name="refNo"
                                onChange={handleChange}
                                value={values?.refNo}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <TextAreaInput
                                id="remarks"
                                lable={t("Remarks")}

                                className="w-1/2 h-24"
                                name="remarks"
                                value={values?.remarks}
                                onChange={handleChange}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                            <div>
                                <button
                                    className="btn btn-sm btn-success px-3 ml-2"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    {`${isEdit ? t("Update") : t("Save")}  `}
                                </button>
                                {
                                    isEdit &&  <button
                                    className="btn btn-sm btn-success px-3 ml-2"
                                    type="button"
                                    onClick={()=>setIsEdit(false)}
                                >
                                   Cancel
                                </button>
                                }
                               
                            </div>
                        </div>
                    </div>
                    {bodyData?.length > 0 &&
                        <div className="patient_registration card mt-2">
                            <Heading
                                title={t("Patient  Tritement Againest Advance Details")}
                                isBreadcrumb={false}
                            />
                            <div className="row p-2">
                                <Tables
                                    thead={[

                                        { name: t("S.No"), width: "1%" },
                                        { name: t("Patient Name"), width: "20%" },
                                        { name: t("Sancation No.") },
                                        { name: t("Sancation Date"), width: "4%" },
                                        { name: t("Amount") },
                                        { name: t("Entry Date"), width: "4%" },
                                        { name: t("Valid Date"), width: "4%" },
                                        { name: t("Ref No"), width: "3%" },
                                        { name: t("Remarks"), width: "20%" },
                                        { name: t("Action"), width: "2%" },
                                        // { name: t("Emp Name"), width: "1%" },

                                    ]}
                                    tbody={bodyData?.map((item, index) => (
                                        {
                                            sNO: index + 1,
                                            patientName: item?.Name,
                                            sancationNo: item?.SancationNo,
                                            sancationdate: moment(item?.SancationDate).format("DD-MM-YYYY"),
                                            Amount: item?.Amount,
                                            entryDate: moment(item?.EntryDate).format("DD-MM-YYYY"),
                                            validDate: moment(item?.ValidDate).format("DD-MM-YYYY"),
                                            RefNo: item?.RefNo,
                                            remarks: item?.Remarks,
                                            Action: <i
                                                className="fa fa-edit text-primary cursor-pointer"
                                                style={{ cursor: "pointer", fontSize: "18px" }}
                                                onClick={() => handleEdit(item)} // your custom edit handler
                                            ></i>,
                                        }
                                    ))}


                                />

                            </div>
                        </div>
                    }
                </>
            )}
        </div>
    )
}

export default TritementAgainestAdvance;