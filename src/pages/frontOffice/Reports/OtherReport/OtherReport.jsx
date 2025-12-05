import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BillingReportsBindReportType,
  BindNABH,
  PrintNBHReport,
} from "../../../../networkServices/MRDApi";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import AdmitDischargelist from "./AdmitDischargelist";
import AdmittPannelPatient from "./AdmittPannelPatient";
import AdmitPanelWithoutDischarge from "./AdmitPanelWithoutDischarge";
import CTBDetail from "./CTBDetail";
import RateList from "./RateList";
import BillCancel from "./BillCancel";
import DischargeCancel from "./DischargeCancel";
import OprationReport from "./OprationReport";
import CensusReport from "./CensusReport";
import CollectionReport from "./collectionReport";
import ReceiptReport from "./receiptReport";
import PatientAdmission from "./PatientAdmission";
import DischargeTypeWiseReport from "./DischargeTypeWiseReport";
import CreaditBillReport from "./creditBillReport";
import PharmacyDetailsReport from "./PharmacyDetailsReport";
import AdmissionProcess from "./AdmissionProcess";
import DischargeProcess from "./DischargeProcess";
import OPDPatientTimewise from "./OPDPatientTimewise";
import OPDTATReport from "./OPDTATReport";
import SumCollectionReportCash from "./SumCollectionReportCash";
import IPDBillRegisterPanelWise from "./IPDBillRegisterPanelWise";
import IPDBillRegisterDoctorWise from "./IPDBillRegisterDoctorWise";
import LabSummaryReport from "./LabSummaryReport";

import InvestigationBusinessReport from "./InvestigationBusinessReport";
import BusinessSummary from "./BusinessSummary";
import LabCollectionDetails from "./LabCollectionDetails";
import PlannedDischageReport from "./PlannedDischageReport";
import MiscellaneousReport from "./MiscellaneousReport";
import RefundReport from "./RefundReport";
import BedOccupancy from "./BedOccupancy";
import OutStandingAdmittedPatient from "./OutStandingAdmittedPatient";
import CommonReport from "./CommonReport";
import InvestigationBusiness from "./InvestigationBusiness";
import OprationNewReport from "./OprationNewReport";
import BillingReport from "./NewFormatReport";
import BillingReportNew from "./NewFormatReport";
import CMSUtilizationReport from "./CMSUtilizationReport";
import DoctorWiseBusiness from "./DoctorWiseBusiness";
import ReferedPatientReport from "./ReferedPatientReport";
import CmsUtilisationReport from "./CmsUtilisationReport";
import DoctorWisePkgDetail from "./DoctorWisePkgDetail";
import VendorWisePurchase from "./VendorWisePurchase";
import ItemWisePurchaseGST from "./ItemWisePurchaseGST";
import HSNwisePurchaseSummary from "./HSNwisePurchaseSummary";
import IPDbillDataReport from "./IPDbillDataReport";
import OPDadvanceReport from "./OPDadvanceReport";

const OtherReport = () => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "",
  };
  const [dropDownState, setDropDownState] = useState([]);

  useEffect(() => {
    BindNABHList();
  }, []);
  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  const BindNABHList = async () => {
    try {
      const response = await BillingReportsBindReportType();

      if (response?.success) {
        setDropDownState(
          handleReactSelectDropDownOptions(
            response?.data,
            "ReportName",
            "ReportID"
          )
        );
      } else {
        setDropDownState([]);
      }
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const SaveData = async () => {
    console.log("New Data.................", values);
    const payload = {
      rbtActiveVal: values.ReportType,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values.toDate).format("DD-MMM-YYYY"),
    };
    const response = await PrintNBHReport(payload);
    if (response.success) {
      RedirectURL(response?.data);
    } else {
      notify(response.message, "error");
    }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          {/* <ReportsMultiSelect
            name="panel"
            placeholderName="Panel"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          /> */}
          <ReactSelect
            placeholderName={t("Report List")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={dropDownState}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
          />
          {/* <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
          /> */}
          <div className="col-sm-1">
            {/* <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Search</button> */}
          </div>
        </div>
      </div>
      {values?.ReportType === 1 && (
        <AdmitDischargelist reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 2 && (
        <AdmitPanelWithoutDischarge reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 3 && (
        <CTBDetail reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 4 && (
        <AdmittPannelPatient reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 5 && (
        <RateList reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 6 && (
        <OprationReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 7 && (
        <BillCancel reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 8 && (
        <DischargeCancel reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 9 && (
        <CensusReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 10 && (
        <CollectionReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 11 && (
        <ReceiptReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 12 && (
        <PatientAdmission reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 13 && (
        <DischargeTypeWiseReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 14 && (
        <CreaditBillReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 17 && <PharmacyDetailsReport />}
      {/* {
        values?.ReportType===19 &&
        <AdmissionProcess/>
      } */}
      {values?.ReportType === 20 && <AdmissionProcess />}
      {values?.ReportType === 21 && <DischargeProcess />}
      {values?.ReportType === 22 && <OPDPatientTimewise />}
      {values?.ReportType === 23 && <OPDTATReport />}
      {values?.ReportType === 24 && <SumCollectionReportCash />}
      {values?.ReportType === 25 && <IPDBillRegisterPanelWise />}
      {values?.ReportType === 26 && <IPDBillRegisterDoctorWise />}
      {values?.ReportType === 27 && <LabSummaryReport />}
      {values?.ReportType === 28 && <BusinessSummary />}
      {values?.ReportType === 29 && <LabCollectionDetails />}
      {values?.ReportType === 30 && <PlannedDischageReport />}
      {values?.ReportType === 31 && <MiscellaneousReport />}

      {values?.ReportType === 32 && <RefundReport />}
      {values?.ReportType === 33 && <BedOccupancy />}
      {values?.ReportType === 34 && <OutStandingAdmittedPatient />}

      {(values?.ReportType === 35 ||
        values?.ReportType === 36 ||
        values?.ReportType === 37) && (
        <CommonReport reportTypeID={values?.ReportType} />
      )}
      {values?.ReportType === 38 && <OprationNewReport />}
      {values?.ReportType === 44 && <BillingReportNew />}
      {values?.ReportType === 40 && <InvestigationBusiness />}
      {values?.ReportType === 41 && <DoctorWiseBusiness />}
      {values?.ReportType === 42 && <ReferedPatientReport />}
      {values?.ReportType === 43 && <CmsUtilisationReport />}
      {values?.ReportType === 45 && <DoctorWisePkgDetail />}
      {/* {values?.ReportType === 46 && <VendorWisePurchase />} */}
      {/* {values?.ReportType === 47 && <ItemWisePurchaseGST />} */}
      {/* {values?.ReportType === 48 && <HSNwisePurchaseSummary/>} */}
      {values?.ReportType === 49 && <IPDbillDataReport/>}
      {values?.ReportType === 50 && <OPDadvanceReport/>}
      {/* <InvestigationBusiness /> */}
      {/* <DoctorWiseBusiness /> */}

      {/* <InvestigationBusinessReport/> */}
    </>
  );
};

export default OtherReport;
