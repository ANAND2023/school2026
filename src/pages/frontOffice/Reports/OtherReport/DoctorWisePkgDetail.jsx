import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { BindDoctorDept } from "../../../../networkServices/EDP/karanedp";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import moment from "moment";
import { BillingBillingReportsDoctorPharmacyIPDPkgDetail } from "../../../../networkServices/MRDApi";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { notify } from "../../../../utils/ustil2";

const DoctorWisePkgDetail = () => {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    AmountType: { label: "Net Amount", value: "1" },
  };

  const [values, setValues] = useState({ ...initialValues });
  const [dropDownState, setDropDownState] = useState({
    DoctorList: [],
  });
  console.log("values", values);
  const handleReactSelectChange = (name, e) => {
    setValues((prev) => ({
      ...prev,
      [name]: e,
    }));
  };

  const handleReport = async () => {
    const payload = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      doctorID: values?.doctor?.map((doc) => doc?.code)?.join(",") || "",
      reportType: 0,
    };

    const response =
      await BillingBillingReportsDoctorPharmacyIPDPkgDetail(payload);
    if (response?.success) {
      exportToExcel(response?.data, "Doctor Wise Package Detail Report");
      notify(response?.message, "Success");
    } else {
      notify(response?.message, "error");
    }
  };
  const bindDropdownData = async () => {
    const [DoctorList] = await Promise.all([BindDoctorDept("All")]);

    if (DoctorList?.success) {
      setDropDownState((val) => ({
        ...val,
        DoctorList: handleReactSelectDropDownOptions(
          DoctorList?.data,
          "Name",
          "DoctorID"
        ),
      }));
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  useEffect(() => {
    bindDropdownData();
  }, []);

  return (
    <div className="card">
      <Heading
        title={"Doctor Wise Packgae Details Report"}
        isBreadcrumb={false}
      />
      <div className="row p-2">
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id={"fromDate"}
          name={"fromDate"}
          lable={t("From Date")}
          values={values}
          setValues={setValues}
        />
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id={"toDate"}
          name={"toDate"}
          lable={t("To Date")}
          values={values}
          setValues={setValues}
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          placeholderName={t("Doctor")}
          id={"doctor"}
          name="doctor"
          value={values?.doctor}
          handleChange={handleMultiSelectChange}
          dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
            name: item?.label,
            code: item?.value,
          }))}
          searchable={true}
        />
        <button className="btn btn-success" onClick={handleReport}>
          {t("Report")}
        </button>
      </div>
    </div>
  );
};

export default DoctorWisePkgDetail;
