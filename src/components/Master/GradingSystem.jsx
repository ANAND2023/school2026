import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Heading from "../../components/UI/Heading";
import { notify } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { CreateGradingSystem, GetAllGradingSystems } from "../../networkServices/AcademicYear";
// 👉 apni API import karo
// import { CreateUser, GetUsers } from "../../networkServices/UserMaster";

const GradingSystem = () => {
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
  console.log("localData", localData)
  /* =======================
      INITIAL STATE
  ======================== */
  const initialData = {
    gradeName: "",
    minPercentage: "",
    maxPercentage: "",
    Remark: "",
   
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
      !values.gradeName ||
      !values.minPercentage ||
      !values.maxPercentage 
     
    ) {
      notify("All fields are required", "error");
      return;
    }

    const payload = 
    
    {
  "gradeName":values?.gradeName,
  "minPercentage": values?.minPercentage,
  "maxPercentage": values?.maxPercentage,
  "remark": values?.Remark
}



    try {
      const res = await CreateGradingSystem(payload);
      
      if (res?.success) {
        notify(res?.message, "success");
        getGrading()
        // setTableData((prev) => [...prev, payload]);
        setValues(initialData);
      } else {
        notify(res?.data?.error || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getGrading = async () => {
    try {
      const res = await GetAllGradingSystems();
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
    getGrading();
  }, []);
  return (
    <>
      <div className="card p-2">
        <Heading title="User Master" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <Input
            type="text"
            name="gradeName"
            value={values.gradeName}
            lable="Grade Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="number"
            name="minPercentage"
            value={values.minPercentage}
            lable="Min Percentage"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="number"
            name="maxPercentage"
            value={values.maxPercentage}
            lable="Max Percentage"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />
          <Input
            type="text"
            name="Remark"
            value={values.Remark}
            lable="Max Percentage"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            className="form-control"
          />

          
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save 
          </button>
          {/* <div className="col-12 text-end">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save User
            </button>
          </div> */}
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Grade Name" },
            { name: "Min Percentage" },
            { name: "Max Percentage" },
            { name: "Remark" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            gradeName: item.gradeName,
            minPercentage: item.minPercentage,
            maxPercentage: item.maxPercentage,
            remark: item.remark,
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

export default GradingSystem;
