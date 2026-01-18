import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Heading from "../../UI/Heading";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";

import MultiSelectComp from "../../formComponent/MultiSelectComp";

import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
import {
  GetAllClasses,
} from "../../../networkServices/AcademicYear";

import {
  GetAllItemMaster,
  GetAllMonthType,
  GetClassMonthFeeDetails,
  UpdateBulkItemClassMonthWise,
} from "../../../networkServices/FeeMaster";
import Tables from "../../UI/customTable";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

function ClassWiseItemRateMapping() {
  const [t] = useTranslation();

  const initialData = {
    class_Name: { label: "", value: "" },
    Month: { label: "", value: "" },
    item: [],
  };
  const localData = useLocalStorage("userData", "get");
  const [values, setValues] = useState(initialData);
  const [classes, setClasses] = useState([]);
  const [allItem, setAllItem] = useState([]);
  const [allMonth, setAllMonth] = useState([]);
  const [tableData, setTableData] = useState([]);

  // 👇 table + rate data
  const [itemRates, setItemRates] = useState([]);

  /* ---------------- GET MASTER DATA ---------------- */

  const getClass = async () => {
    try {
      const res = await GetAllClasses();
      if (res?.success) setClasses(res?.data);
      else notify(res?.message, "error");
    } catch {
      notify("Failed to load classes", "error");
    }
  };

  const getItems = async () => {
    try {
      const res = await GetAllItemMaster(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) setAllItem(res?.data);
    } catch {
      notify("Failed to load items", "error");
    }
  };

  const getMonths = async () => {
    try {
      const res = await GetAllMonthType(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) setAllMonth(res?.data);
    } catch {
      notify("Failed to load months", "error");
    }
  };
  const getData = async (classId,monthTypeId) => {
    debugger
    try {
      const res = await GetClassMonthFeeDetails(classId,monthTypeId);
      if(res?.success){
        setTableData(res?.data);
      }
    //   if (res?.success) setAllMonth(res?.data);
    } catch {
      notify("Failed to load months", "error");
    }
  };

  useEffect(() => {
    getClass();
    
    getMonths();

  }, []);

  useEffect(()=>{
    getItems();
  },[localData?.OrganizationId, localData?.defaultCentre])

  /* ---------------- HANDLERS ---------------- */

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 Multi select → table bind
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });

    const mapped = selectedOptions.map((item) => ({
      itemId: item.code,
      itemName: item.name,
      rate: 0,
    }));

    setItemRates(mapped);
  };

  // 🔥 Rate change per row
  const handleRateChange = (index, value) => {
    const updated = [...itemRates];
    updated[index].rate = value;
    setItemRates(updated);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!values?.class_Name?.value || !values?.Month?.value) {
      notify("Class and Month are required", "error");
      return;
    }

    if (itemRates.length === 0) {
      notify("Please select at least one item", "error");
      return;
    }

    const payload = {
      classId: values.class_Name.value,
      monthTypeMasterId: values.Month.value,
      items: itemRates.map((item) => ({
        itemId: item.itemId,
        rate: Number(item.rate),
      })),
    };

    try {
      const res = await UpdateBulkItemClassMonthWise(payload);
      if (res?.success) {
        notify(res?.message, "success");
        setValues(initialData);
        setItemRates([]);
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error while saving data", "error");
    }
  };

  useEffect(() => {
    getData(values?.class_Name?.value,values?.Month?.value)
  },[values?.class_Name?.value,values?.Month?.value])
  /* ---------------- UI ---------------- */

  return (
    <div className="card p-1">
      <Heading title={t("Rate Schedule By Class")} isBreadcrumb={false} />

      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Class")}
          searchable
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="class_Name"
          dynamicOptions={handleReactSelectDropDownOptions(
            classes,
            "className",
            "id"
          )}
          handleChange={handleSelect}
          value={values?.class_Name?.value}
        />

        <ReactSelect
          placeholderName={t("Month")}
          searchable
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="Month"
          dynamicOptions={handleReactSelectDropDownOptions(
            allMonth,
            "name",
            "id"
          )}
          handleChange={handleSelect}
          value={values?.Month?.value}
        />

        <MultiSelectComp
          respclass="col-xl-4 col-md-6 col-sm-12 col-12"
          name="item"
          placeholderName={t("Items")}
          dynamicOptions={allItem.map((ele) => ({
            name: ele?.name,
            code: ele?.id,
          }))}
          handleChange={handleMultiSelectChange}
          value={values?.item}
        />

        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <button
            onClick={handleSave}
            className="btn btn-sm btn-primary"
            type="button"
          >
            {t("Save")}
          </button>
        </div>
      </div>


      <Tables
        thead={[
          { name: "Item Name" },
          { name: "Rate" },
        ]}
        tbody={itemRates.map((item, index) => ({
          itemName: item.itemName,
          rate: (
            <input
              type="number"
              className="form-control form-control-sm"
              value={item.rate}
              onChange={(e) =>
                handleRateChange(index, e.target.value)
              }
            />
          ),
        }))}
      />
        <Tables
        thead={[
          { name: "Item Name" },
          { name: "unit" },
          
          { name: "rate" },
          { name: "subCategory" },
          { name: "isMapped" },
        ]}
        tbody={tableData.map((item, index) => ({
          itemName: item.itemName,
          unit: item.unit,
          rate: item.rate,
          subCategoryId: item.subCategoryId,
          isMapped: item.isMapped===false ? "No" : "Yes",
         
        }))}
      />
    </div>
  );
}

export default ClassWiseItemRateMapping;





// import React, { act, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// import Heading from "../../UI/Heading";
// import Input from "../../formComponent/Input";
// import ReactSelect from "../../formComponent/ReactSelect";
// import Modal from "../../modalComponent/Modal";
// import { notify, handleReactSelectDropDownOptions } from "../../../utils/utils";
// import { GetAllClasses, CreateSection, GetAllSections } from "../../../networkServices/AcademicYear";
// import Tables from "../../UI/customTable";
// import { AllFeeRateSchedule, GetAllItemMaster, GetAllMonthType, InsertFeeRateSchedule, UpdateBulkItemClassMonthWise } from "../../../networkServices/FeeMaster";
// import MultiSelectComp from "../../formComponent/MultiSelectComp";

// function ClassWiseItemRateMapping() {
//     const [t] = useTranslation(); const initialData = {
//         item: [],
//         class_Name: { label: "", value: "" },
//         item_Name: { label: "Yes", value: "true" },
//         isCurrent: { label: "Yes", value: "true" },
//     }
//     const [values, setValues] = useState(initialData);
//     const [classes, setClasses] = useState([]);
//     const [allItem, setAllItem] = useState([]);
//     const [allMonth, setAllMonth] = useState([]);

//     const [tableData, setTableData] = useState(
//         []
//     );
//     const [handleModelData, setHandleModelData] = useState({});

//     const [modalData, setModalData] = useState({});
//     const handleChange = (e, type, limit = 9999999999999) => {
//         const { name, value } = e.target

//         setValues((prev) => ({ ...prev, [name]: value }));

//     };


//     const getClass = async () => {

//         try {
//             const response = await GetAllClasses();
//             if (response?.success) {
//                 setClasses(response?.data)
//             } else {
//                 notify(response?.message, "error");
              
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };


    

//     useEffect(() => {
       
//         getClass()
//     }, [])


//     const setIsOpen = () => {
//         setHandleModelData((val) => ({ ...val, isOpen: false }));
//     };

//     const handleSave = async () => {

//         const Payload =
//         {
//   "classId":values?.class_Name?.value,
//   "monthTypeMasterId": values?.Month?.value,
//   "items": [
//     {
//       "itemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "rate": 0
//     }
//   ]
// }

//         try {
//             const Response = await UpdateBulkItemClassMonthWise(Payload);
//             if (Response?.success) {
//                 notify(Response?.message, "success");
//                 setValues(initialData)
               
//             } else {
//                 notify(Response?.message, "error");
//             }
//         } catch (error) {
//             notify("Error saving reason", "error");
//         }
//     };
//     const AllItemMaster = async () => {
//         try {
//             const res = await GetAllItemMaster();
//             if (res?.success) {
//                 setAllItem(res?.data);
//             }
//         } catch {
//             notify("Failed to load categories", "error");
//         }
//     };
//     const handleCapitalLatter = (e) => {

//         let event = { ...e }
//         event.target.value = event.target.value.toUpperCase()
//         handleChange(e)

//     }
//       const handleMultiSelectChange = (name, selectedOptions) => {
//     setValues({ ...values, [name]: selectedOptions });
//   };

//     const handleSelect = (name, value) => {
//         setValues((prev) => ({ ...prev, [name]: value }));
//     };
//     const AllMonthType = async () => {
//             try {
//                 const res = await GetAllMonthType();
//                 if (res?.success) {
//                     setAllMonth(res?.data);
//                 }
//             } catch {
//                 notify("Failed to load categories", "error");
//             }
//         };
//     useEffect(() => {
//         AllItemMaster();
//         AllMonthType();
//     }, []);
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
//                 <Heading title={t("Rate Schedule By Class")} isBreadcrumb={false} />

//                 <div className="row p-2">

//                     <ReactSelect
//                         placeholderName={t("Class")}
//                         searchable={true}
//                         respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                         id="class_Name"
//                         name="class_Name"
//                         removeIsClearable={true}
//                         // dynamicOptions={classes}
//                         dynamicOptions={[...handleReactSelectDropDownOptions(classes, "className", "id")]}
//                         handleChange={handleSelect}
//                         value={values?.class_Name?.value}
//                     // requiredClassName="required-fields"
//                     />
//                     <ReactSelect
//                         placeholderName={t("Month")}
//                         searchable={true}
//                         respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                         id="Month"
//                         name="Month"
//                         removeIsClearable={true}
//                         // dynamicOptions={classes}
//                         dynamicOptions={[...handleReactSelectDropDownOptions(allMonth, "name", "id")]}
//                         handleChange={handleSelect}
//                         value={values?.Month?.value}
//                     // requiredClassName="required-fields"
//                     />
                    
//                     <MultiSelectComp
//             respclass="col-xl-3 col-md-4 col-sm-6 col-12"
//             name="item"
//             id="item"
//             placeholderName={t("item")}
//             // dynamicOptions={module}
//             dynamicOptions={allItem?.map((ele) => ({
//               name: ele?.name,
//               code: ele?.id
//             }))}
//             handleChange={handleMultiSelectChange}
//             value={values?.item}
//           />
                   
//                     <Input
//                         type="number"
//                         className="form-control"
//                         // className="form-control required-fields"
//                         id="rate"
//                         name="rate"
//                         value={values?.rate ? values?.rate : ""}
//                         // onChange={handleChange}
//                         lable={("Rate")}
//                         placeholder=" "
//                         respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//                         // isUpperCase={true}
//                         onChange={(e) => handleCapitalLatter(e)}
//                     />
                   
//                     <div className="col-xl-2 col-md-4 col-sm-4 col-12">

//                         <button
//                             onClick={handleSave}
//                             className="btn btn-sm btn-primary"
//                             type="button"
//                         >
//                             {t("Save")}
//                         </button>
//                     </div>
//                 </div>

//                 <Tables
//                     thead={[{ name: "Section", }, { name: "Class", }, { name: "Action" }]}
//                     tbody={tableData?.map((item, index) => (
//                         {
//                             sectionName: item.sectionName,
//                             classId: item.classId,

//                             action: <>
//                                 <div
//                                     className="d-flex align-items-center justify-content-center gap-2"
//                                 // className="row gap-2"
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

// export default ClassWiseItemRateMapping;
