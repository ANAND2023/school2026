import React, { useEffect, useState } from "react";
import Modal from "../../../components/modalComponent/Modal";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { IPDDetailgetPharClearanceDetail, SaveClearanceApi } from "../../../networkServices/BillingsApi";
import moment from "moment";
import { notify } from "../../../utils/ustil2";
import DatePicker from "../../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";


const PharmacyClearance = () => {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;

    const THEAD = [
        t("Sr.No"),
        t("Patient ID"),
        t("IPD No."),
        t("Patient Name"),
        t("Bill Finalize Date"),
        t("Bill Finalized By"),
        t("Age/Gender"),
        t("Doctor Name"),
        t("Admitted Date"),
        t("ClearanceDoneBy"),
        t("Ward"),
        t("Clearance"),
        t("Panel"),

    ];
    const [payload, setPayload] = useState({
        patientId: "",
        type: { label: "IPD", value: "1" },
        fromDate: new Date(),
        toDate: new Date()

    });
    const [tableData, setTableData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((p) => ({ ...p, [name]: value }));
    };

    const handleReactSelect = (name, value) => {
        setPayload((val) => ({ ...val, [name]: value || "" }));
    };

    console.log(payload, "payload");
    const handleSearch = async () => {
        try {
            let body = {
                "uhid": payload?.type?.value === "2" ? payload?.patientId : "",
                "transNo": payload?.type?.value === "1" ? payload?.patientId : "",
                fromDate: moment(payload?.fromDate).format("DD-MMM-YYYY"),
                toDate: moment(payload?.toDate).format("DD-MMM-YYYY"),
            }
            const res = await IPDDetailgetPharClearanceDetail(body)
            if (res?.success) {
                setTableData(res?.data)
                setFilterData(res?.data)
            } else {
                notify(res?.message, "error")
                setTableData(res?.data)
                setFilterData(res?.data)
            }


        } catch (error) {
            console.log(error, "error");
        }
    }


    const handleSaveClarence = async (data) => {
        try {
            let payloadData = {
                tid: data?.TransactionID || '',
                type: "7",
                TransNo: data?.TransNo,
                UHID: data?.Patient_ID,

            }
            const res = await SaveClearanceApi(payloadData)
            if (res?.success) {
                handleSearch()
                notify(res?.message, "success")
            } else {
                notify(res?.message, "error")
            }


        } catch (error) {
            notify(error?.message, "error");
        }
    }

    const filteredTableData = (type) => {
        const updatedTableList = tableData.length > 0 && tableData?.filter((item) => {
            if (type === "1") {
                return item.IsMedCleared == "1"
            } else if (type === "0") {
                return item.IsMedCleared == "0"
            } else {
                return true
            }
        }) || []
        setFilterData(updatedTableList)
    }
    // const getRowClass = () => {

    //        return filterData?.[0]?.IsMedCleared === 1 ?"color-indicator-2-bg":"color-indicator-24-bg";
    // }


    return (
        <div className="w-100">

            <div className="card">
                <Heading isBreadcrumb={true} />
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Type")}
                        id="type"
                        inputId="type"
                        name="type"
                        value={payload?.type?.value}
                        handleChange={handleReactSelect}
                        dynamicOptions={[
                            { label: "IPD", value: "1" },
                            { label: "UHID", value: "2" },
                        ]}
                        searchable={true}
                        respclass="col-xl-1 col-md-1 col-sm-1 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        id="patientId"
                        lable={t(`${payload?.type?.value === "1" ? "IPD" : "UHID"}`)}
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

                    <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                        <button className="btn btn-sm btn-primary me-2" onClick={handleSearch}>
                            {t("Search")}
                        </button>
                    </div>
                </div>
            </div>

            {tableData?.length > 0 && (

                <div className="card">
                    <Heading title={"Issued Files"} isBreadcrumb={false}
                        secondTitle={<>
                            <ColorCodingSearch color={"#1DBC60"} label={t("Clarence")} onClick={() => filteredTableData("1")} />
                            <ColorCodingSearch color={"#ffcece"} label={t("Non Clarence")} onClick={() => filteredTableData("0")} />
                        </>
                        } />
                    <div>
                        <Tables
                            // tableHeight={"scrollview"}
                            // style={{ maxHeight: "auto" }}
                            tableHeight={"scrollView"}
                            thead={THEAD}
                            tbody={filterData?.map((item, index) => {
                                return {
                                    "s.No": index + 1,
                                    Patient_ID: item?.Patient_ID,
                                    TransNo: item?.TransNo,
                                    PName: item?.PName,
                                    BillFreezedTimeStamp:item?.BillFreezedTimeStamp,
                                    BillFreezedUser:item?.BillFreezedUser,
                                    AgeSex: item?.AgeSex,
                                    DName: item?.DName,
                                    AdmitDate: item?.AdmitDate,
                                    ClearanceDoneBy: item?.ClearanceDoneBy,
                                    RoomName: item?.RoomName,
                                    IsMedCleared: item?.IsMedCleared === 1 ? ("-") : (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => {
                                                handleSaveClarence(item);
                                            }}
                                        >
                                            {/* <i className='fas fa-check'></i> */}
                                            Clarence
                                        </button>),
                                    Company_Name: item?.Company_Name,
                                    colorcode:
                                        item?.IsMedCleared === 1 ? "#1DBC60":"#ffcece" 
                                }
                            }
                            )}

                        />

                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyClearance;
