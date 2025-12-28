import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import {
  AddScholarship,
  GetAllScholarships,
} from "../../../networkServices/FeeMaster";
import Input from "../../formComponent/Input";

function CreateScholarship() {
  const [t] = useTranslation();

  /* ================= INITIAL STATE ================= */
  const initialData = {
    context: {
      orgId: "",
      branchId: "",
    },
    scholarshipName: "",
    amount: "",
    eligibilityCriteria: "",
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e, parent = null) => {
    const { name, value } = e.target;

    if (parent) {
      setValues((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value,
        },
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= GET DATA ================= */
  const getData = async () => {
    if (!values.context.orgId || !values.context.branchId) return;

    const payload = {
      orgId: values.context.orgId,
      branchId: values.context.branchId,
      isAll: 0,
    };

    try {
      const res = await GetAllScholarships(payload);
      if (res?.success) {
        setTableData(res.data || []);
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error fetching scholarships", "error");
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [values.context.orgId, values.context.branchId]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (
      !values.context.orgId ||
      !values.context.branchId ||
      !values.scholarshipName ||
      !values.amount
    ) {
      notify("All required fields are mandatory", "error");
      return;
    }

    const payload = {
      context: values.context,
      scholarshipName: values.scholarshipName,
      amount: Number(values.amount),
      eligibilityCriteria: values.eligibilityCriteria,
    };

    try {
      const res = await AddScholarship(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving scholarship", "error");
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="card p-1">
      <Heading title={t("Create Scholarship")} isBreadcrumb={false} />

      <div className="row p-2">
        {/* ===== CONTEXT ===== */}
        <Input
          className="form-control required-fields"
          name="orgId"
          value={values.context.orgId}
          lable="Organization Id"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={(e) => handleChange(e, "context")}
        />

        <Input
          className="form-control required-fields"
          name="branchId"
          value={values.context.branchId}
          lable="Branch Id"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={(e) => handleChange(e, "context")}
        />

        {/* ===== SCHOLARSHIP NAME ===== */}
        <Input
          className="form-control required-fields"
          name="scholarshipName"
          value={values.scholarshipName}
          lable="Scholarship Name"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== AMOUNT ===== */}
        <Input
          className="form-control required-fields"
          type="number"
          name="amount"
          value={values.amount}
          lable="Scholarship Amount"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== ELIGIBILITY ===== */}
        <Input
          className="form-control"
          name="eligibilityCriteria"
          value={values.eligibilityCriteria}
          lable="Eligibility Criteria"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== BUTTON ===== */}
        <div className="col-12 text-right mt-3">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {t("Save Scholarship")}
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Tables
        thead={[
          { name: "Scholarship Name" },
          { name: "Amount" },
          { name: "Eligibility Criteria" },
        ]}
        tbody={tableData?.map((item) => ({
          "Scholarship Name": item?.scholarshipName,
          Amount: item?.amount,
          "Eligibility Criteria": item?.eligibilityCriteria || "-",
        }))}
      />
    </div>
  );
}

export default CreateScholarship;



// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import Tables from "../../../components/UI/customTable";
// import { notify } from "../../../utils/utils";
// import {
//   AddPaymentMode,
//   AddScholarship,
//   GetAllPaymentModes,
//   GetAllScholarships,
// } from "../../../networkServices/FeeMaster";
// import Input from "../../formComponent/Input";

// function CreateScholarship() {
//   const [t] = useTranslation();

//   /* ================= INITIAL STATE ================= */
//   const initialData = {
//     context: {
//       orgId: "",
//       branchId: "",
//     },
//     modeName: "",
//     requiresReferenceNo: false,
//     isOnline: false,
//   };

//   const [values, setValues] = useState(initialData);
//   const [tableData, setTableData] = useState([]);

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e, parent = null) => {
//     const { name, value, type, checked } = e.target;

//     if (parent) {
//       setValues((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [name]: value,
//         },
//       }));
//     } else {
//       setValues((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }
//   };

//   /* ================= GET DATA ================= */
//   const getData = async () => {
//     if (!values.context.orgId || !values.context.branchId) return;

//     const payload = {
//       orgId: values.context.orgId,
//       branchId: values.context.branchId,
//       isAll: 0,
//     };

//     try {
//       const res = await GetAllScholarships(payload);
//       if (res?.success) {
//         setTableData(res.data || []);
//       } else {
//         notify(res?.message, "error");
//       }
//     } catch {
//       notify("Error fetching payment modes", "error");
//     }
//   };

//   useEffect(() => {
//     getData();
//     // eslint-disable-next-line
//   }, [values.context.orgId, values.context.branchId]);

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (
//       !values.context.orgId ||
//       !values.context.branchId ||
//       !values.modeName
//     ) {
//       notify("All required fields are mandatory", "error");
//       return;
//     }

//     const payload = {
//       context: values.context,
//       modeName: values.modeName,
//       requiresReferenceNo: Boolean(values.requiresReferenceNo),
//       isOnline: Boolean(values.isOnline),
//     };

//     try {
//       const res = await AddScholarship(payload);
//       if (res?.success) {
//         notify(res.message, "success");
//         setValues(initialData);
//         getData();
//       } else {
//         notify(res?.message, "error");
//       }
//     } catch {
//       notify("Error saving payment mode", "error");
//     }
//   };

//   /* ================= JSX ================= */
//   return (
//     <div className="card p-1">
//       <Heading title={t("Create Payment Mode")} isBreadcrumb={false} />

//       <div className="row p-2">
//         {/* ===== CONTEXT ===== */}
//         <Input
//           className="form-control required-fields"
//           name="orgId"
//           value={values.context.orgId}
//           lable="Organization Id"
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//           onChange={(e) => handleChange(e, "context")}
//         />

//         <Input
//           className="form-control required-fields"
//           name="branchId"
//           value={values.context.branchId}
//           lable="Branch Id"
//           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
//           onChange={(e) => handleChange(e, "context")}
//         />

//         {/* ===== MODE NAME ===== */}
//         <Input
//           className="form-control required-fields"
//           name="modeName"
//           value={values.modeName}
//           lable="Payment Mode Name"
//           respclass="col-xl-3 col-md-4 col-sm-6 col-12"
//           onChange={handleChange}
//         />

//         {/* ===== REFERENCE NO ===== */}
//         <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center mt-4">
//           <input
//             type="checkbox"
//             name="requiresReferenceNo"
//             checked={values.requiresReferenceNo}
//             onChange={handleChange}
//             className="mr-2"
//           />
//           <label className="mb-0 ml-2">
//             {t("Requires Reference No")}
//           </label>
//         </div>

//         {/* ===== IS ONLINE ===== */}
//         <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center mt-4">
//           <input
//             type="checkbox"
//             name="isOnline"
//             checked={values.isOnline}
//             onChange={handleChange}
//             className="mr-2"
//           />
//           <label className="mb-0 ml-2">
//             {t("Online Payment")}
//           </label>
//         </div>

//         {/* ===== BUTTON ===== */}
//         <div className="col-12 text-right mt-3">
//           <button className="btn btn-sm btn-primary" onClick={handleSave}>
//             {t("Save Payment Mode")}
//           </button>
//         </div>
//       </div>

//       {/* ===== TABLE ===== */}
//       <Tables
//         thead={[
//           { name: "Mode Name" },
//           { name: "Reference Required" },
//           { name: "Payment Type" },
//         ]}
//         tbody={tableData?.map((item) => ({
//           "Mode Name": item?.modeName,
//           "Reference Required": item?.requiresReferenceNo ? "Yes" : "No",
//           "Payment Type": item?.isOnline ? "Online" : "Offline",
//         }))}
//       />
//     </div>
//   );
// }

// export default CreateScholarship;