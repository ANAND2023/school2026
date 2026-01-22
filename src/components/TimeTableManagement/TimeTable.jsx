import React, { useEffect, useState } from "react";
import { t } from "i18next";

import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import { notify, handleReactSelectDropDownOptions } from "../../utils/utils";

import { GetAllClasses, GetAllSubjects } from "../../networkServices/AcademicYear";
import { GetAllUsers } from "../../networkServices/Admin";
import { CreateClassTimetable, GetClassTimetable, GetPeriods } from "../../networkServices/School/Attendance";

const TimeTable = () => {
  const userData = useLocalStorage("userData", "get");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allTimetable, setAllTimetable] = useState([]);
  console.log("allTimetable",allTimetable)
  const [periods, setPeriods] = useState([]);

  const [values, setValues] = useState({
    classId: null,
    subjectId: null,
    teacherId: null,
    periodId: null,
    dayOfWeek: null,
  });

  /* ================= HANDLERS ================= */
  const handleSelect = (name, option) => {
    
    if(name === "periodId"){
      setValues((prev) => ({
      ...prev,
      [name]: option?.periodId,
    }));
    }
    else if (name === "classId") {
        GetTimetable(option?.value);
      setValues((prev) => ({
        ...prev,
        [name]: option,
      }));  

    }
    else{
 setValues((prev) => ({
      ...prev,
      [name]: option,
    }));
    }
   
  };

  /* ================= API CALLS ================= */
  const getPeriodsList = async () => {
    const payload = {
      OrgId: userData?.OrganizationId,
      BranchId: userData?.defaultCentre,
      IsActive: 1,
    };
    const res = await GetPeriods(payload);
    if (res?.success) setPeriods(res.data || []);
  };

  const getAllTeachers = async () => {
    const payload = {
      pageNumber: 1,
      pageSize: 50,
      search: null,
      lockedOnly: false,
    };
    const res = await GetAllUsers(payload);
    if (res?.success) setTeachers(res?.data?.items || []);
  };
  const GetTimetable = async (classId) => {
    const payload = {
  "orgId":userData?.OrganizationId,
  "branchId":  userData?.defaultCentre,
  "classId": classId
  
}
    const res = await GetClassTimetable(payload);
    if (res?.success) setAllTimetable(res?.data?.items || []);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (
      !values.classId ||
      !values.subjectId ||
      !values.teacherId ||
      !values.periodId ||
      !values.dayOfWeek
    ) {
      notify("Please select all fields", "error");
      return;
    }

    const payload = {
      classId: values.classId.value,
      subjectId: values.subjectId.value,
      teacherId: values.teacherId.value,
      periodId: values.periodId,
      dayOfWeek: Number(values.dayOfWeek.value),
      orgId: userData?.OrganizationId,
      branchId: userData?.defaultCentre,
    };

    console.log("TIMETABLE PAYLOAD 👉", payload);

    try {
      const res = await CreateClassTimetable(payload);
      if (res?.success) {
        notify(res?.message || "Timetable Saved", "success");
        setValues((preV)=>({
            ...preV,
        
          subjectId: null,
          teacherId: null,
          periodId: null,
        
        }));
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
    GetAllSubjects().then((r) => r?.success && setSubjects(r.data || []));
    getAllTeachers();
    getPeriodsList();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <Heading title={t("Create Class Time Table")} isBreadcrumb={false} />

        <div className="card-body">
          <div className="row g-3">

            <ReactSelect
              name="classId"
              placeholderName="Class"
              dynamicOptions={handleReactSelectDropDownOptions(
                classes,
                "className",
                "id"
              )}
              value={values.classId}
              handleChange={handleSelect}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              name="dayOfWeek"
              placeholderName="Day"
              dynamicOptions={[
                { value: "1", label: "Monday" },
                { value: "2", label: "Tuesday" },
                { value: "3", label: "Wednesday" },
                { value: "4", label: "Thursday" },
                { value: "5", label: "Friday" },
                { value: "6", label: "Saturday" },
              ]}
              value={values.dayOfWeek}
              handleChange={handleSelect}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              name="periodId"
              placeholderName="Period"
              dynamicOptions={handleReactSelectDropDownOptions(
                periods,
                "periodNo",
                "id"
              )}
              value={values.periodId}
              handleChange={handleSelect}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              name="subjectId"
              placeholderName="Subject"
              dynamicOptions={handleReactSelectDropDownOptions(
                subjects,
                "subjectName",
                "id"
              )}
              value={values.subjectId}
              handleChange={handleSelect}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              name="teacherId"
              placeholderName="Teacher"
              dynamicOptions={handleReactSelectDropDownOptions(
                teachers,
                "fullName",
                "id"
              )}
              value={values.teacherId}
              handleChange={handleSelect}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-end">
              <button
                className="btn btn-success w-100"
                onClick={handleSave}
              >
                Save Time Table
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;


// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";
// import MultiSelectComp from "../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

// import {
//     GetAllClasses,
//     GetAllSubjects
// } from "../../networkServices/AcademicYear";

// import { get_created_exam, UploadStudentExamMarks } from "../../networkServices/School/exam";
// import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// // import { saveMarks } from "../../networkServices/School/marks"; // ⬅️ your save API

// import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
// import Tables from "../UI/customTable";
// import Heading from "../UI/Heading";
// import ReactSelect from "../formComponent/ReactSelect";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { CreateClassTimetable, GetPeriods } from "../../networkServices/School/Attendance";

// const TimeTable = () => {
//     const userData = useLocalStorage("userData", "get");
//     const [classes, setClasses] = useState([]);
//     const [values, setValues] = useState({
//          class: {
//              label: "Select Class",
//              value: null
//          },
//         Period: {
//             label: "Select Period",
//             value: null
//         },
//         Subjects:{
//             label: "Select Subject",
//             value: null
//         },
//         Teacher:{
//             label: "Select Teacher",
//             value: null
//         },
//         dayOfWeek: {
//             label: "Select Day",
//             value: null
//         },
// });
//     const [allUser, setAllUser] = useState([]);
//     const [allSubjects, setAllSubjects] = useState([]);
//     const [periods, setPeriods] = useState([]);
//     const GetPeriodsList = async () => {
//         const payload = {

//             OrgId: userData?.OrganizationId,
//             BranchId: userData?.defaultCentre,
//             IsActive: 1
//         };
//         try {
//             const response = await GetPeriods(payload);
//             if (response.success) {
//                 setPeriods(response.data);
//             }
//         } catch (error) {
//             console.log("error", error)
//         }
//     }
//     const getAllUsers = async () => {


//         const payload = {
//             "pageNumber": 1,
//             "pageSize": 30,
//             "search": null,
//             "lockedOnly": false
//         }

//         try {
//             const res = await GetAllUsers(payload);

//             // 🔴 demo purpose (remove this block when API ready)
//             //   const res = { success: true };

//             if (res?.success) {
//                 notify(res?.message, "success");
//                 setAllUser(res?.data?.items || []);
//                 // setValues(initialData);
//             } else {
//                 notify(res?.message || "Failed", "error");
//             }
//         } catch (error) {
//             notify("Something went wrong", "error");
//         }
//     };
//     /* ───────────────────────── HANDLERS ───────────────────────── */
//     const handleSelect = (name, option) =>{
//         setValues((prev) => ({ ...prev, [name]: option }));

// }


//     useEffect(() => {
//         GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
//         GetAllSubjects().then((r) => r?.success && setAllSubjects(r.data || []));
//         getAllUsers()
//         GetPeriodsList()
//     }, []);

  

 
//     const handleSave = async () => {
// debugger
//         const payload = {
//   "classId": values.class.value,
//   "subjectId": values.Subjects.value,
//   "teacherId":  values.Teacher.value,
//   "periodId":   (values.Period.value),
//   "dayOfWeek": Number(values?.dayOfWeek?.value),
//   "orgId":userData?.OrganizationId,
//   "branchId": userData?.defaultCentre,
// }
//         console.log("SAVE MARKS PAYLOAD 👉", payload);
//         try {
//             const response = await CreateClassTimetable(payload)
//             if (response?.success) {
//                 notify(response?.message, "success")
//             }
//             else {
//                 notify(response?.message || response?.data?.message, "error")
//             }
//         } catch (error) {
//             console.log("error", error)
//         }
    
//     };


//     return (
//         <div className="container-fluid py-4">
//             <div className="card shadow-sm">
//                 <Heading title={t("Marks Upload")} isBreadcrumb={false} />
//                 <div className="card-body">
                  
//                     <div className="row g-3 mb-4">
                       
//                         <ReactSelect
//                             name="class"
//                             placeholderName="Class"
//                             dynamicOptions={handleReactSelectDropDownOptions(
//                                 classes,
//                                 "className",
//                                 "id"
//                             )}
//                             handleChange={handleSelect}
//                             value={values.class}
//                             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                         />
//                           <ReactSelect
//                                             name="dayOfWeek"
//                                             placeholderName="dayOfWeek"
//                                             // dynamicOptions={allUser}
//                                             dynamicOptions={[
//                                               { value: "0", label: "Sunday" },
//                                               { value: "1", label: "Monday" },
//                                               { value: "2", label: "Tuesday" },
//                                               { value: "3", label: "Wednesday" },
//                                               { value: "4", label: "Thursday" },
//                                               { value: "5", label: "Friday" },
//                                               { value: "6", label: "Saturday" },
//                                             ]}
//                                             respclass="col-xl-3 col-md-4 col-sm-6 col-12"
//                                             handleChange={handleSelect}
//                                             value={values.dayOfWeek}
//                                           />
//                         <ReactSelect
//                             name="Period"
//                             placeholderName="Period"
//                             dynamicOptions={handleReactSelectDropDownOptions(
//                                 periods,
//                                 "periodNo",
//                                 "id"
//                             )}
//                             handleChange={handleSelect}
//                             value={values.Period}
//                             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                         />
//                         {/* </div> */}

//                         {/* <div className="col-md-3"> */}
//                         <ReactSelect
//                             name="Subjects"
//                             placeholderName="Subject"
//                             dynamicOptions={handleReactSelectDropDownOptions(
//                                 allSubjects,
//                                 "subjectName",
//                                 "id"
//                             )}
//                             handleChange={handleSelect}
//                             value={values.Subjects}
//                             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//                         />
//                         {/* </div> */}
//                         <ReactSelect
//                             name="Teacher"
//                             placeholderName="Teacher"
//                             // dynamicOptions={allUser}
//                             dynamicOptions={handleReactSelectDropDownOptions(allUser, "fullName", "id")}
//                             respclass="col-xl-2 col-md-6 col-sm-12"
//                             handleChange={handleSelect}
//                             value={values.Teacher}
//                         />
//                         <div className="col-xl-2 col-md-6 col-sm-12">
//                             <button
//                                 className="btn btn-success px-4"
//                                 onClick={handleSave}
//                             >
//                                 Save Time Table
//                             </button>
//                         </div>
//                     </div>

                  
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimeTable;
