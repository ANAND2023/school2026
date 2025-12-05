import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

export default function RadiologyOutboxModal({ handleChangeModel, inputData }) {


  const {empName} = useLocalStorage("userData", "get")
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };


  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

  useEffect(() => {
    setInputs((val) => ({ ...val, Technician: empName }));
  },[empName])



  return (
    <>
      <div className="row p-2">
        <TextAreaInput
          lable={t("Enter Technician Name")}
          className="w-100 required-fields"
          id="Technician"
          rows={4}
          respclass="w-100"
          name="Technician"
          value={inputs?.Technician ? inputs?.Technician : ""}
          onChange={handlechange}
          maxLength={1000}
        />
      </div>

    </>

  );
}
