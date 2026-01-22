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

  const apiResponseData = [
    {
      teacherAttendanceId: 2,
      teacherId: "...",
      teacherName: "tez",
      attendanceDate: "2026-01-18T07:08:40.165",
      status: 1,
      loginDateTime: "2026-01-18T07:08:40.165",
      logoutDateTime: "2026-01-18T16:00:00.000", // Added dummy logout for demo
      isSelfMarked: true,
      // ... rest of object
    },
    // ... other items
    {
      teacherAttendanceId: 6,
      teacherId: "...",
      teacherName: "tez",
      attendanceDate: "2026-01-22T09:54:59.433",
      status: 1,
      loginDateTime: "2026-01-22T09:54:59.433",
      logoutDateTime: null, // Currently working
      isSelfMarked: true,
    },
  ];

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

//   useEffect(() => {
//     debugger;
//     if (
//       userData?.OrganizationId &&
//       userData?.defaultCentre &&
//       userData?.UserId
//     ) {
//       fetchAttendance();
//     }
//   }, [userData?.OrganizationId, userData?.BranchId, userData?.UserId]);

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
