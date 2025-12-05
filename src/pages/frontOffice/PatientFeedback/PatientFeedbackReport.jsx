import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { PatientFeedBackReportApi } from "../../../networkServices/cardPrint";
import PatientFeedbackTable from "./PatientFeedbackTable";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindEmployeeFeedBack } from "../../../networkServices/edpApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";

export default function PatientFeedbackReport() {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [inputs, setInputs] = useState({
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    patientID: "",
    roleID: "",
    ipdno: "",
    type: "",
    Status: { label: "All", value: "0" },
    PatientType: { label: "All", value: "0" }
  });
  const [dropDownState, setDropDownState] = useState({
    BindEMP: [],
  });
  const [bodyData, setBodyData] = useState([]);

  const TYPE = [
    { value: "1", label: "UHID" },
    { value: "2", label: "IPDNo" },
  ];

  const handleChange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const getBindEmployeeFeedBack = async () => {
    try {
      const response = await BindEmployeeFeedBack();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          BindEMP: handleReactSelectDropDownOptions(
            response?.data,
            "NAME",
            "EmployeeID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong!");
    }
  };
  useEffect(() => {
    getBindEmployeeFeedBack();
  }, []);
  const searchApiCall = async () => {

    if (inputs.ipdno && !inputs.type.value) {
      notify("Plese Select Type ", "warn")
      return;
    }

    let requestBody = {
      fromDate: moment(inputs?.fromDate).format("YYYY-MM-DD"),
      //   toDate: new Date(inputs?.toDate),
      toDate: moment(inputs?.toDate).format("YYYY-MM-DD"),
      patientID: inputs?.type?.value == '1' ? inputs?.patientID : inputs.ipdno,
      employeeID: inputs?.roleID?.EmployeeID ?? "",
      type: inputs?.type?.value ? inputs?.type?.value : 0,
      Status: inputs?.Status?.value ?? "",
      PatientType: Number(inputs?.PatientType?.value) ?? 0
    };

    try {
      let res = await PatientFeedBackReportApi(requestBody);
      console.log("res", res);
      if (res?.success) {
        setBodyData(res?.data);
      } else {
        notify(res?.message, "error");
        setBodyData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (name, value) => {
    setInputs((val) => ({ ...val, [name]: value }));
    // console.log("name",name,value)
    // if(name==="centreId"){
    //     getBindEmplyee(value?.value)
    // }
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("Search_Criteria")}
          isBreadcrumb={true}
        // secondTitle={
        //   <div className="d-flex">
        //     <div className="PhotoUploaded"></div>
        //     <span className="text-dark ml-2 mt-1 ">Patient Feedback Report </span>
        //   </div>
        // }
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={false}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={TYPE}
            handleChange={handleSelect}
            value={`${inputs?.type?.value}`}
            name={"type"}
          />
          {inputs?.type?.value === '1' ?
            <Input
              type="text"
              className="form-control"
              id="patientID"
              name="patientID"
              lable={t("UHID")}
              placeholder=" "
              value={inputs?.patientID}
              onChange={handleChange}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            :
            <Input
              type="text"
              className="form-control"
              id="ipdNo"
              name="ipdno"
              lable={t("IPDNo")}
              placeholder=" "
              value={inputs?.ipdno}
              onChange={handleChange}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

          }
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            value={moment(inputs?.fromDate).toDate()}
            handleChange={handleChange}
            lable={t("fromDate")}
            placeholder={VITE_DATE_FORMAT}
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            value={moment(inputs?.toDate).toDate()}
            handleChange={handleChange}
            lable={t("toDate")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("Taken By")}
            id={"Department"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            // requiredClassName="required-fields"
            dynamicOptions={dropDownState?.BindEMP}
            name={"roleID"}
            value={inputs.roleID}
            handleChange={handleSelect}

          //   handleChange={handleReactSelectChange}
          />
          {console.log("inputs", inputs)}
          <ReactSelect
            placeholderName={t("Status")}
            id={"Status"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            // requiredClassName="required-fields"
            dynamicOptions={
              [{ label: "All", value: "0" },
              { label: "Good", value: "5" },
              { label: "V.Good", value: "6" },
              { label: "Average", value: "7" },
              { label: "Poor", value: "1" },
              { label: "Very Poor", value: "2" },
              { label: "Close", value: "3" },
              { label: "Open", value: "4" },

              ]}
            name={"Status"}
            value={inputs.Status?.value}
            handleChange={handleSelect}

          //   handleChange={handleReactSelectChange}
          />
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"PatientType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            // requiredClassName="required-fields"
            dynamicOptions={
              [{ label: "All", value: "0" },
              { label: "OPD", value: "1" },
              { label: "IPD", value: "2" },
              ]}
            name={"PatientType"}
            value={inputs.PatientType?.value}
            handleChange={handleSelect}

          //   handleChange={handleReactSelectChange}
          />
          <button
            className="btn btn-sm btn-info ml-2"
            type="button"
            onClick={searchApiCall}
          >
            {t("search")}
          </button>

        </div>



      </div>

      {bodyData?.length > 0 ? (
        <div>
          <Heading
            title={t("Patient Feed Back Reports ")}
            isBreadcrumb={false}
            secondTitle={
              <>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#ffff00"}
                    label={t("Average")}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#09a115"}
                    label={t("Closed")}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#ffb6c1"}
                    label={t("Feedback content poor/very poor")}
                  />
                </span>
              </>}
          // secondTitle={
          //   <div className="d-flex">
          //     <div className="PhotoUploaded"></div>
          //     <span className="text-dark ml-2 mt-1 ">Patient Feedback Report </span>
          //   </div>
          // }
          />
          <PatientFeedbackTable setBodyData={setBodyData} bodyData={bodyData} refreshData={searchApiCall} />
        </div>
      ) : null}
    </>
  );
}
