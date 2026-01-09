import React, { useState } from "react";
import SaveButton from "../../UI/SaveButton";
import { notify } from "../../../utils/utils";
import axios from "axios";
import { Registrationbulkcreate } from "../../../networkServices/School/RegistrationApi";

export default function BulkRegistration() {
  const [file, setFile] = useState(null);

  const handleDocumentChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      notify("Only Excel files (.xls, .xlsx) are allowed", "warning");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      notify("File size must be under 5MB", "warning");
      return;
    }

    setFile(selectedFile);
  };

  const handleAttachment = async () => {
    if (!file) {
      notify("Please select an Excel file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name); // file param like curl

    try {
    //   const response = Registrationbulkcreate(formData)
      
      
     const response = await axios.post(
        "http://175.176.185.254:2005/gateway/student/api/v1/Registration/bulkcreate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // same as curl
            accept: "*/*",
          },
        }
      );
debugger
      if (response?.data?.success) {
        notify(response?.data?.message, "success");
        notify(`total:${response?.data?.data?.total}-success:${response?.data?.data?.success} failed:${response?.data?.data?.failed}`, "success");
      } else {
        notify("Upload failed", "error");
      }
    } catch (error) {
      notify("Server error while uploading file", "error");
      console.error(error);
    }
  };

  return (
    <>
      <input
        type="file"
        id="document"
        accept=".xls,.xlsx"
        onChange={handleDocumentChange}
      />

      <div className="ftr_btn mb-4">
        <SaveButton btnName="Upload Excel" onClick={handleAttachment} />
      </div>
    </>
  );
}




// import React, {  useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import Heading from "../../UI/Heading";
// import Input from "../../formComponent/Input";
// import ReactSelect from "../../formComponent/ReactSelect";
// import Tables from "../../UI/customTable";
// import { notify } from "../../../utils/utils";
// import Modal from "../../modalComponent/Modal";
// import { GetAllSubjects,CreateSubject } from "../../../networkServices/AcademicYear";

// function BulkRegistration() {
//     const [t] = useTranslation(); const initialData = {
//         subjectCode: "",
//         subjectName: "",
//         isPractical: { label: "Yes", value: "true" },

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
//             const response = await GetAllSubjects();
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
//         {
//             "subjectName": "string",
//             "subjectCode": "string",
//             "isPractical": true
//         }


//         // {
//         //     "className": values?.class_name ?? "",
//         //     "classOrder": Number(values?.Order ?? 0)
//         // }

//         try {
//             const Response = await CreateSubject(Payload);
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
//     const handleSelect = (name, value) => {
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
//                 <Heading title={t("Subject Master")} isBreadcrumb={false} />

//                 <div className="row p-2">
//                     <Input
//                         type="file"
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

// export default BulkRegistration;
