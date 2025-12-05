import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingAdmittedPatientWithoutDischarg,
  BillingBillingReportsDoctorIncomeReport,
  BillingBindReportOption,
  BillingReportsAdmitDischargeList,
  BillingReportsBindReportType,
  BindNABH,
  EDPReportsGetDepartment,
  PrintNBHReport,
} from "../../../../networkServices/MRDApi";
import {
  filterByType,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import {
  GetBindDepartment,
  RoomType,
  ToolBindDepartment,
} from "../../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { useSelector } from "react-redux";
import { CentreWisePanelControlCache } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";

const DoctorWiseBusiness = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "S",
    PatientType: "All",
    // listType: "1",
    // RoomType: [],
    // doctor: [],
    Department: [],
    // Floor: [],
    Panel: [],
    Type: "0",
    PanelGroup: "",
  };
  const { CentreWisePanelControlCacheList } = useSelector(
    (state) => state.CommonSlice
  );
  const [dropDownState, setDropDownState] = useState({
    RoomType: [],
    ReportOption: [],
    DoctorList: [],
    PanelList: [],
    Department: [],
    Floor: [],
  });
  useEffect(() => {
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);
  const [values, setValues] = useState({ ...initialValues });
  console.log("Val", values);
  console.log("values", values);
  const handleReactSelectChange = (name, e) => {
    if (name === "ReportType") {
      setValues((prev) => ({
        ...prev,
        doctor: [],
        [name]: e?.value,
      }));
    }
    setValues((pre) => ({
      ...pre,
      [name]: e?.value,
    }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  const bindDropdownData = async () => {
    const [DoctorList] = await Promise.all([
      BindDoctorDept("All"),
      //   getBindCenterAPI()
    ]);

    // if (CentreList?.success) {
    //   setDropDownData((val) => ({ ...val, CentreList: handleReactSelectDropDownOptions(CentreList?.data, "CentreName", "CentreID") }))
    // }

    if (DoctorList?.success) {
      setDropDownState((val) => ({
        ...val,
        DoctorList: handleReactSelectDropDownOptions(
          DoctorList?.data,
          "Name",
          "DoctorID"
        ),
      }));
    }
  };

  useEffect(() => {
    bindDropdownData();
  }, []);

  const getBindRoomType = async () => {
    try {
      const response = await RoomType();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          RoomType: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "IPDCaseTypeID"
          ),
        }));
      } else {
        // setDropDownState([])
      }
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
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

  const getDepartment = async () => {
    const payload = {
      CategoryID: "All",
      Name: "All",
      CenterId: 1,
    };
    try {
      const response = await EDPReportsGetDepartment(payload);
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          Department: handleReactSelectDropDownOptions(
            response?.data,
            "NAME",
            "SubCategoryID"
          ),
        }));
      } else {
        // setDropDownState([])
        setDropDownState((preV) => ({
          ...preV,
          DepartmentList: [],
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    getBindRoomType();
    // BindReportOption()
    // BindDepartment()
    getPanelList();
    getDepartment();
    // getFloorlList()
  }, []);
  useEffect(() => {
    setValues((preV) => ({
      ...preV,
      Type: "0",
    }));
  }, [values?.ReportType]);
  const both = [
    { label: "Pdf", value: "1" },
    { label: "Excel", value: "0" },
  ];
  const ExcelOnly = [{ label: "Excel", value: "0" }];

  const SaveData = async () => {
    if (!values?.ReportType) {
      notify("Please Select ReportType", "warn");
      return;
    }
    if (values?.ReportType === 1) {
      stringValue = values?.RoomType?.map((item) => `'${item.code}'`).join(",");
    } else if (values?.ReportType === 2) {
      stringValue = values?.doctor?.map((item) => `'${item.code}'`).join(",");
    } else if (values?.ReportType === 3) {
      stringValue = "";
    } else if (values?.ReportType === 4) {
      stringValue = values?.Department?.map((item) => `'${item.code}'`).join(
        ","
      );
    } else if (values?.ReportType === 5) {
      stringValue = values?.Floor?.map((item) => `'${item.code}'`).join(",");
    } else if (values?.ReportType === 6) {
      // else if (values?.ReportType === 18) {

      stringValue = values?.Panel?.map((item) => `'${item.code}'`).join(",");
    }

    const payload = {
      periodFrom: moment(values?.fromDate).format("YYYY-MM-DD"),
      periodTo: moment(values.toDate).format("YYYY-MM-DD"),
      panelGroup: values?.Panel?.value ? values?.Panel?.value : values?.Panel,
      patientType: values?.PatientType ?? "",
      reportType: values?.ReportType ?? "",
      fileType: Number(values?.Type),
      doctorID: values?.doctor?.map((doc) => doc?.code)?.join(",") || "",
    };

    const response = await BillingBillingReportsDoctorIncomeReport(payload);
    if (response.success) {
      if (values?.Type == "0") {
        exportToExcel(
          response?.data,
          `Doctor Income Report : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`
        );
      } else if (values?.Type === "1") {
        RedirectURL(response?.data);
      }
    } else {
      notify(response.message, "error");
    }
  };

  const panelGroupList = filterByType(
                  CentreWisePanelControlCacheList,
                  4,
                  "TypeID",
                  "TextField",
                  "ValueField"
                ) || [];

                console.log(panelGroupList, "panelGroupList")

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Doctor Wise Business Report"} />
        <div className="row p-2">
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("From Date")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            values={values}
            setValues={setValues}
            // max={new Date()}
            // min={values?.fromDate}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Summarized", value: "S" },
              { label: "Details", value: "D" },
            ]}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
            requiredClassName={"required-fields"}
          />
          {values?.ReportType === "D" && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              placeholderName={t("Doctor")}
              id={"doctor"}
              name="doctor"
              value={values?.doctor}
              handleChange={handleMultiSelectChange}
              dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
                name: item?.label,
                code: item?.value,
              }))}
              searchable={true}
            />
          )}
          {/* <ReactSelect
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        placeholderName={t("PanelGroup")}
                        dynamicOptions={filterByType(
                            CentreWisePanelControlCacheList,
                            4,
                            "TypeID",
                            "TextField",
                            "ValueField"
                        )?.filter((val) => val?.label !== "CASH")}
                        name="PanelGroup"
                        value={`${values?.PanelGroup}`}
                        // defaultValue={values?.PanelGroupID}
                        handleChange={handleReactSelectChange}
                        //   requiredClassName={`required-fields ${errors?.PanelGroup ? "required-fields-active" : ""}`}
                        id="PanelGroup"
                        inputId="PanelGroupFocus"
                        searchable={true}
                    //tabIndex="6"
                    /> */}
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"PatientType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "All" },
              { label: "OPD", value: "OPD" },
              { label: "IPD", value: "IPD" },
            ]}
            name="PatientType"
            handleChange={handleReactSelectChange}
            value={values.PatientType}
            requiredClassName={"required-fields"}
          />
          {values?.ReportType === 1 && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("RoomType")}
                id={"RoomType"}
                name="RoomType"
                value={values?.RoomType}
                requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.RoomType?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {(values?.ReportType === "0" || values?.ReportType === "2") && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("Doctor")}
                id={"doctor"}
                name="doctor"
                value={values?.doctor}
                requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {(values?.ReportType === "1" || values?.ReportType === "2") && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("Department")}
                id={"Department"}
                name="Department"
                value={values?.Department}
                requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.Department?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {values?.ReportType === 5 && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("Floor")}
                id={"Floor"}
                name="Floor"
                value={values?.Floor}
                requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.Floor?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {
            // values?.ReportType === 6 &&
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <ReactSelect
                placeholderName={t("Panel Group")}
                id={"Panel"}
                name="Panel"
                value={values?.Panel}
                requiredClassName={"required-fields"}
                handleChange={handleReactSelectChange}
                dynamicOptions={[{label:"All",value:"0"}, ...panelGroupList]}
                // dynamicOptions={dropDownState?.PanelList?.map((item) => ({
                //     name: item?.label,
                //     code: item?.value,
                // }))}

                searchable={true}
              />
              {/* <MultiSelectComp
                                placeholderName={t("Panel")}
                                id={"Panel"}
                                name="Panel"
                                value={values?.Panel}
                                requiredClassName={"required-fields"}
                                handleChange={handleMultiSelectChange}
                                dynamicOptions={dropDownState?.PanelList?.map((item) => ({
                                    name: item?.label,
                                    code: item?.value,
                                }))}

                                searchable={true}

                            /> */}
            </div>
          }
          <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={values?.ReportType == "S" ? both : ExcelOnly}
            name="Type"
            handleChange={handleReactSelectChange}
            value={values.Type}
          />
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

export default DoctorWiseBusiness;
