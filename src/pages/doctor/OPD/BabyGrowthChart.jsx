import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import TimePicker from '../../../components/formComponent/TimePicker';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Tables from '../../../components/UI/customTable';
import { DoctorAddBabyGrowth, DoctorBindchartWeight, DoctorGetBabyGrowthRecords, DoctorUpdateBabyGrowth } from '../../../networkServices/DoctorApi';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import GraphBox from '../../../components/DashboardUI/GraphBox';
import { Line } from 'react-chartjs-2';
import { createGraphData } from '../../../utils/constant';
import { notify } from '../../../utils/utils';
import WeightGrowthChart from './BabyGrowthChart/WeightGrowthChart';
import { use } from 'i18next';
import HeightGrowthChart from './BabyGrowthChart/HeightGrowthChart';
import HeadGrowthChart from './BabyGrowthChart/HeadGrowthChart';

const BabyGrowthChart = ({ patientDetail }) => {

  function convertToDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    // Convert to Date object
    const date = new Date(year, months[month], day);
    return date;
  }

  function convertTimeToDate(timeString) {
    if (!timeString) return new Date('1970-01-01T00:00:00'); // Default time if input is empty

    // Split the time string and its AM/PM part
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    if (modifier === 'PM' && hours < 12) hours += 12;  // Convert PM hours to 24-hour format
    if (modifier === 'AM' && hours === 12) hours = 0;   // Convert 12 AM to 00:00

    // Create a new Date object with the time
    const timeInDate = new Date();
    timeInDate.setHours(hours, minutes, 0, 0); // Set the time, with 0 seconds and 0 milliseconds
    return timeInDate;
  }

  const { PatientID, TransactionID, Gender, Sex } = patientDetail;

  console.log("patientDetail",patientDetail)

  const [t] = useTranslation();

  const { employeeID } = useLocalStorage("userData", "get")

  const [babyGrowthTable, setBabyGrowthTable] = useState([])
  const [weightChartData, setWeightChartData] = useState([])
  const [headChartData, setHeadChartData] = useState([])
  const [heightChartData, setHeightChartData] = useState([])

  const [values, setValues] = useState({

    date: new Date(),
    time: new Date(),
    weight: "",
    length: "",
    age: "",
    weightUnit: { value: "Kg", label: "Kg" },
    updateRecord: false,
    item: "",
  })

  const babyTableHedings =
    [

      { width: "1%", name: t("S.No.") },
      { width: "5%", name: t("Date") },
      { width: "5%", name: t("Time") },
      { width: "5%", name: t("Weight (Kg)") },
      { width: "5%", name: t("Weight (gm)") },
      { width: "5%", name: t("Age") },
      { width: "5%", name: t("Length (cm)") },
      { width: "5%", name: t("Entry By") },
      { width: "1%", name: t("Edit") },
    ]

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }))
  }

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }))
  }

  const addRecord = async () => {


    // console.log(PatientID, TransactionID)

    try {

      let payload = {
        "date": values?.date || "",
        "time": values?.time || "",
        "weight": values?.weight || "",
        "length": values?.length || "",
        "transactionID": TransactionID,
        "patientID": PatientID,
        "createdBy": employeeID,
        "createdDate": new Date(),
        "weightUnit": values?.weightUnit?.value || "",
        "age": values?.age || ""

      };
      if(values?.weight && values?.length && values?.age){

      
      let apiResp = await DoctorAddBabyGrowth(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        setValues({


          date: new Date(),
          time: new Date(),
          weight: "",
          length: "",
          age: "",
          weightUnit: { value: "Kg", label: "Kg" },
          updateRecord: false,
          item: "",
        })
        // console.log(payload)
        getBabyTableData()
      }
    }
    else{
      notify("All fields are required", "error");
    }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      // setTbodyRequestDetails([]);
    }
    // console.log(tbodyRequestDetails)


  }
  const updateRecord = async () => {


    // console.log("while updating", values)
    try {
// debugger
      let payload = {
        "Id": values?.item?.ID || "",
        "date": values?.date || "",
        "time": values?.time || "",
        "weight": values?.weight || "",
        "length": values?.length || "",
        "transactionID": TransactionID || "",
        "patientID": values?.item?.PatientID || "",
        "createdBy": values?.item?.CreatedBy || "",
        "createdDate": new Date(),
        "weightUnit": values?.weightUnit?.value || "",
        "age": Number(values?.age) || "",
      }

      if(values?.weight && values?.length && values?.age){
      let apiResp = await DoctorUpdateBabyGrowth(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        setValues({
          date: new Date(),
          time: new Date(),
          weight: "",
          length: "",
          age: "",
          weightUnit: { value: "Kg", label: "Kg" },
          updateRecord: false,
          item: "",
        })
        // console.log(payload)

        getBabyTableData()
      }
    }
    else{
      notify("All fields are required", "error");
    }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      setValues({
        date: new Date(),
        time: new Date(),
        weight: "",
        length: "",
        age: "",
        weightUnit: { value: "Kg", label: "Kg" },
        updateRecord: false,
        item: "",
      })
      // setTbodyRequestDetails([]);
    }
    // console.log(tbodyRequestDetails)


  }


  const getBabyTableData = async () => {
    // console.log(PatientID, TransactionID)

    try {


      let apiResp = await DoctorGetBabyGrowthRecords(PatientID);
      if (apiResp?.success) {
        // notify(apiResp?.message, "success");
        // console.log(payload)
        setBabyGrowthTable(apiResp.data)
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");

      setBabyGrowthTable([])
    }
  }

  const getBabyWeightChart = async () => {
    // console.log(PatientID, TransactionID)

    try {
      let payload = {
        transactionId:TransactionID,
        PatientID:PatientID,
        Gender: Gender,
        Type:"Weight"
      }

      let apiResp = await DoctorBindchartWeight(payload);
      if (apiResp?.success) {
        // notify(apiResp?.message, "success");
        // console.log(payload)
        // setBabyGrowthTable(apiResp.data)
        setWeightChartData(apiResp.data)
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      setWeightChartData([])
    }
  }

  const getBabyHeightChart = async () => {
    // console.log(PatientID, TransactionID)

    try {
      let payload = {
        transactionId:TransactionID,
        PatientID:PatientID,
        Gender: Gender,
        Type:"Height"
      }

      let apiResp = await DoctorBindchartWeight(payload);
      if (apiResp?.success) {
        // notify(apiResp?.message, "success");
        // console.log(payload)
        // setBabyGrowthTable(apiResp.data)
        setHeightChartData(apiResp.data)
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      setHeightChartData([])
    }
  }
  const getBabyHeadChart = async () => {
    // console.log(PatientID, TransactionID)

    try {
      let payload = {
        transactionId:TransactionID,
        PatientID:PatientID,
        Gender: Gender,
        Type:"Head"
      }

      let apiResp = await DoctorBindchartWeight(payload);
      if (apiResp?.success) {
        // notify(apiResp?.message, "success");
        // console.log(payload)
        // setBabyGrowthTable(apiResp.data)
        setHeadChartData(apiResp.data)
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      setHeadChartData([])
    }
  }



  useEffect(() => {
    getBabyTableData()
  }, [])
  
  
  useEffect(() => {
    getBabyWeightChart()
    getBabyHeightChart()
    getBabyHeadChart()
  }, [babyGrowthTable])

 

  useEffect(() => {
    console.log("headChartData",headChartData)
  }, [headChartData])


  ///dash 



  return (
    <>
      <div className="card patient_registration border mt-2">

        <Heading
          title={t("Baby Growth Form")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable="Date"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="date"
            id="date"
            value={values?.date}
            showTime
            hourFormat="12"
            handleChange={handleChange}
          />
          <TimePicker
            placeholderName="Time"
            lable={t("Time")}
            id="time"
            name="time"
            value={values?.time}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleChange}
          />
          <Input
            type="number"
            // id="weight"
            name="weight"
            className="form-control"
            lable={"Weight"}
            placeholder=" "
            value={values?.weight}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"

            onChange={handleChange}

          />
          <ReactSelect
            placeholderName={t("Select Unit")}
            // id={"action"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "Kg", label: "Kg" },
              { value: "Gram", label: "Gram" },

            ]}
            removeIsClearable={true}
            handleChange={handleSelect}
            value={values?.weightUnit?.value}

            name={"weightUnit"}
          />
          <Input
            type="number"
            name="length"
            className="form-control"
            lable={"length In cm."}
            placeholder=" "
            value={values?.length}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"

            onChange={handleChange}

          />
          <Input
            type="number"
            name="age"
            className="form-control"
            lable={"Age in Months"}
            placeholder=" "
            value={values?.age}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}

          />

          <button
            className="btn btn-sm btn-success m-2"
            type="button"
            onClick={() => {

              if (values?.updateRecord) {
                updateRecord()
              }
              else { 

                addRecord()
              }
            }
            }
          >
            {t("Save")}
          </button>


        </div>


        <Heading
          title={t("Result")}
          isBreadcrumb={false}

        />
        <div className='col-16'>
          <Tables
            thead={babyTableHedings}
            tbody={babyGrowthTable?.map((item, index) => ({
              sNo: index + 1,
              date: item?.DATE || "",
              time: item?.Time || "",
              weightKg: item?.WTTypess || "",
              weightGram: Math.floor(item?.WTTypess * 1000) || "",
              age: item?.Age || "",
              length: item?.Length || "",
              entryBy: item?.EmpName || "",
              edit: (
                <span
                  onClick={() => {
                    setValues({
                      date: convertToDate(item?.DATE),
                      time: convertTimeToDate(item?.Time) || "",
                      weight: item?.WTTypess || "",
                      length: item?.Length || "",
                      age: item?.Age || "",
                      weightUnit: { value: "Kg", label: "Kg" },
                      updateRecord: true,
                      item: item
                    })

                    
                  }}
                >
                  <i className="fa fa-edit" />
                </span>
              )
            }))}
          />
        </div>


      </div>
      <div className="card patient_registration border mt-2">
       { weightChartData && <WeightGrowthChart apiResponse={weightChartData} Sex={Sex} />}
        </div>
      <div className="card patient_registration border mt-2">
       { heightChartData && <HeightGrowthChart apiResponse={weightChartData} Sex={Sex} />}
        </div>
      <div className="card patient_registration border mt-2">
       { headChartData && <HeadGrowthChart apiResponse={headChartData} Sex={Sex} />}
        </div>
      
    </>
  )
}

export default BabyGrowthChart