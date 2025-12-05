import React, { useEffect, useState } from 'react'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'
import { BindEmployeeApproval, deleteTechnicianDoctorDefaultMappingApi, getAllActiveTechnicianDoctorMappingsApi, technicianDoctorDefaultMappingApi } from '../../../networkServices/edpApi';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useTranslation } from 'react-i18next';
import { BindAllApprovalDoctorEmployeeWiseApi, GetRadiologyAndDoctor } from '../../../networkServices/resultEntry';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import Heading from '../../../components/UI/Heading';
import moment from 'moment';

import { useSelector } from 'react-redux';
const DoctorDefaultList = () => {

    const { GetRoleList } = useSelector(
        (state) => state?.CommonSlice
    );
    console.log(GetRoleList);


    const [t] = useTranslation();
    const Thead = [
        { width: "5%", name: t("Sr.No") },
        { width: "15%", name: t("technicianName") },
        { width: "15%", name: t("doctor1 Name") },
        { width: "10%", name: t("doctor2 Name") },
        { width: "15%", name: t("doctor3 Name") },
        { width: "15%", name: t("roleName") },
        { width: "15%", name: t("Action") },
    ];
    const Thead1 = [
        { width: "5%", name: t("Sr.No") },
        { width: "15%", name: t("technicianName") },
        { width: "15%", name: t("doctor1 Name") },
        { width: "10%", name: t("doctor2 Name") },
        { width: "15%", name: t("doctor3 Name") },
        { width: "15%", name: t("roleName") },
        { width: "15%", name: t("entry Date") },
        { width: "15%", name: t("entryBy") },
        { width: "15%", name: t("Action") },
    ];
    const userData = useLocalStorage("userData", "get");

    const [bindDoctordata, setBindDoctor] = useState([]);
    const [bindDoctor, setBindDoctordata] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [bindRoledata, setBindRoledata] = useState([]);
    const [values, setValues] = useState({
        doctor1: "",
        technician: { label: "", value: userData?.employeeID } || "",
        bindRole: "",
        doctor2: "",
        doctor3: ""
    })
    const [doctorList, setDoctorList] = useState([]);
    const [dataList, setData] = useState([]);
    const handleSelect = (name, value) => {
        // setValues((prev) => ({ ...prev, [name]: value }));

        setValues((prev) => {
            if (name === "doctor2" && prev.doctor3?.value === value?.value) {
                notify("Doctor 2 and Doctor 3 cannot be the same", "warn");
                return prev;
            }
            if (name === "doctor3" && prev.doctor2?.value === value?.value) {
                notify("Doctor 2 and Doctor 3 cannot be the same", "warn");
                return prev;
            }

            return { ...prev, [name]: value };
        });
    };

    const handleBindEmployeeApproval = async () => {
        try {
            const response = await BindEmployeeApproval();
            if (response.success) {
                setEmployee(response?.data);
            } else {
                setBindDoctorData([]);
            }
        } catch (error) {
            setBindDoctorData([]);
        }
    };

    const BindDoctorApi = async () => {
        try {
            const response = await GetRadiologyAndDoctor(userData.defaultRole);

            if (response.success) {
                setBindDoctordata(response?.data);
            } else {
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
        }
    };

    const handleAddList = () => {
        if (!values?.technician) {
            return notify("Please Select Technician", "warn");
        }
        if (!values?.bindRole) {
            return notify("Please Select Login Type", "warn");
        }
        if (!values?.doctor1) {
            return notify("Please Select Doctor 1", "warn");
        }
        // if (!values?.doctor2) {
        //     return notify("Please Select Doctor 2", "warn");
        // }
        // if (!values?.doctor3) {
        //     return notify("Please Select Doctor 3", "warn");
        // }


        const newEntry = {
            doctor1Id: values?.doctor1?.value || "",
            doctor1Name: values?.doctor1?.label || "",
            doctor2Id: values?.doctor2?.value || "",
            doctor2Name: values?.doctor2?.label || "",
            doctor3Id: values?.doctor3?.value || "",
            doctor3Name: values?.doctor3?.label || "",
            technicianID: values?.technician?.value || "",
            technicianName: employee?.find((emp) => emp?.employeeID === values?.technician?.value)?.name || "",
            roleID: values?.bindRole?.value || "",
            roleName: values?.bindRole?.label || "",
        };
        setDoctorList((prev) => [...prev, newEntry]);

        setValues((prev) => ({
            ...prev,
            technician: { label: newEntry?.technicianName, value: newEntry?.technicianID },
            doctor1: "",
            doctor2: "",
            doctor3: "",
            bindRole: "",
        }));
    }
    const getDoctor = async (employeeID, roleID) => {
        console.log(employeeID, roleID);
        try {
            const response = await BindAllApprovalDoctorEmployeeWiseApi(employeeID, roleID);
            if (response.success) {
                setBindDoctor(response?.data);
            } else {
                setBindDoctor([]);
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        if (values?.bindRole?.value != null) {         
            getDoctor(values?.technician?.value, values?.bindRole?.value)
        }

    }, [values?.bindRole?.value])

    const handleRemove = (index) => {
        setDoctorList((prev) => prev.filter((_, i) => i !== index));
    };

    const getDoctorList = async () => {
        try {
            const response = await getAllActiveTechnicianDoctorMappingsApi();
            if (response?.success) {
                setData(response?.data)
            } else {
                notify(response?.message, "error")
                setData([])
            }
        } catch (error) {
            notify(error?.message, "warn")
        }
    }
    const handleSave = async () => {
        try {
            const response = await technicianDoctorDefaultMappingApi(doctorList)
            if (response?.success) {
                notify(response?.message, "success")
                getDoctorList()
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleRemoveItem = async (item) => {
        try {
            const resp = await deleteTechnicianDoctorDefaultMappingApi(item?.id)
            if (resp?.success) {
                notify(resp?.message,"success")
                getDoctorList()
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    useEffect(() => {
        // handleBindDoctor()
        BindDoctorApi()
        handleBindEmployeeApproval();
        getDoctorList()
    }, [])


    return (
        <div className="card">
            <Heading isBreadcrumb={true} isSlideScreen={true} title={t("/Laboratory Management/Doctor Default List")} />
            <div className="row p-2">
                <ReactSelect
                    requiredClassName={"required-fields"}
                    placeholderName={t("Technician")}
                    id={"technician"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    name="technician"
                    dynamicOptions={[
                        ...handleReactSelectDropDownOptions(employee, "name", "employeeID"),
                    ]}
                    isDisabled={values?.technician?.value}
                    handleChange={handleSelect}
                    value={`${values?.technician?.value}`}
                />
                <ReactSelect
                    placeholderName={t("Login Type")}
                    id={"bindRole"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    name="bindRole"
                    requiredClassName={"required-fields"}
                    // dynamicOptions={[
                    //     ...handleReactSelectDropDownOptions(bindRoledata, "RoleName", "ID"),
                    // ]}
                    dynamicOptions={GetRoleList?.map((ele) => {
                        return {
                            label: ele?.roleName,
                            value: ele?.roleID,
                        };
                    })}
                    handleChange={handleSelect}
                    value={`${values?.bindRole}`}
                />

                <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect1"
                    searchable={true}
                    requiredClassName={"required-fields"}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                        // { value: "0", label: "select" },
                        ...handleReactSelectDropDownOptions(
                            bindDoctordata,
                            "Name",
                            "EmployeeID"
                        ),
                    ]}
                    handleChange={handleSelect}
                    value={values?.doctor1?.value}
                    name="doctor1"
                />
                <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect2"
                    // requiredClassName={"required-fields"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                        // { value: "0", label: "select" },
                        ...handleReactSelectDropDownOptions(
                            bindDoctor,
                            "DoctorName",
                            "DoctorID"
                        ),
                    ]}
                    handleChange={handleSelect}
                    value={values?.doctor2?.value}
                    name="doctor2"
                />
                <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect3"
                    // requiredClassName={"required-fields"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                        // { value: "0", label: "select" },
                        ...handleReactSelectDropDownOptions(
                            bindDoctor,
                            "DoctorName",
                            "DoctorID"
                        ),
                    ]}
                    handleChange={handleSelect}
                    value={values?.doctor3?.value}
                    name="doctor3"
                />

                <button
                    className="btn btn-lg btn-success ml-2"
                    type="button"
                    onClick={handleAddList}
                >
                    {t("Add")}
                </button>
            </div>
            {doctorList?.length > 0 && (
                <>
                    <Heading title={"Doctor Added List"} isBreadcrumb={false} />
                    <div className="card">
                        <Tables
                            thead={Thead}
                            tbody={doctorList?.map((item, index) => ({
                                sno: index + 1,
                                technicianName: item?.technicianName,
                                doctor1: item?.doctor1Name,
                                doctor2: item?.doctor2Name,
                                doctor3: item?.doctor3Name,
                                roleName: item?.roleName,
                                Action: (
                                    <button className='btn btn-primary' onClick={() => handleRemove(index)}>
                                        Remove
                                    </button>
                                )
                            }))}
                        />
                        <div className='text-right p-2'>
                            <button className='btn btn-primary' onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </>
            )
            }
            {dataList?.length > 0 && (
                <div>
                    <Heading title={"Doctor List"} isBreadcrumb={false} />
                    <div className="card ">
                        <Tables
                            thead={Thead1}
                            tbody={dataList?.map((item, index) => ({
                                sno: index + 1,
                                technicianName: item?.technicianName,
                                doctor1: item?.doctor1Name,
                                doctor2: item?.doctor2Name,
                                doctor3: item?.doctor3Name,
                                roleName: item?.roleName,
                                entryDate: item?.enteredDate && moment(item?.enteredDate).format("DD-MM-YYYY"),
                                entryBy: item?.entryByName,
                                Action: (
                                    <button className='btn btn-primary' onClick={() => handleRemoveItem(item)}>
                                        Remove
                                    </button>
                                )
                            }))}
                        />

                    </div>
                </div>
            )
            }
        </div >
    )
}

export default DoctorDefaultList