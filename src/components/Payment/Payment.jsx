import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import Input from "../formComponent/Input";
import ReactSelect from "../formComponent/ReactSelect";

const Payment = () => {
  const [formData, setFormData] = useState({
    grossAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    netAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    paymentMode: "Cash",
    remark: "",
  });

  // 🔹 Common calculation function
  const calculateAmounts = (gross, discountPercent, paid) => {
    const discountAmount = (gross * discountPercent) / 100;
    const netAmount = gross - discountAmount;
    const balanceAmount = netAmount - paid;
    return { discountAmount, netAmount, balanceAmount };
  };

  const handleGrossAmountChange = (e) => {
    const gross = parseFloat(e.target.value) || 0;
    const { discountAmount, netAmount, balanceAmount } =
      calculateAmounts(gross, formData.discountPercent, formData.paidAmount);

    setFormData({
      ...formData,
      grossAmount: gross,
      discountAmount,
      netAmount,
      balanceAmount,
    });
  };

  const handleDiscountPercentChange = (e) => {
    const discountPercent = parseFloat(e.target.value) || 0;
    const { discountAmount, netAmount, balanceAmount } =
      calculateAmounts(formData.grossAmount, discountPercent, formData.paidAmount);

    setFormData({
      ...formData,
      discountPercent,
      discountAmount,
      netAmount,
      balanceAmount,
    });
  };

  const handlePaidAmountChange = (e) => {
    const paidAmount = parseFloat(e.target.value) || 0;
    const balanceAmount = formData.netAmount - paidAmount;

    setFormData({
      ...formData,
      paidAmount,
      balanceAmount,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelect = (name, value) => {
    setFormData({
      ...formData,
      [name]: value?.value,
    });
  };

  const handleReset = () => {
    setFormData({
      grossAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      netAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      paymentMode: "Cash",
      remark: "",
    });
  };

  const handleSubmit = () => {
    console.log("Payment Data:", formData);
    alert("Payment submitted successfully!");
  };

  return (
   
      <div 
    //   className="card shadow"
      >
        {/* <div className="card-header bg-primary text-white">
          <h4 className="mb-0">School Fee Payment</h4>
        </div> */}

        <div 
        // className="card-body"
        >
          <div className="row ">
            {/* Gross Amount */}
            <Input
              type="number"
              className="form-control "
              id="grossAmount"
              name="grossAmount"
              value={formData.grossAmount}
              lable="Gross Amount"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onChange={handleGrossAmountChange}
            />

            {/* Discount % */}
            <Input
              type="number"
              className="form-control"
              id="discountPercent"
              name="discountPercent"
              value={formData.discountPercent}
              lable="Discount %"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onChange={handleDiscountPercentChange}
            />

            {/* Discount Amount */}
            <Input
              type="number"
              className="form-control"
              id="discountAmount"
              name="discountAmount"
              value={formData.discountAmount.toFixed(2)}
              lable="Discount Amount"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              disabled
            />

            {/* Net Amount */}
            <Input
              type="number"
              className="form-control border-success"
              id="netAmount"
              name="netAmount"
              value={formData.netAmount.toFixed(2)}
              lable="Net Amount"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              disabled
            />

            {/* Paid Amount */}
            <Input
              type="number"
              className="form-control"
              id="paidAmount"
              name="paidAmount"
              value={formData.paidAmount}
              lable="Paid Amount"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onChange={handlePaidAmountChange}
            />

            {/* Balance Amount */}
            <Input
              type="number"
              className="form-control border-danger"
              id="balanceAmount"
              name="balanceAmount"
              value={formData.balanceAmount.toFixed(2)}
              lable="Balance Amount"
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              disabled
            />

            {/* Payment Mode */}
            <ReactSelect
              placeholderName="Payment Mode"
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              id="paymentMode"
              name="paymentMode"
              removeIsClearable={true}
              dynamicOptions={[
                { label: "Cash", value: "Cash" },
                { label: "Card", value: "Card" },
                { label: "UPI", value: "UPI" },
                { label: "Net Banking", value: "Net Banking" },
                { label: "Cheque", value: "Cheque" },
              ]}
              handleChange={handleSelect}
              value={{
                label: formData.paymentMode,
                value: formData.paymentMode,
              }}
            //   requiredClassName="required-fields"
            />

            {/* Remark */}
            <Input
              type="text"
              className="form-control"
              id="remark"
              name="remark"
              value={formData.remark}
              lable="Remark"
              placeholder=" "
              respclass="col-md-6"
              onChange={handleInputChange}
            />
            <div className="d-flex gap-2 justify-content-end ">
            <button className="btn  btn-sm btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button    className="btn btn-sm btn-success" 
            // className="btn btn-success "
             onClick={handleSubmit}>
              Save Payment
            </button>
          </div>
          </div>

          {/* Buttons */}
          {/* <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-success px-4" onClick={handleSubmit}>
              Save Payment
            </button>
          </div> */}
        </div>
      </div>
 
  );
};

export default Payment;


// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ReactSelect from '../formComponent/ReactSelect';

// const Payment = () => {
//     const [formData, setFormData] = useState({
//         grossAmount: 0,
//         discountPercent: 0,
//         discountAmount: 0,
//         netAmount: 0,
//         paidAmount: 0,
//         balanceAmount: 0,
//         paymentMode: 'Cash',
//         remark: ''
//     });

//     const handleGrossAmountChange = (e) => {
//         const gross = parseFloat(e.target.value) || 0;
//         const discountAmt = (gross * formData.discountPercent) / 100;
//         const net = gross - discountAmt;
//         const balance = net - formData.paidAmount;

//         setFormData({
//             ...formData,
//             grossAmount: gross,
//             discountAmount: discountAmt,
//             netAmount: net,
//             balanceAmount: balance
//         });
//     };

//     const handleDiscountPercentChange = (e) => {
//         const discount = parseFloat(e.target.value) || 0;
//         const discountAmt = (formData.grossAmount * discount) / 100;
//         const net = formData.grossAmount - discountAmt;
//         const balance = net - formData.paidAmount;

//         setFormData({
//             ...formData,
//             discountPercent: discount,
//             discountAmount: discountAmt,
//             netAmount: net,
//             balanceAmount: balance
//         });
//     };

//     const handlePaidAmountChange = (e) => {
//         const paid = parseFloat(e.target.value) || 0;
//         const balance = formData.netAmount - paid;

//         setFormData({
//             ...formData,
//             paidAmount: paid,
//             balanceAmount: balance
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const handleSelect = (name, value) => {
//         debugger
//         setFormData({
//             ...formData,
//             [name]: value?.value
//         });
//     };
//     const handleSubmit = () => {
//         console.log('Payment Data:', formData);
//         alert('Payment submitted successfully!');
//     };

//     const handleReset = () => {
//         setFormData({
//             grossAmount: 0,
//             discountPercent: 0,
//             discountAmount: 0,
//             netAmount: 0,
//             paidAmount: 0,
//             balanceAmount: 0,
//             paymentMode: 'Cash',
//             remark: ''
//         });
//     };

//     return (
//         <div className="container mt-4">
//             <div className="card shadow">
//                 <div className="card-header bg-primary text-white">
//                     <h4 className="mb-0">School Fee Payment</h4>
//                 </div>
//                 <div className="card-body">
//                     {/* <div className="row mb-3"> */}
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold">Gross Amount</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             value={formData.grossAmount}
//                             onChange={handleGrossAmountChange}
//                             min="0"
//                             step="0.01"
//                         />
//                     </div>
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold">Discount %</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             value={formData.discountPercent}
//                             onChange={handleDiscountPercentChange}
//                             min="0"
//                             max="100"
//                             step="0.01"
//                         />
//                     </div>
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold">Discount Amount</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             value={formData.discountAmount.toFixed(2)}
//                             readOnly
//                             disabled
//                         />
//                     </div>
//                     {/* </div> */}

//                     {/* <div className="row mb-3"> */}
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold text-success">Net Amount</label>
//                         <input
//                             type="number"
//                             className="form-control border-success"
//                             value={formData.netAmount.toFixed(2)}
//                             readOnly
//                             disabled
//                         />
//                     </div>
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold">Paid Amount</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             value={formData.paidAmount}
//                             onChange={handlePaidAmountChange}
//                             min="0"
//                             step="0.01"
//                         />
//                     </div>
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//                         <label className="form-label fw-bold text-danger">Balance/Dues Amount</label>
//                         <input
//                             type="number"
//                             className="form-control border-danger"
//                             value={formData.balanceAmount.toFixed(2)}
//                             readOnly
//                             disabled
//                         />
//                     </div>
//                     {/* </div> */}

//                     <div className="row mb-3">
//                         <ReactSelect
//                             placeholderName={("Payment Mode")}
//                             searchable={true}
//                             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                             id="paymentMode"
//                             name="paymentMode"
//                             removeIsClearable={true}
//                             dynamicOptions={[
//                                 { label: "Cash", value: "Cash" },
//                                 { label: "Card", value: "Card" },
//                                 { label: "UPI", value: "UPI" },
//                                 { label: "Net Banking", value: "Net Banking" },
//                                 { label: "Cheque", value: "Cheque" },
//                             ]}
//                             handleChange={handleSelect}
//                             value={formData?.paymentMode?.value}
//                             requiredClassName="required-fields"
//                         />
//                         {/* <div className="col-md-6">
//               <label className="form-label fw-bold">Payment Mode</label>
//               <select
//                 className="form-select"
//                 name="paymentMode"
//                 value={formData.paymentMode}
//                 onChange={handleInputChange}
//               >
//                 <option value="Cash">Cash</option>
//                 <option value="Card">Card</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Net Banking">Net Banking</option>
//                 <option value="Cheque">Cheque</option>
//               </select>
//             </div> */}
//                         <div className="col-md-6">
//                             <label className="form-label fw-bold">Remark</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="remark"
//                                 value={formData.remark}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter remark (optional)"
//                             />
//                         </div>
//                     </div>

//                     <div className="d-flex gap-2 justify-content-end">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={handleReset}
//                         >
//                             Reset
//                         </button>
//                         <button
//                             type="button"
//                             className="btn btn-success px-4"
//                             onClick={handleSubmit}
//                         >
//                             Save Payment
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Payment Summary Card */}
//             <div className="card mt-4 shadow-sm">
//                 <div className="card-header bg-info text-white">
//                     <h5 className="mb-0">Payment Summary</h5>
//                 </div>
//                 <div className="card-body">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <p><strong>Total Fee:</strong> ₹{formData.grossAmount.toFixed(2)}</p>
//                             <p><strong>Discount:</strong> ₹{formData.discountAmount.toFixed(2)} ({formData.discountPercent}%)</p>
//                             <p><strong>Net Payable:</strong> ₹{formData.netAmount.toFixed(2)}</p>
//                         </div>
//                         <div className="col-md-6">
//                             <p><strong>Amount Paid:</strong> ₹{formData.paidAmount.toFixed(2)}</p>
//                             <p><strong>Balance Due:</strong> <span className="text-danger fw-bold">₹{formData.balanceAmount.toFixed(2)}</span></p>
//                             <p><strong>Payment Mode:</strong> {formData.paymentMode}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Payment;