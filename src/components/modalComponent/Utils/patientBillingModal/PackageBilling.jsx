import React, { useEffect, useState } from "react";
import {
  PatientBillingGetPackage,
  PatientBillingItemPackageSave,
} from "../../../../networkServices/BillingsApi";
import ReactSelect from "../../../formComponent/ReactSelect";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { setLoading } from "../../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../../store/store";

const PackageBilling = ({
  
  data,
  pateintDetails,
  handleModalState,
  GetBindBillDepartment,
}) => {
  debugger
  const [dropDownState, setDropDownState] = useState([]);
  const [packageID, setPackageID] = useState("0");
  const [ledgerTnxRefID, setLedgerTnxRefID] = useState("");
  const ip = useLocalStorage("ip", "get");
// console.log("data",data)
//   useEffect(()=>{
// const re=data?.map((val)=>val?.subRow?.subRowList.filter((i)=>i?.isChecked===true))
// console.log("anand",re)
//   },[data])

// useEffect(() => {
//   const re = data
//     ?.map((val) =>
//       val?.subRow?.subRowList?.filter((i) => i?.isChecked === true)
//     )
//     ?.flat(); // Flatten karta hai nested arrays ko
//   console.log("anand", re);
// }, [data]);

const filteredData = data
  ?.map((val) =>
    val?.subRow?.subRowList?.filter((i) => i?.isChecked === true)
  )
  ?.filter((subList) => subList?.length > 0)
  ?.flat(); // Flatten nested arrays

// 💰 Sum of Amounts
const totalAmount = filteredData?.reduce(
  (sum, item) => sum + (Number(item?.Amount) || 0),
  0
);

console.log("Filtered Items:", filteredData);
console.log("Total Amount:", totalAmount);


  const handlePatientBillingGetPackage = async (TransactionID) => {
    try {
     debugger
      const response = await PatientBillingGetPackage(TransactionID);
       console.log("firstresponse",response)
      setDropDownState([
        { label: "No Package", value: "0" },
        ...handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "ItemID"
        ),
      ]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handlePayload = () => {
    const obj = {
      ltdNo: [],
      ltNo: [],
    };

    for (let i = 0; i < data.length; i++) {
      if (
        data[i]?.subRow?.subRowList?.length > 0 ||
        data[i]?.subRow?.subRowList.some((ele, _) => ele?.isChecked)
      ) {
        for (let j = 0; j < data[i]["subRow"]["subRowList"].length; j++) {
          const subRow = data[i]["subRow"]["subRowList"];
          if (subRow[j]?.["isChecked"] === true) {
            obj.ltNo.push(`'${subRow[j]?.["LedgerTransactionNo"]}'`);
            obj.ltdNo.push(`'${subRow[j]?.["LtNo"]}'`);
          }
        }
      }
    }

    return {
      ltdNo: obj.ltdNo,
      ltNo: obj.ltNo,
    };
  };
const { ltdNo, ltNo } = handlePayload();
console.log("ltdNo",ltdNo)
console.log("ltNo",ltNo)
  const handleSave = async () => {
    // if(!packageID){
    //   notify("Please Select Package","warn")
    //   return
    // }
    store.dispatch(setLoading(true));
    debugger
    try {
      const { ltdNo, ltNo } = handlePayload();
      if (ltdNo.length > 0 && ltNo.length > 0) {
        const requestBody =
        
//         {
//   "ltdNo": "string",
//   "ltNo": "string",
//   "ledgerTnxRefId": "string",
//   "package": "string",
//   "ipAddress": "string"
// }
        {
          ltdNo: ltdNo.join(","),
          ltNo: ltNo.join(","),
          package: String(packageID),
           "ledgerTnxRefId": String(ledgerTnxRefID)||"0",
          ipAddress: String(ip),
        };
        const response = await PatientBillingItemPackageSave(requestBody);
        notify(response?.message, response?.success ? "success" : "error");

        if (response?.success) {
          handleModalState(false, null, null, null, null);
          await GetBindBillDepartment();
        }
      } else {
        notify("Please Select Test", "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
  }, []);
  const handleReactSelectItem = (name, value) => {
    debugger
    console.log(value,name);
    // setPayload((val) => ({ ...val, [name]: value }));
    const packageAmt=value?.HospitalAmt

    if(totalAmount<=packageAmt){
      setPackageID(value?.value);
      setLedgerTnxRefID(value?.LedgerTnxRefID)
    }
    else{
      notify("Selected test amount exceeds the package amount", "warn");
    }

    
//     if(name==="package"){
// setPackageID(name?.value)
//     }
    
  };
  return (
    <div>
      <ReactSelect
      name="package"
        placeholderName={"package"}
        dynamicOptions={dropDownState}
        value={packageID}
        removeIsClearable={true}
        // handleChange={(_, e) => setPackageID(e?.value)}
        handleChange={handleReactSelectItem}
      />

      <div className="d-flex aling-items-center justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PackageBilling;
