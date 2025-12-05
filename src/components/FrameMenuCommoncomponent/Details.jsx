import React, { useEffect, useMemo, useState } from 'react'
import Heading from '../UI/Heading'
import LabeledInput from '../formComponent/LabeledInput'
import { useTranslation } from 'react-i18next';
import { GetBillDetails, OPDServiceBookingChecklist } from '../../networkServices/BillingsApi';

const Details = ({ data }) => {
  const [serviceBookinglist, setServiceBookinglist] = useState([]);
  const [BillDetails, setBillDetails] = useState([]);
  const GetBindBillDetails = async () => {
    const transID = data?.transactionID;
    try {
      const datas = await GetBillDetails(transID);
      setBillDetails(datas?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const OPDServiceBookinglist = async () => {
    debugger //anand
    try {

      let payload = {
        "PatientID": data?.patientID ? data?.patientID : "",
        "Type": 1,
        "TransactionId": data?.transactionID ? data?.transactionID : "",
        PannelID: data?.panelID
      }

      const response = await OPDServiceBookingChecklist(payload);
      if (response?.success) {
        // notify(response?.message, "success");
        setServiceBookinglist(response?.data[0])
        // setIsOpen()
        // setModalData({});
        // dispatch(GetBindReferDoctor());
      }
      else {
        // notify(response?.message, "error");
        // setIsOpen()
        // setModalData({});
      }

    } catch (error) {
      console.error("Error saving Pro Name:", error);

    }
  }
  const [t] = useTranslation();
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
          label: "CMS Utilize Amt",
          value: serviceBookinglist?.CMSUtilizeAmount || "0",
        },
         {
          label: "CMS Bal Amt",
          value: Number(serviceBookinglist?.CMSAmt ?? 0) - Number(serviceBookinglist?.CMSUtilizeAmount ?? 0) || "0",
        },
        {
          label: "ESI App Amt",
          value: serviceBookinglist?.ESIApprovalAmount || "0",
        },


        {
          label: "ESI Utilize Amt",
          value: serviceBookinglist?.ESIUtilizeAmount || "0",
        },
        {
          label: "ESI Bal Amt",
          value: Number(serviceBookinglist?.ESIApprovalAmount ?? 0) - Number(serviceBookinglist?.ESIUtilizeAmount ?? 0) || "0",
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
              value:
                (Number(serviceBookinglist?.TreatmentAmt || 0) -
                Number(serviceBookinglist?.TreatmentUtilizeAmount || 0)).toFixed(2)??0, 
            },
      ];

      return data;
    } else {
      return [];
    }
  }, [serviceBookinglist]);
  //   const serviceBooking_list = useMemo(() => {
  //     if (BillDetails?.length > 0) {
  //       const data = [

  //         {
  //           label: "Ceiling Amt",
  //           value: serviceBookinglist?.CeilingAmt || "0",
  //         },
  //         {
  //           label: "Advance Amt",
  //           value: serviceBookinglist?.AdvanceAmt || "0",
  //         },
  //         {
  //           label: "CMS Amt",
  //           value: serviceBookinglist?.CMSAmt || "0",
  //         },
  //         {
  //           label: "ESI App Amt",
  //           value: serviceBookinglist?.ESIApprovalAmount || "0",
  //         },
  //         {
  //           label: "Echs  Days",
  //           value: serviceBookinglist?.EchsApprovalDays || "0",
  //         },
  //          {
  //   label: "CMS Utilize Amt",
  //   value: serviceBookinglist?.CMSUtilizeAmount || "0",
  // },
  // {
  //   label: "ESI Utilize Amt",
  //   value: serviceBookinglist?.ESIUtilizeAmount || "0",
  // },
  //       ];

  //       return data;
  //     } else {
  //       return [];
  //     }
  //   }, [serviceBookinglist]);
  useEffect(() => {
    GetBindBillDetails()
    OPDServiceBookinglist()
  }, [])
  return (
    <>
      <div className=''>
        <Heading title={t("Patients Demographic Details")} isBreadcrumb={false} />
        <div className="row py-2 gap-2">
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("IPD No")} value={data?.ipdno} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("UHID")} value={data?.patientID} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Patient Name")} value={data?.pName} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Age/Gender")} value={data?.ageSex} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Mobile No.")} value={data?.mobile} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Panel")} value={data?.company_Name} />
          </div>
        </div>
        <div className="row py-2">
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Room No.")} value={data?.roomName} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Current Doctor")} value={data?.dName} />
          </div>

          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Admit Date")} value={data?.admitDate} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Discharge Date")} value={data?.dischargeDate} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <LabeledInput label={t("Status")} value={data?.dischargeDate} />
          </div>
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <div className="d-flex justify-content-left">
                  <button className="btn btn-sm btn-success ml-3">
                    Vitals
                  </button>
                </div>
              </div> */}
        </div>
      </div>
      <div >
        <Heading title={t("Patient Bill Details")} isBreadcrumb={false} />
        <div className='row'>
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
          {
            console.log("serviceBooking_list",serviceBooking_list)
          }
          {serviceBooking_list?.map((data, index) => (
            <>
              <div
                className="col-xl-1 col-md-4 col-sm-6 col-12 p-2"
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
        </div>

      </div>
    </>
  )
}

export default Details