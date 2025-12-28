import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/formComponent/DatePicker";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";

function RegistrationForm({ handleChangeModel }) {
    const [t] = useTranslation();

    const initialData = {
        studentName: "",
        fatherName: "",
        enquirerName: "",
        mobileNumber: "",
        alternateMobileNumber: "",
        previousSchoolName: "",
        previousClass: "",
        desiredClass: "",
        previousPercentage: "",
        isInterested: true,
        fromDate: new Date(),
        toDate: new Date(),

    }
    const [values, setValues] = useState(initialData);
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

    };
    const handleChange = (e, type, limit = 9999999999999) => {
        debugger
        const { name, value } = e.target

        if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {
            setValues((prev) => ({ ...prev, [name]: value }));
        } else {
            setValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCapitalLatter = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value.toUpperCase()
        }));
    };
    useEffect(() => {
        handleChangeModel(values);
    }, [values]);

    return (
        <>


            <div className="card p-1">
                {/* <Heading title={t("Student Detail for Registration")} isBreadcrumb={false} /> */}
                <div className="row p-2">
                    {/* <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="row d-flex"> */}

                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="First"
                        name="studentName"
                        value={values?.studentName}
                        // onChange={handleChange}
                        lable={t("Student Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        isUpperCase={true}
                        onChange={(e) => handleCapitalLatter(e)}
                    />
                    <Input
                        type="text"
                        onChange={(e) => handleCapitalLatter(e)}
                        id="fatherName"
                        placeholder=" "
                        name="fatherName"
                        className="form-control required-fields"
                        value={values?.fatherName || ""}
                        // onChange={handleChange}
                        lable={t("Father Name")}

                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        // onChange={(e) => handleChange(e)}
                        id="enquirerName"
                        placeholder=" "
                        name="enquirerName"
                        className="form-control required-fields"
                        value={values?.enquirerName || ""}
                        onChange={handleChange}
                        lable={t("Enquirer Name")}

                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        className="form-control required-fields"
                        type="number"
                        placeholder=""

                        id="mobileNumber"
                        name="mobileNumber"
                        value={values?.mobileNumber || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                                setValues({ ...values, mobileNumber: value });
                            }
                        }}
                        // onChange={handleChange}
                        lable={t("Contact No")}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        className="form-control required-fields"
                        type="number"
                        placeholder=""

                        id="alternateMobileNumber"
                        name="alternateMobileNumber"
                        value={values?.alternateMobileNumber || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                                setValues({ ...values, alternateMobileNumber: value });
                            }
                        }}
                        // onChange={handleChange}
                        lable={t("Alt Contact")}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        className="form-control required-fields"
                        type="text"
                        placeholder=""

                        id="previousSchoolName"
                        name="previousSchoolName"
                        value={values?.previousSchoolName || ""}
                        onChange={handleChange}
                        // onChange={handleChange}
                        lable={t("School Name")}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Pre Class")}
                        id={"previousClass"}
                        searchable={true}
                        removeIsClearable={true}
                        dynamicOptions={[
                            { value: "1", label: "I" },
                            { value: "2", label: "II" },
                            { value: "3", label: "III" },
                            { value: "4", label: "IV" },
                            { value: "5", label: "V" },
                            { value: "6", label: "VI" },
                            { value: "7", label: "VII" },

                        ]}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // respclass="col-6"
                        handleChange={handleSelect}
                        value={`${values?.previousClass?.value}`}
                        name={"previousClass"}
                    />
                    <ReactSelect
                        placeholderName={t("Desired class")}
                        id={"desiredClass"}
                        searchable={true}
                        removeIsClearable={true}
                        dynamicOptions={[
                            { value: "1", label: "I" },
                            { value: "2", label: "II" },
                            { value: "3", label: "III" },
                            { value: "4", label: "IV" },
                            { value: "5", label: "V" },
                            { value: "6", label: "VI" },
                            { value: "7", label: "VII" },

                        ]}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // respclass="col-6"
                        handleChange={handleSelect}
                        value={`${values?.desiredClass?.value}`}
                        name={"desiredClass"}
                    />

                    <Input
                        type="text"
                        placeholder=""
                        className="form-control"
                        id="previousPercentage"
                        name="previousPercentage"
                        value={values?.previousPercentage || ""}
                        onChange={handleChange}
                        lable={t("Previous %")}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Is Interested")}
                        id={"isInterested"}
                        searchable={true}
                        removeIsClearable={true}
                        dynamicOptions={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },

                        ]}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // respclass="col-6"
                        handleChange={handleSelect}
                        value={`${values?.isInterested?.value}`}
                        name={"isInterested"}
                    />
                    <Input
                        type="text"
                        placeholder=""
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        value={values?.remarks || ""}
                        onChange={handleChange}
                        lable={t("Previous %")}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                </div>

            </div>
        </>
    );
}

export default RegistrationForm;