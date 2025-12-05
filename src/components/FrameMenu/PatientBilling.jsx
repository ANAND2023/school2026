import React, { useEffect, useMemo, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import BillingDepartmentDetailTable from "../UI/customTable/billings/BillingDepartmentDetailTable";
import LabeledInput from "../formComponent/LabeledInput";
import { useDispatch } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  BillingShowItemDetails,
  GetAllAuthorization,
  GetBillDetails,
  GetBindDepartment,
  IPDAdvanceBindPatientDetails,
  OPDServiceBookingChecklist,
  PatientBillingAllTabSave,
  PatientBillingPayable,
} from "../../networkServices/BillingsApi";
import { notify } from "../../utils/utils";
import IPDServices from "../FrameMenuCommoncomponent/IPDServices";
import { ROUNDOFF_VALUE } from "../../utils/constant";
import SlideScreen from "../front-office/SlideScreen";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import Modal from "../modalComponent/Modal";
import RejectModal from "../modalComponent/Utils/patientBillingModal/RejectModal";
import EditItemModal from "../modalComponent/Utils/patientBillingModal/EditItemModal";
import {
  DiscountSVG,
  NoNPayableSVG,
  PackageSVG,
  PayableSVG,
  QuantitySVG,
  RateSVG,
  RejectSVG,
} from "../SvgIcons";
import RateChange from "../modalComponent/Utils/patientBillingModal/RateChange";
import Discountchange from "../modalComponent/Utils/patientBillingModal/Discountchange";
import EditPackage from "../modalComponent/Utils/patientBillingModal/EditPackage";
import PackageBilling from "../modalComponent/Utils/patientBillingModal/PackageBilling";
import { Tooltip } from "primereact/tooltip";
import store from "../../store/store";
import QuantityChange from "../modalComponent/Utils/patientBillingModal/QuantityChange";
import BiilingRemarkModal from "../modalComponent/Utils/patientBillingModal/BiilingRemarkModal";
import Surgery from "./Surgery";
import PackageTable from "../modalComponent/Utils/patientBillingModal/PackageTable";
import Input from "../formComponent/Input";


// networkServices/BillingsApi
const PatientBilling = ({ data }) => {
  console.log("datadatadatadatadata", data)
  const [auth, setAuth] = useState({});
  const [serviceBookinglist, setServiceBookinglist] = useState([]);
  console.log("serviceBookinglist", serviceBookinglist)
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  console.log("localdata", localdata)
  const ip = useLocalStorage("ip", "get");
  const [pateintDetails, setPatientDetails] = useState({});

  const [isPackageAdd, setIsPackageAdd] = useState(false);
  console.log("isPackageAdd", isPackageAdd)
  const [slideScreenState, setSlideScreenState] = useState({
    name: "",
    component: null,
  });

  const iconElements = [
    // {
    //   Component: RateSVG,
    //   tooltipText: "Set Rate",
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Set Rate"),
    //       <RateChange
    //         handlePatientBillingAllTabSave={handlePatientBillingAllTabSave}
    //       />,
    //       "25vw",
    //       <></>
    //     ),
    // },
    // {
    //   Component: DiscountSVG,
    //   tooltipText: "Set Discount",
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Set Discount"),
    //       <Discountchange
    //         handlePatientBillingAllTabSave={handlePatientBillingAllTabSave}
    //       />,
    //       "25vw",
    //       <></>
    //     ),
    // },
    // {
    //   Component: QuantitySVG,
    //   tooltipText: t("Quantity"),
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Set Quantity"),
    //       <QuantityChange
    //         handlePatientBillingAllTabSave={handlePatientBillingAllTabSave}
    //       />,
    //       "25vw",
    //       <></>
    //     ),
    // },
    {
      Component: RejectSVG,
      tooltipText: "Rejection Reason",
      onClick: () => {

        if (localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") {
          notify("You are not allowed to cancel items.", "warn");
          return;
        }



        handleModalState(
          true,
          t("Rejection Reason"),
          <RejectModal
            data={department}
            handleModalState={handleModalState}
            GetBindBillDepartment={GetBindBillDepartment}
          />,
          "25vw",
          <></>)
      },
    }
    ,
    // {
    //   Component: RejectSVG,
    //   tooltipText: "Rejection Reason",
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Rejection Reason"),
    //       <RejectModal
    //         data={department}
    //         handleModalState={handleModalState}
    //         GetBindBillDepartment={GetBindBillDepartment}
    //       />,
    //       "25vw",
    //       <></>
    //     ),
    // },
    {
      Component: PackageSVG,
      tooltipText: "Package",
      onClick: () =>
        handleModalState(
          true,
          t("Package"),
          <PackageBilling
            data={department}
            handleModalState={handleModalState}
            GetBindBillDepartment={GetBindBillDepartment}
            pateintDetails={pateintDetails}
          />,
          "25vw",
          <></>
        ),
    },
    // {
    //   Component: PayableSVG,
    //   tooltipText: "Payable",
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Payable"),
    //       <>
    //         <div
    //           style={{ fontSize: "12px", fontWeight: 900, color: "red" }}
    //           className="text-center"
    //         >
    //           Are You Sure ?
    //         </div>
    //       </>,
    //       "15vw",
    //       <div>
    //         <button
    //           className="btn btn-sm btn-primary"
    //           onClick={() => handlePatientBillingPayable("Payable")}
    //         >
    //           {t("Yes")}
    //         </button>
    //       </div>
    //     ),
    // },
    // {
    //   Component: NoNPayableSVG,
    //   tooltipText: t("Non-Payable"),
    //   onClick: () =>
    //     handleModalState(
    //       true,
    //       t("Non-Payable"),
    //       <>
    //         <div
    //           style={{ fontSize: "12px", fontWeight: 900, color: "red" }}
    //           className="text-center"
    //         >
    //           Are You Sure ?
    //         </div>
    //       </>,
    //       "15vw",
    //       <div>
    //         <button
    //           className="btn btn-sm btn-primary"
    //           onClick={() => handlePatientBillingPayable("NonPayable")}
    //         >
    //           {t("Yes")}
    //         </button>
    //       </div>
    //     ),
    // },
  ];

  const thead = [
    { width: "3%", name: t("Action") },
    { width: "3%", name: t("S.No.") },
    t("Department"),
    { width: "10%", name: t("Quantity") },
    { width: "10%", name: t("Amount") },
    { width: "5%", name: t("Edit") },
    { width: "5%", name: t("View Log") },
  ];

  const [BillDetails, setBillDetails] = useState([]);
  const [department, setDepartment] = useState([]);
  const [backupDepartment, setBackupDepartment] = useState([]);

  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
  });

  const [Authorization, setAuthorization] = useState({});

  const GetBindBillDetails = async () => {
    // alert("bill details calling")
    const transID = data?.transactionID;
    try {
      const datas = await GetBillDetails(transID);
      setBillDetails(datas?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetBindAuthorization = async () => {
    try {
      const datas = await GetAllAuthorization();
      return datas?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const GetBindBillDepartment = async () => {

    const transID = data?.transactionID;
    try {
      const response = await GetBindAuthorization();

      setAuth(response[0])
      const datas = await GetBindDepartment(transID, response[0]?.CanViewRate);
      console.log("response[0]", response[0])
      setDepartment(datas?.data);
      setBackupDepartment(datas?.data);
      setAuthorization(response[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localdata?.centreID,
      })
    );
    OPDServiceBookinglist();
    GetBindBillDetails();
    GetBindBillDepartment();
    handleIPDAdvanceBindPatientDetails(data?.patientID, data?.transactionID);
  }, [dispatch]);

  // useEffect(() => {
  //   OPDServiceBookinglist();
  //   GetBindBillDetails();
  //   GetBindBillDepartment();
  //   handleIPDAdvanceBindPatientDetails(data?.patientID, data?.transactionID);
  // }, []);

  const handleBillingShowItemDetails = async (item, index) => {
    dispatch(setLoading(true));
    try {
      const [categoryId, configID] = item?.Category.split("#");
      const response = await BillingShowItemDetails({
        transID: String(data?.transactionID),
        categoryId: String(categoryId),
        configID: String(configID),
        dispName: item?.DisplayName,
        filterItem: [""],
        userID: "",
      });

      const tableDataMain = [...department];
      tableDataMain[index]["subRow"] = {
        subRowList: response?.data,
        isopen: true,
      };

      setDepartment(tableDataMain);
      setBackupDepartment(tableDataMain)
      notify(response?.message, response?.success ? "success" : "error");
    } catch (error) {
      console.log(error, "Something Went Wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };


  const handleSubRowChange = (e, outerIndex, innerIndex) => {
    const { name, checked } = e.target;
    const data = JSON.parse(JSON.stringify(department));
    data[outerIndex]["subRow"]["subRowList"][innerIndex][name] = checked;
    setDepartment(data);
  };
  // const isTrue="0"
  console.log("localdata?.defaultRole", localdata?.defaultRole)
  console.log("auth", auth)

  // const handleItemSearch = (e,index) => {
  //   debugger
  //    const tableDataMain = [...department];

  //    const bckUptableDataMain = [...department];


  //   if (e?.target?.value === "") {
  //     setDepartment(tableDataMain);
  //     return;
  //   }
  //   const results = bckUptableDataMain[index]?.subRow?.filter((obj) =>
  //     Object.values(obj)?.some(
  //       (value) =>
  //         typeof value === "string" &&
  //         value?.toLowerCase().includes(e?.target?.value.toLowerCase())
  //     )
  //   );
  //   setDepartment(results);
  // };
  console.log("departmentdepartment", department)

  const handleItemSearch = (e, index) => {
    debugger
    const searchValue = e.target.value?.toLowerCase() || "";
    let updatedData = JSON.parse(JSON.stringify(department));
    // let updatedData = [...department];
    
    let bckUpdatedData = JSON.parse(JSON.stringify(backupDepartment));

    let backupOriginalSubRows = bckUpdatedData[index]?.subRow || {};
    if (!searchValue) {
      updatedData[index]["subRow"].subRowList = backupOriginalSubRows.subRowList;
      console.log("first")
    } else {
      let filtered = backupOriginalSubRows?.subRowList?.filter((obj) =>
        Object.values(obj).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchValue)
        )
      );
       let newArry = []
       newArry.length = 17;

      updatedData[index]["subRow"].subRowList = filtered?.length === 0 ? newArry : filtered ;

    }
   
    setDepartment(updatedData);
  };



  const handleDepartmentSubRow = (subRow, inx) => {
    const tableResponse = subRow?.subRowList?.length > 0 && subRow?.subRowList?.map((row, index) => {
      return {
        SN:index+1,
        input: (
          <div className="text-center">
            <input
              type="checkbox"
              checked={row?.isChecked}
              name="isChecked"
              onChange={(e) => handleSubRowChange(e, inx, index)}
            />
          </div>
        ),
  Edit: (
          <div className="text-center">
            <i


              className={`fa fa-edit p-1 ${(localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo ? 'text-muted' : 'text-primary'}`}
              style={{ cursor: (localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo ? 'not-allowed' : 'pointer' }}
              // className={`fa fa-edit p-1 ${localdata?.defaultRole === 213  || row?.BillNo ? 'text-muted' : 'text-primary'}`}
              // style={{ cursor: localdata?.defaultRole === 213 || row?.BillNo? 'not-allowed' : 'pointer' }}
              onClick={() => {
                if ((localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo) return;
                {/* <i
              className="fa fa-edit p-1 text-primary"
              onClick={() => */}


                String(row?.configid) === "22"
                  ? handleModalState(
                    true,
                    t("Edit Surgery"),
                    <Surgery
                      data={data}
                      handleModalState={handleModalState}
                      LedgerTnxNo={String(row?.LedgerTransactionNo)}
                      GetBindBillDepartment={GetBindBillDepartment}
                    />,
                    "80vw",
                    <></>
                  )
                  : handleModalState(
                    true,
                    t("Edit Item"),
                    <EditItemModal
                      data={row}
                      handleModalState={handleModalState}
                      GetBindBillDepartment={GetBindBillDepartment}
                    />,
                    "50vw",
                    <></>
                  )
              }}
            />
            {/* <i
              className="fa fa-edit p-1 text-primary"
              onClick={() =>
                // handleModalState(
                //   true,
                //   "Edit Surgery",
                //   <Surgery
                //     data={data}
                //     handleModalState={handleModalState}
                //     LedgerTnxNo={String(row?.LedgerTransactionNo)}
                //     GetBindBillDepartment={GetBindBillDepartment}
                //   />,
                //   "80vw",
                //   <></>
                // )
                String(row?.configid) === "22"
                  ? handleModalState(
                    true,
                    t("Edit Surgery"),
                    <Surgery
                      data={data}
                      handleModalState={handleModalState}
                      LedgerTnxNo={String(row?.LedgerTransactionNo)}
                      GetBindBillDepartment={GetBindBillDepartment}
                    />,
                    "80vw",
                    <></>
                  )
                  : handleModalState(
                    true,
                    t("Edit Item"),
                    <EditItemModal
                      data={row}
                      handleModalState={handleModalState}
                      GetBindBillDepartment={GetBindBillDepartment}
                    />,
                    "50vw",
                    <></>
                  )
              }
            /> */}
          </div>
        ),
        Reject: (
          <div className="text-center">
            {" "}
            <i
              style={{ cursor: (localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo ? 'not-allowed' : 'pointer' }}
              // className="fa fa-trash text-danger"
              className={`fa fa-trash text-danger p-1 ${(localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo ? 'text-muted' : 'text-primary'}`}
              //   onClick={() =>  (localdata?.defaultRole === 213 || row?.BillNo) return;
              //     handleModalState(
              //       true,
              //       "Rejection Reason",
              //       <RejectModal
              //         data={row}
              //         handleModalState={handleModalState}
              //         GetBindBillDepartment={GetBindBillDepartment}
              //       />,
              //       "25vw",
              //       <></>
              //     )
              //   }
              // />
              onClick={() => {
                if ((localdata?.defaultRole === 213 && auth?.CanCancelCTBItem == "0") || row?.BillNo) {
                  return;
                }

                handleModalState(
                  true,
                  "Rejection Reason",
                  <RejectModal
                    data={row}
                    handleModalState={handleModalState}
                    GetBindBillDepartment={GetBindBillDepartment}
                  />,
                  "25vw",
                  <></>
                );
              }}
            />
          </div>
        ),
        CTBDate: row?.CTBDate ? row?.CTBDate : "",
        CTBNo: row?.CTBNo ? row?.CTBNo : "",
        Item: row?.ItemName,
        Doctorname: row?.Doctorname,
        IssueDate: row?.IssueDate,
        Rate: <div className="text-right">{row?.Rate}</div>,
        Quantity: <div className="text-right">{row?.Quantity}</div>,
        DiscPer: <div className="text-right">{row?.DiscPer}</div>,
        DiscAmt: <div className="text-right">{row?.DiscAmt}</div>,
        Amount: <div className="text-right">{row?.Amount}</div>,
        Package: <div className="text-right">{row?.Package}</div>,
        Name: row?.Name,
        DiscGivenBy: row?.DiscGivenBy,
        Payable: row?.Payable,
      
      };
    });

    return {
      subRowList: tableResponse,
      isopen: subRow?.isopen,
      secondThead: [
          t("SN"),
        <input
          type="checkbox"
          onChange={(e) => handleMainCheck(e, inx, subRow?.subRowList)}
          checked={subRow?.subRowList?.length > 0 && subRow?.subRowList.every(
            (row, _) => row?.isChecked === true
          )}
        />,
         { width: "3%", name: t("Edit") },
        { width: "3%", name: t("Reject") },
        t("CTB Date"),
        t("CTB No"),

        {
          name: (
            <div className="d-flex align-items-center justify-content-center " style={{
              margin: "auto auto",position:"absolute",top:"3px",width:"120px"
            }}>
              <span calssName="d-inline-block">
                {t("Item")}
              </span>
              <Input
                type="text"
                className="table-input ml-1"
                removeFormGroupClass={true}
                placeholder={t("Search")}
                onChange={(e) => {
                  handleItemSearch(e, inx)
                }}
              />
            </div>
          ),
          width: "10%",
        },

        t("Doctor Name"),
        t("Date"),
        t("Rate"),
        t("Quantity"),
        t("Disc. %"),
        t("Disc.Amt."),
        t("Net Amt."),
        t("Package"),
        t("User"),
        t("Disc. Given By"),
        t("Non Payable"),
       
      ],
    };
  };

  const handleMini = (index) => {
    const tableData = JSON.parse(JSON.stringify(department));
    tableData[index]["subRow"]["isopen"] = false;
    setDepartment(tableData);
  };

  const handleMainCheck = (e, index, data) => {
    const { checked } = e.target;
    const val = JSON.parse(JSON.stringify(department));
    val[index]["subRow"]["subRowList"] = data.map((item, _) => {
      return {
        ...item,
        isChecked: checked,
      };
    });

    setDepartment(val);
  };

  const handleDepartmentTable = (tableData) => {
    return tableData?.map((item, index) => {
      const [_, configID] = item?.Category.split("#");
      return {
        Action: item?.subRow?.isopen ? (
          <div
            onClick={() => {
              handleMini(index);
            }}
            className="text-center"
          >
            <i className="fa fa-minus py-1 " aria-hidden="true"></i>
          </div>
        ) : (
          <div
            onClick={() => handleBillingShowItemDetails(item, index)}
            className="text-center"
          >
            <i className="fa fa-plus py-1 " aria-hidden="true"></i>
          </div>
        ),
        sno: index + 1,
        Department: item?.DisplayName,
        Quantity: <div className="text-right">{item?.Qty}</div>,
        Amount: (
          <div className="text-right">
            {Number(item?.NetAmt).toFixed(ROUNDOFF_VALUE)}
          </div>
        ),

        Edit:
          String(configID) === "14" ? (
            <div className="text-center">
              <i
                className="fa fa-edit text-primary"
                aria-hidden="true"
                onClick={() => {

                  handleModalState(
                    true,
                    "Edit Package",
                    <EditPackage
                      pateintDetails={pateintDetails}
                      handleModalState={handleModalState}
                      GetBindBillDepartment={GetBindBillDepartment}
                    />,
                    "40vw",
                    <></>
                  );
                }}
              ></i>
            </div>
          ) : (
            ""
          ),
        ViewLog: (
          <div className="text-center">
            <i className="fas fa-search" aria-hidden="true"></i>
          </div>
        ),
        subRow: handleDepartmentSubRow(item?.subRow, index),
      };
    });
  };
  console.log("BillDetails", BillDetails[0]?.GrossAmt);
  console.log("BillDetails", BillDetails);
  const handleDataInDetailView = useMemo(() => {
    if (BillDetails?.length > 0) {
      const data = [
        {
          label: "Gross Amount",
          value: BillDetails[0]?.GrossAmt || "0.00",
        },
        {
          label: "Discount",
          value: BillDetails[0]?.TDiscount || "0.00",
        },
        {
          label: "Net Amount",
          value: BillDetails[0]?.NetAmt || "0.00",
        },
        // {
        //   label: "Deduction",
        //   value: BillDetails[0]?.TotalDeduction || "0",
        // },
        {
          label: "Tax (Amount)",
          value: BillDetails[0]?.recAmt || "0.00",
        },
        // {
        //   label: "Net Bill Amount",
        //   value: (
        //     parseFloat(BillDetails[0]?.NetAmt) -
        //     parseFloat(BillDetails[0]?.TDiscount) || 0
        //   ).toFixed(2),
        // },
        // {
        //   label: "Round Off",
        //   value: BillDetails[0]?.RoundOff || "0.00",
        // },
        // {
        //   label: "Allocated",
        //   value: "0.00",
        // },
        {
          label: "Receved Amt",
          value: BillDetails[0]?.RecAmt || "0.00",
        },
        {
          label: "Remaining Amt",
          value: BillDetails[0]?.RemainingAmt || "0.00",
        },
        {
          label: "Approved Amt",
          value: BillDetails[0]?.PanelApprovedAmt || "0",
        },

      ];

      return data;
    } else {
      return [];
    }
  }, [BillDetails]);
  const serviceBooking_list = useMemo(() => {
    if (BillDetails?.length > 0) {
      const data = [

        {
          label: "Ceiling Amt",
          value: serviceBookinglist?.CeilingAmt || "0",
        },
        {
          label: "Advance Amt",
          value: serviceBookinglist?.AdvanceAmt || "0",
        },
        {
          label: "CMS Amt",
          value: serviceBookinglist?.CMSAmt || "0",
        },
        {
          label: "CMS Utl Amt",
          value: (serviceBookinglist?.CMSUtilizeAmount)?.toFixed(2) || "0",
        },
        {
          label: "CMS Bal Amt",
          value: (Number(serviceBookinglist?.CMSAmt ?? 0) - Number(serviceBookinglist?.CMSUtilizeAmount ?? 0))?.toFixed(2) || "0",
        },
        {
          label: "ESI App Amt",
          value: serviceBookinglist?.ESIApprovalAmount || "0",
        },
        {
          label: "ESI Utl Amt",
          value: serviceBookinglist?.ESIUtilizeAmount || "0",
        },
        {
          label: "ESI Bal Amt",
          value: (Number(serviceBookinglist?.ESIApprovalAmount ?? 0) - Number(serviceBookinglist?.ESIUtilizeAmount ?? 0)?.toFixed(2)) || "0",
        },
        {
          label: "Echs  Days",
          value: serviceBookinglist?.EchsApprovalDays || "0",
        },
        {
          label: "Treatment Amt",
          value: serviceBookinglist?.TreatmentAmt || "0",
        },
        {
          label: "Tt UTL Amt",
          value: serviceBookinglist?.TreatmentUtilizeAmount || "0",
        },
        {
          label: "Tt Bal Amt",
          value: (
            Number(serviceBookinglist?.TreatmentAmt ?? 0) -
            Number(serviceBookinglist?.TreatmentUtilizeAmount ?? 0)
          )?.toFixed(2),
          // value: Number(serviceBookinglist?.TreatmentAmt ?? 0) - Number(serviceBookinglist?.TreatmentUtilizeAmount ?? 0) || "0",
        },
      ];

      return data;
    } else {
      return [];
    }
  }, [serviceBookinglist]);

  const handleIPDAdvanceBindPatientDetails = async (
    patientID,
    transactionID
  ) => {
    try {
      const response = await IPDAdvanceBindPatientDetails(
        patientID,
        transactionID
      );
      setPatientDetails(response?.data[0]);
    } catch (error) {
      console.log(error, "Somthing Went Wrong");
    }
  };

  const handleSaveAddItemSuccessfully = async () => {
    await GetBindBillDepartment();
    setSlideScreenState({
      show: false,
      name: "",
      component: null,
    });
  };

  const handlePatientBillingPayable = async (type) => {
    store.dispatch(setLoading(true));
    try {
      const checkedData = [];
      for (let i = 0; i < department?.length; i++) {
        const { subRow } = department[i];
        for (let j = 0; j < subRow?.subRowList?.length; j++) {
          if (subRow?.subRowList[j]?.["isChecked"] === true) {
            checkedData.push(`'${subRow?.subRowList[j]?.["LtNo"]}'`);
          }
        }
      }

      const response = await PatientBillingPayable({
        isSurgery: false,
        type: String(type),
        ipAddress: String(ip),
        ltdNo: checkedData.join(","),
      });

      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success) {
        handleModalState(false, null, null, null, null);
        await GetBindBillDepartment();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };
  console.log("first", data?.panelID)
  const OPDServiceBookinglist = async () => {
    try {

      let payload = {
        "PatientID": data?.patientID ? data?.patientID : "",
        "Type": 1,
        "TransactionId": data?.transactionID ? data?.transactionID : "",
        PannelID: data?.panelID

      }

      const response = await OPDServiceBookingChecklist(payload);
      if (response?.success) {

        setServiceBookinglist(response?.data[0])

      }
      else {
        notify(response?.message, "error");
        setServiceBookinglist([])

      }

    } catch (error) {
      console.error("Error saving Pro Name:", error);

    }
  }

  const handlePatientBillingAllTabSave = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      payload.ipAddress = String(ip);
      const checkedData = [];
      for (let i = 0; i < department?.length; i++) {
        const { subRow } = department[i];
        for (let j = 0; j < subRow?.subRowList?.length; j++) {
          if (subRow?.subRowList[j]?.["isChecked"] === true) {
            checkedData.push(`'${subRow?.subRowList[j]?.["LtNo"]}'`);
          }
        }
      }
      payload.ltdNo = checkedData.join(",");

      const response = await PatientBillingAllTabSave(payload);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleModalState(false, null, null, null, <></>);
        GetBindBillDepartment();
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  //   console.log("first",data?.admitDate)
  //   console.log("first2",serviceBookinglist?.EchsApprovalDays)

  //   const handleSlideScreen = () => {
  // if(serviceBookinglist?.EchsApprovalDays==0){
  //   notify("Approval Days: 0 — Kindly exceed the Panel Approval Days","warn")
  //   return
  // }
  const handleSlideScreen = () => {

    const approvalDays = serviceBookinglist?.EchsApprovalDays;
    const admitDate = new Date(data?.admitDate);
    const today = new Date();

    // Calculate difference in days between today and admitDate
    const diffInMs = today - admitDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (data?.panelID == "325") {
      if (!serviceBookinglist?.EchsApprovalDays || !data?.admitDate) {
        notify("Approval Days: 0 — Kindly exceed the Panel Approval Days", "warn")
        return
      };

      if (approvalDays === 0 || diffInDays >= approvalDays) {
        notify(
          `Approval Days: ${approvalDays} — Kindly exceed the Panel Approval Days`,
          "warn"
        );
        return;
      }
    }


    // const approvalDays = 1;

    // Condition 1: Approval days = 0
    // Condition 2: Days since admitDate >= approvalDays


    // Else continue your flow...



    setSlideScreenState({
      name: t("Add Services Details"),
      show: true,
      component: (
        <div className="card patient_registration border mt-2">
          <div className="row p-2">
            <div className="col-sm-12">
              <IPDServices
                data={data}
                setIsPackageAdd={setIsPackageAdd}
                pateintDetails={pateintDetails}
                Authorization={Authorization}
                handleSaveAddItemSuccessfully={handleSaveAddItemSuccessfully}
                GetBindBillDetails={GetBindBillDetails}
                OPDServiceBookingcall={OPDServiceBookinglist}
              />
            </div>
          </div>
        </div>
      ),
    });
  };
  console.log("handleDataInDetailView", handleDataInDetailView)
  return (
    <>
      <div
        className="card"
      >
        <Heading title={<div>{t("Patient Bill Details")}</div>} />
        <div className="">
          <div className="row m-2">
            {handleDataInDetailView?.map((data, index) => (
              <>
                <div
                  className="col-xl-1 col-md-3 col-sm-6 col-12 p-2"
                  //  className="col-xl-2 col-md-4 col-sm-6 col-12 "
                  key={index}
                // style={{
                //   display: "grid",
                //   alignItems: "center",
                // }}
                >
                  <div className="d-flex align-items-center">
                    {data?.icons}
                    <LabeledInput
                      label={t(data?.label)}
                      value={data?.value}
                      className={"w-100"}
                      // valueClassName="red"
                      style={{ textAlign: "right", color: "red" }}
                    />
                  </div>
                </div>
              </>
            ))}
            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <div className="d-flex justify-content-left">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    handleModalState(
                      true,
                      t("Billing Remarks"),
                      <BiilingRemarkModal
                        pateintDetails={pateintDetails}
                        handleModalState={handleModalState}
                        GetBindBillDepartment={GetBindBillDepartment}
                      />,
                      "25vw",
                      <></>
                    )
                  }
                >
                  {t("Billing Remarks")}
                </button>
                {/* <button className="btn btn-sm btn-success ml-3">Request</button> */}
              </div>
            </div>
          </div>
          {
            console.log("serviceBooking_list", serviceBooking_list)
          }
          <div className="row m-2">
            {serviceBooking_list?.map((data, index) => (
              <>
                <div
                  className="col-xl-1 col-md-4 col-sm-6 col-12"
                  //  className="col-xl-2 col-md-4 col-sm-6 col-12 "
                  key={index}
                // style={{
                //   display: "grid",
                //   alignItems: "center",
                // }}
                >
                  <div className="d-flex align-items-center">
                    {data?.icons}
                    <LabeledInput
                      label={t(data?.label)}
                      value={data?.value}
                      className={"w-100"}
                      // valueClassName="red"
                      style={{ textAlign: "right", color: "red" }}
                    />
                  </div>
                </div>
              </>

            ))}
            {
              data?.panelID == "325" && Number(serviceBookinglist?.EchsApprovalDays) <= 0 ? (<h1 className="text-red">Approval Days: 0 — Kindly exceed the Panel Approval Days</h1>) : ""

            }
          </div>

        </div>

      </div>
      <div className="card patient_registration border mt-2">
        <div className="card card_background">
          <Heading
            title={<div>{t("Department Details")}</div>}
            secondTitle={
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSlideScreen}
              >
                {t("Add Services")}
              </button>
            }
          />
          {localdata?.defaultRole !== 213 && <div className="d-flex align-items-center justify-content-end p-1">
            {iconElements.map((item, index) => (
              <div key={index} style={{ display: "inline-block" }}>
                <Tooltip
                  target={`#icon-${index}`}
                  content={t(item.tooltipText)}
                  event="hover"
                  position="top"
                />
                <span
                  id={`icon-${index}`}
                  onClick={item.onClick ? item.onClick : null}
                >
                  <item.Component />
                </span>
              </div>
            ))}
          </div>}

          <div className="row p-2">
            <PackageTable pateintDetails={pateintDetails} isPackageAdd={isPackageAdd} setIsPackageAdd={setIsPackageAdd} />
          </div>
          <div className="row p-2">
            <div className="col-12">
              <BillingDepartmentDetailTable
                thead={thead}
                tbody={handleDepartmentTable(department)}
              />

            </div>
          </div>
        </div>
      </div>

      <SlideScreen
        visible={slideScreenState?.show}
        setVisible={() =>
          setSlideScreenState({
            show: false,
            name: "",
            component: null,
          })
        }
        Header={slideScreenState?.name}
      >
        {slideScreenState?.component}
      </SlideScreen>

      <Modal
        Header={modalState?.name}
        modalWidth={modalState?.size}
        visible={modalState?.show}
        setVisible={() => {
          handleModalState(false, null, null, null, <></>);
        }}
        footer={modalState?.footer}
      >
        {modalState?.component}
      </Modal>
    </>
  );
};

export default PatientBilling;
