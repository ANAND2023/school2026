import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import { handleReactSelectDropDownOptions, inputBoxValidation, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import {
  FeedBackGetQuestionType,
  SavePatientFeedBack,
  SearchPatientFeedBack,
} from "../../../networkServices/edpApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { Checkbox } from "primereact/checkbox";
import { FeedBackPatientDetail } from "../../../networkServices/cardPrint";
import { useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";
import { useReactMediaRecorder } from "react-media-recorder";

export default function PatientFeedbackform() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [bindDetails, setBindDetails] = useState([]);
  const [audioBase64, setAudioBase64] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  let [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    FeedBackQuestion: [],
  });

  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();

  const initailValues = {
    ipdno: "",
    uhid: "",
    doctorId: "",
    phoneNumber: "",
    date: moment().format("YYYY-MM-DD"),
    questionType: "",
    type: "",
    IsUpdate: false,
  }

  const [values, setValues] = useState(initailValues);

  const TYPE = values?.questionType?.label === "OPD" ? [{ value: "1", label: "UHID" },]
    : values?.questionType?.label === "IPD" ? [
      { value: "2", label: "IPDNo" },
    ] : [];

  const [patientDetails, setPatientDetails] = useState({});
  console.log("patientDetail", patientDetails)
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: (blobUrl, blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result;
          setAudioBase64(base64String);
          notify("Recording complete. Please review.", "info");
        };
      },
    });

  useEffect(() => {
    let interval;
    if (status === 'recording') {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleClearRecording = () => {
    clearBlobUrl(); // Clears the mediaBlobUrl from the hook
    setAudioBase64(""); // Clears our base64 state
    setRecordingTime(0); // Resets the timer
    notify("Recording has been cleared.", "warning");
  };

  const handleSelect = (name, value) => {
    if (name == "questionType") {
      setValues((val) => ({ ...val, type: "", [name]: value }));
    }
    setValues((val) => ({ ...val, [name]: value }));
    // setBindDetails([])
  };

  const FeedBackQuestionType = async () => {
    try {
      const response = await FeedBackGetQuestionType();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          FeedBackQuestion: handleReactSelectDropDownOptions(
            response?.data,
            "QuestionTypeName",
            "QuestionTypeID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  useEffect(() => {
    FeedBackQuestionType();
  }, []);
  useEffect(() => {
    if (patientDetails) {
      const defaultDoctor = GetBindAllDoctorConfirmationData.find(
        (doctor) => doctor.DoctorID === patientDetails.DoctorID
      );
      if (defaultDoctor) {
        setValues((prev) => ({
          ...prev,
          doctorId: { ...prev.doctorId, value: patientDetails.DoctorID, label: defaultDoctor.Name },
          phoneNumber: patientDetails.MobileNo,
        }));
      }

    }
  }, [patientDetails]);

  const handleRatingChange = (rowIndex, selectedOption, e) => {
    debugger;
    const { checked } = e?.target;
    setBindDetails((prevDetails) =>
      prevDetails.map((item, index) => {
        if (index !== rowIndex) return item;

        return {
          ...item,
          isFetched: false, // Mark user interaction
          VeryGood10: selectedOption === "VeryGood10" && checked ? 1 : 0,
          Good7: selectedOption === "Good7" && checked ? 1 : 0,
          Average5: selectedOption === "Average5" && checked ? 1 : 0,
          Poor2: selectedOption === "Poor2" && checked ? 1 : 0,
          VeryPoor0: selectedOption === "VeryPoor0" && checked ? 1 : 0,
        };
      })
    );
  };

  const handleRemarkChange = (rowIndex, newRemark) => {
    setBindDetails((prevDetails) =>
      prevDetails.map((item, index) =>
        index === rowIndex ? { ...item, Remark: newRemark } : item
      )
    );
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === 'IsUpdate') {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    } else {
      setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    }
  };

  const handleSave = async () => {
    try {
      const feedbackdetail = bindDetails
        .filter(
          (item) =>
            item.VeryGood10 === 1 ||
            item.Good7 === 1 ||
            item.Average5 === 1 ||
            item.Poor2 === 1 ||
            item.VeryPoor0 === 1
        ) // ✅ Include only rows with a rating selected
        .map((item) => {
          const selectedRatingKey = [
            "VeryGood10",
            "Good7",
            "Average5",
            "Poor2",
            "VeryPoor0",
          ].find((key) => item[key] === 1);
          debugger;
          return {
            questionID: item.QuestionID,
            QuestionTypeId: Number(item.QuestionTypeId ?? 0),
            [selectedRatingKey]: 1, // ✅ Only send the selected rating
            Remark: item.Remark || "",

            isFeedBack: 1,
          };
        });
      debugger
      const payload = {
        patientID: values?.type?.value === "1" ? values.uhid : values.ipdno,
        entryFeedBackDate: moment(values.date).format("YYYY-MM-DD"),
        doctorID: values?.doctorId?.value,
        doctorName: values?.doctorId?.label,
        otherMobileNo: values?.phoneNumber || "",
        feedbackdetail,
        comment: values?.comments || "",
        type: values?.type?.value,
        IsUpdate: values?.IsUpdate ? 1 : 0,
        AudioRecord: audioBase64 || ""
      };

      const response = await SavePatientFeedBack(payload);
      if (response.success) {

        handleSearch();
        setBindDetails([]);
        setValues((preV) => ({
          ...preV,
          comments: "",
        }));
        // setBindDetails([])
        handleClearRecording();
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const getPatientDetails = async () => {
    try {
      debugger;
      let payload = {
        patientID:
          values?.type?.value === "1"
            ? String(values?.uhid)
            : String(values?.ipdno),
        type: values?.type?.value === "1" ? 1 : 2,
      };
      const response = await FeedBackPatientDetail(payload);
      if (response.success) {
        setPatientDetails(response.data);
      } else {
        setPatientDetails({});
        setValues((prev) => (
          {
            ...prev,
            doctorId: {},
            phoneNumber: "",
          }
        ));
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    // setPatientDetails({});
    if (!values?.questionType?.value) {
      notify("Please Select QuestionType", "error");
      return;
    }
    if (values?.type?.value == "1" && !values?.uhid) {
      notify("Please fill UHID", "error");
      return;
    }
    if (values?.type?.value == "2" && !values?.ipdno) {
      notify("Please fill IPDNO", "error");
      return;
    }

    try {
      let payload = {
        PID:
          values?.type?.value === "1"
            ? String(values?.uhid)
            : String(values?.ipdno),
        Date: moment(values?.date).format("YYYY-MM-DD"),

        Type: values?.type?.value,
        QuestionTypeId: values?.questionType?.value ?? "",
      };

      const response = await SearchPatientFeedBack(payload);
      await getPatientDetails();
      if (response.success) {

        const enhancedData = response.data.map((item) => ({
          ...item,
          isFetched: true, // 🛡️ Mark fetched rows for disabling
        }));
        setBindDetails(enhancedData);
        setValues((val) => ({ ...val, "comments": response.data[0].COMMENT }))
      } else {
        notify(response?.message, "error");
        setBindDetails([]);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  };
  console.log(values);

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localData?.centreID,
      })
    );
  }, [dispatch]);
  console.log(values, "values")
  return (
    <>
      <div className=" spatient_registration_card card">
        <Heading title={t("Search Criteria")} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Question Type")}
            id={"questionType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            requiredClassName="required-fields"
            dynamicOptions={[
              { label: "All", value: "0" },
              ...dropDownState?.FeedBackQuestion,
            ]}
            name={"questionType"}
            value={values.questionType?.value}
            handleChange={handleSelect}
          // isDisabled={isEdit ? true : false}
          //   handleChange={handleReactSelectChange}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6  col-12"
            dynamicOptions={TYPE}
            handleChange={handleSelect}
            value={values?.type}
            name={"type"}
          />
          {values?.type?.value === "1" ? (
            <Input
              type="text"
              className="form-control required-fields"
              id="uhid"
              name="uhid"
              lable={t("uhid")}
              placeholder=" "
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6  col-12"
              value={values?.uhid}
              onChange={handleChange}
            />
          ) : values?.type?.value === "2" ?(
            <Input
              type="text"
              className="form-control required-fields"
              id="ipdno"
              name="ipdno"
              lable={t("ipdno")}
              // placeholder=" "
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6  col-12"
              value={values?.ipdno}
              onChange={handleChange}
            />
          ) : ""}

          <DatePicker
            className="custom-calendar"
            id="Data"
            name="date"
            lable={t("date")}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={
              values.date ? moment(values.date, "YYYY-MM-DD").toDate() : null
            }
            maxDate={new Date()}
            handleChange={searchHandleChange}
          />
          {
            console.log("first", GetBindAllDoctorConfirmationData?.filter((item) => item?.DoctorID === patientDetails?.DoctorID))
          }

          <button
            className="btn btn-sm btn-success"
            type="button"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
          {

            bindDetails?.length > 0 &&
            <>

              <div className=" col-sm-2 col-xl-2">
                <div className="w-xl-50  w-md-100 w-100">
                  <LabeledInput
                    label={t("Patient Name")}
                    value={patientDetails?.PatientName}
                  />
                </div>
              </div>
              <div className=" col-sm-2 col-xl-1">
                <div className="w-xl-50  w-md-100 w-100">
                  <LabeledInput
                    label={t("Patient ID")}
                    value={patientDetails?.PatientID}
                  />
                </div>
              </div>
              <ReactSelect
                placeholderName={t("Doctor")}
                id={"doctor"}
                searchable={true}
                dynamicOptions={[
                  ...GetBindAllDoctorConfirmationData.map((item) => {
                    return {
                      label: item?.Name,
                      value: item?.DoctorID,
                    };
                  }),
                ]}
                name="doctorId"
                value={values?.doctorId?.value}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-6  col-12 "
                requiredClassName="required-fields"
                handleChange={handleSelect}
              />
              <Input
                type="number"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                lable={t("Mobile")}
                placeholder=" "
                disabled={false}
                respclass="col-xl-2 col-md-4 col-sm-6  col-12"
                value={values?.phoneNumber}
                maxLength={10}
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleChange
                  );
                }}
              />
              {/* <div className="col-xl-2 col-md-4 col-sm-6  col-12">

                <button className="btn btn-sm btn-success">
                  Start Recording
                  <i class="fa fa-microphone mx-1" aria-hidden="true"></i>
                </button>
              </div> */}
              {console.log(status, "status")}
              <div className="col-xl-2 col-md-4 col-sm-6  col-12  d-flex align-items-center justify-content-between">

                {status !== 'stopped' && (
                  <button
                    className={`btn btn-sm ${status === 'recording' ? 'btn-danger' : 'btn-success'} `}
                    onClick={status === 'recording' ? stopRecording : startRecording}
                  >
                    {status === 'recording' ? 'Stop' : 'Start Recording'}
                    {status === 'recording' ? (
                      <i className="fa fa-stop mx-1" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-microphone mx-1" aria-hidden="true"></i>
                    )}
                  </button>
                )}

                {/*-- Show Clear button ONLY when a recording is stopped and waiting for action --*/}
                {status === 'stopped' && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={handleClearRecording}
                  >
                    Clear Recording
                    <i className="fa fa-trash mx-1" aria-hidden="true"></i>
                  </button>
                )}
                {/* </div> */}

                <div>
                  <p className="text-muted small mb-0">Status: {status}</p>

                  {/*-- Show timer if it's running OR if it has a final value --*/}
                  {recordingTime > 0 && (
                    <span
                      className="font-weight-bold"
                      style={{
                        fontSize: '1rem',
                        // Change color based on status
                        color: status === 'recording' ? '#c82333' : '#6c757d'
                      }}
                    >
                      {formatTime(recordingTime)}
                    </span>
                  )}
                </div>


                {/*-- The audio preview remains the same, it shows when mediaBlobUrl exists --*/}
                {/* {mediaBlobUrl && (
                  <audio src={mediaBlobUrl} controls className="mt-2" style={{maxWidth: '100%'}} />
              )} */}
              </div>
            </>
          }
        </div>
      </div>
      {bindDetails?.length > 0 && (
        <div className="card">
          <Heading title={t("Department details")} isBreadcrumb={false} />
          <div className="">
            <Tables
              borderDark={true}
              thead={[
                { width: "1%", name: t("SNo") },
                // { width: "1%", name: t("Question Type") },
                { width: "1%", name: t("Department") },
                {
                  width: "20%",
                  name: t("Question"),
                },
                {
                  width: "1%",
                  name: t("Very Good (10)"),
                },
                {
                  width: "1%",
                  name: t("Good (7)"),
                },
                {
                  width: "1%",
                  name: t("Average (5)"),
                },
                {
                  width: "1%",
                  name: t("Poor (2)"),
                },
                {
                  width: "1%",
                  name: t("Very Poor (0)"),
                },


                { width: "20%", name: t("Remark") },
              ]}
              tdFontWeight={"bold"}
              tbody={bindDetails?.map((val, index) => {
                const isRowDisabled =
                  val.isFetched &&
                  (val.VeryGood10 === 1 ||
                    val.Good7 === 1 ||
                    val.Average5 === 1 ||
                    val.Poor2 === 1 ||
                    val.VeryPoor0 === 1);

                return {
                  sno: index + 1,
                  // QuestionTypeName: val.QuestionTypeName,
                  Department: val.DepartmentName,
                  // Question: val.Question || "",
                  Question: (
                    <div
                      dangerouslySetInnerHTML={{ __html: val.Question }}
                      style={{
                        padding: "10px",
                        lineHeight: "1.5",
                        fontSize: "14px !important",
                      }}
                    />
                  ),
                  VeryGood10: (
                    <div className="d-flex justify-content-center align-items-center">
                      <Checkbox
                        // type="checkbox"
                        // className="form-check-input"
                        className=" table-checkbox"
                        name={`rating-${index}`}
                        checked={val.VeryGood10 === 1}
                        onChange={(e) =>
                          handleRatingChange(index, "VeryGood10", e)
                        }
                      // disabled={isRowDisabled}
                      />
                    </div>
                  ),
                  Good7: (
                    <div className="d-flex justify-content-center align-items-center py-2">
                      <Checkbox
                        // type="checkbox"
                        // className="form-check-input"
                        className=" table-checkbox "
                        name={`rating-${index}`}
                        checked={val.Good7 === 1}
                        onChange={(e) => handleRatingChange(index, "Good7", e)}
                      // disabled={isRowDisabled}
                      />
                    </div>
                  ),
                  Average5: (
                    <div className="d-flex justify-content-center align-items-center">
                      <Checkbox
                        // type="checkbox"
                        // className="form-check-input"
                        className=" table-checkbox "
                        name={`rating-${index}`}
                        checked={val.Average5 === 1}
                        onChange={(e) =>
                          handleRatingChange(index, "Average5", e)
                        }
                      // disabled={isRowDisabled}
                      />
                    </div>
                  ),
                  Poor2: (
                    <div className="d-flex justify-content-center align-items-center">
                      <Checkbox
                        // type="checkbox"
                        // className="form-check-input"
                        className=" table-checkbox"
                        name={`rating-${index}`}
                        checked={val.Poor2 === 1}
                        onChange={(e) => handleRatingChange(index, "Poor2", e)}
                      // disabled={isRowDisabled}
                      />
                    </div>
                  ),
                  VeryPoor0: (
                    <div className="d-flex justify-content-center align-items-center">
                      <Checkbox
                        // type="checkbox"
                        // className="form-check-input "
                        className="table-checkbox"
                        name={`rating-${index}`}
                        checked={val.VeryPoor0 === 1}
                        onChange={(e) =>
                          handleRatingChange(index, "VeryPoor0", e)
                        }
                      // disabled={isRowDisabled}
                      />
                    </div>
                  ),
                  Remark: (
                    <Input
                      type="text"
                      className="table-input"
                      removeFormGroupClass={true}
                      value={val.Remark}
                      // value={val.Remark}
                      onChange={(e) =>
                        handleRemarkChange(index, e.target.value)
                      }
                      placeholder={t("")}
                      name={`remark-${val.QuestionID || index}`}
                    // disabled={isRowDisabled}
                    />
                  ),
                  colorcode: index % 2 === 0 ? "" : "#e9e9e9ff",
                };
              })}
              tableHeight={"scrollView"}
            />

            <div className="p-2 row d-flex justify-content-end mr-2 align-items-start">
              <div className="col-xl-5 col-md-3 col-sm-4 col-12">
                <TextAreaInput
                  id="comments"
                  lable={t("Comments")}
                  className="w-100"
                  name="comments"
                  value={values?.comments}
                  onChange={handleChange}
                  placeholder=" "
                />
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ gap: "5px" }}>
                <label>Is Update</label>
                <Checkbox
                  type="checkbox"
                  name={"IsUpdate"}
                  checked={values.IsUpdate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  className="btn btn-sm btn-success px-4"
                  type="button"
                  disabled={status === 'recording'}
                  onClick={handleSave}
                >
                  {status === 'recording' ? t("Kindly Stop Recording Before Saving") : t("Save")}
                </button>
              </div>
              {/* {status === 'recording' && <>Kindly Stop Recording Before Saving</>} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
