import React from "react";

const ClassTimetableCard = ({ periodId, lectures = [] }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-3">
      <div className="text-center font-semibold mb-2">
        Period {periodId}
      </div>

      {lectures.map((lec, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded p-2 mb-2 last:mb-0"
        >
          <div className="text-sm">
            <span className="font-medium">Subject:</span>{" "}
            {lec.subjectName || lec.subjectId}
          </div>
          <div className="text-sm">
            <span className="font-medium">Teacher:</span>{" "}
            {lec.teacherName || lec.teacherId}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassTimetableCard;
