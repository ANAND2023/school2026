import React, { useState, useEffect, useMemo } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import { notify } from "../../utils/utils";
// import { notify } from "../../utils/ustil2";
// import { notify } from "../../utils/ustil2";

const PaymentEntry = ({
  paymentModes,
  addedPayments,
  setAddedPayments,
  totalAmount,
}) => {
  const [currentPayment, setCurrentPayment] = useState({
    mode: null,
    amount: "",
    refNo: "",
    bankName: "",
  });

  // 🔢 Total Paid
  const totalPaid = useMemo(() => {
    return addedPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
  }, [addedPayments]);

  const remainingAmount = useMemo(() => {
    return Math.max(totalAmount - totalPaid, 0);
  }, [totalAmount, totalPaid]);

  // 🟢 Mode select hote hi auto amount + row bind
  const handleSelectChange = (name, option) => {
    debugger
    if (remainingAmount === 0) return notify("No Remaining Amount", "error")
    if (!option) return;

    const newPayment = {
      id: option.value, // ek mode = ek row
      mode: option,
      amount: remainingAmount,
      refNo: "",
      bankName: "",
    };

    // agar same mode pehle se hai to update
    const exists = addedPayments.find(p => p.id === option.value);

    if (exists) {
      setAddedPayments(
        addedPayments.map(p =>
          p.id === option.value ? newPayment : p
        )
      );
    } else {
      setAddedPayments([...addedPayments, newPayment]);
    }

    setCurrentPayment(newPayment);
  };

  // ✏️ Row amount edit
  const handleRowAmountChange = (id, value) => {
    setAddedPayments(
      addedPayments.map(p =>
        p.id === id ? { ...p, amount: value } : p
      )
    );
  };

  const handleRemovePayment = (id) => {
    setAddedPayments(addedPayments.filter(p => p.id !== id));
  };

  return (
    <div className="card p-2 mt-3" style={{ backgroundColor: "#fffbe6" }}>
      <h6 className="text-primary mb-2">
        Payment Details (Remaining: ₹{remainingAmount})
      </h6>

      {/* Mode Select */}
      <div className="row g-1 mb-2">
        <ReactSelect
          placeholderName="Select Payment Mode"
          id="mode"
          name="mode"
          respclass="col-xl-3 col-md-4"
          dynamicOptions={paymentModes?.map(pm => ({
            label: pm.modeName,
            value: pm.id,
            isOnline: pm.isOnline
          }))}
          value={currentPayment.mode}
          handleChange={handleSelectChange}
        />
      </div>

      {/* Payment List */}
      <div className="table-responsive">
        <table className="table table-sm table-bordered bg-white mb-0">
          <thead>
            <tr>
              <th>Mode</th>
              {/* <th width="320">Info</th> */}
              <th width="120">Amount</th>
              <th width="60">Action</th>
            </tr>
          </thead>
          <tbody>
            {console.log(addedPayments,"addedPayments")}
            {addedPayments.map((pay,index) => (
              <tr key={pay.id}
              
              >
                <td className="d-flex px-2 justify-content-between align-items-center">{pay.mode?.label}
                  {pay?.mode?.isOnline && <>
                  <Input
                    type="text"
                    className="form-control"
                    id="bankName"
                    name="bankName"
                    lable="Bank Name"
                    value={pay.bankName}
                    onChange={(e)=>{
                      const newPayment = [...addedPayments];
                      newPayment[index].bankName = e.target.value;
                      setAddedPayments(newPayment);
                      
                    }}
                    respclass="col-xl-4 col-lg-4 col-md-2"
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="refNo"
                    name="refNo"
                    lable="Ref No."
                    value={pay.refNo}
                     onChange={(e)=>{
                      const newPayment = [...addedPayments];
                      newPayment[index].refNo = e.target.value;
                      setAddedPayments(newPayment);
                      
                    }}
                    respclass="col-xl-4 col-lg-4 col-md-2"
                  />
                  </>
                  }
                </td>

                {/* Editable Amount */}
                <td className="d-flex">
                  
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end"
                    value={pay.amount}
                    onChange={(e) =>
                      handleRowAmountChange(pay.id, e.target.value)
                    }
                  />
                  
                </td>

                <td className="text-center">
                  <i
                    className="fa fa-trash text-danger pointer"
                    onClick={() => handleRemovePayment(pay.id)}
                  ></i>
                </td>
              </tr>
            ))}

            {addedPayments.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No payments added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentEntry;




// import React, { useState, useEffect } from "react";
// import ReactSelect from "../formComponent/ReactSelect";
// import Input from "../formComponent/Input";
// import { notify } from "../../utils/ustil2";


// const PaymentEntry = ({ paymentModes, addedPayments, setAddedPayments }) => {
//   const [currentPayment, setCurrentPayment] = useState({
//     mode: null,
//     amount: "",
//     refNo: "",
//     bankName: "",
//   });

//   const handleAddPayment = () => {
//     if (!currentPayment.mode || !currentPayment.amount) {
//       notify("Please select payment mode and enter amount", "error");
//       return;
//     }

//     const newPayment = {
//       ...currentPayment,
//       id: Date.now(),
//     };

//     setAddedPayments([...addedPayments, newPayment]);
//     setCurrentPayment({ mode: null, amount: "", refNo: "", bankName: "" }); // Reset
//   };

//   const handleRemovePayment = (id) => {
//     setAddedPayments(addedPayments.filter((p) => p.id !== id));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentPayment((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, option) => {
//     setCurrentPayment((prev) => ({ ...prev, [name]: option }));
//   };

//   return (
//     <div className="card p-2 mt-3" style={{backgroundColor: '#fffbe6', border: '1px solid #ffe58f'}}>
//       <h6 className="text-primary mb-2">Payment Details</h6>
//       <div className="row g-1 align-items-end mb-2">
//         <ReactSelect
//           placeholderName="Mode"
//           id="mode"
//           name="mode"
//           respclass="col-md-3"
//           dynamicOptions={paymentModes?.map(pm => ({ label: pm.modeName, value: pm.id, isOnline: pm.isOnline }))}
//           value={currentPayment.mode}
//           handleChange={handleSelectChange}
//         />
//         <Input
//           type="number"
//           className="form-control"
//           id="amount"
//           name="amount"
//           lable="Paid Amount"
//           value={currentPayment.amount}
//           onChange={handleChange}
//           respclass="col-md-2"
//         />
//         <Input
//             type="text"
//             className="form-control"
//             id="bankName"
//             name="bankName"
//             lable="Bank Name"
//             value={currentPayment.bankName}
//             onChange={handleChange}
//             respclass="col-md-3"
//         />
//         <Input
//             type="text"
//             className="form-control"
//             id="refNo"
//             name="refNo"
//             lable="Ref No."
//             value={currentPayment.refNo}
//             onChange={handleChange}
//             respclass="col-md-2"
//         />
//         <div className="col-md-2">
//           <button className="btn btn-sm btn-primary w-100" onClick={handleAddPayment} type="button">
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Payment List */}
//       <div className="table-responsive" style={{maxHeight: '150px', overflowY:'auto'}}>
//         <table className="table table-sm table-bordered bg-white mb-0">
//           <thead className="thead-light">
//             <tr>
//               <th>Mode</th>
//               <th>Amount</th>
//               <th>Ref/Bank</th>
//               <th style={{width:'50px'}}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {addedPayments.map((pay) => (
//               <tr key={pay.id}>
//                 <td>{pay.mode?.label}</td>
//                 <td className="text-right fw-bold">{parseFloat(pay.amount).toFixed(2)}</td>
//                 <td>{pay.refNo} {pay.bankName ? `(${pay.bankName})` : ''}</td>
//                 <td className="text-center">
//                   <i className="fa fa-trash text-danger pointer" onClick={() => handleRemovePayment(pay.id)}></i>
//                 </td>
//               </tr>
//             ))}
//             {addedPayments.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No payments added</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PaymentEntry;