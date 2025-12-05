import React, { useEffect, useState } from 'react';
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useTranslation } from 'react-i18next';
import { BillingGetIPDPackageAudit, GetIPDPackageAuditDetailsApi, OPDAddOrRemoveIPDPackage } from '../../../networkServices/BillingsApi';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import NestedRowTable from '../../../components/UI/customTable/NestedRowTable';

const ViewPackageDetails = ({ transactionID, selectedPackage ,setSelectedPackage,handlePatientSearchPage,patientDetail,handleGetPharmacyPackageData}) => {
 
     const ip = useLocalStorage("ip", "get");
    const [packageList, setPackageList] = useState([]);
    const [values, setValues] = useState({
        type:   {
                        label: "Add", value: "0"
                    },
    });
     const location = useLocation();
  
    const [t] = useTranslation();
    const [selectedRows, setSelectedRows] = useState([]);

const [totals, setTotals] = useState({ gross: 0, net: 0 });

    const [nestedData, setNestedData] = useState([]);
    const getList = async (val) => {
        const payload = {
            "transactionId": String(transactionID),
            "isPackageType": val
        };
        try {
            const response = await BillingGetIPDPackageAudit(payload);
            if (response?.success) {
                setPackageList(response?.data);
            } else {
                notify(response?.message, "error");
                 setPackageList([]);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getList(values?.type?.value);
    }, [values?.type]);
const calculateTotals = (selectedBills) => {
  const selectedData = packageList.filter(row => selectedBills.includes(row.BillNo));

  const totalGross = selectedData.reduce((sum, row) => sum + (Number(row.GrossAmount) || 0), 0);
  const totalNet = selectedData.reduce((sum, row) => sum + (Number(row.NetAmount) || 0), 0);

  setTotals({ gross: totalGross, net: totalNet });
};

    const handleReactSelect = (name, e) => {
        setValues((preV) => ({
            ...preV,
            [name]: e,
        }));
    };

    // const handleSelectAll = (e) => {
    //     if (e.target.checked) {
    //         setSelectedRows(packageList.map(row => row.BillNo));
    //     } else {
    //         setSelectedRows([]);
    //     }
    // };
const handleSelectAll = (e) => {
  if (e.target.checked) {
    const allBills = packageList.map(row => row.BillNo);
    setSelectedRows(allBills);
    calculateTotals(allBills);
  } else {
    setSelectedRows([]);
    calculateTotals([]);
  }
};

    // const handleRowSelect = (e, billNo) => {
    //     if (e.target.checked) {
    //         setSelectedRows(prev => [...prev, billNo]);
    //     } else {
    //         setSelectedRows(prev => prev.filter(rowBillNo => rowBillNo !== billNo));
    //     }
    // };
    const handleRowSelect = (e, billNo) => {
  let updatedSelection;
  if (e.target.checked) {
    updatedSelection = [...selectedRows, billNo];
  } else {
    updatedSelection = selectedRows.filter(rowBillNo => rowBillNo !== billNo);
  }
  setSelectedRows(updatedSelection);
  calculateTotals(updatedSelection);
};


    const handleCallApi=async(e,data,index,isOpen)=>{
        e.preventDefault();
        if(isOpen === true){
            handleClickEdit(index,isOpen)
            // setNestedData([])
            return
        }
        try{

            const response=await GetIPDPackageAuditDetailsApi(data?.LedgertransactionNo)
            if(response?.success){
                handleClickEdit(index,isOpen)
                // setNestedData(response?.data);
                   setNestedData((prev) => ({
        ...prev,
        [data.BillNo]: response?.data,  // store nested data for this specific bill
      }));
            }else{
                notify(response?.message,"error")
            }
        }catch(error){
            notify(errro?.message,"error")
        }
    }
    const handleSave = async() => {
        
         const selectedData = packageList.filter(row => selectedRows.includes(row.BillNo));
        if(selectedPackage?.length<=0){
notify("Please Select Package","warn")
return
        }
        if(!selectedData?.length){
notify("Please Select packageList","warn")
return
        }
       
     
        // You can now use selectedData as an array of objects for further processing\
        const payload={
  "arlt": packageList.filter(row => selectedRows.includes(row.BillNo))?.map((val)=>({
    ledgerTransactionNo:val?.LedgertransactionNo
  }))
  ,

//   "transactionId": Number(values?.type?.value==="1"?"0":selectedPackage[0]?.TransactionID),
  "ledgerTnxId":Number(values?.type?.value==="1"?"0":selectedPackage[0]?.LedgerTnxId),
  "packageID":Number(values?.type?.value==="1"?"0":selectedPackage[0]?.PackageID),
  "transactionId": Number(selectedPackage[0]?.TransactionID),
//   "ledgerTnxId":Number(selectedPackage[0]?.LedgerTnxId),
//   "packageID":Number(selectedPackage[0]?.PackageID),
  "packageType": Number(values?.type?.value),
  "pageURL":  location?.pathname ? String(location?.pathname) : "",
  "ipAddress": String(ip),
  "packageAmount": Number(selectedPackage[0]?.PharmacyAmt),
}
        try {
            const response=await OPDAddOrRemoveIPDPackage(payload)
            if(response?.success){
                notify(response?.message,"success")
                handleGetPharmacyPackageData(patientDetail)
                 setSelectedPackage([]);
                 setSelectedRows([]);
                  getList(values?.type?.value);

                //   handlePatientSearchPage()
            }
            else{
                 notify(response?.message,"error")
            }
        } catch (error) {
            console.log("error",error)
        }
    };

    const thead = [
          {
            width: "1%",
            name: "sn"
        },
        {
            width: "5%",
            name: "Action"
        },
      
        {
            width: "5%",
            name: (
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={packageList.length > 0 && selectedRows.length === packageList.length}
                />
            ),
        },
        { width: "2%", name: t("BillNo") },
        { width: "15%", name: t("BillDate") },
        { width: "15%", name: t("GrossAmount") },
        { width: "15%", name: t("NetAmount") },
    ];

    const seondThead = [
       { width: "2%", name: t("S.No") },
       { width: "2%", name: t("ItemName") },
       { width: "2%", name: t("ItemID") },
       { width: "2%", name: t("Rate") },
       { width: "2%", name: t("Quantity") },
       { width: "2%", name: t("Amount") },
    
    ]
    const handleClickEdit = (index, isopen) => {

            let tbody = JSON.parse(JSON.stringify(packageList));

            tbody[index]["isOpen"] = !isopen;
            setPackageList(tbody)

        }
 


    
    return (
        <div className='card'>
            <Heading title={t("Search Bill List")} />
            <div className='p-2'>
                <ReactSelect
                placeholderName={t("type")}
                id="type"
                name="type"
                value={values?.type?.value}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactSelect(name, e)}
                dynamicOptions={[
                    
                    {
                        label: "Add", value: "0"
                    },
                    {
                        label: "Remove", value: "1"
                    },
                ]}
                searchable={true}
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            />
            </div>
{selectedRows.length > 0 && (
  <div
    className=" rounded-4 shadow-sm text-white d-flex  gap-4 flex-wrap"
    // style={{
    //   background: "linear-gradient(90deg, #00b4db, #0083b0)",
    // }}
  >
    <div className="px-3 py-2 rounded-3 bg-white text-dark shadow-sm">
      <div className="fw-semibold text-secondary text-bold">Total Gross Amount</div>
      <div className="fs-5 fw-bold text-success">{totals.gross.toFixed(2)}</div>
    </div>
    <div className="px-3 py-2 rounded-3 bg-white text-dark shadow-sm">
      <div className="fw-semibold text-secondary text-bold">Total Net Amount</div>
      <div className="fs-5 fw-bold text-primary">{totals.net.toFixed(2)}</div>
    </div>
  </div>
)}


            <div>
                <div className=" mt-2 spatient_registration_card">
                    {packageList.length > 0 ? (
                        <>
                            <Heading title={t("Bill List")} isBreadcrumb={false} />
                            {/* <Tables
                                thead={thead}
                                tbody={packageList?.map((val, index) => ({
                                    Action:(
                                        <button className='btn btn-primary'  onClick={(e)=>handleCallApi(e,val)}>
                                            <i className="fa fa-plus py-1 " aria-hidden="true"></i>
                                        </button>
                                    ),
                                    Checkbox: (
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(val.BillNo)}
                                            onChange={(e) => handleRowSelect(e, val.BillNo)}
                                        />
                                    ),
                                    BillNo: val.BillNo,
                                    BillDate: val.BillDate || "",
                                    GrossAmount: val.GrossAmount || "",
                                    NetAmount: val.NetAmount || "",
                                      Items:
                                    expandedRow === val.BillNo && nestedData[val.BillNo] ? (
                                        <table className="table table-sm table-bordered my-2">
                                        <thead>
                                            <tr>
                                            <th>Item Name</th>
                                            <th>Rate</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nestedData[val.BillNo]?.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.ItemName}</td>
                                                <td>{item.Rate}</td>
                                                <td>{item.Quantity}</td>
                                                <td>{item.Amount}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    ) : null
                                }))}
                                style={{ maxHeight: "27vh" }}
                                // tableHeight={"scrollView"}
                            /> */}

                            <NestedRowTable
                                thead={thead}
                                seondThead={seondThead}
                                tbody={packageList?.map((val, index) => ({
                                    sn:index+1,
                                    Action:(
                                   <span onClick={(e) => { handleCallApi(e,val, index, val?.isOpen) }}>
                                             {val?.isOpen == true ? <i className="fa fa-minus" aria-hidden="true"></i> : <span className='d-flex  align-items-center'>
                                                 <i className="fa fa-plus" aria-hidden="true"></i>
                                             </span>
                                             }
                                      </span>
                                    ),
                                    Checkbox: (
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(val.BillNo)}
                                            onChange={(e) => handleRowSelect(e, val.BillNo)}
                                        />
                                    ),
                                    BillNo: val.BillNo,
                                    BillDate: val.BillDate || "",
                                    GrossAmount: val.GrossAmount || "",
                                    NetAmount: val.NetAmount || "",
                                 
                                    // subRow: {
                                    //     subRowList:
                                    //     nestedData?.length > 0 ? 
                                    //     nestedData.map((item, ind) => ({
                                            
                                    //     SNo:<span>{ind+1}</span>,
                                    //     ItemName: <span>{item?.ItemName}</span>,
                                    //     ItemID: <span>{item?.ItemID}</span>,
                                    //     Rate: <span>{item?.Rate.toFixed(2)}</span>,
                                    //     Quantity: <span>{item?.Quantity.toFixed(2)}</span>,
                                    //     Amount: <span>{item?.Amount.toFixed(2)}</span>,
                                    //     })):[],
                                    //     isopen:val?.isOpen
                                    // }
                                    subRow: {
  subRowList: 
    nestedData[val.BillNo]?.length > 0
      ? nestedData[val.BillNo].map((item, ind) => ({
          SNo: <span>{ind + 1}</span>,
          ItemName: <span>{item?.ItemName}</span>,
          ItemID: <span>{item?.ItemID}</span>,
          Rate: <span>{item?.Rate?.toFixed(2)}</span>,
          Quantity: <span>{item?.Quantity?.toFixed(2)}</span>,
          Amount: <span>{item?.Amount?.toFixed(2)}</span>,
        }))
      : [],
  isopen: val?.isOpen,
}
                                }))}
                                tableHeight={"scrollView"}
                                />


                              <div className="d-flex justify-content-end pt-2">
    
                            <button  className="btn btn-sn btn-success" onClick={handleSave}>Save</button>
                        
                        </div></>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewPackageDetails;



// import React, { useEffect, useState } from 'react'
// import Heading from '../../../components/UI/Heading'
// import ReactSelect from '../../../components/formComponent/ReactSelect'
// import { useTranslation } from 'react-i18next'
// import { BillingGetIPDPackageAudit } from '../../../networkServices/BillingsApi'
// import { notify } from '../../../utils/ustil2'
// import Tables from '../../../components/UI/customTable'

// const ViewPackageDetails = ({ transactionID ,selectedPackage}) => {
    
//     console.log("transactionID", transactionID)
//     const [packageList, setPackageList] = useState([])
//     const [values, setValues] = useState({
//         type: {label: "Select", value: ""},
//     })
//     console.log("values", values)
//     const [t] = useTranslation();


//     const getList = async (val) => {
//         const payload = {
//             "transactionId": String(transactionID),
//             "isPackageType": val
//         }
//         try {
//             const response = await BillingGetIPDPackageAudit(payload)
//             if (response?.success) {
//                 setPackageList(response?.data)
//             }
//             else{
//                 notify(response?.message,"error")
//             }
//         } catch (error) {
//             console.log("error", error)
//         }
//     }

//     useEffect(() => {
//         getList(values?.type?.value)
//     }, [values?.type])
//     const handleReactSelect = (name, e) => {

//         setValues((preV) => ({
//             ...preV,
//             [name]: e

//         }))

       
//     }

//     const thead= [
//     { width: "5%", name: t("BillNo") },
//     { width: "5%", name: t("BillDate") },
//     { width: "5%", name: t("GrossAmount") },
//     { width: "5%", name: t("NetAmount") },
   
//   ];

//     return (
//         <div>
//             <Heading title={t("Package List")} />
//             <ReactSelect
//                 placeholderName={t("type")}
//                 id="type"
//                 name="type"
//                 value={values?.type?.value}
//                 removeIsClearable={true}
//                 handleChange={(name, e) => handleReactSelect(name, e)}
//                 dynamicOptions={[
//                     {
//                         label: "Select", value: ""
//                     },
//                     {
//                         label: "Add", value: "0"
//                     },
//                     {
//                         label: "Remove", value: "1"
//                     },
//                 ]}
//                 searchable={true}
//                 respclass="col-xl-2 col-md-2 col-sm-6 col-12"
//             />


//             <div>
//                  <div className=" mt-2 spatient_registration_card">
//               {packageList.length > 0 ? (
//                 <>
//                   <Heading title={t("Request Details")} isBreadcrumb={false} />
//                   <Tables
//                     thead={thead}
//                     tbody={packageList?.map((val, index) => ({
//                       BillNo: val.BillNo,
//                       BillDate: val.BillDate || "",
//                       GrossAmount: val.GrossAmount || "",
//                       NetAmount: val.NetAmount || "",
                     
//                     }))}
//                     style={{ maxHeight: "27vh" }}
//                      tableHeight={"scrollView"}
//                   />
//                   <button>Save</button>
//                 </>
//               ) : (
//                 ""
//               )}
//             </div>
//             </div>
//         </div>
//     )
// }

// export default ViewPackageDetails