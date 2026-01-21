import React, { useEffect, useMemo, useState } from "react";
import { t } from "i18next";

import MultiSelectComp from "../formComponent/MultiSelectComp";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

import { GetAllClasses } from "../../networkServices/AcademicYear";
import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// import { UploadStudentAttendance } from "../../networkServices/School/attendance";

import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import Tables from "../UI/customTable";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import { CreateStudentAttendance } from "../../networkServices/School/Attendance";

const StudentAttendance = () => {
  const userData = useLocalStorage("userData", "get");

  const [classes, setClasses] = useState([]);
  const [values, setValues] = useState({ class: null });

  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // attendance[studentId] = { status, remarks }
  const [attendance, setAttendance] = useState({});

  /* ───────────────────────── HANDLERS ───────────────────────── */

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };

  const initAttendance = (students) => {
    const obj = {};
    students.forEach((stu) => {
      obj[stu.code] = {
        status: 1, // 1 = Present
        remarks: ""
      };
    });
    setAttendance(obj);
  };

  const handleStudentChange = (_, studs) => {
    setSelectedStudents(studs);
    initAttendance(studs);
  };

  const handleAttendanceToggle = (stuId, checked) => {
    setAttendance((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        status: checked ? 1 : 2 // 1 = Present, 2 = Absent
      }
    }));
  };

  const handleRemarksChange = (stuId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        remarks: value
      }
    }));
  };

  /* ───────────────────────── API CALLS ───────────────────────── */

  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
  }, []);

  useEffect(() => {
    if (!values.class?.value) return;

    getadmissionlist({
      classId: values.class.value,
      page: 1,
      pageSize: 200
    }).then((res) => {
      if (res?.success) {
        setAllStudents(res.data || []);
      }
    });
  }, [values.class?.value]);

  /* ───────────────────────── BUILD PAYLOAD ───────────────────────── */

  const buildAttendancePayload = () => {
    return selectedStudents.map((stu) => ({
      studentId: stu.code,
      studentName: stu.name,
      admissionId: stu.admissionId || "",
      roleNo: stu.rollNo || "",
      classId: values.class?.value,
      periodId: 0,
      attendanceDate: new Date().toISOString(),
      status: attendance?.[stu.code]?.status ?? 1,
      remarks: attendance?.[stu.code]?.remarks || "",
      orgId: userData?.OrganizationId,
      branchId: userData?.defaultCentre
    }));
  };

  const handleSave = async () => {
    const payload = buildAttendancePayload();
    console.log("ATTENDANCE PAYLOAD 👉", payload);

    try {
      const res = await CreateStudentAttendance({
    "studentId": "STU-2026-000035",
    "studentName": "Shibu Kumar",
    "admissionId": "14475946-a52b-4138-9ae8-96a5e962d182",
    "roleNo": "2025-2026-0001",
    "classId": "6c541c5a-f9c1-4aee-a7c2-0c6e33df235a",
    "periodId": 0,
    "attendanceDate": "2026-01-21T15:13:19.838Z",
    "status": 1,
    "remarks": "",
    "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
    "branchId": "717d1044-8288-4d53-aa0f-49393a719e7b"
});
      if (res?.success) {
        notify(res.message, "success");
      } else {
        notify(res?.message || "Error saving attendance", "error");
      }
    } catch (err) {
      console.log(err);
      notify("Something went wrong", "error");
    }
  };

  /* ───────────────────────── TABLE ───────────────────────── */

  const tableHead = useMemo(
    () => [
      { name: "Student", width: "30%" },
      { name: "Present", width: "20%", className: "text-center" },
      { name: "Remarks", width: "50%" }
    ],
    []
  );

  const tableBody = useMemo(() => {
    return selectedStudents.map((stu) => ({
      Student: <span className="fw-semibold">{stu.name}</span>,

      Present: (
        <input
          type="checkbox"
          checked={attendance?.[stu.code]?.status === 1}
          onChange={(e) =>
            handleAttendanceToggle(stu.code, e.target.checked)
          }
        />
      ),

      Remarks: (
        <input
          className="form-control form-control-sm"
          placeholder="Remarks"
          value={attendance?.[stu.code]?.remarks || ""}
          onChange={(e) =>
            handleRemarksChange(stu.code, e.target.value)
          }
        />
      )
    }));
  }, [selectedStudents, attendance]);

  /* ───────────────────────── UI ───────────────────────── */

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <Heading title={t("Student Attendance")} isBreadcrumb={false} />

        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <ReactSelect
                name="class"
                placeholderName="Select Class"
                dynamicOptions={handleReactSelectDropDownOptions(
                  classes,
                  "className",
                  "id"
                )}
                handleChange={handleSelect}
                value={values.class}
              />
            </div>

            <div className="col-md-8">
              <MultiSelectComp
                placeholderName="Select Students"
                dynamicOptions={allStudents.map((s) => ({
                  name: `${s.student?.firstName || ""} ${
                    s.student?.lastName || ""
                  }`,
                  code: s.student?.studentId,
                  admissionId: s.admission?.admissionId,
                  rollNo: s.academic?.rollNumber
                }))}
                handleChange={handleStudentChange}
                value={selectedStudents}
              />
            </div>
          </div>

          {selectedStudents.length ? (
            <>
              <Tables thead={tableHead} tbody={tableBody} />

              <div className="text-end mt-3">
                <button
                  className="btn btn-success px-4"
                  onClick={handleSave}
                >
                  Save Attendance
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted py-5">
              Select class & students
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;



// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects
// } from "../../../networkServices/AcademicYear";

// import { get_created_exam, UploadStudentExamMarks } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// // import { saveMarks } from "../../../networkServices/School/marks"; // ⬅️ your save API

// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import Tables from "../../UI/customTable";
// import Heading from "../../UI/Heading";

// const StudentAttendance = () => {
//   const userData = useLocalStorage("userData", "get");
// console.log("userData",userData)
//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [values, setValues] = useState({ class: null, exam: null });

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   // marks[studentId][subjectId] = { marksObtained, isAbsent }
//   const [marks, setMarks] = useState({});
//   const [loading, setLoading] = useState(false);

//   /* ───────────────────────── MATRIX INIT ───────────────────────── */
//   const initMatrix = (students, subjects) => {
//     const matrix = {};
//     students.forEach((stu) => {
//       matrix[stu.code] = {};
//       subjects.forEach((sub) => {
//         matrix[stu.code][sub.code] = {
//           marksObtained: "",
//           isAbsent: false
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   /* ───────────────────────── HANDLERS ───────────────────────── */
//   const handleSelect = (name, option) =>
//     setValues((prev) => ({ ...prev, [name]: option }));

//   const handleSubjectChange = (_, subs) => {
//     setSelectedSubjects(subs);
//     initMatrix(selectedStudents, subs);
//   };

//   const handleStudentChange = (_, studs) => {
//     setSelectedStudents(studs);
//     initMatrix(studs, selectedSubjects);
//   };

//   const handleMarksChange = (stuId, subId, value) => {
//     setMarks((prev) => ({
//       ...prev,
//       [stuId]: {
//         ...prev[stuId],
//         [subId]: {
//           ...prev[stuId]?.[subId],
//           marksObtained: value
//         }
//       }
//     }));
//   };

//   const handleAbsentToggle = (stuId, subId, checked) => {
//     setMarks((prev) => ({
//       ...prev,
//       [stuId]: {
//         ...prev[stuId],
//         [subId]: {
//           ...prev[stuId]?.[subId],
//           isAbsent: !checked,
//           marksObtained: checked
//             ? prev[stuId]?.[subId]?.marksObtained
//             : ""
//         }
//       }
//     }));
//   };

//   const handleAbsentAll = (subId, checked) => {
//     setMarks((prev) => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach((stuId) => {
//         updated[stuId][subId] = {
//           ...updated[stuId][subId],
//           isAbsent: !checked,
//           marksObtained: checked
//             ? updated[stuId][subId].marksObtained
//             : ""
//         };
//       });
//       return updated;
//     });
//   };

//   /* ───────────────────────── TOTALS ───────────────────────── */
//   const studentTotal = (stuId) =>
//     selectedSubjects.reduce(
//       (sum, sub) =>
//         sum + Number(marks[stuId]?.[sub.code]?.marksObtained || 0),
//       0
//     );

//   /* ───────────────────────── API CALLS ───────────────────────── */
//   useEffect(() => {
//     GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
//     GetAllSubjects().then((r) => r?.success && setAllSubjects(r.data || []));
//   }, []);

//   useEffect(() => {
//     if (!values.class?.value) return;

//     setLoading(true);
//     Promise.all([
//       get_created_exam({
//         orgId: userData?.OrganizationId,
//         branchId: userData?.defaultCentre,
//         classId: values.class.value
//       }),
//       getadmissionlist({
//         classId: values.class.value,
//         page: 1,
//         pageSize: 200
//       })
//     ])
//       .then(([examRes, stuRes]) => {
//         examRes?.success && setExams(examRes.data || []);
//         stuRes?.success && setAllStudents(stuRes.data || []);
//       })
//       .finally(() => setLoading(false));
//   }, [values.class?.value]);

//   /* ───────────────────────── SAVE PAYLOAD ───────────────────────── */
//   const buildMarksPayload = () => {
//     debugger
//     const payload = [];

//     selectedStudents.forEach((stu) => {
//       selectedSubjects.forEach((sub) => {
//         const cell = marks?.[stu.code]?.[sub.code];

//         payload.push({
//           examId: values.exam?.value,
//           classId: values.class?.value,
//           subjectId: sub.code,
//           studentId: stu.code,
//           admissionId: stu.admissionId || "",
//           rollNo: stu.rollNo || "",
//           studentName: stu.name,
//           marksObtained: cell?.isAbsent ? 0 : Number(cell?.marksObtained || 20),
//           maxMarks: sub.maxMarks || 100,
//           isAbsent: cell?.isAbsent ?? false,
//           orgId: userData?.OrganizationId,
//           orgName: userData?.OrganizationName??"Digital Vidhaya Sarthi Organization",
//           branchId: userData?.defaultCentre,
//           branchName: userData?.defaultCenterName
//         });
//       });
//     });

//     return payload;
//   };

//   const handleSave = async() => {
    
//     const payload = buildMarksPayload();
//     console.log("SAVE MARKS PAYLOAD 👉", payload);
// try {
//     const response =await UploadStudentExamMarks(payload)
//     if(response?.success){
//         notify(response?.message,"success")
//     }
//     else{
//         notify(response?.message || response?.data?.message,"error")
//     }
// } catch (error) {
//     console.log("error",error)
// }
//     // saveMarks(payload).then(...)
//   };

//   /* ───────────────────────── TABLE HEAD ───────────────────────── */
//   const tableHead = useMemo(() => {
//     return [
//       { name: t("Student"), width: "20%" },
//       ...selectedSubjects.map((sub) => ({
//         name: (
//           <div className="text-center">
//             <div className="fw-semibold">{sub.name}</div>
//             <div className="form-check form-switch d-flex justify-content-center mt-1">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 onChange={(e) =>
//                   handleAbsentAll(sub.code, e.target.checked)
//                 }
//               />
//             </div>
//           </div>
//         ),
//         width: `${60 / selectedSubjects.length}%`
//       })),
//       { name: t("Total"), width: "10%", className: "text-center" }
//     ];
//   }, [selectedSubjects]);

//   /* ───────────────────────── TABLE BODY ───────────────────────── */
//   const tableBody = useMemo(() => {
//     return selectedStudents.map((stu) => {
//       const row = {
//         Student: <span className="fw-semibold">{stu.name}</span>
//       };

//       selectedSubjects.forEach((sub) => {
//         const cell = marks[stu.code]?.[sub.code] || {};
//         row[sub.name] = (
//           <div className="d-flex align-items-center justify-content-center gap-2"
       
//           >
//             <div
//             //  className="form-check form-switch m-0"
//              >
//               <input
//                 // className="form-check-input"
//                 type="checkbox"
//                 checked={!cell.isAbsent}
//                 onChange={(e) =>
//                   handleAbsentToggle(stu.code, sub.code, e.target.checked)
//                 }
//               />
//             </div>

//             <input
//               type="number"
//               className="form-control form-control-sm text-center"
//               style={{ width: "80px" }}
//               disabled={cell.isAbsent}
//               value={cell.marksObtained}
//               onChange={(e) =>
//                 handleMarksChange(stu.code, sub.code, e.target.value)
//               }
//               placeholder="0"
//             />
//           </div>
//         );
//       });

//       row.Total = (
//         <span className="fw-bold text-success">
//           {studentTotal(stu.code)}
//         </span>
//       );

//       return row;
//     });
//   }, [selectedStudents, selectedSubjects, marks]);


//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//          <Heading title={t("Marks Upload")} isBreadcrumb={false}/>
//         <div className="card-body">
//           {/* Filters */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-3">
//               <ReactSelect
//                 name="class"
//                 placeholderName="Select Class"
//                 dynamicOptions={handleReactSelectDropDownOptions(
//                   classes,
//                   "className",
//                   "id"
//                 )}
//                 handleChange={handleSelect}
//                 value={values.class}
//               />
//             </div>

//             <div className="col-md-3">
//               <ReactSelect
//                 name="exam"
//                 placeholderName="Select Exam"
//                 dynamicOptions={handleReactSelectDropDownOptions(
//                   exams,
//                   "examName",
//                   "id"
//                 )}
//                 handleChange={handleSelect}
//                 value={values.exam}
//               />
//             </div>

//             <div className="col-md-3">
//               <MultiSelectComp
//                 placeholderName="Select Subjects"
//                 dynamicOptions={allSubjects.map((s) => ({
//                   name: s.subjectName,
//                   code: s.id
//                 }))}
//                 handleChange={handleSubjectChange}
//                 value={selectedSubjects}
//               />
//             </div>

//             <div className="col-md-3">
//               <MultiSelectComp
//                 placeholderName="Select Students"
//                 dynamicOptions={allStudents.map((s) => ({
//                   name: `${s.student?.firstName || ""} ${
//                     s.student?.lastName || ""
//                   }`,
//                 //   code: s.student?.studentMasterId,
//                   code: s.student?.studentId,
//                   admissionId: s.admission?.admissionId,
//                   rollNo: s.academic?.rollNumber
//                 }))}
//                 handleChange={handleStudentChange}
//                 value={selectedStudents}
//               />
//             </div>
//           </div>

//           {selectedStudents.length && selectedSubjects.length ? (
//             <>
//               <Tables thead={tableHead} tbody={tableBody} />

//               <div className="text-end mt-3">
//                 <button
//                   className="btn btn-success px-4"
//                   onClick={handleSave}
//                 >
//                   Save Marks
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-muted py-5">
//               Select class, exam, subjects & students
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAttendance;
