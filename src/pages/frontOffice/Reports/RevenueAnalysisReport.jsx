import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
  getBindPanelList,
  GetBindSubCatgeory,
  getLoadOPDDiagnosisItems,
} from "../../../store/reducers/common/CommonExportFunction";
import { print_Type } from "../../../utils/constant";
import {
  BindSubcategory,
  IPDBillingStatusLoadItems,
  ItemAnalysisDetail,
  RevenueAnalysisDetail,
  RoomType,
} from "../../../networkServices/BillingsApi";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import { AutoComplete } from "primereact/autocomplete";
import LabeledInput from "../../../components/formComponent/LabeledInput";

export default function RevenueAnalysisReport() {
  const [t] = useTranslation();
  const [subItemCategory, setSubItemCategory] = useState([]);
  const dispatch = useDispatch();
  const [newRowData, setNewRowData] = useState([]);

  const [item, setItem] = useState("");
  const [stockShow, setStockShow] = useState([]);

  const {
    GetEmployeeWiseCenter,
    getBindPanelListData,
    // GetBindSubCatgeoryData,
    GetBindAllDoctorConfirmationData,
    getLoadOPDDiagnosisItemsData,
    GetDepartmentList,
  } = useSelector((state) => state.CommonSlice);

  const { getBindCategoryData } = useSelector(
    (state) => state.TokenManagementSlice
  );
  const [multiselectState, setMultiSelectState] = useState({
    getRoomTypeMulti: [],
    getItemMulti: [],
  });

  console.log("multiSelect", multiselectState);

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    patientType: "",
    reportSubType: "",
    panel: [],
    doctor: [],
    subCategory: [],
    category: [],
    item: [],
    department: [],
    RoomType: [],
    reportType: 0,
    centre: [],
    printType: "",
    dateFilterType: "",
    UHID: "",
  };
  console.log(subItemCategory);
  const [values, setValues] = useState({ ...initialValues });

  console.log("values", values);

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };
  const handlePayloadMultiSelectNumbers = (data) => {
    return data?.map((items, _) => Number(items?.code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "handlePayloadMultiSelectNumbers",
      handlePayloadMultiSelectNumbers(values?.doctor)
    );
    //
    const requestBody = {
      centreID:
        values?.centre?.map((item) => `'${item?.code}'`).join(",") || "",
      itemID: newRowData?.map((item) => `'${item?.ItemID}'`).join(",") || "",
      subCategoryID:
        values?.subCategory?.map((item) => `'${item?.code}'`).join(",") || "",
      doctorID:
        values?.doctor?.map((item) => `'${item?.code}'`).join(",") || "",
      panelID: values?.panel?.map((item) => `'${item?.code}'`).join(",") || "",
      fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values.toDate).format("YYYY-MM-DD"),
      uhid: String(values.UHID) || "",
      billDate: Number(values?.dateFilterType) || 0,
      reportType: Number(values?.reportSubType) || 1,
      report: String(values?.reportType) || "",
      categoryID: "",
      // patientType: values?.patientType,
      patientType:
        values?.patientType === "0"
          ? "'IPD'"
          : values?.patientType === "1"
            ? "'OPD'"
            : "'IPD' ,'OPD'",
            "printType": Number(values?.printType)

    };

    try {
      if (values?.centre == "") {
        notify("Centre is Required", "error");
      } else {
        const response = await ItemAnalysisDetail(requestBody);
        console.log("response", response);
        if (response?.data?.pdfUrl) {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          notify(response?.message || "No Records Found", "error");
        }
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;

    // if (name === "reportType") {
    //   if (String(e?.value) === "7") {
    //     dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
    //     obj["speciality"] = [];
    //   }

    //   if (String(e?.value) === "8") {
    //     obj["doctor"] = [];
    //     dispatch(getBindSpeciality());
    //   }
    // }

    setValues(obj);
  };

  const getBindRoomType = async () => {
    try {
      const dataRes = await RoomType();
      setMultiSelectState((prevState) => ({
        ...prevState,
        getRoomTypeMulti: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSubcategory = async () => {
    try {
      const dataRes = await BindSubcategory();
      setSubItemCategory(dataRes?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getItem = async () => {
    debugger
    const payload = {
      CategoryID: "",
      SubCategoryID:
        values?.subCategory?.length > 0
          ? String(values?.subCategory?.map((val) => `${val?.code}`).join(","))
          : "",
    };

    const response = await IPDBillingStatusLoadItems(payload);
    debugger;
    if (response?.success) {
      setMultiSelectState((prevState) => ({
        ...prevState,
        getItemMulti: response?.data,
      }));
    } else {
      setMultiSelectState((prevState) => ({
        ...prevState,
        getItemMulti: [],
      }));
      notify("No Items Found", "error");
    }
  };

  useEffect(() => {
    if (values?.category?.length > 0)
      dispatch(
        GetBindSubCatgeory({
          Type: 1,
          CategoryID: handlePayloadMultiSelect(values?.category),
        })
      );
  }, [values?.category]);

  useEffect(() => {
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
    dispatch(getLoadOPDDiagnosisItems());
    dispatch(GetBindDepartment());
    getBindRoomType();
    getBindSubcategory();
    // getItem();
  }, []);
  useEffect(() => {
    getItem();
  }, [values?.subCategory]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const itemTemplate = (item) => {
    //
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "20%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };
  const handleSelectRow = (e) => {
    const { value } = e;
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [...prevData, value];
    });
    setItem("");
  };
  // const searchData = async (searchItem) => {
  //   const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
  //   const ItemName = searchItem?.query;

  //   try {
  //     if (ItemName?.length > 2) {
  //       const response = await BindStoreItems(Subcategory, ItemName);
  //       setStockShow(response?.data);
  //     } else {
  //       setStockShow([]);
  //     }
  //   } catch (error) {
  //     setStockShow([]);
  //     console.log(error, "SomeThing Went Wrong");
  //   }
  // };

  const search = async (event) => {
    // if(event?.query?.length > 3){
    //   return
    // }
    const ItemName = event?.query;
    const payload = {
      CategoryID: "",
      SubCategoryID:
        values?.subCategory?.length > 0
          ? String(values?.subCategory?.map((val) => `${val?.code}`).join(","))
          : "",
      searchType: event?.query,
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
  const deleteDocument = (doc) => {
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    setNewRowData(docDetail);
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row  p-2" onSubmit={handleSubmit}>
          <ReportsMultiSelect
            name="centre"
            placeholderName={t("Centre")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />

          <ReactSelect
            placeholderName={t("Date Filter Type")}
            id={"dateFilterType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: " Bill Date", value: "0" },
              { label: "Entry Date", value: "1" },
            ]}
            name="dateFilterType"
            handleChange={handleReactSelectChange}
            value={values.dateFilterType}
          />

          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable={t("FromDate")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="fromDate"
            id="fromDate"
            value={values?.fromDate}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "fromDate")}
          />

          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable={t("toDate")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="toDate"
            id="toDate"
            value={values?.toDate}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "toDate")}
          />

          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"patientType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "2" },
              { label: "IPD", value: "0" },
              { label: "OPD", value: "1" },
            ]}
            name="patientType"
            handleChange={handleReactSelectChange}
            value={values.patientType}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id="reportType"
            searchable
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Detailed", value: "D" },
              // { label: "Summarised-Itemwise", value: "SI" },
              { label: "Summarised", value: "S" },
            ]}
            value={values.reportType}
            name="reportType"
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelectChange(name, e)}
          />
          <ReactSelect
            placeholderName={t("Sub Type")}
            id={"reportSubType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Group Wise", value: "1" },
              { label: "Doctor Wise", value: "2" },

              { label: "Panel Wise", value: "3" },
            ]}
            name="reportSubType"
            handleChange={handleReactSelectChange}
            value={values.reportSubType}
          />

          <ReportsMultiSelect
            name="doctor"
            placeholderName={t("Doctors")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetBindAllDoctorConfirmationData}
            labelKey="Name"
            valueKey="DoctorID"
          />

          <ReportsMultiSelect
            name="subCategory"
            placeholderName={t("SubCategory")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={subItemCategory || []}
            labelKey="name"
            valueKey="subCategoryID"
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
            <AutoComplete
              style={{ width: "100%" }}
              value={item}
              suggestions={Array.isArray(stockShow) ? stockShow : []}
              completeMethod={search}
              className="w-100 "
              onSelect={(e) => handleSelectRow(e)}
              id="searchtest"
              onChange={(e) => {
                const data =
                  typeof e.value === "object" ? e?.value?.TypeName : e.value;
                setItem(data);
                // search(data);
                setValues({ ...values, TypeName: data });
              }}
              itemTemplate={itemTemplate}
            />
            <label htmlFor={"searchtest"} className="lable searchtest">
              {t(" Search Items")}
            </label>
          </div>

          <ReportsMultiSelect
            name="panel"
            placeholderName={t("Panel")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          />
          <ReactSelect
            placeholderName={t("Print Type")}
            id={"printType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={print_Type?.map((item, index) => {
              return {
                value: item.ID,
                label: item.name,
              };
            })}
            name="printType"
            handleChange={handleReactSelectChange}
            value={values.printType}
          />
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            onChange={handleChange}
            value={values.UHID}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="submit"
              onClick={handleSubmit}
            >
              {t("Report")}
            </button>
          </div>
        </form>
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
    </>
  );
}
