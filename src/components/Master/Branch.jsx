

import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";

import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Modal from "../../components/modalComponent/Modal";
import { notify } from "../../utils/utils";
import { CreateBranch, GetAllBranches } from "../../networkServices/AcademicYear";
import Input from "../formComponent/Input";

function Branch() {
  const [t] = useTranslation();

  /* ================= INITIAL DATA ================= */
  const initialData = {
    organisationId: "",
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contact: {
      phoneNumber: "",
      email: "",
      faxNumber: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
    ownerName: "",
    ownerContact: {
      phoneNumber: "",
      email: "",
      faxNumber: "",
    },
    certification: "",
    establishedYear: "",
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

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
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= API ================= */
  const getData = async () => {
    try {
      const res = await GetAllBranches();
      if (res?.success) setTableData(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  useEffect(() => {
    // getData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await CreateBranch(values);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else notify(res?.message, "error");
    } catch {
      notify("Error saving branch", "error");
    }
  };

  const setIsOpen = () => {
    setHandleModelData((v) => ({ ...v, isOpen: false }));
  };

  /* ================= JSX ================= */
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          modalData={modalData}
          setModalData={setModalData}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Branch Master")} isBreadcrumb={false} />

        <div className="row p-2">
          {/* ===== BASIC ===== */}
          {/* <Input
                        type="number"
                        className="form-control required-fields"
                        id="subjectCode"
                        name="subjectCode"
                        value={values?.subjectCode ? values?.subjectCode : ""}
                        // onChange={handleChange}
                        lable={t("Subject Code")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true} */}
                        
          <Input 
          className="form-control required-fields"
          name="organisationId" value={values.organisationId} lable="Organisation Id"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input 
          className="form-control required-fields"
          name="name" value={values.name} lable="Branch Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          {/* ===== ADDRESS ===== */}
          <Input 
          className="form-control required-fields"
          name="street" value={values.address.street} lable="Street"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input 
          className="form-control required-fields"
          name="city" value={values.address.city} lable="City"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input 
          className="form-control required-fields"
          name="state" value={values.address.state} lable="State"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input 
          className="form-control"
          name="zipCode" value={values.address.zipCode} lable="Zip Code"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input 
          className="form-control required-fields"
          name="country" value={values.address.country} lable="Country"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          {/* ===== CONTACT ===== */}
          <Input 
          className="form-control required-fields"
          name="phoneNumber" value={values.contact.phoneNumber} lable="Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          <Input 
          className="form-control required-fields"
          name="email" value={values.contact.email} lable="Email"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          {/* ===== LOCATION ===== */}
          <Input 
          className="form-control required-fields"
          name="latitude" value={values.location.latitude} lable="Latitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          <Input 
          className="form-control required-fields"
          name="longitude" value={values.location.longitude} lable="Longitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          {/* ===== OWNER ===== */}
          <Input 
          className="form-control required-fields"
          name="ownerName" value={values.ownerName} lable="Owner Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input 
          className="form-control required-fields"
          name="phoneNumber" value={values.ownerContact.phoneNumber} lable="Owner Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "ownerContact")} />

          {/* ===== OTHER ===== */}
          <Input 
          className="form-control required-fields"
          name="certification" value={values.certification} lable="Certification"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input 
          className="form-control required-fields"
          type="number" name="establishedYear" value={values.establishedYear}
            lable="Established Year"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          {/* ===== BUTTON ===== */}
          <div className="col-12 text-right">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              {t("Save Branch")}
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <Tables
          thead={[{ name: "Branch" }, { name: "Action" }]}
          tbody={tableData?.map((item) => ({
            Branch: item?.name,
            action: (
              <div className="row gap-2">
                <button className="btn btn-sm">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-sm">
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
}

export default Branch;


// import React, { act, useEffect, useState } from "react";
// import Heading from "../../components/UI/Heading";
// import Input from "../../components/formComponent/Input";
// import { useTranslation } from "react-i18next";
// import Tables from "../../components/UI/customTable";
// import Modal from "../../components/modalComponent/Modal";
// import { notify } from "../../utils/utils";
// import { CreateBranch, GetAllBranches } from "../../networkServices/AcademicYear";
// import ReactSelect from "../formComponent/ReactSelect";

// function Branch() {
//     const [t] = useTranslation(); const initialData = {
//         subjectCode: "",
//         subjectName: "",
//         isPractical:{ label: "Yes", value: "true" },

//     }
//     const [values, setValues] = useState(initialData);
//     const [tableData, setTableData] = useState(
//         [
//             {
//                 class_name: "First Class",
//                 Order: 1

//             },
//             {
//                 class_name: "2",
//                 Order: 2

//             },
//             {
//                 class_name: "3",
//                 Order: 3

//             },
//         ]
//     );
//     const [handleModelData, setHandleModelData] = useState({});

//     const [modalData, setModalData] = useState({});
//     const handleChange = (e, type, limit = 9999999999999) => {
//         const { name, value } = e.target
//         if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

//         } else {
//             setValues((prev) => ({ ...prev, [name]: value }));
//         }
//     };
//     const getData = async () => {

//         try {
//             const response = await GetAllBranches();

//             if (response?.success) {
//                 setTableData(response?.data)
//             } else {
//                 notify(response?.message, "error");
//                 setTableData([])
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };

//     useEffect(() => {
//         // getData()
//     }, [])

//     const setIsOpen = () => {
//         setHandleModelData((val) => ({ ...val, isOpen: false }));
//     };

//     const handleSave = async () => {

//         const Payload =
//        {
//   "organisationId": "string",
//   "name": "string",
//   "address": {
//     "street": "string",
//     "city": "string",
//     "state": "string",
//     "zipCode": "string",
//     "country": "string"
//   },
//   "contact": {
//     "phoneNumber": "string",
//     "email": "string",
//     "faxNumber": "string"
//   },
//   "location": {
//     "latitude": "string",
//     "longitude": "string"
//   },
//   "ownerName": "string",
//   "ownerContact": {
//     "phoneNumber": "string",
//     "email": "string",
//     "faxNumber": "string"
//   },
//   "certification": "string",
//   "establishedYear": 0
// }


 

//         try {
//             const Response = await CreateBranch(Payload);
//             if (Response?.success) {
//                 notify(Response?.message, "success");
//                 setValues(initialData)
//                 handleBindQuestions();
//             } else {
//                 notify(Response?.message, "error");
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };
//     const handleCapitalLatter = (e) => {

//         let event = { ...e }
//         event.target.value = event.target.value.toUpperCase()
//         handleChange(e)

//     }
//      const handleSelect = (name, value) => {
//         setValues((prev) => ({ ...prev, [name]: value }));
//     };
//     return (
//         <>
//             {handleModelData?.isOpen && (
//                 <Modal
//                     visible={handleModelData?.isOpen}
//                     setVisible={setIsOpen}
//                     modalWidth={handleModelData?.width}
//                     Header={t(handleModelData?.label)}
//                     buttonType={"button"}
//                     buttons={handleModelData?.extrabutton}
//                     buttonName={handleModelData?.buttonName}
//                     modalData={modalData}
//                     setModalData={setModalData}
//                     footer={handleModelData?.footer}
//                     handleAPI={handleModelData?.handleInsertAPI}
//                 >
//                     {handleModelData?.Component}
//                 </Modal>
//             )}

//             <div className="card p-1">
//                 <Heading title={t("Branch Master")} isBreadcrumb={false} />

//                 <div className="row p-2">
//                     <Input
//                         type="text"
//                         className="form-control required-fields"
//                         id="subjectName"
//                         name="subjectName"
//                         value={values?.subjectName ? values?.subjectName : ""}
//                         // onChange={handleChange}
//                         lable={t("Subject Name")}
//                         placeholder=" "
//                         respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                         isUpperCase={true}
//                         onChange={(e) => handleChange(e)}
//                     />
//                     <Input
//                         type="number"
//                         className="form-control required-fields"
//                         id="subjectCode"
//                         name="subjectCode"
//                         value={values?.subjectCode ? values?.subjectCode : ""}
//                         // onChange={handleChange}
//                         lable={t("Subject Code")}
//                         placeholder=" "
//                         respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                         isUpperCase={true}
//                         onChange={(e) => handleChange(e)}
//                     />
                     

//                     <div className="col-12 text-right">
//                         <button
//                             onClick={handleSave}
//                             className="btn btn-sm btn-primary"
//                             type="button"
//                         >
//                             {t("Class Add")}
//                         </button>
//                     </div>
//                 </div>



//                 <Tables
//                     thead={[{ name: "Roles", }, { name: "Order" }, { name: "Action" }]}
//                     tbody={tableData?.map((item, index) => (
//                         {
//                             class_name: item.class_name,
//                             Order: item.Order,
//                             action: <>

//                                 <div
//                                     // className="d-flex align-items-center justify-content-center gap-2"
//                                     className="row gap-2"
//                                 >
//                                     <button
//                                         id="editBtn"
//                                         onclick="handleEdit(item.id)"
//                                         title="Edit"
//                                         className="d-flex align-items-center justify-content-center"
//                                     >
//                                         <i class=" bi-pencil-square"></i>
//                                     </button>

//                                     <button
//                                         id="deleteBtn"
//                                         onclick="handleDelete(item.id)"
//                                         title="Delete"
//                                     >
//                                         <i class="bi-trash3"></i>
//                                     </button>
//                                 </div>

//                             </>,
//                         }))}

//                 />
//             </div>
//         </>
//     );
// }

// export default Branch;
