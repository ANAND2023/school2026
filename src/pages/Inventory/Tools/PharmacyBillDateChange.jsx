import React, { useEffect, useState } from "react";

import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { BillingAdmittedPatientWithoutDischarg, BillingBindReportOption, BillingReportsAdmitDischargeList, BillingReportsBindReportType, BindNABH, EDPReportsGetDepartment, PrintNBHReport } from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import moment from "moment/moment";

import { GetBindDepartment, RoomType, ToolBindDepartment } from "../../../networkServices/BillingsApi";

import { BindDoctorDept } from "../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../networkServices/EDP/edpApi";

import Input from "../../../components/formComponent/Input";
import { BillingUpdateBillDateOfPatient } from "../../../networkServices/Tools";
import { notify } from "../../../utils/ustil2";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DatePicker from "../../../components/formComponent/DatePicker";
import Tables from "../../../components/UI/customTable";
import { BillingToolUpdatePharmacyBillDate, GetDetailsForChangePharmacyBillDate } from "../../../networkServices/InventoryApi";
import ReactSelect from "../../../components/formComponent/ReactSelect";

const PharmacyBillDateChange = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ipdNo: "",
        Type: "1",
        Panel: ""

    };
    const [selectedRows, setSelectedRows] = useState([]);

    console.log("selectedRows", selectedRows)
    const [patientDetails, setPatientDetails] = useState({})
    const [patientDetails2, setPatientDetails2] = useState([])
    // const [allSelected, setAllSelected] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    console.log("allSelected", allSelected)
    const handleSelectAll = (e) => {
        const isSelected = e.target.checked;
        setAllSelected(isSelected);

        if (isSelected) {
            // Select all rows with index
            const allRowsWithIndex = patientDetails2.map((row, idx) => ({ ...row, index: idx }));
            setSelectedRows(allRowsWithIndex);
        } else {
            setSelectedRows([]);
        }
    };


    const handleRowSelect = (e, row, index) => {
        const isSelected = e.target.checked;

        setSelectedRows(prev => {
            if (isSelected) {
                // Add full row object if not already selected
                return [...prev, { ...row, index }];
            } else {
                // Remove row by index
                return prev.filter(r => r.index !== index);
            }
        });
    };

    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
        Department: [],
        Floor: [],

    })
    const THEAD = [
        // Select All
        { name: <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />, width: "5%" },
        { name: t("Panel Name"), width: "2%" },

        { name: t("Bill No."), width: "30%" },
        { name: t("Bill Date"), width: "30%" },
        { name: t("Entry Date"), width: "30%" },

    ];
    const [values, setValues] = useState({ ...initialValues });
    const handleReactSelectChange = (name, e) => {
        setValues((pre) => ({
            ...pre,
            [name]: e?.value
        }))
    };

    const handleInputChecked = (e) => {
        const { name, type, value, checked } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleInputChange = (e) => {
        debugger
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }));
    };
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };

    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),
            //   getBindCenterAPI()
        ]);



        if (DoctorList?.success) {
            setDropDownState((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
        }
    }

    useEffect(() => {
        bindDropdownData()
    }, [])

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
                // setDropDownState([])

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


    const getDepartment = async () => {


        const payload = {
            CategoryID: "All",
            Name: "All",
            CenterId: 1,
        }
        try {
            const response = await EDPReportsGetDepartment(payload);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    Department: handleReactSelectDropDownOptions(
                        response?.data,
                        "NAME",
                        "SubCategoryID"
                    ),
                }));

            }

            else {
                // setDropDownState([])
                setDropDownState((preV) => (
                    {
                        ...preV,
                        DepartmentList: []
                    }
                ))

            }

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    useEffect(() => {
        getBindRoomType();
        // BindReportOption()
        // BindDepartment()
        getPanelList()
        getDepartment()
        // getFloorlList()

    }, []);

    const UpdateDate = async () => {
        debugger
        const payload =
        //         {
        //   "type": 0,
        //   "billNo": "string",
        //   "transationId": 0,
        //   "ledgertransactionNo": 0,
        //   "previousBillDate": "string",
        //   "currentBillDate": "string"
        // }


        {
            "type": Number(values?.PatientType),
            "billNo": patientDetails?.BillNo,
            "transationId": Number(patientDetails?.LedgerTnxID),
            "ledgertransactionNo": Number(patientDetails?.LedgertransactionNo),
            // "transationId": Number(patientDetails?.TransactionID),
            "previousBillDate": moment(patientDetails?.DATE).format("YYYY-MM-DD"),
            "currentBillDate": values?.Date ? moment(values?.Date).format("YYYY-MM-DD") : moment(patientDetails?.DATE).format("YYYY-MM-DD")
        }
        //         {
        //   "type": 0,
        //   "billNo": "string",
        //   "transationId": "string",
        //   "previousBillDate": "string",
        //   "currentBillDate": "string"
        // }
        try {

            const response = await BillingUpdateBillDateOfPatient(payload)
            if (response?.success) {
                setPatientDetails({})
                notify(response?.message, "success")

            }
            else {
                notify(response?.message, "warn")
            }
        } catch (error) {

        }
    }
    console.log("values", values)
    const ChangeDatePharmacy = async () => {
        if (selectedRows?.length <= 0) {
            notify("Please Select atleast one item", "warn")
            return
        }
        if (values?.Type === "1") {
            if (!values?.Date) {
                notify("Please Select Date", "warn")
                return
            }
        }
        else {
            // if (!values?.Panel) {
            //     notify("Please Select Panel", "warn")
            //     return
            // }
        }


        const payload =
        // {
        //   "patientID": 0,
        //   "ipdNo": 0,
        //   "currentPanelId": 0,
        //   "type": 0,
        //   "currentPharmBillDate": "string",
        //   "pharmacyBillDateUpdates": [
        //     {
        //       "billNo": "string",
        //       "ledgertransactionNo": 0,
        //       "previousePanelId": 0,
        //       "previousPharmBillDate": "string"
        //     }
        //   ]
        // }

        {
            "patientID": Number(patientDetails2[0]?.PatientID),
            "ipdNo": Number(patientDetails2[0]?.IPDNo),
            "currentPanelId": Number(values?.Panel),
            "type": Number(values?.Type),
            "currentPharmBillDate": moment(values?.Date).format("YYYY-MM-DD"),
            "pharmacyBillDateUpdates":
                selectedRows?.map((val) => (
                    {
                        "billNo": val?.BillNo,
                        "ledgertransactionNo": Number(val?.LedgertransactionNo),
                        "previousePanelId": Number(val?.PanelID),
                        "previousPharmBillDate": moment(val?.BillDate).format("YYYY-MM-DD")
                    }
                ))

        }


        try {

            const response = await BillingToolUpdatePharmacyBillDate(payload)
            if (response?.success) {
                setSelectedRows([])
                setValues((preV) => ({
                    ...preV,
                    Date: "",
                    Panel:"",
                    // Type:"1"
                }))
                notify(response?.message, "success")
                setPatientDetails2([])
            }
            else {
                notify(response?.message, "warn")
            }
        } catch (error) {

        }
    }
    const SearchData = async () => {

        const payload =
        {

            "ipdNo": String(values?.ipdNo)
        }

        const response = await GetDetailsForChangePharmacyBillDate(payload);
        if (response.success) {
            setPatientDetails2(response?.data)
        }
        else {
            notify(response.message, "error");
        }

    };
    console.log("patientDetails", patientDetails)
    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={true} title={"Change doctor and bill date"} />
                <div className="row p-2">



                    <Input
                        type="number"
                        className="form-control"
                        removeFormGroupClass={false}
                        name="ipdNo"
                        lable={t("IPD No.")}
                        required={true}
                        onChange={handleInputChange}

                        value={values?.ipdNo}
                        respclass="col-xl-3 col-md-3 col-sm-6 col-6"
                    />
                    <div className="col-sm-1">
                        <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>Search</button>
                    </div>
                </div>


            </div>

            {
                patientDetails2?.length > 0 &&
                <div className="card ">
                    <Heading isBreadcrumb={false} title={"Patient Details"} />

                    <div className=" row p-2 ">
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"Name"}
                                value={patientDetails2[0]?.PName}
                                className=""
                            />
                        </div>
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"UHID"}
                                value={patientDetails2[0]?.PatientID}
                                className=""
                            />
                        </div>
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"IPDNo"}
                                value={patientDetails2[0]?.IPDNo}
                                className=""
                            />
                        </div>
                         
                        {/* <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"STATUS"}
                                value={patientDetails2[0]?.STATUS}
                                className=""
                            />
                        </div> */}
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"DateOfAdmit"}
                                value={moment(patientDetails2[0]?.DateOfAdmit).format("DD-MMM-YYYY")}
                                className=""
                            />
                        </div>
                        {
                            patientDetails2[0]?.DateOfDischarge && <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={"DateOfDischarge"}
                                    value={moment(patientDetails2[0]?.DateOfDischarge).format("DD-MMM-YYYY")}
                                    className=""
                                />

                            </div>

                        }




                    </div>
                    <div className=" row p-2 ">
                        <ReactSelect
                            placeholderName={t("Type")}
                            id={"Type"}
                            searchable={true}
                            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                            dynamicOptions={[
                                { label: "Date", value: "1" },
                                { label: "Panel", value: "2" },
                            ]}

                            name="Type"
                            handleChange={handleReactSelectChange}
                            value={values.Type}
                            requiredClassName={"required-fields"}
                        />

                        {
                            values?.Type === "1" ? <DatePicker
                                className={`custom-calendar `}
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                id="Date"
                                name="Date"
                                // inputClassName={"required-fields"}
                                value={values?.Date || new Date(patientDetails?.DATE)}
                                // value={values?.EntryDate ? values?.EntryDate : new Date()}
                                handleChange={handleInputChange}
                                lable={t("Date")}
                                placeholder={VITE_DATE_FORMAT}
                                maxDate={new Date()}
                            /> : 
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"Current Panel"}
                                value={patientDetails2[0]?.Company_Name}
                                className=""
                            />
                        </div>
                            
                            // <ReactSelect
                            //     placeholderName={t("Panel")}
                            //     id={"Panel"}
                            //     searchable={true}
                            //     respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                            //     dynamicOptions={dropDownState?.PanelList}

                            //     name="Panel"
                            //     handleChange={handleReactSelectChange}
                            //     value={values.Panel}
                            //     requiredClassName={"required-fields"}
                            // />
                        }


                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={ChangeDatePharmacy}>{values?.Type === "1" ? "Change Date" : "Change Panel"}</button>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={() => { setPatientDetails2([]) }}>Cancel</button>
                        </div>
                        <div className="col-sm-1">                        <p>{patientDetails2[0]?.STATUS === "OUT" ? <span style={{ fontSize: "20px", color: "Red", fontWeight: "bold" }}>Patient OUT</span> : <span style={{ fontSize: "20px", color: "green", fontWeight: "bold" }}>Patient IN</span>}</p>
                        </div>
                    </div>
                    <div className="row p-2">
                        <Tables
                            thead={THEAD}
                            tbody={patientDetails2?.map((val, ind) => ({
                                select: (
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.some(r => r.index === ind)} // check by index
                                        onChange={(e) => handleRowSelect(e, val, ind)}
                                    />
                                ),
                                Company_Name: val?.Company_Name,
                                BillNo: val?.BillNo,
                                BillDate: val?.BillDate,
                                EntryDate: moment(val?.EntryDate).format("DD-MMM-YYYY"),
                            }))}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default PharmacyBillDateChange;

