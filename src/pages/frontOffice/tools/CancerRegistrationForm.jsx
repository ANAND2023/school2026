import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import DatePicker from '../../../components/formComponent/DatePicker'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { Tabfunctionality } from '../../../utils/helpers'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import { Checkbox } from 'primereact/checkbox'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { CentreWiseCacheByCenterID, GetBindAllDoctorConfirmation } from '../../../store/reducers/common/CommonExportFunction'
import { centreWiseCacheDisplayApi } from '../../../networkServices/registrationApi'
import { CancerPatientMorphologyPrimary, CancerPatientMorphologySecondry, CancerPatientSave, CancerPatientSearchPatient, CancerPatientTumorprimary, CancerPatientTumorsecondary } from '../../../networkServices/opdserviceAPI'
import { notify } from '../../../utils/ustil2'
import moment from 'moment'
import Tables from '../../../components/UI/customTable'
import { MOBILE_NUMBER_VALIDATION_REGX } from '../../../utils/constant'
import { filterByType } from '../../../utils/utils'

const CancerRegistrationForm = () => {

    const { VITE_DATE_FORMAT } = import.meta.env;
    const { CentreWiseCache } = useSelector(
        (state) => state.CommonSlice
    );

    const initialValues = {
        patientID: "",
        UHID: "",
        patientName: "",
        age: "",
        gender: "",
        fatherName: "",
        motherName: "",
        husbandName: "",
        sonsName: "",
        wifeName: "",
        daughtersName: "",
        registrationDate: "",
        caseRegisteredAs: { value: "Out-Patient(OP)", label: "Out-Patient(OP)" },
        departmentName: "",
        physicianName: "",
        mobileNo: "",
        dateOfFirstDiagnosis: "",
        houseNo: "",
        streetName: "",
        locality: "",
        city: "",
        state: "",
        district: "",
        pinCode: "",
        durationOfStay: 0,
        telephone: "",
        gramPanchayat: "",
        tehsil: "",
        localAddress: "",
        noSpecificHabit: { value: "No", label: "No" },
        tubercolosis: { value: "No", label: "No" },
        cigaratteSmoking: { value: "No", label: "No" },
        hyperTension: { value: "No", label: "No" },
        beedisSmoking: { value: "No", label: "No" },
        diabetes: { value: "No", label: "No" },
        tobaccoChewing: { value: "No", label: "No" },
        ischaemicHeartDisease: { value: "No", label: "No" },
        alcoholConsumptionChewing: { value: "No", label: "No" },
        bronchialAstma: { value: "No", label: "No" },
        useOfMisheri: { value: "No", label: "No" },
        allergicConditions: { value: "No", label: "No" },
        panMasalaChewing: { value: "No", label: "No" },
        useOfSnaff: { value: "No", label: "No" },
        HepatitisHBSAg: { value: "No", label: "No" },
        betalNutChewing: { value: "No", label: "No" },
        specify: "",
        others: { value: "No", label: "No" },
        gutukaChewing: { value: "No", label: "No" },
        AIDSHIV: { value: "No", label: "No" },
        histopathology: false,
        bloodSmear: false,
        cytologySmear: false,
        FNACSmear: false,
        MicroscopicSlideOther: false,
        pathology: "",
        microscopicDate: "",
        anatomicalSite: "",
        tumourTopograph: "",
        morphologicalDiagnosis: "",
        topographyICD: "",
        Morphology: "",
        secondarySiteOfTumour: "",
        morphologyOfMetastases: "",
        site: "",
        laterality: "",
        clinicalExtent: "",
        stagingSystem: "",
        tnm: "",
        compositeStage: "",
        cancerDirectedTreatment: "",
        treatmentGiven: "",
        commencementOfTreatment: "",
        completionOfInitialCancer: "",
        dateOfDeath: "",
        dateOfReport: "",
        personCompletingForm: "",
        Date: new Date(),
        Remarks: "",
    }

    const [values, setValues] = React.useState(initialValues)
    const [relation, setRelation] = useState({
        "RelationOf": "",
        "RelationName": "",
        "RelationPhone": "",
    });
    const [relationData, setRelationData] = useState([]);

    const handleChangRelation = (name, selectedOption) => {
        if (selectedOption) {
            setRelation({ ...relation, RelationOf: selectedOption.value });
        } else {
            setRelation({ ...relation, RelationOf: "" });
        }
    };

    const handleAddRelation = () => {
        if (relation.RelationOf && relation.RelationName) {
            const updatedList = [...relationData, { ...relation }]
            setRelationData(updatedList);
            setRelation({ Relation: "", RelationName: "", RelationPhone: "" });
        }
    };

    const handleDeleteRelation = (index) => {
        const updatedRelations = relationData.filter((_, i) => i !== index);
        setRelationData(updatedRelations);
    };

    const yesNoOptions = [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
        { value: "Unknown", label: "Unknown" }
    ];
    const dependencyMap = {
        // Country: ["State", "District", "City"],
        State: ["District", "City"],
        District: ["City"],
    };

    const [dropdown, setDropDown] = useState({
        state: [],
        district: [],
        city: [],
        cancerPatientTumorprimary: [],
        cancerPatientTumorsecondary: [],
        cancerPatientMorphologyPrimary: [],
        cancerPatientMorphologySecondry: []
    })



    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReactSelectoptionDep = (name, selectedOption) => {
        setValues((prev) => {
            let updated = { ...prev, [name]: selectedOption };

            if (dependencyMap[name]) {
                dependencyMap[name].forEach((field) => {
                    updated[field] = null;
                });
            }

            return updated;
        });
    };

    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };

    const handleReactSelectOption = (name, e) => {
        setValues({
            ...values,
            [name]: e
        })
    }
    const { GetBindAllDoctorConfirmationData } = useSelector(
        (state) => state.CommonSlice
    );

    const fetchState = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                setDropDown((prev) => ({
                    ...prev,
                    state: res.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchDistrict = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                setDropDown((prev) => ({
                    ...prev,
                    district: res.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const formatData = (data = []) => {


        const res = data?.map((item) => ({
            label: item.description,
            value: item.description,
        }))
        return res;
    };

    //     let data = await dispatch(CentreWiseCacheByCenterID({}));
    //     if (data?.payload?.success) {
    //       // debugger
    //       let countryCode = filterByTypes(
    //         data?.payload?.data,
    //         [7, BindResource?.BaseCurrencyID],
    //         ["TypeID", "ValueField"],
    //         "TextField",
    //         "ValueField",
    //         "STD_CODE"
    //       );


    //     }
    //   };

    const fetchAllDropdowns = async () => {
        try {
            const [
                tumorPrimary,
                tumorSecondary,
                morphologyPrimary,
                morphologySecondary,
            ] = await Promise.all([
                CancerPatientTumorprimary(),
                CancerPatientTumorsecondary(),
                CancerPatientMorphologyPrimary(),
                CancerPatientMorphologySecondry(),


            ]);

            setDropDown((prev) => ({
                ...prev,
                cancerPatientTumorprimary: formatData(tumorPrimary?.data) || [],
                cancerPatientTumorsecondary: formatData(tumorSecondary?.data) || [],
                cancerPatientMorphologyPrimary: formatData(morphologyPrimary?.data) || [],
                cancerPatientMorphologySecondry: formatData(morphologySecondary?.data) || [],
            }));
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    console.log(values, "values");

    // const getPatient = async () => {
    //     if (!values?.patientID) return notify("Please Search Patient", "warn");

    //     try {
    //         const response = await CancerPatientSearchPatient(values?.patientID);
    //         if (response?.success) {
    //             notify(response?.message || "Patient Found", "success");

    //             const d = response?.data;

    //             const yesNoField = (val) =>
    //                 val
    //                     ? { label: val, value: val }
    //                     : { label: "No", value: "No" };

    //             setValues((prev) => ({
    //                 ...prev,

    //                 UHID: d?.PatientID || d?.Patient_ID || "",
    //                 title: d?.Title || "",
    //                 patientName: d?.Name || "",
    //                 age: d?.Age || "",
    //                 gender: d?.Gender || "",
    //                 fatherName: d?.FatherName || "",
    //                 motherName: d?.MotherName || "",
    //                 husbandName: d?.HusbandName || "",
    //                 sonsName: d?.SonName || "",
    //                 daughtersName: d?.DaughterName || "",
    //                 wifeName: d?.WifeName || "",
    //                 houseNo: d?.HouseNo || "",
    //                 streetName: d?.StreetName || d?.Street || "",
    //                 locality: d?.Locality || "",
    //                 city: d?.city || "",
    //                 pinCode: d?.PinCode || "",
    //                 gramPanchayat: d?.GramPanchayat || "",
    //                 tehsil: d?.SubUnitDistrict || d?.Taluka || "",
    //                 district: d?.DistrictId || d?.districtID || d?.District || "",
    //                 state: d?.StateID || d?.stateId || d?.State || "",
    //                 durationOfStay: d?.StayPeriod || "",
    //                 telephone: d?.Telephone || "",
    //                 mobileNo: d?.MobileNo || d?.Mobile || "",
    //                 localAddress: d?.LocalAddress || "",
    //                 registrationDate: d?.DateEnrolled === "0001-01-01" ? "" : d?.DateEnrolled || "",
    //                 dateOfFirstDiagnosis: d?.Date_of_First_Diagnosis === "0001-01-01" ? "" : d?.Date_of_First_Diagnosis || "",
    //                 physicianName: d?.Name_of_physicianId || d?.Name_of_physician || "",
    //                 departmentName: d?.Name_of_department || "",
    //                 caseRegisteredAs: {
    //                     value: d?.Case_Registered_As || "Out-Patient(OP)",
    //                     label: d?.Case_Registered_As || "Out-Patient(OP)",
    //                 },


    //                 noSpecificHabit: yesNoField(d?.No_Specific_Habit),
    //                 tubercolosis: yesNoField(d?.Tuber_Culosis),
    //                 cigaratteSmoking: yesNoField(d?.Cigaratte_Smoking),
    //                 hyperTension: yesNoField(d?.Hypertension),
    //                 beedisSmoking: yesNoField(d?.Beedi_Smoking),
    //                 diabetes: yesNoField(d?.Diabetes),
    //                 tobaccoChewing: yesNoField(d?.Tobocco_Chewing),
    //                 ischaemicHeartDisease: yesNoField(d?.Ischaemic_Heart_Disease),
    //                 alcoholConsumptionChewing: yesNoField(d?.Alchol_Consumption),
    //                 bronchialAstma: yesNoField(d?.Bronchial_Asthma),
    //                 useOfMisheri: yesNoField(d?.Use_of_Misheri),
    //                 allergicConditions: yesNoField(d?.Alergic_Conditions),
    //                 panMasalaChewing: yesNoField(d?.Pan_Masala_Chewing),
    //                 useOfSnaff: yesNoField(d?.Use_of_Snaff),
    //                 HepatitisHBSAg: yesNoField(d?.Hepatitis_HBAAg_Postive),
    //                 betalNutChewing: yesNoField(d?.Betel_Nut_Chewing),
    //                 gutukaChewing: yesNoField(d?.Gutkha_Chewing),
    //                 AIDSHIV: yesNoField(d?.Aids_Hiv_Postive),
    //                 others: yesNoField(d?.Others),
    //                 specify: d?.other_specify || "",


    //                 histopathology: Boolean(d?.Histopathology),
    //                 bloodSmear: Boolean(d?.BloodSmear),
    //                 boneMarrowSmear: Boolean(d?.BoneMarrowSmear),
    //                 cytologySmear: Boolean(d?.CytologySmear),
    //                 FNACSmear: Boolean(d?.FNACSmear),
    //                 MicroscopicSlideOther: Boolean(d?.Other),

    //                 pathology: d?.PathologySlideNo || "",
    //                 microscopicDate: d?.Date_of_Slide === "0001-01-01" ? "" : d?.Date_of_Slide || "",


    //                 anatomicalSite: d?.AnatomicalSite || "",
    //                 tumourTopograph: d?.TumourTopography || "",
    //                 morphologicalDiagnosis:
    //                     d?.MorphologicalDiagnosis || d?.CompletePathDiagnosis || "",
    //                 topographyICD: d?.ICD_Topography || "",
    //                 Morphology: d?.ICD_Morphology || "",
    //                 secondarySiteOfTumour: d?.ICD_Biopsy || "",
    //                 morphologyOfMetastases: d?.ICD_Metastases || "",

    //                 site: d?.Site_of_Tumour || "",
    //                 laterality: d?.Laterality || "",
    //                 clinicalExtent: d?.Clinical_Extent || "",
    //                 stagingSystem: d?.Staging_System || "",
    //                 tnm: d?.TNM || "",
    //                 compositeStage: d?.Composite_Stage || "",
    //                 cancerDirectedTreatment: d?.Cancer_Directed_Treatment || "",
    //                 treatmentGiven: d?.If_Yes_Type_of_Treatment || "",

    //                 commencementOfTreatment: d?.Date_of_Commencement_of_Treatment === "0001-01-01" ? "" : d?.Date_of_Commencement_of_Treatment || "",
    //                 dateOfDeath: d?.Date_of_Death === "0001-01-01" ? "" : d?.Date_of_Death || "",
    //                 dateOfReport: d?.DateOfReport === "0001-01-01" ? "" : d?.DateOfReport || "",
    //                 personCompletingForm: d?.FormFillBy || "",
    //                 Remarks: d?.Remarks || "",
    //             }));
    //         } else {
    //             notify(response?.message, "error");
    //         }
    //     } catch (error) {
    //         console.log(error, "error");
    //         notify("Error fetching patient details", "error");
    //     }
    // };

    const getPatient = async () => {
        debugger
        if (!values?.patientID) return notify("Please Search Patient", "warn");

        try {
            const response = await CancerPatientSearchPatient(values?.patientID);
            if (response?.success) {
                notify(response?.message || "Patient Found", "success");

                const d = response?.data;
                const cancerD = response?.data?.cancerDetails || {}; // Use a shorthand and handle if it's null

                const yesNoField = (val) =>
                    val
                        ? { label: val, value: val }
                        : { label: "No", value: "No" };

                setValues((prev) => ({
                    

                    patientID: d?.patientID || "",
                    UHID: d?.patientID || "",
                    title: d?.title || "",
                    patientName: d?.name || cancerD?.name || "",
                    age: d?.age || cancerD?.age || "",
                    gender: d?.gender || cancerD?.gender || "",
                    fatherName: cancerD?.fatherName || d?.fatherName || "",
                    motherName: cancerD?.motherName || d?.motherName || "",
                    husbandName: cancerD?.husbandName || d?.husbandName || "",
                    sonsName: cancerD?.sonName || "",
                    daughtersName: cancerD?.daughterName || "",
                    wifeName: cancerD?.wifeName || "",
                    mobileNo: d?.mobile || cancerD?.mobileNo || "",

                    
                    houseNo: d?.houseNo || cancerD?.houseNo || "",
                    streetName: d?.streetName || cancerD?.street || "",
                    locality: d?.locality || cancerD?.locality || "",
                    city: cancerD?.city || "",
                    pinCode: cancerD?.pinCode || "",
                    gramPanchayat: cancerD?.gramPanchayat || "",
                    tehsil: cancerD?.subUnitDistrict || d?.taluka || "",
                    district: d?.districtID || cancerD?.districtId || "", 
                    state: d?.stateID || cancerD?.stateId || "", 
                    durationOfStay: cancerD?.stayPeriod || 0,
                    telephone: cancerD?.telephone || "",
                    localAddress: cancerD?.localAddress || "",

                    
                    registrationDate: cancerD?.date_of_Registraton === "0001-01-01" ? "" : cancerD?.date_of_Registraton || d?.dateEnrolled || "",
                    dateOfFirstDiagnosis: cancerD?.date_of_First_Diagnosis === "0001-01-01" ? "" : cancerD?.date_of_First_Diagnosis || "",
                    physicianName: cancerD?.name_of_physicianId || cancerD?.name_of_physician || "",
                    departmentName: cancerD?.name_of_department || "",
                    caseRegisteredAs: {
                        value: cancerD?.case_Registered_As || "Out-Patient(OP)",
                        label: cancerD?.case_Registered_As || "Out-Patient(OP)",
                    },

                    
                    noSpecificHabit: yesNoField(cancerD?.no_Specific_Habit),
                    tubercolosis: yesNoField(cancerD?.tuber_Culosis),
                    cigaratteSmoking: yesNoField(cancerD?.cigaratte_Smoking),
                    hyperTension: yesNoField(cancerD?.hypertension),
                    beedisSmoking: yesNoField(cancerD?.beedi_Smoking),
                    diabetes: yesNoField(cancerD?.diabetes),
                    tobaccoChewing: yesNoField(cancerD?.tobocco_Chewing),
                    ischaemicHeartDisease: yesNoField(cancerD?.ischaemic_Heart_Disease),
                    alcoholConsumptionChewing: yesNoField(cancerD?.alchol_Consumption),
                    bronchialAstma: yesNoField(cancerD?.bronchial_Asthma),
                    useOfMisheri: yesNoField(cancerD?.use_of_Misheri),
                    allergicConditions: yesNoField(cancerD?.alergic_Conditions),
                    panMasalaChewing: yesNoField(cancerD?.pan_Masala_Chewing),
                    useOfSnaff: yesNoField(cancerD?.use_of_Snaff),
                    HepatitisHBSAg: yesNoField(cancerD?.hepatitis_HBAAg_Postive),
                    betalNutChewing: yesNoField(cancerD?.betel_Nut_Chewing),
                    gutukaChewing: yesNoField(cancerD?.gutkha_Chewing),
                    AIDSHIV: yesNoField(cancerD?.aids_Hiv_Postive),
                    others: yesNoField(cancerD?.others),
                    specify: cancerD?.other_specify || "",

                    
                    histopathology: cancerD?.histopathology === "True",
                    bloodSmear: cancerD?.bloodSmear === "True",
                    boneMarrowSmear: cancerD?.boneMarrowSmear === "True",
                    cytologySmear: cancerD?.cytologySmear === "True",
                    FNACSmear: cancerD?.fnacSmear === "True",
                    MicroscopicSlideOther: cancerD?.other === "True",
                    pathology: cancerD?.pathologySlideNo || "",
                    microscopicDate: cancerD?.date_of_Slide === "0001-01-01" ? "" : cancerD?.date_of_Slide || "",

                   
                    anatomicalSite: cancerD?.anatomicalSite || "",
                    tumourTopograph: cancerD?.tumourTopography || "",
                    morphologicalDiagnosis: cancerD?.morphologicalDiagnosis || cancerD?.completePathDiagnosis || "",
                    topographyICD: cancerD?.icD_Topography || "",
                    Morphology: cancerD?.icD_Morphology || "",
                    secondarySiteOfTumour: cancerD?.icD_Biopsy || "",
                    morphologyOfMetastases: cancerD?.icD_Metastases || "",

                  
                    site: cancerD?.site_of_Tumour || "",
                    laterality: cancerD?.laterality || "",
                    clinicalExtent: cancerD?.clinical_Extent || "",
                    stagingSystem: cancerD?.staging_System || "",
                    tnm: cancerD?.tnm || "",
                    compositeStage: cancerD?.composite_Stage || "",
                    cancerDirectedTreatment: cancerD?.cancer_Directed_Treatment || "",
                    treatmentGiven: cancerD?.if_Yes_Type_of_Treatment || "",

                  
                    commencementOfTreatment: cancerD?.date_of_Commencement_of_Treatment === "0001-01-01" ? "" : cancerD?.date_of_Commencement_of_Treatment || "",
                    completionOfInitialCancer: cancerD?.date_of_Completion_of_inital_cancer === "0001-01-01" ? "" : cancerD?.date_of_Completion_of_inital_cancer || "",
                    dateOfDeath: cancerD?.date_of_Death === "0001-01-01" ? "" : cancerD?.date_of_Death || "",
                    dateOfReport: cancerD?.dateOfReport === "0001-01-01" ? "" : cancerD?.dateOfReport || "",
                    personCompletingForm: cancerD?.formFillBy || "",
                    Date: cancerD?.date === "0001-01-01" ? new Date() : cancerD?.date,
                    Remarks: cancerD?.remarks || "",
                }));

                
                if (d?.cancerRelations && Array.isArray(d.cancerRelations)) {
                    const relations = d.cancerRelations.map(rel => ({
                        RelationOf: rel.relationOf || "",
                        RelationName: rel.relationName || "",
                        RelationPhone: rel.relationPhoneNo || ""
                    }));
                    setRelationData(relations);
                } else {
                    setRelationData([]); 
                }

            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.log(error, "error");
            notify("Error fetching patient details", "error");
        }
    };


    const patientSave = async () => {
        debugger
        if (!values?.patientID) return notify("Please Search Patient", "warn");
        try {

            const payload = {
                "isUpdate": true,
                "patient_ID": values?.patientID || "",
                "title": values?.title || "",
                "name": values?.patientName || "",
                "age": values?.age || "",
                "gender": values?.gender || "",
                "fatherName": values?.fatherName || "",
                "motherName": values?.motherName || "",
                "sonName": values?.sonsName || "",
                "daughterName": values?.daughtersName || "",
                "husbandName": values?.husbandName || "",
                "wifeName": values?.wifeName || "",
                "houseNo": values?.houseNo || "",
                "street": values?.streetName || "",
                "locality": values?.locality || "",
                "city": values?.city || "",
                "pinCode": values?.pinCode || "",
                "gramPanchayat": values?.gramPanchayat || "",
                "subUnitDistrict": values?.tehsil || "",
                // "state": values?.state?.label || "",
                // "district": values?.district?.label || "",
                state: values.state?.label ? values.state?.label : values.state || "",
                stateId: values.state?.value ? values.state?.value : values.state || "",
                district: values.district?.label ? values.district?.label : values.district || "",
                districtId: values.district?.value ? values.district?.value : values.district || "",
                "durationOfStay": values?.durationOfStay || 0,
                "telephone": values?.telephone || "",
                "localAddress": values?.localAddress || "",
                "histopathology": Boolean(values?.histopathology),
                "bloodSmear": Boolean(values?.bloodSmear),
                "boneMarrowSmear": Boolean(values?.boneMarrowSmear),
                "cytologySmear": Boolean(values?.cytologySmear),
                "fnacSmear": Boolean(values?.FNACSmear),
                "other": Boolean(values?.MicroscopicSlideOther),
                "pathologySlideNo": values?.pathology || "",
                "anatomicalSite": values?.anatomicalSite || "",
                "completePathDiagnosis": values?.morphologicalDiagnosis || "",
                "tumourTopography": values?.tumourTopograph || "",
                "morphologicalDiagnosis": values?.morphologicalDiagnosis || "",
                "icD_CODE": "",
                "icD_Topography": values?.topographyICD?.value ? values?.topographyICD?.value : values?.topographyICD || "",
                "icD_Morphology": values?.Morphology?.value ? values?.Morphology?.value : values?.Morphology || "",
                "icD_Biopsy": values?.secondarySiteOfTumour?.value ? values?.secondarySiteOfTumour?.value : values?.secondarySiteOfTumour || "",
                "icD_Metastases": values?.morphologyOfMetastases?.value ? values?.morphologyOfMetastases?.value : values?.morphologyOfMetastases || "",
                "dateOfReport": values?.dateOfReport ? moment(values?.dateOfReport).format("YYYY-MM-DD") : "",
                "formFillBy": values?.personCompletingForm || "",
                "date": values?.Date ? moment(values?.Date).format("YYYY-MM-DD") : "",
                "userID": "",
                "remarks": values?.Remarks || "",
                "name_of_Department": values?.departmentName || "",
                "name_of_physician": values?.physicianName?.value ? values?.physicianName?.value : values?.physicianName || "",
                "name_of_physicianId": values?.physicianName?.value ? values?.physicianName?.value : values?.physicianName || "",
                "mobileNo": values?.mobileNo || "",
                "date_of_Registraton": values?.registrationDate ? moment(values?.registrationDate).format("YYYY-MM-DD") : "",
                "Date_of_First_Diagnosis": values?.dateOfFirstDiagnosis ? moment(values?.dateOfFirstDiagnosis).format("YYYY-MM-DD") : "",
                "case_Registered_As": values?.caseRegisteredAs?.value || "",
                "date_of_Slide": values?.microscopicDate ? moment(values?.microscopicDate).format("YYYY-MM-DD") : "",
                "site_of_Tumour": values?.site || "",
                "laterality": values?.laterality?.value ? values?.laterality?.value : values?.laterality || "",
                "clinical_Extent": values?.clinicalExtent?.value ? values?.clinicalExtent?.value : values?.clinicalExtent || "",
                "staging_System": values?.stagingSystem?.value ? values?.stagingSystem?.value : values?.stagingSystem || "",
                "tnm": values?.tnm || "",
                "composite_Stage": values?.compositeStage || "",
                "cancer_Directed_Treatment": values?.cancerDirectedTreatment?.value ? values?.cancerDirectedTreatment?.value : values?.cancerDirectedTreatment || "",
                "if_Yes_Type_of_Treatment": values?.treatmentGiven?.value ? values?.treatmentGiven?.value : values?.treatmentGiven || "",
                "date_of_Commencement_of_Treatment": values?.commencementOfTreatment ? moment(values?.commencementOfTreatment).format("YYYY-MM-DD") : "",
                "date_of_Completion_of_inital_cancer": values?.completionOfInitialCancer ? moment(values?.completionOfInitialCancer).format("YYYY-MM-DD") : "",
                "date_of_Death": values?.dateOfDeath ? moment(values?.dateOfDeath).format("YYYY-MM-DD") : "",
                "no_Specific_Habit": values?.noSpecificHabit?.value || "",
                "cigaratte_Smoking": values?.cigaratteSmoking?.value || "",
                "beedi_Smoking": values?.beedisSmoking?.value || "",
                "tobocco_Chewing": values?.tobaccoChewing?.value || "",
                "alchol_Consumption": values?.alcoholConsumptionChewing?.value || "",
                "use_of_Misheri": values?.useOfMisheri?.value || "",
                "pan_Masala_Chewing": values?.panMasalaChewing?.value || "",
                "use_of_Snaff": values?.useOfSnaff?.value || "",
                "betel_Nut_Chewing": values?.betalNutChewing?.value || "",
                "gutkha_Chewing": values?.gutukaChewing?.value || "",
                "tuber_Culosis": values?.tubercolosis?.value || "",
                "hypertension": values?.hyperTension?.value || "",
                "diabetes": values?.diabetes?.value || "",
                "ischaemic_Heart_Disease": values?.ischaemicHeartDisease?.value || "",
                "bronchial_Asthma": values?.bronchialAstma?.value || "",
                "alergic_Conditions": values?.allergicConditions?.value || "",
                "hepatitis_HBAAg_Postive": values?.HepatitisHBSAg?.value || "",
                "others": values?.others?.value || "",
                "aids_Hiv_Postive": values?.AIDSHIV?.value || "",
                "other_specify": values?.specify || "",
                // "relationInfos": [
                //     {
                //         "relationOf": "string",
                //         "relationName": "string",
                //         "relationPhoneNo": "string"
                //     }
                // ]
                "relationInfos": relationData?.map((item) => ({
                    "relationOf": item?.RelationOf,
                    "relationName": item?.RelationName,
                    "relationPhoneNo": item?.RelationPhone
                }))
            };

            const response = await CancerPatientSave(payload);

            if (response?.success) {
                notify(response?.message, "success");
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.log(error, "error");
            notify("An unexpected error occurred while saving the data.", "error");
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            GetBindAllDoctorConfirmation(
                {
                    Department: "All",
                }
            )
        )
        dispatch(CentreWiseCacheByCenterID({}))
        fetchState("State");
        fetchDistrict("District");
        fetchAllDropdowns();
    }, [])



    return (
        <div className="card patient_registration">
            <>
                <Heading title={t("Cancer Registration")} isBreadcrumb={true} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("UHID")}
                        placeholder=" "
                        id="patientID"
                        name="patientID"
                        onChange={handleChange}
                        value={values?.patientID}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                    // onKeyDown={Tabfunctionality}
                    />

                    <div className=" col-sm-2">
                        <button className="btn btn-sm btn-success"
                            onClick={getPatient}
                        >
                            {t("Search")}
                        </button>
                    </div>
                </div>
            </>
            <>
                <Heading title={t("Patient Details")} isBreadcrumb={false} />
                <>

                    <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                            <div className="w-xl-50  w-md-100 w-100">
                                <LabeledInput
                                    label={t("UHID")}
                                    value={values?.UHID}
                                />
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                            <div className="w-xl-50  w-md-100 w-100">
                                <LabeledInput
                                    label={t("Patient Name")}
                                    value={values?.patientName}
                                />
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                            <div className="w-xl-50  w-md-100 w-100">
                                <LabeledInput
                                    label={t("Date Of Birth / Age")}
                                    value={values?.age}
                                />
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                            <div className="w-xl-50  w-md-100 w-100">
                                <LabeledInput
                                    label={t("Gender")}
                                    value={values?.gender}
                                />
                            </div>
                        </div>
                        {/* <Input
                            type="text"
                            className="form-control"
                            lable={t("Name Of Father")}
                            placeholder=" "
                            id="fatherName"
                            name="fatherName"
                            onChange={handleChange}
                            value={values?.fatherName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name of Mother")}
                            placeholder=" "
                            id="motherName"
                            name="motherName"
                            onChange={handleChange}
                            value={values?.motherName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name Of Husband")}
                            placeholder=" "
                            id="husbandName"
                            name="husbandName"
                            onChange={handleChange}
                            value={values?.husbandName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name(s) of Son(s)")}
                            placeholder=" "
                            id="sonsName"
                            name="sonsName"
                            onChange={handleChange}
                            value={values?.sonsName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name Of Wife")}
                            placeholder=" "
                            id="wifeName"
                            name="wifeName"
                            onChange={handleChange}
                            value={values?.wifeName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name(s) of Daughter(s)")}
                            placeholder=" "
                            id="daughtersName"
                            name="daughtersName"
                            onChange={handleChange}
                            value={values?.daughtersName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        /> */}
                        <DatePicker
                            className="custom-calendar"
                            id="registrationDate"
                            name="registrationDate"
                            placeholder={VITE_DATE_FORMAT}
                            value={
                                values.registrationDate
                                    ? moment(values?.registrationDate, "YYYY-MM-DD").toDate()
                                    : values?.registrationDate
                            }
                            // value={values?.registrationDate ? values?.registrationDate : ""}
                            lable={t("Date of Regisration")}
                            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                            handleChange={handleChange}
                            onKeyDown={Tabfunctionality}
                        />
                        <ReactSelect
                            placeholderName={t("Case Registered As")}
                            id="caseRegisteredAs"
                            // inputId="panelType"
                            name="caseRegisteredAs"
                            value={values?.caseRegisteredAs?.value ? values?.caseRegisteredAs?.value : values?.caseRegisteredAs}
                            dynamicOptions={[
                                { value: "Out-Patient(OP)", label: "Out-Patient(OP)" },
                                { value: "In Patient(IP)", label: "In Patient(IP)" },
                                { value: "OP And IP", label: "OP And IP" }
                            ]}
                            searchable={true}
                            removeIsClearable={true}
                            handleChange={handleReactSelect}
                            respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                            onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            lable={t("Name of Department/Unit Etc")}
                            placeholder=" "
                            id="departmentName"
                            name="departmentName"
                            onChange={handleChange}
                            value={values?.departmentName}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <ReactSelect
                            placeholderName={t("Name of physician")}
                            id="physicianName"
                            // inputId="panelType"
                            name="physicianName"
                            value={values?.physicianName?.value ? values?.physicianName?.value : values?.physicianName}
                            dynamicOptions={[

                                ...GetBindAllDoctorConfirmationData.map((item) => {
                                    return {
                                        label: item?.Name,
                                        value: item?.DoctorID,
                                    };
                                }),
                            ]}
                            searchable={true}
                            removeIsClearable={true}
                            handleChange={handleReactSelectOption}
                            respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                            onKeyDown={Tabfunctionality}
                        />

                        <Input
                            type="number"
                            className="form-control"
                            lable={t("Mobile no")}
                            placeholder=" "
                            id="mobileNo"
                            name="mobileNo"
                            onChange={handleChange}
                            value={values?.mobileNo}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                        />
                        <DatePicker
                            className="custom-calendar"
                            id="dateOfFirstDiagnosis"
                            name="dateOfFirstDiagnosis"
                            placeholder={VITE_DATE_FORMAT}
                            value={
                                values.dateOfFirstDiagnosis
                                    ? moment(values?.dateOfFirstDiagnosis, "YYYY-MM-DD").toDate()
                                    : values?.dateOfFirstDiagnosis
                            }
                            // value={values?.dateOfFirstDiagnosis ? values?.dateOfFirstDiagnosis : ""}
                            lable={t("Date of First Diagnosis")}
                            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                            handleChange={handleChange}
                            onKeyDown={Tabfunctionality}
                        />

                        <ReactSelect
                            placeholderName={t("Relation_Of")}
                            id="Relation"
                            searchable={true}
                            name="Relation"
                            value={relation?.RelationOf}
                            handleChange={handleChangRelation}
                            // placeholder=" "
                            respclass="col-xl-1 col-md-2 col-sm-4 col-4"
                            dynamicOptions={filterByType(
                                CentreWiseCache,
                                6,
                                "TypeID",
                                "TextField",
                                "ValueField"
                            )}
                        // isDisabled={isDisableInputs}
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="Relation_Name"
                            name="RelationName"
                            value={relation.RelationName}
                            onChange={(e) =>
                                setRelation({ ...relation, RelationName: e.target.value })
                            }
                            lable={t("Relation_Name")}
                            placeholder=" "
                            respclass="col-xl-1 col-md-2 col-sm-4 col-4"
                        // disabled={isDisableInputs}
                        />


                        <Input
                            type="text"
                            className="form-control"
                            id="Relation_Phone"
                            name="RelationPhone"
                            value={relation.RelationPhone}
                            // onChange={(e) =>
                            //   setRelation({ ...relation, RelationPhone: e.target.value })
                            // }

                            onChange={(e) => {
                                const value = e.target.value;
                                if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                                    setRelation({ ...relation, RelationPhone: value });
                                }
                            }}
                            lable={t("Relation_Phone")}
                            placeholder=" "
                            respclass="col-xl-1 col-md-2 col-sm-4 col-4"
                        // disabled={isDisableInputs}
                        />

                        <div
                            className="col-xl-1 col-md-2 col-sm-4 col-4"
                        >
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={handleAddRelation}
                                // disabled={isDisableInputs}
                                type="button"
                            >
                                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
                            </button>
                        </div>



                    </div>
                    <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">







                        {console.log(relationData, "relationData")}
                        <div className="col-xl-12 col-md-12 col-sm-12 col-12">



                            <Tables
                                tbody={relationData?.map((rel, index) => ({
                                    Sno: index + 1,
                                    relation: rel.RelationOf,
                                    RelationName: rel.RelationName,
                                    RelationPhone: rel.RelationPhone,
                                    delete: (

                                        <i
                                            className="fa fa-trash"
                                            onClick={() => handleDeleteRelation(index)}
                                            aria-hidden="true"
                                            id="redDeleteColor"

                                        ></i>

                                    ),
                                }))}
                                thead={[
                                    { name: t("S.no"), width: "1%" },
                                    t("Relation Of"),
                                    t("Relation Name"),
                                    t("Relation Phone"),
                                    { name: t("Action"), width: "1%" },
                                ]}
                            />



                        </div>
                    </div>
                </>

            </>
            <>
                <Heading title={t("Place Of Residence")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("House No")}
                        placeholder=" "
                        id="houseNo"
                        name="houseNo"
                        onChange={handleChange}
                        value={values?.houseNo}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Road / Street Name")}
                        placeholder=" "
                        id="streetName"
                        name="streetName"
                        onChange={handleChange}
                        value={values?.streetName}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Area / Locality")}
                        placeholder=" "
                        id="locality"
                        name="locality"
                        onChange={handleChange}
                        value={values?.locality}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />


                    {/* <ReactSelect
                        placeholderName={t("State")}
                        id="state"
                        // inputId="panelType"
                        name="caseRegisteredAs"
                        value={values?.state?.value ? values?.state?.value : values?.state}
                        dynamicOptions={[
                            { value: "0", label: "Credit" },
                            { value: "1", label: "Cash" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Name Of District")}
                        id="district"
                        name="district"
                        value={values?.district?.value ? values?.district?.value : values?.district}
                        dynamicOptions={[
                            { value: "0", label: "Credit" },
                            { value: "1", label: "Cash" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    /> */}
                    <ReactSelect
                        placeholderName={t("Select State")}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        requiredClassName={"required-fields"}
                        id={"State"}
                        searchable={true}
                        name={"state"}
                        dynamicOptions={
                            dropdown?.state?.filter((item) => item.CountryID == 14)
                                .map((item) => ({
                                    label: item.TextField,
                                    value: item.ValueField,
                                    ...item
                                }))
                        }
                        handleChange={handleReactSelectoptionDep}
                        value={values?.state}
                        removeIsClearable={false}
                    />
                    <ReactSelect
                        placeholderName={"Select District"}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        id={"District"}
                        requiredClassName={"required-fields"}
                        searchable={true}
                        name={"district"}
                        dynamicOptions={
                            values?.state
                                ? dropdown?.district
                                    ?.filter(
                                        (item) =>
                                            item.StateID ===
                                            (values?.state?.value
                                                ? parseInt(values?.state?.value)
                                                : values?.state)
                                    )
                                    .map((item) => ({
                                        label: item.TextField,
                                        value: item.ValueField,
                                        ...item
                                    }))
                                : []
                        }
                        handleChange={handleReactSelectoptionDep}
                        value={values?.district}
                        removeIsClearable={false}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Town / City")}
                        placeholder=" "
                        id="city"
                        name="city"
                        onChange={handleChange}
                        value={values?.city}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="number"
                        className="form-control"
                        lable={t("Postal Pin Code")}
                        placeholder=" "
                        id="pinCode"
                        name="pinCode"
                        onChange={handleChange}
                        value={values?.pinCode}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="number"
                        className="form-control"
                        lable={t("Duration Of Stay (in years)")}
                        placeholder=" "
                        id="durationOfStay"
                        name="durationOfStay"
                        onChange={handleChange}
                        value={values?.durationOfStay}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="number"
                        className="form-control"
                        lable={t("Telephone No (if any)")}
                        placeholder=" "
                        id="telephone"
                        name="telephone"
                        onChange={handleChange}
                        value={values?.telephone}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>

                        <TextAreaInput
                            // className="form-control"
                            lable={t("Name of the Gram Panchayat / Village, etc")}
                            placeholder=" "
                            id="gramPanchayat"
                            name="gramPanchayat"
                            onChange={handleChange}
                            value={values?.gramPanchayat}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Name of the Sub-unit of District ( Taluk / Tehsil / Other  )")}
                            placeholder=" "
                            id="tehsil"
                            name="tehsil"
                            onChange={handleChange}
                            value={values?.tehsil}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Local Address ( If any, for non resident Patients )- record below as per details above")}
                            placeholder=" "
                            id="localAddress"
                            name="localAddress"
                            onChange={handleChange}
                            value={values?.localAddress}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>

                </div>
            </>
            <>
                <Heading title={t("Detail of Patients Habits")} isBreadcrumb={false} />
                <div className="row col-xl-12 row-cols-lg-5 row-cols-md-2 row-cols-1 p-2 ">

                    <ReactSelect
                        placeholderName={t("No Specific Habit")}
                        id="noSpecificHabit"
                        // inputId="panelType"
                        name="noSpecificHabit"
                        value={values?.noSpecificHabit?.value ? values?.noSpecificHabit?.value : values?.noSpecificHabit}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Tubercolosis")}
                        id="tubercolosis"
                        // inputId="panelType"
                        name="tubercolosis"
                        value={values?.tubercolosis?.value ? values?.tubercolosis?.value : values?.tubercolosis}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Cigaratte Smoking")}
                        id="cigaratteSmoking"
                        // inputId="panelType"
                        name="cigaratteSmoking"
                        value={values?.cigaratteSmoking?.value ? values?.cigaratteSmoking?.value : values?.cigaratteSmoking}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("HyperTension")}
                        id="hyperTension"
                        name="hyperTension"
                        value={values?.hyperTension?.value ? values?.hyperTension?.value : values?.hyperTension}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Beedis Smoking")}
                        id="beedisSmoking"
                        name="beedisSmoking"
                        value={values?.beedisSmoking?.value ? values?.beedisSmoking?.value : values?.beedisSmoking}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Diabetes")}
                        id="diabetes"
                        name="diabetes"
                        value={values?.diabetes?.value ? values?.diabetes?.value : values?.diabetes}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Tobacco chewing")}
                        id="tobaccoChewing"
                        name="tobaccoChewing"
                        value={values?.tobaccoChewing?.value ? values?.tobaccoChewing?.value : values?.tobaccoChewing}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Ischaemic Heart Disease")}
                        id="ischaemicHeartDisease"
                        name="ischaemicHeartDisease"
                        value={values?.ischaemicHeartDisease?.value ? values?.ischaemicHeartDisease?.value : values?.ischaemicHeartDisease}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Alcohol Consumption chewing")}
                        id="alcoholConsumptionChewing"
                        name="alcoholConsumptionChewing"
                        value={values?.alcoholConsumptionChewing?.value ? values?.alcoholConsumptionChewing?.value : values?.alcoholConsumptionChewing}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Bronchial Astma")}
                        id="bronchialAstma"
                        name="bronchialAstma"
                        value={values?.bronchialAstma?.value ? values?.bronchialAstma?.value : values?.bronchialAstma}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Use of Misheri")}
                        id="useOfMisheri"
                        name="useOfMisheri"
                        value={values?.useOfMisheri?.value ? values?.useOfMisheri?.value : values?.useOfMisheri}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Allergic Conditions")}
                        id="allergicConditions"
                        name="allergicConditions"
                        value={values?.allergicConditions?.value ? values?.allergicConditions?.value : values?.allergicConditions}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Pan Masala Chewing")}
                        id="panMasalaChewing"
                        name="panMasalaChewing"
                        value={values?.allergicConditions?.value ? values?.allergicConditions?.value : values?.allergicConditions}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Use of Snaff")}
                        id="useOfSnaff"
                        name="useOfSnaff"
                        value={values?.useOfSnaff?.value ? values?.useOfSnaff?.value : values?.useOfSnaff}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Hepatitis/HBSAg +Ve")}
                        id="HepatitisHBSAg"
                        name="HepatitisHBSAg"
                        value={values?.HepatitisHBSAg?.value ? values?.HepatitisHBSAg?.value : values?.HepatitisHBSAg}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Betal Nut Chewing")}
                        id="betalNutChewing"
                        name="betalNutChewing"
                        value={values?.betalNutChewing?.value ? values?.betalNutChewing?.value : values?.betalNutChewing}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Others")}
                        id="others"
                        name="others"
                        value={values?.others?.value ? values?.others?.value : values?.others}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />

                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Specify")}
                        placeholder=" "
                        id="specify"
                        name="specify"
                        onChange={handleChange}
                        value={values?.specify}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                    // onKeyDown={Tabfunctionality}
                    />

                    <ReactSelect
                        placeholderName={t("Gutuka Chewing")}
                        id="gutukaChewing"
                        name="gutukaChewing"
                        value={values?.gutukaChewing?.value ? values?.gutukaChewing?.value : values?.gutukaChewing}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("AIDS/HIV +ve")}
                        id="AIDSHIV"
                        name="AIDSHIV"
                        value={values?.AIDSHIV?.value ? values?.AIDSHIV?.value : values?.AIDSHIV}
                        dynamicOptions={yesNoOptions}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />


                </div>
            </>
            <>
                <Heading title={t("Microscopic Slid")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="histopathology"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        histopathology: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.histopathology)}
                            />
                            {t("Histopathology")}
                        </label>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="bloodSmear"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        bloodSmear: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.bloodSmear)}
                            />
                            {t("Blood Smear")}
                        </label>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="boneMarrowSmear"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        boneMarrowSmear: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.boneMarrowSmear)}
                            />
                            {t("Bone Marrow Smear")}
                        </label>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="cytologySmear"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        cytologySmear: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.cytologySmear)}
                            />
                            {t("Cytology Smear")}
                        </label>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="FNACSmear"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        FNACSmear: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.FNACSmear)}
                            />
                            {t("FNAC Smear")}
                        </label>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <label className="d-flex align-items-center " style={{ cursor: "pointer" }}>
                            <Checkbox
                                id="MicroscopicSlideOther"
                                className="mt-2"
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        MicroscopicSlideOther: e.target.checked
                                    }))
                                }
                                checked={Boolean(values?.MicroscopicSlideOther)}
                            />
                            {t("Other")}
                        </label>
                    </div>
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Pathology / Slide No(s)")}
                            placeholder=" "
                            id="pathology"
                            name="pathology"
                            onChange={handleChange}
                            value={values?.pathology}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <DatePicker
                        className="custom-calendar"
                        id="microscopicDate"
                        name="microscopicDate"
                        placeholder={VITE_DATE_FORMAT}
                        // value={values?.microscopicDate ? values?.microscopicDate : ""}
                        value={
                            values.microscopicDate
                                ? moment(values?.microscopicDate, "YYYY-MM-DD").toDate()
                                : values?.microscopicDate
                        }
                        lable={t("Microscopic Date")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />

                </div>
            </>
            <>
                <Heading title={t("Others")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Anatomical site of Specimen / Biopsy / Smear")}
                            placeholder=" "
                            id="anatomicalSite"
                            name="anatomicalSite"
                            onChange={handleChange}
                            value={values?.anatomicalSite}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("A) Primary Site of Tumour-Topograph (include sub-site if any )")}
                            placeholder=" "
                            id="tumourTopograph"
                            name="tumourTopograph"
                            onChange={handleChange}
                            value={values?.tumourTopograph}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <div className='col-xl-6 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Morphological Diagnosis")}
                            placeholder=" "
                            id="morphologicalDiagnosis"
                            name="morphologicalDiagnosis"
                            onChange={handleChange}
                            value={values?.morphologicalDiagnosis}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12"
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>


                </div>
            </>
            <>
                <Heading title={t("ICD Code 3")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

                    <ReactSelect
                        placeholderName={t("Primary Site of Tumour - Topography ICD 10")}
                        id="topographyICD"
                        // inputId="panelType"
                        name="topographyICD"
                        value={values?.topographyICD?.value ? values?.topographyICD?.value : values?.topographyICD}
                        dynamicOptions={dropdown?.cancerPatientTumorprimary}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-3 col-md-3 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Primary Histology - Morphology")}
                        id="topographyICD"
                        // inputId="panelType"
                        name="Morphology"
                        value={values?.Morphology?.value ? values?.Morphology?.value : values?.Morphology}
                        dynamicOptions={dropdown?.cancerPatientMorphologyPrimary}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-3 col-md-3 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Secondary Site of Tumour - (Site of Biopsy  / Smear ICD 10 )")}
                        id="secondarySiteOfTumour"
                        // inputId="panelType"
                        name="secondarySiteOfTumour"
                        value={values?.secondarySiteOfTumour?.value ? values?.secondarySiteOfTumour?.value : values?.secondarySiteOfTumour}
                        dynamicOptions={dropdown?.cancerPatientTumorsecondary}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-3 col-md-3 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Morphology Of Metastases ICD 03")}
                        id="morphologyOfMetastases"
                        // inputId="panelType"
                        name="morphologyOfMetastases"
                        value={values?.morphologyOfMetastases?.value ? values?.morphologyOfMetastases?.value : values?.morphologyOfMetastases}
                        dynamicOptions={dropdown?.cancerPatientMorphologySecondry}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-3 col-md-3 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                        <label className="d-flex align-items-center ">

                            {t(`If the morphology diagnosis is only that of metastatic site , 
                            mention the Primary Site as taken by the treating clinician sither through discussion or from case record.`)}
                        </label>
                    </div>

                </div>
            </>
            <>
                <Heading title={t("Detail of Clinical Stage")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("site")}
                        placeholder=" "
                        id="site"
                        name="site"
                        onChange={handleChange}
                        value={values?.site}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("LATERALITY")}
                        id="laterality"
                        // inputId="panelType"
                        name="laterality"
                        value={values?.laterality?.value ? values?.laterality?.value : values?.laterality}
                        dynamicOptions={[
                            { "label": "Not a Paired site", "value": "Not a Paired site" },
                            { "label": "Right", "value": "Right" },
                            { "label": "Left", "value": "Left" },
                            { "label": "Only one site involved,right or left,unknown", "value": "Only one site involved,right or left,unknown" },
                            { "label": "Bilateral involvement,lateral origin unknown", "value": "Bilateral involvement,lateral origin unknown" },
                            { "label": "Paired site,but no information concerning laterality", "value": "Paired site,but no information concerning laterality" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Clinical Extent of Disease before treatment")}
                        id="clinicalExtent"
                        name="clinicalExtent"
                        value={values?.clinicalExtent?.value ? values?.clinicalExtent?.value : values?.clinicalExtent}
                        dynamicOptions={[
                            { "label": "In-situ", "value": "In-situ" },
                            { "label": "Localised", "value": "Localised" },
                            { "label": "Direct Extension", "value": "Direct Extension" },
                            { "label": "Regional Nodes", "value": "Regional Nodes" },
                            { "label": "Direct Extension with Regional Nodes", "value": "Direct Extension with Regional Nodes" },
                            { "label": "Distant Metastasis", "value": "Distant Metastasis" },
                            { "label": "Not Palpble", "value": "Not Palpble" },
                            { "label": "Too Advanced", "value": "Too Advanced" },
                            { "label": "Not Applicable/Unknown Primary", "value": "Not Applicable/Unknown Primary" },
                            { "label": "Treated Elsewhere", "value": "Treated Elsewhere" },
                            { "label": "Recurrent", "value": "Recurrent" },
                            { "label": "Others", "value": "Others" },
                            { "label": "Unknown", "value": "Unknown" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Staging System Followed")}
                        id="stagingSystem"
                        name="stagingSystem"
                        value={values?.stagingSystem?.value ? values?.stagingSystem?.value : values?.stagingSystem}
                        dynamicOptions={[
                            { "label": "TNM", "value": "TNM" },
                            { "label": "FIGO", "value": "FIGO" },
                            { "label": "Ann Arbor", "value": "Ann Arbor" },
                            { "label": "Not Applicable", "value": "Not Applicable" },
                            { "label": "Others", "value": "Others" },
                            { "label": "Unknown", "value": "Unknown" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("TNM")}
                        placeholder=" "
                        id="tnm"
                        name="tnm"
                        onChange={handleChange}
                        value={values?.tnm}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Composite Stage (888 if not applicable)")}
                        placeholder=" "
                        id="compositeStage"
                        name="compositeStage"
                        onChange={handleChange}
                        value={values?.compositeStage}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("Cancer Directed Treatment")}
                        id="cancerDirectedTreatment	"
                        name="cancerDirectedTreatment"
                        value={values?.cancerDirectedTreatment?.value ? values?.cancerDirectedTreatment?.value : values?.cancerDirectedTreatment}
                        dynamicOptions={[
                            { "label": "Yes", "value": "Yes" },
                            { "label": "No", "value": "No" },
                            { "label": "Treatment advised but not accepted", "value": "Treatment advised but not accepted" },
                            { "label": "4", "value": "4" },
                            { "label": "Others", "value": "Others" },
                            { "label": "Unknown", "value": "Unknown" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
                        placeholderName={t("if Yes,Type of Treatment Given)")}
                        id="treatmentGiven"
                        name="treatmentGiven"
                        value={values?.treatmentGiven?.value ? values?.treatmentGiven?.value : values?.treatmentGiven}
                        dynamicOptions={[
                            { "label": "Surgery(S)", "value": "Surgery(S)" },
                            { "label": "Radiotherapy (R)", "value": "Radiotherapy (R)" },
                            { "label": "ChemoTherapy (C)", "value": "ChemoTherapy (C)" },
                            { "label": "S+R", "value": "S+R" },
                            { "label": "S+C", "value": "S+C" },
                            { "label": "R+C", "value": "R+C" },
                            { "label": "S+R+C", "value": "S+R+C" },
                            { "label": "Hormone Therapy(H)", "value": "Hormone Therapy(H)" },
                            { "label": "S+H", "value": "S+H" },
                            { "label": "R+H", "value": "R+H" },
                            { "label": "C+H", "value": "C+H" },
                            { "label": "S+R+H", "value": "S+R+H" },
                            { "label": "S+C+H", "value": "S+C+H" },
                            { "label": "R+C+H", "value": "R+C+H" },
                            { "label": "S+R+C+H", "value": "S+R+C+H" },
                            { "label": "Others", "value": "Others" }
                        ]}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4  col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="commencementOfTreatment"
                        name="commencementOfTreatment"
                        placeholder={VITE_DATE_FORMAT}
                        value={
                            values.commencementOfTreatment
                                ? moment(values?.commencementOfTreatment, "YYYY-MM-DD").toDate()
                                : values?.commencementOfTreatment
                        }
                        // value={values?.commencementOfTreatment ? values?.commencementOfTreatment : ""}
                        lable={t("Commencement of Treatment AT")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="completionOfInitialCancer"
                        name="completionOfInitialCancer"
                        placeholder={VITE_DATE_FORMAT}
                        value={
                            values.completionOfInitialCancer
                                ? moment(values?.completionOfInitialCancer, "YYYY-MM-DD").toDate()
                                : values?.completionOfInitialCancer
                        }
                        // value={values?.completionOfInitialCancer ? values?.completionOfInitialCancer : ""}
                        lable={t("Completion of Initial Cancer Directed Treatment )")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />
                </div>
            </>
            <>
                <Heading title={t("Other Details")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <DatePicker
                        className="custom-calendar"
                        id="dateOfDeath"
                        name="dateOfDeath"
                        placeholder={VITE_DATE_FORMAT}
                        value={
                            values.dateOfDeath
                                ? moment(values?.dateOfDeath, "YYYY-MM-DD").toDate()
                                : values?.dateOfDeath
                        }
                        // value={values?.dateOfDeath ? values?.dateOfDeath : ""}
                        lable={t("Date of Death")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="dateOfReport"
                        name="dateOfReport"
                        placeholder={VITE_DATE_FORMAT}
                        value={
                            values.dateOfReport
                                ? moment(values?.dateOfReport, "YYYY-MM-DD").toDate()
                                : values?.dateOfReport
                        }
                        // value={values?.dateOfReport ? values?.dateOfReport : ""}
                        lable={t("Date Of This Report")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Name Of person Completing Form")}
                        placeholder=" "
                        id="personCompletingForm"
                        name="personCompletingForm"
                        onChange={handleChange}
                        value={values?.personCompletingForm}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="Date"
                        name="Date"
                        placeholder={VITE_DATE_FORMAT}
                        value={values?.Date
                            ? moment(values?.Date, "YYYY-MM-DD").toDate()
                            : values?.Date
                        }
                        lable={t("Date")}
                        respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                        handleChange={handleChange}
                        onKeyDown={Tabfunctionality}
                    />
                    <div className='col-xl-3 col-md-3 col-sm-3 col-3 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Remarks")}
                            placeholder=" "
                            id="Remarks"
                            name="Remarks"
                            onChange={handleChange}
                            value={values?.Remarks}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>
                    <div className="col-xl-1 col-md-1 col-sm-2 col-2">
                        <button className="btn btn-sm btn-success"
                            onClick={patientSave}
                        >
                            {t("Save")}
                        </button>
                    </div>
                </div>
            </>
        </div>
    )
}

export default CancerRegistrationForm