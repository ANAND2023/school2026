import React, { useEffect, useState } from 'react'
import Input from '../../components/formComponent/Input'
import Heading from '../../components/UI/Heading'
import { t } from 'i18next'
import Tables from '../../components/UI/customTable'
import { LaundryGetLaundryItemMaster, SaveAndUpdateLaundryItemMaster } from '../../networkServices/laundry'
import { notify } from '../../utils/ustil2'

const laundryItemMaster = () => {
  const [item, setItem] = useState("");
  const [isItemUpdate, setIsItemUpdate] = useState(0);
  const [tbodyData, setTBodyData] = useState([]);

  const handleSave = async (isUpdate = 0, isDelete = 1) => {
    debugger

    try {
      let payload = {
        "Id": isUpdate,
        "ItemName": item,
        "IsActive": isDelete
      };
      const res = await SaveAndUpdateLaundryItemMaster(payload);
      if (res?.success) {
        notify(res?.message, "success");
        setIsItemUpdate(0);
        setItem("");
        getData()
      } else {
        notify(res?.message, "error");
      }

    } catch (error) {
      console.log(error)
    }
  }
  const getData = async (isShowNotify = false) => {
    debugger
    try {
      const response = await LaundryGetLaundryItemMaster();
      if (response?.success) {
        setTBodyData(response?.data);
        isShowNotify && notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="patient_registration card">
        <Heading
          title={t("Laundry Item Master")}
          isBreadcrumb={true}
        />
        <div className="row px-2 pt-2 ">
          <Input
            type="text"
            className="form-control required-fields"
            // id="item"
            lable={t("Item Name")}
            placeholder=" "
            required={true}
            value={item}
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="item"
            onChange={(e) => setItem(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key === 'Enter'){
                isItemUpdate ? handleSave(isItemUpdate) : handleSave()
              }
            }}
          />
          <div className="col-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() =>
               isItemUpdate ? handleSave(isItemUpdate) : handleSave()
              }
            >
              {isItemUpdate ? t("Update") : t("Add Item")}
            </button>
          </div>


        </div>
      </div>
      <div className="patient_registration card mt-2">
        <Heading
          title={t("Existing Poly Clinic")}
          isBreadcrumb={false}
        />

        <Tables
          tbody={
           tbodyData && tbodyData?.map((item, ind) => ({
              "S.no": ind + 1,
              "Item Name": item?.ItemName,
              "Update": <i className="fa fa-edit p-2" onClick={() => { 
                setIsItemUpdate(item?.Id); 
                setItem(item?.ItemName);
              }}></i>,
              // "Action": <i className="fa fa-trash text-danger" onClick={() => { 
              //   handleSave(item?.Id,0);
              //   }}></i>,
            }))
          }
          thead={[
            { name: t("S.no"), width: "0.5%" },
            { name: t("Item Name"), width: "10%" },
            { name: t("Update"), width: "1%" },
            // { name: t("Action"), width: "1%" },
          ]}
          tdFontWeight={"bold"}
        />
      </div>

    </>

  )
}

export default laundryItemMaster