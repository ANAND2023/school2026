import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingAdmittedPatientWithoutDischarg,
  BillingBillingReportsDocterInvestigationBusinessDetails,
  BillingBillingReportsDoctorDeptInvestigationBusinessReport,
  BillingBillingReportsSubCategoryName,
  BillingBindReportOption,
  BillingReportsAdmitDischargeList,
  BillingReportsBindReportType,
  BindNABH,
  EDPReportsGetDepartment,
  PrintNBHReport,
} from "../../../../networkServices/MRDApi";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import {
  GetBindDepartment,
  IPDBillingStatusLoadItems,
  RoomType,
  ToolBindDepartment,
} from "../../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { EDPBindPanelsAPI } from "../../../../networkServices/EDP/edpApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { ReportsTypeOptions } from "../../../../utils/constant";
import { AutoComplete } from "primereact/autocomplete";
import { BindStoreItems } from "../../../../networkServices/InventoryApi";
import LabeledInput from "../../../../components/formComponent/LabeledInput";

const InvestigationBusiness = ({ reportTypeID }) => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "",
    // listType: "1",
    // RoomType: [],
    // doctor: [],
    Department: [],
    // Floor: [],
    Panel: [],
    Type: "S",
  };

  const [dropDownState, setDropDownState] = useState({
    RoomType: [],
    ReportOption: [],
    DoctorList: [],
    PanelList: [],
    Department: [],
    Floor: [],
    SubCategory: [],
  });
  const [values, setValues] = useState({ ...initialValues });
  const [newRowData, setNewRowData] = useState([]);
  console.log("newRowData", newRowData);

  console.log("values", values);
  const handleReactSelectChange = (name, e) => {
    if (name === "ReportType") {
      setValues((prev) => ({
        ...prev,
        Panel: [],
        doctor: [],
        subCategory: [],
        Department: [],
      }));
      setValues((pre) => ({
        ...pre,
        [name]: e?.value,
      }));
    }
    setValues((pre) => ({
      ...pre,
      [name]: e?.value,
    }));
  };
  const [item, setItem] = useState("");
  console.log("item ", item);
  const [stockShow, setStockShow] = useState([]);

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

  const bindSubCategroy = async () => {
    const response = await BillingBillingReportsSubCategoryName();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        SubCategory: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "SubCategoryID"
        ),
      }));
    }
  };

  useEffect(() => {
    bindDropdownData();
    bindSubCategroy();
  }, []);
  // const BindDepartment = async () => {
  //     try {
  //         const response = await ToolBindDepartment();
  //         if (response?.success) {
  //             setDropDownState((val) => ({
  //                 ...val,
  //                 Department: handleReactSelectDropDownOptions(
  //                     response?.data,
  //                     "ledgerName",
  //                     "ledgerNumber"
  //                 ),
  //             }));

  //         }
  //         else {
  //             setDropDownState([])

  //         }

  //     } catch (error) {
  //         console.log(error, "SomeThing Went Wrong");
  //     }
  // };
  // const BindReportOption = async () => {
  //     try {
  //         const response = await BillingBindReportOption(reportTypeID);
  //         if (response?.success) {
  //             setDropDownState((val) => ({
  //                 ...val,
  //                 ReportOption: handleReactSelectDropDownOptions(
  //                     response?.data,
  //                     "TypeName",
  //                     "TypeID"
  //                 ),
  //             }));

  //         }
  //         else {
  //             setDropDownState([])

  //         }
  //         //   return response;

  //     } catch (error) {
  //         console.log(error, "SomeThing Went Wrong");
  //     }
  // };
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
        setDropDownState((preV) => ({ ...preV, DepartmentList: [] }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  // const getFloorlList = async () => {
  //     try {
  //         const response = await BindFloor();
  //         if (response?.success) {
  //             setDropDownState((val) => ({
  //                 ...val,
  //                 Floor: handleReactSelectDropDownOptions(
  //                     response?.data,
  //                     "name",
  //                     "id"
  //                 ),
  //             }));
  //         }
  //         else {
  //             setDropDownState([])

  //         }
  //         return response;

  //     } catch (error) {
  //         console.log(error, "SomeThing Went Wrong");
  //     }
  // };
  useEffect(() => {
    getBindRoomType();
    // BindReportOption()
    // BindDepartment()
    getPanelList();
    getDepartment();
    // getFloorlList()
  }, []);
  console.log("dropDownState", dropDownState);



  const SaveData = async () => {
    // debugger
    if (!values?.ReportType) {
      notify("Please Select ReportType", "warn");
      return;
    }
    let stringValue;
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

    if (values?.Type === "S") {
      const payload = {
        fromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values.toDate).format("YYYY-MM-DD"),
        subCategoryID:
          values?.Department?.map((dept) => dept.code).join(",") || "",
        panelID: values?.Panel?.map((item) => item?.code)?.join(",") || "",
        itemID: newRowData
          ? newRowData?.map((row) => row.ItemID).join(",")
          : "",
        doctorID: values?.doctor?.map((doc) => doc?.code)?.join(",") || "",
        reportType: values.Type,
        docType: values?.ReportType,
        fileType: 1,
      };

      const response =
        await BillingBillingReportsDoctorDeptInvestigationBusinessReport(
          payload
        );
      if (response?.success) {
        if (values?.Type == "S") {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          exportToExcel(response?.data, `Doctor Dept Investigation Business Report : ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);
        }
      } else {
        notify(response.message, "error");
      }
    } else {
      const payload = {
        fromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values.toDate).format("YYYY-MM-DD"),
        subCategoryID:
          values?.Department?.map((dept) => dept.code).join(",") || "",
        panelID: values?.Panel?.map((item) => item?.code)?.join(",") || "",
        itemID: newRowData
          ? newRowData?.map((row) => row.ItemID).join(",")
          : "",
        doctorID: values?.doctor?.map((doc) => doc?.code)?.join(",") || "",
        reportType: values.Type,
        docType: values?.ReportType,
        fileType: 0,
      };

      const response =
        await BillingBillingReportsDocterInvestigationBusinessDetails(payload);
      if (response?.success) {
        exportToExcel(response?.data, "Doctor Investigation Business Report");
      } else {
        notify(response.message, "error");
      }
    }
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };

  // const search = async (searchItem) => {
  //   // const Subcategory = handlePayloadMultiSelect(
  //   const Subcategory = values?.subCategory
  //     ? values?.subCategory?.map((sub) => sub.code)
  //     : "";
  //   // );
  //   const ItemName = searchItem || item;

  //   // const ItemName = values?.TypeName;
  //   try {
  //     if (ItemName?.length > 2) {
  //       const response = await BindStoreItems(Subcategory, ItemName);
  //       setStockShow(response?.data || []);
  //     }
  //   } catch (error) {
  //     console.log(error, "SomeThing Went Wrong");
  //   }
  // };

  const search = async (event) => {
    // if(event?.query?.length > 3){
    //   return
    // }
    const ItemName = event;
    const payload = {
      CategoryID: "",
      SubCategoryID:
        values?.subCategory
          ? values?.subCategory?.map((sub) => sub.code).join(",")
          : "",
      searchType: event,
    };

    debugger

    try {
      if (ItemName?.length > 2) {
        const filteredData = await IPDBillingStatusLoadItems(payload);
        console.log(
          "data",
          filteredData?.data?.map((ele) => ({
            TypeName: ele.typeName,
            ItemID: ele.item_ID,
          }))
        );
        setStockShow(
          filteredData?.data?.map((ele) => ({
            TypeName: ele.typeName,
            ItemID: ele.item_ID,
          }))
        );
      } else {
        setStockShow([]);
      }
    } catch (error) {
      setStockShow([]);
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSelectRow = (e) => {
    const { value } = e;
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [...prevData, value];
    });
    // setValues((prevPayload) => ({
    //   ...prevPayload,
    //   ItemID: Array.isArray(value?.ItemID)
    //     ? value.ItemID.join(", ")
    //     : value?.ItemID,
    // }));
    setItem("");
  };
  const deleteDocument = (doc) => {
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    // setValues((val) => ({ ...val, documentIds: docDetail }));
    setNewRowData(docDetail);
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={false} title={"Investigation Business Report"} />
        <div className="row p-2">
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
            lable={t("To Date")}
            values={values}
            setValues={setValues}
          // max={new Date()}
          // min={values?.fromDate}
          />
          {/* <ReactSelect
                        placeholderName={t("List Type")}
                        id={"listType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        // dynamicOptions={dropDownState}
                        dynamicOptions={[
                            { label: "Admission", value: "1" },
                            { label: "Discharged", value: "2" },
                        ]}
                        name="listType"
                        handleChange={handleReactSelectChange}
                        value={values.listType}
                    /> */}
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Doctor Wise", value: "1" },
              { label: "Department Wise", value: "2" },
              { label: "Doctor & Department Wise", value: "3" },
              // ...(dropDownState?.ReportOption || [])
            ]}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
            requiredClassName={"required-fields"}
          />
          {values?.ReportType === 1 && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("RoomType")}
                id={"RoomType"}
                name="RoomType"
                value={values?.RoomType}
                // requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.RoomType?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {(values?.ReportType === "1" || values?.ReportType === "3") && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("Doctor")}
                id={"doctor"}
                name="doctor"
                value={values?.doctor}
                // requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          )}
          {(values?.ReportType === "2" || values?.ReportType === "3") && (
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <MultiSelectComp
                placeholderName={t("Department")}
                id={"Department"}
                name="Department"
                value={values?.Department}
                // requiredClassName={"required-fields"}
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
                // handleChange={handleMultiSelectChange}
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
              <MultiSelectComp
                placeholderName={t("Panel")}
                id={"Panel"}
                name="Panel"
                value={values?.Panel}
                // requiredClassName={"required-fields"}
                handleChange={handleMultiSelectChange}
                dynamicOptions={dropDownState?.PanelList?.map((item) => ({
                  name: item?.label,
                  code: item?.value,
                }))}
                searchable={true}
              />
            </div>
          }
          <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={ReportsTypeOptions}
            name="Type"
            handleChange={handleReactSelectChange}
            requiredClassName={"required-fields"}
            value={values.Type}
          />
          <MultiSelectComp
            placeholderName={t("Sub Category")}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            id={"subCategory"}
            name="subCategory"
            value={values?.subCategory}
            // requiredClassName={"required-fields"}
            handleChange={handleMultiSelectChange}
            dynamicOptions={dropDownState?.SubCategory?.map((item) => ({
              name: item?.label,
              code: item?.value,
            }))}
            searchable={true}
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
            <AutoComplete
              style={{ width: "100%" }}
              value={item}
              // suggestions={stockShow}
              suggestions={Array.isArray(stockShow) ? stockShow : []}
              completeMethod={() => search(item)}
              className="w-100 "
              onSelect={(e) => handleSelectRow(e)}
              id="searchtest"
              onChange={(e) => {
                const data =
                  typeof e.value === "object" ? e?.value?.TypeName : e.value;
                setItem(data);
                search(data);
                setValues({ ...values, TypeName: data });
              }}
              itemTemplate={itemTemplate}
            // disabled={
            //   values?.subcategoryId?.length > 0 ? false : true
            // }
            />
            <label htmlFor={"searchtest"} className="lable searchtest">
              {t(" Search Items")}
            </label>
          </div>
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>
              Report
            </button>
          </div>
          <div className=" col-sm-12 d-flex">
            {newRowData?.map((doc, key) => (
              <div className="d-flex  mb-2" key={key}>
                <LabeledInput
                  label={"Items"}
                  value={doc?.TypeName}
                  className={"document_label"}
                />
                <button
                  className="btn btn-sm btn-primary ml-2"
                  type="button"
                  onClick={() => {
                    deleteDocument(doc);
                  }}
                >
                  <i className="fa fa-times fa-sm new_record_pluse"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationBusiness;
