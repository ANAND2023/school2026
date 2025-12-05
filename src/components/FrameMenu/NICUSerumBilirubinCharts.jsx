import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import {
  NursingWardBindGraphTemp,
  NursingWardSerumBilirubinSave,
  deletelSerumBilirubinApi
} from "../../networkServices/nursingWardAPI";
import {
  notify,
  NursingWardSerumBilirubinSavePayload,
  timeFormateDate,
} from "../../utils/utils";
import Tables from "../UI/customTable";
import moment from "moment";



const GESTATION_DROPDOWN = [
  {
    label: "30 Weeks",
    value: "30",
  },
  {
    label: "35 Weeks",
    value: "35",
  },
  {
    label: ">=38 Weeks",
    value: "38",
  },
];

const NICUSerumBilirubinCharts = ({ data }) => {
  const { transactionID, patientID } = data
  const initialValues = {
    id: 0,
    gestationType: "",
    // tid: "41",
    // pid: "AM24-05100001",
    tid: transactionID,
    pid: patientID,
    dob: new Date(),
    time: new Date(),
    timeOn: new Date(),
    dateOn: new Date(),
    babyBG: "",
    motherBG: "",
    directTest: "",
    PhotoTheraphy: "",
  };
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const thead = [
    { width: "1%", name: t("SNO") },
    t("Date ON"),
    t("Time ON"),
    t("Date OFF"),
    t("Time OFF"),
    t("Date OF Birth"),
    t("Time OF Birth"),
    t("Patient Id"),
    t("Gestation"),
    { width: "1%", name: t("Edit") },
  ]

  const [payload, setPayload] = useState({
    ...initialValues,
  });
  const [list, setList] = useState([])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e) => {
    setPayload({ ...payload, [name]: e?.value });
  };

  const handleNursingWardSerumBilirubinSave = async () => {
    try {
      const responsePayload = NursingWardSerumBilirubinSavePayload(payload);
      const response = await NursingWardSerumBilirubinSave(responsePayload);
      if (response?.success) {
        notify(response?.message, "success");
        // handleNursingWardBindGraphTemp("41");
        handleNursingWardBindGraphTemp(transactionID);
        setPayload({
          ...payload,
          id: 0,
          babyBG: "",
          motherBG: "",
          directTest: "",
          PhotoTheraphy: "",
        })
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardBindGraphTemp = async (transactionID) => {
    try {
      const response = await NursingWardBindGraphTemp(transactionID);
      if (response?.data?.length > 0) {
        setList(response?.data);
        // const data = response?.data[0];

        // const setResponse = {
        //   gestationType: String(data?.WeeksGestation),
        //   tid: payload?.tid,
        //   pid: payload?.pid,
        //   dob: new Date(data?.DateofBirth),
        //   time: parseTimeString(data?.TimeofBirth),
        //   babyBG: data?.BabyBloodGroup,
        //   motherBG: data?.MotherBloodGroup,
        //   directTest: data?.DirectTest,
        //   PhotoTheraphy: data?.PhotoTheraphy,
        // };

        // setPayload(setResponse);
      } else {
        setPayload({ ...initialValues });
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };
  const handleEdit = (row) => {
    setPayload({
      ...payload,
      id: row?.Id ? row?.Id : 0,
      dateOn: new Date(row?.DateOn),
      timeOn: timeFormateDate(row?.TimeOn),
      dateOff: new Date(row?.DateOff),
      timeOff: timeFormateDate(row?.TimeOff),
      gestationType: String(row?.WeeksGestation),
      dob: new Date(row?.DateofBirth),
      time: timeFormateDate(row?.TimeofBirth),
      babyBG: row?.BabyBloodGroup,
      motherBG: row?.MotherBloodGroup,
      directTest: row?.DirectTest,
      PhotoTheraphy: row?.PhotoTheraphy,
    })
  }
  const handleDelete = async (item) => {
    try {
      const payload = {
        Id: item?.Id
      }
      const response = await deletelSerumBilirubinApi(payload)
      if (response?.success) {
        notify(response?.message, "success")
        handleNursingWardBindGraphTemp(transactionID);
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {
      notify(error?.message, "error")
    }
  }
  const handleTableData = (tableData) => {
    return tableData?.map((item, index) => {
      return {
        SNO: index + 1,
        DateOn: moment(item?.DateOn).format("DD-MM-YYYY"),
        TimeOn: item?.TimeOn,
        DateOff: moment(item?.DateOff).format("DD-MM-YYYY"),
        TimeOff: item?.TimeOff,
        "Date OF Birth": moment(item?.DateofBirth).format("DD-MM-YYYY"),
        TimeofBirth: item?.TimeofBirth,
        patientID: patientID,
        Gestation: item?.WeeksGestation,
        Edit: (
          <>
            <i className="fa fa-edit p-1" onClick={() => handleEdit(item)} />
            <span
              className="mx-1"
              onClick={() =>
                handleDelete(item)
              }
            >
              <i className="fa fa-trash text-danger"></i>
            </span>
          </>
        ),
      }
    })
  }
  useEffect(() => {
    handleNursingWardBindGraphTemp(transactionID);
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Baby Details")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          {/* <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'> */}
          <DatePicker
            className={`custom-calendar `}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="dateOn"
            name="dateOn"
            inputClassName={"required-fields"}
            value={payload?.dateOn ? payload?.dateOn : ""}
            handleChange={handleChange}
            lable={t("DateON")}
            minDate={new Date()}
            placeholder={VITE_DATE_FORMAT}
          />
          <TimePicker
            placeholderName={t("TimeON")}
            lable={t("TimeON")}
            id="timeOn"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className="required-fields"
            name="timeOn"
            value={payload?.timeOn ? payload?.timeOn : ""}
            handleChange={handleChange}
          // disable={values?.isOxygenData ? true : false}
          />
          {/* </div> */}
          {/* <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'> */}

          <DatePicker
            className={`custom-calendar `}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="dateOff"
            name="dateOff"
            inputClassName={"required-fields"}
            value={payload?.dateOff ? payload?.dateOff : ""}
            handleChange={handleChange}
            // disable={values?.isOxygenData ? true : false}
            lable={t("DateOFF")}
            minDate={new Date()}
            placeholder={VITE_DATE_FORMAT}
          />
          <TimePicker
            placeholderName={t("TimeOFF")}
            lable={t("TimeOFF")}
            id="timeOff"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className="required-fields"
            name="timeOff"
            value={payload?.timeOff ? payload?.timeOff : ""}
            handleChange={handleChange}
          // disable={values?.isOxygenData ? true : false}
          />
          {/* </div> */}
          <DatePicker
            className="custom-calendar"
            id="dob"
            name="dob"
            placeholder={VITE_DATE_FORMAT}
            value={payload?.dob}
            lable={t("DateofBirth")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            handleChange={handleChange}
            showTime
            hourFormat="12"
          />
          <TimePicker
            placeholderName="Time"
            lable={t("TimeofBirth")}
            id="time"
            name="time"
            value={payload?.time}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t(
              "Gestation"
            )}
            className="form-control"
            id={"gestationType"}
            name={"gestationType"}
            searchable={true}
            dynamicOptions={GESTATION_DROPDOWN}
            value={payload?.gestationType}
            handleChange={handleReactSelect}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="directTest"
            name="directTest"
            lable={t(
              "DirectAntiglobulinTest"
            )}
            placeholder=" "
            value={payload?.directTest}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="babyBG"
            name="babyBG"
            lable={t("BabyBloodGroup")}
            value={payload?.babyBG}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="motherBG"
            name="motherBG"
            lable={t("MotherBloodGroup")}
            value={payload?.motherBG}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="PhotoTheraphy"
            name="PhotoTheraphy"
            lable={t("PhotoTheraphy")}
            value={payload?.PhotoTheraphy}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <button
              className="btn btn-sm btn-primary mx-2"
              onClick={handleNursingWardSerumBilirubinSave}
            >
              {payload?.id !== 0 ? t("Update") : t("Save")}
            </button>
          </div>
        </div>
        {console.log(list)}

        <Tables
          thead={thead}
          tbody={handleTableData(list)}
        />
      </div>
      {/* <div className="patient_registration card mt-1 p-1">
        <div className="text-right">
          <button
            className="btn btn-sm btn-primary mx-2"
            onClick={handleNursingWardSerumBilirubinSave}
          >
            {t("Save")}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default NICUSerumBilirubinCharts;
