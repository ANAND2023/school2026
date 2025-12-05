import React, { useEffect, useState } from 'react';
import { ReportsIPDCMSHistoryReport } from '../../../networkServices/ReportsAPI';
import { exportToExcel } from '../../../utils/exportLibrary';
import { notify } from '../../../utils/ustil2';
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Input from '../../../components/formComponent/Input';
import { useTranslation } from 'react-i18next';



const IpdCmsHistory = ({ data }) => {
  // debugger
  const [t] = useTranslation();

  const [values, setValues] = useState({
    patientId: "",
    reportType: { label: t("Check approval days log"), value: "1" },
    searchBy: { label: "", value: "1" }


  })


  //  const [payload, setPayload] = useState({
  //     ...intialState,
  //   });
  // const [dropDownData, setDropDownData] = useState([]);

  const handleSelect = (name, value) => {
    // debugger
    setValues((val) => ({ ...val, [name]: value }));

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleReportTypeChange = async () => {
    debugger

    const payload = {
      IPDNo: values?.searchBy?.value === "1" ? values?.patientId : "",
      ReportType: values?.reportType?.value,
      PatientId: values?.searchBy?.value === "2" ? values?.patientId : ""
    };
    console.log("ppppppppppppppppppp", payload)





    try {
      const response = await ReportsIPDCMSHistoryReport(payload);

      if (response?.success) {
        exportToExcel(response?.data, `${values?.reportType?.label}`)
        setValues({...values, patientId:""})
      } else {
        notify(response?.message, "error")
      }

    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  return (

    <div className="card patient_registration border">
      <Heading title={t("CMS History Report")} isBreadcrumb={true} />
      <div className='row p-2'>

        <ReactSelect
          placeholderName={t("Report Type")}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          dynamicOptions={[
            { label: t("Check approval days log"), value: "1" },
            { label: t("Check billing amount log"), value: "2" },
            { label: t("Check cms log"), value: "3" },
          ]}
          name="reportType"
          value={values?.reportType?.value}
          handleChange={handleSelect}
        />
        <ReactSelect
          placeholderName={t("searchBy")}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-1 col-md-1 col-sm-3 col-12"
          dynamicOptions={[
            { label: "IPD No.", value: "1" },
            { label: "UHID", value: "2" },

          ]}
          name="searchBy"
          value={values?.searchBy?.value}
          handleChange={handleSelect}
        />

        <Input
          type="text"
          className="form-control"
          id="patientId"
          name="patientId"
          value={values?.patientId}
          lable={t(`${values?.searchBy?.value === "1" ? "Ipd No." : "UHID"}`)}

          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          onChange={handleChange}
        />






        <div className="row">
          <div className="col-sm-12 text-right">
            <button onClick={handleReportTypeChange} className="btn-primary btn-sm  ml-1 custom_save_button required-fields">
              {t("Report Print")}
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default IpdCmsHistory;
