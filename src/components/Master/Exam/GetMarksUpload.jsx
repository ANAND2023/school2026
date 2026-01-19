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

