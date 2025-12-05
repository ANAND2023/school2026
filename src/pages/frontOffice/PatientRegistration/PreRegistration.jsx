import React, { useEffect, useState } from 'react'
import Tables from '../../../components/UI/customTable'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next'
import { DoctorDisplayGetPreRegisteredUsers } from '../../../networkServices/registrationApi'
import moment from 'moment'
import { notify } from '../../../utils/ustil2'

const PreRegistration = ({ values, setValues, setModalHandlerState, setRelations, relations , setCheckbox }) => {

  const { t } = useTranslation()
  const { VITE_DATE_FORMAT } = import.meta.env;

  const THEAD = [
    { width: "0.2%", name: t("S No.") },
    { width: "0.2%", name: t("request Id.") },
    { width: "0.2%", name: t("patientId.") },
    { width: "1%", name: t("Patient Name") },
    { width: "1%", name: t("Gender") },
    { width: "1%", name: t("D.O.B") },
    { width: "1%", name: t("Mobile No") },
    { width: "1%", name: t("Emergency No") },
    { width: "1%", name: t("Email") },
    { width: "1%", name: t("Pincode") },
    { width: "1%", name: t("Religion") },
    // { width: "1%", name: t("Address") },
    // { width: "1%", name: t("Parmanent Address") },
    { width: "0.2%", name: t("Action") },

  ]
  const [searchData, setSearchData] = useState({
    requestId: "",
    patientName: "",
    mobileNo: "",
    fromDate: new Date(),
    toDate: (new Date()),
  });
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "mobileNo") {
      newValue = newValue.replace(/\D/g, "");
      newValue = newValue.slice(0, 10);
    }

    setSearchData((prev) => ({ ...prev, [name]: newValue }));


  };

  const HandleSearch = async () => {
    const payload = {
      requestId: searchData?.requestId,
      patientName: searchData?.patientName,
      mobileNo: searchData?.mobileNo,
      fromDate: moment(searchData?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(searchData?.toDate).format("YYYY-MM-DD"),
    }
    try {
      const response = await DoctorDisplayGetPreRegisteredUsers(payload);
      if (response?.success) {
        setTableData(response?.data);
      }
      else {
        notify(response?.message, "warn")
        setTableData([]);
      }

    } catch (error) {

    }
  }

  const loadPatient = async (patient, index) => {
    debugger

    const dob = new Date(patient?.dob);
    const today = new Date();
    const diffMs = today - dob;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const age = diffDays / 365.25;

    setValues(
      {
        "countryID": patient?.countryId,
        "StateID": patient?.stateId,
        "districtID": patient?.districtId,
        "cityID": patient?.cityId,
        "Country": patient?.countryName,
        "PinCode":patient?.pinCode,
        "IsInternational": "2",
        "ResidentialNumber_STDCODE": "+91",
        "Phone_STDCODE": "+91",
        "House_No": patient?.address,
        "parmanentAddress":patient?.permanentAddress,
        "Mobile": patient?.mobileNo,
        "Title": patient?.title,
        "Gender": patient?.gender,
        "PFirstName": patient?.firstName,
        "PLastName": patient?.lastName,
        "DOB": patient?.dob,
        "Email": patient?.emailId,
        "Phone": patient?.emergency,
        "requestId": patient?.requestId,
        "AgeType": "YRS",
        "Age": String(age.toFixed(1)),
        "MaritalStatus": { label: patient?.maritalStatus, value: patient?.maritalStatus },
        "Religion":{label: patient?.religion, value: patient?.religion },
        // "InternationalCountryID":{label: patient?.countryName, value: patient?.countryId }
      }
    )
    setCheckbox(patient?.isSame ? true: false)
    const relation = [
      {
        Relation: patient?.relationName,
        RelationName: patient?.relationOfName,
        RelationPhone: patient?.relationPhone,
        isPersonal: true,
      },
    ];

    setRelations(relation);
    setModalHandlerState({
      show: false,
      component: null,
      size: null,
    })
  }


  useEffect(() => {
    HandleSearch();
  }, [])

  console.log(searchData, "searchData")


  return (
    <div style={{ minHeight: "60vh" }}>
      <div className='card'>
        <Heading title={t("Search Pre Registered Patients")} isBreadcrumb={false} />
        <div className="row p-2">

          <Input
            type="text"
            className="form-control"
            id="requestId"
            lable={t("Request ID")}
            placeholder=" "
            value={searchData.requestId}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="requestId"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="patientName"
            lable={t("Patient Name")}
            placeholder=" "
            value={searchData.patientName}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="patientName"
            onChange={handleChange}
          />
          <Input
            type="number"
            className="form-control"
            id="mobileNo"
            lable={t("Mobile No.")}
            placeholder=" "
            value={searchData.mobileNo}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="mobileNo"
            onChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="From Data"
            name="fromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            value={searchData.fromDate}
            maxDate={new Date()}
            handleChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            value={searchData.toDate}
            maxDate={new Date()}
            handleChange={handleChange}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />

          <div className="col-xl-2 col-md-3 col-sm-6 col-12 gap-2">
            <button className="btn btn-sm btn-primary"
              onClick={HandleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      <div className='py-2'>
        {
          tableData?.length > 0 && <div className="">
            <Heading title={t("Patient's List")} isBreadcrumb={false} />

            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, ind) => ({
                sn: ind + 1,
                requestId: val?.requestId,
                patientId:val?.patientId,
                PatientName: val?.firstName + " " + val?.lastName,
                gender: val?.gender,
                dob: moment(val?.dob).format("DD-MM-YYYY"),
                mobileNo: val?.mobileNo,
                emergency: val?.emergency,
                emailId: val?.emailId,
                pincode: val?.pinCode,
                religion: val?.religion,
                // address: val?.address,
                // parAddress:val?.isSame ?'':val?.permanentAddress,
                action: (val?.patientId !== null ? "" : (
                  <span onClick={() => {
                    loadPatient(val, ind)
                  }} className='d-flex justify-content-center my-2'>
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                  </span>)
                ),
                colorcode:val?.patientId && "#90EE90"

              }))}
              scrollView="scrollView"
            />


          </div>
        }
      </div>

    </div>
  )
}

export default PreRegistration