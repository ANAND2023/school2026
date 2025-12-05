import React, { useState, useEffect } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { notify } from "../../../../utils/ustil2";
import { DoctorPrescriptionPrintPDF } from "../../../../networkServices/DoctorApi";

export default function DoctorPrescriptionModalPrint({ url, isPrint, prevPayload }) {
  console.log(url);
  const [t] = useTranslation()
  const [values, setValues] = useState({
    Shrink: { label: "100%", value: "100" },
  });
  const [url1, setUrl] = useState(url || "");
  const dynamicUrl = import.meta.env.VITE_APP_REACT_APP_DYNAMIC_URL === "true";
  const baseFromEnv = import.meta.env.VITE_APP_REACT_APP_BASE_URL;

  const baseUrl = dynamicUrl
    ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
    }/api/v1`
    : baseFromEnv;
  const baseurl = baseUrl;

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrintApi = async () => {
    const payload = {
      ...prevPayload,
      ShrinkPercentage: Number(values?.Shrink?.value)
    };

    try {
      const apiResp = await DoctorPrescriptionPrintPDF(payload);
      // debugger
      if (apiResp?.success) {
        let pdfUrl = apiResp?.data;
        let isPrint;
        if (pdfUrl?.toLowerCase().endsWith(".html")) {
          window.open(pdfUrl, "_blank");
          return;
        } else if (pdfUrl && pdfUrl.startsWith("https://")) {
          pdfUrl = pdfUrl;
        } else {
          pdfUrl = `${baseurl}/${apiResp?.data}`;
        }
        setUrl(pdfUrl)

      } else {
        notify(apiResp?.message, "error")
      }

    } catch (error) {
      notify("An error occurred while processing the PDF", "error");
    }
  }

  useEffect(() => {
    handlePrintApi()
  }, [values])

  return (
    <div className="bg-white p-1 rounded-2xl shadow-lg w-[80%] h-[80%] relative">
      <div className='d-flex align-items-center justify-content-end p-1'>

        <ReactSelect
          placeholderName={t("Shrink Percentage")}
          id={"Shrink"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          dynamicOptions={[
            { label: "120%", value: "120" },
            { label: "115%", value: "115" },
            { label: "110%", value: "110" },
            { label: "105%", value: "105" },
            { label: "100%", value: "100" },
            { label: "95%", value: "95" },
            { label: "90%", value: "90" },
            { label: "85%", value: "85" },
            { label: "80%", value: "80" },
            { label: "75%", value: "75" },
            { label: "70%", value: "70" },
            { label: "65%", value: "65" },
            { label: "60%", value: "60" },
          ]}
          handleChange={handleSelect}
          name={"Shrink"}
          value={values?.Shrink?.value}
        />
      </div>
      {/* <iframe
        src={url1}
        title="Prescription Modal Print"
        style={{ height: "100vh", width: "100%" }}
        id="myIframe"
      /> */}
      {url1 && (
        <iframe
          src={url1}
          title="Prescription Modal Print"
          style={{ height: "100vh", width: "100%" }}
          id="myIframe"
        />
      )}
    </div>
  );
}
