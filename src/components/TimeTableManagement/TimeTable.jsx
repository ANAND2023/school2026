import React, { useEffect, useState, useMemo } from "react";
import { t } from "i18next";

import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import { notify, handleReactSelectDropDownOptions } from "../../utils/utils";

import {
  GetAllClasses,
  GetAllSubjects,
} from "../../networkServices/AcademicYear";
import { GetAllUsers } from "../../networkServices/Admin";
import {
  CreateClassTimetable,
  GetClassTimetable,
  GetPeriods,
} from "../../networkServices/School/Attendance";

/* ================= HELPER ================= */
const groupByPeriod = (data = []) => {
  return data.reduce((acc, item) => {
    const period = item.periodId;
    if (!acc[period]) acc[period] = [];
    acc[period].push(item);
    return acc;
  }, {});
};

/* ================= CARD COMPONENT ================= */
const ClassTimetableCard = ({ periodId, lectures }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header text-center fw-bold">
        Period {periodId}
      </div>

      <div className="card-body p-2">
        {lectures.map((lec, index) => (
          <div key={index} className="border rounded p-2 mb-2 bg-light">
            <div className="small">
              <strong>Subject:</strong> {lec.subjectName || lec.subjectId}
            </div>
            <div className="small">
              <strong>Teacher:</strong> {lec.teacherName || lec.teacherId}
            </div>
            <div className="small text-muted">Day: {lec.dayOfWeek}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const TimeTable = () => {
  const userData = useLocalStorage("userData", "get");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [allTimetable, setAllTimetable] = useState([]);

  const [values, setValues] = useState({
    classId: null,
    subjectId: null,
    teacherId: null,
    periodId: null,
    dayOfWeek: null,
  });

  /* ================= HANDLERS ================= */
  const handleSelect = (name, option) => {
    if (name === "periodId") {
      setValues((prev) => ({
        ...prev,
        periodId: option?.periodId || option?.value,
      }));
    } else if (name === "classId") {
      setValues((prev) => ({ ...prev, classId: option }));
      GetTimetable(option?.value);
    } else {
      setValues((prev) => ({ ...prev, [name]: option }));
    }
  };

  /* ================= API ================= */
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
      pageSize: 100,
      search: null,
      lockedOnly: false,
    };
    const res = await GetAllUsers(payload);
    if (res?.success) setTeachers(res?.data?.items || []);
  };

  const GetTimetable = async (classId) => {
    const payload = {
      orgId: userData?.OrganizationId,
      branchId: userData?.defaultCentre,
      classId,
    };
    const res = await GetClassTimetable(payload);
    if (res?.success) {
      setAllTimetable(res?.data || []);
    } else {
      setAllTimetable([]);
    }
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

    const res = await CreateClassTimetable(payload);
    if (res?.success) {
      notify("Timetable Saved", "success");
      GetTimetable(values.classId.value);
      setValues((p) => ({
        ...p,
        subjectId: null,
        teacherId: null,
        periodId: null,
      }));
    } else {
      notify(res?.message || "Failed", "error");
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
    GetAllSubjects().then((r) => r?.success && setSubjects(r.data || []));
    getAllTeachers();
    getPeriodsList();
  }, []);

  const groupedTimetable = useMemo(
    () => groupByPeriod(allTimetable),
    [allTimetable]
  );

  /* ================= UI ================= */
  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <Heading title={t("Create Class Time Table")} />

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
                "periodNo"
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

      {/* ================= TIMETABLE VIEW ================= */}
      {values.classId && (
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">
            Class Timetable
          </div>

          <div className="card-body">
            {allTimetable.length === 0 ? (
              <div className="text-center text-muted">
                No timetable found
              </div>
            ) : (
              <div className="row g-3">
                {Object.entries(groupedTimetable).map(
                  ([periodId, lectures]) => (
                    <div
                      key={periodId}
                      className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12"
                    >
                      <ClassTimetableCard
                        periodId={periodId}
                        lectures={lectures}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTable;



// import React, { useEffect, useState } from "react";
// import { t } from "i18next";

// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import Heading from "../UI/Heading";
// import ReactSelect from "../formComponent/ReactSelect";
// import { notify, handleReactSelectDropDownOptions } from "../../utils/utils";

// import { GetAllClasses, GetAllSubjects } from "../../networkServices/AcademicYear";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { CreateClassTimetable, GetClassTimetable, GetPeriods } from "../../networkServices/School/Attendance";

// const TimeTable = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [allTimetable, setAllTimetable] = useState([]);
//   console.log("allTimetable",allTimetable)
//   const [periods, setPeriods] = useState([]);

//   const [values, setValues] = useState({
//     classId: null,
//     subjectId: null,
//     teacherId: null,
//     periodId: null,
//     dayOfWeek: null,
//   });

//   /* ================= HANDLERS ================= */
//   const handleSelect = (name, option) => {
    
//     if(name === "periodId"){
//       setValues((prev) => ({
//       ...prev,
//       [name]: option?.periodId,
//     }));
//     }
//     else if (name === "classId") {
//         GetTimetable(option?.value);
//       setValues((prev) => ({
//         ...prev,
//         [name]: option,
//       }));  

//     }
//     else{
//  setValues((prev) => ({
//       ...prev,
//       [name]: option,
//     }));
//     }
   
//   };

//   /* ================= API CALLS ================= */
//   const getPeriodsList = async () => {
//     const payload = {
//       OrgId: userData?.OrganizationId,
//       BranchId: userData?.defaultCentre,
//       IsActive: 1,
//     };
//     const res = await GetPeriods(payload);
//     if (res?.success) setPeriods(res.data || []);
//   };

//   const getAllTeachers = async () => {
//     const payload = {
//       pageNumber: 1,
//       pageSize: 50,
//       search: null,
//       lockedOnly: false,
//     };
//     const res = await GetAllUsers(payload);
//     if (res?.success) setTeachers(res?.data?.items || []);
//   };
//   const GetTimetable = async (classId) => {
//     const payload = {
//   "orgId":userData?.OrganizationId,
//   "branchId":  userData?.defaultCentre,
//   "classId": classId
  
// }
//     const res = await GetClassTimetable(payload);
//     if (res?.success) setAllTimetable(res?.data?.items || []);
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (
//       !values.classId ||
//       !values.subjectId ||
//       !values.teacherId ||
//       !values.periodId ||
//       !values.dayOfWeek
//     ) {
//       notify("Please select all fields", "error");
//       return;
//     }

//     const payload = {
//       classId: values.classId.value,
//       subjectId: values.subjectId.value,
//       teacherId: values.teacherId.value,
//       periodId: values.periodId,
//       dayOfWeek: Number(values.dayOfWeek.value),
//       orgId: userData?.OrganizationId,
//       branchId: userData?.defaultCentre,
//     };

//     console.log("TIMETABLE PAYLOAD 👉", payload);

//     try {
//       const res = await CreateClassTimetable(payload);
//       if (res?.success) {
//         notify(res?.message || "Timetable Saved", "success");
//         setValues((preV)=>({
//             ...preV,
        
//           subjectId: null,
//           teacherId: null,
//           periodId: null,
        
//         }));
//       } else {
//         notify(res?.message || "Failed", "error");
//       }
//     } catch (error) {
//       notify("Something went wrong", "error");
//     }
//   };

//   /* ================= USE EFFECT ================= */
//   useEffect(() => {
//     GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
//     GetAllSubjects().then((r) => r?.success && setSubjects(r.data || []));
//     getAllTeachers();
//     getPeriodsList();
//   }, []);

//   /* ================= UI ================= */
//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//         <Heading title={t("Create Class Time Table")} isBreadcrumb={false} />

//         <div className="card-body">
//           <div className="row g-3">

//             <ReactSelect
//               name="classId"
//               placeholderName="Class"
//               dynamicOptions={handleReactSelectDropDownOptions(
//                 classes,
//                 "className",
//                 "id"
//               )}
//               value={values.classId}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />

//             <ReactSelect
//               name="dayOfWeek"
//               placeholderName="Day"
//               dynamicOptions={[
//                 { value: "1", label: "Monday" },
//                 { value: "2", label: "Tuesday" },
//                 { value: "3", label: "Wednesday" },
//                 { value: "4", label: "Thursday" },
//                 { value: "5", label: "Friday" },
//                 { value: "6", label: "Saturday" },
//               ]}
//               value={values.dayOfWeek}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />

//             <ReactSelect
//               name="periodId"
//               placeholderName="Period"
//               dynamicOptions={handleReactSelectDropDownOptions(
//                 periods,
//                 "periodNo",
//                 "periodNo"
//               )}
//               value={values.periodId}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />

//             <ReactSelect
//               name="subjectId"
//               placeholderName="Subject"
//               dynamicOptions={handleReactSelectDropDownOptions(
//                 subjects,
//                 "subjectName",
//                 "id"
//               )}
//               value={values.subjectId}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />

//             <ReactSelect
//               name="teacherId"
//               placeholderName="Teacher"
//               dynamicOptions={handleReactSelectDropDownOptions(
//                 teachers,
//                 "fullName",
//                 "id"
//               )}
//               value={values.teacherId}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />

//             <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-end">
//               <button
//                 className="btn btn-success w-100"
//                 onClick={handleSave}
//               >
//                 Save Time Table
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimeTable;

