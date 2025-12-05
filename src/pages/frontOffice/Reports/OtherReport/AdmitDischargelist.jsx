import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingBindReportOption, BillingReportsAdmitDischargeList, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { GetBindDepartment, RoomType, ToolBindDepartment } from "../../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import { BindFloor } from "../../../../networkServices/nursingWardAPI";
import { exportToExcel } from "../../../../utils/exportLibrary";
import TimePicker from "../../../../components/formComponent/TimePicker";
import Input from "../../../../components/formComponent/Input";
import TimeInputPicker from "../../../../components/formComponent/CustomTimePicker/TimeInputPicker";

const AdmitDischargelist = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true // agar 12-hour format chahiye to true kar do
        });
    };
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ReportType: "",
        listType: "1",
        RoomType: [],
        doctor: [],
        Department: [],
        Floor: [],
        Panel: [],

        Type: "1",
        fromTime: moment().startOf("day").format("hh:mm A"), // 12:00 AM
        toTime: moment().endOf("day").format("hh:mm A"),
        //           fromTime:   moment().format("LT"),
        //   toTime: moment().format("LT"),
        //     fromTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
        //   toTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })

    };

    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
        Floor: []
    })
    const [values, setValues] = useState({ ...initialValues });
    console.log("values", values)
    const handleReactSelectChange = (name, e) => {
        setValues((pre) => ({
            ...pre,
            [name]: e ? e.value : null,
        }))
    };
    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        setValues((p) => ({ ...p, [name]: value }));
    };
    // const handleDateTimeChange = (name, value) => {
    //   let dateObj = value instanceof Date ? value : new Date(value);

    //   setValues((prev) => ({
    //     ...prev,
    //     [name]: formatTime(dateObj)
    //   }));
    // };



    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };

    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),]);

        // if (CentreList?.success) {
        //   setDropDownData((val) => ({ ...val, CentreList: handleReactSelectDropDownOptions(CentreList?.data, "CentreName", "CentreID") }))
        // }

        if (DoctorList?.success) {
            setDropDownState((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
        }
    }

    useEffect(() => {
        bindDropdownData()
    }, [])
    const BindDepartment = async () => {                             ///////////////////BIND DEPARTMENT/////////
        try {
            const response = await ToolBindDepartment();
            console.log("ressssssssssssssssp", response?.data);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    Department: handleReactSelectDropDownOptions(
                        response?.data,
                        "ledgerName",
                        "ledgerNumber"
                    ),
                }));

            }
            else {
                setDropDownState([])

            }

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const BindReportOption = async () => {
        try {
            const response = await BillingBindReportOption(reportTypeID);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    ReportOption: handleReactSelectDropDownOptions(
                        response?.data,
                        "TypeName",
                        "TypeID"
                    ),
                }));

            }
            else {
                setDropDownState([])

            }
            //   return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getBindRoomType = async () => {
        try {
            const response = await RoomType();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    RoomType: handleReactSelectDropDownOptions(
                        response?.data,
                        "Name",
                        "IPDCaseTypeID"
                    ),
                }));
            }
            else {
                setDropDownState([])

            }
            return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getPanelList = async () => {
        try {
            const response = await EDPBindPanelsAPI();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    PanelList: handleReactSelectDropDownOptions(
                        response?.data,
                        "Company_Name",
                        "PanelID"
                    ),
                }));
            }
            else {
                setDropDownState([])

            }
            return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getFloorlList = async () => {
        try {
            const response = await BindFloor();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    Floor: handleReactSelectDropDownOptions(
                        response?.data,
                        "name",
                        "id"
                    ),
                }));
            }
            else {
                setDropDownState([])

            }
            return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        getBindRoomType();
        BindReportOption()
        BindDepartment()
        getPanelList()
        getFloorlList()

    }, []);
    console.log("dropDownState", dropDownState)
    // const roomtype=values?.RoomType?.map((val)=>val.code).join(",")
    // const stringValue = values?.RoomType?.map(item => `'${item.code}'`).join(',');
    // console.log("stringValue",stringValue)
    const SaveData = async () => {
        if (!values?.ReportType) {
            notify("Please Select Report Type", "warn")
            return
        }
        //  if (!values?.RoomType) {
        //     notify("Please Select Room Type","warn")
        //     return
        // }
        let stringValue
        if (values?.ReportType === 1) {

            stringValue = values?.RoomType?.map(item => `'${item.code}'`).join(',');
        }
        else if (values?.ReportType === 2) {

            stringValue = values?.doctor?.map(item => `'${item.code}'`).join(',');
        }
        else if (values?.ReportType === 3) {

            stringValue = "";
        }
        else if (values?.ReportType === 4) {

            // stringValue = values?.Department?.map(item => `'${item.code}'`).join(',');
            // debugger
            stringValue = values.Department.map(item => `'${item.code}'`).join(',');

            // stringValue = "";
        }
        else if (values?.ReportType === 5) {

            stringValue = values?.Floor?.map(item => `'${item.code}'`).join(',');
        }
        else if (values?.ReportType === 6) {

            stringValue = values?.Panel?.map(item => `'${item.code}'`).join(',');
        }

        if (!stringValue) {
            notify("Please Select Required Field", "warn")
            return
        }

        const payload =
        {
            "reportType": Number(values?.ReportType),
            "itemIds": stringValue ? stringValue : "",
            // "itemIds": "'1','233'",
            "fromdate": moment(values?.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(values.toDate).format("YYYY-MM-DD"),
            "type": Number(values?.listType),
            "printValueReport": Number(values?.Type),
            "fromTime": values?.fromTime
            //    ? moment(values?.fromTime).format("hh:mm A")
            //    : "",,
            ,
            "toTime": values?.toTime
            //    ? moment(values?.toTime).format("hh:mm A")
            //    : "",
        }

        //         {
        //   "reportType": 0,
        //   "itemIds": "string",
        //   "fromdate": "string",
        //   "toDate": "string",
        //   "type": 0,
        //   "printValueReport": 0,
        //   "fromTime": "string",
        //   "toTime": "string"
        // }
        // moment(payload?.shiftTime).format("hh:mm A")
        const response = await BillingReportsAdmitDischargeList(payload);
        // if (response.success) {
        //     RedirectURL(response?.data?.pdfUrl);
        // }
        // else {
        //     notify(response.message, "error");
        // }
        if (response?.success) {
            if (values?.Type === "1") {
                RedirectURL(response?.data?.pdfUrl);
            } else if (values?.Type === "0") {
                const formattedData = response?.data?.map((item) => {
                   
                    const stripHtml = (html) => {
                        if (typeof html !== 'string') {
                            return '';
                        }
                        
                        return html
                            .replace(/<[^>]*>/g, '') 
                            .replace(/&nbsp;/g, ' '); 
                    };

                    return {
                        ...item,
                        diagnosis: stripHtml(item.diagnosis).trim(), 
                    };
                });
                exportToExcel(formattedData, "Admission/Discharged Patient LIst");

            }

        } else {
            notify(response?.message, "error");
        }


    };

    console.log("dropDownState?.ReportOption", dropDownState?.ReportOption)
    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={false} title={"Admission/Discharged Patient LIst"} />
                <div className="row p-2">
                    <ReportDatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        id="fromDate"
                        name="fromDate"
                        lable={t("fromDate")}
                        values={values}
                        setValues={setValues}
                        max={values?.toDate}
                    />

                    <ReportDatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        lable={t("toDate")}
                        values={values}
                        setValues={setValues}
                        max={new Date()}
                        min={values?.fromDate}
                    />
                    {/* <TimePicker
            placeholderName="From tTime"
            lable={t("From Time")}
            id="fromtTime"
            name="fromtTime"
            value={values?.fromTime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          /> */}
                    {/* <TimePicker
            placeholderName="from Time"
            lable={t("from Time")}
            id="fromTime"
            name="fromTime"
            value={values?.fromTime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          /> */}

                    {/* <TimePicker
            placeholderName="To Time"
            lable={t("To Time")}
            id="toTime"
            name="toTime"
            value={values?.toTime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          /> */}
                    <TimeInputPicker
                        lable={"From Time"}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="fromTime"
                        // id="fromTime"
                        onChange={handleDateTimeChange}
                        value={values?.fromTime}
                    />
                    <TimeInputPicker
                        lable={"To Time"}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="toTime"
                        // id="toTime"
                        onChange={handleDateTimeChange}
                        value={values?.toTime}
                    />

                    <ReactSelect
                        placeholderName={t("List Type")}
                        id={"listType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        // dynamicOptions={dropDownState}
                        dynamicOptions={[
                            { label: "Admission", value: "1" },
                            { label: "Discharged", value: "2" },
                        ]}
                        name="listType"
                        handleChange={handleReactSelectChange}
                        value={values.listType}
                    />
                    <ReactSelect
                        placeholderName={t("Report Type")}
                        id={"ReportType"}
                        requiredClassName={"required-fields"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        dynamicOptions={[
                            // { label: "All", value: "0" },
                            ...(dropDownState?.ReportOption || [])
                        ]}
                        name="ReportType"
                        handleChange={handleReactSelectChange}
                        value={values.ReportType}
                    />
                    {
                        values?.ReportType === 1 &&
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                            <MultiSelectComp
                                placeholderName={t("RoomType")}
                                id={"RoomType"}
                                name="RoomType"
                                value={values?.RoomType}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.RoomType?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}
                                searchable={true}

                            />
                        </div>
                    }
                    {
                        values?.ReportType === 2 &&
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                            <MultiSelectComp
                                placeholderName={t("Doctor")}
                                id={"doctor"}
                                name="doctor"
                                value={values?.doctor}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}
                                searchable={true}

                            />
                        </div>
                    }
                    {
                        values?.ReportType === 4 &&
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                            <MultiSelectComp
                                placeholderName={t("Department")}
                                id={"Department"}
                                name="Department"
                                value={values?.Department}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.Department?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}

                                searchable={true}

                            />
                        </div>
                    }
                    {
                        values?.ReportType === 5 &&
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                            <MultiSelectComp
                                placeholderName={t("Floor")}
                                id={"Floor"}
                                name="Floor"
                                value={values?.Floor}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.Floor?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}

                                searchable={true}

                            />
                        </div>

                    }
                    {
                        values?.ReportType === 6 &&
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">


                            <MultiSelectComp
                                placeholderName={t("Panel")}
                                id={"Panel"}
                                name="Panel"
                                value={values?.Panel}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.PanelList?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}

                                searchable={true}

                            />
                        </div>

                    }

                    <ReactSelect
                        placeholderName={t("Type")}
                        id={"Type"}
                        searchable={true}
                        respclass="col-xl-1 col-md-1 col-sm-3 col-12"

                        dynamicOptions={[
                            { label: "Pdf", value: "1" },
                            { label: "Excel", value: "0" },

                        ]}

                        name="Type"
                        handleChange={handleReactSelectChange}
                        value={values.Type}
                    />
                    <div className="col-sm-1">
                        <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Report</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdmitDischargelist;
