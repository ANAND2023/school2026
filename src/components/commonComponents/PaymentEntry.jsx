import React, { useState, useEffect } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import { notify } from "../../utils/ustil2";


const PaymentEntry = ({ paymentModes, addedPayments, setAddedPayments }) => {
  const [currentPayment, setCurrentPayment] = useState({
    mode: null,
    amount: "",
    refNo: "",
    bankName: "",
  });

  const handleAddPayment = () => {
    if (!currentPayment.mode || !currentPayment.amount) {
      notify("Please select payment mode and enter amount", "error");
      return;
    }

    const newPayment = {
      ...currentPayment,
      id: Date.now(),
    };

    setAddedPayments([...addedPayments, newPayment]);
    setCurrentPayment({ mode: null, amount: "", refNo: "", bankName: "" }); // Reset
  };

  const handleRemovePayment = (id) => {
    setAddedPayments(addedPayments.filter((p) => p.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, option) => {
    setCurrentPayment((prev) => ({ ...prev, [name]: option }));
  };

  return (
    <div className="card p-2 mt-3" style={{backgroundColor: '#fffbe6', border: '1px solid #ffe58f'}}>
      <h6 className="text-primary mb-2">Payment Details</h6>
      <div className="row g-1 align-items-end mb-2">
        <ReactSelect
          placeholderName="Mode"
          id="mode"
          name="mode"
          respclass="col-md-3"
          dynamicOptions={paymentModes?.map(pm => ({ label: pm.modeName, value: pm.id, isOnline: pm.isOnline }))}
          value={currentPayment.mode}
          handleChange={handleSelectChange}
        />
        <Input
          type="number"
          className="form-control"
          id="amount"
          name="amount"
          lable="Paid Amount"
          value={currentPayment.amount}
          onChange={handleChange}
          respclass="col-md-2"
        />
        <Input
            type="text"
            className="form-control"
            id="bankName"
            name="bankName"
            lable="Bank Name"
            value={currentPayment.bankName}
            onChange={handleChange}
            respclass="col-md-3"
        />
        <Input
            type="text"
            className="form-control"
            id="refNo"
            name="refNo"
            lable="Ref No."
            value={currentPayment.refNo}
            onChange={handleChange}
            respclass="col-md-2"
        />
        <div className="col-md-2">
          <button className="btn btn-sm btn-primary w-100" onClick={handleAddPayment} type="button">
            Add
          </button>
        </div>
      </div>

      {/* Payment List */}
      <div className="table-responsive" style={{maxHeight: '150px', overflowY:'auto'}}>
        <table className="table table-sm table-bordered bg-white mb-0">
          <thead className="thead-light">
            <tr>
              <th>Mode</th>
              <th>Amount</th>
              <th>Ref/Bank</th>
              <th style={{width:'50px'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {addedPayments.map((pay) => (
              <tr key={pay.id}>
                <td>{pay.mode?.label}</td>
                <td className="text-right fw-bold">{parseFloat(pay.amount).toFixed(2)}</td>
                <td>{pay.refNo} {pay.bankName ? `(${pay.bankName})` : ''}</td>
                <td className="text-center">
                  <i className="fa fa-trash text-danger pointer" onClick={() => handleRemovePayment(pay.id)}></i>
                </td>
              </tr>
            ))}
            {addedPayments.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No payments added</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentEntry;