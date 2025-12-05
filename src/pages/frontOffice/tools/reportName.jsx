import React, { useEffect, useState } from 'react'
import { getDropDownOfReportNameApi, getListOfReportNameApi, updateListOfReportRoleMappingApi } from '../../../networkServices/opdserviceAPI'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import ReportTable1 from './ReportTable1';
import ReportTable2 from './ReportTable2';
const ReportName = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    reportName: ""
  })
  const [dropdown, setDropDown] = useState([])
  const [tableData, setTableData] = useState([]);

  const handleAllItemChecked = (e) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data.forEach((ele, _) => {
      ele[name] = checked ? 1 : 0;
    });
    setTableData(data);
  };
  const isMobile = window.innerWidth <= 800;
  const THEAD = [
    { width: "1%", name: t("SNo") },

    {
      width: "1%",
      name: isMobile ? "Checkbox" :
        <input
          type="checkbox"
          name="IsCheck"
          checked={tableData?.every((ele, _) => ele?.IsCheck)}
          onChange={handleAllItemChecked}
        />
    },
    t("Role Name"),

  ]
  const fetchList = async (id) => {
    try {
      const res = await getListOfReportNameApi(id)
      if (res?.success) {
        setTableData(res?.data);
      } else {
        setTableData([])
        notify(res?.message, "error")
      }
    } catch (error) {
      console.log(error, "error");

    }
  }
  const handleReactSelect = (name, value) => {
    debugger
    setValues((val) => ({ ...val, [name]: value }))
    fetchList(value.value)
  }


  const handleBindDropDown = async () => {
    const response = await getDropDownOfReportNameApi();
    if (response?.success) {
      setDropDown(response?.data)
    } else {
      setDropDown([])
    }
  }


  const handleCheckedItem = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked ? 1 : 0;
    setTableData(data);
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
      const { IsCheck, RoleName } = row
      return {
        "s.no": index + 1,

        isChecked: (
          <input
            type="checkbox"
            name="IsCheck"
            checked={IsCheck}
            onChange={(e) => handleCheckedItem(e, index)}
          />
        ),
        role: RoleName,
      }
    })
  }
  const handleSave = async () => {
    debugger
    const data = {
      reportNameId: values?.reportName?.value,
      roleList: tableData?.map((item) => ({
        roleId: item?.RoleId || 0,
        isCheck: item?.IsCheck ? 1 : 0, // convert boolean to 1 or 0
      })) || [],
    }
    const res = await updateListOfReportRoleMappingApi(data)
    if (res?.success) {
      notify(res?.message)
    } else {
      notify(res?.message)
    }
  }
  useEffect(() => {
    handleBindDropDown()
  }, [])

  return (
    <div
     className="card patient_registration border"
     >
      <Heading
        title={t("card patient_registration border")}
        isBreadcrumb={true}
      />
      <div className='row w-full p-1'
      // style={{backgroundColor:"red"}}
      >
        <div className="col-md-6 col-12">
        <ReportTable1/>
        </div>
        <div className="col-md-6 col-12">
        <ReportTable2/>
        </div>
      
      </div>
    </div>
  )
}

export default ReportName;