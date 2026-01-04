import { useTranslation } from "react-i18next";
import Input from "../../formComponent/Input";
import OverLay from "../../modalComponent/OverLay";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  PatientSearchbyBarcode,
//   SaveAdvanceAmount,
} from "../../../networkServices/opdserviceAPI";
import {
  CostEstimateBillPayload,
  isChecked,
  PAYMENT_OBJECT,
} from "../../../utils/constant";
import ReactSelect from "../../formComponent/ReactSelect";
import Modal from "../../modalComponent/Modal";
import { useFormik } from "formik";
import PaymentGateway from "../../front-office/PaymentGateway";
import {
  notify,
} from "../../../utils/utils";

import Heading from "../../UI/Heading";
import moment from "moment";
import {
  BindEstimationByDefault,

  BindPredefinedEstimation,

} from "../../../networkServices/CostEstimateBillingAPI";

import SearchComponentByUHIDMobileName from "../../commonComponents/SearchComponentByUHIDMobileName";
import DetailsCardForDefaultValue from "../../commonComponents/DetailsCardForDefaultValue";
import Index from "../../../pages/pharmacy/PatientIssue";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Payment from "../../Payment/Payment";
export default function FeesPayment() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const ip = useLocalStorage("ip", "get");
  const [singlePatientData, setSinglePatientData] = useState({});
  const [visible, setVisible] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  const [DropDownState, setDropDownState] = useState({
    // getDoctorDeptWise: [],
    // getRoomType: [],
    // getBindIPDPackage: [],
    // getBindSurgeryList: [],
    // SearchList: [],
    // PreEstimateCost: [],
    // EstimationByDefault: [],
    // CategoryList: [],
    // SubCategoryList: [],
  });
  const SearchCostEstimateBilling = async () => {
    const newValues = {
      // ...values,
      packageID: Number(values?.packageID?.value ?? "0"),
      surgeryID: Number(values?.surgeryID?.value ?? "0"),
      panelID: Number(values?.PanelID?.value ?? 0),
      doctorID: Number(values?.DoctorID?.value ?? "0"),
      icdCode: values?.icdCode,
      roomType: values?.roomType?.value ?? "0",
      limit: Number(values?.limit ?? "0"),
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
    };

    try {
      if (!parseInt(newValues?.limit)) {
        notify("Please Enter Limit", "error");
      }
      {
        const dataRes = await BindPredefinedEstimation(newValues);
        setDropDownState((prevState) => ({
          ...prevState,
          SearchList: dataRes.data,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };



  const getBindEstimationByDefault = async () => {
    try {
      const dataRes = await BindEstimationByDefault();

      if (dataRes?.data) {
        return dataRes?.data
        // setDropDownState((prevState) => ({
        //   ...prevState,
        //   EstimationByDefault: dataRes.data,
        // }));
      } else {
        console.log("No data received");
      }
    } catch (error) {
      console.error("Error fetching PreEstimateCost:", error);
    }
  };
  
  const { values, setFieldValue, handleChange, setValues, handleSubmit } =
    useFormik({
      initialValues: CostEstimateBillPayload,
      onSubmit: (values, { resetForm }) => {
        SearchCostEstimateBilling();
      },
    });
  const [navValues, setNavValues] = useState({
    CostEstimateType: { lable: "Insurance", value: "Insurance" },
  })

 
 
  const handleReactSelectNav = (name, value) => {
    setNavValues((preV) => ({
      ...preV,
      [name]: value
    }))
  };

  const bindAllAPI = async () => {
 

  };

  useEffect(() => {

    bindAllAPI();


  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getBindEstimationByDefault();
      console.log("result", result);

      if (navValues?.CostEstimateType?.value === "Patient") {
        setDropDownState((prev) => ({
          ...prev,
          EstimationByDefault: result,
        }));
      }
      else {
        setDropDownState((prev) => ({
          ...prev,
          EstimationByDefault: [],
        }));
      }
    };

    fetchData();
  }, [navValues?.CostEstimateType]);


  const sendReset = () => {
    setSinglePatientData({});
    setPaymentControlModeState(PAYMENT_OBJECT);
    setPaymentMethod([]);
  };

  const handleTypeDropwn = () => {
    setPaymentControlModeState(PAYMENT_OBJECT);
    setPaymentMethod([]);
  };

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  const handlePaymentGateWay = (details) => {
    const {
      panelID,
      billAmount,
      discountAmount,
      isReceipt,
      patientAdvanceAmount,
      autoPaymentMode,
      minimumPayableAmount,
      panelAdvanceAmount,
      disableDiscount,
      refund,
      constantMinimumPayableAmount,
      discountIsDefault,
      coPayIsDefault,
    } = details;

    const setData = {
      panelID,
      billAmount,
      discountAmount,
      isReceipt,
      patientAdvanceAmount,
      autoPaymentMode,
      minimumPayableAmount,
      panelAdvanceAmount,
      disableDiscount,
      refund,
      constantMinimumPayableAmount,
      discountIsDefault,
      coPayIsDefault,
    };
    setPaymentMethod([]);
    setPaymentControlModeState(setData);
  };

  const handleSinglePatientData = async (data) => {
    const { MRNo } = data;
    try {
      const data = await PatientSearchbyBarcode(MRNo, 1);
      setSinglePatientData(
        Array.isArray(data?.data) ? data?.data[0] : data?.data
      );

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    calculateTotalAmount(DropDownState?.EstimationByDefault)
  }, [DropDownState?.EstimationByDefault])
  const calculateTotalAmount = (data) => {
    const total = data
      ?.filter((item) => item.isChecked === "1")
      ?.reduce((sum, item) => sum + (parseFloat(item.Amount) || 0), 0);

    setTotalAmount(total);
  };
 


  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={"Search Criteria"}
          isBreadcrumb={true}
          secondTitle={
            <>
              <button
                className="btn btn-xs text-white"
                onClick={() =>
                  ModalComponent(
                    t("NewRegistration"),
                    <Index
                      bindDetail={true}
                      bindDetailAPI={handleSinglePatientData}
                      setVisible={setVisible}
                    />
                  )
                }
              >
                {t("NewRegistration")}
              </button>
            </>
          }
        />

        {Object.keys(singlePatientData)?.length === 0 ? (
          <SearchComponentByUHIDMobileName onClick={handleSinglePatientData} />
        ) : (
          <>
            <DetailCard
              ModalComponent={ModalComponent}
              singlePatientData={singlePatientData}
              values={values}
              setValues={setValues}
              setFieldValue={setFieldValue}
              handlePaymentGateWay={handlePaymentGateWay}
              handleTypeDropwn={handleTypeDropwn}
              sendReset={sendReset}
            />
            <div className="card patient_registration border">
              <Heading
                title={t(
                  "Cost Estimate Billing"
                )}
              />
              <ReactSelect
                placeholderName={t("Cost Estimate Type")}
                id={"CostEstimateType"}
                name={"CostEstimateType"}
                dynamicOptions={[
                  { label: "Insurance", value: "Insurance" },
                  { label: "Patient", value: "Patient" },
                ]}
                handleChange={handleReactSelectNav}
                value={navValues?.CostEstimateType?.value}
                // searchable={true}
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              />
            </div>
           
          </>
        )}

      </div>

      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        button={""
        //   <button className="button" onClick={handleSaveOPDAdvance}>
        //     {values?.Type?.label === "Advance"
        //       ? t("Advance")
        //       : t("FrontOffice.OPD.OPDAdvance.label.Refund")}
        //   </button>
        }
      />
      <OverLay
        visible={visible}
        setVisible={setVisible}
        Header={renderComponent?.name}
      >
        {renderComponent?.component}
      </OverLay>
    </>
  );
}

const DetailCard = ({ ModalComponent, singlePatientData, sendReset }) => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
 
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  useEffect(() => {
    setHandleModelData((val) => ({ ...val, modalData: modalData }));
  }, [modalData]);

  const handleDataInDetailView = useMemo(() => {
    const data = [
      {
        label: t("PatientId"),
        value: `${singlePatientData?.PatientID}`,
      },
      {
        label: t("PatientName"),
        value: `${singlePatientData?.Title} ${singlePatientData?.PName}`,
      },
      {
        label: t("GenderAge"),
        value: `${singlePatientData?.Gender} / ${singlePatientData?.Age}`,
      },
      {
        label: t("ContactNo"),
        value: singlePatientData?.Mobile,
      },
    //   {
    //     label: t("Address"),
    //     value: singlePatientData.House_No,
    //   },
    //   {
    //     label: t("OutStanding"),
    //     value: singlePatientData?.Outstanding ?? "0",
    //   },
     
    ];

    return data;
  }, [singlePatientData]);
   
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <DetailsCardForDefaultValue
        singlePatientData={handleDataInDetailView}
        // seeMore={SEEMOREDETAILS}
        ModalComponent={ModalComponent}
        sendReset={sendReset}
      />
      <Payment 
      />
    </>
  );
};