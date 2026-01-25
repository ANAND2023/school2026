import React, { useState, useEffect } from "react";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import ReactSelect from "../../components/formComponent/ReactSelect";
import TextAreaInput from "../../components/formComponent/TextAreaInput";
import "../../../src/AttendanceCalendar.css";
import DatePicker from "../formComponent/DatePicker";

const AttendanceCalendar = ({
  attendanceData,
  onMonthChange,
  onApplyLeave,
}) => {
  const [mappedData, setMappedData] = useState({});
  
  // FIXED: Initialize state from LocalStorage so it survives refresh
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const savedDate = localStorage.getItem("attendance_selected_month");
    return savedDate ? new Date(savedDate) : new Date();
  });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: null,
    reason: "",
  });

  const leaveTypes = [
    { label: "Casual Leave (CL)", value: "CL" },
    { label: "Sick Leave (SL)", value: "SL" },
    { label: "Optional Leave (OL)", value: "OL" },
  ];

  const legends = [
    { label: "Pending Approval", color: "#FFC0CB" },
    { label: "Approved Leave", color: "#90EE90" },
    { label: "Holiday", color: "#FFD700" },
    { label: "Optional Leave", color: "#FFA500" },
    { label: "Missing Attendance", color: "#D3D3D3" },
    { label: "Working Day", color: "#87CEEB" },
  ];

  useEffect(() => {
    const dataMap = {};
    if (attendanceData && Array.isArray(attendanceData)) {
      attendanceData.forEach((record) => {
        const dateKey = moment(record.attendanceDate).format("YYYY-MM-DD");
        
        if (dataMap[dateKey]) {
          const existing = dataMap[dateKey];
          
          const oldLogin = moment(existing.loginDateTime);
          const newLogin = moment(record.loginDateTime);
          const earliestLogin = newLogin.isValid() && newLogin.isBefore(oldLogin) 
            ? record.loginDateTime 
            : existing.loginDateTime;

          let latestLogout = existing.logoutDateTime;
          if (record.logoutDateTime) {
            const newLogout = moment(record.logoutDateTime);
            if (!latestLogout || (newLogout.isValid() && newLogout.isAfter(moment(latestLogout)))) {
              latestLogout = record.logoutDateTime;
            }
          }

          dataMap[dateKey] = {
            ...existing,
            ...record,
            loginDateTime: earliestLogin,
            logoutDateTime: latestLogout
          };
        } else {
          dataMap[dateKey] = record;
        }
      });
    }
    setMappedData(dataMap);
  }, [attendanceData]);

  // FIXED: Trigger API on mount and when month changes
  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(
        moment(selectedMonth).format("MM"),
        moment(selectedMonth).format("YYYY")
      );
    }
  }, [selectedMonth]); 

  const handleMonthChange = (e) => {
    const newDate = e.value;
    setSelectedMonth(newDate);
    // FIXED: Save to local storage
    localStorage.setItem("attendance_selected_month", newDate.toISOString());
  };

  const handleDateClick = (dateMoment) => {
    setSelectedDate(dateMoment);
    setLeaveForm({ leaveType: null, reason: "" });
    setShowLeaveModal(true);
  };

  const submitLeaveRequest = () => {
    if (!leaveForm.leaveType || !leaveForm.reason) {
      alert("Please fill all details");
      return;
    }

    const payload = {
      date: selectedDate.format("YYYY-MM-DD"),
      type: leaveForm.leaveType.value,
      reason: leaveForm.reason,
    };

    if (onApplyLeave) {
      onApplyLeave(payload);
    }
    setShowLeaveModal(false);
  };

  const formatTime = (isoString) =>
    isoString && moment(isoString).isValid()
      ? moment(isoString).format("hh:mm A")
      : "--:--";

  const calculateDuration = (start, end) => {
    if (!start || !end) return "--:--";
    const startTime = moment(start);
    const endTime = moment(end);

    if (!startTime.isValid() || !endTime.isValid()) return "--:--";

    const dur = moment.duration(endTime.diff(startTime));
    const hours = Math.floor(dur.asHours());
    const minutes = dur.minutes();

    if (hours < 0) return "--:--";

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  const getCellColor = (record, dayMoment) => {
    if (dayMoment.format("MM-DD") === "01-26") return "#FFD700";
    if (!record) return "#FFFFFF";
    
    // Adjust status codes based on your API logic
    switch (record.status) {
      case 1: 
      case 2:
        return "#87CEEB"; 
      case 3: 
        return "#90EE90"; 
      default:
        return "#87CEEB"; 
    }
  };

  const renderCalendar = () => {
    const startOfMonth = moment(selectedMonth).startOf("month");
    const endOfMonth = moment(selectedMonth).endOf("month");
    const startDay = startOfMonth.day();
    const totalDays = endOfMonth.date();
    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const currDate = moment(selectedMonth).date(d);
      const dateKey = currDate.format("YYYY-MM-DD");
      const record = mappedData[dateKey];
      const bgColor = getCellColor(record, currDate);

      let holidayText =
        currDate.format("MM-DD") === "01-26" ? "Republic Day" : "";

      cells.push(
        <div
          key={dateKey}
          className="cal-cell clickable"
          onDoubleClick={() => handleDateClick(currDate)}
        >
          <div className="cell-header">
            <span className="date-number">{currDate.format("MMM D")}</span>
            <i
              className="fa fa-plus-circle text-primary apply-btn"
              title="Apply Leave"
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(currDate);
              }}
            ></i>
          </div>

          <div className="cell-body" style={{ backgroundColor: bgColor }}>
            {holidayText ? (
              <div className="holiday-text">{holidayText}</div>
            ) : record ? (
              <>
                <div className="data-row">
                  <span>In:</span> {formatTime(record.loginDateTime)}
                </div>
                <div className="data-row">
                  <span>Out:</span> {formatTime(record.logoutDateTime)}
                </div>
                <div className="data-row duration">
                  Hrs:{" "}
                  {calculateDuration(
                    record.loginDateTime,
                    record.logoutDateTime,
                  )}
                </div>
              </>
            ) : (
              <div className="no-data">-</div>
            )}
          </div>
        </div>,
      );
    }
    return cells;
  };

  return (
    <div className="attendance-wrapper">
      <div className="p-2 mb-2 border-0 shadow-sm d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <DatePicker
            lable={"Select Month"}
            value={selectedMonth}
            handleChange={handleMonthChange}
            dateFormat="M-yy"
            showIcon
            className="compact-calendar"
            viewDate="month"
          />
        </div>

        <div className="legend-strip d-flex gap-3 align-items-center">
          {legends.map((l, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-1"
              title={l.label}
            >
              <div
                className="legend-dot"
                style={{ backgroundColor: l.color }}
              ></div>
              <span className="small text-muted">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-container border shadow-sm">
        <div className="week-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="week-cell">
              {day}
            </div>
          ))}
        </div>
        <div className="month-grid">{renderCalendar()}</div>
      </div>

      <Dialog
        header="Leave Request Details"
        visible={showLeaveModal}
        style={{ width: "50vw" }}
        onHide={() => setShowLeaveModal(false)}
        className="leave-modal"
      >
        <div className="row">
          <div className="col-md-7 border-end">
            <div className="mb-3">
              <label className="fw-bold mb-1">
                Applying for: {selectedDate?.format("DD-MMM-YYYY")}
              </label>
              <ReactSelect
                placeholderName="Leave Type"
                searchable={true}
                respclass="col-12"
                dynamicOptions={leaveTypes}
                value={leaveForm.leaveType}
                handleChange={(_, val) =>
                  setLeaveForm((prev) => ({ ...prev, leaveType: val }))
                }
              />
            </div>
            <div className="mb-3">
              <TextAreaInput
                lable="Reason"
                className="form-control"
                value={leaveForm.reason}
                onChange={(e) =>
                  setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={5}
              />
            </div>
            <div className="text-success fw-bold">
              Leave Approved (Status Placeholder)
            </div>
          </div>

          <div className="col-md-5 ps-4">
            <div className="info-block">
              <h6 className="text-primary fw-bold">Balance:</h6>
              <div className="d-flex justify-content-between">
                <span>Pending CL:</span> <b>3</b>
              </div>
              <div className="d-flex justify-content-between">
                <span>Pending SL:</span> <b>6</b>
              </div>
              <div className="d-flex justify-content-between">
                <span>Pending OL:</span> <b>3</b>
              </div>
            </div>

            <div className="note-block mt-3 text-danger small">
              <p className="mb-1">
                * Pending SL will carry forward in next financial year.
              </p>
              <p className="mb-1">
                * Maximum optional leave from Jan to Dec is 3.
              </p>
              <p className="mb-0">
                * You are eligible to take only one optional leave each month.
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3 border-top pt-2">
          <button
            className="btn btn-sm btn-secondary me-2"
            onClick={() => setShowLeaveModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={submitLeaveRequest}
          >
            Apply Leave
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default AttendanceCalendar;