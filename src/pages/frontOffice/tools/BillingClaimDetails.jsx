import React, { useState, useEffect } from 'react'; // Import useEffect
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import { BillingToolBillClaimDetails, BillingToolSaveBillClaimDetails, BillClaimDetailsReportApi, BillingClaimsForOnlineSubmissionReport } from '../../../networkServices/Tools';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import { exportToExcel } from '../../../utils/exportLibrary';
import { RedirectURL } from '../../../networkServices/PDFURL';

const BillingClaimDetails = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [bulkValues, setBulkValues] = useState({
    Diagnosis: "",
    ClaimID: "",
    RefNo: "",
  });

  const handleBulkInputChange = (e, field) => {

    const value = e.target.value;
    setBulkValues((prev) => ({ ...prev, [field]: value }));

    const newData = [...tableData];
    Object.keys(selectedRows).forEach((rowIndex) => {
      if (selectedRows[rowIndex]) {
        newData[rowIndex][field] = value;
      }
    });
    setTableData(newData);
  };
  const [values, setValues] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    regNo: "",
    ClaimID: "",
    diagnosis: "",
    billNo: "",
    refNo: "",
  });

  const { VITE_DATE_FORMAT } = import.meta.env;
  const { t } = useTranslation();

  // --- New handler to update table input fields ---
  const handleTableInputChange = (e, index, fieldName) => {
    const { value } = e.target;
    const updatedTableData = [...tableData];
    // Update the specific item's property in the cloned array
    updatedTableData[index] = { ...updatedTableData[index], [fieldName]: value };
    setTableData(updatedTableData);
  };

  // const handleSelectAll = (e) => {
  //   const isSelected = e.target.checked;
  //   setAllSelected(isSelected);
  //   const newSelectedRows = {};
  //   if (isSelected) {
  //     tableData.forEach((_, index) => {
  //       newSelectedRows[index] = true;
  //     });
  //   }
  //   setSelectedRows(newSelectedRows);
  // };

  // const handleSelectAll = (e) => {
  //   debugger
  //   const isSelected = e.target.checked;
  //   setAllSelected(isSelected);

  //   const newSelectedRows = {};
  //   const updatedTableData = [...tableData];
  //   if (isSelected) {
  //     tableData.forEach((row, index) => {
  //       // Only select rows where RefNo is not present
  //       if (!row.RefNo) {
  //         newSelectedRows[index] = true;

  //         updatedTableData[index].Diagnosis = bulkValues.Diagnosis;
  //         updatedTableData[index].ClaimID = bulkValues.ClaimID;
  //         updatedTableData[index].RefNo = bulkValues.RefNo;

  //       }

  //     });
  //   }
  //   else {
  //     tableData.forEach((row, index) => {
  //       const updatedTableData = [...tableData];
  //       updatedTableData[index].Diagnosis = ""
  //       updatedTableData[index].ClaimID = ""
  //       updatedTableData[index].RefNo = ""

  //     })
  //   }
  //   setTableData(updatedTableData);
  //   setSelectedRows(newSelectedRows);
  // };
  console.log(allSelected,"handleSelectAll")
  const handleSelectAll = (e) => {

    const isSelected = e.target.checked;
    setAllSelected(isSelected);
   
    if (isSelected) {
      const newSelectedRows = {};
      const newTableData = tableData.map((row, index) => {
        if (!row.RefNo) {
          // Mark as selected
          newSelectedRows[index] = true;

          return {
            ...row,
            Diagnosis: bulkValues.Diagnosis,
            ClaimID: bulkValues.ClaimID,
            RefNo: bulkValues.RefNo,
          };
        }
        return row;
      });

      setTableData(newTableData);
      setSelectedRows(newSelectedRows);

    } else {
      const newTableData = tableData.map((row) => {
        return {
          ...row,
          Diagnosis: "",
          ClaimID: "",
          RefNo: "",
        };
      });
      setTableData(newTableData);
      setSelectedRows({});
    }
  };

  const handleRowSelect = (e, index) => {
    const isSelected = e.target.checked;
    // Keep previous selections and update the current one
    setSelectedRows(prev => ({
      ...prev,
      [index]: isSelected
    }));
    if (isSelected) {
      const updatedTableData = [...tableData];
      updatedTableData[index].Diagnosis = bulkValues.Diagnosis
      updatedTableData[index].ClaimID = bulkValues.ClaimID
      updatedTableData[index].RefNo = bulkValues.RefNo
      setTableData(updatedTableData);
    }
    else {
      const updatedTableData = [...tableData];
      updatedTableData[index].Diagnosis = ""
      updatedTableData[index].ClaimID = ""
      updatedTableData[index].RefNo = ""
      setTableData(updatedTableData);
    }

  };

  // Effect to update the "Select All" checkbox if all rows are manually selected/deselected
  useEffect(() => {
    if (tableData.length > 0 && Object.keys(selectedRows).length > 0) {
      const allAreSelected = tableData.every((_, index) => selectedRows[index]);
      setAllSelected(allAreSelected);
    } else {
      setAllSelected(false);
    }
  }, [selectedRows, tableData]);
  // -------------------------------------------

  const HandleSave = async () => {

    const selectedDataToSave = tableData.filter((_, index) => selectedRows[index]);

    if (selectedDataToSave.length > 0) {
      const payload = selectedDataToSave?.map((val) => ({
        "claimNo": String(val?.ClaimID),
        "diagnosis": String(val?.Diagnosis),
        "refNo": String(val?.RefNo),
        "trasactionID": Number(val?.TransactionID),
        "selectRow": 1,

      }))
      console.log("Data to be saved:", payload);
      const response = await BillingToolSaveBillClaimDetails(payload)
      if (response?.success) {
        HandleSearch();
        notify(response?.message, "success")
      }
      else {
        notify(response?.message, "error")
      }
      // alert(`${selectedDataToSave.length} selected row(s) are ready to be saved. Check the console.`);
      // handleChange()
      // notify(response?.message, "success")
    } else {
      notify("No rows selected to save.", "error");
    }
  };

  const THEAD = [
    // Select All
    { name: <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />, width: "1%" },
    { name: t("Sr No."), width: "1%" },
    { name: t("Patient Name"), width: "10%" },
    { name: t("UHID"), width: "4%" },
    { name: t("Bill No."), width: "7%" },
    { name: t("Bill Date"), width: "5%" },
    { name: t("Bill Amount"), width: "5%" },
    { name: t("Close Date"), width: "7%" },
    { name: t("Patient Type"), width: "7%" },
    { name: t("Panel"), width: "5%" },

    // 🔹 Bulk input added in header for Diagnosis
    {
      name: (
        <>
          {t("Diagnosis")}
          <Input
            type="text"
            className="form-control "
            placeholder="Bulk Diagnosis"
            value={bulkValues.Diagnosis}
            onChange={(e) => handleBulkInputChange(e, "Diagnosis")}
          />
        </>
      ),
      width: "10%",
    },

    // 🔹 Bulk input added in header for Claim ID
    {
      name: (
        <>
          {t("Claim ID")}
          <Input
            type="text"
            className="form-control "
            placeholder="Bulk Claim ID"
            value={bulkValues.ClaimID}
            onChange={(e) => handleBulkInputChange(e, "ClaimID")}
          />
        </>
      ),
      width: "10%",
    },

    // 🔹 Bulk input added in header for Ref No
    {
      name: (
        <>
          {t("Ref No.")}
          <Input
            type="text"
            className="form-control "
            placeholder="Bulk Ref No"
            value={bulkValues.RefNo}
            onChange={(e) => handleBulkInputChange(e, "RefNo")}
          />
        </>
      ),
      width: "10%",
    },
  ];

  // const THEAD = [
  //     // Added "Select All" checkbox to the header
  //     { name: <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />, width: "5%" },
  //     { name: t("Sr No."), width: "5%" },
  //     // { name: t("Claim ID"), width: "15%" },
  //     { name: t("Patient Name"), width: "10%" },
  //     { name: t("UHID"), width: "10%" },
  //     { name: t("Bill No."), width: "10%" },
  //     { name: t("Bill Date"), width: "5%" },
  //     { name: t("Bill Amount"), width: "5%" },

  //     { name: t("Close Date"), width: "10%" },
  //     { name: t("Patient Type"), width: "10%" },
  //     // { name: t("Bill Type"), width: "10%" },
  //     // { name: t("Ref No."), width: "10%" },
  //     { name: t("Panel"), width: "5%" },
  //     { name: t("Diagnosis"), width: "10%" },
  //     // Fixed duplicate "Claim ID" - assuming this is for editing/adding a new one
  //     { name: t("Claim ID"), width: "10%" },
  //     { name: t("Ref No."), width: "10%" },
  // ];

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value, // DatePicker passes the date object directly
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const HandleSearch = async () => {
    if (!values.regNo) {
      notify("UHID is Required", "warn")
      return
    }
    let payload = {
      "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      "patientID": String(values.regNo),
      "diagnosis": String(values.diagnosis),
      "billNo": String(values.billNo),
      "claimID": String(values.ClaimID),
      "refNo": String(values.refNo),

    };
    try {
      // dispatch(setLoading(true));
      const response = await BillingToolBillClaimDetails(payload);
      if (response?.success) {
        // Augment data with fields for controlled inputs to prevent warnings
        const augmentedData = response.data.map(item => ({
          ...item,
          diagnosis: item.diagnosis || "",
          ClaimID: "", // Editable claim ID field
          RefNo: "" // Editable insurance card field
        }));
        setTableData(response.data);
        // setTableData(augmentedData);
        // Reset selections on new search
        setSelectedRows({});
        setAllSelected(false);
        setBulkValues((prev) => ({ ...prev, ClaimID: "" }));
      } else {
        setTableData([]);
        // notify(response?.message, "success")
      }
    } catch (error) {
      setTableData([]);
      console.log(error, "SomeThing Went Wrong");
    } finally {
      // dispatch(setLoading(false));
    }
  };
  const HandleExcel = async () => {
    if (!values.refNo) {
      notify("Ref No. is Required", "warn")
      return
    }
    let payload = {
      //       "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
      //       "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      //       "patientID": String(values.regNo),
      //       "claimID": String(values.ClaimID),
      //       "refNo": String(values.refNo),
      // {
      "esiRefNo": String(values.refNo),
      "fileType": 0
      // }
    };
    try {
      // dispatch(setLoading(true));
      const response = await BillingClaimsForOnlineSubmissionReport(payload);
      // const response = await BillingToolBillClaimDetails(payload);
      if (response?.success) {
        // Augment data with fields for controlled inputs to prevent warnings
        // const augmentedData = response.data.map(item => ({
        //     ...item,
        //     diagnosis: item.diagnosis || "",
        //     ClaimID: "", // Editable claim ID field
        //     RefNo: "" // Editable insurance card field
        // }));
        // setTableData(response.data);
        // // setTableData(augmentedData);
        // // Reset selections on new search
        // setSelectedRows({});
        // setAllSelected(false);
        exportToExcel(response?.data, "Excel");
      }
      else {

        notify(response?.message, "warn")


      }
    } catch (error) {
      console.log("error", error)
    }
  };

  const handlePdf = async () => {
    if (!values.refNo) {
      notify("Ref No. is Required", "warn")
      return
    }
    const data =

    {
      // "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
      // "toDate": moment(values.toDate).format("YYYY-MM-DD"),
      // "billNo": String(values.billNo) || "",
      // "reportType": 1
      "esiRefNo": String(values.refNo),
      "fileType": 1
    }
    try {
      // const res = await BillClaimDetailsReportApi(data)
      const res = await BillingClaimsForOnlineSubmissionReport(data);
      if (res?.success) {
        RedirectURL(res?.data?.pdfUrl);
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify(error?.message, "error")
    }
  }

  const isEdit = (val) => {
    if (val?.RefNo) {
      // RefNo hai
      if (val?.IsEditBillClaim === 1) {
        // Edit allowed
        return false; // enable
      } else {
        return true; // disable
      }
    }
    return false; // agar RefNo nahi hai, to enable
  };

  return (
    <div className="patient_registration card">
      <Heading title={t("Billing Claim Details")} isBreadcrumb={false} />
      <div className="row p-2">
        <DatePicker
          className="custom-calendar"
          id="From Data"
          name="fromDate"
          lable={t("From Date")}
          placeholder={VITE_DATE_FORMAT}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          value={values.fromDate}
          maxDate={new Date()}
          handleChange={searchHandleChange}
        />
        <DatePicker
          className="custom-calendar"
          id="toDate"
          name="toDate"
          lable={t("To Date")}
          value={values.toDate}
          maxDate={new Date()}
          handleChange={searchHandleChange}
          placeholder={VITE_DATE_FORMAT}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="regNo"
          lable={t("UHID")}
          placeholder=" "
          value={values.regNo}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="regNo"
          onChange={handleChange}

        />
        <Input
          type="text"
          className="form-control"
          id="billNo"
          lable={t("bill No")}
          placeholder=" "
          value={values.billNo}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="billNo"
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control"
          id="diagnosis"
          lable={t("diagnosis")}
          placeholder=" "
          value={values.diagnosis}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="diagnosis"
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control"
          id="ClaimID"
          lable={t("Claim. ID")}
          placeholder=" "
          value={values.ClaimID}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="ClaimID"
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="refNo"
          lable={t("Ref. No.")}
          placeholder=" "
          value={values.refNo}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="refNo"
          onChange={handleChange}

        />

        <div className="col-xl-2 col-md-3 col-sm-6 col-12 gap-2">
          <button className="btn btn-sm btn-primary" onClick={HandleSearch}>
            {t("Search")}
          </button>
          <button className="btn btn-sm btn-primary ml-2" onClick={HandleExcel}>
            {t("Excel")}
          </button>
          <button className="btn btn-sm btn-primary ml-2" onClick={handlePdf}>
            {t("PDF")}
          </button>
        </div>
      </div>
      {
        tableData?.length > 0 && <div className="p-2">
          <Heading title={t("Billing Claim Details")} isBreadcrumb={false} />
          {/* <Tables
                        thead={THEAD}
                        tbody={tableData?.map((val, ind) => ({
                            // Row checkbox
                            select: <input type="checkbox" checked={!!selectedRows[ind]} onChange={(e) => handleRowSelect(e, ind)} />,
                            sn: ind + 1,

                            PatientName: val?.PatientName,
                            PatientID: val?.PatientID,
                            BillNo: val?.BillNo,
                            BillDate: val?.BillDate,
                            BillAmount: val?.BillAmount,
                            CloseDate: val?.CloseDate,
                            PatientType: val?.PatientType,
                            // BillType: val?.BillType,
                            // RefNo: val?.RefNo,
                            Panel: val?.Panel || "",
                            // Inputs are now controlled and disabled based on checkbox state
                            diagnosis: <Input
                                type="text"
                                className="form-control"
                                placeholder="Enter Diagnosis"
                                name="diagnosis"
                                value={val.diagnosis}
                                onChange={(e) => handleTableInputChange(e, ind, 'diagnosis')}
                                disabled={!selectedRows[ind]}
                            />,
                            ClaimID: <Input
                                type="text"
                                className="form-control"
                                placeholder="Enter Claim ID"
                                name="ClaimID"
                                value={val.ClaimID}
                                onChange={(e) => handleTableInputChange(e, ind, 'ClaimID')}
                                disabled={!selectedRows[ind]}
                            />,
                            refNo: <Input
                                type="text"
                                className="form-control"
                                placeholder="Enter RefNo"
                                name="RefNo"
                                value={val.RefNo}
                                onChange={(e) => handleTableInputChange(e, ind, 'RefNo')}
                                disabled={!selectedRows[ind]}
                            />,
                        }))}
                        tableHeight={"30%"}
                        style={{ maxHeight: "60vh" }}
                    /> */}
          <Tables
            thead={THEAD}
            tbody={tableData?.map((val, ind) => ({
              select: (
                <input
                  type="checkbox"
                  checked={!!selectedRows[ind]}
                  onChange={(e) => handleRowSelect(e, ind)}
                  // disabled={val.RefNo || val?.IsEditBillClaim===1}
                  disabled={isEdit(val)}
                />
              ),
              sn: ind + 1,
              PatientName: val?.PatientName,
              PatientID: val?.PatientID,
              BillNo: val?.BillNo,
              BillDate: val?.BillDate,
              BillAmount: val?.BillAmount,
              CloseDate: val?.CloseDate,
              PatientType: val?.PatientType,
              Panel: val?.Panel || "",

              diagnosis: (
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Enter Diagnosis"
                  name="Diagnosis"
                  value={val.Diagnosis}
                  onChange={(e) => handleTableInputChange(e, ind, "Diagnosis")}
                  disabled={!selectedRows[ind]}
                />
              ),
              ClaimID: (
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Enter Claim ID"
                  name="ClaimID"
                  value={val.ClaimID}
                  onChange={(e) => handleTableInputChange(e, ind, "ClaimID")}
                  disabled={!selectedRows[ind]}
                />
              ),
              refNo: (
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Enter RefNo"
                  name="RefNo"
                  value={val.RefNo}
                  onChange={(e) => handleTableInputChange(e, ind, "RefNo")}
                  disabled={!selectedRows[ind]}
                />
              ),
            }))}
          />

          <div className="p-2 d-flex justify-content-end">
            <button className="btn btn-sm btn-primary d-flex justify-items-end" onClick={HandleSave}>
              {t("Save")}
            </button>
          </div>
        </div>
      }


    </div>
  )
}

export default BillingClaimDetails;


