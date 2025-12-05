import React, { useEffect, useState } from 'react'
import ReactSelect from '../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { notify } from '../../utils/ustil2';

function PrintShrinkModal({ prevPayload, apiCall, close }) {
    const { t } = useTranslation();
    const ip = localStorage.getItem("ip");
    const [url, setUrl] = useState("");
    const [values, setValues] = useState({
        Shrink: prevPayload?.ShrinkPercentage,
    });
    const dynamicUrl = import.meta.env.VITE_APP_REACT_APP_DYNAMIC_URL === "true";
    const baseFromEnv = import.meta.env.VITE_APP_REACT_APP_BASE_URL;

    const baseUrl = dynamicUrl
        ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
        }/api/v1`
        : baseFromEnv;
    console.log(prevPayload, values, "values");


    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handlePrintApi = async () => {
        const payload = {
            ...prevPayload,
            ShrinkPercentage: Number(values?.Shrink?.value)
        };

        try {
            const apiResp = await apiCall(payload);

            console.log(apiResp)
            if (!apiResp?.success || !apiResp?.data) {
                notify(apiResp?.message, "error");
                close()
                return;

            }

            if (apiResp?.success) {
                setUrl(apiResp?.data?.pdfUrl ? apiResp?.data?.pdfUrl : apiResp?.data);
                return

            }


        } catch (error) {
            notify("An error occurred while processing the PDF", "error");
        }
    }

    useEffect(() => {
        handlePrintApi()
    }, [values])

    console.log(`${baseUrl}/${url}`)


    return (
        <div className="bg-white rounded-2xl shadow-lg w-[95%] h-[95%] relative">
            <div className='d-flex align-items-center justify-content-end p-1'>

                <ReactSelect
                    placeholderName={t("Shrink Percentage")}
                    id={"Shrink"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                     dynamicOptions={[
                { label: "60%", value: "60" },
                { label: "65%", value: "65" },
                { label: "70%", value: "70" },
                { label: "75%", value: "75" },
                { label: "80%", value: "80" },
                { label: "81%", value: "81" },
                { label: "82%", value: "82" },
                { label: "83%", value: "83" },
                { label: "84%", value: "84" },
                { label: "85%", value: "85" },
                { label: "86%", value: "86" },
                { label: "87%", value: "87" },
                { label: "88%", value: "88" },
                { label: "89%", value: "89" },
                { label: "90%", value: "90" },
                { label: "91%", value: "91" },
                { label: "92%", value: "92" },
                { label: "93%", value: "93" },
                { label: "94%", value: "94" },
                { label: "95%", value: "95" },
                { label: "96%", value: "96" },
                { label: "97%", value: "97" },
                { label: "98%", value: "98" },
                { label: "99%", value: "99" },
                { label: "100%", value: "100" },
                { label: "101%", value: "101" },
                { label: "102%", value: "102" },
                { label: "103%", value: "103" },
                { label: "104%", value: "104" },
                { label: "105%", value: "105" },
                { label: "106%", value: "106" },
                { label: "107%", value: "107" },
                { label: "108%", value: "108" },
                { label: "109%", value: "109" },
                { label: "110%", value: "110" },
                { label: "111%", value: "111" },
                { label: "112%", value: "112" },
                { label: "113%", value: "113" },
                { label: "114%", value: "114" },
                { label: "115%", value: "115" },
                { label: "116%", value: "116" },
                { label: "117%", value: "117" },
                { label: "118%", value: "118" },
                { label: "119%", value: "119" },
                { label: "120%", value: "120" }

              ]}
                    handleChange={handleSelect}
                    name={"Shrink"}
                    value={values?.Shrink?.value}
                />
            </div>
            <iframe
                src={`${baseUrl}/${url}`}
                style={{ height: "100vh", width: "100%" }}
                id="myIframe"


            />




        </div>
    )
}

export default PrintShrinkModal