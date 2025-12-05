import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import Input from "../formComponent/Input";
import TextAreaInput from "../formComponent/TextAreaInput";
import Tables from "../UI/customTable";
import {
  PrintVitalSignChart,
  SaveVitalSignChart,
  SearchVitalSignChart,
  UpdateVitalSignChart,
} from "../../networkServices/nursingWardAPI";
import {
  MOBILE_NUMBER_VALIDATION_REGX,
  NUMBER_VALIDATION_REGX,
} from "../../utils/constant";
import {
  inputBoxValidation,
  notify,
  payloadVitalSignChart,
} from "../../utils/utils";
import moment from "moment";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";
import VitalCharts from "../commonComponents/VitalCharts";
import ReactSelect from "../formComponent/ReactSelect";

export default function ({ data }) {
  const {admitDate}=data
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const thead = [
    { width: "1%", name: t("SNo") },
    t("Date"),
    t("Time"),
    t("Department"),
    t("Temperature"),
    t("Pulse"),
    t("Resp"),
    t("BP"),
    // t("BloodSugar"),
    t("Weight"),
    t("Oxygen"),
    t("pain Score"),
    t("Height"),
    t("Initial Assessment"),
    // t("BSA"),
    t("Comments"),
    t("EntryBy"),
    t("Edit"),
  ];

  const initialValue = {
    transactionID: data?.transactionID,
    patientID: data?.patientID,
    IsIntialAssessment: 2,
    type: "save",
  }
  const [tbody, setTbody] = useState([]);
  const [values, setValues] = useState(initialValue);

  const handleEdit = (val) => {
    const date = new Date();
    if (val?.Time) {
      const [hours, minutes, period] = val?.Time.match(
        /(\d+):(\d+)\s*(AM|PM)/i
      ).slice(1);
      date.setHours(
        period === "PM" && hours !== "12"
          ? +hours + 12
          : hours === "12" && period === "AM"
            ? 0
            : +hours
      );
      date.setMinutes(+minutes);
    }

    setValues({
      ...val,
      ...{
        transactionID: data?.transactionID,
        patientID: data?.patientID,
        Comments: val?.comments,
        painScore: val?.PainScore,
        SPO2: val?.Oxygen,
        type: "edit",
        Time: date,
        DATE: new Date(val?.DATE),
        IsIntialAssessment: val?.IsInitialAssessment ? val?.IsInitialAssessment : 1,
      },
    });
  };

  const SearchVitalSignChartAPI = async () => {
    let apiResp = await SearchVitalSignChart(data?.transactionID, 1);
    if (apiResp?.success) {
      let data = [];
      apiResp?.data?.map((val, i) => {
        let obj = {};
        obj.sno = i + 1;
        obj.DATE = val?.DATE;
        obj.Time = val?.Time;
        obj.RoleName = val?.RoleName;
        obj.Temp = val?.Temp;
        obj.pulse = val?.pulse;
        obj.resp = val?.resp;
        obj.BP = val?.BP;
        // obj.BloodSugar = val?.BloodSugar??"";
        obj.Weight = val?.Weight;
        obj.Oxygen = val?.Oxygen;
        obj.painScore = val?.PainScore,
          obj.Height = val?.Height;
        obj.IsInitialAssessment = val?.IsInitialAssessmentText ? val?.IsInitialAssessmentText : "";
          // obj.BSA = val?.BSA??"";
        obj.Comments = val?.comments;
        obj.Username = val?.Username;
        obj.edit = (
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => {
              handleEdit(val);
            }}
          ></i>
        );
        data.push(obj);
      });
      // setVitalSignList(apiResp?.data)
      setTbody(data);
    } else {
      setTbody([]);
    }
  };
  useEffect(() => {
    SearchVitalSignChartAPI();
  }, []);

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values?.Temp) {
      errors.Temp = "Temp Is Required";
    }
    if (!values?.pulse) {
      errors.pulse = "pulse Is Required";
    }
    if (!values?.resp) {
      errors.resp = "resp Is Required";
    }
    // if (!values?.Weight) {
    //   errors.PanelCardName = "Weight Is Required";
    // }
    // if (!values?.Height) {
    //   errors.Height = "Height Is Required";
    // }

    return errors;
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues((val) => ({ ...val, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value, type, min, max } = e.target;

    let newValue = value;

    if (type === "number") {
      const numVal = parseFloat(value);

      if (min && numVal < parseFloat(min)) {
        newValue = min;
      }

      if (max && numVal > parseFloat(max)) {
        newValue = max;
      }
    }

    setValues((val) => ({ ...val, [name]: newValue }));
  };


  const handleReactSelect = (name, vf) => {
    debugger;
    setValues((val) => ({ ...val, [name]: vf ? vf.value : null }));

  };
  console.log("values", values);

  const SaveVitalSignChartAPI = async (type) => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
      }
      return false;
    }
    let payload = payloadVitalSignChart(values);
    debugger;
    payload = {
      ...payload,
      IsInitialAssessment: values?.IsIntialAssessment ? values?.IsIntialAssessment : 1,
    };

    console.log("payload", payload);
    let apiResp;
    if (type === "save") {
      apiResp = await SaveVitalSignChart(payload);
    } else {
      // console.log("Asdsd", payload)
      apiResp = await UpdateVitalSignChart(payload);
    }
    if (apiResp?.success) {
      SearchVitalSignChartAPI();
      setValues(initialValue);
      notify(apiResp.message, "success");
    } else {
      notify(apiResp.message, "error");
    }
  };

  const handleVitalPrintOut = async () => {
    // debugger
    let payloadData = {
      tid: data?.transactionID,
      reportType: 0
    }
    const apiResp = await PrintVitalSignChart(payloadData);
    if(apiResp?.success){
  RedirectURL(apiResp.data.pdfUrl);
    }
    else{
      notify(apiResp?.message,"error")
    }
  
  }

  useEffect(() => {
    if (!values?.Weight || !values?.Height) {
      setValues((val) => ({ ...val, bmiValue: null }))
    } else {
      const heightInMeters = parseFloat(values?.Height) / 100;
      const bmiValue = (parseFloat(values?.Weight) / (heightInMeters * heightInMeters)).toFixed(2);
      setValues((val) => ({ ...val, bmiValue: bmiValue }))
      let bmiStatus = '';
      if (bmiValue < 18.5) {
        bmiStatus = 'Underweight';
      } else if (bmiValue < 24.9) {
        bmiStatus = 'Normal weight';
      } else if (bmiValue < 29.9) {
        bmiStatus = 'Overweight';
      } else {
        bmiStatus = 'Obesity';
      }
      setValues((val) => ({ ...val, bmiStatus: bmiStatus }))
    }
  }, [values?.Weight, values?.Height]);
const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <form className="patient_registration card">
          {/* <Heading
            title={t("Vital Sign Initial Assessment")}
            isBreadcrumb={false}
          /> */}

          <div className="row p-2">
            <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
              <DatePicker
                className={`custom-calendar `}
                respclass="vital-sign-date"
                id="Date"
                name="DATE"
                inputClassName={"required-fields"}
                value={values?.DATE ? values?.DATE : new Date()}
                handleChange={handleChange}
                lable={t("Date")}
                placeholder={VITE_DATE_FORMAT}
                 minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
              maxDate={new Date()}
              />
              <TimePicker
                placeholderName={t("Time")}
                lable={t("Time")}
                id="Time"
                respclass="vital-sign-time ml-1"
                name="Time"
                value={values?.Time ? values?.Time : new Date()}
                // value={new Date(`1970-01-01T00:00:00`)}
                handleChange={handleChange}
              />
            </div>

            <Input
              type="text"
              className="form-control required-fields"
              id="Temp"
              name="Temp"
              value={values?.Temp ? values?.Temp : ""}
              onChange={handleChange}
              // onChange={(e) => { inputBoxValidation(NUMBER_VALIDATION_REGX, e, handleChange) }}
              lable={t("Temp")}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderLabel={"°F"}
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="pulse"
              name="pulse"
              value={values?.pulse ? values?.pulse : ""}
              onChange={handleChange}
              lable={t("Pulse")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"Rate/Min"}
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="Resp"
              name="resp"
              value={values?.resp ? values?.resp : ""}
              onChange={handleChange}
              lable={t("Resp")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"Rate/Min"}
            />
            <Input
              type="text"
              className="form-control "
              id="BP"
              name="BP"
              value={values?.BP ? values?.BP : ""}
              onChange={handleChange}
              lable={t("BP")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"mm/Hg"}
            />
            {/* <Input
              type="text"
              className="form-control "
              id="Wounds"
              name="wound"
              value={values?.wound ? values?.wound : ""}
              onChange={handleChange}
              lable={t("Wounds")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
            /> */}

            {/* <Input
              type="text"
              className="form-control "
              id="BloodSugar"
              name="BloodSugar"
              value={values?.BloodSugar ? values?.BloodSugar : ""}
              onChange={handleChange}
              lable={t("BloodSugar")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"mmol/L"}
            /> */}
            <Input
              type="number"
              className="form-control"
              id="Weight"
              name="Weight"
              value={values?.Weight ? values?.Weight : ""}
              onChange={handleChange}
              lable={t("Weight")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"kg"}
            />

            <Input
              type="text"
              className="form-control "
              id="SPO2"
              name="SPO2"
              value={values?.SPO2 ? values?.SPO2 : ""}
              onChange={handleChange}
              lable={t("SPO2")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"%"}
            />
            <Input
              type="number"
              className="form-control required-fields"
              id="painScore"
              name="painScore"
              value={values?.painScore ? values?.painScore : ""}
              onChange={handleChange}
              lable={t("painScore")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"/10"}
              max={10}
              maxLength={2}
            />
            <Input
              type="number"
              className="form-control"
              id="Height"
              name="Height"
              value={values?.Height ? values?.Height : ""}
              onChange={handleChange}
              lable={t("Height")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=""
              placeholderLabel={"CM"}
            />
            {/* <Input
              type="text"
              className="form-control "
              id="BSA"
              name="BSA"
              value={values?.BSA ? values?.BSA : ""}
              onChange={handleChange}
              lable={t("BSA")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholder=" "
              placeholderLabel={"m²"}
            /> */}

            {values?.bmiValue &&
              <div className="col-md-3 d-flex align-items-center justify-content-end">
                <p style={{ color: "red", fontWeight: "bold", margin: "0" }}>BMI Calculate: {values?.bmiValue}</p>
              </div>}

            <TextAreaInput
              type="text"
              className={`form-textarea `}
              id="Comments"
              name="Comments"
              value={values?.Comments ? values?.Comments : ""}
              onChange={handleChange}
              lable={t("Comments")}
              placeholder=" "
              respclass=" col-12"
            />
            <ReactSelect
              label={t("Assessment Type")} 
              className="form-control required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id="IsIntialAssessment"
              name={"IsIntialAssessment"}
              value={values?.IsIntialAssessment}
              handleChange={handleReactSelect}
              dynamicOptions={[
                { value: 1, label: t("Initial Assesment") },
                { value: 2, label: t("ReAssesment") },
              ]}
            />
          </div>
          <div className="ml-2 mb-2">
            <button
              className="btn btn-sm btn-success ml-2"
              type="button"
              style={{ float: "right" }}
              onClick={handleVitalPrintOut}
            >
              {t("Print")}
            </button>

            {values?.type === "save" ? (
              <button
                className="btn btn-sm btn-success"
                type="button"
                style={{ float: "right" }}
                onClick={() => {
                  SaveVitalSignChartAPI("save");
                }}
                  disabled={data?.status==="OUT"?true:false}
              >
                {t("Save")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success"
                type="button"
                style={{ float: "right" }}
                onClick={() => {
                  SaveVitalSignChartAPI("update");
                }}
              >
                {t("Update")}
              </button>
            )}
          </div>
        </form>
      </div>

     <div className="patient_registration card">
  <Heading title={t("result")} isBreadcrumb={false} />
 
     <div className="table-responsive-container" style={{ 
          overflowX: 'auto', 
          width: '100%',
          '-webkit-overflow-scrolling': 'touch' // Enable smooth scrolling on iOS
        }}>
    <Tables
      thead={thead}
      tbody={tbody}
      tableHeight={"scrollView"}
    />
  </div>
</div>


    </>
  );
}
