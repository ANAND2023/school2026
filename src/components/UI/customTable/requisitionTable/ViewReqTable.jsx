import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../NestedRowTable";
import { ReprintSVG } from "../../../SvgIcons";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import {
  PrintRequisition,
  ViewIndent,
} from "../../../../networkServices/InventoryApi";
import { notify } from "../../../../utils/utils";
import { BillingIPDIssueIndentAccept, MedicineRequisitionReGen } from "../../../../networkServices/pharmecy";

const ViewReqTable = ({ tbody, handleCallViewMedReq, payload, Tid,ViewReqTable }) => {
// const ViewReqTable = ({ tbody, tableHeight, payload, Tid,ViewReqTable }) => {
  // 
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState([]);
  const [internalTbody, setInternalTbody] = useState([]); // Local state for table data
  const [checkedItems, setCheckedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAnyRowOpen, setIsAnyRowOpen] = useState(false);
console.log("checkedItems",checkedItems)
console.log("isAllSelected",isAllSelected)
  // Initialize internal state when the tbody prop changes
  useEffect(() => {
    // We add the 'isopen' property here if it doesn't exist to manage the toggle state locally
    setInternalTbody(
      tbody.map((row) => ({ ...row, isopen: !!row.isopen }))
    );
    // When tbody changes, reset selections
    setCheckedItems({});
  }, [tbody]);

  const thead = [
    { name: t("SNo"), width: "1%" },
    { name: t("Requisition Date"), width: "10%" },
    t("Requisition No"),
    t("Department From"),
    t("RaisedBy"),
    { name: t("Print"), width: "1%" },
    { name: "View", width: "1%" },
    { name: "ReGen", width: "1%" },
  ];

  // Header for tables WITHOUT checkboxes
  const seondThead = [
    { name: t("SNo"), width: "1%" },
    t("Department From"),
    t("DepartmentTo"),
    { name: "Item Name", width: "1%" },

    { name: "Unit Type", width: "1%" },
    { name: t("Requested Qty"), width: "1%" },
    { name: t("Received Qty"), width: "1%" },
    { name: t("Pending Qty"), width: "1%" },
    { name: t("Rejected Qty"), width: "1%" },
    { name: "Narration", width: "1%" },
    { name: "Date", width: "1%" },
  ];

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newCheckedItems = {};
    if (isChecked) {
      internalTbody.forEach((row, parentIndex) => {
        if (row.isopen && row.SecondBodyDataList) {
          row.SecondBodyDataList.forEach((_, childIndex) => {
            const uniqueId = `${parentIndex}-${childIndex}`;
            newCheckedItems[uniqueId] = true;
          });
        }
      });
    }
    setCheckedItems(newCheckedItems);
  };

  // Header for tables WITH checkboxes (now only for "MI")
  const thirdThead = [
    {
      name: ("Select"
        // <input
        //   type="checkbox"
        //   checked={isAllSelected}
        //   onChange={handleSelectAll}
        //   disabled={!isAnyRowOpen} // Disable if no rows are open
        // />
      ),
      width: "1%",
    },
    { name: t("S.No."), width: "1%" },
    { name: t("Department From"), width: "15%" },
    t("Item Name"),
        { name: "Subtitute Name", width: "1%" },
    { name: t("AvailQty"), width: "15%" },
    { name: t("RequestedQty"), width: "15%" },
    { name: t("ReceiveQty"), width: "15%" },
    { name: t("PendingQty"), width: "15%" },
    { name: t("RejectQty"), width: "15%" },
    { name: t("ApprovedBy"), width: "15%" },
    { name: t("AcknowledgmentBy"), width: "15%" },
    { name: t("Acknowledgment Date"), width: "15%" },
    { name: t("IssueAcceptingBy"), width: "15%" },
   
    { name: "Narration", width: "15%" },
    { name: "Date", width: "15%" },
  ];

  const handleCheckboxChange = (uniqueId) => {
    setCheckedItems((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const handleSave = async () => {
    const selectedData = [];
    internalTbody.forEach((val, index) => {
      val.SecondBodyDataList?.forEach((item, i) => {
        if (checkedItems[`${index}-${i}`]) {
          selectedData.push({
            indentNo: item?.indentNo,
            itemID: item?.itemID,
          });
        }
      });
    });

    console.log("selectedData", selectedData);
    if (selectedData.length <= 0) {
      notify(`Please Select atleast one item`, "warn");
      return;
    }
    
    const response = await BillingIPDIssueIndentAccept(selectedData);

    if (response?.success) {
      notify(response?.message, "success");
      handleClickEdit("", "", false)
      // TODO: Add logic to refetch or update the UI after a successful save
    } else {
      notify(response?.message, "error");
    }
  };

  const handleClickEdit = async (val, index, isopen) => {
    
    const updatedTbody = [...internalTbody];
    const currentItem = updatedTbody[index];

    if (!isopen && !currentItem.SecondBodyDataList) {
      const IndentNo = val?.IndentNo;
      const Status = val?.StatusNew ? val?.StatusNew : "Open";
      const Type = payload?.Type;
      const TID = Tid;
      const apiResp = await ViewIndent(IndentNo, Status, Type, TID);

      if (apiResp?.success) {
        currentItem.SecondBodyDataList = apiResp?.data?.dtnew;
      } else {
        notify(apiResp?.message, "error");
      }
    }

    currentItem.isopen = !isopen;
    setInternalTbody(updatedTbody);
  };

   const getData=()=>{
    
       const bindBodyData = () => {
      let list = [];
      internalTbody?.forEach((val, index) => {
        let secondTbody = [];
          let hasSelectedChild = false;
        if (val.isopen && val.SecondBodyDataList) {
          val.SecondBodyDataList.forEach((item, i) => {
            const uniqueId = `${index}-${i}`;
            let obj;
            // CORRECTED: Checkbox view is now ONLY for "MI" type
            if (payload?.Type === "MI") {
              
              obj = {
                check: (
                  // val?.issueAccepting ?
                  Number(item?.receiveQty)> 0 ?
   <input
                    type="checkbox"
                    checked={!!checkedItems[uniqueId]}
                    onChange={() => handleCheckboxChange(uniqueId)}
                  />
                  : ""
              
                ),
                sno: i + 1,
                deptFrom: item?.deptFrom,
                itemName: item?.itemName,
                subtituteItemName: item?.subtituteItemName,
                availQty: item?.availQty,
                reqQty: <div className="text-right">{item?.reqQty}</div>,
              
                receiveQty: item?.receiveQty,
                pendingQty: item?.pendingQty,
                rejectQty: item?.rejectQty,
                approvedBy: item?.approvedBy,
                acknowledgmentBy: item?.acknowledgmentBy,
                acknowledgmentDate: item?.acknowledgmentDate,
                issueAcceptingBy: item?.issueAcceptingBy,
                narration: item?.narration,
                DATE: item?.date,
              };
               if (checkedItems[uniqueId]) {
              hasSelectedChild = true;
            }
            } else {
              // All other types get the detailed, non-checkbox view
              obj = {
                sno: i + 1,
                deptFrom: item?.deptFrom,
                deptTo: item?.deptTo,
                itemName: item?.itemName,
                unitType: item?.unitType,
                reqQty: item?.reqQty,
                receiveQty: item?.receiveQty,
                pendingQty: item?.pendingQty,
                rejectQty: item?.rejectQty,
                Narration: item?.narration,
                DATE: item?.date,
              };
            }
            secondTbody.push(obj);
          });
        }
        let obj = {
          sno: index + 1,
          dtentry: val?.dtentry,
          IndentNo: val?.IndentNo,
          Deptfrom: val?.Deptfrom,
          EmpName: val?.EmpName,
          print: (<span onClick={() => handleClickReport(val)}> <ReprintSVG /> </span>),
          index: (
            <span onClick={() => handleClickEdit(val, index, val.isopen)}>
              {val.isopen ? (<i className="fa fa-minus" aria-hidden="true"></i>) 
                           : (<i className="fa fa-plus" aria-hidden="true"></i>)}
            </span>
          ),
          subRow: { subRowList: secondTbody, isopen: val.isopen },
           ReGen: (
          <span onClick={() => hasSelectedChild && handleReGen(val)}>
            <button
              className="btn btn-primary"
              disabled={!hasSelectedChild} // ✅ Enable only if child selected
            >
              ReGen
            </button>
          </span>
        ),
          //  ReGen: (<span onClick={() => handleReGen(val)}><button className="btn btn-primary">ReGen</button></span>),
        };
        list.push(obj);
      });
      setBodyData(list);
    };

    bindBodyData();

    // Update derived states
    const anyOpen = internalTbody.some(row => row.isopen);
    setIsAnyRowOpen(anyOpen);

    const allVisibleItems = [];
    if (payload?.Type === "MI") {
        internalTbody.forEach((row, parentIndex) => {
            if (row.isopen && row.SecondBodyDataList) {
                row.SecondBodyDataList.forEach((_, childIndex) => {
                    allVisibleItems.push(`${parentIndex}-${childIndex}`);
                });
            }
        });
    }

    const allChecked = allVisibleItems.length > 0 && allVisibleItems.every(id => checkedItems[id]);
    setIsAllSelected(allChecked);

  }
  const handleClickReport = async (val) => {
    debugger
    const IndentNo = val?.IndentNo;
    const Status = val?.StatusNew ? val?.StatusNew : "Open";
    const Type = payload?.Type;
    let apiResp = await PrintRequisition(IndentNo, Status, Type , val?.TransactionID);
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error");
    }
  };



console.log("internalTbody",internalTbody)
console.log("checkedItems",checkedItems)
    const handleReGen = async (val) => {
      
      if(!checkedItems || Object?.keys(checkedItems)?.length==0){
  notify(`Please Select atleast one item`, "warn");
      return;
      }
      console.log("valllll",val)
    const payload = {
  "indentNo": val?.IndentNo,
  "transactionID": val?.TransactionID,
  "itemList":[]
}
    
    // [];
    internalTbody.forEach((val, index) => {
      
      val.SecondBodyDataList?.forEach((item, i) => {
        
        console.log("ittem",item)
        if (checkedItems[`${index}-${i}`]) {
          payload.itemList?.push({
            itemId: item?.itemID,
         
          });
        }
      });
    });


//    const submitData= {
//   "indentNo": "string",
//   "transactionID": "string",
//   "itemList":payload
// }

    console.log("payload", payload);
    if (payload.length <= 0) {
      notify(`Please Select atleast one item`, "warn");
      return;
    }
    
    const response = await MedicineRequisitionReGen(payload);

    if (response?.success) {
      
        handleCallViewMedReq()()
      notify(response?.message, "success");
      setCheckedItems({})
      // getData()
      // handleClickEdit("", "", false)
      // TODO: Add logic to refetch or update the UI after a successful save
    } else {
      notify(response?.message, "error");
    }
  };


  // const handleReGen=async(val)=>{
  //   console.log("val",val)
  //   const payload={
  //     indentNo:val?.IndentNo,
  //     transactionID:val?.TransactionID
  //   }
  //   try {
  //     const response=await MedicineRequisitionReGen(payload)
  //     if(response?.success){
  //       notify(response?.message,"success")
  //       // getData()
  //       handleCallViewMedReq()
  //     }
  //   } catch (error) {
  //     console.log("error",error)
  //   }
  // }

  const getRowClass = (val, index) => {
    if (!internalTbody || !internalTbody[index]) {
      return "";
    }
    const status = internalTbody[index]?.StatusNew;
    switch (status) {
      case "Open": return "md-record-RequisitionDone";
      case "Closed": return "md-record-PendingRequisition";
      case "Reject": return "md-record-Completed";
      case "Partial": return "md-record-Running";
      default: return "";
    }
  };


 
  useEffect(() => {
  //   const bindBodyData = () => {
  //     let list = [];
  //     internalTbody?.forEach((val, index) => {
  //       let secondTbody = [];
  //       if (val.isopen && val.SecondBodyDataList) {
  //         val.SecondBodyDataList.forEach((item, i) => {
  //           const uniqueId = `${index}-${i}`;
  //           let obj;
  //           // CORRECTED: Checkbox view is now ONLY for "MI" type
  //           if (payload?.Type === "MI") {
  //             
  //             obj = {
  //               check: (
  //                 // val?.issueAccepting ?
  //                 Number(item?.receiveQty)> 0 ?
  //  <input
  //                   type="checkbox"
  //                   checked={!!checkedItems[uniqueId]}
  //                   onChange={() => handleCheckboxChange(uniqueId)}
  //                 />
  //                 : ""
              
  //               ),
  //               sno: i + 1,
  //               deptFrom: item?.deptFrom,
  //               itemName: item?.itemName,
  //               availQty: item?.availQty,
  //               reqQty: <div className="text-right">{item?.reqQty}</div>,
              
  //               receiveQty: item?.receiveQty,
  //               pendingQty: item?.pendingQty,
  //               rejectQty: item?.rejectQty,
  //               approvedBy: item?.approvedBy,
  //               acknowledgmentBy: item?.acknowledgmentBy,
  //               acknowledgmentDate: item?.acknowledgmentDate,
  //               issueAcceptingBy: item?.issueAcceptingBy,
  //               narration: item?.narration,
  //               DATE: item?.date,
  //             };
  //           } else {
  //             // All other types get the detailed, non-checkbox view
  //             obj = {
  //               sno: i + 1,
  //               deptFrom: item?.deptFrom,
  //               deptTo: item?.deptTo,
  //               itemName: item?.itemName,
  //               unitType: item?.unitType,
  //               reqQty: item?.reqQty,
  //               receiveQty: item?.receiveQty,
  //               pendingQty: item?.pendingQty,
  //               rejectQty: item?.rejectQty,
  //               Narration: item?.narration,
  //               DATE: item?.date,
  //             };
  //           }
  //           secondTbody.push(obj);
  //         });
  //       }
  //       let obj = {
  //         sno: index + 1,
  //         dtentry: val?.dtentry,
  //         IndentNo: val?.IndentNo,
  //         Deptfrom: val?.Deptfrom,
  //         EmpName: val?.EmpName,
  //         print: (<span onClick={() => handleClickReport(val)}> <ReprintSVG /> </span>),
  //         index: (
  //           <span onClick={() => handleClickEdit(val, index, val.isopen)}>
  //             {val.isopen ? (<i className="fa fa-minus" aria-hidden="true"></i>) 
  //                          : (<i className="fa fa-plus" aria-hidden="true"></i>)}
  //           </span>
  //         ),
  //         subRow: { subRowList: secondTbody, isopen: val.isopen },
  //          ReGen: (<span onClick={() => handleReGen(val)}><button className="btn btn-primary">ReGen</button></span>),
  //       };
  //       list.push(obj);
  //     });
  //     setBodyData(list);
  //   };

  //   bindBodyData();

  //   // Update derived states
  //   const anyOpen = internalTbody.some(row => row.isopen);
  //   setIsAnyRowOpen(anyOpen);

  //   const allVisibleItems = [];
  //   if (payload?.Type === "MI") {
  //       internalTbody.forEach((row, parentIndex) => {
  //           if (row.isopen && row.SecondBodyDataList) {
  //               row.SecondBodyDataList.forEach((_, childIndex) => {
  //                   allVisibleItems.push(`${parentIndex}-${childIndex}`);
  //               });
  //           }
  //       });
  //   }

  //   const allChecked = allVisibleItems.length > 0 && allVisibleItems.every(id => checkedItems[id]);
  //   setIsAllSelected(allChecked);
getData()
  }, [internalTbody, checkedItems, payload?.Type]); // Rerun when these dependencies change

  return (
    <>
      <NestedRowTable
      // tableHeight="20vh"
      style={{
        height:"40vh"
      }}
        thead={thead}
        // CORRECTED: Use thirdThead (with checkbox) only for "MI" type
        seondThead={payload?.Type === "MI" ? thirdThead : seondThead}
        tbody={bodyData}
        // tableHeight={tableHeight}
        getRowClass={getRowClass}
        scrollView={"scrollView"}
      />
      {/* CORRECTED: Show Save button only for "MI" type when a row is open */}
      {/* {payload?.Type === "MI" && isAnyRowOpen && Object.values(checkedItems).some(Boolean) && (
        <div style={{ textAlign: "right", padding: "10px" }}>
          <button className="btn btn-primary" onClick={handleSave}>
            {t("Save")}
          </button>
        </div>
      )} */}
    </>
  );
};

export default ViewReqTable;




// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import NestedRowTable from "../NestedRowTable";
// import { ReprintSVG } from "../../../SvgIcons";
// import { RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   PrintRequisition,
//   ViewIndent,
// } from "../../../../networkServices/InventoryApi";
// import { notify } from "../../../../utils/utils";
// import { BillingIPDIssueIndentAccept } from "../../../../networkServices/pharmecy";

// const ViewReqTable = ({ tbody, tableHeight, payload, Tid }) => {
//   const [t] = useTranslation();
//   const [bodyData, setBodyData] = useState([]);
//   const [internalTbody, setInternalTbody] = useState([]); // Local state for table data
//   const [checkedItems, setCheckedItems] = useState({});
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const [isAnyRowOpen, setIsAnyRowOpen] = useState(false);

//   // Initialize internal state when the tbody prop changes
//   useEffect(() => {
//     // We add the 'isopen' property here if it doesn't exist to manage the toggle state locally
//     setInternalTbody(
//       tbody.map((row) => ({ ...row, isopen: !!row.isopen }))
//     );
//     // When tbody changes, reset selections
//     setCheckedItems({});
//   }, [tbody]);

//   const thead = [
//     { name: t("SNo"), width: "1%" },
//     { name: t("Requisition Date"), width: "10%" },
//     t("Requisition No"),
//     t("Department From"),
//     t("RaisedBy"),
//     { name: t("Print"), width: "1%" },
//     { name: "View", width: "1%" },
//   ];

//   // Header for tables WITHOUT checkboxes
//   const seondThead = [
//     { name: t("SNo"), width: "1%" },
//     t("Department From"),
//     t("DepartmentTo"),
//     { name: "Item Name", width: "1%" },
//     { name: "Unit Type", width: "1%" },
//     { name: t("Requested Qty"), width: "1%" },
//     { name: t("Received Qty"), width: "1%" },
//     { name: t("Pending Qty"), width: "1%" },
//     { name: t("Rejected Qty"), width: "1%" },
//     { name: "Narration", width: "1%" },
//     { name: "Date", width: "1%" },
//   ];
  
//   const handleSelectAll = (e) => {
//     const isChecked = e.target.checked;
//     const newCheckedItems = {};
//     if (isChecked) {
//       internalTbody.forEach((row, parentIndex) => {
//         if (row.isopen && row.SecondBodyDataList) {
//           row.SecondBodyDataList.forEach((_, childIndex) => {
//             const uniqueId = `${parentIndex}-${childIndex}`;
//             newCheckedItems[uniqueId] = true;
//           });
//         }
//       });
//     }
//     setCheckedItems(newCheckedItems);
//   };
  
//   // Header for tables WITH checkboxes (for MI and MR)
//   const thirdThead = [
//     {
//       name: (
//         <input
//           type="checkbox"
//           checked={isAllSelected}
//           onChange={handleSelectAll}
//           disabled={!isAnyRowOpen} // Disable if no rows are open
//         />
//       ),
//       width: "1%",
//     },
//     { name: t("S.No."), width: "1%" },
//     { name: t("Department From"), width: "15%" },
//     t("Item Name"),
//     { name: t("RequestedQty"), width: "15%" },
//     { name: "Narration", width: "15%" },
//     { name: "Date", width: "15%" },
//   ];

//   const handleCheckboxChange = (uniqueId) => {
//     setCheckedItems((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
//   };

//   const handleSave = async () => {
//     const selectedData = [];
//     internalTbody.forEach((val, index) => {
//       val.SecondBodyDataList?.forEach((item, i) => {
//         if (checkedItems[`${index}-${i}`]) {
//           selectedData.push({
//             indentNo: item?.indentNo,
//             itemID: item?.itemID,
//           });
//         }
//       });
//     });

//     console.log("selectedData", selectedData);
//     if (selectedData.length <= 0) {
//       notify(`Please Select atleast one item`, "warn");
//       return;
//     }

//     const response = await BillingIPDIssueIndentAccept(selectedData);

//     if (response?.success) {
//       notify(response?.message, "success");
//       // TODO: Add any logic needed after a successful API call, like refetching data
//     } else {
//       notify(response?.message, "error");
//     }
//   };

//   const handleClickEdit = async (val, index, isopen) => {
//     // Create a new array to avoid direct mutation
//     const updatedTbody = [...internalTbody];
//     const currentItem = updatedTbody[index];

//     // If we are opening a row that doesn't have data yet, fetch it
//     if (!isopen && !currentItem.SecondBodyDataList) {
//       const IndentNo = val?.IndentNo;
//       const Status = val?.StatusNew ? val?.StatusNew : "Open";
//       const Type = payload?.Type;
//       const TID = Tid;
//       const apiResp = await ViewIndent(IndentNo, Status, Type, TID);

//       if (apiResp?.success) {
//         currentItem.SecondBodyDataList = apiResp?.data?.dtnew;
//       } else {
//         notify(apiResp?.message, "error");
//       }
//     }

//     // Toggle the open state and update the state
//     currentItem.isopen = !isopen;
//     setInternalTbody(updatedTbody);
//   };

//   const handleClickReport = async (val) => {
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     let apiResp = await PrintRequisition(IndentNo, Status, Type);
//     if (apiResp?.success) {
//       RedirectURL(apiResp?.data?.pdfUrl);
//     } else {
//       notify(apiResp?.message, "error");
//     }
//   };

//   const getRowClass = (val, index) => {
//     if (!internalTbody || !internalTbody[index]) {
//       return "";
//     }
//     const status = internalTbody[index]?.StatusNew;
//     switch (status) {
//       case "Open":
//         return "md-record-RequisitionDone";
//       case "Closed":
//         return "md-record-PendingRequisition";
//       case "Reject":
//         return "md-record-Completed";
//       case "Partial":
//         return "md-record-Running";
//       default:
//         return "";
//     }
//   };

//   // This single, comprehensive useEffect handles all UI updates.
//   // It runs when the source data, toggle state, or selection state changes.
//   useEffect(() => {
//     const bindBodyData = () => {
//       let list = [];
//       internalTbody?.forEach((val, index) => {
//         let secondTbody = [];
//         if (val.isopen && val.SecondBodyDataList) {
//           val.SecondBodyDataList.forEach((item, i) => {
//             const uniqueId = `${index}-${i}`;
//             let obj;
//             // If type is MI or MR, show the table with checkboxes
//             if (payload?.Type === "MI" || payload?.Type === "MR") {
//               obj = {
//                 check: (
//                   <input
//                     type="checkbox"
//                     checked={!!checkedItems[uniqueId]}
//                     onChange={() => handleCheckboxChange(uniqueId)}
//                   />
//                 ),
//                 sno: i + 1,
//                 deptFrom: item?.deptFrom,
//                 itemName: item?.itemName,
//                 reqQty: <div className="text-right">{item?.reqQty}</div>,
//                 Narration: item?.narration,
//                 DATE: item?.dtEntry,
//               };
//             } else {
//               // For all other types, show the detailed view without checkboxes
//               obj = {
//                 sno: i + 1,
//                 deptFrom: item?.deptFrom,
//                 deptTo: item?.deptTo,
//                 itemName: item?.itemName,
//                 unitType: item?.unitType,
//                 reqQty: item?.reqQty,
//                 receiveQty: item?.receiveQty,
//                 pendingQty: item?.pendingQty,
//                 rejectQty: item?.rejectQty,
//                 Narration: item?.narration,
//                 DATE: item?.date,
//               };
//             }
//             secondTbody.push(obj);
//           });
//         }
//         let obj = {
//           sno: index + 1,
//           dtentry: val?.dtentry,
//           IndentNo: val?.IndentNo,
//           Deptfrom: val?.Deptfrom,
//           EmpName: val?.EmpName,
//           print: (
//             <span onClick={() => handleClickReport(val)}>
//               <ReprintSVG />
//             </span>
//           ),
//           index: (
//             <span onClick={() => handleClickEdit(val, index, val.isopen)}>
//               {val.isopen ? (
//                 <i className="fa fa-minus" aria-hidden="true"></i>
//               ) : (
//                 <i className="fa fa-plus" aria-hidden="true"></i>
//               )}
//             </span>
//           ),
//           subRow: { subRowList: secondTbody, isopen: val.isopen },
//         };
//         list.push(obj);
//       });
//       setBodyData(list);
//     };

//     bindBodyData();

//     // Update derived states
//     const anyOpen = internalTbody.some((row) => row.isopen);
//     setIsAnyRowOpen(anyOpen);

//     const allVisibleItems = [];
//     internalTbody.forEach((row, parentIndex) => {
//       if (row.isopen && row.SecondBodyDataList) {
//         row.SecondBodyDataList.forEach((_, childIndex) => {
//           allVisibleItems.push(`${parentIndex}-${childIndex}`);
//         });
//       }
//     });

//     const allChecked =
//       allVisibleItems.length > 0 &&
//       allVisibleItems.every((id) => checkedItems[id]);
//     setIsAllSelected(allChecked);
//   }, [internalTbody, checkedItems, payload?.Type]); // Rerun when these dependencies change

//   const isCheckboxType = payload?.Type === "MI" || payload?.Type === "MR";

//   return (
//     <>
//       <NestedRowTable
//         thead={thead}
//         seondThead={isCheckboxType ? thirdThead : seondThead}
//         tbody={bodyData}
//         tableHeight={tableHeight}
//         getRowClass={getRowClass}
//       />
//       {isCheckboxType && isAnyRowOpen && (
//         <div style={{ textAlign: "right", padding: "10px" }}>
//           <button className="btn btn-primary" onClick={handleSave}>
//             {t("Save")}
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewReqTable;




// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import NestedRowTable from "../NestedRowTable";
// import { ReprintSVG } from "../../../SvgIcons";
// import { RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   PrintRequisition,
//   ViewIndent,
// } from "../../../../networkServices/InventoryApi";
// import { notify } from "../../../../utils/utils";
// import { BillingIPDIssueIndentAccept } from "../../../../networkServices/pharmecy";

// const ViewReqTable = ({ tbody, tableHeight, payload, Tid }) => {
//   const [t] = useTranslation();
//   const [bodyData, setBodyData] = useState([]);
//   const [internalTbody, setInternalTbody] = useState([]); // Local state for table data
//   const [checkedItems, setCheckedItems] = useState({});
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const [isAnyRowOpen, setIsAnyRowOpen] = useState(false);

//   // Initialize internal state when the tbody prop changes
//   useEffect(() => {
//     // We add the 'isopen' property here if it doesn't exist to manage the toggle state locally
//     setInternalTbody(
//       tbody.map((row) => ({ ...row, isopen: !!row.isopen }))
//     );
//     // When tbody changes, reset selections
//     setCheckedItems({});
//   }, [tbody]);

//   const thead = [
//     { name: t("SNo"), width: "1%" },
//     { name: t("Requisition Date"), width: "10%" },
//     t("Requisition No"),
//     t("Department From"),
//     t("RaisedBy"),
//     { name: t("Print"), width: "1%" },
//     { name: "View", width: "1%" },
//   ];

//   const seondThead = [
//     { name: t("SNo"), width: "1%" },
//     t("Department From"),
//     t("DepartmentTo"),
//     { name: "Item Name", width: "1%" },
//     { name: "Unit Type", width: "1%" },
//     { name: t("Requested Qty"), width: "1%" },
//     { name: t("Received Qty"), width: "1%" },
//     { name: t("Pending Qty"), width: "1%" },
//     { name: t("Rejected Qty"), width: "1%" },
//     { name: "Narration", width: "1%" },
//     { name: "Date", width: "1%" },
//   ];

//   const handleSelectAll = (e) => {
//     const isChecked = e.target.checked;
//     const newCheckedItems = {};
//     if (isChecked) {
//       internalTbody.forEach((row, parentIndex) => {
//         if (row.isopen && row.SecondBodyDataList) {
//           row.SecondBodyDataList.forEach((_, childIndex) => {
//             const uniqueId = `${parentIndex}-${childIndex}`;
//             newCheckedItems[uniqueId] = true;
//           });
//         }
//       });
//     }
//     setCheckedItems(newCheckedItems);
//   };

//   const thirdThead = [
//     {
//       name: (
//         <input
//           type="checkbox"
//           checked={isAllSelected}
//           onChange={handleSelectAll}
//           disabled={!isAnyRowOpen} // Disable if no rows are open
//         />
//       ),
//       width: "1%",
//     },
//     { name: t("S.No."), width: "1%" },
//     { name: t("Department From"), width: "15%" },
//     t("Item Name"),
//     { name: t("RequestedQty"), width: "15%" },
//     { name: "Narration", width: "15%" },
//     { name: "Date", width: "15%" },
//   ];

//   const handleCheckboxChange = (uniqueId) => {
//     setCheckedItems((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
//   };

//   const handleSave = async() => {
   
//     const selectedData = [];
//     internalTbody.forEach((val, index) => {
     
//       val.SecondBodyDataList?.forEach((item, i) => {
//         if (checkedItems[`${index}-${i}`]) {
//           selectedData.push({
//             "indentNo": item?.indentNo, 
//             "itemID": item?.itemID
//           });

//         }
//       });
//     });
//     console.log("selectedData", selectedData);
//   if (selectedData.length <= 0) {
//       notify(`Please Select atleast one item`, "warn");
//     return
//   }
//   // }
// const response =await BillingIPDIssueIndentAccept(selectedData)
    
//     if (response?.success) {
//       notify(response?.message, "success");
//       // TODO: Add your API call logic here
//     } else {
//     notify(response?.message, "error");
//     }
//   };

//   const handleClickEdit = async (val, index, isopen) => {
//     // Create a new array to avoid direct mutation
//     const updatedTbody = [...internalTbody];
//     const currentItem = updatedTbody[index];

//     // If we are opening a row that doesn't have data yet, fetch it
//     if (!isopen && !currentItem.SecondBodyDataList) {
//       const IndentNo = val?.IndentNo;
//       const Status = val?.StatusNew ? val?.StatusNew : "Open";
//       const Type = payload?.Type;
//       const TID = Tid;
//       const apiResp = await ViewIndent(IndentNo, Status, Type, TID);

//       if (apiResp?.success) {
//         currentItem.SecondBodyDataList = apiResp?.data?.dtnew;
//       } else {
//         notify(apiResp?.message, "error");
//       }
//     }
    
//     // Toggle the open state and update the state
//     currentItem.isopen = !isopen;
//     setInternalTbody(updatedTbody);
//   };

//   const handleClickReport = async (val) => {
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     let apiResp = await PrintRequisition(IndentNo, Status, Type);
//     if (apiResp?.success) {
//       RedirectURL(apiResp?.data?.pdfUrl);
//     } else {
//       notify(apiResp?.message, "error");
//     }
//   };

//   const getRowClass = (val, index) => {
//     if (!internalTbody || !internalTbody[index]) {
//       return "";
//     }
//     const status = internalTbody[index]?.StatusNew;
//     switch (status) {
//       case "Open": return "md-record-RequisitionDone";
//       case "Closed": return "md-record-PendingRequisition";
//       case "Reject": return "md-record-Completed";
//       case "Partial": return "md-record-Running";
//       default: return "";
//     }
//   };
  
//   // This single, comprehensive useEffect handles all UI updates.
//   // It runs when the source data, toggle state, or selection state changes.
//   useEffect(() => {
//     const bindBodyData = () => {
//       let list = [];
//       internalTbody?.forEach((val, index) => {
//         let secondTbody = [];
//         if (val.isopen && val.SecondBodyDataList) {
//           val.SecondBodyDataList.forEach((item, i) => {
//             const uniqueId = `${index}-${i}`;
//             const obj =
//               payload?.Type === "MI"
//                 ?  {
//                   sno: i + 1,
//                   deptFrom: item?.deptFrom,
//                   deptTo: item?.deptTo,
//                   itemName: item?.itemName,
//                   unitType: item?.unitType,
//                   reqQty: item?.reqQty,
//                   receiveQty: item?.receiveQty,
//                   pendingQty: item?.pendingQty,
//                   rejectQty: item?.rejectQty,
//                   Narration: item?.narration,
//                   DATE: item?.date,
//                 }
//                 : {
//                     check: (
//                       <input
//                         type="checkbox"
//                         checked={!!checkedItems[uniqueId]}
//                         onChange={() => handleCheckboxChange(uniqueId)}
//                       />
//                     ),
//                     sno: i + 1,
//                     deptFrom: item?.deptFrom,
//                     itemName: item?.itemName,
//                     reqQty: <div className="text-right">{item?.reqQty}</div>,
//                     Narration: item?.narration,
//                     DATE: item?.dtEntry,
//                   };
//             secondTbody.push(obj);
//           });
//         }
//         let obj = {
//             sno: index + 1,
//             dtentry: val?.dtentry,
//             IndentNo: val?.IndentNo,
//             Deptfrom: val?.Deptfrom,
//             EmpName: val?.EmpName,
//             print: ( <span onClick={() => handleClickReport(val)}> <ReprintSVG /> </span> ),
//             index: (
//               <span onClick={() => handleClickEdit(val, index, val.isopen)}>
//                 {val.isopen ? ( <i className="fa fa-minus" aria-hidden="true"></i> ) 
//                              : ( <i className="fa fa-plus" aria-hidden="true"></i> )}
//               </span>
//             ),
//             subRow: { subRowList: secondTbody, isopen: val.isopen },
//         };
//         list.push(obj);
//       });
//       setBodyData(list);
//     };

//     bindBodyData();

//     // Update derived states
//     const anyOpen = internalTbody.some(row => row.isopen);
//     setIsAnyRowOpen(anyOpen);

//     const allVisibleItems = [];
//     internalTbody.forEach((row, parentIndex) => {
//       if (row.isopen && row.SecondBodyDataList) {
//         row.SecondBodyDataList.forEach((_, childIndex) => {
//           allVisibleItems.push(`${parentIndex}-${childIndex}`);
//         });
//       }
//     });

//     const allChecked = allVisibleItems.length > 0 && allVisibleItems.every(id => checkedItems[id]);
//     setIsAllSelected(allChecked);

//   }, [internalTbody, checkedItems, payload?.Type]); // Rerun when these dependencies change

//   return (
//     <>
//       <NestedRowTable
//         thead={thead}
//         seondThead={payload?.Type === "MI" ? seondThead : thirdThead}
//         tbody={bodyData}
//         tableHeight={tableHeight}
//         getRowClass={getRowClass}
//       />
//       {payload?.Type !== "MI" && isAnyRowOpen && (
//         <div style={{ textAlign: "right", padding: "10px" }}>
//           <button className="btn btn-primary" onClick={handleSave}>
//             {t("Save")}
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewReqTable;


// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import NestedRowTable from "../NestedRowTable";
// import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
// import { ReprintSVG } from "../../../SvgIcons";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   PrintRequisition,
//   ViewIndent,
// } from "../../../../networkServices/InventoryApi";
// import { notify } from "../../../../utils/utils";

// const ViewReqTable = ({ tbody, tableHeight, payload, Tid }) => {
//   const [t] = useTranslation();
//   const [bodyData, setBodyData] = useState([]);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [isAllSelected, setIsAllSelected] = useState(false);

//   const thead = [
//     { name: t("SNo"), width: "1%" },
//     { name: t("Requisition Date"), width: "10%" },
//     t("Requisition No"),
//     t("Department From"),
//     t("RaisedBy"),
//     { name: t("Print"), width: "1%" },
//     { name: "View", width: "1%" },
//   ];

//   const seondThead = [
//     { name: t("SNo"), width: "1%" },
//     t("Department From"),
//     t("DepartmentTo"),
//     { name: "Item Name", width: "1%" },
//     { name: "Unit Type", width: "1%" },
//     { name: t("Requested Qty"), width: "1%" },
//     { name: t("Received Qty"), width: "1%" },
//     { name: t("Pending Qty"), width: "1%" },
//     { name: t("Rejected Qty"), width: "1%" },
//     { name: "Narration", width: "1%" },
//     { name: "Date", width: "1%" },
//   ];

//   // Handler for the "Select All" checkbox in the thirdThead
//   const handleSelectAll = (e) => {
//     const isChecked = e.target.checked;
//     setIsAllSelected(isChecked);
//     const newCheckedItems = {};
//     if (isChecked) {
//       tbody.forEach((row, parentIndex) => {
//         if (row.isopen && row.SecondBodyDataList) {
//           row.SecondBodyDataList.forEach((_, childIndex) => {
//             const uniqueId = `${parentIndex}-${childIndex}`;
//             newCheckedItems[uniqueId] = true;
//           });
//         }
//       });
//     }
//     setCheckedItems(newCheckedItems);
//   };

//   const thirdThead = [
//     {
//       name: (
//         <input
//           type="checkbox"
//           checked={isAllSelected}
//           onChange={handleSelectAll}
//         />
//       ),
//       width: "1%",
//     },
//     { name: t("S.No."), width: "1%" },
//     { name: t("Department From"), width: "15%" },
//     t("Item Name"),
//     { name: t("RequestedQty"), width: "15%" },
//     { name: "Narration", width: "15%" },
//     { name: "Date", width: "15%" },
//   ];

//   // Handler for individual row checkboxes
//   const handleCheckboxChange = (uniqueId) => {
//     setCheckedItems((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
//   };
  
//   // Handler for saving selected items
//   const handleSave = () => {
//     const selectedData = [];
//     tbody.forEach((val, index) => {
//         val.SecondBodyDataList?.forEach((item, i) => {
//             const uniqueId = `${index}-${i}`;
//             if (checkedItems[uniqueId]) {
//                 selectedData.push(item);
//             }
//         });
//     });
//     console.log("Selected Items to be saved:", selectedData);
//     if(selectedData.length > 0){
//        notify(`Saved ${selectedData.length} items successfully.`, "success");
//       // TODO: Add your API call logic here
//     } else {
//        notify("No items selected to save.", "warning");
//     }
//   };

//   const handleClickEdit = async (val, index, isopen) => {
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     const TID = Tid;
//     const apiResp = await ViewIndent(IndentNo, Status, Type, TID);
//     tbody[index]["isopen"] = !isopen;
//     if (apiResp?.success) {
//       tbody[index]["SecondBodyDataList"] = apiResp?.data?.dtnew;
//     } else {
//       notify(apiResp?.message, "error");
//     }
//     bindBodyData(tbody);
//   };

//   const handleClickReport = async (val) => {
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     let apiResp = await PrintRequisition(IndentNo, Status, Type);
//     if (apiResp?.success) {
//       RedirectURL(apiResp?.data?.pdfUrl);
//     } else {
//       notify(apiResp?.message, "error");
//     }
//   };

//   const getRowClass = (val, index) => {
//     if (!tbody || !tbody[index]) {
//       console.error(`Row data not found for index: ${index}`);
//       return "";
//     }
//     const status = tbody[index]?.StatusNew;
//     switch (status) {
//       case "Open":
//         return "md-record-RequisitionDone";
//       case "Closed":
//         return "md-record-PendingRequisition";
//       case "Reject":
//         return "md-record-Completed";
//       case "Partial":
//         return "md-record-Running";
//       default:
//         return "";
//     }
//   };

//   const bindBodyData = (tbody) => {
//     let list = [];
//     tbody?.map((val, index) => {
//       let secondTbody = [];
//       val?.SecondBodyDataList?.length > 0 &&
//         val?.SecondBodyDataList?.map((item, i) => {
//           const uniqueId = `${index}-${i}`;
//           const obj =
//             payload?.Type === "MI"
//               ? {
//                   sno: i + 1,
//                   deptFrom: item?.deptFrom,
//                   deptTo: item?.deptTo,
//                   itemName: item?.itemName,
//                   unitType: item?.unitType,
//                   reqQty: item?.reqQty,
//                   receiveQty: item?.receiveQty,
//                   pendingQty: item?.pendingQty,
//                   rejectQty: item?.rejectQty,
//                   Narration: item?.narration,
//                   DATE: item?.date,
//                 }
//               : {
//                   check: (
//                     <input
//                       type="checkbox"
//                       checked={!!checkedItems[uniqueId]}
//                       onChange={() => handleCheckboxChange(uniqueId)}
//                     />
//                   ),
//                   sno: i + 1,
//                   deptFrom: item?.deptFrom,
//                   itemName: item?.itemName,
//                   reqQty: <div className="text-right">{item?.reqQty}</div>,
//                   Narration: item?.narration,
//                   DATE: item?.dtEntry,
//                 };
//           secondTbody.push(obj);
//         });

//       let obj = {};
//       obj.sno = index + 1;
//       obj.dtentry = val?.dtentry;
//       obj.IndentNo = val?.IndentNo;
//       obj.Deptfrom = val?.Deptfrom;
//       obj.EmpName = val?.EmpName;
//       obj.print = (
//         <span onClick={() => handleClickReport(val)}>
//           <ReprintSVG />
//         </span>
//       );
//       obj.index = (
//         <span onClick={() => handleClickEdit(val, index, val?.isopen)}>
//           {val?.isopen > 0 ? (
//             <i className="fa fa-minus" aria-hidden="true"></i>
//           ) : (
//             <i className="fa fa-plus" aria-hidden="true"></i>
//           )}
//         </span>
//       );
//       obj.subRow = { subRowList: secondTbody, isopen: val?.isopen };
//       list.push(obj);
//     });
//     setBodyData(list);
//   };

//   useEffect(() => {
//     // Logic to check if all relevant items are checked
//     const allVisibleItems = [];
//     tbody.forEach((row, parentIndex) => {
//         if (row.isopen && row.SecondBodyDataList) {
//             row.SecondBodyDataList.forEach((_, childIndex) => {
//                 allVisibleItems.push(`${parentIndex}-${childIndex}`);
//             });
//         }
//     });
//     const allChecked = allVisibleItems.length > 0 && allVisibleItems.every(id => checkedItems[id]);
//     setIsAllSelected(allChecked);

//     bindBodyData(tbody);
//   }, [tbody, checkedItems]);

//   return (
//     <>
//       <NestedRowTable
//         thead={thead}
//         seondThead={payload?.Type === "MI" ? seondThead : thirdThead}
//         tbody={bodyData}
//         tableHeight={tableHeight}
//         getRowClass={getRowClass}
//       />
//       {payload?.Type !== "MI" && (
//         <div style={{ textAlign: "right", padding: "10px" }}>
//           <button className="btn btn-primary" onClick={handleSave}>
//             {t("Save")}
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewReqTable;


// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import NestedRowTable from "../NestedRowTable";
// import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
// import { ReprintSVG } from "../../../SvgIcons";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   PrintRequisition,
//   ViewIndent,
// } from "../../../../networkServices/InventoryApi";
// import { notify } from "../../../../utils/utils";

// const ViewReqTable = ({ tbody, tableHeight, payload,Tid }) => {
//   const [t] = useTranslation();
//   const [bodyData, setBodyData] = useState([]);

//   const thead = [
//     { name: t("SNo"), width: "1%" },
//     { name: t("Requisition Date"), width: "10%" },
//     t("Requisition No"),
//     // t("ItemName"),
//     // t("UnitType"),
//     t("Department From"),
//     t("RaisedBy"),
//     { name: t("Print"), width: "1%" },
//     { name: "View", width: "1%" },
//   ];
//   console.log("payload", payload);
//   const seondThead = [
//     { name: t("SNo"), width: "1%" },
//     t("Department From"),
//     t("DepartmentTo"),
//     { name: "Item Name", width: "1%" },
//     { name: "Unit Type", width: "1%" },
//     { name: t("Requested Qty"), width: "1%" },
//     { name: t("Received Qty"), width: "1%" },
//     { name: t("Pending Qty"), width: "1%" },
//     { name: t("Rejected Qty"), width: "1%" },
//     { name: "Narration", width: "1%" },
//     { name: "Date", width: "1%" },
//   ];
//   const thirdThead = [
//     { name: t("S.No."), width: "1%" },
//     { name: t("Department From"), width: "15%" },
//     t("Item Name"),
//     { name: t("RequestedQty"), width: "15%" },
//     { name: "Narration", width: "15%" },
//     { name: "Date", width: "15%" },
//   ];
//   console.log(tbody);
//   const handleClickEdit = async (val, index, isopen) => {
//     console.log(val);
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     const TID = Tid;
//     const apiResp = await ViewIndent(IndentNo, Status, Type,TID);
//     tbody[index]["isopen"] = !isopen;
//     if (apiResp?.success) {
//       tbody[index]["SecondBodyDataList"] = apiResp?.data?.dtnew;
//     } else {
//       notify(apiResp?.message, "error");
//     }
//     bindBodyData(tbody);
//   };

//   const handleClickReport = async (val) => {
//     console.log(val);
//     const IndentNo = val?.IndentNo;
//     const Status = val?.StatusNew ? val?.StatusNew : "Open";
//     const Type = payload?.Type;
//     let apiResp = await PrintRequisition(IndentNo, Status, Type);
//     if (apiResp?.success) {
//       RedirectURL(apiResp?.data?.pdfUrl);
//     } else {
//       notify(apiResp?.message, "error");
//     }
//   };

//   // const getRowClass = (val, index) => {
//   //   console.log(tbody[index]["StatusNew"])
//   //   const status = tbody[index]["StatusNew"];
//   //   console.log(status)
//   //   if (status === "Open") {
//   //     return "md-record-RequisitionDone";
//   //   }
//   //   if (status === "Reject") {
//   //     return "md-record-PendingRequisition";
//   //   }
//   //   if (status === "Closed") {
//   //     return "md-record-Completed ";
//   //   }
//   //   if (status === "Partial") {
//   //     return "md-record-Running";
//   //   }
//   // };

//   const getRowClass = (val, index) => {
//     if (!tbody || !tbody[index]) {
//       console.error(`Row data not found for index: ${index}`);
//       return "";
//     }

//     const status = tbody[index]?.StatusNew;

//     switch (status) {
//       case "Open":
//         return "md-record-RequisitionDone";
//       case "Closed":
//         return "md-record-PendingRequisition";
//       case "Reject":
//         return "md-record-Completed";
//       case "Partial":
//         return "md-record-Running";
//       default:
//         return ""; // Return a default or empty string if status doesn't match
//     }
//   };

//   const bindBodyData = (tbody) => {
//     let list = [];
//     tbody?.map((val, index) => {
//       let secondTbody = [];

//       val?.SecondBodyDataList?.length > 0 &&
//         val?.SecondBodyDataList?.map((item, i) => {
//           const obj =
//             payload?.Type === "MI"
//               ? {
//                   sno: i + 1,
//                   deptFrom: item?.deptFrom,
//                   deptTo: item?.deptTo,
//                   itemName: item?.itemName,
//                   unitType: item?.unitType,
//                   reqQty: item?.reqQty,
//                   receiveQty: item?.receiveQty,
//                   pendingQty: item?.pendingQty,
//                   rejectQty: item?.rejectQty,
//                   Narration: item?.narration,
//                   DATE: item?.date,
//                 }
//               : {
//                   sno: i + 1,
//                   deptFrom: item?.deptFrom,
//                   itemName: item?.itemName,
//                   reqQty: <div className="text-right">{item?.reqQty}</div>,
//                   Narration: item?.narration,
//                   DATE: item?.dtEntry,
//                 };

//           secondTbody.push(obj);
//         });
//       let obj = {};

//       obj.sno = index + 1;
//       (obj.dtentry = val?.dtentry),
//         (obj.IndentNo = val?.IndentNo),
//         (obj.Deptfrom = val?.Deptfrom),
//         (obj.EmpName = val?.EmpName),
//         (obj.print = (
//           <span
//             onClick={() => {
//               handleClickReport(val);
//             }}
//           >
//             <ReprintSVG />
//           </span>
//         )),
//         (obj.index = (
//           <span
//             onClick={() => {
//               handleClickEdit(val, index, val?.isopen);
//             }}
//           >
//             {val?.isopen > 0 ? (
//               <i className="fa fa-minus" aria-hidden="true"></i>
//             ) : (
//               <i className="fa fa-plus" aria-hidden="true"></i>
//             )}
//           </span>
//         ));
//       obj.subRow = { subRowList: secondTbody, isopen: val?.isopen };
//       list.push(obj);
//     });
//     setBodyData(list);
//   };
//   useEffect(() => {
//     bindBodyData(tbody);
//   }, [tbody]);

//   // const getRowClass = (val) => {
//   //   if (val?.STATUS === "Completed") {
//   //     return "medicationTbaleRowColor";
//   //   }
//   //   if (val?.STATUS === "Stopped") {
//   //     return "medicationTbaleRowColorStopped";
//   //   }
//   //   if (val?.STATUS === "Not Issued") {
//   //     return "medicationTbaleRowColorNotIssued";
//   //   }
//   //   if (val?.STATUS === "Running") {
//   //     return "medicationTbaleRowColorRunning";
//   //   }
//   //   if (val?.STATUS === "Today Medicine") {
//   //     return "medicationTbaleRowColorTodayMedicine";
//   //   }
//   // };
//   console.log(bodyData);
//   return (
//     <>
//       <NestedRowTable
//         thead={thead}
//         seondThead={payload?.Type === "MI" ? seondThead : thirdThead}
//         tbody={bodyData}
//         tableHeight={tableHeight}
//         getRowClass={getRowClass}
//       />
//     </>
//   );
// };

// export default ViewReqTable;
