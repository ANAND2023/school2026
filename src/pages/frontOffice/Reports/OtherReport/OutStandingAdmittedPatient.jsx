import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import { t } from "i18next";
import Input from "../../../../components/formComponent/Input";
import { useSelector } from "react-redux";
import { notify } from "../../../../utils/ustil2";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { BillingReportsOutstandingPatient } from "../../../../networkServices/MRDApi";

const OutStandingAdmittedPatient = () => {
  const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
  console.log("getBindPanel", getBindPanelListData);

  const [values, setValues] = useState({
    panel: [],
    amount: 10000,
    fileType: "0",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value < 0) {
      return;
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelectChange = (name, e) => {
    // debugger
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };

  console.log(values, "valuesvalues");

  const handleSearch = async () => {
    debugger;
    const selectedPanels = values?.panel?.map((val) => val?.code);
    let payload = {
      vAmount: values?.amount,
      panelIDs: selectedPanels,
      printType: Number(values?.fileType),
    };
    try {
      const response = await BillingReportsOutstandingPatient(payload);
      if (response?.success) {
        notify(response?.message, "success");
        if (values?.fileType == 0) {
          exportToExcel(response?.data, "OutStanding (Admitted Patient)");
        } else {
          RedirectURL(response?.data?.pdfUrl);
        }
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <Heading
        isBreadcrumb={false}
        title={"OutStanding (Admitted Patient)"}
        //      secondTitle={

        //        <div className="mb-0">
        //     <p className="text-bold mb-0">Report Available Only in Excel*</p>
        //   </div>
        //         }
      />
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
        <ReportsMultiSelect
          name="panel"
          placeholderName={t("Panel")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={getBindPanelListData}
          labelKey="Company_Name"
          valueKey="PanelID"
          requiredClassName={true}
        />
        <Input
          type="number"
          className={"form-control "}
          lable={t("Amount >")}
          placeholder=" "
          name="amount"
          onChange={handleInputChange}
          value={values?.amount}
          // required={false}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
        />
        <ReactSelect
          placeholderName={t("File Type")}
          id={"fileType"}
          searchable={true}
          respclass="col-xl-1 col-md-2 col-sm-3 col-12"
          dynamicOptions={[
            { label: "Pdf", value: "1" },
            { label: "Excel", value: "0" },
          ]}
          name="fileType"
          handleChange={handleReactSelectChange}
          value={values?.fileType}
        />
        <div className="col-sm-2 col-xl-1">
          <button
            className="btn btn-sm btn-success"
            type="button"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutStandingAdmittedPatient;
