import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import Heading from "../UI/Heading";
import IntakeOuttakeTable from "../UI/customTable/IntakeOuttakeTable";
import {
  NursingWardBindData,
  NursingWardIntakeOutPutChartPrintAPI,
  NursingWardSaveIntake,
} from "../../networkServices/nursingWardAPI";
import moment from "moment";
import Input from "../formComponent/Input";
import { notify, NursingWardSaveIntakePayload } from "../../utils/utils";
import { PrintSVG } from "../SvgIcons";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";
import TimeInputPicker from "../formComponent/CustomTimePicker/TimeInputPicker";
import { Checkbox } from "primereact/checkbox";
import { Prev } from "react-bootstrap/esm/PageItem";

// const THEAD = [
//   {
//     colSpan: "1",
//     name: "Time",
//   },
//   {
//     colSpan: "1",
//     name: "IVF Solution",
//   },

//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },

//   {
//     colSpan: "1",
//     name: "NGT",
//   },
//   {
//     colSpan: "1",
//     name: "Oral",
//   },
//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Medication",
//   },
//   {
//     colSpan: "1",
//     name: "Infusion Pumps",
//   },
//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Urine(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Other",
//   },
//   {
//     colSpan: "1",
//     name: "Other 2",
//   },
//   {
//     colSpan: "1",
//     name: "Drains",
//   },
//   {
//     colSpan: "1",
//     name: "NGT Aspiration",
//   },
//   {
//     colSpan: "1",
//     name: "Created By",
//   },
//   {
//     colSpan: "1",
//     name: "select",
//   },
// ];

const IntakeAndOutPutChart = ({ data }) => {

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const { transactionID, patientID, admitDate } = data;


  const THEAD = [
    { colSpan: 1, name: t("Time") },
    { colSpan: 1, name: t("Oral") },
    { colSpan: 1, name: t("NGT") },
    { colSpan: 1, name: t("Medication") },
    { colSpan: 1, name: t("IVF") },
    { colSpan: 1, name: t("Vol(ml)") },
    { colSpan: 1, name: t("Urine(ml)") },
    { colSpan: 1, name: t("Drains") },
    { colSpan: 1, name: t("NGT Aspiration") },
    { colSpan: 1, name: t("Vomitus") },
    { colSpan: 1, name: t("Vol(ml)") },
    { colSpan: 1, name: t("Stool") },
    { colSpan: 1, name: t("Created By") },
    { colSpan: 1, name: t("Select") },
    // { colSpan: 1, name: t("Action") },
  ];

  // const More_THEAD = [
  //   {
  //     colSpan: "1",
  //     name: "",
  //   },
  //   {
  //     colSpan: "7",
  //     name: "Intake Chart",
  //     className: "text-center-table",
  //   },
  //   {
  //     colSpan: "6",
  //     name: "OutPut Chart",
  //     className: "text-center-table",
  //   },
  //   {
  //     colSpan: "2",
  //     name: "",
  //   },
  // ];

  const More_THEAD = [
    { colSpan: 1, name: "" },
    { colSpan: 7, name: t("Intake Chart"), className: "text-center-table" },
    {
      colSpan: 6, name: <div className="d-flex justify-content-between align-items-center w-100">
        <div className="flex-grow-1 text-center">
          <span>{t("Output Chart")}</span>
        </div>

        <button
          className="btn btn-sm btn-primary ms-auto"
          onClick={()=>{
            setTableData((prev)=>{
              return [...prev,{...initialTableData}]
            })
          }}
        >
          {t("Add Row")}
        </button>
      </div>
      , className: "text-center-table"
    },
    // { colSpan: 2, name: "" },
  ];

  // const TFooter = [
  //   {
  //     colSpan: "1",
  //     name: "",
  //   },
  //   {
  //     colSpan: "2",
  //     name: "Total Intake",
  //     className: "text-center-table",
  //   },
  //   {
  //     colSpan: "5",
  //     name: "",
  //     className: "text-center-table",
  //   },
  //   {
  //     colSpan: "2",
  //     name: "Total OutPut",
  //     className: "text-center-table",
  //   },
  //   {
  //     colSpan: "5",
  //     name: "",
  //     className: "text-center-table",
  //   },
  // ];

  const TFooter = [
    { colSpan: 1, name: "" },
    { colSpan: 2, name: t("Total Intake"), className: "text-center-table" },
    { colSpan: 5, name: "", className: "text-center-table" },
    { colSpan: 2, name: t("Total Output"), className: "text-center-table" },
    { colSpan: 5, name: "", className: "text-center-table" },
  ];

  const [payload, setPayload] = useState({
    Date: new Date(),
  });

  const initialTableData = {
    "Time_Label": new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    "Shift": "1",
    "Name": "",
    "DATE": payload?.Date,
    "Solution": "",
    "NGTOraSpDiet": "",
    "VolNgt": "",
    "OraSpDiet": "",
    "NGT_Aspiration": "",
    "Medication": "",
    "More_drains": "",
    "More_infusion_pumps": "",
    "VolMedication": "",
    "UrineVolumn": "",
    "Other": "",
    "RunningOutPut": "",
    "SolVol": "",
    "MorningVolNgt": 0,
    "EveningVolNgt": 0,
    "MorningSolVol": 0,
    "EveningSolVol": 0,
    "MorningVolMedication": 0,
    "MorningUrineVolumn": 0,
    "EveningVolMedication": 0,
    "EveningUrineVolumn": 0,
    "TotalSolVol": 0,
    "TotalVolNgt": 0,
    "TotalVolMedication": 0,
    "TotalUrineVol": 0,
    "TotalMorningMore_infusion_pumps": 0,
    "TotalMorningMore_drains": 0,
    "TotalEveningMore_infusion_pumps": 0,
    "TotalEveningMore_drains": 0,
    "TotalMore_infusion_pumps": 0,
    "TotalMore_drains": 0,
    "TotalIntake": 0,

  }

  const [tableData, setTableData] = useState([initialTableData])
  const [footer, setFooter] = useState([...TFooter]);

  const sumMultipleKeys = (array, key) => {
    return array.reduce((total, item) => total + Number(item[key] || 0), 0);

  }
  console.log(tableData, 'tableData')
  const handleNursingWardSaveIntake = async () => {

    // debugger
    try {
      const responseAPI = NursingWardSaveIntakePayload(
        tableData,
        moment(payload?.Date).format("DD-MMM-YYYY")
      );
      const data = await NursingWardSaveIntake({
        intake: responseAPI,
        pid: String(patientID),
        tid: String(transactionID),
      });

      if (data?.success) {
        notify(data?.message, "success");
        handleNursingWardBindData(transactionID, moment(payload?.Date).format("DD-MMM-YYYY"));
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardBindData = async (transactionID, Date) => {
    try {
      const response = await NursingWardBindData(
        String(transactionID),
        moment(Date).format("DD-MMM-YYYY")
      );

      if (response?.data?.length > 0) {
        const data = [];
        const responseAPI = response.data;

        let secondShiftIndex = -1;

        responseAPI.forEach((item, idx) => {
          const newItem = { ...item, isChecked: false };
          if (secondShiftIndex === -1 && item.Shift === "2") {
            secondShiftIndex = data.length;
          }
          data.push(newItem);
        });
        const morningData = responseAPI.filter(item => item.Shift === "1");
        const eveningData = responseAPI.filter(item => item.Shift === "2");

        const sumFields = (dataArray, keys) => {
          const result = {};
          keys.forEach(key => {
            result[key] = dataArray.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
          });
          return result;
        };

        const FIELDS = [
          "OraSpDiet",
          "NGTOraSpDiet",
          "Medication",
          "Solution",
          "UrineVolumn",
          "More_drains",
          "NGT_Aspiration",
          "Other",
          "RunningOutPut",
        ];

        // Totals
        const morningTotals = sumFields(morningData, FIELDS);
        const eveningTotals = sumFields(eveningData, FIELDS);

        const morningSolVol =
          morningTotals.OraSpDiet +
          morningTotals.NGTOraSpDiet +
          morningTotals.Medication +
          morningTotals.Solution;

        const morningVolOut =
          morningTotals.UrineVolumn +
          morningTotals.More_drains +
          morningTotals.NGT_Aspiration +
          morningTotals.Other;

        const isAnyMorningDataFilled = Object.values(morningTotals).some(v => v > 0);

        if (false) {
          const morningSubTotalRow = {
            Time_Label: "Morning Sub/TA",
            ...morningTotals,
            SolVol: morningSolVol,
            VolOutPutRow: morningVolOut,
            Name: "",
            Shift: "1",
            isChecked: false,
          };

          if (secondShiftIndex !== -1) {
            data.splice(secondShiftIndex, 0, morningSubTotalRow);
          } else {
            data.push(morningSubTotalRow);
          }
        }

        const eveningSolVol =
          eveningTotals.OraSpDiet +
          eveningTotals.NGTOraSpDiet +
          eveningTotals.Medication +
          eveningTotals.Solution;

        const eveningVolOut =
          eveningTotals.UrineVolumn +
          eveningTotals.More_drains +
          eveningTotals.NGT_Aspiration +
          eveningTotals.Other;

        const isAnyEveningDataFilled = Object.values(eveningTotals).some(v => v > 0);

        if (false) {
          data.push({
            Time_Label: "Evening Sub/TB",
            ...eveningTotals,
            SolVol: eveningSolVol,
            VolOutPutRow: eveningVolOut,
            Name: "",
            Shift: "2",
            isChecked: false,
          });
        }

        /// Grand Total Calculation
        const grandTotal = {};
        FIELDS.forEach(key => {
          grandTotal[key] = (morningTotals[key] || 0) + (eveningTotals[key] || 0);
        });

        const grandSolVol =
          grandTotal.OraSpDiet +
          grandTotal.NGTOraSpDiet +
          grandTotal.Medication +
          grandTotal.Solution;

        const grandVolOut =
          grandTotal.UrineVolumn +
          grandTotal.More_drains +
          grandTotal.NGT_Aspiration +
          grandTotal.Other;

        const isAnyGrandDataFilled = Object.values(grandTotal).some(v => v > 0);

        if (isAnyGrandDataFilled) {
          data.push({
            Time_Label: "Grand T",
            ...grandTotal,
            SolVol: grandSolVol,
            VolOutPutRow: grandVolOut,
            Name: "",
            Shift: "All",
            isChecked: false,
          });
        }

        data.forEach((item, index) => {
          item.Index = index + 1;
        });


        const footerData = [
          { colSpan: 1, name: "" },
          { colSpan: 2, name: t("Total Intake"), className: "text-center-table" },
          {
            colSpan: 5,
            name: grandSolVol || 0,
            className: "text-center-table",
          },
          { colSpan: 2, name: t("Total Output"), className: "text-center-table" },
          {
            colSpan: 3,
            name: grandVolOut || 0,
            className: "text-center-table",
          },
        ];
        setFooter(footerData);
        setTableData(data);
      }
      else{
        setTableData([{...initialTableData}])
        setFooter([...TFooter]);
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };
  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    const data = [...tableData];

    if (type === "number") {
      const decimalWithNegativeRegex = /^-?\d*(\.\d*)?$/;
      if (value === "" || decimalWithNegativeRegex.test(value)) {
        data[index][name] = value;
        setTableData(data);
      }
    } else {
      data[index][name] = value;
      setTableData(data);
    }
  };


  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    handleNursingWardBindData(transactionID, value);
  };

  const handleSelect = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const HandleInputField = (value, name, maxLength, type, index, isDisable) => {
    return (
      <Input
        value={value}
        type="text"
        className="table-input bold-black"
        name={name}
        removeFormGroupClass={true}
        maxLength={maxLength}
        onChange={(e) => {
          handleChange(e, index, type);
        }}
        disabled={isDisable}
      // id="bold-black"
      />
    );
  };

  const handleTbody = (tableData) => {

    return tableData?.map((items, index, arr) => {
      const {
        Time_Label,
        Solution,
        SolVol,
        NGTOraSpDiet,
        OraSpDiet,
        VolNgt,
        Medication,
        More_infusion_pumps,
        VolMedication,
        UrineVolumn,
        More_drains,
        NGT_Aspiration,
        Other,
        RunningOutPut,
        Name,
        isChecked,
      } = items;
      console.log(items, 'items')
      const VolInputRow = Number(OraSpDiet) + Number(NGTOraSpDiet) + Number(Medication) + Number(Solution);
      const VolOutPutRow = Number(UrineVolumn) + Number(More_drains) + Number(NGT_Aspiration) + Number(Other);
      console.log(Other, 'Other')
      if (
        ["Morning Sub/TA", "Evening Sub/TB", "Grand T"].includes(Time_Label)
      ) {
        return {
          Time: (
            <div style={{ fontWeight: 900, padding: "7px 0px" }}>
              {Time_Label}
            </div>
          ),
          OraSpDiet,
          NGTOraSpDiet,
          Medication,
          Solution,
          SolVol,
          // VolNgt,
          // More_infusion_pumps,
          // VolMedication,
          UrineVolumn,
          More_drains,
          NGT_Aspiration,
          Other,
          VolOutPutRow,
          RunningOutPut,
          Name,
          Select: "",
          
        };
      } else {
        return {
          Time: (
            <TimeInputPicker
              name="Time_Label"
              // lable="Entry Time"
              id="time"
              value={items.Time_Label}
              // onChange={handleChange}
              onChange={(e) => {
                handleChange(e, index, "text");
              }}
              respclass="w-100"
            />
            // Time: Time_Label,
          ),
          OraSpDiet: HandleInputField(
            OraSpDiet,
            "OraSpDiet",
            10,
            "number",
            index,
            Name
          ),
          NGT: HandleInputField(
            NGTOraSpDiet,
            "NGTOraSpDiet",
            10,
            "number",
            index,
            Name
          ), //10 maxlength

          Medication: HandleInputField(
            Medication,
            "Medication",
            10,
            "number",
            index,
            Name
          ), //10 maxlength
          // IVFSolutionVol: HandleInputField(
          //   SolVol,
          //   "SolVol",
          //   4,
          //   "number",
          //   index,
          //   Name
          // ), //4 maxlength
          IVFSolution: HandleInputField(
            Solution,
            "Solution",
            10,
            "number",
            index,
            Name
          ), //10 maxlength


          OralVol: HandleInputField(VolInputRow, "VolNgt", 4, "number", index, true), //4 maxlength

          // InfusionPumps: HandleInputField(
          //   More_infusion_pumps,
          //   "More_infusion_pumps",
          //   10,
          //   "text",
          //   index,
          //   Name
          // ), //10 maxlength
          // InfusionPumpsVol: HandleInputField(
          //   VolMedication,
          //   "VolMedication",
          //   4,
          //   "number",
          //   index,
          //   Name
          // ), //4 max
          Urine: HandleInputField(
            UrineVolumn,
            "UrineVolumn",
            10,
            "number",
            index,
            Name
          ), // 10 max
          Drains: HandleInputField(
            More_drains,
            "More_drains",
            10,
            "number",
            index,
            Name
          ), //10max
          NGTAspiration: HandleInputField(
            NGT_Aspiration,
            "NGT_Aspiration",
            10,
            "number",
            index,
            Name
          ), //10 max
          Other: HandleInputField(
            Other,
            "Other",
            10,
            "number",
            index,
            Name
          ),
          VolOutPutRow: HandleInputField(VolOutPutRow, "VolOutPutRow", 4, "number", index, true), //10 max
          RunningOutPut: HandleInputField(
            RunningOutPut,
            "RunningOutPut",
            10,
            "number",
            index,
            Name
          ), //10 max


          CreatedBy: Name,
          Select: (
            <Checkbox
              // type="checkbox"
              className="mx-2"
              checked={isChecked}
              name="isChecked"
              onChange={(e) => handleSelect(e, index)}
              disabled={Name}
            />

          ),

        };
      }
    });
  };

  const handlePrint = async () => {
    // OpenPDFURL(
    //   "NursingWardIntakeOutPutChartPrint",
    //   transactionID,
    //   moment(payload?.Date).format("DD-MMM-YYYY")
    // );

    let data = {
      "date": moment(payload?.Date).format("DD-MMM-YYYY"),
      "tid": transactionID
    }
    let apiResp = await NursingWardIntakeOutPutChartPrintAPI(data)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  };

  useEffect(() => {
    handleNursingWardBindData(transactionID, payload?.Date);
  }, []);
  const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Intake And OutPut Chart")}
          isBreadcrumb={false}
          secondTitle={
            <div className="d-flex justify-content-center mt-2">
              <button
                className="btn btn-sm  btn-primary"
                onClick={handleNursingWardSaveIntake}
                disabled={data?.status === "OUT" ? true : false}
              >
                {t("Save")}
              </button>
            </div>
          }
        />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="Date"
            name="Date"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Date")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            showTime
            value={payload?.Date}
            handleChange={handleDateChange}
            hourFormat="12"
            minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
            maxDate={new Date()}
          />
          <div onClick={handlePrint}>{PrintSVG()}</div>
        </div>
      </div>

      <div className="patient_registration card">
        <IntakeOuttakeTable
          THEAD={{ More_THEAD, THEAD }}
          Tbody={handleTbody(tableData)}
          footer={footer}
          dataTitle={"THEAD"}
        />
      </div>

      {/* <div className="d-flex justify-content-center mt-2">
        <button
          className="btn btn-sm  btn-primary"
          onClick={handleNursingWardSaveIntake}
        >
          {t("Save")}
        </button>
      </div> */}
    </div>
  );
};

export default IntakeAndOutPutChart;
