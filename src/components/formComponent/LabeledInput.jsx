import { Tooltip } from "primereact/tooltip";
import React, { useCallback } from "react";

function LabeledInput({ label, value, className, style = {}, valueLength = 27 }) {
  const isMobile = window.innerWidth <= 768;

  const renderValue = useCallback(
    (value) => {
      // 🟢 If "full" mode — always show the complete text
      if (valueLength === "full") {
        return (
          <div className={isMobile ? "mb-2" : ""}>
            <div className="labelPicker">{label}</div>
            <div className="valueName" style={{ ...style, whiteSpace: "pre-wrap" }}>
              {value}
            </div>
          </div>
        );
      }

      // 🟡 If value longer than allowed length → show tooltip
      if (value?.length > valueLength) {
        const safeId = `labelInput-${label.replace(/[^A-Za-z0-9]+/g, "")}`;
        return (
          <>
            <Tooltip target={`#${safeId}`} position="top" content={value} event="hover" />
            <div className="labelPicker">{label}</div>
            <div className="valueName" id={safeId}>
              {value.substring(0, valueLength) + "..."}
            </div>
          </>
        );
      }

      // 🟣 Default (normal short value)
      return (
        <div className={isMobile ? "mb-2" : ""}>
          <div className="labelPicker">{label}</div>
          <div className="valueName" style={style}>
            {value}
          </div>
        </div>
      );
    },
    [value, label, valueLength, isMobile, style]
  );

  return (
    <div className={className} style={{ position: "relative" }}>
      {renderValue(value)}
    </div>
  );
}

export default LabeledInput;
