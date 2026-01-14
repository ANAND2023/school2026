

import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";

import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Modal from "../../components/modalComponent/Modal";
import { notify } from "../../utils/utils";
import { CreateBranch, GetAllBranches } from "../../networkServices/AcademicYear";
import Input from "../formComponent/Input";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

function Branch() {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    OrganizationId: "5bbf859d-9907-4117-aead-c260d030d335",
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
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

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

  /* ================= API ================= */
  const getData = async () => {
    const payload = {
      "employeeId": "",
      "organisationID": localData?.OrganizationId,
      "isAll": 1
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

          <Input
            className="form-control required-fields"
            name="organisationId" value={localData.OrganizationId} lable="Organisation Id"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} 
            disabled={true}
            />

          <Input
            className="form-control required-fields"
            name="name" value={values.name} lable="Branch Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          {/* ===== ADDRESS ===== */}
          <Input
            className="form-control "
            name="street" value={values.address.street} lable="Street"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control"
            name="city" value={values.address.city} lable="City"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control"
            name="state" value={values.address.state} lable="State"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control"
            name="zipCode" value={values.address.zipCode} lable="Zip Code"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          <Input
            className="form-control"
            name="country" value={values.address.country} lable="Country"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")} />

          {/* ===== CONTACT ===== */}
          <Input
            className="form-control"
            name="phoneNumber" value={values.contact.phoneNumber} lable="Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          <Input
            className="form-control"
            name="email" value={values.contact.email} lable="Email"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")} />

          {/* ===== LOCATION ===== */}
          <Input
            className="form-control"
            name="latitude" value={values.location.latitude} lable="Latitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          <Input
            className="form-control "
            name="longitude" value={values.location.longitude} lable="Longitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")} />

          {/* ===== OWNER ===== */}
          <Input
            className="form-control "
            name="ownerName" value={values.ownerName} lable="Owner Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" onChange={handleChange} />

          <Input
            className="form-control"
            name="phoneNumber" value={values.ownerContact.phoneNumber} lable="Owner Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "ownerContact")} />

          {/* ===== OTHER ===== */}
          <Input
            className="form-control"
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

