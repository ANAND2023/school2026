import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../UI/Heading";
import DatePicker from "../../formComponent/DatePicker";
import Tables from "../../UI/customTable";
import { notify } from "../../../utils/utils";
import Modal from "../../modalComponent/Modal";
import { AdmissionBulkcreate, getRegistrationlist } from "../../../networkServices/School/RegistrationApi";
import StudentRegistration from "./StudentRegistration";
import Input from "../../formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
import StudentProfile from "../../Student/StudentProfile";
import { exportToExcel } from "../../../utils/exportLibrary";
import RegToAdmission from "./RegToAdmission";
import BulkRegistration from "./BulkRegistration";
function AllRegistration() {
 const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;

 
  const initialData = {
    StudentID: null,
    firstName: null,
    Contact: null,
    fatherName: null,
    enquirerName: null,
    mobileNumber: null,
    alternateMobileNumber: null,
    previousSchoolName: null,
    previousClass: null,
    desiredClass: null,
    previousPercentage: null,
    isInterested: true,
    fromDate: null,
    toDate: null,

  }
  const [values, setValues] = useState(initialData);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }));

  };
  const selectedRows = tableData.filter(item => item.isChecked);
  useEffect(() => {
    const selectedRows = tableData.filter(item => item.isChecked);
  }, [tableData]);
  const handleSearch = async () => {
    const payload =

    {
      "studentMasterId": null,
      "studentId": values.StudentID ?? null,
      "firstName": values.firstName ?? null,
      "mobile": values.Contact ?? null,
      "email": null,
      "fromDate": values.fromDate ? moment(values.fromDate).format("YYYY-MM-DD") : null,
      "toDate": values.toDate ? moment(values.toDate).format("YYYY-MM-DD") : null
    }


    try {
      const response = await getRegistrationlist(payload);
      if (response?.success) {
        setTableData(response?.data);
        notify(response?.message, "success")
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const handleChangeModel = (data) => {

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
        <StudentRegistration handleChangeModel={handleChangeModel} />
      ),
      extrabutton: <></>,
      footer: <></>
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

  const handleRowCheck = (index) => {
    const updated = [...tableData];
    updated[index].isChecked = !updated[index].isChecked;
    setTableData(updated);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setTableData(
      tableData.map(item => ({
        ...item,
        isChecked: checked
      }))
    );
  };
  const thead = [
    { name: t("SNo"), width: "1%" },
    {
      name: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            tableData.length > 0 &&
            tableData.every(item => item.isChecked)
          }
        />
      ),
      width: "1%"
    },
    { name: t("Student ID") },
    { name: t("name") },
    { name: t("gender") },
    { name: t("dob") },
    { name: t("class") },
    { name: t("mobile") },
    { name: t("parents") },
    { name: t("Action") },

  ];

  useEffect(() => {
    handleSearch()
  }, [])
  const getRowClass = (row) => {
    console.log("row data =>", row);

    if (row?.status === "0") {
      return "color-indicator-24-bg";
    }
    else if (row?.status === "1") {
      return "color-indicator-2-bg";
    }
    else {
      return "color-indicator-4-bg";
    }
  };

  const handleOpenStudentProfile = (data) => {
    setModalData(data);
    setHandleModelData({
      isOpen: true,
      width: "80vw",
      label: t("Student Profile"),
      Component: <StudentProfile modalData={data} setModalData={setModalData} />,
      extrabutton: <></>,
      footer: <></>
    });
  }

  const handleExcel = (data) => {

    const excelData = data.map((item, index) => {
      const father = item.parents?.find(p => p.parentType === 1);
      const mother = item.parents?.find(p => p.parentType === 2);
      const academic = item.academics?.[0];

      return {
        "S.No": index + 1,
        "Student ID": item.studentId,
        "Full Name": item.fullName,
        "Gender": item.gender === "1" ? "Male" : "Female",
        "DOB": item.dateOfBirth?.split("T")[0],
        "Phone": item.phone,
        "Email": item.email,

        "Village": item.village,
        "City": item.city,
        "District": item.district,
        "State": item.state,
        "Pincode": item.pincode,

        "Blood Group": item.bloodGroup,
        "Category": item.category,
        "Religion": item.religion,
        "Nationality": item.nationality,

        // 👨 Father
        "Father Name": father?.name || "",
        "Father Mobile": father?.mobile || "",
        "Father Occupation": father?.occupation || "",

        // 👩 Mother
        "Mother Name": mother?.name || "",
        "Mother Mobile": mother?.mobile || "",
        "Mother Occupation": mother?.occupation || "",

        // 🎓 Academic
        "Class": academic?.class || "",
        "Roll No": academic?.rollNumber || "",
        "Board": academic?.boardName || "",
        "Medium": academic?.medium || "",
        "School Name": academic?.schoolName || "",
        "Passing Year": academic?.yearOfPassing || "",
        "Percentage": academic?.percentage || ""
      };
    });
    exportToExcel(excelData, `Registration_${moment(values?.fromDate).format("MM-DD-YYYY")}_${moment(values?.toDate).format("MM-DD-YYYY")}`);
  }

  const handleApproveAdmission = async (val) => {
    if(!val?.class_Name?.value ){
      notify("Please select class", "error")
      return
    } 
    if(!val?.Section?.value){
      notify("Please select section", "error")
      return
    }
    const selectedRows = tableData.filter(item => item.isChecked);
    try {
      const payload = selectedRows?.map((item) => ({
        "studentMasterId": item?.id,
        "admissionDate": moment(val?.Date).format("YYYY-MM-DD"),
        "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "branchId": localData?.defaultCentre,
        "orgId": localData?.OrganizationId,
        "classId": val?.class_Name?.value,
        "sectionId": val?.Section?.value
      }))
      const response = await AdmissionBulkcreate(payload)
      if (response?.success) {
        notify(response?.message, "success")
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }


  }

  const handleAdmission = async () => {

    
    setHandleModelData({
      label: t("Approve Admission"),
      buttonName: t("Save"),
      width: "40vw",
      isOpen: true,
      Component: <RegToAdmission modalData={"data"} handleChangeModel={handleChangeModel} />,
      handleInsertAPI: handleApproveAdmission,
      extrabutton: <></>,
    })
  };
  const handleReg = async () => {
    setModalData("data");
    setHandleModelData({
      isOpen: true,
      width: "30vw",
      label: t("Registration To Admission"),
      Component: <BulkRegistration modalData={"data"} setModalData={setModalData} />,
      extrabutton: <></>,
      footer: <></>
    });

  };
  const today = new Date().toISOString().split("T")[0];

  const todayReg = tableData?.filter(
    (ele) => ele.createdOn?.startsWith(today)
  );

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
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Student Detail for Registration")} isBreadcrumb={false}

          secondTitle={<div className="col-12 text-right">
            <span className="mr-1"
              style={{ fontFamily: "serif", color: "Highlight" }}
            >No Of Reg : {tableData?.length}</span>
            <button
              onClick={handleReg}
              className="btn btn-sm btn-primary mx-2"
              type="button"
            >
              {t("Bulk Registration")}
            </button>
            <button
              onClick={handleOpen}
              className="btn btn-sm btn-primary "
              type="button"
            >
              {t("Registration")}
            </button>
          </div>}
        />
        <div className="row  p-2">
          <Input
            className="form-control"
            name="StudentID"
            lable="Student ID"
            value={values.StudentID}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            className="form-control"
            name="firstName"
            lable="First Name"
            value={values.firstName}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            className="form-control"
            name="Contact"
            lable="Contact"
            value={values.Contact}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            id="fromDate"
            name="fromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("From Date")}
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
            lable={t("To Date")}
            className="custom-calendar"
            value={values?.toDate}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <button
              onClick={handleSearch}
              className="btn btn-sm btn-primary"
              type="button"
            >
              {t("Search")}
            </button>
          </div>
          <button
            onClick={handleAdmission}
            className="btn btn-sm btn-primary ml-1"
            type="button"
            disabled={selectedRows.length === 0}
          >
            {t("Admission")}
          </button>

        </div>
        <Heading title="Student Reg Details" isBreadcrumb={false} secondTitle={
          <>
            <span
              className="mr-3"
              style={{
                fontFamily: "serif",
                color: "#2ecc71", // green
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Today No Of Reg. : {todayReg?.length}
            </span>

            <span
              className="mr-1"
              style={{
                fontFamily: "serif",
                color: "#3498db", // blue
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Total No Of Reg. : {tableData?.length}
            </span>

            <button
              id="excelBtn"
              onClick={() => handleExcel(tableData)}
              title="Excel Download"
              className="d-flex align-items-center justify-content-center"
            >

              <i className="fa fa-file-excel  text-lg "
                style={{ cursor: "pointer" }}
              ></i>
            </button>
            <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
            <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />
          </>
        } />
        {tableData?.length > 0 && <>
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => ({
              SrNo: index + 1,
              checked: (
                <input
                  type="checkbox"
                  checked={ele.isChecked}
                  onChange={() => handleRowCheck(index)}
                />
              ),
              studentId: `${ele?.studentId} `,
              name: `${ele?.fullName} `,
              gender: ele?.gender,
              dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
              class: ele?.academics[0]?.class,
              mobile: `${ele?.phone},${ele?.alternatePhone} `,
              parents: ele?.parents?.map(p => (`${p?.name},`)),
              action: <div
                className="d-flex align-items-center justify-content-center gap-2">

                <button
                  id="viewBtn"
                  onClick={() => handleOpenStudentProfile(ele)}
                  title="View"
                  className="d-flex align-items-center justify-content-center">
                  <i class="fa fa-eye"></i>
                </button>
                <button
                  id="editBtn"
                  onclick="handleEdit(item.id)"
                  title="Edit"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i class=" bi-pencil-square"></i>
                </button>

                <button
                  id="deleteBtn"
                  onclick="handleDelete(item.id)"
                  title="Delete"
                >
                  <i class="bi-trash3"></i>
                </button>
              </div>
            }))}
           style={{maxHeight:"60vh"}}
            getRowClass={getRowClass}
          />

        </>}
      </div>
    </>
  );
}

export default AllRegistration;