import React, { useEffect, useState } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { PRBindLedger } from "../../../../networkServices/Purchase";
import Heading from "../../../../components/UI/Heading";
import { AutoComplete } from "primereact/autocomplete";
import Input from "../../../../components/formComponent/Input";
import { GST_TYPE_OPTION } from "../../../../utils/constant";
import DatePicker from "../../../../components/formComponent/DatePicker";
import TextAreaInput from "../../../../components/formComponent/TextAreaInput";
import Tables from "../../../../components/UI/customTable";
import { StockUpdateBindApprovalType, StockUpdateLoadAllStoreItems, StockUpdateSaveStockAdjustment, StockUpdateViewHistory } from "../../../../networkServices/InventoryApi";
import moment from "moment";
import { notify } from "../../../../utils/ustil2";
import Modal from "../../../../components/modalComponent/Modal";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { Table } from "react-bootstrap";
import { use } from "react";



const StockAdjustment = () => {
  const [t] = useTranslation();
  const userData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");

  const initialValues = {
    storetype: { label: "", value: "STO00001" },
    searchType: { label: "", value: "AnyName" },
    searchItem: "",
    rate: "",
    quantity: "",
    sellingPrice: "",
    batchNo: "",
    purchaseTax: { label: "CGST&SGST", value: "CGST&SGST" },
    cgst: "",
    sgst: "",
    utgst: "",
    igst: "",
    discount: "",
    hsn: "",
    approveBy: "",
    expiryDate: "",
    narration: "",

  }
  const thead = [
    { name: t("Sno"), width: "1%" },
    { name: t("ItemName"), width: "5%" },
    { name: t("Purchase Unit"), width: "5%" },
    { name: t("Purchase Tax(%)"), width: "5%" },
    { name: t("Disc.(%)"), width: "5%" },
    { name: t("Batch No."), width: "5%" },
    { name: t("Rate"), width: "5%" },
    { name: t("Qty"), width: "5%" },
    { name: t("Amount"), width: "5%" },
    { name: t("Selling Price"), width: "5%" },
    { name: t("Net Amt."), width: "5%" },
    { name: t("Expiry Date"), width: "5%" },
    { name: t("Action"), width: "1%" },
  ]
  const thead2 = [
    { name: t("Sno"), width: "1%" },
    { name: t("Quantity"), width: "5%" },
    { name: t("BatchNumber"), width: "5%" },
    { name: t("UnitPrice"), width: "5%" },
    { name: t("Selling Price"), width: "5%" },
    { name: t("GST Type"), width: "5%" },
    { name: t("Discount (%)"), width: "5%" },
    { name: t("IGST(%)"), width: "5%" },
    { name: t("CGST(%)"), width: "5%" },
    { name: t("SGST/UTGST(%)"), width: "5%" },
    { name: t("Expiry Date"), width: "5%" },
  ]

  const [values, setValues] = useState(initialValues);
  const [itemData, setItemData] = useState({});
  const [items, setItems] = useState([]);
  const [itemHistory, setItemHistory] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});

  const [TableData, setTableData] = useState([]);

  const [dropDownState, setDropDownState] = useState({
    BindStore: [],
    approvalList: [],
  });
  const [ItemNameSearchpayload, setItemNameSearch] = useState({});
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleReactSelect = (name, value) => {
    if (name === "SearchbyData") {
      setItemNameSearch((val) => ({
        ...val,
        [name]: value,
      }));
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

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

  const getApprovalList = async () => {
    try {

      const res = await StockUpdateBindApprovalType()
      if (res?.success) {

        const approvalList = res?.data?.map((item) => {
          return {
            label: item?.ApprovalType,
            value: item?.id
          }
        })
        setDropDownState((val) => ({
          ...val,
          approvalList: approvalList,
        }));
        approvalList?.length === 1 ? setValues((val) => ({ ...val, approveBy: { value: approvalList[0]?.value } })) : setValues((val) => ({ ...val, approveBy: "" }))
        console.log(res?.data)

      }
      else {
        console.log("first")
      }

    } catch (error) {

    }
  }

  const handleItemSearch = async (data) => {
    try {

      const res = await StockUpdateLoadAllStoreItems(data)
      if (res?.success) {
        return res?.data
      }
      else {
        return
        console.log("first")
      }

    } catch (error) {

    }
  }

  const search = async (event) => {
    const item = await handleItemSearch({
      searchKey: event?.query.trim(),
      type: values?.searchType?.value ?? "",
      storeType: values?.storetype?.value ?? "",
    });
    setItems(item);
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.Typename}
        </div>
      </div>
    );
  };

  const handleAddItem = () => {
    if (!values?.rate) {
      notify("Please Enter Rate", "error")
      return
    }
    if (!values?.quantity) {
      notify("Please Enter Quantity", "error")
      return
    }
    if (!values?.expiryDate) {
      notify("Please Enter Expiry Date", "error")
      return
    }
    if (!values?.sellingPrice) {
      notify("Please Enter Selling Price", "error")
      return
    }
    if (!values?.approveBy) {
      notify("Please Enter Approve By", "error")
      return
    }
    if (!itemData) {
      notify("Please Select An Item", "error")
      return
    }
    const itemID = values?.ItemID;
    const rate = values?.rate || 0;
    const quantity = values?.quantity || 0;
    const discountPercent = values?.discount || 0;
    const taxLabel = values?.purchaseTax?.label || "";
    const baseAmount = rate * quantity;
    const discountAmount = (baseAmount * discountPercent) / 100;

    let taxPercentage = 0;
    if (taxLabel === "IGST") {
      taxPercentage = values?.igst ? values?.igst : itemData?.IGSTPercent;
    } else if (taxLabel === "CGST&SGST") {
      taxPercentage = (values?.cgst ? values?.cgst : itemData?.CGSTPercent) + (values?.sgst ? values?.sgst : itemData?.SGSTPercent);
    } else if (taxLabel === "CGST&UTGST") {
      taxPercentage = (values?.cgst ? values?.cgst : itemData?.CGSTPercent) + (values?.utgst || 0);
    }

    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = (taxableAmount * taxPercentage) / 100;
    const netAmount = taxableAmount + taxAmount;

    const formattedExpiryDate = values?.expiryDate
      ? moment(values.expiryDate).format("DD/MM/YY")
      : "";

    const row = {
      ...values,
      item: itemData,
      TableItemName: itemData?.Typename,
      TablePurchaseUnit: "",
      TablePurchaseTax: taxLabel,
      TableDiscount: discountPercent,
      TableBatchNo: values?.batchNo,
      TableRate: rate,
      TableQty: quantity,
      TableAmount: baseAmount,
      TableSellingPrice: values?.sellingPrice,
      TableNetAmt: parseFloat(netAmount).toFixed(2),
      TableExpiryDate: formattedExpiryDate,
      discountAmount: discountAmount,
      taxPercentage: taxPercentage,
      taxAmount: taxAmount,
      "igstTaxPer": (values?.igst ? values?.igst : itemData?.item?.IGSTPercent) || 0,
      "igstTaxAmt": (taxableAmount * values?.igst ? values?.igst : itemData?.item?.IGSTPercent)/100 || 0,
      "cgstTaxPer": (values?.cgst ? values?.cgst : itemData?.item?.CGSTPercent) || 0,
      "cgstTaxAmt": (taxableAmount * values?.cgst ? values?.cgst : itemData?.item?.CGSTPercent) /100 || 0,
      "sgstTaxPer": (values?.sgst ? values?.sgst : itemData?.item?.SGSTPercent) || 0,
      "sgstTaxAmt": ( taxableAmount * values?.sgst ? values?.sgst : itemData?.item?.SGSTPercent) /100 || 0,
    };

    setTableData([...TableData, row])
    setValues(initialValues)
  }
  const handleRemoveItem = (index) => {

    const newItems = TableData.filter((item, i) => i !== index);
    setTableData(newItems);
  }

  const handleSave = async () => {
    try {
      debugger
      let payload = {
        "adjustments": TableData?.map((ele) => {
          debugger
          console.log(TableData)
          console.log(values)
          return {
            "itemID": ele?.item?.ItemID,
            "subCategoryID": ele?.item?.SubCategoryID,
            "quantity": ele?.quantity,
            "itemName": ele?.item?.Typename,
            "rate": ele?.rate,
            "disc": ele?.discount || 0,
            "discountAmount": ele?.discountAmount,
            "netAmount": ele?.TableNetAmt,
            "expiryDate": ele?.TableExpiryDate,
            "taxPer": ele?.taxPercentage,
            "taxAmount": ele?.taxAmount,
            "unitPrice": 0,
            "conversionFactor": Math.round(ele?.item?.ConversionFactor),
            "batchNo": ele?.batchNo,
            "narration": ele?.narration,
            "mrp": ele?.item?.MRP || 0,
            "minorUnit": ele?.item?.MajorUnit,
            "majorUnit": ele?.item?.MinorUnit,
            "type": "",
            "saleTax": ele?.item?.SaleTaxPer,
            "hsnCode": ele?.hsn ? ele?.hsn : ele?.item?.HSNCode,
            "igstTaxPer": ele?.igstTaxPer,
            "igstTaxAmt": ele?.igstTaxAmt,
            "cgstTaxPer": ele?.cgstTaxPer,
            "cgstTaxAmt": ele?.cgstTaxAmt,
            "sgstTaxPer": ele?.sgstTaxPer,
            "sgstTaxAmt": ele?.sgstTaxAmt,
            "gstType": ele?.purchaseTax?.value,
          }
        }),
        "adjustmentMetadata": {
          "hospId": userData?.hospital_ID,
          "userId": userData?.employeeID,
          // "ledgerNumber": userData?.deptLedgerNo,
          "approvedBy": TableData[0]?.approveBy?.value,
          "deptLedgerNo": userData?.deptLedgerNo,
          "storeLedgerNo": TableData[0]?.storetype?.value,
          "taxCalculateOn": "RateAD",
          "ipAddress": ip,
          "pageUrl": "stock-adjustment-tools"
        }
      }

      const response = await StockUpdateSaveStockAdjustment(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setTableData([])
        setValues(initialValues)
      } else {
        notify(response?.message, "error");
      }

    } catch (error) {

    }
  }

  const handleViewHistory = async (storeType, itemID) => {
    debugger
    try {

      const response = await StockUpdateViewHistory(storeType, itemID);
      if (response?.success) {
        setItemHistory(response?.data)
      } else {
        notify(response?.message, "error");
        setItemHistory([])
      }
    } catch (error) {
      setItemHistory([])
      console.error("Something Went Wrong", error);
    }
  }

  useEffect(() => {
    PRBindStore();
    getApprovalList()
  }, []);
  console.log(values, "values");
  return (<>

    {handleModelData?.isOpen && (
      <Modal
        visible={handleModelData?.isOpen}
        setVisible={setIsOpen}
        modalWidth={handleModelData?.width}
        Header={t(handleModelData?.label)}
        // buttonType={"submit"}
        // buttons={handleModelData?.extrabutton}
        // buttonName={handleModelData?.buttonName}
        modalData={handleModelData?.modalData}
        // setModalData={setModalData}
        footer={<></>}
        handleAPI={handleModelData?.handleInsertAPI}
      >
        {/* //uguiguiguiguig */}
        {handleModelData?.Component}
      </Modal>
    )}

    <div className="card ">
      <Heading title={"Stock Adjustment(+)"} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Store Type")}
          id={"storetype"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.BindStore}
          handleChange={handleReactSelect}
          value={values?.storetype?.value}
          name={"storetype"}
        />
        <Input
          type="number"
          className="form-control required-fields"
          id="rate"
          name="rate"
          lable={t("Rate")}
          placeholder=""
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
          value={values?.rate}
          onChange={handleChange}
        />
        <Input
          type="number"
          className="form-control required-fields"
          id="quantity"
          name="quantity"
          lable={t("Quantity")}
          placeholder=""
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
          value={values?.quantity}
          onChange={handleChange}
        />
        <Input
          type="number"
          className="form-control required-fields"
          id="sellingPrice"
          name="sellingPrice"
          lable={t("Selling Price")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.sellingPrice}
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control"
          id="batchNo"
          name="batchNo"
          lable={t("Batch No.")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.batchNo}
          onChange={handleChange}
        />
        <ReactSelect
          placeholderName={t("purchase Tax %")}
          id={"purchaseTax"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            { label: "IGST", value: "IGST" },
            { label: "CGST&SGST", value: "CGST&SGST" },
            { label: "CGST&UTGST", value: "CGST&UTGST" }
          ]}
          name="purchaseTax"
          handleChange={handleReactSelect}
          value={values?.purchaseTax?.value}
          requiredClassName="required-fields"
        />
        {values?.purchaseTax?.value !== "IGST" && <Input
          type="number"
          className="form-control"
          id="cgst"
          name="cgst"
          lable={t("cgst %")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.cgst}
          onChange={handleChange}
        />}
        {values?.purchaseTax?.value === "CGST&SGST" &&
          <Input
            type="number"
            className="form-control"
            id="sgst"
            name="sgst"
            lable={t("sgst %")}
            placeholder=""
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            value={values?.sgst}
            onChange={handleChange}
          />}
        {

          values?.purchaseTax?.value === "CGST&UTGST" &&
          <Input
            type="number"
            className="form-control"
            id="utgst"
            name="utgst"
            lable={t("utgst %")}
            placeholder=""
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            value={values?.utgst}
            onChange={handleChange}
          />}
        {values?.purchaseTax?.value === "IGST" && <Input
          type="number"
          className="form-control"
          id="igst"
          name="igst"
          lable={t("igst %")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.igst}
          onChange={handleChange}
        />}
        <Input
          type="number"
          className="form-control"
          id="discount"
          name="discount"
          lable={t("Discount %")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.discount}
          onChange={(e) => {
            if (e.target.value > 100) {
              return
            } else {
              handleChange(e)
            }
          }}
        />
        <Input
          type="text"
          className="form-control"
          id="hsn"
          name="hsn"
          lable={t("hsn code")}
          placeholder=""
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          value={values?.hsn}
          onChange={handleChange}
        />
        <ReactSelect
          placeholderName={t("Approve By")}
          id={"approveBy"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.approvalList}
          name="approveBy"
          handleChange={handleReactSelect}
          value={values?.approveBy?.value}
          requiredClassName="required-fields"
        />
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("Expiry Date")}
          name="expiryDate"
          id="expiryDate"
          value={values?.expiryDate}
          showTime
          hourFormat="12"
          handleChange={handleChange}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <TextAreaInput
          type="text"
          className="form-control"
          id="narration"
          name="narration"
          lable={t("Narration")}
          placeholder=""
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          maxLength={200}
          value={values?.narration}
          onChange={handleChange}
        />
        <ReactSelect
          placeholderName={t("Search Type")}
          id={"searchType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            { label: "Search by First Name", value: "FirstName" },
            { label: "Search by Word", value: "AnyName" },
            { label: "Search by Item Code", value: "Code" },
          ]}
          name="searchType"
          handleChange={handleReactSelect}
          value={values?.searchType?.value}
          requiredClassName="required-fields"
        />
        <AutoComplete
          value={itemData?.Typename ? itemData?.Typename : itemData}
          suggestions={items}
          completeMethod={search}
          className="col-xl-4 col-md-4 col-sm-6 col-12"
          onSelect={(e) => {


            setItemData(e?.value)
          }}
          id="searchtest"
          onChange={(e) => {

            const data =
              typeof e.value === "object"
                ? e?.value?.autoCompleteItemName
                : e.value;
            setItemData(data);
          }}
          itemTemplate={itemTemplate}
        />
        <button className={`btn btn-sm btn-success mx-2 ${itemData?.ItemID ? "" : "disable-reject"}`}
          onClick={() => {
            let itemID = itemData?.ItemID?.split("#")[0];
            handleViewHistory(itemID)
            if(itemHistory?.length===0){
              notify("No History Found","error")
              return
            }
            setHandleModelData({
              label: t(`Item History of: ${itemData?.Typename}`),

              width: "80vw",
              isOpen: true,

              Component: (<>
                <Tables
                  thead={thead2}
                  tbody={itemHistory?.map((ele, index) => ({
                    sNo: index + 1,
                    Qty: ele?.Qty,
                    BatchNumber: ele?.BatchNumber,
                    UnitPrice: ele?.UnitPrice,
                    MRP: ele?.MRP,
                    GSTType: ele?.GSTType,
                    DiscPer: ele?.DiscPer ? Number(ele?.DiscPer) : "0",
                    IGSTPercent: ele?.IGSTPercent ? Number(ele?.IGSTPercent) : "0",
                    CGSTPercent: ele?.CGSTPercent ? Number(ele?.CGSTPercent) : "0",
                    SGSTPercent: ele?.SGSTPercent ? Number(ele?.SGSTPercent) : "0",
                    MedExpiryDate: ele?.MedExpiryDate
                  }))}
                />
              </>),

            });
          }}
        >
          {t("View History")}
        </button>
        <button className={`btn btn-sm btn-success mx-2 ${itemData?.ItemID ? "" : "disable-reject"}`}
          onClick={handleAddItem}
        >
          {t("Add Item")}
        </button>
        {console.log(itemData, "itemData")}
      </div>
    </div>
    {TableData?.length > 0 && <div className="card mt-2 row px-2">
      <Tables
        thead={thead}
        tbody={TableData?.map((ele, index) => ({
          sNo: index + 1,
          itemName: ele?.TableItemName,
          purchaseUnit: ele?.TablePurchaseUnit,
          purchaseTax: ele?.TablePurchaseTax,
          discount: ele?.TableDiscount,
          BatchNo: ele?.TableBatchNo,
          rate: ele?.TableRate,
          Qty: ele?.TableQty,
          amount: ele?.TableAmount,
          sellingPrice: ele?.TableSellingPrice,
          netAmt: ele?.TableNetAmt,
          expiryDate: ele?.TableExpiryDate,
          action: (<i
            className="fa fa-trash text-danger text-center p-2"
            onClick={() => {
              handleRemoveItem(index)
            }}

          />)
        }))}
      />
      <div className="col-xl-12 col-md-12 col-sm-12 col-12 d-flex justify-content-end ">
        <div className="col-xl-3 col-md-3 col-sm-4 col-4 d-flex justify-content-end ">

          <button className="btn btn-sm btn-success col-xl-2 col-md-2 col-sm-2 col-2 my-2"
            onClick={handleSave}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>}
  </>
  );
};

export default StockAdjustment;
