

import React, { useEffect, useState } from "react";
import { t } from "i18next";
import Heading from "../../UI/Heading";
import ReactSelect from "../../formComponent/ReactSelect";
import { notify } from "../../../utils/ustil2";
import { GetAllClasses, GetAllSections } from "../../../networkServices/AcademicYear";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import DatePicker from "../../formComponent/DatePicker";

const RegToAdmission = ({ handleChangeModel }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [classes, setClasses] = useState([]);
  const [values, setValues] = useState({
    class_Name: { label: "", value: "" },
    branch: "",
    Date: new Date(),
    Section: { label: "", value: "" },
  });


  const [allSection, setAllSection] = useState([]);
  const getClass = async () => {
    try {
      const res = await GetAllClasses();
      if (res?.success) setClasses(res?.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching classes", "error");
    }
  };

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };

  const handleChange = (e,) => {

    const { name, value } = e.target

    setValues((prev) => ({ ...prev, [name]: value }));

  };
 

  useEffect(() => {
    handleChangeModel(values)
  }, [values])

  const getData = async () => {

    try {
      const response = await GetAllSections();
      if (response?.success) {
        setAllSection(response?.data)
      } else {
        notify(response?.message, "error");
        setAllSection([])
      }
    } catch (error) {
      notify("Error saving reason", "error");
    }
  };
  useEffect(() => {
    getData();
      getClass();
  }, []);


  return (
    <>
      <div className="card border">
        {/* <Heading title={t("Exam Timetable")} /> */}
        <div className="card-body">
          <div className="row">
           
            <ReactSelect
              placeholderName={t("Class")}
              name="class_Name"
              respclass="col-xl-4 col-md-4 col-sm-4 col-12"
              dynamicOptions={handleReactSelectDropDownOptions(classes, "className", "id")}
              handleChange={handleSelect}
              value={values.class_Name}
            />
            <ReactSelect
              placeholderName={t("Section")}
              name="Section"
               respclass="col-xl-4 col-md-4 col-sm-4 col-12"
              dynamicOptions={handleReactSelectDropDownOptions(allSection?.filter((e) => e?.classId === values?.class_Name?.value), "sectionName", "id")}
              handleChange={handleSelect}
              value={values.Section}
            />
            <DatePicker
              id="Date"
              name="Date"
              placeholder={VITE_DATE_FORMAT}
              lable={t("Date")}
              className="custom-calendar"
              value={values?.Date}
              handleChange={handleChange}
              respclass="col-xl-4 col-md-4 col-sm-4 col-12"
              maxDate={new Date()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegToAdmission;

