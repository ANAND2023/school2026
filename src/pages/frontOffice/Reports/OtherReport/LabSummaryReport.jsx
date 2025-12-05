import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingBindReportOption, BillingLabSummaryReport, BillingReportsLabCollectionDetail, BillingSubCategoryDiscription, } from "../../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import moment from "moment/moment";

import { RedirectURL } from "../../../../networkServices/PDFURL";
import { ToolBindDepartment } from "../../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";

import { exportToExcel } from "../../../../utils/exportLibrary"; import { BindStoreGroup, BindStoreSubCategory } from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";

const LabSummaryReport = ({ reportTypeID = 1 }) => {
    const [t] = useTranslation();
    const localData = useLocalStorage("userData", "get");


    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ReportType: "D",

        Panel: [],
        subcategoryId: "",
        categoryId: "",
        Type: "1",


    };

    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
        bindcategory: [],
        SubGroup: [],
        SubCategoryDisc: [],
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

    const SubCategoryDiscription = async () => {
        const DeptLedgerNo = localData?.deptLedgerNo;
        // const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
        try {
            debugger;
            const response = await BillingSubCategoryDiscription();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    SubCategoryDisc: handleReactSelectDropDownOptions(
                        response?.data,
                        "name",
                        "categoryID"
                    ),
                }))
            }

        } catch (error) {
            console.error(error);
        }
    };
    const getBindCategory = async () => {
        const DeptLedgerNo = localData?.deptLedgerNo;
        // const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
        try {
            debugger;
            const response = await BindStoreGroup(DeptLedgerNo);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    bindcategory: handleReactSelectDropDownOptions(
                        response?.data,
                        "name",
                        "categoryID"
                    ),
                }))
            }

        } catch (error) {
            console.error(error);
        }
    };
    const getBindStoreSubCategory = async (CategoryID) => {
        
        // const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
        try {
            debugger;
            const response = await BindStoreSubCategory(CategoryID);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    SubGroup: handleReactSelectDropDownOptions(
                        response?.data,
                        "Name",
                        "SubCategoryID"
                    ),
                }))
            }
            else {
                setDropDownState((val) => ({
                    ...val,
                    SubGroup: []
                }))
            }

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        debugger
        if (values?.categoryId) {
            setValues((preV) => ({
                ...preV,
                subcategoryId: ""
            }))
            getBindStoreSubCategory(values?.categoryId);
        }
        console.log("values", values)
    }, [values.categoryId]);

    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };

    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),]);


        if (DoctorList?.success) {
            setDropDownState((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
        }
    }

    // useEffect(() => {
    //     bindDropdownData()
    //     getBindCategory()
    //     SubCategoryDiscription()
    // }, [])
    // const BindDepartment = async () => {                             ///////////////////BIND DEPARTMENT/////////
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
    // const BindReportOption = async () => {
    //     try {
    //         const response = await BillingBindReportOption(reportTypeID);
    //         if (response?.success) {
    //             setDropDownState((val) => ({
    //                 ...val,
    //                 ReportOption: handleReactSelectDropDownOptions(
    //                     response?.data,
    //                     "TypeName",
    //                     "TypeID"
    //                 ),
    //             }));

    //         }
    //         else {
    //             setDropDownState([])

    //         }
    //         //   return response;

    //     } catch (error) {
    //         console.log(error, "SomeThing Went Wrong");
    //     }
    // };

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

    useEffect(() => {
        // getBindRoomType();
        // BindReportOption()
        // BindDepartment()
        getPanelList()
        // getFloorlList()

    }, []);
    console.log("dropDownState", dropDownState)
    const SearchData = async () => {
       
       
        const panelDetails = values?.Panel?.map(item => `${item.code}`).join(',');
       
        const payload =
        {

            "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(values.toDate).format("YYYY-MM-DD"),
            "subCategoryID": String(values?.subcategoryId ?? ""),
            "panelId": (values?.Panel?.length === dropDownState?.PanelList?.length ? "" : panelDetails),  
            // "panelId":values?.Panel?.length===dropDownState?.PanelList?.length?"": panelDetails,
              "reportType": "S",
            // "reportType": String(values?.ReportType),
            "FileType": Number(values?.Type),


        }

            const response = await BillingLabSummaryReport(payload);
            if (response?.success) {
                if (values?.Type === "1") {
                    RedirectURL(response?.data?.pdfUrl);
                } else if (values?.Type === "0") {
                    // exportToExcel(response?.data);
                    exportToExcel(response?.data, `Lab Collection Summary ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);

                }

            } else {
                notify(response?.message, "error");
            }
       
    };
    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={false} title={"Lab Collection Summary "} />
                {/* <Heading isBreadcrumb={false} title={"Lab Collection Summary INVESTIGATIONS BUSINESS (SUMMARISED REPORT)"} /> */}
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

                    {
                        
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">


                            <MultiSelectComp
                                placeholderName={t("Panel")}
                                id={"Panel"}
                                name="Panel"
                                value={values?.Panel}
                                // requiredClassName={"required-fields"}
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
                        <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>Report</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LabSummaryReport;
