import React, { useEffect, useState } from "react";

import Input from "../formComponent/Input";
import Tables from "../UI/customTable";
import Heading from "../UI/Heading";
import { notify } from "../../utils/utils";
import { EnquiryCreate, GetAllEnquiries } from "../../networkServices/School/RegistrationApi";

const Enquiry = () => {
  /* ================= STATE ================= */
//   const initialData = {
//     id: null,
//     studentName: "",
//     fatherName: "",
//     enquirerName: "",
//     mobileNumber: "",
//     alternateMobileNumber: "",
//     previousSchoolName: "",
//     previousClass: "",
//     previousPercentage: "",
//     desiredClass: "",
//     isInterested: true,
//     remarks: ""
//   };
const initialData = {
  id: 1,
  studentName: "Rahul Kumar",
  fatherName: "Suresh Kumar",
  enquirerName: "Suresh Kumar",
  mobileNumber: "9876543210",
  alternateMobileNumber: "9123456789",
  previousSchoolName: "Bright Future Public School",
  previousClass: "8th",
  previousPercentage: "78",
  desiredClass: "9th",
  isInterested: true,
  remarks: "Parent is interested in admission from next academic session"
};

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSave = async () => {
    if (!values.studentName || !values.mobileNumber) {
      notify("Student Name & Mobile Number required", "error");
      return;
    }

    const payload = {
      studentName: values.studentName,
      fatherName: values.fatherName,
      enquirerName: values.enquirerName,
      mobileNumber: values.mobileNumber,
      alternateMobileNumber: values.alternateMobileNumber,
      previousSchoolName: values.previousSchoolName,
      previousClass: values.previousClass,
      previousPercentage: Number(values.previousPercentage),
      desiredClass: values.desiredClass,
      isInterested: values.isInterested,
      remarks: values.remarks
    };

    try {
      const res = isEdit
        ? true
        // ? await updatecategory({ id: values.id, ...payload })
        : await EnquiryCreate(payload);

      if (res?.success) {
        notify(res?.message, "success");
        getAllEnquiry();
        setValues(initialData);
        setIsEdit(false);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch {
      notify("Something went wrong", "error");
    }
  };

  /* ================= GET LIST ================= */
  const getAllEnquiry = async () => {
    try {
      const res = await GetAllEnquiries();
      if (res?.success) {
        setTableData(res?.data);
      }
    } catch {
      notify("Failed to load enquiries", "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setValues({
      id: item.id,
      studentName: item.studentName,
      fatherName: item.fatherName,
      enquirerName: item.enquirerName,
      mobileNumber: item.mobileNumber,
      alternateMobileNumber: item.alternateMobileNumber,
      previousSchoolName: item.previousSchoolName,
      previousClass: item.previousClass,
      previousPercentage: item.previousPercentage,
      desiredClass: item.desiredClass,
      isInterested: item.isInterested,
      remarks: item.remarks
    });
    setIsEdit(true);
  };

  useEffect(() => {
    getAllEnquiry();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="card p-2">
      <Heading title="Student Enquiry" isBreadcrumb={false} />

      {/* ================= FORM ================= */}
      <div className="row p-2">
        <Input name="studentName" lable="Student Name"
          value={values.studentName}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="fatherName" lable="Father Name"
          value={values.fatherName}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="enquirerName" lable="Enquirer Name"
          value={values.enquirerName}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="mobileNumber" lable="Mobile Number"
          value={values.mobileNumber}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="alternateMobileNumber" lable="Alternate Mobile"
          value={values.alternateMobileNumber}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="previousSchoolName" lable="Previous School"
          value={values.previousSchoolName}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="previousClass" lable="Previous Class"
          value={values.previousClass}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="previousPercentage" lable="Previous Percentage"
          value={values.previousPercentage}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="desiredClass" lable="Desired Class"
          value={values.desiredClass}
          className="form-control"
          respclass="col-md-3"
          onChange={handleChange}
        />

        <Input name="remarks" lable="Remarks"
          value={values.remarks}
          className="form-control"
          respclass="col-md-6"
          onChange={handleChange}
        />

        <div className="col-md-3 d-flex align-items-end justify-content-end">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <Tables
        thead={[
          { name: "Student" },
          { name: "Parent" },
          { name: "Mobile" },
          { name: "previous Class" },
          { name: "Desired Class" },
          { name: "Pre School Name" },
          { name: "Action" }
        ]}
        tbody={tableData.map((item) => ({
          studentName: item.studentName,
          fatherName: item.fatherName,
          mobileNumber: `${item.mobileNumber},${item?.alternateMobileNumber}`,
          previousClass: item.previousClass,
          desiredClass: item.desiredClass,
          previousSchoolName: item.previousSchoolName,
          action: (
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEdit(item)}
            >
              ✏️
            </button>
          )
        }))}
      />
    </div>
  );
};

export default Enquiry;



// import React, { useEffect, useState } from "react";
// import Input from "../../formComponent/Input";
// import Tables from "../../UI/customTable";
// import Heading from "../../UI/Heading";
// import { notify } from "../../../utils/utils";
// import { createcategory, GetAllCategory, updatecategory } from "../../../networkServices/FeeMaster";

// const Enquiry = () => {
//   const initialData = {
//     id: null,
//     categoryName: "",
//     displayName: "",
//     remarks: ""
//   };

//   const [values, setValues] = useState(initialData);
//   const [tableData, setTableData] = useState([]);
//   const [isEdit, setIsEdit] = useState(false);

//   /* ================= HANDLERS ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   /* ================= CREATE / UPDATE ================= */
//   const handleSave = async () => {
//     if (!values.categoryName || !values.displayName) {
//       notify("Category Name & Display Name required", "error");
//       return;
//     }

//     const payload = {
//       categoryName: values.categoryName,
//       displayName: values.displayName,
//       remarks: values.remarks
//     };

//     try {
//       const res = isEdit
//         ? await updatecategory({ id: values.id, ...payload })
//         : await createcategory(payload);

//       if (res?.success) {
//         notify(res?.message, "success");
//         getAllCategory();
//         setValues(initialData);
//         setIsEdit(false);
//       } else {
//         notify(res?.data?.message, "error");
//       }
//     } catch {
//       notify("Something went wrong", "error");
//     }
//   };

//   const getAllCategory = async () => {
//     try {
//       const res = await GetAllCategory();
//       if (res?.success) {
//         setTableData(res?.data);
//       }
//     } catch {
//       notify("Failed to load categories", "error");
//     }
//   };

//   /* ================= EDIT ================= */
//   const handleEdit = (item) => {
//     setValues({
//       id: item.id,
//       categoryName: item.categoryName,
//       displayName: item.displayName,
//       remarks: item.remarks
//     });
//     setIsEdit(true);
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   return (
//     <div className="card p-2">
//       <Heading title="Category Master" isBreadcrumb={false} />

//       {/* ================= FORM ================= */}
//       <div className="row p-2">
//         <Input
//           name="categoryName"
//           placeholder=""
//           value={values.categoryName}
//           lable="Category Name"
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//            className="form-control"
//           onChange={handleChange}
//         />

//         <Input
//           name="displayName"
//           value={values.displayName}
//            placeholder=""
//           lable="Display Name"
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//            className="form-control"
//           onChange={handleChange}
//         />

//         <Input
//           name="remarks"
//           value={values.remarks}
//           lable="Remarks"
//           // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//            respclass="col-md-4"
//            className="form-control"
//           onChange={handleChange}
//         />

//         <div
//          className="col-xl-1 col-md-4 col-sm-6 col-12 text-end">
//           <button className="btn btn-sm btn-primary" onClick={handleSave}>
//             {isEdit ? "Update" : "Save"}
//           </button>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <Tables
//         thead={[
//           { name: "Category Name" },
//           { name: "Display Name" },
//           { name: "Remarks" },
//           { name: "Action" }
//         ]}
//         tbody={tableData.map((item) => ({
//           categoryName: item.categoryName,
//           displayName: item.displayName,
//           remarks: item.remarks,
//           action: (
//             <button
//               className="btn btn-sm btn-warning"
//               onClick={() => handleEdit(item)}
//             >
//               ✏️
//             </button>
//           )
//         }))}
//       />
//     </div>
//   );
// };

// export default Enquiry;
