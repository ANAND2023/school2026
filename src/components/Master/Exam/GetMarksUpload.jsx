import React, { useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

import {
  GetAllClasses,
  GetAllSubjects
} from "../../../networkServices/AcademicYear";

import { get_created_exam, GetStudentExamMarks, UploadStudentExamMarks } from "../../../networkServices/School/exam";
import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { saveMarks } from "../../../networkServices/School/marks"; // ⬅️ your save API

import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";

const GetMarksUpload = () => {
  const userData = useLocalStorage("userData", "get");
console.log("userData",userData)
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [values, setValues] = useState({ class: null, exam: null });

  const [allSubjects, setAllSubjects] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [tableData, setTableData] = useState([]);

  // marks[studentId][subjectId] = { marksObtained, isAbsent }
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  /* ───────────────────────── MATRIX INIT ───────────────────────── */
  const initMatrix = (students, subjects) => {
    const matrix = {};
    students.forEach((stu) => {
      matrix[stu.code] = {};
      subjects.forEach((sub) => {
        matrix[stu.code][sub.code] = {
          marksObtained: "",
          isAbsent: false
        };
      });
    });
    setMarks(matrix);
  };

  /* ───────────────────────── HANDLERS ───────────────────────── */
  const handleSelect = (name, option) =>
    setValues((prev) => ({ ...prev, [name]: option }));

  const handleSubjectChange = (_, subs) => {
    setSelectedSubjects(subs);
    initMatrix(selectedStudents, subs);
  };

  const handleStudentChange = (_, studs) => {
    setSelectedStudents(studs);
    initMatrix(studs, selectedSubjects);
  };

  const handleMarksChange = (stuId, subId, value) => {
    setMarks((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        [subId]: {
          ...prev[stuId]?.[subId],
          marksObtained: value
        }
      }
    }));
  };

  const handleAbsentToggle = (stuId, subId, checked) => {
    setMarks((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        [subId]: {
          ...prev[stuId]?.[subId],
          isAbsent: !checked,
          marksObtained: checked
            ? prev[stuId]?.[subId]?.marksObtained
            : ""
        }
      }
    }));
  };

  const handleAbsentAll = (subId, checked) => {
    setMarks((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((stuId) => {
        updated[stuId][subId] = {
          ...updated[stuId][subId],
          isAbsent: !checked,
          marksObtained: checked
            ? updated[stuId][subId].marksObtained
            : ""
        };
      });
      return updated;
    });
  };

  /* ───────────────────────── TOTALS ───────────────────────── */
  const studentTotal = (stuId) =>
    selectedSubjects.reduce(
      (sum, sub) =>
        sum + Number(marks[stuId]?.[sub.code]?.marksObtained || 0),
      0
    );

  /* ───────────────────────── API CALLS ───────────────────────── */
  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
    GetAllSubjects().then((r) => r?.success && setAllSubjects(r.data || []));
  }, []);

  useEffect(() => {
    if (!values.class?.value) return;

    setLoading(true);
    Promise.all([
      get_created_exam({
        orgId: userData?.OrganizationId,
        branchId: userData?.defaultCentre,
        classId: values.class.value
      }),
      getadmissionlist({
        classId: values.class.value,
        page: 1,
        pageSize: 200
      })
    ])
      .then(([examRes, stuRes]) => {
        examRes?.success && setExams(examRes.data || []);
        stuRes?.success && setAllStudents(stuRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [values.class?.value]);

  /* ───────────────────────── SAVE PAYLOAD ───────────────────────── */
  const buildMarksPayload = () => {
    debugger
    const payload = [];

    selectedStudents.forEach((stu) => {
      selectedSubjects.forEach((sub) => {
        const cell = marks?.[stu.code]?.[sub.code];

        payload.push({
          examId: values.exam?.value,
          classId: values.class?.value,
          subjectId: sub.code,
          studentId: stu.code,
          admissionId: stu.admissionId || "",
          rollNo: stu.rollNo || "",
          studentName: stu.name,
          marksObtained: cell?.isAbsent ? 0 : Number(cell?.marksObtained || 20),
          maxMarks: sub.maxMarks || 100,
          isAbsent: cell?.isAbsent ?? false,
          orgId: userData?.OrganizationId,
          orgName: userData?.OrganizationName??"Digital Vidhaya Sarthi Organization",
          branchId: userData?.defaultCentre,
          branchName: userData?.defaultCenterName
        });
      });
    });

    return payload;
  };

  const handleSave = async() => {
    
    const payload = buildMarksPayload();
    console.log("SAVE MARKS PAYLOAD 👉", payload);
try {
    const response =await UploadStudentExamMarks(payload)
    if(response?.success){
        notify(response?.message,"success")
    }
    else{
        notify(response?.message || response?.data?.message,"error")
    }
} catch (error) {
    console.log("error",error)
}
    // saveMarks(payload).then(...)
  };
  const handleGetMarks = async() => {
    
    const payload =
    {
  "examId": values.exam?.value,
  "classId":values.class?.value,
  "subjectId": null,
  "studentId":null,
   orgId: userData?.OrganizationId,
 branchId: userData?.defaultCentre,

      
}
    // console.log("SAVE MARKS PAYLOAD 👉", payload);
try {
    const response =await GetStudentExamMarks(payload)
    if(response?.success){
        notify(response?.message,"success")
        setTableData(response?.data)
    }
    else{
        notify(response?.message || response?.data?.message,"error")
    }
} catch (error) {
    console.log("error",error)
}
    // saveMarks(payload).then(...)
  };


  const tableHead = useMemo(() => {
    return [
      { name: t("Student"), width: "20%" },
      { name: t("Roll No."), width: "20%" },
      { name: t("Grade"), width: "20%" },
      { name: t("Marks Obtained"), width: "20%" },
      { name: t("Max Marks"), width: "20%" },
      { name: t("Exam Name"), width: "20%" },
      { name: t("Class"), width: "20%" },
      { name: t("Subject"), width: "20%" },
      { name: t("Is Pass"), width: "20%" },
      // { name: ("Total"), width: "10%", className: "text-center" }
    ];
  }, [selectedSubjects]);


 const getRowClass = (item) => {
       
        if (item?.isPass === "YES") {
            return "color-indicator-24-bg";
        } 
        else {
            return "color-indicator-25-bg";
        }
    };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
         <Heading title={t("Marks Upload")} isBreadcrumb={false}/>
        <div className="card-body">
          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
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

            <div className="col-md-3">
              <ReactSelect
                name="exam"
                placeholderName="Select Exam"
                dynamicOptions={handleReactSelectDropDownOptions(
                  exams,
                  "examName",
                  "id"
                )}
                handleChange={handleSelect}
                value={values.exam}
              />
            </div>

            <div className="col-md-3">
              <MultiSelectComp
                placeholderName="Select Subjects"
                dynamicOptions={allSubjects.map((s) => ({
                  name: s.subjectName,
                  code: s.id
                }))}
                handleChange={handleSubjectChange}
                value={selectedSubjects}
              />
            </div>

            <div className="col-md-3">
              <MultiSelectComp
                placeholderName="Select Students"
                dynamicOptions={allStudents.map((s) => ({
                  name: `${s.student?.firstName || ""} ${
                    s.student?.lastName || ""
                  }`,
                //   code: s.student?.studentMasterId,
                  code: s.student?.studentId,
                  admissionId: s.admission?.admissionId,
                  rollNo: s.academic?.rollNumber
                }))}
                handleChange={handleStudentChange}
                value={selectedStudents}
              />
            </div>
            <div className="text-end">
                <button
                  className="btn btn-success px-4"
                  onClick={handleGetMarks}
                >
                 Get Marks
                </button>
              </div>
           
          </div>

         
            <>
              <Heading
                            title={t("Marks Details")}
                            // title=""
                            isBreadcrumb={false}
                            // removeSecondHeadAlignClass={true}
                            secondTitle={<>
                            <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Pass")} />
                            <ColorCodingSearch color={"color-indicator-25-bg"} label={t("Fail")} />
                                  
                            </>}
                        />
              <Tables thead={tableHead} tbody={
                tableData.map((items, index, arr) => ({
                 studentName: items?.studentName,
                 rollNo: items?.rollNo,
                 gradeName: items?.gradeName,
                 marksObtained: items?.marksObtained,
                 maxMarks: items?.maxMarks,
                 examId: "",
                 classId: "",
                 subjectId: "",
                 isPass: items?.isPass ===true? "YES":"NO",
                }))
               
              } 
               getRowClass={getRowClass}
              />

              
            </>
         
        </div>
      </div>
    </div>
  );
};

export default GetMarksUpload;



// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";

// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects
// } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import Tables from "../../UI/customTable";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

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
//           <div className="d-flex align-items-center justify-content-center gap-2">
//             {/* Checkbox LEFT */}
//             <div className="form-check form-switch m-0">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={!cell.isAbsent}
//                 onChange={(e) =>
//                   handleAbsentToggle(stu.code, sub.code, e.target.checked)
//                 }
//               />
//             </div>

//             {/* Input RIGHT */}
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

//   /* ───────────────────────── UI ───────────────────────── */
//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           {t("Marks Upload")}
//         </div>

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
//                   code: s.student?.studentId
//                 }))}
//                 handleChange={handleStudentChange}
//                 value={selectedStudents}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           {selectedStudents.length > 0 &&
//           selectedSubjects.length > 0 ? (
//             <Tables thead={tableHead} tbody={tableBody} />
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

// export default MarksUpload;



// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";

// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects
// } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import Tables from "../../UI/customTable";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

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
//         Student: (
//           <div className="d-flex align-items-center gap-2">
//             <div className="avatar bg-primary text-white">
//               {stu.name?.charAt(0) || "?"}
//             </div>
//             <span className="fw-semibold">{stu.name}</span>
//           </div>
//         )
//       };

//       selectedSubjects.forEach((sub) => {
//         const cell = marks[stu.code]?.[sub.code] || {};
//         row[sub.name] = (
//           <div className="d-flex flex-column align-items-center gap-1">
//             <input
//               type="number"
//               className="form-control form-control-sm text-center"
//               style={{ width: "80px" }}
//               disabled={cell.isAbsent}
//               value={cell.marksObtained}
//               onChange={(e) =>
//                 handleMarksChange(stu.code, sub.code, e.target.value)
//               }
//             />
//             <div className="form-check form-switch">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={!cell.isAbsent}
//                 onChange={(e) =>
//                   handleAbsentToggle(stu.code, sub.code, e.target.checked)
//                 }
//               />
//             </div>
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

//   /* ───────────────────────── UI ───────────────────────── */
//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           {t("Marks Upload")}
//         </div>

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
//                   code: s.student?.studentId
//                 }))}
//                 handleChange={handleStudentChange}
//                 value={selectedStudents}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           {selectedStudents.length > 0 &&
//           selectedSubjects.length > 0 ? (
//             <Tables thead={tableHead} tbody={tableBody} />
//           ) : (
//             <div className="text-center text-muted py-5">
//               Select class, exam, subjects & students
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .avatar {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarksUpload;



// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects,
// } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [values, setValues] = useState({ class: null, exam: null });

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   const [marks, setMarks] = useState({}); // marks[studentCode][subjectCode]

//   const [loading, setLoading] = useState(false);

//   // ─── Matrix Initialization ───────────────────────────────────────
//   const initMatrix = (students, subjects) => {
//     if (!students?.length || !subjects?.length) {
//       setMarks({});
//       return;
//     }

//     const matrix = {};
//     students.forEach((stu) => {
//       matrix[stu.code] = {};
//       subjects.forEach((sub) => {
//         matrix[stu.code][sub.code] = {
//           marksObtained: "",
//           isAbsent: false,
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   // ─── Handlers ────────────────────────────────────────────────────
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
//         [subId]: { ...prev[stuId]?.[subId], marksObtained: value },
//       },
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
//           marksObtained: checked ? prev[stuId]?.[subId]?.marksObtained : "",
//         },
//       },
//     }));
//   };

//   const handleAbsentAll = (subId, checked) => {
//     setMarks((prev) => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach((stuId) => {
//         updated[stuId][subId] = {
//           ...updated[stuId]?.[subId],
//           isAbsent: !checked,
//           marksObtained: checked ? updated[stuId]?.[subId]?.marksObtained : "",
//         };
//       });
//       return updated;
//     });
//   };

//   // ─── Totals ───────────────────────────────────────────────────────
//   const studentTotal = (stuId) =>
//     selectedSubjects.reduce(
//       (sum, sub) => sum + Number(marks[stuId]?.[sub.code]?.marksObtained || 0),
//       0
//     );

//   const subjectTotal = (subId) =>
//     selectedStudents.reduce(
//       (sum, stu) => sum + Number(marks[stu.code]?.[subId]?.marksObtained || 0),
//       0
//     );

//   // ─── Data Fetching ────────────────────────────────────────────────
//   useEffect(() => {
//     GetAllClasses()
//       .then((r) => r?.success && setClasses(r.data || []))
//       .catch(console.error);

//     GetAllSubjects()
//       .then((r) => r?.success && setAllSubjects(r.data || []))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     const classId = values.class?.value;
//     if (!classId) {
//       setExams([]);
//       setAllStudents([]);
//       return;
//     }

//     setLoading(true);

//     Promise.all([
//       get_created_exam({
//         orgId: userData?.OrganizationId,
//         branchId: userData?.defaultCentre,
//         classId,
//       }),
//       getadmissionlist({
//         classId,
//         page: 1,
//         pageSize: 200,
//       }),
//     ])
//       .then(([examRes, studentRes]) => {
//         if (examRes?.success) setExams(examRes.data || []);
//         if (studentRes?.success) setAllStudents(studentRes.data || []);
//       })
//       .catch((err) => console.error("Failed to load:", err))
//       .finally(() => setLoading(false));
//   }, [values.class?.value, userData?.OrganizationId, userData?.defaultCentre]);

//   // ─── UI ───────────────────────────────────────────────────────────
//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100">
//       <div className="card shadow border-0 rounded-4 overflow-hidden">
//         {/* Header */}
//         <div className="card-header bg-primary text-white py-4">
//           <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
//             <div className="d-flex align-items-center">
//               <div className="bg-white text-primary rounded-circle p-3 me-3 shadow">
//                 <i className="bi bi-mortarboard-fill fs-3"></i>
//               </div>
//               <div>
//                 <h2 className="mb-0 fw-bold">Marks Upload</h2>
//                 <p className="mb-0 small opacity-75">
//                   Enter student marks for selected subjects and exam
//                 </p>
//               </div>
//             </div>
//             <div className="d-flex gap-2">
//               <button className="btn btn-light px-4 rounded-pill shadow-sm">
//                 <i className="bi bi-save me-2"></i>Save Marks
//               </button>
//               <button className="btn btn-outline-light px-4 rounded-pill">
//                 <i className="bi bi-download me-2"></i>Export
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="card-body p-4 p-md-5 bg-white">
//           {loading && (
//             <div className="text-center my-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2 text-muted">Loading exams and students...</p>
//             </div>
//           )}

//           {/* Filters */}
//           <div className="card border shadow-sm mb-5 rounded-4">
//             <div className="card-body p-4">
//               <h5 className="card-title mb-4 fw-bold text-primary d-flex align-items-center">
//                 <i className="bi bi-filter-circle-fill me-2 fs-4"></i>
//                 Selection Filters
//               </h5>
//               <div className="row g-3">
//                 <div className="col-md-3">
//                   <ReactSelect
//                     name="class"
//                     placeholderName="Select Class"
//                     dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//                     handleChange={handleSelect}
//                     value={values.class}
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <ReactSelect
//                     name="exam"
//                     placeholderName="Select Exam"
//                     dynamicOptions={handleReactSelectDropDownOptions(exams, "examName", "id")}
//                     handleChange={handleSelect}
//                     value={values.exam}
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <MultiSelectComp
//                     placeholderName="Select Subjects"
//                     dynamicOptions={allSubjects.map((s) => ({
//                       name: s.subjectName,
//                       code: s.id,
//                     }))}
//                     handleChange={handleSubjectChange}
//                     value={selectedSubjects}
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <MultiSelectComp
//                     placeholderName="Select Students"
//                     dynamicOptions={allStudents.map((s) => ({
//                       name:
//                         `${s.student?.title || ""} ${s.student?.firstName || ""} ${
//                           s.student?.lastName || ""
//                         }`.trim(),
//                       code: s.student?.studentId,
//                     }))}
//                     handleChange={handleStudentChange}
//                     value={selectedStudents}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Big Grid Table */}
//           {!loading && selectedStudents.length > 0 && selectedSubjects.length > 0 ? (
//             <div className="card border-0 shadow rounded-4 overflow-hidden">
//               <div className="table-responsive" style={{ maxHeight: "65vh" }}>
//                 <table className="table table-bordered mb-0 align-middle text-center">
//                   <thead className="table-dark">
//                     <tr>
//                       <th
//                         className="sticky-left"
//                         style={{ minWidth: "220px", zIndex: 10 }}
//                       >
//                         <i className="bi bi-person-badge-fill me-2"></i>
//                         Student
//                       </th>

//                       {selectedSubjects.map((sub) => (
//                         <th key={sub.code} style={{ minWidth: "180px" }}>
//                           <div className="mb-2">{sub.name}</div>
//                           <div className="form-check form-switch d-inline-block">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id={`all-${sub.code}`}
//                               onChange={(e) => handleAbsentAll(sub.code, e.target.checked)}
//                             />
//                             <label className="form-check-label small ms-2" htmlFor={`all-${sub.code}`}>
//                               All Present
//                             </label>
//                           </div>
//                         </th>
//                       ))}

//                       <th
//                         style={{ minWidth: "120px", backgroundColor: "#fff3cd" }}
//                       >
//                         <i className="bi bi-calculator-fill me-2"></i>Total
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {selectedStudents.map((stu) => (
//                       <tr key={stu.code}>
//                         <th
//                           scope="row"
//                           className="sticky-left bg-light text-start fw-semibold"
//                           style={{ zIndex: 5 }}
//                         >
//                           <div className="d-flex align-items-center">
//                             <div
//                               className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
//                               style={{ width: "40px", height: "40px" }}
//                             >
//                               {stu.name?.charAt(0) || "?"}
//                             </div>
//                             {stu.name}
//                           </div>
//                         </th>

//                         {selectedSubjects.map((sub) => {
//                           const cell = marks[stu.code]?.[sub.code] || {};
//                           return (
//                             <td key={sub.code}>
//                               <div className="d-flex flex-column align-items-center gap-2 py-2">
//                                 <input
//                                   type="number"
//                                   className="form-control text-center"
//                                   style={{ maxWidth: "100px" }}
//                                   disabled={cell.isAbsent}
//                                   value={cell.marksObtained ?? ""}
//                                   onChange={(e) =>
//                                     handleMarksChange(stu.code, sub.code, e.target.value)
//                                   }
//                                   placeholder="0"
//                                 />
//                                 <div className="form-check form-switch">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={!cell.isAbsent}
//                                     onChange={(e) =>
//                                       handleAbsentToggle(stu.code, sub.code, e.target.checked)
//                                     }
//                                   />
//                                   <label className="form-check-label small">
//                                     {cell.isAbsent ? (
//                                       <span className="badge bg-danger">Absent</span>
//                                     ) : (
//                                       <span className="badge bg-success">Present</span>
//                                     )}
//                                   </label>
//                                 </div>
//                               </div>
//                             </td>
//                           );
//                         })}

//                         <td style={{ backgroundColor: "#fff3cd", fontWeight: "bold" }}>
//                           {studentTotal(stu.code)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>

//                   <tfoot className="table-secondary">
//                     <tr>
//                       <th className="sticky-left text-end">Subject Total →</th>
//                       {selectedSubjects.map((sub) => (
//                         <td key={sub.code} className="fw-bold">
//                           {subjectTotal(sub.code)}
//                         </td>
//                       ))}
//                       <td className="fw-bold">—</td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           ) : !loading ? (
//             <div className="text-center py-5 text-muted">
//               <i className="bi bi-clipboard-data fs-1 mb-3 d-block"></i>
//               <h5>No selection yet</h5>
//               <p>Please select class, exam, subjects and students to start entering marks.</p>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       <style jsx>{`
//         .sticky-left {
//           position: sticky;
//           left: 0;
//           z-index: 5;
//           background: inherit;
//         }
//         .table th,
//         .table td {
//           vertical-align: middle;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarksUpload;


// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects,
// } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [values, setValues] = useState({ class: null, exam: null });

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   const [marks, setMarks] = useState({});

//   const [loading, setLoading] = useState(false);

//   // ─── Matrix Initialization ───────────────────────────────────────
//   const initMatrix = (students, subjects) => {
//     if (!students?.length || !subjects?.length) return;

//     const matrix = {};
//     students.forEach((stu) => {
//       matrix[stu.code] = {};
//       subjects.forEach((sub) => {
//         matrix[stu.code][sub.code] = {
//           marksObtained: "",
//           isAbsent: false,
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   // ─── Handlers ────────────────────────────────────────────────────
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
//         [subId]: { ...prev[stuId]?.[subId], marksObtained: value },
//       },
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
//           marksObtained: checked ? prev[stuId]?.[subId]?.marksObtained : "",
//         },
//       },
//     }));
//   };

//   const handleAbsentAll = (subId, checked) => {
//     setMarks((prev) => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach((stuId) => {
//         updated[stuId][subId] = {
//           ...updated[stuId][subId],
//           isAbsent: !checked,
//           marksObtained: checked ? updated[stuId][subId]?.marksObtained : "",
//         };
//       });
//       return updated;
//     });
//   };

//   // ─── Calculations ─────────────────────────────────────────────────
//   const studentTotal = (stuId) =>
//     selectedSubjects.reduce(
//       (sum, sub) => sum + Number(marks[stuId]?.[sub.code]?.marksObtained || 0),
//       0
//     );

//   const subjectTotal = (subId) =>
//     selectedStudents.reduce(
//       (sum, stu) => sum + Number(marks[stu.code]?.[subId]?.marksObtained || 0),
//       0
//     );

//   // ─── Initial Data Load ────────────────────────────────────────────
//   useEffect(() => {
//     GetAllClasses()
//       .then((r) => r?.success && setClasses(r.data || []))
//       .catch(console.error);

//     GetAllSubjects()
//       .then((r) => r?.success && setAllSubjects(r.data || []))
//       .catch(console.error);
//   }, []);

//   // ─── Load Exams + Students when class changes ─────────────────────
//   useEffect(() => {
//     const classId = values.class?.value;

//     if (!classId) {
//       setExams([]);
//       setAllStudents([]);
//       setSelectedSubjects([]);
//       setSelectedStudents([]);
//       setMarks({});
//       return;
//     }

//     setLoading(true);

//     Promise.all([
//       get_created_exam({
//         orgId: userData?.OrganizationId,
//         branchId: userData?.defaultCentre,
//         classId,
//       }),
//       getadmissionlist({
//         classId,
//         page: 1,
//         pageSize: 200,
//       }),
//     ])
//       .then(([examRes, studentRes]) => {
//         if (examRes?.success) setExams(examRes.data || []);
//         if (studentRes?.success) setAllStudents(studentRes.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to load class data:", err);
//       })
//       .finally(() => setLoading(false));
//   }, [values.class?.value, userData?.OrganizationId, userData?.defaultCentre]);

//   // ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100">
//       <div className="card shadow border-0 rounded-4 overflow-hidden">
//         {/* Header */}
//         <div className="card-header bg-primary text-white py-4">
//           <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
//             <div className="d-flex align-items-center">
//               <div className="bg-white text-primary rounded-circle p-3 me-3 shadow">
//                 <i className="bi bi-mortarboard-fill fs-3"></i>
//               </div>
//               <div>
//                 <h2 className="mb-0 fw-bold">Marks Upload</h2>
//                 <p className="mb-0 small opacity-75">
//                   Record and manage student examination marks
//                 </p>
//               </div>
//             </div>

//             <div className="d-flex gap-2">
//               <button className="btn btn-light px-4 rounded-pill shadow-sm">
//                 <i className="bi bi-save me-2"></i>Save Marks
//               </button>
//               <button className="btn btn-outline-light px-4 rounded-pill">
//                 <i className="bi bi-download me-2"></i>Export
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="card-body p-4 p-md-5 bg-white">
//           {loading && (
//             <div className="text-center my-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2 text-muted">Loading exams and students...</p>
//             </div>
//           )}

//           {/* Stats */}
//           {!loading && selectedStudents.length > 0 && selectedSubjects.length > 0 && (
//             <div className="row g-4 mb-5">
//               <div className="col-md-4">
//                 <div className="card border-0 shadow-sm h-100 bg-primary text-white">
//                   <div className="card-body p-4">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="small mb-1 text-white-75">STUDENTS</p>
//                         <h3 className="mb-0 fw-bold">{selectedStudents.length}</h3>
//                       </div>
//                       <i className="bi bi-people-fill fs-1 opacity-75"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-4">
//                 <div className="card border-0 shadow-sm h-100 bg-success text-white">
//                   <div className="card-body p-4">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="small mb-1 text-white-75">SUBJECTS</p>
//                         <h3 className="mb-0 fw-bold">{selectedSubjects.length}</h3>
//                       </div>
//                       <i className="bi bi-book-fill fs-1 opacity-75"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-4">
//                 <div className="card border-0 shadow-sm h-100 bg-info text-white">
//                   <div className="card-body p-4">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="small mb-1 text-white-75">ENTRIES</p>
//                         <h3 className="mb-0 fw-bold">
//                           {selectedStudents.length * selectedSubjects.length}
//                         </h3>
//                       </div>
//                       <i className="bi bi-grid-3x3-gap-fill fs-1 opacity-75"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Filters */}
//           <div className="card border shadow-sm mb-5 rounded-4">
//             <div className="card-body p-4">
//               <h5 className="card-title mb-4 fw-bold text-primary d-flex align-items-center">
//                 <i className="bi bi-filter-circle-fill me-2 fs-4"></i>
//                 Selection Filters
//               </h5>

//               <div className="row g-3">
//                 <div className="col-md-3">
//                   <ReactSelect
//                     name="class"
//                     placeholderName="Select Class"
//                     dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//                     handleChange={handleSelect}
//                     value={values.class}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <ReactSelect
//                     name="exam"
//                     placeholderName="Select Exam"
//                     dynamicOptions={handleReactSelectDropDownOptions(exams, "examName", "id")}
//                     handleChange={handleSelect}
//                     value={values.exam}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <MultiSelectComp
//                     placeholderName="Select Subjects"
//                     dynamicOptions={allSubjects.map((s) => ({
//                       name: s.subjectName,
//                       code: s.id,
//                     }))}
//                     handleChange={handleSubjectChange}
//                     value={selectedSubjects}
//                   />
//                 </div>

//                 <div className="col-md-3">
//                   <MultiSelectComp
//                     placeholderName="Select Students"
//                     dynamicOptions={allStudents.map((s) => ({
//                       name:
//                         `${s.student?.title || ""} ${s.student?.firstName || ""} ${
//                           s.student?.lastName || ""
//                         }`.trim(),
//                       code: s.student?.studentId,
//                     }))}
//                     handleChange={handleStudentChange}
//                     value={selectedStudents}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Table */}
//           {!loading && selectedStudents.length > 0 && selectedSubjects.length > 0 ? (
//             <div className="card border-0 shadow rounded-4 overflow-hidden">
//               <div className="table-responsive" style={{ maxHeight: "65vh" }}>
//                 <table className="table table-hover table-bordered mb-0 align-middle">
//                   <thead className="table-dark">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="sticky-left text-nowrap"
//                         style={{ minWidth: "220px", zIndex: 10 }}
//                       >
//                         <i className="bi bi-person-badge-fill me-2"></i>
//                         Student
//                       </th>

//                       {selectedSubjects.map((sub) => (
//                         <th
//                           key={sub.code}
//                           className="text-center"
//                           style={{ minWidth: "220px" }}
//                         >
//                           <div className="mb-2">{sub.name}</div>
//                           <div className="form-check form-switch d-inline-block">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id={`all-present-${sub.code}`}
//                               onChange={(e) => handleAbsentAll(sub.code, e.target.checked)}
//                             />
//                             <label
//                               className="form-check-label small ms-2"
//                               htmlFor={`all-present-${sub.code}`}
//                             >
//                               All Present
//                             </label>
//                           </div>
//                         </th>
//                       ))}

//                       <th
//                         scope="col"
//                         className="text-center bg-warning-subtle text-dark"
//                         style={{ minWidth: "140px" }}
//                       >
//                         <i className="bi bi-calculator-fill me-2"></i>Total
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {selectedStudents.map((stu) => (
//                       <tr key={stu.code}>
//                         <th
//                           scope="row"
//                           className="sticky-left fw-semibold bg-light-subtle text-nowrap"
//                           style={{ zIndex: 5 }}
//                         >
//                           <div className="d-flex align-items-center">
//                             <div
//                               className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
//                               style={{ width: "42px", height: "42px" }}
//                             >
//                               {stu.name?.charAt(0) || "?"}
//                             </div>
//                             {stu.name}
//                           </div>
//                         </th>

//                         {selectedSubjects.map((sub) => {
//                           const cell = marks[stu.code]?.[sub.code] || {};
//                           return (
//                             <td key={sub.code} className="text-center py-3">
//                               <div className="d-flex flex-column align-items-center gap-2">
//                                 <input
//                                   type="number"
//                                   className="form-control text-center"
//                                   style={{ maxWidth: "110px" }}
//                                   disabled={cell.isAbsent}
//                                   value={cell.marksObtained ?? ""}
//                                   onChange={(e) =>
//                                     handleMarksChange(stu.code, sub.code, e.target.value)
//                                   }
//                                   placeholder="0"
//                                 />

//                                 <div className="form-check form-switch">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     id={`present-${stu.code}-${sub.code}`}
//                                     checked={!cell.isAbsent}
//                                     onChange={(e) =>
//                                       handleAbsentToggle(stu.code, sub.code, e.target.checked)
//                                     }
//                                   />
//                                   <label
//                                     className="form-check-label small"
//                                     htmlFor={`present-${stu.code}-${sub.code}`}
//                                   >
//                                     {cell.isAbsent ? (
//                                       <span className="badge bg-danger-subtle text-danger">
//                                         Absent
//                                       </span>
//                                     ) : (
//                                       <span className="badge bg-success-subtle text-success">
//                                         Present
//                                       </span>
//                                     )}
//                                   </label>
//                                 </div>
//                               </div>
//                             </td>
//                           );
//                         })}

//                         <td className="text-center fw-bold fs-5 bg-warning-subtle">
//                           {studentTotal(stu.code)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>

//                   <tfoot className="table-secondary">
//                     <tr>
//                       <th scope="row" className="sticky-left text-end">
//                         Subject Total →
//                       </th>

//                       {selectedSubjects.map((sub) => (
//                         <td key={sub.code} className="text-center fw-bold">
//                           {subjectTotal(sub.code)}
//                         </td>
//                       ))}

//                       <td className="text-center fw-bold">—</td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           ) : !loading ? (
//             <div className="text-center py-5 text-muted">
//               <i className="bi bi-clipboard-data fs-1 mb-3 d-block"></i>
//               <h5>No selection yet</h5>
//               <p className="mb-0">
//                 Please select class, exam, subjects and students to start entering marks.
//               </p>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Minimal custom styles */}
//       <style jsx>{`
//         .sticky-left {
//           position: sticky;
//           left: 0;
//           z-index: 5;
//           background: inherit;
//         }

//         .table th,
//         .table td {
//           vertical-align: middle;
//         }

//         .form-control:focus {
//           border-color: #0d6efd;
//           box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarksUpload;


// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import {
//   GetAllClasses,
//   GetAllSubjects,
// } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);

//   const [values, setValues] = useState({ class: null, exam: null });

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   /**
//    * marks[studentId][subjectId]
//    */
//   const [marks, setMarks] = useState({});

//   /* ================= INIT MATRIX ================= */

//   const initMatrix = (students, subjects) => {
//     const matrix = {};
//     students.forEach((stu) => {
//       matrix[stu.code] = {};
//       subjects.forEach((sub) => {
//         matrix[stu.code][sub.code] = {
//           marksObtained: "",
//           isAbsent: false,
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   /* ================= HANDLERS ================= */

//   const handleSelect = (name, option) =>
//     setValues((p) => ({ ...p, [name]: option }));

//   const handleSubjectChange = (_, subs) => {
//     setSelectedSubjects(subs);
//     initMatrix(selectedStudents, subs);
//   };

//   const handleStudentChange = (_, studs) => {
//     setSelectedStudents(studs);
//     initMatrix(studs, selectedSubjects);
//   };

//   const handleMarksChange = (stuId, subId, value) => {
//     setMarks((p) => ({
//       ...p,
//       [stuId]: {
//         ...p[stuId],
//         [subId]: { ...p[stuId][subId], marksObtained: value },
//       },
//     }));
//   };

//   const handleAbsentToggle = (stuId, subId, checked) => {
//     setMarks((p) => ({
//       ...p,
//       [stuId]: {
//         ...p[stuId],
//         [subId]: {
//           ...p[stuId][subId],
//           isAbsent: !checked,
//           marksObtained: checked ? p[stuId][subId].marksObtained : "",
//         },
//       },
//     }));
//   };

//   const handleAbsentAll = (subId, checked) => {
//     const updated = { ...marks };
//     Object.keys(updated).forEach((stuId) => {
//       updated[stuId][subId] = {
//         ...updated[stuId][subId],
//         isAbsent: !checked,
//         marksObtained: checked ? updated[stuId][subId].marksObtained : "",
//       };
//     });
//     setMarks(updated);
//   };

//   /* ================= TOTALS ================= */

//   const studentTotal = (stuId) =>
//     selectedSubjects.reduce(
//       (s, sub) =>
//         s + Number(marks[stuId]?.[sub.code]?.marksObtained || 0),
//       0
//     );

//   const subjectTotal = (subId) =>
//     selectedStudents.reduce(
//       (s, stu) =>
//         s + Number(marks[stu.code]?.[subId]?.marksObtained || 0),
//       0
//     );

//   /* ================= API ================= */

//   useEffect(() => {
//     GetAllClasses().then((r) => r?.success && setClasses(r.data));
//     GetAllSubjects().then((r) => r?.success && setAllSubjects(r.data));
//   }, []);

//   useEffect(() => {
//     if (values.class?.value) {
//       get_created_exam({
//         orgId: userData?.OrganizationId,
//         branchId: userData?.defaultCentre,
//         classId: values.class.value,
//       }).then((r) => r?.success && setExams(r.data));

//       getadmissionlist({
//         classId: values.class.value,
//         page: 1,
//         pageSize: 200,
//       }).then((r) => r?.success && setAllStudents(r.data));
//     }
//   }, [values.class]);

//   /* ================= UI ================= */

//   return (
//     <div className="card border">
//       <Heading title="Marks Upload" />

//       <div className="card-body">
//         {/* ===== Filters ===== */}
//         <div className="row mb-3">
//           <ReactSelect
//             respclass="col-md-3"
//             name="class"
//             placeholderName="Class"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               classes,
//               "className",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.class}
//           />

//           <ReactSelect
//             respclass="col-md-3"
//             name="exam"
//             placeholderName="Exam"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               exams,
//               "examName",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.exam}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             placeholderName="Subjects"
//             dynamicOptions={allSubjects.map((s) => ({
//               name: s.subjectName,
//               code: s.id,
//             }))}
//             handleChange={handleSubjectChange}
//             value={selectedSubjects}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             placeholderName="Students"
//             dynamicOptions={allStudents.map((s) => ({
//               name:
//                 s.student?.title +
//                 " " +
//                 s.student?.firstName +
//                 " " +
//                 s.student?.lastName,
//               code: s.student?.studentId,
//             }))}
//             handleChange={handleStudentChange}
//             value={selectedStudents}
//           />
//         </div>

//         {/* ===== TABLE ===== */}
//         {selectedStudents.length > 0 &&
//           selectedSubjects.length > 0 && (
//             <div className="table-responsive" style={{ maxHeight: "60vh" }}>
//               <table className="table table-bordered table-sm text-center">
//                 <thead className="table-light sticky-top">
//                   <tr>
//                     <th className="bg-light sticky-left">Student</th>
//                     {selectedSubjects.map((sub) => (
//                       <th key={sub.code}>
//                         {sub.name}
//                         <div>
//                           <input
//                             type="checkbox"
//                             onChange={(e) =>
//                               handleAbsentAll(sub.code, e.target.checked)
//                             }
//                           />{" "}
//                           All Present
//                         </div>
//                       </th>
//                     ))}
//                     <th className="table-warning">Total</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {selectedStudents.map((stu) => (
//                     <tr key={stu.code}>
//                       <td className="bg-light fw-bold sticky-left">
//                         {stu.name}
//                       </td>

//                       {selectedSubjects.map((sub) => {
//                         const cell =
//                           marks[stu.code]?.[sub.code];
//                         return (
//                           <td key={sub.code}>
//                             <input
//                               type="number"
//                               className="form-control form-control-sm mb-1"
//                               disabled={cell?.isAbsent}
//                               value={cell?.marksObtained}
//                               onChange={(e) =>
//                                 handleMarksChange(
//                                   stu.code,
//                                   sub.code,
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <div className="form-check form-switch d-flex justify-content-center">
//                               <input
//                                 className="form-check-input"
//                                 type="checkbox"
//                                 checked={!cell?.isAbsent}
//                                 onChange={(e) =>
//                                   handleAbsentToggle(
//                                     stu.code,
//                                     sub.code,
//                                     e.target.checked
//                                   )
//                                 }
//                               />
//                             </div>
//                           </td>
//                         );
//                       })}

//                       <td className="table-warning fw-bold">
//                         {studentTotal(stu.code)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr className="table-secondary fw-bold">
//                     <td>Total</td>
//                     {selectedSubjects.map((sub) => (
//                       <td key={sub.code}>
//                         {subjectTotal(sub.code)}
//                       </td>
//                     ))}
//                     <td>-</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default MarksUpload;



// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { notify } from "../../../utils/ustil2";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import { GetAllClasses, GetAllSubjects } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

//   /* ================= DROPDOWNS ================= */

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);

//   const [values, setValues] = useState({
//     class: null,
//     exam: null,
//   });

//   /* ================= SUBJECT / STUDENT ================= */

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   /**
//    * marks[studentId][subjectId] = {
//    *   marksObtained,
//    *   isAbsent
//    * }
//    */
//   const [marks, setMarks] = useState({});

//   /* ================= INIT MATRIX ================= */

//   const initMatrix = (students, subjects) => {
//     const matrix = {};
//     students.forEach((stu) => {
//       matrix[stu.code] = {};
//       subjects.forEach((sub) => {
//         matrix[stu.code][sub.code] = {
//           marksObtained: "",
//           isAbsent: false,
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   /* ================= HANDLERS ================= */

//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//   };

//   const handleSubjectChange = (_, subjects) => {
//     setSelectedSubjects(subjects);
//     initMatrix(selectedStudents, subjects);
//   };

//   const handleStudentChange = (_, students) => {
//     setSelectedStudents(students);
//     initMatrix(students, selectedSubjects);
//   };

//   const handleMarksChange = (studentId, subjectId, value) => {
//     setMarks((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subjectId]: {
//           ...prev[studentId][subjectId],
//           marksObtained: value,
//         },
//       },
//     }));
//   };

//   const handleAbsentToggle = (studentId, subjectId, checked) => {
//     setMarks((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subjectId]: {
//           ...prev[studentId][subjectId],
//           isAbsent: !checked,
//           marksObtained: checked
//             ? prev[studentId][subjectId].marksObtained
//             : "",
//         },
//       },
//     }));
//   };

//   /* ===== Select All Absent Per Subject ===== */
//   const handleSelectAllAbsent = (subjectId, checked) => {
//     const updated = { ...marks };
//     Object.keys(updated).forEach((studentId) => {
//       updated[studentId][subjectId] = {
//         ...updated[studentId][subjectId],
//         isAbsent: !checked,
//         marksObtained: checked
//           ? updated[studentId][subjectId].marksObtained
//           : "",
//       };
//     });
//     setMarks(updated);
//   };

//   /* ================= TOTALS ================= */

//   const getStudentTotal = (studentId) =>
//     selectedSubjects.reduce(
//       (sum, sub) =>
//         sum +
//         Number(marks[studentId]?.[sub.code]?.marksObtained || 0),
//       0
//     );

//   const getSubjectTotal = (subjectId) =>
//     selectedStudents.reduce(
//       (sum, stu) =>
//         sum +
//         Number(marks[stu.code]?.[subjectId]?.marksObtained || 0),
//       0
//     );

//   /* ================= API CALLS ================= */

//   const fetchClasses = async () => {
//     const res = await GetAllClasses();
//     if (res?.success) setClasses(res.data);
//   };

//   const fetchExams = async (classId) => {
//     const res = await get_created_exam({
//       orgId: userData?.OrganizationId,
//       branchId: userData?.defaultCentre,
//       classId,
//     });
//     if (res?.success) setExams(res.data);
//   };

//   const fetchSubjects = async () => {
//     const res = await GetAllSubjects();
//     if (res?.success) setAllSubjects(res.data);
//   };

//   const fetchStudents = async (classId) => {
//     const res = await getadmissionlist({
//       classId,
//       page: 1,
//       pageSize: 200,
//     });
//     if (res?.success) setAllStudents(res.data);
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchClasses();
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (values.class?.value) {
//       fetchExams(values.class.value);
//       fetchStudents(values.class.value);
//     }
//   }, [values.class]);

//   /* ================= UI ================= */

//   return (
//     <div className="card border">
//       <Heading title={t("Marks Upload")} />

//       <div className="card-body">
//         <div className="row">

//           <ReactSelect
//             respclass="col-md-3"
//             name="class"
//             placeholderName="Class"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               classes,
//               "className",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.class}
//           />

//           <ReactSelect
//             respclass="col-md-3"
//             name="exam"
//             placeholderName="Exam"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               exams,
//               "examName",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.exam}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             name="Subject"
//             placeholderName="Subjects"
//             dynamicOptions={allSubjects.map((s) => ({
//               name: s.subjectName,
//               code: s.id,
//             }))}
//             handleChange={handleSubjectChange}
//             value={selectedSubjects}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             name="Student"
//             placeholderName="Students"
//             dynamicOptions={allStudents.map((s) => ({
//               name:
//                 s.student?.title +
//                 " " +
//                 s.student?.firstName +
//                 " " +
//                 s.student?.lastName,
//               code: s.student?.studentId,
//             }))}
//             handleChange={handleStudentChange}
//             value={selectedStudents}
//           />
//         </div>

//         {/* ================= TABLE ================= */}

//         {selectedSubjects.length > 0 &&
//           selectedStudents.length > 0 && (
//             <div className="table-responsive mt-4">
//               <table className="table table-bordered text-center">
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     {selectedSubjects.map((sub) => (
//                       <th key={sub.code}>
//                         {sub.name}
//                         <br />
//                         <input
//                           type="checkbox"
//                           onChange={(e) =>
//                             handleSelectAllAbsent(
//                               sub.code,
//                               e.target.checked
//                             )
//                           }
//                         />{" "}
//                         Absent All
//                       </th>
//                     ))}
//                     <th>Total</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {selectedStudents.map((stu) => (
//                     <tr key={stu.code}>
//                       <td>{stu.name}</td>

//                       {selectedSubjects.map((sub) => {
//                         const cell =
//                           marks[stu.code]?.[sub.code];
//                         return (
//                           <td key={sub.code} className="row">
//                             <input
//                               type="number"
//                               className="form-control mb-1"
//                               disabled={cell?.isAbsent}
//                               value={cell?.marksObtained}
//                               onChange={(e) =>
//                                 handleMarksChange(
//                                   stu.code,
//                                   sub.code,
//                                   e.target.value
//                                 )
//                               }
//                             />
//                            <span className="row">
//                              <input
//                               type="checkbox"
//                               checked={!cell?.isAbsent}
//                               onChange={(e) =>
//                                 handleAbsentToggle(
//                                   stu.code,
//                                   sub.code,
//                                   e.target.checked
//                                 )
//                               }
//                             />{" "}
//                             Present
//                            </span>
//                           </td>
//                         );
//                       })}

//                       <td>{getStudentTotal(stu.code)}</td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr>
//                     <th>Total</th>
//                     {selectedSubjects.map((sub) => (
//                       <th key={sub.code}>
//                         {getSubjectTotal(sub.code)}
//                       </th>
//                     ))}
//                     <th>-</th>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default MarksUpload;




// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { notify } from "../../../utils/ustil2";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// import { GetAllClasses, GetAllSubjects } from "../../../networkServices/AcademicYear";
// import { get_created_exam } from "../../../networkServices/School/exam";
// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";

// const MarksUpload = () => {
//   const userData = useLocalStorage("userData", "get");

//   /* ================= DROPDOWNS ================= */

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);

//   const [values, setValues] = useState({
//     class: null,
//     exam: null,
//   });

//   /* ================= SUBJECT / STUDENT ================= */

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   /**
//    * marks[subjectId][studentId] = {
//    *   marksObtained,
//    *   isAbsent
//    * }
//    */
//   const [marks, setMarks] = useState({});

//   /* ================= INIT MATRIX ================= */

//   const initMatrix = (subjects, students) => {
//     const matrix = {};
//     subjects.forEach((sub) => {
//       matrix[sub.code] = {};
//       students.forEach((stu) => {
//         matrix[sub.code][stu.code] = {
//           marksObtained: "",
//           isAbsent: false,
//         };
//       });
//     });
//     setMarks(matrix);
//   };

//   /* ================= HANDLERS ================= */

//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//   };

//   const handleSubjectChange = (_, subjects) => {
//     setSelectedSubjects(subjects);
//     initMatrix(subjects, selectedStudents);
//   };

//   const handleStudentChange = (_, students) => {
//     setSelectedStudents(students);
//     initMatrix(selectedSubjects, students);
//   };

//   const handleMarksChange = (subjectId, studentId, value) => {
//     setMarks((prev) => ({
//       ...prev,
//       [subjectId]: {
//         ...prev[subjectId],
//         [studentId]: {
//           ...prev[subjectId][studentId],
//           marksObtained: value,
//         },
//       },
//     }));
//   };

//   const handleAbsentToggle = (subjectId, studentId, checked) => {
//     setMarks((prev) => ({
//       ...prev,
//       [subjectId]: {
//         ...prev[subjectId],
//         [studentId]: {
//           ...prev[subjectId][studentId],
//           isAbsent: !checked,
//           marksObtained: checked
//             ? prev[subjectId][studentId].marksObtained
//             : "",
//         },
//       },
//     }));
//   };

//   const handleSelectAllAbsent = (studentId, checked) => {
//     const updated = { ...marks };
//     Object.keys(updated).forEach((subjectId) => {
//       updated[subjectId][studentId] = {
//         ...updated[subjectId][studentId],
//         isAbsent: !checked,
//         marksObtained: checked
//           ? updated[subjectId][studentId].marksObtained
//           : "",
//       };
//     });
//     setMarks(updated);
//   };

//   /* ================= TOTAL ================= */

//   const getStudentTotal = (studentId) => {
//     let total = 0;
//     selectedSubjects.forEach((sub) => {
//       const entry = marks[sub.code]?.[studentId];
//       if (entry && !entry.isAbsent) {
//         total += Number(entry.marksObtained || 0);
//       }
//     });
//     return total;
//   };

//   /* ================= API CALLS ================= */

//   const fetchClasses = async () => {
//     const res = await GetAllClasses();
//     if (res?.success) setClasses(res.data);
//   };

//   const fetchExams = async (classId) => {
//     const payload = {
//       orgId: userData?.OrganizationId,
//       branchId: userData?.defaultCentre,
//       classId,
//     };

//     const res = await get_created_exam(payload);
//     if (res?.success) setExams(res.data);
//   };

//   const fetchSubjects = async () => {
//     const res = await GetAllSubjects();
//     if (res?.success) setAllSubjects(res.data);
//   };

//   const fetchStudents = async () => {
//     const res = await getadmissionlist({
//       classId: values?.class?.value,
//       page: 1,
//       pageSize: 200,
//     });
//     if (res?.success) setAllStudents(res.data);
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchClasses();
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (values.class?.value) {
//       fetchExams(values.class.value);
//       fetchStudents();
//     }
//   }, [values.class]);

//   /* ================= UI ================= */

//   return (
//     <div className="card border">
//       <Heading title={t("Marks Upload")} />

//       <div className="card-body">
//         <div className="row">

//           <ReactSelect
//             respclass="col-md-3"
//             name="class"
//             placeholderName="Class"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               classes,
//               "className",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.class}
//           />

//           <ReactSelect
//             respclass="col-md-3"
//             name="exam"
//             placeholderName="Exam"
//             dynamicOptions={handleReactSelectDropDownOptions(
//               exams,
//               "examName",
//               "id"
//             )}
//             handleChange={handleSelect}
//             value={values.exam}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             name="Subject"
//             placeholderName="Subjects"
//             dynamicOptions={allSubjects.map((s) => ({
//               name: s.subjectName,
//               code: s.id,
//             }))}
//             handleChange={handleSubjectChange}
//             value={selectedSubjects}
//           />

//           <MultiSelectComp
//             respclass="col-md-3"
//             name="Student"
//             placeholderName="Students"
//             dynamicOptions={allStudents.map((s) => ({
//               name:
//                 s.student?.title +
//                 " " +
//                 s.student?.firstName +
//                 " " +
//                 s.student?.lastName,
//               code: s.student?.studentId,
//             }))}
//             handleChange={handleStudentChange}
//             value={selectedStudents}
//           />
//         </div>

//         {/* ================= TABLE ================= */}

//         {selectedSubjects.length > 0 &&
//           selectedStudents.length > 0 && (
//             <div className="table-responsive mt-4">
//               <table className="table table-bordered text-center">
//                 <thead>
//                   <tr>
//                     <th>Subject</th>
//                     {selectedStudents.map((stu) => (
//                       <th key={stu.code}>
//                         {stu.name}
//                         <br />
//                         <input
//                           type="checkbox"
//                           onChange={(e) =>
//                             handleSelectAllAbsent(
//                               stu.code,
//                               e.target.checked
//                             )
//                           }
//                         />{" "}
//                         Absent All
//                       </th>
//                     ))}
//                     <th>Total</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {selectedSubjects.map((sub) => (
//                     <tr key={sub.code}>
//                       <td>{sub.name}</td>

//                       {selectedStudents.map((stu) => {
//                         const cell = marks[sub.code]?.[stu.code];
//                         return (
//                           <td key={stu.code}>
//                             <input
//                               type="number"
//                               className="form-control mb-1"
//                               disabled={cell?.isAbsent}
//                               value={cell?.marksObtained}
//                               onChange={(e) =>
//                                 handleMarksChange(
//                                   sub.code,
//                                   stu.code,
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <input
//                               type="checkbox"
//                               checked={!cell?.isAbsent}
//                               onChange={(e) =>
//                                 handleAbsentToggle(
//                                   sub.code,
//                                   stu.code,
//                                   e.target.checked
//                                 )
//                               }
//                             />{" "}
//                             Present
//                           </td>
//                         );
//                       })}

//                       <td>
//                         {selectedStudents.reduce(
//                           (sum, stu) =>
//                             sum +
//                             Number(
//                               marks[sub.code]?.[stu.code]
//                                 ?.marksObtained || 0
//                             ),
//                           0
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr>
//                     <th>Total</th>
//                     {selectedStudents.map((stu) => (
//                       <th key={stu.code}>
//                         {getStudentTotal(stu.code)}
//                       </th>
//                     ))}
//                     <th>-</th>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default MarksUpload;




// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import { notify } from "../../../utils/ustil2";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import { GetAllClasses, GetAllSubjects } from "../../../networkServices/AcademicYear";
// import {  create_exam, get_created_exam } from "../../../networkServices/School/exam";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import moment from "moment";

// import { getadmissionlist } from "../../../networkServices/School/RegistrationApi";

// const MarksUpload = () => {
//     const userData = useLocalStorage("userData", "get");
//     const [allSubject, setAllSubject] = useState([]);
//     const [classes, setClasses] = useState([]);

//     const [values, setValues] = useState({
//         class_Name: { label: "", value: "" },
//         allExam: { label: "", value: "" },
//         Subject: [],
//         Student: [],
//     });

//     /* ================= EXAM ROW STATE ================= */
//     const [examRows, setExamRows] = useState([]);
//     const [allExam, setAllExam] = useState([]);
//     const [allStudent, setAllStudent] = useState([]);

//     const getClass = async () => {
//         try {
//             const res = await GetAllClasses();
//             if (res?.success) setClasses(res?.data);
//             else notify(res?.message, "error");
//         } catch {
//             notify("Error fetching classes", "error");
//         }
//     };
//     const handleSelect = (name, option) => {
//         setValues((prev) => ({ ...prev, [name]: option }));
//     };

//     const handleMultiSelectChange = (name, selectedOptions) => {
//         setValues((prev) => ({ ...prev, [name]: selectedOptions }));

//         const rows = selectedOptions.map((sub) => ({
//             subjectId: sub.code,
//             subjectName: sub.name,
           
//             maxMarks: ""
//         }));

//         setExamRows(rows);
//     };

//     const handleApplyAllChange = (e) => {
//         const { name, value } = e.target;
//         setExamRows((prev) =>
//             prev.map((row) => ({
//                 ...row,
//                 [name]: value
//             }))
//         );
//     };

//     const handleRowChange = (index, name, value) => {
//         const updated = [...examRows];
//         updated[index][name] = value;
//         setExamRows(updated);
//     };

//     const handleSave = async () => {
//         if (!values.class_Name?.value || !values.branch?.value || examRows.length === 0) {
//             notify(t("Please fill all mandatory fields"), "error");
//             return;
//         }

//         const payload = [
//   {
//     "examId": "string",
//     "classId": "string",
//     "subjectId": "string",
//     "studentId": "string",
//     "admissionId": "string",
//     "rollNo": "string",
//     "studentName": "string",
//     "marksObtained": 0,
//     "maxMarks": 0,
//     "isAbsent": true,
//     "orgId": userData?.OrganizationId,
//     "orgName":userData?.OrganizationName??"Anand",
//     "branchId": userData?.defaultCentre,
//     "branchName": userData?.defaultCenterName
//   }
// ]
        
//         try {
//             const res = await create_exam(payload);
//             if (res?.success) notify("Exam timetable saved", "success");
//             else notify("Error saving exam timetable", "error");
//         } catch (err) {
//             console.error(err);
//             notify("Something went wrong", "error");
//         }
//     };

//     const getAllExam = async (term) => {
//         const payload =
//         {
//             "orgId": userData?.OrganizationId,
//             "branchId": userData?.defaultCentre,
//             "examId": "",
//             "termId": term,
//         }

//         try {
//             const res = await get_created_exam(payload);
//             if (res?.success) {
//                 setAllExam(res?.data);
//                 notify(t("Exam created successfully"), "success");

//             }
//             else notify(t("Error creating exam"), "error");
//         } catch (error) {
//             console.log("error", error)
//         }
//     };
//     const GetSubject = async () => {

//         try {
//             const response = await GetAllSubjects();
//             if (response?.success) {
//                 setAllSubject(response?.data)
//             } else {
//                 notify(response?.message, "error");
//                 setAllSubject([])
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };
//     const StudentList = async () => {
//         const payload =
//         {
//             "sessionId": null,
//             "branchId": null,
//             "classId": null,
//             "fromDate": null,
//             "toDate": null,
//             "studentId": null,
//             "admissionNo": null,
//             "rollNumber": null,
//             "firstName": null,
//             "page": 1,
//             "pageSize": 100
//         }
//         try {
//             const response = await getadmissionlist(payload);
//             if (response?.success) {
//                 setAllStudent(response?.data);
//                 notify(response?.message, "success")
//             }
//             else {
//                 notify(response?.message, "error")
//             }
//         } catch (error) {
//             console.log("error", error)
//         }
//     }
//     useEffect(() => {
//         getAllExam(values?.term?.value);
//     }, [values.term]);
//     useEffect(() => {

//         StudentList();
//         GetSubject()
//         getClass();
//     }, []);
//     return (
//         <>
//             <div className="card border">
//                 <Heading title={t("Exam Timetable")} />

//                 <div className="card-body">
//                     <div className="row">

//                         <ReactSelect
//                             placeholderName={t("Class")}
//                             name="class_Name"
//                             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                             dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//                             handleChange={handleSelect}
//                             value={values.class_Name}
//                         />
//                         <ReactSelect
//                             placeholderName={t("Exam")}
//                             searchable={true}
//                             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                             id="allExam"
//                             name="allExam"
//                             removeIsClearable={true}
//                             // dynamicOptions={classes}
//                             dynamicOptions={handleReactSelectDropDownOptions(allExam, "examName", "id")}
//                             handleChange={handleSelect}
//                             value={values?.allExam?.value}
//                         // requiredClassName="required-fields"
//                         />



//                         <MultiSelectComp
//                             respclass="col-md-4"
//                             name="Subject"
//                             placeholderName={t("Subject")}
//                             dynamicOptions={allSubject.map((s) => ({
//                                 name: s.subjectName,
//                                 code: s.id
//                             }))}
//                             handleChange={handleMultiSelectChange}
//                             value={values.Subject}
//                         />
//                         <MultiSelectComp
//                             respclass="col-md-4"
//                             name="Student"
//                             placeholderName={t("Student")}
//                             dynamicOptions={allStudent.map((s) => ({
//                                 name: s.student?.title + " " + s.student?.firstName + " " + s.student?.lastName,
//                                 code: s.student?.studentId,

//                             }))}
//                             handleChange={handleMultiSelectChange}
//                             value={values.Student}
//                         />
//                     </div>
//                     {examRows.length > 0 && (
//                         <div className="table-responsive mt-4">
//                             <table className="table table-bordered">
//                                 <thead>
//                                     <tr>
//                                         <th>Subject</th>
                                      
                                        
//                                         <th>Marks</th>
//                                     </tr>

//                                     {/* APPLY TO ALL */}
//                                     <tr className="bg-light">
//                                         <th>All</th>
                                        
                                        
//                                         <th>
//                                             <input
//                                                 type="number"
//                                                 name="passingMarks"
//                                                 className="form-control"
//                                                 onChange={handleApplyAllChange}
//                                             />
//                                         </th>
                                       
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {examRows.map((row, index) => (
//                                         <tr key={index}>
//                                             <td>{row.subjectName}</td>
                                           
                                            
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     value={row.passingMarks}
//                                                     onChange={(e) =>
//                                                         handleRowChange(index, "passingMarks", e.target.value)
//                                                     }
//                                                 />
//                                             </td>
                                            
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     <div className="mt-3">
//                         <button className="btn btn-primary btn-sm" onClick={handleSave}>
//                             {t("Upload Marks")}
//                         </button>
//                     </div>

//                 </div>
//             </div>
//         </>
//     );
// };

// export default MarksUpload;

