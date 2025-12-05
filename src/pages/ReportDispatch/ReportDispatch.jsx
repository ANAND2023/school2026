// import React, { useEffect, useState } from "react";
// import Heading from "../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import ReactSelect from "../../components/formComponent/ReactSelect";
// import moment from "moment";
// import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
// import DatePicker from "../../components/formComponent/DatePicker";
// import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
// import {
//   BindDepartmentResultEntryLab,
//   BindLabReport,
// } from "../../networkServices/resultEntry";
// import Tables from "../../components/UI/customTable";
// import Input from "../../components/formComponent/Input";
// import { BindDepartmentDispatch, DipatchBindDoctorDept, DispatchLabReports, DispatchResultEntryLab } from "../../networkServices/DispatchLab";
// import { FaGreaterThan } from "react-icons/fa";
// import { FaLessThan } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux"; 
// import { RedirectURL } from "../../networkServices/PDFURL";
// import { BindDepartmentLab } from "../../networkServices/departmentreceive";
// import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";

// function ReportDispatch() {
//   const [departmentData, setDepartmentData] = useState([]);
//   const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]); 
//   const [doctor,setDoctor] = useState([]);

//   const [page, setPage] = useState(1); 

//   const dispatch = useDispatch();

//   const { GetBindAllDoctorConfirmationData } = useSelector(
//     (state) => state.CommonSlice
//   );

//   const ip = localStorage.getItem("ip");
//   const pagination = (pageNumber) => {
//     if (
//       pageNumber >= 1 &&
//       pageNumber <= tbodyPatientDetail.length / 5 &&
//       pageNumber !== page
//     )
//       setPage(pageNumber);
//   };
//   let [t] = useTranslation();
//   const handleChange = (e) => {
//     setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
//   };

//   const { VITE_DATE_FORMAT } = import.meta.env;



//   const PatientTypeTest = [
//     { value: "0", label: "ALL" },
//     { value: "1", label: "OPD" },
//     { value: "2", label: "IPD" },
//   ];

//   const center = [
//     { value: "0", label: "All" },
//     { value: "1", label: "ELAB-PRO" },
//     { value: "2", label: "HOSPEDIA" },
//     { value: "3", label: "INNOPATH" },
//     { value: "3", label: "ITDOSE INFOSYSTEM PVT.LTD" },
//   ];

//   const [values, setValues] = useState({
//     BarcodeNo: "",
//     UHID: "",
//     department: { value: "0", label: "ALL" }, 
//     fromDate: moment(new Date()).toDate(),
//     toDate: moment(new Date()).toDate(),
//     PatientTypeTest: { value: "0", label: "ALL" },
//     center: { value: "0", label: "ALL" },
//     doctor: { value: "0", label: "ALL" },
//   });

//   const theadPatientDetail = [
//     { width: "5%", name: t("SNo") },
//     { width: "15%", name: t("Entry DateTime") },
//     { width: "15%", name: t("Barcode No") },
//     { width: "15%", name: t("UHID No") },
//     { width: "10%", name: t("Patient Name") },
//     { width: "15%", name: t("Age/Sex") },
//     { width: "15%", name: t("Booking Center") },
//     { width: "10%", name: t("Dispatch Mode") },
//     { width: "10%", name: t("Patient Type") },
//     { width: "10%", name: t("Doctor") },
//     { width: "10%", name: t("Department") },
//     { width: "10%", name: t("Investigation") },
//     { width: "10%", name: t(".") }, 
//     { width: "10%", name: t("Outsource") },
//   ]; 

//   // const handleChangeCheckbox = (e, index) => { 
//   //   const updatedData = [...tbodyPatientDetail];

//   //   updatedData.forEach((item, i) => {
//   //     item.isChecked = false;
//   //   });

//   //   updatedData[index].isChecked = e.target.checked;

//   //   setTbodyPatientDetail(updatedData);
//   // };

//   const handleChangeCheckbox = (e, index) => {
//     const updatedData = tbodyPatientDetail.map((item, i) =>
//       i === index ? { ...item, isChecked: e.target.checked } : item
//     );
//     setTbodyPatientDetail(updatedData);
//   };

//   const handleSelect = (name, value) => {
//     console.log(value)
//     if(name==="department"){
//       bindBindDoctorDept(value?.value)
//     }
//     setValues((val) => ({ ...val, [name]: value }));
//   };

//   const handleSearchSampleCollection = async () => {
//     console.log("ASdasd",values)
//     let payload = {
//       searchdata: [
//         values.BarcodeNo,
//         values.UHID,
//         values?.department?.value?.toString() ?? "0",
//         moment(values?.fromDate).format("DD-MMM-YYYY"),
//         moment(values?.toDate).format("DD-MMM-YYYY"),
//         values.PatientTypeTest.value,
//         values.center.value,
//         values.doctor.value, 
//         "pli.BarcodeNo",
//         "",
//       ],
//       pageNo: "0",
//       pageSize: "300",
//     };


//     try {
//       const apiResp = await DispatchResultEntryLab(payload);
//       if (apiResp.success) {
//         let data = apiResp?.data?.map((val) => {
//           return val;
//         });
//         setTbodyPatientDetail(data); 
//       } else {
//         notify("No records found", "error");
//         setTbodyPatientDetail([]); 
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//       setTbodyPatientDetail([]); 
//     }
//   };

//   const fetchDepartmentData = async () => {
//     try {
//       const response = await BindDepartmentLab();
//       if (response.success) {
//         console.log("the department data is in", response);
//         setDepartmentData(response.data);
//       } else {
//         console.error(
//           "API returned success as false or invalid response:",
//           response
//         );
//         setDepartmentData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setDepartmentData([]);
//     }
//   };


//       const bindBindDoctorDept = async (value) => { 

//         try {
//           const apiResp = await GetBindDoctorDept(value==="0"?"All":value);
//           if (apiResp.success) { 
//             setDoctor(apiResp.data)
//           } else {
//             notify("Some error occurred", "error");
//           }
//         } catch (error) { 
//           notify("An error occurred while fetching data", "error");
//         }
//       };

//       // BindInvestigationLab


//   const handlePrevious = () => {
//     if (page > 1) {
//       const newPage = page - 1;
//       setPage(newPage);
//       pagination(newPage);
//     }
//   };

//   const handleNext = () => {
//     if (page < totalPages) {
//       const newPage = page + 1;
//       setPage(newPage);
//       pagination(newPage);
//     }
//   };

//   const handlePageClick = (pageNum) => {
//     setPage(pageNum);
//     pagination(pageNum);
//   };
//   const totalPages = Math.ceil(tbodyPatientDetail.length / 100);






//   const handleDispatch = async (buttonStatus) => { 
//     const checkdata = tbodyPatientDetail.filter((item) => item.isChecked); 
//     const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
//     if (!anyChecked) {
//       notify(
//         "Please Select Test ",
//         "error"
//       );
//       return;
//     }  
//      // Prepare RecPayload as a single object
//      let RecPayload = {


//       testID: checkdata.map((item) => String(item.Test_ID)).join(","),
//       isOnlinePrint: "",
//       isConversion: "",
//       isNabl:"",
//       orderBy:"",
//       labType: checkdata.map((item) => String(item.reporttype)).join(","),
//       ipAddress: ip,
//       isPrev: buttonStatus,
//     }; 
//     tbodyPatientDetail?.forEach((val) => {
//       if (val?.isChecked) {
//         RecPayload.testID = val?.Test_ID;
//       }
//     });

//     try {
//       const apiResp = await BindLabReport(RecPayload);
//       if (apiResp?.success === false) {
//         notify("No records found", "error");
//       } else {
//         console.log("The PDF URL link is", apiResp?.pdfUrl);
//         RedirectURL(apiResp?.data?.value?.pdfUrl);
//         handleSearchSampleCollection();
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//     }
//   };

//   // DispatchLabReports




//   const handleDispatchReport = async () => {
//     // Check if any items are selected
//     const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
//     const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);

//     if (!anyChecked) {
//       notify("Please Select Test", "error");
//       return;
//     }

//     // Prepare RecPayload as a single object
//     const RecPayload = {
//       testID: checkdata.map((item) => String(item.Test_ID)).join(","),  
//       ledgerNo: checkdata.map((item) => String(item.LedgerTransactionNo)).join(","),  
//       isEmail: "0",
//       isSms: "0",
//     };

//     try {
//       const apiResp = await DispatchLabReports(RecPayload);
//       if (apiResp?.success === false) {
//         notify("No records found", "error");
//       } else {
//         console.log("The API response is", apiResp); 
//         let RecPayload = {
//           testID: checkdata.map((item) => String(item.Test_ID)).join(","),
//           isOnlinePrint: "1",
//           isConversion: "",
//           isNabl: "0",
//           orderBy: "",
//           labType: "1",
//           ipAddress: ip,
//           isPrev: true,
//         };


//         try {
//           const apiResp = await BindLabReport(RecPayload);
//           if (apiResp?.success === false) {
//             notify("No records found", "error");
//           } else {
//             console.log("The PDF URL link is", apiResp?.pdfUrl);
//             RedirectURL(apiResp?.data?.value?.pdfUrl);
//             handleSearchSampleCollection();
//           }
//         } catch (error) {
//           notify("An error occurred while fetching data", "error");
//         }
//         handleSearchSampleCollection();
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//     }
//   };



//   useEffect(() => {
//     fetchDepartmentData();  
//     bindBindDoctorDept(values.department.value);
//   }, []);

//   return (
//     <>
//       <div className="m-2 spatient_registration_card card">
//         <Heading
//           title={t("heading")}
//           isBreadcrumb={true}
//         />
//         <div>
//           <div className="row  row-cols-md-2 row-cols-1 p-2">
//             <Input
//               type="text"
//               className="form-control"
//               id="BarcodeNo"
//               placeholder=" "
//               name="BarcodeNo"
//               value={values?.BarcodeNo || ""}
//               onChange={handleChange}
//               lable={t("BarcodeNo")}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             />

//             <Input
//               type="text"
//               placeholder=""
//               className="form-control"
//               id="UHID"
//               name="UHID"
//               value={values?.UHID || ""}
//               onChange={handleChange}
//               lable={t("UHID")}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             />

//             <ReactSelect
//               placeholderName={t("Department")}
//               id={"department"}
//               searchable={true}
//               removeIsClearable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={[
//                 { value: "0", label: "ALL" },
//                 ...handleReactSelectDropDownOptions(
//                   departmentData,
//                   "Name",
//                   "ObservationType_ID"
//                 ),
//               ]}
//               handleChange={handleSelect}
//               value={`${values?.department?.value}`}
//               name={"department"}
//             />


//             <DatePicker
//               className="custom-calendar"
//               id="fromDate"
//               name="fromDate"
//               lable={t("FromDate")}
//               value={values?.fromDate || new Date()}
//               handleChange={handleChange}
//               placeholder={VITE_DATE_FORMAT}
//               respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
//             />

//             <DatePicker
//               className="custom-calendar"
//               id="toDate"
//               name="toDate"
//               value={values?.toDate || new Date()}
//               handleChange={handleChange}
//               lable={t("ToDate")}
//               placeholder={VITE_DATE_FORMAT}
//               respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
//             />

//             <ReactSelect
//               placeholderName={t("Test")}
//               id={"PatientTypeTest"}
//               searchable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={PatientTypeTest}
//               handleChange={handleSelect}
//               value={`${values?.PatientTypeTest?.value}`}
//               name={"PatientTypeTest"}
//             />

//             <ReactSelect
//               placeholderName={t("Center")}
//               id={"center"}
//               searchable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={center}
//               handleChange={handleSelect}
//               value={`${values?.center?.value}`}
//               name={"center"}
//             />
//             <ReactSelect
//               placeholderName={t("Doctor")}
//               id={"doctor"}
//               searchable={true}
//               removeIsClearable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={[
//                 { value: "0", label: "ALL" },
//                 ...handleReactSelectDropDownOptions(
//                   doctor,
//                   "Name",
//                   "DoctorID"
//                 ),
//               ]}
//               handleChange={handleSelect}
//               value={`${values?.doctor?.value}`}
//               name={"doctor"}
//             />

//             <div className="">
//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleSearchSampleCollection}
//               >
//                 {t("Search")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={()=>handleDispatch(true)}

//               >
//                 {t("Preview")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={()=>handleDispatch(false)}
//               >
//                 {t("Print")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleDispatchReport}
//               >
//                 {t("Dispatch")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleDispatch}
//               >
//                 {t("Print Outsource Report")}
//               </button>
//             </div>
//           </div>
//           {/* Color Coding Section */}

//           <Heading
//             title=""
//             isBreadcrumb={false}
//             secondTitle={
//               <>
//                 <ColorCodingSearch label={t("New")} color="#CC99FF" />

//                 <ColorCodingSearch
//                   label={t("SampleCollected")}
//                   color="#FFE4C4"
//                 />

//                 <ColorCodingSearch
//                   label={t("SampleRejected")}
//                   color="#FF0000"
//                 />
//                 <ColorCodingSearch
//                   label={t("DepartmentRecieved")}
//                   color="#FFFFFF"
//                 />
//                 <ColorCodingSearch label={t("Tested")} color="#FFC0CB" />
//                 <ColorCodingSearch label={t("Approved")} color="#90EE90" />
//                 <ColorCodingSearch label={t("Printed")} color="#00FFFF" />
//                 <ColorCodingSearch label={t("Disptached")} color="#44A3AA" />
//                 <ColorCodingSearch label={t("Abnormal")} color="#993300" />
//                 <ColorCodingSearch label={t("Critical")} color="#99A300" />
//               </>
//             }
//           />
//         </div>

//         <div className="card table-responsive">
//           <Tables
//             thead={theadPatientDetail}
//             tbody={tbodyPatientDetail
//               .slice(page * 100 - 100, page * 100)
//               .map((val, index) => ({
//                 sno: (page - 1) * 100 + index + 1,
//                 EntryDateTime: val.EntryDate,
//                 BarcodeNo: val.BarcodeNo,
//                 UHIDNo: val.PatientID,
//                 PatientName: val.PName,
//                 AgeSex: val.pinfo,
//                 BookingCenter: val.centre,
//                 DispatchMode: val.DispatchMode || null,
//                 PatientType: val.PatientType,
//                 DoctorName: val.DoctorName,
//                 department: val.Dept,
//                 ItemName: val.ItemName, 
//                 colorcode: val.rowColor,
//                 approved:
//                   val.Approved ? (
//                     <input
//                       type="checkbox"
//                       checked={val.isChecked}
//                       onChange={(e) => handleChangeCheckbox(e, index)}
//                     />
//                   ) : (
//                     ""
//                   ),
//                   Outsource:
//                   val.isoutsource=="1" ? (
//                     <input
//                       type="checkbox"
//                       checked={val.isChecked}
//                       onChange={(e) => handleChangeCheckbox(e, index)}
//                     />
//                   ) : (
//                     ""
//                   ),
//                 // colorcode: getRowClass(val),
//               }))}
//             style={{ height: "55vh", padding: "2px" }}
//             tableHeight={"scrollView"}
//           />
//         </div>

//         <div className="pagination">
//           {page > 1 && (
//             <button className="paginationBtn" onClick={handlePrevious}>
//               <FaLessThan />
//             </button>
//           )}
//           {Array.from({ length: totalPages }).map((_, i) => {
//             const pageNum = i + 1;
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => handlePageClick(pageNum)}
//                 className={`paginationBtn ${page === pageNum ? "selected_page" : ""}`}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
//           {page < totalPages && (
//             <button className="paginationBtn" onClick={handleNext}>
//               <FaGreaterThan />
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default ReportDispatch;


import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import {
  BindAttachment,
  BindAttachmentPdf,

  BindLabReport,
  BindPatientDetails,
  BindPatientDetailsImage,
  MachineResultEntryGetIsLab,
} from "../../networkServices/resultEntry";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import {
  BindDepartmentDispatch,
  DipatchBindDoctorDept,
  DispatchLabReports,
  DispatchResultEntryLab,
} from "../../networkServices/DispatchLab";
import { FaGreaterThan, FaPaperclip } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RedirectURL } from "../../networkServices/PDFURL";
import { BindDepartmentLab } from "../../networkServices/departmentreceive";
import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";
import { reach } from "yup";
import { Checkbox } from "primereact/checkbox";
import { Panel } from "rc-easyui";
import PrintShrinkModal from "../ResultEntry/PrintShrinkModal";
import Modal from "../../components/modalComponent/Modal";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import SampleCollection from "../SampleCollectionManagement/SampleCollection";
import DepartmentReceive from "../DepartmentReceive/DepartmentReceive";

function ReportDispatch() {
  const [departmentData, setDepartmentData] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [selectedChecked, setSelectedChecked] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null)
  const [testlistAllData, setTestlistAllData] = useState([]);
  const dispatch = useDispatch();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [isLab, setIsLab] = useState("1");
  const [searchFilter, setSearchFilter] = useState("");
  const [bckupTbodyPatientDetail, setBckupTbodyPatientDetail] = useState([]);

   const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const userData = useLocalStorage("userData", "get");

  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  const ip = localStorage.getItem("ip");
  const pagination = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= tbodyPatientDetail.length / 5 &&
      pageNumber !== page
    )
      setPage(pageNumber);
  };
  let [t] = useTranslation();
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  const isMobile = window.innerWidth <= 800;

  const { VITE_DATE_FORMAT } = import.meta.env;
  // const selectInput = [
  //   { value: "0", label: "Barcode No" },
  //   { value: "1", label: "UHID NO" },
  //   { value: "2", label: "Patient Name" },
  //   { value: "3", label: "IPD NO" },
  // ];
  const PatientTypeTest = [
    { value: "0", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
  ];

  const center = [
    { value: "0", label: "All" },
    { value: "1", label: "ELAB-PRO" },
    { value: "2", label: "HOSPEDIA" },
    { value: "3", label: "INNOPATH" },
    { value: "3", label: "ITDOSE INFOSYSTEM PVT.LTD" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    // selectInput: { value: "0", label: "Barcode No." },
    UHID: "",
    department: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    PatientTypeTest: { value: "0", label: "ALL" },
    center: { value: "1", label: "MOHANDAI OSWAL HOSPITAL" },
    doctor: { value: "0", label: "ALL" },
    pName: "",
    Shrink: { label: "100%", value: "100" },
    PrintLabHeader: { label: "Yes", value: "1" },
  });

  console.log(values, "valuesvalues")
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
    handleSearchSampleCollection();
    setSelectedChecked([]);
  };

  useEffect(() => {
    // Trigger search when patient type changes
    handleSearchSampleCollection();
  }, [values?.PatientTypeTest?.value, values?.center?.value]);

  const handleChangeCheckboxHeader = () => {
    if (isHeaderChecked) {

      setSelectedChecked([]);
      setIsHeaderChecked(false);
    } else {

      const allIds = tbodyPatientDetail.filter(item => item.Approved == 1).map((item) => item.Test_ID);
      setSelectedChecked(allIds);
      setIsHeaderChecked(true);
    }
  };
  console.log(selectedChecked, tbodyPatientDetail)

  const theadPatientDetail = [
    { width: "1%", name: t("S.No") },
    {
      width: "5%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          checked={isHeaderChecked}
          onChange={handleChangeCheckboxHeader}
        />
      ),
    },
    { width: "5%", name: t("Sam. Coll.") },
    { width: "5%", name: t("Sam. Rec.") },
    { width: "10%", name: t("Patient Name") },
    { width: "15%", name: t("UHID No") },
    { width: "15%", name: t("Barcode No") },
    { width: "15%", name: t("Entry DateTime") },
    { width: "15%", name: t("ward") },
    { width: "10%", name: t("Investigation") },
    { width: "15%", name: t('Panel Name') },
    { width: "10%", name: t("IPD NO") },
    { width: "15%", name: t("Age/Sex") },

    { width: "10%", name: t("Patient Type") },
    { width: "10%", name: t("Doctor") },
    { width: "10%", name: t("Department") },
    { width: "10%", name: t("FTR") },
    { width: "10%", name: t("CTB No") },
    { width: "10%", name: t("Approved") },
    { width: "10%", name: t("Mark Status Reason") },

    { width: "10%", name: t("Outsource") },
    { width: "10%", name: t("View Reports") },
    { width: "10%", name: t("View Document") },
    
  ];
  const { GetEmployeeWiseCenter } = useSelector((state) => state?.CommonSlice);
  const handleChangeCheckbox = (item) => {
    setSelectedChecked((prev) => {
      if (prev.includes(item.Test_ID)) {
        return prev.filter((id) => id !== item.Test_ID);
      } else {
        return [...prev, item.Test_ID];
      }
    });
  };
  // const handleChangeCheckbox = (e, index) => {
  //   const updatedData = tbodyPatientDetail.map((item, i) =>
  //     i === index ? { ...item, isChecked:e.target.checked } : item
  //   );

  //   setTbodyPatientDetail(updatedData);
  // };

  const handleSelect = (name, value) => {
    if (name === "department") {
      bindBindDoctorDept(value?.value);
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  //  const getSearchType = () => {
  //   switch (values.selectInput.value) {
  //     case "0":
  //       return "pli.BarcodeNo";
  //     case "1":
  //       return "lt.PatientID";
  //     case "2":
  //       return "pm.PName";
  //     default:
  //       return "";
  //   }
  // };

  const handleSearchSampleCollection = async () => {
    let payload = {
      searchdata: [
        values.BarcodeNo,
        values.UHID,
        values?.department?.value?.toString() ?? "0",
        moment(values?.fromDate).format("DD-MMM-YYYY"),
        moment(values?.toDate).format("DD-MMM-YYYY"),
        values.PatientTypeTest.value,
        values.center.value,
        values.doctor.value,
        "pli.BarcodeNo",
        "",
        values?.IPDNO,
        values?.pName,
      ],
      pageNo: "0",
      pageSize: "3000",
    };

    try {
      const apiResp = await DispatchResultEntryLab(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return val;
        });

        setTbodyPatientDetail(data);
        setTestlistAllData(data);
        setBckupTbodyPatientDetail(data);
        setSelectedChecked([]);

      } else {
        notify("No records found", "error");
        setTbodyPatientDetail([]);
        setBckupTbodyPatientDetail([]);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await BindDepartmentLab();
      if (response.success) {
        console.log("the department data is in", response);
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

  const bindBindDoctorDept = async (value) => {
    try {
      const apiResp = await GetBindDoctorDept(value === "0" ? "All" : value);
      if (apiResp.success) {
        setDoctor(apiResp.data);
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  // BindInvestigationLab

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      pagination(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      pagination(newPage);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    pagination(pageNum);
  };
  const totalPages = Math.ceil(tbodyPatientDetail.length / 100);

  // const handleDispatch = async (buttonStatus) => {
  //   const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);
  //   if (!selectedChecked?.length > 0) {
  //     notify("Please Select Test", "error");
  //     return;
  //   }

  //   const selectedTestId = selectedChecked
  //     .map((item) => String(item))
  //     .join(",");
  //   let RecPayload = {
  //     testID: selectedTestId,
  //     isOnlinePrint: "",
  //     isConversion: "",
  //     isNabl: "",
  //     orderBy: "",
  //     labType: checkdata.map((item) => String(item.reporttype)).join(","),
  //     ipAddress: ip,
  //     isPrev: buttonStatus,
  //     ShrinkPercentage: Number(values?.Shrink?.value),
  //     PrintLabHeader:Number(values?.PrintLabHeader?.value)
  //   };

  //   try {
  //     const apiResp = await BindLabReport(RecPayload);
  //     if (apiResp?.success === false) {
  //       notify("No records found", "error");
  //     } else {
  //       console.log("The PDF URL link is", apiResp?.data);
  //       RedirectURL(apiResp?.data);
  //       handleSearchSampleCollection();
  //       setSelectedChecked([]);
  //     }
  //   } catch (error) {
  //     notify("An error occurred while fetching data", "error");
  //   }
  // };

  const handleDispatch = async (buttonStatus) => {
    const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);
    if (!selectedChecked?.length > 0) {
      notify("Please Select Test", "error");
      return;
    }

    const selectedTestId = selectedChecked
      .map((item) => String(item))
      .join(",");
    let RecPayload = {
      testID: selectedTestId,
      isOnlinePrint: "",
      isConversion: "",
      isNabl: "",
      orderBy: "",
      labType: checkdata.map((item) => String(item.reporttype)).join(","),
      ipAddress: ip,
      isPrev: buttonStatus,
      ShrinkPercentage: values?.Shrink,
      PrintLabHeader: Number(values?.PrintLabHeader?.value)
    };
    setHandleModelData({
      label: t("Preview"),
      buttonName: t("NursingWard.SampleCollection.upload"),
      width: "95vw",
      height: "95vh",
      isOpen: true,
      Component: (
        <PrintShrinkModal prevPayload={RecPayload} apiCall={BindLabReport} />
      ),
      extrabutton: <></>,
      footer: <></>,
    });

  };


  useEffect(() => {
    const notApproved = tbodyPatientDetail.filter(item => item.Approved == 1);

    if (selectedChecked.length === notApproved.length && notApproved.length > 0) {
      setIsHeaderChecked(true);
    } else {
      setIsHeaderChecked(false);
    }
  }, [selectedChecked, tbodyPatientDetail]);

  // DispatchLabReports

  const handleDispatchReport = async () => {
    // Check if any items are selected
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);

    if (!anyChecked) {
      notify("Please Select Test", "error");
      return;
    }

    // Prepare RecPayload as a single object
    const RecPayload = {
      testID: checkdata.map((item) => String(item.Test_ID)).join(","),
      ledgerNo: checkdata
        .map((item) => String(item.LedgerTransactionNo))
        .join(","),
      isEmail: "0",
      isSms: "0",
    };

    try {
      const apiResp = await DispatchLabReports(RecPayload);
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        console.log("The API response is", apiResp);
        let RecPayload = {
          testID: checkdata.map((item) => String(item.Test_ID)).join(","),
          isOnlinePrint: "1",
          isConversion: "",
          isNabl: "0",
          orderBy: "",
          labType: "1",
          ipAddress: ip,
          isPrev: true,
        };

        try {
          const apiResp = await BindLabReport(RecPayload);
          if (apiResp?.success === false) {
            notify("No records found", "error");
          } else {
            console.log("The PDF URL link is", apiResp?.pdfUrl);
            RedirectURL(apiResp?.data?.value?.pdfUrl);
            handleSearchSampleCollection();
          }
        } catch (error) {
          notify("An error occurred while fetching data", "error");
        }
        handleSearchSampleCollection();
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
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
    ResultEntryGetIsLab()
    fetchDepartmentData();
    bindBindDoctorDept(values.department.value);
  }, []);

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      PrintLabHeader: isLab === "1"
        ? { label: "Yes", value: "1" }
        : { label: "No", value: "0" },
    }));
  }, [isLab]);



  const handleOpenReport = async (val) => {
    try {
      const params = {
        TestID: String(val?.Test_ID),
      };
      const response = await BindAttachment(params);
      if (response.success) {
        const payload = {
          testID: response?.data[0]?.Test_ID,
          FileUrl: response?.data[0]?.FileUrl,
          id: response?.data[0]?.id
        }
        const resp = await BindAttachmentPdf(payload)

        if (resp.success && resp.data) {
          const base64Data = resp.data;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const pdfURL = URL.createObjectURL(blob);
          window.open(pdfURL, "_blank");
          notify("success", "PDF opened successfully");

        } else {
          notify(response?.message || "Failed to load PDF", "error");
        }
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {

    }

  };

  const handleDocumentView = async (val, index) => {
    try {
      const params = val?.LedgerTransactionNo ? `LedgerTransactionNo=${val?.LedgerTransactionNo}` : ``
      const response = await BindPatientDetails(params)
      if (response?.success) {
        const payload = {
          id: response?.data?.grvAttachment[0]?.Id ?? '',
          FileName: response?.data?.grvAttachment[0]?.FileName ?? '',
          LedgerTransactionNo: val?.LedgerTransactionNo ?? '',
        }
        const resp = await BindPatientDetailsImage(payload)
        if (resp.success && resp.data) {
          const base64Data = resp.data?.url;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const pdfURL = URL.createObjectURL(blob);
          window.open(pdfURL, "_blank");
          notify("success", "PDF opened successfully");

        } else {
          notify(response?.message || "Failed to load PDF", "error");
        }
      } else {
        notify("Record Not Found", "error")
      }
    } catch (error) {

    }
  }

  const handleStatusChange = (rowColor) => {
    setSelectedColor(rowColor);
    if (rowColor) {
      const filtered = testlistAllData.filter((item) => item.rowColor === rowColor);
      if (filtered.length === 0) {
        notify("No Data Found", "warn");
      }
      setTbodyPatientDetail(filtered);
    } else {
      setTbodyPatientDetail(testlistAllData);
    }
  };

  //filter patient

  const findCurrentDepartment = () => {
    debugger
    console.log(departmentData, userData, "daaaaa")
    const data = departmentData?.find(
      (item) => item?.Name?.toUpperCase() === userData?.roleName?.toUpperCase()
    );
    return data
  };

  useEffect(() => {
    debugger
    const currentDepartment = findCurrentDepartment();
    if (currentDepartment) {
      setValues((prev) => ({
        ...prev,
        department: {
          value: currentDepartment?.ObservationType_ID || "",
          label: currentDepartment?.Name || ""
        }
      }));
    }
  }, [departmentData]);
  const handleItemSearch = (e) => {
    setSearchFilter(e?.target?.value);
    if (e?.target?.value === "") {
      setTbodyPatientDetail(bckupTbodyPatientDetail);
      return;
    }
    const results = bckupTbodyPatientDetail?.filter((obj) =>
      Object.values(obj)?.some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(e?.target?.value.toLowerCase())
      )
    );
    setTbodyPatientDetail(results);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSampleCollection();
    }
  };

   const openModal = (type,pid,date) => {
    debugger
    if(type==="sampleCollection"){


    setModalHandlerState(
      {
        header: t("Sample Collection"),
        show: true,
        size: "95vw",
        component: <SampleCollection
         UHIDipd={pid}
          pDate={date}
          renderSlideScreenInPlace={true}
        />,
        footer: <></>,
      }
    )
    }
    else{
      setModalHandlerState(
      {
        header: t("Sample Receiving"),
        show: true,
        size: "95vw",
        component: <DepartmentReceive
          UHIDipd={pid}
          pDate={date}
        />,
        footer: <></>,
      }
    )
    }

  }

  const handleCallOldReport = () => {
    window.open(`http://192.168.0.249/Oswal/Design/FrontOffice/PatientLabSearch.aspx?PatientId=${'111'}`);
  }
  return (
    <>
    {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
      <div className=" spatient_registration_card card">
        <Heading title={t("heading")} isBreadcrumb={true} />
        <div>
          <div className="row  row-cols-md-2 row-cols-1 p-2">
            {/* <ReactSelect
              placeholderName={t("Select Search Type")}
              id="selectInput"
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={selectInput}
              handleChange={handleSelect}
              value={`${values?.selectInput?.value}`}
              name="selectInput"
            />
            <Input
              type="text"
              id="selectedInput"
              className="form-control"
              placeholder=" "
              value={values?.selectedInput}
              lable={t(values?.selectInput?.label)}
              onChange={handleChange}
              name="selectedInput"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            /> */}

            <Input
              type="text"
              className="form-control"
              id="BarcodeNo"
              placeholder=" "
              name="BarcodeNo"
              value={values?.BarcodeNo || ""}
              onChange={handleChange}
              lable={t("BarcodeNo")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={handleKeyDown}
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="UHID"
              name="UHID"
              value={values?.UHID || ""}
              onChange={handleChange}
              lable={t("UHID")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={handleKeyDown}
            />
            <Input
              type="text"
              className="form-control"
              id="pName"
              name="pName"
              onChange={handleChange}
              value={values?.pName}
              lable={t("PatientName")}
              placeholder=" "
              // required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={handleKeyDown}
            />
            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="IPDNO"
              name="IPDNO"
              value={values?.IPDNO || ""}
              onChange={handleChange}
              lable={t("IPDNO")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={handleKeyDown}
            />

            <ReactSelect
              placeholderName={t("Department")}
              id={"department"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { value: "0", label: "ALL" },
                ...handleReactSelectDropDownOptions(
                  departmentData,
                  "Name",
                  "ObservationType_ID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.department?.value}`}
              name={"department"}
            />

            <DatePicker
              className="custom-calendar"
              id="fromDate"
              name="fromDate"
              lable={t("FromDate")}
              value={values?.fromDate || new Date()}
              handleChange={handleChange}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            />

            <DatePicker
              className="custom-calendar"
              id="toDate"
              name="toDate"
              value={values?.toDate || new Date()}
              handleChange={handleChange}
              lable={t("ToDate")}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            />

            <ReactSelect
              placeholderName={t("Test")}
              id={"PatientTypeTest"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={PatientTypeTest}
              handleChange={handleSelect}
              value={`${values?.PatientTypeTest?.value}`}
              name={"PatientTypeTest"}
            />

            {/* <ReportsMultiSelect
              name="centre"
              placeholderName={t("Centre")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={GetEmployeeWiseCenter}
              labelKey="CentreName"
              valueKey="CentreID"
              requiredClassName={true}
            /> */}
            <ReactSelect
              placeholderName={t("Center")}
              id={"center"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              // dynamicOptions={GetEmployeeWiseCenter}
              dynamicOptions={[
                ...handleReactSelectDropDownOptions(
                  GetEmployeeWiseCenter,
                  "CentreName",
                  "CentreID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.center?.value}`}
              name={"center"}
            />
            <ReactSelect
              placeholderName={t("Doctor")}
              id={"doctor"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { value: "0", label: "ALL" },
                ...handleReactSelectDropDownOptions(doctor, "Name", "DoctorID"),
              ]}
              handleChange={handleSelect}
              value={`${values?.doctor?.value}`}
              name={"doctor"}
            />
            <ReactSelect
              placeholderName={t("Shrink Percentage")}
              id={"Shrink"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { label: "60%", value: "60" },
                { label: "65%", value: "65" },
                { label: "70%", value: "70" },
                { label: "75%", value: "75" },
                { label: "80%", value: "80" },
                { label: "81%", value: "81" },
                { label: "82%", value: "82" },
                { label: "83%", value: "83" },
                { label: "84%", value: "84" },
                { label: "85%", value: "85" },
                { label: "86%", value: "86" },
                { label: "87%", value: "87" },
                { label: "88%", value: "88" },
                { label: "89%", value: "89" },
                { label: "90%", value: "90" },
                { label: "91%", value: "91" },
                { label: "92%", value: "92" },
                { label: "93%", value: "93" },
                { label: "94%", value: "94" },
                { label: "95%", value: "95" },
                { label: "96%", value: "96" },
                { label: "97%", value: "97" },
                { label: "98%", value: "98" },
                { label: "99%", value: "99" },
                { label: "100%", value: "100" },
                { label: "101%", value: "101" },
                { label: "102%", value: "102" },
                { label: "103%", value: "103" },
                { label: "104%", value: "104" },
                { label: "105%", value: "105" },
                { label: "106%", value: "106" },
                { label: "107%", value: "107" },
                { label: "108%", value: "108" },
                { label: "109%", value: "109" },
                { label: "110%", value: "110" },
                { label: "111%", value: "111" },
                { label: "112%", value: "112" },
                { label: "113%", value: "113" },
                { label: "114%", value: "114" },
                { label: "115%", value: "115" },
                { label: "116%", value: "116" },
                { label: "117%", value: "117" },
                { label: "118%", value: "118" },
                { label: "119%", value: "119" },
                { label: "120%", value: "120" }

              ]}
              // handleChange={handleSelectDoctor}
              handleChange={handleSelect}
              // value={`${testList[0]?.MachineID}`}
              name={"Shrink"}
              value={values?.Shrink?.value}
            />
            <ReactSelect
              placeholderName={t("Print Lab Header")}
              id={"PrintLabHeader"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
              // handleChange={handleSelectDoctor}
              handleChange={handleSelect}
              // value={`${testList[0]?.MachineID}`}
              name={"PrintLabHeader"}
              value={values?.PrintLabHeader?.value}
            />
            <div className="">
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleSearchSampleCollection}
              >
                {t("Search")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={() => handleDispatch(true)}
              >
                {t("Preview")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={() => handleDispatch(false)}
              >
                {t("Print")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleDispatchReport}
              >
                {t("Dispatch")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleDispatch}
              >
                {t("Print Outsource Report")}
              </button>
              <button className="btn btn-sm btn-success m-2" onClick={handleCallOldReport}>View Lab Old Report</button>
            </div>
          </div>
          {/* Color Coding Section */}

          <Heading
            title=""
            isBreadcrumb={false}
            secondTitle={
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",

                  }}
                  className=""
                >
                  <Input
                    type="text"
                    className="table-input my-1"
                    respclass={"width-150 "}
                    removeFormGroupClass={true}
                    placeholder={t("Search")}
                    onChange={handleItemSearch}
                  // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
                  />
                  <div className="mb-0 px-1">
                    <p className="text-bold mb-0">Total Count : {tbodyPatientDetail?.length ? tbodyPatientDetail?.length : 0}</p>
                  </div>
                </div>
                <ColorCodingSearch label={t("New")} color="#CC99FF"
                  onClick={() => handleStatusChange("#CC99FF")}
                />
                <ColorCodingSearch
                  label={t("Red Blink Is MLC")}
                  color="#c61b1bff"
                />
                <ColorCodingSearch
                  label={t("SampleCollected")}
                  color="#d2791b"
                  onClick={() => handleStatusChange("#d2791b")}
                />

                <ColorCodingSearch
                  label={t("SampleRejected")}
                  color="#FF0000"
                  onClick={() => handleStatusChange("#FF0000")}
                />
                <ColorCodingSearch
                  label={t("DepartmentRecieved")}
                  color="bisque"
                  onClick={() => handleStatusChange("bisque")}
                />
                <ColorCodingSearch label={t("Tested")} color="#FFC0CB"
                  onClick={() => handleStatusChange("#FFC0CB")}
                />
                <ColorCodingSearch label={t("Approved")} color="#90EE90" onClick={() => handleStatusChange("#90EE90")} />
                <ColorCodingSearch label={t("Printed")} color="#00FFFF" onClick={() => handleStatusChange("#00FFFF")} />
                <ColorCodingSearch label={t("Disptached")} color="#44A3AA" onClick={() => handleStatusChange("#44A3AA")} />
                {/* <ColorCodingSearch label={t("Abnormal")} color="#993300" onClick={() => handleStatusChange("#993300")} /> */}
                <ColorCodingSearch label={t("Insufficient")} color="#A53860" onClick={() => handleStatusChange("#A53860")} />
                <ColorCodingSearch label={t("Critical")} color="#99A300" onClick={() => handleStatusChange("#99A300")} />
              </>
            }
          />
        </div>

        <div className="card table-responsive">

          {/* { tbodyPatientDetail && 
          
          <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

          }}
          className=""
        >
          <Input
            type="text"
            className="table-input my-1"
            respclass={"width-250 px-1"}
            removeFormGroupClass={true}
            placeholder={t("Search")}
            onChange={handleItemSearch}
          // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
          />
          <div className="mb-0 px-1">
            <p className="text-bold mb-0">Total Count : {tbodyPatientDetail?.length ? tbodyPatientDetail?.length : 0}</p>
          </div>
        </div>
          
          } */}
          <Tables
            thead={theadPatientDetail}
            tdFontWeight={"bold"}
            tbody={tbodyPatientDetail
              .slice(page * 100 - 100, page * 100)
              .map((val, index) => ({
                sno: <strong>{(page - 1) * 100 + index + 1}</strong>,
                approved: val?.Approved ? (
                  <input
                    type="checkbox"
                    checked={selectedChecked.includes(val?.Test_ID)}
                    onChange={(e) => handleChangeCheckbox(val)}
                  />
                ) : (
                  null
                ),
                
                sampleCollection: (
                  <span onClick={() => {
                    openModal("sampleCollection", val?.BarcodeNo, val?.EntryDate)
                  }} className='d-flex justify-content-center my-2'>
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                  </span>),
                sampleReceiving:  (
                  <span onClick={() => {
                    openModal("sampleReceiving", val?.BarcodeNo, val?.EntryDate)
                  }} className='d-flex justify-content-center my-2'>
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                  </span>),

                PatientName: (
                  <strong className={val?.IsMLC === 1 ? "blink-red" : ""}>
                    {val?.PName}
                  </strong>
                ),
                UHIDNo: val?.PatientID,  
                BarcodeNo: val?.BarcodeNo,
                EntryDateTime: val?.EntryDate,
                Ward: val?.RoomNo,
                ItemName: (<strong className="panel-cell"> {val?.ItemName}</strong>),
                PanelName: (<div className="panel-cell"> <strong>{val?.PanelName}</strong></div>),
                IPDNo: val?.IPDNo,
                AgeSex: val?.pinfo,
                PatientType: val?.PatientType,
                DoctorName: (<div className="panel-cell"> <strong>{val?.DoctorName}</strong> </div>),
                department: (<div className="panel-cell"> <strong>{val?.Dept}</strong> </div>),
                FTR: val?.Frt, 
                CTBNo: val?.CTBNo,
                approve: val?.DisplayApprovedDate,
                MarkStatusReason: <div className="panel-cell"><strong>{val?.MarkStatusReason}</strong> </div>,
                colorcode: val?.rowColor,

                Outsource:
                  val.isoutsource == "1" ? (
                    <input
                      type="checkbox"
                      checked={selectedChecked.includes(val?.Test_ID)}
                      onChange={(e) => handleChangeCheckbox(val)}
                    />
                  ) : (
                    ""
                  ),
                "View Reports": (
                  val?.CanViewReport ?
                    <div
                      onClick={() => handleOpenReport(val)}
                    >
                      {console.log(val)}
                      {" "}
                      <FaPaperclip />
                    </div> : '-'
                ),
                "View Document": (
                  val?.CanViewAttachment ?
                    (<div
                      onClick={() => {
                        handleDocumentView(val, index);
                      }}
                    >
                      {" "}
                      <FaPaperclip />
                    </div>
                    )
                    : "-"
                )
                ,

                // colorcode: getRowClass(val),
              }))}
            style={{ height: "55vh" }}
            tableHeight={"scrollView"}
          />
        </div>

        <div className="pagination">
          {page > 1 && (
            <button className="paginationBtn" onClick={handlePrevious}>
              <FaLessThan />
            </button>
          )}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`paginationBtn ${page === pageNum ? "selected_page" : ""}`}
              >
                {pageNum}
              </button>
            );
          })}
          {page < totalPages && (
            <button className="paginationBtn" onClick={handleNext}>
              <FaGreaterThan />
            </button>
          )}
        </div>
      </div>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {/* //uguiguiguiguig */}
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
}

export default ReportDispatch;