import React from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { PRBindLedger } from "../../../../networkServices/Purchase";
import { useState, useEffect } from "react";
import Input from "../../../../components/formComponent/Input";
import DatePicker from "../../../../components/formComponent/DatePicker";
import moment from "moment";
import { AutoComplete } from "primereact/autocomplete";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import Tables from "../../../../components/UI/customTable";
import { ProcessbindApprovalType, ProcessBindCategoryGet, ProcessBindSubCategoryGet, ProcessProcessGetAdjustmentItem, ProcessProcessSaveAdjustmentStock, ProcessSearchItemCode } from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
const StockProcess = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
    let {deptLedgerNo} = useLocalStorage("userData", "get");
     let ip = useLocalStorage("ip", "get");

  const SEARCHTHEAD = [
    { name: t("S.No.") },
    { name: t("Item Name") },
    { name: t("Purchase Unit") },
    { name: t("HSN Code") },
    { name: t("IGST(%)") },
    { name: t("CGST(%)") },
    { name: t("SGST(%)") },
    { name: t("Disc.(%)") },
    { name: t("Batch No.") },
    { name: t("Unit Cost") },
    { name: t("Selling Price") },
    { name: t("Quantity in hand") },
    { name: t("Expiry Date") },
    { name: t("Select") },
  ];

  const ADJUSTMENTHEAD = [
    { name: t("S.No.") },
    { name: t("Item Name") },
    { name: t("Expiry Date") },
    { name: t("Batch No.") },
    { name: t("Rate") },
    { name: t("Qty.") },
    { name: t("Amount") },
    { name: t("Selling Price") },
    { name: t("Net Amt.") },
    { name: t("Remove") },
  ];


  const [values, setValues] = useState({
    storeType: {
      name: "Medical Store",
      categoryID: "8",
      configID: "28",
      label: "Medical Store",
      value: "STO00001",
    },
  });
  const [tableData, setTableData] = useState([]);

  const [showAdjustmentSection, setShowAdjustmentSection] = useState(false);
  const [showSaveSection, setShowSaveSection] = useState(false);

  const [adjustmentData, setAdjustmentData] = useState([]);
  const [itemData, setItemData] = useState({});
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  console.log("values", values);
  const [dropDownState, setDropDownState] = useState({
    BindStore: [],
    BindApprovedBy: [],
    approvedByDropDown: [],
    categoryByDropDown: [],
    subcategoryByDropDown: [],
  });
  console.log("Drop", dropDownState)
  const [ItemNameSearchpayload, setItemNameSearch] = useState({
    SearchbyData: { label: "Search by First Name", value: "FirstName" }
  });

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.itemname}
        </div>
      </div>
    );
  };

  //selection and input change

// values.approvedBy = { label: "Store Manager", value: "" };
// const approvedByValue = values?.approvedBy?.value || "";
// const approvedByLabel = values?.approvedBy?.label || "";




console.log("dashsxhs-- values:", values);



  const handleSelect = (name, value) => {
    // debugger
    if (name === "SearchbyData") {
      setItemNameSearch((val) => ({
        ...val,
        [name]: value,
      }));
    }
    if (name === "isExpiry") {
      if (value === "1") {
        setValues((val) => ({ ...val, fromDate: "", toDate: "" }));
        setValues((val) => ({ ...val, [name]: value }));
      }
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

const handleTableSelect = (ele, index) => {
  const selected = {
    ...ele,
    autoCompleteItemName: ele?.ItemName, 
  };

  setItemData(selected);

  setValues((prev) => ({
    ...prev,
    selectedItems: ele?.ItemName || "",
    inHandQty: ele?.QOH || "",
    expDate: ele?.MedExpiryDate || "",
    unitCost: ele?.UnitPrice || "",
    sellingPrice: ele?.sellingPrice || "",
    qtyInHand: ele?.QOH || "",
    batchNo: ele?.BatchNumber || "",
  }));
};


  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleDelete = async (e) => {

  };

  // API CALLS


  const approvedByData = async () => {
    try {
      // debugger
      const response = await ProcessbindApprovalType();
      const approvalList = response?.data?.map((item)=>({
          label:item?.ApprovalType,
          value:item?.ApprovalType
        }))
      setDropDownState((val) => ({
        ...val,
        approvedByDropDown: approvalList,
      }));
    } catch (error) {
      console.error(error, "SomeThing Went Wrong");
      notify("Error fetching center data", "error");
    }
  };



  const categoryData = async () => {
    try {
      const response = await ProcessBindCategoryGet();
      setDropDownState((val) => ({
        ...val,
        categoryByDropDown: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "CategoryID",
        ),
      }));
    } catch (error) {
      console.error(error, "SomeThing Went Wrong");
      notify("Error fetching center data", "error");
    }
  };



  const subcategoryData = async () => {
    try {
      const response = await ProcessBindSubCategoryGet();
      setDropDownState((val) => ({
        ...val,
        subcategoryByDropDown: handleReactSelectDropDownOptions(
          response?.data,
          "GroupHead",
          "SubCategoryID",
        ),
      }));
    } catch (error) {
      console.error(error, "SomeThing Went Wrong");
      notify("Error fetching center data", "error");
    }
  };




  const search = async (event) => {
    const prefix = event?.query?.trim();
    if (!prefix || prefix.trim().length === 0) {
      setItems([]);
      return;
    }

     console.log("qsighuhxjnnjnjnjnjnjjh:", values);
    try {
      const payload = {
        storeType: values?.storeType?.value?? "",
        category: values?.Category?.label ?? "ALL",
        subcategory: values?.subCategory?.label ?? "ALL",
        type: ItemNameSearchpayload?.SearchbyData?.value,
        // type: ItemNameSearchpayload?.SearchbyData?.value,
        SearchKey: prefix,
        batchNo:values?.batchNo?.value?? ""
        // SearchKey:values?.SearchKey?.value?? "Code"
      };


      const res = await ProcessSearchItemCode(payload);
      const data = res?.data || [];

      const formatted = data.map((item) => ({
        ...item,
        autoCompleteItemName: item?.itemname ?? item?.ItemName ?? item?.Name ?? item?.ItemCode,
      }));

      setItems(formatted);
    } catch (err) {
      console.error("Error in AutoComplete Search:", err);
      setItems([]);
    }
  };


const searchAdjustment = async () => {

  if (!itemData?.autoCompleteItemName && !values?.batchNo) {
    return;
  }

  try {
    
    // setSearchResults([]);
    setAdjustmentData([]);
    setTableData([]);
    // setItemData({});
    setShowSaveSection(false);

    const payload = {
      itemName: itemData?.autoCompleteItemName || "",
      batchNo: values?.batchNo || "",
      IsExpirable: values?.isExpiry?.value === "1" ? 1 : 0,
      fromDate: values?.fromDate ? moment(values.fromDate).format("YYYY-MM-DD") : "",
      toDate: values?.toDate ? moment(values.toDate).format("YYYY-MM-DD") : "",
    };

    const response = await ProcessProcessGetAdjustmentItem(payload);

    if (response?.data?.length > 0) {
      setTableData(response.data);
      setSearchResults(response.data);
    } else {
      setTableData([]);
      setSearchResults([]);
    }

    
    setValues({
      selectedItems: "",
      inHandQty: "",
      expDate: "",
      unitCost: "",
      sellingPrice: "",
      qtyInHand: "",
      batchNo: "",
      autoCompleteItemName: "",
      fromDate: null,
      toDate: null,
      isExpiry: { label: "", value: "" },
    });

  } catch (error) {
    console.error("Error fetching adjustment items", error);
    setTableData([]);
    setSearchResults([]);
  }
};



const saveStockProcess = async () => {
  try {
    const payload = {
      departmentID: deptLedgerNo || "", 
      approvedBy: values?.approvedBy|| "",
      narration: values.Narrations || "",
      storeTypeValue: values.storeTypeValue?.value || "",
      ipAddress: ip, 
      currentPageName: "stock-process-tools",

      adjustmentItems: adjustmentData.map((item) => ({
        itemName: item.ItemName || "",                    
        stockID: Number(item.StockID) || 0,               
        entryDate: new Date(),
        medExpiryDate: item.MedExpiryDate
          ? moment(item.MedExpiryDate).toISOString()
          : null,                                          
        isExpirable: item.IsExpirable || 0,                
        unitPrice: Number(item.UnitPrice) || 0,            
        mrp: Number(item.MRP) || 0,                        
        majorMRP: Number(item.MajorMRP) || 0,
        itemID: Number(item.ItemID) || 0,
        batchNumber: item.BatchNumber || "",               
        subCategoryID: item.SubCategoryID || 0,             
        quantity: Number(item.qty) || 0,                   
        rate: Number(item.Rate) || 0,                      
        amount: Number(item.amnt) || 0,                    
        discount: Number(item.DiscPer) || 0,
        purTaxPer: Number(item.PurTaxPer) || 0,
        saleTaxPer: Number(item.SaleTaxPer) || 0,
        mrpValue: Number(item.MRP) || 0,
        netAmount: Number(item.netAmount) || 0,
        taxAmount: Number(item.taxAmount) || 0,
        igstPercent: Number(item.IGSTPercent) || 0,
        cgstPercent: Number(item.CGSTPercent) || 0,
        sgstPercent: Number(item.SGSTPercent) || 0,
        igstAmt: Number(item.igstAmt) || 0,
        cgstAmt: Number(item.cgstAmt) || 0,
        sgstAmt: Number(item.sgstAmt) || 0,
        hsnCode: item.HSNCode || "",
        gstType: item.GSTType || "",
      })),
    };

    console.log("Payload:", JSON.stringify(payload, null, 4));

    const response = await ProcessProcessSaveAdjustmentStock(payload);

     if (response?.message === "Record Save Successfully.") {
      setAdjustmentData([]); 
      setShowAdjustmentSection(false);
      setShowSaveSection(false);

      window.location.reload();
    }
  } catch (error) {
    console.error("Error saving stock process:", error);
  }
};





  // if (response && response.data) {
  //     setAdjustmentData([]);
  //     setShowAdjustmentSection(false);
  //     setShowSaveSection(false);
  //     alert("Stock process saved successfully!");
  //   } else {
  //     alert("Failed to save stock process.");
  //   }





  useEffect(() => {
    approvedByData();
    categoryData();
    subcategoryData();

  }, []);






  const PRBindStore = async () => {
    try {
      const BindStore = await PRBindLedger();
      setDropDownState((val) => ({
        ...val,
        BindStore: handleReactSelectDropDownOptions(
          BindStore?.data,
          "LedgerName",
          "LedgerNumber"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  useEffect(() => {
    PRBindStore();
  }, []);


const handleAdjustment = () => {
  if (!values?.Adjustment || !itemData?.ItemName) return;

  const selectedItem = searchResults.find(
    (item) => item.ItemName === itemData.ItemName
  );

  if (!selectedItem) return;

  const newAdjustment = {
    ...selectedItem,
    qty: values?.qtyInHand,
    rate: values?.unitCost,
    amnt: (Number(values?.Adjustment) * Number(values?.unitCost)).toFixed(2),
    sellingPrice: values?.sellingPrice,
    netAmount: (Number(values?.Adjustment) * Number(values?.sellingPrice)).toFixed(2),
    expDate: values?.expDate,
    batchNo: values?.batchNo,
  };

  setAdjustmentData((prev) => [...prev, newAdjustment]);
  setShowSaveSection(true);
};


  return (
    <div className="card">
      <Heading title={"Stock Process Medical (-)"} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Store Type")}
          id={"storeType"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.BindStore}
          handleChange={handleSelect}
          value={`${values?.storeType?.value}`}
          name={"storeType"}
        />
        <ReactSelect
          placeholderName={t("Approved By")}
          id={"approvedBy"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.approvedByDropDown}
          handleChange={handleSelect}
          value={`${values?.approvedBy?.value}`}
          name={"approvedBy"}
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("Batch No")}
          placeholder=" "
          name="batchNo"
          onChange={(e) => handleInputChange(e, 0, "batchNo")}
          value={values?.batchNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Category")}
          id={"Category"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.categoryByDropDown}
          handleChange={handleSelect}
          value={`${values?.Category?.value}`}
          name={"Category"}
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id={"subCategory"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.subcategoryByDropDown}
          handleChange={handleSelect}
          value={`${values?.subCategory?.value}`}
          name={"subCategory"}
        />
        <ReactSelect
          placeholderName={t("Is Expiry")}
          id={"isExpiry"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          handleChange={handleSelect}
          value={values?.isExpiry?.value}
          name={"isExpiry"}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-3 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={values?.fromDate ? moment(values?.fromDate).toDate() : ""}
          maxDate={new Date()}
          handleChange={(e) => {
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              fromDate: moment(dateInput).toDate(), 
            }));
          }}
          lable={t("From Date")}
          placeholder={VITE_DATE_FORMAT}
          //   inputClassName={"required-fields"}
          disable={values?.isExpiry?.value === "1" ? false : true}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-3 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={values?.toDate ? moment(values?.toDate).toDate() : ""}
          maxDate={new Date()}
          handleChange={(e) => {
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              toDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("To Date")}
          placeholder={VITE_DATE_FORMAT}
          //   inputClassName={"required-fields"}
          disable={!values?.fromDate ? true : false}
        />
        <ReactSelect
          placeholderName={t("Search Type")}
          id={"SearchbyData"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            { label: "Search by First Name", value: "FirstName" },
            { label: "Search by Word", value: "AnyName" },
            { label: "Search by Item Code", value: "Code" },
          ]}
          name="SearchbyData"
          handleChange={handleSelect}
          value={ItemNameSearchpayload?.SearchbyData?.value}
          requiredClassName="required-fields"
        />
        <AutoComplete
          value={itemData}
          suggestions={items}
          completeMethod={search}
          // ref={ref}
          className="col-xl-4 col-md-4 col-sm-6 col-12"
          //   onSelect={(e) => validateInvestigation(e, 0, 0, 1, 0, 0)}
          onSelect={(e) => {
            console.log("selectedddddddd item ", e.value)
            setItemData(e.value);
          }}
          id="searchtest"
          onChange={(e) => setItemData(e.value)}
          field="autoCompleteItemName"
          itemTemplate={itemTemplate}
        />
        <button
          onClick={() => {
            searchAdjustment();
            setShowAdjustmentSection(true);
          }}
          className="btn btn-success ml-2"
        >
          {t("Search")}
        </button>

      </div>
      {console.log(tableData, "tableData")}
      {searchResults.length > 0 && (
        <div className="p-2">
          <Tables
            thead={SEARCHTHEAD}
            tbody={tableData?.map((ele, index) => ({
              Sno: index + 1,
              ItemName: ele?.ItemName,
              PurchaseUnit: ele?.PurchaseUnit ?? "0",
              hsnCode: ele?.HSNCode ?? "0",
              igst: ele?.IGSTPercent,
              cgst: ele?.CGSTPercent,
              sgst: ele?.SGSTPercent,
              disc: ele?.DiscPer,
              batchNo: ele?.BatchNumber ?? "0",
              unitCost: ele?.MRP,
              sellingPrice: ele?.UnitPrice,
              qtyInHand: ele?.QOH,
              expDate: ele?.MedExpiryDate,
              select: (
                <i
                  className="fa fa-check"
                  onClick={() => handleTableSelect(ele, index)}
                ></i>
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
        </div>
      )}

      {values?.selectedItems && (
        <div className="row mt-2">
          <LabeledInput
            label="Items"
            value={values?.selectedItems}
            className="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <LabeledInput
            label="InHand Qty."
            value={values?.inHandQty}
            className="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <LabeledInput
            label="Expiry Date"
            value={values?.expDate}
            className="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          
      
          <Input
            type="number"
            className={"form-control required-fields"}
            lable={t("Adjustment")}
            placeholder=" "
            name="Adjustment"
            onChange={(e) => handleInputChange(e, 0, "Adjustment")}
            value={values?.Adjustment}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("Narrations")}
            placeholder=" "
            name="Narrations"
            onChange={(e) => handleInputChange(e, 0, "Narrations")}
            value={values?.Narrations}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className={"form-control"}
            lable={t("Quantity in hand")}
            placeholder=" "
            name="qtyInHand"
            onChange={(e) => handleInputChange(e, 0, "qtyInHand")}
            value={values?.qtyInHand}         ///// quantity in hand 
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 p-2">
          <button className="btn btn-success" onClick={handleAdjustment}>
            {t("Adjustment")}
          </button>
          </div>
        </div>
      )}


      {adjustmentData?.length > 0 && (
        <>
          <Tables
            thead={ADJUSTMENTHEAD}
            tbody={adjustmentData?.map((ele, index) => ({
              Sno: index + 1,
              ItemName: ele?.ItemName,
              expDate: ele?.expDate,
              batchNo: ele?.batchNo,
              rate: ele?.rate,
              qty: ele?.qty,
              amnt: ele?.amnt,
              sellingPrice: ele?.UnitPrice,
              netAmnt: ele?.netAmnt,
              remove: (
                <i
                  className="fa fa-trash"
                  onClick={() => handleDelete(ele, index)}
                ></i>
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 p-2">
            <button onClick={saveStockProcess} className="btn btn-success">{t("Save")}</button>
          </div>
        </>
      )}

    </div>
  );
};

export default StockProcess;
