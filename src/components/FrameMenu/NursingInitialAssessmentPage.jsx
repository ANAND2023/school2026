import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import LabeledInput from "../formComponent/LabeledInput";
import Input from "../formComponent/Input";
import TextAreaInput from "../formComponent/TextAreaInput";
import { GetNursingFormMasterAPI, NursingFormEntryAPI, NursingGetFormEntryAPI, NursingGetPreviousMedicineEntryAPI, NursingPreviousMedicineEntryAPI } from "../../networkServices/nursingWardAPI";
import Heading from "../UI/Heading";
import Tables from "../UI/customTable";
import DatePicker from "../formComponent/DatePicker";
import moment from "moment";
import TimePicker from "../formComponent/TimePicker";
import { notify, NursingFormEntryPayload, NursingPreviousMedicineEntryPayload } from "../../utils/ustil2";
import { timeFormateDate } from "../../utils/utils";
import DynamicAssessmentSection from "../modalComponent/Utils/DynamicAssessmentSection";
import { Checkbox } from "primereact/checkbox";

export default function NursingInitialAssessmentPage({ data }) {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [isUpdate, setIsUpdate] = useState(false)
  const [nursingGetFormEntryData, setNursingGetFormEntry] = useState([])
  const [values, setValues] = useState({ C: [] });
  const [glasgowComaScale, setGlasgowComaScale] = useState({});
  const [fallRiskAssessment, setFallRiskAssessment] = useState({});
  const [pressureUlcerAssessment, setPressureUlcerAssessment] = useState({});


  const sanitizeId = (str) => str.replace(/[^a-zA-Z0-9-_]/g, "_");

  const getCColor = (value) => {
    if (value >= 4) return { backgroundColor: "#73D673", color: "#FFFFFF" };
    if (value === 3) return { backgroundColor: "#D9EF8B", color: "#000000" };
    if (value === 2) return { backgroundColor: "#fee08b", color: "#000000" };
    return { backgroundColor: "#F7665E", color: "#FFFFFF" };
  };

  const getFColor = (value) => {
    if (value <= 5) return { backgroundColor: "#73D673", color: "#FFFFFF" };
    if (value <= 15) return { backgroundColor: "#fee08b", color: "#000000" };
    return { backgroundColor: "#F7665E", color: "#FFFFFF" };
  };

  const getHColor = (value) => {
    if (value >= 4) return { backgroundColor: "#73D673", color: "#FFFFFF" };
    if (value >= 2 && value < 4) return { backgroundColor: "#fee08b", color: "#000000" };
    return { backgroundColor: "#F7665E", color: "#FFFFFF" };
  };
  const sectionConfig = {
    C: {
      state: glasgowComaScale,
      setState: setGlasgowComaScale,
      getColor: getCColor,
    },
    F: {
      state: fallRiskAssessment,
      setState: setFallRiskAssessment,
      getColor: getFColor,
    },
    H: {
      state: pressureUlcerAssessment,
      setState: setPressureUlcerAssessment,
      getColor: getHColor,
    },
  };



  const initailValue = {
    // Age: "12",
    Type: { value: "C" }
  };
  const [payload, setPayload] = useState({ ...initailValue });
  const [medicationTableData, setMedicationTableData] = useState([
    {
      Medicine: "",
      Dosage: "",
      Frequency: "",
      DateOfLastDose: "",
      TimeOfLastDose: "",
      isNotKnown: false,
    },
  ]);
  const handleReactSelect = async (name, value) => {
    if (name === "Type") {
      const apiResp = await GetNursingFormMasterAPI(value?.value);
      if (value?.value === "I") {
        getNursingGetPreviousMedicineEntry()
      }
      if (apiResp?.success) {
        setValues((val) => ({
          ...val,
          [apiResp?.data[0]["Type"]]: apiResp?.data,
        }));
        // setGlasgowComaScale({});
      }
      // setPayload(initailValue);
    }

    setPayload((val) => ({ ...val, [name]: value }));
  };

  console.log("adscssf", fallRiskAssessment, pressureUlcerAssessment, glasgowComaScale)


  useEffect(() => {
    const filterdata = nursingGetFormEntryData?.filter((val) => val?.Type === payload?.Type?.value)
    if (filterdata?.length > 0) {
      setIsUpdate(true)
    } else {
      setIsUpdate(false)
    }
  }, [payload?.Type?.value, nursingGetFormEntryData])



  const handleInputChange = (e, index, label) => {
    // debugger
    const updatedData = JSON.parse(JSON.stringify(medicationTableData));
    updatedData[index][label] = e.target.value;
    const isLastRow = index === updatedData.length - 1;
    // const isMedicineField = label === "Medicine";
    // const hasValue = e?.target?.value?.trim() !== "";

    if (isLastRow && (label === "Medicine")) {
      updatedData.push({
        Medicine: "",
        Dosage: "",
        Frequency: "",
        DateOfLastDose: "",
        TimeOfLastDose: "",
      });
    }

    setMedicationTableData(updatedData);
  };

  const handleDeleteRow = async (index, val) => {
    NursingPreviousMedicineEntry(val?.FormEntryID)
    const updatedData = [...medicationTableData];
    updatedData.splice(index, 1);
    setMedicationTableData(updatedData);
  };

  const TypeData = [
    { label: "Glasgow Coma Scale", value: "C" },
    { label: "Allergy/Adverse Reaction", value: "D" },
    { label: "Fall Risk Assessment", value: "F" },
    { label: "Skin Alteration Assessment", value: "G" },
    { label: "Pressure Ulcer Risk Assessment", value: "H" },
    { label: "Current Medication", value: "I" },
  ];

  const medicationTHEAD = [
    { name: "S.No", width: "5%" },
    { name: "Medication" },
    { name: "Dosage" },
    { name: "Frequency" },
    { name: "Date of Last Dose", width: "15%" },
    { name: "Time of Last Dose", width: "15%" },
    { name: "Not known", width: "2%" },
    { name: "Action", width: "5%" },
  ];
  const TotalScore = (name, value, PayloadData) => {
    let totalScore = Object.keys(PayloadData)?.reduce((acc, val) => {
      if (val !== name) {
        acc += PayloadData[val]["value"]
          ? Number(PayloadData[val]["value"])
          : 0;
      }
      return acc;
    }, 0);
    totalScore += value?.value ? Number(value?.value) : 0;
    return totalScore;
  };


  function parseStringToLabelValueArray(str) {
    const formattedStr = str.replace(/'/g, '"');
    const arr = JSON.parse(formattedStr);
    return arr.map((item) => {
      const [value, label] = item.split("#");
      return { label: label.trim(), value: value.trim() };
    });
  }


  const handleSave = async () => {
    const payloaddata = NursingFormEntryPayload(
      data,
      payload,
      values,
      medicationTableData,
      glasgowComaScale,
      fallRiskAssessment, 
      pressureUlcerAssessment 
    )
    const apiResp = await NursingFormEntryAPI(payloaddata)
    if (apiResp?.success) {
      notify(apiResp?.message, "success")
    } else {
      notify(apiResp?.message, "error")
    }
  }

  const NursingPreviousMedicineEntry = async (FormEntryID) => {
    const payloadData = NursingPreviousMedicineEntryPayload(data, medicationTableData, FormEntryID)
    const apiResp = await NursingPreviousMedicineEntryAPI(payloadData)
    if (apiResp?.success) {
      notify(apiResp?.message, "success")
    } else {
      notify(apiResp?.message, "error")
    }
  }

  const NursingGetFormEntry = async () => {
    let apiResp = await NursingGetFormEntryAPI(data?.transactionID)
    if (apiResp?.success) {
      setNursingGetFormEntry(apiResp?.data)
      handleReactSelect("Type", { value: "C" })
      let PayloadDataTYpeC = {}
      let PayloadDataAllTYpe = {}
      apiResp?.data?.map((val) => {
        if (val?.Type === "C") {
          PayloadDataTYpeC[val.FieldName] = { label: val?.ResponseText ? val?.ResponseText : "", value: val?.Response ? val?.Response : "", FormEntryID: val?.FormEntryID, isUpdate: true }
        } else {
          PayloadDataAllTYpe[val.FieldName] = { label: val?.ResponseText ? val?.ResponseText : "", value: val?.Response ? val?.Response : "", FormEntryID: val?.FormEntryID, isUpdate: true }
          PayloadDataAllTYpe[`${val.FieldName} Remark`] = val?.Remark
          PayloadDataAllTYpe["location"] = val?.Location ? val?.Location : ""
          PayloadDataAllTYpe["NameOfRelative"] = val?.RelativeName ? val?.RelativeName : ""
          PayloadDataAllTYpe["Sign"] = val?.Sign ? val?.Sign : ""
          PayloadDataAllTYpe["Relationship"] = val?.Relation ? val?.Relation : ""
          PayloadDataAllTYpe["PhoneNo"] = val?.PhoneNo ? val?.PhoneNo : ""


        }
      })
      setPayload((val) => ({ ...val, ...PayloadDataTYpeC, ...PayloadDataAllTYpe }))
      setGlasgowComaScale((val) => ({
        ...PayloadDataTYpeC,
        TotalScoreSum: TotalScore("", "", PayloadDataTYpeC),
      }));
    }
  }

  const getNursingGetPreviousMedicineEntry = async () => {
    let apiResp = await NursingGetPreviousMedicineEntryAPI(data?.transactionID)
    if (apiResp?.success) {


      setIsUpdate(true);
      let data = apiResp?.data?.map((val) => {
        val.TimeOfLastDose = timeFormateDate(val?.DateTimeofLastDose?.split("#")[1])
        val.DateOfLastDose = new Date(val?.DateTimeofLastDose?.split("#")[0])
        val.Medicine = val?.Medication
        val.Dosage = val?.Dose
        val.isNotKnown = val?.isNotKnown === 1 ? true : false;
        return val
      })
      setMedicationTableData(data)
    } else {
    }
  }

  const selectedType = payload?.Type?.value;
  const config = sectionConfig[selectedType];


  useEffect(() => {
    NursingGetFormEntry()
  }, [])


  return (
    <div className="card patient_registration border">
      {/* <Heading title={t("Nursing Initial Assessment")} isBreadcrumb={false} /> */}
      <div className="row mt-2 p-1">
        <ReactSelect
          placeholderName={t("Type")}
          id={"Type"}
          name="Type"
          value={payload?.Type?.value}
          removeIsClearable={false}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={TypeData}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        {/* Dynamic Assessment Section */}


        {config && (
          <DynamicAssessmentSection
            type={selectedType}
            fields={values?.[selectedType] || []}
            state={config.state}
            setState={config.setState}
            parseStringToLabelValueArray={parseStringToLabelValueArray}
            sanitizeId={sanitizeId}
            data={data}
            getColor={config.getColor}
          />
        )}


        {/* Allergy/Adverse Reaction */}
        {payload?.Type?.value === "D" &&
          values?.D?.length > 0 && values?.D?.map((ele, index) => (
            <>
              <ReactSelect
                placeholderName={ele.LabelName}
                id={ele.LabelName}
                name={ele.LabelName}
                value={payload[ele.LabelName]?.value}
                removeIsClearable={false}
                handleChange={(name, value) => {
                  handleReactSelect(name, value, ele);
                }}
                dynamicOptions={parseStringToLabelValueArray(ele?.Values)}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              {payload[ele.LabelName]?.value === "1" && ele?.IsTextAreaRequired && (
                <TextAreaInput
                  id={`${ele.LabelName} Remark`}
                  lable={`${ele.LabelName} Remark`}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12 "
                  name={`${ele.LabelName} Remark`}
                  className="w-100 h-24 mx-2"
                  value={payload?.[`${ele.LabelName} Remark`] ? payload?.[`${ele.LabelName} Remark`] : ""}
                  onChange={(e) => { handleReactSelect(e.target.name, e.target.value) }}
                  placeholder=" "
                />
              )}
            </>
          ))}




        {/* Skin Alteration Assessment */}
        {payload?.Type?.value === "G" && (
          values?.G?.length > 0 && values?.G?.map((ele, index) => (
            <>
              <ReactSelect
                placeholderName={ele?.LabelName}
                id={ele?.LabelName}
                name={ele?.LabelName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                value={payload[ele?.LabelName]?.value}
                dynamicOptions={parseStringToLabelValueArray(ele?.Values)}
                removeIsClearable={false}
                handleChange={(name, e) => handleReactSelect(name, e)}
              />
              {payload[ele.LabelName]?.value === "1" && ele?.IsTextAreaRequired && (
                <TextAreaInput
                  id={`${ele.LabelName} Remark`}
                  lable={`${ele.LabelName} Remark`}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  name={`${ele.LabelName} Remark`}
                  className="w-100 h-24 mx-2"
                  value={payload?.[`${ele.LabelName} Remark`] ? payload?.[`${ele.LabelName} Remark`] : ""}
                  onChange={(e) => { handleReactSelect(e.target.name, e.target.value) }}
                  placeholder=" "
                />
              )}
            </>
          ))
        )}



        {/* {console.log("payload", payload?.Type)} */}
        {payload?.Type?.value !== "I" && <button
          disabled={data?.status === "OUT" ? true : false}
          className="btn btn-primary ml-2" onClick={handleSave}>{isUpdate ? t("Update") : t("Save")}</button>}

      </div>
      {
        payload?.Type?.value === "I" && (
          <>
            <Tables
              thead={medicationTHEAD}
              tbody={medicationTableData?.map((val, index) => {
                return {
                  SNo: index + 1,
                  Medicine: (
                    <Input
                      type="text"
                      className={"table-input"}
                      removeFormGroupClass={true}
                      placeholder=" "
                      name="Medicine"
                      onChange={(e) => handleInputChange(e, index, "Medicine")}
                      value={val?.Medicine}
                      respclass="col-12"
                    />
                  ),
                  Dosage: (
                    <Input
                      type="text"
                      className={"table-input"}
                      removeFormGroupClass={true}
                      placeholder=" "
                      name="Dosage"
                      onChange={(e) => handleInputChange(e, index, "Dosage")}
                      value={val?.Dosage}
                    />
                  ),
                  Frequency: (
                    <Input
                      type="text"
                      className={"table-input"}
                      removeFormGroupClass={true}
                      placeholder=" "
                      name="Frequency"
                      onChange={(e) => handleInputChange(e, index, "Frequency")}
                      value={val?.Frequency}
                    />
                  ),
                  "Date of Last Dose": (
                    <DatePicker
                      className={` table-calender-height mt-1`}
                      respclass=" w-100"
                      id="DateOfLastDose"
                      name="DateOfLastDose"
                      handleChange={(e) => handleInputChange(e, index, "DateOfLastDose")}
                      // value={val?.DateOfLastDose?val?.DateOfLastDose:""}
                      value={
                        val?.DateOfLastDose
                          ? moment(val?.DateOfLastDose).toDate()
                          : ""
                      }
                      // handleChange={(e) => {
                      //   const dateInput = e.target.value;

                      //   setValues((prev) => ({
                      //     ...prev,
                      //     dateOfVisit: moment(dateInput).toDate(), // Ensure state updates
                      //   }));
                      // }}
                      placeholder={VITE_DATE_FORMAT}
                    />
                  ),
                  "Time of Last Dose": (
                    <TimePicker
                      respclass=" w-100 "
                      id="TimeOfLastDose"
                      name="TimeOfLastDose"
                      // value={val?.TimeOfLastDose}
                      value={
                        val?.TimeOfLastDose
                          ? moment(val?.TimeOfLastDose).toDate()
                          : ""
                      }
                      handleChange={(e) => handleInputChange(e, index, "TimeOfLastDose")}
                      // handleChange={handleChange}
                      className="table-time"
                    />
                  ),
                  checkbox: (
                    <Checkbox
                      name="isNotKnown"
                      checked={val?.isNotKnown || false}
                      onChange={(e) => {
                        const updatedData = [...medicationTableData];
                        updatedData[index].isNotKnown = e.checked;
                        setMedicationTableData(updatedData);
                      }
                      }
                    />
                  ),
                  Action: (
                    <i
                      className="fa fa-trash text-danger"
                      onClick={() => handleDeleteRow(index, val)}
                    ></i>
                  ),
                };
              })}
            />
          </>
        )
      }

      {/* {payload?.Type?.value !== "I" && values?.[selectedType][0]?.Notes?.length > 0 && ( 

        <div> 
      <div
        dangerouslySetInnerHTML={{ __html: values?.[selectedType][0]?.Notes }}
        style={{padding: '10px' }}
      />
    </div>
        //   <span style={{paddingLeft:10,fontWeight:"bolder"}}>Notes: {values?.[selectedType][0]?.Notes}</span>
        )} */}


      {payload?.Type?.value !== "I" &&
        Array.isArray(values?.[selectedType]) &&
        values[selectedType].length > 0 &&
        values[selectedType][0]?.Notes?.length > 0 && (
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: values[selectedType][0].Notes }}
              style={{ padding: '10px' }}
            />
          </div>
        )}







      <div className="text-right mt-2 mb-2">
        {payload?.Type?.value === "I" && <button className="btn btn-primary ml-2 px-3" onClick={NursingPreviousMedicineEntry}>{isUpdate ? t("Update") : t("Save")}</button>}
      </div>
    </div >
  );
}
