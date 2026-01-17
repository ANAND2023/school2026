import React, { useCallback, useEffect, useRef, useState } from "react";
import EasyUI from "../EasyUI/EasyUI";
import { useTranslation } from "react-i18next";
import Input from "../formComponent/Input";
import { BIND_TABLE_STUDENT_SEARCH } from "../../utils/constant";
import { debounce, focusInput } from "../../utils/utils";
import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
import { notify } from "../../utils/ustil2";

const SearchComponent = ({ onClick }) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleSearch = async (value) => {
    const payload = {
      "sessionId": null,
      "branchId": null,
      "classId": null,
      "fromDate": null,
      "toDate": null,
      "studentId": value || null,
      "admissionNo": null,
      "rollNumber": null,
      "firstName": null,
      "page": 1,
      "pageSize": 100
    };

    try {
      const response = await getadmissionlist(payload);
      if (response?.success) {
        setTableData(response?.data);
        const students = response?.data?.map((item) => item?.student);
        setStudentsList(students);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
      setSelectedIndex(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const debouncedHandleSearch = useCallback(
    debounce(handleSearch, 300),
    []
  );

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length > 2) {
      debouncedHandleSearch(value);
    } else {
      setTableData([]);
      setStudentsList([]);
    }
    setValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex !== null && tableData[selectedIndex]) {
        onClick(tableData[selectedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null ? 0 : Math.min(prevIndex + 1, tableData.length - 1);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null ? tableData.length - 1 : Math.max(prevIndex - 1, 0);
        return newIndex;
      });
    }
  };

  useEffect(() => {
    focusInput("studentSearch");
  }, []);

  return (
    <div className="row pt-2 pl-2 pr-2">
      <div className="col-xl-8 col-md-8 col-sm-8 col-12">
        <div style={{ position: "relative" }}>
          <div className="d-flex">
            <Input
              type="text"
              className="form-control"
              id="studentSearch"
              removeFormGroupClass={false}
              name="studentSearch"
              lable={t("Search Student by Admission No / Mobile No / Parent Name")}
              required={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              value={value}
              respclass={"w-100"}
            />
            <div style={{ position: "absolute", right: "0px" }}>
              <label
                style={{
                  border: "1px solid #ced4da",
                  padding: "5px 5px",
                  borderRadius: "3px",
                }}
                onClick={() => inputRef.current.focus()}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
            </div>
          </div>

          {studentsList?.length > 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 99,
                width: "100%",
                top: "25px",
              }}
            >
              <EasyUI
                dataBind={studentsList}
                dataColoum={BIND_TABLE_STUDENT_SEARCH}
                onClick={(rowData, index) => onClick(tableData[index])}
                selectedIndex={selectedIndex}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;