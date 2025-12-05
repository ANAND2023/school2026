import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BillingAdmittedPatientWithoutDischarg, BillingBindReportOption, BillingReportsAdmitDischargeList, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
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

const AdmitDischargelist = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        ReportType: "",
        // listType: "1",
        // RoomType: [],
        // doctor: [],
        // Department: [],
        // Floor: [],
        Panel: [],
         Type:"1"

    };

    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
        Floor:[]
    })
    const [values, setValues] = useState({ ...initialValues });
    const handleReactSelectChange = (name, e) => {
        setValues((pre) => ({
            ...pre,
            [name]: e?.value
        }))
    };
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };

    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),
            //   getBindCenterAPI()
        ]);

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
    // const getFloorlList = async () => {
    //     try {
    //         const response = await BindFloor();
    //         if (response?.success) {
    //             setDropDownState((val) => ({
    //                 ...val,
    //                 Floor: handleReactSelectDropDownOptions(
    //                     response?.data,
    //                     "name",
    //                     "id"
    //                 ),
    //             }));
    //         }
    //         else {
    //             setDropDownState([])

    //         }
    //         return response;

    //     } catch (error) {
    //         console.log(error, "SomeThing Went Wrong");
    //     }
    // };
    useEffect(() => {
        getBindRoomType();
        BindReportOption()
        // BindDepartment()
        getPanelList()
        // getFloorlList()

    }, []);
    console.log("dropDownState", dropDownState)
 
    const SaveData = async () => {
      if(!values?.ReportType){
        notify("Please Select ReportType","warn")
        return
      }
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

           stringValue = values?.Department?.map(item => `'${item.code}'`).join(',');
        }
        else if (values?.ReportType === 5) {

           stringValue = values?.Floor?.map(item => `'${item.code}'`).join(',');
        }
        else if (values?.ReportType === 6 ) {
        // else if (values?.ReportType === 18) {

           stringValue = values?.Panel?.map(item => `'${item.code}'`).join(',');
        }

        
        const payload =
        {
            "reportType": Number(values?.ReportType),
            "itemIds": stringValue?stringValue:"",
            // "itemIds": "'1','233'",
            "fromdate": moment(values?.toDate).format("YYYY-MM-DD"),
            "toDate": moment(values.toDate).format("YYYY-MM-DD"),
            "type": Number(values?.Type)
        }

        const response = await BillingAdmittedPatientWithoutDischarg(payload);
        if (response.success) {
          if(values?.Type==2){
             exportToExcel(response?.data, "Excel");
          }
          else{
            RedirectURL(response?.data?.pdfUrl);
          }
        }
        else {
            notify(response.message, "error");
        }

    };
    console.log("values", values)

    return (
        <>
            <div className="card">
                <Heading isBreadcrumb={false} title={"Admit Panel Without Discharge"} />
                <div className="row p-2">
                        {/* <ReportDatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            id="fromDate"
                            name="fromDate"
                            lable={t("fromDate")}
                            values={values}
                            setValues={setValues}
                            max={values?.toDate}
                        /> */}

                    <ReportDatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        lable={t("As On Date")}
                        values={values}
                        setValues={setValues}
                        // max={new Date()}
                        // min={values?.fromDate}
                    />
                    {/* <ReactSelect
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
                    /> */}
                    <ReactSelect
                        placeholderName={t("Report Type")}
                        id={"ReportType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                        dynamicOptions={[
                            // { label: "All", value: "0" },
                            ...(dropDownState?.ReportOption || [])
                        ]}

                        name="ReportType"
                        handleChange={handleReactSelectChange}
                        value={values.ReportType}
                         requiredClassName={"required-fields"}
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
                                                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                            
                                                    dynamicOptions={[
                                                        { label: "Pdf", value: "1" },
                                                        { label: "Excel", value: "2" },
                            
                                                    ]}
                            
                                                    name="Type"
                                                    handleChange={handleReactSelectChange}
                                                    value={values.Type}
                                                />
                    <div className="col-sm-1">
                        <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Search</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdmitDischargelist;



// import React, { useEffect, useState } from "react";
// import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
// import Heading from "../../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
// import ReactSelect from "../../../../components/formComponent/ReactSelect";
// import { BillingAdmittedPatientWithoutDischarg, BillingBindReportOption, BillingReportsBindReportType, BindNABH, PrintNBHReport } from "../../../../networkServices/MRDApi";
// import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
// import moment from "moment/moment";
// import { redirect } from "react-router-dom";
// import { RedirectURL } from "../../../../networkServices/PDFURL";
// import AdmitDischargelist from "./AdmitDischargelist";
// import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";

// const AdmitPanelWithoutDischarge = ({reportTypeID}) => {
//   const [t] = useTranslation();
//   const initialValues = {
//     fromDate: new Date(),
//     toDate: new Date(),
//     ReportType:"",
//     ReportOption:[]
//   };

//     const [dropDownState, setDropDownState] = useState({
//             ReportOption: [],
//           });


// console.log("dropDownState",dropDownState)
//    const BindReportOption = async () => {

//            try {
//               //  const response = await BillingBindReportOption(1);
//                const response = await BillingBindReportOption(reportTypeID);
//                if (response?.success) {
//                    setDropDownState((val) => ({
//                        ...val,
//                        ReportOption: handleReactSelectDropDownOptions(
//                            response?.data,
//                            "TypeName",
//                            "TypeID"
//                        ),
//                    }));
   
//                }
//                else {
//                    setDropDownState([])
   
//                }
//            } catch (error) {
//                console.log(error, "SomeThing Went Wrong");
//            }
//        };

//        useEffect(()=>{
// BindReportOption()
//        },[])
//   const [values, setValues] = useState({ ...initialValues });
//   const handleReactSelectChange = (name, e) => {
//     const obj = { ...values };
//     obj[name] = e?.value;
//     setValues(obj);
//   };

//      const handleMultiSelectChange = (name, selectedOptions) => {
//         setValues({ ...values, [name]: selectedOptions });
//     };


//   const SaveData = async () => {

//     const payload =
    
    
//     {
//   "reportType": values.ReportType,
//   "itemIds": "'1','7'",
//   "fromdate":moment(values?.fromDate).format("DD-MMM-YYYY"),
//   "toDate": moment(values.toDate).format("DD-MMM-YYYY"),
//   "type": 0
// }

//      const response =  await BillingAdmittedPatientWithoutDischarg(payload);
//      if (response.success){
//      RedirectURL(response?.data?.pdfUrl);
//      }
//      else{
//       notify(response.message,"error");
//      }

//   };
  
//     return (
//     <>
//       <div className="card">
//         <Heading isBreadcrumb={false} title={"Admitted Panel Patient"} />
//         <div className="row p-2">
      
//           <ReportDatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             id="fromDate"
//             name="fromDate"
//             lable={t("fromDate")}
//             values={values}
//             setValues={setValues}
//             max={values?.fromDate}
//           />
//           <ReportDatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             id="toDate"
//             name="toDate"
//             lable={t("fromDate")}
//             values={values}
//             setValues={setValues}
//             max={values?.toDate}
//           />

//           {/* <ReportDatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//             id="toDate"
//             name="toDate"
//             lable={t("Date")}
//             values={values}
//             setValues={setValues}
//             max={new Date()}
//             min={values?.fromDate}
//           /> */}

//            <div className="col-xl-2 col-md-4 col-sm-4 col-12">


//                             <MultiSelectComp
//                                 placeholderName={t("ReportType")}
//                                 id={"ReportType"}
//                                 name="ReportType"
//                                 value={values?.ReportOption}
//                                 requiredClassName={"required-fields"}
//                                 handleChange={handleMultiSelectChange}
//                                 dynamicOptions={dropDownState?.ReportOption?.map((item) => ({
//                                     name: item?.label,
//                                     code: item?.value,
//                                 }))}
//                                 searchable={true}

//                             />
//                         </div>
//           {/* <ReactSelect
//             placeholderName={t("Report Type")}
//             id={"ReportType"}
//             searchable={true}
//             respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
           
//              dynamicOptions={dropDownState?.ReportOption}
//             name="ReportType"
//             handleChange={handleReactSelectChange}
//             value={values.ReportType}
//           /> */}
          
//           <div className="col-sm-1">
//             <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Search</button>
//           </div>
//         </div>
//       </div>
     
//     </>
//   );
// };

// export default AdmitPanelWithoutDischarge;
