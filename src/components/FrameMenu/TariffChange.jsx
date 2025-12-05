import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { ChangeTypeOption } from "../../utils/constant";
import {
  BillingCategory,
  bindPanelRoleWisePanelGroupWise,
  getTariffChangeLog,
  IPDAdvanceBindPatientDetails,
  LoadDiffPanelRates,
  SaveTariffic,
} from "../../networkServices/BillingsApi";
import Heading from "../UI/Heading";
import TariffModificationTable from "../UI/customTable/billings/TariffModificationTable";
import LabeledInput from "../formComponent/LabeledInput";
import { notify } from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Tables from "../UI/customTable";

const TariffChange = ({ data }) => {

  console.log("data", data);
  const { t } = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [billingCategory, setBillingCategory] = useState([]);
  console.log("Billing Categroy", billingCategory);
  const [tableData, setTableData] = useState([]);

  const [patientDetail, setPatientDetails] = useState({});
  const [logDetails, setLogDetails] = useState([]);
  console.log("patientDetails", patientDetail);
  console.log("Pateint Details", patientDetail);
  const [panel, setPanel] = useState([]);
  console.log("Panel", panel);
  const initialState = {
    ChangeType: "1",
    billCategory: "",
    panelID: "",
  };
  const [payload, setPayload] = useState({ ...initialState });
  console.log("payload", payload);
  console.log(tableData);
  const handleReactSelect = (name, value, e) => {
    if (name === "panelID" || name === "billCategory") {
      setPayload((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
    } else {
      setPayload((prevData) => ({
        ...prevData,
        [name]: value?.value || "",
      }));
    }

    if (name == "ChangeType") {
      if (payload?.ChangeType === "1") {
        setPayload((prevData) => ({
          ...prevData,
          billCategory: "",
        }));
        getBindPanelGroup();
      } else {
        setPayload((prevData) => ({
          ...prevData,
          billCategory: "",
        }));
        getBindBillingCategory();
      }
    }
    console.log(value?.value);
    // if (name === "billCategory") {
    //   getLoadDiffPanelRates({ ...payload, [name]: value?.value });
    // }
  };
  console.log(payload);
  const getBindBillingCategory = async () => {
    try {
      const response = await BillingCategory();
      setBillingCategory(response?.data || []);
    } catch (error) {
      console.error("Error fetching billing categories", error);
    }
  };
  const getLoadDiffPanelRates = async (updatedPayload = payload) => {
    const listPayload = {
      tid: Number(data?.transactionID),
      panelID:
        payload?.ChangeType == "2"
          ? 0
          : updatedPayload?.billCategory
            ? Number(updatedPayload?.billCategory)
            : 0,
      ipdCaseTypeID:
        payload?.ChangeType == "2"
          ? Number(updatedPayload?.billCategory)
          : Number(data?.ipdCaseTypeID),
      scheduleChargeID: Number(data?.scheduleChargeID),
      actualPanelID: Number(data?.panelID),
    };

    try {
      const response = await LoadDiffPanelRates(listPayload);
      setTableData(response?.data);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };
  const getTariffChange = async () => {
    const payload = {
      "tid": Number(data?.transactionID ?? "")
    }
    try {
      const response = await getTariffChangeLog(payload)
      if (response?.success) {
        setLogDetails(response?.data)
        // notify(response?.message, "success")

      }
      else {
        console.log("error", response?.message)
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const getBindPanelGroup = async () => {
    try {
      const response = await bindPanelRoleWisePanelGroupWise();
      setPanel(response?.data || []);
    } catch (error) {
      console.error("Error fetching panel data", error);
    }
  };

  const TotalCurrentGrossBill = tableData?.reduce((acc, item) => {
    return acc + item.CurrentGrossBill;
  }, 0);
  const TotalProposedGrossBill = tableData?.reduce((acc, item) => {
    return acc + item.ProposedGrossBill;
  }, 0);
  const totalDiff = tableData?.reduce((acc, item) => {
    return acc + item.GrossAmtDiff;
  }, 0);
  const handleSave = async () => {
    const itemWithZeroValue = tableData.filter(
      (item) => item?.ProposedGrossBill === 0
    );

    if (itemWithZeroValue?.length > 0) {
      notify(
        "Can not update as One of the Item have 0 Proposed Gross Bill Amount ",
        "error"
      );
      return;
    }
    try {
      const requestBody =
      {
        ipAddress: ip,
        scheduleChargeID: Number(data?.scheduleChargeID),
        ipdCaseTypeID: Number(payload?.billCategory?.value),
        tid: Number(data?.transactionID),
        panelID: Number(payload?.panelID?.value),
        totalAmount: Number(TotalProposedGrossBill),
      };

      const response = await SaveTariffic(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        getTariffChange()
        // getLoadDiffPanelRates();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleIPDAdvanceBindPatientDetails = async (
    patientID,
    transactionID
  ) => {
    try {
      const response = await IPDAdvanceBindPatientDetails(
        patientID,
        transactionID
      );
      setPatientDetails(response?.data[0]);

      // debugger;
    } catch (error) {
      console.log(error, "Somthing Went Wrong");
    }
  };

  useEffect(() => {
    getTariffChange()
    getBindBillingCategory();
    getBindPanelGroup();
    // getLoadDiffPanelRates();
    handleIPDAdvanceBindPatientDetails(data?.patientID, data?.transactionID);
  }, []);

  useEffect(() => {
    // debugger;
    const byDefalutBillingCategory = billingCategory?.find((item) => {
      return (
        Number(item.IPDCaseTypeID) === Number(patientDetail?.IPDCaseTypeID)
      );
    });

    const byDefaultPanel = panel?.find((item) => {
      return item?.company_Name === data?.company_Name;
    });
    console.log("BYdEFAULT", byDefaultPanel);
    setPayload((prev) => ({
      ...prev,
      billCategory: {
        label: "",
        value: byDefalutBillingCategory?.BillingCategoryID,
      },
      panelID: {
        label: "",
        value: byDefaultPanel?.panelID,
      },
    }));
  }, [billingCategory, panel, payload?.ChangeType, patientDetail]);

  const logthead = [
    { width: "3%", name: t("S.No.") },
    { width: "20%", name: t("Entrydate") },
   
    { width: "40%", name: t("Ipd Case Type Name") },
    { width: "40%", name: t("Panel Name") },
    { width: "40%", name: t("EntryBy") },
 
   
    
  ];
  const thead = [
    { width: "3%", name: t("S.No.") },
    t("Entrydate"),
    { width: "30%", name: t("Category") },
    t("Sub Category"),
    t("Item Name"),
    t("Current Gross Bill"),
    t("Total Disc. Amt."),
    t("Proposed Gross Bill"),
    t("Proposed Panel Disc. Amt."),
    t("Diff. in Gross Amt."),
    t("ID"),
  ];


  const handleSearch = async () => {
    if (payload?.ChangeType === "") {
      notify("Please Select Change Type", "error");
      return;
    } else if (payload?.ChangeType === "1" && payload?.panelID === "") {
      notify("Please Select Panel", "error");
      return;
    } else if (payload?.ChangeType === "2" && payload?.billCategory === "") {
      notify("Please Select Proposed Billing Category", "error");
      return;
    }
    const payloadData = {
      tid: Number(data?.transactionID),
      panelID: Number(payload?.panelID?.value)
        ? Number(payload?.panelID?.value)
        : 0,
      ipdCaseTypeID: payload?.billCategory?.value
        ? payload?.billCategory?.value
        : 0,
      scheduleChargeID: Number(data?.scheduleChargeID),
      // actualPanelID: Number(data?.panelID),
      // changeType: Number(payload?.ChangeType) ?? 2,
      // actualIPDCaseTypeID: Number(patientDetail?.IPDCaseTypeID) ?? 0,
    };
    try {
      const response = await LoadDiffPanelRates(payloadData);
      if (response?.success) {
        setTableData(response?.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };
  return (
    <div className="card">
      <Heading title={t("Tariff Change")} />
      <div className="row p-2">
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Change Type")}
          id="ChangeType"
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name="ChangeType"
          dynamicOptions={ChangeTypeOption}
          value={payload?.ChangeType}
          isDisabled={payload?.ChangeType === "1" ? true : false}
          handleChange={handleReactSelect}
        />
        {console.log(
          "filteredValue",
          billingCategory?.find(
            (item) =>
              Number(item?.IPDCaseTypeID) ===
              Number(patientDetail?.IPDCaseTypeID)
          )
        )}
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t(
            payload?.ChangeType === "2"
              ? t("Proposed Billing Category")
              : t("Panel")
          )}
          id="billCategory"
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name={payload?.ChangeType === "2" ? "billCategory" : "panelID"}
          // value={
          //   payload?.ChangeType === "2"
          //     ? payload?.billCategory
          //     : payload?.panelID
          // }
          // value={
          //   payload?.ChangeType === "2"
          //     ? billingCategory?.find(
          //         (item) =>
          //           Number(item?.IPDCaseTypeID) ===
          //           Number(patientDetail?.IPDCaseTypeID)
          //       )?.IPDCaseTypeID ?? payload?.billCategory
          //     : panel?.find((item) => item?.company_Name === data?.company_Name)
          //         ?.panelID ?? payload?.panelID
          // }
          value={
            payload?.ChangeType === "2"
              ? payload?.billCategory?.value
              : payload?.panelID?.value
          }
          handleChange={handleReactSelect}
          dynamicOptions={
            payload?.ChangeType === "2"
              ? billingCategory.map((ele) => ({
                label: ele?.Name,
                value: ele?.IPDCaseTypeID,
              }))
              : panel.map((item) => ({
                label: item?.company_Name,
                value: item?.panelID,
              }))
          }
        />
        <button className="btn btn-success" onClick={() => handleSearch()}>
          {t("Search")}
        </button>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <TariffModificationTable THEAD={thead} tbody={tableData} />
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="row p-2">
          <div className="col-sm-2">
            <LabeledInput
              label={t("Current Gross Total")}
              value={TotalCurrentGrossBill}
            />
          </div>
          <div className="col-sm-2">
            <LabeledInput
              label={t("Proposed Gross Total")}
              value={TotalProposedGrossBill}
            />
          </div>
          <div className="col-sm-2">
            <LabeledInput label={t("Total Gross AmtDiff")} value={totalDiff} />
          </div>
          <div className="col-sm-2">
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              {t("Update")}
            </button>
          </div>
        </div>
      )}
      {logDetails?.length>0 &&
        <div>
          <Heading title={t("Tariff log details")} />
          <div className="row">
             <Tables
        thead={logthead}
        tbody={logDetails?.map((item, index) => ({
          "Sr No.": index + 1,
          EntryDate: item?.EntryDate,
          IpdCaseTypeName: item?.IpdCaseTypeName,
          PanelName: item?.PanelName,
          EntryBy: item?.EntryBy,
          
          
        }))}
        // style={{ height: "auto" }}
        // tableHeight={"scrollView"}
        // getRowClass={getRowClass}
      />
          </div>
        </div>
      }
    </div>
  );
};

export default TariffChange;
