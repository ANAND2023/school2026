import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import { GetAllClasses } from "../../../networkServices/AcademicYear";
import {
  GetAllMonthType,
  GetAllItemMaster,
  createcategory,
  UpdateBulkItemClassMonthWise,
  GetClassMonthItemFees,
} from "../../../networkServices/FeeMaster";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";

const ClassFeeMonthMapping = () => {
  /* ================= STATE ================= */

  const [classes, setClasses] = useState([]);
  const [months, setMonths] = useState([]);
  const [items, setItems] = useState([]);

  const [values, setValues] = useState({
    class_Name: null,
  });

  /**
   * feeMatrix
   * {
   *   monthId: {
   *     itemId: true/false
   *   }
   * }
   */
  const [feeMatrix, setFeeMatrix] = useState({});

  /* ================= API CALLS ================= */

  useEffect(() => {
    fetchClasses();
    fetchMonths();
    // fetchItems();
  }, []);

  const fetchClasses = async () => {
    const res = await GetAllClasses();
    if (res?.success) setClasses(res.data);
  };

  const fetchMonths = async () => {
    const res = await GetAllMonthType();
    if (res?.success) setMonths(res.data);
  };

  const fetchItems = async (classID) => {
    // const res = await GetAllItemMaster();
    const payload={
      classId: classID,
      schoolTypeId:"",
      sectionId:"",
      sessionId:"ssasa",
    }
    const res = await GetClassMonthItemFees(payload);
    if (res?.success) setItems(res.data);
  };

  /* ================= LOGIC ================= */

  const toggleFee = (monthId, itemId) => {
    setFeeMatrix((prev) => ({
      ...prev,
      [monthId]: {
        ...prev[monthId],
        [itemId]: !prev?.[monthId]?.[itemId],
      },
    }));
  };

  const getMonthTotal = (monthId) => {
    if (!feeMatrix[monthId]) return 0;

    return items.reduce((sum, item) => {
      const rate = Number(item.unit || 0);
      return feeMatrix[monthId][item.id] ? sum + rate : sum;
    }, 0);
  };

  /* ================= PAYLOAD ================= */

  const buildPayload = () => {
    return months
      .map((month) => ({
        classId: values.class_Name.value,
        monthTypeMasterId: month.id,
        items: items
          .filter((item) => feeMatrix?.[month.id]?.[item.id])
          .map((item) => ({
            itemId: item.id,
            rate: Number(item.unit || 0),
          })),
      }))
      .filter((row) => row.items.length > 0);
  };

  const handleSave = async () => {
    if (!values.class_Name) {
      notify("Please select class", "error");
      return;
    }

    const payload = buildPayload();
    console.log("FINAL PAYLOAD 👉", payload);

    const res = await UpdateBulkItemClassMonthWise(payload);
    if (res?.success) notify("Fee mapping saved", "success");
    else notify("Something went wrong", "error");
  };

  const tableHead = [
    { name: "Month" },
    ...items.map((item) => ({
      name: (
        <>
          {item.displayName}
          <br />₹{item.unit}
        </>
      ),
    })),
    { name: "Monthly Total" },
  ];

  const tableBody = months.map((month) => {
    let row = {
      month: <b>{month.name}</b>,
    };

    items.forEach((item) => {
      row[item.id] = (
        <input
          type="checkbox"
          checked={feeMatrix?.[month.id]?.[item.id] || false}
          onChange={() => toggleFee(month.id, item.id)}
        />
      );
    });

    row.total = (
      <span className="fw-bold text-success">
        ₹{getMonthTotal(month.id)}
      </span>
    );

    return row;
  });
const handleSelect = (name, option) => {
        setValues((prev) => ({ ...prev, [name]: option }));
        fetchItems(option?.value);
    };
  /* ================= UI ================= */

  return (
    <div className="card">
      <Heading title="Class Fee Month Mapping" isBreadcrumb={false} />

      {/* ===== CLASS SELECT ===== */}
      <div className="row mb-3 p-1">
        <ReactSelect
          placeholderName="Class"
          searchable
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          name="class_Name"
          dynamicOptions={handleReactSelectDropDownOptions(
            classes,
            "className",
            "id"
          )}
          handleChange={handleSelect}
        //   handleChange={(name, value) =>
        //     setValues((prev) => ({ ...prev, [name]: value }))
        //   }
          value={values?.class_Name?.value}
        />

        <div className="col-xl-2 ">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      {values.class_Name && (
        <Tables
          thead={tableHead}
          tbody={tableBody}
        />
      )}
    </div>
  );
};

export default ClassFeeMonthMapping;


