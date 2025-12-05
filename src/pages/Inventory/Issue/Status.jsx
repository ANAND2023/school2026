import React, { useState } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { PRSearchPRDetailsPDF } from '../../../networkServices/Purchase'
import store from '../../../store/store'
import { setLoading } from '../../../store/reducers/loadingSlice/loadingSlice'
import { notify } from '../../../utils/utils'
import { RedirectURL } from '../../../networkServices/PDFURL'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { DirectmodifyDirectIssueStatus } from '../../../networkServices/InventoryApi'

const Status = ({ valuesData, setModalData ,handleSearch}) => {
    
        let [t] = useTranslation()
    const [values, setValues] = useState({
        Status: {},
      
    })
 
    const handleReactChange = (name, e) => {
        setValues((val) => ({ ...val, [name]: e }));
    }
       const handleStatus = async (item) => {
    console.log("first",item)
        let payload = 
        
        
      {
      "salesNo":valuesData?.IssueNo,
      "T":values?.Status?.value,
    //   "T":valuesData?.Status==="Accepted"?"R":"A",
    }
        console.log(payload);
    
        let response = await DirectmodifyDirectIssueStatus(payload);
        if (response?.success) {
             setModalData((val) => ({ ...val, visible: false }))
             handleSearch()
          // notify(response?.message, "success");
        //   setIssTabData(response.data);
        } else {
          notify(response?.message, "error");
        }
      };

    // const handleReport = async (e) => {
        
    //     if (values.reportType.value === "0") {
    //         const payloadData = {
    //             "prNo": valuesData?.RequestNo || "",
    //             "item": valuesData?.item ? valuesData?.item : "0",
    //             "employee": valuesData?.raisedUser?.value || "",
    //             "requestType": "0",
    //             // "requestType": valuesData?.requestType.value || "",
    //             "status": valuesData?.status.value,
    //             "purchase": valuesData?.storeType?.value,
    //             "fromDate": valuesData?.RequestNo ? "" :  moment(valuesData?.fromDate).format("DD-MMM-YYYY"),
    //             "toDate": valuesData?.RequestNo ? "" : moment(valuesData?.toDate).format("DD-MMM-YYYY"),
    //             // "subject": "",
    //             "reportType": "1",
    //             "reportFormat": "",
    //             "detailType": "",
    //             "partial": false
    //         };

    //         store.dispatch(setLoading(true));
    //         try {
    //             const response = await PRSearchPRDetailsPDF(payloadData);

    //             if (response?.success === true) {
    //                 notify(response?.message, "success");
    //                 RedirectURL(response?.data);
    //                 setModalData((val) => ({ ...val, visible: false }))
    //             } else {
    //                 notify(response?.message, "error");
    //             }
    //         } catch (error) {
    //             console.log(error, "No Record Found.");
    //         } finally {
    //             store.dispatch(setLoading(false));
    //         }
    //     }
    //     else if (values.reportType.value === "1") {
    //         if(values.reportType2.value==="0"){
    //             const payloadData = {
    //                 "prNo": valuesData?.RequestNo || "",
    //                 "item": valuesData?.item ? valuesData?.item : "0",
    //                 "employee": valuesData?.raisedUser?.value || "",
    //                 "requestType": "0",
    //                 // "requestType": valuesData?.requestType.value || "",
    //                 "status": valuesData?.status.value,
    //                 "purchase": valuesData?.storeType?.value,
    //                 "fromDate": valuesData?.RequestNo ? "" :  moment(valuesData?.fromDate).format("DD-MMM-YYYY"),
    //                 "toDate": valuesData?.RequestNo ? "" : moment(valuesData?.toDate).format("DD-MMM-YYYY"),
    //                 // "subject": "",
    //                 "reportType": "2",
    //                 "reportFormat": "",
    //                 "detailType": "1",
    //                 "partial": false
    //             };
    //             store.dispatch(setLoading(true));
    //             try {
    //                 const response = await PRSearchPRDetailsPDF(payloadData);
    
    //                 if (response?.success === true) {
    //                     notify(response?.message, "success");
    //                     RedirectURL(response?.data);
    //                     setModalData((val) => ({ ...val, visible: false }))
    //                 } else {
    //                     notify(response?.message, "error");
    //                 }
    //             } catch (error) {
    //                 console.log(error, "No Record Found.");
    //             } finally {
    //                 store.dispatch(setLoading(false));
    //             }
    
    //         }
            
    //         else if(values.reportType2.value ==="1"){
    //             const payloadData = {
    //                 "prNo": valuesData?.RequestNo || "",
    //                 "item": valuesData?.item ? valuesData?.item : "0",
    //                 "employee": valuesData?.raisedUser?.value || "",
    //                 "requestType": "0",
    //                 // "requestType": valuesData?.requestType.value || "",
    //                 "status": valuesData?.status.value,
    //                 "purchase": valuesData?.storeType?.value,
    //                 "fromDate": valuesData?.RequestNo ? "" :  moment(valuesData?.fromDate).format("DD-MMM-YYYY"),
    //                 "toDate": valuesData?.RequestNo ? "" : moment(valuesData?.toDate).format("DD-MMM-YYYY"),
    //                 // "subject": "",
    //                 "reportType": "2",
    //                 "reportFormat": "",
    //                 "detailType": "2",
    //                 "partial": false
    //             };
    //             store.dispatch(setLoading(true));
    //             try {
    //                 const response = await PRSearchPRDetailsPDF(payloadData);
    
    //                 if (response?.success === true) {
    //                     notify(response?.message, "success");
    //                     RedirectURL(response?.data);
    //                     setModalData((val) => ({ ...val, visible: false }))
    //                 } else {
    //                     notify(response?.message, "error");
    //                 }
    //             } catch (error) {
    //                 console.log(error, "No Record Found.");
    //             } finally {
    //                 store.dispatch(setLoading(false));
    //             }
    
            
    //         }
    //         }
           
    // };
    return (
        <div>
        <h1>Do You Want To Accept or Reject ?</h1>
            <ReactSelect
                placeholderName={t("Status")}
                searchable={true}
                id={"Status"}
                name={"Status"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={[{
                    label: "Accept", value: "A"
                },
                { label: "Reject", value: "R" }
                ]}
                value={values?.Status.value}
            />

            
            <button className="btn btn-sm btn-primary ml-2" onClick={handleStatus}>
               
                {t("Save")}
            </button>
        </div>
    )
}

export default Status