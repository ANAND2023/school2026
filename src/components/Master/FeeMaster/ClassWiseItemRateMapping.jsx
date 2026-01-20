import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Heading from "../../UI/Heading";
import ReactSelect from "../../formComponent/ReactSelect";


import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
import { GetAllClasses } from "../../../networkServices/AcademicYear";
import {
  GetClassMonthItemFees,
  UpdateBulkItemClassMonthWise,
} from "../../../networkServices/FeeMaster";

import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Tables from "../../UI/customTable";

function ClassWiseItemRateMapping() {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [monthData, setMonthData] = useState([]);

  /**
   * matrixSelection = {
   *   monthTypeId: {
   *     itemId: { itemId, rate }
   *   }
   * }
   */
  const [matrixSelection, setMatrixSelection] = useState({});

  /* ===================== LOADERS ===================== */

  const getClass = async () => {
    const res = await GetAllClasses();
    if (res?.success) setClasses(res.data);
  };

  const loadMonthItems = async (classId) => {
    const payload = {
      classId,
      schoolTypeId: "2",
      sectionId: "",
      sessionId: "1",
      OrgId: localData?.OrganizationId ?? "",
      BranchId: localData?.defaultCentre ?? "",
    };

    const res = await GetClassMonthItemFees(payload);
    if (!res?.success) return;

    setMonthData(res.data);

    // Pre-map already mapped items
    const mapped = {};
    res.data.forEach((m) => {
      m.items.forEach((i) => {
        if (i.isMapped) {
          if (!mapped[m.monthTypeId]) mapped[m.monthTypeId] = {};
          mapped[m.monthTypeId][i.itemId] = {
            itemId: i.itemId,
            rate: i.rate,
          };
        }
      });
    });
    setMatrixSelection(mapped);
  };

  useEffect(() => {
    getClass();
  }, []);

  /* ===================== DERIVED ===================== */

  const items = useMemo(() => {
    return monthData.length ? monthData[0].items : [];
  }, [monthData]);

  /* ===================== TOGGLES ===================== */

  // Single cell toggle
  const toggleCell = (monthId, item) => {
    setMatrixSelection((prev) => {
      const copy = { ...prev };
      if (!copy[monthId]) copy[monthId] = {};

      if (copy[monthId][item.itemId]) {
        delete copy[monthId][item.itemId];
      } else {
        copy[monthId][item.itemId] = {
          itemId: item.itemId,
          rate: item.rate,
        };
      }
      return copy;
    });
  };

  // Row select all (month)
  const toggleRow = (month) => {
    const allChecked = items.every(
      (i) => matrixSelection?.[month.monthTypeId]?.[i.itemId]
    );

    const updated = {};
    if (!allChecked) {
      items.forEach((i) => {
        updated[i.itemId] = { itemId: i.itemId, rate: i.rate };
      });
    }

    setMatrixSelection((prev) => ({
      ...prev,
      [month.monthTypeId]: updated,
    }));
  };

  // Column select all (item)
  const toggleColumn = (item) => {
    const allChecked = monthData.every(
      (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
    );

    setMatrixSelection((prev) => {
      const copy = { ...prev };
      monthData.forEach((m) => {
        if (!copy[m.monthTypeId]) copy[m.monthTypeId] = {};
        if (allChecked) {
          delete copy[m.monthTypeId][item.itemId];
        } else {
          copy[m.monthTypeId][item.itemId] = {
            itemId: item.itemId,
            rate: item.rate,
          };
        }
      });
      return copy;
    });
  };

  /* ===================== TOTAL ===================== */

  const monthTotal = (monthId) =>
    Object.values(matrixSelection?.[monthId] || {}).reduce(
      (sum, i) => sum + Number(i.rate || 0),
      0
    );

  /* ===================== SAVE ===================== */

  const handleSave = async () => {
    const payload = Object.entries(matrixSelection).map(
      ([monthTypeMasterId, itemsObj]) => ({
        classId: selectedClass,
        monthTypeMasterId,
        items: Object.values(itemsObj),
      })
    );

    if (!payload.length) {
      notify("Nothing selected", "error");
      return;
    }

    const res = await UpdateBulkItemClassMonthWise(payload);
    notify(res.message, res.success ? "success" : "error");
  };

  /* ===================== TABLE HEAD ===================== */

  const thead = useMemo(() => {
    if (!items.length) return [];

    return [
      "Month",
      ...items.map((item) => ({
        name: (
          <div className="d-flex flex-column align-items-start">
            <div>{item.itemName}</div>
            <small>₹{item.rate}</small>
            <div>
              <input
                type="checkbox"
                checked={monthData.every(
                  (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
                )}
                onChange={() => toggleColumn(item)}
              />
            </div>
          </div>
        ),
        type: "",
      })),
      "Monthly Total",
    ];
  }, [items, monthData, matrixSelection]);

  /* ===================== TABLE BODY ===================== */

  const tbody = useMemo(() => {
    return monthData.map((month) => {
      const row = {
        Month: (
          <div className="d-flex align-items-center gap-2 justify-content-start">
            <input
              type="checkbox"
              checked={items.every(
                (i) =>
                  matrixSelection?.[month.monthTypeId]?.[i.itemId]
              )}
              onChange={() => toggleRow(month)}
            />
            <b>{month.monthName}</b>
          </div>
        ),
      };

      items.forEach((item) => {
        row[item.itemName] = (
          <input
            type="checkbox"
            checked={
              !!matrixSelection?.[month.monthTypeId]?.[item.itemId]
            }
            onChange={() => toggleCell(month.monthTypeId, item)}
          />
        );
      });

      row["Monthly Total"] = (
        <span className="fw-bold text-success">
          ₹{monthTotal(month.monthTypeId)}
        </span>
      );

      return row;
    });
  }, [monthData, items, matrixSelection]);

  /* ===================== UI ===================== */

  return (
    <div className="card">
      <Heading title="Class Month Item Mapping" />

      <div className="row p-2">
        <ReactSelect
          placeholderName="Class"
          respclass="col-md-4"
          dynamicOptions={handleReactSelectDropDownOptions(
            classes,
            "className",
            "id"
          )}
          handleChange={(_, v) => {
            setSelectedClass(v.value);
            loadMonthItems(v.value);
          }}
          value={selectedClass}
        />

        <div className="col-md-2">
          <button className="btn btn-primary " onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {tbody.length > 0 && (
        <Tables
          thead={thead}
          tbody={tbody}
          isSearch={false}
          borderDark
        />
      )}
    </div>
  );
}

export default ClassWiseItemRateMapping;



// import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";

// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";


// import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import {
//   GetClassMonthItemFees,
//   UpdateBulkItemClassMonthWise,
// } from "../../../networkServices/FeeMaster";

// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import Tables from "../../UI/customTable";

// function ClassWiseItemRateMapping() {
//   const [t] = useTranslation();
//   const localData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [monthData, setMonthData] = useState([]);

//   /**
//    * matrixSelection = {
//    *   monthTypeId: {
//    *     itemId: { itemId, rate }
//    *   }
//    * }
//    */
//   const [matrixSelection, setMatrixSelection] = useState({});

//   /* ===================== LOADERS ===================== */

//   const getClass = async () => {
//     const res = await GetAllClasses();
//     if (res?.success) setClasses(res.data);
//   };

//   const loadMonthItems = async (classId) => {
//     const payload = {
//       classId,
//       schoolTypeId: "2",
//       sectionId: "",
//       sessionId: "1",
//       OrgId: localData?.OrganizationId ?? "",
//       BranchId: localData?.defaultCentre ?? "",
//     };

//     const res = await GetClassMonthItemFees(payload);
//     if (!res?.success) return;

//     setMonthData(res.data);

//     // Pre-map already mapped items
//     const mapped = {};
//     res.data.forEach((m) => {
//       m.items.forEach((i) => {
//         if (i.isMapped) {
//           if (!mapped[m.monthTypeId]) mapped[m.monthTypeId] = {};
//           mapped[m.monthTypeId][i.itemId] = {
//             itemId: i.itemId,
//             rate: i.rate,
//           };
//         }
//       });
//     });
//     setMatrixSelection(mapped);
//   };

//   useEffect(() => {
//     getClass();
//   }, []);

//   /* ===================== DERIVED ===================== */

//   const items = useMemo(() => {
//     return monthData.length ? monthData[0].items : [];
//   }, [monthData]);

//   /* ===================== TOGGLES ===================== */

//   // Single cell toggle
//   const toggleCell = (monthId, item) => {
//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       if (!copy[monthId]) copy[monthId] = {};

//       if (copy[monthId][item.itemId]) {
//         delete copy[monthId][item.itemId];
//       } else {
//         copy[monthId][item.itemId] = {
//           itemId: item.itemId,
//           rate: item.rate,
//         };
//       }
//       return copy;
//     });
//   };

//   // Row select all (month)
//   const toggleRow = (month) => {
//     const allChecked = items.every(
//       (i) => matrixSelection?.[month.monthTypeId]?.[i.itemId]
//     );

//     const updated = {};
//     if (!allChecked) {
//       items.forEach((i) => {
//         updated[i.itemId] = { itemId: i.itemId, rate: i.rate };
//       });
//     }

//     setMatrixSelection((prev) => ({
//       ...prev,
//       [month.monthTypeId]: updated,
//     }));
//   };

//   // Column select all (item)
//   const toggleColumn = (item) => {
//     const allChecked = monthData.every(
//       (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
//     );

//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       monthData.forEach((m) => {
//         if (!copy[m.monthTypeId]) copy[m.monthTypeId] = {};
//         if (allChecked) {
//           delete copy[m.monthTypeId][item.itemId];
//         } else {
//           copy[m.monthTypeId][item.itemId] = {
//             itemId: item.itemId,
//             rate: item.rate,
//           };
//         }
//       });
//       return copy;
//     });
//   };

//   /* ===================== TOTAL ===================== */

//   const monthTotal = (monthId) =>
//     Object.values(matrixSelection?.[monthId] || {}).reduce(
//       (sum, i) => sum + Number(i.rate || 0),
//       0
//     );

//   /* ===================== SAVE ===================== */

//   const handleSave = async () => {
//     const payload = Object.entries(matrixSelection).map(
//       ([monthTypeMasterId, itemsObj]) => ({
//         classId: selectedClass,
//         monthTypeMasterId,
//         items: Object.values(itemsObj),
//       })
//     );

//     if (!payload.length) {
//       notify("Nothing selected", "error");
//       return;
//     }

//     const res = await UpdateBulkItemClassMonthWise(payload);
//     notify(res.message, res.success ? "success" : "error");
//   };

//   /* ===================== TABLE HEAD ===================== */

//   const thead = useMemo(() => {
//     if (!items.length) return [];

//     return [
//       "Month",
//       ...items.map((item) => ({
//         name: (
//           <div className="text-center">
//             <div>{item.itemName}</div>
//             <small>₹{item.rate}</small>
//             <div>
//               <input
//                 type="checkbox"
//                 checked={monthData.every(
//                   (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
//                 )}
//                 onChange={() => toggleColumn(item)}
//               />
//             </div>
//           </div>
//         ),
//         type: "",
//       })),
//       "Monthly Total",
//     ];
//   }, [items, monthData, matrixSelection]);

//   /* ===================== TABLE BODY ===================== */

//   const tbody = useMemo(() => {
//     return monthData.map((month) => {
//       const row = {
//         Month: (
//           <div className="d-flex align-items-center gap-2 justify-content-center">
//             <input
//               type="checkbox"
//               checked={items.every(
//                 (i) =>
//                   matrixSelection?.[month.monthTypeId]?.[i.itemId]
//               )}
//               onChange={() => toggleRow(month)}
//             />
//             <b>{month.monthName}</b>
//           </div>
//         ),
//       };

//       items.forEach((item) => {
//         row[item.itemName] = (
//           <input
//             type="checkbox"
//             checked={
//               !!matrixSelection?.[month.monthTypeId]?.[item.itemId]
//             }
//             onChange={() => toggleCell(month.monthTypeId, item)}
//           />
//         );
//       });

//       row["Monthly Total"] = (
//         <span className="fw-bold text-success">
//           ₹{monthTotal(month.monthTypeId)}
//         </span>
//       );

//       return row;
//     });
//   }, [monthData, items, matrixSelection]);

//   /* ===================== UI ===================== */

//   return (
//     <div className="card">
//       <Heading title="Class Month Item Mapping" />

//       <div className="row p-2">
//         <ReactSelect
//           placeholderName="Class"
//           respclass="col-md-4"
//           dynamicOptions={handleReactSelectDropDownOptions(
//             classes,
//             "className",
//             "id"
//           )}
//           handleChange={(_, v) => {
//             setSelectedClass(v.value);
//             loadMonthItems(v.value);
//           }}
//           value={selectedClass}
//         />

//         <div className="col-md-2">
//           <button className="btn btn-primary mt-4" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       </div>

//       {tbody.length > 0 && (
//         <Tables
//           thead={thead}
//           tbody={tbody}
//           isSearch={false}
//           borderDark
//         />
//       )}
//     </div>
//   );
// }

// export default ClassWiseItemRateMapping;




// import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";

// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";

// import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import {
//   GetClassMonthItemFees,
//   UpdateBulkItemClassMonthWise,
// } from "../../../networkServices/FeeMaster";

// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
// import Tables from "../../UI/customTable";

// function ClassWiseItemRateMapping() {
//   const [t] = useTranslation();
//   const localData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [monthData, setMonthData] = useState([]);

//   /**
//    * matrixSelection = {
//    *   monthTypeId: {
//    *     itemId: { itemId, rate }
//    *   }
//    * }
//    */
//   const [matrixSelection, setMatrixSelection] = useState({});

//   /* -------------------- LOADERS -------------------- */

//   const getClass = async () => {
//     const res = await GetAllClasses();
//     if (res?.success) setClasses(res.data);
//   };

//   const loadMonthItems = async (classId) => {
//     const payload = {
//       classId,
//       schoolTypeId: "2",
//       sectionId: "",
//       sessionId: "1",
//       OrgId: localData?.OrganizationId ?? "",
//       BranchId: localData?.defaultCentre ?? "",
//     };

//     const res = await GetClassMonthItemFees(payload);
//     if (!res?.success) return;

//     setMonthData(res.data);

//     const mapped = {};
//     res.data.forEach((m) => {
//       m.items.forEach((i) => {
//         if (i.isMapped) {
//           if (!mapped[m.monthTypeId]) mapped[m.monthTypeId] = {};
//           mapped[m.monthTypeId][i.itemId] = {
//             itemId: i.itemId,
//             rate: i.rate,
//           };
//         }
//       });
//     });

//     setMatrixSelection(mapped);
//   };

//   useEffect(() => {
//     getClass();
//   }, []);

//   /* -------------------- DERIVED -------------------- */

//   const items = useMemo(() => {
//     return monthData.length ? monthData[0].items : [];
//   }, [monthData]);

//   /* -------------------- TOGGLES -------------------- */

//   const toggleCell = (monthId, item) => {
//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       if (!copy[monthId]) copy[monthId] = {};

//       if (copy[monthId][item.itemId]) {
//         delete copy[monthId][item.itemId];
//       } else {
//         copy[monthId][item.itemId] = {
//           itemId: item.itemId,
//           rate: item.rate,
//         };
//       }
//       return copy;
//     });
//   };

//   const toggleRow = (month) => {
//     const allChecked = items.every(
//       (i) => matrixSelection?.[month.monthTypeId]?.[i.itemId]
//     );

//     const updated = {};
//     if (!allChecked) {
//       items.forEach((i) => {
//         updated[i.itemId] = { itemId: i.itemId, rate: i.rate };
//       });
//     }

//     setMatrixSelection((prev) => ({
//       ...prev,
//       [month.monthTypeId]: updated,
//     }));
//   };

//   const toggleColumn = (item) => {
//     const allChecked = monthData.every(
//       (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
//     );

//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       monthData.forEach((m) => {
//         if (!copy[m.monthTypeId]) copy[m.monthTypeId] = {};
//         if (allChecked) {
//           delete copy[m.monthTypeId][item.itemId];
//         } else {
//           copy[m.monthTypeId][item.itemId] = {
//             itemId: item.itemId,
//             rate: item.rate,
//           };
//         }
//       });
//       return copy;
//     });
//   };

//   const monthTotal = (monthId) =>
//     Object.values(matrixSelection?.[monthId] || {}).reduce(
//       (sum, i) => sum + Number(i.rate || 0),
//       0
//     );

//   /* -------------------- SAVE -------------------- */

//   const handleSave = async () => {
//     const payload = Object.entries(matrixSelection).map(
//       ([monthTypeMasterId, itemsObj]) => ({
//         classId: selectedClass,
//         monthTypeMasterId,
//         items: Object.values(itemsObj),
//       })
//     );

//     if (!payload.length) {
//       notify("Nothing selected", "error");
//       return;
//     }

//     const res = await UpdateBulkItemClassMonthWise(payload);
//     notify(res.message, res.success ? "success" : "error");
//   };

//   /* -------------------- TABLE DATA -------------------- */

//   const thead = useMemo(() => {
//     if (!items.length) return [];

//     return [
//       "Month",
//       ...items.map((item) => ({
//         name: (
//           <>
//             {item.itemName}
//             <br />₹{item.rate}
//             <br />
//             <button
//               className="btn btn-sm btn-light mt-1"
//               onClick={() => toggleColumn(item)}
//             >
//               Select All
//             </button>
//           </>
//         ),
//         type: "",
//       })),
//       "Monthly Total",
//     ];
//   }, [items, matrixSelection]);

//   const tbody = useMemo(() => {
//     return monthData.map((month) => {
//       const row = {
//         Month: (
//           <>
//             <b>{month.monthName}</b>
//             <br />
//             <button
//               className="btn btn-sm btn-primary mt-1"
//               onClick={() => toggleRow(month)}
//             >
//               Select All
//             </button>
//           </>
//         ),
//       };

//       items.forEach((item) => {
//         row[item.itemName] = (
//           <input
//             type="checkbox"
//             checked={
//               !!matrixSelection?.[month.monthTypeId]?.[item.itemId]
//             }
//             onChange={() => toggleCell(month.monthTypeId, item)}
//           />
//         );
//       });

//       row["Monthly Total"] = (
//         <span className="fw-bold text-success">
//           ₹{monthTotal(month.monthTypeId)}
//         </span>
//       );

//       return row;
//     });
//   }, [monthData, items, matrixSelection]);

//   /* -------------------- UI -------------------- */

//   return (
//     <div className="card">
//       <Heading title="Class Month Item Mapping" />

//       <div className="row p-2">
//         <ReactSelect
//           placeholderName="Class"
//           respclass="col-md-4"
//           dynamicOptions={handleReactSelectDropDownOptions(
//             classes,
//             "className",
//             "id"
//           )}
//           handleChange={(_, v) => {
//             setSelectedClass(v.value);
//             loadMonthItems(v.value);
//           }}
//           value={selectedClass}
//         />

//         <div className="col-md-2">
//           <button className="btn btn-primary mt-4" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       </div>

//       {tbody.length > 0 && (
//         <Tables
//           thead={thead}
//           tbody={tbody}
//           isSearch={false}
//           borderDark
//         />
//       )}
//     </div>
//   );
// }

// export default ClassWiseItemRateMapping;



// import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";

// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";

// import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import {
//   GetClassMonthItemFees,
//   UpdateBulkItemClassMonthWise,
// } from "../../../networkServices/FeeMaster";

// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// function ClassWiseItemRateMapping() {
//   const [t] = useTranslation();
//   const localData = useLocalStorage("userData", "get");

//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");

//   // API raw data
//   const [monthData, setMonthData] = useState([]);

//   /**
//    * matrixSelection:
//    * {
//    *   monthTypeId: {
//    *     itemId: { itemId, rate }
//    *   }
//    * }
//    */
//   const [matrixSelection, setMatrixSelection] = useState({});

//   /* ----------------------------- LOADERS ----------------------------- */

//   const getClass = async () => {
//     const res = await GetAllClasses();
//     if (res?.success) setClasses(res.data);
//   };

//   const loadMonthItems = async (classId) => {
//     const payload = {
//       classId,
//       schoolTypeId: "2",
//       sectionId: "",
//       sessionId: "1",
//       OrgId: localData?.OrganizationId ?? "",
//       BranchId: localData?.defaultCentre ?? "",
//     };

//     const res = await GetClassMonthItemFees(payload);

//     if (res?.success) {
//       setMonthData(res.data);

//       // pre-map isMapped items
//       const mapped = {};
//       res.data.forEach((m) => {
//         m.items.forEach((i) => {
//           if (i.isMapped) {
//             if (!mapped[m.monthTypeId]) mapped[m.monthTypeId] = {};
//             mapped[m.monthTypeId][i.itemId] = {
//               itemId: i.itemId,
//               rate: i.rate,
//             };
//           }
//         });
//       });
//       setMatrixSelection(mapped);
//     }
//   };

//   useEffect(() => {
//     getClass();
//   }, []);

//   /* ---------------------------- DERIVED DATA ---------------------------- */

//   const items = useMemo(() => {
//     if (monthData.length === 0) return [];
//     return monthData[0].items; // same items for all months
//   }, [monthData]);

//   /* ---------------------------- TOGGLES ---------------------------- */

//   // single cell
//   const toggleCell = (monthId, item) => {
//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       if (!copy[monthId]) copy[monthId] = {};

//       if (copy[monthId][item.itemId]) {
//         delete copy[monthId][item.itemId];
//         if (Object.keys(copy[monthId]).length === 0) delete copy[monthId];
//       } else {
//         copy[monthId][item.itemId] = {
//           itemId: item.itemId,
//           rate: 0,
//           // rate: item.rate,
//         };
//       }
//       return copy;
//     });
//   };

//   // row select all
//   const toggleRow = (month) => {
//     const allChecked = items.every(
//       (i) => matrixSelection?.[month.monthTypeId]?.[i.itemId]
//     );

//     const updated = {};
//     if (!allChecked) {
//       items.forEach((i) => {
//         updated[i.itemId] = { itemId: i.itemId, rate: i.rate };
//       });
//     }

//     setMatrixSelection((prev) => ({
//       ...prev,
//       [month.monthTypeId]: allChecked ? {} : updated,
//     }));
//   };

//   // column select all
//   const toggleColumn = (item) => {
//     const allChecked = monthData.every(
//       (m) => matrixSelection?.[m.monthTypeId]?.[item.itemId]
//     );

//     setMatrixSelection((prev) => {
//       const copy = { ...prev };
//       monthData.forEach((m) => {
//         if (!copy[m.monthTypeId]) copy[m.monthTypeId] = {};
//         if (allChecked) {
//           delete copy[m.monthTypeId][item.itemId];
//         } else {
//           copy[m.monthTypeId][item.itemId] = {
//             itemId: item.itemId,
//             rate: item.rate,
//           };
//         }
//       });
//       return copy;
//     });
//   };

//   /* ---------------------------- TOTALS ---------------------------- */

//   const monthTotal = (monthId) =>
//     Object.values(matrixSelection?.[monthId] || {}).reduce(
//       (sum, i) => sum + Number(i.rate || 0),
//       0
//     );

//   /* ---------------------------- SAVE ---------------------------- */

//   const handleSave = async () => {
//     const payload = Object.entries(matrixSelection).map(
//       ([monthTypeMasterId, itemsObj]) => ({
//         classId: selectedClass,
//         monthTypeMasterId,
//         items: Object.values(itemsObj),
//       })
//     );

//     if (payload.length === 0) {
//       notify("Nothing selected", "error");
//       return;
//     }

//     const res = await UpdateBulkItemClassMonthWise(payload);
//     res?.success
//       ? notify(res.message, "success")
//       : notify(res.message, "error");
//   };

//   /* ---------------------------- UI ---------------------------- */

//   return (
//     <div className="card">
//       <Heading title="Class Month Item Mapping" />

//       <div className="row p-2">
//         <ReactSelect
//           placeholderName="Class"
//           respclass="col-md-4"
//           dynamicOptions={handleReactSelectDropDownOptions(
//             classes,
//             "className",
//             "id"
//           )}
//           handleChange={(_, v) => {
//             setSelectedClass(v.value);
//             loadMonthItems(v.value);
//           }}
//           value={selectedClass}
//         />

//         <div className="col-md-2">
//           <button className="btn btn-primary mt-4" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       </div>

//       {monthData.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-bordered text-center">
//             <thead className="bg-primary text-white">
//               <tr>
//                 <th>Month</th>
//                 {items.map((item) => (
//                   <th key={item.itemId}>
//                     {item.itemName}
//                     <br />
//                     ₹{item.rate}
//                     <br />
//                     <button
//                       className="btn btn-sm btn-light mt-1"
//                       onClick={() => toggleColumn(item)}
//                     >
//                       Select All
//                     </button>
//                   </th>
//                 ))}
//                 <th>Monthly Total</th>
//               </tr>
//             </thead>

//             <tbody>
//               {monthData.map((month) => (
//                 <tr key={month.monthTypeId}>
//                   <td>
//                     <b>{month.monthName}</b>
//                     <br />
//                     <button
//                       className="btn btn-sm btn-primary mt-1"
//                       onClick={() => toggleRow(month)}
//                     >
//                       Select All
//                     </button>
//                   </td>

//                   {items.map((item) => (
//                     <td key={item.itemId}>
//                       <input
//                         type="checkbox"
//                         checked={
//                           !!matrixSelection?.[month.monthTypeId]?.[
//                             item.itemId
//                           ]
//                         }
//                         onChange={() => toggleCell(month.monthTypeId, item)}
//                       />
//                     </td>
//                   ))}

//                   <td className="fw-bold text-success">
//                     ₹{monthTotal(month.monthTypeId)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ClassWiseItemRateMapping;




// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// import Heading from "../../UI/Heading";
// import Input from "../../formComponent/Input";
// import ReactSelect from "../../formComponent/ReactSelect";

// import MultiSelectComp from "../../formComponent/MultiSelectComp";

// import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
// import {
//   GetAllClasses,
// } from "../../../networkServices/AcademicYear";

// import {

//   GetClassMonthItemFees,
//   UpdateBulkItemClassMonthWise,
// } from "../../../networkServices/FeeMaster";
// import Tables from "../../UI/customTable";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// function ClassWiseItemRateMapping() {
//   const [t] = useTranslation();

//   const initialData = {
//     class_Name: { label: "", value: "" },
//     Month: { label: "", value: "" },
//     item: [],
//   };
//   const localData = useLocalStorage("userData", "get");
//   const [values, setValues] = useState(initialData);
//   const [classes, setClasses] = useState([]);

//   const [items, setItems] = useState([]);
// console.log("items",items)
//   // 👇 table + rate data
//   const [itemRates, setItemRates] = useState([]);

//   const getClass = async () => {
//     try {
//       const res = await GetAllClasses();
//       if (res?.success) setClasses(res?.data);
//       else notify(res?.message, "error");
//     } catch {
//       notify("Failed to load classes", "error");
//     }
//   };



//   useEffect(() => {
//     getClass();
//   }, []);

//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//     if(name==="class_Name"){
//       Itemtable(value?.value)
//     }
//   };


//   // 🔥 Rate change per row
//   const handleRateChange = (index, value) => {
//     const updated = [...itemRates];
//     updated[index].rate = value;
//     setItemRates(updated);
//   };

// const Itemtable=async(classID)=>{
//   try {
//      const payload={
//           classId: classID,
//           schoolTypeId:"2",
//           sectionId:"",
//           sessionId:"1",
//           OrgId:localData?.OrganizationId??"",
//           BranchId:localData?.defaultCentre??"",
//         }
//         const res = await GetClassMonthItemFees(payload);
//         if(res?.success){
//           setItems(res?.data);
//         }
//        else{
//          notify(res?.message, "error");
//        };
//   } catch (error) {
//     console.log("error",error)
//   }
// }

//   const handleSave = async () => {
//     if (!values?.class_Name?.value || !values?.Month?.value) {
//       notify("Class and Month are required", "error");
//       return;
//     }

//     if (itemRates.length === 0) {
//       notify("Please select at least one item", "error");
//       return;
//     }

//     const payload = [{
//       classId: values.class_Name.value,
//       monthTypeMasterId: values.Month.value,
//       items: itemRates.map((item) => ({
//         itemId: item.itemId,
//         rate: Number(item.rate),
//       })),
//     }]

//     try {
//       const res = await UpdateBulkItemClassMonthWise(payload);
//       if (res?.success) {
//         notify(res?.message, "success");
      
//       } else {
//         notify(res?.message, "error");
//       }
//     } catch {
//       notify("Error while saving data", "error");
//     }
//   };


//   return (
//     <div className="card">
//       <Heading title={t("Rate Schedule By Class")} isBreadcrumb={false} />

//       <div className="row p-2">
//         <ReactSelect
//           placeholderName={t("Class")}
//           searchable
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//           name="class_Name"
//           dynamicOptions={handleReactSelectDropDownOptions(
//             classes,
//             "className",
//             "id"
//           )}
//           handleChange={handleSelect}
//           value={values?.class_Name?.value}
//         />

       

//         <div className="col-xl-2 col-md-4 col-sm-6 col-12">
//           <button
//             onClick={handleSave}
//             className="btn btn-sm btn-primary"
//             type="button"
//           >
//             {t("Save")}
//           </button>
//         </div>
//       </div>


//       <Tables
//         thead={[
//           { name: "Item Name" },
//           { name: "Rate" },
//         ]}
//         tbody={itemRates.map((item, index) => ({
//           itemName: item.itemName,
//           rate: (
//             <input
//               type="number"
//               className="form-control form-control-sm"
//               value={item.rate}
//               onChange={(e) =>
//                 handleRateChange(index, e.target.value)
//               }
//             />
//           ),
//         }))}
//       />
       
//     </div>
//   );
// }

// export default ClassWiseItemRateMapping;


