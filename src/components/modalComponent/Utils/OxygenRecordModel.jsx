import React, { useEffect, useState } from 'react'
import DatePicker from '../../formComponent/DatePicker';
import TimePicker from '../../formComponent/TimePicker';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../formComponent/ReactSelect';
import { handleReactSelectDropDownOptions, timeFormateDate } from '../../../utils/utils';
import { BindAvailablenurse } from '../../../networkServices/nursingWardAPI';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import moment from 'moment';


const OxygenRecordModel = ({ handleChangeModel, inputData }) => {
  debugger
  const minDate = moment(inputData?.OxygenDateON, "DD-MMM-YYYY").toDate();
  let userData = useLocalStorage("userData", "get");
  const [values, setValues] = useState({
    id: inputData?.ID,
    nurseTimeOff: userData?.employeeID,
    dateOff: inputData?.OxygenDateOFF || new Date(),
    OxygenDateON: inputData?.OxygenDateON || new Date(),
    OxygenTimeON: inputData?.OxygenTimeON ,
    timeOff: timeFormateDate(inputData?.OxygenTimeOFF),
  })


  const [availableNurse, setAvailableNurse] = useState([])
  const { VITE_DATE_FORMAT } = import.meta.env;

  useEffect(() => {
    if (inputData) {
      handleChangeModel(values);
    }
  }, [values]);
  const bindNurseList = async () => {
    let availableNurses = await BindAvailablenurse();
    if (availableNurses?.success) {
      setAvailableNurse(availableNurses?.data)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = {
      ...values,
      [name]: value
    };
    setValues(updatedValues);
    handleChangeModel(updatedValues);
  }
  const handleReactSelect = (name, value) => {
    const updatedValues = {
      ...values,
      [name]: value
    };
    setValues(updatedValues);
    handleChangeModel(updatedValues);
  };
  const { t } = useTranslation();
  useEffect(() => {
    bindNurseList()
  }, [])
  return (
    <div className="row">

      <div className="col-md-4 col-sm-4 col-12 mb-2">
        <DatePicker
          className="custom-calendar"
          respclass="w-100"
          id="dateOff"
          name="dateOff"
          inputClassName="required-fields"
          value={new Date(values?.dateOff) || ""}
          handleChange={handleChange}
          lable={t("DateOFF")}
          placeholder={VITE_DATE_FORMAT}
          minDate={minDate}
          maxDate={new Date()}
        />
      </div>

      <div className="col-md-4 col-sm-4 col-12 mb-2">
        <TimePicker
          placeholderName={t("TimeOFF")}
          lable={t("TimeOFF")}
          id="timeOff"
          className="required-fields"
          respclass="w-100"
          name="timeOff"
          value={values?.timeOff || ""}
          handleChange={handleChange}
        />
      </div>

      <div className="col-md-4 col-sm-4 col-12 mb-2">
        <ReactSelect
          placeholderName={t("Nurse Time Off")}
          name="nurseTimeOff"
          inputId="nurseTimeOff"
          requiredClassName="required-fields"
          dynamicOptions={handleReactSelectDropDownOptions(availableNurse, "NAME", "EmployeeID")}
          value={values?.nurseTimeOff || ""}
          handleChange={handleReactSelect}
          isDisabled={values?.nurseTimeOff ? true : false}
          searchable={true}
          respclass="w-100"
        />
      </div>
    </div>

  )
}

export default OxygenRecordModel;