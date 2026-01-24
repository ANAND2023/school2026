import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import {
  GetAllAcademicYears,
  GetAllBranches,
  GetAllOrganisation,
  MapAcadmicYearWithEmployee,
} from "../../networkServices/AcademicYear";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import { GetAllUsers } from "../../networkServices/Admin";
import MultiSelectComp from "../formComponent/MultiSelectComp";
import { t } from "i18next";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const AcademicYearMapping = () => {
  const userData = useLocalStorage("userData", "get");

  const intialState = {
    employee: "",
    AcademicYear: [],
    organisationId: "",
  };

  const [values, setValues] = useState(intialState);
  //   console.log(values, "values");

  const [academicYearlist, setAcademicYearlist] = useState([]);
  const [employeelist, setEmployeelist] = useState([]);
  const [organisation, setOrganisation] = useState([]);
  const [branchList, setBranchList] = useState([]);

  const handleSelect = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const AllOrganisation = async () => {
    try {
      const res = await GetAllOrganisation();
      if (res?.success) setOrganisation(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  const getBranchData = async () => {
    const payload = {
      employeeId: "",
      organisationID: values?.organisationId?.value,
      isAll: 1,
    };
    try {
      const res = await GetAllBranches(payload);
      if (res?.success) setBranchList(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  const getAllUsers = async () => {
    debugger;

    const payload = {
      pageNumber: 1,
      pageSize: 30,
      search: null,
      lockedOnly: false,
    };

    try {
      const res = await GetAllUsers(payload);
      if (res?.success || res?.data?.length > 0) {
        setEmployeelist(res?.data?.items);
        // return res?.data
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  const getAcademicYeardropDown = async () => {
    debugger;
    try {
      const response = await GetAllAcademicYears();
      if (response?.success || response?.data?.length > 0) {
        const data = response?.data?.map((ele) => ({
          name: ele?.yearName,
          code: ele?.id,
        }));
        setAcademicYearlist(data);
        return;
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Error saving reason", "error");
    }
  };

  //   console.log(dropDownSate, "dropDownState");

  const handleSave = async () => {
    try {
      if (!values?.employee?.value)
        return notify("Please select Employee", "error");
      if (!values?.AcademicYear?.length)
        return notify("Please select Academic Year", "error");
      const payload = values?.AcademicYear?.map((ele) => ({
        employeeId: values?.employee?.value,
        employeeName: values?.employee?.label,
        academicYearId: ele?.code,
        orgId: userData?.OrganizationId,
        branchId: userData?.defaultCentre,
      }));
      const res = await MapAcadmicYearWithEmployee(payload);
      if (res?.success) {
        setValues(intialState);
        notify(res?.message, "success");
      } else {
        notify(res?.message || res?.data?.message, "error");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAcademicYeardropDown();
    getAllUsers();
    // AllOrganisation();
  }, []);

  //   useEffect(() => {
  //     if (values?.organisationId) getBranchData();
  //   }, [values?.organisationId])

  return (
    <div className="card">
      <Heading title="Academic Year Mapping With Employees" />
      <div className="row p-2">
        {/* <ReactSelect
          placeholderName={t("Organisation")}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-4 col-12"
          id="organisationId"
          name="organisationId"
          removeIsClearable={true}
          // dynamicOptions={classes}
          dynamicOptions={handleReactSelectDropDownOptions(
            organisation,
            "name",
            "id",
          )}
          handleChange={handleSelect}
          value={values?.organisationId}
          requiredClassName="required-fields"
        />
        <ReactSelect
          placeholderName="Branch"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="branchId"
          // dynamicOptions={branchList}
          dynamicOptions={branchList?.map((ele) => ({
            value: ele.id,
            label: ele.name,
          }))}
          handleChange={handleSelect}
          value={values.branchId}
          className="form-control"
          requiredClassName="required-fields"
        /> */}
        <ReactSelect
          placeholderName={"Employee"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="employee"
          name="employee"
          removeIsClearable={true}
          dynamicOptions={handleReactSelectDropDownOptions(
            employeelist,
            "fullName",
            "id",
          )}
          handleChange={handleSelect}
          value={values?.employee?.value}
          requiredClassName="required-fields"
        />
        <MultiSelectComp
          placeholderName={"Academic Year"}
          //   searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="AcademicYear"
          name="AcademicYear"
          //   removeIsClearable={true}
          dynamicOptions={academicYearlist}
          handleChange={handleSelect}
          value={values?.AcademicYear}
          //   requiredClassName="required-fields"
        />
        <button className="btn btn-sm btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AcademicYearMapping;
