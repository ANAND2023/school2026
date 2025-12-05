import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../../../components/UI/CancelButton";
import { ApprovalGRNAppovalCancel } from "../../../networkServices/purchaseDepartment";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
    ChangeDoctorInApi,
    ChangeTransactionalPanel,
    CheckPanelWiseRate,
    GetBindDoctorforChangePatient,
    getBindPanelListforchangedetails,
    OPDChangeTransactionalDoctor,
    OPDCheckDoctorWiseRate,
    OPDUpdateBillDetails,
} from "../../../networkServices/opdserviceAPI";
import moment from "moment";
import LabeledInput from "../../../components/formComponent/LabeledInput";

export default function InOutRecipt({
    handleClose,
    inputData,
    handleSearch,
    setTbodyRequestDetails,
    changeDoctor
}) {
    console.log(inputData);
    
    const [t] = useTranslation();
    const [data, setData] = useState(inputData);
    console.log("data", data);
    const [values, setValues] = useState({
        doctor: {},
        panel: {},
        pin:{},
        pout:{}
    });
    console.log("values", values)
    const [panelRate, setPanelRate] = useState({
        "OldRate": "",
        "NewRate": "",
        "IsPanelRate": "",
        "IsDoctorRate": "",
        "text": "",
        "ItemID": ""
    }
    )

    console.log("inputDatainputData", inputData);
    const [dropDownState, setDropDownState] = useState({
        GetBindAllDoctor: [],
        getBindAllPanel: [],
    });

    const checkPanelRate = async (panelID, ledgerNo) => {

        try {
            const response = await CheckPanelWiseRate(panelID, ledgerNo);
            if (response?.success) {
                const isDisable = response?.data[0]?.IsPanelRate == 1 ? false : true;
                setPanelRate({
                    ...response?.data[0],
                    IsPanelRate: isDisable,

                });

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    }
    const getDoctorWiseRate = async (DoctorID, ledgerNo) => {

        try {
            const response = await OPDCheckDoctorWiseRate(DoctorID, ledgerNo);
            if (response?.success) {
                const isDisable = response?.data[0]?.IsDoctorRate == 1 ? false : true;
                setPanelRate({
                    ...response?.data[0],
                    IsDoctorRate: isDisable,

                });

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    }


    const HandleSaveDoctor = async () => {
        
        try {
            let payload =
            {
                "ledgetTnxNo": String(data?.LedgertransactionNo),
                "transactionID": String(data?.TransactionID),
        //         itemID: String(panelRate?.ItemID?.split("#")[0] || ""),
                // changeType: 1,
                pin:values?.pin?.value ? Number(values?.pin?.value) : Number(values?.pin),
                pout:values?.pout?.value ?Number(values?.pout?.value) :Number(values?.pout)
           }
            console.log("payload", payload);
            let apiResp = await ChangeDoctorInApi(payload);
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                handleClose();
                handleSearch();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
        }
    };

    const getBindDoctor = async () => {
        try {
            const response = await GetBindDoctorforChangePatient();
            setDropDownState((val) => ({
                ...val,
                GetBindAllDoctor: handleReactSelectDropDownOptions(
                    response?.data,
                    "Name",
                    "DoctorID"
                ),
            }));
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const getBindPanel = async () => {

        try {
            const response = await getBindPanelListforchangedetails();
            console.log("response", response);
            // const response = await bindPanelByPatientID(data?.PatientID);
            setDropDownState((val) => ({
                ...val,
                getBindAllPanel: handleReactSelectDropDownOptions(
                    response?.data,
                    "Company_Name",
                    "PanelID"
                ),
            }));
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const handleReactChange = (name, e, key) => {

        // if (name === "panel") {
        //   checkPanelRate(e?.PanelID, data?.LedgertransactionNo);
        // }
        // else if (name === "doctor") {
        //   getDoctorWiseRate(e?.DoctorID, data?.LedgertransactionNo);
        // }
        setValues((val) => ({ ...val, [name]: e }));
    };

    useEffect(() => {

        // if (changeDoctor) {
        //   getBindDoctor();
        // }
        // else {
        //   getBindPanel();
        // }
        debugger
        setValues((preV) => ({
            ...preV,
            // doctor: data?.DoctorID,
            // panel: data?.PanelID,
            pin:data?.P_IN !== null ? String(data?.P_IN) :"0",
            pout:data?.P_Out !== null ? String(data?.P_Out) :"0"
        }));
    }, [data]);

    console.log(values);
    
    return (
        <div
        // className="card patient_registration border mt-2"
        >
            {/* <Heading title={t("Change Details")} isBreadcrumb={false} /> */}

            <div className="container">
                <div className="row p-2">

                    <div className="col-md-6 col-12 mb-3">
                        <LabeledInput label={t("Patient Name")} value={data?.PatientName} />
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <LabeledInput label={t("Consultant")} value={data?.DoctorName} />
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <LabeledInput label={t("UHID")} value={data?.PatientID} />
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <LabeledInput label={t("Bill No.")} value={data?.BillNo} />
                    </div>

                    <div className="col-md-6 col-12 mb-3">
                        <ReactSelect
                            placeholderName={t("Select Pin")}
                            id="pin"
                            name="pin"
                            searchable
                            removeIsClearable
                            dynamicOptions={[{label:"Yes",value:"1"},{label:"No",value:"0"}]}
                            handleChange={(name, e) => handleReactChange(name, e)}
                            value={values?.pin || null}
                        />
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <ReactSelect
                            placeholderName={t("Select POut")}
                            id="pout"
                            name="pout"
                            searchable
                            removeIsClearable
                            dynamicOptions={[{label:"Yes",value:"1"},{label:"No",value:"0"}]}
                            handleChange={(name, e) => handleReactChange(name, e)}
                            value={values?.pout || null}
                        />
                    </div>
                    {/* {changeDoctor && (
              <div className="col-md-6 col-12 mb-3">
                <ReactSelect
                  placeholderName={t("Change Doctor")}
                  id="doctor"
                  name="doctor"
                  searchable
                  removeIsClearable
                  dynamicOptions={dropDownState?.GetBindAllDoctor}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  value={values?.doctor || null}
                />
              </div>
            ) } */}

                </div>
            </div>
            <div className="ftr_btn">
                 <SaveButton btnName={"Save"} onClick={HandleSaveDoctor} />
                 <CancelButton cancleBtnName={"Cancel"} onClick={() => handleClose()} />
            </div>
        </div>
    );
}
