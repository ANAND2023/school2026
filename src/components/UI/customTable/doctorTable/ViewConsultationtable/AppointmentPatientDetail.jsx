import React, { useEffect, useMemo, useState, useRef, Suspense } from "react";
import LabeledInput from "../../../../formComponent/LabeledInput";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import DoctorDetails from "../../../../HelpDesk/DoctorDetails";
import {
  LoadPrescriptionView,
  updateFileClosed,
  saveTemplateAPI,
  getListBindMenu,
  holdAPI,
  setGetOutPatientAPI,
  getGetDoctor,
  SaveMedicineTemplate,
  SavePrescriptionForm,
  SaveSMS,
  sendEmail,
  GetPrescription,
  SavePrescriptionDraft,
  GetOldAppointentData,
  getGetMolecular,
  DoctorPrescriptionGetTopSuggestion,
  CommonAPIGetDoctorIDByEmployeeID,
  DoctorGetPrescriptionview,
  DoctorUpdatePrescriptionview,
  updateFileOpen,
  saveInvestigationFavoriteTemplateApi,
  getInvestigationFavoriteTemplateApi,
  getInvestigationFavoriteTemplateDetailsApi,
  getLabRadiologyCategoryApi,
  getLabRadiologySubCategoryApi,
  SearchByICDDesc,
  BindLeave,
  GetEditTemplate,
} from "../../../../../networkServices/DoctorApi";
import Modal from "../../../../modalComponent/Modal";
import TemplateSearchModal from "../../../../modalComponent/Utils/TemplateSearchModal";
import Heading from "../../../Heading";
import { AutoComplete } from "primereact/autocomplete";
import {
  handleActiveInputVoiceToText,
  notify,
  reactSelectOptionList,
} from "../../../../../utils/utils";
import Favorite from "./Favorite";
import PrescribedMedicineTable from "./PrescribedMedicineTable";
import SystemMaticEmergency from "../../../../Doctor/SystemMaticEmergency";
import {
  AUTOCOMPLETE_STATE,
  PRESCRIBED_MEDICINE,
} from "../../../../../utils/constant";
import ReactSelect from "../../../../formComponent/ReactSelect";

import ScrollComponent from "../../../../ScrollComponent";
import DatePicker from "../../../../formComponent/DatePicker";
import TransferReffralConsultation from "../../../../Doctor/TransferReffralConsultation";

import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../../../CancelButton";
import UserInfoPedia from "../../../../Doctor/UserInfoPedia";
import { useLocalStorage } from "../../../../../utils/hooks/useLocalStorage";
import moment from "moment";
import SeeMore from "../../../SeeMore";
import SendSMSDoctor from "../../../../modalComponent/Utils/SendSMSDoctor";
import { getBindVital } from "../../../../../store/reducers/DoctorModule/VitalSign";
import { useDispatch } from "react-redux";
import useSpeechRecognition from "../../../../../utils/hooks/useSpeechRecognition";
import SendEmailDoctor from "../../../../modalComponent/Utils/SendEmailDoctor";
import useSpeechToText from "react-hook-speech-to-text";
import DoctorPresciptionOrdering from "../../../../../pages/doctor/Settings/DoctorPresciptionOrdering";
import DoctorLeave from "../../../../../pages/doctor/Settings/DoctorLeave";
import OverLay from "../../../../modalComponent/OverLay";
import PrintSetting from "../../../../../pages/doctor/Settings/PrintSetting";
import AddCustomTabing from "../../../../../pages/doctor/Settings/AddCustomTabing";
import DoctorNotAvailble from "../../../../../pages/doctor/Settings/DoctorNotAvailble";
import { toggleFullScreen } from "../../../../../utils/helpers";
import DocVitalSignPatientDetailCard from "../../../../commonComponents/DocVitalSignPatientDetailCard";
import SlideScreen from "../../../../front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../SeeMoreSlideScreen";
import { PatientSearchbyBarcode } from "../../../../../networkServices/opdserviceAPI";
import { useSelector } from "react-redux";
import Input from "@app/components/formComponent/Input";
import { Tooltip } from "primereact/tooltip";
import MenstrualAndObstetric from "./ComponentPrescription/MenstrualAndObstetric";
import PreviousPregnancyTable from "./ComponentPrescription/PreviousPregnancyTable";
import FamilyHistoryTable from "./ComponentPrescription/FamilyHistoryTable";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import TextAreaInput from "../../../../formComponent/TextAreaInput";
import { Next } from "react-bootstrap/esm/PageItem";
import SingleNameCreateTemplateModal from "./SingleNameCreateTemplateModal";
import ViewLabReport from "../../../../FrameMenu/ViewLabReport";

// import CancelButton from "../UI/CancelButton";

// Not Found Component
const NotFound = () => <div>Component Not Found</div>;

function formatString(str) {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before each capital letter
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
}

const { VITE_APP_REACT_APP_DOCTOR_PRESCRIPTION_ZOOM } = import.meta.env;
const isZoom = VITE_APP_REACT_APP_DOCTOR_PRESCRIPTION_ZOOM ?? false;

let SExamination = [
  "CVS",
  "RS",
  "PA",
  "CNS",
  "General",
  "ENT",
  "pallor",
  "odema",
  "uterus",
  "varicoseVeins",
  "respiratory",
  "anyAdventitiousSounds",
  "breasts",
];

const AppointmentPatientDetail = ({
  setActive,
  type,
  TotaltableData,
  selectedIndex,
  handleCallButtonClick,
  SearchOPDBillsCallAPI,
  fetchAllApiData,
  getUpdateInAPI,
  getDoctorID,
  setItems,
  items,
  checkGetDoctorIDForTransationID,
  getUser,
  docterError,
  getCall,
  handleSearchPrescribeMedicine,
}) => {
  const [currentDoctorID, setCurrentDoctorID] = useState(null);
  const [doctorTopSuggestions, setDoctorTopSuggestions] = useState([]);
  const [transformedSuggestions, setTransformedSuggestions] = useState([]);
  const dispatch = useDispatch();
  const [presTable, setPresTable] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const showSuggestions = import.meta.env.VITE_APP_FIELD_VISIBILITY ? import.meta.env.VITE_APP_FIELD_VISIBILITY : true;

  const localData = useLocalStorage("userData", "get");
  const [loadSaveData, setLoadSaveData] = useState({});
  const [isPrescriptionButton, setIsPrescriptionButton] = useState(false);
  const [isDocChecked, setIsDocChecked] = useState(false);
  const [labCategoryList, setLabCategoryList] = useState([]);

  const [labSubCategoryList, setLabSubCategoryList] = useState([]);
  const [labCategoryIds, setLabCategoryIds] = useState({
    categoryId: "",
    subCategoryId: "",
  });
  //pregnancy basic details state getting updated form userInfoPedia
  const [pregnancyDetails, setPregnancyDetails] = useState({});
  //Previous Pregnancy Table State
  const [previousPregnancyData, setPreviousPregnancyData] = useState([]);
  const [familyHistoryData, setFamilyHistoryData] = useState([]);
  const [isDeleteTemplate, setIsDeleteTemplate] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchByICD, setSearchByICD] = useState({
    searchByICDDecs: "",
  });
  const [doctorLeaves, setDoctorLeaves] = useState([])

  const reloadDoctor = useSelector((state) => state.reloadDoctor.loading);

  // console.log("reloadDoctor", reloadDoctor);

  const [prisciptionForm, setPrisciptionForm] = useState({
    Allergies: "",
    NextVisit: '',
    ConfidentialData: "",
    // SystematicExamination: {
    CNS: "",
    ENT: "",
    RS: "",
    PA: "",
    General: "",
    CVS: "",
    // },
    TransferReferralForConsultation: "",
    DoctorType: "",
    department: "",
    referTo: "",
    referralType: "",
    consultType: "",
    ImpressionDiagnosis: "",
    Remarks: "",
    //New items added akay--->>
    MenstrualAndObstetricsHistory: {},
    DeatilsOfPreviousPregnancies: {},
    FamilyHistory: {},
    RiskFactor: "",
    AnyAncHospitalisations: "",
    NST: "",
    PelvicAssessment: "",
    ParturitionDetailsAndOutCome: "",
    pallor: "",
    odema: "",
    uterus: "",
    varicoseVeins: "",
    nodes: "",
    respiratory: "",
    breasts: "",
    anyAdventitiousSounds: "",
    knownOfs: [],
    keyNote: [],
    previousDoctor: [],
    paExaminantion: "",
    pvExaminantion: "",
    historyOfCovid: "",
    historyOfPresentIllness: "",
    surgicalHistory: "",
    imunigrationHistory: "",
    precaution: "",
    admissionRequired: false,
    AdmissionDate: "",
    NutritionAdviseRemarks: "",
    NutritionAdvise: "",
    doctorRemarks: "",
    doctorAdditionalAdvice: "",
    stageOfCancer: "",
    systemicTherapy: "",
    ihcReport: "",
  });
  const [shouldSaveDraft, setShouldSaveDraft] = useState(false);

  const removeTagprisciptionForm = (key) => {
    if (key === "NextVisit") {
      setPrisciptionForm((val) => ({ ...val, [key]: "" }));
    } else {
      setPrisciptionForm((val) => ({ ...val, [key]: "" }));
    }
  };

  const childRef = useRef(null);
  const [t] = useTranslation();

  // const [inputValue, setInputValue] = useState({
  //   "Investigation(Lab & Radio)": "",
  //   "Prescribed Procedure": "",
  //   "Sign & Symptoms": "",
  //   "Doctor Notes": "",
  //   "Chief Complaint": "",
  //   "Vaccination Status": "",
  //   "Past History": "",
  //   "Provisional Diagnosis": "",
  //   "Doctor Advice": "",
  //   "Treatment History": "",
  //   "Personal/Occupational History": "",
  //   "General Examination": "",
  //   "Diet": "",

  // });

  const [inputValue, setInputValue] = useState({
    Allergies: "",
    "PA Examination": "",
    "PV Examination": "",
    "Prescribed Medicine": "",
    "Known OFF": "",
    "Chief Complaint": "",
    "Menstrual And Obstetrics History": "",
    "Vaccination Status": "",
    "Doctor Advice": "",
    "Investigation(Lab & Radio)": "",
    Remarks: "",

    "Provisional Diagnosis": "",
    "Prescribed Procedure": "",
    "Deatils Of Previous Pregnancies": "",
    "Transfer/Referral For Consultation": "",
    "Personal/Occupational History": "",
    "General Examination": "",
    NextVisit: "",

    "Risk Factor": "",
    "Any Anc Hospitalisations": "",
    "Confidential Data": "",
    Diet: "",
    "Past History": "",
    "Molecular Allergies": "",
    "Treatment History": "",
    "Family History": "",
    NST: "",
    "Pelvic Assessment": "",
    "Sign & Symptoms": "",
    "Parturition Details & OutCome": "",
    "Previous Doctor": "",
    "Key Note": "",
    "Doctor Notes": "",
    "Systematic Examination": "",
  });

  const doctorSuggestionCategories = [
    "Allergies",
    "PA Examination",
    "PV Examination",
    "Prescribed Medicine",
    "Chief Complaint",
    "Vaccination Status",
    "Doctor Advice",
    "Investigation(Lab & Radio)",
    "Provisional Diagnosis",
    "Prescribed Procedure",
    "General Examination",
    "Risk Factor",
    "Any Anc Hospitalisations",
    "Diet",
    "NST",
    "Pelvic Assessment",
    "Sign & Symptoms",
    "Parturition Details & OutCome",
    "Key Note",
    "Doctor Notes",
  ];

  const fieldMapping = {
    Allergies: "allergies",
    "PA Examination": "paExaminantion",
    "PV Examination": "pvExaminantion",
    "Prescribed Medicine": "medicines",
    "Chief Complaint": "chiefComplaint",
    "Vaccination Status": "vaccinationStatus",
    "Doctor Advice": "doctorAdvice",
    "Investigation(Lab & Radio)": "investigations",
    "Provisional Diagnosis": "provisionalDiagnosis",
    "Prescribed Procedure": "procedures",
    "General Examination": "generalExamination",
    "Risk Factor": "riskFactors",
    "Any Anc Hospitalisations": "anyAncHospitalisations",
    Diet: "diet",
    NST: "nst",
    "Pelvic Assessment": "pelvicAssesment",
    "Sign & Symptoms": "clinicalExamination",
    "Parturition Details & OutCome": "parturitionDetails",
    "Key Note": "keyNote",
    "Doctor Notes": "doctorNotes",
  };
  console.log(inputValue, "inputVal");
  const [apiData, setApiData] = useState({
    getCPEOMenuList: [],
    getBindConsentTypeAPI: [],
    getBindTemplateAPI: [],
    getBindPatientConsentAPI: [],
    getOldAppointentDataAPI: [],
  });
  const [editTagIndex, setEditTagIndex] = useState(null);

  const handleTagDoubleClick = (event, category, index) => {
    setEditTagIndex(`${category}-${index}`);
    event.target.setAttribute("contentEditable", "true");
    event.target.focus();
  };
  const handleTagBlur = (event, category, index) => {
    const updatedValue = event.target.innerText.trim();

    setTags((prevTags) => ({
      ...prevTags,
      [category]: prevTags[category].map((tag, i) =>
        i === index ? { ...tag, ValueField: updatedValue } : tag
      ),
    }));

    event.target.removeAttribute("contentEditable");
    setEditTagIndex(null);
  };

  const handleTagKeyPress = (event, category, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents new lines inside span
      event.target.blur(); // Saves and exits editing mode
    }
  };

  const [filteredItems, setFilteredItems] = useState(AUTOCOMPLETE_STATE);

  const [actionType, setActionType] = useState("Save");
  const [prescription, setPrescription] = useState([]);
  const [tags, setTags] = useState({
    ...AUTOCOMPLETE_STATE,
    NextVisit: [],
    TransferReferral: [],
  });

  const [tags1, setTags1] = useState({
    ...AUTOCOMPLETE_STATE,
    NextVisit: [],
    TransferReferral: [],
  });

  const [smsModal, setSmsModal] = useState({
    isShow: false,
    component: null,
    size: null,
    Header: null,
  });

  const [selectedOption, setSelectedOption] = useState(null);

  const [emailModal, setEmailModal] = useState({
    isShow: false,
    component: null,
    size: null,
    Header: null,
  });

  const [openPageModal, setOpenPageModal] = useState({
    isShow: false,
    component: null,
    size: null,
    Header: null,
  });

  const [patientDetail, setPatientDetail] = useState({
    TotaltableData: TotaltableData,
    index: selectedIndex,
    currentPatient: getUser,
  });

  const newUpdateTags = (newData) => {
    // Transform the new data to match the desired structure
    const transformedData = newData.map((item) => ({
      ValueField: item.knownOff, // Convert "knownOff" to "ValueField"
    }));

    // Update the state using setTags
    setTags((prevTags) => ({
      ...prevTags, // Keep all other keys unchanged
      "Known OFF": transformedData, // Update the "Known OFF" key with transformed data
    }));
  };

  useEffect(() => {
    let Pdetails = TotaltableData?.find(
      (val) => val?.App_ID === patientDetail?.currentPatient?.App_ID
    );
    setPatientDetail((val) => ({ ...val, TotaltableData: TotaltableData }));

    if (Pdetails?.App_ID) {
      setPatientDetail((val) => ({ ...val, currentPatient: Pdetails }));
    }
  }, [TotaltableData]);

  // useEffect(()=>{
  //   console.log("try to find Preganancy data out of",loadSaveData)
  // },[loadSaveData])

  // Passing update function to parent via props

  const [saveTemplate, setSaveTemplate] = useState({
    templateName: "",
    valueField: "",
  });
  const [favTempData, setFavTempData] = useState([]);

  const saveTemplateHandleChange = (e) => {
    const { value, name } = e.target;
    setSaveTemplate((val) => ({ ...val, [name]: value }));
  };

  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  const [nameTemplateModalData, setNameTemplateModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  const setIsOpen = () => {
    setNameTemplateModalData((val) => ({ ...val, visible: false }));
  };

  // const handlePackageDetails = async (prescription, size) => {
  //   let tempDetails;
  //   if (prescription?.templateData?.ID) {
  //     tempDetails = await getInvestigationFavoriteTemplateDetailsApi(
  //       prescription?.templateData?.ID
  //     );
  //   }
  //   if (prescription?.ID == 2 || prescription?.ID == 3) {
  //     setModalData({ data: prescription }),
  //       setNameTemplateModalData({
  //         visible: true,
  //         prescription: prescription,
  //         component: (
  //           <SingleNameCreateTemplateModal
  //             selectedAccordion={prescription}
  //             searchData={items}
  //             handleChangeModel={setModalData}
  //             editData={{
  //               tagsData: tempDetails?.data?.map((item) => ({
  //                 Name: { value: item?.itemName },
  //                 ID: item?.itemId,
  //               })),
  //               templateName: prescription?.templateData?.TemplateName,
  //             }}
  //           />
  //         ),
  //         handleInsertApi: handleSaveInvestigationTemplate,
  //         size: "35vw",
  //         Header: prescription?.isEdit
  //           ? "Update Template"
  //           : "Create New Template",
  //         extrabutton: <></>,
  //         footer: <></>,
  //       });
  //   } else {
  //     console.log(prescription, "item id");
  //     setModalData({
  //       visible: true,
  //       prescription: prescription,
  //       // component: <TemplateSearchModal prescription={prescription} saveTemplate={saveTemplate} saveTemplateHandleChange={saveTemplateHandleChange} />,
  //       size: size,
  //       Header: "Create New Template",
  //       setVisible: false,
  //     });
  //   }
  // };

  const handlePackageDetails = async (prescription, size) => {
    debugger
    if ([4, 5, 6, 7, 10, 12, 13, 16, 18, 19, 21].includes(prescription.ID)) {
      let tempDetails;
      tempDetails = await GetEditTemplate(
        prescription?.templateData?.ID || prescription?.ID,
        prescription?.templateData?.templateFor || prescription?.templateFor
      );
      setSaveTemplate({
        templateName: tempDetails?.data?.TemplateName,
        valueField: tempDetails?.data?.ValueField,
        saveid: tempDetails?.data?.ID,
      });
      if (prescription?.ID == 2 || prescription?.ID == 3) {
        setModalData({ data: prescription }),
          setNameTemplateModalData({
            visible: true,
            prescription: prescription,
            component: (
              <SingleNameCreateTemplateModal
                selectedAccordion={prescription}
                searchData={items}
                handleChangeModel={setModalData}
                editData={{
                  tagsData: tempDetails?.data?.map((item) => ({
                    Name: { value: item?.itemName },
                    ID: item?.itemId,
                  })),
                  templateName: prescription?.templateData?.TemplateName,
                }}
              />
            ),
            handleInsertApi: handleSaveInvestigationTemplate,
            size: "35vw",
            Header: prescription?.isEdit
              ? "Update Template"
              : "Create New Template",
            extrabutton: <></>,
            footer: <></>,
          });
      } else {
        setModalData({
          visible: true,
          prescription: prescription,
          // component: <TemplateSearchModal prescription={prescription} saveTemplate={saveTemplate} saveTemplateHandleChange={saveTemplateHandleChange} />,
          size: size,
          Header: "Create New Template",
          setVisible: false,
        });
      }
    } else {
      let tempDetails;
      if (prescription?.templateData?.ID) {
        tempDetails = await getInvestigationFavoriteTemplateDetailsApi(
          prescription?.templateData?.ID
        );
      }
      if (prescription?.ID == 2 || prescription?.ID == 3) {
        setModalData({ data: prescription }),
          setNameTemplateModalData({
            visible: true,
            prescription: prescription,
            component: (
              <SingleNameCreateTemplateModal
                selectedAccordion={prescription}
                searchData={items}
                handleChangeModel={setModalData}
                editData={{
                  tagsData: tempDetails?.data?.map((item) => ({
                    Name: { value: item?.itemName },
                    ID: item?.itemId,
                  })),
                  templateName: prescription?.templateData?.TemplateName,
                }}
              />
            ),
            handleInsertApi: handleSaveInvestigationTemplate,
            size: "35vw",
            Header: prescription?.isEdit
              ? "Update Template"
              : "Create New Template",
            extrabutton: <></>,
            footer: <></>,
          });
      } else {
        setModalData({
          visible: true,
          prescription: prescription,
          // component: <TemplateSearchModal prescription={prescription} saveTemplate={saveTemplate} saveTemplateHandleChange={saveTemplateHandleChange} />,
          size: size,
          Header: "Create New Template",
          setVisible: false,
        });
      }
    }
  };

  async function handleSaveInvestigationTemplate(data) {

    debugger
    const getFilteredTagsPayload = () => {
      return data?.tagsData.filter((tag) => tag?.Name?.value?.trim() !== "");
    };
    const filterPayload = getFilteredTagsPayload();
    if (data?.templateName.trim() === "") {
      notify("TemplateName is required!", "error");
      return;
    }
    const payload = {
      id: data?.templateId ? data?.templateId : 0,
      AccordianId: data?.data.ID,
      name: data?.templateName,
      AccordianName: data?.data?.DisplayName,
      templateLabDetails: filterPayload?.map((temp) => ({
        itemId: temp?.ID,
        itemName: temp?.Name?.value,
        isOutSource: temp?.ID ? 0 : 1,
      })),
    };

    try {
      const res = await saveInvestigationFavoriteTemplateApi(payload);

      if (res?.success) {
        notify("Template saved successfully!", "success");
        setNameTemplateModalData({ visible: false });
      } else {
        notify("Something went wrong while saving the template.", "warn");
      }
    } catch (error) {
      console.error("Save template error:", error);
      notify("Failed to save template. Please try again later.", "error");
    }
  }

  const handleGetInvestigationTemplate = async (id) => {
    try {
      const res = await getInvestigationFavoriteTemplateApi(id);
      const newData = res?.data?.map((item) => {
        return {
          ...item,
          ValueField: item?.TemplateName,
          value: item?.ID,
        };
      });
      setFavTempData(newData);
    } catch (e) {
      notify(e?.message, "error");
    }
  };

  const reverseTableData = async () => {
    if (patientDetail?.index > 0) {
      const index = patientDetail?.index - 1;
      setPatientDetail((val) => ({
        ...val,
        index: index,
        currentPatient: patientDetail?.TotaltableData[index],
      }));
      dispatch(
        getBindVital(patientDetail?.TotaltableData[index].TransactionID)
      );
      SearchOPDBillsCallAPI();
      try {
        const response = await GetPrescription({
          patientID: patientDetail?.TotaltableData[index]?.PatientID,
          transactionID: patientDetail?.TotaltableData[index]?.TransactionID,
          appID: patientDetail?.TotaltableData[index]?.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        if (response?.success) {
          setLoadSaveData(response.data);
        } else {
          setLoadSaveData([]);
        }
      } catch (error) { }

      try {
        const res = await GetOldAppointentData({
          patientID: patientDetail?.TotaltableData[index]?.PatientID,
          transactionID: patientDetail?.TotaltableData[index]?.TransactionID,
          appID: patientDetail?.TotaltableData[index]?.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        if (res?.success) {
          setApiData((prev) => ({
            ...prev,
            getOldAppointentDataAPI: res.data,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchLabCategory = async () => {
    try {
      const res = await getLabRadiologyCategoryApi();
      if (res?.success) {
        const newData = res?.data?.map((item) => {
          return {
            ...item,
            label: item?.NAME,
            value: item?.CategoryID,
          };
        });
        setLabCategoryList(newData);
      } else {
        notify(res.message, "error");
      }
    } catch (e) {
      notify(e?.message, "error");
    }
  };

  const fetchLabSubCategory = async (id) => {
    try {
      const res = await getLabRadiologySubCategoryApi(id);
      if (res?.success) {
        const newData = res?.data?.map((item) => {
          return {
            ...item,
            label: item?.Name,
            value: item?.SubCategoryID,
          };
        });
        setLabSubCategoryList(newData);
      } else {
        notify(res.message, "error");
      }
    } catch (e) {
      notify(e?.message, "error");
    }
  };

  const forwardTableData = async () => {
    if (patientDetail?.index < patientDetail?.TotaltableData?.length - 1) {
      const index = patientDetail?.index + 1;
      setPatientDetail((val) => ({
        ...val,
        index: index,
        currentPatient: patientDetail?.TotaltableData[index],
      }));
      dispatch(
        getBindVital(patientDetail?.TotaltableData[index].TransactionID)
      );
      SearchOPDBillsCallAPI();
      try {
        const response = await GetPrescription({
          patientID: patientDetail?.TotaltableData[index]?.PatientID,
          transactionID: patientDetail?.TotaltableData[index]?.TransactionID,
          appID: patientDetail?.TotaltableData[index]?.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        if (response?.data) {
          setLoadSaveData(response.data);
        }
      } catch (error) { }

      try {
        const res = await GetOldAppointentData({
          patientID: patientDetail?.TotaltableData[index]?.PatientID,
          transactionID: patientDetail?.TotaltableData[index]?.TransactionID,
          appID: patientDetail?.TotaltableData[index]?.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        setApiData((prev) => ({ ...prev, getOldAppointentDataAPI: res.data }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputValue((val) => ({ ...val, [name]: value }));
  };
  const handleChangeRemarks = (e) => {
    const { value, name } = e.target;

    // Update input value as user types
    setInputValue((val) => ({ ...val, [name]: value }));

    // Only proceed if Enter key was pressed
    if (e.key === "Enter") {
      setTags((prev) => {
        const arr = [...(prev["Investigation(Lab & Radio)"] || [])];

        if (arr.length > 0) {
          arr[arr.length - 1] = {
            ...arr[arr.length - 1],
            remarks: value,
          };
        }

        return {
          ...prev,
          ["Investigation(Lab & Radio)"]: arr,
        };
      });

      // Clear the input after saving
      setInputValue((val) => ({ ...val, [name]: "" }));
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const apir = await getGetDoctor(
        patientDetail?.currentPatient?.TransactionID
      );

      // Check if apir is undefined or null
      if (!apir) {
        throw new Error(
          "checkGetDoctorIDForTransationID API call returned undefined or null"
        );
      }

      let doctorID;

      if (apir.success === true) {
        doctorID = apir.data;
      } else {
        doctorID = String(patientDetail?.currentPatient?.DoctorID);
      }
      const getPayLoadData = {
        TransactionID: getUser?.TransactionID,
        App_ID: getUser?.AppID,
        DoctorID: doctorID,
      };
      const res = await saveTemplateAPI({
        id: saveTemplate?.saveid || 0,
        valueField: saveTemplate.valueField,
        templateName: saveTemplate.templateName || saveTemplate.valueField,
        doctorID: doctorID,
        templateFor: Number(modalData.prescription.ID),
      });
      fetchAllApiData(getPayLoadData);

      if (!res) {
        throw new Error("saveTemplateAPI call returned undefined or null");
      }

      if (res.success) {
        notify(res.message, "success");
        try {
          setModalData((prev) => ({ visible: false }));
          setSaveTemplate({
            templateName: "",
            valueField: "",
          });
          setTags1({
            ...AUTOCOMPLETE_STATE,
            NextVisit: [],
            TransferReferral: [],
          });
        } catch (error) {
          console.error("Error in checkGetDoctorIDForTransationID:", error);
        }
      } else {
        console.error("API call failed with response:", res);
        notify("Failed to save template. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error in handleSaveTemplate:", error);
    }
  };

  // useEffect(() => {
  //   const getPayLoadData = {
  //     TransactionID: getUser?.TransactionID,
  //     App_ID: getUser?.AppID,
  //     DoctorID: String(patientDetail?.currentPatient?.DoctorID),
  //   };
  //   fetchAllApiData(getPayLoadData);
  // }, [isDeleteTemplate]);
  useEffect(() => {

    if (!patientDetail?.currentPatient?.DoctorID) return;

    const getPayLoadData = {
      TransactionID: getUser?.TransactionID,
      App_ID: getUser?.AppID,
      DoctorID: String(patientDetail?.currentPatient?.DoctorID),
    };

    fetchAllApiData(getPayLoadData);


  }, [isDeleteTemplate, patientDetail?.currentPatient?.DoctorID]);

  useEffect(() => {
    fetchLabCategory();
  }, []);
  useEffect(() => {
    if (labCategoryIds?.categoryId) {
      fetchLabSubCategory(labCategoryIds?.categoryId);
    }
  }, [labCategoryIds?.categoryId]);

  // useEffect(() => {
  //   const getPayLoadData = {
  //     TransactionID: getUser?.TransactionID,
  //     App_ID: getUser?.AppID,
  //     DoctorID: String(patientDetail?.currentPatient?.DoctorID),
  //   };

  //   fetchAllApiData(getPayLoadData);
  // }, [isDeleteTemplate]);

  const duplicateChecker = (arrayofObject, checker) => {
    if (arrayofObject.length > 0) {
      const returnData = arrayofObject?.some(
        (ele) =>
          ele?.ValueField?.toLowerCase().trim() ===
          checker?.toLowerCase().trim()
      );
      return returnData;
    } else {
      return false;
    }
  };

  const handleKeyPress = (e, category) => {
    if ((e.key === "Enter" || e.key === "Tab") && inputValue[category]) {
      const currentTags = tags[category] || [];
      const currentLength = currentTags
        .map((tag) => tag?.ValueField || "")
        .join(" ").length;

      const newInputLength = inputValue[category].length;
      const totalLength = currentLength + newInputLength;
      const charLimit = getCharLimit(category);
      if (totalLength > charLimit) {
        e.preventDefault();
        notify("Character limit exceeded", "error");
        return;
      }

      if (!duplicateChecker(tags[category], inputValue[category])) {
        setTags((prevTags) => ({
          ...prevTags,
          [category]: [
            ...(prevTags[category] || []),
            { ValueField: inputValue[category] },
          ],
        }));
      } else {
        notify("duplicate Value", "error");
      }
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [category]: "",
      }));
    }
  };

  // const onSelected = (e, category) => {

  //   const { value } = e;
  //   if (!duplicateChecker(tags[category], value?.ValueField)) {
  //     const val = { ...value };
  //     val.isChecked = true;
  //     const mainArray = [...items[category]];

  //     const index = mainArray.findIndex(
  //       (itd) => Number(itd?.ID) === Number(val?.ID)
  //     );

  //     mainArray[index] = val;

  //     setItems({ ...items, [category]: mainArray });

  //     setTags((prevTags) => ({
  //       ...prevTags,
  //       [category]: [...(prevTags[category] || []), value], // Ensure it's an array
  //     }));
  //   } else {
  //     notify("duplicate Values", "error");
  //   }

  //   setInputValue((prevInputValue) => ({
  //     ...prevInputValue,
  //     [category]: "",
  //   }));
  // };

  const onSelected = (e, category) => {
    const { value } = e;
    const charLimit = getCharLimit(category);
    const currentTags = tags[category] || [];

    const currentLength = currentTags
      .map((tag) => tag?.ValueField || "")
      .join(" ").length;

    const newInputLength = (value?.ValueField || "").length;
    const totalLength = currentLength + newInputLength;

    // Block addition if exceeds limit
    if (totalLength > charLimit) {
      notify("Character limit exceeded", "error");
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [category]: "",
      }));
      return;
    }

    if (!duplicateChecker(tags[category], value?.ValueField)) {
      const val = { ...value, isChecked: true };
      const mainArray = [...items[category]];
      const index = mainArray.findIndex(
        (itd) => Number(itd?.ID) === Number(val?.ID)
      );

      // Update items list
      mainArray[index] = val;
      setItems((prevItems) => ({
        ...prevItems,
        [category]: mainArray,
      }));

      setTags((prevTags) => ({
        ...prevTags,
        [category]: [...(prevTags[category] || []), value],
      }));
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [category]: "",
      }));
      setTimeout(() => {
        if (autoCompleteRefs.current[category]) {
          autoCompleteRefs.current[category].hide();
        }
        document.activeElement.blur();
      }, 100);
      setShouldSaveDraft(true);
    } else {
      notify("Duplicate Values Not Allowed", "error");

      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [category]: "",
      }));
    }
  };

  const removeTag = (category, indexToRemove, id, tag) => {

    if (tag) {
      setTags((prevTags) => ({
        ...prevTags,
        [category]: prevTags[category]?.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    } else {
      let ID = Number(id) ? id : undefined;
      const singleData = JSON.parse(JSON.stringify([...items[category]]));
      if (ID) {
        const index = singleData.findIndex(
          (itd) => Number(itd?.ID) === Number(ID)
        );
        //  
        if (index) {
          singleData[index]["isChecked"] = false;
          setItems({ ...items, [category]: singleData });
        }
      }

      setTags((prevTags) => ({
        ...prevTags,
        [category]: prevTags[category]?.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
  };
  const handleSaveMedicine = async (event) => {
    //  ;
    // event.preventDefault();
    const KEYS_NAME = "Prescribed Medicine";
    // Prepare the data for submission, filtering out empty entries
    const formData = tags1[KEYS_NAME].map((item) => {
      // Extract values and filter out any entries where all values are empty
      const values = {
        Name: item.Name?.value || "",
        Dose: item.Dose?.value || "",
        Time: item.Time?.value || "",
        Duration: item.Duration?.value || "",
        Meal: item.Meal?.value || "",
        Route: item.Route?.value || "",
        ItemID: item.Name.ID || "",
      };

      // Check if all values are empty
      const isEmpty = Object.values(values).every(
        (value) => value?.trim() === ""
      );

      return isEmpty ? null : values; // Return null if all fields are empty
    }).filter((item) => item !== null); // Remove null entries

    const payload = {
      id: 0,
      valueField: "",
      templateName: saveTemplate.templateName,
      doctorID: getDoctorID,
      templateFor: Number(modalData.prescription.ID),
      medicines: formData.map((item) => ({
        itemID: item.ItemID,
        quantity: 1,
        setID: 0,
        dose: item.Dose,
        route: item.Route,
        meal: item.Meal,
        time: item.Time,
        duration: item.Duration,
      })),
    };

    await SaveMedicineTemplateAPI(payload);
  };

  const SaveMedicineTemplateAPI = async (payload) => {
    try {
      const apiResponse = await SaveMedicineTemplate(payload);
      if (apiResponse?.success) {
        await handleSearchPrescribeMedicine(payload?.doctorID);
        notify(apiResponse?.message, "success");
        setModalData((prev) => ({ visible: false }));
        setSaveTemplate({
          templateName: "",
          valueField: "",
        });
        setTags1({
          ...AUTOCOMPLETE_STATE,
          NextVisit: [],
          TransferReferral: [],
        });
      } else {
        notify(apiResponse?.message, "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLoadPrescriptionView = async (
    TransactionID,
    PatientID,
    isIPDData = 0
  ) => {
    //  r
    try {
      const response = await LoadPrescriptionView(
        isIPDData,
        TransactionID,
        PatientID
      );
      if (response?.success) {
        setPrescription(response?.data?.filter((val) => val?.IsHide === 0));

        // setPrescription(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TemplateName || item?.TypeName}
        </div>
      </div>
    );
  };

  // final diagnosis
  const handleSelect = (e) => {

    const selectedValue = e.value;
    const updatedData = { ...selectedValue, ValueField: `${selectedValue?.WHO_Full_Desc} (${selectedValue?.ICD10_3_Code})` };
    // const isDuplicate = false
    const isDuplicate = tags["icd10Diagnosis"]?.length > 0 && tags["icd10Diagnosis"].some(
      (item) => item.icd_id === selectedValue.icd_id
    );

    if (!isDuplicate) {
      // setSelectedICDData((prev) => [...prev, selectedValue]);
      setTags((prevTags) => ({
        ...prevTags,
        ["icd10Diagnosis"]: [...(prevTags["icd10Diagnosis"] || []), updatedData],
      }));
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      // setError(""); // Clear any previous error
    } else {
      const errorMessage = "This ICD code has already been added.";
      // setError(errorMessage); // Set the error state
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      notify(errorMessage, "error"); // Notify the user
    }
  };
  const handleChangebySerachByICD = (e, name) => {
    const { value } = e;
    setSearchByICD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const itemTemplateFinalDiagnosis = (item) => (
    <div>
      <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
    </div>
  );
  const SearchByICDDescgetData = (event) => {
    const { query } = event;
    SearchByICDDescData(query);
  };
  const SearchByICDDescData = async (query) => {
    try {
      const apiRes = await SearchByICDDesc({
        prefixText: query,
        count: 10,
      });

      const suggestionData = apiRes?.data?.map((item) => ({
        WHO_Full_Desc: item?.WHO_Full_Desc,
        ICD10_3_Code: item?.ICD10_3_Code,
        ...item // Include the entire object for later use
      }));

      setSuggestions(suggestionData);
    } catch (error) {
      console.error(error);
    }
  };

  // const search = (event, type) => {
  //   const { query } = event;
  //   const data = items[type]?.filter((ele) =>
  //     ele?.TemplateName.toLowerCase()
  //       .trim()
  //       .includes(query.toLowerCase().trim()) ||  ele?.TypeName?.toLowerCase()
  //       .trim()
  //       .includes(query.toLowerCase().trim())
  //   );
  //   setFilteredItems({
  //     ...filteredItems,
  //     [type]: data,
  //   });
  // };
  //test
  // const search = (event, type) => {
  //   const { query } = event;
  //   const data = items[type]?.filter(
  //     (ele) =>
  //       ele?.TemplateName?.toLowerCase()
  //         .trim()
  //         .includes(query.toLowerCase().trim()) ||
  //       ele?.TypeName?.toLowerCase().trim().includes(query.toLowerCase().trim())
  //   );
  //   //  
  //   setFilteredItems({
  //     ...filteredItems,
  //     [type]: data,
  //   });
  // };

  const search = (event, type) => {
    // const { query } = event;
    // const data = items[type]?.filter((ele) => ele?.TemplateName?.toLowerCase().trim().includes(query.toLowerCase().trim()) ||
    //       ele?.TypeName?.toLowerCase().trim().includes(query.toLowerCase().trim())
    //   ) || [];

    // setFilteredItems((prevFilteredItems) => ({
    //   ...prevFilteredItems,
    //   [type]: data,
    // }));
    const { query } = event;
    let data = items[type] || [];

    data = data.filter((ele) => {
      const matchesQuery =
        ele?.TemplateName?.toLowerCase()
          .trim()
          .includes(query.toLowerCase().trim()) ||
        ele?.TypeName?.toLowerCase()
          .trim()
          .includes(query.toLowerCase().trim());

      // Apply category and subcategory filters for this Investigation(Lab & Radio)
      const shouldFilterByCategory = type === "Investigation(Lab & Radio)";
      const matchesCategory =
        !shouldFilterByCategory ||
        !labCategoryIds.categoryId ||
        ele?.categoryID == labCategoryIds.categoryId;

      const matchesSubCategory =
        !shouldFilterByCategory ||
        !labCategoryIds.subCategoryId ||
        ele?.subCategoryID == labCategoryIds.subCategoryId;

      return matchesQuery && matchesCategory && matchesSubCategory;
    });

    setFilteredItems((prevFilteredItems) => ({
      ...prevFilteredItems,
      [type]: data,
    }));

    // If only one result exists, auto-select it from the dropdown
    // if (data.length === 1 && type === "Investigation(Lab & Radio)") {
    //   selectItem(data[0], type);
    // }

    // If any item has `value === "1"`, select it by default
    // const defaultItem = data.find((item) => item.value === "1");
    // if (defaultItem) {
    //   selectItem(defaultItem, type);
    // }
  };

  const selectItem = (item, category) => {
    setInputValue((prev) => ({
      ...prev,
      [category]: item.ValueField,
    }));

    setTimeout(() => {
      addTag(category, item);
      closeDropdown(category);
    }, 100); // Ensure UI updates before processing selection
  };
  const closeDropdown = (category) => {
    const autoCompleteElement = autoCompleteRefs.current[category];

    if (autoCompleteElement) {
      autoCompleteElement.hide(); // ✅ Hide dropdown properly
    }
  };
  const addTag = (category, item) => {
    if (!duplicateChecker(tags[category], item.ValueField)) {
      setTags((prevTags) => ({
        ...prevTags,
        [category]: [
          ...(prevTags[category] || []),
          { ValueField: item.ValueField },
        ],
      }));
    } else {
      notify("Duplicate Value", "error");
    }

    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [category]: "",
    }));
  };

  //   const handleFavoriteSelectChange = async (
  //     e,
  //     index,
  //     mainArray,
  //     singleData,
  //     modalName
  //   ) => {
  //      
  //     const { name, checked } = e.target;
  //     singleData[name] = checked;
  //     const data = [...items[mainArray]];
  //     data[index] = singleData;
  //     setItems({ ...items, [mainArray]: data });
  // console.log(singleData)
  //     try{
  //     const detailsTemplate= await getInvestigationFavoriteTemplateDetailsApi(singleData?.ID)
  //     console.log(detailsTemplate)
  //     }catch(e){
  //       console.log(e)
  //     }

  //     if (checked) {
  //       if (modalName === "Prescribed Medicine") {
  //         setTags((prevTags) => ({
  //           ...prevTags,
  //           [mainArray]: [...singleData?.ValueField, ...prevTags[mainArray]], // Ensure it's an array
  //         }));
  //       } else {
  //         setTags((prevTags) => ({
  //           ...prevTags,
  //           [mainArray]: [...prevTags[mainArray], singleData], // Ensure it's an array
  //         }));
  //       }
  //     } else {
  //       if (modalName === "Prescribed Medicine") {
  //         setTags((prevTags) => ({
  //           ...prevTags,
  //           [mainArray]: prevTags[mainArray].filter(
  //             (item, _) => Number(item?.TemplateID) !== Number(singleData?.ID)
  //           ),
  //         }));
  //       } else {
  //         const mainindex = tags[mainArray].findIndex(
  //           (itd) => Number(itd?.ID) === Number(singleData?.ID)
  //         );

  //         setTags((prevTags) => ({
  //           ...prevTags,
  //           [mainArray]: prevTags[mainArray].filter(
  //             (_, index) => index !== mainindex
  //           ),
  //         }));
  //       }
  //     }
  //   };

  const handleFavoriteSelectChange = async (
    e,
    index,
    mainArray,
    singleData,
    modalName
  ) => {
    const { name, checked } = e.target;
    singleData[name] = checked;

    const data = [...items[mainArray]];
    data[index] = singleData;
    setItems({ ...items, [mainArray]: data });

    let itemsToAdd = [];
    try {
      if (checked) {
        if (singleData?.IsTemplate) {
          const response = await getInvestigationFavoriteTemplateDetailsApi(
            singleData?.ID
          );
          const apiData = response?.data || [];

          itemsToAdd = apiData.map((item) => ({
            ID: item?.itemId,
            isDefaultTemplate: singleData?.ID,
            TemplateName: item?.itemName,
            ValueField: item?.itemName,
            value: item?.itemId,
            isOutSource: item?.isOutSource || 0,
            isChecked: true,
          }));
        } else {
          if (modalName === "Prescribed Medicine") {
            itemsToAdd = [...(singleData?.ValueField || [])];
          } else {
            itemsToAdd = [singleData];
          }
        }

        setTags((prevTags) => ({
          ...prevTags,
          [mainArray]: [...prevTags[mainArray], ...itemsToAdd],
        }));
      } else {
        if (singleData?.IsTemplate) {
          const tagItem = JSON.parse(JSON.stringify(tags));
          const filterTagData = tagItem[mainArray]?.filter(
            (val) => val?.isDefaultTemplate !== singleData?.ID
          );
          setTags((prevTags) => ({
            ...prevTags,
            [mainArray]: filterTagData,
          }));
          return;
        }

        if (modalName === "Prescribed Medicine") {
          setTags((prevTags) => ({
            ...prevTags,
            [mainArray]: prevTags[mainArray].filter(
              (item) => Number(item?.TemplateID) !== Number(singleData?.ID)
            ),
          }));
        } else {
          const mainIndex = tags[mainArray].findIndex(
            (itd) => Number(itd?.ID) === Number(singleData?.ID)
          );
          setTags((prevTags) => ({
            ...prevTags,
            [mainArray]: prevTags[mainArray].filter((_, i) => i !== mainIndex),
          }));
        }
      }
    } catch (error) {
      console.error("Error in handleFavoriteSelectChange:", error);
    }
  };

  const handleFileClosed = async (params) => {
    try {
      const res = await updateFileClosed(params.App_ID);
      if (res.success) {
        notify(res.message, "success");
        setActive(true);
        SearchOPDBillsCallAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileOpen = async (params) => {
    try {
      const res = await updateFileOpen(params.App_ID);
      if (res.success) {
        notify(res.message, "success");
        setActive(true);
        SearchOPDBillsCallAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBindMenuCPEOList = async () => {
    try {
      const res = await getListBindMenu(getUser?.TransactionID);
      if (res?.success) {
        setApiData((prev) => ({ ...prev, getCPEOMenuList: res?.data }));
      } else {
        // notify(res?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(labCategoryIds, "idddddddddddd");

  const getHoldAPID = async () => {
    try {
      const res = await holdAPI(patientDetail?.currentPatient?.App_ID);
      if (res.success) {
        notify(res?.message, "success");
        setActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getOutPatientAPI = async () => {
    try {
      const res = await setGetOutPatientAPI(
        patientDetail?.currentPatient?.App_ID
      );
      if (res.success) {
        notify(res?.message, "success");
        // setOutPatient("In")
        setActive(true);
        SearchOPDBillsCallAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get Bind Vital

  const fieldWordLimits = {
    "Chief Complaint": 1000,
    "History Of Present illness": 2000,
    "Family History": 500,
    "Provisional Diagnosis": 1000,
    "Impression Diagnosis": 1000,
    "Past History": 1000,
    "Doctor Notes": 1000,
    "Doctor Advice": 1000,
  };

  const defaultWordLimit = 500;

  console.log(prisciptionForm, "prisciptionFormprisciptionForm")
  // Convert word count to approximate character limit
  const getCharLimit = (field) => fieldWordLimits[field] || defaultWordLimit;
  const handleCheckDateAndAutocomplete = (item, tags) => {
    switch (item.ID) {
      case 20:
        return (
          <SystemMaticEmergency
            prisciptionForm={prisciptionForm}
            handlechangebyPrisciption={handlechangebyPrisciption}
            handleReactSelectChangebyPrisciption={
              handleReactSelectChangebyPrisciption
            }
            onFocus={handleInputFocus}
            disabled={isInputDisabled(item.Gender)}
            setPrisciptionForm={setPrisciptionForm}
          />
        );
      case 41:
        return (
          <div className="row col-12">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <TextAreaInput
                id="NutritionAdvise"
                className="col-12"
                value={prisciptionForm.NutritionAdvise}
                lable={t("Advice")}
                onChange={handlechangebyPrisciption}
                onFocus={(e) => handleInputFocus(e, "NutritionAdvise")}
                name="NutritionAdvise"
                disabled={isInputDisabled(item.Gender)}
                maxLength={getCharLimit(item?.AccordianName)}
              />
              <div className="text-right text-sm text-muted mb-1">
                {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <TextAreaInput
                id="NutritionAdviseRemarks"
                className="col-12"
                value={prisciptionForm.NutritionAdviseRemarks}
                lable={t("Remarks")}
                onChange={handlechangebyPrisciption}
                onFocus={(e) => handleInputFocus(e, "NutritionAdviseRemarks")}
                name="NutritionAdviseRemarks"
                disabled={isInputDisabled(item.Gender)}
                maxLength={getCharLimit(item?.AccordianName)}
              />
              <div className="text-right text-sm text-muted mb-1">
                {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
              </div>
            </div>
          </div>
        );
      case 40:
        return (
          <>
            <div className="d-flex align-items-center justify-items-center ml-2 mb-2 ">
              <div className="d-flex align-items-center justify-items-center">
                <RadioButton
                  inputId="yes"
                  name="yes"
                  value="1"
                  checked={prisciptionForm.admissionRequired}
                  onChange={() => {
                    setPrisciptionForm((prev) => ({
                      ...prev,
                      admissionRequired: !prisciptionForm.admissionRequired,
                    }));
                  }}
                />
                <label htmlFor="yes" className="m-2">
                  {t("Yes")}
                </label>
              </div>
              <div className="d-flex align-items-center justify-items-center">
                <RadioButton
                  inputId="no"
                  name="no"
                  value="0"
                  // checked={true}
                  checked={!prisciptionForm.admissionRequired}
                  // checked={Number(prisciptionForm.admissionRequired) === 1 ? true: false}
                  onChange={() => {
                    setPrisciptionForm((prev) => ({
                      ...prev,
                      admissionRequired: !prisciptionForm.admissionRequired,
                    }));
                  }}
                />
                <label htmlFor="no" className="m-2">
                  {t("No")}
                </label>
              </div>
            </div>
            {prisciptionForm?.admissionRequired && (
              <DatePicker
                className="custom-calendar"
                id="AdmissionDate"
                name="AdmissionDate"
                lable={"Admision Date"}
                placeholder={VITE_DATE_FORMAT}
                respclass={"col-12 mt-2"}
                value={
                  prisciptionForm?.AdmissionDate
                    ? moment(
                      prisciptionForm.AdmissionDate,
                      "DD-MMM-YYYY"
                    ).toDate()
                    : null
                }
                handleChange={(date) => {
                  const formattedDate = moment(date?.value).format(
                    "DD-MMM-YYYY"
                  );
                  const event = {
                    target: {
                      name: "AdmissionDate",
                      value: formattedDate,
                    },
                  };
                  handlechangebyPrisciption(event);
                }}
                disabled={isInputDisabled(item.Gender)}
              />
            )}
          </>
        );

      case 44:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.stageOfCancer}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "stageOfCancer")}
              name="stageOfCancer"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {(prisciptionForm.stageOfCancer || "").length} /{" "}
              {getCharLimit(item?.AccordianName)}
            </div>
          </>
        );
      case 45:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.ihcReport}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "ihcReport")}
              name="ihcReport"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {(prisciptionForm.ihcReport || "").length} /{" "}
              {getCharLimit(item?.AccordianName)}
            </div>
          </>
        );
      case 46:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.systemicTherapy}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "systemicTherapy")}
              name="systemicTherapy"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {(prisciptionForm.systemicTherapy || "").length} /{" "}
              {getCharLimit(item?.AccordianName)}
            </div>
          </>
        );

      case 99:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.doctorRemarks}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "doctorRemarks")}
              name="doctorRemarks"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {(prisciptionForm.doctorRemarks || "").length} /{" "}
              {getCharLimit(item?.AccordianName)}
            </div>
          </>
        );

      case 8:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.Allergies}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "Allergies")}
              name="Allergies"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {(prisciptionForm.Allergies || "").length} /{" "}
              {getCharLimit(item?.AccordianName)}
            </div>
          </>
        );

      case 34:
        return !isPregnancy ? null : (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm?.paExaminantion}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "paExaminantion")}
              name="paExaminantion"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 35:
        return !isPregnancy ? null : (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.pvExaminantion}
              onChange={handlechangebyPrisciption}
              onFocus={(e) => handleInputFocus(e, "pvExaminantion")}
              name="pvExaminantion"
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 14:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.ConfidentialData}
              onFocus={(e) => handleInputFocus(e, "ConfidentialData")}
              name="ConfidentialData"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted">
              {`${(prisciptionForm.ConfidentialData || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 15:
        return (
          <TransferReffralConsultation
            prisciptionForm={prisciptionForm}
            handlechangebyPrisciption={handlechangebyPrisciption}
            onFocus={handleInputFocus}
            handleReactSelectChangebyPrisciption={
              handleReactSelectChangebyPrisciption
            }
            disabled={isInputDisabled(item.Gender)}
          />
        );

      case 22:
        return (
          <DatePicker
            className="custom-calendar"
            id="NextVisit"
            name="NextVisit"
            lable={"Visit Date"}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-12 mt-2"}
            value={
              prisciptionForm?.NextVisit
                ? moment(prisciptionForm.NextVisit, "DD-MMM-YYYY").toDate()
                : ''
            }
            handleChange={(date) => {
              const formattedDate = moment(date?.value).format("DD-MMM-YYYY");
              const event = {
                target: {
                  name: "NextVisit",
                  value: formattedDate,
                },
              };
              handlechangebyPrisciption(event);
            }}
            minDate={new Date()}
            // disable
            // handleChange={handlechangebyPrisciption}
            disabled={isInputDisabled(item.Gender)}
          />
        );

      case 23:
        return (
          <MenstrualAndObstetric
            loadSaveData={loadSaveData}
            setPregnancyDetails={setPregnancyDetails}
            patientDetail={patientDetail}
            disabled={isInputDisabled(item.Gender)}
          // isPregnancy={isPregnancy}
          />
        );

      case 26:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.RiskFactor}
              onFocus={(e) => handleInputFocus(e, "RiskFactor")}
              name="RiskFactor"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 27:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.AnyAncHospitalisations}
              onFocus={handleInputFocus}
              name="AnyAncHospitalisations"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 28:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.NST}
              onFocus={handleInputFocus}
              name="NST"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 29:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.PelvicAssessment}
              onFocus={handleInputFocus}
              name="PelvicAssessment"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );

      case 30:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.ParturitionDetailsAndOutCome}
              onFocus={handleInputFocus}
              name="ParturitionDetailsAndOutCome"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 36:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.historyOfCovid}
              onFocus={(e) => handleInputFocus(e, "historyOfCovid")}
              name="historyOfCovid"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 37:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.historyOfPresentIllness}
              onFocus={(e) => handleInputFocus(e, "historyOfPresentIllness")}
              name="historyOfPresentIllness"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 38:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.surgicalHistory}
              onFocus={(e) => handleInputFocus(e, "surgicalHistory")}
              name="surgicalHistory"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 39:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.imunigrationHistory}
              onFocus={(e) => handleInputFocus(e, "imunigrationHistory")}
              name="imunigrationHistory"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 42:
        return (
          <>
            <textarea
              id={""}
              className="w-100 "
              value={prisciptionForm.precaution}
              onFocus={(e) => handleInputFocus(e, "precaution")}
              name="precaution"
              onChange={handlechangebyPrisciption}
              disabled={isInputDisabled(item.Gender)}
              maxLength={getCharLimit(item?.AccordianName)}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(prisciptionForm[item?.AccordianName] || "").length} / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </>
        );
      case 2:
        return (
          <div className="p-1">
            <div className="d-flex" style={{ gap: "5px" }}>
              <ReactSelect
                name="Type"
                placeholderName="Category"
                dynamicOptions={[
                  { label: "All", value: "" },
                  ...labCategoryList,
                ]}
                respclass="flex-grow-1"
                value={labCategoryIds?.categoryId}
                removeIsClearable={true}
                handleChange={(name, e) =>
                  setLabCategoryIds({
                    ...labCategoryIds,
                    categoryId: e?.value,
                    subCategoryId: "",
                  })
                }
              />
              <ReactSelect
                name="Type"
                dynamicOptions={[
                  { label: "All", value: "" },
                  ...labSubCategoryList,
                ]}
                placeholderName="Sub Category"
                respclass="flex-grow-1"
                value={labCategoryIds?.subCategoryId}
                removeIsClearable={true}
                handleChange={(name, e) =>
                  setLabCategoryIds({
                    ...labCategoryIds,
                    subCategoryId: e?.value,
                  })
                }
              />
            </div>

            <AutoComplete
              ref={(el) => (autoCompleteRefs.current[item?.AccordianName] = el)}
              suggestions={filteredItems[item?.AccordianName]}
              completeMethod={(e) => search(e, item?.AccordianName)}
              className="tag-input w-100 p-0"
              value={inputValue[item?.AccordianName] || ""}
              placeholder="Type and Press Enter"
              onChange={handleChange}
              onFocus={(e) => handleInputFocus(e, item?.AccordianName)}
              name={item?.AccordianName}
              onSelect={(e) => onSelected(e, item?.AccordianName)}
              id="searchtest"
              onKeyDown={(e) => handleKeyPress(e, item?.AccordianName)}
              itemTemplate={itemTemplate}
              // disabled={isInputDisabled(item.Gender) || ((inputValue[item?.AccordianName] || "").trim().split(/\s+/).length >= getCharLimit(item?.AccordianName))}
              disabled={
                isInputDisabled(item.Gender) ||
                (tags[item?.AccordianName] || [])
                  .map((tag) => tag?.ValueField || "")
                  .join(" ").length >= getCharLimit(item?.AccordianName)
              }
              maxLength={getCharLimit(item?.AccordianName)}
            />

            <textarea
              id={""}
              className="w-100 mt-1"
              value={inputValue["Remarks"]}
              onFocus={(e) => handleInputFocus(e, "labRemarks")}
              name="Remarks"
              placeholder="Enter remarks"
              // onChange={handleChangeRemarks}
              maxLength={getCharLimit(item?.AccordianName)}
              onChange={(e) =>
                setInputValue((val) => ({
                  ...val,
                  [e.target.name]: e.target.value,
                }))
              }
              onKeyDown={handleChangeRemarks}
            />
            <div className="text-right text-sm text-muted mb-1">
              {`${(tags[item?.AccordianName] || [])
                .map((tag) => tag?.ValueField || "")
                .join(" ").length
                } / ${getCharLimit(item?.AccordianName)}`}
            </div>
          </div>
        );

      case 43:
        return (
          <AutoComplete
            completeMethod={(e) => SearchByICDDescgetData(e)}
            className="tag-input"
            value={searchByICD.searchByICDDecs}
            placeholder="Search By ICD Desc and press Enter"
            onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
            suggestions={suggestions}
            name={"searchByICDDecs"}
            onSelect={handleSelect}
            id="searchByICDDecs"
            onKeyPress={handleKeyPress}
            itemTemplate={itemTemplateFinalDiagnosis}
          />
        )

      default:
        return (
          <>
            <div className="text-right text-sm text-muted mb-1 p-1">
              {`${(tags[item?.AccordianName] || [])
                .map((tag) => tag?.ValueField || "")
                .join(" ").length
                } / ${getCharLimit(item?.AccordianName)}`}
            </div>

            <AutoComplete
              ref={(el) => (autoCompleteRefs.current[item?.AccordianName] = el)}
              suggestions={filteredItems[item?.AccordianName]}
              completeMethod={(e) => search(e, item?.AccordianName)}
              className="tag-input"
              value={inputValue[item?.AccordianName] || ""}
              placeholder="Type and Press Enter"
              onChange={handleChange}
              onFocus={(e) => handleInputFocus(e, item?.AccordianName)}
              name={item?.AccordianName}
              onSelect={(e) => onSelected(e, item?.AccordianName)}
              id="searchtest"
              onKeyDown={(e) => handleKeyPress(e, item?.AccordianName)}
              itemTemplate={itemTemplate}
              // disabled={isInputDisabled(item.Gender) || ((inputValue[item?.AccordianName] || "").trim().split(/\s+/).length >= getCharLimit(item?.AccordianName))}
              disabled={
                isInputDisabled(item.Gender) ||
                (tags[item?.AccordianName] || [])
                  .map((tag) => tag?.ValueField || "")
                  .join(" ").length >= getCharLimit(item?.AccordianName)
              }
              maxLength={getCharLimit(item?.AccordianName)}
            />

            {/* <AutoComplete
              suggestions={filteredItems[item?.AccordianName]}
              completeMethod={(e) => search(e, item?.AccordianName)}
              className="tag-input"
              value={inputValue[item?.AccordianName] || ""}
              placeholder="Type and Press Enter"
              onChange={handleChange}
              onFocus={handleInputFocus}
              name={item?.AccordianName}
              onSelect={(e) => onSelected(e, item?.AccordianName)}
              id="searchtest"
              onKeyPress={(e) => handleKeyPress(e, item?.AccordianName)}
              itemTemplate={itemTemplate}
              disabled={isInputDisabled(item.Gender)}
            /> */}
          </>
        );
    }
  };

  const handleEmailModalOpen = (component, header) => {
    setEmailModal({
      isShow: true,
      component: component,
      size: null,
      Header: header,
    });
  };

  const handleSMSModalOpen = (component, header) => {
    setSmsModal({
      isShow: true,
      component: component,
      size: null,
      Header: header,
    });
  };

  const handleClickDataSet = () => {
    if (actionType === "ConsentForm") {
      childRef.current.callChildFunction();
      // childRef.current.callChildFunctionSaveDiagnosisInformationSave(); // Call save function
    } else if (actionType === "Update") {
      childRef.current.callChildFunctionUpdated(); // Call edit function
    } else if (actionType === "SaveDiagnosis") {
      childRef.current.callChildFunctionSaveDiagnosisInformationSave();
    } else if (actionType === "VitalSign") {
      childRef.current.callChildFunctionHandleSaveVitals();
    } else if (actionType === "UpdateVitalSign") {
      childRef.current.callChildFunctionHandleUpdateVitals();
    }
  };

  // Dynamic Component Import
  const importComponent = (path) => {
    return React.lazy(() =>
      import(`../../../../../pages/doctor/OPD/${path}.jsx`)
        .then((module) => ({ default: module.default }))
        .catch(() => ({
          default: () => <div>Component not found: {path}</div>,
        }))
    );
  };

  const handleSelectChange = (name, e) => {
    switch (e?.label) {
      case "Final Diagnosis":
        setActionType("SaveDiagnosis");
        break;
      case "Vital Sign":
        setActionType("VitalSign");
        break;
      case "Consent Form":
        setActionType("ConsentForm");
        break;
      default:
        break;
    }
    const selectedItem = apiData.getCPEOMenuList.find(
      (item) => item?.menuName === e?.label
    );
    if (!selectedItem) {
      return;
    }

    // const SelectedComponent = componentMapping[selectedItem?.menuName] || NotFound;
    const SelectedComponent = importComponent(selectedItem?.url) || NotFound;
    setSelectedOption(name);

    // Open the modal with the selected component or NotFound component
    setOpenPageModal({
      isShow: true,
      component: (
        <Suspense fallback={<div>Loading...</div>}>
          <SelectedComponent
            patientDetail={patientDetail} // Pass relevant props
            getDoctorID={getDoctorID}
            setActionType={setActionType}
            ref={childRef}
            menuItemData={selectedItem}
            toggleAction={toggleAction}
          />
        </Suspense>
      ),
      Header: selectedItem?.menuName,
      size: "80vw", // Adjust size based on your requirement
    });
  };

  // Update for Consent Form
  const toggleAction = (params) => {
    //  
    setActionType(params === "Save" ? "Save" : "Update");
  };

  const [patientAllDetail, setPatientAllDetail] = useState({});

  const getPatientDetails = async () => {
    let apiResp = await PatientSearchbyBarcode(
      patientDetail?.currentPatient?.PatientID,
      1
    );
    if (apiResp?.success) {
      setPatientAllDetail(apiResp?.data);
    }
  };

  // useEffect(() => {
  //   if (patientDetail?.currentPatient?.PatientID) {
  //     const { PatientID, TransactionID } = patientDetail?.currentPatient;
  //     getLoadPrescriptionView(TransactionID, PatientID);
  //   }
  //   getPatientDetails();
  //   // fetchAllApiData();
  //   getBindMenuCPEOList();
  //   // data?.DoctorID
  // }, [patientDetail?.currentPatient?.PatientID, reloadDoctor]);
  // --- PASTE THIS NEW CODE HERE ---
  useEffect(() => {
    const currentPat = patientDetail?.currentPatient;

    // 1. Guard Clause: Stop execution if crucial IDs are missing to prevent errors
    if (!currentPat?.PatientID || !currentPat?.TransactionID) return;

    const fetchAllPatientData = async () => {
      getPatientDetails();
      getBindMenuCPEOList();
      dispatch(getBindVital(currentPat.TransactionID));
      getLoadPrescriptionView(currentPat.TransactionID, currentPat.PatientID);
      try {
        const response = await GetPrescription({
          patientID: currentPat.PatientID,
          transactionID: currentPat.TransactionID,
          appID: currentPat.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        if (response?.data) {
          setLoadSaveData(response.data);
        }
      } catch (error) {
        console.error("Error fetching prescription draft:", error);
      }

     
      try {
        const res = await GetOldAppointentData({
          patientID: currentPat.PatientID,
          transactionID: currentPat.TransactionID,
          appID: currentPat.App_ID,
          Type: type === "Emergency" ? "emg" : "opd",
        });
        if (res?.data) {
          setApiData((prev) => ({ ...prev, getOldAppointentDataAPI: res.data }));
        }
      } catch (error) {
        console.error("Error fetching old appointments:", error);
      }
    };

    fetchAllPatientData();

  }, [patientDetail?.currentPatient?.PatientID, reloadDoctor]);

  useEffect(() => {
    if (showSuggestions) {
      const labels = document.querySelectorAll(".theme-color");
      labels.forEach((label) => {
        label.style.color = "black !important";
      });
    }
  }, [showSuggestions]);
  // Save prisciption form

  // const newPayload = {
  //   investigations: [],
  //   procedures: [],
  //   medicines: [],
  //   molecularAllergies: [],
  //   // prescriptionHeader: [1,2],
  //   prescriptionHeader: prescription.map((item, index) => {
  //     return { Id: item.ID };
  //   }),
  //   transactionID: patientDetail?.currentPatient?.TransactionID,
  //   app_ID: patientDetail?.currentPatient?.App_ID,
  //   patientID: patientDetail?.currentPatient?.PatientID,
  //   chiefComplaint: "",
  //   doctorNotes: "",
  //   refferdoctor: prisciptionForm.referTo?.value
  //     ? prisciptionForm.referTo?.value
  //     : prisciptionForm.referTo,
  //   clinicalExamination: "",
  //   appointmentDoctorID: getDoctorID,
  //   vaccinationStatus: [],
  //   allergies: prisciptionForm.Allergies,
  //   medications: "",
  //   progressionComplaint: "",
  //   ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
  //   provisionalDiagnosis: "",
  //   doctorAdvice: [],
  //   confidentialData: prisciptionForm.ConfidentialData,
  //   referral: prisciptionForm.ImpressionDiagnosis,
  //   referralRemarks: prisciptionForm.Remarks,
  //   referaltype: prisciptionForm.referralType?.value
  //     ? prisciptionForm.referralType?.value
  //     : prisciptionForm.referralType,
  //   consultationType: prisciptionForm.consultType?.value
  //     ? prisciptionForm.consultType?.value
  //     : prisciptionForm.consultType,
  //   referDept: prisciptionForm.department?.value
  //     ? prisciptionForm.department?.value
  //     : prisciptionForm.department,
  //   doctorType: prisciptionForm.DoctorType?.value
  //     ? prisciptionForm.DoctorType?.value
  //     : prisciptionForm.DoctorType,
  //   appointmentDate: patientDetail?.currentPatient?.AppointmentDate,
  //   appointmentTime: "",
  //   isDoctorAppointment: 0,
  //   isIPDData: type === "Emergency" ? 2 : 0,
  //   personalHistory: [],
  //   generalExamination: [],
  //   nextVisit: type ==="copy" ? "" : prisciptionForm.NextVisit,
  //   diet: [],
  //   followUpVisit: "",
  //   cvs: prisciptionForm.CVS,
  //   ent: prisciptionForm.ENT,
  //   rs: prisciptionForm.RS,
  //   pa: prisciptionForm.PA,
  //   cns: prisciptionForm.CNS,
  //   general: prisciptionForm.General,
  //   pregnancyBasicDetails: pregnancyDetails,
  //   detailsOfPrevious: previousPregnancyData ? previousPregnancyData : [],
  //   familyHistories: familyHistoryData ? familyHistoryData : [],
  //   riskFactors: prisciptionForm.RiskFactor,
  //   anyAncHospitalisations: prisciptionForm.AnyAncHospitalisations,
  //   nst: prisciptionForm.NST,
  //   pelvicAssesment: prisciptionForm.PelvicAssessment,
  //   parturitionDetails: prisciptionForm.ParturitionDetailsAndOutCome,

  //   historyOfCovid: prisciptionForm.historyOfCovid,
  //   historyOfPresentIllness: prisciptionForm.historyOfPresentIllness,
  //   surgicalHistory: prisciptionForm.surgicalHistory,
  //   imunigrationHistory: prisciptionForm.imunigrationHistory,
  //   precaution: prisciptionForm.precaution,
  //   admissionRequired: type ==="copy" ? 0 : (prisciptionForm.admissionRequired ? 1 : 0),
  //   AdmissionDate: prisciptionForm.AdmissionDate,
  //   NutritionAdviseRemarks: prisciptionForm.NutritionAdviseRemarks,
  //   NutritionAdvise: prisciptionForm.NutritionAdvise,

  //   pallor: prisciptionForm.pallor,
  //   odema: prisciptionForm.odema,
  //   uterus: prisciptionForm.uterus,
  //   varicoseVeins: prisciptionForm.varicoseVeins,
  //   nodes: prisciptionForm.nodes,
  //   breasts: prisciptionForm.breasts,
  //   respiratory: prisciptionForm.respiratory,
  //   anyAdventitiousSounds: prisciptionForm.anyAdventitiousSounds,
  //   DoctorRemarks: prisciptionForm.doctorRemarks,
  //   DoctorAdditionalAdvice: prisciptionForm.doctorAdditionalAdvice,

  //   knownOfs:
  //     tags &&
  //     tags["Known OFF"].map((item) => {
  //       return {
  //         ValueField: item.ValueField,
  //       };
  //     }),
  //   keyNote:
  //     tags &&
  //     tags["Key Note"].map((item) => {
  //       return {
  //         ValueField: item.ValueField,
  //       };
  //     }),
  //   previousDoctor:
  //     tags &&
  //     tags["Previous Doctor"].map((item) => {
  //       return {
  //         ValueField: item.ValueField,
  //       };
  //     }),

  //   paExaminantion: {
  //     value: prisciptionForm?.paExaminantion,
  //   },

  //   pvExaminantion: {
  //     value: prisciptionForm?.pvExaminantion,
  //   },
  //   diagnosisInformation: (tags["icd10Diagnosis"]?.length > 0 &&
  //     tags["icd10Diagnosis"].map((ele, ind) => (
  //       {
  //         "icd_id": ele?.icd_id,
  //         "transactionID": patientDetail?.currentPatient?.TransactionID,
  //         "icD_Code": ele?.ICD10_Code,
  //         "patientID": patientDetail?.currentPatient?.PatientID,
  //         "whoFullDesc": ele?.WHO_Full_Desc,
  //         "isActive": 1,
  //         "isOT": 0
  //       }
  //     )) || [])
  // };

  // ----------------------------------------------------------------------------------------------------

  const handlechangebyPrisciption = (e) => {
    const { name, value } = e.target;
    if (name === "NextVisit" && value) {
      const formattedDate = new Date(value)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/\s/g, "-");
      const isOnLeave = doctorLeaves?.some(
        (item) => item?.DATE === formattedDate && item?.IsActive === "No"
      );

      if (isOnLeave) {
        notify("Doctor is on leave on this date!", "warn");
        return;
      }
    }



    setPrisciptionForm((prevForm) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return {
          ...prevForm,
          [name]: value,
        };
      } else {
        // If it's a nested field
        return {
          ...prevForm,
          [keys[0]]: {
            ...prevForm[keys[0]],
            [keys[1]]: value,
          },
        };
      }
    });
  };
  console.log(prisciptionForm);
  const handleReactSelectChangebyPrisciption = (name, selectedOption) => {
    setPrisciptionForm((prevForm) => {
      const keys = name.split("."); // Split the name on dots if it's nested
      if (keys.length === 1) {
        // If it's a top-level field
        return {
          ...prevForm,
          [name]: selectedOption, // Update with the selected value
          ...(name === "department" && { referTo: null }),
          // [name]: selectedOption?.value, // Update with the selected value
        };
      } else {
        // If it's a nested field
        return {
          ...prevForm,
          [keys[0]]: {
            ...prevForm[keys[0]],
            [keys[1]]: selectedOption?.value,
          },
        };
      }
    });
  };

  const handleSavePriscciptionForm = async (type) => {
    debugger
    const newPayload = {
      investigations: [],
      procedures: [],
      medicines: [],
      molecularAllergies: [],
      // prescriptionHeader: [1,2],
      prescriptionHeader: prescription.map((item, index) => {
        return { Id: item.ID };
      }),
      transactionID: patientDetail?.currentPatient?.TransactionID,
      app_ID: patientDetail?.currentPatient?.App_ID,
      patientID: patientDetail?.currentPatient?.PatientID,
      chiefComplaint: "",
      doctorNotes: "",
      refferdoctor: prisciptionForm.referTo?.value
        ? prisciptionForm.referTo?.value
        : prisciptionForm.referTo,
      clinicalExamination: "",
      appointmentDoctorID: getDoctorID,
      vaccinationStatus: [],
      allergies: prisciptionForm.Allergies,
      medications: "",
      progressionComplaint: "",
      ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
      provisionalDiagnosis: "",
      doctorAdvice: [],
      confidentialData: prisciptionForm.ConfidentialData,
      referral: prisciptionForm.ImpressionDiagnosis,
      referralRemarks: prisciptionForm.Remarks,
      referaltype: prisciptionForm.referralType?.value
        ? prisciptionForm.referralType?.value
        : prisciptionForm.referralType,
      consultationType: prisciptionForm.consultType?.value
        ? prisciptionForm.consultType?.value
        : prisciptionForm.consultType,
      referDept: prisciptionForm.department?.value
        ? prisciptionForm.department?.value
        : prisciptionForm.department,
      doctorType: prisciptionForm.DoctorType?.value
        ? prisciptionForm.DoctorType?.value
        : prisciptionForm.DoctorType,
      appointmentDate: patientDetail?.currentPatient?.AppointmentDate,
      appointmentTime: "",
      isDoctorAppointment: 0,
      isIPDData: type === "Emergency" ? 2 : 0,
      personalHistory: [],
      generalExamination: [],
      nextVisit: type === "copy" ? "" : prisciptionForm.NextVisit,
      diet: [],
      followUpVisit: "",
      cvs: prisciptionForm.CVS,
      ent: prisciptionForm.ENT,
      rs: prisciptionForm.RS,
      pa: prisciptionForm.PA,
      cns: prisciptionForm.CNS,
      general: prisciptionForm.General,
      pregnancyBasicDetails: pregnancyDetails,
      detailsOfPrevious: previousPregnancyData ? previousPregnancyData : [],
      familyHistories: familyHistoryData ? familyHistoryData : [],
      riskFactors: prisciptionForm.RiskFactor,
      anyAncHospitalisations: prisciptionForm.AnyAncHospitalisations,
      nst: prisciptionForm.NST,
      pelvicAssesment: prisciptionForm.PelvicAssessment,
      parturitionDetails: prisciptionForm.ParturitionDetailsAndOutCome,

      historyOfCovid: prisciptionForm.historyOfCovid,
      historyOfPresentIllness: prisciptionForm.historyOfPresentIllness,
      surgicalHistory: prisciptionForm.surgicalHistory,
      imunigrationHistory: prisciptionForm.imunigrationHistory,
      precaution: prisciptionForm.precaution,
      admissionRequired: type === "copy" ? 0 : (prisciptionForm.admissionRequired ? 1 : 0),
      AdmissionDate: type === "copy" ? "" : prisciptionForm.AdmissionDate,
      NutritionAdviseRemarks: prisciptionForm.NutritionAdviseRemarks,
      NutritionAdvise: prisciptionForm.NutritionAdvise,

      pallor: prisciptionForm.pallor,
      odema: prisciptionForm.odema,
      uterus: prisciptionForm.uterus,
      varicoseVeins: prisciptionForm.varicoseVeins,
      nodes: prisciptionForm.nodes,
      breasts: prisciptionForm.breasts,
      respiratory: prisciptionForm.respiratory,
      anyAdventitiousSounds: prisciptionForm.anyAdventitiousSounds,
      DoctorRemarks: prisciptionForm.doctorRemarks,
      DoctorAdditionalAdvice: prisciptionForm.doctorAdditionalAdvice,
      StageOfCancer: prisciptionForm.stageOfCancer,
      IHCReport: prisciptionForm.ihcReport,
      SystematicTherapy: prisciptionForm.systemicTherapy,
      knownOfs:
        tags &&
        tags["Known OFF"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),
      keyNote:
        tags &&
        tags["Key Note"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),
      previousDoctor:
        tags &&
        tags["Previous Doctor"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),

      paExaminantion: {
        value: prisciptionForm?.paExaminantion,
      },

      pvExaminantion: {
        value: prisciptionForm?.pvExaminantion,
      },
      diagnosisInformation: (tags["icd10Diagnosis"]?.length > 0 &&
        tags["icd10Diagnosis"].map((ele, ind) => (
          {
            "icd_id": ele?.icd_id,
            "transactionID": patientDetail?.currentPatient?.TransactionID,
            "icD_Code": ele?.ICD10_Code,
            "patientID": patientDetail?.currentPatient?.PatientID,
            "whoFullDesc": ele?.WHO_Full_Desc,
            "isActive": 1,
            "isOT": 0
          }
        )) || [])
    };
    // const investigationsData = tags["Investigation(Lab & Radio)"].map(
    //   (ele) => ({
    //     patientID: patientDetail?.currentPatient?.PatientID,
    //     app_ID: patientDetail?.currentPatient?.App_ID,
    //     transactionID: patientDetail?.currentPatient?.TransactionID,
    //     test_ID: ele?.ID ? ele?.ID : "0",
    //     name: ele?.ValueField,
    //     ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
    //     quantity: 1,
    //     remarks: "",
    //     prescribeDate: new Date().toISOString(),
    //     configID: "25",
    //     isUrgent: "0",
    //     outsource: 0,
    //     doctorID: getDoctorID,
    //     createdBy: "",
    //     isPackage: 0,
    //     isIPDData: "0",
    //   })
    // );
    //  ;
    const investigations = tags["Investigation(Lab & Radio)"] || [];

    const investigationsData = investigations.length
      ? investigations.map((ele) => {
        // const isGeneratedID = !ele?.ID || ele.ID === "0"||ele?.isDefaultTemplate || ele?.isOutSource ==1;
        const isGeneratedID =
          !ele?.ID || ele.ID === "0" || ele?.isOutSource == 1;
        const test_ID = isGeneratedID
          ? Math.floor(100000 + Math.random() * 900000).toString()
          : ele.ID;
        ;
        return {
          patientID: patientDetail?.currentPatient?.PatientID,
          app_ID: patientDetail?.currentPatient?.App_ID,
          transactionID: patientDetail?.currentPatient?.TransactionID,
          test_ID,
          name: ele?.ValueField,
          ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
          quantity: 1,
          remarks: ele?.remarks,
          prescribeDate: new Date().toISOString(),
          configID: "25",
          isUrgent: "0",
          outsource: isGeneratedID ? 1 : 0,
          doctorID: getDoctorID,
          createdBy: "",
          isPackage: 0,
          isIPDData: "0",
          IsDefaultTemplet: ele?.isDefaultTemplate ? 1 : 0,
        };
      })
      : [];

    const procedureData = tags["Prescribed Procedure"].map((ele) => ({
      patientID: patientDetail?.currentPatient?.PatientID,
      app_ID: patientDetail?.currentPatient?.App_ID,
      transactionID: patientDetail?.currentPatient?.TransactionID,
      test_ID: ele?.ID ? ele?.ID : "0",
      name: ele?.ValueField,
      ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
      quantity: 1,
      remarks: "",
      prescribeDate: new Date().toISOString(),
      configID: "3",
      isUrgent: "",
      outsource: ele?.isDefaultTemplate ? 1 : 0,
      doctorID: getDoctorID,
      createdBy: "",
      isPackage: 0,
      isIPDData: "0",
      IsDefaultTemplet: ele?.isDefaultTemplate ? 1 : 0,
    }));
    // const medicineData = tags["Prescribed Medicine"]
    //   .map((item) => {
    //     if (
    //       item.Name?.value ||
    //       item.Duration?.value ||
    //       item.Time?.value ||
    //       item.Remarks?.value ||
    //       item.Dose?.value ||
    //       item.Route?.value
    //     ) {
    //       return {
    // patientID: patientDetail.currentPatient.PatientID,
    // transactionID: patientDetail.currentPatient.TransactionID,
    // app_ID: patientDetail.currentPatient.App_ID,
    // ledgerTransactionNo: patientDetail.currentPatient.LedgerTnxNo,
    // doctorID: getDoctorID,
    // medicine_ID: item?.Name?.ID,
    // medicineName: item.Name?.value,
    // noOfDays: item.Duration?.value,
    // noTimesDay: item.Time?.value,
    // remarks: item.Remarks?.value,
    // quantity: 0,
    // dose: item.Dose?.value,
    // enteryBy: "",
    // route: item.Route?.value,
    // isEmergency: "",
    // centreID: localData?.centreID,
    // hospital_ID: localData?.hospital_ID,
    // isIPDData: "0",
    // changeReason: "",
    // ischange: 0,
    // date: new Date().toISOString(),
    // outsource: 0,
    // isEmergencyData: 0,
    //       };
    //     }
    //   })
    //   .filter(Boolean); // Yeh filter function undefined ya null values ko remove karega

    const medicineData = tags["Prescribed Medicine"]
      ?.filter((item) => item.Name) // First filter to remove items with missing Name or Dose
      .filter(
        (item) =>
          Object.keys(item.Name?.value || item.Name).length > 0
      ) // Second filter to remove rows where Name or Dose are empty objects
      .filter(Boolean); // Remove any null or undefined values

    const payloadMedicine = medicineData.map((item) => ({
      patientID: patientDetail?.currentPatient?.PatientID,
      transactionID: patientDetail?.currentPatient?.TransactionID,
      app_ID: patientDetail?.currentPatient?.App_ID,
      ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
      doctorID: getDoctorID,
      meal: typeof item.Meal === "object" ? item.Meal.value : item.Meal,
      medicine_ID: item?.AllItemListData?.medicine_ID || item?.Name?.ID,
      medicineName: item.Name.value || item.Name,
      // noOfDays: item.Duration.value || item.Duration,
      noOfDays:
        typeof item.Duration === "object" ? item.Duration.value : item.Duration,
      // noTimesDay: item.Time.value || item.Time,
      noTimesDay: typeof item.Time === "object" ? item.Time.value : item.Time,
      remarks:
        typeof item.Remarks === "object" ? item.Remarks.value : item.Remarks,
      quantity:
        typeof item?.Quantity === "object" && Object.keys(item?.Quantity).length === 0
          ? 0
          : typeof item?.Quantity === "object"
            ? parseInt(item?.Quantity?.value)
            : item?.Quantity,

      route: typeof item.Route === "object" ? item.Route.value : item.Route,
      dose: typeof item.Dose === "object" ? item.Dose.value : item.Dose,
      // route: item.Route.value ? item.Route.value : typeof(item.Route)!=="object"?item.Route:"",
      // quantity: 0,
      // dose: item.Dose.value ? item.Dose.value : typeof(item.Dose)!=="object"?item.Dose:"",
      // quantity: 0,
      // dose: item.Dose.value || item.Dose,
      enteryBy: "",
      // route: item.Route.value || item.Route,
      isEmergency: "",
      centreID: localData?.centreID,
      hospital_ID: localData?.hospital_ID,
      isIPDData: "0",
      changeReason: "",
      ischange: 0,
      date: new Date().toISOString(),
      outsource: 0,
      isEmergencyData: 0,
    }));

    // }
    const mapAndCreatePayload = (tagKey, tabID, tabValue) => {
      const dynamicData = tags[tagKey].map((item) => ({
        Value: item?.ValueField,
        TABID: tabID,
        TabValue: tabValue,
      }));

      return {
        TABID: dynamicData[0]?.TABID,
        TabValue: dynamicData[0]?.TabValue,
        Value: dynamicData?.map((item) => item.Value),
      };
    };

    const chiefComplaintPayload = mapAndCreatePayload(
      "Chief Complaint",
      6,
      "Chief Complaint"
    );
    const doctorNotesPayload = mapAndCreatePayload(
      "Doctor Notes",
      5,
      "Doctor Notes"
    );
    const doctorAdvicePayload = mapAndCreatePayload(
      "Doctor Advice",
      13,
      "Doctor Advice"
    );
    const personalHistoryPayload = mapAndCreatePayload(
      "Personal/Occupational History",
      18,
      "Personal/Occupational History"
    );
    const generalExaminationDynamic = mapAndCreatePayload(
      "General Examination",
      19,
      "General Examination"
    );
    const vaccinationStatusDynamic = mapAndCreatePayload(
      "Vaccination Status",
      7,
      "Vaccination Status"
    );
    const pastHistoryDynamic = mapAndCreatePayload(
      "Past History",
      10,
      "Past History"
    );
    const treatmentHistoryDynamic = mapAndCreatePayload(
      "Treatment History",
      16,
      "Treatment History"
    );
    const ProvisionalDiagnosisDynamic = mapAndCreatePayload(
      "Provisional Diagnosis",
      12,
      "Provisional Diagnosis"
    );
    const signAndSymptonsDynamic = mapAndCreatePayload(
      "Sign & Symptoms",
      4,
      "Sign & Symptoms"
    );
    const dietDynamic = mapAndCreatePayload("Diet", 21, "Diet");

    newPayload.transactionID = patientDetail?.currentPatient?.TransactionID; // Example of setting a single value
    newPayload.app_ID = patientDetail?.currentPatient?.App_ID;
    newPayload.patientID = patientDetail?.currentPatient?.PatientID;

    // // Update arrays in the payload
    newPayload.investigations = investigationsData; // Add Your Investigation Data
    // newPayload.procedures = []; // Add your procedures data
    newPayload.procedures = procedureData; // Add your procedures data
    newPayload.medicines = payloadMedicine; // Add your medicines data

    // // Example of updating with form data (assuming you have form data to insert)
    newPayload.chiefComplaint = chiefComplaintPayload;
    newPayload.doctorNotes = doctorNotesPayload;
    newPayload.doctorAdvice = doctorAdvicePayload;
    newPayload.personalHistory = personalHistoryPayload;
    newPayload.generalExamination = generalExaminationDynamic;
    newPayload.diet = dietDynamic;
    newPayload.vaccinationStatus = vaccinationStatusDynamic;
    newPayload.progressionComplaint = pastHistoryDynamic;
    newPayload.medications = treatmentHistoryDynamic;
    newPayload.provisionalDiagnosis = ProvisionalDiagnosisDynamic;
    newPayload.clinicalExamination = signAndSymptonsDynamic;
    // // Check the updated payload

    // Now you can make the API call with the updated payload
    //  
    try {
      if (
        type === "save" &&
        loadSaveData?.transactionID !==
        patientDetail?.currentPatient?.TransactionID
      ) {
        //  
        notify("You can't copy old data to current appointment data", "error");
        return false;
      }

      const apiResponse = await SavePrescriptionForm(newPayload);

      if (apiResponse.success) {
        if (type === "copy") {
          notify("Prescription Copied successfully", "success");
          handleClearForm();
          getLoadPrescriptionData();
          return true;
        } else {
          notify(apiResponse.message, "success");
          handleClearForm();
          getLoadPrescriptionData();
          // return true;
        }
      }

      if (!apiResponse.success) {
        notify(apiResponse.message, "error");
      }
      setIsPrescriptionButton(true);
    } catch (error) {
      console.error("Error saving prescription form:", error);
    }
  };

  const handleSavePrescriptionDraft = async () => {

    const newPayload = {
      investigations: [],
      procedures: [],
      medicines: [],
      molecularAllergies: [],
      // prescriptionHeader: [1,2],
      prescriptionHeader: prescription.map((item, index) => {
        return { Id: item.ID };
      }),
      transactionID: patientDetail?.currentPatient?.TransactionID,
      app_ID: patientDetail?.currentPatient?.App_ID,
      patientID: patientDetail?.currentPatient?.PatientID,
      chiefComplaint: "",
      doctorNotes: "",
      refferdoctor: prisciptionForm.referTo?.value
        ? prisciptionForm.referTo?.value
        : prisciptionForm.referTo,
      clinicalExamination: "",
      appointmentDoctorID: getDoctorID,
      vaccinationStatus: [],
      allergies: prisciptionForm.Allergies,
      medications: "",
      progressionComplaint: "",
      ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
      provisionalDiagnosis: "",
      doctorAdvice: [],
      confidentialData: prisciptionForm.ConfidentialData,
      referral: prisciptionForm.ImpressionDiagnosis,
      referralRemarks: prisciptionForm.Remarks,
      referaltype: prisciptionForm.referralType?.value
        ? prisciptionForm.referralType?.value
        : prisciptionForm.referralType,
      consultationType: prisciptionForm.consultType?.value
        ? prisciptionForm.consultType?.value
        : prisciptionForm.consultType,
      referDept: prisciptionForm.department?.value
        ? prisciptionForm.department?.value
        : prisciptionForm.department,
      doctorType: prisciptionForm.DoctorType?.value
        ? prisciptionForm.DoctorType?.value
        : prisciptionForm.DoctorType,
      appointmentDate: patientDetail?.currentPatient?.AppointmentDate,
      appointmentTime: "",
      isDoctorAppointment: 0,
      isIPDData: type === "Emergency" ? 2 : 0,
      personalHistory: [],
      generalExamination: [],
      nextVisit: type === "copy" ? "" : prisciptionForm.NextVisit,
      diet: [],
      followUpVisit: "",
      cvs: prisciptionForm.CVS,
      ent: prisciptionForm.ENT,
      rs: prisciptionForm.RS,
      pa: prisciptionForm.PA,
      cns: prisciptionForm.CNS,
      general: prisciptionForm.General,
      pregnancyBasicDetails: pregnancyDetails,
      detailsOfPrevious: previousPregnancyData ? previousPregnancyData : [],
      familyHistories: familyHistoryData ? familyHistoryData : [],
      riskFactors: prisciptionForm.RiskFactor,
      anyAncHospitalisations: prisciptionForm.AnyAncHospitalisations,
      nst: prisciptionForm.NST,
      pelvicAssesment: prisciptionForm.PelvicAssessment,
      parturitionDetails: prisciptionForm.ParturitionDetailsAndOutCome,

      historyOfCovid: prisciptionForm.historyOfCovid,
      historyOfPresentIllness: prisciptionForm.historyOfPresentIllness,
      surgicalHistory: prisciptionForm.surgicalHistory,
      imunigrationHistory: prisciptionForm.imunigrationHistory,
      precaution: prisciptionForm.precaution,
      admissionRequired: type === "copy" ? 0 : (prisciptionForm.admissionRequired ? 1 : 0),
      AdmissionDate: prisciptionForm.AdmissionDate,
      NutritionAdviseRemarks: prisciptionForm.NutritionAdviseRemarks,
      NutritionAdvise: prisciptionForm.NutritionAdvise,

      pallor: prisciptionForm.pallor,
      odema: prisciptionForm.odema,
      uterus: prisciptionForm.uterus,
      varicoseVeins: prisciptionForm.varicoseVeins,
      nodes: prisciptionForm.nodes,
      breasts: prisciptionForm.breasts,
      respiratory: prisciptionForm.respiratory,
      anyAdventitiousSounds: prisciptionForm.anyAdventitiousSounds,
      DoctorRemarks: prisciptionForm.doctorRemarks,
      DoctorAdditionalAdvice: prisciptionForm.doctorAdditionalAdvice,

      knownOfs:
        tags &&
        tags["Known OFF"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),
      keyNote:
        tags &&
        tags["Key Note"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),
      previousDoctor:
        tags &&
        tags["Previous Doctor"].map((item) => {
          return {
            ValueField: item.ValueField,
          };
        }),

      paExaminantion: {
        value: prisciptionForm?.paExaminantion,
      },

      pvExaminantion: {
        value: prisciptionForm?.pvExaminantion,
      },
      diagnosisInformation: (tags["icd10Diagnosis"]?.length > 0 &&
        tags["icd10Diagnosis"].map((ele, ind) => (
          {
            "icd_id": ele?.icd_id,
            "transactionID": patientDetail?.currentPatient?.TransactionID,
            "icD_Code": ele?.ICD10_Code,
            "patientID": patientDetail?.currentPatient?.PatientID,
            "whoFullDesc": ele?.WHO_Full_Desc,
            "isActive": 1,
            "isOT": 0
          }
        )) || [])
    };

    const investigationsData = tags["Investigation(Lab & Radio)"].map(
      (ele) => ({
        patientID: patientDetail?.currentPatient?.PatientID,
        app_ID: patientDetail?.currentPatient?.App_ID,
        transactionID: patientDetail?.currentPatient?.TransactionID,
        test_ID: ele?.ID ? ele?.ID : "0",
        name: ele?.ValueField,
        ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
        quantity: 1,
        remarks: "",
        prescribeDate: new Date().toISOString(),
        configID: "25",
        isUrgent: "0",
        outsource: 0,
        doctorID: getDoctorID,
        createdBy: "",
        isPackage: 0,
        isIPDData: "0",
      })
    );

    const procedureData = tags["Prescribed Procedure"].map((ele) => ({
      patientID: patientDetail?.currentPatient?.PatientID,
      app_ID: patientDetail?.currentPatient?.App_ID,
      transactionID: patientDetail?.currentPatient?.TransactionID,
      test_ID: ele?.ID ? ele?.ID : "0",
      name: ele?.ValueField,
      ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
      quantity: 1,
      remarks: "",
      prescribeDate: new Date().toISOString(),
      configID: "3",
      isUrgent: "",
      outsource: 0,
      doctorID: getDoctorID,
      createdBy: "",
      isPackage: 0,
      isIPDData: "0",
    }));
    const medicineData = tags["Prescribed Medicine"]
      .map((item) => {
        if (
          item.Name || item.Name?.value ||
          item.Duration?.value ||
          item.Time?.value ||
          item.Remarks?.value ||
          item.Dose?.value ||
          item.Route?.value
        ) {
          return {
            patientID: patientDetail?.currentPatient?.PatientID,
            transactionID: patientDetail?.currentPatient?.TransactionID,
            app_ID: patientDetail?.currentPatient?.App_ID,
            ledgerTransactionNo: patientDetail?.currentPatient?.LedgerTnxNo,
            doctorID: getDoctorID,
            medicine_ID: item?.Name?.ID,
            medicineName: item.Name?.value || "",
            noOfDays: item.Duration?.value || "",
            noTimesDay: item.Time?.value || "",
            remarks: item.Remarks?.value || "",
            quantity: 0,
            dose: item.Dose?.value || "",
            enteryBy: "",
            route: item.Route?.value || "",
            isEmergency: "",
            centreID: localData?.centreID,
            hospital_ID: localData?.hospital_ID,
            isIPDData: "0",
            changeReason: "",
            ischange: 0,
            date: new Date().toISOString(),
            outsource: 0,
            isEmergencyData: 0,
          };
        }
      })
      .filter(Boolean); // Yeh filter function undefined ya null values ko remove karega
    const mapAndCreatePayload = (tagKey, tabID, tabValue) => {
      const dynamicData = tags[tagKey].map((item) => ({
        Value: item?.ValueField,
        TABID: tabID,
        TabValue: tabValue,
      }));

      return {
        TABID: dynamicData[0]?.TABID,
        TabValue: dynamicData[0]?.TabValue,
        Value: dynamicData?.map((item) => item.Value),
      };
    };
    // console.log(first)
    const chiefComplaintPayload = mapAndCreatePayload(
      "Chief Complaint",
      6,
      "Chief Complaint"
    );
    const doctorNotesPayload = mapAndCreatePayload(
      "Doctor Notes",
      5,
      "Doctor Notes"
    );
    const doctorAdvicePayload = mapAndCreatePayload(
      "Doctor Advice",
      13,
      "Doctor Advice"
    );
    const personalHistoryPayload = mapAndCreatePayload(
      "Personal/Occupational History",
      18,
      "Personal/Occupational History"
    );
    const generalExaminationDynamic = mapAndCreatePayload(
      "General Examination",
      19,
      "General Examination"
    );
    const vaccinationStatusDynamic = mapAndCreatePayload(
      "Vaccination Status",
      7,
      "Vaccination Status"
    );
    const pastHistoryDynamic = mapAndCreatePayload(
      "Past History",
      10,
      "Past History"
    );
    const treatmentHistoryDynamic = mapAndCreatePayload(
      "Treatment History",
      16,
      "Treatment History"
    );
    const ProvisionalDiagnosisDynamic = mapAndCreatePayload(
      "Provisional Diagnosis",
      12,
      "Provisional Diagnosis"
    );
    const signAndSymptonsDynamic = mapAndCreatePayload(
      "Sign & Symptoms",
      4,
      "Sign & Symptoms"
    );
    const dietDynamic = mapAndCreatePayload("Diet", 21, "Diet");

    newPayload.transactionID = patientDetail?.currentPatient?.TransactionID; // Example of setting a single value
    newPayload.app_ID = patientDetail?.currentPatient?.App_ID;
    newPayload.patientID = patientDetail?.currentPatient?.PatientID;

    // // Update arrays in the payload
    newPayload.investigations = investigationsData; // Add Your Investigation Data
    // newPayload.procedures = []; // Add your procedures data
    newPayload.procedures = procedureData; // Add your procedures data
    newPayload.medicines = medicineData; // Add your medicines data

    // // Example of updating with form data (assuming you have form data to insert)
    newPayload.chiefComplaint = chiefComplaintPayload;
    newPayload.doctorNotes = doctorNotesPayload;
    newPayload.doctorAdvice = doctorAdvicePayload;
    newPayload.personalHistory = personalHistoryPayload;
    newPayload.generalExamination = generalExaminationDynamic;
    newPayload.diet = dietDynamic;
    newPayload.vaccinationStatus = vaccinationStatusDynamic;
    newPayload.progressionComplaint = pastHistoryDynamic;
    newPayload.medications = treatmentHistoryDynamic;
    newPayload.provisionalDiagnosis = ProvisionalDiagnosisDynamic;
    newPayload.clinicalExamination = signAndSymptonsDynamic;
    // // Check the updated payload

    // Now you can make the API call with the updated payload
    try {
      const apiResponse = await SavePrescriptionDraft(
        newPayload,
        shouldSaveDraft
      );

      if (apiResponse.success === true) {
        !shouldSaveDraft && notify(apiResponse.message, "success");
        handleClearForm();
        getLoadPrescriptionData();
      }
    } catch (error) {
      console.error("Error saving prescription form:", error);
    }
  };

  const handleClearForm = () => {
    setTags((prevTags) => {
      // Create a new object to update tags
      const updatedTags = { ...prevTags };

      // Reset all sections except "Prescribed Medicine"
      Object.keys(updatedTags).forEach((key) => {
        if (key === "Prescribed Medicine") {
          // Remove only those rows in "Prescribed Medicine" that have data
          updatedTags["Prescribed Medicine"] = updatedTags[
            "Prescribed Medicine"
          ].filter((medData) => {
            // Check if the row has data (non-empty)
            return Object.keys(medData).every(
              (medKey) => Object.keys(medData[medKey]).length === 0
            );
          });
        } else {
          updatedTags[key] = []; // Reset other sections
        }
      });

      // Update the tags state
      return updatedTags;
    });

    setItems((prevItems) => {
      // Create a new object to update items
      const updatedItems = { ...prevItems };

      // Uncheck all items by setting checked to false
      Object.keys(updatedItems)?.forEach((mainArray) => {
        updatedItems[mainArray] = updatedItems[mainArray]?.map((item) => ({
          ...item,
          isChecked: false, // Ensure this field exists in item and set it to false
        }));
      });

      // Update the items state
      return updatedItems;
    });

    setPrisciptionForm((prev) => ({
      ...prescription,
      Allergies: "",
      ConfidentialData: "",
      NextVisit: '',
      // SystematicExamination: "",
      CNS: "",
      ENT: "",
      RS: "",
      PA: "",
      General: "",
      CVS: "",
      // TransferReferralForConsultation: "",
      DoctorType: "",
      department: "",
      referTo: "",
      referralType: "",
      consultType: "",
      ImpressionDiagnosis: "",
      Remarks: "",
    }));
  };

  const settingBTNListSeemote = [
    {
      id: 1,
      name: "Doctor Prescription Ordering",
      onClick: "",
      component: (
        <DoctorPresciptionOrdering
          getDoctorID={getDoctorID}
          getLoadPrescriptionView={getLoadPrescriptionView}
          patientDetail={patientDetail?.currentPatient}
        />
      ),
    },
    // {
    //   id: 2,
    //   name: "Print Settings",
    //   onClick: "",
    //   component: (
    //     <PrintSetting
    //       getDoctorID={getDoctorID}
    //       patientDetail={patientDetail?.currentPatient}
    //     />
    //   ),
    // },
    // {
    //   id: 3,
    //   name: "Add Custom Tab Adding",
    //   onClick: "",
    //   component: <AddCustomTabing />,
    // },
    {
      id: 4,
      name: "Doctor Leave",
      onClick: "",
      component: <DoctorLeave getDoctorID={getDoctorID} />,
    },
    // {
    //   id: 5,
    //   name: "Plan of Treatment",
    //   onClick: "",
    // },
    {
      id: 6,
      name: "Im  Not Available",
      onClick: "",
      component: <DoctorNotAvailble getDoctorID={getDoctorID} />,
    },
  ];

  /// SMS Send API

  const [sms, setSms] = useState({
    mobileNo: "" || patientDetail?.currentPatient?.ContactNo,
    textSMS: "",
  });

  const [error1, setError1] = useState("");
  const [emailError, setEmailError] = useState("");

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^[0-9]{10}$/; // Example: Indian phone number format
    if (!phoneRegex.test(value)) {
      setError1("Please enter a valid 10-digit phone number");
    } else {
      setError1("");
    }
  };

  const handleChangeSMS = (name, value) => {
    // const { name, value } = e.target;
    setSms((val) => ({ ...val, [name]: value?.value }));

    // if (name === "mobileNo") {
    //   if (/^\d*$/.test(value) && value.length <= 10) {
    //     setSms((prevSms) => ({
    //       ...prevSms,
    //       [name]: value,
    //     }));
    //     validatePhoneNumber(value);
    //   }
    // } else {
    //   setSms((prevSms) => ({
    //     ...prevSms,
    //     [name]: value,
    //   }));
    // }
  };

  const handleClickSentSMS = async () => {
    try {
      const res = await SaveSMS({
        mobile_No: sms.mobileNo
          ? sms.mobileNo
          : patientDetail?.currentPatient?.ContactNo,
        smS_Text: sms.textSMS,
        doctorID: getDoctorID,
        patientID: patientDetail?.currentPatient?.PatientID,
        templateID: 0,
        smsType: 1,
        bookingNo: patientDetail?.currentPatient?.App_ID,
      });

      if (res.success) {
        notify(res.message, "success");
        setSms((prev) => ({ ...prev, mobileNo: "", textSMS: "" }));
      }
    } catch (error) { }
  };

  const [emailSend, setEmailSend] = useState({
    toEmailID: "",
    emailSubject: "",
    emailBody: patientDetail?.currentPatient?.email,
    // attachementPath:""
  });

  const validateEmail = (value) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const emailHandleChange = (e) => {
    const { name, value } = e.target;

    if (name === "toEmailID") {
      setEmailSend((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateEmail(value);
    } else {
      setEmailSend((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleClickSentEmail = async () => {
    try {
      const res = await sendEmail({
        toEmailID: emailSend.toEmailID,
        emailSubject: emailSend.emailSubject,
        emailBody: emailSend.emailBody,
        patientID: patientDetail?.currentPatient?.PatientID,
        templateID: 0,
        transactionID: patientDetail?.currentPatient?.TransactionID,
        attachementPath: "",
      });

      if (res.success) {
        notify(res.message, "success");
        setEmailSend((prev) => ({
          ...prev,
          emailBody: "",
          emailSubject: "",
          toEmailID: "",
        }));
      }
    } catch (error) { }
  };

  // const [textInput, setTextInput] = useState("")

  // const stopVoiceInput = ()=>{
  //   setTextInput(prev => prev + (transcript.length ? (prev.length ? "":"")+ transcript:""))
  //   stop()
  // }

  // const startKaro = ()=>{
  //   isListening ? stopVoiceInput():start()
  // }

  // EDP Master Doctor ====================================================

  const [settingModal, setSettingModal] = useState({
    component: "",
    size: "95vw",
    header: "",
    isShow: false,
  });

  const handleClickSettingPage = (item) => {
    setSettingModal({
      component: item.component,
      size: item?.id === 1 ? "30vw" : "",
      header: item.name,
      isShow: true,
    });
  };

  const getLoadPrescriptionData = async () => {
    try {
      const response = await GetPrescription({
        patientID: patientDetail?.currentPatient?.PatientID,
        transactionID: patientDetail?.currentPatient?.TransactionID,
        appID: patientDetail?.currentPatient?.App_ID,
        Type: type === "Emergency" ? "emg" : "opd",
      });
      if (response?.data) {
        setLoadSaveData(response.data);
      }
    } catch (error) { }
  };

  const {
    GetDepartmentList,
    GetBindAllDoctorConfirmationData,
    GetBindReferDoctorList,
  } = useSelector((state) => state.CommonSlice);

  useEffect(() => {
    if (loadSaveData) {
      let referDept = reactSelectOptionList(
        GetDepartmentList,
        "Name",
        "ID"
      ).find((val) => `${val?.value}` === loadSaveData?.referDept);
      let refferdoctor = reactSelectOptionList(
        GetBindAllDoctorConfirmationData,
        "Name",
        "DoctorID"
      ).find((val) => `${val?.value}` === loadSaveData?.refferdoctor);

      setPrisciptionForm({
        Allergies: loadSaveData?.allergies ? loadSaveData?.allergies : "",
        NextVisit: loadSaveData?.nextVisit,
        ConfidentialData: loadSaveData?.confidentialData
          ? loadSaveData?.confidentialData
          : "",
        // SystematicExamination: {
        CNS: loadSaveData?.cns,
        ENT: loadSaveData.ent,
        RS: loadSaveData.rs,
        PA: loadSaveData.pa,
        General: loadSaveData.general,
        CVS: loadSaveData.cvs,
        // },
        // TransferReferralForConsultation: {
        DoctorType: loadSaveData?.doctorType,
        // department: loadSaveData.referDept,
        department: referDept,
        // referTo: loadSaveData.refferdoctor,
        referTo: refferdoctor,
        referralType: loadSaveData.referaltype,
        consultType: loadSaveData.consultationType,
        ImpressionDiagnosis: loadSaveData.referral,
        Remarks: loadSaveData.referralRemarks
          ? loadSaveData.referralRemarks
          : "",
        RiskFactor: loadSaveData.riskFactors ? loadSaveData.riskFactors : "",
        AnyAncHospitalisations: loadSaveData.anyAncHospitalisations
          ? loadSaveData.anyAncHospitalisations
          : "",
        NST: loadSaveData.nst ? loadSaveData.nst : "",
        PelvicAssessment: loadSaveData.pelvicAssesment
          ? loadSaveData.pelvicAssesment
          : "",
        ParturitionDetailsAndOutCome: loadSaveData.parturitionDetails
          ? loadSaveData.parturitionDetails
          : "",
        pallor: loadSaveData.pallor ? loadSaveData.pallor : "",
        odema: loadSaveData.odema ? loadSaveData.odema : "",
        uterus: loadSaveData.uterus ? loadSaveData.uterus : "",
        varicoseVeins: loadSaveData.varicoseVeins
          ? loadSaveData.varicoseVeins
          : "",
        nodes: loadSaveData.nodes ? loadSaveData.nodes : "",
        breasts: loadSaveData.breasts ? loadSaveData.breasts : "",
        respiratory: loadSaveData.respiratory ? loadSaveData.respiratory : "",
        anyAdventitiousSounds: loadSaveData.anyAdventitiousSounds
          ? loadSaveData.anyAdventitiousSounds
          : "",
        // knownOfs: loadSaveData.knownOfs ? loadSaveData.knownOfs : "",
        // keyNote: loadSaveData.keyNote ? loadSaveData.keyNote : "",
        // previousDoctor: loadSaveData.previousDoctor ? loadSaveData.previousDoctor : "",
        paExaminantion: loadSaveData?.paExaminantion?.value
          ? loadSaveData?.paExaminantion?.value
          : "",
        pvExaminantion: loadSaveData?.pvExaminantion?.value
          ? loadSaveData?.pvExaminantion?.value
          : "",
        historyOfCovid: loadSaveData?.historyOfCovid,
        historyOfPresentIllness: loadSaveData?.historyOfPresentIllness,
        surgicalHistory: loadSaveData?.surgicalHistory,
        imunigrationHistory: loadSaveData?.imunigrationHistory,
        precaution: loadSaveData?.precaution,
        admissionRequired: loadSaveData?.admissionRequired === 1 ? true : false,
        AdmissionDate: loadSaveData?.admissionDate,
        NutritionAdviseRemarks: loadSaveData?.nutritionAdviseRemarks,
        NutritionAdvise: loadSaveData?.nutritionAdvise,
        doctorRemarks: loadSaveData?.doctorRemarks,
        doctorAdditionalAdvice: loadSaveData?.doctorAdditionalAdvice,
        stageOfCancer: loadSaveData?.stageOfCancer,
        systemicTherapy: loadSaveData?.systemicTherapy,
        ihcReport: loadSaveData?.ihcReport,

      });

      const {
        keyNote = [],
        knownOfs = [],
        previousDoctor = [],
        diagnosisInformation = [],
      } = loadSaveData || {};

      setTags((prevTags) => ({
        ...prevTags,
        "icd10Diagnosis": diagnosisInformation?.map((fData) => ({
          // ...fData,
          icd_id: fData?.icd_id,
          WHO_Full_Desc: fData?.whoFullDesc,
          ICD10_Code: fData?.icD_Code,
          ValueField: `${fData?.whoFullDesc} (${fData?.icD_Code})`,
        })),
        "Key Note": keyNote.map((item) => ({ ValueField: item.valueField })),
        "Known OFF": knownOfs.map((item) => ({ ValueField: item.valueField })),
        "Previous Doctor": previousDoctor.map((item) => ({
          ValueField: item.valueField,
        })),
      }));

      updateAutocompleteField(
        "Chief Complaint",
        loadSaveData?.chiefComplaint?.value
      );
      updateAutocompleteField(
        // "Sign & Symptoms",
        "Past History",
        loadSaveData?.progressionComplaint?.value
      );
      updateAutocompleteField(
        "Sign & Symptoms",
        // "Past History",
        loadSaveData?.clinicalExamination?.value
      );
      updateAutocompleteField(
        "Treatment History",
        loadSaveData?.medications?.value
      );
      updateAutocompleteField(
        "Vaccination Status",
        loadSaveData?.vaccinationStatus?.value
      );
      updateAutocompleteField("Doctor Notes", loadSaveData?.doctorNotes?.value);
      updateAutocompleteField(
        "Provisional Diagnosis",
        loadSaveData?.provisionalDiagnosis?.value
      );
      updateAutocompleteField(
        "Doctor Advice",
        loadSaveData?.doctorAdvice?.value
      );
      updateAutocompleteField(
        "Personal/Occupational History",
        loadSaveData?.personalHistory?.value
      );
      updateAutocompleteField(
        "General Examination",
        loadSaveData?.generalExamination?.value
      );
      updateAutocompleteField("Diet", loadSaveData?.diet?.value);

      updateCompleteFillInvestionProceder(
        "Investigation(Lab & Radio)",
        loadSaveData?.investigations?.map((ele) => ele)
      );
      // updateCompleteFillInvestionProceder(
      //   "Investigation(Lab & Radio)",
      //   loadSaveData?.investigations?.map((ele) => ({
      //     id: ele.test_ID, // yahan aap ID ko map kar rahe hain
      //     name: ele.name   // yahan aap name ko map kar rahe hain
      //   }))
      // );

      // updateCompleteFillInvestionProceder(
      //   "Investigation(Lab & Radio)",
      //   loadSaveData?.investigations?.map((ele) => ele.name)
      // );
      updateCompleteFillInvestionProceder(
        "Prescribed Procedure",
        loadSaveData?.procedures?.map((ele) => ele)
      );
      updateAutocompleteField("Prescribed Medicine", loadSaveData.medicines);
    }
  }, [loadSaveData, reloadDoctor]);

  const updateAutocompleteField = (fieldName, data) => {
    if (fieldName === "Prescribed Medicine") {
      const transformedMedicineData = data?.map((item) => {
        // Ensure default values are used if fields are undefined or empty
        const values = {
          Name: item.medicineName || "",
          Dose: item.dose || "",
          Time: item.noTimesDay || "",
          Duration: item.noOfDays || "",
          Meal: item.meal || "",
          Route: item.route || "",
          Remarks: item.remarks || "",
          Quantity: item.quantity || "",
          AllItemListData: item, // Store the full item data
        };

        // Return values object
        return values;
      });
      const blankRow = {
        Name: {},
        Dose: {},
        Time: {},
        Duration: {},
        Meal: {},
        Route: {},
        Remarks: {},
        Quantity: {},
        AllItemListData: {},
      };
      const finalMedicineData =
        transformedMedicineData?.length > 0
          ? [...transformedMedicineData, blankRow]
          : [blankRow];
      setTags((prevTags) => ({
        ...prevTags,
        [fieldName]: finalMedicineData, // Update the specific field
      }));
    } else {
      const transformedData = data
        ?.filter((val) => val !== "" || null)
        .map((text) => ({
          ValueField: text,
          ID: null,
        }));

      setTags((prevTags) => ({
        ...prevTags,
        [fieldName]: transformedData || [], // Dynamically update the specific field
      }));
    }
  };

  const updateCompleteFillInvestionProceder = (fieldName, data) => {
    console.log(data, fieldName, "filedName");
    const transformedData = data
      ?.filter((val) => val !== null)
      ?.map((text) => ({
        ValueField: text.name,
        ID: text.test_ID,
        isDefaultTemplate: text?.outsource == 1 ? true : false,
        remarks: text?.remarks,
      }));

    setTags((prevTags) => ({
      ...prevTags,
      [fieldName]: transformedData || [],
    }));
  };
  const handleGetDoctorBindLeave = async () => {
    try {
      const res = await BindLeave(getDoctorID);
      console.log(res);
      setDoctorLeaves(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGetOldAppointentData = async () => {
    try {
      const res = await GetOldAppointentData({
        patientID: patientDetail?.currentPatient?.PatientID,
        transactionID: patientDetail?.currentPatient?.TransactionID,
        appID: patientDetail?.currentPatient?.App_ID,
        Type: type === "Emergency" ? "emg" : "opd",
      });
      setApiData((prev) => ({ ...prev, getOldAppointentDataAPI: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getGetOldAppointentData();
  //   getLoadPrescriptionData();
  // }, [reloadDoctor]);

  const [splitData, setSplitData] = useState({});
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (splitData?.PatientID && splitData?.TransactionID && splitData?.App_ID) {
      handleAPICall();
    }
  }, [splitData]);



  const splitFunctionConvertObject = (itemSplit) => {
    const key = itemSplit.valueFieldDesc.split("#");
    const value = itemSplit.valueField.split("#");
    const res = {};
    key.forEach((e, i) => {
      res[e] = value[i];
    });
    setSplitData(res);
  };

  const handleAPICall = async () => {
    try {
      const response = await GetPrescription({
        patientID: splitData?.PatientID,
        transactionID: splitData?.TransactionID,
        appID: splitData?.App_ID,
        Type: type === "Emergency" ? "emg" : "opd",
      });
      if (response?.data) {
        setLoadSaveData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetDataForOLDAppointment = (item) => {
    setCurrentItem(item);
    splitFunctionConvertObject(item);
  };
  //upDATED FUNCTION BY Aakash
  const handleFullScreen = () => {
    let doc = document.getElementById("main-header").style.display;
    let topPosition = document.querySelector(".sticky-desktop");

    if (doc === "none") {
      document.getElementById("main-header").style.display = "block";
      topPosition.style.top = "100px";
    } else {
      document.getElementById("main-header").style.display = "none";
      topPosition.style.top = "0px";
    }
    toggleFullScreen();
  };

  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  // voice to text
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const activeInputRef = useRef(null);

  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }
    console.log("sdskjdjsbdjsbjdbsjkdb call huwa");

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      const activeInput = activeInputRef.current;

      if (activeInput) {
        setInputValue((prevValues) => ({
          ...prevValues,
          [activeInput]: prevValues[activeInput] + transcript,
        }));
        if (handleActiveInputVoiceToText(activeInput)) {
          setPrisciptionForm((prevForm) => {
            const keys = activeInput.split(".");
            if (keys.length === 1) {
              return {
                ...prevForm,
                [activeInput]: prevForm[activeInput] + transcript,
              };
            } else {
              return {
                ...prevForm,
                [keys[0]]: {
                  ...prevForm[keys[0]],
                  [keys[1]]: prevForm[activeInput] + transcript,
                },
              };
            }
          });
        }
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        startRecognition(); // Restart if user still wants to listen
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.start(); // Start recognition
  };

  // Stop Speech Recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      console.log("first recognition,stop", isListening);
      stopRecognition();
    } else {
      startRecognition();
      console.log("first recognition,start", isListening);
    }
    setIsListening(!isListening); // Toggle the listening state
  };

  const autoCompleteRefs = useRef({});
  const [focusedType, setFocusedType] = useState(null);

  // const handleInputFocus = (e, type) => {
  //   console.log("🔵 Focus on:", type);

  //   setFilteredItems((prev) => ({
  //     ...prev,
  //     [type]: transformedSuggestions[type] || [],
  //   }));

  //   if (focusedType && autoCompleteRefs.current[focusedType]) {
  //     autoCompleteRefs.current[focusedType].hide();
  //     console.log(`❌ Suggestions closed for: ${focusedType}`);
  //   }

  //   setFocusedType(type);

  //   setTimeout(() => {
  //     if (autoCompleteRefs.current[type]) {
  //       autoCompleteRefs.current[type].show();
  //       console.log(`✅ Suggestions opened for: ${type}`);
  //     } else {
  //       console.log(`❌ AutoComplete ref not found for: ${type}`);
  //     }
  //   }, 50);
  // };

  const handleInputFocus = (e, type) => {

    const selectedValues = new Set(
      (tags[type] || []).map((tag) => tag.ValueField)
    );

    const filteredSuggestions = (transformedSuggestions[type] || []).filter(
      (item) => !selectedValues.has(item.ValueField)
    );

    setFilteredItems((prev) => ({
      ...prev,
      [type]: filteredSuggestions || [],
    }));

    activeInputRef.current = type;

    if (focusedType && autoCompleteRefs.current[focusedType]) {
      autoCompleteRefs.current[focusedType].hide();
    }

    setFocusedType(type);
    // autoCompleteRefs.current[type].show();
    if (showSuggestions) {
      setTimeout(() => {
        if (autoCompleteRefs.current[type]) {
          autoCompleteRefs.current[type].show();
        } else {
          console.log(`❌ AutoComplete ref not found for: ${type}`);
        }
      }, 50);
    }
  };


  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, []);

  const { getBindVitalData } = useSelector((state) => state.vitalSignSlice);

  const isMobile = window.innerWidth > 100;
  const [isDesktop, setIsDesktop] = useState(false);

  //Doctor Get TopSuggestion Akhilesh

  // get doctor ID

  const getCurerntDoctorID = async () => {
    try {
      const response = await CommonAPIGetDoctorIDByEmployeeID();
      setCurrentDoctorID(response?.data[0]?.doctorID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DoctorGetPrescriptionPreview = async () => {
    try {
      const response = await DoctorGetPrescriptionview();
      let data = Number(response?.data?.[0]) === 1 ? true : false;
      setIsDesktop(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DoctorUpdatePrescriptionPreview = async (payload) => {
    try {
      const response = await DoctorUpdatePrescriptionview(payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    DoctorGetPrescriptionPreview();
    handleGetDoctorBindLeave();
  }, []);



  const handleDoctorTopSuggestions = async (payload) => {
    try {
      //  
      const response = await DoctorPrescriptionGetTopSuggestion(payload);
      if (response.success) {
        setDoctorTopSuggestions(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        // notify(response?.message, "error");
        setDoctorTopSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      // notify(apiResp?.message, "error");
      setDoctorTopSuggestions([]);
    }
  };

  useEffect(() => {
    const { Age, Sex } = patientDetail?.currentPatient;
    let payload = {
      age: "",
      sex: "",
      // age:Age,
      // sex:Sex,
      doctorID: currentDoctorID ? currentDoctorID : getDoctorID,
    };

    getCurerntDoctorID();
    handleDoctorTopSuggestions(payload);
  }, [currentDoctorID, isDeleteTemplate]);

  // Function to transform the data
  const transformSuggestions = (suggestions) => {
    const groupedData = {};

    suggestions.forEach((suggestion) => {
      Object.keys(fieldMapping).forEach((key) => {
        const fieldKey = fieldMapping[key];
        const fieldValue = suggestion[fieldKey];

        if (!groupedData[key]) {
          groupedData[key] = []; // Initialize array for this key
        }

        if (Array.isArray(fieldValue)) {
          fieldValue.forEach((value) => {
            // If the value itself has an array inside a "value" key, handle it
            if (value?.value && Array.isArray(value.value)) {
              value.value.forEach((item) => {
                if (item.trim() !== "") {
                  groupedData[key].push({
                    ValueField: item,
                    TemplateName: item,
                  });
                }
              });
            } else {
              groupedData[key].push({
                ValueField:
                  value.ValueField ||
                  value.name ||
                  value.value ||
                  value.TemplateName ||
                  "",
                TemplateName:
                  value.TemplateName ||
                  value.name ||
                  value.value ||
                  value.ValueField ||
                  "",
              });
            }
          });
        } else if (fieldValue) {
          // Handle cases where fieldValue is a single object but has an array inside "value"
          if (fieldValue?.value && Array.isArray(fieldValue.value)) {
            fieldValue.value.forEach((item) => {
              if (item.trim() !== "") {
                groupedData[key].push({
                  ValueField: item,
                  TemplateName: item,
                });
              }
            });
          } else {
            groupedData[key].push({
              ValueField:
                fieldValue.ValueField ||
                fieldValue.name ||
                fieldValue.value ||
                fieldValue.TemplateName ||
                "",
              TemplateName:
                fieldValue.TemplateName ||
                fieldValue.name ||
                fieldValue.value ||
                fieldValue.ValueField ||
                "",
            });
          }
        }
      });
    });

    return groupedData;
  };

  // Use useEffect to transform the data when doctorTopSuggestions changes
  useEffect(() => {
    //  
    if (doctorTopSuggestions.length > 0) {
      const transformedData = transformSuggestions(doctorTopSuggestions);
      setTransformedSuggestions(transformedData);
    }
  }, [doctorTopSuggestions]);

  //zoom 110%

  // Log the transformed data for verification
  // useEffect(() => {
  //   // console.log("Transformed Suggestions:", transformedSuggestions);
  //   // console.log("items data coming from parent:", items);
  // }, [transformedSuggestions]);

  // console.log("this is api data coming from parent component", items)

  const getClassName = (ID) => {
    if (ID === 8 || ID === 14 || ID === 22) {
      return "";
    } else if (ID === 822) {
    } else {
      return "App py-1  ";
    }
    // `${item?.ID===8||item?.ID===14?"col-6":"App py-1 mx-1 col-12"}`
  };

  // useEffect(() => {
  //   console.log("patientDetail", patientDetail?.currentPatient?.Gender);
  // }, [patientDetail]);

  const isInputDisabled = (prescriptionGender) => {
    const patientGender = patientDetail?.currentPatient?.Gender;

    // Logic:
    // - If patient is Male (M), disable Female (F) inputs.
    // - If patient is Female (F), disable Male (M) inputs.
    // - If patient is Both (B), enable all inputs.
    if (patientGender === "M" && prescriptionGender === "F") {
      return true;
    } else if (patientGender === "F" && prescriptionGender === "M") {
      return true;
    } else {
      return false;
    }
  };

  // const shouldHideForPregnancy = () => {
  //   console.log(isPregnancy, "ispregnancy............")
  //   return isPregnancy === 0;

  // };
  //   const isPregnancy = loadSaveData?.vitalSign?.isPregnancy === 0 ? false : true;
  const isPregnancy =
    loadSaveData?.vitalSign === null
      ? true
      : true || loadSaveData?.vitalSign?.isPregnancy === null
        ? true
        : true || loadSaveData?.vitalSign?.isPregnancy === 0
          ? false
          : true;

  useEffect(() => {
    const container = document.querySelector(".appoinment-details-container");
    const onTop = document.querySelector(".sticky-desktop ");

    if (container && window.innerWidth >= 1024 && isZoom === "true") {
      container.style.zoom = "1.2";
      container.style.overflowX = "clip";
      container.style.width = "100%";
      onTop.style.top = "85px";
    }

    return () => {
      container.style.zoom = "1";
      container.style.overflowX = "auto";
      onTop.style.top = "unset";
    };
  }, []);

  const handleCallOldReport = () => {
    window.open(`http://192.168.0.249/Oswal/Design/FrontOffice/PatientLabSearch.aspx?PatientId=${patientDetail?.currentPatient?.PatientID}`);
  }
  const handleCallPresReport = () => {
    window.open(`http://192.168.0.249/Oswal/Design/OPD/Opd_digital.aspx?PatientId=${patientDetail?.currentPatient?.PatientID}`);

  }
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });
  const handleOpenModel = (item) => {

    setModalHandlerState({
      show: true,
      header: t("View Lab Report"),
      size: "90%",
      component: <ViewLabReport data={item} />,
      footer: (
        <></>
      )
    });
  }
  return (
    <div
      className="appoinment-details-container"
    // style={{ position: "fixed", zIndex: 9999999999, top: 0, width: "100%" }}
    >
      <div className="sticky-desktop  md:py-1 py-2">
        {type !== "Emergency" && (
          <div className="card md:mt-2">
            <Heading
              title={
                <div className="d-flex">
                  <div className="mt-1 ">{t("Patient Details")} </div>
                  <DocVitalSignPatientDetailCard
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={patientDetail?.currentPatient}
                    keyName={"menuName"}
                    pageName={"AppontmentDetail"}
                    isShowPatient={false}
                  />


                  <div className="text-center m-auto ">



                  </div>

                </div>
              }
              isBreadcrumb={false}
              secondTitle={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button className="btn btn-primary" onClick={(e) => handleOpenModel(patientDetail?.currentPatient)}>View Lab Report</button>
                  <button className="btn btn-primary" onClick={handleCallOldReport}>View Lab Old Report</button>
                  <button className="btn btn-primary" onClick={handleCallPresReport}>View Old Prescription</button>
                  {isMobile && (
                    <>
                      <Tooltip target=".tooltip-target1" />
                      <Checkbox
                        type="checkbox"
                        name=""
                        id="DextopView"
                        checked={isDesktop}
                        onChange={(e) => {
                          let payload = e.target.checked ? 1 : 0;
                          // console.log("payloadpayloadpayload",payload)
                          DoctorUpdatePrescriptionPreview(payload);
                          setIsDesktop(e.target.checked);
                        }}
                        title="Desktop View"
                        className="tooltip-target1  d-flex align-items-center"
                        data-pr-tooltip="Prescription Preview"
                        data-pr-position="top"
                        label="Hover Me"
                      />
                      <Checkbox
                        type="checkbox"
                        checked={isDocChecked}
                        onChange={() => {
                          setIsDocChecked(!isDocChecked);
                        }}
                        className="tooltip-target d-flex align-items-center "
                        data-pr-tooltip="Doctor Details"
                        data-pr-position="top"
                        label="Hover Me"
                      />
                      <Tooltip target=".tooltip-target" />
                    </>
                  )}
                  <i
                    className="fa fa-arrows-alt"
                    aria-hidden="true"
                    onClick={handleFullScreen}
                  ></i>
                  <div className="mt-1 d-flex">
                    <i
                      className="pi pi-arrow-left px-2"
                      aria-hidden="true"
                      onClick={() => setActive(true)}
                    ></i>
                  </div>

                  <div>
                    <SeeMore
                      Header={
                        <div>
                          <i
                            className="pi pi-spins pi-cog"
                            aria-hidden="true"
                          ></i>
                        </div>
                      }
                      docterError={docterError}
                    >
                      <ul
                        className="list-group"
                        style={{
                          whiteSpace: "nowrap",
                          position: "fixed",
                          right: "6px",
                        }}
                      >
                        {settingBTNListSeemote?.map((items, index) => {
                          return (
                            <li
                              className="list-group-item p-2"
                              key={index}
                              // onClick={() =>
                              //   ModalComponent(items?.name, items?.component)
                              // }
                              onClick={() => handleClickSettingPage(items)}
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {items.name}
                            </li>
                          );
                        })}
                      </ul>
                    </SeeMore>
                  </div>
                </div>
              }
            />

            <div className="row ">
              <div className="col-sm-12 ">
                <DoctorDetails
                  payloadData={{
                    DoctorID: patientDetail?.currentPatient?.DoctorID,
                    Date: patientDetail?.currentPatient?.AppointmentDate,
                  }}
                  isDocChecked={isDocChecked}
                  prescription={prescription}
                  tags={tags}
                  setTags={setTags}
                  items={items}
                />
              </div>
            </div>
            {modalHandlerState?.show && (
              <Modal
                visible={modalHandlerState?.show}
                setVisible={() =>
                  setModalHandlerState({
                    show: false,
                    component: null,
                    size: null,
                  })
                }
                modalWidth={modalHandlerState?.size}
                Header={modalHandlerState?.header}
                footer={modalHandlerState?.footer}
                style={{ maxHeight: "99% !important", backgroundColor: "red" }}
              >
                {modalHandlerState?.component}
              </Modal>

            )}
          </div>
        )}

        <UserInfoPedia
          pregnancyDetails={pregnancyDetails}
          tags={tags}
          setTags={setTags}
          items={items}
          setPregnancyDetails={setPregnancyDetails}
          patientDetail={patientDetail}
          type={type}
          getUpdateInAPI={getUpdateInAPI}
          handleCallButtonClick={handleCallButtonClick}
          handleFileClosed={handleFileClosed}
          handleFileOpen={handleFileOpen}
          handleEmailModalOpen={handleEmailModalOpen}
          handleSMSModalOpen={handleSMSModalOpen}
          reverseTableData={reverseTableData}
          forwardTableData={forwardTableData}
          getHoldAPID={getHoldAPID}
          getOutPatientAPI={getOutPatientAPI}
          handleSavePriscciptionForm={handleSavePriscciptionForm}
          setIsPrescriptionButton={setIsPrescriptionButton}
          isPrescriptionButton={isPrescriptionButton}
          handleSavePrescriptionDraft={handleSavePrescriptionDraft}
          setIsDesktop={setIsDesktop}
          isDesktop={isDesktop}
          handleClearForm={handleClearForm}
          SearchOPDBillsCallAPI={SearchOPDBillsCallAPI}
          TotaltableData={TotaltableData}
          selectedIndex={selectedIndex}
          apiData={apiData}
          handleGetDataForOLDAppointment={handleGetDataForOLDAppointment}
          getGetDoctor={getGetDoctor}
          docterError={docterError}
          getCall={getCall}
          loadSaveData={loadSaveData}
          prescription={prescription}
          toggleListening={toggleListening}
          isListening={isListening}
        />
      </div>

      {/* <ScrollComponent viewPort={"0.6"}> */}
      <div className="card">
        <div className="row">
          {/* Right Column: Other boxes */}

          <div
            className={`${isDesktop ? "col-md-4 preview-doctor-print-test" : "col-md-12"}`}
            id="second-compo"
          >
            {prescription.map((item, index) => {
              // IDs to exclude from rendering in the second-compo block
              const excludedIds = [
                1, 22, 20, 15, 11, 23, 26, 27, 28, 29, 30, 8, 36, 37, 38, 39,
                40, 41, 42, 14, 34, 35, 25, 24, 99, 44, 45, 46
              ];
              // Render top 3 items (ID === 1, 24, 25) in the first-compo-top block
              {
                /* ------------------------------------------------------------------------------------- */
              }
              if (!isDesktop && [1, 24, 25].includes(item.ID)) {
                if (item.ID === 1) {
                  return (
                    <div className="" key={`item-1-${index}`}>
                      <div className="">
                        <div className="App py-1 mx-1">
                          <div
                            className="tag-input-container"
                            style={{
                              position: "static",
                              maxHeight: "200px",
                              overflow: "scroll",
                            }}
                          >
                            <label className="col-sm-2 col-10 background-theme-color theme-color">
                              {t(item?.DisplayName)}
                            </label>
                            <div className="px-1 d-flex">
                              <div className="px-1">
                                <Favorite
                                  data={items[item?.AccordianName]}
                                  name={item?.AccordianName}
                                  handleChange={handleFavoriteSelectChange}
                                  refresh={setIsDeleteTemplate}
                                />
                              </div>
                              <div
                                className="px-1"
                                onClick={() =>
                                  handlePackageDetails(item, "90vw")
                                }
                              >
                                <i className="pi pi-pen-to-square"></i>
                              </div>
                            </div>

                            <div className="col-12">
                              <PrescribedMedicineTable
                                isDesktop={false}
                                isShowFirst={true}
                                tags={tags}
                                setTags={setTags}
                                type={"FromPage"}
                                presTable={presTable}
                                setPresTable={setPresTable}
                                apiData={doctorTopSuggestions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (item.ID === 24) {
                  return (
                    <div className="row" key={`item-24-${index}`}>
                      <div className="col-sm-12">
                        <div className="App py-1 mx-1">
                          <div
                            className="tag-input-container"
                            style={{
                              position: "static",
                              maxHeight: "200px",
                              overflow: "scroll",
                            }}
                          >
                            <div className="col-12">
                              <PreviousPregnancyTable
                                loadSaveData={loadSaveData}
                                setPreviousPregnancyData={
                                  setPreviousPregnancyData
                                }
                                patientDetail={patientDetail}
                                disabled={isInputDisabled(item.Gender)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (item.ID === 25) {
                  return (
                    <div className="row" key={`item-25-${index}`}>
                      <div className="col-12">
                        <div className="App py-1 mx-1">
                          <div
                            className="tag-input-container"
                            style={{
                              position: "static",
                              maxHeight: "200px",
                              overflow: "scroll",
                            }}
                          >
                            <div className="px-1 d-flex col-12">
                              <div className="col-12">
                                <FamilyHistoryTable
                                  loadSaveData={loadSaveData}
                                  setFamilyHistoryData={setFamilyHistoryData}
                                  patientDetail={patientDetail}
                                  disabled={isInputDisabled(item.Gender)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              }

              {
                /* ---------------------------------------------------------------------------------------------- */
              }

              // Render items that are not excluded
              {
                if (!excludedIds.includes(item.ID)) {
                  return (
                    <div className="">
                      {console.log(filteredItems[item?.AccordianName], items[item?.AccordianName], " item?.AccordianName")}
                      <div
                        className={`tag-input-container ${item?.AccordianName === "Investigation(Lab & Radio)" ? "investigation-section" : ""}`}
                        style={{ position: "relative" }}
                        key={index}
                        id="tag-font"
                      >
                        <label className="col-sm-4 background-theme-color theme-color">
                          {item?.DisplayName}
                        </label>

                        {![
                          20, 22, 8, 36, 37, 38, 39, 40, 41, 42, 23, 26, 27, 28,
                          29, 30, 15, 14, 34, 35, 31, 32, 33, 43
                        ].includes(item.ID) && (
                            <div className="px-1 d-flex">
                              <Favorite
                                data={items[item?.AccordianName]}
                                name={item?.AccordianName}
                                handleChange={handleFavoriteSelectChange}
                                refresh={setIsDeleteTemplate}
                                handleGetInvestigationTemplate={
                                  handleGetInvestigationTemplate
                                }
                                Id={item?.ID}
                                favTempData={favTempData}
                                patientDetails={handlePackageDetails}
                                labCategoryIds={labCategoryIds}
                              />

                              {![
                                1, 8, 36, 37, 38, 39, 40, 41, 42, 9, 24, 25, 14,
                                15, 17, 20, 23, 26, 27, 28, 29, 30, 31, 32, 33,
                                34, 35, 43
                              ].includes(item.ID) && (
                                  <div
                                    className="px-1"
                                    onClick={() =>
                                      handlePackageDetails(item, "50vw")
                                    }
                                  >
                                    <i className="pi pi-pen-to-square"></i>
                                  </div>
                                )}
                            </div>
                          )}

                        {!isDesktop &&
                          tags[item?.AccordianName]?.map((tag, index) => (
                            <div
                              key={index}
                              className="tag"
                              style={{
                                backgroundColor: tag?.ID
                                  ? "#FEFAE0"
                                  : "#F5EDED",
                              }}
                            >
                              {tag?.ValueField || tag?.TypeName}
                              <span
                                className="tag-close-icon"
                                onClick={() =>
                                  removeTag(
                                    item?.AccordianName,
                                    index,
                                    tag?.ID,
                                    tag?.isDefaultTemplate ? tag : ""
                                  )
                                }
                              >
                                <i
                                  className="fa fa-times-circle"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              {/* )} */}
                            </div>
                          ))}

                        {handleCheckDateAndAutocomplete(item, tags)}
                      </div>
                    </div>
                  );
                }
              }

              // Render desktop-specific items
              if (
                isDesktop &&
                [
                  20, 15, 22, 8, 36, 37, 38, 39, 41, 42, 23, 26, 27, 28, 29, 30,
                  40, 14, 34, 35, 99, 44, 45, 46
                ].includes(item.ID)
              ) {
                return (
                  <div
                    key={index}
                    className="tag-input-container"
                    style={{ position: "relative", display: "block" }}
                    id="tag-font"
                  >
                    <p className="col-sm-12 background-theme-color theme-color font-weight-bold">
                      {item?.DisplayName}
                    </p>

                    {![
                      20, 22, 8, 36, 37, 38, 39, 41, 42, 23, 26, 27, 28, 29, 30,
                      40, 15, 14, 34, 35, 99, 44, 45, 46
                    ].includes(item.ID) && (
                        <div className="px-1 d-flex">
                          <Favorite
                            data={items[item?.AccordianName]}
                            name={item?.AccordianName}
                            handleChange={handleFavoriteSelectChange}
                          />

                          <div
                            className="px-1"
                            onClick={() => handlePackageDetails(item, "50vw")}
                          >
                            <i className="pi pi-pen-to-square"></i>
                          </div>
                        </div>
                      )}

                    {tags[item?.AccordianName]?.map((tag, index) => (
                      <div
                        key={index}
                        className="tag"
                        style={{
                          backgroundColor: tag?.ID ? "#FEFAE0" : "#F5EDED",
                        }}
                      >
                        {tag?.ValueField || tag?.TypeName}
                        <span
                          className="tag-close-icon"
                          onClick={() =>
                            removeTag(item?.AccordianName, index, tag?.ID)
                          }
                        >
                          <i
                            className="fa fa-times-circle"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                    ))}

                    {handleCheckDateAndAutocomplete(item, tags)}
                  </div>
                );
              }

              // Render non-desktop-specific items
              if (
                !isDesktop &&
                [
                  20, 15, 22, 8, 36, 37, 38, 39, 41, 40, 42, 34, 35, 23, 26, 27,
                  28, 29, 30, 31, 32, 33, 14, 43
                ].includes(item.ID)
              ) {
                if (!isPregnancy && (item.ID === 34 || item.ID === 35)) {
                  return null; // Skip rendering for these items when isPregnancy is false
                }
                return (
                  <div key={index} className={getClassName(item?.ID)}>
                    <div
                      className="tag-input-container "
                      style={{ position: "relative", display: "block" }}
                    >
                      <p className="col-sm-12 background-theme-color theme-color font-weight-bold">
                        {item?.DisplayName}
                      </p>

                      {Number(item?.ID) !== 20 &&
                        Number(item?.ID) !== 22 &&
                        Number(item?.ID) !== 23 &&
                        Number(item?.ID) !== 26 &&
                        Number(item?.ID) !== 27 &&
                        Number(item?.ID) !== 28 &&
                        Number(item?.ID) !== 29 &&
                        Number(item?.ID) !== 30 &&
                        Number(item?.ID) !== 8 &&
                        Number(item?.ID) !== 34 &&
                        Number(item?.ID) !== 35 &&
                        Number(item?.ID) !== 36 &&
                        Number(item?.ID) !== 37 &&
                        Number(item?.ID) !== 38 &&
                        Number(item?.ID) !== 39 &&
                        Number(item?.ID) !== 40 &&
                        Number(item?.ID) !== 41 &&
                        Number(item?.ID) !== 42 &&
                        Number(item?.ID) !== 15 &&
                        Number(item?.ID) !== 14 && (
                          <div className="px-1 d-flex">
                            <Favorite
                              data={items[item?.AccordianName]}
                              name={item?.AccordianName}
                              handleChange={handleFavoriteSelectChange}
                            />
                            <div
                              className="px-1"
                              onClick={() => handlePackageDetails(item, "50vw")}
                            >
                              <i className="pi pi-pen-to-square"></i>
                            </div>
                          </div>
                        )}
                      {tags[item?.AccordianName]?.map((tag, index) => (
                        <div
                          key={index}
                          className="tag"
                          style={{
                            backgroundColor: tag?.ID ? "#FEFAE0" : "#F5EDED",
                          }}
                        >
                          {tag?.ValueField || tag?.TypeName}
                          <span
                            className="tag-close-icon"
                            onClick={() =>
                              removeTag(item?.AccordianName, index, tag?.ID)
                            }
                          >
                            <i
                              className="fa fa-times-circle"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      ))}

                      {handleCheckDateAndAutocomplete(item, tags)}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {isDesktop && (
            <div
              className="col-8 preview-doctor-print-test"
              id="mynk-component"
            >
              <div className="border ">
                {/* <div>
                  <div className="text-center position-relative">
                    <div
                      className="position-absolute  "
                      style={{ top: "50%", transform: "translate(0%, -50%)" }}
                    >
                      <img src={logoitdose} alt="" width={"137px"} />
                    </div>

                    <h1 className="itInfoHeading">
                      ITDOSE INFOSYSTEMS PVT. LTD.
                    </h1>

                    <p className="m-0 p-0">
                      <strong>Unit of Cuttack Hospitals Pvt. Ltd.</strong>
                    </p>
                    <p>Plot No-3(P), Sector-1, CDA, Bidanasi, Cuttack</p>
                    <p>Mob. No: +91 9238008811</p>
                  </div>
                </div> */}

                <div className="border-bottom border-top p-3" id="tag-font">
                  <div className="row" id="tag-font">
                    <div className="col-3" >
                      <strong>UHID :</strong> {patientAllDetail?.PatientID}
                    </div>
                    <div className="col-3">
                      <strong>Patient Name :</strong> {patientAllDetail?.PName}
                    </div>
                    <div className="col-3">
                      <strong>Age/Sex :</strong> {patientAllDetail?.Age_Gender}
                      {/* /{" "} */}
                      {/* {patientAllDetail?.Gender} */}
                    </div>
                    <div className="col-3">
                      <strong>Ph No :</strong> {patientAllDetail?.Mobile}
                    </div>
                    <div className="col-3">
                      <strong>Address :</strong> {patientAllDetail?.City} ,{" "}
                      {patientAllDetail?.Country}
                    </div>
                    <div className="col-3">
                      <strong>Panel :</strong>{" "}
                      {patientDetail?.currentPatient?.PanelName}
                    </div>
                    {/* <div className="col-3">
                      <strong>Bill No :</strong>
                    </div> */}
                    <div className="col-3">
                      <strong>Doctor :</strong>
                      {patientDetail?.currentPatient?.DName}
                    </div>
                    {/* <div className="col-3">
                      <strong>Department :</strong>
                    </div> */}
                    <div className="col-3">
                      <strong>Visit Date/Time:</strong>{" "}
                      {loadSaveData?.visitDateTime}
                    </div>
                  </div>
                </div>
                <div>
                  {console.log(patientDetail, "patientDetail?.currentPatient")}
                  <div className="row">
                    <div className="col-md-4 border-right">
                      <div className=" p-3 " id="tag-font">
                        <strong>Vital Signs :</strong>
                        <ul>
                          <li>
                            <strong>Weight :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.WT}{" "}
                            Kg
                          </li>
                          <li>
                            <strong>Temperature :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.T}{" "}
                            °F
                          </li>
                          <li>
                            <strong>Pulse :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.P}{" "}
                            BPM
                          </li>
                          <li>
                            <strong>BP :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.BP}{" "}
                            mm/Hg
                          </li>
                          <li>
                            <strong>Resp :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.R}{" "}
                            p-m
                          </li>
                          <li>
                            <strong>SPO2 :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.SPO2}
                          </li>
                          <li>
                            <strong>Height :</strong>{" "}
                            {getBindVitalData?.length > 0 &&
                              getBindVitalData[0]?.AdjustedHT}{" "}
                            CM
                          </li>
                        </ul>

                        {/* {prescription
                          ?.filter(
                            (val) =>
                              (val.ID !== 22 &&
                                val.ID !== 1 &&
                                val.ID !== 24 &&
                                val.ID !== 25 &&
                                val.ID !== 20 &&
                                val.ID !== 15 &&
                                val.ID !== 11 &&
                                val.ID !== 8 &&
                                val.ID == 31 &&
                                val.ID == 32 &&
                                val.ID == 33 &&
                                val.ID !== 34 &&
                                val.ID !== 35 &&
                                val.ID == 2) ||
                              (val.ID == 3 && val.ID !== 14)
                          ) */}
                        {prescription
                          ?.filter((val) => val.ID === 2 || val.ID === 3)
                          ?.map((item, index) => (
                            <>
                              {/* {console.log(
                                "tags[item?.AccordianName]",
                                tags[item?.AccordianName]
                              )} */}
                              {tags[item?.AccordianName]?.length > 0 && (
                                <div className="">
                                  <div className="p-1" id="tag-font">
                                    <strong>{item?.DisplayName}:</strong>
                                    {tags[item?.AccordianName]?.map(
                                      (tag, index) => (
                                        <span
                                          className="tag d-flex flex-column align-items-start pl-2"
                                          id="tag-font"
                                          style={{
                                            backgroundColor: tag?.ID
                                              ? "#FEFAE0"
                                              : "#F5EDED",
                                          }}
                                        >
                                          <span

                                            key={index}
                                            style={{ fontWeight: "bold" }}
                                          >
                                            {tag?.ValueField || tag?.TypeName}

                                            <span
                                              className="tag-close-icon"
                                              onClick={() =>
                                                removeTag(
                                                  item?.AccordianName,
                                                  index,
                                                  tag?.ID,
                                                  tag?.isDefaultTemplate
                                                    ? tag
                                                    : ""
                                                )
                                              }
                                            >
                                              <i
                                                className="fa fa-times-circle"
                                                aria-hidden="true"
                                              ></i>
                                            </span>
                                          </span>
                                          {item?.AccordianName ===
                                            "Investigation(Lab & Radio)" &&
                                            tag?.remarks?.trim() && (
                                              <span>
                                                Remarks: {tag.remarks}
                                              </span>
                                            )}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          ))}
                      </div>
                    </div>
                    <div className="col-md-8">
                      {/* {console.log("prescription ffdsfs", prisciptionForm)}
                      {console.log("this is my tags", tags)} */}
                      {/* {prescription
                        ?.filter(
                          (val) =>
                            val.ID !== 22 &&
                            val.ID !== 1 &&
                            val.ID !== 24 &&
                            val.ID !== 25 &&
                            val.ID !== 20 &&
                            val.ID !== 15 &&
                            val.ID !== 11 &&
                            val.ID !== 8 &&
                            val.ID !== 31 &&
                            val.ID !== 32 &&
                            val.ID !== 33 &&
                            val.ID !== 34 &&
                            val.ID !== 35 &&
                            val.ID !== 2 &&
                            val.ID !== 3 &&
                            val.ID !== 14
                        )
                        ?.map((item, index) => (
                          <>
                            {tags[item?.AccordianName]?.length > 0 && (
                              <div className="" key={index}>
                                <div className="p-1">
                                  <strong>{item?.DisplayName}:</strong>
                                  {tags[item?.AccordianName]?.map(
                                    (tag, index) => (
                                      <>
                                        <span
                                          key={index}
                                          className="tag"
                                          style={{
                                            backgroundColor: tag?.ID
                                              ? "#FEFAE0"
                                              : "#F5EDED",
                                            display: "inline-table",
                                          }}
                                        >
                                          {tag?.ValueField || tag?.TypeName}
                                          <span
                                            className="tag-close-icon"
                                            onClick={() =>
                                              removeTag(
                                                item?.AccordianName,
                                                index,
                                                tag?.ID
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-times-circle"
                                              aria-hidden="true"
                                            ></i>
                                          </span>
                                        </span>
                                      </>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ))}

                      {Object?.keys(prisciptionForm)
                        .filter((item) => !SExamination.includes(item))
                        ?.map(
                          (item, index) =>
                            item !== "NextVisit" &&
                            (prisciptionForm[item]?.length > 0 ||
                              prisciptionForm[item]?.label) && (
                              <div className="" key={index}>
                                <div className="p-1 ">
                                  <strong>{formatString(item)} :</strong>
                                  <span
                                    className="tag"
                                    style={{
                                      backgroundColor: "#F5EDED",
                                      display: "inline-table",
                                    }}
                                  >
                                    <span className="pl-1">
                                      {" "}
                                      {prisciptionForm[item]?.label
                                        ? prisciptionForm[item]?.label
                                        : prisciptionForm[item]}
                                    </span>
                                    <span
                                      className="tag-close-icon"
                                      onClick={() =>
                                        removeTagprisciptionForm(item)
                                      }
                                    >
                                      <i
                                        className="fa fa-times-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )
                        )} */}
                      {/* {[...prescription]
                        ?.filter(
                          (val) =>
                            ![22, 1, 24, 25, 20, 11, 2, 3].includes(val.ID)
                        )
                        ?.map((item, index) => {
                          const key = item?.AccordianName;

                          const hasPrescriptionForm =
                            prisciptionForm[key] &&
                            !SExamination.includes(key) &&
                            key !== "NextVisit" &&
                            (prisciptionForm[key]?.length > 0 ||
                              prisciptionForm[key]?.label ||
                              prisciptionForm["admissionRequired"] ||
                              prisciptionForm["NutritionAdvise"]);

                          const hasTrKey =
                            prisciptionForm["DoctorType"]?.length > 0 ||
                            prisciptionForm["department"]?.length > 0 ||
                            prisciptionForm["referTo"]?.length > 0 ||
                            prisciptionForm["consultType"]?.length > 0 ||
                            prisciptionForm["referralType"]?.length > 0 ||
                            prisciptionForm["ImpressionDiagnosis"]?.length >
                            0 ||
                            prisciptionForm["Remarks"]?.length > 0;

                          console.log(hasTrKey, "hasTryKey");
                          const hasTags = tags[key]?.length > 0;

                          const hasSystematicExamination =
                            SExamination.includes(key) && prisciptionForm[key];
                          console.log(key, "aaaakk11");

                          if (
                            !hasPrescriptionForm &&
                            !hasTags &&
                            !hasSystematicExamination &&
                            !hasTrKey
                          ) {
                            return null;
                          }

                          return (
                            <div key={index} className="p-1">

                              {hasPrescriptionForm &&
                                key !== "admissionRequired" &&
                                key !== "NutritionAdvise" && (
                                  <div>
                                    <strong>{formatString(key)} :</strong>
                                    <span
                                      className="tag"
                                      style={{
                                        backgroundColor: "#F5EDED",
                                        display: "inline-table",
                                      }}
                                    >
                                      <span className="pl-1">
                                        {prisciptionForm[key]?.label ||
                                          prisciptionForm[key]}
                                      </span>
                                      <span
                                        className="tag-close-icon"
                                        onClick={() =>
                                          removeTagprisciptionForm(key)
                                        }
                                      >
                                        <i
                                          className="fa fa-times-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  </div>
                                )}

                              {key === "admissionRequired" && (
                                <div>
                                  <strong>{formatString(key)} :</strong>
                                  <span
                                    className="tag"
                                    style={{
                                      backgroundColor: "#F5EDED",
                                      display: "inline-table",
                                    }}
                                  >
                                    <span className="pl-1">
                                      {prisciptionForm["admissionRequired"] ===
                                        true
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                    <span
                                      className="tag-close-icon"
                                      onClick={() =>
                                        removeTagprisciptionForm(key)
                                      }
                                    >
                                      <i
                                        className="fa fa-times-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </span>
                                </div>
                              )}
                              {key === "NutritionAdvise" &&
                                Object.keys(prisciptionForm)
                                  .filter(
                                    (ele) =>
                                      [
                                        "NutritionAdviseRemarks",
                                        "NutritionAdvise",
                                      ].includes(ele) && prisciptionForm[ele]
                                  )
                                  .map((element) => (
                                    <div key={element}>
                                      <strong>{formatString(element)} :</strong>
                                      <span
                                        className="tag"
                                        style={{
                                          backgroundColor: "#F5EDED",
                                          display: "inline-table",
                                        }}
                                      >
                                        <span className="pl-1">
                                          {prisciptionForm[element]}
                                        </span>
                                        <span
                                          className="tag-close-icon"
                                          onClick={() =>
                                            removeTagprisciptionForm(element)
                                          }
                                        >
                                          <i
                                            className="fa fa-times-circle"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </span>
                                    </div>
                                  ))}
                              {key === "TransferReferralForConsultation" &&
                                Object.keys(prisciptionForm)
                                  .filter(
                                    (ele) =>
                                      [
                                        "DoctorType",
                                        "department",
                                        "referTo",
                                        "referralType",
                                        "consultType",
                                        "ImpressionDiagnosis",
                                        "Remarks",
                                      ].includes(ele) &&
                                      prisciptionForm[ele] && 
                                      (typeof prisciptionForm[ele] ===
                                        "string" ||
                                        typeof prisciptionForm[ele] ===
                                        "number" ||
                                        (typeof prisciptionForm[ele] ===
                                          "object" &&
                                          prisciptionForm[ele].label)) 
                                  )
                                  .map((element, i) => {
                                    const value = prisciptionForm[element];

                                    const displayValue =
                                      typeof value === "object" && value.label
                                        ? value.label
                                        : value;

                                    return (
                                      <div key={element}>
                                        {i === 0 && (
                                          <strong>{formatString(key)} :</strong>
                                        )}
                                        <div className="d-flex p-1">
                                          <span
                                            className="tag"
                                            style={{
                                              backgroundColor: "#F5EDED",
                                              display: "inline-table",
                                            }}
                                          >
                                            <span className="pl-1">
                                              <strong>{element}:</strong>
                                              {displayValue}
                                            </span>
                                            <span
                                              className="tag-close-icon"
                                              onClick={() =>
                                                removeTagprisciptionForm(
                                                  element
                                                )
                                              }
                                            >
                                              <i
                                                className="fa fa-times-circle"
                                                aria-hidden="true"
                                              ></i>
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}

                              {hasTags && (
                                <div>
                                  {console.log(
                                    tags,
                                    key,
                                    "bdjbjbjdbajbdjabjbdajb"
                                  )}
                                  <strong>{item?.DisplayName}:</strong>
                                  {tags[key]?.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="tag"
                                      style={{
                                        backgroundColor: tag?.ID
                                          ? "#FEFAE0"
                                          : "#F5EDED",
                                        display: "inline-table",
                                      }}
                                    >
                                      {console.log("tagtagtag", tag, key)}
                                      {tag?.ValueField || tag?.TypeName}
                                      <span
                                        className="tag-close-icon"
                                        onClick={() =>
                                          removeTag(key, tagIndex, tag?.ID)
                                        }
                                      >
                                        <i
                                          className="fa fa-times-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })} */}
                      {[...prescription]
                        ?.filter(
                          (val) => ![1, 24, 25, 20, 11, 2, 3].includes(val.ID)
                        )
                        ?.map((item, index) => {
                          const key = item?.AccordianName;
                          const isTransferReferralKey =
                            key === "TransferReferralForConsultation";

                          const transferReferralElements = isTransferReferralKey
                            ? Object.keys(prisciptionForm).filter(
                              (ele) =>
                                [
                                  "referTo",
                                  "referralType",
                                  "consultType",
                                  "ImpressionDiagnosis",
                                  "Remarks",
                                ].includes(ele) &&
                                prisciptionForm[ele] &&
                                (typeof prisciptionForm[ele] === "string" ||
                                  typeof prisciptionForm[ele] === "number" ||
                                  (typeof prisciptionForm[ele] === "object" &&
                                    prisciptionForm[ele].label))
                            )
                            : [];

                          const hasPrescriptionForm =
                            prisciptionForm[key] &&
                            !SExamination.includes(key) &&
                            // key !== "NextVisit" &&
                            (prisciptionForm[key]?.length > 0 ||
                              prisciptionForm[key]?.label ||
                              prisciptionForm["admissionRequired"] ||
                              prisciptionForm["NutritionAdvise"]);

                          const hasTags = tags[key]?.length > 0;

                          const hasSystematicExamination =
                            SExamination.includes(key) && prisciptionForm[key];

                          if (
                            !hasPrescriptionForm &&
                            !hasTags &&
                            !hasSystematicExamination &&
                            transferReferralElements.length === 0
                          ) {
                            return null;
                          }

                          return (
                            <div key={index} className="p-1">
                              {console.log(key, "aaaakk11")}
                              {hasPrescriptionForm &&
                                key !== "admissionRequired" &&
                                key !== "NutritionAdvise" && (
                                  <div id="tag-font">
                                    <strong className="hover_effect">
                                      {formatString(key)} :
                                    </strong>
                                    <span
                                      className="tag hover_effect"
                                      id="tag-font"
                                      style={{
                                        backgroundColor: "#F5EDED",
                                        display: "inline-table",
                                      }}
                                    >
                                      <span className="pl-1"
                                        style={{ whiteSpace: "pre-line" }}
                                      >
                                        {prisciptionForm[key]?.label ||
                                          prisciptionForm[key]}
                                      </span>
                                      <span
                                        className="tag-close-icon"
                                        onClick={() =>
                                          removeTagprisciptionForm(key)
                                        }
                                      >
                                        <i
                                          className="fa fa-times-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  </div>
                                )}

                              {key === "admissionRequired" && (
                                <div>
                                  <strong className="hover_effect">
                                    {formatString(key)} :
                                  </strong>
                                  <span
                                    className="tag hover_effect"
                                    style={{
                                      backgroundColor: "#F5EDED",
                                      display: "inline-table",
                                    }}
                                  >
                                    <span className="pl-1">
                                      {prisciptionForm["admissionRequired"] ===
                                        true
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                    <span
                                      className="tag-close-icon"
                                      onClick={() =>
                                        removeTagprisciptionForm(key)
                                      }
                                    >
                                      <i
                                        className="fa fa-times-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </span>

                                  {prisciptionForm["AdmissionDate"] && (
                                    // <div style={{ marginTop: "8px" }}>
                                    //   <strong className="hover_effect">Admission Date :</strong>
                                    // </div>
                                    <span
                                      className="tag hover_effect"
                                      style={{
                                        backgroundColor: "#F5EDED",
                                        display: "inline-table",
                                      }}
                                    >
                                      <span className="pl-1">
                                        {prisciptionForm["AdmissionDate"]}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              )}

                              {key === "NutritionAdvise" &&
                                Object.keys(prisciptionForm)
                                  .filter(
                                    (ele) =>
                                      [
                                        "NutritionAdviseRemarks",
                                        "NutritionAdvise",
                                      ].includes(ele) && prisciptionForm[ele]
                                  )
                                  .map((element) => (
                                    <div key={element}>
                                      <strong>{formatString(element)} :</strong>
                                      <span
                                        className="tag hover_effect"
                                        style={{
                                          backgroundColor: "#F5EDED",
                                          display: "inline-table",
                                        }}
                                      >
                                        <span className="pl-1">
                                          {prisciptionForm[element]}
                                        </span>
                                        <span
                                          className="tag-close-icon"
                                          onClick={() =>
                                            removeTagprisciptionForm(element)
                                          }
                                        >
                                          <i
                                            className="fa fa-times-circle"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </span>
                                    </div>
                                  ))}

                              {key === "TransferReferralForConsultation" &&
                                transferReferralElements.map((element, i) => {
                                  const value = prisciptionForm[element];
                                  const displayValue =
                                    typeof value === "object" && value.label
                                      ? value.label
                                      : value;

                                  return (
                                    <div
                                      key={element}
                                      className="d-flex align-items-center"
                                    >
                                      {i === 0 && (
                                        <strong className="hover_effect">
                                          {formatString(key)} :
                                        </strong>
                                      )}
                                      <div className=" p-1">
                                        <span
                                          className="tag hover_effect"
                                          style={{
                                            backgroundColor: "#F5EDED",
                                            display: "inline-table",
                                          }}
                                        >
                                          <span className="pl-1">
                                            <strong className="hover_effect">
                                              {formatString(element)}:{" "}
                                            </strong>
                                            {displayValue}
                                          </span>
                                          <span
                                            className="tag-close-icon"
                                            onClick={() =>
                                              removeTagprisciptionForm(element)
                                            }
                                          >
                                            <i
                                              className="fa fa-times-circle"
                                              aria-hidden="true"
                                            ></i>
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}

                              {hasTags && (
                                <div id="tag-font">
                                  <strong>{item?.DisplayName}:</strong>
                                  {tags[key]?.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="tag hover_effect "
                                      id="tag-font"
                                      style={{
                                        backgroundColor: tag?.ID
                                          ? "#FEFAE0"
                                          : "#F5EDED",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        // padding: "4px",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",

                                      }}
                                    >
                                      <span
                                        onDoubleClick={(e) =>
                                          handleTagDoubleClick(e, key, tagIndex)
                                        }
                                        onBlur={(e) =>
                                          handleTagBlur(e, key, tagIndex)
                                        }
                                        onKeyDown={(e) =>
                                          handleTagKeyPress(e, key, tagIndex)
                                        }
                                        contentEditable={
                                          editTagIndex === `${key}-${tagIndex}`
                                        }
                                        suppressContentEditableWarning={true}
                                        style={{
                                          outline: "none",
                                          minWidth: "50px",
                                          display: "inline-block",
                                          padding: "2px 5px",
                                        }}
                                      >
                                        {tag?.ValueField || tag?.TypeName}
                                      </span>
                                      {/* {tag?.ValueField || tag?.TypeName} */}
                                      <span
                                        className="tag-close-icon"
                                        onClick={() =>
                                          removeTag(key, tagIndex, tag?.ID)
                                        }
                                      >
                                        <i
                                          className="fa fa-times-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                      <div className="systematic-examination pl-1" id="tag-font">
                        <strong>Systematic Examination:</strong>
                        <div className="d-flex flex-wrap">
                          {SExamination.map(
                            (item, index) =>
                              prisciptionForm[item] &&
                              (prisciptionForm[item]?.length > 0 ||
                                prisciptionForm[item]?.label) && (
                                <div key={index} className="p-1 hover_effect">
                                  <span>{formatString(item)} :</span>
                                  <span
                                    className="tag"
                                    id="tag-font"
                                    style={{
                                      backgroundColor: "#F5EDED",
                                      display: "inline-block",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <span className="pl-1">
                                      {prisciptionForm[item]?.label
                                        ? prisciptionForm[item]?.label
                                        : prisciptionForm[item]}
                                    </span>
                                    <span
                                      className="tag-close-icon"
                                      onClick={() =>
                                        removeTagprisciptionForm(item)
                                      }
                                    >
                                      <i
                                        className="fa fa-times-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </div>

                      {/* <div className="">
                        <div className="p-1 ">
                          <span className="tag" style={{ backgroundColor: "#F5EDED", display: "inline-table" }}>
                            <strong>Next Visit Date :</strong>
                            <>{moment(prisciptionForm["NextVisit"]).format("yyyy-MMM-DD")}</>
                            <span className="tag-close-icon"
                            onClick={() =>
                              removeTagprisciptionForm("NextVisit")
                            }
                            >
                              <i
                                className="fa fa-times-circle"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </span>
                        </div>
                      </div> */}

                      {/* {JSON.parse(JSON.stringify(prescription))
                        ?.sort((a, b) => a.ID - b.ID)
                        ?.filter((val) => val.ID === 1  || val.ID === 24)
                        .map((item, index) => (
                          <div className="row" key={index}>
                            <div className="col-sm-12">
                              <div className="App py-1 mx-1">
                                <strong className="p ">Rx :</strong>
                                <div className="col-12">
                                  
                                  <PrescribedMedicineTable
                                    isShowFirst={true}
                                    tags={tags}
                                    setTags={setTags}
                                    type={"FromPage"}
                                    presTable={presTable}
                                    setPresTable={setPresTable}
                                  />
                                 
                                </div>
                                
                                <div className="col-12">
                                <PreviousPregnancyTable
                                loadSaveData={loadSaveData}
                                setPreviousPregnancyData={setPreviousPregnancyData}
                                patientDetail={patientDetail}
                                />
                                 
                                </div>
                              </div>
                            </div>
                          </div>
                        ))} */}
                      {JSON.parse(JSON.stringify(prescription))
                        ?.filter(
                          (val) =>
                            val.ID === 1 || val.ID === 24 || val.ID === 25
                        )
                        .map((item, index) => (
                          <div className="row" key={index}>
                            <div className="col-sm-12">
                              <div className="App py-1 mx-1">
                                {item.ID === 1 && (
                                  <strong className="p">Rx :</strong>
                                )}
                                <div className="col-12">
                                  {/* Show PrescribedMedicineTable only if val.ID is 1 */}
                                  {item.ID === 1 && (
                                    // <PrescribedMedicineTable
                                    //   isShowFirst={true}
                                    //   tags={tags}
                                    //   setTags={setTags}
                                    //   type={"FromPage"}
                                    //   presTable={presTable}
                                    //   setPresTable={setPresTable}
                                    // />
                                    <div
                                      className="tag-input-container"
                                      style={{
                                        position: "static",
                                        maxHeight: "200px",
                                        overflow: "scroll",
                                      }}
                                    >
                                      <label className="col-sm-4 col-10 background-theme-color theme-color">
                                        {t(item?.DisplayName)}
                                      </label>
                                      <div className="px-1 d-flex">
                                        <div className="px-1">
                                          <Favorite
                                            data={items[item?.AccordianName]}
                                            name={item?.AccordianName}
                                            handleChange={
                                              handleFavoriteSelectChange
                                            }
                                          />
                                        </div>
                                        <div
                                          className="px-1"
                                          onClick={() =>
                                            handlePackageDetails(item, "90vw")
                                          }
                                        >
                                          <i className="pi pi-pen-to-square"></i>
                                        </div>
                                      </div>

                                      <div className="col-12 p-0">
                                        <PrescribedMedicineTable
                                          isDesktop={false}
                                          isShowFirst={true}
                                          tags={tags}
                                          setTags={setTags}
                                          type={"FromPage"}
                                          presTable={presTable}
                                          setPresTable={setPresTable}
                                          apiData={doctorTopSuggestions}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Show PreviousPregnancyTable only if val.ID is 24 */}
                                  {item.ID === 24 && (
                                    <PreviousPregnancyTable
                                      loadSaveData={loadSaveData}
                                      setPreviousPregnancyData={
                                        setPreviousPregnancyData
                                      }
                                      patientDetail={patientDetail}
                                      disabled={isInputDisabled(item.Gender)}
                                    />
                                  )}
                                  {item.ID === 25 && (
                                    <FamilyHistoryTable
                                      loadSaveData={loadSaveData}
                                      setFamilyHistoryData={
                                        setFamilyHistoryData
                                      }
                                      patientDetail={patientDetail}
                                      disabled={isInputDisabled(item.Gender)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className=" border-top">
                  <div className=" p-3 ">
                    <div
                      style={{
                        height: "40px",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textAlign: "right",
                      }}
                    >
                      Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Left Column: Boxes with ID 20, 15, and 10 */}
        </div>
      </div>

      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>

      {/* </ScrollComponent> */}
      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={modalData.Header}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          handleAPI={
            modalData.prescription.AccordianName === "Prescribed Medicine"
              ? handleSaveMedicine
              : handleSaveTemplate
          }
          setVisible={() => {
            setModalData((val) => ({ visible: false }));
            setSaveTemplate({
              templateName: "",
              valueField: "",
            });
            setTags1({
              ...AUTOCOMPLETE_STATE,
              NextVisit: [],
              TransferReferral: [],
            });
          }}
        >
          <TemplateSearchModal
            prescription={modalData.prescription}
            saveTemplate={saveTemplate}
            saveTemplateHandleChange={saveTemplateHandleChange}
            tags={tags}
            setTags={setTags}
            tags1={tags1}
            setTags1={setTags1}
          />
        </Modal>
      )}

      {openPageModal.isShow && (
        <OverLay
          visible={openPageModal.isShow}
          Header={
            <>
              <div className="d-flex" style={{ gap: "10px" }}>
                <p className="m-0">{openPageModal.Header}</p>
                <div className="" style={{ width: "150px" }}>
                  <ReactSelect
                    dynamicOptions={apiData.getCPEOMenuList
                      ?.filter((val) => val.menuName !== "Prescription Advice")
                      ?.map((ele) => {
                        return {
                          value: ele.id,
                          label: ele.menuName,
                        };
                      })}
                    name={"PageList"}
                    value={selectedOption}
                    handleChange={handleSelectChange}
                    placeholderName={"Select Form"}
                    id={"Select"}
                  // value={pageList}
                  />
                </div>
              </div>
            </>
          }
          modalWidth={"90vw"}
          setVisible={() => setOpenPageModal(false)}
          handleAPI={handleClickDataSet}
        >
          {openPageModal.component}
        </OverLay>
      )}

      {emailModal.isShow && (
        <Modal
          visible={emailModal.isShow}
          Header={"Send report Via Email"}
          modalWidth={"50vw"}
          setVisible={() => setEmailModal(false)}
          handleAPI={handleClickSentEmail}
        >
          {/* {emailModal.component} */}
          <SendEmailDoctor
            emailHandleChange={emailHandleChange}
            emailSend={emailSend}
            setEmailSend={setEmailSend}
            error={emailError}
          />
        </Modal>
      )}

      {nameTemplateModalData.visible && (
        <Modal
          visible={nameTemplateModalData.visible}
          Header={nameTemplateModalData.Header}
          modalWidth={nameTemplateModalData?.size}
          setVisible={setIsOpen}
          handleAPI={nameTemplateModalData.handleInsertApi}
          children={nameTemplateModalData.component}
          modalData={modalData}
          setModalData={setModalData}
        />
      )}

      {smsModal.isShow && (
        <Modal
          visible={smsModal.isShow}
          Header={"Send report Via Mobile"}
          modalWidth={"20vw"}
          setVisible={() => setSmsModal(false)}
          handleAPI={handleClickSentSMS}
        >
          <SendSMSDoctor
            phoneNumber={patientDetail?.currentPatient}
            sms={sms}
            setSms={setSms}
            handleChangeSMS={handleChangeSMS}
            error={error1}
          />
        </Modal>
      )}

      {settingModal.isShow && (
        <OverLay
          visible={settingModal.isShow}
          Header={
            <div className="d-flex" style={{ gap: "10px" }}>
              {settingModal.header}
            </div>
          }
          modalWidth={settingModal?.size}
          setVisible={(prev) => setSettingModal({ ...prev, isShow: false })}
        // handleAPI={handleClickSentSMS}
        >
          {settingModal.component
            ? settingModal.component
            : "No Component Found"}
        </OverLay>
      )}
    </div>
  );
};

export default AppointmentPatientDetail;
