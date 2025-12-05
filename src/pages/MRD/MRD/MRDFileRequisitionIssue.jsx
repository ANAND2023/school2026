import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { getDocDepartmentApi, MRDCreateIssueFileApi, MRDPatientInfoApi, MRDPatientIssuedListApi } from "../../../networkServices/MRDApi";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import TimeInputPicker from "../../../components/formComponent/CustomTimePicker/TimeInputPicker";
import { useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation, GetBindDepartment } from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Tables from "../../../components/UI/customTable";

const MRDFileRequisitionIssue = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { GetDepartmentList, GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const doctorOptions = GetBindAllDoctorConfirmationData.map((item) => ({
    label: item.Name,
    value: item.DoctorID,
  }));

  const departmentOptions = GetDepartmentList.map((item) => ({
    label: item.Name,
    value: item.ID,
  }));
  const [patientRaw, setPatientRaw] = useState(null);


  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    regNo: "",
    crNo: "",
    dobOrAge: "",
    patientName: "",
    doctorName: "",
    changeDoctor: "",

    issueDate: new Date(),
    issueTime: moment().format("LT"),

    type: "File",
    issueTo: "",
    remarks: "",
  });

  // const [tableData, setTableData] = useState([]);


  /** ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((p) => ({ ...p, [name]: value }));
  };

  const handleReactChange = (name, e, key) => {
    setPayload((p) => ({ ...p, [name]: e?.[key] }));
  };

  const handleSearchByRegNo = async () => {
    setPatientRaw(null);
    if (!payload.regNo?.trim()) {
      notify("Please enter Registration No.", "warning");
      return;
    }

    try {
      const res = await MRDPatientInfoApi(payload.regNo);
      if (res?.success) {

        setPatientRaw(res?.data);
      } else {
        notify(res?.message, "error");

      }

    } catch (err) {
      notify(err?.message, "error");

    }
  };

  const handleClearAll = () => {
    setPayload({
      regNo: "",
      crNo: "",
      dobOrAge: "",
      patientName: "",
      doctorName: "",
      changeDoctor: "",

      issueDate: new Date(),
      issueTime: moment().format("LT"),

      type: "File",
      issueTo: "",
      remarks: "",
    });
    setPatientRaw(null);
  };

  // 2) Issue action
  const handleIssue = async () => {
    if(!payload.changeDoctor){
      notify("Please Select Doctor","warn")
      return
    }
    if(!payload.issueTo){
      notify("Please Select issueTo","warn")
      return
    }
    const submitBody = {
      doctorName: patientRaw.doctorName,
      doctorId: payload.changeDoctor || "",
      changeDoctor: payload.changeDoctor || null,
      department: payload.issueTo || null,
      remarks: payload.remarks || "",
      issueDate: moment(payload.issueDate).format("YYYY-MM-DD"),
      time: payload.issueTime || "",
      patientId: patientRaw?.PatientID || patientRaw?.patientId,
      isCardOrFile: 2,
      ipdNo: '',
    };
    try {
      const response = await MRDCreateIssueFileApi(submitBody);
      if (response?.success) {
        notify(response?.message, "success");
        handleClearAll();
      } else {
        notify(response?.message || response?.data?.message, "error");
      }
    } catch (error) {
      notify(error?.message, "error");
    }
  };

  const handleGetIssueFiles = async () => {
    if (!payload.regNo?.trim()) {
      notify("Please enter Registration No.", "warning");
      return;
    }
    try {
      const res = await MRDPatientIssuedListApi(patientRaw?.PatientID);
      if (res?.success) {
        // setTableData(res?.data);
        notify(res?.message, "success");
      } else {
        notify(res?.message, "error");
      }
    } catch (err) {
      notify(err?.message, "error");
    }
  };

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localData?.centreID,
      })
    );
    dispatch(GetBindDepartment());
  }, [dispatch]);

  // useEffect(() => {
  //   if (patientRaw?.PatientID) {

  //     handleGetIssueFiles();
  //   }
  // }, [patientRaw?.PatientID]);
  /** ---------- JSX ---------- */
  const handleCall = async () => {
    try {

      const resp = await getDocDepartmentApi(payload?.changeDoctor)
      if (resp?.success) {
        setPayload({
          ...payload,
          issueTo: resp?.data?.DocDepartmentID ?? ""
        })
      } else {
        notify(resp?.message, "error")
      }
    } catch (err) {
      notify(err?.message, "error")
    }
  }

  useEffect(() => {
    if (payload?.changeDoctor) {

      handleCall()
    }
  }, [payload?.changeDoctor])

  useEffect(() => {
    if (doctorOptions && patientRaw) {

      const doc = doctorOptions.find(
        (item) => item?.value === patientRaw?.DoctorID)
      setPayload((p) => ({
        ...p,
        changeDoctor: doc?.value || "",
      }));
    }
  }, [patientRaw]);
  return (
    <>
      <div className="mt-2 card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="regNo"
            lable={"Reg. No"}
            placeholder=" "
            value={payload.regNo}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="regNo"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchByRegNo();
              }
            }}
            onChange={handleChange}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <button className="btn btn-sm btn-primary me-2" onClick={handleSearchByRegNo}>
              {t("Search")}
            </button>

          </div>
        </div>

        {/* ===== Issue Details (appears AFTER search) ===== */}
        {patientRaw && (
          <>
            <Heading isBreadcrumb={false} title={"Issue Details"} />
            <div className="row p-2">
              <Input
                className={"form-control"}
                readOnly={true}
                lable={"CR No"}
                value={patientRaw?.PatientID}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="crNo"
              />

              <Input
                type="text"
                id="dobOrAge"
                className={"form-control"}
                readOnly={true}

                lable={"Date Of Birth / Age"}
                value={patientRaw.age}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="dobOrAge"
                onChange={handleChange}
              />

              <Input
                type="text"
                id="patientName"
                lable={"Patient Name"}
                className={"form-control"}
                readOnly={true}
                value={patientRaw?.PName}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="patientName"
                onChange={handleChange}
              />

              {/* <Input
                type="text"
                id="doctorName"
                className={"form-control"}
                readOnly={true}
                lable={"Doctor Name"}
                value={patientRaw?.DoctorName}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="doctorName"
                onChange={handleChange}
              /> */}


              <ReactSelect
                placeholderName={"Change Doctor"}
                searchableDoctorID={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id="changeDoctor"
                removeIsClearable

                name="changeDoctor"
                // dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(doctorOptions, "label", "value")]}
                dynamicOptions={[...handleReactSelectDropDownOptions(doctorOptions, "label", "value")]}
                value={payload?.changeDoctor}
                handleChange={(name, e) => handleReactChange(name, e, "value")}
              />

              {/* <MultiSelect
                value={payload?.issueTo}
                options={departmentOptions}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="issueTo"
                onChange={handleReactChange}
                optionLabel="label"
                placeholder={t("issueTo")}
                filter
                className="multiselect"
              /> */}

              <DatePicker
                className="custom-calendar"
                placeholder={VITE_DATE_FORMAT}
                lable={"Issue Date"}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="issueDate"
                id="issueDate"
                value={payload.issueDate}
                handleChange={handleChange}
              />
              <TimeInputPicker
                lable={"Issue Time"}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="issueTime"
                // id="issueTime"
                onChange={handleChange}
                value={payload?.issueTime}
              />


              <ReactSelect
                placeholderName={"Issue To"}
                searchable
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id="issueTo"
                name="issueTo"
                removeIsClearable
                handleChange={(name, e) => handleReactChange(name, e, "value")}
                dynamicOptions={departmentOptions}
                value={payload.issueTo}
              />

              <TextAreaInput
                className="form-control"
                lable={"Remarks"}
                rows={2}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                name="remarks"
                value={payload.remarks}
                onChange={handleChange}
              />

              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <button className="btn btn-sm btn-primary" onClick={handleIssue}>
                  Issue
                </button>
              </div>
            </div>
          </>

        )}
      </div>

      {/* {tableData?.length > 0 && (

        <div className="card">
          <Heading title={"Issued Files"} isBreadcrumb={false} />
          <div>
            <Tables
              thead={THEAD}
              tbody={tableData?.map((item, index) => [
                index + 1,
                item?.PatientId,
                item?.NAME,
                item?.DoctorName,
                item?.ChangeDoctor,
                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("DD-MM-YYYY"),
                moment(item?.IssueDate, "DD-MMM-YYYY hh:mmA").format("hh:mm A"),
                item?.DepartmentName,
                item?.Remarks,
              ])}
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export default MRDFileRequisitionIssue;
