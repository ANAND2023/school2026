

import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";

import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Modal from "../../components/modalComponent/Modal";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import { CreateBranch, GetAllBranches, GetAllOrganisation } from "../../networkServices/AcademicYear";
import Input from "../formComponent/Input";
import ReactSelect from "../formComponent/ReactSelect";

function Branch() {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    organisationId: "",
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contact: {
      phoneNumber: "",
      email: "",
      faxNumber: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
    ownerName: "",
    ownerContact: {
      phoneNumber: "",
      email: "",
      faxNumber: "",
    },
    certification: "",
    establishedYear: "",
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [organisation, setOrganisation] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  console.log("values", values);
  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e, parent = null) => {
    const { name, value } = e.target;

    if (parent) {
      setValues((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value,
        },
      }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
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

  useEffect(() => {
    AllOrganisation();
  }, []);
  /* ================= API ================= */
  const getData = async (ID) => {
    const payload = {
      "employeeId": "",
      "organisationID": values?.organisationId ?? ID,
      "isAll": 0
    }
    try {
      const res = await GetAllBranches(payload);
      if (res?.success) setTableData(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    try {
      if (!values.name) return notify("Brnach Name is required", "error");
      if (!values.establishedYear) return notify("Established Year is required", "error");
      const res = await CreateBranch(values);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else notify(res?.message, "error");
    } catch {
      notify("Error saving branch", "error");
    }
  };

  const setIsOpen = () => {
    setHandleModelData((v) => ({ ...v, isOpen: false }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value?.value }));
    // getData(value?.value)
  };

  /* ================= JSX ================= */
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          modalData={modalData}
          setModalData={setModalData}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Branch Master")} isBreadcrumb={false} />

        <div className="row p-2">
          {/* organisation */}
          <ReactSelect
            placeholderName={t("Organisation")}
            searchable={true}
            respclass="col-xl-4 col-md-4 col-sm-4 col-12"
            id="organisationId"
            name="organisationId"
            removeIsClearable={true}
            // dynamicOptions={classes}
            dynamicOptions={handleReactSelectDropDownOptions(organisation, "name", "id")}
            handleChange={handleSelect}
            value={values?.organisationId}
            requiredClassName="required-fields"
          />
          {/* <Input
            className="form-control required-fields"
            name="organisationId" value={values.organisationId} lable="Organisation Id"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} /> */}

          <Input
            className="form-control required-fields"
            name="name" value={values.name} lable="Branch Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          {/* ===== ADDRESS ===== */}
          <Input
            className="form-control required-fields"
            name="street" value={values.address.street} lable="Street"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control required-fields"
            name="city" value={values.address.city} lable="City"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control required-fields"
            name="state" value={values.address.state} lable="State"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control"
            name="zipCode" value={values.address.zipCode} lable="Zip Code"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control required-fields"
            name="country" value={values.address.country} lable="Country"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          {/* ===== CONTACT ===== */}
          <Input
            className="form-control required-fields"
            name="phoneNumber" value={values.contact.phoneNumber} lable="Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          <Input
            className="form-control required-fields"
            name="email" value={values.contact.email} lable="Email"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          {/* ===== LOCATION ===== */}
          <Input
            className="form-control required-fields"
            name="latitude" value={values.location.latitude} lable="Latitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          <Input
            className="form-control required-fields"
            name="longitude" value={values.location.longitude} lable="Longitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          {/* ===== OWNER ===== */}
          <Input
            className="form-control required-fields"
            name="ownerName" value={values.ownerName} lable="Owner Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input
            className="form-control required-fields"
            name="phoneNumber" value={values.ownerContact.phoneNumber} lable="Owner Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "ownerContact")} />

          {/* ===== OTHER ===== */}
          <Input
            className="form-control required-fields"
            name="certification" value={values.certification} lable="Certification"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input
            className="form-control required-fields"
            type="number" name="establishedYear" value={values.establishedYear}
            lable="Established Year"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          {/* ===== BUTTON ===== */}
          <div className="col-12 text-right">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              {t("Save Branch")}
            </button>
          </div>
        </div>

        <Tables
          thead={[
            { name: "Name" },

            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            name: item.name,

            action: <>

              <div
                className="d-flex align-items-center justify-content-center gap-2"
              // className="row gap-2"
              >
                <button
                  id="editBtn"
                  onclick="handleEdit(item.id)"
                  title="Edit"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i class=" bi-pencil-square"></i>
                </button>

                <button
                  id="deleteBtn"
                  onclick="handleDelete(item.id)"
                  title="Delete"
                >
                  <i class="bi-trash3"></i>
                </button>
              </div>

            </>,
          }))}
        />
      </div>
    </>
  );
}

export default Branch;

