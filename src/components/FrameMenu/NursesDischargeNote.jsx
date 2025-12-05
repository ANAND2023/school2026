import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TextAreaInput from "../formComponent/TextAreaInput";
import Tables from "../UI/customTable";
import {
  NursingWardBindDetails,
  NursingWardNursingDischargeDeleting,
  NursingWardNursingDischargeSave,
  BindNursing_DischargeNoteAllApi
} from "../../networkServices/nursingWardAPI";
import { notify, NursingWardDischargePayload } from "../../utils/utils";
import ReactSelect from "../formComponent/ReactSelect";
import moment from "moment";

const NursesDischargeNote = ({data}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const {transactionID,patientID,admitDate} = data
  const [itemList, setItemList] = useState([])
  // const NURSEDISCHARGETHEAD = [
  //   "S.No",
  //   "Date",
  //   "Discharge Advice",
  //   "Issue Items",
  //   "Next Visit",
  //   "Entry By",
  //   "Remove",
  // ];
  const NURSEDISCHARGETHEAD = [
    t("S.No"),
    t("Date"),
    // t("Discharge Advice"),
     { width: "30%", name: t("Discharge Advice") },
     { width: "30%", name: t("Issue Items") },
    // t("Issue Items"),
    t("Next Visit"),
    t("Entry By"),
    // t("Item Name"),
    t("Remove"),
  ];
  

  const [payload, setPayload] = useState({
    id: 0,
    Date: new Date(),
    nextVisit: new Date(),
    DisChargeAdvice: "",
    IssueItems: "",
    transactionID:String(transactionID),
    patientID:patientID,
    item:""
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e) => {
    setPayload({
      ...payload,
      [name]: e,
    });
  };
  console.log(payload);

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
       {t("max 200 Charcter")} <span className="text-dark">{t("Remaining")} : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleNursingWardBindDetails = async (transactionID) => {
    try {
      const data = await NursingWardBindDetails(transactionID);
      setTableData(data?.data);
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };
  const handleEditTable = (row) => {
    setPayload((prev) => ({
      ...prev,
      id: row?.ID ? row?.ID : 0,
      Date: row?.DATE ? moment(row?.DATE).toDate() : '',
      nextVisit: row?.NextVisit ? moment(row?.nextVisit).toDate() : "",
      item: {
        label: row?.itemName,
        value: row?.ItemId,
      },
      DisChargeAdvice: row?.ProgressNote,
      IssueItems: row?.Issueitem,
    }))
  }
  const handleTbody = (tbody) => {
    return tbody.map((items, index) => {
      return {
        SNO: index + 1,
        Date: items?.DATE,
        DischargeAdvice: <p style={{
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }}>{ items?.ProgressNote}</p>,

        IssueItems: <p style={{
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }}>{ items?.Issueitem}</p>,
  
        NextVisit: items?.NextVisit,
        EntryBy: items?.EntryBy,
        // ItemNAme: items?.itemName,
        Remove: (
          <div className="" >
            <span className="mx-2" onClick={() => handleEditTable(items)}>
              <i className="mx-2 fa fa-edit" aria-hidden="true"></i>
            </span>
            <i
              className="fa fa-trash text-danger text-center"
              onClick={() => {
                handleRemove(items?.ID, items?.UserID);
              }}
            >

            </i>
          </div>
        ),
      };
    });
  };

  const handleNursingWardNursingDischargeSave = async () => {
    try {
      const apiPayload = NursingWardDischargePayload(payload,transactionID,patientID);
      const data = await NursingWardNursingDischargeSave(apiPayload);
      if (data?.success) {
        handleNursingWardBindDetails(String(transactionID));
        setPayload({
          Date: new Date(),
          nextVisit: new Date(),
          DisChargeAdvice: "",
          IssueItems: "",
          item:"",
          id:0
        });
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleRemove = async (id, UserID) => {
    try {
      const data = await NursingWardNursingDischargeDeleting({
        userID: String(UserID),
        id: String(id),
      });
      if (data?.success) {
        handleNursingWardBindDetails(String(transactionID));
        setPayload({...payload,id:0})
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("SomeThing Went Wrong");
    }
  };
  const handleItemList = async () => {
    const response = await BindNursing_DischargeNoteAllApi()
    if (response?.success) {
      notify(response?.message, "success")
      setItemList(response?.data)
    } else {
      notify(response?.message, "error")
    }
  }
  console.log(itemList);

  useEffect(() => {
    handleNursingWardBindDetails(String(transactionID));
    handleItemList()
  }, []);
  const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Nurses Discharge Note")}
          isBreadcrumb={false}
        />

        <div className="row p-2">
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <DatePicker
              className="custom-calendar"
              lable={t("Date")}
              respclass={"mb-2"}
              value={payload?.Date}
              maxDate={new Date()}
              removeFormGroupClass={true}
              id="Date"
              name="Date"
              placeholder={VITE_DATE_FORMAT}
              showTime
              hourFormat="12"
              handleChange={(e) => handleChange(e)}
               minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
              
            />

            <DatePicker
              className="custom-calendar"
              lable={t("Next Visit")}
              respclass={"mb-2"}
              value={payload?.nextVisit}
              removeFormGroupClass={true}
              id="nextVisit"
              name="nextVisit"
              placeholder={VITE_DATE_FORMAT}
              minDate={new Date()}
              showTime
              hourFormat="12"
              handleChange={(e) => handleChange(e)}
            />

            {/* <ReactSelect
              placeholderName={t("Select Item")}
              id={"item"}
              name="item"
              value={payload?.item?.value}
              // handleChange={(name, e) =>
              //   handleReactSelect(name, e, "itemID")
              // }

              handleChange={handleReactSelect}
              dynamicOptions={itemList?.map((item) => ({
                label: item?.itemName,
                value: item?.ItemId,
              }))}
              searchable={true}
              removeIsClearable={true}
            // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            /> */}
            <button
              className="btn btn-sm btn-success w-100"
              type="button"
                disabled={data?.status==="OUT"?true:false}
              onClick={handleNursingWardNursingDischargeSave}
            >
              {payload?.id === 0 ? t("Save"): t("Update")}
            </button>
          </div>

          <div className="col-xl-5 col-md-4 col-sm-4 col-12">
            <TextAreaInput
              lable={t("DisCharge Advice")}
              className="w-100"
              placeholder={""}
              id="DisChargeAdvice"
              rows={4}
              name="DisChargeAdvice"
              value={payload?.["DisChargeAdvice"]}
              onChange={(e) => handleChange(e)}
              maxLength={200}
            />
            {handleIndicator(payload?.["DisChargeAdvice"])}
          </div>
          <div className="col-xl-5 col-md-5 col-sm-4 col-12">
            <TextAreaInput
              lable={t("Issue Items")}
              placeholder=""
              className="w-100"
              name="IssueItems"
              value={payload?.["IssueItems"]}
              onChange={(e) => handleChange(e)}
              rows={4}
              maxLength={200}
            />
            {handleIndicator(payload?.["IssueItems"])}
          </div>
        </div>
      </div>

      <div className="patient_registration card">
        <Heading
          title={t("Details")}
          isBreadcrumb={false}
        />
        <Tables
         thead={NURSEDISCHARGETHEAD} tbody={handleTbody(tableData)} />
      </div>
    </div>
  );
};

export default NursesDischargeNote;
