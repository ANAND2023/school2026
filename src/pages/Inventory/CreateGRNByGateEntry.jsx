import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import ReactSelect from "../../components/formComponent/ReactSelect";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import {
  BindManufacturer,
  BindVendor,
  GateEntryGRNPost,
  GateEntryGRNUnPost,
  GateEntryPostToGRN,
  GateEntryReport,
  GateEntryViewDetailGRNItem,
  SearchGateEntryItem,
} from "../../networkServices/InventoryApi";
import { notify } from "../../utils/ustil2";
import Tables from "../../components/UI/customTable";
import { RedirectURL } from "../../networkServices/PDFURL";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { GetAllAuthorization } from "../../networkServices/BillingsApi";

const CreateGRNByGateEntry = () => {
  const [tableData, setTableData] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [payload, setPayload] = useState({
    gateNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    storeType:  { label: " Medical Store", value: "STO00001" },
    InvoiceNo:"",
    GRNNo:"",
    PONo:"",
    manufacturer:{},
    Vendor:{},
    GRNType:{ label: "All", value: "2" },
    ManufacturerData:[]
  });
  console.log("payloaddddd",payload)
   const [DropDownState, setDropDownState] = useState({
      BindVendorData: [],
    });
  console.log("Payload", payload);
  const [t] = useTranslation();
  const [auth, setAuth] = useState([]);
  console.log("auth",auth)
  const THEAD1 = [
    t("S.No"),
    t("Gate Entry No"),
    t("Vendor Name"),
    t("Date"),
    t("GRN No."),
    t("GRN Amount"),
    t("Gross Amount"),
    t("Invoice"),
    t("Post Status"),

    t("Post to GRN"),
    t("Action"),
    t("View"),
    t("Re-Print"),
  ];
  const THEAD2 = [
    t("S.No"),
    t("GRN No."),
    t("Item Name"),
    t("Item Id"),
    t("Quantity"),
    t("Rate"),
    t("Net Amtount"),
  ];

  const handlePostToGRN = async (val) => {
    try {
      let newPayload = {
        gateNo: val?.GateNo,
      };
      const response = await GateEntryPostToGRN(newPayload);

      if (response?.success) {
        notify(response?.message, "success");
        handleSearch();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const viewDetails = async (val) => {
    try {
      // debugger
      const response = await GateEntryViewDetailGRNItem(val);

      if (response?.success) {
        setTableData2(response?.data);
        // notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

   const fetchVendor = async (StoreType) => {
      const payLoadList = {
        // itemName: "", // Use specific value if needed
        // requestType: "",
      };
      try {
        const response = await BindVendor(StoreType);
        // console.log("Response from bindVendor" , response);
        if (response?.success) {
          // const itemOptions = response.data.map((item) => ({
          //   value: item.LedgerNumber,
          //   label: item.LedgerName,
          // }));
          // console.log("ItemOptions" , itemOptions)
          setDropDownState((prevState) => ({
            ...prevState,
            BindVendorData: handleReactSelectDropDownOptions(
              response.data,
              "LedgerName",
              "LedgerNumber"
            ),
          }));
        }
      } catch (error) {
        console.error("Error fetching item names: ", error);
      }
    };

  const handleChange = (e) => {

    const { name, value } = e.target;
    //
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleReactSelect = (name, e) => {
  //   //
  //       setPayload((val) => ({ ...val, [name]: e?.value }));
  //   // setPayload({ ...payload, [name]: e?.value });
  // };


    const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value }));
  };


   const fetchManufacturer = async () => {
      const payLoadList = {};
      try {
        const response = await BindManufacturer(payLoadList);
        if (response?.data) {
          const itemOptions = response.data.map((item) => ({
            value: item.ManufactureID,
            label: item.NAME,
          }));
          setPayload((prevState) => ({
            ...prevState,
            ManufacturerData: itemOptions,
          }));
        }
      } catch (error) {
        console.error("Error fetching item names: ", error);
      }
    };

    useEffect(()=>{
 fetchManufacturer();
//  fetchVendor()
    },[])


    
      useEffect(()=>{
        
        if(payload?.storeType.value){
          fetchVendor(payload?.storeType.value);
      
        }
      },[payload?.storeType.value])
  const handleSearch = async () => {
    try {
      //
      let newPayload = 
      
      
      {
  "gateNo": String(payload?.gateNo?payload?.gateNo:""),
  "fromDate":moment(payload.fromDate).format("YYYY-MM-DD"),
  "toDate":moment(payload.toDate).format("YYYY-MM-DD"),
  "storeType": String( payload?.storeType? payload?.storeType?.value:""),
  "invoiceNo": String( payload?.InvoiceNo? payload?.InvoiceNo:""),
  "grnNo":String( payload?.GRNNo? payload?.GRNNo:""),
  "poNumber": String( payload?.PONo? payload?.PONo:""),
  "manufactureID":String( payload?.manufacturer?.value? payload?.manufacturer?.value:""),
   "grnType": String(payload?.GRNType?.value?payload?.GRNType?.value:""),
  "vendorID": String(payload?.Vendor?.value?payload?.Vendor?.value:"")
}

// {
//   "gateNo": "string",
//   "fromDate": "string",
//   "toDate": "string",
//   "storeType": "string",
//   "invoiceNo": "string",
//   "grnNo": "string",
//   "poNumber": "string",
//   "manufactureID": "string",
//   "grnType": "string",
//   "vendorID": "string"
// }
    
      // let newPayload = {
      //   gateNo: payload?.gateNo,
      //   storeType: payload?.storeType,
      //   fromDate: moment(payload.fromDate).format("YYYY-MM-DD"),
      //   toDate: moment(payload.toDate).format("YYYY-MM-DD"),
      // };

      const response = await SearchGateEntryItem(newPayload);

      if (response?.success && response?.data.length > 0) {
        setTableData(response?.data);
        // notify(response?.message, "success");
      } else {
        setTableData([]);
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleGRNPost = async (val) => {
    try {
      let newPayload = {
        gateNo: val?.GateNo,
      };
      const response = await GateEntryGRNPost(newPayload);

      if (response?.success) {
        notify(response?.message, "success");
        handleSearch();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleGRNunPost = async (val) => {
    try {
      let newPayload = {
        gateNo: val?.GateNo,
      };
      const response = await GateEntryGRNUnPost(newPayload);

      if (response?.success) {
        notify(response?.message, "success");
        handleSearch();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const Reprint = async (GateNO) => {
    const newPayload = {
      gateNo: GateNO,
    };
    try {
      const response = await GateEntryReport(newPayload);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      }
      // console.log("Response",response);
    } catch (error) {
      console.error("Something went wrong", error);
      setValues((val) => ({ ...val, GRNItemListdata: [] }));
    }
  };
   const Tabfunctionality = (e) => {};
 const GetAuthorizationList = async () => {
  
    try {
      const data = await GetAllAuthorization();
      setAuth(data?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
useEffect(()=>{
GetAuthorizationList()
},[])
console.log("auth[0]?.CanUnPostGRN",auth)
  return (
    <div>
      <div className="card mt-2">
        <Heading title={"Create GRN By Gate Entry"} isBreadcrumb={true} />
      </div>
      <div className="card patient_registration border">
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            lable={t("Gate Entry No.")}
            placeholder=" "
            id="gateNo"
            name="gateNo"
            value={payload?.gateNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            // onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Invoice No.")}
            placeholder=" "
            id="InvoiceNo"
            name="InvoiceNo"
            value={payload?.InvoiceNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            // onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("GRN No.")}
            placeholder=" "
            id="GRNNo"
            name="GRNNo"
            value={payload?.GRNNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            // onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("PO No.")}
            placeholder=" "
            id="PONo"
            name="PONo"
            value={payload?.PONo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            // onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          
          


           {/* <Input
            type="text"
            className="form-control"
            lable={t("Consignment No.")}
            placeholder=" "
            id="ConsignmentNo"
            name="Consignment No"
            value={payload?.ConsignmentNo}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            requiredClassName="required-fields"
          /> */}
<ReactSelect
            placeholderName={t("ManuFacturer")}
            id={"manufacturer"}
            searchable={true}
            name={"manufacturer"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100px" }}
            dynamicOptions={payload?.ManufacturerData}
            handleChange={handleReactSelect}
            value={payload?.manufacturer}
            removeIsClearable={false}
          />
<ReactSelect
            placeholderName={t("Vendor")}
            id={"Vendor"}
            searchable={true}
            name={"Vendor"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100px" }}
             dynamicOptions={[
              ...handleReactSelectDropDownOptions(
                DropDownState.BindVendorData,
                "label",
                "VendorID"
              ),
            ]}
            handleChange={handleReactSelect}
            value={payload?.Vendor}
            removeIsClearable={false}
          />
{/*           
          <ReactSelect
            placeholderName={t("Vendor")}
            id={"Vendor"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(
                DropDownState.BindVendorData,
                "label",
                "VendorID"
              ),
            ]}
            name="Vendor"
            handleChange={handleReactSelect}
            value={payload?.Vendor?.value}
            requiredClassName="required-fields"
          /> */}


          {/* <Input
            type="text"
            className="form-control"
            lable={t("Gate Entry No.")}
            placeholder=" "
            id="gateNo"
            name="gateNo"
            value={payload?.gateNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            // onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          /> */}
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"storeType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: " Medical Store", value: "STO00001" },
              { label: "General Store", value: "STO00002" },
            ]}
            name="storeType"
            handleChange={handleReactSelect}
            requiredClassName="required-fields"
            value={payload?.storeType?.value}
          />
            <ReactSelect
          placeholderName={t("GRN Type")}
            id={"GRNType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
         dynamicOptions={[
              { label: t("All"), value: "2" },
              { label: t("Non-Posted"), value: "0" },
              { label: t("Posted"), value: "1" },
              { label: t("Rejected"), value: "3" },
              { label: t("Gate Entry Done"), value: "9" },
            ]}
            name="GRNType"
            handleChange={handleReactSelect}
            value={payload?.GRNType?.value}
            requiredClassName="required-fields"
          />
           {/* <ReactSelect
            placeholderName={t("GRN Type")}
            id={"GRNType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: t("All"), value: "2" },
              { label: t("Non-Posted"), value: "0" },
              { label: t("Posted"), value: "1" },
              { label: t("Rejected"), value: "3" },
            ]}
            name="GRNType"
            handleChange={handleReactSelect}
            value={payload?.GRNType.value}
            requiredClassName="required-fields"
          /> */}
          <DatePicker
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            className="custom-calendar"
            name="fromDate"
            lable={t("From Date")}
            handleChange={(date) => handleChange(date)}
            value={payload?.fromDate}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={"To Date"}
            handleChange={(date) => handleChange(date)}
            value={payload?.toDate}
          />
          <button className="btn btn-primary " onClick={handleSearch}>
            {t("Search")}
          </button>
        </div>
        <div className="table-responsive ">
          {/* {console.log("values?.itemsvalues?.items", values?.items)} */}
          <Tables
            thead={THEAD1}
            tbody={tableData?.map((ele, index) => ({
              sno: index + 1,
              GateNo: ele?.GateEntryNo,
              VendorName: ele?.VendorName,
              StockDate: moment(ele?.StockDate).format("DD-MM-YYYY"),

              GRNno: ele?.GRNno,
              GrnAmt: ele?.GrnAmt,
              GrossAmount: ele?.GrossAmount,
              InvoiceNo: ele?.InvoiceNo,
               PostStatus: t(ele.IsPost === 1 ? "Yes" : "No"),
              postToGrn: (
                <button
                  className="btn btn-primary btn-sm mx-1 px-2"
                  onClick={() => handlePostToGRN(ele)}
                  disabled={ele?.GRNno ? true : false}
                >
                  {t("Post to GRN")}
                </button>
              ),
              post:
                ele?.IsPost === 0 ? (
                  <button
                    className="btn btn-primary btn-sm mx-1 px-2"
                    onClick={() => handleGRNPost(ele)}
                  >
                    {t("Post")}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm mx-1 px-2"
                    onClick={() => handleGRNunPost(ele)}
                    disabled={( auth?.CanUnPostGRN===0 ?true:false)}
                  >
                    {t("UNPost")}
                  </button>
                ),
              view: (
                <i
                  className="fa fa-eye"
                  aria-hidden="true"
                  onClick={() => viewDetails(ele?.GateNo)}
                ></i>
              ),
              "Re-Print": (
                <i
                  className="fa fa-print"
                  aria-hidden="true"
                  onClick={() => Reprint(ele?.GateNo)}
                ></i>
              ),
            }))}
            tableHeight="tableHeight"
            style={{ maxHeight: "auto" }}
          />
        </div>
      </div>

      <div className="card patient_registration mt-4  ">
        <div className="table-responsive ">
          <Tables
            thead={THEAD2}
            tbody={tableData2?.map((ele, index) => ({
              sno: index + 1,
              GRNno: ele?.BillNo,
              ItemName: ele?.ItemName,
              ItemID: ele?.ItemID,
              Quantity: ele?.Quantity,
              Rate: ele?.Rate,
              NetItemAmt: ele?.NetItemAmt,
            }))}
            tableHeight="tableHeight"
            style={{ maxHeight: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGRNByGateEntry;
