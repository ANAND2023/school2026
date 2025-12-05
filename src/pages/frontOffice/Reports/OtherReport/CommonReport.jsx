import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingBillingReportsDiscountReportDetail,
  BillingCreditPanelPatientsReport,
  BillingDiscountReportPanelWiseReport,
  BillingOperationReport,
  BillingRoomRentGST,
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

const CommonReport = ({ reportTypeID = 37 }) => {
  console.log("reportTypeID", reportTypeID);
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    Report: "",
    ctbNo: "",
    Doctor: "0",
    Panel: "0",
    rType: "1",
    printType: "",
    title: "",
    DetailsSummary: "4",
  };

  const [dropDownState, setDropDownState] = useState({
    RoomType: [],
    ReportOption: [],
    DoctorList: [],
    PanelList: [],
    Floor: [],
  });
  const roomRentType = [
    { label: "Normal GST", value: 1 },
    { label: "Portal GST", value: 2 },
  ];
  const printBoth = [
    { label: "Pdf", value: "2" },
    { label: "Excel", value: "1" },
  ];
  const printExcel = [{ label: "Excel", value: "0" }];
  const printPdf = [{ label: "Pdf", value: "1" }];
  console.log("dropDownState", dropDownState);

  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  console.log("values", values);
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
  // useEffect(() => {
  //     if(values?.DetailsSummary){
  //          setValues((prev) => ({
  //             ...prev,
  //             printType:"1"

  //         }))
  //     }
  // }, [values?.DetailsSummary])
  useEffect(() => {
    if (reportTypeID === 37) {
      setValues((prev) => ({
        ...prev,
        Report: 1,
        printType: "0",
        title: "Room Rent GST",
      }));
    } else if (reportTypeID === 35) {
      setValues((prev) => ({
        ...prev,

        printType: "1",
        title: "Credit Panel Receipt Report",
      }));
    } else if (reportTypeID === 36) {
      setValues((prev) => ({
        ...prev,

        title: "Discount Report",
      }));
    }
  }, [reportTypeID]);

  const RoomRentGSTAPi = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      reportType: Number(values?.Report),
    };

    return await BillingRoomRentGST(payload); // <-- response return kar diya
  };
  const CreditPanelPatientsApi = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      fileType: values?.printType,
      // "reportType": Number(values?.Report)
    };

    return await BillingCreditPanelPatientsReport(payload);
  };
  const DiscountReportApit = async () => {
    debugger;
    if (values?.DetailsSummary === "3") {
      const payload = {
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        fileType: 3,
      };

      return await BillingBillingReportsDiscountReportDetail(payload);
    } else {
      const payload = {
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        fileType: Number(values?.DetailsSummary ?? 4),
      };

      return await BillingDiscountReportPanelWiseReport(payload);
    }
    // <-- response return kar diya
  };
  const SaveData = async () => {
    // let response = [];

    if (reportTypeID === 37) {
      const response37 = await RoomRentGSTAPi();
      if (response37.success) {
        if (response37?.data?.pdfUrl) {
          RedirectURL(response37?.data?.pdfUrl);
        } else {
          const filteredData = response37?.data?.map(({ logo, ...rest }) => rest);
          exportToExcel(filteredData, `Room Rent GST Report \n ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);
        }
      } else {
        notify(response37.message, "error");
      }
    } else if (reportTypeID === 35) {
      const response35 = await CreditPanelPatientsApi();
      if (response35.success) {
        if (response35?.data?.pdfUrl) {
          RedirectURL(response35?.data?.pdfUrl);
        } else {
          const filteredData = response35?.data?.map(({ logo, ...rest }) => rest);
          exportToExcel(filteredData, `Credit Panel Patient Report \n ${moment(values?.fromDate).format("DD-MMMM-YYYY")} to ${moment(values.toDate).format("DD-MMMM-YYYY")}`);
        }
      } else {
        notify(response35.message, "error");
      }
    } else if (reportTypeID === 36) {
      const response36 = await DiscountReportApit();
      if (response36.success) {
        if (response36?.data?.pdfUrl) {
          RedirectURL(response36?.data?.pdfUrl);
        } else {
          const filteredData = response36?.data?.map(({ logo, ...rest }) => rest);
          exportToExcel(filteredData, `Discount Report \n ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);
        }
      } else {
        notify(response36.message, "error");
      }
    }

    // if (response.success) {
    //   if (response?.data?.pdfUrl) {
    //     RedirectURL(response?.data?.pdfUrl);
    //   } else {
    //     const filteredData = response?.data?.map(({ logo, ...rest }) => rest);
    //     exportToExcel(filteredData, "Discount Detail");
    //   }
    // } else {
    //   notify(response.message, "error");
    // }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={values?.title} />
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
          {(reportTypeID === 37 ||
            reportTypeID === 35 ||
            reportTypeID === 36) && (
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
          )}
          {(reportTypeID === 37 ||
            reportTypeID === 35 ||
            reportTypeID === 36) && (
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
            />
          )}
          {reportTypeID === 35 && (
            <>
              <ReactSelect
                placeholderName={t("Print Type")}
                id={"printType"}
                searchable={true}
                respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                // dynamicOptions={dropDownState?.typeList}
                dynamicOptions={printBoth}
                name="printType"
                handleChange={handleReactSelectChange}
                value={values.printType}
              />
            </>
          )}
          {reportTypeID === 37 && (
            <ReactSelect
              placeholderName={t("Report")}
              id={"Report"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={reportTypeID === 37 && roomRentType}
              // dynamicOptions={[
              //   { label: "Details", value: "0" },
              //   { label: "Summary", value: "1" },
              // ]}
              name="Report"
              handleChange={handleReactSelectChange}
              value={values.Report}
              requiredClassName={"required-fields"}
            />
          )}
          {reportTypeID === 36 && (
            <ReactSelect
              placeholderName={t("Details Summary")}
              id={"DetailsSummary"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              // dynamicOptions={reportTypeID === 37 && roomRentType}
              dynamicOptions={[
                { label: "Details", value: "3" },
                { label: "Summary", value: "4" },
              ]}
              name="DetailsSummary"
              handleChange={handleReactSelectChange}
              value={values.DetailsSummary}
              // requiredClassName={"required-fields"}
            />
          )}
          {reportTypeID === 37 && (
            // || reportTypeID === 35
            <ReactSelect
              placeholderName={t("Print Type")}
              id={"printType"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              // dynamicOptions={dropDownState?.typeList}
              dynamicOptions={
                (reportTypeID === 37 && printExcel) ||
                // || (reportTypeID === 35) && printPdf
                (values?.DetailsSummary === "0" && printExcel) ||
                (values?.DetailsSummary === "1" && printPdf)
              }
              name="printType"
              handleChange={handleReactSelectChange}
              value={values.printType}
            />
          )}

          {/* <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
             dynamicOptions={[{label:"All",value:"0"},...dropDownState?.DoctorList]}
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

          <ReactSelect
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
          />

          <ReactSelect
            placeholderName={t("Panel")}
            id={"Panel"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[{label:"All",value:"0"},...dropDownState?.PanelList]}
            // dynamicOptions={[
            //     {label:"OT",value:"0"},
            //     {label:"Admission",value:"1"},
            //     {label:"Discharged",value:"2"},
            // ]}
            name="Panel"
            handleChange={handleReactSelectChange}
            value={values.Panel}
             requiredClassName={"required-fields"}
          /> */}

          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonReport;
