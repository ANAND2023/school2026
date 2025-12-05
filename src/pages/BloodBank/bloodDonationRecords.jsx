import React, { useState } from 'react'
import Heading from '../../components/UI/Heading';
import Input from '../../components/formComponent/Input';
import { useTranslation } from 'react-i18next';
import { MRDPatientInfoApi } from '../../networkServices/MRDApi';
import DatePicker from '../../components/formComponent/DatePicker';
import ReactSelect from '../../components/formComponent/ReactSelect';
import { addBloodUnitApi, deleteBloodUnitApi, getPatientBloodUnits } from '../../networkServices/blooadbankApi';
import { notify } from '../../utils/ustil2';
import moment from 'moment';
import Tables from '../../components/UI/customTable';

const bloodDonationRecords = () => {
  const { t } = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [values, setValues] = useState({
    regNo: "",
    issueDate:new Date(),
  })
  const [patientRaw, setPatientRaw] = useState(null);
  const [Patient, setPatient] = useState(null);
  console.log("Patient",Patient)
  const ResIssu = [
    { label: "Reciept", value: "R" },
    { label: "Issue", value: "I" },
  ]
  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Patient Id"), width: "10%" },
    { name: t("Date"), width: "10%" },
    { name: t("Receipt"), width: "10%" },
    { name: t("Issue"), width: "10%" },
    { name: t("Balance"), width: "10%" },
    { name: t("Remark"), width: "10%" },
    { name: t("Action"), width: "10%" },
  ]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  };
  const handleReactChange = (name, e, setKey) => {
    setValues({ ...values, [name]: e?.[setKey] });
  };


  const handleSearchByRegNumber = async () => {
  
  
    try {
      const res = await MRDPatientInfoApi(values.regNo);
      if (res?.success) {
        setPatient(res?.data);
      } else {
        notify(res?.message, "error");

      }

    } catch (err) {
      notify(err?.message, "error");

    }
  };

  const handleSearchByRegNo = async () => {
    setPatientRaw(null);
    if (!values.regNo?.trim()) {
      notify("Please enter Registration No.", "warning");
      return;
    }
    handleSearchByRegNumber()
    try {
      const res = await getPatientBloodUnits(values.regNo);
      if (res?.success) {
        setPatientRaw(res?.data?.details);
      } else {
        setPatientRaw([])
        notify(res?.message, "error");
      }

    } catch (err) {
      notify(err?.message, "error");

    }
  };

  const handleSaveAPI = async () => {
    debugger
    if (!values?.regNo) {
      notify("Please Seach By Reg No", "warn")
    }
    const data = {
      patientId: values?.regNo,
      riDate: moment(values?.issueDate).format("YYYY-MM-DD"),
      noUnit: values?.unitNo,
      recIss: values?.issueType?.value ? values?.issueType?.value : values?.issueType,
      remark: values?.remarks
    }
    try {
      const res = await addBloodUnitApi(data)
      if (res?.success) {
        handleSearchByRegNo()
      } else {

      }

    } catch (error) {
      notify(error?.message, "error")
    }
  }

  const handleDelete = async (id) => {
    const data = {
      id: id
    }
    debugger
    const resp =await deleteBloodUnitApi(data)
    if (resp?.success) {
      notify(resp?.message, "success")
      handleSearchByRegNo()
    } else {

      notify(resp?.message, "warn")
    }
  }

  return (
    <div className='card'>
      <Heading isBreadcrumb={true} />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control"
          id="regNo"
          lable={"Reg. No"}
          placeholder=" "
          value={values.regNo}
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          name="regNo"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchByRegNo();
            }
          }}
          onChange={handleChange}
        />
        <div 
        // className="col-xl-2 col-md-4 col-sm-6 col-12"
        >
          <button className="btn btn-sm btn-primary me-2" onClick={handleSearchByRegNo}>
            {t("Search")}
          </button>
        </div>

         {/* <div> */}
           {
            Patient && <>
             
             

              <Input
                type="text"
                id="patientName"
                lable={"Patient Name"}
                className={"form-control"}
                readOnly={true}
                value={Patient?.PName}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="patientName"
                onChange={handleChange}
              />
               <Input
                type="text"
                id="dobOrAge"
                className={"form-control"}
                readOnly={true}

                lable={"Date Of Birth / Age"}
                value={Patient?.age}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="dobOrAge"
                onChange={handleChange}
              />
            </>
           }
            
      {/* </div> */}
      </div>
      {console.log(patientRaw)}
      {patientRaw && (
        <>
          <Heading isBreadcrumb={false} title={"Add Blood Unit"} />
          <div className="row p-2">
           
             
            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={"Issue Date"}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="issueDate"
              id="issueDate"
              value={values.issueDate}
              handleChange={handleChange}
            />

            <Input
              type="number"
              id="UnitNo"
              lable={"unitNo"}
              className={"form-control"}
              value={values?.unitNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="unitNo"
              onChange={handleChange}
            />
            <ReactSelect
              placeholderName={t("issue Type")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"issueType"}
              name={"issueType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={ResIssu}
              value={values?.issueType}
            />
            <Input
              type="text"
              id="Remark"
              lable={"remarks"}
              className={"form-control"}
              value={values?.remarks}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="remarks"
              onChange={handleChange}
            />
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveAPI}
              >
                {t("Save")}
              </button>
            </div>
          </div>

          <Heading isBreadcrumb={false} title={"Blood Unit List"} />
          <Tables
            thead={THEAD}
            tbody={patientRaw?.map((list, index) => ({
              sno: index + 1,
              patientId: list?.patientId,
              Date: list?.sDate ? moment(list?.sDate).format("DD-MMM-YYYY") : "",
              receipt: list?.recUnit,
              issueUnit: list?.issUnit,
              balance: list?.balance===0?"0":list?.balance,
              remark: list?.remark,
              action: (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    handleDelete(list?.id);
                  }}
                >
                  <i className='fas fa-trash'></i>
                </button>
              )
            }))}
            tableHeight={"scrollView"}
          />
        </>

      )}

    </div>
  )
}

export default bloodDonationRecords