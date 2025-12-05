import React, { useEffect, useState } from "react";

import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BillingAdmittedPatientWithoutDischarg, BillingBindReportOption, BillingReportsAdmitDischargeList, BillingReportsBindReportType, BindNABH, EDPReportsGetDepartment, PrintNBHReport } from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { GetBindDepartment, RoomType, ToolBindDepartment } from "../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import { BindDoctorDept } from "../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../networkServices/EDP/edpApi";
import { exportToExcel } from "../../../utils/exportLibrary";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import Input from "../../../components/formComponent/Input";
import { BillingGetDetailsForChangeBillDate, BillingGetToEditDoctor, BillingUpdateBillDateOfPatient, BillingUpdateDoctorName } from "../../../networkServices/Tools";
import { notify } from "../../../utils/ustil2";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DatePicker from "../../../components/formComponent/DatePicker";
import Tables from "../../../components/UI/customTable";

const ChangeDoctorAndBillDate = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ReportType: "S",
        PatientType: "1",
        // listType: "1",
        // RoomType: [],
        // doctor: [],
        Department: [],
        // Floor: [],
        Panel: [],
        Type: "Date",
        billNo: "",
        Date: "",
        // BillDate: "",
        isChangeForBill: false,
        Doctor: ""

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

    // const handleSelectAll = (e) => {
    //   const isSelected = e.target.checked;
    //   setAllSelected(isSelected);

    //   if (isSelected) {
    //     // Copy all rows with all their values
    //     setSelectedRows(patientDetails2.map(row => ({ ...row })));
    //   } else {
    //     setSelectedRows([]);
    //   }
    // };

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

    // const handleRowSelect = (e, row) => {
    //   const isSelected = e.target.checked;

    //   setSelectedRows(prev => {
    //     if (isSelected) {
    //       // Add the row if not already selected
    //       return [...prev, row];
    //     } else {
    //       // Remove row if unchecked
    //       return prev.filter(r => r.PatientID !== row.PatientID);
    //     }
    //   });
    // };

    // const handleRowSelect = (e, row) => {
    //   const isSelected = e.target.checked;

    //   setSelectedRows(prev => {
    //     if (isSelected) {
    //       // Add the full row object with all values
    //       return [...prev, { ...row }];
    //     } else {
    //       // Remove the row if unchecked
    //       return prev.filter(r => r.PatientID !== row.PatientID);
    //     }
    //   });
    // };

    // const handleSelectAll = (e) => {
    //     const isSelected = e.target.checked;
    //     setAllSelected(isSelected);
    //     // const newSelectedRows = {};
    //     if (isSelected) {
    //         // tableData.forEach((_, index) => {
    //         //     newSelectedRows[index] = true;
    //         // });
    //         setSelectedRows([...tableData]);

    //     }
    //      else {
    //   setSelectedRows([]);
    // }
    //     // setSelectedRows(newSelectedRows);
    // };
    console.log("patientDetails1", patientDetails)
    console.log("patientDetails2", patientDetails2)
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
        { name: t("Item Name"), width: "50%" },
        { name: t("Doctor Name"), width: "50%" },
        { name: t("Bill's Doctor"), width: "50%" },

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
            "transationId": Number(patientDetails?.TransactionID),
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
    console.log("values",values)
    const UpdateDoctor = async () => {
        if (!values?.Doctor) {
            notify("Please Select Doctor", "warn")
            return
        }
        if (selectedRows?.length <= 0) {
            notify("Please Select atleast one item", "warn")
            return
        }
        const payload =
        {
            "currentDoctorID": Number(values?.Doctor),
            "isChangeForBill": values?.isChangeForBill ? 1 : 0,
            "doctorUpdates":
                selectedRows?.map((val) => (
                    {
                        "ledgerTnxID": val?.LedgerTnxID,
                        "previousDoctorID": Number(val?.DoctorID)
                    }))

        }

        try {

            const response = await BillingUpdateDoctorName(payload)
            if (response?.success) {
                // setPatientDetails({})
                setSelectedRows([])
                // SearchData()
                setValues((preV)=>({
                    ...preV,
                    isChangeForBill:false
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
        debugger


        const payload =
        {
            "billNoOrCTBNo": values?.billNo ?? "",
            "type": Number(values?.PatientType)
        }

        // {
        //     BillNo: values?.billNo ?? ""


        // }
        const payloadForDoctorChange =
        {
            "billNoOrCTB": values?.billNo ?? "",
            "type": Number(values?.PatientType)
        }



        if (values?.Type === "Date") {
            if (payload?.BillNo === "") {
                notify("Please Fill BillNo.", "warn")
                return
            }

            const response = await BillingGetDetailsForChangeBillDate(payload)
            if (response.success) {
                setPatientDetails(response?.data[0])
            }
            else {
                notify(response.message, "error");
            }
        }
        else {
            const response = await BillingGetToEditDoctor(payloadForDoctorChange);
            if (response.success) {
                setPatientDetails2(response?.data)
            }
            else {
                notify(response.message, "error");
            }
        }

        console.log("patientDetails", patientDetails)
const hasPatients = 
  (patientDetails2 && patientDetails2.length > 0) || 
  (patientDetails && patientDetails.length > 0);

    };
    console.log("patientDetails",patientDetails)
    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={true} title={"Change doctor and bill date"} />
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Change Doctor/Bill Date")}
                        id={"Type"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                        dynamicOptions={[
                            { label: "Change Bill Date", value: "Date" },
                            { label: "Change Doctor", value: "Doctor" },

                        ]}

                        name="Type"
                        handleChange={handleReactSelectChange}
                        value={values.Type}
                        requiredClassName={"required-fields"}
                        isDisabled={ 
  (patientDetails && Object.keys(patientDetails)?.length > 0 ) || (patientDetails2 && patientDetails2.length > 0) }
                        // isDisabled={!!(patientDetails2?.length > 0 || patientDetails?.length > 0)}
                    />
                    <ReactSelect
                        placeholderName={t("Patient Type")}
                        id={"PatientType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        dynamicOptions={[
                            // { label: "All", value: "All" },
                            { label: "OPD", value: "1" },
                            { label: "IPD", value: "2" },

                        ]}
                        name="PatientType"
                        handleChange={handleReactSelectChange}
                        value={values.PatientType}
                        requiredClassName={"required-fields"}
                    />
                    {
                        values.Type === "Date" ? <Input
                            type="text"
                            className="form-control"
                            removeFormGroupClass={false}
                            name="billNo"
                            lable={t("Bill No")}
                            required={true}
                            onChange={handleInputChange}
                            //   onKeyDown={handleKeyDown} // Add keydown event handler
                            //   inputRef={inputRef}
                            value={values?.billNo}
                            respclass="col-xl-3 col-md-3 col-sm-6 col-6"
                        />
                            :
                            (
                                <>


                                    <Input
                                        type="text"
                                        className="form-control"
                                        removeFormGroupClass={false}
                                        name="billNo"
                                        lable={t("Bill No / CTB")}
                                        required={true}
                                        onChange={handleInputChange}
                                        //   onKeyDown={handleKeyDown} // Add keydown event handler
                                        //   inputRef={inputRef}
                                        value={values?.billNo}
                                        respclass="col-xl-3 col-md-3 col-sm-6 col-6"
                                    />
                                </>
                            )

                    }



                    <div className="col-sm-1">
                        <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>Search</button>
                    </div>
                </div>


            </div>
            {
                Object.keys(patientDetails)?.length > 0 &&
                <div className="card ">
                    <Heading isBreadcrumb={false} title={"Patient Details"} />

                    <div className=" row p-2 ">
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"Name"}
                                value={patientDetails?.PatientName}
                                className=""
                            />
                        </div>
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"Age"}
                                value={patientDetails?.Age}
                                className=""
                            />
                        </div>
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"BillNo"}
                                value={patientDetails?.BillNo}
                                className=""
                            />
                        </div>
                        {
                            console.log("values", values)
                        }
                        <DatePicker
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
                        />

                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={UpdateDate}>Update Date</button>
                        </div>
  <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={() => { setPatientDetails([]) }}>Cancel</button>
                        </div>

                    </div>

                </div>
            }
            {
                patientDetails2?.length > 0 &&
                <div className="card ">
                    <Heading isBreadcrumb={false} title={"Patient Details"} />

                    <div className=" row p-2 ">
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <LabeledInput
                                label={"Name"}
                                value={patientDetails2[0]?.PatientName}
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
                                label={"DATE"}
                                value={patientDetails2[0]?.DATE}
                                className=""
                            />
                        </div>

                        <div className="d-flex">
                            <input
                                type="checkbox"
                                placeholder=" "
                                className="mt-2"
                                name="isChangeForBill"
                                value={values?.isChangeForBill}
                                onChange={handleInputChecked}
                                respclass="col-md-1 col-1"
                            />
                            <label className="mt-2 ml-3">{("Is Change For Bill")}</label>
                        </div>

                        <ReactSelect
                            placeholderName={t("Doctor")}
                            id={"Doctor"}
                            searchable={true}
                            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                            dynamicOptions={dropDownState?.DoctorList}

                            name="Doctor"
                            handleChange={handleReactSelectChange}
                            value={values.Doctor}
                            requiredClassName={"required-fields"}
                        />
                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={UpdateDoctor}>Update Doctor</button>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success mx-1" onClick={() => { setPatientDetails2([]) }}>Cancel</button>
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
                                ItemName: val?.ItemName,
                                DoctorName: val?.DoctorName,
                                BilledDoctor: val?.BilledDoctor,
                            }))}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default ChangeDoctorAndBillDate;

