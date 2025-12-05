import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import { notify } from '../../../utils/ustil2';
import { getPatientRoomShiftRequestApi, updateRoomShiftStatusApi } from '../../../networkServices/nursingWardAPI';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import Tables from '../../../components/UI/customTable';

export default function PatientRoomShiftApproval() {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [values, setValues] = useState({
        fromDate: new Date(),
        toDate: new Date(),
    });
    const { VITE_DATE_FORMAT } = import.meta.env;


    const THEAD = [
        { name: t("S.No"), width: "1%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("Previous Room"), width: "10%" },
        { name: t("Previous Room BedNo"), width: "10%" },
        { name: t("Request For Room"), width: "10%" },
        { name: t("Shift Date"), width: "10%" },
        { name: t("Approve"), width: "1%" },
        { name: t("Reject"), width: "1%" },

    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const fetchData = async () => {

        const payload = {
            fromDate: values.fromDate ? moment(values.fromDate).format("YYYY-MM-DD") : "",
            toDate: values.toDate ? moment(values.toDate).format("YYYY-MM-DD") : "",
        };
        try {
            const response = await getPatientRoomShiftRequestApi(payload);
            if (response?.success) {
                setTableData(response?.data || []);
            } else {
                notify(response?.message, "error");
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleUpdateStatus = async (item,status) => { 
        const payload = {
            transactionID: item?.TransactionID || 0,
            id: item?.ID || 0,
            type: status ,
        };
        try {
            const response = await updateRoomShiftStatusApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                fetchData();
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    // useEffect(() => {
    //     fetchData();
    // }, []);

    return (
        <div>
            <Heading isBreadcrumb={true} />
            <div className='card '>
                <div className="row p-2">
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="fromDate"
                        name="fromDate"
                        value={
                            values.fromDate
                                ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("From Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        value={
                            values.toDate
                                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("To Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => fetchData()}
                    >
                        {t("Search")}
                    </button>
                </div>

            </div>
            <Tables
                thead={THEAD}
                tbody={tableData?.map((item, index) => ({
                    sno: index + 1,
                    patientName: item?.FullName || "-",
                    prevRoom: item?.PreviousRoomName || "-",
                    newRoom: item?.RequestRoomName || "-",
                    PreviousBedRoomNo: item?.PreviousBedRoomNo || "-",
                    date: item?.ShiftedDate|| "-",
                    approve: item?.STATUS == "Pending" ? (
                        <button
                            className="btn btn-success"
                            onClick={() => handleUpdateStatus(item, "RS")}
                        >
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </button>
                    ) : "-",
                    reject: item?.STATUS == "Pending" ? (
                        <button
                            className="btn  text-danger"
                            onClick={() => handleUpdateStatus(item, "Rejected")}
                        >
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    ) : "-",
                }))}
            />
        </div>
    )
}
