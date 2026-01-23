import React, { useEffect, useMemo, useState } from "react";
import { t } from "i18next";

import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { GetAllClasses } from "../../networkServices/AcademicYear";
import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
import { CreateStudentAttendance, GetPeriods } from "../../networkServices/School/Attendance";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import Tables from "../UI/customTable";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import DatePicker from "../formComponent/DatePicker";

const StudentAttendance = () => {
  const userData = useLocalStorage("userData", "get");
   const { VITE_DATE_FORMAT } = import.meta.env;
  const [classes, setClasses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [values, setValues] = useState({ class: null, periodId: null,
    date: new Date()
   });

  /* ───────────────────────── HANDLERS ───────────────────────── */

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };
     const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

  const initAttendance = (students) => {
    const obj = {};
    students.forEach((stu) => {
      obj[stu.code] = {
        status: 2, // 2 = Absent by default (unchecked)
        remarks: ""
      };
    });
    setAttendance(obj);
  };

  const handleAttendanceToggle = (stuId, checked) => {
    setAttendance((prev) => ({
      ...prev,
      [stuId]: { ...prev[stuId], status: checked ? 1 : 2 } // 1 = Present, 2 = Absent
    }));
  };

  const handleRemarksChange = (stuId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [stuId]: { ...prev[stuId], remarks: value }
    }));
  };

  const handleSelectAll = () => {
    const obj = {};
    selectedStudents.forEach((stu) => {
      obj[stu.code] = { ...attendance[stu.code], status: 1 }; // mark all Present
    });
    setAttendance(obj);
  };

  const handleDeselectAll = () => {
    const obj = {};
    selectedStudents.forEach((stu) => {
      obj[stu.code] = { ...attendance[stu.code], status: 2 }; // mark all Absent
    });
    setAttendance(obj);
  };

  /* ───────────────────────── API CALLS ───────────────────────── */

  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
    getPeriodsList();
  }, []);

  useEffect(() => {
    if (!values.class?.value) return;

    getadmissionlist({
      classId: values.class.value,
      page: 1,
      pageSize: 200
    }).then((res) => {
      if (res?.success) {
        const students =
          res.data?.map((s) => ({
            name: `${s.student?.firstName || ""} ${s.student?.lastName || ""}`,
            code: s.student?.studentId,
            admissionId: s.admission?.admissionId,
            rollNo: s.academic?.rollNumber
          })) || [];

        setAllStudents(students);
        setSelectedStudents(students); // auto bind all students
        initAttendance(students);       // init attendance (unchecked)
      }
    });
  }, [values.class?.value]);

  const getPeriodsList = async () => {
    const payload = {
      OrgId: userData?.OrganizationId,
      BranchId: userData?.defaultCentre,
      IsActive: 1
    };
    const res = await GetPeriods(payload);
    if (res?.success) setPeriods(res.data || []);
  };

  const buildAttendancePayload = () =>
    selectedStudents.map((stu) => ({
      studentId: stu.code,
      studentName: stu.name,
      admissionId: stu.admissionId || "",
      roleNo: stu.rollNo || "",
      classId: values.class?.value,
      periodId: values.periodId?.value,
      attendanceDate: values?.date.toISOString(),
    //   attendanceDate: new Date().toISOString(),
      status: attendance?.[stu.code]?.status ?? 2,
      remarks: attendance?.[stu.code]?.remarks || "",
      orgId: userData?.OrganizationId,
      branchId: userData?.defaultCentre
    }));

  const handleSave = async () => {
    const payload = buildAttendancePayload();
    console.log("ATTENDANCE PAYLOAD 👉", payload);

    try {
      const res = await CreateStudentAttendance(payload);
      if (res?.success) notify(res.message, "success"),handleDeselectAll()
      else notify(res?.message || res?.data?.message, "error");
    } catch (err) {
      console.log(err);
    //   notify("Something went wrong", "error");
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

  const tableBody = useMemo(
    () =>
      selectedStudents.map((stu) => ({
        Student: <span className="fw-semibold">{stu.name}</span>,
        Present: (
          <input
            type="checkbox"
            checked={attendance?.[stu.code]?.status === 1}
            onChange={(e) => handleAttendanceToggle(stu.code, e.target.checked)}
          />
        ),
        Remarks: (
          <input
            className="form-control form-control-sm"
            placeholder="Remarks"
            value={attendance?.[stu.code]?.remarks || ""}
            onChange={(e) => handleRemarksChange(stu.code, e.target.value)}
          />
        )
      })),
    [selectedStudents, attendance]
  );

  /* ───────────────────────── UI ───────────────────────── */

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <Heading title={t("Student Attendance")} isBreadcrumb={false} />

        <div className="card-body">
          <div className="row g-3 mb-3">
            <ReactSelect
                name="periodId"
                placeholderName="Select Period"
                dynamicOptions={handleReactSelectDropDownOptions(periods, "periodNo", "periodNo")}
                value={values.periodId}
                handleChange={handleSelect}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />
              <ReactSelect
                name="class"
                placeholderName="Select Class"
                dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
                handleChange={handleSelect}
                value={values.class}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />
          <DatePicker
                        id="date"
                        name="date"
                        placeholder={VITE_DATE_FORMAT}
                        lable={t("From cDate")}
                        className="custom-calendar"
                        value={values?.date}
                        handleChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        disable={true}
                        // maxDate={values?.toDate}
                    />

          
             
     

            {selectedStudents.length > 0 && (
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-end gap-2"
              style={{display:"flex" ,gap:"5px"}}
              >
                <button className="btn btn-primary" onClick={handleSelectAll}>
                  Select All
                </button>
                <button className="btn btn-secondary" onClick={handleDeselectAll}>
                  Deselect All
                </button>
                <div className="text-end mt-3">
                <button className="btn btn-success px-4" onClick={handleSave}>
                  Save Attendance
                </button>
              </div>
              </div>
            )}
          </div>

          {selectedStudents.length ? (
            <>
              <Tables thead={tableHead} tbody={tableBody} />

              
            </>
          ) : (
            <div className="text-center text-muted py-5">Select class to load students</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;



// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";

// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { GetAllClasses } from "../../networkServices/AcademicYear";
// import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// import { CreateStudentAttendance, GetPeriods } from "../../networkServices/School/Attendance";
// import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
// import Tables from "../UI/customTable";
// import Heading from "../UI/Heading";
// import ReactSelect from "../formComponent/ReactSelect";

// const StudentAttendance = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [periods, setPeriods] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [values, setValues] = useState({ class: null, periodId: null });

//   /* ───────────────────────── HANDLERS ───────────────────────── */

//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//   };

// const initAttendance = (students) => {
//   const obj = {};
//   students.forEach((stu) => {
//     obj[stu.code] = {
//       status: 2, // 2 = Absent by default
//       remarks: ""
//     };
//   });
//   setAttendance(obj);
// };


//   const handleAttendanceToggle = (stuId, checked) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [stuId]: { ...prev[stuId], status: checked ? 1 : 2 } // 2 = Absent
//     }));
//   };

//   const handleRemarksChange = (stuId, value) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [stuId]: { ...prev[stuId], remarks: value }
//     }));
//   };

//   /* ───────────────────────── API CALLS ───────────────────────── */

//   useEffect(() => {
//     GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
//     getPeriodsList();
//   }, []);

//   useEffect(() => {
//     if (!values.class?.value) return;

//     getadmissionlist({
//       classId: values.class.value,
//       page: 1,
//       pageSize: 200
//     }).then((res) => {
//       if (res?.success) {
//         const students =
//           res.data?.map((s) => ({
//             name: `${s.student?.firstName || ""} ${s.student?.lastName || ""}`,
//             code: s.student?.studentId,
//             admissionId: s.admission?.admissionId,
//             rollNo: s.academic?.rollNumber
//           })) || [];

//         setAllStudents(students);
//         setSelectedStudents(students); // ⭐ auto bind all students
//         initAttendance(students);       // ⭐ init attendance
//       }
//     });
//   }, [values.class?.value]);

//   const getPeriodsList = async () => {
//     const payload = {
//       OrgId: userData?.OrganizationId,
//       BranchId: userData?.defaultCentre,
//       IsActive: 1
//     };
//     const res = await GetPeriods(payload);
//     if (res?.success) setPeriods(res.data || []);
//   };

//   const buildAttendancePayload = () =>
//     selectedStudents.map((stu) => ({
//       studentId: stu.code,
//       studentName: stu.name,
//       admissionId: stu.admissionId || "",
//       roleNo: stu.rollNo || "",
//       classId: values.class?.value,
//       periodId: values.periodId?.value,
//       attendanceDate: new Date().toISOString(),
//       status: attendance?.[stu.code]?.status ?? 1,
//       remarks: attendance?.[stu.code]?.remarks || "",
//       orgId: userData?.OrganizationId,
//       branchId: userData?.defaultCentre
//     }));

//   const handleSave = async () => {
//     const payload = buildAttendancePayload();
//     console.log("ATTENDANCE PAYLOAD 👉", payload);

//     try {
//       const res = await CreateStudentAttendance(payload);
//       if (res?.success) notify(res.message, "success");
//       else notify(res?.message || "Error saving attendance", "error");
//     } catch (err) {
//       console.log(err);
//       notify("Something went wrong", "error");
//     }
//   };

//   /* ───────────────────────── TABLE ───────────────────────── */

//   const tableHead = useMemo(
//     () => [
//       { name: "Student", width: "30%" },
//       { name: "Present", width: "20%", className: "text-center" },
//       { name: "Remarks", width: "50%" }
//     ],
//     []
//   );

//   const tableBody = useMemo(
//     () =>
//       selectedStudents.map((stu) => ({
//         Student: <span className="fw-semibold">{stu.name}</span>,
//         Present: (
//         //   <input
//         //     type="checkbox"
//         //     checked={attendance?.[stu.code]?.status === 1}
//         //     onChange={(e) => handleAttendanceToggle(stu.code, e.target.checked)}
//         //   />
//         <input
//   type="checkbox"
//   checked={attendance?.[stu.code]?.status === 1} // 1 = Present
//   onChange={(e) => handleAttendanceToggle(stu.code, e.target.checked)}
// />

//         ),
//         Remarks: (
//           <input
//             className="form-control form-control-sm"
//             placeholder="Remarks"
//             value={attendance?.[stu.code]?.remarks || ""}
//             onChange={(e) => handleRemarksChange(stu.code, e.target.value)}
//           />
//         )
//       })),
//     [selectedStudents, attendance]
//   );

//   /* ───────────────────────── UI ───────────────────────── */

//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//         <Heading title={t("Student Attendance")} isBreadcrumb={false} />

//         <div className="card-body">
//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
//               <ReactSelect
//                 name="class"
//                 placeholderName="Select Class"
//                 dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//                 handleChange={handleSelect}
//                 value={values.class}
//               />
//             </div>

//             <div className="col-md-4">
//               <ReactSelect
//                 name="periodId"
//                 placeholderName="Select Period"
//                 dynamicOptions={handleReactSelectDropDownOptions(periods, "periodNo", "id")}
//                 value={values.periodId}
//                 handleChange={handleSelect}
//               />
//             </div>
//           </div>

//           {selectedStudents.length ? (
//             <>
//               <Tables thead={tableHead} tbody={tableBody} />

//               <div className="text-end mt-3">
//                 <button className="btn btn-success px-4" onClick={handleSave}>
//                   Save Attendance
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-muted py-5">Select class to load students</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAttendance;



// import React, { useEffect, useMemo, useState } from "react";
// import { t } from "i18next";

// import MultiSelectComp from "../formComponent/MultiSelectComp";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

// import { GetAllClasses } from "../../networkServices/AcademicYear";
// import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// // import { UploadStudentAttendance } from "../../networkServices/School/attendance";

// import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
// import Tables from "../UI/customTable";
// import Heading from "../UI/Heading";
// import ReactSelect from "../formComponent/ReactSelect";
// import { CreateStudentAttendance, GetPeriods } from "../../networkServices/School/Attendance";

// const StudentAttendance = () => {
//   const userData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [values, setValues] = useState({ class: null ,periodId:null});
//  const [periods, setPeriods] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   // attendance[studentId] = { status, remarks }
//   const [attendance, setAttendance] = useState({});

//   /* ───────────────────────── HANDLERS ───────────────────────── */

//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//      if(name === "periodId"){
//       setValues((prev) => ({
//       ...prev,
//       [name]: option?.periodId,
//     }));
//     }
//   };

//   const initAttendance = (students) => {
//     const obj = {};
//     students.forEach((stu) => {
//       obj[stu.code] = {
//         status: 1, // 1 = Present
//         remarks: ""
//       };
//     });
//     setAttendance(obj);
//   };

//   const handleStudentChange = (_, studs) => {
//     setSelectedStudents(studs);
//     initAttendance(studs);
//   };

//   const handleAttendanceToggle = (stuId, checked) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [stuId]: {
//         ...prev[stuId],
//         status: checked ? 1 : 2 // 1 = Present, 2 = Absent
//       }
//     }));
//   };

//   const handleRemarksChange = (stuId, value) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [stuId]: {
//         ...prev[stuId],
//         remarks: value
//       }
//     }));
//   };

//   /* ───────────────────────── API CALLS ───────────────────────── */

//   useEffect(() => {
//     GetAllClasses().then((r) => r?.success && setClasses(r.data || []));
//     getPeriodsList()
//   }, []);

//   useEffect(() => {
//     if (!values.class?.value) return;

//     getadmissionlist({
//       classId: values.class.value,
//       page: 1,
//       pageSize: 200
//     }).then((res) => {
//       if (res?.success) {
//         setAllStudents(res.data || []);
//       }
//     });
//   }, [values.class?.value]);

//   /* ───────────────────────── BUILD PAYLOAD ───────────────────────── */
//   const getPeriodsList = async () => {
//     const payload = {
//       OrgId: userData?.OrganizationId,
//       BranchId: userData?.defaultCentre,
//       IsActive: 1,
//     };
//     const res = await GetPeriods(payload);
//     if (res?.success) setPeriods(res.data || []);
//   };
//   const buildAttendancePayload = () => {
//     return selectedStudents.map((stu) => ({
//       studentId: stu.code,
//       studentName: stu.name,
//       admissionId: stu.admissionId || "",
//       roleNo: stu.rollNo || "",
//       classId: values.class?.value,
//       periodId:values.periodId,
//       attendanceDate: new Date().toISOString(),
//       status: attendance?.[stu.code]?.status ?? 1,
//       remarks: attendance?.[stu.code]?.remarks || "",
//       orgId: userData?.OrganizationId,
//       branchId: userData?.defaultCentre
//     }));
//   };

//   const handleSave = async () => {
//     const payload = buildAttendancePayload();
//     console.log("ATTENDANCE PAYLOAD 👉", payload);

//     try {
//       const res = await CreateStudentAttendance(
//         payload

// );
//       if (res?.success) {
//         notify(res.message, "success");
//       } else {
//         notify(res?.message || "Error saving attendance", "error");
//       }
//     } catch (err) {
//       console.log(err);
//       notify("Something went wrong", "error");
//     }
//   };

//   /* ───────────────────────── TABLE ───────────────────────── */

//   const tableHead = useMemo(
//     () => [
//       { name: "Student", width: "30%" },
//       { name: "Present", width: "20%", className: "text-center" },
//       { name: "Remarks", width: "50%" }
//     ],
//     []
//   );

//   const tableBody = useMemo(() => {
//     return selectedStudents.map((stu) => ({
//       Student: <span className="fw-semibold">{stu.name}</span>,

//       Present: (
//         <input
//           type="checkbox"
//           checked={attendance?.[stu.code]?.status === 1}
//           onChange={(e) =>
//             handleAttendanceToggle(stu.code, e.target.checked)
//           }
//         />
//       ),

//       Remarks: (
//         <input
//           className="form-control form-control-sm"
//           placeholder="Remarks"
//           value={attendance?.[stu.code]?.remarks || ""}
//           onChange={(e) =>
//             handleRemarksChange(stu.code, e.target.value)
//           }
//         />
//       )
//     }));
//   }, [selectedStudents, attendance]);

//   /* ───────────────────────── UI ───────────────────────── */

//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-sm">
//         <Heading title={t("Student Attendance")} isBreadcrumb={false} />

//         <div className="card-body">
//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
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
//    <ReactSelect
//               name="periodId"
//               placeholderName="Period"
//               dynamicOptions={handleReactSelectDropDownOptions(
//                 periods,
//                 "periodNo",
//                 "id"
//               )}
//               value={values.periodId}
//               handleChange={handleSelect}
//               respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             />
//             <div className="col-md-8">
//               <MultiSelectComp
//                 placeholderName="Select Students"
//                 dynamicOptions={allStudents.map((s) => ({
//                   name: `${s.student?.firstName || ""} ${
//                     s.student?.lastName || ""
//                   }`,
//                   code: s.student?.studentId,
//                   admissionId: s.admission?.admissionId,
//                   rollNo: s.academic?.rollNumber
//                 }))}
//                 handleChange={handleStudentChange}
//                 value={selectedStudents}
//               />
//             </div>
//           </div>

//           {selectedStudents.length ? (
//             <>
//               <Tables thead={tableHead} tbody={tableBody} />

//               <div className="text-end mt-3">
//                 <button
//                   className="btn btn-success px-4"
//                   onClick={handleSave}
//                 >
//                   Save Attendance
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-muted py-5">
//               Select class & students
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAttendance;


