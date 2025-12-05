import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import { BillingBillingReportsReferredPatientReport } from "../../../../networkServices/MRDApi";
import moment from "moment";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { notify } from "../../../../utils/ustil2";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useSelector } from "react-redux";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { GetBindReferDoctor } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";

const ReferedPatientReport = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    reportType: { label: "Both", value: "3" },
    ipdNo: "",
    patientId: "",
    ReferDoctor: "",
  };

  const { GetBindReferDoctorList } = useSelector((state) => state.CommonSlice);

  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const handleReactSelectChange = (name, e) => {
    if (name === "reportType") {
      setValues((pre) => ({
        ...pre,
        [name]: e,
      }));
    } else {
      setValues((pre) => ({
        ...pre,
        [name]: e?.value,
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReport = async () => {
    debugger;
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: String(values?.reportType?.label),
      ipdNo: String(values?.ipdNo),
      patientId: String(values?.patientId),
      referDoctorId: String(values?.ReferDoctor),
    };
    const response = await BillingBillingReportsReferredPatientReport(payload);
    if (response?.success) {
      exportToExcel(response?.data, `Refered Patient Report : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    dispatch(GetBindReferDoctor());
  }, []);

  return (
    <div className="card">
      <Heading title={"Refered Patient Report"} isBreadcrumb={false} />
      <div className="row p-2">
        {/* <ReportsMultiSelect
          name="centre"
          placeholderName="Centre"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={GetEmployeeWiseCenter}
          labelKey="CentreName"
          valueKey="CentreID"
          requiredClassName={true}
        /> */}
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id={"fromDate"}
          name={"fromDate"}
          lable={t("From Date")}
          values={values}
          setValues={setValues}
        />
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id={"toDate"}
          name={"toDate"}
          lable={t("To Date")}
          values={values}
          setValues={setValues}
        />
        <ReactSelect
          placeholderName={t("Report Type")}
          id={"reportType"}
          searchable={true}
          respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          dynamicOptions={[
            { label: "OPD", value: "1" },
            { label: "IPD", value: "2" },
            { label: "Both", value: "3" },
          ]}
          name="reportType"
          handleChange={handleReactSelectChange}
          value={values?.reportType?.value}
          requiredClassName={"required-fields"}
        />
        <Input
          type="number"
          className={"form-control "}
          lable={t("IPD No.")}
          disabled={values?.reportType?.label === "IPD" ? false : true}
          placeholder=" "
          name="ipdNo"
          onChange={handleInputChange}
          value={values?.ipdNo}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <Input
          type="number"
          className={"form-control "}
          lable={t("UHID")}
          placeholder=" "
          name="patientId"
          onChange={handleInputChange}
          value={values?.patientId}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <ReactSelect
          placeholderName={"Refer Doctor"}
          id={"ReferDoctor"}
          searchable={true}
          name={"ReferDoctor"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={handleReactSelectDropDownOptions(
            GetBindReferDoctorList,
            "NAME",
            "DoctorID"
          )}
          handleChange={handleReactSelectChange}
          value={values?.ReferDoctor}
          removeIsClearable={false}
        />
        <button className="btn-success btn ml-2" onClick={handleReport}>
          {t("Report")}
        </button>
      </div>
    </div>
  );
};

export default ReferedPatientReport;
