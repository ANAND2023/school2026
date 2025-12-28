import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/formComponent/DatePicker";
import Tables from "../../components/UI/customTable";

import Modal from "../../components/modalComponent/Modal";

import moment from "moment";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";
import RegistrationForm from "./RegistrationForm";
import { EnquiryCreateenquiry } from "../../networkServices/School/RegistrationApi";
import { notify } from "../../utils/utils";

function Registration() {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([
    {
      name: "Aarav Sharma",
      gender: "Male",
      dob: "2014-03-12",
      class: "5",
      mobile: "9876543210",
      address: "Lucknow, Uttar Pradesh"
    },


  ]
  );
  const { VITE_DATE_FORMAT } = import.meta.env;


  const initialData = {
    studentName: "",
    fatherName: "",
    enquirerName: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    previousSchoolName: "",
    previousClass: "",
    desiredClass: "",
    previousPercentage: "",
    isInterested: true,
    fromDate: new Date(),
    toDate: new Date(),

  }
  const [values, setValues] = useState(initialData);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e, type, limit = 9999999999999) => {
    debugger
    const { name, value } = e.target
    console.log("first", limit, Number(value), isNaN(Number(value)))

    if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSave = async (data) => {
    debugger
    const payload = {

      studentName: data.studentName,
      fatherName: data.fatherName,
      enquirerName: data.enquirerName,
      mobileNumber: data.mobileNumber,
      alternateMobileNumber: data.alternateMobileNumber,
      previousSchoolName: data.previousSchoolName,
      previousClass: data.previousClass,
      desiredClass: data.desiredClass,
      previousPercentage: data.previousPercentage,
      isInterested: values.isInterested
    }
    try {
      const response = await EnquiryCreateenquiry(payload);
      if (response?.success) {
        notify(response?.message, "success")
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const handleSearch = async () => {
    const payload = {
      startDate: moment(values.fromDate).format("YYYY-MM-DD"),
      endDate: moment(values.toDate).format("YYYY-MM-DD")
    }
    try {
      const response = await GetEnquiriesByRange(payload);
      if (response?.success) {
        notify(response?.message, "success")
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
//   const handleOpen = () => {
//   setValues(initialData); // reset
//   setHandleModelData(prev => ({
//     ...prev,
//     isOpen: true,
//   }));
// };

const handleChangeModel = (data) => {
    
    console.log("handleChangeRejectModeldata",data)
    
    setModalData(data);
  };
  const handleOpen = () => {
    setHandleModelData({
      label: t("Registration From"),
      buttonName: t("Save"),
      width: "80vw",
      isOpen: true,
      // modalData: data,
      Component: (
        <RegistrationForm handleChangeModel={handleChangeModel}/>
      ),
      handleInsertAPI: handleSave,
      extrabutton: <></>,
    });
  }

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  const handleCapitalLatter = (e) => {
    let event = { ...e }
    event.target.value = event.target.value.toUpperCase()
    handleChange(e)

  }
  const thead = [
    { name: t("SNo"), width: "1%" },
    { name: t("select"), width: "1%" },
    { name: t("name") },
    { name: t("gender") },
    { name: t("dob") },
    { name: t("class") },
    { name: t("mobile") },
    { name: t("address") },

  ];

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
           {/* <RegistrationForm  values={values} setValues={setValues}  /> */}
   
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Student Detail for Registration")} isBreadcrumb={false}

          secondTitle={<div className="col-12 text-right">
            <button
              onClick={handleOpen}
              // className="btn btn-lg btn-success"
              className="btn btn-sm btn-primary"
              type="button"
            >
              {t("Registration")}
            </button>
          </div>}
        />
        <div className="row  p-2">
          <DatePicker
            id="fromDate"
            name="fromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Reg. Date")}
            className="custom-calendar"
            value={values?.fromDate}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />
          <DatePicker
            id="toDate"
            name="toDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Reg. Date")}
            className="custom-calendar"
            value={values?.toDate}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
<button
            onClick={handleSearch}
            // className="btn btn-lg btn-success"
            className="btn btn-sm btn-primary"
            type="button"
          >
            {t("Search")}
          </button>
          </div>
          
        </div>
        <Heading title={t("Parent Details")} isBreadcrumb={false} />
        {tableData?.length > 0 && <>
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => ({
              SrNo: index + 1,
              checked: <input type="checkbox" name="isChecked" checked={ele?.isChecked} onChange={handleChange} />,
              name: ele?.name,

              gender: ele?.gender,
              dob: ele?.dob,
              class: ele?.class,
              mobile: ele?.mobile,
              address: ele?.address,

            }))}

          />

        </>}
      </div>
    </>
  );
}

export default Registration;