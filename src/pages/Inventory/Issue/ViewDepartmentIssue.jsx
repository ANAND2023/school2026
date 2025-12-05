import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useSelector } from "react-redux";
import {
  getEmployeeWise,
  GetRoleListByEmployeeIDAndCentreID,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import {
 
  SearchDirectDepartment,
  
} from "../../../networkServices/InventoryApi";

import Input from "../../../components/formComponent/Input";

import { notify } from "../../../utils/utils";

import { DirectDepartmentReport } from "../../../networkServices/BillingsApi";
import { RedirectURL } from "../../../networkServices/PDFURL";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";

const ViewDepartmentIssue = () => {
  const [t] = useTranslation();

  const ip = useLocalStorage("ip", "get");
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);

  const MedicineRef = useRef(null);

  const { GetEmployeeWiseCenter, GetRoleList } = useSelector(
    (state) => state.CommonSlice
  );
  console.log("GetRoleListGetRoleList", GetRoleList);
  const initialPayload = {
    centreID: localdata?.centreID,
    toDate: moment().format("YYYY-MM-DD"),
    fromDate: moment().format("YYYY-MM-DD"),
    DepartmentId: "LSHHI17",
    Quantity: "",
    ItemID: "",
    ItemName: "",
    IssueNo: "",
    RequisitionNo: "",
  };

  const [payload, setPayload] = useState({ ...initialPayload });
  console.log("Payload", payload);



  useEffect(() => {
    dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        employeeID: localdata?.employeeID,
        centreID: payload?.centreID,
      })
    );
    if (localdata?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localdata?.employeeID }));
    }
  }, []);


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };




 

 

  const [issTabData, setIssTabData] = useState([]);


  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput(MedicineRef);
  }, []);
  console.log(list);
  const sendReset = () => {
    setTableData([]);
    setList([]);
    setPayload({ ...initialPayload });
    setValue("");
  };
 


  const Reprint = async (issNo) => {
    // console.log("LocalDara", localdata);
    // console.log("Print", payload);
    // if (issNo === undefined) {
    //   notify("Please Enter Issue No.", "error");
    //   return;
    // }

    const paylaod = {
      SalesNo: issNo,
      CentreIDTo: payload?.centreID || localdata?.centreID,
      // UserValidateID: localdata?.userValidateID,
    };

    const response = await DirectDepartmentReport(paylaod);

    if (response?.success) {
      notify(response?.message, "success");
      RedirectURL(response?.data?.pdfUrl);
    } else {
      notify(response?.message, "error");
    }

    console.log("Payload", paylaod);
  };
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleSearch = async () => {
    let data = {
      SalesNo: payload?.IssueNo || 0,
      FromDate: payload?.fromDate || "",
      ToDate: payload?.toDate || "",
    };
    console.log(data);

    let response = await SearchDirectDepartment(data);
    if (response?.success) {
      // notify(response?.message, "success");
      setIssTabData(response.data);
    } else {
      notify(response?.message, "error");
    }
  };
  const issTabHead = [
    { name: t("S.No."), width: "1%" },
    { name: t("IssueNo"), with: "5%" },
    { name: t("ItemName"), with: "5%" },
    { name: t("BatchNumber"), with: "5%" },
    { name: t("FromDept"), with: "5%" },
    { name: t("DATE"), with: "5%" },
    { name: t("ToDept"), with: "5%" },
   
    { name: t("Status"), with: "5%" },
     { name: t("AcceptBy"), with: "5%" },
    { name: t("RePrint"), with: "5%" },
  ];

  return (
    <>
       <Heading isBreadcrumb={true} />

      <div className="mt-2">
        <div className="card mt-2">
          <div className="row p-2">
            <Input
              type="text"
              className="form-control"
              id="IssueNo"
              name="IssueNo"
              value={payload?.IssueNo}
              onChange={handleChange}
              lable={"Issue No."}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <DatePicker
              className="custom-calendar"
              id="From Data"
              name="fromDate"
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              value={
                payload.fromDate
                  ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
            />
            <DatePicker
              className="custom-calendar"
              id="toDate"
              name="toDate"
              lable={t("To Date")}
              value={
                payload.toDate
                  ? moment(payload.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            {/* <Input
              type="text"
              className="form-control"
              id="RequisitionNo"
              name="RequisitionNo"
              display="right"
              value={payload?.RequisitionNo}
              onChange={handleChange}
              lable={"Requisition No."}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            /> */}


            <div className="col-sm-1">
              <button className="btn btn-sm btn-success px-3" onClick={handleSearch}>{t("Search")}</button>
            </div>
          </div>
        </div>
        {issTabData.length > 0 && (
          <div className="spatient_registration_card">
            <Heading isBreadcrumb={false} title={"View Department Issue"} />
            <Tables
            scrollView="scrollView"
            //   style={{ maxHeight: "45vh" }}
              thead={issTabHead}
              tbody={issTabData?.map((item, index) => ({
                "S.No": index + 1,
                IssueNo: item?.IssueNo,
                ItemName:   <p style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
    {item?.ItemName?.length > 300 
      ? item?.ItemName.substring(0, 200) + "..." 
      : item?.ItemName}
  </p>,
                BatchNumber:  <p style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
    {item?.BatchNumber?.length > 300 
      ? item?.BatchNumber.substring(0, 200) + "..." 
      : item?.BatchNumber}
  </p>,
                FromDept: item?.FromDept,
                DATE: moment(item?.DATE).format("DD-MMM-YYYY"),
                ToDept: item?.ToDept,
                Status: item?.Status,
                IsDirectIssueDeptAcceptBy: item?.IsDirectIssueDeptAcceptBy,
                RePrint: (
                  <i
                    className="fa fa-print card-print-upload-image-icon"
                    aria-hidden="true"
                    onClick={() => {
                      Reprint(item.IssueNo);
                    }}
                  ></i>
                ),
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ViewDepartmentIssue;
