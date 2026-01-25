import React, { useEffect, useState, useRef } from "react";
import { t } from "i18next";
import Heading from "../../UI/Heading";
import SearchComponent from "../../commonComponents/SearchComponent";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import moment from "moment";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import {
  GetAllCategory,
  GetAllMonthType,
  GetAllSubCategory,
} from "../../../networkServices/FeeMaster";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  GetClassItemRates,
  GetClassMonthFeeDetails,
  StudentBillingsave,
} from "../../../networkServices/School/billing";
// import { notify } from "../../../utils/ustil2";
import { MasterGetAllPaymentModes } from "../../../networkServices/Admin";
import PaymentEntry from "../../commonComponents/PaymentEntry";
import { notify } from "../../../utils/utils";

const FeeCollection = () => {
  const thead = [
    { name: "S.No", width: "1%" },
    { name: "Mandatory", width: "1%" },
    { name: "Month", width: "5%" },
    { name: "Item Name", width: "15%" },
    { name: "Rate", width: "8%" },
    { name: "Disc (Amt)", width: "8%" },
    { name: "Disc (%)", width: "8%" },
    { name: "Net Amount", width: "8%" },
    { name: "Action", width: "1%" },
  ];

  const localData = useLocalStorage("userData", "get");
  const [studentData, setStudentData] = useState(null);
  const [monthlist, setMonthList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [paymentModeList, setPaymentModeList] = useState([]);
  const [itemlist, setItemList] = useState([]);

  const [addedPayments, setAddedPayments] = useState([]);
  const [summary, setSummary] = useState({
    grossAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    netAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    remarks: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const debounceRef = useRef(null);

  const [values, setValues] = useState({
    discountPerc: "",
    months: [],
    searchType: { label: "All", value: "0" },
    searchCategory: null,
    searchSubCategory: null,
    searchText: "",
  });

  const typeOptions = [{ label: "All", value: "0" }];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setValues((prev) => ({ ...prev, [name]: selectedOption }));
  };

  // --- NEW FUNCTION: Handles Sequential Month Validation ---
  const handleMonthChange = (name, selectedOptions) => {
    // If clearing, allow it
    if (!selectedOptions || selectedOptions.length === 0) {
      setValues((prev) => ({ ...prev, [name]: [] }));
      return;
    }

    // Sort selected options based on their index in the master monthlist
    const sortedSelection = [...selectedOptions].sort((a, b) => {
      const indexA = monthlist.findIndex((m) => m.id === a.code);
      const indexB = monthlist.findIndex((m) => m.id === b.code);
      return indexA - indexB;
    });

    // Validate sequential order
    // The logic: The selected items must match the first N items of the master list exactly.
    // Loop through the sorted selection and check if it matches the master list index for index.
    let isSequential = true;
    for (let i = 0; i < sortedSelection.length; i++) {
      if (monthlist[i].id !== sortedSelection[i].code) {
        isSequential = false;
        break;
      }
    }

    if (!isSequential) {
      notify(
        "Please select months sequentially (e.g., 1st month, then 2nd). You cannot skip months.",
        "error",
      );
      return;
    }

    setValues((prev) => ({ ...prev, [name]: sortedSelection }));
  };

  // --- NEW FUNCTION: Centralized Item Adding with Duplicate Check ---
  const addItemToBill = (itemsToAdd) => {
    debugger;
    const itemsArray = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd];
    const uniqueItems = [];
    let duplicateFound = false;

    // Check against existing itemlist
    itemsArray.forEach((newItem) => {
      const exists = itemlist.some(
        (existing) => existing.itemId === newItem.itemId,
      );
      if (exists) {
        duplicateFound = true;
      } else {
        // Standardize item structure
        uniqueItems.push({
          ...newItem,
          uniqueId: Date.now() + Math.random(), // Ensure unique key for React
          qty: 1,
          rate: newItem.rate || 0,
          isMandatory: true,
          discountAmount: 0,
          discountPercent: 0,
        });
      }
    });

    if (duplicateFound) {
      notify("One or more items already exist in the list.", "error");
    }

    if (uniqueItems.length > 0) {
      setItemList((prev) => [...prev, ...uniqueItems]);
    }
  };

  const AllMonthType = async () => {
    try {
      const res = await GetAllMonthType(
        localData?.OrganizationId,
        localData?.defaultCentre,
      );
      if (res?.success) {
        setMonthList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await GetAllCategory(
        localData?.OrganizationId,
        localData?.defaultCentre,
      );
      if (res?.success) {
        setCategoryList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  const getAllSubCategory = async () => {
    try {
      const res = await GetAllSubCategory(
        localData?.OrganizationId,
        localData?.defaultCentre,
      );
      if (res?.success) {
        setSubCategoryList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  const getItemsViaMonth = async () => {
    if (!values.months || values.months.length === 0) return;
    try {
      const res = await GetClassMonthFeeDetails(
        studentData?.academic?.classId,
        values?.months[values.months.length - 1]?.code,
      );
      if (res?.success) {
        // Use the new centralized function
        addItemToBill(res.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const searchItem = (event) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await GetClassItemRates(
          studentData?.academic?.classId,
          "2",
          localData?.OrganizationId,
          localData?.defaultCentre,
          event.query,
        );

        if (Array.isArray(res)) {
          setSuggestions(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setSuggestions(res.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      }
    }, 500);
  };

  const handleAddItem = (e) => {
    const item = e.value;
    setSelectedItem(null);
    // Use the new centralized function
    addItemToBill(item);
  };

  const handleTableChange = (uniqueId, field, value) => {
    const updatedList = itemlist.map((item) => {
      if (item.uniqueId === uniqueId) {
        let updates = { [field]: value };

        if (field === "rate") {
          updates.rate = parseFloat(value) || 0;
        }

        const currentRate =
          field === "rate"
            ? parseFloat(value) || 0
            : parseFloat(item.rate) || 0;
        const currentQty = parseFloat(item.qty) || 1;
        const baseTotal = currentRate * currentQty;

        if (field === "discountAmount") {
          const amt = parseFloat(value) || 0;
          updates.discountAmount = amt;
          updates.discountPercent =
            baseTotal > 0 ? ((amt / baseTotal) * 100).toFixed(2) : 0;
        }

        if (field === "discountPercent") {
          const pct = parseFloat(value) || 0;
          updates.discountPercent = pct;
          updates.discountAmount = ((baseTotal * pct) / 100).toFixed(2);
        }

        return { ...item, ...updates };
      }
      return item;
    });
    setItemList(updatedList);
  };

  const handleDeleteItem = (uniqueId) => {
    setItemList(itemlist.filter((item) => item.uniqueId !== uniqueId));
  };

  const getAllPaymentMode = async () => {
    const payload = {
      orgId: localData?.OrganizationId,
      branchId: localData?.defaultCentre,
      isAll: 0,
    };
    try {
      const response = await MasterGetAllPaymentModes(payload);
      if (response?.success || response?.data?.length > 0) {
        setPaymentModeList(response?.data);
      }
    } catch (error) {
      notify("Error fetching modes", "error");
    }
  };

  useEffect(() => {
    const gross = itemlist.reduce(
      (acc, item) =>
        acc +
        (parseFloat(item.rate) * parseFloat(item.qty || 1) -
          (parseFloat(item.discountAmount) || 0)),
      0,
    );
    const paid = addedPayments.reduce(
      (acc, pay) => acc + parseFloat(pay.amount),
      0,
    );

    let globalDiscAmt = parseFloat(summary.discountAmount) || 0;

    const net = gross - globalDiscAmt;
    const balance = net - paid;

    setSummary((prev) => ({
      ...prev,
      grossAmount: gross,
      netAmount: net > 0 ? net : 0,
      paidAmount: paid,
      balanceAmount: balance,
    }));
  }, [itemlist, addedPayments, summary.discountAmount]);

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };

    if (name === "discountPercent") {
      const pct = parseFloat(value) || 0;
      updates.discountAmount = ((summary.grossAmount * pct) / 100).toFixed(2);
    } else if (name === "discountAmount") {
      const amt = parseFloat(value) || 0;
      updates.discountPercent =
        summary.grossAmount > 0
          ? ((amt / summary.grossAmount) * 100).toFixed(2)
          : 0;
    }

    setSummary((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (itemlist.length === 0) return notify("Please add items first", "error");

    try {
      const filteredItems = itemlist.filter(
        (item) => item.isMandatory === true,
      );
      const payload = {
        studentId: studentData?.student?.studentMasterId,
        admissionId: studentData?.admission?.admissionId || "0",
        orgId: localData?.OrganizationId,
        branchId: localData?.defaultCentre,
        billDate: moment().format(),
        grossAmount: summary.grossAmount.toFixed(2),
        discountAmount: (summary.grossAmount.toFixed(2) - summary.netAmount.toFixed(2)),
        amount: summary.netAmount.toFixed(2),
        billingRemark: summary.remarks || "",
        items: filteredItems.map((i) => ({
          itemId: i.itemId,
          itemName: i.itemName,
          amount: i.rate,
          discountPercent: i.discountPercent,
          taxPercent: 0,
          monthId: 0,
        })),
        payments: addedPayments.map((p) => ({
          paymentModeId: p.mode.value,
          paymentModeName: p.mode.label,
          amount: p.amount,
          referenceNo: p.refNo,
          bankName: p.bankName,
        })),
      };

      const response = await StudentBillingsave(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setItemList([]);
        setAddedPayments([]);
        setSummary({
          grossAmount: 0,
          discountPercent: 0,
          discountAmount: 0,
          netAmount: 0,
          paidAmount: 0,
          balanceAmount: 0,
          remarks: "",
        });
      } else {
        notify(response?.message || "Error", "error");
      }
    } catch (error) {}
  };

  useEffect(() => {
    AllMonthType();
    getAllCategory();
    getAllSubCategory();
    getAllPaymentMode();
  }, [localData?.OrganizationId, localData?.defaultCentre]);

  useEffect(() => {
    if (values?.months?.length > 0 && studentData) getItemsViaMonth();
  }, [values?.months]);

  const itemTemplate = (item) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <span>{item.itemName}</span>
        <span className="badge badge-light text-dark">{item.rate}</span>
      </div>
    );
  };

  return (
    <div className="card border">
      <Heading
        title={t("Fee Collection")}
        secondTitle={
          studentData && (
            <span
              className="text-danger mr-2 d-flex justify-content-center align-items-center"
              style={{
                background: " #df2222",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              title="close"
              onClick={() => {
                setStudentData(null);
                setItemList([]);
              }}
            >
              <i
                className="fa fa-times "
                aria-hidden="true"
                style={{ color: " #ffffff" }}
              ></i>
            </span>
          )
        }
      />

      {!studentData && (
        <div className="p-2">
          <SearchComponent onClick={setStudentData} />
        </div>
      )}

      {studentData && (
        <div className="">
          <div className="row p-2">
            <Input
              type="text"
              className="form-control"
              lable={t("Student First Name")}
              value={`${studentData?.student?.firstName} ${studentData?.student?.lastName}`}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Student ID")}
              value={studentData?.student?.studentId}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Class")}
              value={studentData?.academic?.classId}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Contact No.")}
              value={studentData?.student?.phone}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Discount %")}
              value={studentData?.student?.discountPer}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="months"
              id="months"
              placeholderName={t("Months")}
              dynamicOptions={monthlist?.map((ele) => ({
                name: ele?.name,
                code: ele?.id,
              }))}
              handleChange={handleMonthChange} // Updated to use the new handler
              value={values.months}
            />
          </div>

          <div className="row  align-items-end  p-2">
            <ReactSelect
              placeholderName={t("Type")}
              id="searchType"
              name="searchType"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={typeOptions}
              value={values?.searchType?.value}
              handleChange={handleSelectChange}
            />
            <ReactSelect
              placeholderName={t("Category")}
              id="searchCategory"
              name="searchCategory"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={categoryList?.map((item) => ({
                label: item?.categoryName,
                value: item?.id,
              }))}
              value={values.searchCategory}
              handleChange={handleSelectChange}
            />
            <ReactSelect
              placeholderName={t("Sub Category")}
              id="searchSubCategory"
              name="searchSubCategory"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={subCategoryList?.map((item) => ({
                label: item?.displayName,
                value: item?.id,
              }))}
              value={values.searchSubCategory}
              handleChange={handleSelectChange}
            />

            <div className="col-xl-6 col-md-3 col-sm-6 col-12">
              <AutoComplete
                value={selectedItem}
                suggestions={suggestions}
                completeMethod={searchItem}
                field="itemName"
                itemTemplate={itemTemplate}
                onChange={(e) => setSelectedItem(e.value)}
                onSelect={handleAddItem}
                placeholder="Type to search Items..."
                inputClassName="form-control"
                className="w-100"
                minLength={1}
                delay={100}
                panelStyle={{ zIndex: 100000 }}
              />
            </div>
          </div>
        </div>
      )}

      {studentData && itemlist.length > 0 && (
        <div className="row p-2">
          <div className="col-xl-9 col-md-8 col-sm-12">
            <div className="card">
              <Tables
                thead={thead}
                tbody={itemlist?.map((item, ind) => {
                  return {
                    Sno: ind + 1,
                    is_mandatory: (
                      <Checkbox
                        checked={item.isMandatory}
                        onChange={(e) =>
                          handleTableChange(
                            item.uniqueId,
                            "isMandatory",
                            e.checked,
                          )
                        }
                        disabled={true}
                      />
                    ),
                    month: item?.monthName,
                    item_name: item?.itemName,
                    rate: (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.rate}
                        onChange={(e) =>
                          handleTableChange(
                            item.uniqueId,
                            "rate",
                            e.target.value,
                          )
                        }
                      />
                    ),
                    disc: (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.discountAmount}
                        onChange={(e) =>
                          handleTableChange(
                            item.uniqueId,
                            "discountAmount",
                            e.target.value,
                          )
                        }
                      />
                    ),
                    disc_perc: (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.discountPercent}
                        onChange={(e) =>
                          handleTableChange(
                            item.uniqueId,
                            "discountPercent",
                            e.target.value,
                          )
                        }
                      />
                    ),
                    total: (
                      parseFloat(item.rate) * parseFloat(item.qty) -
                      (parseFloat(item.discountAmount) || 0)
                    ).toFixed(2),
                    action: (
                      <i
                        className={`fa fa-trash text-danger pointer   ${item?.isMandatory === 1 ? "disable-reject " : "disable-reject"}`}
                        onClick={() => handleDeleteItem(item.uniqueId)}
                      ></i>
                    ),
                  };
                })}
                style={{ maxHeight: "35vh" }}
                tableHeight={"scrollView"}
              />
            </div>
            <PaymentEntry
              paymentModes={paymentModeList}
              addedPayments={addedPayments}
              setAddedPayments={setAddedPayments}
              totalAmount={summary.grossAmount}
            />
          </div>

          <div className="col-xl-3 col-md-4 col-sm-12">
            <div className="card p-3 border shadow-sm h-100 bg-light">
              <h5 className="text-secondary border-bottom pb-2">
                Bill Summary
              </h5>

              <div className="form-group mb-2">
                <label>Gross Amount</label>
                <input
                  className="form-control text-right"
                  disabled
                  value={summary.grossAmount.toFixed(2)}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <Input
                    lable="Discount %"
                    type="number"
                    name="discountPercent"
                    value={summary.discountPercent}
                    onChange={handleSummaryChange}
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <Input
                    lable="Discount Amt"
                    type="number"
                    name="discountAmount"
                    value={summary.discountAmount}
                    onChange={handleSummaryChange}
                    className="form-control text-right"
                  />
                </div>
              </div>

              <div className="form-group mb-2">
                <label className="fw-bold">Net Amount</label>
                <input
                  className="form-control text-right fw-bold"
                  disabled
                  value={summary.netAmount.toFixed(2)}
                  style={{ backgroundColor: "#e9ecef" }}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label>Paid</label>
                  <input
                    className="form-control text-right text-success"
                    disabled
                    value={summary.paidAmount.toFixed(2)}
                  />
                </div>
                <div className="col-6">
                  <label className="text-danger">Balance</label>
                  <input
                    className="form-control text-right text-danger"
                    disabled
                    value={summary.balanceAmount.toFixed(2)}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="remarks"
                  value={summary.remarks}
                  onChange={handleSummaryChange}
                ></textarea>
              </div>

              <button
                className="btn btn-warning btn-block w-100 text-white fw-bold"
                onClick={handleSave}
                style={{
                  backgroundColor: "#d4b106",
                  borderColor: "#d4b106",
                }}
              >
                Save Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;
