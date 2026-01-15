import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
// import { EnquiryCreateenquiry } from "../../networkServices/School/RegistrationApi";
import Heading from "../../UI/Heading";
import DatePicker from "../../formComponent/DatePicker";
import Tables from "../../UI/customTable";
import { notify } from "../../../utils/utils";
import Modal from "../../modalComponent/Modal";
import { getadmissionlist, getRegistrationlist } from "../../../networkServices/School/RegistrationApi";

import Input from "../../formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
import StudentProfile from "../../Student/StudentProfile";
import { exportToExcel } from "../../../utils/exportLibrary";

function Admission() {
    const localData = useLocalStorage("userData", "get");
    console.log("localData",localData)
    const [t] = useTranslation();
    const [tableData, setTableData] = useState([]);
    const { VITE_DATE_FORMAT } = import.meta.env;


    const initialData = {
        StudentID: "",
        firstName: "",
        Contact: "",
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
        
        const { name, value } = e.target
        console.log("first", limit, Number(value), isNaN(Number(value)))

        if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

        } else {
            setValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSearch = async () => {
        const payload =
        // {
        //     "studentMasterId": null,
        //     "studentId": values.StudentID,
        //     "firstName": values.firstName,
        //     "mobile": values.Contact,
        //     "email": "",
        //     "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
        //     "toDate": moment(values.toDate).format("YYYY-MM-DD")
        // }

        {
  "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "branchId": localData?.defaultCentre,
//   "classId": "",
//   "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "branchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "classId": "cb0115fb-6dfa-4590-8c77-bffcd28e153f",
  "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
  "toDate":  moment(values.toDate).format("YYYY-MM-DD"),
  "studentId": values.StudentID,
  "admissionNo": "",
  "rollNumber": "",
  "firstName": values.firstName,
  "page": 100,
  "pageSize": 100
}


        try {
            const response = await getadmissionlist(payload);
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
    //   const handleOpen = () => {
    //   setValues(initialData); // reset
    //   setHandleModelData(prev => ({
    //     ...prev,
    //     isOpen: true,
    //   }));
    // };

    const handleChangeModel = (data) => {

        console.log("handleChangeRejectModeldata", data)

        setModalData(data);
    };
    const handleOpen = () => {
        setHandleModelData({
            label: t("Registration From"),
            buttonName: t("Save"),
            width: "80vw",
            isOpen: true,
            // modalData: data,
            Component: (""
                // <StudentRegistration handleChangeModel={handleChangeModel} />
            ),
            //   handleInsertAPI: handleSave,
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
    const thead = [
        { name: t("SNo"), width: "1%" },
        { name: t("#"), width: "1%" },
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
    // const handleExcel=(val)=>{
    //   exportToExcel(val, "Exel");
    // }
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
        exportToExcel(excelData, "Exel");
    }
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
                <Heading title={t("Admission Detail")} isBreadcrumb={false}

                    secondTitle={<div className="col-12 text-right">
                        {/* <button
                            onClick={handleOpen}
                            // className="btn btn-lg btn-success"
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Registration")}
                        </button> */}
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
                            // className="btn btn-lg btn-success"
                            className="btn btn-sm btn-primary"
                            type="button"
                        >
                            {t("Search")}
                        </button>
                    </div>

                </div>
                {/* <Heading title={t(" Details")} isBreadcrumb={false} /> */}
                <Heading title="Admission Detail" isBreadcrumb={false} secondTitle={
                    <>
                        <i
                            className="fa fa-file-excel text-success text-lg mr-2"
                            onClick={() => handleExcel(tableData)}
                            style={{ cursor: "pointer" }}
                        ></i>
                        <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Admission Done")} />
                        <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Registration")} />


                    </>
                } />
                {tableData?.length > 0 && <>
                    <Tables
                        thead={thead}
                        tbody={tableData?.map((ele, index) => ({
                            SrNo: index + 1,
                            checked: <input type="checkbox" name="isChecked" checked={ele?.isChecked} onChange={handleChange} />,
                            studentId: `${ele?.studentId} `,
                            name: `${ele?.fullName} `,

                            gender: ele?.gender,
                            dateOfBirth: moment(ele?.dateOfBirth).format("DD-MM-YYYY"),
                            class: ele?.academics[0]?.class,
                            mobile: `${ele?.phone},${ele?.alternatePhone} `,
                            parents: ele?.parents?.map(p => (`${p?.name},`)),
                            action: <i className="fa fa-eye" onClick={() => handleOpenStudentProfile(ele)}></i>
                        }))}
                        getRowClass={getRowClass}
                    />

                </>}
            </div>
        </>
    );
}

export default Admission;