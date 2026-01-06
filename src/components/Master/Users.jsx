import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Heading from "../../components/UI/Heading";
import { notify } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { UsersCreateUser, UsersGetAllUsers } from "../../networkServices/Admin";
// 👉 apni API import karo
// import { CreateUser, GetUsers } from "../../networkServices/UserMaster";

const Users = () => {
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
console.log("localData",localData)
  /* =======================
      INITIAL STATE
  ======================== */
  const initialData = {
    userName: "",
    fullName: "",
    email: "",
    password: "",
    orgId: localData?.OrganizationId // login se normally
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* =======================
      INPUT HANDLER
  ======================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* =======================
      SAVE USER
  ======================== */
  const handleSave = async () => {
    if (
      !values.userName ||
      !values.fullName ||
      !values.email ||
      !values.password
    ) {
      notify("All fields are required", "error");
      return;
    }

    const payload = {
      userName: values.userName,
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      orgId: values.orgId
    };

    console.log("FINAL USER PAYLOAD 👉", payload);

    try {
      const res = await UsersCreateUser(payload);

      // 🔴 demo purpose (remove this block when API ready)
    //   const res = { success: true };

      if (res?.success) {
        notify(res?.message, "success");
        // setTableData((prev) => [...prev, payload]);
        setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getAllUsers = async () => {
    

    const payload = {
      userName: values.userName,
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      orgId: values.orgId
    };

    try {
      const res = await UsersGetAllUsers(payload);

      // 🔴 demo purpose (remove this block when API ready)
    //   const res = { success: true };

      if (res?.success) {
        notify(res?.message, "success");
        setTableData(res?.data || []);
        setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* =======================
      EDIT USER
  ======================== */
  const handleEdit = (row) => {
    setValues({
      userName: row.userName,
      fullName: row.fullName,
      email: row.email,
      password: "",
      orgId: row.orgId
    });
  };

  /* =======================
      DELETE USER
  ======================== */
  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
    notify("User Deleted", "success");
  };
useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="card p-2">
        <Heading title="User Master" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <Input
            type="text"
            name="userName"
            value={values.userName}
            lable="Username"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
              className="form-control"
          />

          <Input
            type="text"
            name="fullName"
            value={values.fullName}
            lable="Full Name"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
              className="form-control"
          />

          <Input
            type="email"
            name="email"
            value={values.email}
            lable="Email"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
              className="form-control"
          />

          <Input
            type="password"
            name="password"
            value={values.password}
            lable="Password"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <div className="col-12 text-end mt-2">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save User
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Username" },
            { name: "Full Name" },
            { name: "Email" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            userName: item.userName,
            fullName: item.fullName,
            email: item.email,
            action: (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(item)}
                >
                  ✏️
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(index)}
                >
                  🗑️
                </button>
              </div>
            )
          }))}
        />
      </div>
    </>
  );
};

export default Users;
