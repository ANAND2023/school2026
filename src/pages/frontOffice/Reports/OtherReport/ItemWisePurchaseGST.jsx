import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { AutoComplete } from "primereact/autocomplete";
import {
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
} from "../../../../networkServices/InventoryApi";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { Report_Formate_Pharmacy } from "../../../../utils/constant";
import { BillingReportsPharmacyDepartment } from "../../../../networkServices/EDP/edpApi";
import moment from "moment";
import { BillingBillingReportsItemWisePurchase } from "../../../../networkServices/MRDApi";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { notify } from "../../../../utils/ustil2";

const ItemWisePurchaseGST = () => {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    reportFormat: "2",
  };
  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const [stockShow, setStockShow] = useState([]);
  const [item, setItem] = useState("");
  const [subGroup, setSubGroup] = useState([]);
  const [newRowData, setNewRowData] = useState([]);
  console.log("newRowData", newRowData);
  const [DropDownState, setDropDownState] = useState({
    bindcategory: [],
    PurchaseDepartment: [],
  });
  console.log("dropdown", DropDownState);
  const localData = useLocalStorage("userData", "get");

  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const bindPurchaseDepartment = async () => {
    const response = await BillingReportsPharmacyDepartment();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        PurchaseDepartment: response?.data,
      }));
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [BindGroupId, departmentData] = await Promise.all([
        getBindGroup(),
        bindPurchaseDepartment(),
      ]);

      const dropDownData = {
        bindcategory: handleReactSelectDropDownOptions(
          BindGroupId,
          "name",
          "categoryID"
        ),
        departmentData: departmentData?.data,
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const search = async (e) => {
    // debugger;
    const Subcategory = values?.subcategoryId
      ? values?.subcategoryId?.map((sub) => sub.code)
      : "";
    // const ItemName = searchItem || item;
    try {
      const response = await BindStoreItems(Subcategory, e.query);
      setStockShow(response?.data || []);
      // }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSelectRow = (e) => {
    debugger;
    const { value } = e;
    setNewRowData((prevData) => {
      if (prevData.some((item) => item.ItemID === value.ItemID)) {
        return prevData;
      }
      return [...prevData, value];
    });
    setItem("");
  };

  const deleteDocument = (doc) => {
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    setNewRowData(docDetail);
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

  const handleReactSelect = (name, value) => {
    setValues((prevData) => ({
      ...prevData,
      [name]: value?.value || "",
    }));
  };

  const getBindStoreSubCategory = async () => {
    const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
    try {
      const response = await BindStoreSubCategory(CategoryID);
      setSubGroup(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReactSelectChange = (name, e) => {
    setValues((prev) => ({
      ...prev,
      [name]: e,
    }));
  };

  const handleReport = async () => {
    if (!values?.StoreType?.value) {
      notify("Please select a Store Type", "error");
      return;
    } else if (!values?.departmentName?.length) {
      notify("Please Select Department", "error");
      return;
    }
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD") || new Date(),
      toDate: moment(values?.toDate).format("YYYY-MM-DD") || new Date(),
      itemID: newRowData?.map((item) => `'${item?.ItemID}'`).join(","),
      deptLedgerNo: values?.departmentName
        ?.map((item) => `'${item?.code}'`)
        .join(","),
      storeType: values?.StoreType?.value,
      printType: Number(values?.reportFormat),
    };

    const response = await BillingBillingReportsItemWisePurchase(payload);
    if (response?.success) {
      if (values?.reportFormat === "2") {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        exportToExcel(response?.data);
      }
    }
  };

  useEffect(() => {
    if (values?.categoryId?.length > 0) {
      getBindStoreSubCategory();
    }
  }, [values.categoryId]);

  useEffect(() => {
    FetchAllDropDown();
    bindPurchaseDepartment();
  }, []);

  return (
    <div className="card">
      <Heading title={"Item Wise Purchase GST"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Store Type")}
          id={"StoreType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={[
            { label: " Medical Store", value: "STO00001" },
            { label: "General Store", value: "STO00002" },
          ]}
          name="StoreType"
          handleChange={handleReactSelectChange}
          value={values?.StoreType}
          requiredClassName="required-fields"
        />
        <ReportsMultiSelect
          name="departmentName"
          placeholderName={t("Department Name")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          requiredClassName={"required-fields"}
          dynamicOptions={DropDownState?.PurchaseDepartment}
          labelKey="RoleName"
          valueKey="DeptLedgerNo"
        />
        {console.log("first", DropDownState?.PurchaseDepartment)}
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          lable={t("fromDate")}
          values={values}
          setValues={setValues}
          max={values?.toDate}
        />
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          lable={t("toDate")}
          values={values}
          setValues={setValues}
          max={values?.toDate}
        />
        <ReportsMultiSelect
          name="categoryId"
          placeholderName={t("Groups")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={DropDownState?.bindcategory}
          labelKey="name"
          valueKey="categoryID"
        />
        <ReportsMultiSelect
          name="subcategoryId"
          placeholderName={t("Sub Groups")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={subGroup}
          labelKey="Name"
          valueKey="SubCategoryID"
        />

        <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
          <AutoComplete
            style={{ width: "100%" }}
            value={item}
            suggestions={Array.isArray(stockShow) ? stockShow : []}
            completeMethod={(e) => search(e)}
            className="w-100 "
            onSelect={(e) => handleSelectRow(e)}
            id="searchtest"
            onChange={(e) => {
              debugger
              const data =
                typeof e.value === "object" ? e?.value?.TypeName : e.value;
              setItem(data);
              // search(data);
              // setValues({ ...values, TypeName: data });
            }}
            itemTemplate={itemTemplate}
          />
          <label htmlFor={"searchtest"} className="lable searchtest">
            {t(" Search Items")}
          </label>
        </div>
        <ReactSelect
          placeholderName={t("Report Format")}
          id={"reportFormat"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={Report_Formate_Pharmacy}
          name="reportFormat"
          handleChange={handleReactSelect}
          value={values?.reportFormat}
        />

        <button className="btn btn-success ml-2" onClick={handleReport}>
          Report
        </button>
        <div className=" col-sm-12 d-flex">
          {newRowData?.map((doc, key) => (
            <div className="d-flex ml-2 mb-2" key={key}>
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
  );
};

export default ItemWisePurchaseGST;
