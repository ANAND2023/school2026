import React, { useEffect, useState } from "react";
import { t } from "i18next";

import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { GetAllClasses } from "../../networkServices/AcademicYear";
import { GetStudentAttendance } from "../../networkServices/School/Attendance";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import Tables from "../UI/customTable";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import DatePicker from "../formComponent/DatePicker";

const StudentAttendanceList = () => {
  const userData = useLocalStorage("userData", "get");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [classes, setClasses] = useState([]);

  const [values, setValues] = useState({ class: null, monthYear: new Date() });

  /* ───────────────────────── HANDLERS ───────────────────────── */

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
    StudentAttendance(option?.value)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };



  const StudentAttendance=async(ID)=>{
    const selectedDate = new Date(values.monthYear);
const payload={
  OrgId: userData?.OrganizationId,
  BranchId:userData?.defaultCentre,
  ClassId:ID,
 Month: selectedDate.getMonth() + 1, // JS me month 0-11 hota hai
  Year: selectedDate.getFullYear(),
  
}
   try {
     const res = await GetStudentAttendance(payload);
    if (res?.success) {
      // notify("success", "Attendance Marked Successfully");
    }
   } catch (error) {
    console.log("error",error)
   }
  }

  useEffect(() => {
    GetAllClasses().then((r) => r?.success && setClasses(r.data || []));

  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <Heading title={t("Student Attendance")} isBreadcrumb={false} />

        <div className="card-body">
          <div className="row g-3 mb-3">

            <ReactSelect
              name="class"
              placeholderName="Select Class"
              dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
              handleChange={handleSelect}
              value={values.class}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            
            <DatePicker
  id="monthYear"
  name="monthYear"
  placeholder={VITE_DATE_FORMAT}
  label={t("Select Month")}
  className="custom-calendar"
  selected={values?.monthYear ? new Date(values.monthYear) : null}
  onChange={(date) => handleChange({ target: { name: "monthYear", value: date } })}
  dateFormat="MM/yyyy"
  showMonthYearPicker
  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
/>
 </div>

         
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceList;

