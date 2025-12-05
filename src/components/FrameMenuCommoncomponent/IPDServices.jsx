import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useState } from "react";
import Input from "../formComponent/Input";
import DatePicker from "../formComponent/DatePicker";
import ReactSelect from "../formComponent/ReactSelect";
import { useSelector } from "react-redux";
import { Tabfunctionality } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import {
  BillingGetIPDAlreadyPrescribeItem,
  BillingGetRateFromFollowedPanel,
  BindCategory,
  BindItem,
  OPDServiceBookingChecklist,
  PatientBillingGetDiscount,
  PatientBillingGetPackage,
  PatientBillingGetPackageDetail,
} from "../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { GetBindSubCatgeory } from "../../store/reducers/common/CommonExportFunction";
import AddItemTable from "../UI/customTable/billings/AddItemTable";
import moment from "moment";
import { ROUNDOFF_VALUE } from "../../utils/constant";
import { use } from "react";
import Heading from "../UI/Heading";
import Tables from "../UI/customTable";
import { notify } from "../../utils/ustil2";
import LabeledInput from "../formComponent/LabeledInput";
import { opdgetPatientAdvanceCms } from "../../networkServices/opdserviceAPI";
import Details from "./Details";
import Confirm from "../modalComponent/Confirm";


const IPDServices = ({
  data,
  pateintDetails,
  Authorization,
  handleSaveAddItemSuccessfully,
  GetBindBillDetails,
  setIsPackageAdd,
  OPDServiceBookingcall

}) => {
  // console.log("firstdata", data)
  // console.log("pateintDetails", pateintDetails)
  debugger
  const [t] = useTranslation();
  const THEADSERVICEDETAILS = [
    t("Date"),
    t("CPT Code"),
    t("SubCategory Name"),
    t("Service Name"),
    t("Doctor"),
    t("Sample Req. Date"),
    t("Sample Req. Time"),
    t("Rate"),
    t("Quantity"),
    t("Dis(%)"),
    t("Dis Amt"),
    t("Amount"),
    t("Pat. Payable"),
    t("Remark"),
    { name: "U", width: "0%" },
    { name: "R", width: "1%" },
  ];
 const [serviceBookinglist, setServiceBookinglist] = useState([]);
  const { GetBindSubCatgeoryData } = useSelector((state) => state.CommonSlice);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const [dropDownState, setDropDownState] = useState([]);
  console.log("dropDownState", dropDownState)
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sancationAmountData, setSancationAmountData] = useState({
    "Amount": "",
    "UsedAmount": ""
  });
    const [confirmBoxvisible, setConfirmBoxvisible] = useState({
      show: false,
      alertMessage: "",
      lableMessage: "",
      chidren: "",
    });
  const [formData, setFormData] = useState({
    Category: { lable: "All", value: "0" },
    SubCategory: { lable: "All", value: "0" },
    Quantity: "",
    fromDate: new Date(),
    toDate: new Date(),
    Remarks: "",
    doctorID: {},
    discount: "",
    amount: "",
    packageID: "0"
  });

  console.log(tableData, "tableData")

  const [packageID, setPackageID] = useState({ label: 'No Package', value: '0' });
  console.log("packageIDpackageID", packageID)
  const [dropDownData, setDropDownData] = useState({
    category: [],
    subcategory: [],
  });

  const [subPackageDetails, setSubPackageDetails] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const handleChange = (e) => {
    debugger
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderApiCall = async () => {
    try {
      const [Category] = await Promise.all([
        BindCategory(12),
        subCategoryBind(12, "0"),
      ]);

      setDropDownData({
        ...dropDownData,
        ["category"]: [
          { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            Category?.data,
            "name",
            "categoryID"
          ),
        ],
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getPatientAdvanceCms = async (pateintDetails) => {
    debugger
    try {
      let payload = {
        "type": 1,
        "patientID": pateintDetails?.PatientID,
      }
      const response = await opdgetPatientAdvanceCms(payload);
      if (response?.success) {
        setSancationAmountData(response?.data[0]);
      }
      else {
        setSancationAmountData({
          "Amount": "",
          "UsedAmount": ""
        });
      }

    } catch (error) {
      console.error("Error in getPatientAdvanceCms:", error);

    }
  }

  const subCategoryBind = async (Type, CategoryID) => {
    try {
      await dispatch(GetBindSubCatgeory({ Type, CategoryID }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const handleReactSelect = async (name, e) => {
    debugger
    if (name === "Category" && e) {
      await subCategoryBind("12", e.value);
    }
    setFormData({ ...formData, [name]: e || null });
  };





  const handleBindItem = async (requestbody) => {
    try {
      const response = await BindItem(requestbody);
      return response?.data;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const search = async (event) => {
    console.log("pateintDetails", pateintDetails)
    console.log("GetBindBillDetails")
    try {
      const item = await handleBindItem({
        scheduleChargeID: Number(pateintDetails?.ScheduleChargeID),
        panelID: Number(pateintDetails?.PanelID),
        ipdCaseTypeID: Number(pateintDetails?.IPDCaseTypeID),
        itemName: event?.query.trim(),
        categoryID: Number(formData?.Category?.value) || 0,
        subcategory: Number(formData?.SubCategory?.value) || 0,
        requestType: String(""),
        IsInternational: pateintDetails?.IsInternational ? pateintDetails?.IsInternational : ""
      });
      setItems(item);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const itemTemplate = (item) => {
    return (
      <div
        className="p-clearfix"
      // onClick={() => validateInvestigation(item, 0, 0, 1, 0)}
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.ItemDisplayName} {item?.ItemCode ? `(${item?.ItemCode})` : ""} {item?.SubCategoryName ? `(${item?.SubCategoryName})` : ""}

          {/* {item?.TypeName} */}
        </div>
      </div>
    );
  };

  const handlePatientBillingGetDiscount = async (payload) => {
    try {
      const response = await PatientBillingGetDiscount(payload);
      return response;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleAddCountDateIteration = (formDate, toDate) => {
    const diffCount =
      toDate.startOf("day").diff(formDate.startOf("day"), "days") + 1;
    return diffCount;
  };

  const handleBillingGetRateFromFollowedPanel = async (
    ItemID,
    PanelID,
    IPDCaseTypeID,
    IsInternational
  ) => {
    debugger
    try {
      const response = await BillingGetRateFromFollowedPanel(
        ItemID,
        PanelID,
        IPDCaseTypeID, IsInternational
      );
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  console.log(remainingAmount, "remainingAmount")

 const handleGetAlreadyPrescribeItem = async (TransactionID, itemID) => {
    try {
      const data = await BillingGetIPDAlreadyPrescribeItem(TransactionID, itemID);
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };


  const handleAddItem = async (e) => {
    debugger
    const { value } = e;
    const isDuplicate=tableData?.find((val)=>val?.ItemID===value?.ItemID)
    // console.log("isDuplicate",isDuplicate)
    if(isDuplicate){
      notify("Item already exists","warn");
      return
    }

debugger
//   const fouthData = await handleGetAlreadyPrescribeItem(
//             pateintDetails?.TransactionID,
//            value?.ItemID
//           );

//           debugger
//   const userDecision = await new Promise((resolve) => {
//     debugger
//             if (Object.keys(fouthData)) {
//               debugger
//               setConfirmBoxvisible({
//                 show: true,
//                 lableMessage: <div>Do You Want To Prescribe Again ?</div>,
//                 alertMessage: (
//                   <div>
//                     This Service is Already Prescribed By{" "}
//                     <span style={{ color: "blue", fontWeight: 700 }}>
//                       {/* {fouthData?.UserName}{" "} */}
//                     </span>
//                     Date on{" "}
//                     <span style={{ color: "blue", fontWeight: 700 }}>
//                       {fouthData}
//                     </span>
//                   </div>
//                 ),
//                 chidren: (
//                   <div>

//                     <button
//                       className="btn btn-sm btn-primary mx-1"
//                       onClick={() => {

//                         setConfirmBoxvisible({
//                           show: false,
//                           alertMessage: "",
//                           lableMessage: "",
//                           chidren: "",
//                         });
//                         resolve(true); // Prescribe Again
//                       }}
//                     >
//                       Prescribe Again
//                     </button>

//                     {/* {testPaymentState?.type !== "4" && <button
//                       className="btn btn-sm btn-primary mx-1"
//                       onClick={() => {

//                         setConfirmBoxvisible({
//                           show: false,
//                           alertMessage: "",
//                           lableMessage: "",
//                           chidren: "",
//                         });
//                         resolve(true); // Prescribe Again
//                       }}
//                     >
//                       Prescribe Again
//                     </button>} */}

//                     <button
//                       className="btn btn-sm btn-danger mx-1"
//                       onClick={() => {
//                         setConfirmBoxvisible({
//                           show: false,
//                           alertMessage: "",
//                           lableMessage: "",
//                           chidren: "",
//                         });
//                         resolve(false); // Cancel
//                       }}
//                     >
//                       {t("Cancel")}
//                     </button>
//                   </div>
//                 ),
//               });
//             } else {
//               resolve(true); // No need to confirm, proceed with prescribing
//             }
//           });


// if(!userDecision){
//   return
  
// }


const fouthData = await handleGetAlreadyPrescribeItem(
  pateintDetails?.TransactionID,
  value?.ItemID
);

debugger;

let userDecision = true; // default: allow proceed

// ✅ Show popup only if fouthData is a string (data exists)
if (typeof fouthData === "string" && fouthData.trim() !== "") {
  userDecision = await new Promise((resolve) => {
    setConfirmBoxvisible({
      show: true,
      lableMessage: <div>Do You Want To Prescribe Again ?</div>,
      alertMessage: (
        <div>
          This Item is Already Prescribed On{" "}
          <span style={{ color: "blue", fontWeight: 700 }}>
            {fouthData}
          </span>
        </div>
      ),
      chidren: (
        <div>
          <button
            className="btn btn-sm btn-primary mx-1"
            onClick={() => {
              setConfirmBoxvisible({
                show: false,
                alertMessage: "",
                lableMessage: "",
                chidren: "",
              });
              resolve(true); // ✅ Prescribe Again
            }}
          >
            Prescribe Again
          </button>

          <button
            className="btn btn-sm btn-danger mx-1"
            onClick={() => {
              setConfirmBoxvisible({
                show: false,
                alertMessage: "",
                lableMessage: "",
                chidren: "",
              });
              resolve(false); // ❌ Cancel
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      ),
    });
  });
}

if (!userDecision) {
  return; // user cancelled ❌
}



    try {
      const getDiscount = await handlePatientBillingGetDiscount({
        panelID: String(pateintDetails?.PanelID),
        itemID: String(value?.ItemID),
        patientTypeID: String(pateintDetails?.PatientTypeID),
        membershipNo: String(pateintDetails?.MemberShipCardNo),
      });
      // debugger
      const GetRateFromFollowedPanel =
        await handleBillingGetRateFromFollowedPanel(
          value?.ItemID,
          pateintDetails?.PanelID,
          pateintDetails?.IPDCaseTypeID,
          pateintDetails?.IsInternational
        );

      const loopCount = handleAddCountDateIteration(
        moment(formData?.fromDate),
        moment(formData?.toDate)
      );
      const addTableData = [];
      for (let i = 0; i < loopCount; i++) {
        const currentDate = moment(formData?.fromDate);
        const newDate = currentDate.add(i, "days").format("DD-MMM-YYYY");

        const [reponseData] = getDiscount?.data;

        const addObj = {
          ...value,
          ...reponseData,

          ipdPanelDiscPercent: Number(reponseData?.ipdPanelDiscPercent).toFixed(
            ROUNDOFF_VALUE
          ),

          Date: newDate,

          ...pateintDetails,
        };

        addObj.quantity = 1;

        addObj.discountAmount =
          Number(addObj.Rate) *
          Number(1) *
          Number(addObj?.ipdPanelDiscPercent).toFixed(ROUNDOFF_VALUE) *
          0.01;

        addObj.amount =
          Number(value.Rate) * Number(addObj?.quantity) -
          addObj?.discountAmount;

        addObj.PatientPayable =
          Number(addObj.isPayble) === 1
            ? addObj.amount
            : Number(addObj.amount) *
            Number(addObj?.ipdCoPayPercent).toFixed(ROUNDOFF_VALUE) *
            0.01;

        addObj.sampleReqDate = new Date();
        addObj.sampleReqTime = new Date();
        addObj.remark = "";
        addObj.isUrgent = false;
        addObj.Payable = false;
        addTableData.push(addObj);
      }


      //validation for package 
debugger
      if (packageID?.value === "0" ) {
        setTableData([...tableData, ...addTableData]);
        setValue("");
      }
      else {


        const index = subPackageDetails?.findIndex((val) => (val?.CategoryID === value?.CategoryID))

        if (index !== -1) {
          const data = JSON.parse(JSON.stringify(subPackageDetails))
          if (data[index]["NewAmount"] >= value?.Rate) {
            data[index]["NewAmount"] = data[index]["NewAmount"] - value?.Rate
            setSubPackageDetails(data)
            setTableData([...tableData, ...addTableData]);
            setValue("");
          } else {
            notify("Item Can't be added", "error");
          }
        } else {
          if (remainingAmount >= value?.Rate) {
            setTableData([...tableData, ...addTableData]);
            setValue("");
            setRemainingAmount(remainingAmount - value?.Rate)
          } else {
            notify("Item Can't be added", "error");
          }
        }
      }

      //  setTableData([...tableData, ...addTableData]);
      //           setValue("");

    } catch (error) {
      console.log(error, "SomThing Went Wrong");
    }
  };
  // const handleAddItem = async (e) => {
  //   debugger
  //   const { value } = e;
  //   const isDuplicate=tableData?.find((val)=>val?.ItemID===value?.ItemID)
  //   // console.log("isDuplicate",isDuplicate)
  //   if(isDuplicate){
  //     notify("Item already exists","warn");
  //     return
  //   }
  //   try {
  //     const getDiscount = await handlePatientBillingGetDiscount({
  //       panelID: String(pateintDetails?.PanelID),
  //       itemID: String(value?.ItemID),
  //       patientTypeID: String(pateintDetails?.PatientTypeID),
  //       membershipNo: String(pateintDetails?.MemberShipCardNo),
  //     });
  //     // debugger
  //     const GetRateFromFollowedPanel =
  //       await handleBillingGetRateFromFollowedPanel(
  //         value?.ItemID,
  //         pateintDetails?.PanelID,
  //         pateintDetails?.IPDCaseTypeID,
  //         pateintDetails?.IsInternational
  //       );

  //     const loopCount = handleAddCountDateIteration(
  //       moment(formData?.fromDate),
  //       moment(formData?.toDate)
  //     );
  //     const addTableData = [];
  //     for (let i = 0; i < loopCount; i++) {
  //       const currentDate = moment(formData?.fromDate);
  //       const newDate = currentDate.add(i, "days").format("DD-MMM-YYYY");

  //       const [reponseData] = getDiscount?.data;

  //       const addObj = {
  //         ...value,
  //         ...reponseData,

  //         ipdPanelDiscPercent: Number(reponseData?.ipdPanelDiscPercent).toFixed(
  //           ROUNDOFF_VALUE
  //         ),

  //         Date: newDate,

  //         ...pateintDetails,
  //       };

  //       addObj.quantity = 1;

  //       addObj.discountAmount =
  //         Number(addObj.Rate) *
  //         Number(1) *
  //         Number(addObj?.ipdPanelDiscPercent).toFixed(ROUNDOFF_VALUE) *
  //         0.01;

  //       addObj.amount =
  //         Number(value.Rate) * Number(addObj?.quantity) -
  //         addObj?.discountAmount;

  //       addObj.PatientPayable =
  //         Number(addObj.isPayble) === 1
  //           ? addObj.amount
  //           : Number(addObj.amount) *
  //           Number(addObj?.ipdCoPayPercent).toFixed(ROUNDOFF_VALUE) *
  //           0.01;

  //       addObj.sampleReqDate = new Date();
  //       addObj.sampleReqTime = new Date();
  //       addObj.remark = "";
  //       addObj.isUrgent = false;
  //       addObj.Payable = false;
  //       addTableData.push(addObj);
  //     }


  //     //validation for package 

  //     if (packageID?.value === "0") {
  //       setTableData([...tableData, ...addTableData]);
  //       setValue("");
  //     }
  //     else {


  //       const index = subPackageDetails?.findIndex((val) => (val?.CategoryID === value?.CategoryID))

  //       if (index !== -1) {
  //         const data = JSON.parse(JSON.stringify(subPackageDetails))
  //         if (data[index]["NewAmount"] >= value?.Rate) {
  //           data[index]["NewAmount"] = data[index]["NewAmount"] - value?.Rate
  //           setSubPackageDetails(data)
  //           setTableData([...tableData, ...addTableData]);
  //           setValue("");
  //         } else {
  //           notify("Item Can't be added", "error");
  //         }
  //       } else {
  //         if (remainingAmount >= value?.Rate) {
  //           setTableData([...tableData, ...addTableData]);
  //           setValue("");
  //           setRemainingAmount(remainingAmount - value?.Rate)
  //         } else {
  //           notify("Item Can't be added", "error");
  //         }
  //       }
  //     }

  //     //  setTableData([...tableData, ...addTableData]);
  //     //           setValue("");

  //   } catch (error) {
  //     console.log(error, "SomThing Went Wrong");
  //   }
  // };
  const handlePatientBillingGetPackage = async (TransactionID) => {
    try {
      const response = await PatientBillingGetPackage(TransactionID);
      console.log("packageID response", response)
      setDropDownState([
        { label: "No Package", value: "0" },
        ...handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "ItemID"
        ),
      ]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const getPackageDetail = async () => {
    debugger
    try {
      let payload = {
        "TransactionId": pateintDetails?.TransactionID,
        "PackageItemID": packageID?.value,
        "LedgerTnxRefID": packageID?.LedgerTnxRefID
      }

      let response = await PatientBillingGetPackageDetail(payload);
      let netAmount = 0;
      if (response?.success) {
        setSubPackageDetails(response?.data);
        netAmount = response?.data?.reduce((acc, current) => {
          return acc += current["NewAmount"]
        }, 0) || 0;
      } else {
        setSubPackageDetails([]);
      }
      setRemainingAmount(packageID?.HospitalAmt - netAmount)


    } catch (error) {
      setSubPackageDetails([]);
      console.log(error, "Something Went Wrong");

    }
  }

  useEffect(() => {

    if (packageID && packageID?.value !== "0") {
      getPackageDetail();
    }
    else {
      setSubPackageDetails([]);
      setRemainingAmount(0);
    }

  }, [packageID]);

  useEffect(() => {
    renderApiCall();
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
    getPatientAdvanceCms(pateintDetails)
  }, []);

  {
    console.log("serviceBookinglistserviceBookinglist", serviceBookinglist)
  }



    const OPDServiceBookinglist = async () => {
     
      debugger //anand
      try {
  
        let payload = {
          "PatientID": data?.patientID ? data?.patientID : "",
          "Type": 1,
          "TransactionId": data?.transactionID ? data?.transactionID : "",
          PannelID: data?.panelID
        }
  
        const response = await OPDServiceBookingChecklist(payload);
        if (response?.success) {
          // notify(response?.message, "success");
          setServiceBookinglist(response?.data[0])
          // setIsOpen()
          // setModalData({});
          // dispatch(GetBindReferDoctor());
        }
        else {
          // notify(response?.message, "error");
          // setIsOpen()
          // setModalData({});
        }
  
      } catch (error) {
        console.error("Error saving Pro Name:", error);
  
      }
    }
    useEffect(()=>{
OPDServiceBookinglist()
    },[])

  const admitDateObj = data?.admitDate
    ? moment(data.admitDate, "DD-MMM-YYYY hh:mm A").toDate()
    : null;
  return (
    <>
      <Details data={data} />
      <Heading title={t("Add Services Details")} isBreadcrumb={false} />
      <div className="row py-2">
        <ReactSelect
          placeholderName={t("Category")}
          id={"Category"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"Category"}
          dynamicOptions={dropDownData?.category}
          value={formData?.Category?.value}
          handleChange={handleReactSelect}
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id={"SubCategory"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"SubCategory"}
          dynamicOptions={[
            { label: "All", value: "0" },
            ...GetBindSubCatgeoryData.map((item) => {
              return {
                label: item?.name,
                value: item?.subCategoryID,
              };
            }),
          ]}
          value={formData?.SubCategory?.value}
          handleChange={handleReactSelect}
        />
        <ReactSelect
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          placeholderName={"package"}
          name={"packageID"}
          id={"packageID"}
          dynamicOptions={dropDownState}
          value={packageID?.value}
          // value={formData.packageID}
          removeIsClearable={true}
          //  handleChange={handleChange}
          handleChange={(_, e) => setPackageID(e)}
        // handleChange={(_, e) => setPackageID(e?.value)}
        />
        {packageID?.value !== '0' && <>


          <Input
            type="text"
            className="form-control"
            id="amountPaid"
            name="amountPaid"
            // onChange={handleChange}
            value={packageID?.Amount}
            lable={t("Package Amount")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            // onChange={handleChange}
            value={packageID?.HospitalTotalAmount}
            lable={t("Hospital Amt")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="UtilizeHospitalAmt"
            name="UtilizeHospitalAmt"
            // onChange={handleChange}
            value={packageID?.UtilizeHospitalAmt}
            lable={t("Utilize Hospital AMT")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="UtilizeHospitalAmt"
            name="UtilizeHospitalAmt"
            // onChange={handleChange}
            value={packageID?.HospitalAmt}
            lable={t("Hospital balance Amt")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="PharmacyTotalAmount"
            name="PharmacyTotalAmount"
            // onChange={handleChange}
            value={packageID?.PharmacyTotalAmount}
            lable={t("Pharmacy Total Amt")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="UtilizePharmacyAmt"
            name="UtilizePharmacyAmt"
            // onChange={handleChange}
            value={packageID?.UtilizePharmacyAmt}
            lable={t("Utilize Pharmacy Amt")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="PharmacyAmt"
            name="PharmacyAmt"
            // onChange={handleChange}
            value={packageID?.PharmacyAmt}
            lable={t("Pharmacy Balance Amt")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />




        </>}

        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={formData.fromDate}
          handleChange={handleChange}
          minDate={admitDateObj}
          lable={t("FromDate")}
          placeholder={VITE_DATE_FORMAT}
        />

        {/* </div>
          <div className="row py-2"> */}
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          minDate={admitDateObj}
          value={formData.toDate}
          handleChange={handleChange}
          lable={t("ToDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={t("Amount")}
            value={sancationAmountData?.Amount}
            className={"mb-2"}
          />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={t("Used Amount")}
            value={sancationAmountData?.UsedAmount}
            className={"mb-2"}
          />
        </div>
        <div
          className="col-xl-4 col-md-4 col-sm-6 col-12"
          style={{ position: "relative" }}
        >
          <AutoComplete
            value={value}
            suggestions={items}
            completeMethod={search}
            // ref={ref}
            className="w-100"
            onSelect={(e) => handleAddItem(e)}
            id="searchtest"
            onChange={(e) => {
              const data =
                typeof e.value === "object" ? `${e?.value?.ItemDisplayName}(${e.value?.ItemCode})` : e.value;
              setValue(data);
            }}
            itemTemplate={itemTemplate}
          />
          <label htmlFor={"searchtest"} className="lable searchtest">
            {t("Search Name/Item Code")}
          </label>
        </div>
      </div>
      {subPackageDetails?.length > 0 && <div className="card mt-2">
        <Heading title={t("Package Details")} isBreadcrumb={false} />
        {/* {console.log("selectedPackages", selectedPackages)} */}
        <Tables
          thead={[
            { name: t("SNo"), width: "1%" },
            t("Category"),
            t("Sub-Category"),
            t("ItemName"),

            t("Total Amount"),
            t("UtilizedAmt"),
            t("Balance"),

          ]}
          tbody={subPackageDetails.map((item, i) => ({
            SNo: i + 1,
            category: item?.CategoryName || "",
            SubCategory: item?.SubCategoryName || "",
            ItemName: item?.ItemName,

            Amount: item?.Amount || "0.00",
            UtilizedAmt: item?.UtilizedAmt || "0.00",
            NewAmount: item?.NewAmount || "0.00",

          }))}
        />

      </div>}
      <div className="mt-2">
        {console.log(tableData, "tableDatatableData")}
        <Heading title={t("Item Details")} isBreadcrumb={false} />
        <AddItemTable
          THEAD={THEADSERVICEDETAILS}
          tbody={tableData}
          setTableData={setTableData}
          pateintDetails={pateintDetails}
          Authorization={Authorization}
          handleSaveAddItemSuccessfully={handleSaveAddItemSuccessfully}
          GetBindBillDetails={GetBindBillDetails}
          packageID={packageID}
          setIsPackageAdd={setIsPackageAdd}
          OPDServiceBookingcall={OPDServiceBookingcall}
        // AddItemDetails={AddItemDetails}
        // style={{ marginTop: "10px" }}
        />
      </div>


       {confirmBoxvisible?.show && (
              <Confirm
                alertMessage={confirmBoxvisible?.alertMessage}
                lableMessage={confirmBoxvisible?.lableMessage}
                confirmBoxvisible={confirmBoxvisible}
              >
                {confirmBoxvisible?.chidren}
              </Confirm>
            )}
    </>
  );
};

export default IPDServices;
