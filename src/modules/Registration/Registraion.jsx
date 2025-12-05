import React, { useEffect, useState } from 'react'
import Input from '../../components/formComponent/Input';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../components/formComponent/ReactSelect';
import DatePicker from '../../components/formComponent/DatePicker';
import TextAreaInput from '../../components/formComponent/TextAreaInput';
import { centreWiseCacheDisplayApi, createPreRegistrationApi, getPreRegistrationByMobileApi } from '../../networkServices/registrationApi';
import moment from 'moment';
import { notify } from '../../utils/ustil2';
import Tables from '../../components/UI/customTable';
import './style.css'
import { Checkbox } from 'primereact/checkbox';

const Registraion = () => {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [values, setValues] = useState({
        relationId: "",
        relationName: "",
        mobileNo: "",
        dob: "",
        Country:{label:"India",value:14},
        State: {label:"Punjab",value:326},
        District: {label:"Ludhiana",value:486},
        City: null,
        pinCode: "",
        religion: ""
    })
    const dependencyMap = {
        Country: ["State", "District", "City"],
        State: ["District", "City"],
        District: ["City"],
    };
    const [dropdown, setDropDown] = useState({
        relation: [],
        title: [],
        marital: [],
        country: [],
        state: [],
        district: [],
        city: []
    })
    const [list, setList] = useState([])
    const [showForm, setShowForm] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const religionOption = [
        { label: "Hinduism", value: "Hinduism" },
        { label: "Christianity", value: "Christianity" },
        { label: "Sikhism", value: "Sikhism" },
        { label: "Islam", value: "Islam" },
        { label: "Jainism", value: "Jainism" },
        { label: "Buddhism", value: "Buddhism" },
        { label: "Zoroastrianism", value: "Zoroastrianism" },
    ]
    const [checkbox, setCheckbox] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    const handleChangeNumber = (e) => {
        const { name, value, maxLength, type } = e.target;

        let newValue = value;

        if (type === "number") {
            newValue = newValue.replace(/\D/g, "");

            if (maxLength && newValue.length > maxLength) {
                newValue = newValue.slice(0, maxLength);
            }
        }

        setValues({
            ...values,
            [name]: newValue,
        });
    }
    const handleReactSelect = (name, e, secondName) => {
        setValues({
            ...values,
            [name]: e?.value,
            [secondName]: e.label,
        });
    };
    const handleReactSelectoption = (name, e) => {
        setValues({
            ...values,
            [name]: e
        })
    }

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


    const handleSearch = async (no) => {
        if (!values?.RegNo) {
            notify("Enter Register Mobile No", "warn")
            return;
        }
        if (values?.RegNo.length < 10) {
            notify("Enter 10 Digit Register Mobile No", "warn")
            return;
        }
        setProceedStatus('success');
        try {

            const response = await getPreRegistrationByMobileApi(String(values?.RegNo || no))
            if (response?.success) {
                setList(response?.data)
                setShowForm(false)
                setShowRegistrationForm(false);
            } else {
                setList([])
                setShowForm(false)
                handleAddNew()
                setShowRegistrationForm(true);
            }
        } catch (error) {
            notify(error?.message, "error")
        }
        finally {
            setTimeout(() => {
                setProceedStatus('default');
            }, 2000);
        }
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        // e.stopPropagation();
        console.log(values);
        debugger
        if (!values?.title) {
            notify("Enter Title Name", "warn")
            return

        }
        if (!values?.firstName) {
            notify("Enter First Name", "warn")
            return
        }
        // if (!values?.lastName) {
        //     notify("Enter Last Name", "warn")
        //     return
        // }
        if (!values?.dob) {
            notify("Please Select DOB", "warn")
            return
        }
        if (!values?.gender) {
            notify("Please Select Gender", "warn")
            return
        }
        if (!values?.Country?.value) {
            notify("Please Select Country", "warn")
            return
        }
        if (!values?.State?.value) {
            notify("Please Select State", "warn")
            return
        }
        if (!values?.District?.value) {
            notify("Please Select District", "warn")
            return
        }
        if (!values?.City?.value) {
            notify("Please Select City", "warn")
            return
        }
        
        if (!values?.religion) {
            notify("Please Select Religion", "warn")
            return
        }

        if (!values?.mobileNo) {
            notify("Enter Mobile No", "warn")
            return
        }
        // if (!values?.emergency) {
        //     notify("Enter Emergency Contact No", "warn")
        //     return
        // }
        // if (values?.emergency.length > 10) {
        //     notify("Enter 10 Digit Emergency Contact No", "warn")
        //     return
        // }
        if (!values?.relationName) {
            notify("Enter Relation Name", "warn")
            return
        }
        // if (!values?.RelationMobNo) {
        //     notify("Enter Relation Mobile No", "warn")
        //     return
        // }
        // if (values?.emergency.length < 10) {
        //     notify("Enter 10 digit Emergency Mobile No", "warn")
        //     return
        // }
        // if (values?.RelationMobNo.length < 10) {
        //     notify("Enter 10 digit Relation Mobile No", "warn")
        //     return
        // }
if(!values?.relation?.value){
  notify("Please Select Relation  Of", "warn")
            return
}

        const data = {
            mobileNo: values?.mobileNo ?? "",
            title: values?.title ?? "",
            firstName: values?.firstName?.toUpperCase() ?? "",
            lastName: values?.lastName?.toUpperCase() ?? "",
            dob: values?.dob ? moment(values?.dob).format("YYYY-MM-DD") : "",
            gender: values?.gender ?? "",
            emailId: values?.email ?? "",
            emergency: values?.emergency ?? "",
            address: values?.House_No ?? "",
            isSame: checkbox === true ? 1:0,
            PermanentAddress: values?.parmanentAddress ?? "",
            religion: values?.religion ?? "",
            pinCode: values?.pinCode ?? "",
            patientId: "",
            relationOfId: values?.relation?.value ? values?.relation?.value : values?.relationId ?? "",
            relationName: values?.relation?.label ? values?.relation?.label : values?.relationName ?? "",
            relationOfName: values?.relationName ?? "",
            entryBy: values?.firstName ?? "",
            maritalStatus: values?.Maritial ?? "",
            relationPhone: values?.RelationMobNo ?? "",
            cityName: values?.City?.label ? values?.City?.label : "",
            cityId: values?.City?.value ? values?.City?.value : "",
            districtId: values?.District?.value ? values?.District?.value : "",
            districtName: values?.District?.label ? values?.District?.label : "",
            countryId: values?.Country?.value ? values?.Country?.value : "",
            countryName: values?.Country?.label ? values?.Country?.label : "",
            stateId: values?.State?.value ? values?.State?.value : "",
            stateName: values?.State?.label ? values?.State?.label : "",
        }

        try {
            const response = await createPreRegistrationApi(data);
            if (response?.success) {
                notify(response?.message, "success")
                setShowForm(false)
                handleSearch(data?.mobileNo)
                setValues({})
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {

            notify(error?.message, "error")
        }
    }



    const fetchTitle = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {
                // map API response -> ReactSelect format
                const formattedOptions = res.data.map((item) => ({
                    label: item?.TextField,
                    value: item?.ValueField,
                }));

                setDropDown((prev) => ({
                    ...prev,
                    title: formattedOptions,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchRelation = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {

                const formattedOptions = res.data.map((item) => ({
                    label: item?.TextField,
                    value: item?.Id,
                }));

                setDropDown((prev) => ({
                    ...prev,
                    relation: formattedOptions,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchMarital = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {

                const formattedOptions = res.data.map((item) => ({
                    label: item?.TextField,
                    value: item?.ValueField,
                }));

                setDropDown((prev) => ({
                    ...prev,
                    marital: formattedOptions,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchCountry = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {

                // const formattedOptions = res.data.map((item) => ({
                //     label: item?.TextField,
                //     value: item?.ValueField,
                // }));

                setDropDown((prev) => ({
                    ...prev,
                    country: res?.data,
                }));
            } else {
                notify(res?.message, "error")

            }
        } catch (error) {
            notify(res?.error, "error")

        }
    }
    const fetchState = async (type) => {
        try {
            const res = await centreWiseCacheDisplayApi(type)
            if (res?.success && Array.isArray(res?.data)) {

                // const formattedOptions = res.data.map((item) => ({
                //     label: item?.TextField,
                //     value: item?.Id,
                // }));

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

                // const formattedOptions = res.data.map((item) => ({
                //     label: item?.TextField,
                //     value: item?.Id,
                // }));

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

                // const formattedOptions = res.data.map((item) => ({
                //     label: item?.TextField,
                //     value: item?.Id,
                // }));

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
    const handleAdd = () => {
        setShowForm(true);
        setValues((prev) => ({
            ...prev,
            mobileNo: list[0]?.mobileNo,
        }))
    };
    const handleAddNew = () => {
        setValues((prev) => ({
            ...prev,
            mobileNo: values?.RegNo,
        }))
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;

        setCheckbox(checked);

        if (checked) {
            setValues((prev) => ({
                ...prev,
                parmanentAddress: prev.House_No || "",
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                parmanentAddress: "",
            }));
        }
    };
    useEffect(() => {
        fetchTitle("Title")
        fetchRelation("Realtion")
        fetchMarital("MaritalStatus")
        fetchCountry("Country")
        fetchState("State")
        fetchDistrict("District")
        fetchCity("City")
    }, [])

    const renderRegistration = () => {
        return (
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-9">
                    <div className="card registration-card">
                        <div className="card-header1 text-center">
                            <h1 className="mb-0 fw-bold font-size1">
                                <i className="bi-people me-3 mr-2"></i>
                                Registration Form
                            </h1>

                        </div>

                        <div className="card-body p-4 p-md-5">
                            <form
                                className={`needs-validation ${isValidated ? 'was-validated' : ''}`}
                                // noValidate
                                onSubmit={handleRegister}
                            >

                                {/* Personal Information Section */}
                                <div className="mb-5">
                                    <h4 className="section-title ">
                                        <i className="bi-person me-2"></i>
                                        Personal Information
                                    </h4>

                                    <div className="row">

                                        <ReactSelect
                                            placeholderName={t("title")}
                                            requiredClassName={"required-fields"}
                                            respclass={"col-lg-2 col-12 mb-2"}
                                            id={"title"}
                                            searchable={true}
                                            customHeight={30}
                                            name={"title"}
                                            dynamicOptions={dropdown?.title}
                                            handleChange={(name, e) =>
                                                handleReactSelect(name, e, "title")
                                            }
                                            value={values?.title}
                                            removeIsClearable={true}
                                        />
                                        <Input
                                            type="text"
                                            className="form-control1 required-fields mb-2"
                                            id="First Name"
                                            name="firstName"
                                            value={values?.firstName ? values?.firstName.toUpperCase() : ""}
                                            onChange={handleChange}
                                            lable={t("Enter First Name")}
                                            placeholder=" "
                                            respclass="col-12 col-lg-5 mb-2"

                                        />

                                        <Input
                                            type="text"
                                            className="form-control1"
                                            id="Last Name"
                                            name="lastName"
                                            value={values?.lastName ? values?.lastName.toUpperCase() : ""}
                                            onChange={handleChange}
                                            lable={t("last Name")}
                                            placeholder=" "
                                            respclass="col-lg-5 col-12 mb-2"

                                        />
                                        <DatePicker
                                            className="custom-calendar required-fields"
                                            id="dob"
                                            name="dob"
                                            value={values?.dob}
                                            handleChange={handleChange}
                                            lable={t("dob")}
                                            placeholder={VITE_DATE_FORMAT}
                                            respclass={"col-12 col-lg-4 mb-2"}
                                        />
                                        <ReactSelect
                                            placeholderName={"Gender"}
                                            respclass={"col-12 col-lg-4 mb-2"}
                                            requiredClassName={"required-fields"}
                                            id={"Gender"}
                                            searchable={true}
                                            name={"gender"}
                                            customHeight={30}
                                            dynamicOptions={[
                                                { label: "Male", value: "M" },
                                                { label: "Female", value: "F" },
                                                { label: "Other", value: "O" },
                                            ]}
                                            handleChange={(name, e) =>
                                                handleReactSelect(name, e, "gender")
                                            }
                                            value={values?.gender}
                                            removeIsClearable={true}
                                        />

                                        <ReactSelect
                                            placeholderName={"Maritial Status"}
                                            respclass={"col-12 col-lg-4 mb-2"}
                                            id={"Maritial"}
                                            searchable={true}
                                            name={"Maritial"}
                                            customHeight={30}
                                            dynamicOptions={dropdown?.marital}
                                            handleChange={(name, e) =>
                                                handleReactSelect(name, e, "Maritial")
                                            }
                                            value={values?.Maritial}
                                            removeIsClearable={true}
                                        />

                                        <ReactSelect
                                            placeholderName={"Select Country"}
                                            requiredClassName={"required-fields"}
                                            respclass={"col-md-4 mb-2"}
                                            id={"Country"}
                                            searchable={true}
                                            name={"Country"}
                                            customHeight={30}
                                            dynamicOptions={
                                                dropdown?.country?.map((item) => ({
                                                    label: item.TextField,
                                                    value: item.ValueField,
                                                    ...item // keep original fields if needed later
                                                }))
                                            }
                                            handleChange={handleReactSelectoptionDep}
                                            value={values?.Country?.value ? values?.Country?.value:values?.Country}
                                            removeIsClearable={false}
                                        />
                                        <ReactSelect
                                            placeholderName={"Select State"}
                                            respclass={"col-md-4 mb-2"}
                                            requiredClassName={"required-fields"}
                                            id={"State"}
                                            searchable={true}
                                            name={"State"}
                                            customHeight={30}
                                            dynamicOptions={
                                                values?.Country
                                                    ? dropdown?.state
                                                        ?.filter(
                                                            (item) =>
                                                                item.CountryID ===
                                                                (values?.Country?.value
                                                                    ? parseInt(values?.Country?.value)
                                                                    : values?.Country)
                                                        )
                                                        .map((item) => ({
                                                            label: item.TextField,
                                                            value: item.ValueField,
                                                            ...item
                                                        }))
                                                    : []
                                            }
                                            handleChange={handleReactSelectoptionDep}
                                            value={values?.State?.value ?values?.State?.value :values?.State}
                                            removeIsClearable={false}
                                        />
                                        <ReactSelect
                                            placeholderName={"Select District"}
                                            respclass={"col-md-4 mb-2"}
                                            id={"District"}
                                            requiredClassName={"required-fields"}
                                            searchable={true}
                                            name={"District"}
                                            customHeight={30}
                                            dynamicOptions={
                                                values?.State
                                                    ? dropdown?.district
                                                        ?.filter(
                                                            (item) =>
                                                                item.CountryID ===
                                                                (values?.Country?.value
                                                                    ? parseInt(values?.Country?.value)
                                                                    : values?.Country) &&
                                                                item.StateID ===
                                                                (values?.State?.value
                                                                    ? parseInt(values?.State?.value)
                                                                    : values?.State)
                                                        )
                                                        .map((item) => ({
                                                            label: item.TextField,
                                                            value: item.ValueField,
                                                            ...item
                                                        }))
                                                    : []
                                            }
                                            handleChange={handleReactSelectoptionDep}
                                            value={values?.District?.value ? values?.District?.value :values?.District}
                                            removeIsClearable={false}
                                        />
                                        <ReactSelect
                                            placeholderName={"Select City"}
                                            respclass={"col-md-4 mb-2"}
                                            id={"City"}
                                            requiredClassName={"required-fields"}
                                            searchable={true}
                                            name={"City"}
                                            customHeight={30}
                                            dynamicOptions={
                                                values?.State && values?.District
                                                    ? dropdown?.city
                                                        ?.filter(
                                                            (item) =>
                                                                item.StateID ===
                                                                (values?.State?.value
                                                                    ? parseInt(values?.State?.value)
                                                                    : values?.State) &&
                                                                item.DistrictID ===
                                                                (values?.District?.value
                                                                    ? parseInt(values?.District?.value)
                                                                    : values?.District)
                                                        )
                                                        .map((item) => ({
                                                            label: item.TextField,
                                                            value: item.ValueField,
                                                            ...item
                                                        }))
                                                    : []
                                            }
                                            handleChange={handleReactSelectoptionDep}
                                            value={values?.City}
                                            removeIsClearable={false}
                                        />
                                        <Input
                                            type="number"
                                            className="form-control1 "
                                            id="pinCode"
                                            name="pinCode"
                                            value={values?.pinCode ? values?.pinCode : ""}
                                            onChange={handleChangeNumber}
                                            maxLength={6}
                                            lable={t("pinCode")}
                                            placeholder=" "
                                            respclass="col-md-4 mb-2"
                                        />
                                        <ReactSelect
                                            placeholderName={"Religion"}
                                            respclass={"col-12 col-lg-4 mb-2"}
                                            requiredClassName={"required-fields"}
                                            id={"religion"}
                                            searchable={true}
                                            name={"religion"}
                                            customHeight={30}
                                            dynamicOptions={religionOption}
                                            handleChange={(name, e) =>
                                                handleReactSelect(name, e, "religion")
                                            }
                                            value={values?.religion}
                                            removeIsClearable={true}
                                        />

                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h4 className="section-title">
                                        <i className="bi-phone me-2 mr-2"></i>
                                        Contact Information
                                    </h4>

                                    <div className="row">

                                        <Input
                                            type="text"
                                            className="form-control1"
                                            id="Email"
                                            name="email"
                                            value={values?.email ? values?.email : ""}
                                            onChange={handleChange}
                                            lable={t("email")}
                                            placeholder=" "
                                            respclass="col-12 col-lg-6 mb-2"
                                        />
                                        <Input
                                            type="number"
                                            className="form-control1 required-fields"
                                            id="Mobile"
                                            name="mobileNo"
                                            value={values?.mobileNo ? values?.mobileNo : ""}
                                            onChange={handleChange}
                                            lable={t("mobile No")}
                                            maxLength={10}
                                            placeholder=" "
                                            respclass="col-12 col-lg-6 mb-2"
                                        />


                                    </div>
                                    <label htmlFor="emergencyContact" className="form-label fw-semibold">
                                        <i className="bi-shield-check me-1 mr-2"></i>
                                        Emergency Contact *
                                    </label>


                                    <div className='row'>
                                        <Input
                                            type="number"
                                            className="form-control1"
                                            id="Emergency"
                                            name="emergency"
                                            value={values?.emergency ? values?.emergency : ""}
                                            onChange={handleChangeNumber}
                                            lable={t("Emergency Contact")}
                                            placeholder=" "
                                            maxLength={10}
                                            respclass="col-md-4 mb-2"
                                        />
                                        <ReactSelect
                                            placeholderName={"Relation Of"}
                                            respclass={"col-md-4 mb-2"}
                                            requiredClassName={"required-fields"}
                                            id={"Relation"}
                                            searchable={true}
                                            name={"relation"}
                                            customHeight={30}
                                            dynamicOptions={dropdown?.relation}
                                            handleChange={handleReactSelectoption}
                                            value={values?.relation}
                                            removeIsClearable={true}
                                        />
                                        <Input
                                            type="text"
                                            className="form-control1 required-fields"
                                            id="RelationName"
                                            name="relationName"
                                            value={values?.relationName ? values?.relationName : ""}
                                            onChange={handleChange}
                                            lable={t("relation Name")}
                                            placeholder=" "
                                            respclass="col-md-4 mb-2"
                                        />
                                        <Input
                                            type="number"
                                            className="form-control1"
                                            id="RelationMobNo"
                                            name="RelationMobNo"
                                            value={values?.RelationMobNo ? values?.RelationMobNo : ""}
                                            onChange={handleChangeNumber}
                                            maxLength={10}
                                            lable={t("relation Mobile No")}
                                            placeholder=" "
                                            respclass="col-md-4 mb-2"
                                        />

                                    </div>

                                </div>
                                <div className="mb-5">
                                    <h4 className="section-title">
                                        <i className=" bi-geo-alt me-2 mr-2"></i>
                                        Address Information
                                    </h4>

                                    <div className="row g-4">
                                        {/* <TextAreaInput
                                            type="text"
                                            className={`form-textarea `}
                                            id="flatNo"
                                            name="flatNo"
                                            rows={2}
                                            value={values?.flatNo ? values?.flatNo : ""}
                                            onChange={handleChange}
                                            lable={t("Enter Flat / House No")}
                                            placeholder=" "
                                            respclass="col-12"
                                        />

                                        <TextAreaInput
                                            type="text"
                                            className={`form-textarea `}
                                            id="Address"
                                            name="address"
                                            rows={4}
                                            value={values?.address ? values?.address : ""}
                                            onChange={handleChange}
                                            lable={t("Enter Address")}
                                            placeholder=" "
                                            respclass="col-12"
                                        /> */}

                                        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
                                            <div className="row">
                                                <Input
                                                    type="text"
                                                    id="Local_Address"
                                                    name="House_No"
                                                    value={values?.House_No || ""}
                                                    onChange={handleChange}
                                                    lable={t("Local_Address")}
                                                    placeholder=" "
                                                    respclass="col-11"
                                                    // disabled={isDisableInputs}
                                                    className="form-control1 required-fields"
                                                />


                                                <div className="col-1 d-flex align-items-center justify-content-center registerion-checkbox">
                                                    <Checkbox
                                                        id="checkbox"
                                                        className=""
                                                        name="checkbox"
                                                        onChange={handleCheckboxChange}
                                                        checked={checkbox}
                                                    // disabled={isDisableInputs}

                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <Input
                                            type="text"
                                            className="form-control1 "
                                            id="parmanentAddress"
                                            name="parmanentAddress"
                                            value={values?.parmanentAddress ? values?.parmanentAddress : ""}
                                            onChange={handleChange}
                                            lable={t("Perma_Address")}
                                            placeholder=" "
                                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                                            disabled={checkbox}

                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className={`btn btn-lg px-5 py-3 ${isSubmitting ? 'btn-success' : 'btn-primary'}`}
                                        disabled={isSubmitting}
                                    >
                                        <i className={` ${isSubmitting ? 'bi-check-circle' : 'bi-people'} mr-2`}></i>
                                        {isSubmitting ? 'Registration Successful!' : 'Complete Registration'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


    const THEAD = [
        { name: t("S.No."), width: "5%" },
        { name: t("Request Id."), width: "5%" },
        { name: t("User Name") },
        { name: t("Email") },
        { name: t("Mobile No") },
        { name: t("Patient ID") },
        { name: t("Dob Date") },
        { name: t("Relation Name") },
        // { name: t("EntryBy") },
    ]


    const [mobileHeader, setMobileHeader] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proceedStatus, setProceedStatus] = useState('default');


    // const validateMobileNumber = (value) => {
    //     const mobilePattern = /^[0-9]{10}$/;
    //     return mobilePattern.test(value);
    // };

    return (


        <div className="registration-container1">
            <div className="container">
                <div className="row justify-content-center mb-4">
                    <div className="col-12 col-md-9 col-lg-9">
                        <div className="mobile-registration text-center">
                            <div className="row align-items-center pr-2 pt-1">
                                <div className="col-12 col-md-8  d-flex align-items-center p-0" >
                                    <div className="icon-input p-0">

                                        <Input
                                            type="number"
                                            className="custom-pre-register-input"
                                            id="RegNo"
                                            name="RegNo"
                                            value={values?.RegNo ?values?.RegNo: ""}
                                            lable={t("")}
                                            onChange={handleChangeNumber}
                                            placeholder={t("Register mobile No")}
                                            maxLength={10}
                                            respclass="col-12"
                                        />
                                    </div>

                                </div>
                                <div className="col-md-4 p-0">
                                    <button
                                        className={`custom-pre-register-btn ${proceedStatus === 'success' ? 'btn-success' : 'btn-primary'}`}
                                        onClick={handleSearch}
                                    >
                                        <i className={`${proceedStatus === 'success' ? 'bi-check-circle' : 'bi-person-check'}`}></i>
                                        {proceedStatus === 'success' ? 'Verified' : 'Proceed'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {list.length > 0 && (
                    <div>
                        <div className="col-lg-9 m-auto mt-3 ">
                            <div className='col-12 text-end'>
                                <button
                                    className="col-lg-2 col-2 m-2 btn-lg btn-primary"
                                    onClick={handleAdd}
                                >
                                    Add
                                </button>
                            </div>

                        </div>

                        {!showForm ? (
                            <div className='col-lg-9 col-sm-12 m-auto patient_registration card'>
                                <Tables thead={THEAD}
                                    tbody={list?.map((val, index) => ({

                                        sno: index + 1,
                                        RegId: val?.requestId,
                                        UserName: val?.firstName + " " + val?.lastName,
                                        Email: val?.emailId,
                                        MobNo: val?.mobileNo,
                                        PatientID: val?.patientId ? val?.patientId : "-",
                                        Date: moment(val?.dob).format("DD-MM-YYYY"),
                                        RelationName: val?.relationName,
                                        // entryBy: val?.entryBy,
                                        // BillType: val?.BillType,
                                        // EntryDate: val?.EntryDate,


                                    }))}
                                    tableHeight={"scrollView"}
                                />

                            </div>
                        ) : (
                            <div >
                                {renderRegistration()}
                            </div>
                        )}
                    </div>
                )}
                {showRegistrationForm && !showForm && <>
                    <div>
                        {renderRegistration()}
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export default Registraion;