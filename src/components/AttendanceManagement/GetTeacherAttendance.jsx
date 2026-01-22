import React, { useEffect, useState } from "react";
import AttendanceCalendar from "../commonComponents/AttendanceCalendar";
import { GetAttendance } from "../../networkServices/School/Attendance";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import AttendanceCalendar from '../commonComponents/AttendanceCalendar';

const GetTeacherAttendance = () => {
  const userData = useLocalStorage("userData", "get");
  const [data, setData] = useState([]);
  const [payloadData, setPayloadData] = useState({
    month: "",
    year: "",
  });


  const fetchAttendance = async (month, year) => {
    debugger;
    try {
      const payload = {
        orgId: userData?.OrganizationId,
        branchId: userData?.defaultCentre,
        teacherId: userData?.UserId,
        month: month,
        year: year,
      };
      const res = await GetAttendance(payload);
      if (res?.success) {
        setData(res?.data);
      } else {
        setData([]);
      }
    } catch (error) {}
  };


  return (
    <div className="card">
      <div className="card-body">
        <AttendanceCalendar
          attendanceData={data}
          //  currentMonth={new Date("2026-01-01")}
          onMonthChange={fetchAttendance}
        />
      </div>
    </div>
  );
};
export default GetTeacherAttendance;
