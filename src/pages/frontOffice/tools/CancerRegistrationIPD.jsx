import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import DatePicker from '../../../components/formComponent/DatePicker'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { Tabfunctionality } from '../../../utils/helpers'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import { nonCancerSearchPatientApi, SearchByICDDesc, getDiagnosisDetailsApi, nonCancerPatientSaveApi } from '../../../networkServices/DoctorApi'
import { AutoComplete } from "primereact/autocomplete";
import { notify } from '../../../utils/ustil2'
import ICDDaignosisDescription from '../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription'
import { useSelector } from 'react-redux'
import { GetBindAllDoctorConfirmation } from '../../../store/reducers/common/CommonExportFunction'
import { useDispatch } from 'react-redux'
import { centreWiseCacheDisplayApi } from '../../../networkServices/registrationApi'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'
import Tables from '../../../components/UI/customTable'
import { DischargeSummaryBindPatient, DischargeSummaryICDCodeRemove, DischargeSummaryICDDescriptionSave } from '../../../networkServices/dischargeSummaryAPI'
import moment from 'moment'
const CancerRegistrationFormIPD = () => {

    const { VITE_DATE_FORMAT } = import.meta.env;
    const dispatch = useDispatch();
    const [values, setValues] = React.useState({
        patientID: "",
        title: "",
        uhid: "",
        pName: "",
        age: "",
        gender: "",
        fatherName: "",
        motherName: "",
        husbandName: "",
        sonName: "",
        wifeName: "",
        daughtersName: "",
        registrationDate: "",
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
        remarks: "",
        transactions: ""


    })

    const {
        GetBindAllDoctorConfirmationData,
    } = useSelector((state) => state.CommonSlice);

    const dependencyMap = {
        // Country: ["State", "District", "City"],
        State: ["District", "City"],
        District: ["City"],
    };
    const [dropdown, setDropDown] = useState({
        // relation: [],
        // title: [],
        // marital: [],
        // country: [],
        transactionList: [],
        state: [],
        district: [],
        city: []
    })
    const THEAD = [
        t("S.No."),
        t("Transaction ID"),
        t("ICD Code"),
        t("ICD Desc."),
        t("Romove"),
    ];
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
    const fetchCity = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                setDropDown((prev) => ({
                    ...prev,
                    city: res?.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }

    useEffect(() => {
        dispatch(
            GetBindAllDoctorConfirmation({
                Department: "All",
            })
        );
        fetchState("State")
        fetchDistrict("District")
        fetchCity("City")
    }, [])
    console.log(values);

    const [selectedICDData, setSelectedICDData] = useState({
        diagnosis: "",
        icdDetails: [],
    });
    const [suggestions, setSuggestions] = useState([]);
    const [searchByICD, setSearchByICD] = useState({
        searchByICDDecs: "",
    });
    const [icdList, setIcdList] = useState([]);
    const [error, setError] = useState("");
    console.log(selectedICDData);

    // const handleAdd = () => {
    //     if (!searchByICD.searchByICDDecs.trim()) return alert("Please enter ICD description");

    //     // add new item to array
    //     setIcdList((prev) => [...prev, searchByICD]);

    //     // clear input
    //     setSearchByICD({ searchByICDDecs: "" });
    // };
    // const handleReset=()=>{
    //      setSearchByICD({ searchByICDDecs: "" });
    // }
    const SearchByICDDescData = async (query) => {
        try {
            const apiRes = await SearchByICDDesc({
                prefixText: query,
                count: 10,
            });
            // const apiRes = await getICDCodesApi(query)
            const data = apiRes?.data?.slice(0, 20)
            const suggestionData = data?.map((item) => ({
                WHO_Full_Desc: item?.WHO_Full_Desc,
                ICD10_3_Code: item?.ICD10_3_Code,
                ...item // Include the entire object for later use
            }))

            setSuggestions(suggestionData);

        } catch (error) {
            console.error(error);
        }
    };
    console.log(suggestions);

    const SearchByICDDescgetData = (event) => {
        const { query } = event;
        SearchByICDDescData(query);
    };

    const yesNoOptions = [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
        { value: "UnKnown", label: "Unknown" }
    ];
    const PatientOptions = [
        { value: "1", label: "Out-patient(OP)" },
        { value: "2", label: "In Patient(IP)" },
        { value: "3", label: "OP and IP" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name==="mobileNo" && value.length > 10) {
            return
        }
        if (name==="pinCode" && value.length > 6) {
            return
        }
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangebySerachByICD = (e, name) => {
        const { value } = e;
        setSearchByICD((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDelete = async (index) => {

        const filteredData = selectedICDData?.icdDetails.filter((_, i) => i !== index);
        setSelectedICDData((prev) => {

            return {
                ...prev,
                icdDetails: filteredData
            }
        });
    }
    const handleReactSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };


    const handleDischargeSummaryBindPatient = async (transactionID) => {
        try {
            // const response = await DischargeSummaryBindPatient(transactionID);
            const response = await getDiagnosisDetailsApi(transactionID);

            // const ipdNo = values?.transactions?.ipdNo;
            // const updatedData = response?.data?.map((item) => ({
            //     ...item,
            //     ipdNo: ipdNo || "", 
            // }));
            if (response?.success) {
                let data = {
                    diagnosis: response?.data?.diagnosis || "",
                    icdDetails: response?.data?.icdDetails?.map((item) => ({
                        "id": 0,
                        "transactionId": item?.ipdNo,
                        "icd_Coding": item?.icd_coding || "",
                        "icd_Descr": item?.icd_Descr || "",
                    })),
                }

                setSelectedICDData(data);
            }
            else {
                setSelectedICDData({
                    diagnosis: "",
                    icdDetails: [],
                });
            }

        } catch (error) {
            console.log(error, "Something Went Wrong");
        }
    };
    const handleDischargeSummaryICDDescriptionSave = async (item) => {
        try {
            const response = await DischargeSummaryICDDescriptionSave({
                icdDescription: [item],
            });

            notify(response?.message, response?.success ? "success" : "error");
            setSearchByICD({ ...searchByICD, searchByICDDecs: "" });
            handleDischargeSummaryBindPatient(item?.tid);
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const handleSelect = (e) => {
        ;
        const selectedValue = e.value;
        let data = {
            id: selectedValue?.icd_id,
            transactionId: String(values?.transactions?.ipdNo),
            icd_Coding: String(selectedValue?.ICD10_Code),
            icd_Descr: String(selectedValue?.WHO_Full_Desc),
        }
        // handleDischargeSummaryICDDescriptionSave(data)
        setSelectedICDData((prev) => {

            return {
                ...prev,
                icdDetails: [...prev.icdDetails, data]
            }
        });
        setSearchByICD({ searchByICDDecs: "" });

    };
    const handleKeyPress = (e) => {

        if (e.key === "Enter" && suggestions.length > 0) {
            const selectedValue = suggestions[0];
            const isDuplicate = selectedICDData.some(
                (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
            );

            if (!isDuplicate) {
                setSelectedICDData((prev) => [...prev, selectedValue]);
                setSearchByICD({ searchByICDDecs: "" }); // Clear the input
                setError(""); // Clear any previous error
            } else {
                const errorMessage = "This ICD code has already been added.";
                setError(errorMessage); // Set the error state
                setSearchByICD({ searchByICDDecs: "" }); // Clear the input
                notify(errorMessage, "error"); // Notify the user
            }
        }
    };
    const itemTemplate = (item) => (
        <div>
            <strong>{item.WHO_Full_Desc}</strong>
        </div>
    );

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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }

    };

    const handleSearch = async () => {
        try {
            const res = await nonCancerSearchPatientApi(values?.patientID)
            if (res?.success) {
                console.log(res);
                setValues((prev) => ({
                    ...prev,
                    uhid: res?.data?.patientID || "",
                    title: res?.data?.title || "",
                    pName: res?.data?.name || "",
                    age: res?.data?.age || "",
                    gender: res?.data?.gender || "",
                    fatherName: res?.data?.fatherName || "",
                    motherName: res?.data?.motherName || "",
                    husbandName: res?.data?.husbandName || "",
                    sonName: res?.data?.sonName || "", // note: API uses "sonName"
                    wifeName: res?.data?.wifeName || "",
                    daughtersName: res?.data?.daughterName || "",
                    registrationDate: res?.data?.dateOfRegistration === "0001-01-01" ? "" : res?.data?.dateOfRegistration || "",
                    departmentName: res?.data?.name_of_department || "",
                    physicianName: res?.data?.name_of_physicianId || "",
                    mobileNo: res?.data?.telephone || "",
                    dateOfFirstDiagnosis: res?.data?.dateOfFirstDiagnosis === "0001-01-01" ? "" : res?.data?.dateOfFirstDiagnosis || "",
                    houseNo: res?.data?.houseNo || "",
                    streetName: res?.data?.street || "",
                    locality: res?.data?.locality || "",
                    city: res?.data?.city || "",
                    state: res?.data?.stateId || "",
                    district: res?.data?.districtId || "",
                    pinCode: res?.data?.pinCode || "",
                    durationOfStay: res?.data?.stayPeriod || 0,
                    telephone: res?.data?.telephone || "",
                    remarks: res?.data?.remarks || "",
                    caseRegisteredAs: res?.data?.case_Registered_As || "",
                    gramPanchayat: res?.data?.gramPanchayat || "",
                    tehsil: res?.data?.subUnitDistrict || "", 
                    localAddress: res?.data?.localAddress || "",
                    transactions: { value: res?.data?.transactions[0]?.transactionID, ...res?.data?.transactions[0] } || "",
                }));

                setDropDown((prev) => ({
                    ...prev,
                    transactionList: handleReactSelectDropDownOptions(res?.data?.transactions, "ipdNo", "transactionID")
                }))

            } else {
                notify(res?.message, "warn")
            }
        } catch (error) {
            notify(error?.message, "warn")

        }
    }

    const handleSave = async () => {
        if (!values?.patientID) {
            return notify("Please Search Patient", "warn")
        }
        debugger
        const payload = {
            patient_ID: values.patientID || "",
            title: values.title || "",
            name: values.pName || "",
            age: values.age?.replace(" YRS", "") || "", // remove 'YRS'
            gender: values.gender || "",
            fatherName: values.fatherName || "",
            motherName: values.motherName || "",
            sonName: values.sonName || "",
            daughterName: values.daughtersName || "",
            husbandName: values.husbandName || "",
            wifeName: values.wifeName || "",
            houseNo: values.houseNo || "",
            street: values.streetName || "",
            locality: values.locality || "",
            city: values.city || "",
            pinCode: values.pinCode || "",
            gramPanchayat: values.gramPanchayat || "",
            subUnitDistrict: values.tehsil || "",
            state: values.state?.label ? values.state?.label : values.state || "",
            stateId: values.state?.value ? values.state?.value : values.state || "",
            district: values.district?.label ? values.district?.label : values.district || "",
            districtId: values.district?.value ? values.district?.value : values.district || "",
            stayPeriod: values.durationOfStay || 0,
            telephone: values.mobileNo || "",
            localAddress: values.localAddress || "",
            remarks: values?.remarks || "",
            case_Registered_As: values?.caseRegisteredAs?.value ? values?.caseRegisteredAs?.value : values?.caseRegisteredAs || "",
            name_of_department: values?.departmentName || "",
            date_of_Registraton: values.registrationDate ? moment(values.registrationDate).format("YYYY-MM-DD") : "",
            date_of_First_Diagnosis: values.dateOfFirstDiagnosis ? moment(values.dateOfFirstDiagnosis).format("YYYY-MM-DD") : "",
            userID: "",
            icD_Code: "",
            transaction_ID: values?.transactions?.value || "",
            name_of_physicianId: values?.physicianName?.value ? values?.physicianName?.value : values?.physicianName || "",
            icdDetails: selectedICDData?.icdDetails?.map((item) => ({
                id: item?.id,
                transactionId: values?.transactions?.value,
                icd_Coding: item?.icd_Coding,
                icd_Descr: item?.icd_Descr
            })) || [],

        };
        // 
        try {
            const res = await nonCancerPatientSaveApi(payload);
            if (res?.success) {
                notify(res?.message, "success")
            } else {
                notify(res?.message, "warn")

            }
        } catch (error) {
            notify(error?.message, "warn")
        }
    }
    // const selectedState =
    //     typeof values?.state === "string"
    //         ? dropdown?.state.find((opt) => opt.label === values.state) || null
    //         : values?.state;


    useEffect(() => {
        // 
        if (values?.transactions?.value) {
            // getICDTable(values?.transactions?.value)
            handleDischargeSummaryBindPatient(values?.transactions?.value);
        }
    }, [values?.transactions])
    return (
        <div className="card patient_registration">
            <>
                <Heading title={t("Cancer Registration")} isBreadcrumb={true} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        lable={t("UHID")}
                        placeholder=" "
                        id="patientID"
                        name="patientID"
                        onChange={handleChange}
                        value={values?.patientID}
                        required={true}
                        respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                        // onKeyDown={Enterfunctionality}
                        onKeyDown={handleKeyDown}
                    />

                    <div className=" col-sm-2">
                        <button className="btn btn-sm btn-success"
                            onClick={handleSearch}
                        >
                            {t("Search")}
                        </button>
                    </div>
                </div>
            </>
            <>
                <Heading title={t("Patient Details")} isBreadcrumb={false} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("UHID")}
                                value={values?.uhid}
                            />
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                        <div className="w-xl-50  w-md-100 w-100">
                            <LabeledInput
                                label={t("Patient Name")}
                                value={values?.pName}
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
                    <Input
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
                        id="sonName"
                        name="sonName"
                        onChange={handleChange}
                        value={values?.sonName}
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
                    />
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
                        dynamicOptions={PatientOptions}
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
                        name="physicianName"
                        value={values?.physicianName?.value ? values?.physicianName?.value : values?.physicianName}
                        dynamicOptions={GetBindAllDoctorConfirmationData.map((item) => ({
                            label: item?.Name,
                            value: item?.DoctorID,
                        }))}
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
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

                </div>
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
                    {console.log(dropdown)}
                    <ReactSelect
                        placeholderName={t("Select State")}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        requiredClassName={"required-fields"}
                        id={"State"}
                        searchable={true}
                        name={"state"}
                        dynamicOptions={
                            dropdown?.state?.filter(
                                (item) => item.CountryID == 14)
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
                                                : parseInt(values?.state))
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
                    {/* <ReactSelect
                        placeholderName={"Select City"}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        id={"City"}
                        requiredClassName={"required-fields"}
                        searchable={true}
                        name={"city"}
                        dynamicOptions={
                            values?.state && values?.district
                                ? dropdown?.city
                                    ?.filter(
                                        (item) =>
                                            item.StateID ===
                                            (values?.state?.value
                                                ? parseInt(values?.state?.value)
                                                : values?.state) &&
                                            item.DistrictID ===
                                            (values?.district?.value
                                                ? parseInt(values?.district?.value)
                                                : values?.district)
                                    )
                                    .map((item) => ({
                                        label: item.TextField,
                                        value: item.ValueField,
                                        ...item
                                    }))
                                : []
                        }
                        handleChange={handleReactSelectoptionDep}
                        value={values?.city}
                        removeIsClearable={false}
                    /> */}
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
                    {/*
                    <ReactSelect
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
                    <div className='col-xl-4 col-md-6 col-sm-4 col-12 '>
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
                    <div className='col-xl-4 col-md-6 col-sm-4 col-12 '>
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
                    <div className='col-xl-4 col-md-6 col-sm-4 col-12 '>
                        <TextAreaInput
                            // className="form-control"
                            lable={t("Remarks")}
                            placeholder=" "
                            id="Remarks"
                            name="remarks"
                            onChange={handleChange}
                            value={values?.remarks}
                            required={true}
                            // className="col-xl-12 col-md-12 col-sm-4 col-12 "
                            onKeyDown={Tabfunctionality}
                            rows={2}
                        />
                    </div>

                </div>
            </>
            <>
                <Heading title={t("Ipd Detail")} isBreadcrumb={false} />
                <div className="row  p-2 ">
                    <ReactSelect
                        placeholderName={t("Select Transaction ID")}
                        id="transactions"
                        name="transactions"
                        value={values?.transactions?.value ? values?.transactions?.value : values?.transactions}
                        dynamicOptions={
                            dropdown?.transactionList
                        }
                        searchable={true}
                        removeIsClearable={true}
                        handleChange={handleReactSelect}
                        respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                        onKeyDown={Tabfunctionality}
                    />
                    {console.log(values?.transactions?.value, "values?.transactions?.value")}
                    <div className='col-xl-10 col-md-6 col-sm-4 col-12 '>

                        {/* <TextAreaInput
                            lable={t("diagnosis")}
                            placeholder=" "
                            id="diagnosis"
                            disabled={true}
                            value={selectedICDData?.diagnosis}
                            rows={2}
                        // dangerouslySetInnerHTML={{ __html: selectedICDData?.diagnosis }}
                        /> */}
                        <div className="labelPicker">Diagnosis</div>
                        <div className="valueName"
                            style={{
                                border: "1px solid grey",
                                padding: "5px",
                            }}
                            dangerouslySetInnerHTML={{ __html: selectedICDData?.diagnosis }}
                        />



                    </div>
                    {console.log(selectedICDData, "selectedICDData")}

                </div>
                <div>
                    <Heading title={t("ICD Coding")} isBreadcrumb={false} />
                    <div className='row  row-cols-lg-7 row-cols-md-2 row-cols-1 p-2'>

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
                            itemTemplate={itemTemplate}
                        />
                        <div className='m-auto'>
                            <button className='btn btn-primary' onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                    {/* <ICDDaignosisDescription tbody={selectedICDData} handleDelete={handleDelete} /> */}

                    <Tables
                        thead={THEAD}
                        tbody={selectedICDData?.icdDetails?.map((ele, index) => ({
                            "S.No": index + 1,
                            "trans": ele?.transactionId,
                            "ICD_Code": ele?.icd_Coding,
                            "ICD_Desc": ele?.icd_Descr,
                            "Remove": (
                                <>
                                    <i className='fa fa-trash text-danger text-center' style={{ color: "red", padding: "6px", cursor: "pointer" }} onClick={(e) => handleDelete(index)}></i>
                                </>
                            ),
                        }))}
                        tableHeight={"tableHeight"}
                    />
                </div>
            </>
        </div>
    )
}

export default CancerRegistrationFormIPD;