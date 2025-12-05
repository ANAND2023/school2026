import React, { useEffect } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import DatePicker from '../../../components/formComponent/DatePicker'
import { notify } from '../../../utils/ustil2';
import moment from 'moment';
import { getFileIssueReportpdfApi, MRDReceivedFilleSearchApi } from '../../../networkServices/MRDApi';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import { GetBindAllDoctorConfirmation } from '../../../store/reducers/common/CommonExportFunction';
import { useDispatch } from 'react-redux';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import Tables from '../../../components/UI/customTable';
import { exportToExcel } from '../../../utils/exportLibrary';
import { RedirectURL } from '../../../networkServices/PDFURL';

export default function MRDFileReport() {
    const { GetBindAllDoctorConfirmationData } = useSelector(
        (state) => state.CommonSlice
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const doctorOptions = GetBindAllDoctorConfirmationData.map((item) => ({
        label: item.Name,
        value: item.DoctorID,
    }));
    const THEAD = [
        t("Sr.No"),
        t("Patient ID"),
        t("Patient Name"),
        t("Doctor Name"),
        t("Issue By"),
        t("Return Date-Time"),
        t("Issue Date"),
        t("Issue Time"),
        t("Issue To"),
        t("Remarks"),
    ];
    const reportStatusTypeOptions = [{ value: "0", label: "Issue Report" }, { value: "1", label: "Return Report" }, { value: "2", label: "Pending Report All" }, { value: "3", label: "Pending Report OPD" }, { value: "4", label: "Pending Report IPD" }]
    const localData = useLocalStorage("userData", "get");
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [payload, setPayload] = React.useState({
        patientId: "",
        fromDate: new Date(),
        toDate: new Date(),
        doctor: '',
        typeOfFile: 2,
        reportStatusType: "0",
    });


    const ExceldataFormatter = (tableData) => {

        const HardCopy = JSON.parse(JSON.stringify(tableData));
        const modifiedResponseData = HardCopy?.map((ele, index) => {
            delete ele?.TransactionID;
            delete ele?.IssueDept;
            delete ele?.IsReturn;
            delete ele?.ISCardOrFile;
            delete ele?.FileIssueId;
            delete ele?.CardFile;
            delete ele?.DoctorID;

            return {
                // ...ele,
                "PatientID": ele?.PatientId || "",
                "Name": ele?.NAME || "",
                "DOB": ele?.DOB ? `${ele?.DOB}` : "",
                "Age": ele?.age || "",
                "Doctor": ele?.changesDoctorName || "",
                "Issue By": ele?.IssueBy || "",
                "Return Date-Time": ele?.ReturnDate || "",
                "Issue Date": ele?.IssueDate || "",
                "Issue Remarks": ele?.Remarks || "",
                "Receive By": ele?.RecieveBy || "",
                "Receive Date": ele?.ReturnDate || "",
                "Return Remark": ""
            };
        });

        return modifiedResponseData;
    };
    const [tableData, setTableData] = React.useState([]);
    console.log(tableData)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prev) => ({ ...prev, [name]: value }));
    }
    const handleSelect = (name, value) => {
        setPayload((prev) => ({ ...prev, [name]: value }));
    };
    const handleSearchByRegNo = async () => {
        const payload2 = {
            PatientID: payload?.patientId || "",
            fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
            toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
            DoctorID: payload?.doctor?.value || "",
            ISCardOrFile: Number(payload?.typeOfFile?.value || "2"),
            type: payload?.reportStatusType?.value || "1",
        }
        try {
            const res = await MRDReceivedFilleSearchApi(payload2);
            if (res?.success) {
                setTableData(res?.data || []);
            } else {
                notify(res?.message, "error");
                setTableData([]);
            }
        } catch (err) {
            notify(err?.message, "error");
        }
    };
    const handleExportReport = () => {
        exportToExcel(
            ExceldataFormatter(tableData),
            "MRD File Report",
            "",
            "MRD File Report",
            "MRD File Report"
        );
    }
    const handleExportReportPdf = async() => {
        const payload2 = {
            PatientID: payload?.patientId || "",
            fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
            toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
            DoctorID: payload?.doctor?.value || "",
            ISCardOrFile: Number(payload?.typeOfFile?.value || "2"),
            type: payload?.reportStatusType?.value || "1",
        }
        debugger
        try {
            const res = await getFileIssueReportpdfApi(payload2);
            if (res?.success) {
                RedirectURL(res?.data?.pdfUrl);
            } else {
                notify(res?.message, "error");
            }
        } catch (err) {
            notify(err?.message, "error");
        }
    }
    console.log(payload, "payload");

    useEffect(() => {
        dispatch(
            GetBindAllDoctorConfirmation({
                Department: "All",
                CentreID: localData?.centreID,
            })
        );
    }, [dispatch]);

    return (
        <>
            <div className="mt-2 card">
                <Heading isBreadcrumb={true} />
                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="patientId"
                        lable={"Patient ID"}
                        placeholder=" "
                        value={payload?.patientId}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="patientId"
                        onChange={handleChange}
                    />
                    <DatePicker
                        className="custom-calendar"
                        placeholder={VITE_DATE_FORMAT}
                        lable={"From Date"}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="fromDate"
                        id="fromDate"
                        value={payload.fromDate}
                        handleChange={handleChange}
                    />
                    <DatePicker
                        className="custom-calendar"
                        placeholder={VITE_DATE_FORMAT}
                        lable={"To Date"}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="toDate"
                        id="toDate"
                        value={payload.toDate}
                        handleChange={handleChange}
                    />
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        placeholderName={t("Doctor")}
                        searchableDoctorID={true}
                        id="doctor"
                        name="doctor"
                        dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(doctorOptions, "label", "value")]}
                        value={payload?.doctor}
                        handleChange={handleSelect}
                    />
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        placeholderName={t("File Type")}
                        id="typeOfFile"
                        name="typeOfFile"
                        dynamicOptions={[{ value: "2", label: "File" }, { value: "1", label: "Card" }, { value: "0", label: "Both" }]}
                        value={payload?.typeOfFile}
                        handleChange={handleSelect}

                    />
                    
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        placeholderName={t("Report Status Type")}
                        id="reportStatusType"
                        name="reportStatusType"
                        dynamicOptions={[{ value: "0", label: "ALL" }, ...reportStatusTypeOptions]}
                        value={payload?.reportStatusType}
                        handleChange={handleSelect}

                    />

                    <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                        <button className="btn btn-sm btn-primary me-2" onClick={handleSearchByRegNo}>
                            {t("Search")}
                        </button>



                        {tableData?.length > 0 && (
                            <>
                                <button className="btn btn-sm btn-primary ml-2" onClick={handleExportReport}>
                                    {t("Export")}
                                </button>

                                <button className="btn btn-sm btn-primary ml-2" onClick={handleExportReportPdf}>
                                    {t("Export PDF")}
                                </button>
                            </>


                        )}
                    </div>
                </div>
            </div>
            {tableData?.length > 0 && (

                <div className="card">
                    <Heading title={"Issued Files"} isBreadcrumb={false} />
                    <div>
                        <Tables
                            thead={THEAD}
                            tbody={tableData?.map((item, index) => [
                                index + 1,
                                item?.PatientId,
                                item?.NAME,
                                item?.changesDoctorName,
                                item?.CreatedBy,
                                item?.ReturnDate,
                                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("DD-MM-YYYY"),
                                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("hh:mm A"),
                                item?.DepartmentName,
                                item?.Remarks,


                            ])}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
