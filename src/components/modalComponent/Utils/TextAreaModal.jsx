import React, { useEffect } from "react";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";

export default function TextAreaModal({ handleChangeModel, modalData, label }) {
  const { t } = useTranslation();

  const [newReason, setNewReason] = React.useState(modalData?.insufficientRemarks || "");

  useEffect(() => {
    // only update parent modal state with current input
    handleChangeModel((prev) => ({
      ...prev,
      modalData: {
        ...prev.modalData,
        insufficientRemarks: newReason,
      },
    }));
  }, [newReason]);
  return (
    <div>
      <TextAreaInput
        // placeholder={t("Enter Reason . . .")}
        className="w-100 required-fields mt-2"
        id="newReason"
        lable={label || t("Reason")}
        rows={4}
        respclass="w-100"
        name="newReason"
        value={newReason ? newReason : ""}
        onChange={(e) => setNewReason(e.target.value)}
        maxLength={1000}
      />
    </div>
  );
}
