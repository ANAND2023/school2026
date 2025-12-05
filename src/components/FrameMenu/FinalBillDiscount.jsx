import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import LabeledInput from "../formComponent/LabeledInput";
import Tables from "../UI/customTable";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../formComponent/TextAreaInput";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import {
  ApplyFinalBillDiscount,
  BillingIPDFinalDiscount,
} from "../../networkServices/BillingsApi";
import { notify } from "../../utils/ustil2";

const DiscountBill = ({ data }) => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    billDisc:"0",
    billDiscPer:"0",
   
    Approval:{},
    discountType:{ label: "Hospital Discount", value: "1" },
  });
  console.log("values",values)
  const transactionID = data?.transactionID;
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Department" },
    { name: "Quantity" },
    { name: "Gross Amount" },
    { name: "Item Wise Disc." },
    { name: "Amount" },
    { name: "Disc. Given By" },
    { name: "Disc. Reason" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 200) return;

    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    const netAmount = parseFloat(values?.AmountBilled) || 0;
    console.log("billDiscPer", name, value);
    if (name === "billDisc" && numericValue > netAmount) {
      notify("Discount Amount Cannot Be Greater Than Net Amount", "error");
      return;
    } else if (name === "billDiscPer" && numericValue > 100) {
      notify("Please Enter Valid Discount Percent", "error");
      return;
    }

    setValues((val) => ({ ...val, [label]: value }));
  };
  const charLimit = 200;
  const currentLength = values?.discReason?.length || 0;
  const charsLeft = charLimit - currentLength;

  const billDiscountData = async () => {
  

    const response = await BillingIPDFinalDiscount(data?.transactionID);
    setValues((preV)=>(
    {  ...preV,
      ...response?.data[0]}
    ));
  };

  const handleSaveBtn = async () => {
    if(!values?.discountType){
      notify("Please Select Discount Type","warn")
      return
    }
    if(!values?.Approval){
      notify("Please Select Approval","warn")
      return
    }
    
    const payload = {
      tid: String(transactionID),
      approvalBy: String(values?.Approval?.value?values?.Approval?.value:""),
      discountReason: String(values?.discReason?values?.discReason:""),
      disAmount: Number(values?.billDisc?values?.billDisc:""),
      disPercent: Number(values?.billDiscPer?values?.billDiscPer:""),
      discountType: String(values?.discountType?.value?values?.discountType?.value:""),
      billAmount: String(values?.WithGSTbillamount?values?.WithGSTbillamount:""),
    };

    const response = await ApplyFinalBillDiscount(payload);
    if(response?.success){
       notify(response?.message, "success");
       setValues((preV)=>({
        ...preV,
 billDisc:"0",
    billDiscPer:"0",
   
    Approval:{}
       }))
      billDiscountData()
    }
    else{
        notify(response?.message, "error");
    }
    // const { message, success, data } = response;
    // if (data) {
    //   notify(message, "success");
    // }
  };

  const discountPercent = values?.Newbillamount
    ? Math.round((values?.TotalDisc / values?.Newbillamount) * 100)
    : 0;
  const billAfterDiscount = values?.Newbillamount - values?.DiscountOnBill;

  useEffect(() => {
    billDiscountData();
  }, []);

  return (
    <div className="card px-2">
      <Heading title={"Item Discount Details"} isBreadcrumb={false} />
      <div className="row p-2">
        <LabeledInput
          label={"UHID"}
          value={values?.PatientID}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Paid Amount"}
          value={values?.AmountReceived}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Gross Bill"}
          value={values?.AmountBilled}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Discount Amount"}
          value={values?.TotalDisc}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Net Amount"}
          value={values?.NetBillAmount}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Disc(%)"}
          value={values?.AlreadyGivenDiscPer}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Hospital Disc. Amt"}
          value={values?.HospitalBillDiscAmt}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Panel Disc Amt"}
          value={values?.PanelBillDiscAmt}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
                <LabeledInput
          label={"Hospital Amount"}
          value={values?.HospitalAmount}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <LabeledInput
          label={"Pharmacy Amount"}
          value={values?.PharmacyAmount}
          className="col-xl-2 p-1 col-md-6 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Discount Type")}
          name="discountType"
          value={values?.discountType?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Hospital Discount", value: "1" },
            { label: "Panel Discount", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("Bill Disc.")}
          placeholder=" "
          name="billDisc"
          onChange={(e) => handleInputChange(e, 0, "billDisc")}
          value={values?.billDisc}
          // required={false}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("Bill Disc(%)")}
          placeholder=" "
          name="billDiscPer"
          onChange={(e) => handleInputChange(e, 0, "billDiscPer")}
          value={values?.billDiscPer}
          // required={false}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <ReactSelect
          placeholderName={t("Approval")}
          name="Approval"
          value={values?.Approval?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[{ label: "Head Operations", value: "1" }]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="discReason"
          name="discReason"
          value={values?.discReason ? values?.discReason : ""}
          onChange={handleChange}
          lable={`${t("Disc Reason")} (${charsLeft} characters left)`}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
          rows={1}
        />

        <button className="btn btn-success" onClick={handleSaveBtn}>
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default DiscountBill;
