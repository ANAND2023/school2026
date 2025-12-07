import React from 'react'
import ClassMaster from './ClassMaster'
import SectionMaster from './SectionMaster'
import FeeHead from './FeeHead'

const Classess = () => {
  return (
    <>
   <div className="row">
  <div className="col-md-6">
    <ClassMaster />
  </div>

  <div className="col-md-6">
    <SectionMaster />
  </div>
</div>
   <div className="row">
  <div className="col-md-6">
    <FeeHead />
  </div>

  {/* <div className="col-md-6">
    <SectionMaster />
  </div> */}
</div>
</>
  )
}

export default Classess


// import ClassMaster from "./ClassMaster";
// import SectionMaster from "./SectionMaster";

// <div className="row">
//   <div className="col-md-6">
//     <ClassMaster />
//   </div>

//   <div className="col-md-6">
//     <SectionMaster />
//   </div>
// </div>



// import React, { useEffect, useState } from "react";
// import Heading from "../../components/UI/Heading";
// import Input from "../../components/formComponent/Input";
// import ReactSelect from "../../components/formComponent/ReactSelect";
// import { useTranslation } from "react-i18next";
// import {
//   filterByTypes,
//   handleReactSelectDropDownOptions,
// } from "../../utils/utils";
// import DatePicker from "../../components/formComponent/DatePicker";
// import Tables from "../../components/UI/customTable";

// import {
  
//     BinddonorBloodGroup,
//   BindQuestions,
  
  
//   bloodBankSaveData,
 
//   donorBindOrganisation,
//   DonorGetCity,
//   DonorGetCountry,
//   saveDonorCity,
// } from "../../networkServices/blooadbankApi";
// import Modal from "../../components/modalComponent/Modal";

// import { notify } from "../../utils/utils";
// import { CentreWiseCacheByCenterID } from "../../store/reducers/common/CommonExportFunction";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";

// function Classess() {
//   const [t] = useTranslation();

//   const { VITE_DATE_FORMAT } = import.meta.env;
//   const [QuestionnaireData, setQuestionnaireData] = useState([]);
//   const get18YearsOldDate = () => {
//     const today = new Date();
//     const year = today.getFullYear() - 18;
//     const month = today.getMonth();
//     const day = today.getDate();

//     return new Date(year, month, day);
//   };
//   const initialData = {
//     PFirstName: "",
//     Title: {},
//     lastname: "",
//     gender: { value: "Male", label: "Male" },
//     type: { value: "0", label: "Select" },
//     kinName: "",
//     dob: get18YearsOldDate(),
//     Organisation: "",
//     IPDNO: "",
//     age: "",
//     relation: { value: "Self", label: "Self" },
//     bloodGroup: {},
//     Address: "",
//     country: "",
//     city: "",
//     email: "",
//     howOften: { value: "0", label: "Select" },
//     bp: "",
//     weight: "",
//     temp: "",
//     pulse: "",
//     height: "",
//     Hemoglobin: { value: "0" },
//     GPE: "",
//     Fit: {},
//     platenletCount: "",
//     phlebotomySide: { value: "0" },
//     bagType: { value: "0" },
//     Quantity: { value: "0" },
//     remark: "",
//     questionRemarks: "",
//     questionInput: "",
//     contactNo: "",
//     NextExpeDate: new Date()
//   }
//   const [values, setValues] = useState(initialData);
//   console.log("valuescity", values)
//   const [handleModelData, setHandleModelData] = useState({});

//   const [donorCity, setDonorCity] = useState([]);
//   const [donorCountry, setDonorCountry] = useState([])
//   const { CentreWiseCache } = useSelector((state) => state.CommonSlice);
//   const dispatch = useDispatch();
//   console.log("donorCity", donorCity)

//   const [modalData, setModalData] = useState({});
//   const gender_type = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ];

//   const Type = [
//     { value: "0", label: "Select" },
//     { value: "1", label: "Volunteer" },
//     { value: "2", label: "Replacement" },
//     { value: "3", label: "Family Donor" },
//   ];

//   const RelationType = [
//     { value: "Self", label: "Self" },
//     { value: "Father", label: "Father" },
//     { value: "Son", label: "Son" },
//     { value: "Wife", label: "Wife" },
//     { value: "Daughter", label: "Daughter" },
//     { value: "Husband", label: "Husband" },
//     { value: "Care", label: "Care" },
//     { value: "Mother", label: "Mother" },
//     { value: "Brother", label: "Brother" },
//     { value: "Uncle", label: "Uncle" },
//     { value: "Sister", label: "Sister" },
//     { value: "Other", label: "Other" },
//   ];

//   const handleSelect = (name, value) => {
//     debugger
//     setValues((prev) => ({ ...prev, [name]: value }));
//     if (name == "country") {
//       handeleGetCity(value?.value);
//     }
//   };

//   const handleChange = (e, type, limit = 9999999999999) => {
//     const { name, value } = e.target
//     console.log("first", limit, Number(value), isNaN(Number(value)))

//     if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

//     } else {
//       setValues((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const [errors, setErrors] = useState({})

//   const validateData = [{ name: "bp", value: 3 }]

//   const validateBP = (value) => {
//     const parts = value.split('/');
//     if (parts.length !== 2) {
//       return "Invalid B.P. format. Example: 120/80";
//     }
//     const systolic = parseInt(parts[0]);
//     const diastolic = parseInt(parts[1]);
//     if (isNaN(systolic) || isNaN(diastolic) || systolic < 100 || systolic > 140 || diastolic < 60 || diastolic > 90) {
//       return 'Invalid B.P. range. Systolic: 100–140, Diastolic: 60–90'
//     } else {
//       return ""
//     }
//   }
//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     debugger
//     if (name === "bp") {
//       const error = validateBP(value)
//       if (error) {
//         setErrors((prev) => ({ ...prev, [name]: error }))
//         notify(error, "error")
//         return
//       }
//     } else if (name === "weight" && Number(value) < 49) {
//       setErrors((prev) => ({ ...prev, [name]: "Donor is not eligible to donate blood. Minimum required weight is 50 kg" }))
//       notify("Donor is not eligible to donate blood. Minimum required weight is 50 kg", "error")
//       return
//     } else if (name === "temp" && (Number(value) < 36.1 || Number(value) > 37.5)) {
//       setErrors((prev) => ({ ...prev, [name]: "Body temperature must be between 36.1°C and 37.5°C for blood donation. " }))
//       notify("Body temperature must be between 36.1°C and 37.5°C for blood donation.", "error")
//       return
//     } else if (name === "pulse" && (Number(value) > 100 || Number(value) < 60)) {

//       setErrors((prev) => ({ ...prev, [name]: "Pulse must be between 60–100 bpm for blood donation." }))
//       notify("Pulse must be between 60–100 bpm for blood donation.", "error")
//       return
//     }


//   }

//   const theadPatientDetail = [
//     { width: "50%", name: t("Question") },
//     { width: "25%", name: t("Response") },
//     { width: "25%", name: t("Remarks") },
//   ];

//   const handleAddCity = async (data) => {
//     debugger
//     const Payload = {
//       CityName: data?.newCity,
//       CountryID: values?.country?.value,
//     };
//     try {
//       const Response = await saveDonorCity(Payload);
//       if (Response?.success) {
//         notify(Response?.message, "success");
//         setHandleModelData((val) => ({ ...val, isOpen: false }));
//       } else {
//         notify(Response?.message, "error");
//       }
//     } catch (error) {
//       notify("Error saving reason", "error");
//     }
//   };

//   const handleChangeRejectModel = (data) => {
//     setModalData(data);
//   };

//   const selectDonner = (data) => {
//     console.log("first", data)
//     setHandleModelData((val) => ({ ...val, isOpen: false }));
//     setValues(() => ({
//       PFirstName: data?.Dfirstname,
//       Title: data?.Title,
//       // Title: {},
//       lastname: data?.Dlastname,
//       gender: data?.Gender,
//       // gender: { value: "Male", label: "Male" },
//       type: { value: "0", label: "Select" },
//       kinName: data?.Kin_Name,
//       dob: data?.DOB,
//       Organisation: "",
//       IPDNO: "",
//       age: "",
//       relation: data?.Relation,
//       // relation: { value: "Self", label: "Self" },
//       bloodGroup: data?.BloodGroup,
//       Address: data?.Address,
//       country: "",
//       city: cit,
//       email: "",
//       howOften: { value: "0", label: "Select" },
//       bp: "",
//       weight: "",
//       temp: "",
//       pulse: "",
//       height: "",
//       Hemoglobin: { value: "0" },
//       GPE: "",
//       Fit: {},
//       platenletCount: "",
//       phlebotomySide: { value: "0" },
//       bagType: { value: "0" },
//       Quantity: { value: "0" },
//       remark: "",
//       questionRemarks: "",
//       questionInput: "",
//       contactNo: data?.phoneNo,
//       NextExpeDate: new Date()
//     }))
//   }
//   const handleDonorEstablished = async (data) => {
//     console.log("datadata", data)
//     debugger
//     const Payload =

//     {
//       "visitorID": String(data?.VisitorId ?? ""),
//       "name": String(data?.name ?? ""),
//       "contactNo": String(data?.contactNo ?? ""),
//       "address": String(data?.address ?? ""),
//       "dateOfBirth": data?.DOB ? moment(data?.DOB).format("YYYY-MM-DD") : "",
//       "relative": String(data?.Relative?.value ?? ""),
//       "fromDate": moment(data?.fromDate).format("YYYY-MM-DD"),
//       "toDate": moment(data?.toDate).format("YYYY-MM-DD"),
//     }

//     // {
//     //   "visitorID": "",
//     //   "name": "",
//     //   "contactNo": "",
//     //   "address": "",
//     //   "dateOfBirth": "",
//     //   "relative": "",
//     //   "fromDate": "2025-12-03",
//     //   "toDate": "2025-12-03"
//     // }

//     try {
//       const Response = [{"label":"Test Question 1","value":"Test Answer 1"},{"label":"Test Question 2","value":"Test Answer 2"}];
//     //   const Response = await BloodBankEstablishedDonorView(Payload);
//       // const Response = await BloodBankBindQuestions(Payload);

//       if (Response?.success) {
//         notify(Response?.message, "success");
//         setHandleModelData((val) => ({ ...val, isOpen: false }));
//       } else {
//         notify(Response?.message, "error");
//       }
//     } catch (error) {
//       notify("Error saving reason", "error");
//     }
//   };

//   // handleDonorEstablished

//   const handleEstablishedDonor = (item) => {
//     setHandleModelData({
//       label: t("Select Patient Details"),
//       buttonName: t("View"),
//       width: "80vw",
//       isOpen: true,
//       Component: (""
//         // <EstablishDonorModal
//         //   inputData={item}
//         //   handleChangeModel={handleChangeRejectModel}
//         //   selectDonner={selectDonner}
//         // />
//       ),
//       handleInsertAPI: handleDonorEstablished,
//       extrabutton: <></>,
//       footer: <></>,
//     });
//   };

//   const hanldeCreateCity = (item) => {
//     setHandleModelData({
//       label: t("Create City"),
//       buttonName: t("Save"),
//       width: "30vw",
//       isOpen: true,
//       Component: (
//         <CreateCityModal
//           inputData={item}
//           handleChangeModel={handleChangeRejectModel}
//         />
//       ),
//       handleInsertAPI: handleAddCity,
//       extrabutton: <></>,
//       // footer: <></>,
//     });
//   };

//   const setIsOpen = () => {
//     setHandleModelData((val) => ({ ...val, isOpen: false }));
//   };

//   const [questionnaireValues, setQuestionnaireValues] = useState([]);
//   useEffect(() => {
//     debugger
//     console.log("QuestionnaireData", QuestionnaireData)
//     if (QuestionnaireData?.length > 0) {
//       const initialValues = QuestionnaireData.map((q) => ({
//         questId: q?.Question_Id || "",
//         ques: q?.Questions || "",
//         type: q?.TYPE || "",
//         ans: "",
//         rdbAns: "",
//         remarks: "",
//       }));
//       setQuestionnaireValues(initialValues);
//     }
//   }, [QuestionnaireData]);

//   const handleQuestionnaireChange = (
//     index,
//     field,
//     value,
//     isCheckbox = false
//   ) => {
//     setQuestionnaireValues((prev) =>
//       prev.map((item, i) =>
//         i === index
//           ? {
//             ...item,
//             [field]: isCheckbox ? (value ? "rdbAns1" : "") : value,
//           }
//           : item
//       )
//     );
//   };

//   const handleSave = async () => {
//     debugger
//     console.log("first values", values)
//     if (!values?.PFirstName) {
//       notify("Please Fill First Name", "warn")
//       return
//     }
//     if (!values?.lastname) {
//       notify("Please Fill last Name", "warn")
//       return
//     }

//     if (!values?.dob) {
//       notify("Please Select DOB", "warn")
//       return
//     }
//     if (!values?.kinName) {
//       notify("Please Fill kin Name")
//       return
//     }
//     if (!values?.kinName) {
//       notify("Please Fill kin Name", "warn")
//       return
//     }
//     if (!values?.relation?.value) {
//       notify("Please Select Relation", "warn")
//       return
//     }
//     if (!values?.Address) {
//       notify("Please Fill Address", "warn")
//       return
//     }
//     if (!values?.contactNo) {
//       notify("Please Fill Contact No", "warn")
//       return
//     }
//     if (!values?.Fit?.value) {
//       notify("Please Select Fit", "warn")
//       return
//     }
//     const Payload = {
//       donorId: values?.donorid ?? "",
//       firstName: values?.PFirstName,
//       lastName: values?.lastname,
//       gender: values?.gender?.value,
//       kinName: values?.kinName,
//       relation: values?.relation?.value,
//       age: values?.age ?? "",
//       yrs: "",
//       title: values?.Title?.value,
//       type: values?.type?.value,
//       dob: moment(values?.dob).format("YYYY-MM-DD"),
//       ipdNo: values?.IPDNO,
//       organisation: values?.Organisation?.value,
//       bloodGroupId: values?.bloodGroup?.value,
//       address: values?.Address,
//       nationality: values?.country?.value,
//       city: values?.city?.ID,
//       phoneNo: values?.contactNo,
//       email: values?.email,
//       bDonate: values?.bagType?.value,
//       bp: values?.bp,
//       weight: values?.weight,
//       pulse: values?.pulse,
//       gpe: values?.GPE,
//       height: values?.height,
//       temp: values?.temp,
//       hemoglobin: values?.Hemoglobin?.value,
//       fit: values?.Fit?.value,
//       remark: values?.remark,
//       bagType: values?.bagType?.value,
//       quantity: values?.quantity,
//       platelets: values?.platenletCount,
//       phlebotomy: values?.phlebotomySide?.value,
//       questions: questionnaireValues,
//     };
//     try {
//       const Response = await bloodBankSaveData(Payload);
//       if (Response?.success) {
//         notify(Response?.message, "success");
//         setValues(initialData)
//         handleBindQuestions();
//       } else {
//         notify(Response?.message, "error");
//       }
//     } catch (error) {
//       notify("Error saving reason", "error");
//     }
//   };

//   // BindQuestions
//   // donorBindOrganisation

//   const [organisationData, setOrganistationData] = useState([]);
//   const [bloodBank, setBloodBank] = useState([]);

//   const handledonorBindOrganisation = async () => {
//     try {
//       const response = await donorBindOrganisation();
//       if (response.success) {
//         setOrganistationData(response?.data);
//       } else {
//         console.error(
//           "API returned success as false or invalid response:",
//           response
//         );
//         setOrganistationData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setOrganistationData([]);
//     }
//   };

//   const handledBinddonorBloodGroup = async () => {
//     try {
//       const response = await BinddonorBloodGroup();
//       if (response.success) {
//         setBloodBank(response?.data);
//       } else {
//         console.error(
//           "API returned success as false or invalid response:",
//           response
//         );
//         setBloodBank([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setBloodBank([]);
//     }
//   };

//   const handeleGetCountry = async () => {
//     try {
//       const response = await DonorGetCountry(values?.country?.value);
//       if (response?.success) {
//         setDonorCountry(response?.data);
//       }
//       else {
//         setDonorCountry([])

//       }
//     } catch (err) {
//       console.log(err);
//       setDonorCountry([])

//     }
//   }
//   const handeleGetCity = async (countryId) => {
//     debugger
//     const payload = countryId
//     // {
//     //   CountryID: countryId
//     // }
//     try {
//       const response = await DonorGetCity(payload);
//       if (response?.success) {
//         setDonorCity(response?.data);
//       }
//       else {
//         setDonorCity([])
//       }
//     } catch (err) {
//       console.log(err);
//       setDonorCity([])

//     }
//   }

//   const handleBindQuestions = async () => {
//     try {
//       const response = await BindQuestions();
//       if (response.success) {
//         console.log("the department data is", response);
//         setQuestionnaireData(response?.data);
//       } else {
//         console.error(
//           "API returned success as false or invalid response:",
//           response
//         );
//         setQuestionnaireData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setQuestionnaireData([]);
//     }
//   };
//   const handleCapitalLatter = (e) => {
//     debugger
//     // if (IsCapital === 1) {
//     let event = { ...e }
//     event.target.value = event.target.value.toUpperCase()
//     handleChange(e)
//     // } else {
//     //     handleChange(e)
//     // }
//   }
//   useEffect(() => {
//     if (CentreWiseCache?.length === 0) {
//       dispatch(CentreWiseCacheByCenterID({}));
//     }
//     handleBindQuestions();
//     handledonorBindOrganisation();
//     handledBinddonorBloodGroup();
//     handeleGetCountry();
//     handeleGetCity();
//   }, []);


//   {
//     console.log("QuestionnaireData", QuestionnaireData)
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
//         </Modal>
//       )}

//       <div className="card p-1">
//         <Heading title={t("Student Detail for Admission")} isBreadcrumb={false} />

//         <div className="row p-2">
//           {/* <Input
//             type="text"
//             className="form-control"
//             id="donorid"
//             name="donorid"
//             value={values?.donorid ? values?.donorid : ""}
//             onChange={handleChange}
//             lable={t("Donor Id")}
//             placeholder=" "
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             isUpperCase={true}
//           /> */}



//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <div className="row d-flex">

//               <Input
//                 type="text"
//                 className="form-control required-fields"
//                 id="First"
//                 name="PFirstName"
//                 value={values?.PFirstName ? values?.PFirstName : ""}
//                 // onChange={handleChange}
//                 lable={t("First_Name")}
//                 placeholder=" "
//                 respclass="col-5"
//                 isUpperCase={true}
//                 onChange={(e) => handleCapitalLatter(e)}
//               />
//               <Input
//                 type="text"
//                 onChange={(e) => handleCapitalLatter(e)}
//                 id="lastname"
//                 placeholder=" "
//                 name="lastname"
//                 className="form-control required-fields"
//                 value={values?.lastname || ""}
//                 // onChange={handleChange}
//                 lable={t("Last Name")}
//                 // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                 respclass="col-7"
//               />
//             </div>
//           </div>


//           <ReactSelect
//             placeholderName={t("Gender")}
//             id={"gender"}
//             searchable={true}
//             removeIsClearable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             handleChange={handleSelect}
//             dynamicOptions={gender_type}
//             value={`${values?.gender?.value}`}
//             name={"gender"}
//           />


//           <DatePicker
//             id="dob"
//             name="dob"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("DOB")}
//             className="custom-calendar"
//             value={values?.dob}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             // maxDate={new Date()}
//             maxDate={get18YearsOldDate()}
//           />


//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <div className="row d-flex">
//               <ReactSelect
//                 placeholderName={t("Class")}
//                 id={"class"}
//                 searchable={true}
//                 removeIsClearable={true}
//                 dynamicOptions={[
//                   { value: "1", label: "I" },
//                   { value: "2", label: "II" },
//                   { value: "3", label: "III" },
//                   { value: "4", label: "IV" },
//                   { value: "5", label: "V" },
//                   { value: "6", label: "VI" },
//                   { value: "7", label: "VII" },

//                 ]}
//                 // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                 respclass="col-6"
//                 handleChange={handleSelect}
//                 value={`${values?.class?.value}`}
//                 name={"class"}
//               />
//               <ReactSelect
//                 placeholderName={t("Section")}
//                 id={"Section"}
//                 searchable={true}
//                 removeIsClearable={true}
//                 dynamicOptions={[
//                   { value: "A", label: "A" },
//                   { value: "B", label: "B" },
//                   { value: "C", label: "C" },
//                   { value: "D", label: "D" },


//                 ]}
//                 respclass="col-6"

//                 handleChange={handleSelect}
//                 value={`${values?.Section?.value}`}
//                 name={"Section"}
//               />
//             </div>
//           </div>




//           <Input
//             className="form-control required-fields"
//             type="number"
//             placeholder=""

//             id="contactNo"
//             name="contactNo"
//             value={values?.contactNo || ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
//                 setValues({ ...values, contactNo: value });
//               }
//             }}
//             // onChange={handleChange}
//             lable={t("Contact No")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />

//           <Input
//             type="email"
//             placeholder=""
//             className="form-control"
//             id="email"
//             name="email"
//             value={values?.email || ""}
//             onChange={handleChange}
//             lable={t("Email")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />



//           <DatePicker
//             id="admissionDate"
//             name="admissionDate"
//             placeholder={VITE_DATE_FORMAT}
//             lable={t("Admission Date")}
//             className="custom-calendar"
//             value={values?.admissionDate}
//             handleChange={handleChange}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           // maxDate={new Date()}
//           />
//         </div>


//         <Heading title={t("Parent Details")} isBreadcrumb={false} />
//         {/* {console.log("asdasd",errors)} */}
//         <div className="row p-2">
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <button
//               onClick={handleEstablishedDonor}
//               className="btn btn-success w-100"
//             >
//               {t("Parent Details")}
//             </button>
//           </div>
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <div className="row d-flex">
//               <ReactSelect
//                 placeholderName={t("Title")}
//                 removeIsClearable={true}
//                 dynamicOptions={filterByTypes(
//                   CentreWiseCache,
//                   [1],
//                   ["TypeID"],
//                   "TextField",
//                   "ValueField",
//                   "Department"
//                 )}
//                 name="Title"
//                 inputId="Title"
//                 value={values?.Title}
//                 handleChange={(name, value) => {
//                   setValues((val) => ({
//                     ...val,
//                     [name]: value,
//                     Gender:
//                       value?.extraColomn !== "UnKnown" ? value?.extraColomn : "",
//                   }));
//                 }}
//                 searchable={true}
//                 respclass="col-5"
//                 requiredClassName="required-fields"
//               />
//               <Input
//                 type="text"
//                 className="form-control required-fields"
//                 id="First"
//                 name="fatherName"
//                 value={values?.fatherName ? values?.fatherName : ""}
//                 // onChange={handleChange}
//                 lable={t("Father Name")}
//                 placeholder=" "
//                 respclass="col-7"
//                 isUpperCase={true}
//                 onChange={(e) => handleCapitalLatter(e)}
//               />

//             </div>
//           </div>
//           <Input
//             className="form-control required-fields"
//             type="number"
//             placeholder=""

//             id="contactNo"
//             name="contactNo"
//             value={values?.contactNo || ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
//                 setValues({ ...values, contactNo: value });
//               }
//             }}
//             // onChange={handleChange}
//             lable={t("Contact No")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             type="email"
//             placeholder=""
//             className="form-control"
//             id="pEmail"
//             name="pEmail"
//             value={values?.pEmail || ""}
//             onChange={handleChange}
//             lable={t("Email")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//             <div className="row d-flex">
//               <ReactSelect
//                 placeholderName={t("Title")}
//                 removeIsClearable={true}
//                 dynamicOptions={filterByTypes(
//                   CentreWiseCache,
//                   [1],
//                   ["TypeID"],
//                   "TextField",
//                   "ValueField",
//                   "Department"
//                 )}
//                 name="Title"
//                 inputId="Title"
//                 value={values?.Title}
//                 handleChange={(name, value) => {
//                   setValues((val) => ({
//                     ...val,
//                     [name]: value,
//                     Gender:
//                       value?.extraColomn !== "UnKnown" ? value?.extraColomn : "",
//                   }));
//                 }}
//                 searchable={true}
//                 respclass="col-5"
//                 requiredClassName="required-fields"
//               />
//               <Input
//                 type="text"
//                 className="form-control required-fields"
//                 id="First"
//                 name="motherName"
//                 value={values?.motherName ? values?.motherName : ""}
//                 // onChange={handleChange}
//                 lable={t("Mother Name")}
//                 placeholder=" "
//                 respclass="col-7"
//                 isUpperCase={true}
//                 onChange={(e) => handleCapitalLatter(e)}
//               />

//             </div>
//           </div>
//           <Input
//             type="text"
//             className="form-control required-fields"
//             placeholder=""
//             id="Address"
//             name="Address"
//             value={values?.Address || ""}
//             onChange={handleChange}
//             lable={t("Address")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />
//           <Input
//             type="text"
//             className="form-control required-fields"
//             placeholder=""
//             id="Pincode"
//             name="Pincode"
//             value={values?.Pincode || ""}
//             onChange={handleChange}
//             lable={t("Pincode")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />

//           <ReactSelect
//             placeholderName={t("Country")}
//             id={"country"}
//             searchable={true}
//             removeIsClearable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             handleChange={handleSelect}
//             dynamicOptions={[
//               ...handleReactSelectDropDownOptions(
//                 donorCountry,
//                 "Name",
//                 "CountryID"
//               ),
//             ]}
//             value={`${values?.country?.value}`}
//             name={"country"}
//           />

//           <div className="d-flex col-xl-2 col-md-4 col-sm-4 col-12">
//             <ReactSelect
//               placeholderName={t("City")}
//               searchable={true}
//               removeIsClearable={true}
//               id="city"
//               name="city"
//               dynamicOptions={[
//                 ...handleReactSelectDropDownOptions(
//                   donorCity,
//                   "City",
//                   "ID"
//                 ),
//               ]}
//               value={values?.city?.value}
//               handleChange={handleSelect}
//               respclass="w-100"
//             />

//             <div className="box-inner ml-1">
//               <button
//                 className="btn btn-sm btn-primary"
//                 type="button"
//                 onClick={hanldeCreateCity}
//               >
//                 <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
//               </button>
//             </div>

//             {/* <button onClick={hanldeCreateCity} className="btn btn-success">
//               <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
//             </button> */}
//           </div>
//           <ReactSelect
//             placeholderName={t("Cast")}
//             id={"Cast"}
//             searchable={true}
//             removeIsClearable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             handleChange={handleSelect}
//             dynamicOptions={[
//               { label: "General", value: "General" },
//               { label: "OBC", value: "OBC" },
//               { label: "SC", value: "SC" },
//               { label: "ST", value: "ST" },
//               { label: "EWS", value: "EWS" },
//               { label: "Other", value: "Other" }
//             ]}

//             value={`${values?.Cast?.value}`}
//             name={"Cast"}
//           />
//           <ReactSelect
//             placeholderName={t("Nationality")}
//             id={"Nationality"}
//             searchable={true}
//             removeIsClearable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             handleChange={handleSelect}
//             dynamicOptions={[
//               { label: "Indian", value: "Indian" },
//               { label: "Nepalese", value: "Nepalese" },
//               { label: "Bhutanese", value: "Bhutanese" },
//               { label: "Bangladeshi", value: "Bangladeshi" },
//               { label: "Sri Lankan", value: "Sri Lankan" },
//               { label: "Afghan", value: "Afghan" },
//               { label: "Other", value: "Other" }
//             ]}

//             value={`${values?.Nationality?.value}`}
//             name={"Nationality"}
//           />
//           <ReactSelect
//             placeholderName={t("Religion")}
//             id={"Religion"}
//             searchable={true}
//             removeIsClearable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             handleChange={handleSelect}
//             dynamicOptions={[
//               { label: "Hindu", value: "Hindu" },
//               { label: "Muslim", value: "Muslim" },
//               { label: "Sikh", value: "Sikh" },
//               { label: "Christian", value: "Christian" },
//               { label: "Buddhist", value: "Buddhist" },
//               { label: "Jain", value: "Jain" },
//               { label: "Parsi", value: "Parsi" },
//               { label: "Jewish", value: "Jewish" },
//               { label: "Other", value: "Other" }
//             ]}


//             value={`${values?.Religion?.value}`}
//             name={"Religion"}
//           />

//           <div className="col-12 text-right">
//             <button
//               onClick={handleSave}
//               className="btn btn-lg btn-success"
//               type="button"
//             >
//               {t("Admission")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Classess;