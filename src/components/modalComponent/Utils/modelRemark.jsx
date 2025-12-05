import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../formComponent/Input";
const ModelRemark = ({ handleChangeModel, inputData }) => {
  const { t } = useTranslation();

  const [values, setValues] = useState({
    id: inputData?.Id,
    type: 3,
    advanceReason: inputData?.advanceReason || "",
  });

  useEffect(() => {
    if (inputData) {
      handleChangeModel(values);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    handleChangeModel(updatedValues);
  };

  return (
    <div className="row p-2">
      <Input
        type="text"
        className="form-control required-fields"
        id="advanceReason"
        name="advanceReason"
        label={t("Reason")}
        placeholder={t("Enter reason")}
        value={values?.advanceReason || ""}
        onChange={handleChange}
        respclass="col-12"
      />
    </div>
  );
};

export default ModelRemark;
