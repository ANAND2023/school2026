import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../Heading";

const MedicineReturnTable = ({
  THEAD,
  tbody,
  handleItemsChange,
  handleSelect,
}) => {
  console.log(tbody);
  console.log("handleItemsChange",handleItemsChange)
  const [t] = useTranslation();
  return (
    <>
    {
      tbody?.length>0 && <>
       <Heading title={t("Medicine Return")} />
      <Tables
        thead={THEAD}
        tbody={tbody?.map((ele, index) => ({
          Code: ele?.Code,
          "Item Name": ele?.ItemName,

          AvailQty: ele?.inHandUnits,
          indentQty: ele?.IndentQty,
          Rate: ele?.PerUnitSellingPrice,
          Quantity: (
            <Input
              className="table-input"
              name="quantity"
              removeFormGroupClass={true}
              type="number"
              onChange={(e) =>
                
              {
                debugger
                if(e.target.value > Number(ele?.SoldQty)-Number(ele?.IndentQty)){
                // if(e.target.value > Number(ele?.inHandUnits-ele?.IndentQty)){
                  return;
                }
                
                handleItemsChange(index, "quantity", e.target.value, ele, Number(ele?.inHandUnits))
                // handleItemsChange(index, "quantity", e.target.value, ele, Number(ele?.inHandUnits-ele?.IndentQty))
              }
              }
              value={ele?.quantity}
            />
          ),
          Remarks: (
            <Input
              className="table-input"
              name="Remarks"
              removeFormGroupClass={true}
              type="text"
              onChange={(e) =>
                handleItemsChange(index, "Remarks", e.target.value, ele)
              }
              value={ele?.Remarks}
            />
          ),
          Select: (
            <input
              type="checkbox"
              name="IsChecked"
              checked={ele?.IsChecked || false}
              onChange={(e) => handleSelect(e, index, ele)}
            />
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "120px" }}
      />
      </>
    }
    </>
   
  );
};

export default MedicineReturnTable;
