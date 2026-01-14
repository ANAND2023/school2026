


// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import moment from "moment";
// // import { EnquiryCreateenquiry } from "../../networkServices/School/RegistrationApi";
// import Heading from "../../UI/Heading";
// import DatePicker from "../../formComponent/DatePicker";
// import Tables from "../../UI/customTable";
// import { notify } from "../../../utils/utils";
// import Modal from "../../modalComponent/Modal";
// import { getRegistrationlist } from "../../../networkServices/School/RegistrationApi";
// import StudentRegistration from "./StudentRegistration";
// import Input from "../../formComponent/Input";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
// import StudentProfile from "../../Student/StudentProfile";
// import { exportToExcel } from "../../../utils/exportLibrary";

// function AllRegistration() {
//   const localData = useLocalStorage("userData", "get");
//   const [t] = useTranslation();
//   const [tableData, setTableData] = useState([]);
//   const { VITE_DATE_FORMAT } = import.meta.env;


//   const initialData = {
//     StudentID: "",
//     firstName: "",
//     Contact: "",
//     fatherName: "",
//     enquirerName: "",
//     mobileNumber: "",
//     alternateMobileNumber: "",
//     previousSchoolName: "",
//     previousClass: "",
//     desiredClass: "",
//     previousPercentage: "",
//     isInterested: true,
//     fromDate: new Date(),
//     toDate: new Date(),

//   }
//   const [values, setValues] = useState(initialData);
//   const [handleModelData, setHandleModelData] = useState({});
//   const [modalData, setModalData] = useState({});
//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleChange = (e, type, limit = 9999999999999) => {

//     const { name, value } = e.target

//     if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

//     } else {
//       setValues((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSearch = async () => {
//     const payload =
//     {
//       "studentMasterId": null,
//       "studentId": values.StudentID,
//       "firstName": values.firstName,
//       "mobile": values.Contact,
//       "email": "",
//       "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
//       "toDate": moment(values.toDate).format("YYYY-MM-DD")
//     }


//     try {
//       const response = await getRegistrationlist(payload);
//       if (response?.success) {
//         setTableData(response?.data);
//         notify(response?.message, "success")
//       }
//       else {
//         notify(response?.message, "error")
//       }
//     } catch (error) {
//       console.log("error", error)
//     }
//   }
//   //   const handleOpen = () => {
//   //   setValues(initialData); // reset
//   //   setHandleModelData(prev => ({
//   //     ...prev,
//   //     isOpen: true,
//   //   }));
//   // };

//   const handleChangeModel = (data) => {
//     setModalData(data);
//   };
//   const handleOpen = () => {
//     setHandleModelData({
//       label: t("Registration From"),
//       buttonName: t("Save"),
//       width: "80vw",
//       isOpen: true,
//       // modalData: data,
//       Component: (
//         <StudentRegistration handleChangeModel={handleChangeModel} />
//       ),
//       //   handleInsertAPI: handleSave,
//       extrabutton: <></>,
//       footer: <></>
//     });
//   }

//   const setIsOpen = () => {
//     setHandleModelData((val) => ({ ...val, isOpen: false }));
//   };
//   const handleCapitalLatter = (e) => {
//     let event = { ...e }
//     event.target.value = event.target.value.toUpperCase()
//     handleChange(e)

//   }
//   const thead = [
//     { name: t("SNo"), width: "1%" },
//     { name: t("#"), width: "1%" },
//     { name: t("Student ID") },
//     { name: t("name") },
//     { name: t("gender") },
//     { name: t("dob") },
//     { name: t("class") },
//     { name: t("mobile") },
//     { name: t("parents") },
//     { name: t("Action") },

//   ];

//   useEffect(() => {
//     handleSearch()
//   }, [])
//   const getRowClass = (row) => {
//     console.log("row data =>", row);

//     if (row?.status === "0") {
//       return "color-indicator-24-bg";
//     }
//     else if (row?.status === "1") {
//       return "color-indicator-2-bg";
//     }
//     else {
//       return "color-indicator-4-bg";
//     }
//   };

//   const handleOpenStudentProfile = (data) => {
//     setModalData(data);
//     setHandleModelData({
//       isOpen: true,
//       width: "80vw",
//       label: t("Student Profile"),
//       Component: <StudentProfile modalData={data} setModalData={setModalData} />,
//       extrabutton: <></>,
//       footer: <></>
//     });
//   }
//   // const handleExcel=(val)=>{
//   //   exportToExcel(val, "Exel");
//   // }
//   const handleExcel = (data) => {

//     const excelData = data.map((item, index) => {
//       const father = item.parents?.find(p => p.parentType === 1);
//       const mother = item.parents?.find(p => p.parentType === 2);
//       const academic = item.academics?.[0];

//       return {
//         "S.No": index + 1,
//         "Student ID": item.studentId,
//         "Full Name": item.fullName,
//         "Gender": item.gender === "1" ? "Male" : "Female",
//         "DOB": item.dateOfBirth?.split("T")[0],
//         "Phone": item.phone,
//         "Email": item.email,

//         "Village": item.village,
//         "City": item.city,
//         "District": item.district,
//         "State": item.state,
//         "Pincode": item.pincode,

//         "Blood Group": item.bloodGroup,
//         "Category": item.category,
//         "Religion": item.religion,
//         "Nationality": item.nationality,

//         // 👨 Father
//         "Father Name": father?.name || "",
//         "Father Mobile": father?.mobile || "",
//         "Father Occupation": father?.occupation || "",

//         // 👩 Mother
//         "Mother Name": mother?.name || "",
//         "Mother Mobile": mother?.mobile || "",
//         "Mother Occupation": mother?.occupation || "",

//         // 🎓 Academic
//         "Class": academic?.class || "",
//         "Roll No": academic?.rollNumber || "",
//         "Board": academic?.boardName || "",
//         "Medium": academic?.medium || "",
//         "School Name": academic?.schoolName || "",
//         "Passing Year": academic?.yearOfPassing || "",
//         "Percentage": academic?.percentage || ""
//       };
//     });
//     exportToExcel(excelData, "Exel");
//   }
//   return (
//     <>
//       {handleModelData?.isOpen && (
//         <Modal
//           visible={handleModelData?.isOpen}
//           setVisible={setIsOpen}
//           modalWidth={handleModelData?.width}
//           Header={t(handleModelData?.label)}
//           buttonType={"button"}
//           buttons={handleModelData?.extrabutton}
//           buttonName={handleModelData?.buttonName}
//           modalData={modalData}
//           setModalData={setModalData}
//           footer={handleModelData?.footer}
//           handleAPI={handleModelData?.handleInsertAPI}
//         >
//           {handleModelData?.Component}
//           {/* <RegistrationForm  values={values} setValues={setValues}  /> */}

//         </Modal>
//       )}

//       <div className="card p-1">
//         <Heading title={t("Student Detail for Registration")} isBreadcrumb={false}

//           secondTitle={<div className="col-12 text-right">
//             <button
//               onClick={handleOpen}
//               // className="btn btn-lg btn-success"
//               className="btn btn-sm btn-primary"
//               type="button"
//             >
//               {t("Registration")}
//             </button>
//           </div>}
//         />
//         <div className="row  p-2">
//           <Input
//             className="form-control"
//             name="StudentID"
//             lable="Student ID"
//             value={values.StudentID}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             className="form-control"
//             name="firstName"
//             lable="First Name"
//             value={values.firstName}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             className="form-control"
//             name="Contact"
//             lable="Contact"
//             value={values.Contact}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <DatePicker
//             id="fromDate"
//             name="fromDate"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("From Date")}
//             className="custom-calendar"
//             value={values?.fromDate}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             maxDate={values?.toDate}
//           />
//           <DatePicker
//             id="toDate"
//             name="toDate"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("To Date")}
//             className="custom-calendar"
//             value={values?.toDate}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             maxDate={new Date()}
//           />
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <button
//               onClick={handleSearch}
//               // className="btn btn-lg btn-success"
//               className="btn btn-sm btn-primary"
//               type="button"
//             >
//               {t("Search")}
//             </button>
//             <button
//               onClick={handleSearch}
//               // className="btn btn-lg btn-success"
//               className="btn btn-sm btn-primary ml-1"
//               type="button"
//             >
//               {t("Admission")}
//             </button>
//           </div>

//         </div>
//         {/* <Heading title={t(" Details")} isBreadcrumb={false} /> */}
//         <Heading title="Student Reg Details" isBreadcrumb={false} secondTitle={
//           <>
//             <i
//               className="fa fa-file-excel text-success text-lg mr-2"
//               onClick={() => handleExcel(tableData)}
//               style={{ cursor: "pointer" }}
//             ></i>
//             <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
//             <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />


//           </>
//         } />
//         {tableData?.length > 0 && <>
//           <Tables
//             thead={thead}
//             tbody={tableData?.map((ele, index) => ({
//               SrNo: index + 1,
//               checked: <input type="checkbox" name="isChecked" checked={ele?.isChecked} onChange={handleChange} />,
//               studentId: `${ele?.studentId} `,
//               name: `${ele?.fullName} `,

//               gender: ele?.gender,
//               dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
//               class: ele?.academics[0]?.class,
//               mobile: `${ele?.phone},${ele?.alternatePhone} `,
//               parents: ele?.parents?.map(p => (`${p?.name},`)),
//               action: <i className="fa fa-eye" onClick={() => handleOpenStudentProfile(ele)}></i>
//             }))}
//             getRowClass={getRowClass}
//           />

//         </>}
//       </div>
//     </>
//   );
// }

// export default AllRegistration;


// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import moment from "moment";

// import Heading from "../../UI/Heading";
// import DatePicker from "../../formComponent/DatePicker";
// import Tables from "../../UI/customTable";
// import Modal from "../../modalComponent/Modal";
// import Input from "../../formComponent/Input";
// import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
// import SlideScreen from "../../front-office/SlideScreen";
// import SeeMoreSlideScreen from "../../UI/SeeMoreSlideScreen";
// import DocVitalSignPatientDetailCard from "../../commonComponents/DocVitalSignPatientDetailCard";

// import StudentRegistration from "./StudentRegistration";
// import StudentProfile from "../../Student/StudentProfile";
// import RegToAdmission from "./RegToAdmission";
// import BulkRegistration from "./BulkRegistration";

// import { getRegistrationlist } from "../../../networkServices/School/RegistrationApi";
// import { exportToExcel } from "../../../utils/exportLibrary";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import { notify } from "../../../utils/utils";

// function AllRegistration() {
//   const localData = useLocalStorage("userData", "get");
//   const [t] = useTranslation();
//   const [tableData, setTableData] = useState([]);
//   const { VITE_DATE_FORMAT } = import.meta.env;

//   // Form state
//   const initialData = {
//     StudentID: null,
//     firstName: null,
//     Contact: null,
//     fatherName: null,
//     enquirerName: null,
//     mobileNumber: null,
//     alternateMobileNumber: null,
//     previousSchoolName: null,
//     previousClass: null,
//     desiredClass: null,
//     previousPercentage: null,
//     isInterested: true,
//     fromDate: null,
//     toDate: null,
//   };
//   const [values, setValues] = useState(initialData);

//   // Modal & Slide state
//   const [handleModelData, setHandleModelData] = useState({});
//   const [modalData, setModalData] = useState({});
//   const [seeMore, setSeeMore] = useState([]);
//   const [BindFrameMenuByRoleIDS, setBindFrameMenuByRoleIDS] = useState([
//     {
//       menuColor: "1",
//       menuName: "Vital Sign",
//       id: "4",
//       url: "VitalSign",
//       target: "Contentframe",
//     },
//   ]);
//   const [renderComponent, setRenderComponent] = useState({
//     name: "",
//     component: null,
//   });

//   // Handlers
//   const handleChange = (e, type, limit = 9999999999999) => {
//     const { name, value } = e.target;
//     if (type === "number" && (isNaN(Number(value)) || Number(value) > limit)) return;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = async () => {
//     const payload = {
//       studentMasterId: null,
//       studentId: values.StudentID ?? null,
//       firstName: values.firstName ?? null,
//       mobile: values.Contact ?? null,
//       email: null,
//       fromDate: values.fromDate ? moment(values.fromDate).format("YYYY-MM-DD") : null,
//       toDate: values.toDate ? moment(values.toDate).format("YYYY-MM-DD") : null,
//     };

//     try {
//       const response = await getRegistrationlist(payload);
//       if (response?.success) {
//         setTableData(response?.data);
//         notify(response?.message, "success");
//       } else {
//         notify(response?.message, "error");
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const handleOpen = () => {
//     setHandleModelData({
//       label: t("Registration Form"),
//       buttonName: t("Save"),
//       width: "80vw",
//       isOpen: true,
//       Component: <StudentRegistration handleChangeModel={setModalData} />,
//       extrabutton: <></>,
//       footer: <></>,
//     });
//   };

//   const setIsOpen = () => {
//     setHandleModelData((val) => ({ ...val, isOpen: false }));
//   };

//   const handleRowCheck = (index) => {
//     const updated = [...tableData];
//     updated[index].isChecked = !updated[index].isChecked;
//     setTableData(updated);
//   };

//   const handleSelectAll = (e) => {
//     const checked = e.target.checked;
//     setTableData(tableData.map((item) => ({ ...item, isChecked: checked })));
//   };

//   const getRowClass = (row) => {
//     if (row?.status === "0") return "color-indicator-24-bg";
//     if (row?.status === "1") return "color-indicator-2-bg";
//     return "color-indicator-4-bg";
//   };

//   const handleOpenStudentProfile = (data) => {
//     setModalData(data);
//     setHandleModelData({
//       isOpen: true,
//       width: "80vw",
//       label: t("Student Profile"),
//       Component: <StudentProfile modalData={data} setModalData={setModalData} />,
//       extrabutton: <></>,
//       footer: <></>,
//     });
//   };

//   const handleExcel = (data) => {
//     const excelData = data.map((item, index) => {
//       const father = item.parents?.find((p) => p.parentType === 1);
//       const mother = item.parents?.find((p) => p.parentType === 2);
//       const academic = item.academics?.[0];

//       return {
//         "S.No": index + 1,
//         "Student ID": item.studentId,
//         "Full Name": item.fullName,
//         "Gender": item.gender === "1" ? "Male" : "Female",
//         "DOB": item.dateOfBirth?.split("T")[0],
//         "Phone": item.phone,
//         "Email": item.email,
//         "Village": item.village,
//         "City": item.city,
//         "District": item.district,
//         "State": item.state,
//         "Pincode": item.pincode,
//         "Blood Group": item.bloodGroup,
//         "Category": item.category,
//         "Religion": item.religion,
//         "Nationality": item.nationality,
//         "Father Name": father?.name || "",
//         "Father Mobile": father?.mobile || "",
//         "Father Occupation": father?.occupation || "",
//         "Mother Name": mother?.name || "",
//         "Mother Mobile": mother?.mobile || "",
//         "Mother Occupation": mother?.occupation || "",
//         "Class": academic?.class || "",
//         "Roll No": academic?.rollNumber || "",
//         "Board": academic?.boardName || "",
//         "Medium": academic?.medium || "",
//         "School Name": academic?.schoolName || "",
//         "Passing Year": academic?.yearOfPassing || "",
//         "Percentage": academic?.percentage || "",
//       };
//     });
//     exportToExcel(excelData, "Excel");
//   };

//   const handleAdmission = () => {
//     setModalData("data");
//     setHandleModelData({
//       isOpen: true,
//       width: "80vw",
//       label: t("Registration To Admission"),
//       Component: <RegToAdmission modalData={"data"} setModalData={setModalData} />,
//       extrabutton: <></>,
//     });
//   };

//   const handleReg = () => {
//     setModalData("data");
//     setHandleModelData({
//       isOpen: true,
//       width: "30vw",
//       label: t("Registration To Admission"),
//       Component: <BulkRegistration modalData={"data"} setModalData={setModalData} />,
//       extrabutton: <></>,
//       footer: <></>,
//     });
//   };

//   const today = new Date().toISOString().split("T")[0];
//   const todayReg = tableData?.filter((ele) => ele.createdOn?.startsWith(today));

//   const handleChangeComponent = (e) => {
//     setRenderComponent({
//       name: e?.label,
//       component: e?.component,
//     });
//   };

//   useEffect(() => {
//     handleSearch();
//   }, []);

//   const thead = [
//     { name: t("Action"), width: "1%" },
//     { name: t("SNo"), width: "1%" },
//     {
//       name: (
//         <input
//           type="checkbox"
//           onChange={handleSelectAll}
//           checked={tableData.length > 0 && tableData.every((item) => item.isChecked)}
//         />
//       ),
//       width: "1%",
//     },
//     { name: t("Student ID") },
//     { name: t("name") },
//     { name: t("gender") },
//     { name: t("dob") },
//     { name: t("class") },
//     { name: t("mobile") },
//     { name: t("parents") },
//     { name: t("Action") },
//   ];

//   return (
//     <>
//       {/* Main Modal */}
//       {handleModelData?.isOpen && (
//         <Modal
//           visible={handleModelData?.isOpen}
//           setVisible={setIsOpen}
//           modalWidth={handleModelData?.width}
//           Header={t(handleModelData?.label)}
//           buttonType={"button"}
//           buttons={handleModelData?.extrabutton}
//           buttonName={handleModelData?.buttonName}
//           modalData={modalData}
//           setModalData={setModalData}
//           footer={handleModelData?.footer}
//           handleAPI={handleModelData?.handleInsertAPI}
//         >
//           {handleModelData?.Component}
//         </Modal>
//       )}

//       <div className="card p-1">
//         <Heading
//           title={t("Student Detail for Registration")}
//           isBreadcrumb={false}
//           secondTitle={
//             <div className="col-12 text-right">
//               <span className="mr-1" style={{ fontFamily: "serif", color: "Highlight" }}>
//                 No Of Reg : {tableData?.length}
//               </span>
//               <button onClick={handleReg} className="btn btn-sm btn-primary" type="button">
//                 {t("Bulk Registration")}
//               </button>
//               <button onClick={handleOpen} className="btn btn-sm btn-primary" type="button">
//                 {t("Registration")}
//               </button>
//             </div>
//           }
//         />

//         {/* Filters */}
//         <div className="row p-2">
//           <Input
//             className="form-control"
//             name="StudentID"
//             lable="Student ID"
//             value={values.StudentID}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             className="form-control"
//             name="firstName"
//             lable="First Name"
//             value={values.firstName}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             className="form-control"
//             name="Contact"
//             lable="Contact"
//             value={values.Contact}
//             onChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <DatePicker
//             id="fromDate"
//             name="fromDate"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("From Date")}
//             className="custom-calendar"
//             value={values?.fromDate}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             maxDate={values?.toDate}
//           />
//           <DatePicker
//             id="toDate"
//             name="toDate"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("To Date")}
//             className="custom-calendar"
//             value={values?.toDate}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             maxDate={new Date()}
//           />
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <button onClick={handleSearch} className="btn btn-sm btn-primary" type="button">
//               {t("Search")}
//             </button>
//             <button onClick={handleAdmission} className="btn btn-sm btn-primary ml-1" type="button">
//               {t("Admission")}
//             </button>
//           </div>
//         </div>

//         {/* Table Header */}
//         <Heading
//           title="Student Reg Details"
//           isBreadcrumb={false}
//           secondTitle={
//             <>
//               <span
//                 className="mr-3"
//                 style={{ fontFamily: "serif", color: "#2ecc71", fontWeight: "bold", fontSize: "16px" }}
//               >
//                 Today No Of Reg. : {todayReg?.length}
//               </span>
//               <span
//                 className="mr-1"
//                 style={{ fontFamily: "serif", color: "#3498db", fontWeight: "bold", fontSize: "16px" }}
//               >
//                 Total No Of Reg. : {tableData?.length}
//               </span>
//               <button id="excelBtn" onClick={() => handleExcel(tableData)} title="Excel Download">
//                 <i className="fa fa-file-excel text-lg" style={{ cursor: "pointer" }}></i>
//               </button>
//               <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
//               <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />
//             </>
//           }
//         />

//         {/* Table */}
//         {tableData?.length > 0 && (
//           <Tables
//             thead={thead}
//             tbody={tableData.map((ele, index) => ({
//               Action: (
//                 <DocVitalSignPatientDetailCard
//                   ModalComponent={setRenderComponent}
//                   setSeeMore={setSeeMore}
//                   data={ele}
//                   handleSubmit={() => {}}
//                   keyName={"menuName"}
//                   BindFrameMenuByList={BindFrameMenuByRoleIDS}
//                   isShowPatient={true}
//                 />
//               ),
//               SrNo: index + 1,
//               checked: <input type="checkbox" checked={ele.isChecked} onChange={() => handleRowCheck(index)} />,
//               studentId: `${ele?.studentId}`,
//               name: `${ele?.fullName}`,
//               gender: ele?.gender,
//               dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
//               class: ele?.academics[0]?.class,
//               mobile: `${ele?.phone},${ele?.alternatePhone}`,
//               parents: ele?.parents?.map((p) => `${p?.name},`),
//               action: (
//                 <div className="d-flex align-items-center justify-content-center gap-2">
//                   <button onClick={() => handleOpenStudentProfile(ele)} title="View">
//                     <i className="fa fa-eye"></i>
//                   </button>
//                   <button title="Edit">
//                     <i className="bi bi-pencil-square"></i>
//                   </button>
//                   <button title="Delete">
//                     <i className="bi-trash3"></i>
//                   </button>
//                 </div>
//               ),
//             }))}
//             getRowClass={getRowClass}
//           />
//         )}
//       </div>

//       {/* SlideScreen for See More */}
//       <SlideScreen
//         visible={!!renderComponent?.component}
//         setVisible={() =>
//           setRenderComponent({
//             name: null,
//             component: null,
//           })
//         }
//         Header={
//           <SeeMoreSlideScreen
//             name={renderComponent?.name}
//             seeMore={seeMore}
//             handleChangeComponent={handleChangeComponent}
//           />
//         }
//       >
//         {renderComponent?.component}
//       </SlideScreen>
//     </>
//   );
// }

// export default AllRegistration;



// // import React, { useEffect, useState } from "react";
// // import { useTranslation } from "react-i18next";
// // import moment from "moment";
// // // import { EnquiryCreateenquiry } from "../../networkServices/School/RegistrationApi";
// // import Heading from "../../UI/Heading";
// // import DatePicker from "../../formComponent/DatePicker";
// // import Tables from "../../UI/customTable";
// // import { notify } from "../../../utils/utils";
// // import Modal from "../../modalComponent/Modal";
// // import { getRegistrationlist } from "../../../networkServices/School/RegistrationApi";
// // import StudentRegistration from "./StudentRegistration";
// // import Input from "../../formComponent/Input";
// // import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// // import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
// // import StudentProfile from "../../Student/StudentProfile";
// // import { exportToExcel } from "../../../utils/exportLibrary";

// // function AllRegistration() {
// //   const localData = useLocalStorage("userData", "get");
// //   const [t] = useTranslation();
// //   const [tableData, setTableData] = useState([]);
// //   const { VITE_DATE_FORMAT } = import.meta.env;


// //   const initialData = {
// //     StudentID: "",
// //     firstName: "",
// //     Contact: "",
// //     fatherName: "",
// //     enquirerName: "",
// //     mobileNumber: "",
// //     alternateMobileNumber: "",
// //     previousSchoolName: "",
// //     previousClass: "",
// //     desiredClass: "",
// //     previousPercentage: "",
// //     isInterested: true,
// //     fromDate: new Date(),
// //     toDate: new Date(),

// //   }
// //   const [values, setValues] = useState(initialData);
// //   const [handleModelData, setHandleModelData] = useState({});
// //   const [modalData, setModalData] = useState({});
// //   const handleSelect = (name, value) => {
// //     setValues((prev) => ({ ...prev, [name]: value }));
// //   };
// //   const handleChange = (e, type, limit = 9999999999999) => {

// //     const { name, value } = e.target

// //     if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

// //     } else {
// //       setValues((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };

// //   const handleSearch = async () => {
// //     const payload =
// //     {
// //       "studentMasterId": null,
// //       "studentId": values.StudentID,
// //       "firstName": values.firstName,
// //       "mobile": values.Contact,
// //       "email": "",
// //       "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
// //       "toDate": moment(values.toDate).format("YYYY-MM-DD")
// //     }


// //     try {
// //       const response = await getRegistrationlist(payload);
// //       if (response?.success) {
// //         setTableData(response?.data);
// //         notify(response?.message, "success")
// //       }
// //       else {
// //         notify(response?.message, "error")
// //       }
// //     } catch (error) {
// //       console.log("error", error)
// //     }
// //   }
// //   //   const handleOpen = () => {
// //   //   setValues(initialData); // reset
// //   //   setHandleModelData(prev => ({
// //   //     ...prev,
// //   //     isOpen: true,
// //   //   }));
// //   // };

// //   const handleChangeModel = (data) => {
// //     setModalData(data);
// //   };
// //   const handleOpen = () => {
// //     setHandleModelData({
// //       label: t("Registration From"),
// //       buttonName: t("Save"),
// //       width: "80vw",
// //       isOpen: true,
// //       // modalData: data,
// //       Component: (
// //         <StudentRegistration handleChangeModel={handleChangeModel} />
// //       ),
// //       //   handleInsertAPI: handleSave,
// //       extrabutton: <></>,
// //       footer: <></>
// //     });
// //   }

// //   const setIsOpen = () => {
// //     setHandleModelData((val) => ({ ...val, isOpen: false }));
// //   };
// //   const handleCapitalLatter = (e) => {
// //     let event = { ...e }
// //     event.target.value = event.target.value.toUpperCase()
// //     handleChange(e)

// //   }
// //   const thead = [
// //     { name: t("SNo"), width: "1%" },
// //     { name: t("#"), width: "1%" },
// //     { name: t("Student ID") },
// //     { name: t("name") },
// //     { name: t("gender") },
// //     { name: t("dob") },
// //     { name: t("class") },
// //     { name: t("mobile") },
// //     { name: t("parents") },
// //     { name: t("Action") },

// //   ];

// //   useEffect(() => {
// //     handleSearch()
// //   }, [])
// //   const getRowClass = (row) => {
// //     console.log("row data =>", row);

// //     if (row?.status === "0") {
// //       return "color-indicator-24-bg";
// //     }
// //     else if (row?.status === "1") {
// //       return "color-indicator-2-bg";
// //     }
// //     else {
// //       return "color-indicator-4-bg";
// //     }
// //   };

// //   const handleOpenStudentProfile = (data) => {
// //     setModalData(data);
// //     setHandleModelData({
// //       isOpen: true,
// //       width: "80vw",
// //       label: t("Student Profile"),
// //       Component: <StudentProfile modalData={data} setModalData={setModalData} />,
// //       extrabutton: <></>,
// //       footer: <></>
// //     });
// //   }
// //   // const handleExcel=(val)=>{
// //   //   exportToExcel(val, "Exel");
// //   // }
// //   const handleExcel = (data) => {

// //     const excelData = data.map((item, index) => {
// //       const father = item.parents?.find(p => p.parentType === 1);
// //       const mother = item.parents?.find(p => p.parentType === 2);
// //       const academic = item.academics?.[0];

// //       return {
// //         "S.No": index + 1,
// //         "Student ID": item.studentId,
// //         "Full Name": item.fullName,
// //         "Gender": item.gender === "1" ? "Male" : "Female",
// //         "DOB": item.dateOfBirth?.split("T")[0],
// //         "Phone": item.phone,
// //         "Email": item.email,

// //         "Village": item.village,
// //         "City": item.city,
// //         "District": item.district,
// //         "State": item.state,
// //         "Pincode": item.pincode,

// //         "Blood Group": item.bloodGroup,
// //         "Category": item.category,
// //         "Religion": item.religion,
// //         "Nationality": item.nationality,

// //         // 👨 Father
// //         "Father Name": father?.name || "",
// //         "Father Mobile": father?.mobile || "",
// //         "Father Occupation": father?.occupation || "",

// //         // 👩 Mother
// //         "Mother Name": mother?.name || "",
// //         "Mother Mobile": mother?.mobile || "",
// //         "Mother Occupation": mother?.occupation || "",

// //         // 🎓 Academic
// //         "Class": academic?.class || "",
// //         "Roll No": academic?.rollNumber || "",
// //         "Board": academic?.boardName || "",
// //         "Medium": academic?.medium || "",
// //         "School Name": academic?.schoolName || "",
// //         "Passing Year": academic?.yearOfPassing || "",
// //         "Percentage": academic?.percentage || ""
// //       };
// //     });
// //     exportToExcel(excelData, "Exel");
// //   }
// //   return (
// //     <>
// //       {handleModelData?.isOpen && (
// //         <Modal
// //           visible={handleModelData?.isOpen}
// //           setVisible={setIsOpen}
// //           modalWidth={handleModelData?.width}
// //           Header={t(handleModelData?.label)}
// //           buttonType={"button"}
// //           buttons={handleModelData?.extrabutton}
// //           buttonName={handleModelData?.buttonName}
// //           modalData={modalData}
// //           setModalData={setModalData}
// //           footer={handleModelData?.footer}
// //           handleAPI={handleModelData?.handleInsertAPI}
// //         >
// //           {handleModelData?.Component}
// //           {/* <RegistrationForm  values={values} setValues={setValues}  /> */}

// //         </Modal>
// //       )}

// //       <div className="card p-1">
// //         <Heading title={t("Student Detail for Registration")} isBreadcrumb={false}

// //           secondTitle={<div className="col-12 text-right">
// //             <button
// //               onClick={handleOpen}
// //               // className="btn btn-lg btn-success"
// //               className="btn btn-sm btn-primary"
// //               type="button"
// //             >
// //               {t("Registration")}
// //             </button>
// //           </div>}
// //         />
// //         <div className="row  p-2">
// //           <Input
// //             className="form-control"
// //             name="StudentID"
// //             lable="Student ID"
// //             value={values.StudentID}
// //             onChange={handleChange}
// //             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
// //           />
// //           <Input
// //             className="form-control"
// //             name="firstName"
// //             lable="First Name"
// //             value={values.firstName}
// //             onChange={handleChange}
// //             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
// //           />
// //           <Input
// //             className="form-control"
// //             name="Contact"
// //             lable="Contact"
// //             value={values.Contact}
// //             onChange={handleChange}
// //             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
// //           />
// //           <DatePicker
// //             id="fromDate"
// //             name="fromDate"
// //             placeholder={VITE_DATE_FORMAT}
// //             lable={t("From Date")}
// //             className="custom-calendar"
// //             value={values?.fromDate}
// //             handleChange={handleChange}
// //             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
// //             maxDate={values?.toDate}
// //           />
// //           <DatePicker
// //             id="toDate"
// //             name="toDate"
// //             placeholder={VITE_DATE_FORMAT}
// //             lable={t("To Date")}
// //             className="custom-calendar"
// //             value={values?.toDate}
// //             handleChange={handleChange}
// //             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
// //             maxDate={new Date()}
// //           />
// //           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
// //             <button
// //               onClick={handleSearch}
// //               // className="btn btn-lg btn-success"
// //               className="btn btn-sm btn-primary"
// //               type="button"
// //             >
// //               {t("Search")}
// //             </button>
// //             <button
// //               onClick={handleSearch}
// //               // className="btn btn-lg btn-success"
// //               className="btn btn-sm btn-primary ml-1"
// //               type="button"
// //             >
// //               {t("Admission")}
// //             </button>
// //           </div>

// //         </div>
// //         {/* <Heading title={t(" Details")} isBreadcrumb={false} /> */}
// //         <Heading title="Student Reg Details" isBreadcrumb={false} secondTitle={
// //           <>
// //             <i
// //               className="fa fa-file-excel text-success text-lg mr-2"
// //               onClick={() => handleExcel(tableData)}
// //               style={{ cursor: "pointer" }}
// //             ></i>
// //             <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
// //             <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />


// //           </>
// //         } />
// //         {tableData?.length > 0 && <>
// //           <Tables
// //             thead={thead}
// //             tbody={tableData?.map((ele, index) => ({
// //               SrNo: index + 1,
// //               checked: <input type="checkbox" name="isChecked" checked={ele?.isChecked} onChange={handleChange} />,
// //               studentId: `${ele?.studentId} `,
// //               name: `${ele?.fullName} `,

// //               gender: ele?.gender,
// //               dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
// //               class: ele?.academics[0]?.class,
// //               mobile: `${ele?.phone},${ele?.alternatePhone} `,
// //               parents: ele?.parents?.map(p => (`${p?.name},`)),
// //               action: <i className="fa fa-eye" onClick={() => handleOpenStudentProfile(ele)}></i>
// //             }))}
// //             getRowClass={getRowClass}
// //           />

// //         </>}
// //       </div>
// //     </>
// //   );
// // }

// // export default AllRegistration;

// a

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
// import { EnquiryCreateenquiry } from "../../networkServices/School/RegistrationApi";
import Heading from "../../UI/Heading";
import DatePicker from "../../formComponent/DatePicker";
import Tables from "../../UI/customTable";
import { notify } from "../../../utils/utils";
import Modal from "../../modalComponent/Modal";
import { getRegistrationlist } from "../../../networkServices/School/RegistrationApi";
import StudentRegistration from "./StudentRegistration";
import Input from "../../formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
import StudentProfile from "../../Student/StudentProfile";
import { exportToExcel } from "../../../utils/exportLibrary";
import RegToAdmission from "./RegToAdmission";
import BulkRegistration from "./BulkRegistration";
import Classess from "../../Master/Classess";

function AllRegistration() {
  const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;


  const initialData = {
    StudentID: null,
    firstName: null,
    Contact: null,
    fatherName: null,
    enquirerName: null,
    mobileNumber: null,
    alternateMobileNumber: null,
    previousSchoolName: null,
    previousClass: null,
    desiredClass: null,
    previousPercentage: null,
    isInterested: true,
    fromDate: null,
    toDate: null,

  }
  const [values, setValues] = useState(initialData);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e, type, limit = 9999999999999) => {

    const { name, value } = e.target

    if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  const selectedRows = tableData.filter(item => item.isChecked);
      console.log("tableData", tableData);
    useEffect(() => {
      
      const selectedRows = tableData.filter(item => item.isChecked);
      // console.log("tableData", tableData);
      console.log("selectedRows", selectedRows);
    }, [tableData]);
  const handleSearch = async () => {
    const payload =
    
    {
      "studentMasterId": null,
      "studentId": values.StudentID ?? null,
      "firstName": values.firstName ?? null,
      "mobile": values.Contact ?? null,
      "email": null,
      "fromDate": values.fromDate ? moment(values.fromDate).format("YYYY-MM-DD") : null,
      "toDate": values.toDate ? moment(values.toDate).format("YYYY-MM-DD") : null
    }


    try {
      const response = await getRegistrationlist(payload);
      if (response?.success) {
        setTableData(response?.data);
        notify(response?.message, "success")
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  //   const handleOpen = () => {
  //   setValues(initialData); // reset
  //   setHandleModelData(prev => ({
  //     ...prev,
  //     isOpen: true,
  //   }));
  // };

  const handleChangeModel = (data) => {
    setModalData(data);
  };
  const handleOpen = () => {
    setHandleModelData({
      label: t("Registration From"),
      buttonName: t("Save"),
      width: "80vw",
      isOpen: true,
      // modalData: data,
      Component: (
        <StudentRegistration handleChangeModel={handleChangeModel} />
      ),
      //   handleInsertAPI: handleSave,
      extrabutton: <></>,
      footer: <></>
    });
  }

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  const handleCapitalLatter = (e) => {
    let event = { ...e }
    event.target.value = event.target.value.toUpperCase()
    handleChange(e)

  }

  const handleRowCheck = (index) => {
    const updated = [...tableData];
    updated[index].isChecked = !updated[index].isChecked;
    setTableData(updated);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setTableData(
      tableData.map(item => ({
        ...item,
        isChecked: checked
      }))
    );
  };
  const thead = [
    { name: t("SNo"), width: "1%" },
    {
      name: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            tableData.length > 0 &&
            tableData.every(item => item.isChecked)
          }
        />
      ),
      width: "1%"
    },
    { name: t("Student ID") },
    { name: t("name") },
    { name: t("gender") },
    { name: t("dob") },
    { name: t("class") },
    { name: t("mobile") },
    { name: t("parents") },
    { name: t("Action") },

  ];

  useEffect(() => {
    handleSearch()
  }, [])
  const getRowClass = (row) => {
    console.log("row data =>", row);

    if (row?.status === "0") {
      return "color-indicator-24-bg";
    }
    else if (row?.status === "1") {
      return "color-indicator-2-bg";
    }
    else {
      return "color-indicator-4-bg";
    }
  };

  const handleOpenStudentProfile = (data) => {
    setModalData(data);
    setHandleModelData({
      isOpen: true,
      width: "80vw",
      label: t("Student Profile"),
      Component: <StudentProfile modalData={data} setModalData={setModalData} />,
      extrabutton: <></>,
      footer: <></>
    });
  }
  // const handleExcel=(val)=>{
  //   exportToExcel(val, "Exel");
  // }
  const handleExcel = (data) => {

    const excelData = data.map((item, index) => {
      const father = item.parents?.find(p => p.parentType === 1);
      const mother = item.parents?.find(p => p.parentType === 2);
      const academic = item.academics?.[0];

      return {
        "S.No": index + 1,
        "Student ID": item.studentId,
        "Full Name": item.fullName,
        "Gender": item.gender === "1" ? "Male" : "Female",
        "DOB": item.dateOfBirth?.split("T")[0],
        "Phone": item.phone,
        "Email": item.email,

        "Village": item.village,
        "City": item.city,
        "District": item.district,
        "State": item.state,
        "Pincode": item.pincode,

        "Blood Group": item.bloodGroup,
        "Category": item.category,
        "Religion": item.religion,
        "Nationality": item.nationality,

        // 👨 Father
        "Father Name": father?.name || "",
        "Father Mobile": father?.mobile || "",
        "Father Occupation": father?.occupation || "",

        // 👩 Mother
        "Mother Name": mother?.name || "",
        "Mother Mobile": mother?.mobile || "",
        "Mother Occupation": mother?.occupation || "",

        // 🎓 Academic
        "Class": academic?.class || "",
        "Roll No": academic?.rollNumber || "",
        "Board": academic?.boardName || "",
        "Medium": academic?.medium || "",
        "School Name": academic?.schoolName || "",
        "Passing Year": academic?.yearOfPassing || "",
        "Percentage": academic?.percentage || ""
      };
    });
    exportToExcel(excelData, "Exel");
  }
  const handleAdmission = async () => {
    // const handleOpenStudentProfile = (data) => {
    setModalData("data");
    setHandleModelData({
      isOpen: true,
      width: "80vw",
      label: t("Registration To Admission"),
      Component: <RegToAdmission modalData={"data"} setModalData={setModalData} />,
      extrabutton: <></>,
      // footer: <></>
    });
    // }
    useEffect(() => {
      
      const selectedRows = tableData.filter(item => item.isChecked);
      clgear.log("Selected Rows =>", selectedRows);
    }, []);
      
    // debugger
    //   if (!selectedRows.length) {
    //     notify("Please select at least one student", "warning");
    //     return;
    //   }

    //   const payload = selectedRows.map(item => ({
    //     studentId: item.studentId,
    //     classId: item.academics?.[0]?.classId
    //   }));

    //   console.log("Payload =>", payload);
    // await admissionAPI(payload);
  };
  const handleReg = async () => {

    setModalData("data");
    setHandleModelData({
      isOpen: true,
      width: "30vw",
      label: t("Registration To Admission"),
      Component: <BulkRegistration modalData={"data"} setModalData={setModalData} />,
      extrabutton: <></>,
      footer: <></>
    });

  };
  const today = new Date().toISOString().split("T")[0];

  const todayReg = tableData?.filter(
    (ele) => ele.createdOn?.startsWith(today)
  );

  return (
    <>
      {/* <Classess/> */}
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
          {/* <RegistrationForm  values={values} setValues={setValues}  /> */}

        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Student Detail for Registration")} isBreadcrumb={false}

          secondTitle={<div className="col-12 text-right">
            <span className="mr-1"
              style={{ fontFamily: "serif", color: "Highlight" }}
            >No Of Reg : {tableData?.length}</span>
            <button
              onClick={handleReg}
              // className="btn btn-lg btn-success"
              className="btn btn-sm btn-primary mx-2"
              type="button"
            >
              {t("Bulk Registration")}
            </button>
            <button
              onClick={handleOpen}
              // className="btn btn-lg btn-success"
              className="btn btn-sm btn-primary "
              type="button"
            >
              {t("Registration")}
            </button>
          </div>}
        />
        <div className="row  p-2">
          <Input
            className="form-control"
            name="StudentID"
            lable="Student ID"
            value={values.StudentID}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            className="form-control"
            name="firstName"
            lable="First Name"
            value={values.firstName}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            className="form-control"
            name="Contact"
            lable="Contact"
            value={values.Contact}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            id="fromDate"
            name="fromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("From Date")}
            className="custom-calendar"
            value={values?.fromDate}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />
          <DatePicker
            id="toDate"
            name="toDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("To Date")}
            className="custom-calendar"
            value={values?.toDate}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <button
              onClick={handleSearch}
              // className="btn btn-lg btn-success"
              className="btn btn-sm btn-primary"
              type="button"
            >
              {t("Search")}
            </button>
          </div>
            <button
              onClick={handleAdmission}
              // className="btn btn-lg btn-success"
              className="btn btn-sm btn-primary ml-1"
              type="button"
              disabled={selectedRows.length === 0}
            >
              {t("Admission")}
            </button>

        </div>
        {/* <Heading title={t(" Details")} isBreadcrumb={false} /> */}
        <Heading title="Student Reg Details" isBreadcrumb={false} secondTitle={
          <>



            <span
              className="mr-3"
              style={{
                fontFamily: "serif",
                color: "#2ecc71", // green
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Today No Of Reg. : {todayReg?.length}
            </span>

            <span
              className="mr-1"
              style={{
                fontFamily: "serif",
                color: "#3498db", // blue
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Total No Of Reg. : {tableData?.length}
            </span>

            <button
              id="excelBtn"
              onClick={() => handleExcel(tableData)}
              title="Excel Download"
              className="d-flex align-items-center justify-content-center"
            >

              <i
                className="fa fa-file-excel  text-lg "

                style={{ cursor: "pointer" }}
              ></i>
            </button>
            <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
            <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />


          </>
        } />
        {tableData?.length > 0 && <>
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => ({
              SrNo: index + 1,
              checked: (
                <input
                  type="checkbox"
                  checked={ele.isChecked}
                  onChange={() => handleRowCheck(index)}
                />
              ),
              // checked: <input type="checkbox" name="isChecked" checked={ele?.isChecked} onChange={handleChange} />,
              studentId: `${ele?.studentId} `,
              name: `${ele?.fullName} `,

              gender: ele?.gender,
              dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
              class: ele?.academics[0]?.class,
              mobile: `${ele?.phone},${ele?.alternatePhone} `,
              parents: ele?.parents?.map(p => (`${p?.name},`)),
              action:

                // <i className="fa fa-eye" onClick={() => handleOpenStudentProfile(ele)}></i>
                <div
                  className="d-flex align-items-center justify-content-center gap-2"
                // className="row gap-2 text-center"
                >
                  {/* <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(item)}
                        >
                            ✏️
                        </button> */}
                  <button
                    id="viewBtn"
                    onClick={() => handleOpenStudentProfile(ele)}
                    title="View"
                    className="d-flex align-items-center justify-content-center"
                  >
                    {/* <i class=" bi-pencil-square"></i> */}
                    {/* <i class="bi bi-eye"></i> */}
                    <i class="fa fa-eye"></i>
                  </button>
                  <button
                    id="editBtn"
                    onclick="handleEdit(item.id)"
                    title="Edit"
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i class=" bi-pencil-square"></i>
                  </button>

                  <button
                    id="deleteBtn"
                    onclick="handleDelete(item.id)"
                    title="Delete"
                  >
                    <i class="bi-trash3"></i>
                  </button>
                </div>
            }))}
            getRowClass={getRowClass}
          />

        </>}
      </div>
    </>
  );
}

export default AllRegistration;