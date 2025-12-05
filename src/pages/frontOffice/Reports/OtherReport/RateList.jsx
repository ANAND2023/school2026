import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { BillingRateListReport, EDPEDPReportsGetLoadCategory, EDPRateListReportSearch, EDPReportsGetBindCenter, EDPReportsGetDepartment, EDPReportsGetLoadScheduleCharges } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { BindCategory, EDPReportsGetRoomList, RoomType, ToolBindDepartment } from "../../../../networkServices/BillingsApi";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BindPaymentModePanelWise } from "../../../../networkServices/PaymentGatewayApi";
import { useSelector } from "react-redux";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { useDispatch } from "react-redux";
import { GetBindDepartment } from "../../../../store/reducers/common/CommonExportFunction";
import { getBindDetailUser, getBindTypeOfTnx } from "../../../../networkServices/ReportsAPI";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import { exportToExcel } from "../../../../utils/exportLibrary";
const RateList = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ReportType: {},
        Centre: {},
        // listType: {},
        PaymentMode: {},
        IPDCaseTypeID: [],
        Department: [],
        Type: { label: "Pdf", value: "1" },
        Category: { label: "All", value: "All" },
        Panel: {},
        PatientType: { label: "All", value: "All" },
    };
    const dispatch = useDispatch();
    const [dropDownState, setDropDownState] = useState({
        BindCategroy: [],
        DepartmentList: [],
        PanelList: [],
        ScheduleChargesList: [],
        CentreList: [],
    })
    console.log("dropDownStatedropDownState", dropDownState)
    const [paymentMode, setPaymentMode] = useState([]);
    const {
        GetEmployeeWiseCenter,
        GetBindAllDoctorConfirmationData,
        getBindSpecialityData,
    } = useSelector((state) => state.CommonSlice);
    const fetchPaymentMode = async () => {
        try {
            const data = await BindPaymentModePanelWise({
                PanelID: "1",
            });
            setPaymentMode(data?.data);
        } catch (error) {
            console.error("Failed to load currency detail:", error);
        }
    };
    useEffect(() => {
        fetchPaymentMode()
    }, [])

    const [values, setValues] = useState({ ...initialValues });
    console.log("valuesvaluesvaluesvaluesvalues", values)
    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),
        ]);
        if (DoctorList?.success) {
            setDropDownState((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
        }
    }
    // const { GetDepartmentList } = useSelector(
    //     (state) => state.CommonSlice
    // );
    // useEffect(() => {

    //     dispatch(GetBindDepartment());
    // }, [dispatch]);
    //   console.log("GetDepartmentList",GetDepartmentList)
    const [bodyData, setBodyData] = useState({
        SearchPatient: [],
        getRoomType: [],
        getBindFloor: [],
        getBindPanel: [],
    });
    const getBindRoomType = async (val) => {
        try {
            const CenterId = val
            const dataRes = await EDPReportsGetRoomList(CenterId);
            setBodyData((prevState) => ({
                ...prevState,
                getRoomType: dataRes?.data,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        bindDropdownData()
        // getBindRoomType()
    }, [])
    const getDepartment = async (payload) => {
        debugger

        try {
            const response = await EDPReportsGetDepartment(payload);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    DepartmentList: handleReactSelectDropDownOptions(
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
    // const BindDepartment = async () => {
    //     try {
    //         const response = await ToolBindDepartment();
    //         if (response?.success) {
    //             setDropDownState((val) => ({
    //                 ...val,
    //                 Department: handleReactSelectDropDownOptions(
    //                     response?.data,
    //                     "ledgerName",
    //                     "ledgerNumber"
    //                 ),
    //             }));

    //         }
    //         else {
    //             setDropDownState([])

    //         }

    //     } catch (error) {
    //         console.log(error, "SomeThing Went Wrong");
    //     }
    // };
    const getBindCenter = async (id) => {

        try {
            const response = await EDPReportsGetBindCenter(id);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    CentreList: handleReactSelectDropDownOptions(
                        response?.data,
                        "CentreName",
                        "CentreID"
                    ),
                }));

            }
            else {
                // setDropDownState([])

            }

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getLoadScheduleCharges = async (id) => {

        try {
            const response = await EDPReportsGetLoadScheduleCharges(id);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    ScheduleChargesList: handleReactSelectDropDownOptions(
                        response?.data,
                        "NAME",
                        "ScheduleChargeID"
                    ),
                }));

            }
            else {
                // setDropDownState([])


            }

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const EDPReportsGetLoadCategory = async (id) => {
        debugger
        try {
            const response = await EDPEDPReportsGetLoadCategory(id);
            if (response?.success) {

                setDropDownState((val) => ({
                    ...val,
                    BindCategroy: handleReactSelectDropDownOptions(
                        response?.data?.categories,
                        "name",
                        "categoryID"
                    ),
                }));
                setDropDownState((val) => ({
                    ...val,
                    PanelList: handleReactSelectDropDownOptions(
                        response?.data?.panels,
                        "company_Name",
                        "panelID"
                    ),
                }));
            }
            else {
                // setDropDownState((preV)=>(
                //    { ...preV,
                //     PanelList:[]}
                // ))

            }
            // return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    useEffect(() => {
        EDPReportsGetLoadCategory("All")
        getBindCenter()

    }, []);

    const fetchData = async () => {
        try {
            const [userData, tnxData] = await Promise.all([
                getBindDetailUser(),
                getBindTypeOfTnx(),
            ]);

            setApiData({
                getBindDetailsUSerData: userData.data,
                getBindTypeOfTnxData: tnxData.data,
            });

            console.log(localUserData);
            setValues({
                ...values,
                type: handleMultiSelectOptions(
                    tnxData?.data,
                    "DisplayName",
                    "TypeOfTnx"
                ),
                ["centre"]: handleMultiSelectOptions(
                    GetEmployeeWiseCenter,
                    "CentreName",
                    "CentreID"
                ),
                user: handleMultiSelectOptions(
                    userData.data?.filter(
                        (item, _) =>
                            String(item?.EmployeeID) === String(localUserData?.employeeID)
                    ),
                    "Name",
                    "EmployeeID"
                ),
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (GetEmployeeWiseCenter.length > 0) fetchData();
    }, [GetEmployeeWiseCenter?.length]);

    console.log("values", values)
    const HandleSearch = async () => {
        if (!values?.PatientType?.value) {
            notify("Please Select Patient Type", "warn")
            return
        }
        if (!values?.PatientType?.value) {
            notify("Please Select Patient Type", "warn")
            return
        }
        if (!values?.Panel?.value) {
            notify("Please Select Panel", "warn")
            return
        }
        if (!values?.Centre?.value) {
            notify("Please Select Centre", "warn")
            return
        }
        if (!values?.Category?.value) {
            notify("Please Select Category", "warn")
            return
        }
        if (!values?.PaymentMode?.value) {
            notify("Please Select Schedule Charge", "warn")
            return
        }
        if (values?.Department?.length <= 0) {
            notify("Please Select Department", "warn")
            return
        }
        const payload =
        {
            "categoryID": String(values?.Category?.value === "All" ? "All#0" : values?.Category?.value),
            "name": values?.PatientType?.value ?? "",
            "centerId": String(values?.Centre?.value),
            // "rateType": String(values?.Type?.value),
            rateType: "1",
            "type": String(values?.Type?.value),
            "department": values?.Department?.map((val) => val?.code),
            "caseType": values?.PatientType?.value === "OPD" ? "" : values?.IPDCaseTypeID?.map((val) => val?.code),
            "panelID": String(values?.Panel?.value),
            "schedulechargeID": values?.PaymentMode?.value ?? ""
        }


        const response = await EDPRateListReportSearch(payload);


        if (response.success) {
            //  exportToExcel(response?.data, "Rate List Report");
            //    RedirectURL(response?.data?.pdfUrl);
            debugger
            if (values?.Type?.value == 1) {
                RedirectURL(response?.data?.pdfUrl);
            }
            else {
                exportToExcel(response?.data, "Rate List Report");
            }
        }
        else {
            notify(response.message, "error");
        }
    };
    const handleReactSelectChange = (name, e) => {
        debugger
        if (name === "PatientType") {
            // PatientType

            EDPReportsGetLoadCategory(e?.value)
        }
        if (name === "Panel") {
            // PatientType
            setValues((preV) => (
                {
                    ...preV,
                    PaymentMode: ""
                }
            ))
            getLoadScheduleCharges(e?.value)
            getBindCenter(e?.value)
        }
        if (name === "Centre") {

            getBindRoomType(e?.value)
        }
        if (name === "Category") {

            setValues((preV) => (
                {
                    ...preV,
                    Department: []
                }
            ))
        }
        // const obj = { ...values };
        // obj[name] = e?.value;
        // setValues(obj);
        setValues((preV) => ({
            ...preV,
            [name]: e
        }))
    };
    const handleMultiSelectChange = (name, selectedOptions) => {

        setValues({ ...values, [name]: selectedOptions });
    };

    useEffect(() => {
        debugger
        const payload = {
            CategoryID: values?.Category?.value ?? "",
            Name: values?.PatientType?.value ?? "",
            CenterId: values?.Centre?.value ?? "",
        }
        if (values?.Centre?.value) {
            getDepartment(payload)
        }
    }, [values.Category, values.PatientType, values?.Centre])


    useEffect(() => {
        if (dropDownState?.PanelList?.length > 0) {
            setValues((preV) => ({
                ...preV,
                Panel: dropDownState.PanelList[0]
            }));

            getLoadScheduleCharges(dropDownState.PanelList[0].value);
            getBindCenter(dropDownState.PanelList[0].value);
        }
    }, [dropDownState?.PanelList?.length]);

    useEffect(() => {
        if (dropDownState?.CentreList?.length > 0) {
            setValues((preV) => ({
                ...preV,
                Centre: dropDownState.CentreList[0]
            }));

            getBindRoomType(dropDownState.CentreList[0].value);
        }
    }, [dropDownState?.CentreList?.length]);

    useEffect(() => {
        if (dropDownState?.ScheduleChargesList?.length > 0) {
            setValues((preV) => ({
                ...preV,
                PaymentMode: dropDownState.ScheduleChargesList[0]
            }));
        }
    }, [dropDownState?.ScheduleChargesList?.length]);


    console.log("dropDownState?.PanelList[0]", dropDownState?.PanelList[0])
    return (

        <div className="card">
            <Heading isBreadcrumb={false} title={"Rate List Report"} />
            <div className="row p-2">
                <ReactSelect
                    placeholderName={t("Patient Type")}
                    id={"PatientType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                    // dynamicOptions={dropDownState}
                    dynamicOptions={[
                        { label: "All", value: "All" },
                        { label: "OPD", value: "OPD" },
                        { label: "IPD", value: "IPD" },
                    ]}
                    name="PatientType"
                    handleChange={handleReactSelectChange}
                    value={values?.PatientType?.value}
                />
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Panel")}
                    id={"Panel"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                    dynamicOptions={dropDownState?.PanelList}
                    //  dynamicOptions={[{label:"All",value:"All"},...dropDownState?.PanelList]}
                    name="Panel"
                    handleChange={handleReactSelectChange}
                    value={values?.Panel?.value}
                />
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Centre")}
                    searchable="true"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    name="Centre"
                    id={"Centre"}
                    dynamicOptions={dropDownState?.CentreList}
                    value={values?.Centre?.value}
                    removeIsClearable={true}
                    handleChange={handleReactSelectChange}
                />
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Category")}
                    id={"Category"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                    // dynamicOptions={dropDownState?.PanelList}
                    dynamicOptions={[{ label: "All", value: "All" }, ...dropDownState?.BindCategroy]}
                    //  dynamicOptions={[{label:"All",value:"All"},...dropDownState?.PanelList]}
                    name="Category"
                    handleChange={handleReactSelectChange}
                    value={values.Category?.value}
                />
                {/* <ReactSelect
                    placeholderName={t("Category")}
                    id={"Category"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                    // dynamicOptions={dropDownState?.BindCategroy}
                    dynamicOptions={[{ label: "All", value: "All" }, ...dropDownState?.BindCategroy]}
                    name="Category"
                    handleChange={handleReactSelectChange}
                    value={values.Category?.value}
                /> */}
                <ReactSelect
                    requiredClassName="required-fields"
                    placeholderName={t("Schedule Charges")}
                    searchable="true"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    name="PaymentMode"
                    id={"PaymentMode"}
                    dynamicOptions={
                        dropDownState?.ScheduleChargesList
                    }
                    value={values?.PaymentMode?.value}
                    removeIsClearable={true}
                    handleChange={handleReactSelectChange}
                />

                {/* <ReportsMultiSelect
          name="centre"
          placeholderName={t("Centre")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={dropDownState?.CentreList}
          labelKey="CentreName"
          valueKey="CentreID"
          requiredClassName={true}
        /> */}
                <MultiSelectComp
                    placeholderName={t("Department")}
                    id="Department"
                    name="Department"
                    requiredClassName="required-fields"
                    value={values?.Department}
                    handleChange={handleMultiSelectChange}
                    dynamicOptions={dropDownState?.DepartmentList?.map((item) => ({
                        name: item?.label,
                        code: item?.value,
                    }))}
                    // dynamicOptions={GetDepartmentList?.map((item) => ({
                    //     name: item?.Name,
                    //     code: item?.ID,
                    // }))}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
                {
                    values?.PatientType?.value !== "OPD" &&

                    <MultiSelectComp
                        placeholderName={t("Room_Type")}
                        id="IPDCaseTypeID"
                        name="IPDCaseTypeID"
                        value={values?.IPDCaseTypeID}
                        handleChange={handleMultiSelectChange}
                        dynamicOptions={bodyData?.getRoomType?.map((item) => ({
                            name: item?.NAME,
                            code: item?.IPDCaseTypeID,
                        }))}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                }



                {/* <ReactSelect
                        placeholderName={t("Department")}
                        id={"Department"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        dynamicOptions={dropDownState?.Department}
                        name="Department"
                        handleChange={handleReactSelectChange}
                        value={values.Department}
                    /> */}


                <ReactSelect
                    placeholderName={t("Type")}
                    id={"Type"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                    dynamicOptions={[
                        { label: "Pdf", value: "1" },
                        { label: "Excel", value: "2" },

                    ]}

                    name="Type"
                    handleChange={handleReactSelectChange}
                    value={values.Type?.value}
                />
                <div className="col-sm-1">
                    <button className="btn btn-sm btn-success mx-1" onClick={HandleSearch}>Report</button>
                </div>
            </div>
        </div>

    );
};

export default RateList;
