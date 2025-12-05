import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import moment from "moment";
import DatePicker from "../../../components/formComponent/DatePicker";
import { BindDepartmentResultEntryLab, MachineResultEntryGetIsLab, ProvisionalTatReport } from "../../../networkServices/resultEntry";
import Tables from "../../../components/UI/customTable";
import { exportToExcel } from "../../../utils/exportLibrary";
import { notify } from "../../../utils/ustil2";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
const provitionalTatReportSheet = () => {
    const [t] = useTranslation();
    const [tatData, setTatData] = useState([]);
    const [radioTatData, setRadioTatData] = useState([]);
    const [isLab, setIsLab] = useState("1");

    const [departmentData, setDepartmentData] = useState([]);

    const [values, setValues] = useState({
        fromDate: moment(new Date()).toDate(),
        toDate: moment(new Date()).toDate(),
        department: { value: "7", label: "Radiology" },
        type: { value: "s", label: "On Screen" },
        departmentList: { value: "0", label: "ALL" }
    })
    const DepartmentOptions = [
        { value: "3", label: "Laboratory" },
        { value: "7", label: "Radiology" },
    ];

    const { VITE_DATE_FORMAT } = import.meta.env;

    const fetchDepartmentData = async () => {
        try {
            const response = await BindDepartmentResultEntryLab();
            if (response.success) {
                setDepartmentData(response.data);
            } else {
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );
                setDepartmentData([]);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            setDepartmentData([]);
        }
    };

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const handlePrintPendingList = async (type, data) => {
        if (type === "excel") {
            exportToExcel(
                data?.map((val, index) => ({
                    sno: index + 1,
                    BarcodeNo: val?.BarcodeNo,
                    UHIDNo: val?.PatientID,
                    "Ipd No": val?.IpdNo,
                    "Is Opd": val?.IsOpd,
                    PatientName: val?.PName,
                    "Department": val?.NAME,
                    "Panel Name": val?.PanelName,
                    AgeSex: val?.Age_Gender,
                    BookingCenter: val?.Centre,
                    "Investigation Name": val?.InvestigationName,
                    "Bill Date": val?.BillDate,
                    "Doctor": val?.Doctor,
                    "Sample Collection Date": val?.SampleCollectionDate,
                    "Sample Collection TAT": val?.SampleCollectionTAT,
                    "Sample Receive Date": val?.SampleReceiveDate,
                    "Sample ReceiveTAT": val?.SampleReceiveTAT,
                    "Mark View By": val?.MarkViewBy,
                    "Provisional Date": val?.ProvisionalDate,
                    "Provisional TAT": val?.ReceiveToProvisionalTAT,
                    "Approved Date": val?.ApprovedDate,
                    "Tat Status": val?.TatStatus,
                    "TAT TIME IN MASTER": val?.TatTimeMaster,
                    "Tat Time": val?.TatTime,

                })),
                "Provisional Tat Report",
                "",
                "Provisional Tat Report",
                "Provisional Tat Report"
            );
        }
    }


    const handleSearchTatReport = async () => {
        const data = {
            fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
            toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
            Type: values?.department?.value,
            DepartmentId: values?.departmentList?.value
        }
        try {
            const apiResp = await ProvisionalTatReport(data);
            if (apiResp?.success) {
                if (values?.department?.value === "3") {

                    setTatData(apiResp?.data)
                    setRadioTatData([])
                }
                else {
                    setRadioTatData(apiResp?.data)
                    setTatData([])
                }
            } else {
                notify(apiResp?.message, "error");
                setTatData([]);
            }
        } catch (error) {
            notify("An error occurred while fetching data", "error");
            setTatData([]);
        }
    }

    const getExcelData = async () => {
        const data = {
            fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
            toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
            Type: values?.department?.value,
            DepartmentId: values?.departmentList?.value
        }
        try {
            const apiResp = await ProvisionalTatReport(data);
            if (apiResp?.success) {
                handlePrintPendingList("excel", apiResp?.data);
            } else {
                notify(apiResp?.message, "error");

            }
        } catch (error) {
            notify("An error occurred while fetching data", "error");

        }
    }
    // const ExceldataFormatter = (tatData) => {
    //     const HardCopy = JSON.parse(JSON.stringify(tatData));
    //     const modifiedResponseData = HardCopy?.map((ele, index) => {
    //         delete ele?.TypeID;
    //         delete ele?.TypeName;
    //         delete ele?.DetailID;
    //         delete ele?.ColorCode;
    //         delete ele?.Gender;
    //         delete ele?.isrerun;
    //         delete ele?.ReferLab;
    //         delete ele?.LedgerTransactionNo;
    //         delete ele?.SampleLocation;
    //         delete ele?.CombinationSample;
    //         delete ele?.Centre;
    //         delete ele?.AGE_in_Days;
    //         delete ele?.DATE;
    //         delete ele?.RemarkStatus;
    //         delete ele?.DocumentStatus;
    //         delete ele?.isChecked;
    //         delete ele?.colorcode;
    //         delete ele?.markStatus;
    //         delete ele?.ReferLab;
    //         delete ele?.SampleLocation;
    //         delete ele?.Samplerequestdate;
    //         delete ele?.TATDelay;
    //         delete ele?.TATIntimate;
    //         delete ele?.TatDelayinSecond;
    //         delete ele?.Urgent;
    //         delete ele?.isrerun;
    //         delete ele?.Test_ID;
    //         delete ele?.TimeDiff;
    //         delete ele?.Acutalwithdrawdate;
    //         delete ele?.Admission_Type;
    //         delete ele?.Comments;
    //         delete ele?.DevationTime;
    //         delete ele?.ObservationType_Id;
    //         delete ele?.CombinationSampleDept;
    //         delete ele?.srno;

    //         return { ...ele };
    //     });

    //     return modifiedResponseData;
    // };

    const theadTatReportDetail = [
        { width: "5%", name: t("SNo") },
        { width: "15%", name: t("Barcode No") },
        { width: "15%", name: t("UHID No") },
        { width: "15%", name: t("IPD No") },
        { width: "15%", name: t("Type") },
        { width: "10%", name: t("Patient Name") },
        { width: "10%", name: t("Department") },
        { width: "10%", name: t("Panel Name") },
        { width: "15%", name: t("Age/Sex") },
        { width: "15%", name: t("Booking Center") },
        { width: "15%", name: t("Investigation Name") },
        { width: "15%", name: t("Bill Date") },
        { width: "15%", name: t("Doctor") },
        { width: "15%", name: t("Sample Collection Date") },
        { width: "15%", name: t("Sample Collection TAT") },
        { width: "15%", name: t("Sample Receive Date") },
        { width: "15%", name: t("Sample Receive TAT") },
        { width: "15%", name: t("MarkViewBy") },
        { width: "15%", name: t("Provisional Date") },
        { width: "15%", name: t("Provisional TAT") },
        { width: "15%", name: t("Approved Date") },
        { width: "15%", name: t("Tat Time Master") },
        { width: "15%", name: t("Tat Status") },
        { width: "15%", name: t("Tat Time") },

    ]
    const radioTheadTatReportDetail = [
        { width: "5%", name: t("SNo") },
        { width: "15%", name: t("Barcode No") },
        { width: "15%", name: t("UHID No") },
        { width: "15%", name: t("IPD No") },
        { width: "15%", name: t("Type") },
        { width: "10%", name: t("Patient Name") },
        { width: "10%", name: t("Department") },
        { width: "10%", name: t("Panel Name") },
        { width: "15%", name: t("Age/Sex") },
        { width: "15%", name: t("Booking Center") },
        { width: "15%", name: t("Investigation Name") },
        { width: "15%", name: t("Bill Date") },
        { width: "15%", name: t("Doctor") },
        { width: "15%", name: t("Call Date/Time") },
        { width: "15%", name: t("Sample Collection TAT") },
        { width: "15%", name: t("In Date/Time") },
        { width: "15%", name: t("Out Date/Time") },
        { width: "15%", name: t("Sample Receive TAT") },
        { width: "15%", name: t("MarkViewBy") },
        { width: "15%", name: t("Provisional Date/Time") },
        // { width: "15%", name: t("Status") },
        { width: "15%", name: t("Approved Date/Time") },
        { width: "15%", name: t("Tat Status") },
        { width: "15%", name: t("Tat Time") },

    ]
    const getTatMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes, seconds] = timeStr?.split(":").map(Number);
        return hours * 60 + minutes + seconds / 60;
    };

    const tatMinutes = getTatMinutes(tatData?.TatTime);
    const tatColor = tatMinutes > 50 ? "text-danger" : "text-warning";


    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };

    const ResultEntryGetIsLab = async () => {
        try {
            debugger
            const res = await MachineResultEntryGetIsLab();
            if (res?.success) {
                const lData = res?.data === 1 ? "1" : "0"
                setIsLab(lData);
            }
            else {
                setIsLab("1");
            }

        } catch (error) {

        }
    }
    useEffect(() => {
        setValues(prev => ({
            ...prev,
            department: isLab === "1"
                ? { value: "3", label: "Laboratory" }
                : { value: "7", label: "Radiology" },
        }));
    }, [isLab]);

    useEffect(() => {
        ResultEntryGetIsLab();
        fetchDepartmentData();
    }, []);

    return (
        <div className="spatient_registration_card card">
            <Heading title={t("heading")} isBreadcrumb={true} />
            <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

                <DatePicker
                    id="fromDate"
                    className="custom-calendar"
                    name="fromDate"
                    lable={t("FromDate")}
                    value={values?.fromDate || new Date()}
                    handleChange={handleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                />

                <DatePicker
                    className="custom-calendar"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate || new Date()}
                    handleChange={handleChange}
                    lable={t("ToDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                />

                <ReactSelect
                    placeholderName={t("Category")}
                    id={"department"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={DepartmentOptions}
                    handleChange={handleSelect}
                    value={values?.department?.value}
                    name={"department"}
                />
                {console.log(values, "values")}
                <ReactSelect
                    placeholderName={t("Department")}
                    id={"departmentList"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={[
                        { value: "0", label: "ALL" },
                        ...handleReactSelectDropDownOptions(
                            departmentData,
                            "NAME",
                            "SubCategoryID"
                        ),
                    ]}
                    handleChange={handleSelect}
                    value={`${values?.departmentList?.value}`}
                    name={"departmentList"}
                />

                <div className="d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                    <button
                        className="btn btn-sm btn-success"
                        type="button"
                        onClick={handleSearchTatReport}
                    >
                        {t("Search")}
                    </button>

                    <button
                        className="btn btn-sm btn-primary ml-2"
                        type="button"
                        onClick={() => getExcelData()}
                    >
                        {t("Print Excel")}
                    </button>

                </div>
            </div>


            <div className="card table-responsive">
                {
                    values?.department?.value === "3" ?
                        <Tables
                            thead={theadTatReportDetail}
                            tbody={tatData?.map((val, index) => ({
                                sno: index + 1,
                                BarcodeNo: val?.BarcodeNo,
                                UHIDNo: val?.PatientID,
                                IpdNo: val?.IpdNo,
                                IsOpd: val?.IsOpd,
                                PatientName: val?.PName,
                                NAME: val?.NAME,
                                PanelName: val?.PanelName,
                                AgeSex: val?.Age_Gender,
                                BookingCenter: val?.Centre,
                                "Investigation Name": val?.InvestigationName,
                                "Bill Date": val?.BillDate,
                                "Doctor": val?.Doctor,
                                SampleCollectionDate: val?.SampleCollectionDate,
                                SampleCollectionTAT: val?.SampleCollectionTAT,
                                SampleReceiveDate: val?.SampleReceiveDate,
                                SampleReceiveTAT: val?.SampleReceiveTAT,
                                "MarkViewBy": val?.MarkViewBy,
                                "Provisional Date": val?.ProvisionalDate,
                                // "Status":val.Status,
                                "Provisional TAT": val?.ReceiveToProvisionalTAT,
                                "Approved Date": val?.ApprovedDate,
                                "TatTimeMaster": val?.TatTimeMaster,
                                "TatStatus": val?.TatStatus,
                                "Tat Time": (

                                    <strong
                                        className={`${val?.TatStatusColor === 1 ? "text-danger" : "text-warning"}`}
                                    >
                                        {val?.Tat}
                                    </strong>
                                )
                            }))
                            }
                            style={{ height: "68vh", padding: "0px" }}
                            tableHeight={"scrollView"}
                        />
                        :
                        <Tables
                            thead={radioTheadTatReportDetail}
                            tbody={radioTatData?.map((val, index) => ({
                                sno: index + 1,
                                BarcodeNo: val?.BarcodeNo,
                                UHIDNo: val?.PatientID,
                                IpdNo: val?.IpdNo,
                                IsOpd: val?.IsOpd,
                                PatientName: val?.PName,
                                NAME: val?.NAME,
                                PanelName: val?.PanelName,
                                AgeSex: val?.Age_Gender,
                                BookingCenter: val?.Centre,
                                "Investigation Name": val?.InvestigationName,
                                "Bill Date": val?.BillDate,
                                "Doctor": val?.Doctor,
                                CallDateTime: val?.CallDateTime,
                                SampleCollectionTAT: val?.SampleCollectionTAT,
                                InDateTime: val?.InDateTime,
                                P_OutDateTime: val?.P_OutDateTime,
                                SampleReceiveTAT: val?.SampleReceiveTAT,
                                "MarkViewBy": val?.MarkViewBy,
                                "Provisional Date": val?.ProvisionalDate,
                                // "Status":val.Status,
                                "Approved Date": val?.ApprovedDate,
                                "TatStatus": val?.TatStatus,
                                "Tat Time": (

                                    <strong
                                        className={`${val?.TatStatusColor === 1 ? "text-danger" : "text-warning"}`}
                                    >
                                        {val?.Tat}
                                    </strong>
                                )
                            }))
                            }
                            style={{ height: "68vh", padding: "0px" }}
                            tableHeight={"scrollView"}
                        />
                }
            </div>
        </div>
    )
}

export default provitionalTatReportSheet;