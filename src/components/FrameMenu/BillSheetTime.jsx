import React, { useState } from 'react'
import ReactSelect from '../formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { BillingIPDSaveBillSheetTiming, SearchBillSheetTiming } from '../../networkServices/BillingsApi';
import { notify } from '../../utils/ustil2';
import Heading from '../UI/Heading';
import Tables from '../UI/customTable';

const BillSheetTime = ({ data }) => {
  const [values, setValues] = useState({
    BillType: { value: "0", label: "Select" },
  })

  console.log("{ data }", data)
  const [t] = useTranslation();
 const [tableData, setTableData] = useState([
    ]);
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const saveBilling = async () => {
    const payload = {
      "tid": Number(data?.transactionID),
      "billType": Number(values?.BillType?.value)
    }
    try {
      const response = await BillingIPDSaveBillSheetTiming(payload)
      if (response?.success) {
        notify(response?.message, "success")
        getBillingDetails()
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const getBillingDetails = async () => {
   
    try {
      const response = await SearchBillSheetTiming(data?.transactionID)
      console.log("first response",response )
      if (response?.success) {
        notify(response?.message, "success")
         setTableData(response.data);
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  useState(()=>{
getBillingDetails()
  },[])
   const THEAD = [
   
    { name: t("S.No."), width: "3%" },
    { name: t("User Name") },
    { name: t("BillType") },
    { name: t("Entry Date") },
  
  ];
  return (
    <>
      <Heading
        title={t("Bill Type")}
        isBreadcrumb={false}
      />
      <div className="row p-2">

        <ReactSelect
          placeholderName={t("BillType")}
          id={"BillType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            { value: "0", label: "Select" },
            { value: "1", label: "Bill Sheet Record Timing" },
            { value: "2", label: "Provisional Bill Timing" },

          ]}
          handleChange={handleSelect}
          value={`${values?.BillType?.value}`}
          name={"BillType"}
        />
        <button
          className="btn btn-sm btn-success"
          type="button"
          onClick={() => saveBilling()}
        >
          {t("Save")}
        </button>


      </div>
      <div>
          <Heading
        title={t("Bill Type")}
        isBreadcrumb={false}
      />
        <Tables
                  
                      thead={THEAD}
                      tbody={tableData?.map((val, index) => ({
                     
                      sno: index + 1,
                      UserName: val?.UserName,
                        BillType: val?.BillType,
                        EntryDate: val?.EntryDate,
                       
        
                    }))}
        
                    style={{ maxHeight: "23vh" }}
                  />
      </div>
    </>

  )
}

export default BillSheetTime