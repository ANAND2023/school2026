import React, { useEffect, useState } from 'react'
import Input from '../formComponent/Input';
import ReactSelect from '../formComponent/ReactSelect';
import Tables from '../UI/customTable';
import { useSelector } from 'react-redux';
import { MOBILE_NUMBER_VALIDATION_REGX } from '../../utils/constant';
import { filterByType } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { CentreWiseCacheByCenterID } from '../../store/reducers/common/CommonExportFunction';
import { t } from 'i18next';
import Heading from '../UI/Heading';
import { ChangePatientRelationDetail, OPDPatientRelationDetail } from '../../networkServices/opdserviceAPI';
import { notify } from '../../utils/ustil2';
import { Checkbox } from 'primereact/checkbox';

const ChangeIPDRelation = ({ data }) => {

  const { CentreWiseCache } = useSelector(
    (state) => state.CommonSlice
  );

  const [selectedRows, setSelectedRows] = useState([]);
  const [relationData, setRelationData] = useState([]);
  const [relation, setRelation] = useState({
    "RelationOf": "",
    "RelationName": "",
    "RelationPhone": "",
  });

  const handleSelectAll = () => {
    if (selectedRows.length === relationData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(relationData.map((_, index) => index));
    }
  };

  const THEAD = [
    // {
    //   name: (
    //     <Checkbox
    //       checked={selectedRows.length === relationData.length}
    //       onChange={handleSelectAll}

    //     />
    //   ),
    //   width: "1%",
    // },
    { name: t("SNo"), width: "1%" },
    { name: t("RelationOf"), width: "15%" },
    t("RelationName"),
    t("RelationPhone"),
    { name: t("Action"), width: "1%" },
  ];

  const handleCustomInput = async (ind, name, value) => {
    const updated = [...relationData];
    updated[ind][name] = name === "RelationOf" ? value?.value : value;
    setRelationData(updated);
  };

  const handleCheckboxChange = (index) => {
    const updated = [...selectedRows];
    if (updated.includes(index)) {
      setSelectedRows(updated.filter((i) => i !== index));
    } else {
      setSelectedRows([...updated, index]);
    }
  };

  const handleChangRelation = (name, selectedOption) => {
    if (selectedOption) {
      setRelation({ ...relation, RelationOf: selectedOption.value });
    } else {
      setRelation({ ...relation, RelationOf: "" });
    }
  };

  const handleAddRelation = () => {
    if (relation.RelationOf && relation.RelationName) {
      const updatedList = [...relationData, { ...relation }]
      setRelationData(updatedList);
      setRelation({ Relation: "", RelationName: "", RelationPhone: "" });
    }
  };

  const handleDeleteRelation = (index) => {
    const updatedRelations = relationData.filter((_, i) => i !== index);
    setRelationData(updatedRelations);
  };


  const GetRelationData = async (transactionID) => {
    try {
      const response = await OPDPatientRelationDetail(transactionID);
      if (response?.success) {
        setRelationData(response?.data);
      } else {
        setRelationData([]);
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(data, "datadata")

  const HandleSave = async () => {
    // if (selectedRows?.length === 0) {
    //   notify("Please select atleast one row", "warn");
    //   return;
    // }
    debugger
    try {
      const fileterdData = relationData.filter((val, i) => val.RelationOf && val.RelationName);
      const payload = fileterdData.map((val, i) => {
        // const val = relationData[i];
        return {
          patientID: String(data?.patientID),
          patientRelationID: val?.PatientRelationID || 0,
          relationOf: String(val?.RelationOf),
          relationName: String(val?.RelationName),
          relationPhone: String(val?.RelationPhone),
          transactionID: String(data?.transactionID),
        };
      });

      const apiResp = await ChangePatientRelationDetail(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");

      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CentreWiseCacheByCenterID({}))
  }, [])

  useEffect(() => {
    if (data?.transactionID) {
      GetRelationData(data?.transactionID);
    }
  }, [data]);

  return (<>
    <Heading title={t("Change IPD Relation")} secondTitle={(<>

      <button
        onClick={() => {

          if(relationData?.length === 4){
            return notify("You can add only 4 relations", "warn");
          }
          
          setRelationData([...relationData, {
            "RelationOf": "",
            "RelationName": "",
            "RelationPhone": "",
          }])
        }}
        className='btn btn-primary mx-2'
      >{t("Add Relation")}</button>
      <button
        onClick={HandleSave}
        className='btn btn-primary'
      >{t("Save")}</button>

    </>)} />

    <div className='card '>
      {/* <div className='row px-2 pt-2'>
        <ReactSelect
          placeholderName={t("Relation_Of")}
          id="Relation"
          searchable={true}
          name="Relation"
          value={relation?.RelationOf}
          handleChange={handleChangRelation}
          // placeholder=" "
          respclass="col-xl-2 col-md-2 col-sm-4 col-4"
          dynamicOptions={filterByType(
            CentreWiseCache,
            6,
            "TypeID",
            "TextField",
            "ValueField"
          )}
        // isDisabled={isDisableInputs}
        />

        <Input
          type="text"
          className="form-control"
          id="Relation_Name"
          name="RelationName"
          value={relation.RelationName}
          onChange={(e) =>
            setRelation({ ...relation, RelationName: e.target.value })
          }
          lable={t("Relation_Name")}
          placeholder=" "
          respclass="col-xl-2 col-md-2 col-sm-4 col-4"
        // disabled={isDisableInputs}
        />


        <Input
          type="text"
          className="form-control"
          id="Relation_Phone"
          name="RelationPhone"
          value={relation.RelationPhone}
          // onChange={(e) =>
          //   setRelation({ ...relation, RelationPhone: e.target.value })
          // }

          onChange={(e) => {
            const value = e.target.value;
            if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
              setRelation({ ...relation, RelationPhone: value });
            }
          }}
          lable={t("Relation_Phone")}
          placeholder=" "
          respclass="col-xl-2 col-md-2 col-sm-4 col-4"
        // disabled={isDisableInputs}
        />

        <div
          className="col-xl-1 col-md-2 col-sm-4 col-4"
        >
          <button
            className="btn btn-sm btn-primary"
            onClick={handleAddRelation}
            // disabled={isDisableInputs}
            type="button"
          >
            <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
          </button>
        </div>



      </div> */}
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 ">
        <div className="col-xl-12 col-md-12 col-sm-12 col-12">

          {console.log(relationData, "relationData")}

          <Tables
            thead={THEAD}
            tbody={relationData?.map((val, ind) => ({
              // checkBox: (
              //   <Checkbox

              //     checked={selectedRows.includes(ind)}
              //     onChange={() => handleCheckboxChange(ind)}
              //   />
              // ),
              Sno: ind + 1,
              RelationOf: (
                <ReactSelect
                  placeholderName={t("")}
                  id="RelationOf"
                  searchable={true}
                  name="RelationOf"
                  value={val?.RelationOf}
                  handleChange={(name, e) =>
                    handleCustomInput(ind, "RelationOf", e)
                  }
                  placeholder=" "
                  dynamicOptions={filterByType(
                    CentreWiseCache,
                    6,
                    "TypeID",
                    "TextField",
                    "ValueField"
                  )}
                />
              ),
              RelationName: (
                <div style={{ width: "150px" }}>
                  <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    name="RelationName"
                    placeholder=""
                    value={val.RelationName}
                    onChange={(e) =>
                      handleCustomInput(ind, "RelationName", e.target.value)
                    }
                  />
                </div>
              ),
              RelationPhone: (
                <div style={{ width: "150px" }}>
                  <Input
                    type="number"
                    className="table-input"
                    removeFormGroupClass={true}
                    name="RelationPhone"
                    placeholder=""
                    value={val.RelationPhone}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 10);
                      handleCustomInput(ind, "RelationPhone", value);
                    }}

                  />
                </div>
              ),
              delete: (

                <i
                  className="fa fa-trash"
                  onClick={() => handleDeleteRelation(ind)}
                  aria-hidden="true"
                  id="redDeleteColor"

                ></i>

              ),
            }))}
          />



        </div>
      </div>

    </div>
  </>
  )
}

export default ChangeIPDRelation;