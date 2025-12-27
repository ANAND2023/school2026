import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import { AddFeeConcession, GetAllFeeConcessions } from "../../../networkServices/FeeMaster";
import Input from "../../formComponent/Input";

function CreateFeeConcession() {
  const [t] = useTranslation();

  /* ================= INITIAL STATE ================= */
  const initialData = {
    context: {
      orgId: "",
      branchId: "",
    },
    concessionName: "",
    value: "",
    isPercentage: false,
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e, parent = null) => {
    const { name, value, type, checked } = e.target;

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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  /* ================= GET DATA ================= */
  const getData = async () => {
    const payload={
  "orgId": "string",
  "branchId": "string",
  "isAll": 0
}

    try {
      const res = await GetAllFeeConcessions(payload);
      if (res?.success) {
        setTableData(res.data);
      } else {
        notify(res?.message, "error");
      }
    } catch (err) {
      notify("Error fetching fee concessions", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.concessionName || !values.value) {
      notify("All required fields are mandatory", "error");
      return;
    }

    const payload = {
      context: values.context,
      concessionName: values.concessionName,
      value: Number(values.value),
      isPercentage: Boolean(values.isPercentage),
    };

    try {
      const res = await AddFeeConcession(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving fee concession", "error");
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="card p-1">
      <Heading title={t("Create Fee Concession")} isBreadcrumb={false} />

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

        {/* ===== CONCESSION NAME ===== */}
        <Input
          className="form-control required-fields"
          name="concessionName"
          value={values.concessionName}
          lable="Concession Name"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== VALUE ===== */}
        <Input
          className="form-control required-fields"
          name="value"
          type="number"
          value={values.value}
          lable="Concession Value"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== IS PERCENTAGE ===== */}
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center mt-4">
          <input
            type="checkbox"
            checked={values.isPercentage}
            onChange={handleChange}
            name="isPercentage"
            className="mr-2"
          />
          <label className="mb-0 ml-2">
            {t("Is Percentage")}
          </label>
        </div>

        {/* ===== BUTTON ===== */}
        <div className="col-12 text-right mt-3">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {t("Save Concession")}
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Tables
        thead={[
          { name: "Concession Name" },
          { name: "Value" },
          { name: "Type" },
        ]}
        tbody={tableData?.map((item) => ({
          "Concession Name": item?.concessionName,
          Value: item?.value,
          Type: item?.isPercentage ? "Percentage" : "Flat",
        }))}
      />
    </div>
  );
}

export default CreateFeeConcession;


// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import Tables from "../../../components/UI/customTable";
// import Modal from "../../../components/modalComponent/Modal";
// import { notify } from "../../../utils/utils";
// import { AddBankAccount,AddFeeConcession,GetAllBankAccounts } from "../../../networkServices/FeeMaster";
// import Input from "../../formComponent/Input";


// function CreateFeeConcession() {
//   const [t] = useTranslation();

//   /* ================= INITIAL DATA (BANK PAYLOAD) ================= */
//   const initialData = {
//     context: {
//       orgId: "",
//       branchId: "",
//     },
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     branchName: "",
//     isDefault: false,
//   };

//   const [values, setValues] = useState(initialData);
//   const [tableData, setTableData] = useState([]);
//   const [handleModelData, setHandleModelData] = useState({});
//   const [modalData, setModalData] = useState({});

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

//   /* ================= API ================= */
//   const getData = async () => {
//     try {
//       const res = await GetAllBankAccounts();
//       if (res?.success) setTableData(res.data);
//       else notify(res?.message, "error");
//     } catch {
//       notify("Error fetching bank accounts", "error");
//     }
//   };

//   useEffect(() => {
//     // getData();
//   }, []);

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     const payload = {
//       ...values,
//       isDefault: Boolean(values.isDefault),
//     };

//     try {
//       const res = await AddFeeConcession(payload);
//       if (res?.success) {
//         notify(res.message, "success");
//         setValues(initialData);
//         getData();
//       } else {
//         notify(res?.message, "error");
//       }
//     } catch {
//       notify("Error saving bank account", "error");
//     }
//   };

//   const setIsOpen = () => {
//     setHandleModelData((v) => ({ ...v, isOpen: false }));
//   };

//   /* ================= JSX ================= */
//   return (
//     <>
//       {handleModelData?.isOpen && (
//         <Modal
//           visible={handleModelData?.isOpen}
//           setVisible={setIsOpen}
//           modalWidth={handleModelData?.width}
//           Header={t(handleModelData?.label)}
//           modalData={modalData}
//           setModalData={setModalData}
//         >
//           {handleModelData?.Component}
//         </Modal>
//       )}

//       <div className="card p-1">
//         <Heading title={t("Create Bank Account")} isBreadcrumb={false} />

//         <div className="row p-2">
//           {/* ===== CONTEXT ===== */}
//           <Input
//             className="form-control required-fields"
//             name="orgId"
//             value={values.context.orgId}
//             lable="Organization Id"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={(e) => handleChange(e, "context")}
//           />

//           <Input
//             className="form-control required-fields"
//             name="branchId"
//             value={values.context.branchId}
//             lable="Branch Id"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={(e) => handleChange(e, "context")}
//           />

//           {/* ===== BANK DETAILS ===== */}
//           <Input
//             className="form-control required-fields"
//             name="bankName"
//             value={values.bankName}
//             lable="Bank Name"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={handleChange}
//           />

//           <Input
//             className="form-control required-fields"
//             name="accountNumber"
//             value={values.accountNumber}
//             lable="Account Number"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={handleChange}
//           />

//           <Input
//             className="form-control required-fields"
//             name="ifscCode"
//             value={values.ifscCode}
//             lable="IFSC Code"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={handleChange}
//           />

//           <Input
//             className="form-control"
//             name="branchName"
//             value={values.branchName}
//             lable="Bank Branch Name"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             onChange={handleChange}
//           />

//           {/* ===== DEFAULT ===== */}
//           <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex align-items-center mt-4">
//             <input
//               type="checkbox"
//               className="mr-2"
//               checked={values.isDefault}
//               onChange={handleChange}
//               name="isDefault"
//             />
//             <label className="mb-0 ml-2">{t("Is Default")}</label>
//           </div>

//           {/* ===== BUTTON ===== */}
//           <div className="col-12 text-right">
//             <button className="btn btn-sm btn-primary" onClick={handleSave}>
//               {t("Save Bank Account")}
//             </button>
//           </div>
//         </div>

//         {/* ===== TABLE ===== */}
//         <Tables
//           thead={[{ name: "Bank Name" }, { name: "Account No" }, { name: "Action" }]}
//           tbody={tableData?.map((item) => ({
//             "Bank Name": item?.bankName,
//             "Account No": item?.accountNumber,
//             action: (
//               <div className="row gap-2">
//                 <button className="btn btn-sm">
//                   <i className="bi bi-pencil-square"></i>
//                 </button>
//                 <button className="btn btn-sm">
//                   <i className="bi bi-trash3"></i>
//                 </button>
//               </div>
//             ),
//           }))}
//         />
//       </div>
//     </>
//   );
// }

// export default CreateFeeConcession;

