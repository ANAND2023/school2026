import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { GetBindAllDoctorConfirmation } from '../../store/reducers/common/CommonExportFunction';
import { useSelector } from 'react-redux';
import ReactSelect from '../formComponent/ReactSelect';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { t } from 'i18next';
import Heading from '../UI/Heading';
import { GetIPDMainDoctorPatientWise, UpdateIPDDoctor } from '../../networkServices/opdserviceAPI';
import { notify } from '../../utils/ustil2';

const ChangeIPDDoctor = ({ data }) => {
  console.log(data, "props")
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");

  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  const [values, setValues] = React.useState({
    doctorID: "",
    oldDoctorID: "",
  });

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const getDoctor = async (ipd) => {
    try {
      let payload = {
        "IPDNo": ipd
      }
      const res = await GetIPDMainDoctorPatientWise(payload)
      if (res?.success) {
        setValues({ doctorID: res?.data, oldDoctorID: res?.data })
      }

    } catch (error) {
      console.log(error)
    }
  }

  const saveDoctor = async () => {
    debugger
    if(!values?.doctorID?.value) return;
    try {
      let payload = {
        "transationId": data?.transactionID,
        "doctorId": values?.doctorID?.value,
        "doctorName": values?.doctorID?.label,
        "oldDoctorId": Number(values?.oldDoctorID),
        "oldDoctorName": ""
      }
      const response = await UpdateIPDDoctor(payload)

      if (response?.success) {
        notify(response?.message, "success");
        getDoctor(data?.ipdno);
      }
      else {
        notify(response?.message, "error");
      }


    } catch (error) {
      console.log(error);
    }
  };

  console.log(values, "valuess")
  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localdata?.centreID,
      })
    );

  }, [dispatch])

  useEffect(() => {
    if (data) {
      getDoctor(data?.ipdno)
    }
  }, [data])

  return (

    <div className='card'>
      <Heading title={t("Change IPD Doctor")} isBreadcrumb={false} />
      <div
        className='row px-2 pt-2'
      >

        <ReactSelect
          placeholderName={t(
            "DoctorName"
          )}
          id={"doctorID"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name={"doctorID"}
          dynamicOptions={[
            
            ...GetBindAllDoctorConfirmationData.map((item) => {
              return {
                label: item?.Name,
                value: item?.DoctorID,
              };
            }),
          ]}
          value={values?.doctorID}
          handleChange={handleReactSelect}
        />
        <button
          onClick={saveDoctor}
          disabled={!values?.doctorID?.value}
          className="btn btn-sm btn-success ms-auto ml-2"
        >
          {t("Save")}
        </button>
      </div>
    </div>

  )
}

export default ChangeIPDDoctor