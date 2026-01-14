
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import DatePicker from "../../formComponent/DatePicker";
// import TimePicker from "../../formComponent/TimePicker";
// import Tables from "../../UI/customTable";
// import { notify } from "../../../utils/ustil2";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import { create_exam } from "../../../networkServices/School/exam";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import moment from "moment";

// const ExamTimetable = () => {
//   const { GetEmployeeWiseCenter } = useSelector(
//     (state) => state?.CommonSlice
//   );

//   const userData = useLocalStorage("userData", "get");
//   const { VITE_DATE_FORMAT } = import.meta.env;

//   const [classes, setClasses] = useState([]);

//   const [values, setValues] = useState({
//     class_Name: { label: "", value: "" },
//     branch: { label: "", value: "" },
//     Subject: []
//   });

//   /* ================= ROWS ================= */
//   const [examRows, setExamRows] = useState([]);

//   /* ================= APPLY ALL ================= */
//   const [applyAll, setApplyAll] = useState({
//     examDate: "",
//     startTime: "",
//     endTime: "",
//     passingMarks: "",
//     maxMarks: ""
//   });

//   /* ================= API ================= */
//   const getClass = async () => {
//     try {
//       const res = await GetAllClasses();
//       if (res?.success) setClasses(res?.data);
//       else notify(res?.message, "error");
//     } catch {
//       notify("Error fetching classes", "error");
//     }
//   };

//   useEffect(() => {
//     getClass();
//   }, []);

//   /* ================= HANDLERS ================= */
//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//   };

//   const handleMultiSelectChange = (name, selectedOptions) => {
//     setValues((prev) => ({ ...prev, [name]: selectedOptions }));

//     const rows = selectedOptions.map((sub) => ({
//       subjectId: sub.code,
//       subjectName: sub.name,
//       examDate: "",
//       startTime: "",
//       endTime: "",
//       passingMarks: "",
//       maxMarks: ""
//     }));

//     setExamRows(rows);
//   };

//   /* 🔥 APPLY ALL (FIXED) */
//   const handleApplyAllChange = (name, value) => {
//     setApplyAll((prev) => ({ ...prev, [name]: value }));

//     setExamRows((prev) =>
//       prev.map((row) => ({
//         ...row,
//         [name]: value
//       }))
//     );
//   };

//   const handleRowChange = (index, name, value) => {
//     const updated = [...examRows];
//     updated[index][name] = value;
//     setExamRows(updated);
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!values.class_Name?.value || !values.branch?.value || examRows.length === 0) {
//       notify(t("Please fill all mandatory fields"), "error");
//       return;
//     }

//     const payload = examRows.map((row) => ({
//       examId: "EXAM_ID",
//       classId: values.class_Name.value,
//       subjectId: row.subjectId,
//       examDate: moment(row.examDate).format("YYYY-MM-DD"),
//       startTime: row.startTime,
//       endTime: row.endTime,
//       passingMarks: Number(row.passingMarks),
//       maxMarks: Number(row.maxMarks),
//       orgId: userData?.OrganizationId,
//       orgName: userData?.OrganizationName,
//       branchId: values.branch.value,
//       branchName: values.branch.label
//     }));

//     console.log("FINAL PAYLOAD 👉", payload);

//     try {
//       const res = await create_exam(payload);
//       if (res?.success) notify("Exam timetable saved", "success");
//       else notify("Error saving exam timetable", "error");
//     } catch {
//       notify("Something went wrong", "error");
//     }
//   };

//   /* ================= SUBJECT LIST ================= */
//   const ListSubject = [
//     { id: 1, name: "Mathematics" },
//     { id: 2, name: "Science" },
//     { id: 3, name: "History" },
//     { id: 4, name: "Geography" },
//     { id: 5, name: "English" }
//   ];

//   return (
//     <>
//       <div className="card border">
//         <Heading title={t("Exam Timetable")} />

//         <div className="card-body">
//           <div className="row mb-3">

//             <ReactSelect
//               placeholderName={t("Class")}
//               name="class_Name"
//               respclass="col-md-3"
//               dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//               handleChange={handleSelect}
//               value={values.class_Name}
//             />

//             <MultiSelectComp
//               respclass="col-md-4"
//               name="Subject"
//               placeholderName={t("Subject")}
//               dynamicOptions={ListSubject.map((s) => ({
//                 name: s.name,
//                 code: s.id
//               }))}
//               handleChange={handleMultiSelectChange}
//               value={values.Subject}
//             />

//             <ReactSelect
//               placeholderName={t("Branch")}
//               name="branch"
//               respclass="col-md-3"
//               dynamicOptions={GetEmployeeWiseCenter?.map((b) => ({
//                 value: b.id,
//                 label: b.name
//               }))}
//               handleChange={handleSelect}
//               value={values.branch}
//             />

//           </div>

//           {/* ================= TABLE ================= */}
//           {examRows.length > 0 && (
//             <Tables
//               thead={[
//                 { name: "Subject" },
//                 { name: "Exam Date" },
//                 { name: "Start Time" },
//                 { name: "End Time" },
//                 { name: "Passing Marks" },
//                 { name: "Max Marks" }
//               ]}
//               tbody={[
//                 /* APPLY ALL */
//                 {
//                   Subject: "All",
//                   "Exam Date": (
//                     <DatePicker
//                       value={applyAll.examDate}
//                       placeholder={VITE_DATE_FORMAT}
//                       handleChange={(val) =>
//                         handleApplyAllChange("examDate", val)
//                       }
//                     />
//                   ),
//                   "Start Time": (
//                     <TimePicker
//                       value={applyAll.startTime}
//                       handleChange={(val) =>
//                         handleApplyAllChange("startTime", val)
//                       }
//                     />
//                   ),
//                   "End Time": (
//                     <TimePicker
//                       value={applyAll.endTime}
//                       handleChange={(val) =>
//                         handleApplyAllChange("endTime", val)
//                       }
//                     />
//                   ),
//                   "Passing Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={applyAll.passingMarks}
//                       onChange={(e) =>
//                         handleApplyAllChange("passingMarks", e.target.value)
//                       }
//                     />
//                   ),
//                   "Max Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={applyAll.maxMarks}
//                       onChange={(e) =>
//                         handleApplyAllChange("maxMarks", e.target.value)
//                       }
//                     />
//                   )
//                 },

//                 /* SUBJECT ROWS */
//                 ...examRows.map((row, index) => ({
//                   Subject: row.subjectName,
//                   "Exam Date": (
//                     <DatePicker
//                       value={row.examDate}
//                       handleChange={(val) =>
//                         handleRowChange(index, "examDate", val)
//                       }
//                     />
//                   ),
//                   "Start Time": (
//                     <TimePicker
//                       value={row.startTime}
//                       handleChange={(val) =>
//                         handleRowChange(index, "startTime", val)
//                       }
//                     />
//                   ),
//                   "End Time": (
//                     <TimePicker
//                       value={row.endTime}
//                       handleChange={(val) =>
//                         handleRowChange(index, "endTime", val)
//                       }
//                     />
//                   ),
//                   "Passing Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={row.passingMarks}
//                       onChange={(e) =>
//                         handleRowChange(index, "passingMarks", e.target.value)
//                       }
//                     />
//                   ),
//                   "Max Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={row.maxMarks}
//                       onChange={(e) =>
//                         handleRowChange(index, "maxMarks", e.target.value)
//                       }
//                     />
//                   )
//                 }))
//               ]}
//             />
//           )}

//           <div className="mt-3">
//             <button className="btn btn-primary btn-sm" onClick={handleSave}>
//               {t("Save Timetable")}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default ExamTimetable;

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { t } from "i18next";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";
// import DatePicker from "../../formComponent/DatePicker";
// import TimePicker from "../../formComponent/TimePicker";
// import Tables from "../../UI/customTable";
// import { notify } from "../../../utils/ustil2";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import { create_exam } from "../../../networkServices/School/exam";
// import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import moment from "moment";

// const ExamTimetable = () => {
//   const { GetEmployeeWiseCenter } = useSelector(
//     (state) => state?.CommonSlice
//   );

//   const userData = useLocalStorage("userData", "get");
//   const { VITE_DATE_FORMAT } = import.meta.env;

//   const [classes, setClasses] = useState([]);

//   const [values, setValues] = useState({
//     class_Name: { label: "", value: "" },
//     branch: { label: "", value: "" },
//     Subject: []
//   });

//   /* ================= EXAM ROWS ================= */
//   const [examRows, setExamRows] = useState([]);

//   /* ================= APPLY ALL ================= */
//   const [applyAll, setApplyAll] = useState({
//     examDate: "",
//     startTime: "",
//     endTime: "",
//     passingMarks: "",
//     maxMarks: ""
//   });

//   /* ================= API ================= */
//   const getClass = async () => {
//     try {
//       const res = await GetAllClasses();
//       if (res?.success) setClasses(res?.data);
//       else notify(res?.message, "error");
//     } catch {
//       notify("Error fetching classes", "error");
//     }
//   };

//   useEffect(() => {
//     getClass();
//   }, []);

//   /* ================= HANDLERS ================= */
//   const handleSelect = (name, option) => {
//     setValues((prev) => ({ ...prev, [name]: option }));
//   };

//   const handleMultiSelectChange = (name, selectedOptions) => {
//     setValues((prev) => ({ ...prev, [name]: selectedOptions }));

//     const rows = selectedOptions.map((sub) => ({
//       subjectId: sub.code,
//       subjectName: sub.name,
//       examDate: "",
//       startTime: "",
//       endTime: "",
//       passingMarks: "",
//       maxMarks: ""
//     }));

//     setExamRows(rows);
//   };

//   /* 🔥 APPLY TO ALL (FIXED) */
//   const handleApplyAllChange = (name, value) => {
//     setApplyAll((prev) => ({ ...prev, [name]: value }));

//     setExamRows((prev) =>
//       prev.map((row) => ({
//         ...row,
//         [name]: value
//       }))
//     );
//   };

//   const handleRowChange = (index, name, value) => {
//     const updated = [...examRows];
//     updated[index][name] = value;
//     setExamRows(updated);
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!values.class_Name?.value || !values.branch?.value || examRows.length === 0) {
//       notify(t("Please fill all mandatory fields"), "error");
//       return;
//     }

//     const payload = examRows.map((row) => ({
//       examId: "EXAM_ID",
//       classId: values.class_Name.value,
//       subjectId: row.subjectId,
//       examDate: moment(row.examDate).toISOString(),
//       startTime: row.startTime,
//       endTime: row.endTime,
//       passingMarks: Number(row.passingMarks),
//       maxMarks: Number(row.maxMarks),
//       orgId: userData?.OrganizationId,
//       orgName: userData?.OrganizationName,
//       branchId: values.branch.value,
//       branchName: values.branch.label
//     }));

//     console.log("FINAL PAYLOAD 👉", payload);

//     try {
//       const res = await create_exam(payload);
//       if (res?.success) notify("Exam timetable saved", "success");
//       else notify("Error saving exam timetable", "error");
//     } catch {
//       notify("Something went wrong", "error");
//     }
//   };

//   /* ================= SUBJECT LIST ================= */
//   const ListSubject = [
//     { id: 1, name: "Mathematics" },
//     { id: 2, name: "Science" },
//     { id: 3, name: "History" },
//     { id: 4, name: "Geography" },
//     { id: 5, name: "English" }
//   ];

//   return (
//     <>
//       <div className="card border">
//         <Heading title={t("Exam Timetable")} />

//         <div className="card-body">
//           <div className="row mb-3">

//             <ReactSelect
//               placeholderName={t("Class")}
//               name="class_Name"
//               respclass="col-md-3"
//               dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
//               handleChange={handleSelect}
//               value={values.class_Name}
//             />

//             <MultiSelectComp
//               respclass="col-md-4"
//               name="Subject"
//               placeholderName={t("Subject")}
//               dynamicOptions={ListSubject.map((s) => ({
//                 name: s.name,
//                 code: s.id
//               }))}
//               handleChange={handleMultiSelectChange}
//               value={values.Subject}
//             />

//             <ReactSelect
//               placeholderName={t("Branch")}
//               name="branch"
//               respclass="col-md-3"
//               dynamicOptions={GetEmployeeWiseCenter?.map((b) => ({
//                 value: b.id,
//                 label: b.name
//               }))}
//               handleChange={handleSelect}
//               value={values.branch}
//             />

//           </div>

//           {/* ================= TABLE ================= */}
//           {examRows.length > 0 && (
//             <Tables
//               thead={[
//                 { name: "Subject" },
//                 { name: "Exam Date" },
//                 { name: "Start Time" },
//                 { name: "End Time" },
//                 { name: "Passing Marks" },
//                 { name: "Max Marks" }
//               ]}
//               tbody={[
//                 /* APPLY ALL ROW */
//                 {
//                   Subject: "All",
//                   "Exam Date": (
//                     <DatePicker
//                       value={applyAll.examDate}
//                       placeholder={VITE_DATE_FORMAT}
//                       handleChange={(val) =>
//                         handleApplyAllChange("examDate", val)
//                       }
//                     />
//                   ),
//                   "Start Time": (
//                     <TimePicker
//                       value={applyAll.startTime}
//                       handleChange={(val) =>
//                         handleApplyAllChange("startTime", val)
//                       }
//                     />
//                   ),
//                   "End Time": (
//                     <TimePicker
//                       value={applyAll.endTime}
//                       handleChange={(val) =>
//                         handleApplyAllChange("endTime", val)
//                       }
//                     />
//                   ),
//                   "Passing Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={applyAll.passingMarks}
//                       onChange={(e) =>
//                         handleApplyAllChange("passingMarks", e.target.value)
//                       }
//                     />
//                   ),
//                   "Max Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={applyAll.maxMarks}
//                       onChange={(e) =>
//                         handleApplyAllChange("maxMarks", e.target.value)
//                       }
//                     />
//                   )
//                 },

//                 /* SUBJECT ROWS */
//                 ...examRows.map((row, index) => ({
//                   Subject: row.subjectName,
//                   "Exam Date": (
//                     <DatePicker
//                       value={row.examDate}
//                       handleChange={(val) =>
//                         handleRowChange(index, "examDate", val)
//                       }
//                     />
//                   ),
//                   "Start Time": (
//                     <TimePicker
//                       value={row.startTime}
//                       handleChange={(val) =>
//                         handleRowChange(index, "startTime", val)
//                       }
//                     />
//                   ),
//                   "End Time": (
//                     <TimePicker
//                       value={row.endTime}
//                       handleChange={(val) =>
//                         handleRowChange(index, "endTime", val)
//                       }
//                     />
//                   ),
//                   "Passing Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={row.passingMarks}
//                       onChange={(e) =>
//                         handleRowChange(index, "passingMarks", e.target.value)
//                       }
//                     />
//                   ),
//                   "Max Marks": (
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={row.maxMarks}
//                       onChange={(e) =>
//                         handleRowChange(index, "maxMarks", e.target.value)
//                       }
//                     />
//                   )
//                 }))
//               ]}
//             />
//           )}

//           <div className="mt-3">
//             <button className="btn btn-primary btn-sm" onClick={handleSave}>
//               {t("Save Timetable")}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default ExamTimetable;



import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";
import Heading from "../../UI/Heading";
import ReactSelect from "../../formComponent/ReactSelect";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import DatePicker from "../../formComponent/DatePicker";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { GetAllClasses } from "../../../networkServices/AcademicYear";
import { AcademicMasterget_all_term, create_exam, get_created_exam } from "../../../networkServices/School/exam";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import moment from "moment";
import TimePicker from "../../formComponent/TimePicker";
import Tables from "../../UI/customTable";

const ExamTimetable = () => {
    const { GetEmployeeWiseCenter } = useSelector(
        (state) => state?.CommonSlice
    );

    const userData = useLocalStorage("userData", "get");
    const { VITE_DATE_FORMAT } = import.meta.env;

    const [classes, setClasses] = useState([]);

    const [values, setValues] = useState({
        class_Name: { label: "", value: "" },
        branch: { label: "", value: "" },
        allExam: { label: "", value: "" },
        term: { label: "", value: "" },
        Subject: []
    });

    /* ================= EXAM ROW STATE ================= */
    const [examRows, setExamRows] = useState([]);
    const [allExam, setAllExam] = useState([]);
    const [allTerm, setAllTerm] = useState([]);

    /* ================= APPLY TO ALL ================= */
    const [applyAll, setApplyAll] = useState({
        examDate: "",
        startTime: "",
        endTime: "",
        passingMarks: "",
        maxMarks: ""
    });

    /* ================= API ================= */
    const getClass = async () => {
        try {
            const res = await GetAllClasses();
            if (res?.success) setClasses(res?.data);
            else notify(res?.message, "error");
        } catch {
            notify("Error fetching classes", "error");
        }
    };

    useEffect(() => {
        getClass();
    }, []);

    /* ================= HANDLERS ================= */
    const handleSelect = (name, option) => {
        setValues((prev) => ({ ...prev, [name]: option }));
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues((prev) => ({ ...prev, [name]: selectedOptions }));

        const rows = selectedOptions.map((sub) => ({
            subjectId: sub.code,
            subjectName: sub.name,
            examDate: "",
            startTime: "",
            endTime: "",
            passingMarks: "",
            maxMarks: ""
        }));

        setExamRows(rows);
    };

    const handleApplyAllChange = (e) => {
        const { name, value } = e.target;

        setApplyAll((prev) => ({ ...prev, [name]: value }));

        setExamRows((prev) =>
            prev.map((row) => ({
                ...row,
                [name]: value
            }))
        );
    };

    const handleRowChange = (index, name, value) => {
        const updated = [...examRows];
        updated[index][name] = value;
        setExamRows(updated);
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!values.class_Name?.value || !values.branch?.value || examRows.length === 0) {
            notify(t("Please fill all mandatory fields"), "error");
            return;
        }

        const payload = examRows.map((row) => ({
            examId: values?.allExam?.value || "",
            classId: values.class_Name.value,
            subjectId: row.subjectId,
            examDate: moment(row.examDate).format("YYYY-MM-DD"),
            startTime: moment(row.startTime).format("hh:mm A"),
            endTime: moment(row.endTime).format("hh:mm A"),
            passingMarks: Number(row.passingMarks),
            maxMarks: Number(row.maxMarks),
            orgId: userData?.OrganizationId,
            orgName: userData?.OrganizationName,
            branchId: values.branch.value,
            branchName: values.branch.label
        }));

        console.log("FINAL PAYLOAD 👉", payload);

        try {
            const res = await create_exam(payload);
            if (res?.success) notify("Exam timetable saved", "success");
            else notify("Error saving exam timetable", "error");
        } catch (err) {
            console.error(err);
            notify("Something went wrong", "error");
        }
    };

    /* ================= STATIC SUBJECT LIST ================= */
    const ListSubject = [
        { id: 1, name: "Mathematics" },
        { id: 2, name: "Science" },
        { id: 3, name: "History" },
        { id: 4, name: "Geography" },
        { id: 5, name: "English" }
    ];
     const fetchTerms = async () => {
            try {
                const response = await AcademicMasterget_all_term();
                // Checking response structure based on your provided JSON
                if (response && Array.isArray(response)) {
                    setAllTerm(response);
                } else if (response?.success && response?.data) {
                    setAllTerm(response.data);
                } else {
                    setAllTerm([]);
                }
            } catch (error) {
                console.error("Error fetching terms:", error);
                setAllTerm([]);
            }
        };
    const getAllExam = async (branch,term) => {
        
        // if ( !branch || !term) {
        //     notify(t("Please fill all mandatory fields"), "error");
        //     return;
        // }

        const payload =
        {
            "orgId": userData?.OrganizationId,
            "branchId": branch,
            "examId": "",
            "termId":term,
        }

        try {
            const res = await get_created_exam(payload);
            if (res?.success) {
                setAllExam(res?.data);
                notify(t("Exam created successfully"), "success");

            }
            else notify(t("Error creating exam"), "error");
        } catch (error) {
            console.log("error", error)
        }
    };
    useEffect(() => {
        getAllExam(values?.branch?.value,values?.term?.value);
    }, [values.branch,values.term]);
    useEffect(() => {
        fetchTerms();
    }, []);
    return (
        <>
            <div className="card border">
                <Heading title={t("Exam Timetable")} />

                <div className="card-body">
                    <div className="row">
                        <ReactSelect
                            placeholderName={t("Branch")}
                            name="branch"
                            respclass="col-md-3"
                            dynamicOptions={GetEmployeeWiseCenter?.map((b) => ({
                                value: b.id,
                                label: b.name
                            }))}
                            handleChange={handleSelect}
                            value={values.branch}
                        />
                        <ReactSelect
                            placeholderName={t("term")}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            id="term"
                            name="term"
                            removeIsClearable={true}
                            // dynamicOptions={classes}
                            dynamicOptions={handleReactSelectDropDownOptions(allTerm, "termName", "id")}
                            handleChange={handleSelect}
                            value={values?.term?.value}
                            requiredClassName="required-fields"
                        />
                        <ReactSelect
                            placeholderName={t("allExam")}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            id="allExam"
                            name="allExam"
                            removeIsClearable={true}
                            // dynamicOptions={classes}
                            dynamicOptions={handleReactSelectDropDownOptions(allExam, "examName", "id")}
                            handleChange={handleSelect}
                            value={values?.allExam?.value}
                            requiredClassName="required-fields"
                        />
                        <ReactSelect
                            placeholderName={t("Class")}
                            name="class_Name"
                            respclass="col-md-3"
                            dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
                            handleChange={handleSelect}
                            value={values.class_Name}
                        />

                        <MultiSelectComp
                            respclass="col-md-4"
                            name="Subject"
                            placeholderName={t("Subject")}
                            dynamicOptions={ListSubject.map((s) => ({
                                name: s.name,
                                code: s.id
                            }))}
                            handleChange={handleMultiSelectChange}
                            value={values.Subject}
                        />

                        

                    </div>

                    {/* ================= TABLE ================= */}


                    <Tables
                        thead={[
                            { name: "Subject" },
                            { name: "Exam Date" },
                            { name: "Start Time" },
                            { name: "End Time" },
                            { name: "Passing Marks" },
                            { name: "Max Marks" },
                            // { name: "Action" },

                        ]}
                        tbody={examRows.map((row, index) => ({
                            // Subject: "All",
                            subjectName: row.subjectName,
                            examDate: <DatePicker
                                id="examDate"
                                name="examDate"
                                placeholder={VITE_DATE_FORMAT}
                                // lable={t("Start Date ")}
                                className="custom-calendar"
                                value={row.examDate}
                                // handleChange={handleChange}
                                handleChange={(e) =>
                                    handleRowChange(index, "examDate", e.target.value)
                                }
                            // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            // maxDate={values?.toDate}
                            />,
                            startTime: <TimePicker
                                placeholderName=""
                                lable={t("")}
                                id="startTime"
                                name="startTime"
                                value={row.startTime}
                                // respclass="col-xl-2 col-md-3 col-sm-4 col-12"

                                handleChange={(e) =>
                                    handleRowChange(index, "startTime", e.target.value)
                                }
                            />,
                            endTime: <TimePicker
                                placeholderName=""
                                lable={t("")}
                                id="endTime"
                                name="endTime"
                                value={row.endTime}
                                // respclass="col-xl-2 col-md-3 col-sm-4 col-12"

                                handleChange={(e) =>
                                    handleRowChange(index, "endTime", e.target.value)
                                }
                            />,
                            passingMarks: <input
                                type="number"
                                className="form-control"
                                value={row.passingMarks}
                                onChange={(e) =>
                                    handleRowChange(index, "passingMarks", e.target.value)
                                }
                            />,
                            maxMarks: <input
                                type="number"
                                className="form-control"
                                value={row.maxMarks}
                                onChange={(e) =>
                                    handleRowChange(index, "maxMarks", e.target.value)
                                }
                            />,

                        }))}
                    />


                    {examRows.length > 0 && (
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Exam Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Passing</th>
                                        <th>Max</th>
                                    </tr>

                                    {/* APPLY TO ALL */}
                                    <tr className="bg-light">
                                        <th>All</th>
                                        <th>
                                            {/* <input
                        type="date"
                        name="examDate"
                        className="form-control"
                        onChange={handleApplyAllChange}
                      /> */}
                                            <DatePicker
                                                id="examDate"
                                                name="examDate"
                                                placeholder={VITE_DATE_FORMAT}
                                                lable={t("")}
                                                className="custom-calendar"
                                                // value={row.examDate}
                                                // handleChange={handleChange}
                                                handleChange={handleApplyAllChange}
                                            // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                            // maxDate={values?.toDate}
                                            />
                                        </th>
                                        <th>
                                            <TimePicker
                                                placeholderName=""
                                                lable={t("")}
                                                id="startTime"
                                                name="startTime"
                                                // value={payload?.time}
                                                // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                                handleChange={handleApplyAllChange}
                                            />
                                            {/* <input
                        type="time"
                        name="startTime"
                        className="form-control"
                        onChange={handleApplyAllChange}
                      /> */}
                                        </th>
                                        <th>
                                            <TimePicker
                                                placeholderName=""
                                                lable={t("")}
                                                id="endTime"
                                                name="endTime"
                                                // value={payload?.time}
                                                // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                                handleChange={handleApplyAllChange}
                                            />
                                            {/* <input
                        type="time"
                        name="endTime"
                        className="form-control"
                        onChange={handleApplyAllChange}
                      /> */}
                                        </th>
                                        <th>
                                            <input
                                                type="number"
                                                name="passingMarks"
                                                className="form-control"
                                                onChange={handleApplyAllChange}
                                            />
                                        </th>
                                        <th>
                                            <input
                                                type="number"
                                                name="maxMarks"
                                                className="form-control"
                                                onChange={handleApplyAllChange}
                                            />
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {examRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.subjectName}</td>
                                            <td>
                                                <DatePicker
                                                    id="examDate"
                                                    name="examDate"
                                                    placeholder={VITE_DATE_FORMAT}
                                                    lable={t("Start Date ")}
                                                    className="custom-calendar"
                                                    value={row.examDate}
                                                    // handleChange={handleChange}
                                                    handleChange={(e) =>
                                                        handleRowChange(index, "examDate", e.target.value)
                                                    }
                                                // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                                // maxDate={values?.toDate}
                                                />
                                                {/* <input
                          type="date"
                          className="form-control"
                          value={row.examDate}
                          onChange={(e) =>
                            handleRowChange(index, "examDate", e.target.value)
                          }
                        /> */}
                                            </td>
                                            <td>
                                                <TimePicker
                                                    placeholderName=""
                                                    lable={t("")}
                                                    id="startTime"
                                                    name="startTime"
                                                    value={row.startTime}
                                                    // respclass="col-xl-2 col-md-3 col-sm-4 col-12"

                                                    handleChange={(e) =>
                                                        handleRowChange(index, "startTime", e.target.value)
                                                    }
                                                />
                                                {/* <input
                          type="time"
                          className="form-control"
                          value={row.startTime}
                          onChange={(e) =>
                            handleRowChange(index, "startTime", e.target.value)
                          }
                        /> */}
                                            </td>
                                            <td>
                                                <TimePicker
                                                    placeholderName=""
                                                    lable={t("")}
                                                    id="endTime"
                                                    name="endTime"
                                                    value={row.endTime}
                                                    // respclass="col-xl-2 col-md-3 col-sm-4 col-12"

                                                    handleChange={(e) =>
                                                        handleRowChange(index, "endTime", e.target.value)
                                                    }
                                                />
                                                {/* <input
                          type="time"
                          className="form-control"
                          value={row.endTime}
                          onChange={(e) =>
                            handleRowChange(index, "endTime", e.target.value)
                          }
                        /> */}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={row.passingMarks}
                                                    onChange={(e) =>
                                                        handleRowChange(index, "passingMarks", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={row.maxMarks}
                                                    onChange={(e) =>
                                                        handleRowChange(index, "maxMarks", e.target.value)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-3">
                        <button className="btn btn-primary btn-sm" onClick={handleSave}>
                            {t("Save Timetable")}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ExamTimetable;

