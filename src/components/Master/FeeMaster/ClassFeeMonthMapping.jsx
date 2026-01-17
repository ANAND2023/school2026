import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import { GetAllClasses } from "../../../networkServices/AcademicYear";
import {
  GetAllMonthType,
  GetAllItemMaster,
  createcategory,
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
    fetchItems();
  }, []);

  const fetchClasses = async () => {
    const res = await GetAllClasses();
    if (res?.success) setClasses(res.data);
  };

  const fetchMonths = async () => {
    const res = await GetAllMonthType();
    if (res?.success) setMonths(res.data);
  };

  const fetchItems = async () => {
    const res = await GetAllItemMaster();
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

    const res = await createcategory(payload);
    if (res?.success) notify("Fee mapping saved", "success");
    else notify("Something went wrong", "error");
  };

  /* ================= TABLE DATA ================= */

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

  /* ================= UI ================= */

  return (
    <div className="card p-3">
      <Heading title="Class Fee Month Mapping" isBreadcrumb={false} />

      {/* ===== CLASS SELECT ===== */}
      <div className="row mb-3">
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
          handleChange={(name, value) =>
            setValues((prev) => ({ ...prev, [name]: value }))
          }
          value={values?.class_Name?.value}
        />

        <div className="col-xl-2 d-flex align-items-end">
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



// import React, { useEffect, useState } from "react";
// import Heading from "../../UI/Heading";
// import ReactSelect from "../../formComponent/ReactSelect";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import {
//   GetAllMonthType,
//   GetAllItemMaster,
//   createcategory,
// } from "../../../networkServices/FeeMaster";
// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";

// const ClassFeeMonthMapping = () => {
//   /* ================= STATE ================= */

//   const [classes, setClasses] = useState([]);
//   const [months, setMonths] = useState([]);
//   const [items, setItems] = useState([]);

//   const [values, setValues] = useState({
//     class_Name: null,
//   });

//   /**
//    * feeMatrix structure
//    * {
//    *   monthId: {
//    *     itemId: true/false
//    *   }
//    * }
//    */
//   const [feeMatrix, setFeeMatrix] = useState({});

//   /* ================= API CALLS ================= */

//   const getClasses = async () => {
//     try {
//       const res = await GetAllClasses();
//       if (res?.success) setClasses(res.data);
//     } catch {
//       notify("Failed to load classes", "error");
//     }
//   };

//   const getMonths = async () => {
//     try {
//       const res = await GetAllMonthType();
//       if (res?.success) setMonths(res.data);
//     } catch {
//       notify("Failed to load months", "error");
//     }
//   };

//   const getItems = async () => {
//     try {
//       const res = await GetAllItemMaster();
//       if (res?.success) setItems(res.data);
//     } catch {
//       notify("Failed to load items", "error");
//     }
//   };

//   useEffect(() => {
//     getClasses();
//     getMonths();
//     getItems();
//   }, []);

//   /* ================= LOGIC ================= */

//   const toggleFee = (monthId, itemId) => {
//     setFeeMatrix((prev) => ({
//       ...prev,
//       [monthId]: {
//         ...prev[monthId],
//         [itemId]: !prev?.[monthId]?.[itemId],
//       },
//     }));
//   };

//   const getMonthTotal = (monthId) => {
//     if (!feeMatrix[monthId]) return 0;

//     return items.reduce((sum, item) => {
//       const rate = Number(item.unit || 0);
//       return feeMatrix[monthId][item.id] ? sum + rate : sum;
//     }, 0);
//   };

//   /* ================= PAYLOAD ================= */

//   const buildPayload = () => {
//     return months
//       .map((month) => ({
//         classId: values.class_Name.value,
//         monthTypeMasterId: month.id,
//         items: items
//           .filter((item) => feeMatrix?.[month.id]?.[item.id])
//           .map((item) => ({
//             itemId: item.id,
//             rate: Number(item.unit || 0),
//           })),
//       }))
//       .filter((row) => row.items.length > 0);
//   };

//   const handleSave = async () => {
//     if (!values.class_Name) {
//       notify("Please select class", "error");
//       return;
//     }

//     const payload = buildPayload();
//     console.log("FINAL PAYLOAD 👉", payload);

//     try {
//       const res = await createcategory(payload);
//       if (res?.success) notify("Fee mapping saved successfully", "success");
//       else notify("Something went wrong", "error");
//     } catch {
//       notify("API error", "error");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="card p-3">
//       <Heading title="Class Fee Month Mapping" isBreadcrumb={false} />

//       {/* ================= CLASS SELECT ================= */}
//       <div className="row mb-3">
//         <ReactSelect
//           placeholderName="Class"
//           searchable
//           respclass="col-xl-3 col-md-4 col-sm-6 col-12"
//           name="class_Name"
//           dynamicOptions={handleReactSelectDropDownOptions(
//             classes,
//             "className",
//             "id"
//           )}
//           handleChange={(name, value) =>
//             setValues((prev) => ({ ...prev, [name]: value }))
//           }
//           value={values?.class_Name?.value}
//         />

//         <div className="col-xl-2 d-flex align-items-end">
//           <button className="btn btn-sm btn-primary" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       {values.class_Name && (
//         <div className="table-responsive">
//           <table className="table table-bordered align-middle">
//             <thead className="bg-primary text-white text-center">
//               <tr>
//                 <th>Month</th>
//                 {items.map((item) => (
//                   <th key={item.id}>
//                     {item.displayName}
//                     <br />
//                     ₹{item.unit}
//                   </th>
//                 ))}
//                 <th>Monthly Total</th>
//               </tr>
//             </thead>

//             <tbody>
//               {months.map((month) => (
//                 <tr key={month.id}>
//                   <td>
//                     <b>{month.name}</b>
//                   </td>

//                   {items.map((item) => (
//                     <td className="text-center" key={item.id}>
//                       <input
//                         type="checkbox"
//                         checked={
//                           feeMatrix?.[month.id]?.[item.id] || false
//                         }
//                         onChange={() =>
//                           toggleFee(month.id, item.id)
//                         }
//                       />
//                     </td>
//                   ))}

//                   <td className="fw-bold text-success">
//                     ₹{getMonthTotal(month.id)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassFeeMonthMapping;



// import React, { useEffect, useState } from "react";
// import Input from "../../formComponent/Input";
// import Tables from "../../UI/customTable";
// import Heading from "../../UI/Heading";
// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import { createcategory, GetAllCategory, GetAllItemMaster, GetAllMonthType, updatecategory } from "../../../networkServices/FeeMaster";
// import ReactSelect from "../../formComponent/ReactSelect";
// import { GetAllClasses } from "../../../networkServices/AcademicYear";
// import { useTranslation } from "react-i18next";

// const ClassFeeMonthMapping = () => {
//      const [t] = useTranslation();
//     const initialData = {
//        class_Name: "",
//        monthType: "",
//        item: "",
//     };

//     const [values, setValues] = useState(initialData);
//     const [tableData, setTableData] = useState([]);
//     const [isEdit, setIsEdit] = useState(false);
//     const [classes, setClasses] = useState([]);
//     const [allMonthType, setAllMonthType] = useState([]);
//     const [aLlItem, setALlItem] = useState([]);
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setValues((prev) => ({ ...prev, [name]: value }));
//     };
//     const getClass = async () => {

//         try {
//             const response = await GetAllClasses();
//             if (response?.success) {
//                 setClasses(response?.data)
//             } else {
//                 notify(response?.message, "error");
//                 setTableData([])
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };
//     const AllMonthType = async () => {
//         try {
//             const res = await GetAllMonthType();
//             if (res?.success) {
//                 setAllMonthType(res?.data);
//             }
//         } catch {
//             notify("Failed to load categories", "error");
//         }
//     };
//     const AllItemMaster = async () => {
//         try {
//             const res = await GetAllItemMaster();
//             if (res?.success) {
//                 setALlItem(res?.data);
//             }
//         } catch {
//             notify("Failed to load categories", "error");
//         }
//     };
//     const handleSave = async () => {
       

//         const payload = [
//   {
//     "classId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "monthTypeMasterId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "items": [
//       {
//         "itemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "rate": null
//       }
//     ]
//   }
// ]

//         try {
//             const res = await createcategory(payload);

//             if (res?.success) {
//                 notify(res?.message, "success");
             
//             } else {
//                 notify(res?.data?.message, "error");
//             }
//         } catch {
//             notify("Something went wrong", "error");
//         }
//     };

    
//     const handleSelect = (name, value) => {
//         setValues((prev) => ({ ...prev, [name]: value }));
//     };

//     useEffect(() => {
//         AllMonthType();
//         getClass()
//         AllItemMaster()
//     }, []);

//     return (
//         <div className="card p-2">
//             <Heading title="Category Master" isBreadcrumb={false} />
//             <div className="row p-2">
//                 <ReactSelect
//                     placeholderName={t("Class")}
//                     searchable={true}
//                     respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                     id="class_Name"
//                     name="class_Name"
//                     removeIsClearable={true}
//                     // dynamicOptions={classes}
//                     dynamicOptions={[...handleReactSelectDropDownOptions(classes, "className", "id")]}
//                     handleChange={handleSelect}
//                     value={values?.class_Name?.value}
//                 // requiredClassName="required-fields"
//                 />
//                 {/* <Input
//           name="categoryName"
//           placeholder=""
//           value={values.categoryName}
//           lable="Category Name"
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//            className="form-control"
//           onChange={handleChange}
//         /> */}


//                 <div
//                     className="col-xl-1 col-md-4 col-sm-6 col-12 text-end">
//                     <button className="btn btn-sm btn-primary" onClick={handleSave}>
//                         { "Save"}
//                     </button>
//                 </div>
//             </div>

//             {/* ================= TABLE ================= */}
//             <Tables
//                 thead={[
                  
//                     { name: "Remarks" },
//                     { name: "Action" }
//                 ]}
//                 tbody={tableData.map((item) => ({
                    
//                     remarks: item.remarks,
//                     action: <>

//                         <div
//                             className="d-flex align-items-center justify-content-center gap-2"
//                         // className="row gap-2"
//                         >
//                             <button
//                                 id="editBtn"
//                                 onclick="handleEdit(item.id)"
//                                 title="Edit"
//                                 className="d-flex align-items-center justify-content-center"
//                             >
//                                 <i class=" bi-pencil-square"></i>
//                             </button>

//                             <button
//                                 id="deleteBtn"
//                                 onclick="handleDelete(item.id)"
//                                 title="Delete"
//                             >
//                                 <i class="bi-trash3"></i>
//                             </button>
//                         </div>

//                     </>,
//                 }))}
//             />
//         </div>
//     );
// };

// export default ClassFeeMonthMapping;
