import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import Input from "../../../components/formComponent/Input";
import { notify } from "../../../utils/ustil2";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Tables from "../../../components/UI/customTable";
import {
  BillingToolGetDetailsForChangeCreaditBill,
  BillingToolUpdateDiscountOnCreaditBill,
} from "../../../networkServices/InventoryApi";
import Modal from "../../../components/modalComponent/Modal";

const ChangeDiscount = () => {
  const [t] = useTranslation();

  const [values, setValues] = useState({
    billNo: "",
    Type: "1",
    PatientType: "1",
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [patientDetails2, setPatientDetails2] = useState([]);
  const [pendingPatientData, setPendingPatientData] = useState([]);
  // -------------------- Handle Input --------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  // -------------------- Fetch Data --------------------
  const SearchData = async () => {
    const payload = {
      billNoOrCTBNo: String(values?.billNo),
      type: 1,
    };

    try {
      const response = await BillingToolGetDetailsForChangeCreaditBill(payload);
      if (response.success && Array.isArray(response.data)) {
        const enriched = response.data.map((item) => {
          const qty = Number(item.Quantity) || 0;
          const rate = Number(item.Rate) || 0;
          const gross = qty * rate;

          // Use backend values if available
          const discountPercent = Number(item.DiscountPercentage || 0);
          const discountAmt =
            item.DiscAmt !== undefined
              ? Number(item.DiscAmt)
              : (gross * discountPercent) / 100;

          const total =
            item.NetItemAmt !== undefined
              ? Number(item.NetItemAmt)
              : gross - discountAmt;

          return {
            ...item,
            DiscountPercent: discountPercent,
            DiscountAmount: discountAmt,
            TotalAmount: total,
          };
        })
        if (response?.data[0].ispost == 1) {
          setPendingPatientData(enriched);
          setConfirmVisible(true);
        }else{
          setPatientDetails2(enriched);
        }
      } else {
        notify(response.message || "No data found", "error");
      }
    } catch (err) {
      console.error(err);
      notify("Error fetching data", "error");
    }
  };

  // -------------------- Handle Discount Changes --------------------
  const handleDiscountChange = (index, field, value) => {
    setPatientDetails2((prev) => {
      const updated = [...prev];
      const row = { ...updated[index] };
      const qty = Number(row.Quantity) || 0;
      const rate = Number(row.Rate) || 0;
      const gross = qty * rate;

      if (field === "DiscountPercent") {
        let percent = Number(value) || 0;
        if (percent > 100) {
          percent = 100;
          notify("Discount % cannot exceed 100", "warn");
        } else if (percent < 0) {
          percent = 0;
          notify("Discount % cannot be negative", "warn");
        }

        const discAmt = (gross * percent) / 100;
        row.DiscountPercent = percent;
        row.DiscountAmount = discAmt;
        row.TotalAmount = gross - discAmt;
      } else if (field === "DiscountAmount") {
        let discAmt = Number(value) || 0;
        if (discAmt > gross) {
          discAmt = gross;
          notify("Discount amount cannot exceed gross amount", "warn");
        } else if (discAmt < 0) {
          discAmt = 0;
          notify("Discount amount cannot be negative", "warn");
        }

        const percent = gross ? (discAmt / gross) * 100 : 0;
        row.DiscountAmount = discAmt;
        row.DiscountPercent = percent;
        row.TotalAmount = gross - discAmt;
      }

      updated[index] = row;
      return updated;
    });
  };

  // -------------------- Totals --------------------
  const totalGross = patientDetails2.reduce(
    (acc, row) => acc + row.Quantity * row.Rate,
    0
  );
  const totalDiscount = patientDetails2.reduce(
    (acc, row) => acc + Number(row.DiscountAmount || 0),
    0
  );
  const totalNet = totalGross - totalDiscount;

  // -------------------- Save Data --------------------
  const handleSubmit = async () => {
    const payload = {
      BillNo: patientDetails2[0]?.BillNo,
      ledgertransactionNo: Number(patientDetails2[0]?.LedgertransactionNo),
      grossAmount: totalGross,
      discountOnTotal: totalDiscount,
      netAmount: totalNet,
      discountOnCreaditBillUpdate: patientDetails2.map((val) => ({
        id: val?.ID,
        grossAmt: Number(val?.GrossAmt || val?.Rate * val?.Quantity),
        discAmt: Number(val?.DiscountAmount),
        discountPercentage: Number(val?.DiscountPercent),
        netItemAmt: Number(val?.TotalAmount),
      })),
    };

    try {
      const response = await BillingToolUpdateDiscountOnCreaditBill(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setPatientDetails2([]);
        setValues({ billNo: "", Type: "1", PatientType: "1" });
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      notify("Something went wrong while saving", "error");
    }
  };

  // -------------------- Table Header --------------------
  const THEAD = [
    { name: t("Item Name") },
    { name: t("Quantity") },
    { name: t("Rate") },
    { name: t("GrossAmt") },
    { name: t("Discount %") },
    { name: t("Discount Amt") },
    { name: t("Total Amt") },
  ];

  return (
    <>
      {confirmVisible && (
        <Modal
          modalWidth={"25vw"}
          visible={confirmVisible}
          setVisible={setConfirmVisible}
          Header={t("Confirmation")}
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={() => {
                  setConfirmVisible(false);
                  setPatientDetails2(pendingPatientData);
                  setPendingPatientData([]);
                }}
              >
                {t("Yes")}
              </button>
              <button
                className="btn btn-sm btn-danger"
               
                 onClick={() => {
                  setConfirmVisible(false);
                  setPendingPatientData([]);
                  setPatientDetails2([])
                }}
              >
                {t("No")}
              </button>
            </>
          }
        >
          <div className="text-center py-3">
            <h5>{t("Do you want to give discount? Because bill is already posted.")}</h5>
          </div>
        </Modal>
      )}
      {/* Search Section */}
      <div className="card">
        <Heading isBreadcrumb={true} title={"Change Discount on Credit Bill"} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            removeFormGroupClass={false}
            name="billNo"
            lable={t("Bill No")}
            required={true}
            onChange={handleInputChange}
            value={values?.billNo}
            respclass="col-xl-3 col-md-3 col-sm-6 col-6"
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={SearchData}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table and Totals */}
      {patientDetails2?.length > 0 && (
        <div className="card">
          <Heading isBreadcrumb={false} title={"Patient & Billing Details"} />

          {/* Patient Info */}
          <div className="row p-2">
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Name"}
                value={patientDetails2[0]?.PatientName}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"UHID"}
                value={patientDetails2[0]?.PatientID}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Bill No"}
                value={patientDetails2[0]?.BillNo}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Bill Date"}
                value={moment(patientDetails2[0]?.BillDate).format(
                  "DD-MMM-YYYY"
                )}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Voucher No"}
                value={patientDetails2[0]?.VoucherNo}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Voucher Date"}
                value={patientDetails2[0]?.VoucherDate ? moment(patientDetails2[0]?.VoucherDate).format(
                  "DD-MMM-YYYY"
                ):""}
              />
            </div>
          </div>

          {/* Table */}
          <div className="">
            <Tables
              thead={THEAD}
              tbody={patientDetails2.map((val, ind) => ({
                ItemName: val?.ItemName,
                Quantity: val?.Quantity,
                Rate: val?.Rate.toFixed(2),
                GrossAmt: (val.Rate * val.Quantity).toFixed(2),
                DiscountPercent: (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={val.DiscountPercent}
                    onChange={(e) =>
                      handleDiscountChange(ind, "DiscountPercent", e.target.value)
                    }
                    min="0"
                    max="100"
                  />
                ),
                DiscountAmount: (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={val.DiscountAmount}
                    onChange={(e) =>
                      handleDiscountChange(ind, "DiscountAmount", e.target.value)
                    }
                    min="0"
                  />
                ),
                TotalAmount: val.TotalAmount.toFixed(2),
              }))}
            />
          </div>

          {/* Totals */}
          <div className="row p-3">
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Total Gross"}
                value={totalGross.toFixed(2)}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Total Discount"}
                value={totalDiscount.toFixed(2)}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={"Net Amount"}
                value={totalNet.toFixed(2)}
              />
            </div>

            <div className="col-xl-2 col-md-3 col-sm-4 col-12 d-flex align-items-end">
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeDiscount;




// import React, { useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import moment from "moment/moment";
// import Input from "../../../components/formComponent/Input";
// import { notify } from "../../../utils/ustil2";
// import LabeledInput from "../../../components/formComponent/LabeledInput";
// import Tables from "../../../components/UI/customTable";
// import { BillingToolGetDetailsForChangeCreaditBill, BillingToolUpdateDiscountOnCreaditBill } from "../../../networkServices/InventoryApi";
// import ReactSelect from "../../../components/formComponent/ReactSelect";

// const ChangeDiscount = () => {
//   const [t] = useTranslation();
//   const initialValues = {
//     billNo: "",
//     Type: "1",
//     PatientType: "1",
//   };

//   const [values, setValues] = useState({ ...initialValues });
//   const [patientDetails2, setPatientDetails2] = useState([]);

//   const handleReactSelectChange = (name, e) => {
//     setValues((pre) => ({
//       ...pre,
//       [name]: e?.value,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((val) => ({ ...val, [name]: value }));
//   };

//   const SearchData = async () => {
//     const payload = {
//       billNoOrCTBNo: String(values?.billNo),
//       type: 1,
//     //   type: Number(values?.Type),
//     };

//     const response = await BillingToolGetDetailsForChangeCreaditBill(payload);
//     if (response.success) {
//       const enriched = response.data.map((item) => ({
//         ...item,
//         DiscountPercent: 0,
//         DiscountAmount: 0,
//         TotalAmount: item.Rate * item.Quantity,
//       }));
//       setPatientDetails2(enriched);
//     } else {
//       notify(response.message, "error");
//     }
//   };

//   // ---- Handle Discount Changes ----
//   const handleDiscountChange = (index, field, value) => {
//     setPatientDetails2((prev) => {
//       const updated = [...prev];
//       const row = { ...updated[index] };
//       const qty = Number(row.Quantity) || 0;
//       const rate = Number(row.Rate) || 0;
//       const gross = qty * rate;

//       if (field === "DiscountPercent") {
//         let percent = Number(value) || 0;
//         if (percent > 100) {
//           percent = 100;
//           notify("Discount % cannot exceed 100", "warn");
//         } else if (percent < 0) {
//           percent = 0;
//           notify("Discount % cannot be negative", "warn");
//         }

//         const discAmt = (gross * percent) / 100;
//         row.DiscountPercent = percent;
//         row.DiscountAmount = discAmt;
//         row.TotalAmount = gross - discAmt;
//       } else if (field === "DiscountAmount") {
//         let discAmt = Number(value) || 0;
//         if (discAmt > gross) {
//           discAmt = gross;
//           notify("Discount amount cannot exceed gross amount", "warn");
//         } else if (discAmt < 0) {
//           discAmt = 0;
//           notify("Discount amount cannot be negative", "warn");
//         }

//         const percent = gross ? (discAmt / gross) * 100 : 0;
//         row.DiscountAmount = discAmt;
//         row.DiscountPercent = percent;
//         row.TotalAmount = gross - discAmt;
//       }

//       updated[index] = row;
//       return updated;
//     });
//   };

//   // ---- Totals ----
//   const totalGross = patientDetails2.reduce(
//     (acc, row) => acc + row.Quantity * row.Rate,
//     0
//   );
//   const totalDiscount = patientDetails2.reduce(
//     (acc, row) => acc + Number(row.DiscountAmount || 0),
//     0
//   );
//   const totalNet = totalGross - totalDiscount;

//   const handleSubmit=async()=>{
//     const payload={
//   "BillNo": (patientDetails2[0]?.BillNo),
//   "ledgertransactionNo":  Number(patientDetails2[0]?.LedgertransactionNo),
//   "grossAmount":totalGross ,
//   "discountOnTotal": totalDiscount,
//   "netAmount":  totalNet,
//   "discountOnCreaditBillUpdate":patientDetails2?.map((val)=>( {
//       "id": val?.ID,
//       "grossAmt": Number(val?.GrossAmt),
//       "discAmt": Number(val?.DiscountAmount),
//       "discountPercentage":Number(val?.DiscountPercent),
//       "netItemAmt":Number(val?.TotalAmount),
//     }))
 
// }
//     try {
//         const response=await BillingToolUpdateDiscountOnCreaditBill(payload)
//         if(response?.success){
//             notify(response?.message,"success")
//             setPatientDetails2([])
//         }
//         else{
//                 notify(response?.message,"error")
//         }
//     } catch (error) {
//         console.log("error",error)
//     }
//   }
//   // ---- Table Header ----
//   const THEAD = [
//     { name: t("Item Name") },
//     { name: t("Quantity") },
//     { name: t("Rate") },
//     { name: t("GrossAmt") },
//     { name: t("Discount %") },
//     { name: t("Discount Amt") },
//     { name: t("Total Amt") },
//     // { name: t("Entry Date") },
//   ];

//   console.log("patientDetails2",patientDetails2)
//   return (
//     <>
//       <div className="card">
//         <Heading isBreadcrumb={true} title={"Change doctor and bill date"} />
//         <div className="row p-2">
//           <Input
//             type="text"
//             className="form-control"
//             removeFormGroupClass={false}
//             name="billNo"
//             lable={t("bill No")}
//             required={true}
//             onChange={handleInputChange}
//             value={values?.billNo}
//             respclass="col-xl-3 col-md-3 col-sm-6 col-6"
//           />
//           <div className="col-sm-1">
//             <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {patientDetails2?.length > 0 && (
//         <div className="card ">
//           <Heading isBreadcrumb={false} title={"Patient Details"} />

//           {/* Patient Info */}
//           <div className="row p-2">
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"Name"} value={patientDetails2[0]?.PatientName} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"UHID"} value={patientDetails2[0]?.PatientID} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"BillNo"} value={patientDetails2[0]?.BillNo} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput
//                 label={"DateOfAdmit"}
//                 value={moment(patientDetails2[0]?.DateOfAdmit).format("DD-MMM-YYYY")}
//               />
//             </div>
//             {patientDetails2[0]?.DateOfDischarge && (
//               <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                 <LabeledInput
//                   label={"DateOfDischarge"}
//                   value={moment(patientDetails2[0]?.DateOfDischarge).format("DD-MMM-YYYY")}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           <div className="row p-2">
//             <Tables
//               thead={THEAD}
//               tbody={patientDetails2.map((val, ind) => ({
//                 ItemName: val?.ItemName,
//                 Quantity: val?.Quantity,
//                 Rate: val?.Rate.toFixed(2),
//                 GrossAmt: (val.Rate * val.Quantity).toFixed(2),
//                 DiscountPercent: (
//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     value={val.DiscountPercent}
//                     onChange={(e) =>
//                       handleDiscountChange(ind, "DiscountPercent", e.target.value)
//                     }
//                     min="0"
//                     max="100"
//                   />
//                 ),
//                 DiscountAmount: (
//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     value={val.DiscountAmount}
//                     onChange={(e) =>
//                       handleDiscountChange(ind, "DiscountAmount", e.target.value)
//                     }
//                     min="0"
//                   />
//                 ),
//                 TotalAmount: val.TotalAmount.toFixed(2),
//                 // EntryDate: moment(val?.EntryDate).format("DD-MMM-YYYY"),
//               }))}
//             />
//           </div>

//           {/* Totals */}
//            <div className="row p-2">
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"Total Gross"} value={totalGross.toFixed(2)} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"Total Discount"} value={totalDiscount.toFixed(2)} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"Net Amount"} value={totalNet.toFixed(2)} />
//             </div>
//                 <button className="btn btn-sm btn-success mx-1" onClick={handleSubmit}>
//         save 
//       </button>
//             </div>
          
//         </div>
        
//       )}
    
//     </>
//   );
// };

// export default ChangeDiscount;


// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import moment from "moment/moment";
// import Input from "../../../components/formComponent/Input";
// import { notify } from "../../../utils/ustil2";
// import LabeledInput from "../../../components/formComponent/LabeledInput";
// import Tables from "../../../components/UI/customTable";
// import { BillingToolGetDetailsForChangeCreaditBill } from "../../../networkServices/InventoryApi";
// import ReactSelect from "../../../components/formComponent/ReactSelect";

// const ChangeDiscount = () => {
//   const [t] = useTranslation();
//   const initialValues = {
//     billNo: "",
//     Type: "1",
//     PatientType: "1",
//   };

//   const [values, setValues] = useState({ ...initialValues });
//   const [patientDetails2, setPatientDetails2] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [allSelected, setAllSelected] = useState(false);

//   const handleReactSelectChange = (name, e) => {
//     setValues((pre) => ({
//       ...pre,
//       [name]: e?.value,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((val) => ({ ...val, [name]: value }));
//   };

//   const SearchData = async () => {
//     const payload = {
//       billNoOrCTBNo: String(values?.billNo),
//       type: Number(values?.Type),
//     };

//     const response = await BillingToolGetDetailsForChangeCreaditBill(payload);
//     if (response.success) {
//       // Add discount related fields
//       const enriched = response.data.map((item) => ({
//         ...item,
//         DiscountPercent: 0,
//         DiscountAmount: 0,
//         TotalAmount: item.Rate * item.Quantity,
//       }));
//       setPatientDetails2(enriched);
//     } else {
//       notify(response.message, "error");
//     }
//   };

//   // ---- Handle Select All ----
//   const handleSelectAll = (e) => {
//     const isSelected = e.target.checked;
//     setAllSelected(isSelected);

//     if (isSelected) {
//       const allRowsWithIndex = patientDetails2.map((row, idx) => ({
//         ...row,
//         index: idx,
//       }));
//       setSelectedRows(allRowsWithIndex);
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   // ---- Handle Row Select ----
//   const handleRowSelect = (e, row, index) => {
//     const isSelected = e.target.checked;
//     setSelectedRows((prev) => {
//       if (isSelected) {
//         return [...prev, { ...row, index }];
//       } else {
//         return prev.filter((r) => r.index !== index);
//       }
//     });
//   };

//   // ---- Handle Discount Changes ----
// //   const handleDiscountChange = (index, field, value) => {
// //     setPatientDetails2((prev) => {
// //       const updated = [...prev];
// //       const row = { ...updated[index] };
// //       const qty = Number(row.Quantity) || 0;
// //       const rate = Number(row.Rate) || 0;
// //       const gross = qty * rate;

// //       if (field === "DiscountPercent") {
// //         const percent = Number(value) || 0;
// //         const discAmt = (gross * percent) / 100;
// //         row.DiscountPercent = percent;
// //         row.DiscountAmount = discAmt;
// //         row.TotalAmount = gross - discAmt;
// //       } else if (field === "DiscountAmount") {
// //         const discAmt = Number(value) || 0;
// //         const percent = gross ? (discAmt / gross) * 100 : 0;
// //         row.DiscountAmount = discAmt;
// //         row.DiscountPercent = percent;
// //         row.TotalAmount = gross - discAmt;
// //       }

// //       updated[index] = row;
// //       return updated;
// //     });
// //   };
// const handleDiscountChange = (index, field, value) => {
//   setPatientDetails2((prev) => {
//     const updated = [...prev];
//     const row = { ...updated[index] };
//     const qty = Number(row.Quantity) || 0;
//     const rate = Number(row.Rate) || 0;
//     const gross = qty * rate;

//     if (field === "DiscountPercent") {
//       let percent = Number(value) || 0;
//       if (percent > 100) {
//         percent = 100;
//         notify("Discount % cannot exceed 100", "warn");
//       } else if (percent < 0) {
//         percent = 0;
//         notify("Discount % cannot be negative", "warn");
//       }

//       const discAmt = (gross * percent) / 100;
//       row.DiscountPercent = percent;
//       row.DiscountAmount = discAmt;
//       row.TotalAmount = gross - discAmt;
//     } else if (field === "DiscountAmount") {
//       let discAmt = Number(value) || 0;
//       if (discAmt > gross) {
//         discAmt = gross;
//         notify("Discount amount cannot exceed gross amount", "warn");
//       } else if (discAmt < 0) {
//         discAmt = 0;
//         notify("Discount amount cannot be negative", "warn");
//       }

//       const percent = gross ? (discAmt / gross) * 100 : 0;
//       row.DiscountAmount = discAmt;
//       row.DiscountPercent = percent;
//       row.TotalAmount = gross - discAmt;
//     }

//     updated[index] = row;
//     return updated;
//   });
// };


//   // ---- Totals ----
//   const totalGross = patientDetails2.reduce(
//     (acc, row) => acc + row.Quantity * row.Rate,
//     0
//   );
//   const totalDiscount = patientDetails2.reduce(
//     (acc, row) => acc + Number(row.DiscountAmount || 0),
//     0
//   );
//   const totalNet = totalGross - totalDiscount;

//   // ---- Table Header ----
//   const THEAD = [
//     {
//       name: (
//         <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
//       ),
//       width: "5%",
//     },
//     { name: t("Panel Name") },
//     { name: t("Quantity") },
//     { name: t("Rate") },
//     { name: t("GrossAmt") },
//     { name: t("Discount %") },
//     { name: t("Discount Amt") },
//     { name: t("Total Amt") },
//     { name: t("Entry Date") },
//   ];

//   return (
//     <>
//       <div className="card">
//         <Heading isBreadcrumb={true} title={"Change doctor and bill date"} />
//         <div className="row p-2">
//           <ReactSelect
//             placeholderName={t("Patient Type")}
//             id={"PatientType"}
//             searchable={true}
//             respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
//             dynamicOptions={[
//               { label: "OPD", value: "1" },
//               { label: "IPD", value: "2" },
//             ]}
//             name="PatientType"
//             handleChange={handleReactSelectChange}
//             value={values.PatientType}
//             requiredClassName={"required-fields"}
//           />

//           <Input
//             type="text"
//             className="form-control"
//             removeFormGroupClass={false}
//             name="billNo"
//             lable={t("bill No")}
//             required={true}
//             onChange={handleInputChange}
//             value={values?.billNo}
//             respclass="col-xl-3 col-md-3 col-sm-6 col-6"
//           />
//           <div className="col-sm-1">
//             <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {patientDetails2?.length > 0 && (
//         <div className="card ">
//           <Heading isBreadcrumb={false} title={"Patient Details"} />

//           {/* Patient Info */}
//           <div className=" row p-2 ">
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput
//                 label={"Name"}
//                 value={patientDetails2[0]?.PatientName}
//               />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput
//                 label={"UHID"}
//                 value={patientDetails2[0]?.PatientID}
//               />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput label={"BillNo"} value={patientDetails2[0]?.BillNo} />
//             </div>
//             <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//               <LabeledInput
//                 label={"DateOfAdmit"}
//                 value={moment(patientDetails2[0]?.DateOfAdmit).format(
//                   "DD-MMM-YYYY"
//                 )}
//               />
//             </div>
//             {patientDetails2[0]?.DateOfDischarge && (
//               <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                 <LabeledInput
//                   label={"DateOfDischarge"}
//                   value={moment(patientDetails2[0]?.DateOfDischarge).format(
//                     "DD-MMM-YYYY"
//                   )}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           <div className="row p-2">
//             <Tables
//               thead={THEAD}
//               tbody={patientDetails2.map((val, ind) => ({
//                 select: (
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.some((r) => r.index === ind)}
//                     onChange={(e) => handleRowSelect(e, val, ind)}
//                   />
//                 ),
//                 Company_Name: val?.Company_Name,
//                 Quantity: val?.Quantity,
//                 Rate: val?.Rate.toFixed(2),
//                 GrossAmt: (val.Rate * val.Quantity).toFixed(2),
//                 DiscountPercent: (
//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     value={val.DiscountPercent}
//                     onChange={(e) =>
//                       handleDiscountChange(ind, "DiscountPercent", e.target.value)
//                     }
//                     min="0"
//                     max="100"
//                   />
//                 ),
//                 DiscountAmount: (
//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     value={val.DiscountAmount}
//                     onChange={(e) =>
//                       handleDiscountChange(ind, "DiscountAmount", e.target.value)
//                     }
//                     min="0"
//                   />
//                 ),
//                 TotalAmount: val.TotalAmount.toFixed(2),
//                 EntryDate: moment(val?.EntryDate).format("DD-MMM-YYYY"),
//               }))}
//             />
//           </div>

//           {/* Totals */}
//           <div className="row p-3 justify-content-end text-end">
//             <div className="col-xl-3 col-md-4">
//               <div className="card p-2 bg-light">
//                 <div><b>Total Gross: </b> ₹ {totalGross.toFixed(2)}</div>
//                 <div><b>Total Discount: </b> ₹ {totalDiscount.toFixed(2)}</div>
//                 <div><b>Net Amount: </b> ₹ {totalNet.toFixed(2)}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChangeDiscount;





// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import moment from "moment/moment";
// import Input from "../../../components/formComponent/Input";
// import { notify } from "../../../utils/ustil2";
// import LabeledInput from "../../../components/formComponent/LabeledInput";
// import Tables from "../../../components/UI/customTable";
// import { BillingToolGetDetailsForChangeCreaditBill } from "../../../networkServices/InventoryApi";
// import ReactSelect from "../../../components/formComponent/ReactSelect";

// const ChangeDiscount = () => {
//     const [t] = useTranslation();
//     const initialValues = {
//         billNo: "",
//         Type: "1",
//         PatientType: "1"

//     };
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [patientDetails2, setPatientDetails2] = useState([])
//     const [allSelected, setAllSelected] = useState(false);
//     const handleSelectAll = (e) => {
//         const isSelected = e.target.checked;
//         setAllSelected(isSelected);

//         if (isSelected) {
//             // Select all rows with index
//             const allRowsWithIndex = patientDetails2.map((row, idx) => ({ ...row, index: idx }));
//             setSelectedRows(allRowsWithIndex);
//         } else {
//             setSelectedRows([]);
//         }
//     };


//     const handleRowSelect = (e, row, index) => {
//         const isSelected = e.target.checked;

//         setSelectedRows(prev => {
//             if (isSelected) {
//                 return [...prev, { ...row, index }];
//             } else {
//                 return prev.filter(r => r.index !== index);
//             }
//         });
//     };


//     const THEAD = [
//         { name: <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />, width: "5%" },
//         { name: t("Panel Name"), width: "20%" },
//         { name: t("Quantity"), width: "3%" },
//         { name: t("Rate"), width: "30%" },
//         { name: t("GrossAmt"), width: "30%" },
//         { name: t("Entry Date"), width: "30%" },

//     ];
//     const [values, setValues] = useState({ ...initialValues });
//     const handleReactSelectChange = (name, e) => {
//         setValues((pre) => ({
//             ...pre,
//             [name]: e?.value
//         }))
//     };



//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setValues((val) => ({ ...val, [name]: value }));
//     };

//     const SearchData = async () => {

//         const payload =
//         {
//             "billNoOrCTBNo": String(values?.billNo),
//             "type": Number(values?.Type)
//         }

//         const response = await BillingToolGetDetailsForChangeCreaditBill(payload);
//         if (response.success) {
//             setPatientDetails2(response?.data)
//         }
//         else {
//             notify(response.message, "error");
//         }

//     };

//     return (
//         <>
//             <div className="card">
//                 <Heading isBreadcrumb={true} title={"Change doctor and bill date"} />
//                 <div className="row p-2">

//                     <ReactSelect
//                         placeholderName={t("Patient Type")}
//                         id={"PatientType"}
//                         searchable={true}
//                         respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
//                         dynamicOptions={[

//                             { label: "OPD", value: "1" },
//                             { label: "IPD", value: "2" },

//                         ]}
//                         name="PatientType"
//                         handleChange={handleReactSelectChange}
//                         value={values.PatientType}
//                         requiredClassName={"required-fields"}
//                     />

//                     <Input
//                         type="text"
//                         className="form-control"
//                         removeFormGroupClass={false}
//                         name="billNo"
//                         lable={t("bill No")}
//                         required={true}
//                         onChange={handleInputChange}

//                         value={values?.billNo}
//                         respclass="col-xl-3 col-md-3 col-sm-6 col-6"
//                     />
//                     <div className="col-sm-1">
//                         <button className="btn btn-sm btn-success mx-1" onClick={SearchData}>Search</button>
//                     </div>
//                 </div>
//             </div>

//             {
//                 patientDetails2?.length > 0 &&
//                 <div className="card ">
//                     <Heading isBreadcrumb={false} title={"Patient Details"} />

//                     <div className=" row p-2 ">
//                         <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                             <LabeledInput
//                                 label={"Name"}
//                                 value={patientDetails2[0]?.PatientName}
//                                 className=""
//                             />
//                         </div>
//                         <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                             <LabeledInput
//                                 label={"UHID"}
//                                 value={patientDetails2[0]?.PatientID}
//                                 className=""
//                             />
//                         </div>
//                         <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                             <LabeledInput
//                                 label={"BillNo"}
//                                 value={patientDetails2[0]?.BillNo}
//                                 className=""
//                             />
//                         </div>

//                         <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                             <LabeledInput
//                                 label={"DateOfAdmit"}
//                                 value={moment(patientDetails2[0]?.DateOfAdmit).format("DD-MMM-YYYY")}
//                                 className=""
//                             />
//                         </div>
//                         {
//                             patientDetails2[0]?.DateOfDischarge && <div className="col-xl-2 col-md-3 col-sm-4 col-12">
//                                 <LabeledInput
//                                     label={"DateOfDischarge"}
//                                     value={moment(patientDetails2[0]?.DateOfDischarge).format("DD-MMM-YYYY")}
//                                     className=""
//                                 />

//                             </div>

//                         }
//                            </div>

//                     <div className="row p-2">
//                         <Tables
//                             thead={THEAD}
//                             tbody={patientDetails2?.map((val, ind) => ({
//                                 select: (
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedRows.some(r => r.index === ind)} // check by index
//                                         onChange={(e) => handleRowSelect(e, val, ind)}
//                                     />
//                                 ),
//                                 Company_Name: val?.Company_Name,
//                                 Quantity: val?.Quantity,
//                                 Rate: val?.Rate,
//                                 GrossAmt: val?.GrossAmt,
//                                 discountPercentage: <input name="discountPercentage"/>,
//                                 discountAmount: <input name="discountAmount"/>,
//                                 totalAmount: <input name="totalAmount"/>,
//                                 GrossAmt: val?.GrossAmt,
//                                 EntryDate: moment(val?.EntryDate).format("DD-MMM-YYYY"),
//                             }))}
//                         />
//                     </div>
//                 </div>
//             }
//         </>
//     );
// };

// export default ChangeDiscount;

