import React, { useState, useEffect } from "react";
import moment from "moment";
import { Dialog } from "primereact/dialog"; // Assuming PrimeReact is used based on your previous code
import { Calendar } from "primereact/calendar";
import ReactSelect from "../../components/formComponent/ReactSelect"; // Your custom select
import TextAreaInput from "../../components/formComponent/TextAreaInput"; // Your custom textarea
import "../../../src/AttendanceCalendar.css";
import DatePicker from "../formComponent/DatePicker";

const AttendanceCalendar = ({
  attendanceData,
  onMonthChange,
  onApplyLeave,
}) => {
  const [mappedData, setMappedData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Modal State
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

  // Process API Data
  useEffect(() => {
    const dataMap = {};
    if (attendanceData && Array.isArray(attendanceData)) {
      attendanceData.forEach((record) => {
        const dateKey = moment(record.attendanceDate).format("YYYY-MM-DD");
        dataMap[dateKey] = record;
      });
    }
    setMappedData(dataMap);
  }, [attendanceData]);

  // Handle Month Change
  const handleMonthChange = (e) => {
    debugger
    setSelectedMonth(e.value);
    // if (onMonthChange) {
    //   // Pass formatted start/end dates or month/year to parent
    //   const month = moment(e.value).format("MM");
    //   const year = moment(e.value).format("YYYY");
    //   onMonthChange(month, year);
    // }
  };

  // Handle Cell Click (Open Modal)
  const handleDateClick = (dateMoment) => {
    // Logic: Only allow applying for leave on future dates or today
    // Or based on specific business rules
    setSelectedDate(dateMoment);
    setLeaveForm({ leaveType: null, reason: "" }); // Reset form
    setShowLeaveModal(true);
  };

  const submitLeaveRequest = () => {
    if (!leaveForm.leaveType || !leaveForm.reason) {
      alert("Please fill all details"); // Replace with your notify
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

  // Render Helpers
  const formatTime = (isoString) =>
    isoString ? moment(isoString).format("hh:mm A") : "--:--";

  const calculateDuration = (start, end) => {
    if (!start || !end) return "--:--";
    const dur = moment.duration(moment(end).diff(moment(start)));
    return `${Math.floor(dur.asHours())}:${dur.minutes() < 10 ? "0" : ""}${dur.minutes()}`;
  };

  const getCellColor = (record, dayMoment) => {
    if (dayMoment.format("MM-DD") === "01-26") return "#FFD700"; // Republic Day hardcoded example
    if (!record) return "#FFFFFF";
    if (record.status === 1) return "#87CEEB"; // Working
    return "#FFFFFF";
  };

  const renderCalendar = () => {
    const startOfMonth = moment(selectedMonth).startOf("month");
    const endOfMonth = moment(selectedMonth).endOf("month");
    const startDay = startOfMonth.day(); // 0-6
    const totalDays = endOfMonth.date();
    const cells = [];

    // Empty slots
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
    }

    // Date slots
    for (let d = 1; d <= totalDays; d++) {
      const currDate = moment(selectedMonth).date(d);
      const dateKey = currDate.format("YYYY-MM-DD");
      const record = mappedData[dateKey];
      const bgColor = getCellColor(record, currDate);

      // Holiday text example
      let holidayText =
        currDate.format("MM-DD") === "01-26" ? "Republic Day" : "";

      cells.push(
        <div
          key={dateKey}
          className="cal-cell clickable"
          // onClick={() => handleDateChange(currDate)} // For selection visual
          onDoubleClick={() => handleDateClick(currDate)} // Double click to apply leave? or single click
        >
          <div className="cell-header">
            <span className="date-number">{currDate.format("MMM D")}</span>
            {/* Optional: Add Apply Leave Icon */}
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

  useEffect(()=>{
    onMonthChange && onMonthChange(moment(selectedMonth).format("MM"), moment(selectedMonth).format("YYYY"));
  },[selectedMonth])

  return (
    <div className="attendance-wrapper">
      {/* 1. Toolbar Section */}
      {/* <div className="calendar-toolbar card p-2 mb-2 border-0 shadow-sm d-flex justify-content-between align-items-center"> */}
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

        {/* Legend - Horizontal for compactness */}
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

      {/* 2. Calendar Grid */}
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

      {/* 3. Leave Request Modal */}
      <Dialog
        header="Leave Request Details"
        visible={showLeaveModal}
        style={{ width: "50vw" }}
        onHide={() => setShowLeaveModal(false)}
        className="leave-modal"
      >
        <div className="row">
          {/* Left Side Form */}
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

          {/* Right Side Info */}
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
