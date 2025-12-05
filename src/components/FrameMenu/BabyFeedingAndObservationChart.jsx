import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import {
  NursingWardBindBabyFeeding,
  NursingWardSaveBabyFeeding,
} from "../../networkServices/nursingWardAPI";
import IntakeOuttakeTable from "../UI/customTable/IntakeOuttakeTable";
import moment from "moment";
import {
  notify,
  NursingWardBabyFeedingModifiedObject,
} from "../../utils/utils";
import Input from "../formComponent/Input";
import TimeInputPicker from "../formComponent/CustomTimePicker/TimeInputPicker";

// const THEAD = [
//   {
//     colSpan: "1",
//     name: "Time",
//   },
//   {
//     colSpan: "1",
//     name: "ORAL",
//   },
//   {
//     colSpan: "1",
//     name: "NGT",
//   },
//   {
//     colSpan: "1",
//     name: "INFUSION",
//   },
//   {
//     colSpan: "1",
//     name: "DRUGS",
//   },
//   {
//     colSpan: "1",
//     name: "URINE",
//   },
//   {
//     colSpan: "1",
//     name: "BOWEL",
//   },
//   {
//     colSpan: "1",
//     name: "TEMP",
//   },
//   {
//     colSpan: "1",
//     name: "REMARKS",
//   },
//   {
//     colSpan: "1",
//     name: "Created By",
//   },
//   {
//     colSpan: "1",
//     name: "Select",
//   },
// ];

const BabyFeedingAndObservationChart = ({ data }) => {
  const [t] = useTranslation();
  const THEAD = [
    {
      colSpan: "1",
      name: t("Time"),
    },
    {
      colSpan: "1",
      name: t("ORAL"),
    },
    {
      colSpan: "1",
      name: t("NGT"),
    },
    {
      colSpan: "1",
      name: t("INFUSION"),
    },
    {
      colSpan: "1",
      name: t("DRUGS"),
    },
    {
      colSpan: "1",
      name: t("URINE"),
    },
    {
      colSpan: "1",
      name: t("BOWEL"),
    },
    // {
    //   colSpan: "1",
    //   name: t("TEMP"),
    // },
    {
      colSpan: "1",
      name: t("REMARKS"),
    },
    {
      colSpan: "1",
      name: t("Created By"),
    },
    {
      colSpan: "1",
      name: t("Select"),
    },
  ];


  const { VITE_DATE_FORMAT } = import.meta.env;
  console.log("data", data)
  const { transactionID, patientID, admitDate } = data;

  const [payload, setPayload] = useState({
    date: new Date(),
  });
  const initialTableData = {

    infusion: "",
    ngtOral: "",
    ngtOnly: "",
    drugs: "",
    urine: "",
    bowel: "",
    temp: "",
    remarks: "",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    createdBy: "",
    Name: "",
    IsSelect: "",
    IsChecked: "",
    CreatedDate: payload?.date,
    Shift: "",
    ID: 0
  }



  const [tableData, setTableData] = useState([{ ...initialTableData }]);

  const handleNursingWardBindBabyFeeding = async (transactionID, date) => {
    try {
      const response = await NursingWardBindBabyFeeding(
        transactionID,
        moment(date).format("DD-MMM-YYYY")
      );

      if (response?.data?.length > 0) {
        const responseData = response?.data;
        const modifiedData = [
          // {
          //   infusion: "",
          //   ngtOral: "",
          //   ngtOnly: "",
          //   drugs: "",
          //   urine: "",
          //   bowel: "",
          //   temp: "",
          //   remarks: "",
          //   time: "Morning",
          //   // newTime: "",
          //   // date: "",
          //   date: moment(date).format("DD-MMM-YYYY"),
          //   shift: "1",
          //   createdBy: "",
          //   createdDate: "",
          //   id: "",
          // },
        ];
        for (let i = 0; i < responseData?.length; i++) {
          modifiedData.push(
            NursingWardBabyFeedingModifiedObject(responseData[i])
          );
          if (
            i > 0 &&
            String(responseData[i + 1]?.["Shift"]) === "2" &&
            responseData[i + 1]?.["Shift"] !== responseData[i]?.["Shift"] &&
            i <= responseData?.length - 1
          ) {
            modifiedData.push({
              infusion: "",
              ngtOral: "",
              ngtOnly: "",
              drugs: "",
              urine: "",
              bowel: "",
              temp: "",
              remarks: "",
              time: "Noon",
              // newTime: "",
              // date: "",
              date: moment(date).format("DD-MMM-YYYY"),
              shift: "2",
              createdBy: "",
              createdDate: "",
              id: "",
            });
          }
        }

        setTableData(modifiedData);
      }
      else {
        setTableData([{ ...initialTableData }]);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChange = (e, index, type) => {
    debugger
    const { name, value } = e.target;
    if (type === "number") {
      const decimalWithNegativeRegex = /^-?\d+(\.\d+)?$/;
      if (decimalWithNegativeRegex.test(value)) {
        const data = [...tableData];
        data[index][name] = value;
        setTableData(data);
      }
    }
    else if (name === "time") {
      debugger
      const data = [...tableData];
      // data[index]?."newTime"] = value; 
      data[index][name] = value;
      setTableData(data);
    }
    else {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    }
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
      />
    );
  };

  const handleSelect = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const handleTbody = (tableData) => {
    return tableData?.map((items, index) => {
      const {
        infusion,
        ngtOral,
        ngtOnly,
        drugs,
        urine,
        bowel,
        temp,
        remarks,
        time,
        createdBy,
        Name,
        IsSelect,
        IsChecked,
      } = items;

      if (["Morning", "Noon"].includes(time)) {
        return {
          Time: (
            <div style={{ fontWeight: 900, padding: "7px 0px" }}>{time}</div>
          ),
          ngtOral,
          ngtOnly,
          infusion,
          drugs,
          urine,
          bowel,
          temp,
          remarks,
          createdBy,
          select: "",
        };
      } else {
        return {
          // time,
          Time: (
            <TimeInputPicker
              name="time"
              // lable="Entry Time"
              id="time"
              value={time}
              // value={items?.newTime || time || ""}
              // value={items.Time_Label}
              // onChange={handleChange}
              onChange={(e) => {
                handleChange(e, index, "time");
              }}
              respclass="w-100"
            />
            // Time: Time_Label,
          ),
          ngtOral: HandleInputField(
            ngtOral,
            "ngtOral",
            "10",
            "text",
            index,
            Name
          ),
          ngtOnly: HandleInputField(
            ngtOnly,
            "ngtOnly",
            "10",
            "text",
            index,
            Name
          ),
          infusion: HandleInputField(
            infusion,
            "infusion",
            "10",
            "text",
            index,
            Name
          ),
          drugs: HandleInputField(drugs, "drugs", "100", "text", index, Name),
          urine: HandleInputField(urine, "urine", "10", "text", index, Name),
          bowel: HandleInputField(bowel, "bowel", "10", "text", index, Name),
          // temp: HandleInputField(temp, "temp", "10", "text", index, Name),
          remarks: HandleInputField(
            remarks,
            "remarks",
            "100",
            "text",
            index,
            Name
          ),
          createdBy,
          select: (
            <input
              type="checkbox"
              checked={Number(IsChecked)}
              name="IsChecked"
              onChange={(e) => handleSelect(e, index)}
              disabled={Name}
            />
          ),
        };
      }
    });
  };

  // const handleNursingWardSaveBabyFeeding = async () => {
  //   try {
  //     const babyfeedingPayload = tableData.filter((items, _) =>
  //       Boolean(items?.IsChecked)
  //     );
  //     const reponse = await NursingWardSaveBabyFeeding({
  //       babyfeeding: babyfeedingPayload,
  //       pid: String(patientID),
  //       tid: String(transactionID),
  //     });

  //     if (reponse?.success) {
  //       notify(reponse?.message, "success");
  //       handleNursingWardBindBabyFeeding(transactionID, payload?.date);
  //     } else {
  //       notify(reponse?.message, "error");
  //     }
  //   } catch (error) {
  //     console.log(error, "Something Went Wrong");
  //   }
  // };
  const handleNursingWardSaveBabyFeeding = async () => {
    debugger
    try {
      const babyfeedingPayload = tableData
        .filter((items) => Boolean(items?.IsChecked)) // Filter selected rows
        .map((items) => ({
          ...items,
          date: items.date || moment(payload.date).format("DD-MMM-YYYY"), // Fallback to payload.date if date is empty
        }));


      const isEmptyFeeding = babyfeedingPayload.some((item) => {
        return (
          !item.infusion?.trim() &&
          !item.ngtOral?.trim() &&
          !item.ngtOnly?.trim() &&
          !item.drugs?.trim() &&
          !item.urine?.trim() &&
          !item.bowel?.trim() &&
          !item.temp?.trim()
        );
      });

      if (isEmptyFeeding) {
        notify("Please enter at least one feeding detail before saving.", "warn");
        return; // Stop execution
      }


      const response = await NursingWardSaveBabyFeeding({
        babyfeeding: babyfeedingPayload,
        pid: String(patientID),
        tid: String(transactionID),
      });

      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardBindBabyFeeding(transactionID, payload?.date);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
      notify(response?.message, "error")
    }
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value || new Date(), // Fallback to current date if value is empty
    }));;
    handleNursingWardBindBabyFeeding(transactionID, value);
  };

  useEffect(() => {
    handleNursingWardBindBabyFeeding(transactionID, payload?.date);
  }, []);

  const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");
  console.log(tableData, "tableData")
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Baby Feeding and Observation")}
            secondTitle={(<>
              <button
                className="btn btn-sm btn-primary ms-auto mx-2"
                onClick={() => {
                  setTableData((prev) => {
                    return [...prev, { ...initialTableData }]
                  })
                }}
              >
                {t("Add Row")}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleNursingWardSaveBabyFeeding}
                disabled={data?.status === "OUT" ? true : false}
              >
                {t("Save")}
              </button>
            </>)}
            isBreadcrumb={false}
          />

          <div className="row p-2">
            <DatePicker
              className="custom-calendar"
              id="date"
              name="date"
              placeholder={VITE_DATE_FORMAT}
              lable={t("Date")}
              value={payload?.date}
              showTime
              hourFormat="12"
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              handleChange={handleChangeDate}
              // value={payload?.date}
              minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
              maxDate={new Date()}
            />
          </div>

          <div className="row p-2">
            <IntakeOuttakeTable
              THEAD={{ THEAD }}
              Tbody={handleTbody(tableData)}
              dataTitle={"THEAD"}
            />
          </div>
        </div>
      </div>
      {/* <div className="footer-dyamic-component">
        <button
          className="btn btn-primary btn-sm mx-2"
          onClick={handleNursingWardSaveBabyFeeding}
          disabled={data?.status === "OUT" ? true : false}
        >
          {t("Save")}
        </button>
      </div> */}
    </>
  );
};

export default BabyFeedingAndObservationChart;
