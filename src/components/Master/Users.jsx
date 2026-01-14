import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Heading from "../../components/UI/Heading";
import { notify } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { GetAllUsers, UsersCreateUser } from "../../networkServices/Admin";
// 👉 apni API import karo
// import { CreateUser, GetUsers } from "../../networkServices/UserMaster";

const Users = () => {
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
  console.log("localData", localData)
  /* =======================
      INITIAL STATE
  ======================== */
  const initialData = {
    userName: "",
    fullName: "",
    email: "",
    password: "Dvs@1234",
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


    try {
      const res = await UsersCreateUser(payload);
      
      if (res?.success) {
        notify(res?.message, "success");
        getAllUsers()
        // setTableData((prev) => [...prev, payload]);
        setValues(initialData);
      } else {
        notify(res?.data?.error || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getAllUsers = async () => {


    const payload = {
      "pageNumber": 1,
      "pageSize": 30,
      "search": null,
      "lockedOnly": false
    }

    try {
      const res = await GetAllUsers(payload);

      // 🔴 demo purpose (remove this block when API ready)
      //   const res = { success: true };

      if (res?.success) {
        notify(res?.message, "success");
        setTableData(res?.data?.items || []);
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
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="fullName"
            value={values.fullName}
            lable="Full Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="email"
            name="email"
            value={values.email}
            lable="Email"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="password"
            value={values.password}
            lable="Password"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">

          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save User
          </button>
          </div>
          {/* <div className="col-12 text-end">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save User
            </button>
          </div> */}
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
            action: <>

              <div
                // className="d-flex align-items-center justify-content-center gap-2"
                className="row gap-2"
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
};

export default Users;
