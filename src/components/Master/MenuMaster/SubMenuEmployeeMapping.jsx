import React, { useState } from "react";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk } from "../../../networkServices/MenuMaster";

const SubMenuEmployeeMapping = () => {
  const initialData = {
    employeeId: null,
    employeeName: "",
    subMenuId: null,
    subMenuName: "",
    branchId: null,
    orgId: "ORG001"
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= OPTIONS ================= */
  const employeeList = [
    { label: "Rahul Sharma", value: "EMP001" },
    { label: "Ankit Verma", value: "EMP002" }
  ];

  const subMenuList = [
    { label: "Student Master", value: "SUB001" },
    { label: "Fee Master", value: "SUB002" }
  ];

  const branchList = [
    { label: "Main Branch", value: "BR001" },
    { label: "City Branch", value: "BR002" }
  ];

  /* ================= SELECT HANDLER ================= */
  const handleSelect = (name, option) => {
    if (name === "employeeId") {
      setValues(prev => ({
        ...prev,
        employeeId: option,
        employeeName: option.label
      }));
    }

    if (name === "subMenuId") {
      setValues(prev => ({
        ...prev,
        subMenuId: option,
        subMenuName: option.label
      }));
    }

    if (name === "branchId") {
      setValues(prev => ({
        ...prev,
        branchId: option
      }));
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.employeeId || !values.subMenuId) {
      notify("Employee & SubMenu required", "error");
      return;
    }

    const payload = [
      {
        employeeId: values.employeeId.value,
        employeeName: values.employeeName,
        subMenuId: values.subMenuId.value,
        subMenuName: values.subMenuName,
        branchId: values.branchId?.value,
        orgId: values.orgId
      }
    ];

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      const res = await MenuCreatebulk(payload);
      if (res?.success) {
        setTableData(prev => [...prev, payload[0]]);
        setValues(initialData);
        notify("Saved Successfully", "success");
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
  };

  return (
    <>
      <div className="card p-2">
        <Heading title="Employee SubMenu Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <ReactSelect
            placeholderName="Employee"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="employeeId"
            dynamicOptions={employeeList}
            handleChange={handleSelect}
            value={values.employeeId}
          />

          <ReactSelect
            placeholderName="Sub Menu"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="subMenuId"
            dynamicOptions={subMenuList}
            handleChange={handleSelect}
            value={values.subMenuId}
          />

          <ReactSelect
            placeholderName="Branch"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="branchId"
            dynamicOptions={branchList}
            handleChange={handleSelect}
            value={values.branchId}
          />

          <div className="col-12 text-end mt-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Employee" },
            { name: "Sub Menu" },
            { name: "Branch" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            employee: item.employeeName,
            submenu: item.subMenuName,
            branch: item.branchId,
            action: (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(index)}
              >
                🗑️
              </button>
            )
          }))}
        />
      </div>
    </>
  );
};

export default SubMenuEmployeeMapping;




// import React, { useEffect, useState } from "react";
// import Input from "../../../components/formComponent/Input";
// import Tables from "../../../components/UI/customTable";
// import ReactSelect from "../../formComponent/ReactSelect";
// import Heading from "../../UI/Heading";
// import { notify } from "../../../utils/utils";
// import { MenuCreatebulk } from "../../../networkServices/MenuMaster";
// // import { CreateMenu, GetMenus } from "../../../networkServices/menuApi";

// const SubMenuBulk = () => {
//   const initialData = {
//     name: "",
//     code: "",
//     icon: "",
//     displayOrder: "",
//     branchId: null,
//     orgId: "ORG001" // normally login se aata hai
//   };

//   const [values, setValues] = useState(initialData);
//   const [tableData, setTableData] = useState([]);

//   const branchList = [
//     { label: "Main Branch", value: "BR001" },
//     { label: "City Branch", value: "BR002" }
//   ];

//   /* =======================
//       INPUT HANDLER
//   ======================== */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   /* =======================
//       SAVE DATA
//   ======================== */
//   const handleSave = async () => {
//     if (!values.name || !values.code) {
//       notify("Name & Code required", "error");
//       return;
//     }

//     const payload = [
//       {
//         name: values.name,
//         code: values.code,
//         icon: values.icon,
//         displayOrder: Number(values.displayOrder),
//         branchId: values.branchId?.value,
//         orgId: values.orgId
//       }
//     ];

//     console.log("FINAL PAYLOAD 👉", payload);

//     try {
//       const res = await MenuCreatebulk(payload);
//       if (res?.success) {

//       setTableData((prev) => [...prev, payload[0]]);
//       setValues(initialData);
//       notify("Saved Successfully", "success");

//       } else {
//         notify(res?.message, "error");
//       }
//     } catch (error) {
//       notify("Something went wrong", "error");
//     }
//   };

//   /* =======================
//       EDIT / DELETE
//   ======================== */
//   const handleEdit = (row) => {
//     setValues({
//       ...row,
//       branchId: branchList.find(b => b.value === row.branchId)
//     });
//   };

//   const handleDelete = (index) => {
//     const data = [...tableData];
//     data.splice(index, 1);
//     setTableData(data);
//   };

//   return (
//     <>
//       <div className="card p-2">
//         <Heading title="Menu Master" isBreadcrumb={false} />

//         {/* ================= FORM ================= */}
//         <div className="row p-2">
//           <Input
//             type="text"
//             name="name"
//             value={values.name}
//             lable="Name"
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             onChange={handleChange}
//               className="form-control"
//           />

//           <Input
//             type="text"
//             name="code"
//             value={values.code}
//             lable="Code"
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             onChange={handleChange}
//               className="form-control"
//           />

//           <Input
//             type="text"
//             name="icon"
//             value={values.icon}
//             lable="Icon"
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             onChange={handleChange}
//               className="form-control"
//           />

//           <Input
//             type="number"
//             name="displayOrder"
//             value={values.displayOrder}
//             lable="Display Order"
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             onChange={handleChange}
//               className="form-control"
//           />

//           <ReactSelect
//             placeholderName="Branch"
//             respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//             name="branchId"
//             dynamicOptions={branchList}
//             handleChange={handleSelect}
//             value={values.branchId}
//               className="form-control"
//           />

//           <div className="col-12 text-end mt-2">
//             <button
//               className="btn btn-sm btn-primary"
//               onClick={handleSave}
//             >
//               Save
//             </button>
//           </div>
//         </div>

//         {/* ================= TABLE ================= */}
//         <Tables
//           thead={[
//             { name: "Name" },
//             { name: "Code" },
//             { name: "Order" },
//             { name: "Action" }
//           ]}
//           tbody={tableData.map((item, index) => ({
//             name: item.name,
//             code: item.code,
//             Order: item.displayOrder,
//             action: (
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-sm btn-warning"
//                   onClick={() => handleEdit(item)}
//                 >
//                   ✏️
//                 </button>
//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={() => handleDelete(index)}
//                 >
//                   🗑️
//                 </button>
//               </div>
//             )
//           }))}
//         />
//       </div>
//     </>
//   );
// };

// export default SubMenuBulk;
