import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingOperationReport,
  BillingOperationReportNew,
} from "../../../../networkServices/MRDApi";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { exportToExcel } from "../../../../utils/exportLibrary";

const OprationReport = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    Report: "1",
    ctbNo: "",
    Doctor: "0",
    Panel: "0",
    rType: "1",
    type: "1",
  };

  const [dropDownState, setDropDownState] = useState({
    RoomType: [],
    ReportOption: [],
    DoctorList: [],
    PanelList: [],
    Floor: [],
  });
  console.log("dropDownState", dropDownState);

  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };

  const getPanelList = async () => {
    try {
      const response = await EDPBindPanelsAPI();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          PanelList: handleReactSelectDropDownOptions(
            response?.data,
            "Company_Name",
            "PanelID"
          ),
        }));
      } else {
        setDropDownState([]);
      }
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const bindDropdownData = async () => {
    const [DoctorData] = await Promise.all([BindDoctorDept("All")]);

    if (DoctorData?.success) {
      // setDropDownState((val) => ({
      //     ...val,
      //     ReportOption: handleReactSelectDropDownOptions(
      //         response?.data,
      //         "TypeName",
      //         "TypeID"
      //     ),
      // }));
      setDropDownState((val) => ({
        ...val,
        DoctorList: handleReactSelectDropDownOptions(
          DoctorData?.data,
          "Name",
          "DoctorID"
        ),
      }));
    }
  };

  useEffect(() => {
    bindDropdownData();
  }, []);

  useEffect(() => {
    getPanelList();
  }, []);

  const SaveData = async () => {
    if (!values?.Report) {
      notify("Please Select Report", "warn");
      return;
    }
    if (!values?.Doctor) {
      notify("Please Select Doctor", "warn");
      return;
    }
    if (!values?.Panel) {
      notify("Please Select Panel", "warn");
      return;
    }
    if (!values?.rType) {
      notify("Please Select rType", "warn");
      return;
    }

    const payload = {
      reportType: Number(values?.Report),
      doctorID: values?.Doctor === "0" ? "" : String(values?.Doctor),
      panelID: values?.Panel === "0" ? "" : String(values?.Panel),
      fileType: Number(values?.type),
      fromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values.toDate).format("YYYY-MM-DD"),
    };

    // const response = await BillingOperationReport(payload);
    const response = await BillingOperationReportNew(payload);

    if (response.success) {
      debugger;
      if (values?.type === "1") {
        RedirectURL(response?.data?.pdfUrl);
      } else if (values?.type === "0") {
        exportToExcel(
          response?.data,
          `Operation Report : : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`
        );
      }
    } else {
      notify(response.message, "error");
    }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Opration Report"} />
        <div className="row p-2">
          {/* <ReportsMultiSelect
            name="panel"
            placeholderName="Panel"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          /> */}

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
            r
          />
          {/* <ReactSelect
            placeholderName={t("Report")}
            id={"Report"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Details", value: "0" },
              { label: "Summary", value: "1" },
            ]}
            name="Report"
            handleChange={handleReactSelectChange}
            value={values.Report}
            requiredClassName={"required-fields"}
          /> */}

          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "0" },
              ...dropDownState?.DoctorList,
            ]}
            // dynamicOptions={dropDownState?.DoctorList}
            // dynamicOptions={[
            //     {label:"All",value:"0"},
            //     {label:"Admission",value:"1"},
            //     {label:"Discharged",value:"2"},
            // ]}
            name="Doctor"
            handleChange={handleReactSelectChange}
            value={values.Doctor}
            requiredClassName={"required-fields"}
          />

          {/* <ReactSelect
            placeholderName={t("rType")}
            id={"rType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={dropDownState}
            dynamicOptions={[
              { label: "OT", value: "1" },
              { label: "All", value: "0" },
              // { label: "Discharged", value: "2" },
            ]}
            name="rType"
            handleChange={handleReactSelectChange}
            value={values.rType}
             requiredClassName={"required-fields"}
          /> */}

          <ReactSelect
            placeholderName={t("Panel")}
            id={"Panel"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "0" },
              ...dropDownState?.PanelList,
            ]}
            // dynamicOptions={[
            //     {label:"OT",value:"0"},
            //     {label:"Admission",value:"1"},
            //     {label:"Discharged",value:"2"},
            // ]}
            name="Panel"
            handleChange={handleReactSelectChange}
            value={values.Panel}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            placeholderName={t("type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            // dynamicOptions={dropDownState?.typeList}
            dynamicOptions={[
              { label: "Pdf", value: "1" },
              { label: "Excel", value: "0" },
            ]}
            name="type"
            handleChange={handleReactSelectChange}
            value={values.type}
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OprationReport;
