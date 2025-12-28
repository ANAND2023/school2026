import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Modal from "../../components/modalComponent/Modal";
import { notify } from "../../utils/utils";
import { CreateBranch, Createorganisation, GetAllBranches, GetAllOrganisation } from "../../networkServices/AcademicYear";
import Input from "../formComponent/Input";

function OrganizationMaster() {
  const [t] = useTranslation();

  /* ================= INITIAL DATA (BACKEND PAYLOAD) ================= */
  const initialData = {
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
    noOfBranch: "",
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
    try {
      const res = await GetAllOrganisation();
      if (res?.success) setTableData(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  useEffect(() => {
    // getData();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const payload = {
      ...values,
      establishedYear: Number(values.establishedYear),
      noOfBranch: Number(values.noOfBranch),
    };

    try {
      const res = await Createorganisation(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving organization", "error");
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
        <Heading title={t("Organization Master")} isBreadcrumb={false} />

        <div className="row p-2">
          {/* ===== BASIC ===== */}
          <Input
            // className="form-control"
            className="form-control required-fields"
            name="name"
            value={values.name}
            lable="Organization Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          {/* ===== ADDRESS ===== */}
          <Input
            className="form-control" name="street" value={values.address.street} lable="Street"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")}
          />

          <Input
            className="form-control" name="city" value={values.address.city} lable="City"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")}
          />

          <Input
            className="form-control" name="state" value={values.address.state} lable="State"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")}
          />

          <Input
            className="form-control" name="zipCode" value={values.address.zipCode} lable="Zip Code"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")}
          />

          <Input
            className="form-control" name="country" value={values.address.country} lable="Country"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "address")}
          />

          {/* ===== CONTACT ===== */}
          <Input
            className="form-control" name="phoneNumber" value={values.contact.phoneNumber} lable="Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")}
          />

          <Input
            className="form-control" name="email" value={values.contact.email} lable="Email"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "contact")}
          />

          {/* ===== LOCATION ===== */}
          <Input
            className="form-control" name="latitude" value={values.location.latitude} lable="Latitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")}
          />

          <Input
            className="form-control" name="longitude" value={values.location.longitude} lable="Longitude"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "location")}
          />

          {/* ===== OWNER ===== */}
          <Input
            className="form-control" name="ownerName" value={values.ownerName} lable="Owner Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control" name="phoneNumber" value={values.ownerContact.phoneNumber} lable="Owner Phone"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "ownerContact")}
          />

          {/* ===== OTHER ===== */}
          <Input
            className="form-control" name="certification" value={values.certification} lable="Certification"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control" type="number" name="establishedYear" value={values.establishedYear}
            lable="Established Year"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control" type="number" name="noOfBranch" value={values.noOfBranch}
            lable="No Of Branch"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          {/* ===== BUTTON ===== */}
          <div className="col-12 text-right">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              {t("Save Organization")}
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <Tables
          thead={[{ name: "Organization" }, { name: "Action" }]}
          tbody={tableData?.map((item) => ({
            Organization: item?.name,
            action: (
              <div className="row gap-2">
                <button className="btn btn-sm">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-sm">
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
}

export default OrganizationMaster;
