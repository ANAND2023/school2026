import React, { useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import { SampleCollectionReportSearch } from "../../networkServices/SampleCollectionAPI";
import TimePicker from "../../components/formComponent/TimePicker";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import { RedirectURL } from "../../networkServices/PDFURL";
import { useSelector } from "react-redux";
import { exportToExcel } from "../../utils/exportLibrary";
function sampleCollectionReport() {
  const [t] = useTranslation();

  const reportType = [
    { value: "0", label: "All" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMERGENCY" },

  ];
  const Userdata = [
    { value: "0", label: "All" },
    { value: "1", label: "Mr. ABHAY KUMAR" },
    { value: "2", label: "Mr Administrator" },
    { value: "3", label: "Mr Administrator" },
    { value: "4", label: "Mr Administrator" },
    { value: "5", label: "Mr Administrator" },
  ];
  const { GetEmployeeWiseCenter } = useSelector((state) => state?.CommonSlice);
  // const GetEmployeeWiseCenter = [
  //   { code: "1", name: "E-LAB PRO" },
  //   { code: "2", name: "HOSPEDIA" },
  //   { code: "3", name: "INNOPATH" },
  //   { code: "4", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  // ];

  const initialValues = {
    LabNo: "",
    user: "",
    fromDate: new Date(),
    Time: "",
    toDate: new Date(),
    reportType: { value: "0", label: "ALL" },
    centre: [{
    "name": "MOHANDAI OSWAL HOSPITAL",
    "code": 1
}],
    type: { value: "2", label: "Excel" },
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => Number(items?.code));
  };

  const handleSearchSampleCollection = async () => {

    if (!values?.centre || handlePayloadMultiSelect(values?.centre).length === 0) {
      notify("Please select at least one centre", "error");
    }
    else {
      const payload = {
        "labNo": values?.LabNo,
        "selectedUser": values?.Userdata?.value,
        "reportType": values?.reportType?.value,
        "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
        "fromTime": "00:00:00",
        "toDate": moment(values?.toDate).format("DD-MMM-YYYY"),
        "toTime": "23:59:59",
        "selectedCentres": handlePayloadMultiSelect(values?.centre),
        "Type": values?.type?.value
      };

      try {
        const apiResp = await SampleCollectionReportSearch(payload);
        debugger
        if (apiResp?.success) {
          if (apiResp?.data?.value?.pdfUrl){
            RedirectURL(apiResp?.data?.value?.pdfUrl);
          }
          else{
            debugger
            let excelData = apiResp?.data?.map((item)=>({
                  "Lab No.": item?.labNo,
                  "Patient Name": item?.patientName,
                  "UHID": item?.mrNo,
                  "Test Name": item?.testName,
                  "Sample Receive Date" : item?.sampleReceiveDate,
                  "Sample Received By" : item?.sampleReceiverName,
                  "Result Entered Date" : item?.resultEnteredDate,
                  "Result Entered Name" : item?.resultEnteredName,
                  "Gender" : item?.gender,
                  "Age" : item?.age,
                  "Address": item?.address,
                  "Test ID": item?.test_ID
            }))

             exportToExcel(excelData, `Sample Collection Report ${moment(values?.fromDate).format("DD-MMM-YYYY") } - ${moment(values?.toDate).format("DD-MMM-YYYY")}`)
          }
        }
        else {
          notify("No records found", "error");

        }

      } catch (error) {
        notify("An error occurred while fetching data", "error");
      }
    }
  };
  return (
    <>
      <div className=" spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={reportType}
            handleChange={handleSelect}
            value={`${values?.reportType}`}
            name={"reportType"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="LabNo"
            name="LabNo"
            value={values?.LabNo || ""}
            onChange={handleChange}
            lable={t("LabNo")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("User")}
            id={"user"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Userdata}
            handleChange={handleSelect}
            value={`${values?.user}`}
            name={"user"}
          />

          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("FromDate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />
          <TimePicker
            lable={t("Time")}
            // placeholderName={t("Time")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Time"
            name="Time"
            value={values?.Time ? values?.Time : new Date()}
            handleChange={handleChange}
          />

          <DatePicker
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
            minDate={values?.fromDate}
          />

          <ReportsMultiSelect
            name="centre"
            placeholderName={t("Centre")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />
          <ReactSelect
            placeholderName={t("File Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-1 col-md-2 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Excel", value: "2" },
              { label: "Pdf", value: "1" },
            ]}
            handleChange={handleSelect}
            value={values?.type?.value}
            name={"type"}
          />
{console.log(values, "values")}
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default sampleCollectionReport;
