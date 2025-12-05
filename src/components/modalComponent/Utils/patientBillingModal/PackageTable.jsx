import React, { useEffect, useState } from 'react'
import { PatientBillingGetPackage } from '../../../../networkServices/BillingsApi';
import Tables from '../../../UI/customTable';
import { useTranslation } from 'react-i18next';
import Heading from '../../../UI/Heading';

const PackageTable = ({ pateintDetails,isPackageAdd,setIsPackageAdd }) => {
  
  const [t] = useTranslation();
  
  const [tableData, setTableData] = useState([])
  const handlePatientBillingGetPackage = async (TransactionID) => {
  
    try {

      const response = await PatientBillingGetPackage(TransactionID);
      if (response?.success) {
        setTableData(response?.data)
      }
      else {
        setTableData([])
        console.log("message", response?.message)
      }
      console.log("firstresponse", response)

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  if(isPackageAdd){
     handlePatientBillingGetPackage(pateintDetails?.TransactionID);
     setIsPackageAdd(false)
  }
  useEffect(() => {
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
  }, [pateintDetails,isPackageAdd])
  const THEAD = [
    { name: t("S No."), width: "5%" },
    { name: t("Name"), width: "10%" },
    { name: t("PDate"), width: "15%" },
    { name: t("Quantity"), width: "10%" },
    { name: t("Package Amt"), width: "10%" },
    { name: t("Hospital Total Amt"), width: "20%" },
    { name: t("Utilize Hospital Amt"), width: "10%" },
    { name: t("Hospital balance Amt"), width: "10%" },
    { name: t("Pharmacy Total Amt"), width: "1%" },
    { name: t("Utilize Pharmacy Amt"), width: "1%" },
    { name: t("Pharmacy Balance Amt"), width: "1%" },
    { name: t("Only Utilize Pharmacy Amt"), width: "1%" },
    { name: t("Only Utilize Hospital Amt"), width: "1%" },

  ];
console.log("tableData",tableData)
  return (
    <div className="col-12">
      {
        tableData?.length > 0 && (
          <>

            <Heading title={t("Package Details")} isBreadcrumb={false} />
            <Tables
              thead={THEAD}
              //   handleDoubleClick={(rowData, rowIndex) => {
              //     handlePOClick(rowData?.PONo); // Example function
              //   }}
              tbody={tableData?.map((val, ind) => {
                return {
                Sno: ind + 1,
                // PONo: <span onDoubleClick={()=>handlePOClick(val?.PONo)}>{val?.PONo}</span>,
                TypeName: val?.TypeName,
                PDate: val?.PDate,
                Quantity: val?.Quantity ? val?.Quantity : "0",
                Amount: val?.Amount  ? val?.Amount : "0",
                HospitalTotalAmount: val?.HospitalTotalAmount ? val?.HospitalTotalAmount : "0",
                UtilizeHospitalAmt: val?.UtilizeHospitalAmt ? val?.UtilizeHospitalAmt : "0",
                HospitalAmt: val?.HospitalAmt ? val?.HospitalAmt : "0",
                PharmacyTotalAmount: val?.PharmacyTotalAmount ? val?.PharmacyTotalAmount : "0",
                UtilizePharmacyAmt: val?.UtilizePharmacyAmt ? val?.UtilizePharmacyAmt : "0",
                PharmacyAmt: val?.PharmacyAmt ? val?.PharmacyAmt : "0",
                OnlyUtilizePharmacyAmt: val?.OnlyUtilizePharmacyAmt ? val?.OnlyUtilizePharmacyAmt : "0",
                OnlyUtilizeHospitalAmt: val?.OnlyUtilizeHospitalAmt ? val?.OnlyUtilizeHospitalAmt : "0",

              }
              }
        )}
              style={{ maxHeight: "auto" }}
              tableHeight={"scrollView"}
            //   tableHeight={"scrollView"}
            />
          </>
        )
      }

    </div>
  )
}

export default PackageTable