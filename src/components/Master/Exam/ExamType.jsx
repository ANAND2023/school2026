import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import { AcademicMasterget_all_term, CreateExamType, GetAllExamTypes, masterAcademicMastercreate_term } from '../../../networkServices/School/exam';
import { notify } from '../../../utils/ustil2';
import Heading from '../../UI/Heading';
import Input from '../../formComponent/Input';
import Tables from '../../UI/customTable';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import ReactSelect from '../../formComponent/ReactSelect';
import { useSelector } from 'react-redux';

const ExamType = () => {
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );
  const initialData = {
    examTypeName: "",
    weightage: 0,



  };

  const [values, setValues] = useState(initialData);
  const [termName, setTermName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const userData = useLocalStorage("userData", "get");
  const handleSelect = (name, option) => {
    setValues(prev => ({ ...prev, [name]: option }));

  };

  // --- API Calls ---

  const ExamTypesGet = async () => {
    try {
      const response = await GetAllExamTypes();
      // Checking response structure based on your provided JSON
      if (response && Array.isArray(response)) {
        setTableData(response);
      } else if (response?.success && response?.data) {
        setTableData(response.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
      setTableData([]);
    }
  };

  const handleSave = async () => {
    if (!values.termName.trim()) {
      notify(t("Please enter Term Name"), "error");
      return;
    }

    try {
      const payload =

      {
        "examTypeName": values.examTypeName,
        "weightage": values.weightage
      }


      const response = await CreateExamType(payload);

      if (response?.success) {
        notify(response?.message || t("Term saved successfully"), "success");
        setTermName("");
        setIsEditing(false);
        setEditId("");
        ExamTypesGet(); // Refresh table
      } else {
        notify(response?.message || t("Error saving term"), "error");
      }
    } catch (error) {
      console.error(error);
      notify(t("Something went wrong"), "error");
    }
  };

  // --- Handlers ---

  const handleEdit = (item) => {
    setTermName(item.termName);
    setIsEditing(true);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (window.confirm(t("Are you sure you want to delete this term?"))) {
      try {
        // You didn't provide a delete API, but typically it looks like this:
        // const payload = { id: item.id };
        // const response = await AcademicMasterdelete_term(payload);

        // For now, just a notification
        console.log("Delete item:", item);
        notify(t("Delete functionality implementation required"), "info");

        // if (response?.success) ExamTypesGet();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReset = () => {
    setTermName("");
    setIsEditing(false);
    setEditId("");
  };

  // --- Effects ---
  useEffect(() => {
    ExamTypesGet();
  }, []);

  return (
    <>
      {/* --- Section 1: Create Term --- */}
      <div className="card border mb-2">
        <Heading title={t("Create Term")}
        // isBreadcrumb={true}
        />

        <div className="card-body p-2">
          <div className="row align-items-end">

            <Input
              type="text"
              className="form-control"
              id="examTypeName"
              name="examTypeName"
              lable={t("Exam Type Name")}
              value={values.examTypeName}
              // onChange={(e) => setTermName(e.target.value)}
              onChange={(e) => setValues({ ...values, examTypeName: e.target.value })} // Update state(e.target.value)}
              respclass="col-xl-4 col-md-6 col-sm-12 col-12"
              placeholder=" "
            />
            <Input
              type="number"
              className="form-control"
              id="weightage"
              name="weightage"
              lable={t("Weightage")}
              value={values.weightage}

              onChange={(e) => setValues({ ...values, weightage: e.target.value })} // Update state(e.target.value)}
              respclass="col-xl-4 col-md-6 col-sm-12 col-12"
              placeholder=" "
            />


            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
            >
              {isEditing ? t("Update") : t("Save")}
            </button>
            {isEditing && (
              <button
                className="btn btn-sm btn-danger mx-2"
                onClick={handleReset}
              >
                {t("Cancel")}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* --- Section 2: Available Terms Table --- */}
      <div className="card border">
        <Heading title={t("Available Terms")}
        // isBreadcrumb={false}
        />

        <div className="card-body p-2">
          <div className="table-responsive">
            <Tables
              thead={[
                { name: t("S.No"), width: "5%" },
                { name: t("Exam Type Name"), width: "35%" },
                { name: t("weightage"), width: "35%" },
                { name: t("Action"), width: "10%", className: "text-center" }
              ]}
              tbody={tableData.map((item, index) => ({
                "S.No": index + 1,
                "examTypeName": item.examTypeName,
                "weightage": item.weightage??"0",
                "Action": (
                  <div className="text-center">
                    <i
                      className="fa fa-edit text-primary me-2"
                      style={{ cursor: "pointer", fontSize: "16px" }}
                      onClick={() => handleEdit(item)}
                      title={t("Edit")}
                    ></i>
                    <i
                      className="fa fa-trash text-danger"
                      style={{ cursor: "pointer", fontSize: "16px" }}
                      onClick={() => handleDelete(item)}
                      title={t("Delete")}
                    ></i>
                  </div>
                )
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamType;


// import React from 'react'

// const ExamType = () => {
//   return (
//     <div>ExamType</div>
//   )
// }

// export default ExamType;